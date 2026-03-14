/**
 * Edge Function: /scanSubscriptionClaude — Claude Opus 4.6 abonnement-scanner
 *
 * Gebruikt Anthropic Claude API i.p.v. Gemini voor hogere nauwkeurigheid.
 * Alleen beschikbaar in de developer-omgeving (boekhouding).
 *
 * Ondersteunt: afbeeldingen (jpeg, png, webp, heic) + PDF
 *
 * Input:  { fileBase64: string, mimeType: string }
 * Output: { result: { name, supplier, amount, vatAmount, vatRate, frequency, startDate, category, notes } }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const ALLOWED_ORIGINS = new Set([
    "https://dgskills.app",
    "https://www.dgskills.app",
    "http://localhost:5173",
    "http://localhost:3000",
]);

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
]);

const MAX_BASE64_LENGTH = 14_000_000; // ~10 MB

const SUBSCRIPTION_PROMPT = `Je bent een Nederlandse boekhoudings-AI. Analyseer dit bestand (screenshot, factuur, PDF of betalingsoverzicht) en extraheer de abonnementsgegevens.

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
- frequency: "monthly" voor maandelijks, "quarterly" voor per kwartaal, "yearly" voor jaarlijks.
- startDate: de startdatum of factuurdatum in ISO-formaat (YYYY-MM-DD). Als het jaar onduidelijk is, gebruik het huidige jaar.
- category: kies de meest passende uit: kantoorkosten | reiskosten | marketing | automatisering | opleiding | telefoon-internet | representatie | overig. Software/SaaS = "automatisering".
- notes: eventuele extra info zoals plan-type, limieten, etc. Kort houden.
- Als een veld niet leesbaar is, gebruik een lege string "" voor tekst of 0 voor getallen.

Antwoord ALLEEN met de JSON, geen uitleg of extra tekst.`;

const RECEIPT_PROMPT = `Je bent een Nederlandse boekhoudings-AI. Analyseer dit bonnetje, factuur of betaalbewijs en extraheer de gegevens.

Geef je antwoord UITSLUITEND als geldig JSON in dit exacte formaat, NIETS anders:
{
  "supplier": "naam van de leverancier of winkel",
  "date": "YYYY-MM-DD",
  "amount": 0.00,
  "vatAmount": 0.00,
  "vatRate": 21,
  "description": "korte omschrijving van de aankoop",
  "category": "een van de categorieën hieronder"
}

Regels:
- supplier: naam van de winkel, leverancier of dienstverlener.
- date: datum van het bonnetje in ISO-formaat (YYYY-MM-DD). Als het jaar onduidelijk is, gebruik het meest recente jaar.
- amount: totaalbedrag INCLUSIEF BTW als getal (bijv. 12.50, niet "12,50").
- vatAmount: het BTW-bedrag. Als niet zichtbaar, bereken het uit het BTW-percentage.
- vatRate: 0, 9 of 21 (meest voorkomend op het bonnetje). Schat op basis van type aankoop.
- description: korte omschrijving (max 50 tekens).
- category: kies de meest passende uit: kantoorkosten | reiskosten | marketing | automatisering | opleiding | telefoon-internet | representatie | overig. Bij twijfel: "overig".
- Als een veld niet leesbaar is, gebruik een lege string "" voor tekst of 0 voor getallen.

Antwoord ALLEEN met de JSON, geen uitleg of extra tekst.`;

Deno.serve(async (req: Request) => {
    const origin = req.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://dgskills.app";
    const corsHeaders = {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {

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

    // 2. Check Anthropic API key
    if (!ANTHROPIC_API_KEY) {
        return new Response(
            JSON.stringify({ error: "ANTHROPIC_API_KEY niet geconfigureerd." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 3. Parse request
    let body: { fileBase64?: string; mimeType?: string; mode?: string };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige JSON." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (!body.fileBase64 || typeof body.fileBase64 !== "string") {
        return new Response(
            JSON.stringify({ error: "fileBase64 ontbreekt." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const mimeType = body.mimeType || "image/jpeg";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        return new Response(
            JSON.stringify({ error: `Bestandstype niet toegestaan: ${mimeType}. Gebruik JPEG, PNG, WebP, GIF of PDF.` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (body.fileBase64.length > MAX_BASE64_LENGTH) {
        return new Response(
            JSON.stringify({ error: "Bestand te groot (max 10 MB)." }),
            { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 4. Build Claude API content blocks
    const isPdf = mimeType === "application/pdf";
    const contentBlock = isPdf
        ? {
            type: "document" as const,
            source: {
                type: "base64" as const,
                media_type: mimeType,
                data: body.fileBase64,
            },
        }
        : {
            type: "image" as const,
            source: {
                type: "base64" as const,
                media_type: mimeType,
                data: body.fileBase64,
            },
        };

    // 5. Select prompt based on mode
    const isReceipt = body.mode === "receipt";
    const prompt = isReceipt ? RECEIPT_PROMPT : SUBSCRIPTION_PROMPT;

    // 6. Call Claude API
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: [
                    contentBlock,
                    { type: "text", text: prompt },
                ],
            }],
        }),
    });

    if (!claudeResponse.ok) {
        const status = claudeResponse.status;
        const errBody = await claudeResponse.text().catch(() => "");
        console.error(`[scanSubscriptionClaude] Claude API error ${status}:`, errBody.slice(0, 500));

        // Parse Claude API error for details
        let claudeError = "AI-service tijdelijk niet beschikbaar.";
        try {
            const parsed = JSON.parse(errBody);
            if (parsed?.error?.message) {
                claudeError = `Claude API: ${parsed.error.message}`;
            }
        } catch { /* use default */ }

        if (status === 429) {
            return new Response(
                JSON.stringify({ error: "Te veel verzoeken. Wacht even en probeer opnieuw." }),
                { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
        return new Response(
            JSON.stringify({ error: claudeError }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const claudeData = await claudeResponse.json();
    const rawText: string = claudeData?.content?.[0]?.text || "";

    // 6. Parse JSON from response
    let parsed: Record<string, unknown>;
    try {
        const startIdx = rawText.indexOf("{");
        const endIdx = rawText.lastIndexOf("}");
        if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
            throw new Error("Geen JSON gevonden in respons");
        }
        parsed = JSON.parse(rawText.slice(startIdx, endIdx + 1));
    } catch {
        console.error("[scanSubscriptionClaude] Parse error, raw:", rawText.slice(0, 300));
        return new Response(
            JSON.stringify({
                error: "Bestand kon niet worden uitgelezen. Probeer een duidelijkere foto of PDF."
            }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 7. Validate and normalize (different format for receipt vs subscription)
    const validFrequencies = ["monthly", "quarterly", "yearly"];
    const result = isReceipt
        ? {
            supplier:    typeof parsed.supplier === "string" ? parsed.supplier : "",
            date:        typeof parsed.date === "string" ? parsed.date : new Date().toISOString().split("T")[0],
            amount:      typeof parsed.amount === "number" ? parsed.amount : 0,
            vatAmount:   typeof parsed.vatAmount === "number" ? parsed.vatAmount : 0,
            vatRate:     [0, 9, 21].includes(Number(parsed.vatRate)) ? Number(parsed.vatRate) : 21,
            description: typeof parsed.description === "string" ? parsed.description : "",
            category:    typeof parsed.category === "string" ? parsed.category : "overig",
        }
        : {
            name:      typeof parsed.name === "string" ? parsed.name : "",
            supplier:  typeof parsed.supplier === "string" ? parsed.supplier : "",
            amount:    typeof parsed.amount === "number" ? parsed.amount : 0,
            vatAmount: typeof parsed.vatAmount === "number" ? parsed.vatAmount : 0,
            vatRate:   [0, 9, 21].includes(Number(parsed.vatRate)) ? Number(parsed.vatRate) : 0,
            frequency: validFrequencies.includes(String(parsed.frequency)) ? String(parsed.frequency) : "monthly",
            startDate: typeof parsed.startDate === "string" ? parsed.startDate : new Date().toISOString().split("T")[0],
            category:  typeof parsed.category === "string" ? parsed.category : "automatisering",
            notes:     typeof parsed.notes === "string" ? parsed.notes : "",
        };

    return new Response(JSON.stringify({ result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

    } catch (err) {
        console.error("[scanSubscriptionClaude] Uncaught error:", err);
        const corsHeaders = {
            "Access-Control-Allow-Origin": req.headers.get("Origin") || "https://dgskills.app",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };
        return new Response(
            JSON.stringify({ error: `Server error: ${err instanceof Error ? err.message : String(err)}` }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
