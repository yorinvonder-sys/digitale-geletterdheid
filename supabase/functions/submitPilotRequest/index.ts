/**
 * submitPilotRequest — Pilot aanvraag verwerker
 *
 * 1. Valideert en normaliseert formulierdata
 * 2. Past bot- en rate-limit bescherming toe (IP + e-mail)
 * 3. Slaat de aanvraag op in de pilot_requests tabel
 * 4. Stuurt e-mails via Zoho SMTP (notificatie + bevestiging)
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const ALLOWED_ORIGINS = new Set([
  'https://dgskills.app',
  'https://www.dgskills.app',
  'http://localhost:5173',
  'http://localhost:3000',
]);

const ALLOWED_ROLES = new Set([
  'docent',
  'ict-coordinator',
  'teamleider',
  'directie',
  'anders',
]);

const ALLOWED_STUDENT_RANGES = new Set([
  '1-50',
  '50-150',
  '150-300',
  '300+',
]);

const requestBuckets = new Map<string, number[]>();
const IP_WINDOW_MS = 5 * 60_000;
const IP_MAX_REQUESTS = 5;
const EMAIL_WINDOW_MS = 60 * 60_000;
const EMAIL_MAX_REQUESTS = 3;
const MIN_FORM_FILL_MS = 800;

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://dgskills.app',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

interface PilotRequest {
  schoolNaam: string;
  contactPersoon: string;
  email: string;
  rol: string;
  bericht: string;
  aantalLeerlingen: string;
  website?: string; // honeypot
  submittedAt?: number; // milliseconds since epoch
}

function normalizeText(input: string | undefined, maxLen: number): string {
  return (input || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientIp(req: Request): string {
  const raw = req.headers.get('cf-connecting-ip')
    || req.headers.get('x-real-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]
    || 'unknown';
  return normalizeText(raw, 128) || 'unknown';
}

function cleanupBuckets(now: number) {
  for (const [key, timestamps] of requestBuckets.entries()) {
    const windowMs = key.startsWith('email:') ? EMAIL_WINDOW_MS : IP_WINDOW_MS;
    const fresh = timestamps.filter((ts) => now - ts < windowMs);
    if (fresh.length === 0) requestBuckets.delete(key);
    else requestBuckets.set(key, fresh);
  }
}

function consumeRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  cleanupBuckets(now);
  const recent = (requestBuckets.get(key) || []).filter((ts) => now - ts < windowMs);
  if (recent.length >= max) {
    requestBuckets.set(key, recent);
    return false;
  }
  recent.push(now);
  requestBuckets.set(key, recent);
  return true;
}

function validate(data: PilotRequest): string | null {
  const schoolNaam = normalizeText(data.schoolNaam, 200);
  const contactPersoon = normalizeText(data.contactPersoon, 200);
  const email = normalizeText(data.email, 320).toLowerCase();
  const bericht = normalizeText(data.bericht, 2000);
  const rol = normalizeText(data.rol, 50);
  const aantalLeerlingen = normalizeText(data.aantalLeerlingen, 20);

  if (!schoolNaam) return 'Schoolnaam is verplicht.';
  if (!contactPersoon) return 'Naam is verplicht.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Geldig e-mailadres is verplicht.';
  if (rol && !ALLOWED_ROLES.has(rol)) return 'Ongeldige rol geselecteerd.';
  if (aantalLeerlingen && !ALLOWED_STUDENT_RANGES.has(aantalLeerlingen)) return 'Ongeldig aantal leerlingen geselecteerd.';
  if (bericht.length > 2000) return 'Bericht te lang (max 2000 tekens).';
  if (typeof data.submittedAt === 'number' && Number.isFinite(data.submittedAt)) {
    if (Date.now() - data.submittedAt < MIN_FORM_FILL_MS) return 'Formulier te snel verstuurd.';
  }
  return null;
}

serve(async (req: Request) => {
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
    const clientIp = getClientIp(req);
    if (!consumeRateLimit(`ip:${clientIp}`, IP_MAX_REQUESTS, IP_WINDOW_MS)) {
      return new Response(JSON.stringify({ error: 'Te veel aanvragen vanaf dit netwerk. Probeer het later opnieuw.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    const data: PilotRequest = await req.json();

    // Honeypot check: bots vullen vaak verborgen velden
    if (data.website && data.website.trim() !== '') {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validationError = validate(data);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sanitized = {
      school_naam: normalizeText(data.schoolNaam, 200),
      contact_persoon: normalizeText(data.contactPersoon, 200),
      email: normalizeText(data.email, 320).toLowerCase(),
      rol: normalizeText(data.rol, 50) || null,
      bericht: normalizeText(data.bericht, 2000) || null,
      aantal_leerlingen: normalizeText(data.aantalLeerlingen, 20) || null,
      ip_address: clientIp,
    };

    if (!consumeRateLimit(`email:${sanitized.email}`, EMAIL_MAX_REQUESTS, EMAIL_WINDOW_MS)) {
      return new Response(JSON.stringify({ error: 'Er zijn al meerdere aanvragen gedaan met dit e-mailadres. Probeer het later opnieuw.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '600' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabase
      .from('pilot_requests')
      .insert(sanitized);

    if (dbError) {
      console.error('DB insert error:', dbError);
      // Mailflow gaat door, zelfs als opslag tijdelijk faalt.
    }

    const escaped = {
      school_naam: escapeHtml(sanitized.school_naam),
      contact_persoon: escapeHtml(sanitized.contact_persoon),
      email: escapeHtml(sanitized.email),
      rol: escapeHtml(sanitized.rol || '–'),
      aantal_leerlingen: escapeHtml(sanitized.aantal_leerlingen || '–'),
      bericht: escapeHtml(sanitized.bericht || ''),
      ip_address: escapeHtml(sanitized.ip_address || 'unknown'),
    };

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
        const formattedDate = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });

        await client.send({
          from: smtpUser,
          to: 'info@dgskills.app',
          subject: `Nieuwe pilot aanvraag: ${sanitized.school_naam}`,
          content: `Nieuwe pilot aanvraag via dgskills.app\n`
            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
            + `School:      ${sanitized.school_naam}\n`
            + `Contact:     ${sanitized.contact_persoon}\n`
            + `E-mail:      ${sanitized.email}\n`
            + `Rol:         ${sanitized.rol || '–'}\n`
            + `Leerlingen:  ${sanitized.aantal_leerlingen || '–'}\n\n`
            + `Bericht:\n${sanitized.bericht || '(geen bericht)'}\n\n`
            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
            + `Tijdstip: ${formattedDate}\n`
            + `IP: ${sanitized.ip_address}\n`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
              <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px;">Nieuwe pilot aanvraag</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">${escaped.school_naam}</p>
              </div>
              <div style="background: #f8fafc; padding: 24px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
                  <tr><td style="padding: 8px 0; color: #94a3b8; width: 120px;">School</td><td style="padding: 8px 0; font-weight: 600;">${escaped.school_naam}</td></tr>
                  <tr><td style="padding: 8px 0; color: #94a3b8;">Contact</td><td style="padding: 8px 0; font-weight: 600;">${escaped.contact_persoon}</td></tr>
                  <tr><td style="padding: 8px 0; color: #94a3b8;">E-mail</td><td style="padding: 8px 0;"><a href="mailto:${encodeURIComponent(sanitized.email)}" style="color: #4F46E5;">${escaped.email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #94a3b8;">Rol</td><td style="padding: 8px 0;">${escaped.rol}</td></tr>
                  <tr><td style="padding: 8px 0; color: #94a3b8;">Leerlingen</td><td style="padding: 8px 0;">${escaped.aantal_leerlingen}</td></tr>
                </table>
                ${escaped.bericht ? `
                <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 4px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Bericht</p>
                  <p style="margin: 0; font-size: 14px; color: #334155; white-space: pre-wrap;">${escaped.bericht}</p>
                </div>` : ''}
                <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
                  ${escapeHtml(formattedDate)}<br/>
                  IP: ${escaped.ip_address}
                </p>
              </div>
            </div>
          `,
        });

        await client.send({
          from: smtpUser,
          to: sanitized.email,
          subject: 'Bedankt voor je pilot aanvraag — DGSkills',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
              <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px;">Bedankt, ${escaped.contact_persoon}!</h1>
              </div>
              <div style="background: white; padding: 24px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                  We hebben je pilot aanvraag voor <strong>${escaped.school_naam}</strong> ontvangen.
                </p>
                <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                  Dit zijn de volgende stappen:
                </p>
                <ol style="font-size: 14px; color: #475569; line-height: 1.8; padding-left: 20px;">
                  <li>Kennismakingsgesprek (15 min) — binnen 2 werkdagen</li>
                  <li>Onboarding voor docenten (30 min)</li>
                  <li>Leerlingen starten binnen 10 werkdagen na akkoord</li>
                </ol>
                <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
                  Vragen? Mail ons op <a href="mailto:info@dgskills.app" style="color: #4F46E5;">info@dgskills.app</a>
                </p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #94a3b8;">
                  DGSkills — Digitale Geletterdheid voor het Voortgezet Onderwijs<br />
                  <a href="https://dgskills.app" style="color: #4F46E5;">dgskills.app</a>
                </p>
              </div>
            </div>
          `,
          content: `Bedankt ${sanitized.contact_persoon}!\n\nWe hebben je pilot aanvraag voor ${sanitized.school_naam} ontvangen.\n\nVolgende stappen:\n1. Kennismakingsgesprek (15 min) — binnen 2 werkdagen\n2. Onboarding voor docenten (30 min)\n3. Leerlingen starten binnen 10 werkdagen na akkoord\n\nVragen? Mail ons op info@dgskills.app\n\nDGSkills — dgskills.app`,
        });

        await client.close();
      } catch (emailErr) {
        console.error('SMTP error:', emailErr);
        // Aanvraag blijft geslaagd zolang opslag + API flow correct is.
      }
    } else {
      console.warn('SMTP_PASS not set — skipping email notification');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Er ging iets mis. Probeer het later opnieuw.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
