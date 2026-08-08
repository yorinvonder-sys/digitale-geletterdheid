-- Leerlingwerk blijft bewaard na het afronden van een opdracht.
--
-- HET PROBLEEM (gemeten op productie, 2026-08-08)
--
-- De policy mission_progress_owner_update draagt op productie `status <> 'completed'`
-- in ZOWEL de USING- als de WITH CHECK-clausule. USING wordt op de BESTAANDE rij
-- toegepast, vóór er iets gezet wordt. Een rij met status = 'completed' is daardoor
-- door de eigenaar niet meer bij te werken -- ongeacht welke kolommen de client
-- meestuurt. Empirisch vastgesteld met een rolwissel naar `authenticated`:
--
--   UPDATE van alleen progress_data ............ geen fout, 0 rijen
--   UPDATE die ook status='in_progress' zet .... geen fout, 0 rijen
--   upsert zonder status ....................... 42501 (USING expression)
--   upsert met status='in_progress' ............ 42501 (USING expression)
--   controle op een niet-voltooide rij ......... geslaagd, 1 rij
--
-- Let op: die USING-clausule staat in GEEN ENKEL migratiebestand. De migraties
-- zetten `status <> 'completed'` alleen in WITH CHECK
-- (20260805104252_enforce_processing_restriction_in_rls.sql:85-91). Productie is
-- dus afgedreven van wat hier is vastgelegd. Deze migratie repareert dat verschil
-- BEWUST NIET -- de guard zelf is gewenst en aanpassen ervan is een apart besluit.
--
-- WAT DAT KOST
--
-- AiLab.tsx zet game-programmeur, verhalen-ontwerper, logica-legende en de
-- AI-trainer automatisch op voltooid zodra de stappen klaar zijn, terwijl de
-- leerling in diezelfde werkbank doorwerkt. Elke autosave daarna
-- (useAgentLogic.ts, 1s debounce) mislukt stil: de fout wordt afgevangen met
-- alleen een console.error, geen aanroeper leest de retourwaarde, en voor deze
-- vier bestaat geen lokale reservekopie. Alles wat na de voltooiing is gemaakt,
-- is weg bij herladen of op een ander apparaat.
--
-- DE OPLOSSING
--
-- Een smalle uitzondering met serverrechten, in dezelfde vorm als
-- mark_mission_completed: de leerling mag zijn eigen WERK blijven opslaan, maar
-- raakt status, score en attempts niet aan. De anti-spoofingguard blijft dus
-- volledig staan voor alles wat de docent ziet.

CREATE OR REPLACE FUNCTION public.save_mission_progress(
  p_mission_id text,
  p_progress_data jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mission_id text;
  v_school_id text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Zelfde verwerkingsbeperking als de RLS-policies afdwingen (AVG art. 18).
  -- Zonder deze regel zou de uitzondering die guard omzeilen.
  IF public.current_user_processing_restricted() THEN
    RAISE EXCEPTION 'Processing restricted';
  END IF;

  v_mission_id := lower(trim(coalesce(p_mission_id, '')));

  IF v_mission_id !~ '^[a-z0-9][a-z0-9-]{0,99}$' THEN
    RAISE EXCEPTION 'Invalid mission id';
  END IF;

  IF p_progress_data IS NULL OR jsonb_typeof(p_progress_data) <> 'object' THEN
    RAISE EXCEPTION 'Invalid progress data';
  END IF;

  -- Ruim bemeten: hier zit game-code, boekdata en trainerconfiguratie in.
  IF pg_column_size(p_progress_data) > 1048576 THEN
    RAISE EXCEPTION 'Progress too large';
  END IF;

  SELECT school_id INTO v_school_id
  FROM public.users
  WHERE id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  INSERT INTO public.mission_progress (
    user_id, mission_id, school_id, progress_data, updated_at
  )
  VALUES (
    auth.uid(), v_mission_id, v_school_id, p_progress_data, now()
  )
  ON CONFLICT (user_id, mission_id)
  DO UPDATE SET
    school_id = EXCLUDED.school_id,
    progress_data = EXCLUDED.progress_data,
    updated_at = now();
  -- status, score en attempts blijven expliciet ongemoeid: die horen bij
  -- mark_mission_completed en mogen niet langs deze weg beweegbaar zijn.
END;
$$;

COMMENT ON FUNCTION public.save_mission_progress(text, jsonb) IS
  'Bewaart eigen leerlingwerk, ook nadat de opdracht is afgerond. Raakt status, score en attempts niet aan.';

REVOKE ALL ON FUNCTION public.save_mission_progress(text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_mission_progress(text, jsonb) TO authenticated;
