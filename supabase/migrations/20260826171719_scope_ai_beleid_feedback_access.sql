-- Aanscherping (VOORSTEL — wijzigt productiegedrag, alleen na akkoord Yorin):
--
-- 1. ai_beleid_feedback_select stond op `auth.uid() IS NOT NULL`: elke
--    ingelogde gebruiker van ELKE school kon alle vrije-tekst-ideeen van
--    minderjarigen lezen. Nieuw: alleen eigen rijen, klas-/schoolgenoten
--    binnen dezelfde school, of een docent van die school.
-- 2. ai_beleid_feedback_update stond op eigenaar-mag-alles: een leerling kon
--    daarmee de stemmenteller van het eigen idee direct manipuleren. De app
--    stemt uitsluitend via de SECURITY DEFINER-RPC vote_on_idea en heeft geen
--    legitiem direct update-pad, dus de policy vervalt.
--
-- Effect op eerlijke gebruikers: geen — de missie leest altijd school-scoped
-- (teacherService filtert al op school_id) en stemmen loopt via de RPC.
-- Rijen zonder school_id blijven zichtbaar voor de eigenaar zelf (fail-closed).

DROP POLICY IF EXISTS ai_beleid_feedback_select ON public.ai_beleid_feedback;
CREATE POLICY ai_beleid_feedback_select
  ON public.ai_beleid_feedback FOR SELECT TO authenticated
  USING (
    uid = (auth.uid())::text
    OR (school_id IS NOT NULL AND school_id = public.get_caller_school_id())
    OR public.is_teacher_in_school(school_id)
  );

DROP POLICY IF EXISTS ai_beleid_feedback_update ON public.ai_beleid_feedback;
