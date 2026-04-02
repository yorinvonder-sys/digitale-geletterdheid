/**
 * Shared core for /chat and /chatStream edge functions.
 *
 * Security-critical: auth verification, rate limiting, prompt sanitization,
 * and Vertex AI payload construction are all handled here.
 *
 * Do NOT modify security logic (auth, rate limit, sanitization, CORS) without
 * reviewing the security audit at docs/security/security-audit-rapport-dgskills.md.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sanitizePrompt } from "./promptSanitizer.ts";
import { getSystemInstruction, isValidRoleId } from "./systemInstructions.ts";
import { buildSafeHistory } from "./chatHistory.ts";
import { checkDurableRateLimit, rateLimitResponse, RateLimitConfig, RateLimitResult } from "./rateLimiter.ts";

// ── Constants ────────────────────────────────────────────────────────────────

export const MAX_REQUEST_BYTES = 500_000;
export const MAX_MESSAGE_LENGTH = 150_000;
export const DEFAULT_MODEL = "gemini-3-flash-preview";
export const CODE_MODEL = "gemini-2.5-pro";
export const DEFAULT_TEMPERATURE = 0.7;
export const CODE_TEMPERATURE = 0.2;

// ── Types ────────────────────────────────────────────────────────────────────

export interface ChatRequestBody {
    message: string;
    roleId: string;
    history?: unknown[];
    gameContext?: string;
    missionId?: string;
}

export interface SafetySettingEntry {
    category: string;
    threshold: string;
}

export interface VertexPart {
    text: string;
}

export interface VertexContent {
    role: string;
    parts: VertexPart[];
}

export interface VertexPayload {
    contents: VertexContent[];
    safetySettings: SafetySettingEntry[];
    systemInstruction: { parts: VertexPart[] };
    generationConfig: { maxOutputTokens: number; temperature: number };
}

export interface ValidatedRequest {
    body: ChatRequestBody;
    userId: string;
    systemInstruction: string;
    rateCheck: RateLimitResult;
    sanitized: string;
    safeHistory: { history: VertexContent[]; blocked: boolean; detectionLabel?: string };
}

// ── Model selection ──────────────────────────────────────────────────────────

export function selectModel(roleId: string, hasGameContext: boolean): string {
    if (roleId === "game-programmeur" || hasGameContext) {
        return CODE_MODEL;
    }
    return DEFAULT_MODEL;
}

// ── Generation config ────────────────────────────────────────────────────────

export function buildGenerationConfig(roleId: string, hasGameContext: boolean): { maxOutputTokens: number; temperature: number } {
    const isCodeMode = roleId === "game-programmeur" || hasGameContext;
    return {
        maxOutputTokens: isCodeMode ? 50_000 : 1024,
        temperature: isCodeMode ? CODE_TEMPERATURE : DEFAULT_TEMPERATURE,
    };
}

// ── Auth + rate limit + request validation ───────────────────────────────────

/**
 * Validates the incoming request: auth, rate limit, body parsing, roleId check,
 * prompt injection check, and history sanitization.
 *
 * Returns a ValidatedRequest on success, or a Response to send directly on failure.
 *
 * @param req - The incoming Deno Request
 * @param corsHeaders - CORS headers to include in error responses
 * @param rateLimitKey - Prefix for the rate limit key, e.g. "chat" or "chat-stream"
 */
export async function validateAndParseRequest(
    req: Request,
    corsHeaders: Record<string, string>,
    rateLimitKey: string,
): Promise<ValidatedRequest | Response> {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Content-length guard
    const contentLength = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
        return new Response(
            JSON.stringify({ error: "Verzoek is te groot." }),
            { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // 1. Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(
            JSON.stringify({ error: "Ongeldige sessie." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // 2. Rate limit: 15 requests per minute per user
    const rateLimitConfig: RateLimitConfig = { maxRequests: 15, windowMs: 60_000 };
    const rateCheck = await checkDurableRateLimit(
        `${rateLimitKey}:${user.id}`,
        rateLimitConfig,
        authHeader,
    );
    if (!rateCheck.allowed) {
        return rateLimitResponse(rateCheck, corsHeaders);
    }

    // 3. Parse request body
    // SECURITY: systemInstruction is server-side only — never trust client input
    let rawBody: { message?: string; roleId?: string; history?: unknown[]; gameContext?: string; missionId?: string };
    try {
        rawBody = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige JSON." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    if (!rawBody.message || typeof rawBody.message !== "string" || rawBody.message.length > MAX_MESSAGE_LENGTH) {
        return new Response(
            JSON.stringify({ error: "Bericht ontbreekt of is te lang." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // SECURITY: Validate roleId and look up system instruction server-side
    if (!rawBody.roleId || typeof rawBody.roleId !== "string" || !isValidRoleId(rawBody.roleId)) {
        return new Response(
            JSON.stringify({ error: "Ongeldige of ontbrekende roleId." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }
    const systemInstruction = getSystemInstruction(rawBody.roleId)!;

    // Validate optional missionId (max 100 chars, alphanumeric + hyphens only)
    if (rawBody.missionId !== undefined) {
        if (typeof rawBody.missionId !== "string" || rawBody.missionId.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(rawBody.missionId)) {
            rawBody.missionId = undefined; // silently discard invalid missionId
        }
    }

    // 4. Server-side prompt injection check (defense-in-depth)
    const validation = sanitizePrompt(rawBody.message);
    if (validation.wasBlocked) {
        console.warn(`[INJECTION_BLOCKED] user=${user.id} label=${validation.detectionLabel}`);
        return new Response(
            JSON.stringify({
                error: "blocked",
                reason: "Je bericht bevat een patroon dat niet is toegestaan.",
            }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const safeHistory = buildSafeHistory(rawBody.history, {
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
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    return {
        body: rawBody as ChatRequestBody,
        userId: user.id,
        systemInstruction,
        rateCheck,
        sanitized: validation.sanitized,
        safeHistory: safeHistory as { history: VertexContent[]; blocked: boolean; detectionLabel?: string },
    };
}

// ── Vertex AI payload builder ─────────────────────────────────────────────────

/**
 * Constructs the Vertex AI request body from a validated request.
 * Includes safety settings for minors (EU AI Act + child protection).
 */
export function buildVertexPayload(validated: ValidatedRequest): VertexPayload {
    const { body, sanitized, safeHistory, systemInstruction } = validated;
    const hasGameContext = !!(body.gameContext && typeof body.gameContext === "string");

    // Build user message parts — include game code context if provided
    // gameContext bypasses the sanitizer because it's our own application code, not user input
    const userParts: VertexPart[] = [];
    if (hasGameContext) {
        userParts.push({
            text: `[HUIDIGE_GAME_CODE]\n${body.gameContext}\n[/HUIDIGE_GAME_CODE]\n\nKRITIEK: Dit is de HUIDIGE game van de leerling. Je MOET deze code aanpassen — NIET een nieuwe game maken. Verwerk het verzoek hieronder in de bestaande code en geef de VOLLEDIGE aangepaste versie terug.`,
        });
    }
    userParts.push({ text: sanitized });

    const contents: VertexContent[] = [
        ...safeHistory.history,
        { role: "user", parts: userParts },
    ];

    // Safety settings for minors (12-18 year olds) — EU AI Act + child protection
    const safetySettings: SafetySettingEntry[] = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
    ];

    return {
        contents,
        safetySettings,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: buildGenerationConfig(body.roleId, hasGameContext),
    };
}
