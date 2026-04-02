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
            body: JSON.stringify(buildVertexPayload(validated)),
        });

        if (!geminiResponse.ok) {
            const status = geminiResponse.status;
            const errBody = await geminiResponse.text().catch(() => "");
            console.error(`[chat] Vertex AI error (${status}):`, errBody);
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

        const geminiData = await geminiResponse.json();

        // Extract text from Vertex AI response format
        console.log("[chat] Step 4: Vertex AI response OK, extracting text...");
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Post-processing safety filter for minors
        const filterResult = filterAiOutput(rawText);
        const text = filterResult.safe ? rawText : (filterResult.filtered || "");
        console.log("[chat] Step 5: Success, text length:", text.length, filterResult.safe ? "" : `(filtered: ${filterResult.category})`);

        // Server-side STEP_COMPLETE detection (EU AI Act Art. 12)
        detectAndLogStepComplete(rawText, validated.userId, validated.body.roleId, validated.body.missionId)
            .catch((err) => console.error("[chat] STEP_COMPLETE log error:", err));

        return new Response(JSON.stringify({ text }), {
            headers: { ...corsHeaders, "Content-Type": "application/json", ...rateLimitHeaders(validated.rateCheck) },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[chat] Unhandled error:", message);
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }
});
