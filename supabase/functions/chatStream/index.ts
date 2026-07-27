/**
 * Edge Function: /chatStream — Streaming AI Chat Proxy (SSE)
 *
 * Identical security layers as /chat, but keeps the SSE response shape.
 * For child-safety, provider output is fully moderated before any text is sent
 * to the client.
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
import { filterAiOutput, SAFE_FALLBACK_MESSAGE, SAFETY_UNAVAILABLE_MESSAGE } from "../_shared/outputFilter.ts";
import { moderateText } from "../_shared/moderationClient.ts";
import { detectAndLogStepComplete } from "../_shared/stepCompleteDetector.ts";
import { countTextChars, logAiUsageEvent } from "../_shared/aiUsageLogger.ts";

function buildSseTextResponse(text: string, headers: Record<string, string>): Response {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            ...headers,
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const validated = await validateAndParseRequest(req, corsHeaders, "chat-stream");
    if (validated instanceof Response) return validated;

    // Keep the SSE contract, but moderate full provider output before sending.
    const hasGameContext = !!(validated.body.gameContext && typeof validated.body.gameContext === "string");
    let model = selectModel(validated.body.roleId, hasGameContext);
    const aiPayload = buildAiChatPayload(validated);
    const inputChars = countTextChars(aiPayload);
    const historyChars = countTextChars(validated.safeHistory.history);

    // Input moderation (Mistral classifier) — blokkeer vóór we streamen.
    const inputModeration = await moderateText(validated.sanitized);
    if (inputModeration.errored) {
        logAiUsageEvent({
            requestId: validated.requestId,
            endpoint: "chatStream",
            provider: "mistral",
            model,
            status: "error",
            userId: validated.userId,
            schoolId: validated.schoolId,
            inputChars,
            historyChars,
            metadata: {
                reason: "moderation_unavailable_fail_closed",
                moderation_stage: "input",
                moderation_error_reason: inputModeration.errorReason ?? "unknown",
            },
        }).catch((err) => console.error("[chatStream] Usage log error:", err));

        return buildSseTextResponse(SAFETY_UNAVAILABLE_MESSAGE, {
            ...corsHeaders,
            "X-AI-Request-Id": validated.requestId,
            ...rateLimitHeaders(validated.rateCheck),
        });
    }

    if (inputModeration.flagged) {
        logAiUsageEvent({
            requestId: validated.requestId,
            endpoint: "chatStream",
            provider: "mistral",
            model,
            status: "blocked",
            userId: validated.userId,
            schoolId: validated.schoolId,
            inputChars,
            historyChars,
            metadata: { reason: "moderation_input", moderation_categories: inputModeration.categories.join(",") },
        }).catch((err) => console.error("[chatStream] Usage log error:", err));

        return buildSseTextResponse(SAFE_FALLBACK_MESSAGE, {
            ...corsHeaders,
            "X-AI-Request-Id": validated.requestId,
            ...rateLimitHeaders(validated.rateCheck),
        });
    }

    let result: Awaited<ReturnType<typeof completeMistralChat>>;
    try {
        result = await completeMistralChat({
            messages: buildMistralMessages(validated.systemInstruction, aiPayload.contents),
            temperature: aiPayload.generationConfig.temperature,
            maxTokens: aiPayload.generationConfig.maxOutputTokens,
        });
        model = result.model;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[chatStream] Mistral setup error:", message);
        logAiUsageEvent({
            requestId: validated.requestId,
            endpoint: "chatStream",
            provider: "mistral",
            model,
            status: message.includes("429") ? "rate_limited" : "error",
            userId: validated.userId,
            schoolId: validated.schoolId,
            inputChars,
            historyChars,
            gameContextChars: validated.body.gameContext?.length ?? 0,
            metadata: { error_stage: "setup" },
        }).catch((logErr) => console.error("[chatStream] Usage log error:", logErr));

        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": validated.requestId } },
        );
    }

    const rawText = result.text;
    const filterResult = filterAiOutput(rawText);
    let text = filterResult.safe ? rawText : (filterResult.filtered || SAFE_FALLBACK_MESSAGE);
    let outputBlockReason: string | null = filterResult.safe ? null : `regex:${filterResult.category}`;

    if (filterResult.safe) {
        const outputModeration = await moderateText(rawText);
        if (outputModeration.errored) {
            logAiUsageEvent({
                requestId: validated.requestId,
                endpoint: "chatStream",
                provider: "mistral",
                model,
                status: "error",
                userId: validated.userId,
                schoolId: validated.schoolId,
                inputChars,
                historyChars,
                gameContextChars: validated.body.gameContext?.length ?? 0,
                outputChars: 0,
                usagePayload: result.usagePayload,
                metadata: {
                    role_id: validated.body.roleId,
                    mission_id: validated.body.missionId,
                    reason: "moderation_unavailable_fail_closed",
                    moderation_stage: "output",
                    moderation_error_reason: outputModeration.errorReason ?? "unknown",
                },
            }).catch((logErr) => console.error("[chatStream] Usage log error:", logErr));

            return buildSseTextResponse(SAFETY_UNAVAILABLE_MESSAGE, {
                ...corsHeaders,
                "X-AI-Request-Id": validated.requestId,
                ...rateLimitHeaders(validated.rateCheck),
            });
        }

        if (outputModeration.flagged) {
            text = SAFE_FALLBACK_MESSAGE;
            outputBlockReason = `moderation:${outputModeration.categories.join("|")}`;
        }
    }

    const outputSafe = outputBlockReason === null;

    if (outputSafe && rawText) {
        detectAndLogStepComplete(rawText, validated.userId, validated.body.roleId, validated.body.missionId)
            .catch((err) => console.error("[chatStream] STEP_COMPLETE log error:", err));
    }

    logAiUsageEvent({
        requestId: validated.requestId,
        endpoint: "chatStream",
        provider: "mistral",
        model,
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
            output_filter: outputBlockReason ?? "safe",
            delivery_mode: "moderated_full_sse",
        },
    }).catch((err) => console.error("[chatStream] Usage log error:", err));

    return buildSseTextResponse(text, {
        ...corsHeaders,
        "X-AI-Request-Id": validated.requestId,
        ...rateLimitHeaders(validated.rateCheck),
    });
});
