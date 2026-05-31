-- ============================================================================
-- Restore trusted app-role helper for remote RPC dependencies
-- ============================================================================
-- Remote audit on 2026-05-24 showed teacher/admin RPCs depending on
-- public.get_caller_app_role(), while that helper was missing on the linked
-- project. Keep this migration intentionally narrow and idempotent.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_caller_app_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_is_legacy_admin boolean;
BEGIN
  SELECT
    raw_app_meta_data->>'role',
    raw_app_meta_data->>'admin' = 'true'
  INTO v_role, v_is_legacy_admin
  FROM auth.users
  WHERE id = auth.uid();

  IF v_role IN ('student', 'teacher', 'admin', 'developer') THEN
    RETURN v_role;
  END IF;

  IF v_is_legacy_admin THEN
    RETURN 'admin';
  END IF;

  RETURN null;
END;
$$;

REVOKE ALL ON FUNCTION public.get_caller_app_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_caller_app_role() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_caller_app_role() TO authenticated;
