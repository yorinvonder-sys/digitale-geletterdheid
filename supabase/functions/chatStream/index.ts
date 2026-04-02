/**
 * Edge Function: /chatStream — Streaming AI Chat Proxy (SSE)
 *
 * Identical security layers as /chat, but streams the Vertex AI response
 * back to the client via Server-Sent Events for real-time text display.
 *
 * Security layers:
 * 1. JWT auth verification (Supabase)
 * 2. Server-side prompt injection filtering (mirrors client-side)
 * 3. Server-side rate limiting (15 req/min per user)
 * 4. Vertex AI (europe-west4) — enterprise ToS, no age restriction
 * 5. Service account auth (no API key in URL)
 * 6. Server-side system instruction lookup via roleId (prevents prompt injection via systemInstruction)
 */
import { getAccessToken, getVertexStreamUrl } from "../_shared/vertexAuth.ts";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import {
    validateAndParseRequest,
    buildVertexPayload,
    selectModel,
} from "../_shared/chatCore.ts";

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const validated = await validateAndParseRequest(req, corsHeaders, "chat-stream");
    if (validated instanceof Response) return validated;

    // Forward sanitized message to Gemini via Vertex AI streaming endpoint
    let geminiResponse: Response;
    try {
        const hasGameContext = !!(validated.body.gameContext && typeof validated.body.gameContext === "string");
        const model = selectModel(validated.body.roleId, hasGameContext);
        const geminiUrl = getVertexStreamUrl(model);
        const accessToken = await getAccessToken();

        geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(buildVertexPayload(validated)),
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[chatStream] Vertex AI setup error:", message);
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    if (!geminiResponse.ok) {
        const status = geminiResponse.status;
        const errBody = await geminiResponse.text().catch(() => "");
        console.error(`[chatStream] Vertex AI error (${status}):`, errBody);
        if (status === 429) {
            return new Response(
                JSON.stringify({ error: "rate_limit", reason: "Te veel verzoeken. Wacht even." }),
                { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // Stream the Vertex AI SSE response back to the client
    // Vertex AI with ?alt=sse returns SSE events with JSON chunks.
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
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

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
                            // Extract text from Vertex AI response structure
                            const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {
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
                            const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {
                                controller.enqueue(
                                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                                );
                            }
                        } catch {
                            // Skip
                        }
                    }
                }

                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
            } catch (err) {
                console.error("[chatStream] Stream error:", err);
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
        },
    });
});
