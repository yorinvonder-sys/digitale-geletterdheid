-- ============================================================================
-- Remote hardening repair 2026-05-25
-- ============================================================================
-- Targeted repair for the linked DGSkills Supabase gate:
--   - restore public.has_student_consent(uuid, text, text);
--   - remove anon execution from tracked SECURITY DEFINER helpers that should
--     not be callable from browser-anonymous contexts;
--   - remove anon execution from the 15 P0 remote advisor functions proven by
--     docs/audits/dgskills-supabase-p0-remote-grants-2026-05-25.md;
--   - keep the patch intentionally narrow because remote migration history has
--     drifted from the local hardening migrations.
--
-- Do not broaden this migration into a full drift replay. Production must be
-- repaired deliberately, not by blindly applying all local-only migrations.
-- ============================================================================

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
  IF p_student_id IS NULL
     OR nullif(btrim(coalesce(p_consent_type, '')), '') IS NULL THEN
    RETURN false;
  END IF;

  SELECT sc.school_id
    INTO v_school_id
  FROM public.student_consents sc
  WHERE sc.student_id = p_student_id
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
      AND sc.consent_version = coalesce(nullif(p_consent_version, ''), '1.0')
  );
END;
$$;

REVOKE ALL ON FUNCTION public.has_student_consent(uuid, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_student_consent(uuid, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_student_consent(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_student_consent(uuid, text, text) TO service_role;

DO $remote_hardening_repair$
BEGIN
  IF to_regprocedure('public.check_xp_rate_limit(text, integer)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.check_xp_rate_limit(text, integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.check_xp_rate_limit(text, integer) FROM anon;
    REVOKE ALL ON FUNCTION public.check_xp_rate_limit(text, integer) FROM authenticated;
    GRANT EXECUTE ON FUNCTION public.check_xp_rate_limit(text, integer) TO service_role;
  END IF;

  IF to_regprocedure('public.consume_edge_rate_limit(text, integer, integer)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.consume_edge_rate_limit(text, integer, integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.consume_edge_rate_limit(text, integer, integer) FROM anon;
    REVOKE ALL ON FUNCTION public.consume_edge_rate_limit(text, integer, integer) FROM authenticated;
    GRANT EXECUTE ON FUNCTION public.consume_edge_rate_limit(text, integer, integer) TO service_role;
  END IF;

  IF to_regprocedure('public.get_caller_school_id()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.get_caller_school_id() FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.get_caller_school_id() FROM anon;
    GRANT EXECUTE ON FUNCTION public.get_caller_school_id() TO authenticated;
    GRANT EXECUTE ON FUNCTION public.get_caller_school_id() TO service_role;
  END IF;

  IF to_regprocedure('public.cleanup_user_data()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.cleanup_user_data() FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.cleanup_user_data() FROM anon;
    GRANT EXECUTE ON FUNCTION public.cleanup_user_data() TO service_role;
  END IF;

  IF to_regprocedure('public.create_mfa_trust(uuid, text, text, integer)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.create_mfa_trust(uuid, text, text, integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.create_mfa_trust(uuid, text, text, integer) FROM anon;
    GRANT EXECUTE ON FUNCTION public.create_mfa_trust(uuid, text, text, integer) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.create_mfa_trust(uuid, text, text, integer) TO service_role;
  END IF;

  IF to_regprocedure('public.delete_student(uuid)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.delete_student(uuid) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.delete_student(uuid) FROM anon;
    GRANT EXECUTE ON FUNCTION public.delete_student(uuid) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.delete_student(uuid) TO service_role;
  END IF;

  IF to_regprocedure('public.get_my_class()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.get_my_class() FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.get_my_class() FROM anon;
    GRANT EXECUTE ON FUNCTION public.get_my_class() TO authenticated;
    GRANT EXECUTE ON FUNCTION public.get_my_class() TO service_role;
  END IF;

  IF to_regprocedure('public.get_my_role()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.get_my_role() FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.get_my_role() FROM anon;
    GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
    GRANT EXECUTE ON FUNCTION public.get_my_role() TO service_role;
  END IF;

  IF to_regprocedure('public.get_my_school_id()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.get_my_school_id() FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.get_my_school_id() FROM anon;
    GRANT EXECUTE ON FUNCTION public.get_my_school_id() TO authenticated;
    GRANT EXECUTE ON FUNCTION public.get_my_school_id() TO service_role;
  END IF;

  IF to_regprocedure('public.get_random_peer_for_review(text)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.get_random_peer_for_review(text) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.get_random_peer_for_review(text) FROM anon;
    GRANT EXECUTE ON FUNCTION public.get_random_peer_for_review(text) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.get_random_peer_for_review(text) TO service_role;
  END IF;

  IF to_regprocedure('public.override_student_step(uuid, text, integer, text, text)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.override_student_step(uuid, text, integer, text, text) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.override_student_step(uuid, text, integer, text, text) FROM anon;
    GRANT EXECUTE ON FUNCTION public.override_student_step(uuid, text, integer, text, text) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.override_student_step(uuid, text, integer, text, text) TO service_role;
  END IF;

  IF to_regprocedure('public.review_growth_recommendation(uuid, boolean, text)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.review_growth_recommendation(uuid, boolean, text) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.review_growth_recommendation(uuid, boolean, text) FROM anon;
    GRANT EXECUTE ON FUNCTION public.review_growth_recommendation(uuid, boolean, text) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.review_growth_recommendation(uuid, boolean, text) TO service_role;
  END IF;

  IF to_regprocedure('public.revoke_all_mfa_trust(uuid)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.revoke_all_mfa_trust(uuid) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.revoke_all_mfa_trust(uuid) FROM anon;
    GRANT EXECUTE ON FUNCTION public.revoke_all_mfa_trust(uuid) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.revoke_all_mfa_trust(uuid) TO service_role;
  END IF;

  IF to_regprocedure('public.set_own_consent(text, boolean, text)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.set_own_consent(text, boolean, text) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.set_own_consent(text, boolean, text) FROM anon;
    GRANT EXECUTE ON FUNCTION public.set_own_consent(text, boolean, text) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.set_own_consent(text, boolean, text) TO service_role;
  END IF;

  IF to_regprocedure('public.student_requires_parental_consent(uuid)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.student_requires_parental_consent(uuid) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.student_requires_parental_consent(uuid) FROM anon;
    GRANT EXECUTE ON FUNCTION public.student_requires_parental_consent(uuid) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.student_requires_parental_consent(uuid) TO service_role;
  END IF;

  IF to_regprocedure('public.submit_peer_feedback(text, uuid, text, integer, jsonb)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.submit_peer_feedback(text, uuid, text, integer, jsonb) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.submit_peer_feedback(text, uuid, text, integer, jsonb) FROM anon;
    GRANT EXECUTE ON FUNCTION public.submit_peer_feedback(text, uuid, text, integer, jsonb) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.submit_peer_feedback(text, uuid, text, integer, jsonb) TO service_role;
  END IF;

  IF to_regprocedure('public.trigger_gdrive_backup()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.trigger_gdrive_backup() FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.trigger_gdrive_backup() FROM anon;
    REVOKE ALL ON FUNCTION public.trigger_gdrive_backup() FROM authenticated;
    GRANT EXECUTE ON FUNCTION public.trigger_gdrive_backup() TO service_role;
  END IF;
END;
$remote_hardening_repair$;
