-- ============================================================================
-- Harden users RLS + privileged MFA enforcement
-- ============================================================================
-- Security goals:
-- 1) Prevent cross-school access to public.users by privileged roles.
-- 2) Enforce AAL2 (MFA) server-side for teacher/admin/developer privileges.
-- 3) Scope teacher RPC operations to students in the same school.
-- ============================================================================

-- Detect AAL2 from JWT claims (server-side, tamper-resistant).
CREATE OR REPLACE FUNCTION public.is_mfa_aal2()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_claims jsonb;
BEGIN
  BEGIN
    v_claims := nullif(current_setting('request.jwt.claims', true), '')::jsonb;
  EXCEPTION WHEN others THEN
    RETURN false;
  END;

  RETURN coalesce(v_claims->>'aal', 'aal1') = 'aal2';
END;
$$;

-- Read caller school from server-set app metadata.
CREATE OR REPLACE FUNCTION public.get_caller_school_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id text;
BEGIN
  SELECT raw_app_meta_data->>'schoolId'
    INTO v_school_id
  FROM auth.users
  WHERE id = auth.uid();

  RETURN v_school_id;
END;
$$;

-- Privileged role check now requires MFA (AAL2).
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' IN ('teacher', 'admin', 'developer')
  )
  AND public.is_mfa_aal2();
END;
$$;

-- Privileged access constrained to same school.
CREATE OR REPLACE FUNCTION public.is_teacher_in_school(target_school_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_school_id text;
BEGIN
  IF NOT public.is_teacher() THEN
    RETURN false;
  END IF;

  v_caller_school_id := public.get_caller_school_id();

  IF v_caller_school_id IS NULL OR target_school_id IS NULL THEN
    RETURN false;
  END IF;

  RETURN v_caller_school_id = target_school_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- users RLS policies (school scoped for privileged roles)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "users_select_own_or_teacher" ON public.users;
CREATE POLICY "users_select_own_or_teacher"
  ON public.users
  FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_teacher_in_school(school_id)
  );

DROP POLICY IF EXISTS "users_update_own_or_teacher" ON public.users;
CREATE POLICY "users_update_own_or_teacher"
  ON public.users
  FOR UPDATE
  USING (
    auth.uid() = id
    OR public.is_teacher_in_school(school_id)
  )
  WITH CHECK (
    auth.uid() = id
    OR public.is_teacher_in_school(school_id)
  );

DROP POLICY IF EXISTS "users_delete_teacher_only" ON public.users;
CREATE POLICY "users_delete_teacher_only"
  ON public.users
  FOR DELETE
  USING (
    public.is_teacher_in_school(school_id)
  );

DROP POLICY IF EXISTS "users_insert_authenticated" ON public.users;
CREATE POLICY "users_insert_authenticated"
  ON public.users
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR public.is_teacher_in_school(school_id)
  );

-- ---------------------------------------------------------------------------
-- Harden teacher RPC operations with school scope checks
-- ---------------------------------------------------------------------------
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

  UPDATE public.users
  SET stats = v_current_stats
  WHERE id = p_student_id;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_student(p_student_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_target_school_id text;
BEGIN
  IF NOT public.is_teacher() THEN
    RAISE EXCEPTION 'Unauthorized: teacher/admin/developer with MFA required';
  END IF;

  SELECT school_id
    INTO v_target_school_id
  FROM public.users
  WHERE id = p_student_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found: %', p_student_id;
  END IF;

  IF NOT public.is_teacher_in_school(v_target_school_id) THEN
    RAISE EXCEPTION 'Unauthorized: only same-school privileged users may delete student';
  END IF;

  DELETE FROM public.users
  WHERE id = p_student_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_student_progress(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_student(uuid) TO authenticated;
