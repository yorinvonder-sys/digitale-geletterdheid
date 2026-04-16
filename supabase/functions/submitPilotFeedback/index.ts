/**
 * submitPilotFeedback — Pilot-feedback inzending
 *
 * Ontvang NPS-scores en vrije feedback van geauthenticeerde docenten.
 * Slaat op in pilot_feedback tabel via service_role.
 *
 * Security: Auth verplicht, rate limit 10/uur per user,
 *           honeypot, input validatie, generieke foutmeldingen naar client.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from '../_shared/cors.ts';

// ---------------------------------------------------------------------------
// Whitelists
// ---------------------------------------------------------------------------
const ALLOWED_ROLES = new Set([
  'docent',
  'ict-coordinator',
  'teamleider',
  'directie',
  'anders',
]);

const ALLOWED_CATEGORIES = new Set([
  'ui',
  'content',
  'compliance',
  'performance',
  'onboarding',
  'other',
]);

// ---------------------------------------------------------------------------
// In-memory rate limiter (per edge function instance)
// Backed by persistent DB check for cross-instance accuracy.
// ---------------------------------------------------------------------------
const requestBuckets = new Map<string, number[]>();
const USER_WINDOW_MS = 60 * 60_000; // 1 hour
const USER_MAX_REQUESTS = 10;

function cleanupBuckets(now: number): void {
  for (const [key, timestamps] of requestBuckets.entries()) {
    const fresh = timestamps.filter((ts) => now - ts < USER_WINDOW_MS);
    if (fresh.length === 0) requestBuckets.delete(key);
    else requestBuckets.set(key, fresh);
  }
}

function consumeRateLimit(key: string): boolean {
  const now = Date.now();
  cleanupBuckets(now);
  const recent = (requestBuckets.get(key) || []).filter((ts) => now - ts < USER_WINDOW_MS);
  if (recent.length >= USER_MAX_REQUESTS) {
    requestBuckets.set(key, recent);
    return false;
  }
  recent.push(now);
  requestBuckets.set(key, recent);
  return true;
}

// ---------------------------------------------------------------------------
// Persistent rate limit check (fallback for multi-instance deployments)
// ---------------------------------------------------------------------------
async function exceedsPersistentRateLimit(
  supabase: ReturnType<typeof createClient>,
  teacherUid: string,
): Promise<boolean> {
  const since = new Date(Date.now() - USER_WINDOW_MS).toISOString();
  const { count, error } = await supabase
    .from('pilot_feedback')
    .select('id', { count: 'exact', head: true })
    .eq('teacher_uid', teacherUid)
    .gte('created_at', since);

  if (error) {
    console.error('[submitPilotFeedback] persistent rate limit check failed:', error);
    return false; // Fail open — don't block on DB error
  }

  return (count || 0) >= USER_MAX_REQUESTS;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function normalizeText(input: unknown, maxLen: number): string {
  return (typeof input === 'string' ? input : '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function getClientIp(req: Request): string {
  const raw =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    'unknown';
  return normalizeText(raw, 128) || 'unknown';
}

// ---------------------------------------------------------------------------
// Payload interface
// ---------------------------------------------------------------------------
interface FeedbackPayload {
  nps_score?: unknown;
  feedback_text?: unknown;
  category?: unknown;
  role?: unknown;
  school_id?: unknown;
  website?: unknown; // honeypot
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validate(data: FeedbackPayload): string | null {
  const { nps_score, feedback_text, category, role } = data;

  // At least one signal required
  const hasNps = nps_score !== null && nps_score !== undefined && nps_score !== '';
  const hasText =
    typeof feedback_text === 'string' && feedback_text.trim().length > 0;
  if (!hasNps && !hasText) {
    return 'Geef een NPS-score of schrijf een opmerking.';
  }

  // NPS 0-10
  if (hasNps) {
    const score = Number(nps_score);
    if (!Number.isInteger(score) || score < 0 || score > 10) {
      return 'NPS-score moet een geheel getal zijn tussen 0 en 10.';
    }
  }

  // Feedback text max length
  if (typeof feedback_text === 'string' && feedback_text.length > 4000) {
    return 'Feedback is te lang (max 4000 tekens).';
  }

  // Category whitelist
  const cat = normalizeText(category, 50);
  if (cat && !ALLOWED_CATEGORIES.has(cat)) {
    return 'Ongeldige categorie geselecteerd.';
  }

  // Role whitelist
  const rol = normalizeText(role, 50);
  if (rol && !ALLOWED_ROLES.has(rol)) {
    return 'Ongeldige rol geselecteerd.';
  }

  return null;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
serve(async (req: Request) => {
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
    // ------------------------------------------------------------------
    // Auth: verify the Authorization header via Supabase anon client
    // ------------------------------------------------------------------
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authenticatie vereist.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Use anon client to validate the token
    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await anonClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Authenticatie vereist.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const teacherUid = user.id;

    // ------------------------------------------------------------------
    // In-memory rate limit
    // ------------------------------------------------------------------
    if (!consumeRateLimit(`user:${teacherUid}`)) {
      return new Response(
        JSON.stringify({ error: 'Te veel aanvragen. Probeer het later opnieuw.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '3600' },
        },
      );
    }

    // ------------------------------------------------------------------
    // Parse body
    // ------------------------------------------------------------------
    const data: FeedbackPayload = await req.json();

    // ------------------------------------------------------------------
    // Honeypot check
    // ------------------------------------------------------------------
    if (typeof data.website === 'string' && data.website.trim() !== '') {
      // Return 200 to confuse bots; do not persist
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ------------------------------------------------------------------
    // Validation
    // ------------------------------------------------------------------
    const validationError = validate(data);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ------------------------------------------------------------------
    // Persistent rate limit check via service client
    // ------------------------------------------------------------------
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    const persistentLimited = await exceedsPersistentRateLimit(serviceClient, teacherUid);
    if (persistentLimited) {
      return new Response(
        JSON.stringify({ error: 'Te veel aanvragen. Probeer het later opnieuw.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '3600' },
        },
      );
    }

    // ------------------------------------------------------------------
    // Sanitize
    // ------------------------------------------------------------------
    const npsRaw = data.nps_score;
    const npsScore: number | null =
      npsRaw !== null && npsRaw !== undefined && npsRaw !== ''
        ? Number(npsRaw)
        : null;

    const sanitized = {
      teacher_uid:   teacherUid,
      school_id:     typeof data.school_id === 'string' && data.school_id.length > 0
                       ? data.school_id
                       : null,
      role:          normalizeText(data.role, 50) || null,
      nps_score:     npsScore,
      feedback_text: normalizeText(data.feedback_text, 4000) || null,
      category:      normalizeText(data.category, 50) || 'other',
      ip_address:    getClientIp(req),
      status:        'new',
    };

    // ------------------------------------------------------------------
    // Insert via service role (bypasses RLS; auth already verified above)
    // ------------------------------------------------------------------
    const { data: inserted, error: dbError } = await serviceClient
      .from('pilot_feedback')
      .insert(sanitized)
      .select('id')
      .single();

    if (dbError) {
      console.error('[submitPilotFeedback] DB insert error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Er ging iets mis bij het opslaan. Probeer het later opnieuw.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(JSON.stringify({ success: true, id: inserted?.id ?? null }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[submitPilotFeedback] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Er ging iets mis. Probeer het later opnieuw.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
