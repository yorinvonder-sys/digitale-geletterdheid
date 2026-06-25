import { readFileSync, readdirSync } from 'node:fs';

const failures = [];
const read = (path) => readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const latestRestrictionMigration = readdirSync('supabase/migrations')
  .filter((name) => name.endsWith('_enforce_processing_restriction.sql'))
  .sort()
  .at(-1);

assert(Boolean(latestRestrictionMigration), 'Missing enforce_processing_restriction migration.');

const migration = latestRestrictionMigration
  ? read(`supabase/migrations/${latestRestrictionMigration}`)
  : '';
const consentHelper = read('supabase/functions/_shared/consent.ts');
const chatCore = read('supabase/functions/_shared/chatCore.ts');
const generateImage = read('supabase/functions/generateImage/index.ts');
const analyzeDrawing = read('supabase/functions/analyzeDrawing/index.ts');
const growthRecommendation = read('supabase/functions/growthRecommendation/index.ts');
const trackClickEvent = read('supabase/functions/trackClickEvent/index.ts');
const aiProviderService = read('src/services/aiProviderService.ts');
const growthRecommendationService = read('src/services/growthRecommendationService.ts');
const rlsCheck = read('scripts/check-rls-functions.mjs');

assert(consentHelper.includes('ensureProcessingNotRestricted'), 'AI consent helper must expose processing restriction check.');
assert(consentHelper.includes('processing_restricted'), 'AI consent helper must read processing_restricted.');
assert(consentHelper.includes('"processing_restricted"'), 'AI consent helper must return processing_restricted error code.');
assert(consentHelper.includes('Verwerking is beperkt voor dit account.'), 'AI consent helper must return clear restriction reason.');

for (const [name, source] of [
  ['chatCore', chatCore],
  ['generateImage', generateImage],
  ['analyzeDrawing', analyzeDrawing],
  ['growthRecommendation', growthRecommendation],
]) {
  assert(source.includes('ensureAiInteractionConsent'), `${name} must enforce AI consent/restriction server-side.`);
}

assert(trackClickEvent.includes('isProcessingRestricted'), 'trackClickEvent must check processing restriction server-side.');
assert(trackClickEvent.includes("reason: 'processing_restricted'"), 'trackClickEvent must skip restricted authenticated analytics.');
assert(trackClickEvent.indexOf('await isProcessingRestricted') < trackClickEvent.indexOf('const rateLimitKey'), 'analytics restriction check must happen before rate limiting/inserts.');

assert(migration.includes('public.current_user_processing_restricted()'), 'Migration must create current_user_processing_restricted helper.');
assert(migration.includes('REVOKE ALL ON FUNCTION public.current_user_processing_restricted() FROM PUBLIC'), 'Restriction helper must revoke PUBLIC execute.');
assert(migration.includes('NOT public.current_user_processing_restricted()'), 'RLS policies must block restricted writes.');

for (const policyName of [
  'mission_progress_insert_own',
  'mission_progress_update_own',
  'Users submit own feedback',
  'library_items_owner_insert',
  'shared_games_owner_insert',
  'shared_projects_owner_insert',
  'Leerlingen maken eigen nulmeting',
  'Leerlingen maken eigen assessment',
]) {
  assert(migration.includes(policyName), `Migration must harden ${policyName}.`);
}

for (const legacyPolicyName of [
  'mission_progress_owner_insert',
  'mission_progress_owner_update',
]) {
  assert(
    migration.includes(`DROP POLICY IF EXISTS "${legacyPolicyName}"`),
    `Migration must drop legacy permissive ${legacyPolicyName}.`,
  );
}

assert(aiProviderService.includes('Verwerking is beperkt voor dit account. Neem contact op met je schoolbeheerder of FG.'), 'AI client UX must show processing restriction message.');
assert(growthRecommendationService.includes('processing_restricted'), 'Growth recommendation client must surface processing restriction.');

for (const testName of [
  'restricted_student_reads_own_restriction_status',
  'restricted_student_cannot_insert_mission_progress',
  'restricted_student_cannot_update_mission_progress',
  'restricted_student_cannot_insert_feedback',
  'restricted_student_cannot_insert_nulmeting',
  'restricted_student_cannot_insert_growth_recommendation',
  'processing_restriction_helper_not_public',
]) {
  assert(rlsCheck.includes(testName), `RLS function check missing ${testName}.`);
}

if (failures.length) {
  console.error(`Processing restriction enforcement check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Processing restriction enforcement check passed');
