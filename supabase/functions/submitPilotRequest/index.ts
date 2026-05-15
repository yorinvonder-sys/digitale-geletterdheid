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
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from '../_shared/cors.ts';

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

async function exceedsPersistentRateLimit(
  supabase: ReturnType<typeof createClient>,
  clientIp: string,
  email: string,
): Promise<{ ipLimited: boolean; emailLimited: boolean }> {
  const ipSince = new Date(Date.now() - IP_WINDOW_MS).toISOString();
  const emailSince = new Date(Date.now() - EMAIL_WINDOW_MS).toISOString();

  const [
    { count: recentIpCount, error: ipError },
    { count: recentEmailCount, error: emailError },
  ] = await Promise.all([
    supabase
      .from('pilot_requests')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', clientIp)
      .gte('created_at', ipSince),
    supabase
      .from('pilot_requests')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', emailSince),
  ]);

  if (ipError) {
    console.error('[submitPilotRequest] persistent IP rate limit check failed:', ipError);
  }
  if (emailError) {
    console.error('[submitPilotRequest] persistent email rate limit check failed:', emailError);
  }

  return {
    ipLimited: !ipError && (recentIpCount || 0) >= IP_MAX_REQUESTS,
    emailLimited: !emailError && (recentEmailCount || 0) >= EMAIL_MAX_REQUESTS,
  };
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const persistentRateLimit = await exceedsPersistentRateLimit(
      supabase,
      clientIp,
      sanitized.email,
    );

    if (persistentRateLimit.ipLimited) {
      return new Response(JSON.stringify({ error: 'Te veel aanvragen vanaf dit netwerk. Probeer het later opnieuw.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    if (
      !consumeRateLimit(`email:${sanitized.email}`, EMAIL_MAX_REQUESTS, EMAIL_WINDOW_MS)
      || persistentRateLimit.emailLimited
    ) {
      return new Response(JSON.stringify({ error: 'Er zijn al meerdere aanvragen gedaan met dit e-mailadres. Probeer het later opnieuw.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '600' },
      });
    }

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
              <div style="background: linear-gradient(135deg, #D97848, #D97848); padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px;">Nieuwe pilot aanvraag</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">${escaped.school_naam}</p>
              </div>
              <div style="background: #FCF6EA; padding: 24px 32px; border: 1px solid #E7D8BD; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #445865;">
                  <tr><td style="padding: 8px 0; color: #445865; width: 120px;">School</td><td style="padding: 8px 0; font-weight: 600;">${escaped.school_naam}</td></tr>
                  <tr><td style="padding: 8px 0; color: #445865;">Contact</td><td style="padding: 8px 0; font-weight: 600;">${escaped.contact_persoon}</td></tr>
                  <tr><td style="padding: 8px 0; color: #445865;">E-mail</td><td style="padding: 8px 0;"><a href="mailto:${encodeURIComponent(sanitized.email)}" style="color: #D97848;">${escaped.email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #445865;">Rol</td><td style="padding: 8px 0;">${escaped.rol}</td></tr>
                  <tr><td style="padding: 8px 0; color: #445865;">Leerlingen</td><td style="padding: 8px 0;">${escaped.aantal_leerlingen}</td></tr>
                </table>
                ${escaped.bericht ? `
                <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #E7D8BD;">
                  <p style="margin: 0 0 4px; font-size: 12px; color: #445865; text-transform: uppercase; letter-spacing: 0.05em;">Bericht</p>
                  <p style="margin: 0; font-size: 14px; color: #445865; white-space: pre-wrap;">${escaped.bericht}</p>
                </div>` : ''}
                <p style="margin-top: 20px; font-size: 12px; color: #445865;">
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
          subject: `Welkom bij DGSkills — volgende stappen voor ${sanitized.school_naam}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #D97848, #D97848); padding: 28px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0 0 6px; font-size: 22px;">Welkom, ${escaped.contact_persoon}!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Je pilot-aanvraag voor <strong>${escaped.school_naam}</strong> is binnen.</p>
              </div>
              <div style="background: white; padding: 28px 32px; border: 1px solid #E7D8BD; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 15px; color: #445865; line-height: 1.6; margin: 0 0 20px;">
                  We nemen binnen 2 werkdagen persoonlijk contact op om de pilot in te plannen. In de tussentijd kun je alvast het volgende doen:
                </p>

                <div style="background: #FCF6EA; border: 1px solid #E7D8BD; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                  <p style="margin: 0 0 14px; font-size: 11px; color: #445865; text-transform: uppercase; letter-spacing: 0.08em; font-weight: bold;">De tijdlijn</p>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; width: 28px; vertical-align: top; font-size: 14px; font-weight: bold; color: #D97848;">1.</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #445865;">
                        <strong>Kennismakingsgesprek</strong> — 15 minuten, binnen 2 werkdagen
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; vertical-align: top; font-size: 14px; font-weight: bold; color: #D97848;">2.</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #445865;">
                        <strong>Onboarding voor docenten</strong> — 30 minuten, ingepland na akkoord
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; vertical-align: top; font-size: 14px; font-weight: bold; color: #D97848;">3.</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #445865;">
                        <strong>Leerlingen starten</strong> — binnen 10 werkdagen na akkoord
                      </td>
                    </tr>
                  </table>
                </div>

                <p style="margin: 0 0 10px; font-size: 11px; color: #445865; text-transform: uppercase; letter-spacing: 0.08em; font-weight: bold;">Voor je schoolbestuur en FG</p>
                <p style="font-size: 14px; color: #445865; line-height: 1.6; margin: 0 0 14px;">
                  Onze Compliance Hub bevat alle 21 juridische en technische documenten — DPA Model 4.0, DPIA, EU AI Act Annex IV, risicoregister en verwerkingsregister. Direct te bekijken of op aanvraag.
                </p>
                <p style="margin: 0 0 24px;">
                  <a href="https://dgskills.app/compliance-hub" style="display: inline-block; padding: 10px 20px; background: #08283B; color: white; text-decoration: none; font-weight: 600; font-size: 13px; border-radius: 8px;">Naar Compliance Hub →</a>
                </p>

                <p style="margin: 0 0 10px; font-size: 11px; color: #445865; text-transform: uppercase; letter-spacing: 0.08em; font-weight: bold;">Veelgestelde vragen</p>
                <div style="font-size: 13px; color: #445865; line-height: 1.6;">
                  <p style="margin: 0 0 10px;"><strong style="color: #445865;">Waar staat onze data?</strong><br />Binnen de Europese Economische Ruimte (europe-west4, Nederland). AI-verwerking via Google Vertex AI in dezelfde regio. Geen data wordt gebruikt voor het trainen van AI-modellen.</p>
                  <p style="margin: 0 0 10px;"><strong style="color: #445865;">Wat gebeurt er na de pilot?</strong><br />Stoppen (alle data wordt binnen 30 dagen verwijderd), verlengen, of overstappen naar een licentie vanaf €2.000 per schoollocatie per jaar.</p>
                  <p style="margin: 0 0 10px;"><strong style="color: #445865;">Is DGSkills compliant met de EU AI Act?</strong><br />Ja. We zijn geclassificeerd als hoog-risico onder Annex III punt 3(b) en werken naar volledige conformiteit voor 2 augustus 2026. Het volledige conformiteitsbeoordelingsplan is opvraagbaar.</p>
                </div>

                <p style="font-size: 14px; color: #445865; margin: 24px 0 0;">
                  Heb je direct vragen? Mail ons op <a href="mailto:info@dgskills.app" style="color: #D97848;">info@dgskills.app</a> of specifiek voor privacy op <a href="mailto:privacy@dgskills.app" style="color: #D97848;">privacy@dgskills.app</a>.
                </p>

                <hr style="border: none; border-top: 1px solid #E7D8BD; margin: 24px 0 18px;" />
                <p style="font-size: 12px; color: #445865; margin: 0;">
                  DGSkills — Digitale Geletterdheid voor het Voortgezet Onderwijs<br />
                  <a href="https://dgskills.app" style="color: #D97848;">dgskills.app</a>
                  &nbsp;·&nbsp;
                  <a href="https://dgskills.app/compliance-hub" style="color: #D97848;">Compliance</a>
                  &nbsp;·&nbsp;
                  KvK 81819889
                </p>
              </div>
            </div>
          `,
          content: `Welkom, ${sanitized.contact_persoon}!\n\n`
            + `Je pilot-aanvraag voor ${sanitized.school_naam} is binnen.\n\n`
            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
            + `DE TIJDLIJN\n`
            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
            + `1. Kennismakingsgesprek — 15 min, binnen 2 werkdagen\n`
            + `2. Onboarding voor docenten — 30 min, ingepland na akkoord\n`
            + `3. Leerlingen starten — binnen 10 werkdagen na akkoord\n\n`
            + `VOOR JE SCHOOLBESTUUR EN FG\n`
            + `Onze Compliance Hub bevat alle 21 juridische en technische documenten — DPA Model 4.0, DPIA, EU AI Act Annex IV, risicoregister en verwerkingsregister.\n`
            + `→ https://dgskills.app/compliance-hub\n\n`
            + `VEELGESTELDE VRAGEN\n`
            + `• Waar staat onze data? Binnen de EER (europe-west4, Nederland). Geen training op jouw data.\n`
            + `• Wat na de pilot? Stoppen (data verwijderd binnen 30 dagen), verlengen, of licentie vanaf €2.000 per locatie/jaar.\n`
            + `• EU AI Act? Ja — hoog-risico conform Annex III 3(b), conformiteit voor 2 augustus 2026.\n\n`
            + `Vragen? info@dgskills.app of privacy@dgskills.app\n\n`
            + `DGSkills — dgskills.app — KvK 81819889`,
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
