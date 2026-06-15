/**
 * Edge Function: /analyzeDrawing — Mistral vision analysis of student drawings
 *
 * Used by the drawing game component in DGSkills missions.
 * Students submit a drawing (base64 image) and the AI identifies what was drawn.
 *
 * Security layers:
 * 1. CORS origin check via buildCorsHeaders() + rejectDisallowedBrowserRequest()
 * 2. OPTIONS preflight handling
 * 3. JWT auth via Supabase (getUser())
 * 4. Rate limiting: 10 req/min per user (durable via Postgres RPC)
 * 5. Input validation: imageBase64 required, max 5 MB (~7 M base64 chars)
 * 6. Server-side prompt — client-sent prompt is IGNORED (prompt injection prevention)
 * 7. Mistral Vision via Chat Completions — server-side API key only
 * 8. JSON schema validation before returning a result
 *
 * Input:  { imageBase64: string, possibleLabels?: string[] }
 * Output: { guesses: [{label: string, confidence: number}], reasoning: string }
 *
 * NOTE: The frontend also sends a `prompt` field but it is intentionally ignored.
 * The system prompt is always determined server-side to prevent prompt injection.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { checkDurableRateLimit, rateLimitResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";
import { ensureAiInteractionConsent } from "../_shared/consent.ts";
import { getUserSchoolId, logAiUsageEvent, resolveAiRequestId } from "../_shared/aiUsageLogger.ts";
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";
import { completeMistralVisionJson, extractJsonObject, getMistralVisionModel } from "../_shared/mistralClient.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

/** Maximum accepted base64 length (~5 MB decoded). */
const MAX_BASE64_LENGTH = 7_000_000;

/** Rate limit: 10 requests per minute per authenticated user. */
const RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };

/**
 * Base server-side prompt for drawing analysis.
 * The client-sent `prompt` field is NEVER used — only `possibleLabels` may extend this prompt.
 */
const BASE_SERVER_PROMPT = `Je bent een AI die kindertekeningen analyseert voor een educatief spel.

Jouw taak:
1. Bepaal wat het object op de tekening ECHT voorstelt.
2. VEILIGHEID: Als de tekening seksueel getint, haatdragend of obsceen is, geef dan als label "ONGEPAST" en confidence 0.

Antwoord ALLEEN in dit exacte JSON-formaat, NIETS anders:
{
  "guesses": [
    {"label": "woord1", "confidence": 85},
    {"label": "woord2", "confidence": 10},
    {"label": "woord3", "confidence": 5}
  ],
  "reasoning": "Korte uitleg in het Nederlands"
}

De confidence scores moeten optellen tot 100. Geef je top 3 gokken.`;

interface DrawingGuess {
    label: string;
    confidence: number;
}

interface DrawingAnalysis {
    guesses: DrawingGuess[];
    reasoning: string;
}

/** Validate that the parsed AI response matches the expected schema. */
function validateAnalysis(parsed: unknown): parsed is DrawingAnalysis {
    if (!parsed || typeof parsed !== "object") return false;
    const obj = parsed as Record<string, unknown>;

    if (!Array.isArray(obj.guesses)) return false;
    if (obj.guesses.length < 1 || obj.guesses.length > 5) return false;
    if (typeof obj.reasoning !== "string") return false;

    for (const guess of obj.guesses) {
        if (!guess || typeof guess !== "object") return false;
        const g = guess as Record<string, unknown>;
        if (typeof g.label !== "string" || g.label.trim() === "") return false;
        if (typeof g.confidence !== "number") return false;
        if (g.confidence < 0 || g.confidence > 100) return false;
    }

    return true;
}

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");

    // 1. CORS origin check
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    // 2. OPTIONS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // 3. JWT auth — all authenticated users (students) may use this endpoint
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

    const consentRejection = await ensureAiInteractionConsent(supabase, user, corsHeaders);
    if (consentRejection) return consentRejection;

    const schoolId = getUserSchoolId(user);

    // 4. Parse and validate request body
    let body: {
        imageBase64?: unknown;
        prompt?: unknown;       // received but intentionally ignored
        possibleLabels?: unknown;
        clientRequestId?: unknown;
    };

    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const requestId = resolveAiRequestId(body.clientRequestId);
    const responseHeaders = { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": requestId };
    const model = getMistralVisionModel();

    if (!body.imageBase64 || typeof body.imageBase64 !== "string") {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: responseHeaders },
        );
    }

    // 5. Rate limiting: 10 req/min per user
    const rateKey = `analyzeDrawing:${user.id}`;
    const rateCheck = await checkDurableRateLimit(rateKey, RATE_LIMIT, authHeader);
    if (!rateCheck.allowed) {
        logAiUsageEvent({
            requestId,
            endpoint: "analyzeDrawing",
            provider: "mistral",
            model,
            status: "rate_limited",
            userId: user.id,
            schoolId,
            imageCount: 1,
            metadata: { limit: rateCheck.limit, retry_after_ms: rateCheck.retryAfterMs },
        }).catch((err) => console.error("[analyzeDrawing] Usage log error:", err));
        return rateLimitResponse(rateCheck, { ...corsHeaders, "X-AI-Request-Id": requestId });
    }

    // Strip data URL prefix if present (e.g. "data:image/png;base64,...")
    let imageBase64 = body.imageBase64;
    let mimeType = "image/png";

    if (imageBase64.startsWith("data:")) {
        const commaIndex = imageBase64.indexOf(",");
        if (commaIndex === -1) {
            return new Response(
                JSON.stringify({ error: "Ongeldige invoer." }),
                { status: 400, headers: responseHeaders },
            );
        }
        // Extract mime type from "data:image/png;base64"
        const meta = imageBase64.slice(5, commaIndex); // e.g. "image/png;base64"
        const detectedMime = meta.split(";")[0];
        if (detectedMime) mimeType = detectedMime;
        imageBase64 = imageBase64.slice(commaIndex + 1);
    }

    if (imageBase64.length > MAX_BASE64_LENGTH) {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: responseHeaders },
        );
    }

    // 6. Build server-side prompt
    // The client-sent `prompt` is intentionally ignored (prompt injection prevention).
    // Only `possibleLabels` (validated as string array) may extend the base prompt.
    let serverPrompt = BASE_SERVER_PROMPT;

    if (Array.isArray(body.possibleLabels) && body.possibleLabels.length > 0) {
        // Validate that possibleLabels contains only short plain strings (max 50 chars each, max 20 labels)
        const safeLabels = (body.possibleLabels as unknown[])
            .filter((l): l is string => typeof l === "string" && l.trim().length > 0 && l.length <= 50)
            .slice(0, 20)
            .map((l) => l.trim().replace(/[<>"'`]/g, "")); // strip HTML/template injection characters

        if (safeLabels.length > 0) {
            const labelText = safeLabels.join(", ");
            const labelSanitization = sanitizePrompt(labelText);
            if (labelSanitization.wasBlocked) {
                logAiUsageEvent({
                    requestId,
                    endpoint: "analyzeDrawing",
                    provider: "mistral",
                    model,
                    status: "blocked",
                    userId: user.id,
                    schoolId,
                    inputChars: labelText.length,
                    imageCount: 1,
                    metadata: { reason: "label_sanitizer", detection_label: labelSanitization.detectionLabel ?? "unknown" },
                }).catch((err) => console.error("[analyzeDrawing] Usage log error:", err));
                return new Response(
                    JSON.stringify({ error: "Tekening kon niet worden geanalyseerd." }),
                    { status: 422, headers: responseHeaders },
                );
            }
            serverPrompt += `\n\nHet doel was om een van deze objecten te tekenen: ${labelSanitization.sanitized}.`;
        }
    }

    const dataUrl = `data:${mimeType};base64,${imageBase64}`;

    let result;
    try {
        result = await completeMistralVisionJson({
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: serverPrompt },
                    { type: "image_url", image_url: dataUrl },
                ],
            }],
            maxTokens: 512,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[analyzeDrawing] Mistral vision error:", message);
        logAiUsageEvent({
            requestId,
            endpoint: "analyzeDrawing",
            provider: "mistral",
            model,
            status: message.includes("429") ? "rate_limited" : "error",
            userId: user.id,
            schoolId,
            inputChars: serverPrompt.length,
            imageCount: 1,
            metadata: { error_stage: "provider" },
        }).catch((logErr) => console.error("[analyzeDrawing] Usage log error:", logErr));
        if (message.includes("429")) {
            return new Response(
                JSON.stringify({ error: "Te veel verzoeken. Wacht even." }),
                { status: 429, headers: responseHeaders },
            );
        }
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: responseHeaders },
        );
    }

    // 8. Extract and parse the JSON from the Mistral response text
    const rawText = result.text;

    let analysis: DrawingAnalysis;

    try {
        const parsed: unknown = extractJsonObject(rawText);

        if (!validateAnalysis(parsed)) {
            throw new Error("Response schema validation failed");
        }

        analysis = parsed;
    } catch (err) {
        console.error("[analyzeDrawing] Parse/validation error:", err);
        logAiUsageEvent({
            requestId,
            endpoint: "analyzeDrawing",
            provider: "mistral",
            model: result.model,
            status: "error",
            userId: user.id,
            schoolId,
            inputChars: serverPrompt.length,
            outputChars: rawText.length,
            imageCount: 1,
            usagePayload: result.usagePayload,
            metadata: { error_stage: "parse", possible_label_count: Array.isArray(body.possibleLabels) ? body.possibleLabels.length : 0 },
        }).catch((logErr) => console.error("[analyzeDrawing] Usage log error:", logErr));
        return new Response(
            JSON.stringify({ error: "Tekening kon niet worden geanalyseerd." }),
            { status: 422, headers: responseHeaders },
        );
    }

    logAiUsageEvent({
        requestId,
        endpoint: "analyzeDrawing",
        provider: "mistral",
        model: result.model,
        status: "ok",
        userId: user.id,
        schoolId,
        inputChars: serverPrompt.length,
        outputChars: rawText.length,
        imageCount: 1,
        usagePayload: result.usagePayload,
        metadata: {
            mime_type: mimeType,
            possible_label_count: Array.isArray(body.possibleLabels) ? body.possibleLabels.length : 0,
        },
    }).catch((err) => console.error("[analyzeDrawing] Usage log error:", err));

    // Return validated response with rate limit headers
    return new Response(
        JSON.stringify(analysis),
        {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                "X-AI-Request-Id": requestId,
                ...rateLimitHeaders(rateCheck),
            },
        },
    );
});
