/**
 * rosterImportService — client voor de /importRoster edge function.
 *
 * Parset een Magister-roster-export (CSV) client-side naar gevalideerde rijen en
 * stuurt die naar de server, die de daadwerkelijke account-aanmaak doet
 * (service-role, school-scoped, MFA-vereist). De server hervalideert ALLES; deze
 * client-parsing is puur voor gebruiksgemak/preview.
 */
import { EDGE_FUNCTION_URL, authenticatedFetch } from './supabase';

export interface RosterStudent {
  email: string;
  voornaam: string;
  achternaam: string;
  klas?: string;
  leerjaar?: number;
  niveau?: string;
  geboortedatum: string; // genormaliseerd naar JJJJ-MM-DD
  leerlingnummer?: string;
}

export interface RosterParseResult {
  rows: RosterStudent[];
  parseErrors: string[];
}

export interface RosterImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; reason: string }>;
  credentials: Array<{ email: string; tempPassword: string }>;
}

// Header-synoniemen (lowercase) -> canoniek veld.
const HEADER_MAP: Record<string, keyof RosterStudent> = {
  email: 'email', 'e-mail': 'email', mail: 'email', emailadres: 'email',
  voornaam: 'voornaam', roepnaam: 'voornaam', firstname: 'voornaam',
  achternaam: 'achternaam', naam: 'achternaam', lastname: 'achternaam',
  klas: 'klas', groep: 'klas', class: 'klas',
  leerjaar: 'leerjaar', jaar: 'leerjaar', year: 'leerjaar', year_group: 'leerjaar',
  niveau: 'niveau', onderwijsniveau: 'niveau', level: 'niveau',
  geboortedatum: 'geboortedatum', geboorte: 'geboortedatum', dob: 'geboortedatum',
  birthdate: 'geboortedatum', date_of_birth: 'geboortedatum',
  leerlingnummer: 'leerlingnummer', nummer: 'leerlingnummer', studentnummer: 'leerlingnummer', identifier: 'leerlingnummer',
};

/** Splits een CSV-regel met ondersteuning voor aanhalingstekens. */
function splitCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; }
      } else { cur += c; }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      out.push(cur); cur = '';
    } else { cur += c; }
  }
  out.push(cur);
  return out.map((v) => v.trim());
}

/** Normaliseer een datum naar JJJJ-MM-DD (accepteert ook DD-MM-JJJJ en DD/MM/JJJJ). */
function normalizeDate(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (m) {
    const dd = m[1].padStart(2, '0');
    const mm = m[2].padStart(2, '0');
    return `${m[3]}-${mm}-${dd}`;
  }
  return null;
}

/** Parse CSV-tekst naar rijen + parse-fouten. Detecteert `;` of `,` als scheidingsteken. */
export function parseRosterCsv(text: string): RosterParseResult {
  const parseErrors: string[] = [];
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { rows: [], parseErrors: ['Bestand bevat geen gegevensregels (alleen een kop of leeg).'] };
  }

  const delimiter = (lines[0].match(/;/g)?.length ?? 0) >= (lines[0].match(/,/g)?.length ?? 0) ? ';' : ',';
  const headers = splitCsvLine(lines[0], delimiter).map((h) => h.toLowerCase());
  const fieldIndex: Partial<Record<keyof RosterStudent, number>> = {};
  headers.forEach((h, idx) => {
    const field = HEADER_MAP[h];
    if (field && fieldIndex[field] === undefined) fieldIndex[field] = idx;
  });

  const missing = (['email', 'voornaam', 'achternaam', 'geboortedatum'] as const).filter((f) => fieldIndex[f] === undefined);
  if (missing.length > 0) {
    return { rows: [], parseErrors: [`Verplichte kolommen ontbreken: ${missing.join(', ')}. Verwachte kop: email, voornaam, achternaam, geboortedatum (optioneel: klas, leerjaar, niveau, leerlingnummer).`] };
  }

  const rows: RosterStudent[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i], delimiter);
    const get = (f: keyof RosterStudent) => {
      const idx = fieldIndex[f];
      return idx === undefined ? '' : (cols[idx] ?? '');
    };
    const email = get('email');
    const voornaam = get('voornaam');
    const achternaam = get('achternaam');
    const dobRaw = get('geboortedatum');
    const dob = normalizeDate(dobRaw);

    if (!email || !voornaam || !achternaam || !dob) {
      parseErrors.push(`Regel ${i + 1}: ontbrekende of ongeldige verplichte velden (e-mail, voornaam, achternaam, geboortedatum JJJJ-MM-DD of DD-MM-JJJJ).`);
      continue;
    }

    const leerjaarRaw = get('leerjaar');
    const leerjaar = leerjaarRaw ? Number(leerjaarRaw) : undefined;
    rows.push({
      email,
      voornaam,
      achternaam,
      geboortedatum: dob,
      klas: get('klas') || undefined,
      leerjaar: Number.isFinite(leerjaar) ? leerjaar : undefined,
      niveau: get('niveau') || undefined,
      leerlingnummer: get('leerlingnummer') || undefined,
    });
  }

  return { rows, parseErrors };
}

/** Stuur de geparste rijen naar de server (service-role provisioning). */
export async function importRoster(students: RosterStudent[]): Promise<RosterImportResult> {
  const response = await authenticatedFetch(`${EDGE_FUNCTION_URL}/importRoster`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ students }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.reason || `Importeren mislukt (status ${response.status}).`);
  }
  return {
    created: data.created ?? 0,
    updated: data.updated ?? 0,
    skipped: data.skipped ?? 0,
    errors: Array.isArray(data.errors) ? data.errors : [],
    credentials: Array.isArray(data.credentials) ? data.credentials : [],
  };
}

/** Maak een CSV-string van de eenmalige inloggegevens voor download. */
export function credentialsToCsv(credentials: Array<{ email: string; tempPassword: string }>): string {
  const header = 'email,tijdelijk_wachtwoord';
  const body = credentials.map((c) => `${c.email},${c.tempPassword}`).join('\n');
  return `${header}\n${body}\n`;
}
