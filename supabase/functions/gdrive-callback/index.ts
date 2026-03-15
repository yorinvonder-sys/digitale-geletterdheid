/**
 * Edge Function: /gdrive-callback — Handle Google OAuth2 redirect
 *
 * Google redirects here after user grants access.
 * Exchanges the authorization code for tokens, encrypts the refresh token,
 * creates the "DGSkills Backups" folder, and stores everything in the database.
 * Then redirects the user back to the app.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
    exchangeCodeForTokens,
    encryptToken,
    ensureDriveFolder,
    sha256Hex,
} from "../_shared/gdriveAuth.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const APP_URL = Deno.env.get("ENVIRONMENT") === "production"
    ? "https://dgskills.app"
    : "http://localhost:5173";

Deno.serve(async (req: Request) => {
    // This endpoint receives a GET redirect from Google — no CORS needed.
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // JWT
    const error = url.searchParams.get("error");

    // Redirect helper
    const redirect = (path: string) =>
        new Response(null, {
            status: 302,
            headers: { Location: `${APP_URL}/dashboard?tab=boekhouding&subtab=backup&${path}` },
        });

    // 1. Handle errors from Google
    if (error) {
        console.error("[gdrive-callback] Google error:", error);
        return redirect("gdrive=error&reason=denied");
    }

    if (!code || !state) {
        return redirect("gdrive=error&reason=missing_params");
    }

    // 2. Resolve the short-lived OAuth state to the current user.
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const stateHash = await sha256Hex(state);
    const nowIso = new Date().toISOString();

    const { data: stateRow, error: stateError } = await supabaseAdmin
        .from("google_drive_oauth_states")
        .update({ consumed_at: nowIso })
        .eq("state_hash", stateHash)
        .is("consumed_at", null)
        .gt("expires_at", nowIso)
        .select("user_id, requested_role")
        .single();

    if (stateError || !stateRow?.user_id) {
        console.error("[gdrive-callback] OAuth state verification failed:", stateError);
        return redirect("gdrive=error&reason=auth_failed");
    }

    const { data: adminUserResult, error: adminUserError } = await supabaseAdmin.auth.admin.getUserById(stateRow.user_id);
    const currentRole = adminUserResult?.user?.app_metadata?.role;
    if (adminUserError || !adminUserResult?.user) {
        console.error("[gdrive-callback] Could not resolve user from oauth state:", adminUserError);
        return redirect("gdrive=error&reason=auth_failed");
    }

    if (currentRole !== "developer" && currentRole !== "admin") {
        return redirect("gdrive=error&reason=forbidden");
    }

    // 3. Exchange code for tokens
    const redirectUri = `${SUPABASE_URL}/functions/v1/gdrive-callback`;
    let tokens;
    let email: string;
    try {
        const result = await exchangeCodeForTokens(code, redirectUri);
        tokens = result.tokens;
        email = result.email;
    } catch (err) {
        console.error("[gdrive-callback] Token exchange failed:", err);
        return redirect("gdrive=error&reason=token_exchange");
    }

    if (!tokens.refresh_token) {
        console.error("[gdrive-callback] No refresh token received");
        return redirect("gdrive=error&reason=no_refresh_token");
    }

    // 4. Encrypt refresh token
    let encryptedRefreshToken: string;
    try {
        encryptedRefreshToken = await encryptToken(tokens.refresh_token);
    } catch (err) {
        console.error("[gdrive-callback] Encryption failed:", err);
        return redirect("gdrive=error&reason=encryption");
    }

    // 5. Create root folder in Drive
    let rootFolderId: string;
    try {
        rootFolderId = await ensureDriveFolder(tokens.access_token, "DGSkills Backups");
    } catch (err) {
        console.error("[gdrive-callback] Folder creation failed:", err);
        return redirect("gdrive=error&reason=folder_creation");
    }

    // 6. Store connection in database (service role — bypasses RLS)
    const { error: dbError } = await supabaseAdmin
        .from("google_drive_connections")
        .upsert({
            user_id: stateRow.user_id,
            refresh_token_encrypted: encryptedRefreshToken,
            access_token: tokens.access_token,
            access_token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
            root_folder_id: rootFolderId,
            google_email: email,
            connected_at: new Date().toISOString(),
            last_backup_status: null,
            last_backup_error: null,
        }, { onConflict: "user_id" });

    if (dbError) {
        console.error("[gdrive-callback] DB error:", dbError);
        return redirect("gdrive=error&reason=db_error");
    }

    // 7. Redirect back to app
    return redirect("gdrive=connected");
});
