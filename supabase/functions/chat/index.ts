/**
 * Edge Function: /chat — AI Chat Proxy (Mistral AI)
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
    extractMistralText,
} from "../_shared/mistralClient.ts";
import { filterAiOutput } from "../_shared/outputFilter.ts";
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

    const validated = await validateAndParseRequest(req, corsHeaders, "chat", AI_PROVIDER);
    if (validated instanceof Response) return validated;

    // Forward sanitized message to Mistral AI (EU provider)
    try {
        const hasGameContext = !!(validated.body.gameContext && typeof validated.body.gameContext === "string");
        const model = selectModel(validated.body.roleId, hasGameContext);
        const generationConfig = buildGenerationConfig(validated.body.roleId, hasGameContext);
        const mistralPayload = buildMistralPayload(validated, model, generationConfig, false);
        const inputChars = countTextChars(validated.safeHistory.history) + validated.sanitized.length;
        const historyChars = countTextChars(validated.safeHistory.history);

        console.log("[chat] Step 1: Reading API key...");
        const apiKey = getMistralApiKey();
        console.log("[chat] Step 2: Sending to Mistral AI...");

        const geminiResponse = await fetch(getMistralUrl(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(mistralPayload),
        });

        if (!geminiResponse.ok) {
            const status = geminiResponse.status;
            const errBody = await geminiResponse.text().catch(() => "");
            console.error(`[chat] Mistral AI error (${status}):`, errBody);
            logAiUsageEvent({
                requestId: validated.requestId,
                endpoint: "chat",
                provider: AI_PROVIDER,
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

        // Extract text from Mistral AI response format
        console.log("[chat] Step 3: Mistral AI response OK, extracting text...");
        const rawText = extractMistralText(geminiData);

        // Post-processing safety filter for minors
        const filterResult = filterAiOutput(rawText);
        const text = filterResult.safe ? rawText : (filterResult.filtered || "");
        console.log("[chat] Step 4: Success, text length:", text.length, filterResult.safe ? "" : `(filtered: ${filterResult.category})`);

        logAiUsageEvent({
            requestId: validated.requestId,
            endpoint: "chat",
            provider: AI_PROVIDER,
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
                finish_reason: geminiData?.choices?.[0]?.finish_reason,
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
            provider: AI_PROVIDER,
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
