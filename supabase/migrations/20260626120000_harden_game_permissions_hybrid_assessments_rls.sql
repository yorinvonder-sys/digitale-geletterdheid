-- Harden RLS for game permissions and hybrid assessments.
-- Forward-only migration: preserves older dirty migration edits and makes the
-- repo source of truth explicit for these security scan findings.

DO $$
BEGIN
  IF to_regclass('public.game_permissions') IS NOT NULL THEN
    ALTER TABLE public.game_permissions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.game_permissions FORCE ROW LEVEL SECURITY;

    REVOKE ALL ON TABLE public.game_permissions FROM anon;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.game_permissions TO authenticated;

    DROP POLICY IF EXISTS "game_permissions_select_school_or_global" ON public.game_permissions;
    DROP POLICY IF EXISTS "game_permissions_insert_same_school_teacher" ON public.game_permissions;
    DROP POLICY IF EXISTS "game_permissions_update_same_school_teacher" ON public.game_permissions;
    DROP POLICY IF EXISTS "game_permissions_delete_same_school_teacher" ON public.game_permissions;

    CREATE POLICY "game_permissions_select_school_or_global"
      ON public.game_permissions
      FOR SELECT
      TO authenticated
      USING (
        public.get_caller_app_role() = 'developer'
        OR school_id IS NULL
        OR school_id::text = public.get_caller_school_id()
        OR public.is_teacher_in_school(school_id::text)
      );

    CREATE POLICY "game_permissions_insert_same_school_teacher"
      ON public.game_permissions
      FOR INSERT
      TO authenticated
      WITH CHECK (
        public.get_caller_app_role() = 'developer'
        OR (
          school_id IS NOT NULL
          AND public.is_teacher_in_school(school_id::text)
        )
      );

    CREATE POLICY "game_permissions_update_same_school_teacher"
      ON public.game_permissions
      FOR UPDATE
      TO authenticated
      USING (
        public.get_caller_app_role() = 'developer'
        OR (
          school_id IS NOT NULL
          AND public.is_teacher_in_school(school_id::text)
        )
      )
      WITH CHECK (
        public.get_caller_app_role() = 'developer'
        OR (
          school_id IS NOT NULL
          AND public.is_teacher_in_school(school_id::text)
        )
      );

    CREATE POLICY "game_permissions_delete_same_school_teacher"
      ON public.game_permissions
      FOR DELETE
      TO authenticated
      USING (
        public.get_caller_app_role() = 'developer'
        OR (
          school_id IS NOT NULL
          AND public.is_teacher_in_school(school_id::text)
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.hybrid_assessments') IS NOT NULL THEN
    ALTER TABLE public.hybrid_assessments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.hybrid_assessments FORCE ROW LEVEL SECURITY;

    REVOKE ALL ON TABLE public.hybrid_assessments FROM anon;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.hybrid_assessments TO authenticated;

    DROP POLICY IF EXISTS "hybrid_assessments_select_same_school_or_own" ON public.hybrid_assessments;
    DROP POLICY IF EXISTS "hybrid_assessments_insert_same_school_teacher" ON public.hybrid_assessments;
    DROP POLICY IF EXISTS "hybrid_assessments_update_same_school_teacher" ON public.hybrid_assessments;
    DROP POLICY IF EXISTS "hybrid_assessments_delete_same_school_teacher" ON public.hybrid_assessments;

    CREATE POLICY "hybrid_assessments_select_same_school_or_own"
      ON public.hybrid_assessments
      FOR SELECT
      TO authenticated
      USING (
        public.get_caller_app_role() = 'developer'
        OR public.is_teacher_in_school(school_id::text)
        OR uid::text = auth.uid()::text
      );

    CREATE POLICY "hybrid_assessments_insert_same_school_teacher"
      ON public.hybrid_assessments
      FOR INSERT
      TO authenticated
      WITH CHECK (
        public.get_caller_app_role() = 'developer'
        OR public.is_teacher_in_school(school_id::text)
        OR (
          uid::text = auth.uid()::text
          AND school_id::text = public.get_caller_school_id()
        )
      );

    CREATE POLICY "hybrid_assessments_update_same_school_teacher"
      ON public.hybrid_assessments
      FOR UPDATE
      TO authenticated
      USING (
        public.get_caller_app_role() = 'developer'
        OR public.is_teacher_in_school(school_id::text)
      )
      WITH CHECK (
        public.get_caller_app_role() = 'developer'
        OR public.is_teacher_in_school(school_id::text)
      );

    CREATE POLICY "hybrid_assessments_delete_same_school_teacher"
      ON public.hybrid_assessments
      FOR DELETE
      TO authenticated
      USING (
        public.get_caller_app_role() = 'developer'
        OR public.is_teacher_in_school(school_id::text)
      );
  END IF;
END $$;
