/**
 * Edge Function: /mfa-trust — MFA Trusted Session Management
 *
 * Handles IP-based MFA grace periods. After successful MFA verification,
 * creates a trusted session so the user doesn't need to re-enter MFA
 * for 30 minutes from the same IP address.
 *
 * Endpoints:
 * - GET  /mfa-trust — Check if current IP has a valid trusted session
 * - POST /mfa-trust — Create a trusted session for current IP after MFA success
 * - DELETE /mfa-trust — Revoke all trusted sessions (security action)
 *
 * Security:
 * - IP is SHA-256 hashed before storage (privacy)
 * - User-Agent is hashed as secondary fingerprint
 * - Requires valid JWT (Supabase auth)
 * - RLS enforced on database level
 * - Max 5 sessions per user, auto-cleanup of expired
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const TRUST_DURATION_MINUTES = 30;

const ALLOWED_ORIGINS = new Set([
    "https://dgskills.app",
    "https://www.dgskills.app",
    "http://localhost:5173",
    "http://localhost:3000",
]);

function getCorsHeaders(req: Request) {
    const origin = req.headers.get("Origin") || "";
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://dgskills.app",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
}

function getClientIp(req: Request): string {
    const raw = req.headers.get("cf-connecting-ip")
        || req.headers.get("x-real-ip")
        || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
        || "unknown";
    return raw.slice(0, 128);
}

async function sha256(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
    const corsHeaders = getCorsHeaders(req);

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // Authenticate user via JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(
            JSON.stringify({ error: "Niet geautoriseerd" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(
            JSON.stringify({ error: "Ongeldige sessie" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // Hash IP and User-Agent
    const clientIp = getClientIp(req);
    const ipHash = await sha256(clientIp);
    const userAgent = req.headers.get("User-Agent") || "unknown";
    const userAgentHash = await sha256(userAgent);

    try {
        if (req.method === "GET") {
            // Check if user has valid trusted session for this IP
            const { data, error } = await supabase.rpc("has_mfa_trust", {
                p_user_id: user.id,
                p_ip_hash: ipHash,
            });

            if (error) {
                console.error("has_mfa_trust RPC error:", error);
                return new Response(
                    JSON.stringify({ trusted: false }),
                    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            return new Response(
                JSON.stringify({ trusted: !!data, ip_hash: ipHash }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (req.method === "POST") {
            // Create trusted session after successful MFA verification
            const { data, error } = await supabase.rpc("create_mfa_trust", {
                p_user_id: user.id,
                p_ip_hash: ipHash,
                p_user_agent_hash: userAgentHash,
                p_duration_minutes: TRUST_DURATION_MINUTES,
            });

            if (error) {
                console.error("create_mfa_trust RPC error:", error);
                return new Response(
                    JSON.stringify({ error: "Vertrouwde sessie aanmaken mislukt" }),
                    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            return new Response(
                JSON.stringify({
                    trusted: true,
                    session_id: data,
                    expires_in_minutes: TRUST_DURATION_MINUTES,
                }),
                { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (req.method === "DELETE") {
            // Revoke all trusted sessions (security action, e.g., password change)
            const { error } = await supabase.rpc("revoke_all_mfa_trust", {
                p_user_id: user.id,
            });

            if (error) {
                console.error("revoke_all_mfa_trust RPC error:", error);
                return new Response(
                    JSON.stringify({ error: "Sessies intrekken mislukt" }),
                    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            return new Response(
                JSON.stringify({ revoked: true }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ error: "Methode niet toegestaan" }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("mfa-trust error:", err);
        return new Response(
            JSON.stringify({ error: "Interne serverfout" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
