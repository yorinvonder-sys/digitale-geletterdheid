-- ===========================================================================
-- AI Act Art. 12 + 14 — Audit logging voor AI-gegenereerde beoordelingen
-- en human oversight (docent-overrides van SLO-percentages).
--
-- Art. 12: Elke AI-gegenereerde SLO-percentage-bepaling is traceerbaar via
--          een gestructureerd log-event ('ai_assessment_generated').
-- Art. 14: Een docent kan een AI-uitgerekend percentage overrulen; de
--          override + verplichte reden worden vastgelegd ('teacher_override').
--
-- RLS: school-gescoped — docenten zien alleen events van hun eigen school.
-- Rollen: gebaseerd op auth.users.raw_app_meta_data->>'role' (zelfde als
--         rest van de codebase, zie is_teacher() in harden_users_rls).
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.ai_oversight_events (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL    DEFAULT now(),
  school_id     uuid,
  teacher_uid   uuid        NOT NULL,
  student_uid   uuid,
  event_type    text        NOT NULL
    CHECK (event_type IN (
      'ai_assessment_generated',
      'teacher_override',
      'teacher_review_acknowledged'
    )),
  slo_code      text,
  ai_value      jsonb,
  override_value jsonb,
  -- Verplichte reden bij teacher_override (min 10, max 2000 tekens).
  -- Vrije tekst, mag naam van leerling/ouder bevatten (docent-keuze).
  reasoning     text
    CHECK (reasoning IS NULL OR (char_length(reasoning) >= 10 AND char_length(reasoning) <= 2000)),
  mission_id    text
);

COMMENT ON TABLE public.ai_oversight_events IS
  'EU AI Act Art. 12 + 14 — traceerbaarheid van AI-gegenereerde SLO-beoordelingen '
  'en human oversight (docent-overrides). Append-only via RLS (geen DELETE/UPDATE policy).';

COMMENT ON COLUMN public.ai_oversight_events.ai_value IS
  'De door AI berekende waarde (jsonb, bijv. {"percentage": 72, "completed": 5, "total": 7}).';

COMMENT ON COLUMN public.ai_oversight_events.override_value IS
  'De door de docent opgegeven correctiewaarde (jsonb, bijv. {"percentage": 85}).';

COMMENT ON COLUMN public.ai_oversight_events.reasoning IS
  'Verplichte reden bij teacher_override. Minimaal 10, maximaal 2000 tekens. '
  'Vrije tekst — mag PII bevatten als de docent dat kiest (zie DPIA).';

ALTER TABLE public.ai_oversight_events ENABLE ROW LEVEL SECURITY;

-- ── SELECT: docenten en beheerders zien events van hun eigen school ──────────
-- Gebruikt raw_app_meta_data->>'role' en ->>'schoolId' (conform harden_users_rls).
-- Developer-rol heeft geen school-restrictie (zelfde patroon als is_teacher()).

CREATE POLICY "ai_oversight_events_teacher_select"
  ON public.ai_oversight_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM auth.users au
      WHERE au.id = auth.uid()
        AND au.raw_app_meta_data->>'role' IN (
              'teacher', 'teamleider', 'directie', 'ict-coordinator', 'admin', 'developer'
            )
        AND (
          -- Developer/admin: geen school-restrictie
          au.raw_app_meta_data->>'role' IN ('developer', 'admin')
          OR
          -- Overige rollen: alleen eigen school
          au.raw_app_meta_data->>'schoolId' = ai_oversight_events.school_id::text
        )
    )
  );

-- ── INSERT: docenten mogen alleen inserts voor hun eigen school + zichzelf ───

CREATE POLICY "ai_oversight_events_teacher_insert"
  ON public.ai_oversight_events
  FOR INSERT
  WITH CHECK (
    teacher_uid = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM auth.users au
      WHERE au.id = auth.uid()
        AND au.raw_app_meta_data->>'role' IN (
              'teacher', 'teamleider', 'directie', 'ict-coordinator', 'admin', 'developer'
            )
        AND (
          au.raw_app_meta_data->>'role' IN ('developer', 'admin')
          OR au.raw_app_meta_data->>'schoolId' = ai_oversight_events.school_id::text
        )
    )
  );

-- Geen UPDATE/DELETE policies → append-only gedrag (Art. 12 traceerbaarheid).

-- ── Indexen ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS ai_oversight_events_school_idx
  ON public.ai_oversight_events (school_id, created_at DESC);

CREATE INDEX IF NOT EXISTS ai_oversight_events_student_idx
  ON public.ai_oversight_events (student_uid, created_at DESC);

CREATE INDEX IF NOT EXISTS ai_oversight_events_event_type_idx
  ON public.ai_oversight_events (event_type);
