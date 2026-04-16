-- =============================================================================
-- Migratie: add_mission_id_to_student_activities
-- Doel: Voegt mission_id kolom toe aan student_activities zodat activiteiten
--       aan een specifieke missie gekoppeld kunnen worden.
-- Datum: 2026-04-16
-- =============================================================================

ALTER TABLE public.student_activities
  ADD COLUMN IF NOT EXISTS mission_id text;

-- Index voor queries die filteren op mission_id
CREATE INDEX IF NOT EXISTS idx_student_activities_mission_id
  ON public.student_activities (mission_id);
