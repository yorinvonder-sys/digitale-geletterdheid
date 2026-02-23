/**
 * submitPilotRequest — Pilot aanvraag verwerker
 *
 * 1. Valideert de formulierdata
 * 2. Slaat de aanvraag op in de pilot_requests tabel
 * 3. Stuurt een notificatie-email naar info@dgskills.app via Zoho SMTP
 * 4. Stuurt een bevestigingsmail naar de aanvrager
 *
 * Environment variables (Supabase Edge Function Secrets):
 *   SMTP_HOST        — smtp.zoho.eu
 *   SMTP_PORT        — 465
 *   SMTP_USER        — info@dgskills.app
 *   SMTP_PASS        — Zoho app-specifiek wachtwoord
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PilotRequest {
  schoolNaam: string;
  contactPersoon: string;
  email: string;
  rol: string;
  bericht: string;
  aantalLeerlingen: string;
  website: string; // honeypot field
}

// Simple validation
function validate(data: PilotRequest): string | null {
  if (!data.schoolNaam?.trim()) return 'Schoolnaam is verplicht.';
  if (!data.contactPersoon?.trim()) return 'Naam is verplicht.';
  if (!data.email?.trim() || !data.email.includes('@')) return 'Geldig e-mailadres is verplicht.';
  if (data.schoolNaam.length > 200) return 'Schoolnaam te lang.';
  if (data.contactPersoon.length > 200) return 'Naam te lang.';
  if (data.email.length > 320) return 'E-mailadres te lang.';
  if (data.bericht && data.bericht.length > 2000) return 'Bericht te lang (max 2000 tekens).';
  return null;
}

// Rate limiting by IP (simple in-memory, resets on cold start)
const recentRequests = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const lastTime = recentRequests.get(ip);
  if (lastTime && now - lastTime < RATE_LIMIT_WINDOW) {
    const count = (recentRequests.get(`${ip}_count`) as unknown as number) || 1;
    if (count >= RATE_LIMIT_MAX) return true;
    recentRequests.set(`${ip}_count`, count + 1 as unknown as number);
  } else {
    recentRequests.set(ip, now);
    recentRequests.set(`${ip}_count`, 1 as unknown as number);
  }
  return false;
}

serve(async (req: Request) => {
  // CORS preflight
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
    // Rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(clientIp)) {
      return new Response(JSON.stringify({ error: 'Te veel aanvragen. Probeer het over een minuut opnieuw.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data: PilotRequest = await req.json();

    // Honeypot check (bots fill hidden fields)
    if (data.website && data.website.trim() !== '') {
      // Silently succeed to not alert bots
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate
    const validationError = validate(data);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize
    const sanitized = {
      school_naam: data.schoolNaam.trim().slice(0, 200),
      contact_persoon: data.contactPersoon.trim().slice(0, 200),
      email: data.email.trim().toLowerCase().slice(0, 320),
      rol: data.rol?.trim().slice(0, 50) || null,
      bericht: data.bericht?.trim().slice(0, 2000) || null,
      aantal_leerlingen: data.aantalLeerlingen?.trim().slice(0, 20) || null,
      ip_address: clientIp,
    };

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabase
      .from('pilot_requests')
      .insert(sanitized);

    if (dbError) {
      console.error('DB insert error:', dbError);
      // Continue anyway — email notification is more important
    }

    // Send notification email to info@dgskills.app
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
        // Notification to DGSkills team
        await client.send({
          from: smtpUser,
          to: 'info@dgskills.app',
          subject: `Nieuwe pilot aanvraag: ${sanitized.school_naam}`,
          content: `Nieuwe pilot aanvraag via dgskills.app\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `School:      ${sanitized.school_naam}\n` +
            `Contact:     ${sanitized.contact_persoon}\n` +
            `E-mail:      ${sanitized.email}\n` +
            `Rol:         ${sanitized.rol || '–'}\n` +
            `Leerlingen:  ${sanitized.aantal_leerlingen || '–'}\n\n` +
            `Bericht:\n${sanitized.bericht || '(geen bericht)'}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Tijdstip: ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}\n` +
            `IP: ${sanitized.ip_address}\n`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
              <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px;">Nieuwe pilot aanvraag</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">${sanitized.school_naam}</p>
              </div>
              <div style="background: #f8fafc; padding: 24px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
                  <tr><td style="padding: 8px 0; color: #94a3b8; width: 120px;">School</td><td style="padding: 8px 0; font-weight: 600;">${sanitized.school_naam}</td></tr>
                  <tr><td style="padding: 8px 0; color: #94a3b8;">Contact</td><td style="padding: 8px 0; font-weight: 600;">${sanitized.contact_persoon}</td></tr>
                  <tr><td style="padding: 8px 0; color: #94a3b8;">E-mail</td><td style="padding: 8px 0;"><a href="mailto:${sanitized.email}" style="color: #4F46E5;">${sanitized.email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #94a3b8;">Rol</td><td style="padding: 8px 0;">${sanitized.rol || '–'}</td></tr>
                  <tr><td style="padding: 8px 0; color: #94a3b8;">Leerlingen</td><td style="padding: 8px 0;">${sanitized.aantal_leerlingen || '–'}</td></tr>
                </table>
                ${sanitized.bericht ? `
                <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 4px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Bericht</p>
                  <p style="margin: 0; font-size: 14px; color: #334155; white-space: pre-wrap;">${sanitized.bericht}</p>
                </div>` : ''}
                <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
                  ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}
                </p>
              </div>
            </div>
          `,
        });

        // Confirmation email to the requester
        await client.send({
          from: smtpUser,
          to: sanitized.email,
          subject: 'Bedankt voor je pilot aanvraag — DGSkills',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
              <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px;">Bedankt, ${sanitized.contact_persoon}!</h1>
              </div>
              <div style="background: white; padding: 24px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                  We hebben je pilot aanvraag voor <strong>${sanitized.school_naam}</strong> ontvangen.
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
        // Don't fail the request — data is saved in DB
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
