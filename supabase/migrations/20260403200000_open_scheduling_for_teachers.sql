-- Open Leerlijn Inrichten voor alle docenten
-- ==========================================================================
-- Context: de oorspronkelijke RLS policies op school_containers en
-- school_container_missions (migratie 20260402120000) beperken INSERT/UPDATE/
-- DELETE tot rollen 'admin' en 'developer'. De productvisie is dat alle
-- docenten met schooltoegang hun eigen leerlijn moeten kunnen inrichten.
--
-- Deze migratie:
--   1. Vervangt de restrictieve policies door policies die is_teacher_in_school()
--      gebruiken — deze helper (uit 20260301170000) staat 'teacher', 'admin' en
--      'developer' toe, vereist MFA (AAL2) en school-scoping via app_metadata.
--   2. Verwijdert de UNIQUE constraint uq_school_container_order. Deze maakt
--      reordering van containers onmogelijk (twee rijen kunnen niet van plek
--      wisselen zonder de constraint tijdelijk te schenden). Vervangen door een
--      reguliere index voor zoeksnelheid.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. school_containers: drop oude policies en constraint
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS "school_containers_insert" ON school_containers;
DROP POLICY IF EXISTS "school_containers_update" ON school_containers;
DROP POLICY IF EXISTS "school_containers_delete" ON school_containers;
ALTER TABLE school_containers DROP CONSTRAINT IF EXISTS uq_school_container_order;
CREATE INDEX IF NOT EXISTS idx_school_containers_order
    ON school_containers(school_id, year_group, sort_order);
-- --------------------------------------------------------------------------
-- 2. school_containers: nieuwe policies voor teachers
-- --------------------------------------------------------------------------
CREATE POLICY "school_containers_insert"
    ON school_containers
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_teacher_in_school(school_id)
    );
CREATE POLICY "school_containers_update"
    ON school_containers
    FOR UPDATE
    TO authenticated
    USING (
        public.is_teacher_in_school(school_id)
    )
    WITH CHECK (
        public.is_teacher_in_school(school_id)
    );
CREATE POLICY "school_containers_delete"
    ON school_containers
    FOR DELETE
    TO authenticated
    USING (
        public.is_teacher_in_school(school_id)
    );
-- --------------------------------------------------------------------------
-- 3. school_container_missions: drop oude policies
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS "container_missions_insert" ON school_container_missions;
DROP POLICY IF EXISTS "container_missions_update" ON school_container_missions;
DROP POLICY IF EXISTS "container_missions_delete" ON school_container_missions;
-- --------------------------------------------------------------------------
-- 4. school_container_missions: nieuwe policies voor teachers
-- --------------------------------------------------------------------------
CREATE POLICY "container_missions_insert"
    ON school_container_missions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM school_containers sc
            WHERE sc.id = container_id
              AND public.is_teacher_in_school(sc.school_id)
        )
    );
CREATE POLICY "container_missions_update"
    ON school_container_missions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM school_containers sc
            WHERE sc.id = container_id
              AND public.is_teacher_in_school(sc.school_id)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM school_containers sc
            WHERE sc.id = container_id
              AND public.is_teacher_in_school(sc.school_id)
        )
    );
CREATE POLICY "container_missions_delete"
    ON school_container_missions
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM school_containers sc
            WHERE sc.id = container_id
              AND public.is_teacher_in_school(sc.school_id)
        )
    );
