-- ============================================================================
-- Harden P2 human-choice SECURITY DEFINER functions
-- ============================================================================
-- Purpose:
--   - remove client-editable metadata from role authorization;
--   - close direct RPC exposure for trigger-only cleanup code;
--   - scope parental-consent and AI-beleid vote helpers to the caller's own
--     student record or same-school privileged teacher context;
--   - keep all grants explicit so Supabase advisor output can be postflighted.
--
-- This migration is production-DDL and must only be applied after explicit
-- approval. It does not mutate application data.
-- ============================================================================

-- Helper used by older curriculum policies. Keep authenticated access, but make
-- the role source app_metadata/server-side table only. Never use client-editable
-- metadata for authorization.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    (
      SELECT u.role
      FROM public.users u
      WHERE u.id = auth.uid()
    )
  );
$$;

REVOKE ALL ON FUNCTION public.get_my_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_my_role() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO service_role;

-- Self-scoped helper for class lookup. It intentionally does not accept a user
-- id parameter, so callers cannot query another student's class.
CREATE OR REPLACE FUNCTION public.get_my_class()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.student_class
  FROM public.users u
  WHERE u.id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_my_class() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_my_class() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_my_class() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_class() TO service_role;

-- Parental-consent requirement may reveal a student's year group. Direct RPC
-- callers may only ask for themselves; same-school teachers are allowed through
-- the MFA-gated public.is_teacher_in_school helper. Unauthorized probes return
-- true, which is privacy-safe and blocks consent bypass.
CREATE OR REPLACE FUNCTION public.student_requires_parental_consent(
  p_student_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year_group smallint;
  v_school_id text;
BEGIN
  IF p_student_id IS NULL THEN
    RETURN true;
  END IF;

  SELECT u.year_group, u.school_id
    INTO v_year_group, v_school_id
  FROM public.users u
  WHERE u.id = p_student_id;

  IF v_year_group IS NULL THEN
    RETURN true;
  END IF;

  IF auth.uid() IS DISTINCT FROM p_student_id
     AND COALESCE(current_setting('role', true), '') <> 'service_role'
     AND NOT public.is_teacher_in_school(v_school_id) THEN
    RETURN true;
  END IF;

  RETURN v_year_group <= 4;
END;
$$;

REVOKE ALL ON FUNCTION public.student_requires_parental_consent(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.student_requires_parental_consent(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.student_requires_parental_consent(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.student_requires_parental_consent(uuid) TO service_role;

-- Trigger-only cleanup must not be browser-callable as an RPC. The trigger can
-- still execute as its function owner; service_role is retained for controlled
-- maintenance paths.
DO $cleanup_user_data_grants$
BEGIN
  IF to_regprocedure('public.cleanup_user_data()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.cleanup_user_data() FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.cleanup_user_data() FROM anon;
    REVOKE ALL ON FUNCTION public.cleanup_user_data() FROM authenticated;
    GRANT EXECUTE ON FUNCTION public.cleanup_user_data() TO service_role;
  END IF;
END;
$cleanup_user_data_grants$;

-- Belgium admin helper: remove client-editable fallback and require MFA for admin
-- privilege checks.
CREATE OR REPLACE FUNCTION public.is_belgie_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL
    AND auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    AND public.is_mfa_aal2();
END;
$$;

REVOKE ALL ON FUNCTION public.is_belgie_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_belgie_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_belgie_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_belgie_admin() TO service_role;

-- AI-beleid ideas are visible to authenticated users, but SECURITY DEFINER
-- voting bypasses table RLS. Harden both vote helpers with same-school/owner
-- scope and remove anonymous RPC execution.
DO $ai_beleid_vote_functions$
BEGIN
  IF to_regclass('public.ai_beleid_feedback') IS NOT NULL THEN
    EXECUTE $fn$
      CREATE OR REPLACE FUNCTION public.vote_on_idea(p_idea_id uuid)
      RETURNS jsonb
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        v_uids text[];
        v_caller text := auth.uid()::text;
        v_current_votes integer;
        v_idea_school_id text;
        v_idea_owner_uid text;
        v_caller_school_id text;
      BEGIN
        IF auth.uid() IS NULL THEN
          RETURN jsonb_build_object('success', false, 'reason', 'not_authenticated');
        END IF;

        SELECT f.gestemde_uids, COALESCE(f.stemmen, 0), f.school_id, f.uid
          INTO v_uids, v_current_votes, v_idea_school_id, v_idea_owner_uid
        FROM public.ai_beleid_feedback f
        WHERE f.id = p_idea_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RETURN jsonb_build_object('success', false, 'reason', 'idea_not_found');
        END IF;

        SELECT u.school_id
          INTO v_caller_school_id
        FROM public.users u
        WHERE u.id = auth.uid();

        IF v_idea_school_id IS NOT NULL THEN
          IF v_caller_school_id IS DISTINCT FROM v_idea_school_id
             AND NOT public.is_teacher_in_school(v_idea_school_id) THEN
            RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
          END IF;
        ELSIF v_idea_owner_uid IS DISTINCT FROM v_caller THEN
          RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
        END IF;

        v_uids := COALESCE(v_uids, ARRAY[]::text[]);

        IF v_caller = ANY(v_uids) THEN
          RETURN jsonb_build_object('success', false, 'reason', 'already_voted');
        END IF;

        UPDATE public.ai_beleid_feedback
        SET stemmen = v_current_votes + 1,
            gestemde_uids = array_append(v_uids, v_caller)
        WHERE id = p_idea_id;

        RETURN jsonb_build_object('success', true, 'new_votes', v_current_votes + 1);
      END;
      $$;
    $fn$;

    EXECUTE $fn$
      CREATE OR REPLACE FUNCTION public.unvote_on_idea(p_idea_id uuid)
      RETURNS jsonb
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        v_uids text[];
        v_caller text := auth.uid()::text;
        v_current_votes integer;
        v_idea_school_id text;
        v_idea_owner_uid text;
        v_caller_school_id text;
      BEGIN
        IF auth.uid() IS NULL THEN
          RETURN jsonb_build_object('success', false, 'reason', 'not_authenticated');
        END IF;

        SELECT f.gestemde_uids, COALESCE(f.stemmen, 0), f.school_id, f.uid
          INTO v_uids, v_current_votes, v_idea_school_id, v_idea_owner_uid
        FROM public.ai_beleid_feedback f
        WHERE f.id = p_idea_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RETURN jsonb_build_object('success', false, 'reason', 'idea_not_found');
        END IF;

        SELECT u.school_id
          INTO v_caller_school_id
        FROM public.users u
        WHERE u.id = auth.uid();

        IF v_idea_school_id IS NOT NULL THEN
          IF v_caller_school_id IS DISTINCT FROM v_idea_school_id
             AND NOT public.is_teacher_in_school(v_idea_school_id) THEN
            RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
          END IF;
        ELSIF v_idea_owner_uid IS DISTINCT FROM v_caller THEN
          RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
        END IF;

        v_uids := COALESCE(v_uids, ARRAY[]::text[]);

        IF NOT (v_caller = ANY(v_uids)) THEN
          RETURN jsonb_build_object('success', false, 'reason', 'not_voted');
        END IF;

        UPDATE public.ai_beleid_feedback
        SET stemmen = GREATEST(0, v_current_votes - 1),
            gestemde_uids = array_remove(v_uids, v_caller)
        WHERE id = p_idea_id;

        RETURN jsonb_build_object(
          'success', true,
          'new_votes', GREATEST(0, v_current_votes - 1)
        );
      END;
      $$;
    $fn$;

    REVOKE ALL ON FUNCTION public.vote_on_idea(uuid) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.vote_on_idea(uuid) FROM anon;
    GRANT EXECUTE ON FUNCTION public.vote_on_idea(uuid) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.vote_on_idea(uuid) TO service_role;

    REVOKE ALL ON FUNCTION public.unvote_on_idea(uuid) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.unvote_on_idea(uuid) FROM anon;
    GRANT EXECUTE ON FUNCTION public.unvote_on_idea(uuid) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.unvote_on_idea(uuid) TO service_role;
  END IF;
END;
$ai_beleid_vote_functions$;
