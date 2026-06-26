import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const read = (path) => readFileSync(join(root, path), 'utf8');
const migrationsDir = join(root, 'supabase/migrations');
const migrations = readdirSync(migrationsDir)
  .filter((name) => name.endsWith('.sql'))
  .sort();

const securityMigrationName = [...migrations]
  .reverse()
  .find((name) => /security_report_core_auth_rls/.test(name));

assert.ok(
  securityMigrationName,
  'security report core auth/RLS remediation migration must exist',
);

const securityMigration = read(`supabase/migrations/${securityMigrationName}`);
const allMigrations = migrations
  .map((name) => `-- ${name}\n${read(`supabase/migrations/${name}`)}`)
  .join('\n\n');

const authService = read('src/services/authService.ts');
const consentHelper = read('supabase/functions/_shared/consent.ts');
const chatCore = read('supabase/functions/_shared/chatCore.ts');
const rateLimiter = read('supabase/functions/_shared/rateLimiter.ts');
const resetStudentPassword = read('supabase/functions/resetStudentPassword/index.ts');
const generateImage = read('supabase/functions/generateImage/index.ts');
const analyzeDrawing = read('supabase/functions/analyzeDrawing/index.ts');
const growthRecommendation = read('supabase/functions/growthRecommendation/index.ts');
const trackClickEvent = read('supabase/functions/trackClickEvent/index.ts');

assert.match(
  securityMigration,
  /CREATE OR REPLACE FUNCTION public\.is_teacher\(\)[\s\S]*raw_app_meta_data->>'role' IN \('teacher', 'admin', 'developer'\)[\s\S]*public\.is_mfa_aal2\(\)/,
  'is_teacher() must require app_metadata privileged role and AAL2 for teacher/admin/developer',
);

assert.match(
  authService,
  /return role === 'teacher' \|\| role === 'admin' \|\| role === 'developer';/,
  'frontend MFA gate must treat teacher/admin/developer as privileged',
);

assert.match(
  securityMigration,
  /DROP POLICY IF EXISTS "teachers_read_own_school_oversight"[\s\S]*public\.is_teacher_in_school\(school_id::text\)/,
  'AI oversight policy must use trusted same-school helper',
);

assert.match(
  securityMigration,
  /DROP POLICY IF EXISTS "audit_logs_teacher_select_school"[\s\S]*public\.is_teacher_in_school\(audit_logs\.school_id::text\)/,
  'audit log teacher policy must use trusted same-school helper',
);

assert.match(
  securityMigration,
  /DROP POLICY IF EXISTS "Docenten lezen nulmeting resultaten"[\s\S]*public\.is_teacher_in_school\(\(SELECT u\.school_id::text FROM public\.users u WHERE u\.id = nulmeting_results\.user_id\)\)/,
  'nulmeting teacher read policy must be scoped to the student school',
);

assert.match(
  securityMigration,
  /REVOKE ALL ON FUNCTION public\.consume_edge_rate_limit\(TEXT, INTEGER, INTEGER\) FROM PUBLIC[\s\S]*REVOKE ALL ON FUNCTION public\.consume_edge_rate_limit\(TEXT, INTEGER, INTEGER\) FROM anon, authenticated/,
  'rate-limit RPC must not be executable directly by anon/authenticated clients',
);

assert.doesNotMatch(
  allMigrations,
  /GRANT EXECUTE ON FUNCTION public\.consume_edge_rate_limit\(TEXT, INTEGER, INTEGER\) TO anon, authenticated;\s*(?:\n|$)(?![\s\S]*REVOKE ALL ON FUNCTION public\.consume_edge_rate_limit\(TEXT, INTEGER, INTEGER\) FROM anon, authenticated)/,
  'direct anon/authenticated execute grant for rate-limit RPC must be revoked by a later migration',
);

assert.match(
  rateLimiter,
  /SUPABASE_SERVICE_ROLE_KEY/,
  'durable rate limiter must call the RPC with a server-side service role key',
);

assert.match(chatCore, /ensureAiInteractionConsent/, 'chat endpoints must enforce AI consent in shared validation');
assert.match(consentHelper, /processing_restricted/, 'AI consent helper must enforce processing restriction before provider calls');
assert.match(consentHelper, /"processing_restricted"/, 'AI consent helper must return a processing_restricted error code');
assert.match(chatCore, /MAX_GAME_CONTEXT_LENGTH/, 'chat core must bound gameContext size');
assert.doesNotMatch(chatCore, /roleId === "game-programmeur" \|\| hasGameContext/, 'gameContext alone must not select the expensive code path');
assert.doesNotMatch(chatCore, /50_000/, 'chat core must not allow 50k output tokens from client-controlled context');
assert.match(generateImage, /ensureAiInteractionConsent/, 'generateImage must enforce AI consent server-side');
assert.match(analyzeDrawing, /ensureAiInteractionConsent/, 'analyzeDrawing must enforce AI consent server-side');
assert.match(growthRecommendation, /ensureAiInteractionConsent/, 'growthRecommendation must enforce AI consent/restriction server-side');
assert.match(trackClickEvent, /processing_restricted/, 'analytics tracking must skip authenticated users with processing restriction');

assert.match(
  resetStudentPassword,
  /getTrustedRole\(targetUserData\.user\.app_metadata\) !== 'student'/,
  'password reset must reject legacy admin/developer accounts, including app_metadata.admin=true',
);

console.log(`security-report-core-check passed against ${securityMigrationName}; latest migration is ${migrations.at(-1)}`);
