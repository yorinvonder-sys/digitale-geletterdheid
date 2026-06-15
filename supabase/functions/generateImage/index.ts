/**
 * Edge Function: /generateImage — AI Image Generation via Black Forest Labs (FLUX)
 *
 * Security layers:
 * 1. CORS check (allowed origins only — no wildcards)
 * 2. OPTIONS preflight handling
 * 3. JWT auth verification (Supabase — no anonymous access)
 * 4. Rate limiting: 5 req/min per user (heavy operation)
 * 5. Input validation (prompt length, style whitelist, aspectRatio whitelist)
 * 6. Prompt sanitization via promptSanitizer (40+ injection patterns, NL + EN)
 * 7. Safety prefix prepended server-side (child-safe content instruction)
 * 8. Black Forest Labs FLUX (EU endpoint) — strict safety_tolerance for minors
 * 9. API key auth via secret (x-key header, never in URL, never logged)
 *
 * Privacy: only a sanitized, child-safe text prompt is sent to BFL — no learner
 * PII. The image is downloaded server-side and returned as base64 (no external
 * signed URL leaks to the client).
 *
 * Input:  { prompt: string, style: "book"|"branding"|"general", aspectRatio: string }
 * Output: { imageBase64: string, mimeType: string, model: string }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { checkDurableRateLimit, rateLimitResponse, rateLimitHeaders, type RateLimitResult } from "../_shared/rateLimiter.ts";
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";
import { ensureAiInteractionConsent } from "../_shared/consent.ts";
import { getUserSchoolId, logAiUsageEvent, resolveAiRequestId } from "../_shared/aiUsageLogger.ts";
import { generateBflImage, BFL_MODEL } from "../_shared/bflClient.ts";

// ── Constants ────────────────────────────────────────────────────────────────

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const AI_PROVIDER = "blackforestlabs";

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
            provider: AI_PROVIDER,
            model: BFL_MODEL,
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
            provider: AI_PROVIDER,
            model: BFL_MODEL,
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

    // 7. Build safe prompt with child-safety prefix and style prefix.
    // Aspect ratio is enforced via FLUX width/height, not via prompt text.
    const safePrompt =
        `${SAFETY_PREFIX}${STYLE_PREFIXES[style]}${sanitizeResult.sanitized} Geen tekst of watermerk in de afbeelding.`;

    // 8. Generate via Black Forest Labs (EU endpoint, async submit → poll → download)
    try {
        console.log(`[generateImage] Sending to Black Forest Labs model ${BFL_MODEL}...`);
        const result = await generateBflImage({ prompt: safePrompt, aspectRatio });

        if (!result.ok) {
            // Content moderated by BFL → treat as blocked (child-safety)
            if (result.moderated) {
                console.warn(`[generateImage] BFL moderation blocked request: ${result.reason}`);
                logAiUsageEvent({
                    requestId,
                    endpoint: "generateImage",
                    provider: AI_PROVIDER,
                    model: BFL_MODEL,
                    status: "blocked",
                    userId: user.id,
                    schoolId,
                    inputChars: safePrompt.length,
                    metadata: { reason: result.reason, style, aspect_ratio: aspectRatio },
                }).catch((err) => console.error("[generateImage] Usage log error:", err));
                return new Response(
                    JSON.stringify({ error: "Prompt bevat niet-toegestane inhoud." }),
                    { status: 400, headers: responseHeaders },
                );
            }

            console.error(`[generateImage] BFL failed: ${result.reason}`);
            logAiUsageEvent({
                requestId,
                endpoint: "generateImage",
                provider: AI_PROVIDER,
                model: BFL_MODEL,
                status: "error",
                userId: user.id,
                schoolId,
                inputChars: safePrompt.length,
                metadata: { reason: result.reason, style, aspect_ratio: aspectRatio },
            }).catch((err) => console.error("[generateImage] Usage log error:", err));
            return unavailableResponse(corsHeaders, requestId, "Beeldgeneratie gaf geen resultaat terug.");
        }

        console.log("[generateImage] Image ready. mimeType:", result.mimeType, "base64 length:", result.imageBase64.length);
        logAiUsageEvent({
            requestId,
            endpoint: "generateImage",
            provider: AI_PROVIDER,
            model: result.model,
            status: "ok",
            userId: user.id,
            schoolId,
            inputChars: safePrompt.length,
            imageCount: 1,
            metadata: { style, aspect_ratio: aspectRatio },
        }).catch((err) => console.error("[generateImage] Usage log error:", err));
        return imageResponse(result.imageBase64, result.mimeType, result.model, corsHeaders, rateCheck, requestId);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[generateImage] Unhandled error:", message);
        logAiUsageEvent({
            requestId,
            endpoint: "generateImage",
            provider: AI_PROVIDER,
            model: BFL_MODEL,
            status: "error",
            userId: user.id,
            schoolId,
            inputChars: safePrompt.length,
            metadata: { error_stage: "unhandled" },
        }).catch((logErr) => console.error("[generateImage] Usage log error:", logErr));
        return unavailableResponse(corsHeaders, requestId);
    }
});
