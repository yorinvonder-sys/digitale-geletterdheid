/**
 * Rate limiting helpers for edge functions.
 * - `checkRateLimit`: simple in-memory fallback
 * - `checkDurableRateLimit`: uses Postgres via RPC when available
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface RateLimitEntry {
  count: number;
  resetAt: number; // timestamp
}

const limits = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  maxRequests: number;   // max requests per window
  windowMs: number;      // window in milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
  limit: number;
}

interface DurableRateLimitRow {
  allowed: boolean;
  remaining: number | null;
  retry_after_seconds: number | null;
  limit_value: number | null;
}

export function checkRateLimit(userId: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = limits.get(userId);

  if (!entry || now > entry.resetAt) {
    limits.set(userId, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, retryAfterMs: 0, limit: config.maxRequests };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now, limit: config.maxRequests };
  }

  entry.count++;
  return { allowed: true, remaining: config.maxRequests - entry.count, retryAfterMs: 0, limit: config.maxRequests };
}

export async function checkDurableRateLimit(
  key: string,
  config: RateLimitConfig,
  authHeader?: string | null,
): Promise<RateLimitResult> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return checkRateLimit(key, config);
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, authHeader?.startsWith("Bearer ")
    ? { global: { headers: { Authorization: authHeader } } }
    : undefined);

  const { data, error } = await client
    .rpc("consume_edge_rate_limit", {
      p_key: key,
      p_limit: config.maxRequests,
      p_window_seconds: Math.max(1, Math.ceil(config.windowMs / 1000)),
    })
    .single();

  if (error || !data) {
    console.error("[rateLimiter] durable limiter unavailable, using in-memory fallback:", error);
    return checkRateLimit(key, config);
  }

  const row = data as DurableRateLimitRow;
  return {
    allowed: Boolean(row.allowed),
    remaining: Math.max(0, row.remaining ?? 0),
    retryAfterMs: Math.max(0, (row.retry_after_seconds ?? 0) * 1000),
    limit: row.limit_value ?? config.maxRequests,
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
  };
  if (!result.allowed) {
    headers["Retry-After"] = String(Math.ceil(result.retryAfterMs / 1000));
  }
  return headers;
}

export function rateLimitResponse(
  result: RateLimitResult,
  corsHeaders: Record<string, string>,
): Response {
  return new Response(
    JSON.stringify({
      error: "rate_limit",
      reason: "Te veel verzoeken. Wacht even.",
      retryAfterMs: result.retryAfterMs,
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        ...rateLimitHeaders(result),
      },
    },
  );
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of limits) {
    if (now > entry.resetAt) limits.delete(key);
  }
}, 60_000);
