#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const failures = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(text, snippet, message) {
  assert(text.includes(snippet), message || `Missing snippet: ${snippet}`);
}

function assertNotIncludes(text, snippet, message) {
  assert(!text.includes(snippet), message || `Forbidden snippet present: ${snippet}`);
}

function check(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
    console.error(`not ok - ${name}`);
    console.error(`  ${error.message}`);
  }
}

function normalizeHostname(hostname) {
  return hostname.trim().toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
}

function isPrivateOrReservedIpv4(hostname) {
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) return false;
  const octets = hostname.split('.').map((part) => Number(part));
  if (octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a, b] = octets;
  return (
    a === 0
    || a === 10
    || a === 127
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 198 && (b === 18 || b === 19))
    || a >= 224
  );
}

function expectedBflUrlAllowed(rawUrl) {
  const parsed = new URL(rawUrl);
  const hostname = normalizeHostname(parsed.hostname);
  if (parsed.protocol !== 'https:') return false;
  if (parsed.username || parsed.password) return false;
  if (parsed.port && parsed.port !== '443') return false;
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) return false;
  if (isPrivateOrReservedIpv4(hostname)) return false;
  return hostname === 'api.eu.bfl.ai' || hostname.endsWith('.bfl.ai');
}

check('BFL URL boundary rejects SSRF-style URLs', () => {
  const bfl = read('supabase/functions/_shared/bflImageClient.ts');
  assertIncludes(bfl, 'export function validateBflFetchUrl');
  assertIncludes(bfl, 'parsed.protocol !== "https:"');
  assertIncludes(bfl, 'parsed.username || parsed.password');
  assertIncludes(bfl, 'isPrivateOrReservedHostname');
  assertIncludes(bfl, 'normalized.endsWith(".bfl.ai")');
  assertIncludes(bfl, 'redirect: "manual"');
  assertNotIncludes(bfl, 'fetch(pollingUrl,');
  assertNotIncludes(bfl, 'fetch(url)');

  const accepted = [
    'https://api.eu.bfl.ai/v1/flux-2-klein-9b',
    'https://delivery-eu1.bfl.ai/result/image.png',
  ];
  const rejected = [
    'http://api.eu.bfl.ai/v1/result',
    'https://localhost/result.png',
    'https://127.0.0.1/result.png',
    'https://10.0.0.5/result.png',
    'https://169.254.169.254/latest/meta-data',
    'https://example.com/result.png',
    'https://user:pass@api.eu.bfl.ai/result.png',
  ];
  for (const url of accepted) assert(expectedBflUrlAllowed(url), `Expected accepted URL: ${url}`);
  for (const url of rejected) assert(!expectedBflUrlAllowed(url), `Expected rejected URL: ${url}`);
});

check('provider-bound chat and demo payloads redact PII', () => {
  const chatCore = read('supabase/functions/_shared/chatCore.ts');
  const demoChat = read('supabase/functions/demo-chat/index.ts');
  assertIncludes(chatCore, 'sanitizePrompt(rawBody.gameContext');
  assertIncludes(chatCore, 'redactPii(gameContextValidation.sanitized).redacted');
  assertNotIncludes(chatCore, 'gameContext bypasses the sanitizer');
  assertIncludes(demoChat, 'import { redactPii }');
  assertIncludes(demoChat, 'const redactedMessage = redactPii(validation.sanitized).redacted');
  assertIncludes(demoChat, 'redactPii(part.text).redacted');
});

check('roleId validation rejects inherited object keys', () => {
  const systemInstructions = read('supabase/functions/_shared/systemInstructions.ts');
  assertNotIncludes(systemInstructions, 'roleId in SYSTEM_INSTRUCTIONS');
  assertIncludes(systemInstructions, 'Object.prototype.hasOwnProperty.call(SYSTEM_INSTRUCTIONS, roleId)');
  assertIncludes(systemInstructions, 'typeof SYSTEM_INSTRUCTIONS[roleId] === "string"');
});

check('STEP_COMPLETE markers are bounded and deduplicated', () => {
  const detector = read('supabase/functions/_shared/stepCompleteDetector.ts');
  const hook = read('src/hooks/useStepCompletion.ts');
  const logic = read('src/hooks/useAgentLogic.ts');
  assertIncludes(detector, 'resolveMissionStepCount');
  assertIncludes(detector, 'const seenSteps = new Set<number>()');
  assertIncludes(detector, 'stepNumber >= 1');
  assertIncludes(detector, 'stepNumber <= maxStepNumber');
  assertIncludes(detector, '"game-programmeur": 5');
  assertNotIncludes(detector, 'stepNumber >= 0 && stepNumber <= 100');
  assertIncludes(hook, 'normalizeCompletedSteps');
  assertIncludes(hook, 'markerNumber >= 1');
  assertIncludes(hook, 'markerNumber <= totalSteps');
  assertIncludes(logic, 'totalSteps: selectedRole?.steps?.length ?? 0');

  const extractValidSteps = (text, totalSteps) => {
    const seen = new Set();
    for (const match of text.matchAll(/---STEP_COMPLETE:(\d+)---/g)) {
      const marker = Number.parseInt(match[1], 10);
      if (Number.isSafeInteger(marker) && marker >= 1 && marker <= totalSteps) {
        seen.add(marker - 1);
      }
    }
    return [...seen];
  };
  assert(extractValidSteps('---STEP_COMPLETE:0---', 5).length === 0, 'zero marker accepted');
  assert(extractValidSteps('---STEP_COMPLETE:99---', 5).length === 0, 'too-large marker accepted');
  assert(extractValidSteps('---STEP_COMPLETE:5------STEP_COMPLETE:5---', 5).length === 1, 'duplicate marker not deduped');
});

check('RLS migration covers game_permissions and hybrid_assessments', () => {
  const migration = read('supabase/migrations/20260626120000_harden_game_permissions_hybrid_assessments_rls.sql');
  assertIncludes(migration, 'ALTER TABLE public.game_permissions ENABLE ROW LEVEL SECURITY');
  assertIncludes(migration, 'ALTER TABLE public.game_permissions FORCE ROW LEVEL SECURITY');
  assertIncludes(migration, 'CREATE POLICY "game_permissions_select_school_or_global"');
  assertIncludes(migration, 'public.is_teacher_in_school(school_id::text)');
  assertIncludes(migration, 'school_id::text = public.get_caller_school_id()');
  assertIncludes(migration, 'ALTER TABLE public.hybrid_assessments ENABLE ROW LEVEL SECURITY');
  assertIncludes(migration, 'ALTER TABLE public.hybrid_assessments FORCE ROW LEVEL SECURITY');
  assertIncludes(migration, 'CREATE POLICY "hybrid_assessments_select_same_school_or_own"');
  assertIncludes(migration, 'uid::text = auth.uid()::text');
});

check('Google token revoke keeps token out of URL', () => {
  const gdrive = read('supabase/functions/_shared/gdriveAuth.ts');
  assertNotIncludes(gdrive, 'revoke?token=');
  assertIncludes(gdrive, 'fetch("https://oauth2.googleapis.com/revoke"');
  assertIncludes(gdrive, 'body: new URLSearchParams({ token })');
});

check('hybrid assessment dashboard reads are school-scoped before RLS', () => {
  const currentDashboard = read('src/features/teacher/TeacherDashboard.tsx');
  const legacyDashboard = read('components/TeacherDashboard.tsx');
  assertIncludes(currentDashboard, ".eq('school_id', user.schoolId)");
  assertIncludes(legacyDashboard, ".eq('school_id', user.schoolId)");
});

if (failures.length > 0) {
  console.error('\nCodex security fix regression checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nCodex security fix regression checks passed.');
