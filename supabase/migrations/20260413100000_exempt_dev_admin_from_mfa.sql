-- ============================================================================
-- Exempt developer and admin roles from MFA requirement
-- ============================================================================
-- Previously, is_teacher() required AAL2 (MFA) for ALL privileged roles
-- (teacher, admin, developer). This migration changes is_teacher() so that:
--   - teacher: still requires MFA (AAL2)
--   - admin and developer: privileged access WITHOUT MFA
--
-- Downstream effects:
--   - is_teacher_in_school() wraps is_teacher(), inherits this change.
--   - All RLS policies using is_teacher() or is_teacher_in_school() now
--     grant admin/developer access without MFA.
--   - RPCs (reset_student_progress, delete_student, teacher_step_override)
--     that call is_teacher() now allow admin/developer calls without MFA.
--   - No change for teachers: they still require AAL2.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
BEGIN
  SELECT raw_app_meta_data->>'role'
    INTO v_role
  FROM auth.users
  WHERE id = auth.uid();

  IF v_role IS NULL THEN
    RETURN false;
  END IF;

  -- Developer and admin: privileged access without MFA
  IF v_role IN ('developer', 'admin') THEN
    RETURN true;
  END IF;

  -- Teacher: requires MFA (AAL2)
  IF v_role = 'teacher' THEN
    RETURN public.is_mfa_aal2();
  END IF;

  RETURN false;
END;
$$;
