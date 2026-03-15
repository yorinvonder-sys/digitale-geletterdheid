/**
 * Edge Function: /gdrive-auth — Start Google Drive OAuth2 flow
 *
 * Returns the Google OAuth2 authorization URL.
 * Only accessible by developer/admin roles.
 *
 * Input:  (none, just auth header)
 * Output: { url: string }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { buildAuthUrl, generateOAuthState, sha256Hex } from "../_shared/gdriveAuth.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS");
    const rejected = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejected) return rejected;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // 1. Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(
            JSON.stringify({ error: "Ongeldige sessie." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // 2. Role check — developer/admin only
    const role = user.app_metadata?.role;
    if (role !== "developer" && role !== "admin") {
        return new Response(
            JSON.stringify({ error: "Geen toegang." }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
        return new Response(
            JSON.stringify({ error: "Drive-koppeling is niet correct geconfigureerd." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const state = generateOAuthState();
    const stateHash = await sha256Hex(state);
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: stateError } = await adminClient
        .from("google_drive_oauth_states")
        .insert({
            state_hash: stateHash,
            user_id: user.id,
            requested_role: role,
            expires_at: expiresAt,
        });

    if (stateError) {
        console.error("[gdrive-auth] Failed to store oauth state:", stateError);
        return new Response(
            JSON.stringify({ error: "Kon de Drive-koppeling niet starten." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // 3. Build OAuth URL with a short-lived opaque state token.
    const redirectUri = `${SUPABASE_URL}/functions/v1/gdrive-callback`;
    const url = buildAuthUrl(redirectUri, state);

    return new Response(
        JSON.stringify({ url }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
});
