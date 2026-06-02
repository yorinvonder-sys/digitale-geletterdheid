/**
 * Mistral AI client helper for the /chat and /chatStream edge functions.
 *
 * Why Mistral?
 * Mistral AI is an EU (France) based provider. DGSkills uses it for the
 * student-facing chat so that learner interactions are processed under
 * EU privacy rules.
 *
 * IMPORTANT — privacy boundary:
 * Just like the previous Vertex integration, NO learner PII is sent to
 * Mistral. The request only contains the sanitized message, the sanitized
 * conversation history and a server-side role instruction. Names, e-mail,
 * school, progress, etc. never reach the provider.
 *
 * COMPLIANCE — must be confirmed before production use:
 * - signed Data Processing Agreement (DPA) with Mistral;
 * - terms that allow processing data of minors (12-18);
 * - EU data residency + opt-out of training on customer data.
 *
 * The API key is read from the MISTRAL_API_KEY secret (never hardcoded,
 * never logged).
 */
import type { ValidatedRequest, ChatContent } from "./chatCore.ts";

// ── Endpoint ───────────────────────────────────────────────────────────────
const MISTRAL_CHAT_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * Build the Mistral chat completions URL.
 * Streaming vs non-streaming is controlled by the `stream` flag in the body,
 * so the URL is identical for both.
 */
export function getMistralUrl(): string {
    return MISTRAL_CHAT_URL;
}

/**
 * Read the Mistral API key from the environment.
 * Throws a generic error if missing — never logs the key itself.
 */
export function getMistralApiKey(): string {
    const key = Deno.env.get("MISTRAL_API_KEY");
    if (!key) {
        throw new Error(
            "MISTRAL_API_KEY is not set. Add it via: supabase secrets set MISTRAL_API_KEY='...'",
        );
    }
    return key;
}

// ── Payload ──────────────────────────────────────────────────────────────────

export interface MistralMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface MistralPayload {
    model: string;
    messages: MistralMessage[];
    temperature: number;
    max_tokens: number;
    /** Mistral's built-in moderation guard rail — extra protection for minors. */
    safe_prompt: boolean;
    stream: boolean;
}

/**
 * Convert the sanitized, validated request into a Mistral chat payload.
 *
 * History roles are mapped from the internal format ("model") to Mistral's
 * ("assistant"). The system instruction is sent as the first system message.
 * Game code context (game-programmeur role only) is prepended to the user
 * message exactly like the previous Vertex builder did.
 */
export function buildMistralPayload(
    validated: ValidatedRequest,
    model: string,
    generationConfig: { maxOutputTokens: number; temperature: number },
    stream: boolean,
): MistralPayload {
    const { body, sanitized, safeHistory, systemInstruction } = validated;
    const hasGameContext = !!(body.gameContext && typeof body.gameContext === "string");

    const messages: MistralMessage[] = [
        { role: "system", content: systemInstruction },
    ];

    // Replay sanitized history, mapping internal roles → Mistral roles.
    for (const turn of safeHistory.history as ChatContent[]) {
        const role: MistralMessage["role"] = turn.role === "model" ? "assistant" : "user";
        const content = turn.parts.map((p) => p.text).join("\n");
        if (content) messages.push({ role, content });
    }

    // Build the current user message — include game code context if present.
    // gameContext bypasses the sanitizer because it's our own application code.
    let userContent = "";
    if (hasGameContext) {
        userContent += `[HUIDIGE_GAME_CODE]\n${body.gameContext}\n[/HUIDIGE_GAME_CODE]\n\nKRITIEK: Dit is de HUIDIGE game van de leerling. Je MOET deze code aanpassen — NIET een nieuwe game maken. Verwerk het verzoek hieronder in de bestaande code en geef de VOLLEDIGE aangepaste versie terug.\n\n`;
    }
    userContent += sanitized;
    messages.push({ role: "user", content: userContent });

    return {
        model,
        messages,
        temperature: generationConfig.temperature,
        max_tokens: generationConfig.maxOutputTokens,
        safe_prompt: true,
        stream,
    };
}

// ── Response parsing ───────────────────────────────────────────────────────

/**
 * Extract the assistant text from a non-streaming Mistral response.
 */
export function extractMistralText(data: unknown): string {
    const root = data && typeof data === "object" ? data as Record<string, unknown> : {};
    const choices = root.choices;
    if (!Array.isArray(choices) || choices.length === 0) return "";
    const message = (choices[0] as Record<string, unknown>)?.message as Record<string, unknown> | undefined;
    const content = message?.content;
    return typeof content === "string" ? content : "";
}

/**
 * Extract the incremental delta text from one streamed Mistral SSE chunk.
 */
export function extractMistralStreamDelta(chunk: unknown): string {
    const root = chunk && typeof chunk === "object" ? chunk as Record<string, unknown> : {};
    const choices = root.choices;
    if (!Array.isArray(choices) || choices.length === 0) return "";
    const delta = (choices[0] as Record<string, unknown>)?.delta as Record<string, unknown> | undefined;
    const content = delta?.content;
    return typeof content === "string" ? content : "";
}

/** True when a streamed chunk carries usage metadata (final chunk). */
export function chunkHasUsage(chunk: unknown): boolean {
    return !!(chunk && typeof chunk === "object" && (chunk as Record<string, unknown>).usage);
}
