/**
 * Edge Function: /trackClickEvent
 *
 * Stores lightweight analytics events and structured Web Vitals samples.
 * Uses service role writes so anonymous page loads can still be measured.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  buildCorsHeaders,
  rejectDisallowedBrowserRequest,
} from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const ALLOWED_EVENTS = new Set([
  'pilot_request_start',
  'pilot_request_success',
  'contact_click',
  'ict_check_click',
  'ict_document_download',
  'ict_subpage_view',
  'seo_page_view',
  'seo_asset_view',
  'dual_cta_click',
  'auth_success',
  'auth_error',
  'api_retry',
  'offline_detected',
  'web_vital',
  'mission_start',
  'mission_complete',
]);

const ALLOWED_DEVICE_CLASSES = new Set(['mobile', 'tablet', 'desktop', 'unknown']);
const ALLOWED_NAV_TYPES = new Set(['navigate', 'reload', 'back_forward', 'prerender', 'unknown']);
const ALLOWED_METRIC_NAMES = new Set(['LCP', 'INP', 'CLS', 'FCP', 'TTFB']);
const ALLOWED_METRIC_RATINGS = new Set(['good', 'needs-improvement', 'poor']);
const MAX_METRIC_VALUE = 300_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const rateLimitBuckets = new Map<string, number[]>();

interface AnalyticsRequest {
  eventName?: string;
  pageKey?: string;
  ctaKey?: string;
  route?: string;
  metric_name?: string;
  metric_value?: number;
  metric_rating?: string;
  metric_id?: string;
  device_class?: string;
  nav_type?: string;
  build_id?: string;
}

function sanitizeToken(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .slice(0, maxLen);
}

function sanitizeRoute(value: unknown): string {
  if (typeof value !== 'string') return '/';
  const normalized = value
    .trim()
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .slice(0, 120);
  if (!normalized) return '/';
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function normalizeEnum(value: unknown, allowed: Set<string>, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  return allowed.has(value) ? value : fallback;
}

function normalizeMetricName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const upper = value.toUpperCase().trim();
  return ALLOWED_METRIC_NAMES.has(upper) ? upper : null;
}

function normalizeMetricValue(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > MAX_METRIC_VALUE) return null;
  return value;
}

function getClientIp(req: Request): string {
  const raw = req.headers.get('cf-connecting-ip')
    || req.headers.get('x-real-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown';
  return sanitizeToken(raw, 128) || 'unknown';
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function consumeRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (rateLimitBuckets.get(key) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (recent.length === 0) {
    rateLimitBuckets.delete(key);
  }

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitBuckets.set(key, recent);
    return false;
  }

  recent.push(now);
  rateLimitBuckets.set(key, recent);
  return true;
}

async function resolveRole(req: Request): Promise<'anonymous' | 'student' | 'teacher' | 'developer'> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return 'anonymous';

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return 'anonymous';
  }

  const role = user.app_metadata?.role;
  if (role === 'teacher') return 'teacher';
  if (role === 'developer' || role === 'admin') return 'developer';
  if (role === 'student') return 'student';
  return 'anonymous';
}

Deno.serve(async (req: Request) => {
  const corsHeaders = buildCorsHeaders(req, 'POST, OPTIONS');
  const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
  if (rejectedOrigin) return rejectedOrigin;

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const clientIp = getClientIp(req);
    const userAgent = req.headers.get('User-Agent') || 'unknown';
    const fingerprintHash = await sha256(`${clientIp}|${userAgent}`);

    if (!consumeRateLimit(fingerprintHash)) {
      return new Response(JSON.stringify({ error: 'Te veel analytics-verzoeken.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    const body = (await req.json()) as AnalyticsRequest;
    const eventName = sanitizeToken(body.eventName, 64);

    if (!ALLOWED_EVENTS.has(eventName)) {
      return new Response(JSON.stringify({ error: 'Invalid eventName' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const route = sanitizeRoute(body.route ?? body.pageKey ?? '/');
    const pageKey = sanitizeToken(body.pageKey, 80) || 'unknown';
    const ctaKey = sanitizeToken(body.ctaKey, 50) || 'none';
    const role = await resolveRole(req);
    const deviceClass = normalizeEnum(body.device_class, ALLOWED_DEVICE_CLASSES, 'unknown');
    const navType = normalizeEnum(body.nav_type, ALLOWED_NAV_TYPES, 'unknown');
    const buildId = sanitizeToken(body.build_id, 64) || 'unknown';
    const metricName = normalizeMetricName(body.metric_name);
    const metricValue = normalizeMetricValue(body.metric_value);
    const metricRating = normalizeEnum(body.metric_rating, ALLOWED_METRIC_RATINGS, '');
    const metricId = sanitizeToken(body.metric_id, 80) || null;

    if (eventName === 'web_vital') {
      if (!metricName || metricValue === null || !metricRating) {
        return new Response(JSON.stringify({ error: 'Missing or invalid Web Vitals payload' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const eventData = {
      event_name: eventName,
      page_key: pageKey,
      cta_key: ctaKey,
      role,
      route,
      device_class: deviceClass,
      nav_type: navType,
      build_id: buildId,
      metric_name: metricName,
      metric_value: metricValue,
      metric_rating: metricRating || null,
      metric_id: metricId,
      fingerprint_hash: fingerprintHash,
      ts: new Date().toISOString(),
    };

    const { error: eventsInsertError } = await supabase
      .from('events')
      .insert({
        data: eventData,
        school_id: null,
      });

    if (eventsInsertError) {
      console.error('[trackClickEvent] events insert failed:', eventsInsertError);
      return new Response(JSON.stringify({ error: 'Failed to store event' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (eventName === 'web_vital' && metricName && metricValue !== null && metricRating) {
      const { error: vitalsInsertError } = await supabase
        .from('web_vitals_events')
        .insert({
          event_name: eventName,
          route,
          device_class: deviceClass,
          nav_type: navType,
          build_id: buildId,
          metric_name: metricName,
          metric_value: metricValue,
          metric_rating: metricRating,
          page_key: pageKey,
          cta_key: ctaKey,
          role,
          metadata: {
            metric_id: metricId,
            fingerprint_hash: fingerprintHash,
          },
        });

      if (vitalsInsertError) {
        console.error('[trackClickEvent] web_vitals_events insert failed:', vitalsInsertError);
        return new Response(JSON.stringify({ error: 'Failed to store vitals event' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[trackClickEvent] unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
