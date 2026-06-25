-- ============================================================================
-- Advisor warning hardening (review-only)
-- ============================================================================
-- Scope:
--   - Fix safe `function_search_path_mutable` warnings for known functions.
--   - Drop duplicate indexes where another equivalent unique/indexed path
--     remains in place.
--
-- Explicitly not included:
--   - Broad EXECUTE revokes for SECURITY DEFINER functions. Those need a
--     function-by-function grant matrix to avoid breaking authenticated flows.
--   - Public bucket listing policy changes. Those need product review because
--     public image/assets URLs may intentionally rely on bucket visibility.
--   - Auth leaked-password protection. That is a dashboard/Auth setting, not a
--     SQL migration.
-- ============================================================================

DO $$
BEGIN
  IF to_regprocedure('public.set_developer_notes_updated_at()') IS NOT NULL THEN
    ALTER FUNCTION public.set_developer_notes_updated_at()
      SET search_path = public;
  END IF;

  IF to_regprocedure('public.prevent_audit_log_mutation()') IS NOT NULL THEN
    ALTER FUNCTION public.prevent_audit_log_mutation()
      SET search_path = public;
  END IF;

  IF to_regprocedure('public.update_updated_at_column()') IS NOT NULL THEN
    ALTER FUNCTION public.update_updated_at_column()
      SET search_path = public;
  END IF;

  IF to_regprocedure('public.school_branding_on_insert()') IS NOT NULL THEN
    ALTER FUNCTION public.school_branding_on_insert()
      SET search_path = public;
  END IF;

  IF to_regprocedure('public.school_branding_on_update()') IS NOT NULL THEN
    ALTER FUNCTION public.school_branding_on_update()
      SET search_path = public;
  END IF;
END $$;

-- Supabase Performance Advisor reported this as duplicate with the unique
-- constraint-backed mission_progress_user_mission_unique index. Keep the
-- constraint index and remove the standalone duplicate.
DROP INDEX IF EXISTS public.idx_mission_progress_user_mission;

-- Supabase Performance Advisor reported this as duplicate with
-- idx_shared_games_school_class_created. Keep the more descriptive current
-- index name and remove the older *_ts duplicate if present.
DROP INDEX IF EXISTS public.idx_shared_games_school_class_ts;
