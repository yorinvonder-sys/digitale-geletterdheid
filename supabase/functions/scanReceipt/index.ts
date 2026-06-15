/**
 * Edge Function: /scanReceipt — Mistral OCR bonnetje-scanner
 *
 * Security layers:
 * 1. JWT auth verificatie (Supabase)
 * 2. Bestandsgrootte-limiet (max 10 MB base64)
 * 3. MIME-type validatie
 * 4. Mistral OCR — server-side API key only
 * 5. Usage logging without prompt/response content
 *
 * Input:  { imageBase64: string, mimeType: string }
 * Output: { supplier, date, amount, vatAmount, vatRate, description, category }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { checkDurableRateLimit, rateLimitResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";
import { getUserSchoolId, logAiUsageEvent, resolveAiRequestId } from "../_shared/aiUsageLogger.ts";
import { extractJsonObject, getMistralOcrModel, processMistralOcr } from "../_shared/mistralClient.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/gif",
    "application/pdf",
]);

const MAX_BASE64_LENGTH = 14_000_000; // ~10 MB

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // 1. Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(
            JSON.stringify({ error: "Ongeldige sessie." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const callerRole = user.app_metadata?.role;
    if (callerRole !== "developer" && callerRole !== "admin") {
        return new Response(
            JSON.stringify({ error: "Geen toegang tot de boekhoudscanner." }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 2. Parse request
    let body: { imageBase64?: string; mimeType?: string; mode?: string; clientRequestId?: unknown };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige JSON." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const requestId = resolveAiRequestId(body.clientRequestId);
    const schoolId = getUserSchoolId(user);
    const model = getMistralOcrModel();
    const responseHeaders = { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": requestId };

    // Rate limit: 5 requests per minute per user (heavy operation)
    const rateCheck = await checkDurableRateLimit(`scanReceipt:${user.id}`, { maxRequests: 5, windowMs: 60_000 }, authHeader);
    if (!rateCheck.allowed) {
        logAiUsageEvent({
            requestId,
            endpoint: "scanReceipt",
            provider: "mistral",
            model,
            status: "rate_limited",
            userId: user.id,
            schoolId,
            metadata: { limit: rateCheck.limit, retry_after_ms: rateCheck.retryAfterMs },
        }).catch((logErr) => console.error("[scanReceipt] Usage log error:", logErr));
        return rateLimitResponse(rateCheck, { ...corsHeaders, "X-AI-Request-Id": requestId });
    }

    if (!body.imageBase64 || typeof body.imageBase64 !== "string") {
        return new Response(
            JSON.stringify({ error: "imageBase64 ontbreekt." }),
            { status: 400, headers: responseHeaders }
        );
    }

    const mimeType = body.mimeType || "image/jpeg";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        return new Response(
            JSON.stringify({ error: "Bestandstype niet toegestaan." }),
            { status: 400, headers: responseHeaders }
        );
    }

    if (body.imageBase64.length > MAX_BASE64_LENGTH) {
        return new Response(
            JSON.stringify({ error: "Bestand te groot (max 10 MB)." }),
            { status: 413, headers: responseHeaders }
        );
    }

    const isSubscription = body.mode === "subscription";

    const receiptPrompt = `Je bent een Nederlandse boekhoudings-AI. Analyseer dit bonnetje of factuur en extraheer de volgende gegevens.

Geef je antwoord UITSLUITEND als geldig JSON in dit exacte formaat, NIETS anders:
{
  "supplier": "naam van de leverancier of winkel",
  "date": "YYYY-MM-DD",
  "amount": 0.00,
  "vatAmount": 0.00,
  "vatRate": 21,
  "description": "korte omschrijving van de aankoop",
  "category": "een van: kantoorkosten | reiskosten | marketing | automatisering | opleiding | telefoon-internet | representatie | omzet | overig"
}

Regels:
- date: datum van het bonnetje in ISO-formaat (YYYY-MM-DD). Als het jaar onduidelijk is, gebruik het meest recente jaar.
- amount: totaalbedrag INCLUSIEF BTW als getal (bijv. 12.50, niet "12,50").
- vatAmount: het BTW-bedrag. Als niet zichtbaar, bereken het uit het BTW-percentage.
- vatRate: 0, 9 of 21 (meest voorkomend op het bonnetje). Schat op basis van type aankoop.
- category: kies de meest passende categorie. Bij twijfel: "overig".
- Als een veld niet leesbaar is, gebruik een lege string "" voor tekst of 0 voor getallen.

Antwoord ALLEEN met de JSON, geen uitleg of extra tekst.`;

    const subscriptionPrompt = `Je bent een Nederlandse boekhoudings-AI. Analyseer deze screenshot van een abonnement, factuur of betalingspagina en extraheer de abonnementsgegevens.

Geef je antwoord UITSLUITEND als geldig JSON in dit exacte formaat, NIETS anders:
{
  "name": "productnaam van het abonnement (bijv. Claude Pro, Vercel Pro)",
  "supplier": "naam van het bedrijf/leverancier (bijv. Anthropic, Vercel Inc.)",
  "amount": 0.00,
  "vatAmount": 0.00,
  "vatRate": 0,
  "frequency": "monthly",
  "startDate": "YYYY-MM-DD",
  "category": "automatisering",
  "notes": ""
}

Regels:
- name: de naam van het abonnement of product. Wees specifiek (bijv. "Claude Pro" niet "Anthropic").
- supplier: het bedrijf dat het abonnement levert.
- amount: het bedrag EXCLUSIEF BTW als getal. Als alleen incl. BTW zichtbaar is, reken terug.
- vatAmount: het BTW-bedrag. Bij buitenlandse SaaS (niet-NL) is dit meestal 0 (BTW verlegd).
- vatRate: 0 voor buitenlandse SaaS-diensten (BTW verlegd), 21 voor Nederlandse diensten, 9 voor laag tarief.
- frequency: "monthly" voor maandelijks, "quarterly" voor per kwartaal, "yearly" voor jaarlijks. Kijk naar bedrag en periode-aanduiding.
- startDate: de startdatum of factuurdatum in ISO-formaat (YYYY-MM-DD). Als het jaar onduidelijk is, gebruik het huidige jaar.
- category: kies de meest passende uit: kantoorkosten | reiskosten | marketing | automatisering | opleiding | telefoon-internet | representatie | overig. Software/SaaS = "automatisering".
- notes: eventuele extra info zoals plan-type, limieten, etc. Kort houden.
- Als een veld niet leesbaar is, gebruik een lege string "" voor tekst of 0 voor getallen.

Antwoord ALLEEN met de JSON, geen uitleg of extra tekst.`;

    const prompt = isSubscription ? subscriptionPrompt : receiptPrompt;
    const normalizedBase64 = body.imageBase64.includes(",")
        ? body.imageBase64.slice(body.imageBase64.indexOf(",") + 1)
        : body.imageBase64;
    const dataUrl = `data:${mimeType};base64,${normalizedBase64}`;

    let ocrResult;
    try {
        ocrResult = await processMistralOcr({ dataUrl, mimeType, prompt, model });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[scanReceipt] Mistral OCR error:", message);
        logAiUsageEvent({
            requestId,
            endpoint: "scanReceipt",
            provider: "mistral",
            model,
            status: message.includes("429") ? "rate_limited" : "error",
            userId: user.id,
            schoolId,
            inputChars: prompt.length,
            imageCount: 1,
            metadata: { mode: isSubscription ? "subscription" : "receipt", error_stage: "provider" },
        }).catch((logErr) => console.error("[scanReceipt] Usage log error:", logErr));
        if (message.includes("429")) {
            return new Response(
                JSON.stringify({ error: "Te veel verzoeken. Wacht even en probeer opnieuw." }),
                { status: 429, headers: responseHeaders }
            );
        }
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: responseHeaders }
        );
    }

    const rawText = ocrResult.text;

    // 4. JSON parsen uit Mistral OCR-respons
    let parsed: Record<string, unknown>;
    try {
        parsed = extractJsonObject(rawText);
    } catch {
        console.error("[scanReceipt] Parse error");
        logAiUsageEvent({
            requestId,
            endpoint: "scanReceipt",
            provider: "mistral",
            model: ocrResult.model,
            status: "error",
            userId: user.id,
            schoolId,
            inputChars: prompt.length,
            outputChars: rawText.length,
            imageCount: 1,
            usagePayload: ocrResult.usagePayload,
            metadata: { mode: isSubscription ? "subscription" : "receipt", error_stage: "parse" },
        }).catch((logErr) => console.error("[scanReceipt] Usage log error:", logErr));
        return new Response(
            JSON.stringify({
                error: "Bonnetje kon niet worden uitgelezen. Probeer een duidelijkere foto."
            }),
            { status: 422, headers: responseHeaders }
        );
    }

    // 5. Valideer en normaliseer output
    const validFrequencies = ["monthly", "quarterly", "yearly"];
    const result = isSubscription
        ? {
            name:      typeof parsed.name === "string" ? parsed.name : "",
            supplier:  typeof parsed.supplier === "string" ? parsed.supplier : "",
            amount:    typeof parsed.amount === "number" ? parsed.amount : 0,
            vatAmount: typeof parsed.vatAmount === "number" ? parsed.vatAmount : 0,
            vatRate:   [0, 9, 21].includes(Number(parsed.vatRate)) ? Number(parsed.vatRate) : 0,
            frequency: validFrequencies.includes(String(parsed.frequency)) ? String(parsed.frequency) : "monthly",
            startDate: typeof parsed.startDate === "string" ? parsed.startDate : new Date().toISOString().split("T")[0],
            category:  typeof parsed.category === "string" ? parsed.category : "automatisering",
            notes:     typeof parsed.notes === "string" ? parsed.notes : "",
        }
        : {
            supplier:    typeof parsed.supplier === "string" ? parsed.supplier : "",
            date:        typeof parsed.date === "string" ? parsed.date : new Date().toISOString().split("T")[0],
            amount:      typeof parsed.amount === "number" ? parsed.amount : 0,
            vatAmount:   typeof parsed.vatAmount === "number" ? parsed.vatAmount : 0,
            vatRate:     [0, 9, 21].includes(Number(parsed.vatRate)) ? Number(parsed.vatRate) : 21,
            description: typeof parsed.description === "string" ? parsed.description : "",
            category:    typeof parsed.category === "string" ? parsed.category : "overig",
        };

    logAiUsageEvent({
        requestId,
        endpoint: "scanReceipt",
        provider: "mistral",
        model: ocrResult.model,
        status: "ok",
        userId: user.id,
        schoolId,
        inputChars: prompt.length,
        outputChars: rawText.length,
        imageCount: 1,
        usagePayload: ocrResult.usagePayload,
        metadata: { mode: isSubscription ? "subscription" : "receipt", mime_type: mimeType },
    }).catch((logErr) => console.error("[scanReceipt] Usage log error:", logErr));

    return new Response(JSON.stringify({ result }), {
        headers: { ...responseHeaders, ...rateLimitHeaders(rateCheck) },
    });
});
