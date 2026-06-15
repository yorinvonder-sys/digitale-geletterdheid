/**
 * Edge Function: /chatStream — Streaming AI Chat Proxy (SSE)
 *
 * Identical security layers as /chat, but streams the Mistral response
 * back to the client via Server-Sent Events for real-time text display.
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
import { buildMistralMessages, streamMistralChat } from "../_shared/mistralClient.ts";
import { filterStreamChunk } from "../_shared/outputFilter.ts";
import { detectAndLogStepComplete } from "../_shared/stepCompleteDetector.ts";
import { countTextChars, logAiUsageEvent } from "../_shared/aiUsageLogger.ts";

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const validated = await validateAndParseRequest(req, corsHeaders, "chat-stream");
    if (validated instanceof Response) return validated;

    // Forward sanitized message to Mistral streaming endpoint
    let mistralResponse: Response;
    const hasGameContext = !!(validated.body.gameContext && typeof validated.body.gameContext === "string");
    let model = selectModel(validated.body.roleId, hasGameContext);
    const aiPayload = buildAiChatPayload(validated);
    const inputChars = countTextChars(aiPayload);
    const historyChars = countTextChars(validated.safeHistory.history);

    try {
        const result = await streamMistralChat({
            messages: buildMistralMessages(validated.systemInstruction, aiPayload.contents),
            temperature: aiPayload.generationConfig.temperature,
            maxTokens: aiPayload.generationConfig.maxOutputTokens,
        });
        mistralResponse = result.response;
        model = result.model;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[chatStream] Mistral setup error:", message);
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
            metadata: { error_stage: "setup" },
        }).catch((logErr) => console.error("[chatStream] Usage log error:", logErr));

        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": validated.requestId } },
        );
    }

    if (!mistralResponse.ok) {
        const status = mistralResponse.status;
        const errBody = await mistralResponse.text().catch(() => "");
        console.error(`[chatStream] Mistral error (${status}):`, errBody);
        logAiUsageEvent({
            requestId: validated.requestId,
            endpoint: "chatStream",
            provider: "mistral",
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

    // Stream the Mistral SSE response back to the client
    // We transform each chunk into our simplified SSE format: data: {"text": "..."}\n\n
    const reader = mistralResponse.body?.getReader();
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
                        if (!jsonStr) continue;

                        try {
                            const chunk = JSON.parse(jsonStr);
                            if (chunk?.usageMetadata || chunk?.usage_metadata) {
                                usagePayload = chunk;
                            }
                            if (chunk?.usage) {
                                usagePayload = chunk;
                            }
                            const text = chunk?.choices?.[0]?.delta?.content || chunk?.choices?.[0]?.message?.content;
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
                    if (jsonStr) {
                        try {
                            const chunk = JSON.parse(jsonStr);
                            if (chunk?.usageMetadata || chunk?.usage_metadata) {
                                usagePayload = chunk;
                            }
                            if (chunk?.usage) {
                                usagePayload = chunk;
                            }
                            const text = chunk?.choices?.[0]?.delta?.content || chunk?.choices?.[0]?.message?.content;
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
                    provider: "mistral",
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
                    provider: "mistral",
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
