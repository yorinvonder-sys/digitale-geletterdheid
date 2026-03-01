import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

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
                const payload = JSON.parse(atob(token.split('.')[1]));
                // exp is in seconden, Date.now() in ms
                if (payload.exp * 1000 < Date.now() + EXPIRY_BUFFER_MS) {
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

export const EDGE_FUNCTION_URL = `${supabaseUrl}/functions/v1`;

export interface EdgeFunctionOptions<T = any> {
    /** Optional response validator. Throw or return null to reject. */
    validate?: (data: unknown) => T;
}

export async function callEdgeFunction<T = any>(
    functionName: string,
    body?: Record<string, unknown>,
    options?: EdgeFunctionOptions<T>
): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
        throw new Error('Authenticatie vereist. Log opnieuw in.');
    }

    const response = await fetch(`${EDGE_FUNCTION_URL}/${functionName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
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
        throw new Error(error.message || `Edge function ${functionName} failed: ${response.status}`);
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
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
        throw new Error('Authenticatie vereist. Log opnieuw in.');
    }

    const response = await fetch(`${EDGE_FUNCTION_URL}/${functionName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
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
        throw new Error(error.message || `Edge function ${functionName} failed: ${response.status}`);
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

export default supabase;
