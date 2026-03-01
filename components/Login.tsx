import React, { useState, useEffect, useCallback } from 'react';
import { validateEmail } from '../utils/emailValidator';

/** Inline SVGs for critical path — avoids loading lucide (65kb) for LCP */
const IconMail = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);
const IconLock = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
const IconUser = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const IconArrowRight = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);
const IconEye = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const IconEyeOff = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);
const IconGraduationCap = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);
const IconMicrosoft = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" className={props.className} aria-hidden="true">
        <rect x="2" y="2" width="9" height="9" fill="#F25022" />
        <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
        <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
        <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
    </svg>
);

interface LoginProps {
    onLoginSuccess: (user: any) => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password';

// Rate limiting constants
const LOCK_THRESHOLD_1 = 10; // First lock after 10 attempts
const LOCK_DURATION_1 = 30; // 30 seconds
const LOCK_THRESHOLD_2 = 15; // Second lock after 15 attempts
const LOCK_DURATION_2 = 300; // 5 minutes (300 seconds)

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [studentClass, setStudentClass] = useState('Kies je klas...');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailHint, setEmailHint] = useState<string | null>(null);
    const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);

    // Validate email on blur (when user leaves the field)
    const handleEmailBlur = useCallback(() => {
        if (!email.trim()) {
            setEmailHint(null);
            setEmailSuggestion(null);
            return;
        }
        const result = validateEmail(email);
        if (!result.valid) {
            setEmailHint(result.error ?? null);
            setEmailSuggestion(result.suggestion ?? null);
        } else {
            setEmailHint(null);
            setEmailSuggestion(null);
        }
    }, [email]);

    // Accept email suggestion
    const acceptEmailSuggestion = useCallback(() => {
        if (!emailSuggestion) return;
        // Extract email from suggestion text like "Bedoelde je user@gmail.com?"
        const match = emailSuggestion.match(/(\S+@\S+)\?/);
        if (match) {
            setEmail(match[1]);
            setEmailHint(null);
            setEmailSuggestion(null);
        }
    }, [emailSuggestion]);

    // Rate limiting state
    const [failedAttempts, setFailedAttempts] = useState(() => {
        const stored = localStorage.getItem('loginFailedAttempts');
        return stored ? parseInt(stored, 10) : 0;
    });
    const [lockUntil, setLockUntil] = useState(() => {
        const stored = localStorage.getItem('loginLockUntil');
        return stored ? parseInt(stored, 10) : 0;
    });
    const [lockCountdown, setLockCountdown] = useState(0);

    // Initial check for mode in URL and handle redirect result
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlMode = params.get('mode');
        if (urlMode === 'register') {
            setMode('register');
        }

        const hasOAuthParams = (searchParams: URLSearchParams) =>
            searchParams.has('code')
            || searchParams.has('access_token')
            || searchParams.has('refresh_token')
            || searchParams.has('error')
            || searchParams.has('error_description');

        const hash = window.location.hash.startsWith('#')
            ? window.location.hash.slice(1)
            : window.location.hash;
        const hashParams = new URLSearchParams(hash);

        if (!hasOAuthParams(params) && !hasOAuthParams(hashParams)) {
            return;
        }

        // Handle redirect result if returning from Microsoft SSO
        const processRedirect = async () => {
            try {
                const { handleRedirectResult } = await import('../services/authService');
                const user = await handleRedirectResult();
                if (user) {
                    onLoginSuccess(user);
                }
            } catch (err: any) {
                // AbortError is een race condition met onAuthStateChange, geen echte fout.
                if (err?.name === 'AbortError') return;
                console.error("Redirect auth error:", err);
                setError(err.message || 'Er is een fout opgetreden bij het inloggen met Microsoft.');
            }
        };
        processRedirect();
    }, [onLoginSuccess]);

    // Check and update lock countdown
    useEffect(() => {
        const checkLock = () => {
            const now = Date.now();
            if (lockUntil > now) {
                setLockCountdown(Math.ceil((lockUntil - now) / 1000));
            } else {
                setLockCountdown(0);
            }
        };

        checkLock();
        const interval = setInterval(checkLock, 1000);
        return () => clearInterval(interval);
    }, [lockUntil]);

    // Generic class options for VO schools
    const CLASS_OPTIONS = [
        'Kies je klas...',
        'Klas 1',
        'Klas 2',
        'Klas 3',
        'Klas 4',
        'Klas 5',
        'Klas 6',
        'Anders'
    ];

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if currently locked
        if (lockCountdown > 0) {
            const minutes = Math.floor(lockCountdown / 60);
            const seconds = lockCountdown % 60;
            setError(`Te veel pogingen. Wacht nog ${minutes > 0 ? `${minutes}m ` : ''}${seconds}s.`);
            return;
        }

        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const { registerWithEmail, signInWithEmail } = await import('../services/authService');
            let user;
            if (mode === 'register') {
                if (!displayName.trim()) throw new Error("Vul je voor- en achternaam in");
                if (!studentClass || studentClass === 'Kies je klas...') throw new Error("Selecteer je klas uit het menu");
                user = await registerWithEmail(email, password, displayName, studentClass);
            } else {
                user = await signInWithEmail(email, password);
            }

            // Success - reset attempts
            localStorage.removeItem('loginFailedAttempts');
            localStorage.removeItem('loginLockUntil');
            setFailedAttempts(0);
            setLockUntil(0);

            onLoginSuccess(user);
        } catch (err: any) {
            console.error(err);

            // Only count failed attempts for login mode (not registration)
            if (mode === 'login') {
                const newAttempts = failedAttempts + 1;
                setFailedAttempts(newAttempts);
                localStorage.setItem('loginFailedAttempts', newAttempts.toString());

                // Check if we need to apply a lock
                if (newAttempts >= LOCK_THRESHOLD_2) {
                    // 5 minute lock
                    const until = Date.now() + (LOCK_DURATION_2 * 1000);
                    setLockUntil(until);
                    localStorage.setItem('loginLockUntil', until.toString());
                    setError(`Te veel pogingen (${newAttempts}x). Account tijdelijk geblokkeerd voor 5 minuten.`);
                } else if (newAttempts >= LOCK_THRESHOLD_1) {
                    // 30 second lock
                    const until = Date.now() + (LOCK_DURATION_1 * 1000);
                    setLockUntil(until);
                    localStorage.setItem('loginLockUntil', until.toString());
                    setError(`Te veel pogingen (${newAttempts}x). Wacht 30 seconden en probeer opnieuw.`);
                } else {
                    // Normal error message
                    setError(err.message || 'Authenticatie mislukt. Probeer het opnieuw.');
                }
            } else {
                // Registration error - show as-is
                setError(err.message || 'Authenticatie mislukt. Probeer het opnieuw.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const { resetPassword } = await import('../services/authService');
            await resetPassword(email);
            setSuccessMessage("Resetlink verstuurd. Controleer je inbox.");
            setTimeout(() => setMode('login'), 2500);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Kon wachtwoord reset mail niet versturen.');
        } finally {
            setLoading(false);
        }
    };

    const handleMicrosoftAuth = async () => {
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const { signInWithMicrosoft } = await import('../services/authService');
            const user = await signInWithMicrosoft();

            // Success - reset attempts
            localStorage.removeItem('loginFailedAttempts');
            localStorage.removeItem('loginLockUntil');
            setFailedAttempts(0);
            setLockUntil(0);

            onLoginSuccess(user);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Microsoft 365 inloggen mislukt. Probeer het opnieuw.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#f8fafc] font-sans overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50 pointer-events-none"></div>

            {/* Scrollable Content Container */}
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden flex items-center justify-center p-6">
                <div className="max-w-md w-full relative z-10 my-auto">
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 p-8 md:p-10 border border-slate-100">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 transform -rotate-3 overflow-hidden">
                                <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain p-2" width={64} height={64} fetchPriority="high" decoding="async" />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
                                Mission <span className="text-indigo-600">Control</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                DGSkills • Voortgezet Onderwijs
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                            <button
                                onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                                className={`flex-1 py-3 min-h-[44px] text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${mode === 'login' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
                            >
                                Inloggen
                            </button>
                            <button
                                onClick={() => { 
                                    setMode('register'); 
                                    setError(null); 
                                    setSuccessMessage(null);
                                }}
                                className={`flex-1 py-3 min-h-[44px] text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${mode === 'register' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
                            >
                                Account aanmaken
                            </button>
                        </div>

                        {/* Form */}
                        {mode === 'forgot-password' ? (
                            <form onSubmit={handlePasswordReset} className="space-y-4">
                                <div className="text-center mb-6">
                                    <h2 className="text-sm font-bold text-slate-900">Wachtwoord vergeten?</h2>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Vul het e-mailadres van je account in. We sturen je een link om je wachtwoord opnieuw in te stellen.
                                    </p>
                                </div>

                                <div className="relative">
                                    <label htmlFor="login-forgot-email" className="sr-only">E-mailadres</label>
                                    <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        id="login-forgot-email"
                                        type="email"
                                        placeholder="E-mailadres"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setEmailHint(null); setEmailSuggestion(null); }}
                                        onBlur={handleEmailBlur}
                                        aria-invalid={!!emailHint || (!!error && !error.includes('verstuurd'))}
                                        aria-describedby={emailHint ? 'login-forgot-email-hint' : error ? 'login-forgot-error' : undefined}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm text-slate-700 placeholder:text-slate-400 ${emailHint ? 'border-amber-400' : 'border-slate-200'}`}
                                        required
                                    />
                                    {emailHint && (
                                        <div id="login-forgot-email-hint" className="mt-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                                            {emailHint}
                                            {emailSuggestion && (
                                                <button
                                                    type="button"
                                                    onClick={acceptEmailSuggestion}
                                                    className="ml-1 text-indigo-600 hover:text-indigo-800 underline"
                                                >
                                                    {emailSuggestion}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {successMessage && (
                                    <div role="status" className="text-xs font-bold p-3 rounded-xl border text-green-600 bg-green-50 border-green-100">
                                        {successMessage}
                                    </div>
                                )}

                                {error && (
                                    <div id="login-forgot-error" role="alert" className={`text-xs font-bold p-3 rounded-xl border animate-in shake ${error.includes('verstuurd') ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-500 bg-red-50 border-red-100'}`}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    aria-busy={loading}
                                    aria-live="polite"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200/50 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                                >
                                    {loading ? (
                                        <>
                                            <span className="sr-only">Bezig met versturen...</span>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                                        </>
                                    ) : (
                                        <span>Reset Wachtwoord</span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                                    className="w-full py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                                >
                                    Terug naar inloggen
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                {mode === 'register' && (
                                    <div className="relative animate-in slide-in-from-top-2 duration-300">
                                        <label htmlFor="login-display-name" className="sr-only">Je voor- en achternaam</label>
                                        <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            id="login-display-name"
                                            type="text"
                                            placeholder="Voor- en achternaam"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            aria-invalid={!!error}
                                            aria-describedby={error ? 'login-auth-error' : undefined}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm text-slate-700 placeholder:text-slate-400"
                                            required
                                        />
                                    </div>
                                )}
                                <div className="relative">
                                    <label htmlFor="login-email" className="sr-only">{mode === 'register' ? "Je e-mailadres" : "E-mailadres"}</label>
                                    <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        id="login-email"
                                        type="email"
                                        placeholder={mode === 'register' ? "Je e-mailadres" : "E-mailadres"}
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setEmailHint(null); setEmailSuggestion(null); }}
                                        onBlur={handleEmailBlur}
                                        aria-invalid={!!error || !!emailHint}
                                        aria-describedby={emailHint ? 'login-email-hint' : error ? 'login-auth-error' : undefined}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm text-slate-700 placeholder:text-slate-400 ${emailHint ? 'border-amber-400' : 'border-slate-200'}`}
                                        required
                                    />
                                    {emailHint && (
                                        <div id="login-email-hint" className="mt-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                                            {emailHint}
                                            {emailSuggestion && (
                                                <button
                                                    type="button"
                                                    onClick={acceptEmailSuggestion}
                                                    className="ml-1 text-indigo-600 hover:text-indigo-800 underline"
                                                >
                                                    {emailSuggestion}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Class Selection - Only for registration */}
                                {mode === 'register' && (
                                    <div className="relative animate-in slide-in-from-top-2 duration-300" style={{ animationDelay: '50ms' }}>
                                        <label htmlFor="login-student-class" className="sr-only">Kies je klas</label>
                                        <IconGraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select
                                            id="login-student-class"
                                            value={studentClass}
                                            onChange={(e) => setStudentClass(e.target.value)}
                                            aria-invalid={!!error}
                                            aria-describedby={error ? 'login-auth-error' : undefined}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm text-slate-700 appearance-none cursor-pointer"
                                            required
                                        >
                                            {CLASS_OPTIONS.map((cls) => (
                                                <option key={cls} value={cls} disabled={cls === 'Kies je klas...'} className="py-2">
                                                    {cls}
                                                </option>
                                            ))}
                                        </select>
                                        {/* Custom dropdown arrow */}
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                                <div className="relative">
                                    <label htmlFor="login-password" className="sr-only">Wachtwoord</label>
                                    <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Wachtwoord"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        aria-invalid={!!error}
                                        aria-describedby={error ? 'login-auth-error' : undefined}
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm text-slate-700 placeholder:text-slate-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                    </button>
                                </div>

                                {mode === 'login' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleMicrosoftAuth}
                                            disabled={loading}
                                            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            <IconMicrosoft size={18} />
                                            <span>Inloggen met Microsoft 365</span>
                                        </button>
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                <div className="w-full border-t border-slate-200"></div>
                                            </div>
                                            <div className="relative flex justify-center">
                                                <span className="bg-white px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">of</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {mode === 'login' && (
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => { setMode('forgot-password'); setError(null); setSuccessMessage(null); }}
                                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                        >
                                            Wachtwoord vergeten? Stuur resetlink
                                        </button>
                                    </div>
                                )}

                                {error && (
                                    <div id="login-auth-error" role="alert" className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100 animate-in shake">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    aria-busy={loading}
                                    aria-live="polite"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200/50 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                                >
                                    {loading ? (
                                        <>
                                            <span className="sr-only">{mode === 'register' ? 'Bezig met account aanmaken...' : 'Bezig met inloggen...'}</span>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                                        </>
                                    ) : (
                                        <>
                                            <span>{mode === 'register' ? 'Account aanmaken' : 'Inloggen'}</span>
                                            <IconArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-slate-500 text-center">
                                    <a href="/ict/privacy/policy" className="text-indigo-700 hover:text-indigo-800 underline">Privacy</a>
                                    {' · '}
                                    <a href="/ict/privacy/cookies" className="text-indigo-700 hover:text-indigo-800 underline">Cookies</a>
                                </p>
                            </form>
                        )}


                    </div>

                    <div className="mt-8 flex flex-col items-center gap-3">
                        <a href="/" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                            Voor scholen — Digitale geletterdheid
                        </a>
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                            &copy; 2026 Future Architect
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
