// Auth: Microsoft SSO, email/password, role detection, MFA
import { supabase } from './supabase';
import type { ParentUser, UserRole } from '../types';
import { logAccountCreated } from './auditService';
import { enforcePasswordPolicy } from '../utils/passwordValidator';
import { validateEmail } from '../utils/emailValidator';
import type { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';

// --- Helpers ---

const detectIdentifier = (email: string | null): string => {
    if (!email) return 'unknown';
    const [localPart = 'unknown'] = email.split('@');

    // Leerlingnummer: 6 of 7 cijfers
    if (/^\d{6,7}$/.test(localPart)) {
        return localPart;
    }

    // Fallback: bounded local part to avoid oversized identifiers
    return localPart.slice(0, 32);
};

// SECURITY: Only trust app_metadata (set server-side), never user_metadata.
const getRoleFromMeta = (user: SupabaseUser): UserRole | null => {
    const rawRole = user.app_metadata?.role;
    if (rawRole === 'student' || rawRole === 'teacher' || rawRole === 'admin' || rawRole === 'developer') {
        return rawRole;
    }
    if (user.app_metadata?.admin === true) {
        return 'admin';
    }
    return null;
};

const getSchoolIdFromMeta = (user: SupabaseUser): string | null => {
    return (user.app_metadata?.schoolId as string) ?? null;
};

// --- SSO ---

export const signInWithMicrosoft = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
                scopes: 'email profile openid',
                queryParams: {
                    prompt: 'select_account',
                },
                redirectTo: `${window.location.origin}/login`,
            },
        });

        if (error) throw error;

        // Page will unload — session picked up on return via detectSessionInUrl
        return null;
    } catch (error: any) {
        console.error('Error signing in with Microsoft:', error);
        throw new Error(error.message || 'Onbekende Microsoft login fout.');
    }
};

// --- Email / Password ---

export const registerWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    studentClass?: string
) => {
    try {
        // Validate email format before hitting Supabase (prevents bounced emails)
        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            throw new Error(
                emailCheck.suggestion
                    ? `${emailCheck.error} ${emailCheck.suggestion}`
                    : emailCheck.error ?? 'Ongeldig e-mailadres.'
            );
        }

        const [localPart = '', domain = ''] = email.toLowerCase().split('@');
        if (domain === 'almerecollege.nl' && /^[a-z]{3}$/.test(localPart)) {
            throw new Error(
                'Docentaccounts mogen niet via e-mailregistratie worden aangemaakt. Gebruik Microsoft SSO.'
            );
        }

        enforcePasswordPolicy(password);


        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                    student_class: studentClass ?? null,
                },
            },
        });

        if (error) {
            if (error.message.includes('already registered')) {
                throw new Error(
                    'Dit e-mailadres is al in gebruik. Probeer in te loggen of gebruik een ander e-mailadres.'
                );
            }
            if (error.message.includes('invalid') && error.message.includes('email')) {
                throw new Error('Ongeldig e-mailadres. Controleer het adres en probeer opnieuw.');
            }
            if (error.message.includes('password')) {
                throw new Error('Wachtwoord is te zwak. Gebruik minimaal 6 tekens.');
            }
            throw error;
        }

        const user = data.user;
        if (!user) throw new Error('Registratie mislukt. Probeer het opnieuw.');


        const identifier = detectIdentifier(email);
        const { error: profileError } = await supabase.from('users').upsert({
            id: user.id,
            uid: user.id,
            email: user.email ?? email,
            display_name: displayName,
            student_class: studentClass ?? null,
            role: 'student',
            school_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

        if (profileError) {
            console.warn('Could not create user profile:', profileError);
            // Continue anyway — user can still use the app
        }


        logAccountCreated('email');

        return user;
    } catch (error: any) {
        console.error('Error registering with email:', error);
        throw error;
    }
};

export const signInWithEmail = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                throw new Error(
                    'E-mail of wachtwoord onjuist. Controleer je gegevens en probeer opnieuw.'
                );
            }
            if (error.message.includes('too many requests') || error.status === 429) {
                throw new Error('Te veel mislukte pogingen. Wacht even en probeer opnieuw.');
            }
            throw error;
        }

        return data.user;
    } catch (error: any) {
        console.error('Error signing in with email:', error);
        throw error;
    }
};

export const resetPassword = async (email: string) => {
    try {
        // Validate email before sending reset (prevents bounced emails)
        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            throw new Error(
                emailCheck.suggestion
                    ? `${emailCheck.error} ${emailCheck.suggestion}`
                    : emailCheck.error ?? 'Ongeldig e-mailadres.'
            );
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        // Security: Always return success to prevent email enumeration.
        // If the email doesn't exist, Supabase won't send anything,
        // but the user gets a generic "check your inbox" message.
        if (error) {
            // Only throw on genuine server errors, not "user not found"
            if (!error.message.includes('not found') && !error.message.includes('invalid')) {
                throw new Error('Kon wachtwoord reset mail niet versturen. Probeer het later opnieuw.');
            }
        }
    } catch (error: any) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

// --- Logout ---

export const logout = async () => {
    await supabase.auth.signOut();

    window.location.href = '/login';
};

// --- Redirect handling ---

/** Kept for API compat — Supabase handles this via detectSessionInUrl. */
export const handleRedirectResult = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
};

// --- Auth State Listener ---


export const subscribeToAuthChanges = (callback: (user: ParentUser | null) => void) => {


    const buildParentUser = async (supabaseUser: SupabaseUser): Promise<ParentUser> => {
        const metaRole = getRoleFromMeta(supabaseUser);
        const metaSchoolId = getSchoolIdFromMeta(supabaseUser);
        const identifier = detectIdentifier(supabaseUser.email ?? null);

        // P2-2 FIX: Never trust DB role — app_metadata is the single source of truth.
        // Fallback to 'student' prevents privilege escalation via profile.role tampering.
        let finalRole: UserRole = metaRole ?? 'student';
        let finalSchoolId = metaSchoolId;
        let existingStudentClass: string | undefined;
        let existingStats: ParentUser['stats'] | undefined;
        let mustChangePassword = false;
        let chatLocked = false;
        let chatLockReason: string | undefined;
        let chatLockTime: string | undefined;
        let finalIdentifier = identifier;


        try {
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

            if (profile) {
                // P2-2 FIX: NEVER fall back to profile.role — it is user-mutable via DB.
                // Only trust app_metadata.role (set server-side). schoolId is safe to read from profile.
                if (!metaSchoolId && profile.school_id) finalSchoolId = profile.school_id;
                if (profile.student_class) existingStudentClass = profile.student_class;
                if (profile.stats) existingStats = profile.stats as unknown as ParentUser['stats'];
                if (profile.must_change_password) mustChangePassword = profile.must_change_password;
                if (profile.chat_locked) chatLocked = profile.chat_locked;
                if (profile.chat_lock_reason) chatLockReason = profile.chat_lock_reason;
                if (profile.chat_lock_time) chatLockTime = profile.chat_lock_time;

                try {
                    await supabase
                        .from('users')
                        .update({
                            display_name: supabaseUser.user_metadata?.display_name ?? supabaseUser.user_metadata?.full_name ?? profile.display_name,
                            email: supabaseUser.email,
                            school_id: finalSchoolId,
                            last_login: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', supabaseUser.id);
                } catch (writeErr) {
                    console.warn('Could not update lastLogin:', writeErr);
                }
            } else {
                try {
                    await supabase.from('users').insert({
                        id: supabaseUser.id,
                        uid: supabaseUser.id,
                        display_name: supabaseUser.user_metadata?.display_name ?? supabaseUser.user_metadata?.full_name ?? null,
                        email: supabaseUser.email ?? null,
                        role: 'student',
                        school_id: finalSchoolId,
                        last_login: new Date().toISOString(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });
                } catch (writeErr) {
                    console.warn('Could not create user document:', writeErr);
                }
            }
        } catch (err) {
            console.error('Error syncing user to Supabase:', err);
        }

        // M-05: MFA enforcement — privileged roles must have AAL2
        let mfaPending = false;
        if (requiresMfa(finalRole)) {
            try {
                const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
                // MFA pending if: role requires it, but user hasn't reached AAL2
                if (aal?.currentLevel !== 'aal2') {
                    mfaPending = true;
                }
            } catch {
                // If MFA check fails, don't block — just log
                console.warn('MFA check failed, continuing without enforcement');
            }
        }

        return {
            uid: supabaseUser.id,
            displayName: supabaseUser.user_metadata?.display_name ?? supabaseUser.user_metadata?.full_name ?? null,
            email: supabaseUser.email ?? null,
            photoURL: supabaseUser.user_metadata?.avatar_url ?? null,
            role: finalRole,
            schoolId: finalSchoolId || undefined,
            identifier: finalIdentifier,
            studentClass: existingStudentClass,
            stats: existingStats,
            mustChangePassword,
            chatLocked,
            chatLockReason,
            chatLockTime,
            mfaPending,
        };
    };


    // CRITICAL FIX: Gebruik getUser() i.p.v. getSession() voor de initiële check.
    // getSession() leest alleen uit localStorage en valideert NIET tegen de server.
    // Een server-side gerevoked token (bijv. na wachtwoord-reset of admin-actie)
    // passeert getSession() maar faalt bij getUser(). Zonder deze server-validatie
    // ontstaat een login-loop: LoginRoute denkt dat de user is ingelogd,
    // redirect naar /dashboard, maar alle API-calls falen → terug naar /login → loop.
    supabase.auth.getUser().then(async ({ data: { user: verifiedUser }, error }) => {
        if (error || !verifiedUser) {
            // Token is ongeldig server-side — opruimen en behandelen als uitgelogd.
            try {
                await supabase.auth.signOut({ scope: 'local' });
            } catch { /* negeer — we forceren sowieso unauthenticated state */ }
            callback(null);
            return;
        }
        try {
            const parentUser = await buildParentUser(verifiedUser);
            callback(parentUser);
        } catch (err) {
            console.error('buildParentUser failed, falling back to null:', err);
            callback(null);
        }
    }).catch(async (err) => {
        if (err?.name === 'AbortError') {
            // AbortError = concurrent auth-operatie. Retry eenmaal na korte pauze.
            try {
                await new Promise(r => setTimeout(r, 500));
                const { data: { user: retryUser }, error: retryErr } = await supabase.auth.getUser();
                if (!retryErr && retryUser) {
                    const parentUser = await buildParentUser(retryUser);
                    callback(parentUser);
                    return;
                }
            } catch { /* retry ook mislukt */ }
            // Opruimen bij falen
            try { await supabase.auth.signOut({ scope: 'local' }); } catch { /* negeer */ }
            callback(null);
            return;
        }
        // Andere fouten (netwerk, corrupt token): behandel als uitgelogd.
        console.error('getUser() failed, treating as signed out:', err);
        try { await supabase.auth.signOut({ scope: 'local' }); } catch { /* negeer */ }
        callback(null);
    });


    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.user) {
                    const parentUser = await buildParentUser(session.user);
                    callback(parentUser);
                }
            } else if (event === 'SIGNED_OUT') {
                callback(null);
            }
        }
    );


    return () => {
        subscription.unsubscribe();
    };
};

// --- MFA (Cbw/NIS2 Art. 21) ---

/** Privileged roles must use MFA (Cbw/NIS2 compliance). */
export const requiresMfa = (role: UserRole | null): boolean =>
    role !== null && ['teacher', 'admin', 'developer'].includes(role);


export const enrollMfa = async (): Promise<{
    id: string;
    qrCode: string;
    secret: string;
    uri: string;
}> => {
    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'DGSkills Authenticator',
    });

    if (error) {
        console.error('MFA enrollment failed:', error);
        throw new Error('MFA activeren mislukt: ' + error.message);
    }

    return {
        id: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
        uri: data.totp.uri,
    };
};


export const verifyMfa = async (factorId: string, code: string): Promise<boolean> => {

    const { data: challengeData, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) {
        console.error('MFA challenge failed:', challengeError);
        throw new Error('MFA verificatie mislukt: ' + challengeError.message);
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
    });

    if (verifyError) {
        console.error('MFA verify failed:', verifyError);
        throw new Error('Ongeldige verificatiecode. Probeer opnieuw.');
    }

    return true;
};


export const unenrollMfa = async (factorId: string): Promise<void> => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) {
        console.error('MFA unenroll failed:', error);
        throw new Error('MFA deactiveren mislukt: ' + error.message);
    }
};


export const getMfaStatus = async (): Promise<{
    isEnrolled: boolean;
    isVerified: boolean;
    factors: Array<{ id: string; friendlyName: string; status: string }>;
    assuranceLevel: 'aal1' | 'aal2';
}> => {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (error) {
        console.error('MFA status check failed:', error);
        return {
            isEnrolled: false,
            isVerified: false,
            factors: [],
            assuranceLevel: 'aal1',
        };
    }

    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const totpFactors = (factorsData?.totp ?? []).map(f => ({
        id: f.id,
        friendlyName: f.friendly_name ?? 'Authenticator',
        status: f.status,
    }));

    return {
        isEnrolled: totpFactors.some(f => f.status === 'verified'),
        isVerified: data.currentLevel === 'aal2',
        factors: totpFactors,
        assuranceLevel: data.currentLevel ?? 'aal1',
    };
};
