-- =============================================================================
-- Migratie: add_mission_id_to_student_activities
-- Doel: Voegt mission_id kolom toe aan student_activities zodat activiteiten
--       aan een specifieke missie gekoppeld kunnen worden.
-- Datum: 2026-04-16
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.student_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id uuid GENERATED ALWAYS AS (uid) STORED,
  school_id text,
  student_name text NOT NULL,
  type text NOT NULL,
  data text,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE public.student_activities
  ADD COLUMN IF NOT EXISTS mission_id text;

-- Index voor queries die filteren op mission_id
CREATE INDEX IF NOT EXISTS idx_student_activities_mission_id
  ON public.student_activities (mission_id);

CREATE INDEX IF NOT EXISTS idx_student_activities_uid_timestamp
  ON public.student_activities (uid, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_student_activities_school_timestamp
  ON public.student_activities (school_id, timestamp DESC);

ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_activities_select_own_or_teacher" ON public.student_activities;
CREATE POLICY "student_activities_select_own_or_teacher"
  ON public.student_activities
  FOR SELECT
  USING (
    auth.uid() = uid
    OR public.is_teacher_in_school(school_id)
  );

DROP POLICY IF EXISTS "student_activities_insert_own" ON public.student_activities;
CREATE POLICY "student_activities_insert_own"
  ON public.student_activities
  FOR INSERT
  WITH CHECK (
    auth.uid() = uid
    AND (
      school_id IS NULL
      OR school_id = public.get_caller_school_id()
    )
  );

GRANT SELECT, INSERT ON TABLE public.student_activities TO authenticated;
GRANT ALL ON TABLE public.student_activities TO service_role;
