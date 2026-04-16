import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = ((import.meta as any).env.VITE_SUPABASE_URL as string)?.trim();
const supabaseAnonKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY as string)?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. ' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.'
    );
}

// Opschoning VOOR client-init: verwijder stale/verlopen auth-tokens.
// Dit moet VOOR createClient() gebeuren, anders start Supabase een
// auto-refresh loop op een ongeldig token (→ eindeloze AbortErrors).
try {
    const projectId = new URL(supabaseUrl).hostname.split('.')[0];
    const activeKey = `sb-${projectId}-auth-token`;

    // 1) Verwijder tokens van ANDERE Supabase-projecten
    Object.keys(localStorage)
        .filter((k) => /^sb-[a-z0-9_-]+-auth-token$/i.test(k) && k !== activeKey)
        .forEach((k) => localStorage.removeItem(k));

    // 2) Verwijder het EIGEN project-token als het JWT verlopen is of bijna verloopt.
    //    Buffer van 5 minuten voorkomt dat een token verloopt terwijl Supabase
    //    het probeert te refreshen (→ eindeloze AbortError-loop).
    const EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minuten
    const raw = localStorage.getItem(activeKey);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            const token = parsed?.access_token || parsed?.currentSession?.access_token;
            if (token) {
                const expiryMs = getTokenExpiryMs(token);
                if (expiryMs === null || expiryMs < Date.now() + EXPIRY_BUFFER_MS) {
                    localStorage.removeItem(activeKey);
                }
            } else {
                // Geen access_token gevonden in de opgeslagen data → verwijderen
                localStorage.removeItem(activeKey);
            }
        } catch { /* JWT parse mislukt → token is corrupt → verwijderen */
            localStorage.removeItem(activeKey);
        }
    }
} catch { /* negeer als URL-parsing of localStorage faalt */ }

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});

const isDevEdgeProxy = (() => {
    try {
        return (import.meta as any).env?.DEV === true && typeof window !== 'undefined';
    } catch {
        return false;
    }
})();

export const EDGE_FUNCTION_URL = isDevEdgeProxy
    ? '/functions/v1'
    : `${supabaseUrl}/functions/v1`;

export interface EdgeFunctionOptions<T = any> {
    /** Optional response validator. Throw or return null to reject. */
    validate?: (data: unknown) => T;
}

export interface AuthenticatedFetchOptions {
    expiryBufferMs?: number;
    onSessionExpired?: 'redirect' | 'throw';
    sessionExpiredMessage?: string;
    fetcher?: (input: string, init: RequestInit) => Promise<Response>;
}

const DEFAULT_TOKEN_EXPIRY_BUFFER_MS = 2 * 60 * 1000;
const MIN_ACCEPTABLE_TOKEN_TTL_MS = 5 * 1000;
const DEFAULT_AUTH_ERROR_MESSAGE = 'Authenticatie vereist. Log opnieuw in.';
let sessionExpiryHandlingInFlight = false;

/** Check of een token een geldig JWT-format heeft (3 base64url-segmenten). */
function isValidJwt(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3 && parts.every(p => p.length > 0);
}

function decodeBase64Url(input: string): string {
    let normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4;
    if (padding > 0) {
        normalized += '='.repeat(4 - padding);
    }
    return atob(normalized);
}

function getTokenExpiryMs(token: string): number | null {
    if (!isValidJwt(token)) return null;

    try {
        const payload = JSON.parse(decodeBase64Url(token.split('.')[1]));
        return typeof payload?.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
        return null;
    }
}

function isTokenFresh(token: string, expiryBufferMs: number): boolean {
    const expiryMs = getTokenExpiryMs(token);
    return expiryMs !== null && expiryMs > Date.now() + expiryBufferMs;
}

function withBearerToken(init: RequestInit, token: string): RequestInit {
    const headers = new Headers(init.headers ?? undefined);
    headers.set('Authorization', `Bearer ${token}`);
    return {
        ...init,
        headers,
    };
}

export class SessionExpiredError extends Error {
    constructor(message = DEFAULT_AUTH_ERROR_MESSAGE) {
        super(message);
        this.name = 'SessionExpiredError';
    }
}

export function isSessionExpiredError(error: unknown): error is SessionExpiredError {
    return error instanceof SessionExpiredError;
}

export async function getFreshAccessToken(
    expiryBufferMs = DEFAULT_TOKEN_EXPIRY_BUFFER_MS,
    options?: { forceRefresh?: boolean }
): Promise<string> {
    if (!options?.forceRefresh) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token && isTokenFresh(session.access_token, expiryBufferMs)) {
            sessionExpiryHandlingInFlight = false;
            return session.access_token;
        }
    }

    const { data: { session: refreshed }, error } = await supabase.auth.refreshSession();
    if (error) {
        throw new SessionExpiredError();
    }

    if (refreshed?.access_token && isTokenFresh(refreshed.access_token, MIN_ACCEPTABLE_TOKEN_TTL_MS)) {
        sessionExpiryHandlingInFlight = false;
        return refreshed.access_token;
    }

    throw new SessionExpiredError();
}

export async function handleSessionExpired(
    message = 'Je sessie is verlopen. Log opnieuw in.'
): Promise<never> {
    const error = new SessionExpiredError(message);

    if (typeof window === 'undefined') {
        throw error;
    }

    if (!sessionExpiryHandlingInFlight) {
        sessionExpiryHandlingInFlight = true;

        try {
            await supabase.auth.signOut({ scope: 'local' });
        } catch (signOutError) {
            console.warn('Local signOut failed during session expiry handling:', signOutError);
        }

        try {
            cleanupSupabaseAuthStorage({
                forceClearActiveAuthToken: true,
                preserveActiveCodeVerifierIfOAuthCallback: true,
            });
        } catch (cleanupError) {
            console.warn('cleanupSupabaseAuthStorage failed during session expiry handling:', cleanupError);
        }

        const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        const hasSafeRedirectTarget =
            currentPath.startsWith('/')
            && !currentPath.startsWith('//')
            && !currentPath.startsWith('/login');
        const loginPath = hasSafeRedirectTarget
            ? `/login?redirect=${encodeURIComponent(currentPath)}`
            : '/login';

        try {
            window.history.replaceState({}, '', loginPath);
            window.dispatchEvent(new Event('pathchange'));
        } catch {
            window.location.href = loginPath;
        }
    }

    throw error;
}

export async function authenticatedFetch(
    input: string,
    init: RequestInit = {},
    options?: AuthenticatedFetchOptions
): Promise<Response> {
    const expiryBufferMs = options?.expiryBufferMs ?? DEFAULT_TOKEN_EXPIRY_BUFFER_MS;
    const onSessionExpired = options?.onSessionExpired ?? 'redirect';
    const sessionExpiredMessage = options?.sessionExpiredMessage ?? DEFAULT_AUTH_ERROR_MESSAGE;
    const fetcher = options?.fetcher ?? ((url: string, requestInit: RequestInit) => fetch(url, requestInit));
    let authFailureSource: 'local-session' | 'remote-401' = 'local-session';

    try {
        const token = await getFreshAccessToken(expiryBufferMs);
        let response = await fetcher(input, withBearerToken(init, token));
        if (response.status !== 401) {
            return response;
        }

        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.access_token && isTokenFresh(currentSession.access_token, MIN_ACCEPTABLE_TOKEN_TTL_MS)) {
            authFailureSource = 'remote-401';
            console.warn('[authenticatedFetch] Edge function rejected a valid fresh token. Skipping refresh to preserve local session.', { input });
        } else {
            const refreshedToken = await getFreshAccessToken(expiryBufferMs, { forceRefresh: true });
            authFailureSource = 'remote-401';
            response = await fetcher(input, withBearerToken(init, refreshedToken));
            if (response.status !== 401) {
                return response;
            }
            console.warn(
                '[authenticatedFetch] Edge function rejected a freshly refreshed session with 401. ' +
                'Keeping local session intact and surfacing an auth error instead.',
                { input }
            );
        }
    } catch (error) {
        if (!isSessionExpiredError(error)) {
            throw error;
        }
    }

    if (authFailureSource === 'remote-401') {
        throw new Error('AI-backend gaf een ongeldige-tokenfout terug. Probeer het opnieuw.');
    }

    if (onSessionExpired === 'redirect') {
        return handleSessionExpired(sessionExpiredMessage);
    }

    throw new SessionExpiredError(sessionExpiredMessage);
}

export async function callEdgeFunction<T = any>(
    functionName: string,
    body?: Record<string, unknown>,
    options?: EdgeFunctionOptions<T>
): Promise<T> {
    const response = await authenticatedFetch(`${EDGE_FUNCTION_URL}/${functionName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    // M-03: Handle server-side rate limiting (429)
    if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new Error(
            retryAfter
                ? `Rate limit bereikt. Probeer opnieuw over ${retryAfter} seconden.`
                : 'Te veel verzoeken. Probeer later opnieuw.'
        );
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.error || error.message || `Edge function ${functionName} failed: ${response.status}`);
    }

    const data = await response.json();

    // M-04: Optional response validation
    if (options?.validate) {
        try {
            const validated = options.validate(data);
            if (validated === null || validated === undefined) {
                throw new Error('Onverwachte response van server.');
            }
            return validated;
        } catch (e: any) {
            console.error(`[callEdgeFunction] Response validation failed for ${functionName}:`, e);
            throw new Error(e.message || 'Onverwachte response van server.');
        }
    }

    return data;
}

export async function callStreamingEdgeFunction(
    functionName: string,
    body: Record<string, unknown>,
    onChunk: (text: string) => void
): Promise<void> {
    const response = await authenticatedFetch(`${EDGE_FUNCTION_URL}/${functionName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    // M-03: Handle server-side rate limiting (429)
    if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new Error(
            retryAfter
                ? `Rate limit bereikt. Probeer opnieuw over ${retryAfter} seconden.`
                : 'Te veel verzoeken. Probeer later opnieuw.'
        );
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.error || error.message || `Edge function ${functionName} failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onChunk(decoder.decode(value, { stream: true }));
    }
}

export function cleanupSupabaseAuthStorage(options?: {
    forceClearActiveAuthToken?: boolean;
    preserveActiveCodeVerifierIfOAuthCallback?: boolean;
}) {
    try {
        const projectId = new URL(supabaseUrl).hostname.split('.')[0];
        const activeKey = `sb-${projectId}-auth-token`;
        const codeVerifierKey = `sb-${projectId}-auth-token-code-verifier`;

        // Verwijder tokens van andere projecten
        Object.keys(localStorage)
            .filter((k) => /^sb-[a-z0-9_-]+-auth-token$/i.test(k) && k !== activeKey)
            .forEach((k) => localStorage.removeItem(k));

        // Verwijder actieve auth token indien gewenst
        if (options?.forceClearActiveAuthToken) {
            localStorage.removeItem(activeKey);
        }

        // Bewaar code verifier als we midden in een OAuth callback zitten
        if (!options?.preserveActiveCodeVerifierIfOAuthCallback || !window.location.search.includes('code=')) {
            localStorage.removeItem(codeVerifierKey);
        }
    } catch { /* negeer */ }
}

export default supabase;
