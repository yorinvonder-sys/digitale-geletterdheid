import path from 'node:path';
import { DEVICE_PROFILES } from './devices.mjs';

function argValue(argv, name) {
  const prefix = `--${name}=`;
  return argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) ?? null;
}

function csv(value, fallback = []) {
  if (!value) return fallback;
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    throw new Error(`Ongeldige origin: ${value}`);
  }
}

export function parseRunConfig(argv = process.argv.slice(2), env = process.env) {
  const environment = env.AI_STUDENT_ENVIRONMENT;
  if (environment !== 'test' && environment !== 'staging') {
    throw new Error('AI_STUDENT_ENVIRONMENT moet expliciet "test" of "staging" zijn.');
  }

  const origin = normalizeOrigin(env.QA_ORIGIN || 'http://127.0.0.1:4173');
  const allowedOrigins = csv(env.AI_STUDENT_ALLOWED_ORIGINS).map(normalizeOrigin);
  const devices = csv(argValue(argv, 'device'), ['desktop']);
  const devicesExplicit = argValue(argv, 'device') !== null;
  for (const device of devices) {
    if (!(device in DEVICE_PROFILES)) {
      throw new Error(`Onbekend deviceprofiel "${device}".`);
    }
  }

  const credentialsPath = env.AI_STUDENT_CREDENTIALS_PATH
    ? path.resolve(env.AI_STUDENT_CREDENTIALS_PATH)
    : null;
  const requestedMode = argValue(argv, 'mode');
  const mode = requestedMode || (credentialsPath ? 'authenticated' : 'preview');
  if (mode !== 'preview' && mode !== 'authenticated') {
    throw new Error('Mode moet "preview" of "authenticated" zijn.');
  }

  return {
    environment,
    origin,
    allowedOrigins,
    expectedSupabaseProjectRef: env.AI_STUDENT_EXPECTED_SUPABASE_PROJECT_REF || null,
    supabaseUrl: env.QA_SUPABASE_URL || null,
    credentialsPath,
    chromiumPath: env.AI_STUDENT_CHROMIUM_PATH || null,
    mode,
    missions: csv(argValue(argv, 'mission')),
    personas: csv(argValue(argv, 'persona')),
    devices,
    devicesExplicit,
    seed: argValue(argv, 'seed') || 'dgskills-ai-students-v1',
    reportDir: path.resolve(argValue(argv, 'report-dir') || 'test-results/ai-students'),
    dryRun: argv.includes('--dry-run'),
    headless: !argv.includes('--headed'),
  };
}
