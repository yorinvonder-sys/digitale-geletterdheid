-- ===========================================================================
-- Developer Notes — Persoonlijke Notitie-agenda
--
-- Yorin (developer-rol) heeft een vaste plek nodig voor gedachtes, werklog
-- en handoff-notities binnen het DeveloperDashboard. Alles bij het werk,
-- realtime gesynchroniseerd, alleen voor hem zichtbaar.
--
-- Security model:
--   Dubbele gate op ELKE policy:
--     1. user_id = auth.uid()        → eigen rijen, nooit andermans
--     2. raw_app_meta_data->>'role' = 'developer'  → alleen developer-account
--   Geen AAL2 vereist: notities zijn puur privé, geen destructieve
--   cross-school impact, geen student- of schooldata.
--
-- Impact op reporting/permissions/data exposure:
--   - Nieuwe tabel `developer_notes` in public schema.
--   - Bevat uitsluitend tekst van de developer zelf — geen persoonsgegevens
--     van leerlingen, docenten of scholen.
--   - RLS enabled vanaf dag één; grants beperkt tot `authenticated`.
--   - Geen audit_logs trigger: privé-notities vallen buiten AVG-traceability
--     verplichting (geen verwerking van andermans persoonsgegevens).
--   - Geen versioning of soft-delete in v1 (follow-up indien gewenst).
--
-- Naming reasoning:
--   `developer_notes` i.p.v. `notes` — toekomstbestendig, geen conflict
--   met eventuele student/teacher notes tabellen later.
-- ===========================================================================

-- ── 1. Tabel developer_notes ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.developer_notes (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label       text        NOT NULL CHECK (label IN ('gedachte', 'werklog', 'handoff')),
    body        text        NOT NULL CHECK (length(body) BETWEEN 1 AND 8000),
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.developer_notes IS
    'Persoonlijke notitie-agenda voor de developer. SELECT/WRITE: dubbele gate user_id + developer-rol.';

COMMENT ON COLUMN public.developer_notes.label IS
    'Notitie-type: gedachte (idee/twijfel), werklog (wat gedaan), handoff (hoe verder morgen).';

-- ── 2. Index ────────────────────────────────────────────────────────────────

-- Compound index op user_id + created_at DESC voor de standaard query-volgorde
-- (fetchNotes: ORDER BY created_at DESC, filter impliciet via RLS op user_id).
CREATE INDEX IF NOT EXISTS idx_developer_notes_user_created
    ON public.developer_notes (user_id, created_at DESC);

-- ── 3. Trigger: updated_at automatisch bijwerken ────────────────────────────

CREATE OR REPLACE FUNCTION public.set_developer_notes_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_developer_notes_updated_at() IS
    'Zet updated_at op now() bij elke UPDATE op developer_notes.';

DROP TRIGGER IF EXISTS trg_developer_notes_updated_at ON public.developer_notes;
CREATE TRIGGER trg_developer_notes_updated_at
    BEFORE UPDATE ON public.developer_notes
    FOR EACH ROW EXECUTE FUNCTION public.set_developer_notes_updated_at();

-- ── 4. RLS policies ────────────────────────────────────────────────────────

ALTER TABLE public.developer_notes ENABLE ROW LEVEL SECURITY;

-- SELECT: alleen eigen rijen + developer-rol.
DROP POLICY IF EXISTS "developer_notes_select_own" ON public.developer_notes;
CREATE POLICY "developer_notes_select_own"
    ON public.developer_notes
    FOR SELECT
    USING (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
              AND raw_app_meta_data->>'role' = 'developer'
        )
    );

-- INSERT: alleen eigen user_id + developer-rol.
DROP POLICY IF EXISTS "developer_notes_insert_own" ON public.developer_notes;
CREATE POLICY "developer_notes_insert_own"
    ON public.developer_notes
    FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
              AND raw_app_meta_data->>'role' = 'developer'
        )
    );

-- UPDATE: dubbele gate op zowel USING (bestaande rij) als WITH CHECK (nieuwe waarden).
DROP POLICY IF EXISTS "developer_notes_update_own" ON public.developer_notes;
CREATE POLICY "developer_notes_update_own"
    ON public.developer_notes
    FOR UPDATE
    USING (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
              AND raw_app_meta_data->>'role' = 'developer'
        )
    )
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
              AND raw_app_meta_data->>'role' = 'developer'
        )
    );

-- DELETE: alleen eigen rijen + developer-rol.
DROP POLICY IF EXISTS "developer_notes_delete_own" ON public.developer_notes;
CREATE POLICY "developer_notes_delete_own"
    ON public.developer_notes
    FOR DELETE
    USING (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
              AND raw_app_meta_data->>'role' = 'developer'
        )
    );

-- ── 5. Grants ──────────────────────────────────────────────────────────────

GRANT SELECT, INSERT, UPDATE, DELETE ON public.developer_notes TO authenticated;
