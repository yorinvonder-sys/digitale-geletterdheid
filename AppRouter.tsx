import React, { useState, useEffect } from 'react';
const ScholenLanding = React.lazy(() => import('./components/ScholenLanding').then(m => ({ default: m.ScholenLanding })));
const IctLandingPage = React.lazy(() => import('./components/scholen/IctLandingPage').then(m => ({ default: m.IctLandingPage })));
const IctIntegraties = React.lazy(() => import('./components/scholen/ict/IctIntegraties').then(m => ({ default: m.IctIntegraties })));
const IctPrivacy = React.lazy(() => import('./components/scholen/ict/IctPrivacy').then(m => ({ default: m.IctPrivacy })));
const PrivacyPolicy = React.lazy(() => import('./components/scholen/ict/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const CookiePolicy = React.lazy(() => import('./components/scholen/ict/CookiePolicy').then(m => ({ default: m.CookiePolicy })));
const AiTransparency = React.lazy(() => import('./components/scholen/ict/AiTransparency').then(m => ({ default: m.AiTransparency })));
const IctTechnisch = React.lazy(() => import('./components/scholen/ict/IctTechnisch').then(m => ({ default: m.IctTechnisch })));
const IctImplementatieGids = React.lazy(() => import('./components/scholen/ict/IctImplementatieGids').then(m => ({ default: m.IctImplementatieGids })));
const IctSupport = React.lazy(() => import('./components/scholen/ict/IctSupport').then(m => ({ default: m.IctSupport })));
const Login = React.lazy(() => import('./components/Login').then(m => ({ default: m.Login })));

// SEO Landing Pages
const DigitaleGeletterdheidVo = React.lazy(() => import('./components/seo/DigitaleGeletterdheidVo').then(m => ({ default: m.DigitaleGeletterdheidVo })));
const SloKerndoelen = React.lazy(() => import('./components/seo/SloKerndoelen').then(m => ({ default: m.SloKerndoelen })));
const AiGeletterdheid = React.lazy(() => import('./components/seo/AiGeletterdheid').then(m => ({ default: m.AiGeletterdheid })));
const ComplianceHub = React.lazy(() => import('./components/seo/ComplianceHub').then(m => ({ default: m.ComplianceHub })));
const GuidePage = React.lazy(() => import('./components/seo/GuidePage').then(m => ({ default: m.GuidePage })));
const ComplianceChecklist = React.lazy(() => import('./components/seo/ComplianceChecklist').then(m => ({ default: m.ComplianceChecklist })));
const SloRapport = React.lazy(() => import('./components/seo/SloRapport').then(m => ({ default: m.SloRapport })));
const ComparisonPage = React.lazy(() => import('./components/seo/ComparisonPage').then(m => ({ default: m.ComparisonPage })));
const NotFound = React.lazy(() => import('./components/NotFound').then(m => ({ default: m.NotFound })));
const MobileReceiptPage = React.lazy(() => import('./components/MobileReceiptPage').then(m => ({ default: m.MobileReceiptPage })));

import { ParentUser } from './types';
const CookieConsent = React.lazy(() => import('./components/CookieConsent').then(m => ({ default: m.CookieConsent })));

const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp').then(m => ({ default: m.AuthenticatedApp })));

/** Minimal spinner — no lucide to avoid blocking LCP */
const LoadingFallback = () => (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" aria-hidden="true" />
        <p className="text-slate-500 font-medium">Laden...</p>
    </div>
);

/** Sync path with history; re-render on popstate or programmatic navigation */
function usePath() {
    const [path, setPath] = useState(() => window.location.pathname);

    useEffect(() => {
        const handleChange = () => setPath(window.location.pathname);
        window.addEventListener('popstate', handleChange);
        window.addEventListener('pathchange', handleChange);
        return () => {
            window.removeEventListener('popstate', handleChange);
            window.removeEventListener('pathchange', handleChange);
        };
    }, []);

    return path;
}

/** Delay non-critical UI until idle, to keep public route render light. */
function useIdleMount(delayMs = 0) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let idleId: number | undefined;

        const trigger = () => {
            timeoutId = setTimeout(() => setReady(true), delayMs);
        };

        if (typeof requestIdleCallback !== 'undefined') {
            idleId = requestIdleCallback(trigger, { timeout: 2500 });
        } else {
            trigger();
        }

        return () => {
            if (idleId !== undefined && typeof cancelIdleCallback !== 'undefined') {
                cancelIdleCallback(idleId);
            }
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
        };
    }, [delayMs]);

    return ready;
}

/** Fast heuristic: only hydrate auth listener on public route when a session likely exists. */
function hasLikelySupabaseSession(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        for (let i = 0; i < localStorage.length; i += 1) {
            const key = localStorage.key(i);
            if (key && /^sb-[a-z0-9_-]+-auth-token$/i.test(key)) {
                return true;
            }
        }
    } catch {
        return false;
    }
    return false;
}

function hasOAuthCallbackParams(): boolean {
    if (typeof window === 'undefined') return false;
    const hasParams = (params: URLSearchParams) =>
        params.has('code')
        || params.has('access_token')
        || params.has('refresh_token')
        || params.has('error')
        || params.has('error_description');

    const queryParams = new URLSearchParams(window.location.search);
    if (hasParams(queryParams)) return true;

    const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    return hasParams(hashParams);
}

/** Auth hook - immediate for reliability during login/session transitions */
function useAuthUser(options?: { enabled?: boolean; deferUntilIdle?: boolean }) {
    const enabled = options?.enabled ?? true;
    const deferUntilIdle = options?.deferUntilIdle ?? false;
    const [user, setUser] = useState<ParentUser | null>(null);
    const [loading, setLoading] = useState(enabled);

    useEffect(() => {
        if (!enabled) {
            setUser(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        let unsubscribe: (() => void) | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let authTimeoutId: ReturnType<typeof setTimeout> | undefined;
        let idleId: number | undefined;
        let isCancelled = false;

        const startAuthSubscription = async () => {
            try {
                const { subscribeToAuthChanges } = await import('./services/authService');
                if (isCancelled) return;
                unsubscribe = subscribeToAuthChanges((u) => {
                    if (isCancelled) return;
                    clearTimeout(authTimeoutId);
                    setUser(u);
                    setLoading(false);
                });
                // Failsafe: als de auth-callback na 10s nog niet heeft gevuurd
                // (bijv. door een corrupt token of trage DB), stop met laden,
                // ruim de stale sessie op, en val door naar de login-pagina.
                authTimeoutId = setTimeout(async () => {
                    if (isCancelled) return;
                    // Actief opruimen: signOut stopt Supabase's interne refresh-loop
                    // en verwijdert het stale token uit localStorage.
                    try {
                        const { supabase } = await import('./services/supabase');
                        await supabase.auth.signOut({ scope: 'local' });
                    } catch { /* negeer — we forceren sowieso unauthenticated state */ }
                    if (isCancelled) return;
                    setUser(null);
                    setLoading(false);
                }, 10_000);
            } catch {
                if (!isCancelled) setLoading(false);
            }
        };

        if (deferUntilIdle) {
            const schedule = () => {
                timeoutId = setTimeout(() => { void startAuthSubscription(); }, 250);
            };
            if (typeof requestIdleCallback !== 'undefined') {
                idleId = requestIdleCallback(schedule, { timeout: 2200 });
            } else {
                schedule();
            }
        } else {
            void startAuthSubscription();
        }

        return () => {
            isCancelled = true;
            if (idleId !== undefined && typeof cancelIdleCallback !== 'undefined') {
                cancelIdleCallback(idleId);
            }
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            clearTimeout(authTimeoutId);
            unsubscribe?.();
        };
    }, [enabled, deferUntilIdle]);

    return { user, loading };
}

/** Public routes: / and /scholen. Render shell immediately; defer auth to avoid blocking LCP. */
function PublicPageShell({ children }: { children: React.ReactNode }) {
    const showCookieBanner = useIdleMount(2600);

    return (
        <div className="w-full min-h-screen relative">
            <a href="#main-content" className="skip-link">Naar hoofdinhoud</a>
            <div id="main-content" tabIndex={-1}>
                {children}
            </div>
            {showCookieBanner && (
                <React.Suspense fallback={null}>
                    <CookieConsent />
                </React.Suspense>
            )}
        </div>
    );
}

/** Public routes: / and /scholen. Render shell immediately; defer auth to avoid blocking LCP. */
function PublicRoute() {
    const shouldProbeAuth = React.useMemo(() => hasLikelySupabaseSession(), []);
    const { user, loading } = useAuthUser({
        enabled: shouldProbeAuth,
        deferUntilIdle: true
    });

    // Toon de landing page ALTIJD direct — ook voor terugkerende bezoekers
    // met een (mogelijk stale) token. Auth check loopt op de achtergrond;
    // pas als die slaagt, redirect naar dashboard.
    if (shouldProbeAuth && !loading && user) {
        return (
            <React.Suspense fallback={<LoadingFallback />}>
                <AuthenticatedApp />
            </React.Suspense>
        );
    }

    return (
        <PublicPageShell>
            <React.Suspense fallback={<LoadingFallback />}>
                <ScholenLanding />
            </React.Suspense>
        </PublicPageShell>
    );
}

/** Login route: /login. Render shell immediately; defer auth to avoid blocking LCP. */
function LoginRoute() {
    const shouldProbeAuth = React.useMemo(
        () => hasLikelySupabaseSession() || hasOAuthCallbackParams(),
        []
    );
    const postLoginPath = React.useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('redirect');

        // Alleen interne paden toestaan; voorkom open redirects en login-loop.
        if (
            redirectPath
            && redirectPath.startsWith('/')
            && !redirectPath.startsWith('//')
            && !redirectPath.startsWith('/login')
        ) {
            return redirectPath;
        }

        // Standaard naar private app-shell zodat studenten direct in hun dashboard komen.
        return '/dashboard';
    }, []);
    const { user, loading } = useAuthUser({
        enabled: shouldProbeAuth,
        deferUntilIdle: false
    });

    const handleSuccess = () => {
        window.history.replaceState({}, '', postLoginPath);
        window.dispatchEvent(new Event('pathchange'));
    };

    // Toon het login formulier ALTIJD direct — ook als auth check nog loopt.
    // Alleen als auth check klaar is EN user geldig is, redirect naar dashboard.
    if (shouldProbeAuth && !loading && user) {
        // Logged-in user on /login: redirect naar aangevraagde private route of dashboard.
        handleSuccess();
        return (
            <React.Suspense fallback={<LoadingFallback />}>
                <AuthenticatedApp />
            </React.Suspense>
        );
    }

    return (
        <PublicPageShell>
            <Login onLoginSuccess={handleSuccess} />
        </PublicPageShell>
    );
}

/** /bonnetje route: standalone mobiele scanner — vereist login */
function BonnetjeRoute() {
    const { user, loading } = useAuthUser();

    if (loading) return <LoadingFallback />;

    if (!user) {
        // Sla de redirect-URL op en stuur naar login
        window.history.replaceState({}, '', '/login?redirect=/bonnetje');
        window.dispatchEvent(new Event('pathchange'));
        return <LoadingFallback />;
    }

    function goHome() {
        window.history.replaceState({}, '', '/');
        window.dispatchEvent(new Event('pathchange'));
    }

    return (
        <React.Suspense fallback={<LoadingFallback />}>
            <MobileReceiptPage userId={user.uid} onNavigateHome={goHome} />
        </React.Suspense>
    );
}

export function AppRouter() {
    const path = usePath();
    const normalizedPath = path !== '/' ? path.replace(/\/+$/, '') : path;

    if (normalizedPath === '/' || normalizedPath === '/scholen') {
        return <PublicRoute />;
    }

    if (normalizedPath === '/ict') {
        return (
            <PublicPageShell>
                <React.Suspense fallback={<LoadingFallback />}>
                    <IctLandingPage />
                </React.Suspense>
            </PublicPageShell>
        );
    }

    if (normalizedPath === '/ict/integraties' || normalizedPath === '/ict/privacy' || normalizedPath === '/ict/technisch' || normalizedPath === '/ict/implementatiegids' || normalizedPath === '/ict/support' || normalizedPath === '/ict/privacy/policy' || normalizedPath === '/ict/privacy/cookies' || normalizedPath === '/ict/privacy/ai') {
        return (
            <PublicPageShell>
                <React.Suspense fallback={<LoadingFallback />}>
                    {normalizedPath === '/ict/integraties' && <IctIntegraties />}
                    {normalizedPath === '/ict/privacy' && <IctPrivacy />}
                    {normalizedPath === '/ict/privacy/policy' && <PrivacyPolicy />}
                    {normalizedPath === '/ict/privacy/cookies' && <CookiePolicy />}
                    {normalizedPath === '/ict/privacy/ai' && <AiTransparency />}
                    {normalizedPath === '/ict/technisch' && <IctTechnisch />}
                    {normalizedPath === '/ict/implementatiegids' && <IctImplementatieGids />}
                    {normalizedPath === '/ict/support' && <IctSupport />}
                </React.Suspense>
            </PublicPageShell>
        );
    }

    if (normalizedPath === '/login') {
        return <LoginRoute />;
    }

    if (normalizedPath === '/bonnetje') {
        return <BonnetjeRoute />;
    }

    if (normalizedPath === '/digitale-geletterdheid-vo' || normalizedPath === '/slo-kerndoelen-digitale-geletterdheid' || normalizedPath === '/ai-geletterdheid-onderwijs-ai-act' || normalizedPath === '/compliance-hub' || normalizedPath === '/compliance/checklist' || normalizedPath === '/compliance/slo-rapport' || normalizedPath.startsWith('/vergelijking/')) {
        return (
            <PublicPageShell>
                <React.Suspense fallback={<LoadingFallback />}>
                    {normalizedPath === '/digitale-geletterdheid-vo' && <DigitaleGeletterdheidVo />}
                    {normalizedPath === '/slo-kerndoelen-digitale-geletterdheid' && <SloKerndoelen />}
                    {normalizedPath === '/ai-geletterdheid-onderwijs-ai-act' && <AiGeletterdheid />}
                    {normalizedPath === '/compliance-hub' && <ComplianceHub />}
                    {normalizedPath === '/compliance/checklist' && <ComplianceChecklist />}
                    {normalizedPath === '/compliance/slo-rapport' && <SloRapport />}
                    {normalizedPath === '/vergelijking/dgskills-vs-digit-vo' && <ComparisonPage competitor="digit-vo" />}
                    {normalizedPath === '/vergelijking/dgskills-vs-basicly' && <ComparisonPage competitor="basicly" />}
                </React.Suspense>
            </PublicPageShell>
        );
    }

    if (normalizedPath.startsWith('/gids/')) {
        const guideId = normalizedPath.split('/')[2];
        return (
            <PublicPageShell>
                <React.Suspense fallback={<LoadingFallback />}>
                    <GuidePage guideId={guideId} />
                </React.Suspense>
            </PublicPageShell>
        );
    }

    // 404 handler for public routes
    const isPublicRoute = normalizedPath === '' || normalizedPath === '/' || normalizedPath === '/scholen' || normalizedPath === '/ict' || normalizedPath.startsWith('/ict/') || normalizedPath === '/login' || normalizedPath === '/digitale-geletterdheid-vo' || normalizedPath === '/slo-kerndoelen-digitale-geletterdheid' || normalizedPath === '/ai-geletterdheid-onderwijs-ai-act' || normalizedPath === '/compliance-hub' || normalizedPath.startsWith('/compliance/') || normalizedPath.startsWith('/vergelijking/') || normalizedPath.startsWith('/gids/');

    if (isPublicRoute) {
        return (
            <PublicPageShell>
                <React.Suspense fallback={<LoadingFallback />}>
                    <NotFound />
                </React.Suspense>
            </PublicPageShell>
        );
    }

    // Protected routes: load full app (handles auth redirect internally)
    return (
        <React.Suspense fallback={<LoadingFallback />}>
            <AuthenticatedApp />
        </React.Suspense>
    );
}
