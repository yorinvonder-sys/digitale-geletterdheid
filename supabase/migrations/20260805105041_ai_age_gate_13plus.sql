-- AI 13+ leeftijdspoort
-- Mistral AI (Commercial Terms 2.2(c) / Consumer ToS) en Black Forest Labs
-- (ToS 1.2) staan kinderen jonger dan 13 NIET toe, ook niet met ouderlijke
-- toestemming. Daarom mag leerlingdata van <13 niet naar deze AI-providers.
--
-- Deze migratie plaatst de kolom (bestaat al op deze database) en de
-- SECURITY DEFINER-functie die per leerling teruggeeft of AI-toegang is
-- toegestaan. De geboortedatum zelf gaat nooit naar client of AI; de functie
-- geeft alleen een boolean terug.
--
-- FAIL-CLOSED: een leerling zonder bekende geboortedatum krijgt GEEN AI-toegang.
--
-- LET OP bij uitrol: op het moment van toepassen roept GEEN ENKELE edge function
-- deze functie aan, en 195 van de 198 leerlingen hebben geen geboortedatum.
-- De poort is dus geplaatst maar niet actief. Activeren mag pas nadat (a) de
-- controle achter een standaard uitgeschakelde vlag is ingebouwd en (b) de
-- geboortedatums via de roster-import zijn gevuld. Zie PR #268.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS date_of_birth date;

COMMENT ON COLUMN public.users.date_of_birth IS
  'Geboortedatum leerling — uitsluitend voor de 13+ AI-leeftijdspoort (provider-ToS Mistral/BFL). Wordt server-side gebruikt via student_ai_age_ok(); niet naar client/AI sturen in de applicatie.';

CREATE OR REPLACE FUNCTION public.student_ai_age_ok(p_student_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_dob  date;
BEGIN
  IF p_student_id IS NULL THEN
    RETURN false;  -- fail-closed: onbekende gebruiker
  END IF;

  SELECT role, date_of_birth
    INTO v_role, v_dob
  FROM public.users
  WHERE id = p_student_id;

  -- Docenten/admins/developers zijn volwassenen: niet leeftijd-gegate.
  IF v_role IS DISTINCT FROM 'student' THEN
    RETURN true;
  END IF;

  -- Leerling: bekende geboortedatum vereist (fail-closed) en minimaal 13 jaar.
  IF v_dob IS NULL THEN
    RETURN false;
  END IF;

  RETURN v_dob <= (current_date - INTERVAL '13 years');
END;
$$;

GRANT EXECUTE ON FUNCTION public.student_ai_age_ok(uuid) TO authenticated;
