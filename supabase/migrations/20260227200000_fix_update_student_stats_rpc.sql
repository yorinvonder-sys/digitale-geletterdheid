-- Fix: update_student_stats referenced non-existent column `last_active`.
-- The correct column is `last_login`.

CREATE OR REPLACE FUNCTION public.update_student_stats(p_stats jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_xp    integer;
  v_existing_level integer;
  v_merged         jsonb;
BEGIN
  SELECT
    COALESCE((stats->>'xp')::integer, 0),
    COALESCE((stats->>'level')::integer, 1)
  INTO v_existing_xp, v_existing_level
  FROM public.users
  WHERE id = auth.uid();

  v_merged := p_stats
    || jsonb_build_object('xp', v_existing_xp, 'level', v_existing_level);

  UPDATE public.users
  SET
    stats      = v_merged,
    last_login = now()
  WHERE id = auth.uid();
END;
$$;
