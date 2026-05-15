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
--   Definieer public.is_developer() als SECURITY DEFINER helper en gebruik die
--   in de policies. De helper leest de server-side app metadata uit auth.users
--   en vereist AAL2/MFA, zodat developer-notes niet de tijdelijke admin/dev
--   MFA-uitzondering uit een eerdere migration overnemen.
--
-- Impact:
--   - Geen data-migratie, geen nieuwe kolommen.
--   - Alleen 4 policies opnieuw gedefinieerd.
--   - Security model ongewijzigd: user_id = auth.uid() AND developer-rol.
-- ===========================================================================

CREATE OR REPLACE FUNCTION public.is_developer()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'developer'
  )
  AND public.is_mfa_aal2();
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_developer() TO authenticated;

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
