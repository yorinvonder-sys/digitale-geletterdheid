// Landing-page analytics — tracks conversions and engagement via Edge Function.

export type AnalyticsEvent =
    | 'pilot_request_start'
    | 'pilot_request_success'
    | 'contact_click'
    | 'ict_check_click'
    | 'ict_document_download'
    | 'ict_subpage_view'
    | 'seo_page_view'
    | 'seo_asset_view'
    | 'dual_cta_click'
    | 'auth_success'
    | 'auth_error'
    | 'api_retry'
    | 'offline_detected'
    | 'web_vital'
    | 'mission_start'
    | 'mission_complete';

const hasAnalyticsConsent = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
        const raw = localStorage.getItem('cookie-consent-status');
        if (!raw) return false;
        // Supports both JSON { status: 'accepted' } and legacy plain string
        if (raw === 'accepted') return true;
        const parsed = JSON.parse(raw);
        return parsed?.status === 'accepted';
    } catch {
        return false;
    }
};

type AnalyticsRole = 'anonymous' | 'student' | 'teacher' | 'developer';

const mapRole = (roleValue: unknown): AnalyticsRole => {
    if (typeof roleValue !== 'string') return 'student';
    const normalized = roleValue.toLowerCase();
    if (normalized === 'teacher') return 'teacher';
    if (normalized === 'developer' || normalized === 'admin') return 'developer';
    return 'student';
};

const sendAnalyticsEvent = async (event: AnalyticsEvent, data?: Record<string, any>) => {
    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (!hasAnalyticsConsent()) {
        if (isDev) {
            console.log('[Analytics] Skipped (no consent)');
        }
        return;
    }

    try {
        const rawPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        const pageKey = rawPath.replace(/[^a-zA-Z0-9/_-]/g, '').slice(0, 80) || 'unknown';
        const ctaSource = data?.type || data?.page || data?.cta || 'none';
        const ctaKey = String(ctaSource).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || 'none';
        const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
        const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
        if (!supabaseUrl || !supabaseAnonKey) {
            if (isDev) console.warn('[Analytics] Missing VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY');
            return;
        }

        // Determine role + token before sending to avoid role race conditions.
        let role: AnalyticsRole = 'anonymous';
        let accessToken: string | null = null;
        try {
            const { supabase } = await import('./supabase');
            const [{ data: { user } }, { data: { session } }] = await Promise.all([
                supabase.auth.getUser(),
                supabase.auth.getSession(),
            ]);
            if (user) {
                role = mapRole(user.user_metadata?.role ?? user.app_metadata?.role);
            }
            accessToken = session?.access_token ?? null;
        } catch (authErr) {
            if (isDev) console.warn('[Analytics] Could not resolve auth context:', authErr);
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            apikey: supabaseAnonKey,
        };
        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/trackClickEvent`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                eventName: event,
                pageKey,
                ctaKey,
                role,
            }),
            keepalive: true,
        });

        if (!response.ok && isDev) {
            console.warn('[Analytics] Failed to track event:', response.status, await response.text().catch(() => ''));
        }
    } catch (err) {
        if (isDev) console.warn('[Analytics] Error initializing tracker:', err);
    }
};

export const trackEvent = (event: AnalyticsEvent, data?: Record<string, any>) => {
    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isDev) {
        console.log(`[Analytics] Event: ${event}`, data || '');
    }
    void sendAnalyticsEvent(event, data);
};

export const trackError = (message: string, fatal = false, data?: Record<string, any>) => {
    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (isDev) {
        console.error(`[Analytics Error] ${message}`, data || '');
    }

    trackEvent('auth_error', {
        fatal: Boolean(fatal),
        code: typeof data?.code === 'string' ? data.code.slice(0, 40) : 'generic'
    });
};
