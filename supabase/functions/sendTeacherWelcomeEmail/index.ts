/**
 * sendTeacherWelcomeEmail — Welkomstmail voor nieuw uitgenodigde docenten.
 *
 * Yorin roept deze function handmatig aan nadat hij een docent-account heeft
 * aangemaakt in Supabase (role: teacher, schoolId: ...). De mail bevat een
 * login-link en korte uitleg over de eerste stappen.
 *
 * Auth: Bearer JWT → alleen admin/developer mag deze function aanroepen.
 * SMTP: Zoho via dezelfde env vars als sendConsentEmail en submitPilotRequest.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from '../_shared/cors.ts';

const DEFAULT_LOGIN_URL = 'https://dgskills.app/login';
const MAX_NAME_LENGTH = 200;
const MAX_SCHOOL_NAME_LENGTH = 200;
const MAX_BODY_SIZE = 4096;

interface WelcomeEmailRequest {
  email: string;
  displayName: string;
  schoolName?: string;
  loginUrl?: string;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeText(input: string | undefined, maxLen: number): string {
  return (input || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function validate(data: WelcomeEmailRequest): string | null {
  const email = normalizeText(data.email, 320).toLowerCase();
  const displayName = normalizeText(data.displayName, MAX_NAME_LENGTH);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Geldig e-mailadres is verplicht.';
  }
  if (!displayName || displayName.length < 2) {
    return 'Naam is verplicht (minimaal 2 tekens).';
  }
  if (data.loginUrl && !/^https:\/\//.test(data.loginUrl)) {
    return 'Login-URL moet beginnen met https://.';
  }
  return null;
}

function buildHtml(
  escaped: { displayName: string; schoolName: string; loginUrl: string },
): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #D97757, #C46849); padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Welkom bij DGSkills</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">${escaped.schoolName}</p>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E8E6DF; border-top: 0; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; color: #1A1A19; margin: 0 0 16px;">
          Hallo ${escaped.displayName},
        </p>
        <p style="font-size: 14px; color: #6B6B66; margin: 0 0 16px; line-height: 1.6;">
          Je account voor DGSkills is aangemaakt. Je kunt nu inloggen en je docent-dashboard instellen.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${escaped.loginUrl}" style="display: inline-block; background-color: #D97757; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
            Inloggen bij DGSkills
          </a>
        </div>
        <p style="font-size: 13px; color: #6B6B66; margin: 0 0 8px; font-weight: bold;">Wat kun je verwachten?</p>
        <ol style="font-size: 13px; color: #6B6B66; margin: 0 0 24px; padding-left: 20px; line-height: 1.8;">
          <li>Bij de eerste inlog: een korte setup om je naam te bevestigen.</li>
          <li>Daarna kom je in je docent-dashboard met missie-overzicht, voortgang per leerling en SLO-koppeling.</li>
          <li>Vragen? Mail <a href="mailto:info@dgskills.app" style="color: #D97757;">info@dgskills.app</a> — we reageren binnen twee werkdagen.</li>
        </ol>
        <hr style="border: none; border-top: 1px solid #E8E6DF; margin: 24px 0;" />
        <p style="font-size: 11px; color: #9C9C95; margin: 0; line-height: 1.6;">
          Deze e-mail is verstuurd door DGSkills (dgskills.app) omdat er een docentaccount voor je is aangemaakt.
          Zie onze <a href="https://dgskills.app/ict/privacy/policy" style="color: #D97757;">privacyverklaring</a>
          voor informatie over hoe we je gegevens verwerken.
        </p>
      </div>
    </div>`;
}

function buildPlainText(
  displayName: string,
  schoolName: string,
  loginUrl: string,
): string {
  return `Welkom bij DGSkills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hallo ${displayName},

Je account voor DGSkills is aangemaakt voor ${schoolName}. Je kunt nu inloggen:

${loginUrl}

Wat kun je verwachten?
1. Bij de eerste inlog: een korte setup om je naam te bevestigen.
2. Daarna: docent-dashboard met missie-overzicht en SLO-koppeling.
3. Vragen? Mail info@dgskills.app — we reageren binnen twee werkdagen.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DGSkills — dgskills.app
Privacyverklaring: https://dgskills.app/ict/privacy/policy`;
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
    // Content-length guard
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_BODY_SIZE) {
      return new Response(JSON.stringify({ error: 'Request te groot.' }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Auth check: only admin/developer roles
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authenticatie vereist.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: caller }, error: authError } = await authClient.auth.getUser();
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: 'Ongeldige token.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const callerRole = caller.app_metadata?.role;
    if (callerRole !== 'admin' && callerRole !== 'developer') {
      return new Response(JSON.stringify({ error: 'Alleen beheerders mogen deze actie uitvoeren.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse + validate input
    const data: WelcomeEmailRequest = await req.json();
    const validationError = validate(data);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sanitized = {
      email: normalizeText(data.email, 320).toLowerCase(),
      displayName: normalizeText(data.displayName, MAX_NAME_LENGTH),
      schoolName: normalizeText(data.schoolName, MAX_SCHOOL_NAME_LENGTH) || 'je school',
      loginUrl: data.loginUrl || DEFAULT_LOGIN_URL,
    };

    const escaped = {
      displayName: escapeHtml(sanitized.displayName),
      schoolName: escapeHtml(sanitized.schoolName),
      loginUrl: escapeHtml(sanitized.loginUrl),
    };

    // SMTP setup — same pattern as sendConsentEmail and submitPilotRequest
    const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.zoho.eu';
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '465', 10);
    const smtpUser = Deno.env.get('SMTP_USER') || 'info@dgskills.app';
    const smtpPass = Deno.env.get('SMTP_PASS');

    if (!smtpPass) {
      console.error('[sendTeacherWelcomeEmail] SMTP_PASS not configured');
      return new Response(JSON.stringify({ error: 'E-mailconfiguratie onvolledig.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: { username: smtpUser, password: smtpPass },
      },
    });

    try {
      await client.send({
        from: smtpUser,
        to: sanitized.email,
        subject: `Welkom bij DGSkills — Je account is klaar`,
        content: buildPlainText(sanitized.displayName, sanitized.schoolName, sanitized.loginUrl),
        html: buildHtml(escaped),
      });
    } finally {
      await client.close();
    }

    console.log(`[sendTeacherWelcomeEmail] Sent to ${sanitized.email} by ${caller.email}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[sendTeacherWelcomeEmail] Error:', err);
    return new Response(JSON.stringify({ error: 'Interne fout bij versturen.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
