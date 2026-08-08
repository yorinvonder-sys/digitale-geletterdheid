-- Server-vastgelegde missiescores.
-- Besluit 1A uit docs/rfcs/20260808-server-vastgelegde-scores.md: de score is een
-- signaal voor de docent, geen cijfer.
--
-- Uitgangssituatie (gemeten op productie, 2026-08-08):
--   * status is al beschermd -- een CHECK op een witte lijst, plus RLS-regels die
--     'completed' weigeren bij zowel INSERT als UPDATE.
--   * score is dat NIET: geen grens, geen kolomrecht. Een leerling kan een
--     willekeurig getal op de eigen rij zetten en die daarna via de RPC laten
--     afronden; de RPC liet score ongemoeid.
--   * De kolom is nooit gebruikt: 0 van de 110 rijen had een waarde.
--
-- Na deze migratie schrijft alleen mark_mission_completed() nog status, score en
-- attempts. De leerling houdt schrijfrecht op het eigen werk (progress_data en de
-- projectvelden), zodat opslaan tijdens een opdracht blijft werken.

-- Supabase draait elke migratie zelf in een transactie; een eigen BEGIN/COMMIT
-- hier zou die juist voortijdig afsluiten.

-- 1. Pogingenteller. 0 betekent: nog nooit afgerond.
ALTER TABLE public.mission_progress
  ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.mission_progress.attempts IS
  'Aantal keren dat deze missie is afgerond. Alleen geschreven door mark_mission_completed().';

-- 2. score wordt een percentage (0-100).
--    Missies hebben uiteenlopende maxima (25, 30, 40, 50, 55, 60, 85, 100), dus een
--    absolute score valt server-side niet te begrenzen zonder dat maximum te
--    vertrouwen -- en dat komt van de client. Een percentage is dat wel.
ALTER TABLE public.mission_progress
  DROP CONSTRAINT IF EXISTS mission_progress_score_percent_range;

ALTER TABLE public.mission_progress
  ADD CONSTRAINT mission_progress_score_percent_range
  CHECK (score IS NULL OR (score >= 0 AND score <= 100));

COMMENT ON COLUMN public.mission_progress.score IS
  'Percentage 0-100 van de laatst afgeronde poging, hoogste telt. Alleen geschreven door mark_mission_completed().';

-- 3. Kolomrechten: de leerling bewaart eigen werk, de server bepaalt de uitkomst.
--    SELECT en DELETE blijven ongemoeid (het docentdashboard leest, en een
--    voortgangsreset verwijdert de rij).
--    anon blijft ongemoeid: die heeft geen auth.uid() en komt langs geen enkele
--    RLS-regel op deze tabel.
REVOKE INSERT, UPDATE ON public.mission_progress FROM authenticated;

--    user_id en mission_id staan in de UPDATE-lijst omdat een upsert via PostgREST
--    elke meegestuurde kolom ook in het DO UPDATE-deel zet, inclusief de sleutel
--    waarop het conflict draait. RLS dwingt daar los van af dat user_id gelijk is
--    aan de ingelogde gebruiker.
GRANT INSERT (user_id, mission_id, school_id, progress_data, game_code, book_data, created_at, updated_at)
  ON public.mission_progress TO authenticated;

GRANT UPDATE (user_id, mission_id, school_id, progress_data, game_code, book_data, updated_at)
  ON public.mission_progress TO authenticated;

-- 4. De RPC legt de uitkomst vast.
DROP FUNCTION IF EXISTS public.mark_mission_completed(text);

CREATE OR REPLACE FUNCTION public.mark_mission_completed(
  p_mission_id text,
  p_score_percent integer DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mission_id text;
  v_existing jsonb;
  v_completed jsonb;
  v_school_id text;
  v_score integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  v_mission_id := lower(trim(coalesce(p_mission_id, '')));

  IF v_mission_id !~ '^[a-z0-9][a-z0-9-]{0,99}$' THEN
    RAISE EXCEPTION 'Invalid mission id';
  END IF;

  -- Buiten bereik is geen fout maar een klem: een opdracht die zich verrekent mag
  -- geen voltooiing tegenhouden.
  IF p_score_percent IS NOT NULL THEN
    v_score := least(100, greatest(0, p_score_percent));
  END IF;

  SELECT coalesce(stats, '{}'::jsonb), school_id
    INTO v_existing, v_school_id
  FROM public.users
  WHERE id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  v_completed := coalesce(v_existing->'missionsCompleted', '[]'::jsonb);
  IF jsonb_typeof(v_completed) <> 'array' THEN
    v_completed := '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(v_completed) AS completed(value)
    WHERE completed.value = v_mission_id
  ) THEN
    v_completed := v_completed || to_jsonb(v_mission_id);
  END IF;

  IF jsonb_array_length(v_completed) > 200 THEN
    RAISE EXCEPTION 'Too many completed missions';
  END IF;

  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET stats = jsonb_set(v_existing, '{missionsCompleted}', v_completed, true),
      last_login = now()
  WHERE id = auth.uid();

  PERFORM set_config('app.bypass_stats_protection', 'false', true);

  INSERT INTO public.mission_progress (
    user_id,
    mission_id,
    school_id,
    progress_data,
    status,
    score,
    attempts,
    updated_at
  )
  VALUES (
    auth.uid(),
    v_mission_id,
    v_school_id,
    jsonb_build_object('completedAt', now(), 'source', 'mark_mission_completed'),
    'completed',
    v_score,
    1,
    now()
  )
  ON CONFLICT (user_id, mission_id)
  DO UPDATE SET
    school_id = EXCLUDED.school_id,
    progress_data = coalesce(public.mission_progress.progress_data, '{}'::jsonb) || EXCLUDED.progress_data,
    status = 'completed',
    -- Hoogste poging telt. Een leerling die opnieuw oefent gaat er nooit op achteruit.
    score = CASE
              WHEN v_score IS NULL THEN public.mission_progress.score
              ELSE greatest(coalesce(public.mission_progress.score, 0), v_score)
            END,
    attempts = public.mission_progress.attempts + 1,
    updated_at = now();

  RETURN jsonb_build_object(
    'completed', true,
    'missionId', v_mission_id,
    'missionsCompleted', v_completed
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_mission_completed(text, integer) TO authenticated;

