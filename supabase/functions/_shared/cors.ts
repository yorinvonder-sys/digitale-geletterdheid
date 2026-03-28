/**
 * Shared CORS configuration for all edge functions.
 * Localhost origins are only allowed when ENVIRONMENT is explicitly "development" or "local".
 */

const PRODUCTION_ORIGINS = [
    "https://dgskills.app",
    "https://www.dgskills.app",
];

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
    const environment = (globalThis as { Deno?: { env?: { get?: (key: string) => string | undefined } } }).Deno
        ?.env
        ?.get?.("ENVIRONMENT");

    // Security fix (M-5): only add dev origins when ENVIRONMENT is explicitly
    // set to "development" or "local". Previously, dev origins were included
    // whenever ENVIRONMENT was not "production" (including when undefined),
    // which meant a missing env var would silently allow localhost origins.
    if (environment === "development" || environment === "local") {
        for (const o of DEV_ORIGINS) {
            origins.add(o);
        }
    }

    return origins;
}

export const ALLOWED_ORIGINS = buildAllowedOrigins();

export function isAllowedOrigin(origin: string | null): boolean {
    return !!origin && ALLOWED_ORIGINS.has(origin);
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
    return ALLOWED_ORIGINS.has(origin) ? origin : "https://dgskills.app";
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
