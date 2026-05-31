-- ============================================================================
-- Harden SECURITY DEFINER execute grants
-- ============================================================================
-- Supabase advisors flag SECURITY DEFINER functions that are executable through
-- broad PUBLIC/anon/authenticated grants. This migration makes the grant matrix
-- explicit:
--   - revoke broad PUBLIC and anon execution from all current SECURITY DEFINER
--     functions in public;
--   - re-grant authenticated only for RPC/helpers that are intentionally used by
--     the app or RLS policies and already enforce their own auth/school checks;
--   - keep service_role/postgres-only functions private to server/cron contexts.
--
-- The MFA trust RPCs are also self-bound here because they accept a user id.
-- ============================================================================

-- MFA trust functions: direct RPC calls may only act for the current user.
CREATE OR REPLACE FUNCTION public.has_mfa_trust(
  p_user_id uuid,
  p_ip_hash text,
  p_user_agent_hash text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id
     AND coalesce(current_setting('role', true), '') <> 'service_role' THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.mfa_trusted_sessions
    WHERE user_id = p_user_id
      AND ip_hash = p_ip_hash
      AND expires_at > now()
      AND (
        user_agent_hash IS NULL
        OR p_user_agent_hash IS NULL
        OR user_agent_hash = p_user_agent_hash
      )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.create_mfa_trust(
  p_user_id uuid,
  p_ip_hash text,
  p_user_agent_hash text DEFAULT NULL,
  p_duration_minutes integer DEFAULT 30
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id uuid;
  v_count integer;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id
     AND coalesce(current_setting('role', true), '') <> 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  DELETE FROM public.mfa_trusted_sessions
  WHERE user_id = p_user_id
    AND expires_at <= now();

  SELECT count(*) INTO v_count
  FROM public.mfa_trusted_sessions
  WHERE user_id = p_user_id;

  IF v_count >= 5 THEN
    DELETE FROM public.mfa_trusted_sessions
    WHERE id = (
      SELECT id
      FROM public.mfa_trusted_sessions
      WHERE user_id = p_user_id
      ORDER BY created_at ASC
      LIMIT 1
    );
  END IF;

  DELETE FROM public.mfa_trusted_sessions
  WHERE user_id = p_user_id
    AND ip_hash = p_ip_hash
    AND coalesce(user_agent_hash, '') = coalesce(p_user_agent_hash, '');

  INSERT INTO public.mfa_trusted_sessions (user_id, ip_hash, expires_at, user_agent_hash)
  VALUES (
    p_user_id,
    p_ip_hash,
    now() + (p_duration_minutes || ' minutes')::interval,
    p_user_agent_hash
  )
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_all_mfa_trust(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id
     AND coalesce(current_setting('role', true), '') <> 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  DELETE FROM public.mfa_trusted_sessions WHERE user_id = p_user_id;
END;
$$;

-- Consent helpers: authenticated callers may inspect their own consent state.
-- Same-school teachers can inspect their students through the usual MFA helper.
CREATE OR REPLACE FUNCTION public.has_student_consent(
  p_student_id uuid,
  p_consent_type text,
  p_consent_version text DEFAULT '1.0'
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id text;
BEGIN
  SELECT school_id
    INTO v_school_id
  FROM public.student_consents
  WHERE student_id = p_student_id
  LIMIT 1;

  IF auth.uid() IS DISTINCT FROM p_student_id
     AND coalesce(current_setting('role', true), '') <> 'service_role'
     AND NOT public.is_teacher_in_school(v_school_id) THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.student_consents sc
    WHERE sc.student_id = p_student_id
      AND sc.consent_type = p_consent_type
      AND sc.granted = true
      AND sc.revoked_at IS NULL
      AND sc.consent_version = p_consent_version
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.student_requires_parental_consent(p_student_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_year_group smallint;
  v_school_id text;
BEGIN
  IF p_student_id IS NULL THEN
    RETURN true;
  END IF;

  SELECT year_group, school_id
    INTO v_year_group, v_school_id
  FROM public.users
  WHERE id = p_student_id;

  IF v_year_group IS NULL THEN
    RETURN true;
  END IF;

  IF auth.uid() IS DISTINCT FROM p_student_id
     AND coalesce(current_setting('role', true), '') <> 'service_role'
     AND NOT public.is_teacher_in_school(v_school_id) THEN
    RETURN true;
  END IF;

  RETURN v_year_group <= 4;
END;
$$;

-- First remove broad/default execution. PUBLIC is the Postgres pseudo-role.
-- Use to_regprocedure so an out-of-sync local database can still validate this
-- migration without requiring every later production function to exist locally.
DO $grant_matrix$
DECLARE
  v_signature text;
  v_all text[] := ARRAY[
    'public.atomic_toggle_like(uuid, text)',
    'public.award_xp(uuid, integer, text, text)',
    'public.can_access_shared_game(uuid)',
    'public.check_xp_rate_limit(text, integer)',
    'public.check_xp_rate_limit(uuid, integer)',
    'public.cleanup_expired_mfa_sessions()',
    'public.cleanup_old_audit_logs()',
    'public.consume_edge_rate_limit(text, integer, integer)',
    'public.create_mfa_trust(uuid, text, text, integer)',
    'public.delete_student(uuid)',
    'public.get_caller_app_role()',
    'public.get_caller_school_id()',
    'public.get_data_for_data_round_stats()',
    'public.get_my_role()',
    'public.get_my_school_id()',
    'public.get_next_invoice_number(uuid, integer)',
    'public.get_random_peer_for_review(text)',
    'public.has_mfa_trust(uuid, text, text)',
    'public.has_student_consent(uuid, text, text)',
    'public.increment_play_count(uuid)',
    'public.is_branding_admin()',
    'public.is_developer()',
    'public.is_teacher()',
    'public.is_teacher_in_school(text)',
    'public.log_school_branding_change()',
    'public.log_wellbeing_alert(text, text, timestamptz)',
    'public.override_student_step(uuid, text, integer, text, text)',
    'public.protect_users_sensitive_profile_columns()',
    'public.record_shared_game_score(uuid, integer)',
    'public.reset_student_progress(uuid)',
    'public.review_growth_recommendation(uuid, boolean, text)',
    'public.revoke_all_mfa_trust(uuid)',
    'public.set_own_consent(text, boolean, text)',
    'public.student_requires_parental_consent(uuid)',
    'public.submit_data_for_data_answers(jsonb, text)',
    'public.submit_peer_feedback(text, uuid, text, integer, jsonb)',
    'public.trigger_gdrive_backup()',
    'public.update_student_stats(jsonb)',
    'public.vote_peer_feedback_helpful(uuid, boolean)'
  ];
  v_authenticated text[] := ARRAY[
    'public.atomic_toggle_like(uuid, text)',
    'public.award_xp(uuid, integer, text, text)',
    'public.can_access_shared_game(uuid)',
    'public.check_xp_rate_limit(uuid, integer)',
    'public.create_mfa_trust(uuid, text, text, integer)',
    'public.delete_student(uuid)',
    'public.get_caller_app_role()',
    'public.get_caller_school_id()',
    'public.get_data_for_data_round_stats()',
    'public.get_my_role()',
    'public.get_my_school_id()',
    'public.get_next_invoice_number(uuid, integer)',
    'public.get_random_peer_for_review(text)',
    'public.has_mfa_trust(uuid, text, text)',
    'public.has_student_consent(uuid, text, text)',
    'public.increment_play_count(uuid)',
    'public.is_branding_admin()',
    'public.is_developer()',
    'public.is_teacher()',
    'public.is_teacher_in_school(text)',
    'public.log_wellbeing_alert(text, text, timestamptz)',
    'public.override_student_step(uuid, text, integer, text, text)',
    'public.record_shared_game_score(uuid, integer)',
    'public.reset_student_progress(uuid)',
    'public.review_growth_recommendation(uuid, boolean, text)',
    'public.revoke_all_mfa_trust(uuid)',
    'public.set_own_consent(text, boolean, text)',
    'public.student_requires_parental_consent(uuid)',
    'public.submit_data_for_data_answers(jsonb, text)',
    'public.submit_peer_feedback(text, uuid, text, integer, jsonb)',
    'public.update_student_stats(jsonb)',
    'public.vote_peer_feedback_helpful(uuid, boolean)'
  ];
  v_service_role text[] := ARRAY[
    'public.cleanup_expired_mfa_sessions()',
    'public.cleanup_old_audit_logs()',
    'public.check_xp_rate_limit(text, integer)',
    'public.consume_edge_rate_limit(text, integer, integer)',
    'public.has_student_consent(uuid, text, text)',
    'public.revoke_all_mfa_trust(uuid)',
    'public.trigger_gdrive_backup()'
  ];
  v_postgres text[] := ARRAY[
    'public.cleanup_expired_mfa_sessions()',
    'public.cleanup_old_audit_logs()',
    'public.trigger_gdrive_backup()'
  ];
BEGIN
  FOREACH v_signature IN ARRAY v_all LOOP
    IF to_regprocedure(v_signature) IS NOT NULL THEN
      EXECUTE 'REVOKE ALL ON FUNCTION ' || v_signature || ' FROM PUBLIC, anon, authenticated';
    END IF;
  END LOOP;

  -- Intentional authenticated RPCs and RLS helpers. These functions contain
  -- internal auth.uid(), MFA, school-scope, owner, or argument validation.
  FOREACH v_signature IN ARRAY v_authenticated LOOP
    IF to_regprocedure(v_signature) IS NOT NULL THEN
      EXECUTE 'GRANT EXECUTE ON FUNCTION ' || v_signature || ' TO authenticated';
    END IF;
  END LOOP;

  -- Server/cron-only functions.
  FOREACH v_signature IN ARRAY v_service_role LOOP
    IF to_regprocedure(v_signature) IS NOT NULL THEN
      EXECUTE 'GRANT EXECUTE ON FUNCTION ' || v_signature || ' TO service_role';
    END IF;
  END LOOP;

  FOREACH v_signature IN ARRAY v_postgres LOOP
    IF to_regprocedure(v_signature) IS NOT NULL THEN
      EXECUTE 'GRANT EXECUTE ON FUNCTION ' || v_signature || ' TO postgres';
    END IF;
  END LOOP;
END;
$grant_matrix$;
