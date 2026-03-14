/**
 * sendConsentEmail — Ouderlijke toestemmingsmail (AVG Art. 8)
 *
 * Verstuurt een e-mail naar ouders/verzorgers om toestemming te geven
 * voor het gebruik van het DGSkills platform door hun kind.
 *
 * - JWT auth vereist
 * - Rate limit: max 3 per uur per user
 * - SMTP via Zoho (zelfde als submitPilotRequest)
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from '../_shared/cors.ts';
import { checkRateLimit, rateLimitResponse, rateLimitHeaders } from '../_shared/rateLimiter.ts';

type ConsentType = 'data_processing' | 'ai_interaction' | 'analytics' | 'peer_feedback';

interface ConsentEmailRequest {
  parentEmail: string;
  parentName: string;
  studentName: string;
  schoolName: string;
  consentTypes: ConsentType[];
}

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
  if (!data.studentName || data.studentName.trim().length < 2) {
    return 'Naam van leerling is verplicht.';
  }
  if (!data.schoolName || data.schoolName.trim().length < 2) {
    return 'Schoolnaam is verplicht.';
  }
  if (!Array.isArray(data.consentTypes) || data.consentTypes.length === 0) {
    return 'Minimaal één toestemmingstype is verplicht.';
  }
  for (const ct of data.consentTypes) {
    if (!VALID_CONSENT_TYPES.has(ct)) {
      return `Ongeldig toestemmingstype: ${ct}`;
    }
  }
  return null;
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

  try {
    // JWT auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Niet geautoriseerd.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Niet geautoriseerd.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limit: max 3 consent emails per uur per user
    const rl = checkRateLimit(user.id, { maxRequests: 3, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) {
      return rateLimitResponse(rl, corsHeaders);
    }

    const data: ConsentEmailRequest = await req.json();
    const validationError = validateRequest(data);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize
    const parentEmail = data.parentEmail.trim().toLowerCase().slice(0, 320);
    const parentName = data.parentName.trim().slice(0, 200);
    const studentName = data.studentName.trim().slice(0, 200);
    const schoolName = data.schoolName.trim().slice(0, 200);
    const consentTypes = data.consentTypes.filter((ct) => VALID_CONSENT_TYPES.has(ct));

    // Build consent list HTML
    const consentListHtml = consentTypes
      .map((ct) => `<li style="padding: 4px 0;">${escapeHtml(CONSENT_LABELS[ct])}</li>`)
      .join('\n');

    const consentListText = consentTypes
      .map((ct) => `- ${CONSENT_LABELS[ct]}`)
      .join('\n');

    const platformUrl = 'https://dgskills.app';

    // Escaped values for HTML
    const escaped = {
      parentName: escapeHtml(parentName),
      studentName: escapeHtml(studentName),
      schoolName: escapeHtml(schoolName),
    };

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
        <div style="background: linear-gradient(135deg, #D97757, #C46849); padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Toestemming gevraagd voor DGSkills</h1>
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
            Volgens de AVG (Algemene Verordening Gegevensbescherming) vragen wij uw toestemming
            voor de volgende onderdelen:
          </p>
          <ul style="font-size: 14px; color: #52524D; line-height: 1.8; padding-left: 20px;">
            ${consentListHtml}
          </ul>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${platformUrl}" style="display: inline-block; background: #D97757; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Toestemming geven op DGSkills
            </a>
          </div>
          <p style="font-size: 13px; color: #6B6B66; line-height: 1.6;">
            U kunt uw toestemming op elk moment intrekken via het platform of door contact
            op te nemen met de school.
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

Ga naar ${platformUrl} om toestemming te geven.

U kunt uw toestemming op elk moment intrekken via het platform of door contact op te nemen met de school.

Vragen over privacy? Mail naar privacy@dgskills.app

DGSkills — dgskills.app`;

    // Send via SMTP
    const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.zoho.eu';
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '465');
    const smtpUser = Deno.env.get('SMTP_USER') || 'info@dgskills.app';
    const smtpPass = Deno.env.get('SMTP_PASS');

    if (smtpPass) {
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
          subject: `Toestemming gevraagd voor ${studentName} — DGSkills`,
          html: htmlBody,
          content: textBody,
        });
        await client.close();
        console.log(`[sendConsentEmail] E-mail verstuurd naar ${parentEmail} voor ${studentName}`);
      } catch (smtpErr) {
        console.error('[sendConsentEmail] SMTP error:', smtpErr);
        return new Response(JSON.stringify({ error: 'E-mail kon niet worden verstuurd. Probeer het later opnieuw.' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json', ...rateLimitHeaders(rl) },
        });
      }
    } else {
      // TODO: Configureer SMTP_PASS in Supabase secrets voor productie
      console.warn('[sendConsentEmail] SMTP_PASS niet geconfigureerd — e-mail niet verstuurd.');
      console.log(`[sendConsentEmail] Zou versturen naar: ${parentEmail}`);
      console.log(`[sendConsentEmail] Student: ${studentName}, School: ${schoolName}`);
      console.log(`[sendConsentEmail] Consent types: ${consentTypes.join(', ')}`);
    }

    return new Response(JSON.stringify({ success: true }), {
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
