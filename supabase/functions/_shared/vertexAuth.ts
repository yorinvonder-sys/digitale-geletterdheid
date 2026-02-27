/**
 * Vertex AI Authentication Helper
 *
 * Generates OAuth2 access tokens from a Google Cloud service account
 * for use with Vertex AI endpoints in Supabase Edge Functions.
 *
 * Why Vertex AI instead of Gemini Developer API?
 * The Developer API ToS forbid use for applications targeting persons under 18.
 * DGSkills targets students aged 12-18, so Vertex AI (enterprise terms) is required.
 *
 * Region: europe-west4 (Netherlands) — data stays in EU.
 * Tokens are cached at module scope (~55 minutes).
 */

interface ServiceAccountKey {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
}

interface CachedToken {
    token: string;
    expiresAt: number;
}

let cachedToken: CachedToken | null = null;

const VERTEX_LOCATION = "europe-west4";

function base64url(str: string): string {
    return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function base64urlBytes(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function getServiceAccountKey(): ServiceAccountKey {
    const raw = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    if (!raw) {
        throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set. Add it via: supabase secrets set GOOGLE_SERVICE_ACCOUNT_KEY='{...}'");
    }
    return JSON.parse(raw);
}

/**
 * Build the Vertex AI generateContent URL for a given model.
 */
export function getVertexUrl(model: string): string {
    const sa = getServiceAccountKey();
    return `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${sa.project_id}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:generateContent`;
}

/**
 * Build the Vertex AI streamGenerateContent URL for a given model.
 */
export function getVertexStreamUrl(model: string): string {
    const sa = getServiceAccountKey();
    return `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${sa.project_id}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:streamGenerateContent?alt=sse`;
}

/**
 * Get a valid OAuth2 access token for Vertex AI.
 * Caches the token and refreshes 5 minutes before expiry.
 */
export async function getAccessToken(): Promise<string> {
    if (cachedToken && Date.now() < cachedToken.expiresAt - 300_000) {
        return cachedToken.token;
    }

    const sa = getServiceAccountKey();
    const now = Math.floor(Date.now() / 1000);

    const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const payload = base64url(
        JSON.stringify({
            iss: sa.client_email,
            scope: "https://www.googleapis.com/auth/cloud-platform",
            aud: "https://oauth2.googleapis.com/token",
            iat: now,
            exp: now + 3600,
        })
    );

    const unsignedToken = `${header}.${payload}`;

    // Import RSA private key from PEM
    const pemBody = sa.private_key
        .replace(/-----BEGIN PRIVATE KEY-----/g, "")
        .replace(/-----END PRIVATE KEY-----/g, "")
        .replace(/\n/g, "");
    const keyBytes = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

    const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        keyBytes,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        cryptoKey,
        new TextEncoder().encode(unsignedToken)
    );

    const jwt = `${unsignedToken}.${base64urlBytes(new Uint8Array(signature))}`;

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });

    if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        throw new Error(`Vertex AI auth failed (${tokenRes.status}): ${errText}`);
    }

    const tokenData = await tokenRes.json();

    cachedToken = {
        token: tokenData.access_token,
        expiresAt: Date.now() + (tokenData.expires_in || 3600) * 1000,
    };

    return cachedToken.token;
}
