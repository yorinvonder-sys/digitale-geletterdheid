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
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";
import { getAccessToken, getVertexUrl } from "../_shared/vertexAuth.ts";
import { getSystemInstruction, isValidRoleId } from "../_shared/systemInstructions.ts";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { buildSafeHistory } from "../_shared/chatHistory.ts";
import { checkDurableRateLimit, rateLimitResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const MAX_REQUEST_BYTES = 500_000;
const MAX_MESSAGE_LENGTH = 150_000;
const DEFAULT_CHAT_MODEL = "gemini-3-flash-preview";
const CODE_CHAT_MODEL = "gemini-2.5-pro";
const DEFAULT_CHAT_TEMPERATURE = 0.7;
const CODE_CHAT_TEMPERATURE = 0.2;

function selectModel(roleId: string, hasGameContext: boolean): string {
    if (roleId === "game-programmeur" || hasGameContext) {
        return CODE_CHAT_MODEL;
    }
    return DEFAULT_CHAT_MODEL;
}

function buildGenerationConfig(roleId: string, hasGameContext: boolean) {
    const isCodeMode = roleId === "game-programmeur" || hasGameContext;

    return {
        maxOutputTokens: isCodeMode ? 50_000 : 1024,
        temperature: isCodeMode ? CODE_CHAT_TEMPERATURE : DEFAULT_CHAT_TEMPERATURE,
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
        `chat:${user.id}`,
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

    // 4. Forward sanitized message to Gemini via Vertex AI (EU endpoint)
    try {
        const hasGameContext = !!(body.gameContext && typeof body.gameContext === "string");
        const model = selectModel(body.roleId, hasGameContext);
        const generationConfig = buildGenerationConfig(body.roleId, hasGameContext);

        console.log("[chat] Step 1: Building Vertex URL...");
        const geminiUrl = getVertexUrl(model);
        console.log("[chat] Step 2: Getting access token...");
        const accessToken = await getAccessToken();
        console.log("[chat] Step 3: Sending to Vertex AI...");

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

        const geminiResponse = await fetch(geminiUrl, {
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

        if (!geminiResponse.ok) {
            const status = geminiResponse.status;
            const errBody = await geminiResponse.text().catch(() => "");
            console.error(`[chat] Vertex AI error (${status}):`, errBody);
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

        const geminiData = await geminiResponse.json();

        // Extract text from Vertex AI response format
        console.log("[chat] Step 4: Vertex AI response OK, extracting text...");
        const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        console.log("[chat] Step 5: Success, text length:", text.length);

        return new Response(JSON.stringify({ text }), {
            headers: { ...corsHeaders, "Content-Type": "application/json", ...rateLimitHeaders(rateCheck) },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[chat] Unhandled error:", message);
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
