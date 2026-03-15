/**
 * Edge Function: /demo-chat — Landing Page AI Demo
 *
 * Simplified chat endpoint for anonymous visitors on the landing page.
 * Allows visitors to experience the AI chatbot without creating an account.
 *
 * Security layers:
 * 1. CORS origin check (only dgskills.app + localhost dev)
 * 2. IP-based rate limiting (5 messages per 24 hours)
 * 3. Prompt injection filtering
 * 4. Fixed system instruction (not configurable by client)
 * 5. Vertex AI safety settings for minors
 * 6. No auth required — designed for anonymous demo use
 */
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";
import { getAccessToken, getVertexUrl } from "../_shared/vertexAuth.ts";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { buildSafeHistory } from "../_shared/chatHistory.ts";
import { checkDurableRateLimit, rateLimitHeaders } from "../_shared/rateLimiter.ts";

const MAX_REQUEST_BYTES = 8_000;

async function sha256(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

/** Extract client IP from request headers (Supabase/Vercel proxy chain) */
function getClientIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
        // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
        return forwarded.split(",")[0].trim();
    }
    return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Fixed system instruction for the landing page demo.
 * The AI acts as a friendly game builder mentor that helps visitors
 * customize a mini platformer game through conversation.
 */
const DEMO_SYSTEM_INSTRUCTION = `Je bent Pip, de vrolijke AI-mentor van DGSkills. Je helpt bezoekers een mini-platformer game te bouwen op de landingspagina.

REGELS:
- Antwoord ALTIJD in het Nederlands
- Houd antwoorden KORT: maximaal 2-3 zinnen
- Wees enthousiast en vriendelijk
- Stel na elk antwoord een vervolgvraag om de game verder aan te passen
- Dit is een demo — geen volledige les. Focus op het laten zien hoe leuk en interactief het platform is.

GAME BUILDER:
Je helpt de bezoeker hun eigen platformer game aan te passen. Ze kunnen kiezen:
- Thema/sfeer (ruimte, jungle, oceaan, stad, woestijn, ijs, vulkaan, snoep)
- Kleur van de lucht en grond
- Karakter (robot, astronaut, kat, draak, ninja, eenhoorn)
- Obstakels en powerups
- Snelheid en moeilijkheidsgraad

NA ELK ANTWOORD voeg je een JSON-blok toe met de huidige game-staat. Dit blok wordt door de frontend geparsed om de game live te updaten. Gebruik EXACT dit format:

<GAME_STATE>
{
  "sky": "#1a1a2e",
  "ground": "#16a34a",
  "character": "#f59e0b",
  "characterType": "robot",
  "obstacles": 2,
  "clouds": true,
  "stars": false,
  "speed": "normal",
  "theme": "Standaard"
}
</GAME_STATE>

Pas de waardes aan op basis van wat de bezoeker kiest. Geldige characterTypes: "robot", "astronaut", "kat", "draak", "ninja", "eenhoorn". Geldige speeds: "slow", "normal", "fast".

BEGIN met een korte begroeting en vraag welk thema ze willen (ruimte, jungle, oceaan, etc). Geef meteen een standaard GAME_STATE mee.`;

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type");
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(
            JSON.stringify({ error: "Alleen POST verzoeken toegestaan." }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const contentLength = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
        return new Response(
            JSON.stringify({ error: "Verzoek is te groot." }),
            { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 1. IP-based rate limiting: 5 messages per 24 hours
    const clientIp = getClientIp(req);
    const userAgent = req.headers.get("User-Agent") || "unknown";
    const rateFingerprint = await sha256(`${clientIp}|${userAgent}`);
    const rateCheck = await checkDurableRateLimit(`demo-chat:${rateFingerprint}`, {
        maxRequests: 5,
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
    });

    if (!rateCheck.allowed) {
        return new Response(
            JSON.stringify({
                error: "demo_limit",
                reason: "Je hebt het maximum van 5 berichten bereikt. Maak een gratis account om verder te gaan!",
                remaining: 0,
            }),
            {
                status: 429,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                    ...rateLimitHeaders(rateCheck),
                },
            }
        );
    }

    // 2. Parse request
    let body: { message?: string; history?: Array<{ role: string; parts: Array<{ text: string }> }> };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige JSON." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (!body.message || typeof body.message !== "string" || body.message.length > 500) {
        return new Response(
            JSON.stringify({ error: "Bericht ontbreekt of is te lang (max 500 tekens)." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 3. Prompt injection check
    const validation = sanitizePrompt(body.message);
    if (validation.wasBlocked) {
        console.warn(`[DEMO_INJECTION_BLOCKED] ip=${clientIp} label=${validation.detectionLabel}`);
        return new Response(
            JSON.stringify({
                error: "blocked",
                reason: "Je bericht bevat een patroon dat niet is toegestaan.",
            }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const safeHistory = buildSafeHistory(body.history, {
        maxMessages: 6,
        maxPartsPerMessage: 1,
        maxPartChars: 500,
        maxTotalChars: 2_000,
    });

    if (safeHistory.blocked) {
        console.warn(`[DEMO_HISTORY_BLOCKED] ip=${clientIp} label=${safeHistory.detectionLabel}`);
        return new Response(
            JSON.stringify({
                error: "blocked",
                reason: "De gesprekshistorie bevat een patroon dat niet is toegestaan.",
            }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 4. Send to Gemini via Vertex AI
    try {
        const geminiUrl = getVertexUrl("gemini-2.0-flash");
        const accessToken = await getAccessToken();

        const contents = [
            ...safeHistory.history,
            { role: "user", parts: [{ text: validation.sanitized }] },
        ];

        const safetySettings = [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ];

        const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                contents,
                safetySettings,
                systemInstruction: { parts: [{ text: DEMO_SYSTEM_INSTRUCTION }] },
            }),
        });

        if (!geminiResponse.ok) {
            const status = geminiResponse.status;
            const errBody = await geminiResponse.text().catch(() => "");
            console.error(`[demo-chat] Vertex AI error (${status}):`, errBody);
            return new Response(
                JSON.stringify({ error: "AI tijdelijk niet beschikbaar. Probeer het later opnieuw." }),
                { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const geminiData = await geminiResponse.json();
        const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        return new Response(
            JSON.stringify({
                text,
                remaining: Math.max(rateCheck.remaining, 0),
            }),
            {
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                    ...rateLimitHeaders(rateCheck),
                },
            }
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[demo-chat] Unhandled error:", message);
        return new Response(
            JSON.stringify({ error: "AI tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
