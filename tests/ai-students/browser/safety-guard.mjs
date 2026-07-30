const PRODUCTION_HOSTS = new Set(['dgskills.app', 'www.dgskills.app']);

function parseUrl(value, label) {
  try {
    return new URL(value);
  } catch {
    throw new Error(`${label} is geen geldige URL.`);
  }
}

function projectRefFromSupabaseUrl(value) {
  const url = parseUrl(value, 'QA_SUPABASE_URL');
  const match = url.hostname.match(/^([a-z0-9-]+)\.supabase\.co$/i);
  return match?.[1] ?? null;
}

function assertFictionalCredentials(credentials) {
  if (!credentials || typeof credentials !== 'object') {
    throw new Error('Authenticated mode vereist fictieve QA-credentials.');
  }
  if (typeof credentials.schoolId !== 'string' || !credentials.schoolId.startsWith('dgskills-qa-')) {
    throw new Error('Gebruik uitsluitend een QA-school met prefix "dgskills-qa-".');
  }
  if (!Array.isArray(credentials.accounts) || credentials.accounts.length === 0) {
    throw new Error('Minimaal één fictief QA-account is vereist.');
  }
  for (const account of credentials.accounts) {
    const fictionalEmail = typeof account?.email === 'string' && account.email.toLowerCase().endsWith('@example.test');
    if (!account?.alias || !fictionalEmail) {
      throw new Error('Ieder account moet een alias en fictief @example.test-adres hebben.');
    }
  }
}

export function assertSafeTarget(config) {
  if (config?.environment !== 'test' && config?.environment !== 'staging') {
    throw new Error('Een expliciete test- of stagingomgeving is verplicht.');
  }

  const origin = parseUrl(config.origin, 'QA_ORIGIN').origin;
  const hostname = new URL(origin).hostname.toLowerCase();
  if (PRODUCTION_HOSTS.has(hostname) || hostname.endsWith('.dgskills.app')) {
    throw new Error('De productie-origin van DGSkills is geblokkeerd voor AI-studenttests.');
  }

  const allowlist = Array.isArray(config.allowedOrigins)
    ? config.allowedOrigins.map((value) => parseUrl(value, 'AI_STUDENT_ALLOWED_ORIGINS').origin)
    : [];
  if (!allowlist.includes(origin)) {
    throw new Error(`Origin ${origin} staat niet in de expliciete allowlist.`);
  }

  if (config.mode === 'preview') return true;
  if (config.mode !== 'authenticated') {
    throw new Error('Onbekende AI-studenttestmodus.');
  }

  if (!config.expectedSupabaseProjectRef || !config.supabaseUrl) {
    throw new Error('Authenticated mode vereist een verwacht Supabase-project en QA_SUPABASE_URL.');
  }
  const actualProjectRef = projectRefFromSupabaseUrl(config.supabaseUrl);
  if (!actualProjectRef || actualProjectRef !== config.expectedSupabaseProjectRef) {
    throw new Error('Supabase-project komt niet overeen met de expliciet verwachte stagingproject-ref.');
  }
  assertFictionalCredentials(config.credentials);
  return true;
}
