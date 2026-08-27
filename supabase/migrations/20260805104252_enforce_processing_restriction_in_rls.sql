-- ============================================================================
-- AVG Art. 18 — verwerkingsbeperking afdwingen in RLS (chirurgische variant)
-- ----------------------------------------------------------------------------
-- VERVANGT de aanpak van 20260625151836_enforce_processing_restriction.sql.
-- Die migratie DROPT en HERMAAKT policies, en zou daarbij bescherming
-- verwijderen die alleen in productie bestaat en in geen enkele repo-migratie
-- staat: de guard `status <> 'completed'` op mission_progress, die voorkomt dat
-- een leerling zichzelf op voltooid zet (dat mag uitsluitend via de SECURITY
-- DEFINER-functie public.mark_mission_completed).
--
-- Deze variant gebruikt ALTER POLICY. Daardoor blijven per definitie ongemoeid:
--   - de USING-clausule  (dus: lezen blijft werken, en de completed-guard blijft)
--   - de rollen          (sommige policies staan op public, andere op authenticated)
--   - het commando       (INSERT / UPDATE / ALL)
-- Er wordt uitsluitend één voorwaarde AAN de bestaande WITH CHECK toegevoegd:
--   AND NOT public.current_user_processing_restricted()
--
-- Wat dit doet: een leerling die om verwerkingsbeperking heeft gevraagd kan geen
-- NIEUWE, niet-essentiele gegevens meer wegschrijven. Bewust NIET geraakt, omdat
-- die rechten onder art. 18 juist behouden moeten blijven:
--   - alle SELECT-policies              (inzage blijft)
--   - alle DELETE-policies              (verwijderrecht blijft)
--   - docent-/schooltoezicht-policies   (bestaande schooldossiers blijven)
--   - consent-, audit- en exportpaden   (worden hier niet aangeraakt)
--
-- LET OP: de WITH CHECK-expressies hieronder zijn letterlijk overgenomen uit
-- pg_policies op 2026-08-05 en daarna aangevuld. Faalt deze migratie, dan zijn de
-- live policies sindsdien gewijzigd en moet hij opnieuw worden afgeleid — niet
-- forceren. Alles draait in een transactie: bij een fout wordt niets toegepast.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. De hulpfunctie (ongewijzigd overgenomen uit 20260625151836)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_processing_restricted()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (
      SELECT u.processing_restricted
      FROM public.users u
      WHERE u.id = auth.uid()
      LIMIT 1
    ),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_processing_restricted() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_user_processing_restricted() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_processing_restricted() TO authenticated, service_role;

-- AFWIJKING t.o.v. 20260625151836, bewust en noodzakelijk:
-- vijf van de policies hieronder staan op rol `public` en worden dus OOK voor
-- anon geevalueerd. Zonder EXECUTE-recht zou een schrijfpoging door een
-- niet-ingelogde bezoeker afketsen op "permission denied for function" in plaats
-- van op een nette RLS-weigering. Dat verandert niets aan de beveiliging: voor
-- anon is auth.uid() NULL, de subquery levert geen rij, en de functie geeft via
-- coalesce altijd false terug. Er lekt geen enkel gegeven.
-- (Het origineel had dit probleem niet omdat het alle policies naar
--  TO authenticated herschreef — precies de herschrijving die wij vermijden.)
GRANT EXECUTE ON FUNCTION public.current_user_processing_restricted() TO anon;

COMMENT ON FUNCTION public.current_user_processing_restricted() IS
  'Geeft terug of de huidige gebruiker AVG Art. 18 verwerkingsbeperking heeft ingeroepen. Wordt uitsluitend gebruikt om nieuwe, niet-essentiele schrijfacties te blokkeren; verbergt geen bestaande schooldossiers.';

-- ---------------------------------------------------------------------------
-- 2. Leervoortgang en toetsresultaten
--    De completed-guard blijft staan doordat we hem letterlijk meenemen.
-- ---------------------------------------------------------------------------

ALTER POLICY "mission_progress_owner_insert" ON public.mission_progress
  WITH CHECK (
    (auth.uid() = user_id)
    AND (status <> 'completed'::text)
    AND ((school_id IS NULL) OR (school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())))
    AND NOT public.current_user_processing_restricted()
  );

ALTER POLICY "mission_progress_owner_update" ON public.mission_progress
  WITH CHECK (
    (auth.uid() = user_id)
    AND (status <> 'completed'::text)
    AND ((school_id IS NULL) OR (school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())))
    AND NOT public.current_user_processing_restricted()
  );

ALTER POLICY "Leerlingen maken eigen nulmeting" ON public.nulmeting_results
  WITH CHECK (
    (auth.uid() = user_id)
    AND NOT public.current_user_processing_restricted()
  );

ALTER POLICY "Leerlingen updaten eigen nulmeting" ON public.nulmeting_results
  WITH CHECK (
    (auth.uid() = user_id)
    AND NOT public.current_user_processing_restricted()
  );

ALTER POLICY "Leerlingen maken eigen assessment" ON public.assessment_results
  WITH CHECK (
    (auth.uid() = user_id)
    AND ((school_id IS NULL) OR (school_id = COALESCE(public.get_caller_school_id(), (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid()))))
    AND NOT public.current_user_processing_restricted()
  );

ALTER POLICY "Leerlingen updaten eigen assessment" ON public.assessment_results
  WITH CHECK (
    (auth.uid() = user_id)
    AND ((school_id IS NULL) OR (school_id = COALESCE(public.get_caller_school_id(), (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid()))))
    AND NOT public.current_user_processing_restricted()
  );

-- ---------------------------------------------------------------------------
-- 3. Feedback, eigen werk en gedeeld werk
-- ---------------------------------------------------------------------------

ALTER POLICY "Users submit own feedback" ON public.feedback
  WITH CHECK (
    ((user_id)::text = (auth.uid())::text)
    AND NOT public.current_user_processing_restricted()
  );

ALTER POLICY "library_items_owner_insert" ON public.library_items
  WITH CHECK (
    (auth.uid() = user_id)
    AND ((length(TRIM(BOTH FROM name)) >= 1) AND (length(TRIM(BOTH FROM name)) <= 80))
    AND ((school_id IS NULL) OR (school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())))
    AND NOT public.current_user_processing_restricted()
  );

ALTER POLICY "library_items_owner_update" ON public.library_items
  WITH CHECK (
    (auth.uid() = user_id)
    AND NOT public.current_user_processing_restricted()
  );

ALTER POLICY "shared_games_owner_insert" ON public.shared_games
  WITH CHECK (
    (COALESCE((user_id)::text, creator_uid::text) = (auth.uid())::text)
    AND ((length(TRIM(BOTH FROM title)) >= 1) AND (length(TRIM(BOTH FROM title)) <= 80))
    AND ((school_id IS NULL) OR (school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())))
    AND NOT public.current_user_processing_restricted()
  );

-- Deze policy laat ook docenten schrijven. Dat blijft zo: de controle geldt de
-- HUIDIGE gebruiker, en een docent heeft de vlag niet. Alleen de leerling met
-- verwerkingsbeperking wordt geblokkeerd.
ALTER POLICY "shared_games_owner_update" ON public.shared_games
  WITH CHECK (
    ((COALESCE((user_id)::text, creator_uid::text) = (auth.uid())::text) OR public.is_teacher_in_school(school_id))
    AND NOT public.current_user_processing_restricted()
  );

ALTER POLICY "shared_projects_owner_insert" ON public.shared_projects
  WITH CHECK (
    (COALESCE((user_id)::text, (created_by)::text) = (auth.uid())::text)
    AND ((length(TRIM(BOTH FROM name)) >= 1) AND (length(TRIM(BOTH FROM name)) <= 100))
    AND ((school_id IS NULL) OR (school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())))
    AND NOT public.current_user_processing_restricted()
  );

-- ---------------------------------------------------------------------------
-- 4. Duels
--    Dit zijn FOR ALL-policies. Door alleen WITH CHECK aan te passen blijft
--    LEZEN van bestaande duels gewoon mogelijk; enkel nieuwe schrijfacties
--    worden geblokkeerd.
-- ---------------------------------------------------------------------------

ALTER POLICY "Participants manage duel challenges" ON public.duel_challenges
  WITH CHECK (
    ((challenger_uid = auth.uid()) OR (challenged_uid = auth.uid()))
    AND NOT public.current_user_processing_restricted()
  );

ALTER POLICY "Participants manage active duels" ON public.active_duels
  WITH CHECK (
    ((player1_uid = auth.uid()) OR (player2_uid = auth.uid()))
    AND NOT public.current_user_processing_restricted()
  );
