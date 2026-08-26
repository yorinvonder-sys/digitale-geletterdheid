-- De migraties beschrijven weer wat er werkelijk op productie staat.
--
-- HET VERSCHIL
--
-- Op productie draagt de completed-guard OOK de USING-clausule van twee policies.
-- In de migratiebestanden staat hij alleen in WITH CHECK. Gemeten op 2026-08-08:
--
--   policy                          migraties                live
--   ------------------------------  -----------------------  --------------------------------
--   owner_update  USING             auth.uid() = user_id     ... AND status <> 'completed'
--   owner_delete  USING             uid OR docent            (uid AND status <> 'completed') OR docent
--   owner_insert  WITH CHECK        gelijk                   gelijk
--   owner_update  WITH CHECK        gelijk                   gelijk
--   owner_select  USING             gelijk                   gelijk
--
-- WAAROM DAT ERTOE DOET
--
-- USING wordt toegepast op de BESTAANDE rij, vóór er iets wordt gezet. Juist die
-- clausule bepaalt dus dat een afgeronde rij niet meer door de leerling zelf is
-- bij te werken of te verwijderen -- het gedrag dat eerder vandaag een stille
-- bug in vier opdrachten veroorzaakte. Wie een omgeving uit deze migraties
-- opbouwde (een testbranch, een herstel, een nieuwe school), kreeg een database
-- die zich anders gedroeg dan productie, en dat is precies waar een
-- broncode-review op stukloopt: het staat er niet.
--
-- WAT DEZE MIGRATIE DOET
--
-- Alleen de bestanden in lijn brengen met de werkelijkheid. De uitdrukkingen
-- hieronder zijn letterlijk overgenomen uit pg_policy op productie, dus het
-- toepassen ervan verandert daar niets -- het is een no-op die de drift sluit.
-- De guard zelf blijft ongemoeid; die is gewenst.

ALTER POLICY "mission_progress_owner_update" ON public.mission_progress
  USING (
    (auth.uid() = user_id)
    AND (status <> 'completed'::text)
  );

ALTER POLICY "mission_progress_owner_delete" ON public.mission_progress
  USING (
    ((auth.uid() = user_id) AND (status <> 'completed'::text))
    OR public.is_teacher_in_school(school_id)
  );
