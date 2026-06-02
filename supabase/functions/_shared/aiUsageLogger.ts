import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export type AiUsageStatus = "ok" | "error" | "blocked" | "rate_limited";

export interface AiUsageTokens {
  promptTokens?: number;
  candidatesTokens?: number;
  totalTokens?: number;
  cachedTokens?: number;
  thinkingTokens?: number;
}

export interface AiUsageEvent {
  requestId: string;
  endpoint: string;
  model: string;
  status: AiUsageStatus;
  provider?: string;
  userId?: string | null;
  schoolId?: string | null;
  inputChars?: number;
  historyChars?: number;
  gameContextChars?: number;
  outputChars?: number;
  imageCount?: number;
  retryCount?: number;
  fallbackUsed?: boolean;
  usagePayload?: unknown;
  metadata?: Record<string, unknown>;
}

const REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{7,79}$/;
const SAFE_KEY_PATTERN = /^[a-zA-Z0-9_:-]{1,64}$/;

function asNonNegativeInteger(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return undefined;
  return Math.floor(value);
}

function valueAt(source: Record<string, unknown>, camel: string, snake: string): number | undefined {
  return asNonNegativeInteger(source[camel] ?? source[snake]);
}

export function resolveAiRequestId(candidate: unknown): string {
  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    if (REQUEST_ID_PATTERN.test(trimmed)) return trimmed;
  }
  return crypto.randomUUID();
}

export function getUserSchoolId(user: { app_metadata?: Record<string, unknown> } | null | undefined): string | null {
  const value = user?.app_metadata?.schoolId ?? user?.app_metadata?.school_id;
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 120) : null;
}

export function extractUsageMetadata(payload: unknown): AiUsageTokens {
  const root = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};

  // Mistral (OpenAI-compatible) usage: { prompt_tokens, completion_tokens, total_tokens }
  const mistralUsage = root.usage;
  if (mistralUsage && typeof mistralUsage === "object") {
    const source = mistralUsage as Record<string, unknown>;
    return {
      promptTokens: valueAt(source, "promptTokens", "prompt_tokens"),
      candidatesTokens: valueAt(source, "completionTokens", "completion_tokens"),
      totalTokens: valueAt(source, "totalTokens", "total_tokens"),
    };
  }

  // Vertex/Gemini usage (still used by image + other endpoints).
  const usage = root.usageMetadata ?? root.usage_metadata;
  if (!usage || typeof usage !== "object") return {};

  const source = usage as Record<string, unknown>;
  return {
    promptTokens: valueAt(source, "promptTokenCount", "prompt_token_count"),
    candidatesTokens: valueAt(source, "candidatesTokenCount", "candidates_token_count"),
    totalTokens: valueAt(source, "totalTokenCount", "total_token_count"),
    cachedTokens: valueAt(source, "cachedContentTokenCount", "cached_content_token_count"),
    thinkingTokens: valueAt(source, "thoughtsTokenCount", "thoughts_token_count"),
  };
}

export function countTextChars(value: unknown): number {
  if (!value || typeof value !== "object") return 0;
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + countTextChars(item), 0);

  const record = value as Record<string, unknown>;
  let total = typeof record.text === "string" ? record.text.length : 0;
  for (const [key, nested] of Object.entries(record)) {
    if (key === "inlineData" || key === "inline_data") continue;
    if (key === "text") continue;
    total += countTextChars(nested);
  }
  return total;
}

function sanitizeSmallRecord(input: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!input) return {};
  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (!SAFE_KEY_PATTERN.test(key)) continue;
    if (value === null || value === undefined) continue;

    if (typeof value === "string") {
      clean[key] = value.slice(0, 160);
    } else if (typeof value === "number" && Number.isFinite(value)) {
      clean[key] = value;
    } else if (typeof value === "boolean") {
      clean[key] = value;
    }
  }

  return clean;
}

export async function logAiUsageEvent(event: AiUsageEvent): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("[aiUsageLogger] Missing Supabase service credentials; usage event skipped.");
    return;
  }

  const tokens = extractUsageMetadata(event.usagePayload);
  const client = createClient(supabaseUrl, serviceRoleKey);

  const { error } = await client.from("ai_usage_events").insert({
    request_id: event.requestId,
    user_id: event.userId ?? null,
    school_id: event.schoolId ?? null,
    endpoint: event.endpoint,
    provider: event.provider ?? "google-vertex",
    model: event.model,
    status: event.status,
    input_chars: Math.max(0, Math.floor(event.inputChars ?? 0)),
    history_chars: Math.max(0, Math.floor(event.historyChars ?? 0)),
    game_context_chars: Math.max(0, Math.floor(event.gameContextChars ?? 0)),
    output_chars: Math.max(0, Math.floor(event.outputChars ?? 0)),
    prompt_tokens: tokens.promptTokens ?? null,
    candidates_tokens: tokens.candidatesTokens ?? null,
    total_tokens: tokens.totalTokens ?? null,
    cached_tokens: tokens.cachedTokens ?? null,
    thinking_tokens: tokens.thinkingTokens ?? null,
    image_count: Math.max(0, Math.floor(event.imageCount ?? 0)),
    retry_count: Math.max(0, Math.floor(event.retryCount ?? 0)),
    fallback_used: Boolean(event.fallbackUsed),
    metadata: sanitizeSmallRecord(event.metadata),
  });

  if (error) {
    console.error("[aiUsageLogger] Failed to insert usage event:", error.message);
  }
}
