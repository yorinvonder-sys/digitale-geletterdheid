// Auth: Microsoft SSO, email/password, role detection, MFA
import { supabase, cleanupSupabaseAuthStorage } from './supabase';
import type { ParentUser, UserRole } from '../types';
import { logAccountCreated } from './auditService';
import { enforcePasswordPolicy } from '../utils/passwordValidator';
import { validateEmail } from '../utils/emailValidator';
import { revokeAllMfaTrust } from './mfaTrustService';
import { getAllSSODomains } from './curriculumService';
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

        // Block teacher-pattern registrations on any configured SSO domain.
        // Teacher accounts on SSO domains must use Microsoft SSO.
        // Fallback: if no school configs exist, use legacy almerecollege.nl check.
        let ssoDomains: string[];
        try {
            ssoDomains = await getAllSSODomains();
        } catch {
            ssoDomains = [];
        }
        if (ssoDomains.length === 0) {
            // Legacy fallback: no school configs provisioned yet
            ssoDomains = ['almerecollege.nl'];
        }
        if (ssoDomains.includes(domain) && /^[a-z]{3}$/.test(localPart)) {
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
        const signInResult = await Promise.race([
            supabase.auth.signInWithPassword({
                email,
                password,
            }),
            new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Inloggen duurt te lang. Controleer je verbinding en probeer opnieuw.')), 12_000);
            }),
        ]);
        const { data, error } = signInResult;

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

        // Supabase can emit SIGNED_IN before session persistence has fully settled.
        // Poll briefly to avoid routing into private shell with a transient null session.
        // Guard each getSession call with a per-request timeout so this never hangs indefinitely.
        const waitForSession = async (timeoutMs = 3000, pollMs = 150): Promise<Session | null> => {
            const startedAt = Date.now();
            while (Date.now() - startedAt < timeoutMs) {
                const elapsedMs = Date.now() - startedAt;
                const remainingMs = timeoutMs - elapsedMs;
                const perRequestTimeoutMs = Math.max(250, Math.min(1200, remainingMs));

                try {
                    const session = await Promise.race<Session | null>([
                        supabase.auth.getSession().then(({ data: sessionData, error: sessionError }) => {
                            if (sessionError) throw sessionError;
                            return sessionData.session ?? null;
                        }),
                        new Promise<Session | null>((resolve) => {
                            setTimeout(() => resolve(null), perRequestTimeoutMs);
                        }),
                    ]);
                    if (session?.user) return session;
                } catch (sessionError: any) {
                    if (sessionError?.name !== 'AbortError') {
                        throw sessionError;
                    }
                }

                await new Promise((resolve) => setTimeout(resolve, pollMs));
            }
            return null;
        };

        const session = data.session ?? await waitForSession();
        if (session?.user) return session.user;

        // Fallback to returned user when session handshake is delayed but credentials are valid.
        if (data.user) return data.user;

        throw new Error('Inloggen duurde te lang. Vernieuw de pagina en probeer opnieuw.');
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
    const redirectToLogin = () => {
        window.location.href = '/login';
    };

    // Revoke MFA trusted sessions on logout (security: prevents trust lingering)
    try {
        await Promise.race([
            revokeAllMfaTrust(),
            new Promise<void>((resolve) => setTimeout(resolve, 2_000)),
        ]);
    } catch {
        // Non-critical: trust will expire naturally after 30 min
    }

    try {
        await Promise.race([
            supabase.auth.signOut({ scope: 'local' }),
            new Promise<void>((resolve) => setTimeout(resolve, 2_500)),
        ]);
    } catch (error) {
        console.warn('Local signOut failed during logout:', error);
    }

    try {
        await Promise.race([
            supabase.auth.signOut(),
            new Promise<void>((resolve) => setTimeout(resolve, 2_500)),
        ]);
    } catch (error) {
        console.warn('Global signOut failed during logout:', error);
    }

    try {
        cleanupSupabaseAuthStorage({
            forceClearActiveAuthToken: true,
            preserveActiveCodeVerifierIfOAuthCallback: true,
        });
    } catch (error) {
        console.warn('cleanupSupabaseAuthStorage failed during logout:', error);
    }

    redirectToLogin();
};

// --- Redirect handling ---

/** Kept for API compat — Supabase handles this via detectSessionInUrl. */
export const handleRedirectResult = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
};

// --- Auth State Listener ---


export const subscribeToAuthChanges = (callback: (user: ParentUser | null) => void) => {


    const buildFallbackParentUser = (supabaseUser: SupabaseUser): ParentUser => {
        const metaRole = getRoleFromMeta(supabaseUser);
        const finalRole: UserRole = metaRole ?? 'student';
        const identifier = detectIdentifier(supabaseUser.email ?? null);

        return {
            uid: supabaseUser.id,
            displayName: supabaseUser.user_metadata?.display_name ?? supabaseUser.user_metadata?.full_name ?? null,
            email: supabaseUser.email ?? null,
            photoURL: supabaseUser.user_metadata?.avatar_url ?? null,
            role: finalRole,
            schoolId: getSchoolIdFromMeta(supabaseUser) || undefined,
            identifier,
            // Veilig default: bij een fallback-identity geen verplichte password/MFA bypasses introduceren.
            mustChangePassword: false,
            mfaPending: requiresMfa(finalRole),
        };
    };

    const resolveParentUser = async (supabaseUser: SupabaseUser): Promise<ParentUser> => {
        try {
            return await Promise.race<ParentUser>([
                buildParentUser(supabaseUser),
                new Promise<ParentUser>((resolve) => {
                    setTimeout(() => resolve(buildFallbackParentUser(supabaseUser)), 8_000);
                }),
            ]);
        } catch (err) {
            console.error('resolveParentUser failed, returning fallback user:', err);
            return buildFallbackParentUser(supabaseUser);
        }
    };

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


    // Gebruik ALLEEN onAuthStateChange — geen handmatige getSession() meer.
    // getSession() veroorzaakte een race condition: het retourneerde null
    // voordat de sessie gepersisteerd was in localStorage, waardoor
    // AuthenticatedApp de gebruiker terug naar /login stuurde.
    // INITIAL_SESSION wacht tot Supabase de sessie volledig hersteld heeft.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {
            if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.user) {
                    try {
                        const parentUser = await resolveParentUser(session.user);
                        callback(parentUser);
                    } catch (err) {
                        console.error('Auth resolveParentUser failed, using fallback:', err);
                        callback(buildFallbackParentUser(session.user));
                    }
                } else if (event === 'INITIAL_SESSION') {
                    // Fallback: INITIAL_SESSION kan null retourneren door een race
                    // condition na login + navigatie (StrictMode dubbele mount, of
                    // sessie nog niet in Supabase intern state). Check getSession()
                    // eenmalig als vangnet voordat we opgeven.
                    try {
                        const { data: { session: fallbackSession } } = await supabase.auth.getSession();
                        if (fallbackSession?.user) {
                            try {
                                const parentUser = await resolveParentUser(fallbackSession.user);
                                callback(parentUser);
                            } catch (err) {
                                console.error('Auth resolveParentUser failed (fallback), using minimal user:', err);
                                callback(buildFallbackParentUser(fallbackSession.user));
                            }
                            return;
                        }
                    } catch {
                        // getSession() mislukt → val door naar null
                    }
                    callback(null);
                } else {
                    callback(null);
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
