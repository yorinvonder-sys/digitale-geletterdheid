/**
 * Edge Function: /chat — AI Chat Proxy
 *
 * Security layers:
 * 1. JWT auth verification (Supabase)
 * 2. Server-side prompt injection filtering (mirrors client-side)
 * 3. Server-side rate limiting (15 req/min per user)
 * 4. Mistral API — server-side API key only
 * 5. No provider credentials in client responses
 * 6. Server-side system instruction lookup via roleId (prevents prompt injection via systemInstruction)
 */
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { rateLimitHeaders } from "../_shared/rateLimiter.ts";
import {
    validateAndParseRequest,
    buildAiChatPayload,
    selectModel,
} from "../_shared/chatCore.ts";
import { buildMistralMessages, completeMistralChat } from "../_shared/mistralClient.ts";
import { filterAiOutput, SAFE_FALLBACK_MESSAGE } from "../_shared/outputFilter.ts";
import { moderateText } from "../_shared/moderationClient.ts";
import { detectAndLogStepComplete } from "../_shared/stepCompleteDetector.ts";
import { countTextChars, logAiUsageEvent } from "../_shared/aiUsageLogger.ts";

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const validated = await validateAndParseRequest(req, corsHeaders, "chat");
    if (validated instanceof Response) return validated;

    // Forward sanitized message to Mistral.
    try {
        const hasGameContext = !!(validated.body.gameContext && typeof validated.body.gameContext === "string");
        const requestedModel = selectModel(validated.body.roleId, hasGameContext);
        const aiPayload = buildAiChatPayload(validated);
        const inputChars = countTextChars(aiPayload);
        const historyChars = countTextChars(validated.safeHistory.history);

        // Input moderation (Mistral classifier) — additioneel op de sanitizer.
        const inputModeration = await moderateText(validated.sanitized);
        if (inputModeration.flagged) {
            logAiUsageEvent({
                requestId: validated.requestId,
                endpoint: "chat",
                provider: "mistral",
                model: requestedModel,
                status: "blocked",
                userId: validated.userId,
                schoolId: validated.schoolId,
                inputChars,
                historyChars,
                metadata: { reason: "moderation_input", moderation_categories: inputModeration.categories.join(",") },
            }).catch((err) => console.error("[chat] Usage log error:", err));

            return new Response(JSON.stringify({ text: SAFE_FALLBACK_MESSAGE }), {
                headers: { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": validated.requestId, ...rateLimitHeaders(validated.rateCheck) },
            });
        }

        const result = await completeMistralChat({
            messages: buildMistralMessages(validated.systemInstruction, aiPayload.contents),
            temperature: aiPayload.generationConfig.temperature,
            maxTokens: aiPayload.generationConfig.maxOutputTokens,
        }).catch((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);
            console.error("[chat] Mistral error:", message);
            logAiUsageEvent({
                requestId: validated.requestId,
                endpoint: "chat",
                provider: "mistral",
                model: requestedModel,
                status: message.includes("429") ? "rate_limited" : "error",
                userId: validated.userId,
                schoolId: validated.schoolId,
                inputChars,
                historyChars,
                gameContextChars: validated.body.gameContext?.length ?? 0,
                metadata: { provider_error: true },
            }).catch((err) => console.error("[chat] Usage log error:", err));

            throw err;
        });

        const rawText = result.text;

        // Post-processing safety voor minderjarigen: goedkope regex-eerste-pass,
        // daarna Mistral-moderatie als de regex niets ving.
        const filterResult = filterAiOutput(rawText);
        let text = filterResult.safe ? rawText : (filterResult.filtered || SAFE_FALLBACK_MESSAGE);
        let outputBlockReason: string | null = filterResult.safe ? null : `regex:${filterResult.category}`;

        if (filterResult.safe) {
            const outputModeration = await moderateText(rawText);
            if (outputModeration.flagged) {
                text = SAFE_FALLBACK_MESSAGE;
                outputBlockReason = `moderation:${outputModeration.categories.join("|")}`;
            }
        }
        const outputSafe = outputBlockReason === null;
        console.log("[chat] Step 5: Success, text length:", text.length, outputSafe ? "" : `(blocked: ${outputBlockReason})`);

        logAiUsageEvent({
            requestId: validated.requestId,
            endpoint: "chat",
            provider: "mistral",
            model: result.model,
            status: outputSafe ? "ok" : "blocked",
            userId: validated.userId,
            schoolId: validated.schoolId,
            inputChars,
            historyChars,
            gameContextChars: validated.body.gameContext?.length ?? 0,
            outputChars: text.length,
            usagePayload: result.usagePayload,
            metadata: {
                role_id: validated.body.roleId,
                mission_id: validated.body.missionId,
                finish_reason: (result.usagePayload as any)?.choices?.[0]?.finish_reason,
                output_filter: outputBlockReason ?? "safe",
            },
        }).catch((err) => console.error("[chat] Usage log error:", err));

        // Server-side STEP_COMPLETE detection (EU AI Act Art. 12)
        detectAndLogStepComplete(rawText, validated.userId, validated.body.roleId, validated.body.missionId)
            .catch((err) => console.error("[chat] STEP_COMPLETE log error:", err));

        return new Response(JSON.stringify({ text }), {
            headers: { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": validated.requestId, ...rateLimitHeaders(validated.rateCheck) },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[chat] Unhandled error:", message);
        logAiUsageEvent({
            requestId: validated.requestId,
            endpoint: "chat",
            provider: "mistral",
            model: selectModel(validated.body.roleId, !!validated.body.gameContext),
            status: "error",
            userId: validated.userId,
            schoolId: validated.schoolId,
            inputChars: validated.sanitized.length,
            historyChars: countTextChars(validated.safeHistory.history),
            gameContextChars: validated.body.gameContext?.length ?? 0,
            metadata: { error_stage: "unhandled" },
        }).catch((logErr) => console.error("[chat] Usage log error:", logErr));
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": validated.requestId } },
        );
    }
});
