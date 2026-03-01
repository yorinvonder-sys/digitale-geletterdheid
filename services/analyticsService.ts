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

type AnalyticsRole = 'anonymous' | 'student' | 'teacher' | 'developer';

interface AnalyticsPayload extends Record<string, unknown> {
    route?: string;
    page?: string;
    cta?: string;
    type?: string;
    metric_name?: string;
    metric_value?: number;
    metric_rating?: 'good' | 'needs-improvement' | 'poor';
    name?: string;
    value?: number;
    rating?: string;
    device_class?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
    nav_type?: 'navigate' | 'reload' | 'back_forward' | 'prerender' | 'unknown';
    build_id?: string;
    id?: string;
}

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

const mapRole = (roleValue: unknown): AnalyticsRole => {
    if (typeof roleValue !== 'string') return 'student';
    const normalized = roleValue.toLowerCase();
    if (normalized === 'teacher') return 'teacher';
    if (normalized === 'developer' || normalized === 'admin') return 'developer';
    return 'student';
};

const sanitizeToken = (value: unknown, maxLen: number): string => {
    if (typeof value !== 'string') return '';
    return value.replace(/[^a-zA-Z0-9/_-]/g, '').slice(0, maxLen);
};

const hasLikelySupabaseSession = (): boolean => {
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
};

const normalizeMetricName = (raw: unknown): string | null => {
    if (typeof raw !== 'string') return null;
    const upper = raw.trim().toUpperCase();
    return ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].includes(upper) ? upper : null;
};

const normalizeMetricRating = (raw: unknown): 'good' | 'needs-improvement' | 'poor' | null => {
    if (typeof raw !== 'string') return null;
    if (raw === 'good' || raw === 'needs-improvement' || raw === 'poor') return raw;
    return null;
};

const normalizeMetricValue = (raw: unknown): number | null => {
    if (typeof raw !== 'number' || !Number.isFinite(raw) || raw < 0) return null;
    return raw;
};

const normalizeDeviceClass = (raw: unknown): 'mobile' | 'tablet' | 'desktop' | 'unknown' => {
    return raw === 'mobile' || raw === 'tablet' || raw === 'desktop' ? raw : 'unknown';
};

const normalizeNavType = (raw: unknown): 'navigate' | 'reload' | 'back_forward' | 'prerender' | 'unknown' => {
    return raw === 'navigate' || raw === 'reload' || raw === 'back_forward' || raw === 'prerender'
        ? raw
        : 'unknown';
};

const sendAnalyticsEvent = async (event: AnalyticsEvent, data?: AnalyticsPayload) => {
    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (!hasAnalyticsConsent()) {
        if (isDev) {
            console.log('[Analytics] Skipped (no consent)');
        }
        return;
    }

    try {
        const rawPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        const route = sanitizeToken(data?.route ?? rawPath, 120) || '/';
        const pageKey = sanitizeToken(data?.page ?? rawPath, 80) || 'unknown';
        const ctaSource = data?.type || data?.page || data?.cta || 'none';
        const ctaKey = sanitizeToken(String(ctaSource), 50) || 'none';
        const metricName = normalizeMetricName(data?.metric_name ?? data?.name);
        const metricValue = normalizeMetricValue(data?.metric_value ?? data?.value);
        const metricRating = normalizeMetricRating(data?.metric_rating ?? data?.rating);
        const deviceClass = normalizeDeviceClass(data?.device_class);
        const navType = normalizeNavType(data?.nav_type);
        const buildId = sanitizeToken(data?.build_id, 64) || 'unknown';
        const metricId = sanitizeToken(data?.id, 80) || null;

        const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
        const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
        if (!supabaseUrl || !supabaseAnonKey) {
            if (isDev) console.warn('[Analytics] Missing VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY');
            return;
        }

        // Determine role + token before sending to avoid role race conditions.
        let role: AnalyticsRole = 'anonymous';
        let accessToken: string | null = null;
        if (hasLikelySupabaseSession()) {
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
                route,
                metric_name: metricName,
                metric_value: metricValue,
                metric_rating: metricRating,
                device_class: deviceClass,
                nav_type: navType,
                build_id: buildId,
                metric_id: metricId,
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

export const trackEvent = (event: AnalyticsEvent, data?: AnalyticsPayload) => {
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
