/**
 * Edge Function: /scanReceipt — Gemini Vision bonnetje-scanner
 *
 * Security layers:
 * 1. JWT auth verificatie (Supabase)
 * 2. Bestandsgrootte-limiet (max 10 MB base64)
 * 3. MIME-type validatie
 * 4. Vertex AI (europe-west4) — enterprise ToS, no age restriction
 * 5. Service account auth (no API key in URL)
 *
 * Input:  { imageBase64: string, mimeType: string }
 * Output: { supplier, date, amount, vatAmount, vatRate, description, category }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken, getVertexUrl } from "../_shared/vertexAuth.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

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
    "image/heic",
]);

const MAX_BASE64_LENGTH = 14_000_000; // ~10 MB

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

    // 2. Parse request
    let body: { imageBase64?: string; mimeType?: string };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige JSON." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (!body.imageBase64 || typeof body.imageBase64 !== "string") {
        return new Response(
            JSON.stringify({ error: "imageBase64 ontbreekt." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const mimeType = body.mimeType || "image/jpeg";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        return new Response(
            JSON.stringify({ error: "Bestandstype niet toegestaan." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (body.imageBase64.length > MAX_BASE64_LENGTH) {
        return new Response(
            JSON.stringify({ error: "Bestand te groot (max 10 MB)." }),
            { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 3. Gemini Vision aanroepen via Vertex AI (EU endpoint)
    const geminiUrl = getVertexUrl("gemini-2.0-flash");
    const accessToken = await getAccessToken();

    const prompt = `Je bent een Nederlandse boekhoudings-AI. Analyseer dit bonnetje of factuur en extraheer de volgende gegevens.

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

    const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: body.imageBase64,
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.1,
                topP: 0.8,
                maxOutputTokens: 512,
            },
        }),
    });

    if (!geminiResponse.ok) {
        const status = geminiResponse.status;
        if (status === 429) {
            return new Response(
                JSON.stringify({ error: "Te veel verzoeken. Wacht even en probeer opnieuw." }),
                { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const geminiData = await geminiResponse.json();
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 4. JSON parsen uit Gemini-respons (indexOf/lastIndexOf is robuuster dan greedy regex)
    let parsed: Record<string, unknown>;
    try {
        const startIdx = rawText.indexOf("{");
        const endIdx   = rawText.lastIndexOf("}");
        if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
            throw new Error("Geen JSON gevonden in respons");
        }
        parsed = JSON.parse(rawText.slice(startIdx, endIdx + 1));
    } catch {
        console.error("[scanReceipt] Parse error, raw:", rawText.slice(0, 200));
        return new Response(
            JSON.stringify({
                error: "Bonnetje kon niet worden uitgelezen. Probeer een duidelijkere foto."
            }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 5. Valideer en normaliseer output
    const result = {
        supplier:    typeof parsed.supplier === "string" ? parsed.supplier : "",
        date:        typeof parsed.date === "string" ? parsed.date : new Date().toISOString().split("T")[0],
        amount:      typeof parsed.amount === "number" ? parsed.amount : 0,
        vatAmount:   typeof parsed.vatAmount === "number" ? parsed.vatAmount : 0,
        vatRate:     [0, 9, 21].includes(Number(parsed.vatRate)) ? Number(parsed.vatRate) : 21,
        description: typeof parsed.description === "string" ? parsed.description : "",
        category:    typeof parsed.category === "string" ? parsed.category : "overig",
    };

    return new Response(JSON.stringify({ result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
});
