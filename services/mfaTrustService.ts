/**
 * MFA Trust Service — Client-side interface for IP-based MFA grace periods.
 *
 * After successful MFA verification, creates a trusted session so the user
 * doesn't need to re-enter MFA for 30 minutes from the same IP address.
 */
import { supabase, EDGE_FUNCTION_URL } from './supabase';

async function callMfaTrust<T = any>(method: 'GET' | 'POST' | 'DELETE'): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
        throw new Error('Authenticatie vereist.');
    }

    const response = await fetch(`${EDGE_FUNCTION_URL}/mfa-trust`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error || `mfa-trust ${method} failed: ${response.status}`);
    }

    return response.json();
}

/**
 * Check if the current IP has a valid MFA trusted session.
 * Returns true if MFA can be skipped for this session.
 */
export async function checkMfaTrust(): Promise<boolean> {
    try {
        const result = await callMfaTrust<{ trusted: boolean }>('GET');
        return result.trusted === true;
    } catch (err) {
        console.warn('MFA trust check failed, requiring MFA:', err);
        return false;
    }
}

/**
 * Create a trusted session after successful MFA verification.
 * Call this immediately after verifyMfa() succeeds.
 */
export async function createMfaTrust(): Promise<void> {
    try {
        await callMfaTrust('POST');
    } catch (err) {
        // Non-critical: if trust creation fails, user just has to MFA again next time
        console.warn('Could not create MFA trusted session:', err);
    }
}

/**
 * Revoke all trusted sessions for the current user.
 * Call on password change, security events, or manual logout.
 */
export async function revokeAllMfaTrust(): Promise<void> {
    try {
        await callMfaTrust('DELETE');
    } catch (err) {
        console.warn('Could not revoke MFA trusted sessions:', err);
    }
}
