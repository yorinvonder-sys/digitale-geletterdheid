-- Advisor warning hardening (review-only)
-- Fix safe `function_search_path_mutable` warnings for known functions, en
-- verwijder dubbele indexen waar een gelijkwaardige unique/index blijft staan.
-- Vooraf geverifieerd op deze database: de vijf functies hebben search_path al
-- op public (deze DO-blokken zijn dus no-ops), en beide te droppen indexen zijn
-- aantoonbaar identiek aan een index die blijft staan:
--   idx_mission_progress_user_mission  == mission_progress_user_mission_unique
--     (die laatste is constraint-backed, contype='u', en blijft)
--   idx_shared_games_school_class_ts   == idx_shared_games_school_class_created

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

DROP INDEX IF EXISTS public.idx_mission_progress_user_mission;

DROP INDEX IF EXISTS public.idx_shared_games_school_class_ts;
