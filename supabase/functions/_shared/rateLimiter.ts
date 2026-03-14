/**
 * Simple in-memory rate limiter per user.
 * Note: resets bij cold start van edge function, maar dat is acceptabel.
 */

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
