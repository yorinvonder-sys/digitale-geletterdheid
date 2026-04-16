-- ===========================================================================
-- Developer Notes — RLS fix: gebruik SECURITY DEFINER helper
--
-- Probleem:
--   De originele policies (migration 20260416120000) checkten de developer-
--   rol via een inline EXISTS subquery op auth.users. Die draait onder de
--   rechten van de aanroepende rol (authenticated), die geen SELECT op
--   auth.users heeft — gevolg: "permission denied for table users" bij
--   iedere INSERT/SELECT/UPDATE/DELETE. De tab Notities kon niets opslaan.
--
-- Fix:
--   Hergebruik de bestaande helper-functie public.is_developer() die
--   SECURITY DEFINER gebruikt en daardoor wél onder owner-rechten op
--   auth.users mag lezen. Identiek patroon aan is_branding_admin(),
--   is_teacher(), is_mfa_aal2() elders in het project.
--
-- Impact:
--   - Geen data-migratie, geen nieuwe kolommen.
--   - Alleen 4 policies opnieuw gedefinieerd.
--   - Security model ongewijzigd: user_id = auth.uid() AND developer-rol.
-- ===========================================================================

DROP POLICY IF EXISTS "developer_notes_select_own" ON public.developer_notes;
CREATE POLICY "developer_notes_select_own"
    ON public.developer_notes
    FOR SELECT
    USING (user_id = auth.uid() AND public.is_developer());

DROP POLICY IF EXISTS "developer_notes_insert_own" ON public.developer_notes;
CREATE POLICY "developer_notes_insert_own"
    ON public.developer_notes
    FOR INSERT
    WITH CHECK (user_id = auth.uid() AND public.is_developer());

DROP POLICY IF EXISTS "developer_notes_update_own" ON public.developer_notes;
CREATE POLICY "developer_notes_update_own"
    ON public.developer_notes
    FOR UPDATE
    USING (user_id = auth.uid() AND public.is_developer())
    WITH CHECK (user_id = auth.uid() AND public.is_developer());

DROP POLICY IF EXISTS "developer_notes_delete_own" ON public.developer_notes;
CREATE POLICY "developer_notes_delete_own"
    ON public.developer_notes
    FOR DELETE
    USING (user_id = auth.uid() AND public.is_developer());
