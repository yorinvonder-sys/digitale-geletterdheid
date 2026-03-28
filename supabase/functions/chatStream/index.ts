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
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";
import { getAccessToken, getVertexStreamUrl } from "../_shared/vertexAuth.ts";
import { getSystemInstruction, isValidRoleId } from "../_shared/systemInstructions.ts";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { buildSafeHistory } from "../_shared/chatHistory.ts";
import { checkDurableRateLimit, rateLimitResponse } from "../_shared/rateLimiter.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const MAX_REQUEST_BYTES = 500_000;
const MAX_MESSAGE_LENGTH = 150_000;
const DEFAULT_STREAM_MODEL = "gemini-3-flash-preview";
const CODE_STREAM_MODEL = "gemini-2.5-pro";
const DEFAULT_STREAM_TEMPERATURE = 0.7;
const CODE_STREAM_TEMPERATURE = 0.2;

function selectModel(roleId: string, hasGameContext: boolean): string {
    if (roleId === "game-programmeur" || hasGameContext) {
        return CODE_STREAM_MODEL;
    }
    return DEFAULT_STREAM_MODEL;
}

function buildGenerationConfig(roleId: string, hasGameContext: boolean) {
    const isCodeMode = roleId === "game-programmeur" || hasGameContext;

    return {
        maxOutputTokens: isCodeMode ? 50_000 : 1024,
        temperature: isCodeMode ? CODE_STREAM_TEMPERATURE : DEFAULT_STREAM_TEMPERATURE,
    };
}

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const contentLength = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
        return new Response(
            JSON.stringify({ error: "Verzoek is te groot." }),
            { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 1. Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(
            JSON.stringify({ error: "Ongeldige sessie." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 2. Rate limit: 15 requests per minute per user
    const rateCheck = await checkDurableRateLimit(
        `chat-stream:${user.id}`,
        { maxRequests: 15, windowMs: 60_000 },
        authHeader,
    );
    if (!rateCheck.allowed) {
        return rateLimitResponse(rateCheck, corsHeaders);
    }

    // 3. Parse request
    // SECURITY: systemInstruction is server-side only — never trust client input
    let body: { message?: string; roleId?: string; history?: unknown[]; gameContext?: string };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige JSON." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (!body.message || typeof body.message !== "string" || body.message.length > MAX_MESSAGE_LENGTH) {
        return new Response(
            JSON.stringify({ error: "Bericht ontbreekt of is te lang." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // SECURITY: Validate roleId and look up system instruction server-side
    if (!body.roleId || typeof body.roleId !== "string" || !isValidRoleId(body.roleId)) {
        return new Response(
            JSON.stringify({ error: "Ongeldige of ontbrekende roleId." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
    const systemInstruction = getSystemInstruction(body.roleId)!;

    // 3. Server-side prompt injection check (defense-in-depth)
    const validation = sanitizePrompt(body.message);
    if (validation.wasBlocked) {
        console.warn(
            `[INJECTION_BLOCKED] user=${user.id} label=${validation.detectionLabel}`
        );
        return new Response(
            JSON.stringify({
                error: "blocked",
                reason: "Je bericht bevat een patroon dat niet is toegestaan.",
            }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const safeHistory = buildSafeHistory(body.history, {
        maxMessages: 20,
        maxPartsPerMessage: 2,
        maxPartChars: 50_000,
        maxTotalChars: 120_000,
    });

    if (safeHistory.blocked) {
        console.warn(`[HISTORY_BLOCKED] user=${user.id} label=${safeHistory.detectionLabel}`);
        return new Response(
            JSON.stringify({
                error: "blocked",
                reason: "De gesprekshistorie bevat een patroon dat niet is toegestaan.",
            }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 4. Forward sanitized message to Gemini via Vertex AI streaming endpoint
    let geminiResponse: Response;
    try {
        const hasGameContext = !!(body.gameContext && typeof body.gameContext === "string");
        const model = selectModel(body.roleId, hasGameContext);
        const generationConfig = buildGenerationConfig(body.roleId, hasGameContext);
        const geminiUrl = getVertexStreamUrl(model);
        const accessToken = await getAccessToken();

        // Build user message parts — include game code context if provided
        // gameContext bypasses the sanitizer because it's our own application code, not user input
        const userParts: { text: string }[] = [];
        if (hasGameContext) {
            userParts.push({ text: `[HUIDIGE_GAME_CODE]\n${body.gameContext}\n[/HUIDIGE_GAME_CODE]\n\nKRITIEK: Dit is de HUIDIGE game van de leerling. Je MOET deze code aanpassen — NIET een nieuwe game maken. Verwerk het verzoek hieronder in de bestaande code en geef de VOLLEDIGE aangepaste versie terug.` });
        }
        userParts.push({ text: validation.sanitized });

        const contents = [
            ...safeHistory.history,
            { role: "user", parts: userParts },
        ];

        // 5. Safety settings for minors (12-18 year olds) — EU AI Act + child protection
        const safetySettings = [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ];

        geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                contents,
                safetySettings,
                systemInstruction: { parts: [{ text: systemInstruction }] },
                generationConfig,
            }),
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[chatStream] Vertex AI setup error:", message);
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (!geminiResponse.ok) {
        const status = geminiResponse.status;
        const errBody = await geminiResponse.text().catch(() => "");
        console.error(`[chatStream] Vertex AI error (${status}):`, errBody);
        if (status === 429) {
            return new Response(
                JSON.stringify({ error: "rate_limit", reason: "Te veel verzoeken. Wacht even." }),
                { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 6. Stream the Vertex AI SSE response back to the client
    // Vertex AI with ?alt=sse returns SSE events with JSON chunks.
    // We transform each chunk into our simplified SSE format: data: {"text": "..."}\n\n
    const reader = geminiResponse.body?.getReader();
    if (!reader) {
        return new Response(
            JSON.stringify({ error: "Geen stream beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
