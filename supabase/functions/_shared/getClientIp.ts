/**
 * Shared helper to extract the real client IP from edge function requests.
 *
 * Priority:
 * 1. cf-connecting-ip (Cloudflare — trusted, set by edge proxy)
 * 2. x-real-ip (Nginx/Vercel — trusted, single IP)
 * 3. "unknown" fallback
 *
 * Truncated to 128 chars max to prevent log injection.
 */
export function getClientIp(req: Request): string {
  const raw =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const normalized = raw.trim().slice(0, 128);
  return /^[a-fA-F0-9:.]{3,45}$/.test(normalized) || /^(?:\d{1,3}\.){3}\d{1,3}$/.test(normalized)
    ? normalized
    : "unknown";
}
