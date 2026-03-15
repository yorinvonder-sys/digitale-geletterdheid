/**
 * sendConsentEmail — start a parental consent request (AVG Art. 8)
 *
 * - JWT auth required
 * - Rate limit: max 3 per hour per user
 * - Stores a one-time approval request server-side
 * - Fails closed when mail delivery is unavailable
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from '../_shared/cors.ts';
import { checkDurableRateLimit, rateLimitHeaders, rateLimitResponse } from '../_shared/rateLimiter.ts';

type ConsentType = 'data_processing' | 'ai_interaction' | 'analytics' | 'peer_feedback';

interface ConsentEmailRequest {
  parentEmail: string;
  parentName: string;
  studentName?: string;
  schoolName?: string;
  consentTypes: ConsentType[];
}

interface UserProfileRow {
  display_name: string | null;
  school_id: string | null;
  year_group: number | null;
}

interface SchoolConfigRow {
  custom_config: unknown;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MAX_REQUEST_BYTES = 4_096;

const CONSENT_LABELS: Record<ConsentType, string> = {
  data_processing: 'Opslag van leervoortgang en scores',
  ai_interaction: 'Interactie met de AI-mentor voor hulp bij opdrachten',
  analytics: 'Anonieme gebruiksstatistieken om het platform te verbeteren',
  peer_feedback: 'Feedback geven en ontvangen van klasgenoten',
};

const VALID_CONSENT_TYPES = new Set<string>(Object.keys(CONSENT_LABELS));

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validateRequest(data: ConsentEmailRequest): string | null {
  if (!data.parentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.parentEmail)) {
    return 'Geldig e-mailadres van ouder/verzorger is verplicht.';
  }
  if (!data.parentName || data.parentName.trim().length < 2) {
    return 'Naam van ouder/verzorger is verplicht.';
  }
  if (!Array.isArray(data.consentTypes) || data.consentTypes.length === 0) {
    return 'Minimaal één toestemmingstype is verplicht.';
  }
  for (const consentType of data.consentTypes) {
    if (!VALID_CONSENT_TYPES.has(consentType)) {
      return `Ongeldig toestemmingstype: ${consentType}`;
    }
  }
  return null;
}

function toBase64Url(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toBase64Url(bytes);
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function extractSchoolName(config: unknown): string | null {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return null;
  const schoolName = (config as Record<string, unknown>).schoolName;
  return typeof schoolName === 'string' && schoolName.trim().length >= 2
    ? schoolName.trim().slice(0, 200)
    : null;
}

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

  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return new Response(JSON.stringify({ error: 'Verzoek is te groot.' }), {
      status: 413,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Consent service is niet correct geconfigureerd.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Niet geautoriseerd.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Niet geautoriseerd.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const role = typeof user.app_metadata?.role === 'string' ? user.app_metadata.role : null;
    if (role && role !== 'student') {
      return new Response(JSON.stringify({ error: 'Alleen leerlingaccounts kunnen ouderlijke toestemming aanvragen.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rl = await checkDurableRateLimit(
      `consent-email:${user.id}`,
      { maxRequests: 3, windowMs: 60 * 60 * 1000 },
      authHeader,
    );
    if (!rl.allowed) {
      return rateLimitResponse(rl, corsHeaders);
    }

    const body: ConsentEmailRequest = await req.json();
    const validationError = validateRequest(body);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile, error: profileError } = await adminClient
      .from('users')
      .select('display_name, school_id, year_group')
      .eq('id', user.id)
      .single();

    const typedProfile = (profile as UserProfileRow | null) ?? null;

    if (profileError || !typedProfile) {
      console.error('[sendConsentEmail] Missing profile for', user.id, profileError);
      return new Response(JSON.stringify({ error: 'Leerlingprofiel niet gevonden.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', ...rateLimitHeaders(rl) },
      });
    }

    if (typedProfile.year_group !== null && typedProfile.year_group > 4) {
      return new Response(JSON.stringify({ error: 'Ouderlijke toestemming is niet nodig voor deze leerling.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', ...rateLimitHeaders(rl) },
      });
    }

    if (!typedProfile.school_id) {
      return new Response(JSON.stringify({ error: 'Schoolscope ontbreekt voor deze leerling.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', ...rateLimitHeaders(rl) },
      });
    }

    const parentEmail = body.parentEmail.trim().toLowerCase().slice(0, 320);
    const parentName = body.parentName.trim().slice(0, 200);
    const studentName = typedProfile.display_name?.trim().slice(0, 200) || 'uw kind';
    const consentTypes = Array.from(new Set(body.consentTypes.filter((consentType) => VALID_CONSENT_TYPES.has(consentType))));

    const { data: schoolConfig } = await adminClient
      .from('school_configs')
      .select('custom_config')
      .eq('school_id', typedProfile.school_id)
      .maybeSingle();

    const typedSchoolConfig = (schoolConfig as SchoolConfigRow | null) ?? null;
    const schoolName = extractSchoolName(typedSchoolConfig?.custom_config) || 'de school van uw kind';

    const { data: existingRequest } = await adminClient
      .from('parental_consent_requests')
      .select('id')
      .eq('student_id', user.id)
      .eq('parent_email', parentEmail)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (existingRequest?.id) {
      return new Response(JSON.stringify({ error: 'Er staat al een open toestemmingsaanvraag klaar voor dit e-mailadres.' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', ...rateLimitHeaders(rl) },
      });
    }

    const token = generateToken();
    const tokenHash = await sha256(token);
    const platformUrl = 'https://dgskills.app';
    const approvalUrl = `${platformUrl}/ouderlijke-toestemming?token=${encodeURIComponent(token)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: requestRow, error: insertError } = await adminClient
      .from('parental_consent_requests')
      .insert({
        student_id: user.id,
        requested_by: user.id,
        school_id: typedProfile.school_id,
        parent_email: parentEmail,
        parent_name: parentName,
        student_name: studentName,
        school_name: schoolName,
        consent_types: consentTypes,
        token_hash: tokenHash,
        expires_at: expiresAt,
      })
      .select('id')
      .single();

    if (insertError || !requestRow) {
      console.error('[sendConsentEmail] Failed to create request:', insertError);
      return new Response(JSON.stringify({ error: 'Kon toestemmingsaanvraag niet opslaan.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', ...rateLimitHeaders(rl) },
      });
    }

    const consentListHtml = consentTypes
      .map((consentType) => `<li style="padding: 4px 0;">${escapeHtml(CONSENT_LABELS[consentType])}</li>`)
      .join('\n');

    const consentListText = consentTypes
      .map((consentType) => `- ${CONSENT_LABELS[consentType]}`)
      .join('\n');

    const escaped = {
      parentName: escapeHtml(parentName),
      studentName: escapeHtml(studentName),
      schoolName: escapeHtml(schoolName),
      approvalUrl: escapeHtml(approvalUrl),
    };

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
        <div style="background: linear-gradient(135deg, #D97757, #C46849); padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Beveiligde toestemmingsaanvraag voor DGSkills</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">${escaped.schoolName}</p>
        </div>
        <div style="background: white; padding: 24px 32px; border: 1px solid #E8E6DF; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; color: #3D3D38; line-height: 1.6;">
            Beste ${escaped.parentName},
          </p>
          <p style="font-size: 15px; color: #3D3D38; line-height: 1.6;">
            Uw kind <strong>${escaped.studentName}</strong> gebruikt het DGSkills platform op
            <strong>${escaped.schoolName}</strong> voor digitale geletterdheid.
          </p>
          <p style="font-size: 15px; color: #3D3D38; line-height: 1.6;">
            Volgens de AVG vragen wij uw toestemming voor de volgende onderdelen:
          </p>
          <ul style="font-size: 14px; color: #52524D; line-height: 1.8; padding-left: 20px;">
            ${consentListHtml}
          </ul>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${escaped.approvalUrl}" style="display: inline-block; background: #D97757; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Bevestig toestemming veilig
            </a>
          </div>
          <p style="font-size: 13px; color: #6B6B66; line-height: 1.6;">
            Deze link is persoonlijk, eenmalig en zeven dagen geldig. Zonder bevestiging via deze link
            wordt geen toestemming geactiveerd.
          </p>
          <hr style="border: none; border-top: 1px solid #E8E6DF; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9C9C95;">
            DGSkills — Digitale Geletterdheid voor het Voortgezet Onderwijs<br />
            <a href="https://dgskills.app" style="color: #D97757;">dgskills.app</a> |
            <a href="mailto:privacy@dgskills.app" style="color: #D97757;">privacy@dgskills.app</a>
          </p>
        </div>
      </div>
    `;

    const textBody = `Beste ${parentName},

Uw kind ${studentName} gebruikt het DGSkills platform op ${schoolName} voor digitale geletterdheid.

Volgens de AVG vragen wij uw toestemming voor:
${consentListText}

Bevestig deze aanvraag via de beveiligde link:
${approvalUrl}

Deze link is persoonlijk, eenmalig en zeven dagen geldig. Zonder bevestiging via deze link wordt geen toestemming geactiveerd.

Vragen over privacy? Mail naar privacy@dgskills.app

DGSkills — dgskills.app`;

    const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.zoho.eu';
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '465', 10);
    const smtpUser = Deno.env.get('SMTP_USER') || 'info@dgskills.app';
    const smtpPass = Deno.env.get('SMTP_PASS');

    if (!smtpPass) {
      await adminClient.from('parental_consent_requests').delete().eq('id', requestRow.id);
      return new Response(JSON.stringify({ error: 'Mailservice is niet geconfigureerd. Probeer het later opnieuw.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', ...rateLimitHeaders(rl) },
      });
    }

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    });

    try {
      await client.send({
        from: smtpUser,
        to: parentEmail,
        subject: `Bevestig ouderlijke toestemming voor ${studentName} — DGSkills`,
        html: htmlBody,
        content: textBody,
      });
      await client.close();
      console.log(`[sendConsentEmail] Request ${requestRow.id} mailed for student ${user.id}`);
    } catch (smtpErr) {
      console.error('[sendConsentEmail] SMTP error:', smtpErr);
      await adminClient.from('parental_consent_requests').delete().eq('id', requestRow.id);
      return new Response(JSON.stringify({ error: 'E-mail kon niet worden verstuurd. Probeer het later opnieuw.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', ...rateLimitHeaders(rl) },
      });
    }

    return new Response(JSON.stringify({ success: true, requestId: requestRow.id, expiresAt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', ...rateLimitHeaders(rl) },
    });
  } catch (err) {
    console.error('[sendConsentEmail] Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Er ging iets mis. Probeer het later opnieuw.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
