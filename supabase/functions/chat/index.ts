/**
 * Edge Function: /chat — AI Chat Proxy
 *
 * Security layers:
 * 1. JWT auth verification (Supabase)
 * 2. Server-side prompt injection filtering (mirrors client-side)
 * 3. Server-side rate limiting (15 req/min per user)
 * 4. Vertex AI (europe-west4) — enterprise ToS, no age restriction
 * 5. Service account auth (no API key in URL)
 * 6. Server-side system instruction lookup via roleId (prevents prompt injection via systemInstruction)
 */
import { getAccessToken, getVertexUrl } from "../_shared/vertexAuth.ts";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { rateLimitHeaders } from "../_shared/rateLimiter.ts";
import {
    validateAndParseRequest,
    buildVertexPayload,
    selectModel,
} from "../_shared/chatCore.ts";
import { filterAiOutput } from "../_shared/outputFilter.ts";
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

    // Forward sanitized message to Gemini via Vertex AI (EU endpoint)
    try {
        const hasGameContext = !!(validated.body.gameContext && typeof validated.body.gameContext === "string");
        const model = selectModel(validated.body.roleId, hasGameContext);
        const vertexPayload = buildVertexPayload(validated);
        const inputChars = countTextChars(vertexPayload);
        const historyChars = countTextChars(validated.safeHistory.history);

        console.log("[chat] Step 1: Building Vertex URL...");
        const geminiUrl = getVertexUrl(model);
        console.log("[chat] Step 2: Getting access token...");
        const accessToken = await getAccessToken();
        console.log("[chat] Step 3: Sending to Vertex AI...");

        const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(vertexPayload),
        });

        if (!geminiResponse.ok) {
            const status = geminiResponse.status;
            const errBody = await geminiResponse.text().catch(() => "");
            console.error(`[chat] Vertex AI error (${status}):`, errBody);
            logAiUsageEvent({
                requestId: validated.requestId,
                endpoint: "chat",
                model,
                status: status === 429 ? "rate_limited" : "error",
                userId: validated.userId,
                schoolId: validated.schoolId,
                inputChars,
                historyChars,
                gameContextChars: validated.body.gameContext?.length ?? 0,
                metadata: { http_status: status },
            }).catch((err) => console.error("[chat] Usage log error:", err));

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

        const geminiData = await geminiResponse.json();

        // Extract text from Vertex AI response format
        console.log("[chat] Step 4: Vertex AI response OK, extracting text...");
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Post-processing safety filter for minors
        const filterResult = filterAiOutput(rawText);
        const text = filterResult.safe ? rawText : (filterResult.filtered || "");
        console.log("[chat] Step 5: Success, text length:", text.length, filterResult.safe ? "" : `(filtered: ${filterResult.category})`);

        logAiUsageEvent({
            requestId: validated.requestId,
            endpoint: "chat",
            model,
            status: filterResult.safe ? "ok" : "blocked",
            userId: validated.userId,
            schoolId: validated.schoolId,
            inputChars,
            historyChars,
            gameContextChars: validated.body.gameContext?.length ?? 0,
            outputChars: text.length,
            usagePayload: geminiData,
            metadata: {
                role_id: validated.body.roleId,
                mission_id: validated.body.missionId,
                finish_reason: geminiData?.candidates?.[0]?.finishReason,
                output_filter: filterResult.safe ? "safe" : filterResult.category,
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
