/**
 * Edge Function: /generateImage — AI Image Generation via Vertex AI
 *
 * Security layers:
 * 1. CORS check (allowed origins only — no wildcards)
 * 2. OPTIONS preflight handling
 * 3. JWT auth verification (Supabase — no anonymous access)
 * 4. Rate limiting: 5 req/min per user (heavy operation)
 * 5. Input validation (prompt length, style whitelist, aspectRatio whitelist)
 * 6. Prompt sanitization via promptSanitizer (40+ injection patterns, NL + EN)
 * 7. Safety prefix prepended server-side (child-safe content instruction)
 * 8. Vertex AI (europe-west4) — enterprise ToS, suitable for minors (12-18)
 * 9. Service account auth via getAccessToken() — no API key in URL
 *
 * Input:  { prompt: string, style: "book"|"branding"|"general", aspectRatio: string }
 * Output: { imageBase64: string, mimeType: string, model: string }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken, getVertexUrl } from "../_shared/vertexAuth.ts";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { checkDurableRateLimit, rateLimitResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";

// ── Constants ────────────────────────────────────────────────────────────────

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const MODEL = "gemini-2.5-flash-image";

const MAX_PROMPT_LENGTH = 2000;

const ALLOWED_STYLES = new Set(["book", "branding", "general"]);

const ALLOWED_ASPECT_RATIOS = new Set([
    "1:1", "3:2", "2:3", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9",
]);

const STYLE_PREFIXES: Record<string, string> = {
    book: "Kindvriendelijke illustratie in prentenboekstijl. ",
    branding: "Professionele, moderne illustratie. ",
    general: "Educatieve, kindvriendelijke illustratie. ",
};

const SAFETY_PREFIX =
    "VEILIG VOOR KINDEREN. Geen geweld, geen seksuele content, geen angstaanjagende beelden. ";

// ── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");

    // 1. CORS check
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    // 2. OPTIONS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // 3. JWT auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // 4. Rate limiting — 5 req/min (heavy operation)
    const rateCheck = await checkDurableRateLimit(
        `generateImage:${user.id}`,
        { maxRequests: 5, windowMs: 60_000 },
        authHeader,
    );
    if (!rateCheck.allowed) {
        return rateLimitResponse(rateCheck, corsHeaders);
    }

    // 5. Parse and validate input
    let body: { prompt?: unknown; style?: unknown; aspectRatio?: unknown };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldig verzoek. Verwacht JSON." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const { prompt, style, aspectRatio } = body;

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
        return new Response(
            JSON.stringify({ error: "Prompt is verplicht en moet tekst zijn." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
        return new Response(
            JSON.stringify({ error: `Prompt mag maximaal ${MAX_PROMPT_LENGTH} tekens bevatten.` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    if (typeof style !== "string" || !ALLOWED_STYLES.has(style)) {
        return new Response(
            JSON.stringify({ error: "Ongeldige stijl. Kies uit: book, branding, general." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    if (typeof aspectRatio !== "string" || !ALLOWED_ASPECT_RATIOS.has(aspectRatio)) {
        return new Response(
            JSON.stringify({ error: "Ongeldig beeldverhouding. Kies uit: 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // 6. Prompt sanitization — 40+ injection patterns, NL + EN
    const sanitizeResult = sanitizePrompt(prompt);
    if (sanitizeResult.wasBlocked) {
        console.error(
            `[generateImage] Prompt blocked for user ${user.id}: ${sanitizeResult.reason} (${sanitizeResult.detectionLabel})`,
        );
        return new Response(
            JSON.stringify({ error: "Prompt bevat niet-toegestane inhoud." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // 7. Build safe prompt with child-safety prefix and style prefix
    const safePrompt =
        SAFETY_PREFIX + STYLE_PREFIXES[style] + sanitizeResult.sanitized;

    // Forward to Vertex AI
    try {
        console.log("[generateImage] Step 1: Building Vertex URL...");
        const vertexUrl = getVertexUrl(MODEL);

        console.log("[generateImage] Step 2: Getting access token...");
        const accessToken = await getAccessToken();

        console.log("[generateImage] Step 3: Sending to Vertex AI...");
        const vertexResponse = await fetch(vertexUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: safePrompt }],
                }],
                generationConfig: {
                    responseModalities: ["image", "text"],
                    temperature: 0.4,
                    maxOutputTokens: 4096,
                },
            }),
        });

        if (!vertexResponse.ok) {
            const status = vertexResponse.status;
            const errBody = await vertexResponse.text().catch(() => "");
            console.error(`[generateImage] Vertex AI error (${status}):`, errBody);
            if (status === 429) {
                return new Response(
                    JSON.stringify({ error: "Te veel verzoeken. Wacht even." }),
                    { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
                );
            }
            return new Response(
                JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
                { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }

        const vertexData = await vertexResponse.json();

        // 8. Extract image from response — check all parts for inlineData
        console.log("[generateImage] Step 4: Vertex AI response OK, extracting image...");
        const parts: Array<{ inlineData?: { data: string; mimeType: string }; text?: string }> =
            vertexData?.candidates?.[0]?.content?.parts ?? [];

        const imagePart = parts.find((p) => p.inlineData?.data);

        if (!imagePart?.inlineData) {
            console.error("[generateImage] No inlineData found in Vertex AI response. Parts count:", parts.length);
            return new Response(
                JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
                { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }

        const { data: imageBase64, mimeType } = imagePart.inlineData;
        console.log("[generateImage] Step 5: Image extracted. mimeType:", mimeType, "base64 length:", imageBase64.length);

        return new Response(
            JSON.stringify({ imageBase64, mimeType, model: MODEL }),
            {
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                    ...rateLimitHeaders(rateCheck),
                },
            },
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[generateImage] Unhandled error:", message);
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }
});
