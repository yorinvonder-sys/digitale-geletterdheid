/**
 * Shared CORS configuration for all edge functions.
 * Localhost origins are only allowed in non-production environments.
 */

const PRODUCTION_ORIGINS = [
    "https://dgskills.app",
    "https://www.dgskills.app",
];

// A5-fix: Vercel preview deployment pattern (matched dynamically below)
const VERCEL_PREVIEW_PATTERN = /^https:\/\/digitale-geletterdheid[a-z0-9-]*\.vercel\.app$/;

const DEV_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:3000",
];

function buildAllowedOrigins(): Set<string> {
    const origins = new Set(PRODUCTION_ORIGINS);
    const env = (globalThis as { Deno?: { env?: { get?: (key: string) => string | undefined } } }).Deno?.env;
    const environment = env?.get?.("ENVIRONMENT");
    const allowDevCors = env?.get?.("ALLOW_DEV_CORS");

    // Include dev origins when either:
    // 1. ENVIRONMENT is not explicitly set to "production", OR
    // 2. ALLOW_DEV_CORS is explicitly set to "true" (overrides production restriction)
    if (environment !== "production" || allowDevCors === "true") {
        for (const o of DEV_ORIGINS) {
            origins.add(o);
        }
    }

    return origins;
}

export const ALLOWED_ORIGINS = buildAllowedOrigins();

export function isAllowedOrigin(origin: string | null): boolean {
    if (!origin) return false;
    if (ALLOWED_ORIGINS.has(origin)) return true;
    // A5-fix: Allow Vercel preview deployments in non-production environments
    const env = (globalThis as { Deno?: { env?: { get?: (key: string) => string | undefined } } }).Deno?.env;
    if (env?.get?.("ENVIRONMENT") !== "production" && VERCEL_PREVIEW_PATTERN.test(origin)) return true;
    return false;
}

export function isAllowedReferer(referer: string | null): boolean {
    if (!referer) return false;

    try {
        return isAllowedOrigin(new URL(referer).origin);
    } catch {
        return false;
    }
}

export function getAllowedOrigin(input: Request | string | null): string {
    let origin = "";
    if (typeof input === "string") {
        origin = input;
    } else if (input) {
        origin = input.headers.get("Origin") || "";
    }
    return isAllowedOrigin(origin) ? origin : "https://dgskills.app";
}

export function buildCorsHeaders(
    req: Request,
    methods: string,
    allowHeaders = "authorization, x-client-info, apikey, content-type",
): Record<string, string> {
    return {
        "Access-Control-Allow-Origin": getAllowedOrigin(req),
        "Access-Control-Allow-Methods": methods,
        "Access-Control-Allow-Headers": allowHeaders,
        "Vary": "Origin",
    };
}

export function rejectDisallowedBrowserRequest(
    req: Request,
    corsHeaders: Record<string, string>,
): Response | null {
    const origin = req.headers.get("Origin");
    const referer = req.headers.get("Referer");

    if (!isAllowedOrigin(origin)) {
        return new Response(JSON.stringify({ error: "Niet toegestane herkomst." }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (referer && !isAllowedReferer(referer)) {
        return new Response(JSON.stringify({ error: "Niet toegestane herkomst." }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return null;
}
