DROP FUNCTION IF EXISTS public.complete_mission(text);

CREATE OR REPLACE FUNCTION public.mark_mission_completed(p_mission_id text)
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
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  v_mission_id := lower(trim(coalesce(p_mission_id, '')));

  IF v_mission_id !~ '^[a-z0-9][a-z0-9-]{0,99}$' THEN
    RAISE EXCEPTION 'Invalid mission id';
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
    updated_at
  )
  VALUES (
    auth.uid(),
    v_mission_id,
    v_school_id,
    jsonb_build_object('completedAt', now(), 'source', 'mark_mission_completed'),
    'completed',
    NULL,
    now()
  )
  ON CONFLICT (user_id, mission_id)
  DO UPDATE SET
    school_id = EXCLUDED.school_id,
    progress_data = coalesce(public.mission_progress.progress_data, '{}'::jsonb) || EXCLUDED.progress_data,
    status = 'completed',
    updated_at = now();

  RETURN jsonb_build_object(
    'completed', true,
    'missionId', v_mission_id,
    'missionsCompleted', v_completed
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_mission_completed(text) TO authenticated;
