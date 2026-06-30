/**
 * import-ai-cost — Boekt een AI-/SaaS-factuur in de ZZP-boekhouding.
 *
 * Bedoeld voor server-to-server gebruik door de geplande taak `ai-kosten-boeken`,
 * die de factuurmails van Mistral / Anthropic (Claude) / OpenAI (Codex) uit Gmail
 * leest en per factuur deze function aanroept.
 *
 * Beveiliging (deze function is `verify_jwt=false`, dus deploy met --no-verify-jwt):
 * - Geheime header `X-Import-Secret` moet exact gelijk zijn aan env `IMPORT_AI_COST_SECRET`.
 *   Ontbreekt de env of mismatcht de header -> 401. Fail closed.
 * - Schrijft UITSLUITEND in de boekhouding van een vaste gebruiker (env `ACCOUNTANT_USER_ID`).
 * - Doet alleen INSERTs (nooit lezen/teruggeven van bestaande data, nooit verwijderen).
 *
 * Boeking (zelfde patroon als de hand-flow in ReceiptsPanel.tsx):
 * - 1 rij in `accountant_receipts` met `vat_rate=0` -> telt als VERLEGDE BTW
 *   (buitenlandse SaaS) in `getBTWQuarterlyOverview` (amount x 0,21).
 * - 1 rij in `accountant_transactions` met negatief bedrag -> telt als zakelijke
 *   uitgave in `getYearSummary` / belastingberekening.
 *
 * Idempotent: bestaat er al een transactie met (user_id, bank_reference=invoiceNumber)
 * dan wordt niets geboekt (geen dubbele kosten bij herhaalde runs).
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Server-to-server endpoint (curl negeert CORS). Geen wildcard conform supabase/CLAUDE.md;
// vaste productie-origin volstaat — beveiliging loopt via de X-Import-Secret header.
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': 'https://dgskills.app',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-import-secret',
};

const JSON_HEADERS = { ...CORS_HEADERS, 'Content-Type': 'application/json' };

const VALID_VAT_RATES = new Set([0, 9, 21]);
const VALID_CATEGORIES = new Set([
    'kantoorkosten', 'reiskosten', 'marketing', 'automatisering',
    'opleiding', 'telefoon-internet', 'representatie', 'overig',
]);

interface ImportPayload {
    supplier?: unknown;
    invoiceNumber?: unknown;
    issueDate?: unknown;
    amount?: unknown;
    description?: unknown;
    category?: unknown;
    vatRate?: unknown;
    vatAmount?: unknown;
    source?: unknown;
}

/** Verwijdert control-tekens en normaliseert witruimte; kapt af op maxLen. */
function clean(input: unknown, maxLen: number): string {
    const str = String(input ?? '');
    let out = '';
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        out += (code < 32 || code === 127) ? ' ' : str[i];
    }
    return out.replace(/\s+/g, ' ').trim().slice(0, maxLen);
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: CORS_HEADERS });
    }
    if (req.method !== 'POST') {
        return jsonResponse({ error: 'Alleen POST toegestaan.' }, 405);
    }

    // --- Auth: gedeeld geheim ---
    const expectedSecret = Deno.env.get('IMPORT_AI_COST_SECRET');
    const providedSecret = req.headers.get('x-import-secret');
    if (!expectedSecret || providedSecret !== expectedSecret) {
        return jsonResponse({ error: 'Niet geautoriseerd.' }, 401);
    }

    const userId = Deno.env.get('ACCOUNTANT_USER_ID');
    if (!userId) {
        console.error('[import-ai-cost] ACCOUNTANT_USER_ID ontbreekt.');
        return jsonResponse({ error: 'Serverconfiguratie onvolledig.' }, 500);
    }

    // --- Body parsen + valideren ---
    let body: ImportPayload;
    try {
        body = await req.json();
    } catch {
        return jsonResponse({ error: 'Ongeldige JSON.' }, 400);
    }

    const supplier = clean(body.supplier, 200);
    const invoiceNumber = clean(body.invoiceNumber, 200);
    const issueDate = clean(body.issueDate, 10);
    const source = clean(body.source, 50) || 'ai-billing';

    if (!supplier) return jsonResponse({ error: 'supplier is verplicht.' }, 400);
    if (!invoiceNumber) return jsonResponse({ error: 'invoiceNumber is verplicht (idempotentie-sleutel).' }, 400);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(issueDate)) return jsonResponse({ error: 'issueDate moet YYYY-MM-DD zijn.' }, 400);

    // Vereis een numeriek JSON-bedrag: een gelokaliseerde string als "12,50" of "1.234,56"
    // zou door parseFloat verminkt worden tot een verkeerd bedrag (€12 i.p.v. €12,50).
    const rawAmount = body.amount;
    if (typeof rawAmount !== 'number' || !Number.isFinite(rawAmount) || rawAmount <= 0) {
        return jsonResponse({ error: 'amount moet een positief JSON-getal zijn (geen string).' }, 400);
    }
    const roundedAmount = Math.round(rawAmount * 100) / 100;

    const vatRate = body.vatRate === undefined ? 0 : Number(body.vatRate);
    if (!VALID_VAT_RATES.has(vatRate)) return jsonResponse({ error: 'vatRate moet 0, 9 of 21 zijn.' }, 400);

    // BTW-bedrag bij een belast tarief (9/21): afleiden uit het bruto bedrag als het ontbreekt,
    // anders zou de voorbelasting in het BTW-overzicht ten onrechte op 0 staan.
    let vatAmount: number;
    const rawVat = body.vatAmount;
    if (rawVat === undefined) {
        vatAmount = vatRate > 0 ? Math.round((roundedAmount * vatRate / (100 + vatRate)) * 100) / 100 : 0;
    } else if (typeof rawVat === 'number' && Number.isFinite(rawVat) && rawVat >= 0) {
        vatAmount = Math.round(rawVat * 100) / 100;
    } else {
        return jsonResponse({ error: 'vatAmount moet een getal >= 0 zijn (geen string).' }, 400);
    }
    if (vatRate > 0 && vatAmount <= 0) {
        return jsonResponse({ error: 'vatAmount moet > 0 zijn bij vatRate 9 of 21.' }, 400);
    }

    const cleanedCategory = clean(body.category, 40);
    const category = VALID_CATEGORIES.has(cleanedCategory) ? cleanedCategory : 'automatisering';
    const extraDescription = clean(body.description, 200);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) {
        console.error('[import-ai-cost] Supabase env ontbreekt.');
        return jsonResponse({ error: 'Serverconfiguratie onvolledig.' }, 500);
    }
    const supabase = createClient(supabaseUrl, serviceKey);

    try {
        // --- Idempotentie: al geboekt? Gescoped per leverancier via imported_from,
        //     zodat hetzelfde factuurnummer bij twee providers niet ten onrechte botst. ---
        const { data: existing, error: checkError } = await supabase
            .from('accountant_transactions')
            .select('id')
            .eq('user_id', userId)
            .eq('bank_reference', invoiceNumber)
            .eq('imported_from', source)
            .limit(1);

        if (checkError) {
            console.error('[import-ai-cost] Idempotentie-check faalde:', checkError.message);
            return jsonResponse({ error: 'Databasefout.' }, 500);
        }
        if (existing && existing.length > 0) {
            return jsonResponse({ skipped: true, reason: 'already_imported', invoiceNumber });
        }

        // --- 1. Receipt (verlegde BTW bij vat_rate=0) ---
        const receiptDescription = [`Factuur ${invoiceNumber}`, extraDescription].filter(Boolean).join(' — ');
        const { data: receipt, error: receiptError } = await supabase
            .from('accountant_receipts')
            .insert({
                user_id: userId,
                supplier,
                date: issueDate,
                amount: roundedAmount,
                vat_amount: vatAmount,
                vat_rate: vatRate,
                description: receiptDescription,
                category,
                ai_scanned: false,
            })
            .select('id')
            .single();

        if (receiptError) {
            console.error('[import-ai-cost] Receipt insert faalde:', receiptError.message);
            return jsonResponse({ error: 'Bonnetje opslaan mislukt.' }, 500);
        }

        // --- 2. Transactie (uitgave = negatief bedrag) ---
        const txDescription = [`${supplier} — factuur ${invoiceNumber}`, extraDescription].filter(Boolean).join(' — ');
        const { data: transaction, error: txError } = await supabase
            .from('accountant_transactions')
            .insert({
                user_id: userId,
                date: issueDate,
                amount: -roundedAmount,
                description: txDescription,
                category,
                bank_reference: invoiceNumber,
                imported_from: source,
                receipt_id: receipt?.id ?? null,
            })
            .select('id')
            .single();

        if (txError) {
            console.error('[import-ai-cost] Transactie insert faalde:', txError.message);
            // Receipt is al aangemaakt; rol 'm terug zodat de import opnieuw kan draaien.
            if (receipt?.id) {
                await supabase.from('accountant_receipts').delete().eq('id', receipt.id);
            }
            return jsonResponse({ error: 'Transactie aanmaken mislukt.' }, 500);
        }

        return jsonResponse({
            imported: true,
            invoiceNumber,
            supplier,
            amount: roundedAmount,
            date: issueDate,
            category,
            vatRate,
            transactionId: transaction?.id,
            receiptId: receipt?.id,
        });
    } catch (err) {
        console.error('[import-ai-cost] Onverwachte fout:', err instanceof Error ? err.message : String(err));
        return jsonResponse({ error: 'Er ging iets mis.' }, 500);
    }
});
