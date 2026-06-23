/**
 * Edge Function: /importRoster — Automatische leerling-account-aanmaak uit een
 * Magister-roster-export (CSV -> JSON door de client geparsed).
 *
 * Beveiligingslagen (gespiegeld aan resetStudentPassword):
 * 1. CORS origin-check (alleen dgskills.app + lokale dev)
 * 2. Bearer JWT + verplichte MFA (aal2) — provisioning is een privileged actie
 * 3. Caller-rol moet teacher/admin/developer zijn; school uit app_metadata
 * 4. Service-role uitsluitend server-side; alle accounts krijgen school_id =
 *    de school van de caller (HARD — nooit uit de rij; geen account-kaping)
 * 5. Server-side validatie + sanitisatie van elke rij
 * 6. Idempotent: bestaande leerling (op e-mail) wordt geupdatet, niet gedupliceerd
 * 7. Rate limiting + audit logging
 *
 * De geboortedatum uit de roster voedt de 13+ AI-leeftijdspoort (student_ai_age_ok).
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from '../_shared/cors.ts';
import { checkRateLimit, rateLimitResponse, rateLimitHeaders } from '../_shared/rateLimiter.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const PRIVILEGED_ROLES = new Set(['teacher', 'admin', 'developer']);
const VALID_LEVELS = new Set(['mavo', 'havo', 'vwo']);
const MAX_ROWS = 1000;
const MAX_REQUEST_BYTES = 1_000_000; // 1 MB
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RosterRow {
  email?: unknown;
  voornaam?: unknown;
  achternaam?: unknown;
  klas?: unknown;
  leerjaar?: unknown;
  niveau?: unknown;
  geboortedatum?: unknown;
  leerlingnummer?: unknown;
}

interface RowError { row: number; reason: string }
interface NewCredential { email: string; tempPassword: string }

function jsonResponse(body: unknown, status: number, corsHeaders: Record<string, string>, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', ...extra },
  });
}

/** Decode JWT claims (alleen om de aal2/MFA-claim te lezen). */
function decodeJwtClaims(authHeader: string | null): Record<string, unknown> | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.slice('Bearer '.length).trim();
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Sterk willekeurig tijdelijk wachtwoord (16 tekens, gemengde klassen). */
function strongTempPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%&*?';
  const all = upper + lower + digits + symbols;
  const pick = (set: string, n: number): string[] => {
    const out: string[] = [];
    const buf = new Uint32Array(n);
    crypto.getRandomValues(buf);
    for (let i = 0; i < n; i++) out.push(set[buf[i] % set.length]);
    return out;
  };
  const chars = [...pick(upper, 2), ...pick(lower, 2), ...pick(digits, 2), ...pick(symbols, 1), ...pick(all, 9)];
  // Fisher-Yates shuffle met crypto-randomness
  const order = new Uint32Array(chars.length);
  crypto.getRandomValues(order);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = order[i] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

/** Verwijder control-tekens (codepoint < 32 of 127); trim; begrens lengte. */
function sanitizeText(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  let out = '';
  for (const ch of v) {
    const code = ch.codePointAt(0);
    if (code !== undefined && code >= 32 && code !== 127) out += ch;
  }
  out = out.trim();
  return out ? out.slice(0, max) : null;
}

/** Valideer geboortedatum JJJJ-MM-DD + plausibele leeftijd 4-25. Retourneert genormaliseerde datum of null. */
function parseDob(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  // round-trip check (vangt bv. 2010-02-30)
  if (d.getUTCFullYear() !== Number(m[1]) || d.getUTCMonth() + 1 !== Number(m[2]) || d.getUTCDate() !== Number(m[3])) {
    return null;
  }
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const beforeBirthday = now.getUTCMonth() < d.getUTCMonth()
    || (now.getUTCMonth() === d.getUTCMonth() && now.getUTCDate() < d.getUTCDate());
  if (beforeBirthday) age--;
  if (age < 4 || age > 25) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

serve(async (req: Request) => {
  const corsHeaders = buildCorsHeaders(req, 'POST, OPTIONS');
  const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
  if (rejectedOrigin) return rejectedOrigin;

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders);

  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ error: 'Verzoek is te groot.' }, 413, corsHeaders);
  }

  try {
    // 1. Auth + verplichte MFA (aal2)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return jsonResponse({ error: 'Authenticatie vereist.' }, 401, corsHeaders);
    }
    const claims = decodeJwtClaims(authHeader);
    if (claims?.aal !== 'aal2') {
      return jsonResponse({ error: 'MFA-verificatie is vereist voor het importeren van leerlingen.' }, 403, corsHeaders);
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return jsonResponse({ error: 'Ongeldige sessie.' }, 401, corsHeaders);

    // 2. Rate limit: 5 imports per uur per beheerder
    const rateCheck = checkRateLimit(`roster-import:${user.id}`, { maxRequests: 5, windowMs: 3_600_000 });
    if (!rateCheck.allowed) return rateLimitResponse(rateCheck, corsHeaders);

    // 3. Autorisatie: privileged rol + schoolkoppeling (uit app_metadata = leidend)
    const callerRole = user.app_metadata?.role;
    if (typeof callerRole !== 'string' || !PRIVILEGED_ROLES.has(callerRole)) {
      return jsonResponse({ error: 'Geen toegang tot leerlingbeheer.' }, 403, corsHeaders);
    }
    const callerSchoolId = typeof user.app_metadata?.schoolId === 'string' ? user.app_metadata.schoolId : null;
    if (!callerSchoolId) {
      return jsonResponse({ error: 'Schoolkoppeling ontbreekt voor deze beheerder.' }, 403, corsHeaders);
    }

    // 4. Body
    let body: { students?: unknown };
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: 'Ongeldige JSON.' }, 400, corsHeaders);
    }
    const rows = body.students;
    if (!Array.isArray(rows) || rows.length === 0) {
      return jsonResponse({ error: 'Geen leerlingen aangeleverd.' }, 400, corsHeaders);
    }
    if (rows.length > MAX_ROWS) {
      return jsonResponse({ error: `Maximaal ${MAX_ROWS} leerlingen per import.` }, 400, corsHeaders);
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const now = new Date().toISOString();

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors: RowError[] = [];
    const credentials: NewCredential[] = [];

    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i] as RosterRow;

      // Validatie verplichte velden
      const emailRaw = sanitizeText(raw.email, 254);
      const email = emailRaw ? emailRaw.toLowerCase() : null;
      const voornaam = sanitizeText(raw.voornaam, 80);
      const achternaam = sanitizeText(raw.achternaam, 80);
      const displayName = [voornaam, achternaam].filter(Boolean).join(' ') || null;
      const dob = parseDob(raw.geboortedatum);

      if (!email || !EMAIL_RE.test(email)) { errors.push({ row: i, reason: 'Ongeldig of ontbrekend e-mailadres.' }); skipped++; continue; }
      if (!displayName) { errors.push({ row: i, reason: 'Naam ontbreekt.' }); skipped++; continue; }
      if (!dob) { errors.push({ row: i, reason: 'Ongeldige of ontbrekende geboortedatum (verwacht JJJJ-MM-DD, leeftijd 4-25).' }); skipped++; continue; }

      // Optionele velden
      let yearGroup: number | null = null;
      if (raw.leerjaar !== undefined && raw.leerjaar !== null && raw.leerjaar !== '') {
        const n = Number(raw.leerjaar);
        if (!Number.isInteger(n) || n < 1 || n > 3) { errors.push({ row: i, reason: 'Leerjaar moet 1, 2 of 3 zijn.' }); skipped++; continue; }
        yearGroup = n;
      }
      let educationLevel: string | null = null;
      if (raw.niveau !== undefined && raw.niveau !== null && raw.niveau !== '') {
        const lvl = String(raw.niveau).toLowerCase().trim();
        if (!VALID_LEVELS.has(lvl)) { errors.push({ row: i, reason: 'Niveau moet mavo, havo of vwo zijn.' }); skipped++; continue; }
        educationLevel = lvl;
      }
      const studentClass = sanitizeText(raw.klas, 32);
      const identifier = sanitizeText(raw.leerlingnummer, 32) ?? (email.split('@')[0] || null);

      const profileFields = {
        display_name: displayName,
        student_class: studentClass,
        year_group: yearGroup,
        education_level: educationLevel,
        date_of_birth: dob,
        identifier,
        updated_at: now,
      };

      try {
        // Bestaat de leerling al binnen DEZE school (op e-mail)? -> updaten
        const { data: scoped } = await adminClient
          .from('users')
          .select('id, school_id')
          .eq('school_id', callerSchoolId)
          .eq('email', email)
          .maybeSingle();

        if (scoped?.id) {
          const { error: updErr } = await adminClient.from('users').update(profileFields).eq('id', scoped.id);
          if (updErr) { errors.push({ row: i, reason: 'Bijwerken mislukt.' }); skipped++; continue; }
          updated++;
          continue;
        }

        // Bestaat de e-mail al ergens anders (andere school)? -> weigeren (geen kaping)
        const { data: anySchool } = await adminClient
          .from('users')
          .select('id, school_id')
          .eq('email', email)
          .maybeSingle();
        if (anySchool?.id && anySchool.school_id && anySchool.school_id !== callerSchoolId) {
          errors.push({ row: i, reason: 'E-mailadres is al in gebruik bij een andere school.' });
          skipped++;
          continue;
        }

        // Nieuw account
        const tempPassword = strongTempPassword();
        const { data: createdAuth, error: createErr } = await adminClient.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          app_metadata: { role: 'student', schoolId: callerSchoolId },
        });

        if (createErr || !createdAuth?.user) {
          // E-mail bestaat al in auth maar (nog) geen users-rij: koppel/herstel binnen eigen school
          const msg = (createErr?.message ?? '').toLowerCase();
          if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
            if (anySchool?.id) {
              const { error: updErr } = await adminClient.from('users').update(profileFields).eq('id', anySchool.id);
              if (updErr) { errors.push({ row: i, reason: 'Bestaand account bijwerken mislukt.' }); skipped++; continue; }
              updated++;
              continue;
            }
            errors.push({ row: i, reason: 'E-mailadres is al in gebruik.' });
          } else {
            errors.push({ row: i, reason: 'Account aanmaken mislukt.' });
          }
          skipped++;
          continue;
        }

        const { error: insErr } = await adminClient.from('users').upsert({
          id: createdAuth.user.id,
          uid: createdAuth.user.id,
          email,
          role: 'student',
          school_id: callerSchoolId,
          must_change_password: true,
          created_at: now,
          ...profileFields,
        }, { onConflict: 'id' });

        if (insErr) {
          console.error('[importRoster] profile upsert failed for new auth user');
          errors.push({ row: i, reason: 'Profiel aanmaken mislukt na account-creatie.' });
          skipped++;
          continue;
        }

        created++;
        credentials.push({ email, tempPassword });
      } catch (rowErr) {
        console.error('[importRoster] row processing error:', rowErr instanceof Error ? rowErr.message : String(rowErr));
        errors.push({ row: i, reason: 'Onverwachte fout bij verwerken van deze rij.' });
        skipped++;
      }
    }

    // 5. Audit (geen wachtwoorden, geen geboortedata in de log)
    await adminClient.from('audit_logs').insert({
      user_id: user.id,
      action: 'roster_import',
      metadata: { school_id: callerSchoolId, created, updated, skipped, error_count: errors.length, at: now },
    }).then(undefined, (e: unknown) => console.error('[importRoster] audit log failed:', e));

    return jsonResponse(
      { success: true, created, updated, skipped, errors, credentials },
      200,
      corsHeaders,
      rateLimitHeaders(rateCheck),
    );
  } catch (error) {
    console.error('[importRoster] unexpected error:', error instanceof Error ? error.message : String(error));
    return jsonResponse({ error: 'Import mislukt.' }, 500, corsHeaders);
  }
});
