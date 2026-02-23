/**
 * Accountant Service — ZZP boekhoudmodule
 *
 * Biedt functies voor:
 * - Transacties (CRUD + CSV-bankimport)
 * - Bonnetjes (upload naar Storage + Gemini Vision scan)
 * - Jaaroverzicht voor belastingaangifte (IB Box 1 ZZP)
 * - Instellingen (KvK, bedrijfsnaam, startersaftrek)
 */

import { supabase, EDGE_FUNCTION_URL } from './supabase';

// De nieuwe accountant-tabellen zitten nog niet in de auto-gegenereerde database.types.ts.
// Na het uitvoeren van de migratie kunnen de types gegenereerd worden via:
//   supabase gen types typescript --project-id <id>
// Tot die tijd gebruiken we een untyped helper voor deze tabellen.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ===========================================================================
// Types
// ===========================================================================

export type TransactionCategory =
    | 'omzet'
    | 'subsidie'
    | 'overig-inkomen'
    | 'kantoorkosten'
    | 'reiskosten'
    | 'marketing'
    | 'automatisering'
    | 'opleiding'
    | 'telefoon-internet'
    | 'representatie'
    | 'overig';

export const INCOME_CATEGORIES: TransactionCategory[] = ['omzet', 'subsidie', 'overig-inkomen'];
export const EXPENSE_CATEGORIES: TransactionCategory[] = [
    'kantoorkosten', 'reiskosten', 'marketing', 'automatisering',
    'opleiding', 'telefoon-internet', 'representatie', 'overig'
];

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
    'omzet':             'Omzet / Facturen',
    'subsidie':          'Subsidies & Toeslagen',
    'overig-inkomen':    'Overig Inkomen',
    'kantoorkosten':     'Kantoorkosten',
    'reiskosten':        'Reiskosten',
    'marketing':         'Marketing & Reclame',
    'automatisering':    'Software & Hardware',
    'opleiding':         'Opleidingen & Cursussen',
    'telefoon-internet': 'Telefoon & Internet',
    'representatie':     'Representatiekosten',
    'overig':            'Overige Kosten',
};

export interface AccountantTransaction {
    id?: string;
    user_id: string;
    date: string;                    // ISO date: YYYY-MM-DD
    amount: number;                  // + = inkomst, - = uitgave
    description: string;
    category: TransactionCategory;
    bank_reference?: string;
    imported_from?: 'ing' | 'rabobank' | 'abn' | 'manual';
    receipt_id?: string;
    is_private?: boolean;            // Privé-uitgave (niet aftrekbaar)
    km_distance?: number;            // Kilometer voor reiskosten (€0,23/km)
    created_at?: string;
}

export interface AccountantReceipt {
    id?: string;
    user_id: string;
    image_url?: string;
    supplier?: string;
    date: string;
    amount: number;
    vat_amount: number;
    vat_rate: 0 | 9 | 21;
    description?: string;
    category: TransactionCategory;
    ai_scanned: boolean;
    created_at?: string;
}

export interface AccountantSettings {
    id?: string;
    user_id: string;
    tax_year: number;
    kvk_number?: string;
    business_name?: string;
    starter_aftrek: boolean;
    updated_at?: string;
}

export interface ScannedReceiptData {
    supplier: string;
    date: string;
    amount: number;
    vatAmount: number;
    vatRate: 0 | 9 | 21;
    description: string;
    category: TransactionCategory;
}

export interface YearSummary {
    year: number;
    totalIncome: number;
    totalExpenses: number;
    profit: number;
    vatCollected: number;
    vatPaid: number;
    vatBalance: number;
    byCategory: Record<string, number>;
    byMonth: { month: number; income: number; expenses: number }[];
}

export interface TaxCalculation {
    grossIncome: number;
    totalExpenses: number;
    profit: number;
    zelfstandigenaftrek: number;
    startersaftrek: number;
    mkbWinstvrijstelling: number;
    taxableIncome: number;
    estimatedTax: number;
    effectiveRate: number;
}

// ===========================================================================
// Belastingconstanten 2025 (IB Box 1 ZZP)
// ===========================================================================

const TAX_2025 = {
    zelfstandigenaftrek: 5030,
    startersaftrek:      2123,
    mkbWinstvrijstelling: 0.1331,  // 13,31%
    bracket1Rate: 0.3697,          // 36,97% tot €76.814
    bracket1Limit: 76814,
    bracket2Rate: 0.495,           // 49,50% daarboven
} as const;

// ===========================================================================
// Transacties
// ===========================================================================

export async function getTransactions(userId: string, year: number): Promise<AccountantTransaction[]> {
    const startDate = `${year}-01-01`;
    const endDate   = `${year}-12-31`;

    const { data, error } = await db
        .from('accountant_transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

    if (error) throw new Error(`Transacties ophalen mislukt: ${error.message}`);
    return (data || []) as AccountantTransaction[];
}

export async function createTransaction(tx: Omit<AccountantTransaction, 'id' | 'created_at'>): Promise<AccountantTransaction> {
    const { data, error } = await db
        .from('accountant_transactions')
        .insert(tx)
        .select()
        .single();

    if (error) throw new Error(`Transactie aanmaken mislukt: ${error.message}`);
    return data as AccountantTransaction;
}

export async function updateTransaction(id: string, updates: Partial<AccountantTransaction>): Promise<void> {
    const { error } = await db
        .from('accountant_transactions')
        .update(updates)
        .eq('id', id);

    if (error) throw new Error(`Transactie bijwerken mislukt: ${error.message}`);
}

export async function deleteTransaction(id: string): Promise<void> {
    const { error } = await db
        .from('accountant_transactions')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Transactie verwijderen mislukt: ${error.message}`);
}

// ===========================================================================
// CSV Bank Import
// ===========================================================================

/**
 * Parseert Nederlandse komma als decimaalscheidingsteken: "12,50" → 12.5
 */
function parseDutchAmount(raw: string): number {
    return parseFloat(raw.replace(/\./g, '').replace(',', '.')) || 0;
}

/**
 * Converteert een datum-string van verschillende bankformaten naar YYYY-MM-DD.
 * ING: YYYYMMDD | Rabobank: YYYY-MM-DD | ABN: YYYYMMDD
 */
function parseDate(raw: string): string {
    const cleaned = raw.trim().replace(/['"]/g, '');
    if (/^\d{8}$/.test(cleaned)) {
        return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(cleaned)) {
        return cleaned.slice(0, 10);
    }
    return cleaned;
}

interface ParsedCSVRow {
    date: string;
    amount: number;
    description: string;
    reference: string;
}

function parseINGCsv(content: string): ParsedCSVRow[] {
    const lines = content.split('\n').filter(l => l.trim());
    const rows: ParsedCSVRow[] = [];

    // Sla de header over
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(';').map(c => c.replace(/^"|"$/g, '').trim());
        if (cols.length < 8) continue;

        const datum       = cols[0];  // YYYYMMDD
        const naam        = cols[1];  // Naam / Omschrijving
        const afBij       = cols[5];  // "Af" of "Bij"
        const bedragStr   = cols[6];  // Bedrag (EUR)
        const mededelingen = cols[8] || '';

        const rawAmount = parseDutchAmount(bedragStr);
        const amount = afBij.toLowerCase() === 'af' ? -rawAmount : rawAmount;

        rows.push({
            date: parseDate(datum),
            amount,
            description: mededelingen || naam,
            reference: cols[4] || '',
        });
    }
    return rows;
}

function parseRabobankCsv(content: string): ParsedCSVRow[] {
    const lines = content.split('\n').filter(l => l.trim());
    const rows: ParsedCSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
        if (cols.length < 7) continue;

        const datum      = cols[4];   // Datum (YYYY-MM-DD)
        const bedragStr  = cols[6];   // Bedrag (kan negatief zijn)
        const omschrijving = cols[19] || cols[9] || '';
        const naam       = cols[9] || '';

        rows.push({
            date: parseDate(datum),
            amount: parseDutchAmount(bedragStr),
            description: omschrijving || naam,
            reference: cols[15] || '',
        });
    }
    return rows;
}

function parseABNCsv(content: string): ParsedCSVRow[] {
    const lines = content.split('\n').filter(l => l.trim());
    const rows: ParsedCSVRow[] = [];

    // Begin bij index 1 om de headerregel over te slaan
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split('\t').map(c => c.trim());
        if (cols.length < 8) continue;

        const datum     = cols[2];    // Transactiedatum
        const bedrag    = cols[6];    // Bedrag
        const omschrijving = cols[7] || '';

        rows.push({
            date: parseDate(datum),
            amount: parseDutchAmount(bedrag),
            description: omschrijving,
            reference: cols[4] || '',
        });
    }
    return rows;
}

function guessCategory(description: string): TransactionCategory {
    const d = description.toLowerCase();
    if (d.includes('albert heijn') || d.includes('jumbo') || d.includes('lidl') || d.includes('kantoor'))
        return 'kantoorkosten';
    if (d.includes('ov-chipkaart') || d.includes('ns ') || d.includes('parkeer') || d.includes('benzine') || d.includes('trein'))
        return 'reiskosten';
    if (d.includes('microsoft') || d.includes('google') || d.includes('adobe') || d.includes('aws') || d.includes('hosting'))
        return 'automatisering';
    if (d.includes('vodafone') || d.includes('kpn') || d.includes('t-mobile') || d.includes('ziggo') || d.includes('internet'))
        return 'telefoon-internet';
    if (d.includes('cursus') || d.includes('opleiding') || d.includes('training') || d.includes('udemy'))
        return 'opleiding';
    if (d.includes('facebook') || d.includes('google ads') || d.includes('meta') || d.includes('linkedin'))
        return 'marketing';
    return 'overig';
}

export async function importBankCSV(
    file: File,
    bank: 'ing' | 'rabobank' | 'abn' | 'generic',
    userId: string,
): Promise<{ imported: number; skipped: number }> {
    const content = await file.text();
    let rows: ParsedCSVRow[] = [];

    if (bank === 'ing')         rows = parseINGCsv(content);
    else if (bank === 'rabobank') rows = parseRabobankCsv(content);
    else if (bank === 'abn')    rows = parseABNCsv(content);
    else {
        // Generic: probeer kommagescheiden met kolommen datum,bedrag,omschrijving
        const lines = content.split('\n').filter(l => l.trim());
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length < 3) continue;
            rows.push({
                date: parseDate(cols[0]),
                amount: parseDutchAmount(cols[1]),
                description: cols[2] || '',
                reference: '',
            });
        }
    }

    if (rows.length === 0) return { imported: 0, skipped: 0 };

    const importedFrom = bank === 'generic' ? undefined : bank;
    const transactions = rows.map(r => ({
        user_id:       userId,
        date:          r.date,
        amount:        r.amount,
        description:   r.description,
        category:      guessCategory(r.description),
        bank_reference: r.reference || undefined,
        imported_from: importedFrom,
    } as Omit<AccountantTransaction, 'id' | 'created_at'>));

    // Deduplicatie: haal bestaande bank_references op en sla duplicaten over
    const references = transactions
        .map(tx => tx.bank_reference)
        .filter((ref): ref is string => Boolean(ref));

    let existingRefs = new Set<string>();
    if (references.length > 0) {
        const { data: existing } = await db
            .from('accountant_transactions')
            .select('bank_reference')
            .eq('user_id', userId)
            .in('bank_reference', references);
        existingRefs = new Set(
            (existing || []).map((r: { bank_reference: string }) => r.bank_reference).filter(Boolean)
        );
    }

    const toInsert = transactions.filter(tx =>
        !tx.bank_reference || !existingRefs.has(tx.bank_reference)
    );
    const skipped = transactions.length - toInsert.length;

    if (toInsert.length === 0) return { imported: 0, skipped: transactions.length };

    const { error } = await db
        .from('accountant_transactions')
        .insert(toInsert);

    if (error) throw new Error(`CSV importeren mislukt: ${error.message}`);

    return { imported: toInsert.length, skipped };
}

// ===========================================================================
// Bonnetjes
// ===========================================================================

export async function getReceipts(userId: string, year: number): Promise<AccountantReceipt[]> {
    const { data, error } = await db
        .from('accountant_receipts')
        .select('*')
        .eq('user_id', userId)
        .gte('date', `${year}-01-01`)
        .lte('date', `${year}-12-31`)
        .order('date', { ascending: false });

    if (error) throw new Error(`Bonnetjes ophalen mislukt: ${error.message}`);
    return (data || []) as AccountantReceipt[];
}

export async function uploadAndScanReceipt(
    file: File,
    userId: string,
): Promise<ScannedReceiptData> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error('Authenticatie vereist.');

    // Converteer naar base64
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array  = new Uint8Array(arrayBuffer);
    const base64      = btoa(String.fromCharCode(...uint8Array));
    const mimeType    = file.type || 'image/jpeg';

    // Stuur naar edge function
    const response = await fetch(`${EDGE_FUNCTION_URL}/scanReceipt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Bonnetje scannen mislukt.');
    }

    const data = await response.json();
    return data.result as ScannedReceiptData;
}

export async function uploadReceiptImage(file: File, userId: string): Promise<string> {
    const ext  = file.name.split('.').pop() || 'jpg';
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
        .from('receipts')
        .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) throw new Error(`Bestand uploaden mislukt: ${error.message}`);

    const { data } = supabase.storage.from('receipts').getPublicUrl(path);
    return data.publicUrl;
}

export async function saveReceipt(receipt: Omit<AccountantReceipt, 'id' | 'created_at'>): Promise<AccountantReceipt> {
    const { data, error } = await db
        .from('accountant_receipts')
        .insert(receipt)
        .select()
        .single();

    if (error) throw new Error(`Bonnetje opslaan mislukt: ${error.message}`);
    return data as AccountantReceipt;
}

export async function deleteReceipt(id: string, imageUrl?: string): Promise<void> {
    if (imageUrl) {
        const path = imageUrl.split('/receipts/')[1];
        if (path) {
            await supabase.storage.from('receipts').remove([path]);
        }
    }

    const { error } = await db
        .from('accountant_receipts')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Bonnetje verwijderen mislukt: ${error.message}`);
}

// ===========================================================================
// Jaaroverzicht & Belastingberekening
// ===========================================================================

export async function getYearSummary(userId: string, year: number): Promise<YearSummary> {
    const [transactions, receipts] = await Promise.all([
        getTransactions(userId, year),
        getReceipts(userId, year),
    ]);

    let totalIncome   = 0;
    let totalExpenses = 0;
    const byCategory: Record<string, number> = {};
    const byMonth: { month: number; income: number; expenses: number }[] =
        Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: 0, expenses: 0 }));

    for (const tx of transactions) {
        const month = parseInt(tx.date.split('-')[1]) - 1;
        if (tx.amount > 0) {
            totalIncome += tx.amount;
            byMonth[month].income += tx.amount;
        } else {
            totalExpenses += Math.abs(tx.amount);
            byMonth[month].expenses += Math.abs(tx.amount);
        }
        byCategory[tx.category] = (byCategory[tx.category] || 0) + Math.abs(tx.amount);
    }

    let vatCollected = 0;
    let vatPaid      = 0;
    for (const r of receipts) {
        if (r.amount > 0) vatCollected += r.vat_amount;
        else vatPaid += r.vat_amount;
    }

    return {
        year,
        totalIncome,
        totalExpenses,
        profit: totalIncome - totalExpenses,
        vatCollected,
        vatPaid,
        vatBalance: vatCollected - vatPaid,
        byCategory,
        byMonth,
    };
}

export function calculateTax(summary: YearSummary, starterAftrek: boolean): TaxCalculation {
    const { totalIncome, totalExpenses } = summary;
    const profit = Math.max(0, totalIncome - totalExpenses);

    // Aftrekposten
    const zelfstandigenaftrek = profit >= TAX_2025.zelfstandigenaftrek
        ? TAX_2025.zelfstandigenaftrek
        : profit;
    const startersaftrek = starterAftrek
        ? Math.min(TAX_2025.startersaftrek, Math.max(0, profit - zelfstandigenaftrek))
        : 0;

    const afterAftrekposten = Math.max(0, profit - zelfstandigenaftrek - startersaftrek);
    const mkbWinstvrijstelling = afterAftrekposten * TAX_2025.mkbWinstvrijstelling;
    const taxableIncome = Math.max(0, afterAftrekposten - mkbWinstvrijstelling);

    // Belasting berekenen (schijven 2025)
    let estimatedTax = 0;
    if (taxableIncome <= TAX_2025.bracket1Limit) {
        estimatedTax = taxableIncome * TAX_2025.bracket1Rate;
    } else {
        estimatedTax = TAX_2025.bracket1Limit * TAX_2025.bracket1Rate
            + (taxableIncome - TAX_2025.bracket1Limit) * TAX_2025.bracket2Rate;
    }

    const effectiveRate = taxableIncome > 0 ? (estimatedTax / taxableIncome) * 100 : 0;

    return {
        grossIncome: totalIncome,
        totalExpenses,
        profit,
        zelfstandigenaftrek,
        startersaftrek,
        mkbWinstvrijstelling,
        taxableIncome,
        estimatedTax,
        effectiveRate,
    };
}

// ===========================================================================
// Instellingen
// ===========================================================================

export async function getSettings(userId: string): Promise<AccountantSettings | null> {
    const { data, error } = await db
        .from('accountant_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) throw new Error(`Instellingen ophalen mislukt: ${error.message}`);
    return data as AccountantSettings | null;
}

export async function saveSettings(settings: Omit<AccountantSettings, 'id' | 'updated_at'>): Promise<AccountantSettings> {
    const { data, error } = await db
        .from('accountant_settings')
        .upsert({ ...settings, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
        .select()
        .single();

    if (error) throw new Error(`Instellingen opslaan mislukt: ${error.message}`);
    return data as AccountantSettings;
}

// ===========================================================================
// Helpers
// ===========================================================================

export function formatEuro(amount: number): string {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
}

export function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('nl-NL', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
}
