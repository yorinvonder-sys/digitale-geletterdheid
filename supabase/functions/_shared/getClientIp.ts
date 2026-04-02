/**
 * Shared helper to extract the real client IP from edge function requests.
 *
 * Priority:
 * 1. cf-connecting-ip (Cloudflare — trusted, set by edge proxy)
 * 2. x-real-ip (Nginx/Vercel — trusted, single IP)
 * 3. x-forwarded-for (first entry only — may be spoofed if proxy doesn't strip)
 * 4. "unknown" fallback
 *
 * Truncated to 128 chars max to prevent log injection.
 */
export function getClientIp(req: Request): string {
  const raw =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  return raw.slice(0, 128);
}
