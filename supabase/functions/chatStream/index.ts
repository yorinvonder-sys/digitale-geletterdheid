/**
 * Edge Function: /chatStream — Streaming AI Chat Proxy (SSE, Mistral AI)
 *
 * Identical security layers as /chat, but streams the Mistral AI response
 * back to the client via Server-Sent Events for real-time text display.
 *
 * Security layers:
 * 1. JWT auth verification (Supabase)
 * 2. Server-side prompt injection filtering (mirrors client-side)
 * 3. Server-side rate limiting (15 req/min per user)
 * 4. Mistral AI (EU provider) — processes learner chat requests
 * 5. API key auth via secret (Bearer header, never in URL, never logged)
 * 6. Server-side system instruction lookup via roleId (prevents prompt injection via systemInstruction)
 *
 * Privacy: no learner PII is sent to Mistral — only the sanitized message,
 * sanitized history and a server-side role instruction.
 */
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { rateLimitHeaders } from "../_shared/rateLimiter.ts";
import {
    validateAndParseRequest,
    selectModel,
    buildGenerationConfig,
} from "../_shared/chatCore.ts";
import {
    getMistralApiKey,
    getMistralUrl,
    buildMistralPayload,
    extractMistralStreamDelta,
    chunkHasUsage,
} from "../_shared/mistralClient.ts";
import { filterStreamChunk } from "../_shared/outputFilter.ts";
import { detectAndLogStepComplete } from "../_shared/stepCompleteDetector.ts";
import { countTextChars, logAiUsageEvent } from "../_shared/aiUsageLogger.ts";

const AI_PROVIDER = "mistral";

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const validated = await validateAndParseRequest(req, corsHeaders, "chat-stream");
    if (validated instanceof Response) return validated;

    // Forward sanitized message to Mistral AI streaming endpoint
    let geminiResponse: Response;
    const hasGameContext = !!(validated.body.gameContext && typeof validated.body.gameContext === "string");
    const model = selectModel(validated.body.roleId, hasGameContext);
    const generationConfig = buildGenerationConfig(validated.body.roleId, hasGameContext);
    const mistralPayload = buildMistralPayload(validated, model, generationConfig, true);
    const inputChars = countTextChars(validated.safeHistory.history) + validated.sanitized.length;
    const historyChars = countTextChars(validated.safeHistory.history);

    try {
        const apiKey = getMistralApiKey();

        geminiResponse = await fetch(getMistralUrl(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(mistralPayload),
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[chatStream] Mistral AI setup error:", message);
        logAiUsageEvent({
            requestId: validated.requestId,
            endpoint: "chatStream",
            provider: AI_PROVIDER,
            model,
            status: "error",
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

    if (!geminiResponse.ok) {
        const status = geminiResponse.status;
        const errBody = await geminiResponse.text().catch(() => "");
        console.error(`[chatStream] Mistral AI error (${status}):`, errBody);
        logAiUsageEvent({
            requestId: validated.requestId,
            endpoint: "chatStream",
            provider: AI_PROVIDER,
            model,
            status: status === 429 ? "rate_limited" : "error",
            userId: validated.userId,
            schoolId: validated.schoolId,
            inputChars,
            historyChars,
            gameContextChars: validated.body.gameContext?.length ?? 0,
            metadata: { http_status: status },
        }).catch((logErr) => console.error("[chatStream] Usage log error:", logErr));

        if (status === 429) {
            return new Response(
                JSON.stringify({ error: "rate_limit", reason: "Te veel verzoeken. Wacht even." }),
                { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": validated.requestId } },
            );
        }
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": validated.requestId } },
        );
    }

    // Stream the Mistral AI SSE response back to the client.
    // Mistral returns SSE events with JSON chunks and a terminating "data: [DONE]".
    // We transform each chunk into our simplified SSE format: data: {"text": "..."}\n\n
    const reader = geminiResponse.body?.getReader();
    if (!reader) {
        return new Response(
            JSON.stringify({ error: "Geen stream beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
        async start(controller) {
            let buffer = "";
            let accumulatedText = "";
            let streamBlocked = false;
            let usagePayload: unknown = null;
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (streamBlocked) continue; // drain remaining chunks silently

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    // Keep the last (potentially incomplete) line in the buffer
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue;
                        const jsonStr = line.slice(6).trim();
                        if (!jsonStr || jsonStr === "[DONE]") continue;

                        try {
                            const chunk = JSON.parse(jsonStr);
                            if (chunkHasUsage(chunk)) {
                                usagePayload = chunk;
                            }
                            // Extract incremental text from Mistral SSE delta
                            const text = extractMistralStreamDelta(chunk);
                            if (text) {
                                accumulatedText += text;

                                // Check safety filter every 200 chars to limit overhead
                                if (accumulatedText.length % 200 < text.length) {
                                    const filterResult = filterStreamChunk(accumulatedText);
                                    if (!filterResult.safe) {
                                        console.warn(`[chatStream] Blocked output — category: ${filterResult.category}`);
                                        controller.enqueue(
                                            encoder.encode(`data: ${JSON.stringify({ text: `\n\n${filterResult.filtered}` })}\n\n`)
                                        );
                                        streamBlocked = true;
                                        break;
                                    }
                                }

                                controller.enqueue(
                                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                                );
                            }
                        } catch {
                            // Skip malformed JSON chunks
                        }
                    }
                }

                // Process any remaining buffer
                if (buffer.startsWith("data: ")) {
                    const jsonStr = buffer.slice(6).trim();
                    if (jsonStr && jsonStr !== "[DONE]") {
                        try {
                            const chunk = JSON.parse(jsonStr);
                            if (chunkHasUsage(chunk)) {
                                usagePayload = chunk;
                            }
                            const text = extractMistralStreamDelta(chunk);
                            if (text) {
                                accumulatedText += text;
                                controller.enqueue(
                                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                                );
                            }
                        } catch {
                            // Skip
                        }
                    }
                }

                // Server-side STEP_COMPLETE detection after stream ends (EU AI Act Art. 12)
                if (accumulatedText) {
                    detectAndLogStepComplete(accumulatedText, validated.userId, validated.body.roleId, validated.body.missionId)
                        .catch((err) => console.error("[chatStream] STEP_COMPLETE log error:", err));
                }

                logAiUsageEvent({
                    requestId: validated.requestId,
                    endpoint: "chatStream",
                    provider: AI_PROVIDER,
                    model,
                    status: streamBlocked ? "blocked" : "ok",
                    userId: validated.userId,
                    schoolId: validated.schoolId,
                    inputChars,
                    historyChars,
                    gameContextChars: validated.body.gameContext?.length ?? 0,
                    outputChars: accumulatedText.length,
                    usagePayload,
                    metadata: {
                        role_id: validated.body.roleId,
                        mission_id: validated.body.missionId,
                        stream_blocked: streamBlocked,
                    },
                }).catch((err) => console.error("[chatStream] Usage log error:", err));

                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
            } catch (err) {
                console.error("[chatStream] Stream error:", err);
                logAiUsageEvent({
                    requestId: validated.requestId,
                    endpoint: "chatStream",
                    provider: AI_PROVIDER,
                    model,
                    status: "error",
                    userId: validated.userId,
                    schoolId: validated.schoolId,
                    inputChars,
                    historyChars,
                    gameContextChars: validated.body.gameContext?.length ?? 0,
                    outputChars: accumulatedText.length,
                    usagePayload,
                    metadata: { error_stage: "stream" },
                }).catch((logErr) => console.error("[chatStream] Usage log error:", logErr));
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            ...corsHeaders,
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-AI-Request-Id": validated.requestId,
            ...rateLimitHeaders(validated.rateCheck),
        },
    });
});
