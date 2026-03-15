/**
 * approveParentalConsent — preview or approve a one-time parental consent request
 *
 * - Public endpoint, but only callable from allowed origins
 * - Uses a high-entropy token stored as SHA-256 hash
 * - Supports preview mode before approval
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from '../_shared/cors.ts';
import { checkRateLimit, rateLimitResponse } from '../_shared/rateLimiter.ts';

type ConsentType = 'data_processing' | 'ai_interaction' | 'analytics' | 'peer_feedback';

interface ApprovalRequestBody {
  token: string;
  preview?: boolean;
}

interface ConsentRequestRow {
  id: string;
  student_id: string;
  school_id: string;
  parent_email: string;
  parent_name: string;
  student_name: string;
  school_name: string;
  consent_types: ConsentType[];
  status: 'pending' | 'approved' | 'expired' | 'cancelled';
  expires_at: string;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CURRENT_CONSENT_VERSION = '1.0';

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function jsonResponse(body: unknown, status: number, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function buildPublicPayload(row: ConsentRequestRow) {
  return {
    parentName: row.parent_name,
    studentName: row.student_name,
    schoolName: row.school_name,
    consentTypes: row.consent_types,
    expiresAt: row.expires_at,
    status: row.status,
  };
}

serve(async (req: Request) => {
  const corsHeaders = buildCorsHeaders(req, 'POST, OPTIONS');
  const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
  if (rejectedOrigin) return rejectedOrigin;

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders);
  }

  // Rate limit: 10 requests per minute per IP
  const forwardedForRL = req.headers.get('x-forwarded-for') || '';
  const clientIpRL = forwardedForRL.split(',')[0]?.trim() || 'unknown';
  const rateCheck = checkRateLimit(`consent-ip:${clientIpRL}`, { maxRequests: 10, windowMs: 60_000 });
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck, corsHeaders);
  }

  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse({ error: 'Consent service is niet correct geconfigureerd.' }, 500, corsHeaders);
    }

    const body: ApprovalRequestBody = await req.json();
    const token = body.token?.trim();
    if (!token || token.length < 32) {
      return jsonResponse({ error: 'Ongeldige toestemmingslink.' }, 400, corsHeaders);
    }

    const tokenHash = await sha256(token);
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: row, error } = await adminClient
      .from('parental_consent_requests')
      .select('id, student_id, school_id, parent_email, parent_name, student_name, school_name, consent_types, status, expires_at')
      .eq('token_hash', tokenHash)
      .single();

    const typedRow = (row as ConsentRequestRow | null) ?? null;

    if (error || !typedRow) {
      return jsonResponse({ error: 'Deze toestemmingsaanvraag is niet gevonden of niet meer geldig.' }, 404, corsHeaders);
    }

    if (new Date(typedRow.expires_at).getTime() < Date.now() && typedRow.status === 'pending') {
      await adminClient
        .from('parental_consent_requests')
        .update({ status: 'expired' })
        .eq('id', typedRow.id);
      typedRow.status = 'expired';
    }

    if (body.preview) {
      return jsonResponse(buildPublicPayload(typedRow), 200, corsHeaders);
    }

    if (typedRow.status !== 'pending') {
      return jsonResponse(buildPublicPayload(typedRow), 409, corsHeaders);
    }

    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const clientIp = forwardedFor.split(',')[0]?.trim() || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const [approvedIpHash, approvedUserAgentHash] = await Promise.all([
      sha256(clientIp),
      sha256(userAgent),
    ]);

    const consentRows = typedRow.consent_types.map((consentType) => ({
      student_id: typedRow.student_id,
      school_id: typedRow.school_id,
      consent_type: consentType,
      granted: true,
      granted_by: 'parent',
      granted_at: new Date().toISOString(),
      revoked_at: null,
      parent_email: typedRow.parent_email,
      parent_name: typedRow.parent_name,
      ip_address: approvedIpHash,
      consent_version: CURRENT_CONSENT_VERSION,
    }));

    const { error: consentError } = await adminClient
      .from('student_consents')
      .upsert(consentRows, { onConflict: 'student_id,consent_type' });

    if (consentError) {
      console.error('[approveParentalConsent] Failed to upsert consents:', consentError);
      return jsonResponse({ error: 'Kon de toestemming niet opslaan.' }, 500, corsHeaders);
    }

    const { error: updateError } = await adminClient
      .from('parental_consent_requests')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_ip_hash: approvedIpHash,
        approved_user_agent_hash: approvedUserAgentHash,
      })
      .eq('id', typedRow.id);

    if (updateError) {
      console.error('[approveParentalConsent] Failed to mark request approved:', updateError);
      return jsonResponse({ error: 'Toestemming is opgeslagen, maar de aanvraagstatus kon niet worden bijgewerkt.' }, 500, corsHeaders);
    }

    return jsonResponse({
      ...buildPublicPayload({ ...typedRow, status: 'approved' }),
      status: 'approved',
    }, 200, corsHeaders);
  } catch (err) {
    console.error('[approveParentalConsent] Unexpected error:', err);
    return jsonResponse({ error: 'Er ging iets mis. Probeer het later opnieuw.' }, 500, corsHeaders);
  }
});
