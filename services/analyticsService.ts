// Landing-page analytics — tracks conversions and engagement via Edge Function.

import { supabase, callEdgeFunction } from './supabase';

export type AnalyticsEvent =
    | 'pilot_request_start'
    | 'pilot_request_success'
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

export const trackEvent = (event: AnalyticsEvent, data?: Record<string, any>) => {
    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (isDev) {
        console.log(`[Analytics] Event: ${event}`, data || '');
    }

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

        // Determine role for segmentation (no user ID — privacy)
        let role: 'anonymous' | 'student' | 'teacher' | 'developer' = 'anonymous';
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) role = 'student';
        });

        callEdgeFunction('trackClickEvent', {
            eventName: event,
            pageKey,
            ctaKey,
            role
        }).catch(err => {
            if (isDev) console.warn('[Analytics] Failed to track event:', err);
        });
    } catch (err) {
        if (isDev) console.warn('[Analytics] Error initializing tracker:', err);
    }
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
