-- Migration: update_student_stats RPC
-- Allows authenticated users (including students) to update their own stats,
-- while preserving xp and level (which are managed server-side via award_xp).
--
-- Background: trg_protect_stats_column blocks direct writes to users.stats for
-- the 'student' role. This SECURITY DEFINER function bypasses that check
-- (same mechanism as award_xp), while still preventing XP/level manipulation.

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
  -- Fetch current xp and level from DB — these must not be overwritten by client input.
  SELECT
    COALESCE((stats->>'xp')::integer, 0),
    COALESCE((stats->>'level')::integer, 1)
  INTO v_existing_xp, v_existing_level
  FROM public.users
  WHERE id = auth.uid();

  -- Merge: start with client input, then overwrite xp/level with DB values.
  v_merged := p_stats
    || jsonb_build_object('xp', v_existing_xp, 'level', v_existing_level);

  UPDATE public.users
  SET
    stats       = v_merged,
    last_active = now()
  WHERE id = auth.uid();
END;
$$;

-- Grant execute to all authenticated users (RLS on the underlying table still applies
-- via auth.uid() = id in the UPDATE statement).
GRANT EXECUTE ON FUNCTION public.update_student_stats(jsonb) TO authenticated;
