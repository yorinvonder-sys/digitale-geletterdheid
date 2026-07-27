/**
 * Edge Function: /demo-chat — Landing Page AI Demo
 *
 * Simplified chat endpoint for anonymous visitors on the landing page.
 * Allows visitors to experience the AI chatbot without creating an account.
 *
 * Security layers:
 * 1. CORS origin check (only dgskills.app + localhost dev)
 * 2. IP-based rate limiting (5 messages per 24 hours)
 * 3. Prompt injection filtering
 * 4. Fixed system instruction (not configurable by client)
 * 5. Mistral safe prompt plus local output constraints
 * 6. No auth required — designed for anonymous demo use
 */
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";
import { redactPii } from "../_shared/piiRedactor.ts";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { buildSafeHistory } from "../_shared/chatHistory.ts";
import { checkDurableRateLimit, rateLimitHeaders } from "../_shared/rateLimiter.ts";
import { countTextChars, logAiUsageEvent, resolveAiRequestId } from "../_shared/aiUsageLogger.ts";
import { buildMistralMessages, completeMistralChat, getMistralTextModel } from "../_shared/mistralClient.ts";
import { filterAiOutput, SAFE_FALLBACK_MESSAGE } from "../_shared/outputFilter.ts";
import { moderateText } from "../_shared/moderationClient.ts";

const MAX_REQUEST_BYTES = 8_000;

async function sha256(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

/** Extract client IP from request headers (Supabase/Vercel proxy chain) */
function getClientIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
        // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
        return forwarded.split(",")[0].trim();
    }
    return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Fixed system instruction for the landing page demo.
 * The AI acts as a friendly game builder mentor that helps visitors
 * customize a mini platformer game through conversation.
 */
const DEMO_SYSTEM_INSTRUCTION = `Je bent de vrolijke AI-mentor van DGSkills. Je helpt bezoekers een mini-platformer game te bouwen op de landingspagina.

REGELS:
- Antwoord ALTIJD in het Nederlands
- Houd antwoorden KORT: maximaal 2-3 zinnen
- Wees enthousiast en vriendelijk
- Stel na elk antwoord een vervolgvraag om de game verder aan te passen
- Dit is een demo — geen volledige les. Focus op het laten zien hoe leuk en interactief het platform is.

GAME BUILDER:
Je helpt de bezoeker hun eigen platformer game aan te passen. Ze kunnen kiezen:
- Thema/sfeer (ruimte, jungle, oceaan, stad, woestijn, ijs, vulkaan, snoep)
- Kleur van de lucht en grond
- Karakter (robot, astronaut, kat, draak, ninja, eenhoorn)
- Obstakels en powerups
- Snelheid en moeilijkheidsgraad

NA ELK ANTWOORD voeg je een JSON-blok toe met de huidige game-staat. Dit blok wordt door de frontend geparsed om de game live te updaten. Gebruik EXACT dit format:

<GAME_STATE>
{
  "sky": "#08283B",
  "ground": "#5F947D",
  "character": "#D7C95F",
  "characterType": "robot",
  "obstacles": 2,
  "clouds": true,
  "stars": false,
  "speed": "normal",
  "theme": "Standaard"
}
</GAME_STATE>

Pas de waardes aan op basis van wat de bezoeker kiest. Geldige characterTypes: "robot", "astronaut", "kat", "draak", "ninja", "eenhoorn". Geldige speeds: "slow", "normal", "fast".

BEGIN met een korte begroeting en vraag welk thema ze willen (ruimte, jungle, oceaan, etc). Geef meteen een standaard GAME_STATE mee.`;

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type");
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(
            JSON.stringify({ error: "Alleen POST verzoeken toegestaan." }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const contentLength = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
        return new Response(
            JSON.stringify({ error: "Verzoek is te groot." }),
            { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 1. Parse request
    let body: { message?: string; history?: Array<{ role: string; parts: Array<{ text: string }> }>; clientRequestId?: unknown };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige JSON." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const requestId = resolveAiRequestId(body.clientRequestId);
    const responseHeaders = { ...corsHeaders, "Content-Type": "application/json", "X-AI-Request-Id": requestId };

    if (!body.message || typeof body.message !== "string" || body.message.length > 500) {
        return new Response(
            JSON.stringify({ error: "Bericht ontbreekt of is te lang (max 500 tekens)." }),
            { status: 400, headers: responseHeaders }
        );
    }

    // 2. IP-based rate limiting: 5 messages per 24 hours
    const clientIp = getClientIp(req);
    const userAgent = req.headers.get("User-Agent") || "unknown";
    const rateFingerprint = await sha256(`${clientIp}|${userAgent}`);
    const rateCheck = await checkDurableRateLimit(`demo-chat:${rateFingerprint}`, {
        maxRequests: 5,
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
    });

    if (!rateCheck.allowed) {
        logAiUsageEvent({
            requestId,
            endpoint: "demo-chat",
            provider: "mistral",
            model: getMistralTextModel(),
            status: "rate_limited",
            inputChars: body.message.length,
            metadata: { limit: rateCheck.limit, retry_after_ms: rateCheck.retryAfterMs },
        }).catch((err) => console.error("[demo-chat] Usage log error:", err));

        return new Response(
            JSON.stringify({
                error: "demo_limit",
                reason: "Je hebt het maximum van 5 berichten bereikt. Maak een gratis account om verder te gaan!",
                remaining: 0,
            }),
            {
                status: 429,
                headers: {
                    ...responseHeaders,
                    ...rateLimitHeaders(rateCheck),
                },
            }
        );
    }

    // 3. Prompt injection check
    const validation = sanitizePrompt(body.message);
    if (validation.wasBlocked) {
        console.warn(`[DEMO_INJECTION_BLOCKED] ip=${clientIp} label=${validation.detectionLabel}`);
        logAiUsageEvent({
            requestId,
            endpoint: "demo-chat",
            provider: "mistral",
            model: getMistralTextModel(),
            status: "blocked",
            inputChars: body.message.length,
            metadata: { reason: "input_sanitizer", detection_label: validation.detectionLabel ?? "unknown" },
        }).catch((err) => console.error("[demo-chat] Usage log error:", err));

        return new Response(
            JSON.stringify({
                error: "blocked",
                reason: "Je bericht bevat een patroon dat niet is toegestaan.",
            }),
            { status: 422, headers: responseHeaders }
        );
    }

    const safeHistory = buildSafeHistory(body.history, {
        maxMessages: 6,
        maxPartsPerMessage: 1,
        maxPartChars: 500,
        maxTotalChars: 2_000,
    });

    if (safeHistory.blocked) {
        console.warn(`[DEMO_HISTORY_BLOCKED] ip=${clientIp} label=${safeHistory.detectionLabel}`);
        logAiUsageEvent({
            requestId,
            endpoint: "demo-chat",
            provider: "mistral",
            model: getMistralTextModel(),
            status: "blocked",
            inputChars: validation.sanitized.length,
            historyChars: countTextChars(safeHistory.history),
            metadata: { reason: "history_sanitizer", detection_label: safeHistory.detectionLabel ?? "unknown" },
        }).catch((err) => console.error("[demo-chat] Usage log error:", err));

        return new Response(
            JSON.stringify({
                error: "blocked",
                reason: "De gesprekshistorie bevat een patroon dat niet is toegestaan.",
            }),
            { status: 422, headers: responseHeaders }
        );
    }

    // Data-minimalisatie: maskeer PII vóór externe moderatie en AI-provider.
    const redactedHistory = safeHistory.history.map((msg) =>
        msg.role === "user"
            ? { ...msg, parts: msg.parts.map((part) => ({ ...part, text: redactPii(part.text).redacted })) }
            : msg
    );
    const redactedMessage = redactPii(validation.sanitized).redacted;
    let moderationErrorReason: string | null = null;

    // Input moderation (Mistral classifier) — additioneel op de sanitizer.
    const inputModeration = await moderateText(redactedMessage);
    if (inputModeration.errored) {
        moderationErrorReason = `input:${inputModeration.errorReason ?? "unknown"}`;
        console.error(`[demo-chat] Moderation unavailable; fail-open (${moderationErrorReason}).`);
    }

    if (inputModeration.flagged) {
        logAiUsageEvent({
            requestId,
            endpoint: "demo-chat",
            provider: "mistral",
            model: getMistralTextModel(),
            status: "blocked",
            inputChars: redactedMessage.length,
            metadata: { reason: "moderation_input", moderation_categories: inputModeration.categories.join(",") },
        }).catch((err) => console.error("[demo-chat] Usage log error:", err));

        return new Response(
            JSON.stringify({ text: SAFE_FALLBACK_MESSAGE, remaining: Math.max(rateCheck.remaining, 0) }),
            { headers: { ...responseHeaders, ...rateLimitHeaders(rateCheck) } }
        );
    }

    // 4. Send to Mistral
    try {
        const contents = [
            ...redactedHistory,
            { role: "user", parts: [{ text: redactedMessage }] },
        ];

        const result = await completeMistralChat({
            messages: buildMistralMessages(DEMO_SYSTEM_INSTRUCTION, contents),
            maxTokens: 512,
        });

        const outputCheck = filterAiOutput(result.text);
        let text = outputCheck.safe ? result.text : (outputCheck.filtered || SAFE_FALLBACK_MESSAGE);
        let outputBlockReason: string | null = outputCheck.safe ? null : `regex:${outputCheck.category}`;

        if (outputCheck.safe) {
            const outputModeration = await moderateText(result.text);
            if (outputModeration.errored) {
                moderationErrorReason = moderationErrorReason
                    ? `${moderationErrorReason},output:${outputModeration.errorReason ?? "unknown"}`
                    : `output:${outputModeration.errorReason ?? "unknown"}`;
                console.error(`[demo-chat] Output moderation unavailable; fail-open (${moderationErrorReason}).`);
            } else if (outputModeration.flagged) {
                text = SAFE_FALLBACK_MESSAGE;
                outputBlockReason = `moderation:${outputModeration.categories.join("|")}`;
            }
        }
        const outputSafe = outputBlockReason === null;

        logAiUsageEvent({
            requestId,
            endpoint: "demo-chat",
            provider: "mistral",
            model: result.model,
            status: outputSafe ? "ok" : "blocked",
            inputChars: countTextChars(contents) + DEMO_SYSTEM_INSTRUCTION.length,
            historyChars: countTextChars(safeHistory.history),
            outputChars: text.length,
            usagePayload: result.usagePayload,
            metadata: {
                remaining: Math.max(rateCheck.remaining, 0),
                output_filter: outputBlockReason ?? "safe",
                ...(moderationErrorReason ? { moderation_error_reason: moderationErrorReason } : {}),
            },
        }).catch((err) => console.error("[demo-chat] Usage log error:", err));

        return new Response(
            JSON.stringify({
                text,
                remaining: Math.max(rateCheck.remaining, 0),
            }),
            {
                headers: {
                    ...responseHeaders,
                    ...rateLimitHeaders(rateCheck),
                },
            }
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[demo-chat] Unhandled error:", message);
        logAiUsageEvent({
            requestId,
            endpoint: "demo-chat",
            provider: "mistral",
            model: getMistralTextModel(),
            status: "error",
            inputChars: body.message.length,
            metadata: { error_stage: "unhandled" },
        }).catch((logErr) => console.error("[demo-chat] Usage log error:", logErr));
        return new Response(
            JSON.stringify({ error: "AI tijdelijk niet beschikbaar." }),
            { status: 502, headers: responseHeaders }
        );
    }
});
