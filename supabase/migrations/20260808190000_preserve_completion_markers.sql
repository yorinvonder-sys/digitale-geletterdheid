-- save_mission_progress laat de afrondmarkering staan.
--
-- HET PROBLEEM
--
-- mark_mission_completed schrijft `{completedAt, source}` in progress_data en
-- voegt dat samen met wat er al stond (`||`), zodat het werk van de leerling
-- niet wordt overschreven. save_mission_progress deed het omgekeerde:
-- `progress_data = EXCLUDED.progress_data`, een volledige vervanging. De
-- eerstvolgende autosave na een voltooiing wiste die markering dus stil.
--
-- Vandaag leest niets in de codebase die twee sleutels -- nagetrokken over de
-- hele repo; de enige treffers op `completedAt` horen bij nulmeting/assessment,
-- een andere tabel. Er gaat op dit moment dus niets kapot. Het wordt hier
-- rechtgezet voordat er iets op gaat leunen, niet omdat er nu iets stuk is.
--
-- WAAROM GEEN GEWONE SAMENVOEGING
--
-- `progress_data = <bestaand> || EXCLUDED.progress_data` ligt voor de hand maar
-- is fout voor deze functie. De client stuurt hier de VOLLEDIGE voortgang mee,
-- niet een aanvulling. Bij samenvoegen zou een sleutel die de leerling juist
-- weghaalt voor altijd blijven staan -- een bron van spookdata die moeilijk te
-- vinden is. De vervanging blijft dus de regel; alleen de twee markeringen die
-- de server zelf schreef worden overgezet.

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
    -- Vervangen blijft de regel; alleen wat de server zelf schreef gaat mee.
    -- jsonb_strip_nulls haalt de sleutels weg die op de bestaande rij ontbreken,
    -- zodat er geen `"completedAt": null` ontstaat op een niet-afgeronde rij.
    progress_data = EXCLUDED.progress_data || coalesce(
      jsonb_strip_nulls(
        jsonb_build_object(
          'completedAt', public.mission_progress.progress_data -> 'completedAt',
          'source',      public.mission_progress.progress_data -> 'source'
        )
      ),
      '{}'::jsonb
    ),
    updated_at = now();
  -- status, score en attempts blijven expliciet ongemoeid: die horen bij
  -- mark_mission_completed en mogen niet langs deze weg beweegbaar zijn.
END;
$$;

COMMENT ON FUNCTION public.save_mission_progress(text, jsonb) IS
  'Bewaart eigen leerlingwerk, ook nadat de opdracht is afgerond. Behoudt de afrondmarkering en raakt status, score en attempts niet aan.';
