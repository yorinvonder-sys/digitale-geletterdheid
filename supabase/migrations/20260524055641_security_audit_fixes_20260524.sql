-- ============================================================================
-- Security audit fixes 2026-05-24
-- ============================================================================
-- Fixes:
--   F1: game_permissions direct writes without RLS
--   F2: client-forgeable mission completion evidence
--   F3: teacher XP/badge direct stats mutation
--   F4: audit_logs uid/user_id mismatch for data exports
--
-- The new public RPCs intentionally remain in the public schema for Supabase RPC
-- compatibility, but broad PUBLIC/anon execution is revoked explicitly.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- F1: Lock down game_permissions and expose a guarded teacher/admin RPC.
-- ---------------------------------------------------------------------------

ALTER TABLE public.game_permissions
  ADD COLUMN IF NOT EXISTS year_group smallint DEFAULT 1;

UPDATE public.game_permissions
SET year_group = 1
WHERE year_group IS NULL;

ALTER TABLE public.game_permissions
  ALTER COLUMN year_group SET DEFAULT 1;

ALTER TABLE public.game_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "game_permissions_read_scoped" ON public.game_permissions;
CREATE POLICY "game_permissions_read_scoped"
  ON public.game_permissions
  FOR SELECT
  TO authenticated
  USING (
    school_id IS NULL
    OR school_id = public.get_caller_school_id()
    OR public.is_teacher_in_school(school_id)
  );

REVOKE ALL ON public.game_permissions FROM PUBLIC;
REVOKE ALL ON public.game_permissions FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.game_permissions FROM authenticated;
GRANT SELECT ON public.game_permissions TO authenticated;

CREATE OR REPLACE FUNCTION public.set_game_permissions(
  p_school_id text,
  p_year_group smallint,
  p_permissions jsonb
)
RETURNS public.game_permissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text := public.get_caller_app_role();
  v_target_school_id text := nullif(btrim(p_school_id), '');
  v_year_group smallint := coalesce(p_year_group, 1);
  v_enabled jsonb := coalesce(p_permissions->'enabled_games', '[]'::jsonb);
  v_blocked jsonb := coalesce(p_permissions->'blocked_games', '[]'::jsonb);
  v_custom jsonb := coalesce(p_permissions->'custom_settings', '{}'::jsonb);
  v_normalized jsonb;
  v_row public.game_permissions%ROWTYPE;
  v_id text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF v_year_group < 1 OR v_year_group > 6 THEN
    RAISE EXCEPTION 'Invalid year_group';
  END IF;

  IF v_role IN ('teacher', 'admin', 'developer') AND NOT public.is_mfa_aal2() THEN
    RAISE EXCEPTION 'Unauthorized: privileged game permission updates require MFA';
  END IF;

  IF jsonb_typeof(coalesce(p_permissions, '{}'::jsonb)) <> 'object' THEN
    RAISE EXCEPTION 'Invalid permissions payload';
  END IF;

  IF jsonb_typeof(v_enabled) <> 'array'
     OR jsonb_typeof(v_blocked) <> 'array'
     OR jsonb_typeof(v_custom) <> 'object' THEN
    RAISE EXCEPTION 'Invalid permissions payload';
  END IF;

  IF jsonb_array_length(v_enabled) > 100 OR jsonb_array_length(v_blocked) > 100 THEN
    RAISE EXCEPTION 'Too many permission entries';
  END IF;

  IF pg_column_size(v_custom) > 8192 THEN
    RAISE EXCEPTION 'custom_settings too large';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(v_enabled) AS item(value)
    WHERE item.value !~ '^[a-z0-9][a-z0-9_-]{0,79}$'
  ) OR EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(v_blocked) AS item(value)
    WHERE item.value !~ '^[a-z0-9][a-z0-9_-]{0,79}$'
  ) THEN
    RAISE EXCEPTION 'Invalid game id';
  END IF;

  IF v_target_school_id IS NULL THEN
    IF v_role NOT IN ('admin', 'developer') OR NOT public.is_teacher() THEN
      RAISE EXCEPTION 'Unauthorized: global permissions require admin/developer with MFA';
    END IF;
  ELSIF NOT public.is_teacher_in_school(v_target_school_id) THEN
    RAISE EXCEPTION 'Unauthorized: only same-school privileged users may update game permissions';
  END IF;

  v_id := coalesce(v_target_school_id, 'global') || '-y' || v_year_group::text;
  v_normalized := jsonb_build_object(
    'enabled_games', v_enabled,
    'blocked_games', v_blocked,
    'custom_settings', v_custom
  );

  INSERT INTO public.game_permissions (id, school_id, year_group, data, updated_at)
  VALUES (v_id, v_target_school_id, v_year_group, v_normalized, now())
  ON CONFLICT (id) DO UPDATE
    SET school_id = EXCLUDED.school_id,
        year_group = EXCLUDED.year_group,
        data = EXCLUDED.data,
        updated_at = now()
  RETURNING * INTO v_row;

  INSERT INTO public.audit_logs (action, uid, school_id, data)
  VALUES (
    'game_permissions_updated',
    auth.uid(),
    v_target_school_id,
    jsonb_build_object(
      'permission_id', v_row.id,
      'year_group', v_year_group,
      'enabled_count', jsonb_array_length(v_enabled),
      'blocked_count', jsonb_array_length(v_blocked)
    )
  );

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.set_game_permissions(text, smallint, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_game_permissions(text, smallint, jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.set_game_permissions(text, smallint, jsonb) TO authenticated;

-- ---------------------------------------------------------------------------
-- F2: Only a guarded RPC may write completed mission evidence.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "mission_progress_insert_own" ON public.mission_progress;
DROP POLICY IF EXISTS "mission_progress_owner_insert" ON public.mission_progress;
CREATE POLICY "mission_progress_owner_insert"
  ON public.mission_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status <> 'completed'
    AND (
      school_id IS NULL
      OR school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "mission_progress_update_own" ON public.mission_progress;
DROP POLICY IF EXISTS "mission_progress_owner_update" ON public.mission_progress;
CREATE POLICY "mission_progress_owner_update"
  ON public.mission_progress
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND status <> 'completed'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND status <> 'completed'
    AND (
      school_id IS NULL
      OR school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "mission_progress_delete_own_or_teacher" ON public.mission_progress;
DROP POLICY IF EXISTS "mission_progress_owner_delete" ON public.mission_progress;
CREATE POLICY "mission_progress_owner_delete"
  ON public.mission_progress
  FOR DELETE
  TO authenticated
  USING (
    (auth.uid() = user_id AND status <> 'completed')
    OR public.is_teacher_in_school(school_id)
  );

CREATE OR REPLACE FUNCTION public.complete_mission(
  p_mission_id text,
  p_progress_data jsonb DEFAULT '{}'::jsonb,
  p_score integer DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_school_id text;
  v_current_stats jsonb;
  v_completed jsonb;
  v_new_stats jsonb;
  v_progress jsonb := coalesce(p_progress_data, '{}'::jsonb);
  v_score integer := p_score;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF p_mission_id IS NULL OR p_mission_id !~ '^[a-z0-9][a-z0-9-]{0,99}$' THEN
    RAISE EXCEPTION 'Invalid mission id';
  END IF;

  IF jsonb_typeof(v_progress) <> 'object' OR pg_column_size(v_progress) > 32768 THEN
    RAISE EXCEPTION 'Invalid progress payload';
  END IF;

  IF v_score IS NOT NULL AND (v_score < 0 OR v_score > 100000) THEN
    RAISE EXCEPTION 'Invalid score';
  END IF;

  SELECT school_id, coalesce(stats, '{}'::jsonb)
    INTO v_school_id, v_current_stats
  FROM public.users
  WHERE id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  INSERT INTO public.mission_progress (
    user_id,
    mission_id,
    school_id,
    progress_data,
    status,
    score,
    updated_at
  )
  VALUES (
    v_user_id,
    p_mission_id,
    v_school_id,
    v_progress || jsonb_build_object('completedAt', now()),
    'completed',
    v_score,
    now()
  )
  ON CONFLICT (user_id, mission_id) DO UPDATE
    SET school_id = EXCLUDED.school_id,
        progress_data = public.mission_progress.progress_data || EXCLUDED.progress_data,
        status = 'completed',
        score = coalesce(EXCLUDED.score, public.mission_progress.score),
        updated_at = now();

  v_completed := CASE
    WHEN jsonb_typeof(v_current_stats->'missionsCompleted') = 'array'
      THEN v_current_stats->'missionsCompleted'
    ELSE '[]'::jsonb
  END;
  IF NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(v_completed) AS item(value)
    WHERE item.value = p_mission_id
  ) THEN
    v_completed := v_completed || to_jsonb(p_mission_id);
  END IF;

  v_new_stats := v_current_stats || jsonb_build_object('missionsCompleted', v_completed);

  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET stats = v_new_stats,
      updated_at = now()
  WHERE id = v_user_id;

  PERFORM set_config('app.bypass_stats_protection', 'false', true);

  INSERT INTO public.audit_logs (action, uid, school_id, data)
  VALUES (
    'mission_completed',
    v_user_id,
    v_school_id,
    jsonb_build_object('mission_id', p_mission_id, 'score', v_score)
  );

  RETURN jsonb_build_object(
    'completed', true,
    'missionId', p_mission_id,
    'stats', v_new_stats
  );
END;
$$;

REVOKE ALL ON FUNCTION public.complete_mission(text, jsonb, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.complete_mission(text, jsonb, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.complete_mission(text, jsonb, integer) TO authenticated;

-- Limit generic client stats updates to non-authoritative profile/progress keys.
CREATE OR REPLACE FUNCTION public.update_student_stats(p_stats jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing jsonb;
  v_safe jsonb := '{}'::jsonb;
  v_key text;
  v_allowed_keys text[] := ARRAY[
    'activeMission',
    'avatarConfig',
    'completedIntroWeeks',
    'dailyStreak',
    'educationLevel',
    'hasCompletedAvatarSetup',
    'hasCompletedNulmeting',
    'hasCompletedOnboarding',
    'hasCompletedStudentTutorial',
    'hasCompletedTeacherOnboarding',
    'hasCompletedTeacherTutorial',
    'inventory',
    'lastLoginDate',
    'missionProgress',
    'nulmetingResult',
    'savedOutfits',
    'studentClass',
    'vsoProfile',
    'yearGroup'
  ];
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF p_stats IS NULL OR jsonb_typeof(p_stats) <> 'object' OR pg_column_size(p_stats) > 65536 THEN
    RAISE EXCEPTION 'Invalid stats payload';
  END IF;

  SELECT coalesce(stats, '{}'::jsonb)
    INTO v_existing
  FROM public.users
  WHERE id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  FOREACH v_key IN ARRAY v_allowed_keys LOOP
    IF p_stats ? v_key THEN
      v_safe := v_safe || jsonb_build_object(v_key, p_stats->v_key);
    END IF;
  END LOOP;

  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET stats = v_existing || v_safe,
      last_login = now()
  WHERE id = auth.uid();

  PERFORM set_config('app.bypass_stats_protection', 'false', true);
END;
$$;

REVOKE ALL ON FUNCTION public.update_student_stats(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_student_stats(jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.update_student_stats(jsonb) TO authenticated;

-- ---------------------------------------------------------------------------
-- F3: Block generic teacher stats updates; add audited teacher XP/badge RPCs.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.protect_stats_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF current_setting('app.bypass_stats_protection', true) = 'true' THEN
    RETURN NEW;
  END IF;

  IF OLD.stats IS DISTINCT FROM NEW.stats THEN
    RAISE EXCEPTION 'Direct modification of stats is not allowed. Use the authorized RPC functions.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_student_progress(p_student_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_target_school_id text;
  v_current_stats jsonb;
BEGIN
  IF NOT public.is_teacher() THEN
    RAISE EXCEPTION 'Unauthorized: teacher/admin/developer with MFA required';
  END IF;

  IF public.get_caller_app_role() IN ('teacher', 'admin', 'developer') AND NOT public.is_mfa_aal2() THEN
    RAISE EXCEPTION 'Unauthorized: progress reset requires MFA';
  END IF;

  SELECT school_id, stats
    INTO v_target_school_id, v_current_stats
  FROM public.users
  WHERE id = p_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found: %', p_student_id;
  END IF;

  IF NOT public.is_teacher_in_school(v_target_school_id) THEN
    RAISE EXCEPTION 'Unauthorized: only same-school privileged users may reset progress';
  END IF;

  v_current_stats := coalesce(v_current_stats, '{}'::jsonb)
    || jsonb_build_object(
      'xp', 0,
      'level', 1,
      'missionsCompleted', '[]'::jsonb
    );

  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET stats = v_current_stats
  WHERE id = p_student_id;

  DELETE FROM public.mission_progress
  WHERE user_id = p_student_id;

  PERFORM set_config('app.bypass_stats_protection', 'false', true);

  INSERT INTO public.audit_logs (action, uid, school_id, data)
  VALUES (
    'student_progress_reset',
    auth.uid(),
    v_target_school_id,
    jsonb_build_object('student_id', p_student_id)
  );

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.reset_student_progress(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reset_student_progress(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.reset_student_progress(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.teacher_award_xp(
  p_student_id uuid,
  p_amount integer,
  p_reason text DEFAULT 'teacher_award'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id text;
  v_current_stats jsonb;
  v_current_xp integer;
  v_new_xp integer;
  v_new_level integer;
  v_reason text := left(coalesce(nullif(btrim(p_reason), ''), 'teacher_award'), 120);
BEGIN
  IF NOT public.is_teacher() THEN
    RAISE EXCEPTION 'Unauthorized: teacher/admin/developer with MFA required';
  END IF;

  IF public.get_caller_app_role() IN ('teacher', 'admin', 'developer') AND NOT public.is_mfa_aal2() THEN
    RAISE EXCEPTION 'Unauthorized: awarding XP requires MFA';
  END IF;

  IF p_amount IS NULL OR p_amount < 1 OR p_amount > 25 THEN
    RAISE EXCEPTION 'Invalid XP amount';
  END IF;

  SELECT school_id, coalesce(stats, '{}'::jsonb)
    INTO v_school_id, v_current_stats
  FROM public.users
  WHERE id = p_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found';
  END IF;

  IF NOT public.is_teacher_in_school(v_school_id) THEN
    RAISE EXCEPTION 'Unauthorized: only same-school privileged users may award XP';
  END IF;

  v_current_xp := CASE
    WHEN coalesce(v_current_stats->>'xp', '') ~ '^[0-9]+$'
      THEN (v_current_stats->>'xp')::integer
    ELSE 0
  END;
  v_new_xp := greatest(0, v_current_xp + p_amount);
  v_new_level := public.calculate_level(v_new_xp);

  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET stats = v_current_stats || jsonb_build_object('xp', v_new_xp, 'level', v_new_level),
      updated_at = now()
  WHERE id = p_student_id;

  PERFORM set_config('app.bypass_stats_protection', 'false', true);

  INSERT INTO public.xp_transactions (user_id, amount, source, mission_id)
  VALUES (p_student_id, p_amount, v_reason, NULL);

  INSERT INTO public.audit_logs (action, uid, school_id, data)
  VALUES (
    'teacher_awarded_xp',
    auth.uid(),
    v_school_id,
    jsonb_build_object('student_id', p_student_id, 'amount', p_amount, 'reason', v_reason)
  );

  RETURN jsonb_build_object(
    'awarded', true,
    'newXP', v_new_xp,
    'newLevel', v_new_level,
    'awardedAmount', p_amount
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.teacher_award_badge(
  p_student_id uuid,
  p_badge_id text,
  p_reason text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id text;
  v_current_stats jsonb;
  v_badges jsonb;
  v_badge_id text := lower(btrim(p_badge_id));
BEGIN
  IF NOT public.is_teacher() THEN
    RAISE EXCEPTION 'Unauthorized: teacher/admin/developer with MFA required';
  END IF;

  IF public.get_caller_app_role() IN ('teacher', 'admin', 'developer') AND NOT public.is_mfa_aal2() THEN
    RAISE EXCEPTION 'Unauthorized: awarding badges requires MFA';
  END IF;

  IF v_badge_id IS NULL OR v_badge_id !~ '^[a-z0-9][a-z0-9_-]{0,63}$' THEN
    RAISE EXCEPTION 'Invalid badge id';
  END IF;

  SELECT school_id, coalesce(stats, '{}'::jsonb)
    INTO v_school_id, v_current_stats
  FROM public.users
  WHERE id = p_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found';
  END IF;

  IF NOT public.is_teacher_in_school(v_school_id) THEN
    RAISE EXCEPTION 'Unauthorized: only same-school privileged users may award badges';
  END IF;

  v_badges := CASE
    WHEN jsonb_typeof(v_current_stats->'badges') = 'array'
      THEN v_current_stats->'badges'
    ELSE '[]'::jsonb
  END;
  IF NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(v_badges) AS item(value)
    WHERE item.value = v_badge_id
  ) THEN
    v_badges := v_badges || to_jsonb(v_badge_id);
  END IF;

  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET stats = v_current_stats || jsonb_build_object('badges', v_badges),
      updated_at = now()
  WHERE id = p_student_id;

  PERFORM set_config('app.bypass_stats_protection', 'false', true);

  INSERT INTO public.audit_logs (action, uid, school_id, data)
  VALUES (
    'teacher_awarded_badge',
    auth.uid(),
    v_school_id,
    jsonb_build_object(
      'student_id', p_student_id,
      'badge_id', v_badge_id,
      'reason', left(coalesce(p_reason, ''), 240)
    )
  );

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.teacher_award_xp(uuid, integer, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.teacher_award_xp(uuid, integer, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.teacher_award_xp(uuid, integer, text) TO authenticated;

REVOKE ALL ON FUNCTION public.teacher_award_badge(uuid, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.teacher_award_badge(uuid, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.teacher_award_badge(uuid, text, text) TO authenticated;

-- ---------------------------------------------------------------------------
-- F4: Keep audit log access compatible with the live uid-only audit schema.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "audit_logs_student_select_own" ON public.audit_logs;
CREATE POLICY "audit_logs_student_select_own"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (uid::text = auth.uid()::text);

DROP POLICY IF EXISTS "audit_logs_insert_own" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_own"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (uid::text = auth.uid()::text);
