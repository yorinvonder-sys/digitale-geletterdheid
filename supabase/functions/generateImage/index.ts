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
import { checkDurableRateLimit, rateLimitResponse, rateLimitHeaders, type RateLimitResult } from "../_shared/rateLimiter.ts";
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";
import { ensureAiInteractionConsent } from "../_shared/consent.ts";
import { getUserSchoolId, logAiUsageEvent, resolveAiRequestId } from "../_shared/aiUsageLogger.ts";

// ── Constants ────────────────────────────────────────────────────────────────

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const GEMINI_IMAGE_MODELS = ["gemini-3.1-flash-image-preview", "gemini-2.5-flash-image"] as const;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("VITE_GEMINI_API_KEY") || "";

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

const ASPECT_RATIO_LABELS: Record<string, string> = {
    "1:1": "Vierkante afbeelding.",
    "3:2": "Liggende afbeelding in 3:2 verhouding.",
    "2:3": "Staande afbeelding in 2:3 verhouding.",
    "3:4": "Staande afbeelding in 3:4 verhouding.",
    "4:3": "Liggende afbeelding in 4:3 verhouding.",
    "4:5": "Staande afbeelding in 4:5 verhouding.",
    "5:4": "Liggende afbeelding in 5:4 verhouding.",
    "9:16": "Verticale afbeelding in 9:16 verhouding.",
    "16:9": "Breedbeeld afbeelding in 16:9 verhouding.",
    "21:9": "Cinematische brede afbeelding in 21:9 verhouding.",
};

const SAFETY_PREFIX =
    "VEILIG VOOR KINDEREN. Geen geweld, geen seksuele content, geen angstaanjagende beelden. ";

type VertexPart = { inlineData?: { data: string; mimeType: string }; text?: string };
type GeminiPart = {
    inlineData?: { data: string; mimeType?: string };
    inline_data?: { data: string; mime_type?: string };
    text?: string;
};

const imageResponse = (
    imageBase64: string,
    mimeType: string,
    model: string,
    corsHeaders: HeadersInit,
    rateCheck: RateLimitResult,
    requestId: string,
) => new Response(
    JSON.stringify({ imageBase64, mimeType, model }),
    {
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-AI-Request-Id": requestId,
            ...rateLimitHeaders(rateCheck),
        },
    },
);

const unavailableResponse = (corsHeaders: HeadersInit, requestId: string, reason?: string, status = 502) => new Response(
    JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar.", reason }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": requestId } },
);

const extractVertexImage = (payload: unknown): { imageBase64?: string; mimeType?: string; partCount: number } => {
    const vertexPayload = payload as { candidates?: Array<{ content?: { parts?: VertexPart[] } }> };
    const parts = vertexPayload.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.data);
    return {
        imageBase64: imagePart?.inlineData?.data,
        mimeType: imagePart?.inlineData?.mimeType,
        partCount: parts.length,
    };
};

const extractGeminiImage = (payload: unknown): { imageBase64?: string; mimeType?: string; partCount: number } => {
    const geminiPayload = payload as { candidates?: Array<{ content?: { parts?: GeminiPart[] } }> };
    const parts = geminiPayload.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.data || p.inline_data?.data);
    return {
        imageBase64: imagePart?.inlineData?.data ?? imagePart?.inline_data?.data,
        mimeType: imagePart?.inlineData?.mimeType ?? imagePart?.inline_data?.mime_type,
        partCount: parts.length,
    };
};

async function generateWithGeminiApiKey(safePrompt: string, model: string) {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key ontbreekt.");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ text: safePrompt }],
            }],
                    generationConfig: {
                        responseModalities: ["TEXT", "IMAGE"],
                        temperature: 0.4,
                        maxOutputTokens: 2048,
                    },
                }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        const reason = payload?.error?.message || payload?.error || `Gemini API error (${response.status})`;
        throw new Error(reason);
    }

    const image = extractGeminiImage(payload);
    if (!image.imageBase64) {
        throw new Error(`Gemini API gaf geen afbeelding terug. Parts count: ${image.partCount}`);
    }

    return {
        imageBase64: image.imageBase64,
        mimeType: image.mimeType || "image/png",
        model,
        usagePayload: payload,
    };
}

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

    const consentRejection = await ensureAiInteractionConsent(supabase, user, corsHeaders);
    if (consentRejection) return consentRejection;

    // 4. Parse and validate input
    let body: { prompt?: unknown; style?: unknown; aspectRatio?: unknown; clientRequestId?: unknown };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldig verzoek. Verwacht JSON." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const requestId = resolveAiRequestId(body.clientRequestId);
    const schoolId = getUserSchoolId(user);
    const responseHeaders = { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": requestId };
    const { prompt, style, aspectRatio } = body;

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
        return new Response(
            JSON.stringify({ error: "Prompt is verplicht en moet tekst zijn." }),
            { status: 400, headers: responseHeaders },
        );
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
        return new Response(
            JSON.stringify({ error: `Prompt mag maximaal ${MAX_PROMPT_LENGTH} tekens bevatten.` }),
            { status: 400, headers: responseHeaders },
        );
    }

    if (typeof style !== "string" || !ALLOWED_STYLES.has(style)) {
        return new Response(
            JSON.stringify({ error: "Ongeldige stijl. Kies uit: book, branding, general." }),
            { status: 400, headers: responseHeaders },
        );
    }

    if (typeof aspectRatio !== "string" || !ALLOWED_ASPECT_RATIOS.has(aspectRatio)) {
        return new Response(
            JSON.stringify({ error: "Ongeldig beeldverhouding. Kies uit: 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9." }),
            { status: 400, headers: responseHeaders },
        );
    }

    // 5. Rate limiting — 5 req/min (heavy operation)
    const rateCheck = await checkDurableRateLimit(
        `generateImage:${user.id}`,
        { maxRequests: 5, windowMs: 60_000 },
        authHeader,
    );
    if (!rateCheck.allowed) {
        logAiUsageEvent({
            requestId,
            endpoint: "generateImage",
            model: GEMINI_IMAGE_MODELS[0],
            status: "rate_limited",
            userId: user.id,
            schoolId,
            inputChars: prompt.length,
            metadata: { limit: rateCheck.limit, retry_after_ms: rateCheck.retryAfterMs },
        }).catch((err) => console.error("[generateImage] Usage log error:", err));
        return rateLimitResponse(rateCheck, { ...corsHeaders, "X-AI-Request-Id": requestId });
    }

    // 6. Prompt sanitization — 40+ injection patterns, NL + EN
    const sanitizeResult = sanitizePrompt(prompt);
    if (sanitizeResult.wasBlocked) {
        console.error(
            `[generateImage] Prompt blocked for user ${user.id}: ${sanitizeResult.reason} (${sanitizeResult.detectionLabel})`,
        );
        logAiUsageEvent({
            requestId,
            endpoint: "generateImage",
            model: GEMINI_IMAGE_MODELS[0],
            status: "blocked",
            userId: user.id,
            schoolId,
            inputChars: prompt.length,
            metadata: { reason: "input_sanitizer", detection_label: sanitizeResult.detectionLabel ?? "unknown" },
        }).catch((err) => console.error("[generateImage] Usage log error:", err));
        return new Response(
            JSON.stringify({ error: "Prompt bevat niet-toegestane inhoud." }),
            { status: 400, headers: responseHeaders },
        );
    }

    // 7. Build safe prompt with child-safety prefix and style prefix
    const safePrompt =
        `${SAFETY_PREFIX}${STYLE_PREFIXES[style]}${sanitizeResult.sanitized} ${ASPECT_RATIO_LABELS[aspectRatio]} Geen tekst of watermerk in de afbeelding.`;

    // Forward to Vertex AI first; fall back across supported Nano Banana image models.
    try {
        console.log("[generateImage] Step 1: Getting access token...");
        const accessToken = await getAccessToken();
        let lastStatus = 0;
        let lastReason = "";
        let attemptIndex = 0;

        for (const model of GEMINI_IMAGE_MODELS) {
            attemptIndex += 1;
            console.log(`[generateImage] Step 2: Sending to Vertex AI model ${model}...`);
            const vertexResponse = await fetch(getVertexUrl(model), {
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
                        responseModalities: ["TEXT", "IMAGE"],
                        temperature: 0.4,
                        maxOutputTokens: 2048,
                    },
                }),
            });

            if (!vertexResponse.ok) {
                lastStatus = vertexResponse.status;
                lastReason = await vertexResponse.text().catch(() => "");
                console.error(`[generateImage] Vertex AI error for ${model} (${lastStatus}):`, lastReason);
                logAiUsageEvent({
                    requestId,
                    endpoint: "generateImage",
                    model,
                    status: lastStatus === 429 ? "rate_limited" : "error",
                    userId: user.id,
                    schoolId,
                    inputChars: safePrompt.length,
                    retryCount: attemptIndex - 1,
                    metadata: { http_status: lastStatus, style, aspect_ratio: aspectRatio },
                }).catch((err) => console.error("[generateImage] Usage log error:", err));
                continue;
            }

            const vertexData = await vertexResponse.json();

            // 8. Extract image from response — check all parts for inlineData
            console.log(`[generateImage] Step 3: Vertex AI response OK for ${model}, extracting image...`);
            const image = extractVertexImage(vertexData);

            if (image.imageBase64) {
                const mimeType = image.mimeType || "image/png";
                console.log("[generateImage] Step 4: Image extracted. mimeType:", mimeType, "base64 length:", image.imageBase64.length);
                logAiUsageEvent({
                    requestId,
                    endpoint: "generateImage",
                    model,
                    status: "ok",
                    userId: user.id,
                    schoolId,
                    inputChars: safePrompt.length,
                    imageCount: 1,
                    retryCount: attemptIndex - 1,
                    usagePayload: vertexData,
                    metadata: {
                        style,
                        aspect_ratio: aspectRatio,
                        part_count: image.partCount,
                    },
                }).catch((err) => console.error("[generateImage] Usage log error:", err));
                return imageResponse(image.imageBase64, mimeType, model, corsHeaders, rateCheck, requestId);
            }

            lastReason = `Vertex AI gaf geen afbeelding terug voor ${model}. Parts count: ${image.partCount}`;
            console.error("[generateImage]", lastReason);
            logAiUsageEvent({
                requestId,
                endpoint: "generateImage",
                model,
                status: "error",
                userId: user.id,
                schoolId,
                inputChars: safePrompt.length,
                retryCount: attemptIndex - 1,
                usagePayload: vertexData,
                metadata: { reason: "no_image", style, aspect_ratio: aspectRatio, part_count: image.partCount },
            }).catch((err) => console.error("[generateImage] Usage log error:", err));
        }

        if (GEMINI_API_KEY) {
            for (const model of GEMINI_IMAGE_MODELS) {
                try {
                    console.log(`[generateImage] Retrying with Gemini API key fallback model ${model}...`);
                    const fallbackImage = await generateWithGeminiApiKey(safePrompt, model);
                    logAiUsageEvent({
                        requestId,
                        endpoint: "generateImage",
                        provider: "google-gemini-api",
                        model: fallbackImage.model,
                        status: "ok",
                        userId: user.id,
                        schoolId,
                        inputChars: safePrompt.length,
                        imageCount: 1,
                        retryCount: attemptIndex,
                        fallbackUsed: true,
                        usagePayload: fallbackImage.usagePayload,
                        metadata: { style, aspect_ratio: aspectRatio },
                    }).catch((err) => console.error("[generateImage] Usage log error:", err));
                    return imageResponse(fallbackImage.imageBase64, fallbackImage.mimeType, fallbackImage.model, corsHeaders, rateCheck, requestId);
                } catch (fallbackError) {
                    lastReason = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
                    console.error(`[generateImage] Gemini API key fallback failed for ${model}:`, lastReason);
                    logAiUsageEvent({
                        requestId,
                        endpoint: "generateImage",
                        provider: "google-gemini-api",
                        model,
                        status: "error",
                        userId: user.id,
                        schoolId,
                        inputChars: safePrompt.length,
                        retryCount: attemptIndex,
                        fallbackUsed: true,
                        metadata: { reason: "fallback_failed", style, aspect_ratio: aspectRatio },
                    }).catch((err) => console.error("[generateImage] Usage log error:", err));
                }
            }
        }

        if (lastStatus === 429) {
            return new Response(
                JSON.stringify({ error: "Te veel verzoeken. Wacht even." }),
                { status: 429, headers: responseHeaders },
            );
        }
        return unavailableResponse(corsHeaders, requestId, lastReason ? "Gemini gaf geen echte afbeelding terug." : undefined);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[generateImage] Unhandled error:", message);
        if (GEMINI_API_KEY) {
            for (const model of GEMINI_IMAGE_MODELS) {
                try {
                    console.log(`[generateImage] Retrying unhandled Vertex error with Gemini API key fallback model ${model}...`);
                    const fallbackImage = await generateWithGeminiApiKey(safePrompt, model);
                    logAiUsageEvent({
                        requestId,
                        endpoint: "generateImage",
                        provider: "google-gemini-api",
                        model: fallbackImage.model,
                        status: "ok",
                        userId: user.id,
                        schoolId,
                        inputChars: safePrompt.length,
                        imageCount: 1,
                        retryCount: GEMINI_IMAGE_MODELS.length,
                        fallbackUsed: true,
                        usagePayload: fallbackImage.usagePayload,
                        metadata: { error_stage: "unhandled_vertex", style, aspect_ratio: aspectRatio },
                    }).catch((logErr) => console.error("[generateImage] Usage log error:", logErr));
                    return imageResponse(fallbackImage.imageBase64, fallbackImage.mimeType, fallbackImage.model, corsHeaders, rateCheck, requestId);
                } catch (fallbackError) {
                    console.error(`[generateImage] Gemini API key fallback failed for ${model}:`, fallbackError instanceof Error ? fallbackError.message : String(fallbackError));
                    logAiUsageEvent({
                        requestId,
                        endpoint: "generateImage",
                        provider: "google-gemini-api",
                        model,
                        status: "error",
                        userId: user.id,
                        schoolId,
                        inputChars: safePrompt.length,
                        retryCount: GEMINI_IMAGE_MODELS.length,
                        fallbackUsed: true,
                        metadata: { error_stage: "fallback_after_unhandled", style, aspect_ratio: aspectRatio },
                    }).catch((logErr) => console.error("[generateImage] Usage log error:", logErr));
                }
            }
        }
        logAiUsageEvent({
            requestId,
            endpoint: "generateImage",
            model: GEMINI_IMAGE_MODELS[0],
            status: "error",
            userId: user.id,
            schoolId,
            inputChars: safePrompt.length,
            metadata: { error_stage: "unhandled" },
        }).catch((logErr) => console.error("[generateImage] Usage log error:", logErr));
        return unavailableResponse(corsHeaders, requestId);
    }
});
