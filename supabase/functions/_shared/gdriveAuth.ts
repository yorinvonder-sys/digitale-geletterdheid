/**
 * Google Drive OAuth2 & API Helper
 *
 * Handles:
 * - Token encryption/decryption (AES-256-GCM via Web Crypto)
 * - OAuth2 code exchange and token refresh
 * - Google Drive file/folder operations
 *
 * Environment variables required:
 * - GDRIVE_CLIENT_ID
 * - GDRIVE_CLIENT_SECRET
 * - GDRIVE_TOKEN_ENCRYPTION_KEY (64-char hex string = 32 bytes)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DriveConnection {
    refresh_token_encrypted: string; // base64-encoded IV+ciphertext
    access_token: string | null;
    access_token_expires_at: string | null;
    root_folder_id: string | null;
}

interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
}

interface UserInfo {
    email: string;
}

function toBase64Url(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...buffer))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

export function generateOAuthState(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return toBase64Url(bytes);
}

export async function sha256Hex(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

// ---------------------------------------------------------------------------
// Encryption (AES-256-GCM)
// ---------------------------------------------------------------------------

function getEncryptionKey(): Uint8Array {
    const hex = Deno.env.get("GDRIVE_TOKEN_ENCRYPTION_KEY");
    if (!hex || hex.length !== 64) {
        throw new Error("GDRIVE_TOKEN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)");
    }
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}

async function importKey(): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        "raw",
        getEncryptionKey(),
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"],
    );
}

/**
 * Encrypt a plaintext string. Returns base64-encoded (12-byte IV || ciphertext).
 */
export async function encryptToken(plaintext: string): Promise<string> {
    const key = await importKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded,
    );
    // Concat IV + ciphertext
    const combined = new Uint8Array(12 + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), 12);
    return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a base64-encoded (IV || ciphertext) string back to plaintext.
 */
export async function decryptToken(encrypted: string): Promise<string> {
    const key = await importKey();
    const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext,
    );
    return new TextDecoder().decode(decrypted);
}

// ---------------------------------------------------------------------------
// OAuth2 Token Exchange
// ---------------------------------------------------------------------------

function getClientId(): string {
    const id = Deno.env.get("GDRIVE_CLIENT_ID");
    if (!id) throw new Error("GDRIVE_CLIENT_ID not set");
    return id;
}

function getClientSecret(): string {
    const secret = Deno.env.get("GDRIVE_CLIENT_SECRET");
    if (!secret) throw new Error("GDRIVE_CLIENT_SECRET not set");
    return secret;
}

/**
 * Exchange an authorization code for access + refresh tokens.
 */
export async function exchangeCodeForTokens(
    code: string,
    redirectUri: string,
): Promise<{ tokens: TokenResponse; email: string }> {
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: getClientId(),
            client_secret: getClientSecret(),
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Token exchange failed (${res.status}): ${errText}`);
    }

    const tokens: TokenResponse = await res.json();

    // Get user email
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userInfo: UserInfo = userInfoRes.ok
        ? await userInfoRes.json()
        : { email: "onbekend" };

    return { tokens, email: userInfo.email };
}

/**
 * Use a refresh token to get a new access token.
 */
export async function refreshAccessToken(
    refreshTokenEncrypted: string,
): Promise<{ access_token: string; expires_in: number }> {
    const refreshToken = await decryptToken(refreshTokenEncrypted);

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            refresh_token: refreshToken,
            client_id: getClientId(),
            client_secret: getClientSecret(),
            grant_type: "refresh_token",
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Token refresh failed (${res.status}): ${errText}`);
    }

    return await res.json();
}

/**
 * Get a valid access token, refreshing if expired.
 * Returns the token string and whether it was refreshed.
 */
export async function getValidAccessToken(
    connection: DriveConnection,
): Promise<{ accessToken: string; refreshed: boolean; expiresAt: string }> {
    // Check if current token is still valid (with 5-min buffer)
    if (
        connection.access_token &&
        connection.access_token_expires_at &&
        new Date(connection.access_token_expires_at).getTime() > Date.now() + 300_000
    ) {
        return {
            accessToken: connection.access_token,
            refreshed: false,
            expiresAt: connection.access_token_expires_at,
        };
    }

    // Refresh
    const { access_token, expires_in } = await refreshAccessToken(
        connection.refresh_token_encrypted,
    );
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    return { accessToken: access_token, refreshed: true, expiresAt };
}

// ---------------------------------------------------------------------------
// Google Drive API v3
// ---------------------------------------------------------------------------

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";

/**
 * Find a folder by name (optionally within a parent folder).
 */
export async function findDriveFolder(
    accessToken: string,
    name: string,
    parentId?: string,
): Promise<string | null> {
    let q = `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    if (parentId) {
        q += ` and '${parentId}' in parents`;
    }

    const res = await fetch(
        `${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id,name)&spaces=drive`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.files?.[0]?.id || null;
}

/**
 * Create a folder in Google Drive. Returns the folder ID.
 */
export async function createDriveFolder(
    accessToken: string,
    name: string,
    parentId?: string,
): Promise<string> {
    const metadata: Record<string, unknown> = {
        name,
        mimeType: "application/vnd.google-apps.folder",
    };
    if (parentId) {
        metadata.parents = [parentId];
    }

    const res = await fetch(`${DRIVE_API}/files`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to create Drive folder (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.id;
}

/**
 * Ensure a folder exists (find or create). Returns folder ID.
 */
export async function ensureDriveFolder(
    accessToken: string,
    name: string,
    parentId?: string,
): Promise<string> {
    const existing = await findDriveFolder(accessToken, name, parentId);
    if (existing) return existing;
    return createDriveFolder(accessToken, name, parentId);
}

/**
 * Upload a file to Google Drive using multipart upload.
 * Returns the file ID.
 */
export async function uploadFileToDrive(
    accessToken: string,
    folderId: string,
    fileName: string,
    data: Uint8Array,
    mimeType: string,
): Promise<{ fileId: string; fileSize: number }> {
    const metadata = JSON.stringify({
        name: fileName,
        parents: [folderId],
    });

    // Build multipart body
    const boundary = "---gdrive-backup-boundary---";
    const encoder = new TextEncoder();

    const metadataPart = encoder.encode(
        `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
    );
    const dataPart = encoder.encode(
        `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`,
    );
    const endPart = encoder.encode(`\r\n--${boundary}--`);

    const body = new Uint8Array(
        metadataPart.length + dataPart.length + data.length + endPart.length,
    );
    let offset = 0;
    body.set(metadataPart, offset); offset += metadataPart.length;
    body.set(dataPart, offset); offset += dataPart.length;
    body.set(data, offset); offset += data.length;
    body.set(endPart, offset);

    const res = await fetch(
        `${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id,size`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": `multipart/related; boundary=${boundary}`,
            },
            body,
        },
    );

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Drive upload failed (${res.status}): ${errText}`);
    }

    const result = await res.json();
    return { fileId: result.id, fileSize: parseInt(result.size || "0", 10) };
}

/**
 * Revoke a refresh token (used when disconnecting).
 */
export async function revokeToken(refreshTokenEncrypted: string): Promise<void> {
    try {
        const token = await decryptToken(refreshTokenEncrypted);
        await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
    } catch {
        // Best effort — don't fail disconnect if revoke fails
    }
}

/**
 * Build the Google OAuth2 authorization URL.
 */
export function buildAuthUrl(redirectUri: string, state: string): string {
    const params = new URLSearchParams({
        client_id: getClientId(),
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email",
        access_type: "offline",
        prompt: "consent",
        state,
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
