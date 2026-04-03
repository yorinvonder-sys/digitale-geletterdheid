/**
 * Edge Function: /validateDeveloperTask — AI-based task quality validation
 *
 * Security layers:
 * 1. JWT auth verification (Supabase)
 * 2. Server-side rate limiting (10 req/min per user)
 * 3. Input sanitization (prompt injection prevention)
 * 4. Vertex AI (europe-west4) — enterprise ToS
 * 5. Service account auth (no API key in URL)
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken, getVertexUrl } from "../_shared/vertexAuth.ts";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { checkDurableRateLimit, rateLimitResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";

const SYSTEM_INSTRUCTION = `Je bent een projectmanagement-AI voor een educatief software team. Evalueer de volgende taakbeschrijving op kwaliteit.

Beoordeel op:
1. Duidelijkheid - Is de taak helder geformuleerd?
2. Specificiteit - Zijn er concrete deliverables?
3. Haalbaarheid - Is de scope realistisch?

Antwoord ALLEEN in JSON:
{ "isValid": true/false, "message": "korte feedback in het Nederlands", "suggestions": ["suggestie 1", "suggestie 2"], "score": 0-100 }`;

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");

    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // --- JWT auth ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("[validateDeveloperTask] Missing SUPABASE_URL or SUPABASE_ANON_KEY");
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // --- Rate limiting ---
    const rateCheck = await checkDurableRateLimit(user.id, { maxRequests: 10, windowMs: 60_000 }, authHeader);
    if (!rateCheck.allowed) {
        return rateLimitResponse(rateCheck, corsHeaders);
    }

    // --- Parse body ---
    let body: { title: string; description: string; context?: string };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const { title, description, context } = body;

    if (!title || typeof title !== "string" || !description || typeof description !== "string") {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // --- Input length validation ---
    if (title.length > 200) {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }
    if (description.length > 5000) {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // --- Input sanitization (prompt injection prevention) ---
    const titleSanitized = sanitizePrompt(title);
    if (titleSanitized.wasBlocked) {
        console.warn("[validateDeveloperTask] Prompt injection blocked in title:", titleSanitized.detectionLabel, "user:", user.id);
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const descriptionSanitized = sanitizePrompt(description);
    if (descriptionSanitized.wasBlocked) {
        console.warn("[validateDeveloperTask] Prompt injection blocked in description:", descriptionSanitized.detectionLabel, "user:", user.id);
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    if (context !== undefined) {
        if (typeof context !== "string" || context.length > 5000) {
            return new Response(
                JSON.stringify({ error: "Ongeldige invoer." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }
        const contextSanitized = sanitizePrompt(context);
        if (contextSanitized.wasBlocked) {
            console.warn("[validateDeveloperTask] Prompt injection blocked in context:", contextSanitized.detectionLabel, "user:", user.id);
            return new Response(
                JSON.stringify({ error: "Ongeldige invoer." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }
    }

    // --- Build user message ---
    let userMessage = `Titel: ${titleSanitized.sanitized}\n\nBeschrijving: ${descriptionSanitized.sanitized}`;
    if (context) {
        const contextSanitized = sanitizePrompt(context);
        userMessage += `\n\nContext: ${contextSanitized.sanitized}`;
    }

    // --- Vertex AI call ---
    try {
        const geminiUrl = getVertexUrl("gemini-3-flash-preview");
        const accessToken = await getAccessToken();

        const response = await fetch(geminiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                contents: [{ role: "user", parts: [{ text: userMessage }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
            }),
        });

        if (!response.ok) {
            const status = response.status;
            const errBody = await response.text().catch(() => "");
            console.error(`[validateDeveloperTask] Vertex AI error (${status}):`, errBody);
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

        const geminiData = await response.json();
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const startIdx = rawText.indexOf("{");
        const endIdx = rawText.lastIndexOf("}");
        if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
            throw new Error("Geen JSON gevonden");
        }
        const parsed = JSON.parse(rawText.slice(startIdx, endIdx + 1));

        const result: { isValid: boolean; message: string; suggestions?: string[]; score?: number } = {
            isValid: Boolean(parsed.isValid),
            message: typeof parsed.message === "string" ? parsed.message : "",
        };
        if (Array.isArray(parsed.suggestions)) {
            result.suggestions = parsed.suggestions.filter((s: unknown) => typeof s === "string");
        }
        if (typeof parsed.score === "number") {
            result.score = Math.min(100, Math.max(0, Math.round(parsed.score)));
        }

        return new Response(JSON.stringify(result), {
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                ...rateLimitHeaders(rateCheck),
            },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[validateDeveloperTask] Unhandled error:", message);
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }
});
