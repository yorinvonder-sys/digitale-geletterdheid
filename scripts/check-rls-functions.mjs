import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';

const dbContainer = findSupabaseDbContainer();
const processingRestrictionMigration = findLatestProcessingRestrictionMigration();
const processingRestrictionSql = readFileSync(processingRestrictionMigration, 'utf8');

const sql = String.raw`
\set ON_ERROR_STOP on
\pset format unaligned
\pset tuples_only on
\pset fieldsep ' | '

BEGIN;

${processingRestrictionSql}

CREATE TEMP TABLE rls_function_test_results (
  test_name text PRIMARY KEY,
  passed boolean NOT NULL,
  detail text NOT NULL
) ON COMMIT DROP;

GRANT SELECT, INSERT, UPDATE, DELETE ON rls_function_test_results TO authenticated, anon, service_role;

CREATE TEMP TABLE rls_policy_snapshot AS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';

CREATE TEMP TABLE rls_grant_snapshot AS
SELECT
  n.nspname AS schema_name,
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS args,
  has_function_privilege('anon', p.oid, 'execute') AS anon_execute,
  has_function_privilege('authenticated', p.oid, 'execute') AS authenticated_execute,
  has_function_privilege('service_role', p.oid, 'execute') AS service_role_execute
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'consume_edge_rate_limit',
    'trigger_gdrive_backup',
    'has_student_consent',
    'is_teacher',
    'is_teacher_in_school',
    'get_caller_app_role',
    'get_caller_school_id',
    'current_user_processing_restricted'
  );

DELETE FROM public.users
WHERE id IN (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000006'
);

DELETE FROM auth.users
WHERE id IN (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000006'
);

INSERT INTO auth.users (
  id,
  aud,
  role,
  email,
  raw_app_meta_data,
  raw_user_meta_data,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES
  ('00000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'rls-student-a@example.test', '{"role":"student","schoolId":"school-a"}', '{}', now(), now(), now()),
  ('00000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'rls-student-b@example.test', '{"role":"student","schoolId":"school-b"}', '{}', now(), now(), now()),
  ('00000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'rls-teacher-a@example.test', '{"role":"teacher","schoolId":"school-a"}', '{}', now(), now(), now()),
  ('00000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'rls-teacher-b@example.test', '{"role":"teacher","schoolId":"school-b"}', '{}', now(), now(), now()),
  ('00000000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'rls-legacy-admin@example.test', '{"admin":"true","schoolId":"school-a"}', '{}', now(), now(), now()),
  ('00000000-0000-4000-8000-000000000006', 'authenticated', 'authenticated', 'rls-user-meta-spoof@example.test', '{"role":"student","schoolId":"school-a"}', '{"role":"teacher"}', now(), now(), now());

INSERT INTO public.users (
  id,
  uid,
  email,
  display_name,
  role,
  school_id,
  student_class,
  stats
) VALUES
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'rls-student-a@example.test', 'Student A', 'student', 'school-a', 'A1', '{"xp":0}'::jsonb),
  ('00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', 'rls-student-b@example.test', 'Student B', 'student', 'school-b', 'B1', '{"xp":0}'::jsonb),
  ('00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000003', 'rls-teacher-a@example.test', 'Teacher A', 'teacher', 'school-a', null, '{"xp":0}'::jsonb),
  ('00000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000004', 'rls-teacher-b@example.test', 'Teacher B', 'teacher', 'school-b', null, '{"xp":0}'::jsonb),
  ('00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000005', 'rls-legacy-admin@example.test', 'Legacy Admin', 'admin', 'school-a', null, '{"xp":0}'::jsonb),
  ('00000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000006', 'rls-user-meta-spoof@example.test', 'Spoofed Student', 'student', 'school-a', 'A1', '{"xp":0}'::jsonb);

UPDATE public.users
SET processing_restricted = true,
    processing_restricted_at = now(),
    processing_restricted_reason = 'rls_function_test'
WHERE id = '00000000-0000-4000-8000-000000000002';

INSERT INTO public.student_consents (
  student_id,
  school_id,
  consent_type,
  granted,
  granted_by,
  granted_at,
  consent_version
) VALUES
  ('00000000-0000-4000-8000-000000000001', 'school-a', 'ai_interaction', true, 'parent', now(), '1.0'),
  ('00000000-0000-4000-8000-000000000002', 'school-b', 'ai_interaction', false, 'parent', now(), '1.0');

INSERT INTO public.mission_progress (user_id, mission_id, school_id, progress_data, status)
VALUES (
  '00000000-0000-4000-8000-000000000002',
  'restricted-existing',
  'school-b',
  '{"step":1}'::jsonb,
  'in_progress'
)
ON CONFLICT (user_id, mission_id)
DO UPDATE SET progress_data = EXCLUDED.progress_data, status = EXCLUDED.status;

SET LOCAL ROLE authenticated;

SET LOCAL request.jwt.claim.sub = '00000000-0000-4000-8000-000000000003';
SET LOCAL request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000003","role":"authenticated","aal":"aal1"}';
INSERT INTO rls_function_test_results
SELECT
  'teacher_aal1_is_not_privileged',
  public.is_mfa_aal2() = false AND public.is_teacher() = false,
  'teacher with aal1 should fail MFA-gated helper';

SET LOCAL request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000003","role":"authenticated","aal":"aal2"}';
INSERT INTO rls_function_test_results
SELECT
  'teacher_aal2_same_school_only',
  public.is_mfa_aal2() = true
    AND public.is_teacher() = true
    AND public.is_teacher_in_school('school-a') = true
    AND public.is_teacher_in_school('school-b') = false,
  'teacher with aal2 should only pass for own school';

SET LOCAL request.jwt.claim.sub = '00000000-0000-4000-8000-000000000006';
SET LOCAL request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000006","role":"authenticated","aal":"aal2"}';
INSERT INTO rls_function_test_results
SELECT
  'user_metadata_role_spoof_is_ignored',
  public.get_caller_app_role() = 'student' AND public.is_teacher() = false,
  'raw_user_meta_data role=teacher must not grant teacher privileges';

SET LOCAL request.jwt.claim.sub = '00000000-0000-4000-8000-000000000005';
SET LOCAL request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000005","role":"authenticated","aal":"aal2"}';
INSERT INTO rls_function_test_results
SELECT
  'legacy_admin_requires_aal2',
  public.get_caller_app_role() = 'admin'
    AND public.is_teacher() = true
    AND public.is_teacher_in_school('school-a') = true,
  'legacy app_metadata.admin=true is admin only when aal2 is present';

SET LOCAL request.jwt.claim.sub = '00000000-0000-4000-8000-000000000003';
SET LOCAL request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000003","role":"authenticated","aal":"aal2"}';
INSERT INTO rls_function_test_results
SELECT
  'teacher_reads_same_school_user_only',
  (
    SELECT count(*)
    FROM public.users
    WHERE id IN (
      '00000000-0000-4000-8000-000000000001',
      '00000000-0000-4000-8000-000000000002'
    )
  ) = 1,
  'teacher A should see student A, not student B';

WITH updated AS (
  UPDATE public.users
  SET display_name = 'Teacher A updated Student A'
  WHERE id = '00000000-0000-4000-8000-000000000001'
  RETURNING id
)
INSERT INTO rls_function_test_results
SELECT
  'teacher_updates_same_school_user',
  (SELECT count(*) FROM updated) = 1,
  'teacher A should update student A';

WITH updated AS (
  UPDATE public.users
  SET display_name = 'Cross-school update should not happen'
  WHERE id = '00000000-0000-4000-8000-000000000002'
  RETURNING id
)
INSERT INTO rls_function_test_results
SELECT
  'teacher_cannot_update_cross_school_user',
  (SELECT count(*) FROM updated) = 0,
  'teacher A should not update student B';

SET LOCAL request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
SET LOCAL request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated","aal":"aal1"}';
WITH attempted AS (
  UPDATE public.users
  SET role = 'developer',
      school_id = 'school-b'
  WHERE id = '00000000-0000-4000-8000-000000000001'
  RETURNING role, school_id
)
INSERT INTO rls_function_test_results
SELECT
  'student_self_promotion_is_rewritten',
  EXISTS (
    SELECT 1
    FROM attempted
    WHERE role = 'student'
      AND school_id = 'school-a'
  ),
  'student update should not alter role or school_id';

DO $stats_block$
DECLARE
  v_blocked boolean := false;
BEGIN
  BEGIN
    UPDATE public.users
    SET stats = '{"xp":9999}'::jsonb
    WHERE id = '00000000-0000-4000-8000-000000000001';
  EXCEPTION WHEN others THEN
    v_blocked := SQLERRM LIKE '%Direct modification of stats is not allowed%';
  END;

  INSERT INTO rls_function_test_results(test_name, passed, detail)
  VALUES (
    'student_direct_stats_update_is_blocked',
    v_blocked,
    'student direct stats update should raise the existing stats protection error'
  );
END;
$stats_block$;

INSERT INTO rls_function_test_results
SELECT
  'student_consent_helper_accepts_only_active_grant',
  public.has_student_consent('00000000-0000-4000-8000-000000000001', 'ai_interaction', '1.0') = true
    AND public.has_student_consent('00000000-0000-4000-8000-000000000002', 'ai_interaction', '1.0') = false
    AND public.has_student_consent('00000000-0000-4000-8000-000000000001', 'ai_interaction', '2.0') = false,
  'AI consent helper should require granted=true, not revoked, matching version';

INSERT INTO rls_function_test_results
SELECT
  'student_a_processing_restriction_helper_false',
  public.current_user_processing_restricted() = false,
  'unrestricted student should not be marked processing restricted';

SET LOCAL request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002';
SET LOCAL request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated","aal":"aal1"}';

INSERT INTO rls_function_test_results
SELECT
  'restricted_student_reads_own_restriction_status',
  public.current_user_processing_restricted() = true
    AND EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = '00000000-0000-4000-8000-000000000002'
        AND processing_restricted = true
    ),
  'restricted student should still read own profile/restriction status';

DO $restriction_write_block$
DECLARE
  v_mission_insert_blocked boolean := false;
  v_mission_update_blocked boolean := false;
  v_feedback_insert_blocked boolean := false;
  v_nulmeting_insert_blocked boolean := false;
  v_growth_insert_blocked boolean := false;
  v_update_rows integer := 0;
BEGIN
  BEGIN
    INSERT INTO public.mission_progress (user_id, mission_id, school_id, progress_data, status)
    VALUES (
      '00000000-0000-4000-8000-000000000002',
      'restricted-new',
      'school-b',
      '{}'::jsonb,
      'in_progress'
    );
  EXCEPTION
    WHEN insufficient_privilege OR check_violation THEN
      v_mission_insert_blocked := true;
  END;

  BEGIN
    UPDATE public.mission_progress
    SET progress_data = '{"step":2}'::jsonb
    WHERE user_id = '00000000-0000-4000-8000-000000000002'
      AND mission_id = 'restricted-existing';

    GET DIAGNOSTICS v_update_rows = ROW_COUNT;
    v_mission_update_blocked := v_update_rows = 0;
  EXCEPTION
    WHEN insufficient_privilege OR check_violation THEN
      v_mission_update_blocked := true;
  END;

  BEGIN
    INSERT INTO public.feedback (user_id, user_name, user_class, school_id, message)
    VALUES (
      '00000000-0000-4000-8000-000000000002',
      'Student B',
      'B1',
      'school-b',
      'restricted feedback should not persist'
    );
  EXCEPTION
    WHEN insufficient_privilege OR check_violation THEN
      v_feedback_insert_blocked := true;
  END;

  BEGIN
    INSERT INTO public.nulmeting_results (
      user_id,
      overall_score,
      niveau,
      total_time_seconds,
      score_digitale_systemen,
      score_media_en_ai,
      score_programmeren,
      score_veiligheid_privacy,
      score_welzijn_maatschappij
    )
    VALUES (
      '00000000-0000-4000-8000-000000000002',
      50,
      'basis',
      300,
      50,
      50,
      50,
      50,
      50
    );
  EXCEPTION
    WHEN insufficient_privilege OR check_violation THEN
      v_nulmeting_insert_blocked := true;
  END;

  BEGIN
    INSERT INTO public.growth_recommendations (
      user_id,
      school_year,
      school_id,
      recommendation_text,
      focus_domains,
      input_context,
      model_version
    )
    VALUES (
      '00000000-0000-4000-8000-000000000002',
      2026,
      'school-b',
      'restricted recommendation should not persist',
      ARRAY['mediaEnAI'],
      '{}'::jsonb,
      'test-model'
    );
  EXCEPTION
    WHEN insufficient_privilege OR check_violation THEN
      v_growth_insert_blocked := true;
  END;

  INSERT INTO rls_function_test_results(test_name, passed, detail)
  VALUES
    (
      'restricted_student_cannot_insert_mission_progress',
      v_mission_insert_blocked
        AND NOT EXISTS (
          SELECT 1 FROM public.mission_progress
          WHERE user_id = '00000000-0000-4000-8000-000000000002'
            AND mission_id = 'restricted-new'
        ),
      'restricted student should not create new mission progress'
    ),
    (
      'restricted_student_cannot_update_mission_progress',
      v_mission_update_blocked
        AND EXISTS (
          SELECT 1 FROM public.mission_progress
          WHERE user_id = '00000000-0000-4000-8000-000000000002'
            AND mission_id = 'restricted-existing'
            AND progress_data = '{"step":1}'::jsonb
        ),
      'restricted student should not update existing mission progress'
    ),
    (
      'restricted_student_cannot_insert_feedback',
      v_feedback_insert_blocked,
      'restricted student should not submit new feedback'
    ),
    (
      'restricted_student_cannot_insert_nulmeting',
      v_nulmeting_insert_blocked,
      'restricted student should not create a new nulmeting result'
    ),
    (
      'restricted_student_cannot_insert_growth_recommendation',
      v_growth_insert_blocked,
      'restricted student should not create a growth recommendation directly'
    );
END;
$restriction_write_block$;

RESET ROLE;

INSERT INTO rls_function_test_results
SELECT
  'processing_restriction_helper_not_public',
  has_function_privilege('anon', 'public.current_user_processing_restricted()', 'execute') = false
    AND has_function_privilege('authenticated', 'public.current_user_processing_restricted()', 'execute') = true
    AND has_function_privilege('service_role', 'public.current_user_processing_restricted()', 'execute') = true,
  'processing restriction helper should not be callable by anon';

INSERT INTO rls_function_test_results
SELECT
  'rate_limit_rpc_not_public',
  has_function_privilege('anon', 'public.consume_edge_rate_limit(text, integer, integer)', 'execute') = false
    AND has_function_privilege('authenticated', 'public.consume_edge_rate_limit(text, integer, integer)', 'execute') = false
    AND has_function_privilege('service_role', 'public.consume_edge_rate_limit(text, integer, integer)', 'execute') = true,
  'durable rate limiter should only be callable with service_role';

INSERT INTO rls_function_test_results
SELECT
  'gdrive_trigger_not_public',
  has_function_privilege('anon', 'public.trigger_gdrive_backup()', 'execute') = false
    AND has_function_privilege('authenticated', 'public.trigger_gdrive_backup()', 'execute') = false
    AND has_function_privilege('service_role', 'public.trigger_gdrive_backup()', 'execute') = true,
  'Drive backup trigger should not be callable through public RPC';

INSERT INTO rls_function_test_results
SELECT
  'policies_unchanged_by_test',
  NOT EXISTS (
    (
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies
      WHERE schemaname = 'public'
    )
    EXCEPT
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    FROM rls_policy_snapshot
  )
  AND NOT EXISTS (
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    FROM rls_policy_snapshot
    EXCEPT
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
  ),
  'test should not create, drop, or rewrite policies';

INSERT INTO rls_function_test_results
SELECT
  'tracked_function_grants_unchanged_by_test',
  NOT EXISTS (
    (
      SELECT
        n.nspname,
        p.proname,
        pg_get_function_identity_arguments(p.oid),
        has_function_privilege('anon', p.oid, 'execute'),
        has_function_privilege('authenticated', p.oid, 'execute'),
        has_function_privilege('service_role', p.oid, 'execute')
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public'
        AND p.proname IN (
          'consume_edge_rate_limit',
          'trigger_gdrive_backup',
          'has_student_consent',
          'is_teacher',
          'is_teacher_in_school',
          'get_caller_app_role',
          'get_caller_school_id',
          'current_user_processing_restricted'
        )
    )
    EXCEPT
    SELECT schema_name, function_name, args, anon_execute, authenticated_execute, service_role_execute
    FROM rls_grant_snapshot
  )
  AND NOT EXISTS (
    SELECT schema_name, function_name, args, anon_execute, authenticated_execute, service_role_execute
    FROM rls_grant_snapshot
    EXCEPT
    SELECT
      n.nspname,
      p.proname,
      pg_get_function_identity_arguments(p.oid),
      has_function_privilege('anon', p.oid, 'execute'),
      has_function_privilege('authenticated', p.oid, 'execute'),
      has_function_privilege('service_role', p.oid, 'execute')
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'consume_edge_rate_limit',
        'trigger_gdrive_backup',
        'has_student_consent',
        'is_teacher',
        'is_teacher_in_school',
        'get_caller_app_role',
        'get_caller_school_id',
        'current_user_processing_restricted'
      )
  ),
  'test should not alter tracked function grants';

SELECT
  CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END,
  test_name,
  detail
FROM rls_function_test_results
ORDER BY test_name;

ROLLBACK;
`;

const result = spawnSync('docker', [
  'exec',
  '-i',
  dbContainer,
  'psql',
  '-U',
  'postgres',
  '-d',
  'postgres',
  '-v',
  'ON_ERROR_STOP=1',
  '-X',
  '-q',
], {
  input: sql,
  encoding: 'utf8',
});

if (result.error) {
  throw result.error;
}

if (result.stderr) {
  const relevantStderr = result.stderr
    .split('\n')
    .filter((line) => line.trim() && !line.includes('could not change directory'))
    .join('\n');
  if (relevantStderr) {
    process.stderr.write(`${relevantStderr}\n`);
  }
}

process.stdout.write(result.stdout);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const failed = result.stdout
  .split('\n')
  .some((line) => line.startsWith('FAIL | '));

if (failed) {
  process.exit(1);
}

console.log('RLS function checks passed; transaction rolled back.');

function findSupabaseDbContainer() {
  const requestedContainer = process.env.RLS_DB_CONTAINER?.trim();
  const ps = spawnSync('docker', [
    'ps',
    '--format',
    '{{.Names}}',
    '--filter',
    'name=supabase_db_',
  ], {
    encoding: 'utf8',
  });

  if (ps.error) {
    throw ps.error;
  }

  if (ps.status !== 0) {
    throw new Error(ps.stderr || 'Could not list Docker containers.');
  }

  const containers = ps.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (requestedContainer) {
    if (containers.includes(requestedContainer)) {
      return requestedContainer;
    }
    throw new Error(`Requested RLS_DB_CONTAINER=${requestedContainer} is not running.`);
  }

  const exact = containers.find((name) => name === 'supabase_db_ai-lab---future-architect');
  const container = exact ?? containers[0];

  if (!container) {
    throw new Error('No running Supabase database container found. Start local Supabase first with `npx supabase start`.');
  }

  return container;
}

function findLatestProcessingRestrictionMigration() {
  const migration = readdirSync('supabase/migrations')
    .filter((name) => name.endsWith('_enforce_processing_restriction.sql'))
    .sort()
    .at(-1);

  if (!migration) {
    throw new Error('Missing enforce_processing_restriction migration.');
  }

  return `supabase/migrations/${migration}`;
}
