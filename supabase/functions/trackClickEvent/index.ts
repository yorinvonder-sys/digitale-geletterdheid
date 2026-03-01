/**
 * Edge Function: /trackClickEvent
 *
 * Stores lightweight analytics events and structured Web Vitals samples.
 * Uses service role writes so anonymous page loads can still be measured.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const ALLOWED_ORIGINS = new Set([
  'https://dgskills.app',
  'https://www.dgskills.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
]);

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

const ALLOWED_ROLES = new Set(['anonymous', 'student', 'teacher', 'developer']);
const ALLOWED_DEVICE_CLASSES = new Set(['mobile', 'tablet', 'desktop', 'unknown']);
const ALLOWED_NAV_TYPES = new Set(['navigate', 'reload', 'back_forward', 'prerender', 'unknown']);
const ALLOWED_METRIC_NAMES = new Set(['LCP', 'INP', 'CLS', 'FCP', 'TTFB']);
const ALLOWED_METRIC_RATINGS = new Set(['good', 'needs-improvement', 'poor']);

interface AnalyticsRequest {
  eventName?: string;
  pageKey?: string;
  ctaKey?: string;
  role?: string;
  route?: string;
  metric_name?: string;
  metric_value?: number;
  metric_rating?: string;
  metric_id?: string;
  device_class?: string;
  nav_type?: string;
  build_id?: string;
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://dgskills.app',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
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
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return null;
  return value;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

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
    const role = normalizeEnum(body.role, ALLOWED_ROLES, 'anonymous');
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
