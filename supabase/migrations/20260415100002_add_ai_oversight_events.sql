-- ===========================================================================
-- AI Act Art. 12 + Art. 14 — AI Oversight Events
--
-- Art. 12: Traceerbaarheid van AI-gegenereerde beoordelingen
--   → Elke keer dat het systeem een SLO-percentage berekent op basis van
--     missie-voltooiingen, wordt een 'ai_assessment_generated' event gelogd.
--
-- Art. 14: Menselijk toezicht — teacher overrides
--   → Elke keer dat een docent een AI-berekend percentage handmatig corrigeert,
--     wordt een 'teacher_override' event gelogd met verplichte reden.
--
-- RLS: school-gescoped — docenten zien alleen events van hun eigen school.
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.ai_oversight_events (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  timestamptz NOT NULL DEFAULT now(),
    school_id   text,
    teacher_uid uuid        NOT NULL,
    student_uid uuid,
    event_type  text        NOT NULL CHECK (event_type IN (
        'ai_assessment_generated',
        'teacher_override',
        'teacher_review_acknowledged'
    )),
    slo_code       text,
    ai_value       jsonb,
    override_value jsonb,
    reasoning      text       CHECK (reasoning IS NULL OR (char_length(reasoning) >= 10 AND char_length(reasoning) <= 2000)),
    mission_id     text
);
COMMENT ON TABLE public.ai_oversight_events IS
    'EU AI Act Art. 12 + 14 — Audit log voor AI-gegenereerde SLO-beoordelingen en teacher overrides. Append-only via RLS (geen UPDATE/DELETE policies).';
COMMENT ON COLUMN public.ai_oversight_events.event_type IS
    'ai_assessment_generated = Art. 12 traceability; teacher_override = Art. 14 human oversight; teacher_review_acknowledged = docent heeft AI-beoordeling bekeken en akkoord gegeven.';
COMMENT ON COLUMN public.ai_oversight_events.reasoning IS
    'Verplicht bij teacher_override (min 10, max 2000 tekens). Vrije tekst door de docent.';
ALTER TABLE public.ai_oversight_events ENABLE ROW LEVEL SECURITY;
-- ── SELECT: docenten zien alleen events van hun eigen school ────────────────
-- Gebruikt public.users (bevestigd via 20260402200000_harden_audit_logs.sql).
-- Developerrol heeft volledig inzicht (school_id-onafhankelijk).
DROP POLICY IF EXISTS "teachers_read_own_school_oversight" ON public.ai_oversight_events;
CREATE POLICY "teachers_read_own_school_oversight"
    ON public.ai_oversight_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
              AND u.role IN ('teacher', 'admin', 'teamleider', 'directie', 'ict-coordinator', 'developer')
              AND (
                  u.school_id = ai_oversight_events.school_id
                  OR u.role = 'developer'
              )
        )
    );
-- ── INSERT: docenten mogen alleen inserts voor hun eigen school + zichzelf als teacher_uid ──
DROP POLICY IF EXISTS "teachers_insert_own_school_oversight" ON public.ai_oversight_events;
CREATE POLICY "teachers_insert_own_school_oversight"
    ON public.ai_oversight_events FOR INSERT
    WITH CHECK (
        teacher_uid = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
              AND u.role IN ('teacher', 'admin', 'teamleider', 'directie', 'ict-coordinator', 'developer')
              AND (
                  u.school_id = ai_oversight_events.school_id
                  OR u.role = 'developer'
              )
        )
    );
-- Geen UPDATE of DELETE policies → tabel is de facto append-only via RLS.
-- (Een aparte immutable trigger kan later worden toegevoegd als hardening,
--  analoog aan 20260402200000_harden_audit_logs.sql.)

-- ── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS ai_oversight_events_school_idx
    ON public.ai_oversight_events (school_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_oversight_events_student_idx
    ON public.ai_oversight_events (student_uid, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_oversight_events_event_type_idx
    ON public.ai_oversight_events (event_type);
