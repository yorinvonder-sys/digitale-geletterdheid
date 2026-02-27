-- Fix: protect_stats_column trigger blocked SECURITY DEFINER functions.
--
-- Root cause: current_setting('role') remains 'authenticated' inside SECURITY DEFINER
-- functions in Supabase/PostgREST — the GUC is transaction-scoped and is not reset
-- when switching security context. This means the trigger blocked update_student_stats
-- and award_xp even though they are authorized SECURITY DEFINER functions.
--
-- Solution: use set_config('app.bypass_stats_protection', 'true', true) (SET LOCAL,
-- transaction-scoped) as a bypass flag. The trigger checks this flag first.
-- The flag is set inside each SECURITY DEFINER function before the UPDATE.

-- 1. Rewrite trigger to check the bypass flag first.
CREATE OR REPLACE FUNCTION public.protect_stats_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_caller_role text;
BEGIN
    -- Allow SECURITY DEFINER functions (update_student_stats, award_xp) to bypass.
    -- They set this flag via set_config before their UPDATE statement.
    IF current_setting('app.bypass_stats_protection', true) = 'true' THEN
        RETURN NEW;
    END IF;

    -- Block direct client writes to the stats column.
    IF OLD.stats IS DISTINCT FROM NEW.stats THEN
        -- Teachers and admins may modify stats directly (e.g. for resets, badges).
        SELECT role INTO v_caller_role
          FROM public.users
         WHERE id = auth.uid();

        IF v_caller_role IN ('teacher', 'admin') THEN
            RETURN NEW;
        END IF;

        RAISE EXCEPTION 'Direct modification of stats is not allowed. Use the award_xp or update_student_stats function.';
    END IF;

    RETURN NEW;
END;
$$;

-- 2. Rewrite update_student_stats to set the bypass flag before the UPDATE.
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

  -- Set bypass flag so the protect_stats_column trigger allows this update.
  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET
    stats      = v_merged,
    last_login = now()
  WHERE id = auth.uid();

  PERFORM set_config('app.bypass_stats_protection', 'false', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_student_stats(jsonb) TO authenticated;

-- 3. Rewrite award_xp to also set the bypass flag.
CREATE OR REPLACE FUNCTION public.award_xp(
    p_user_id uuid,
    p_amount  integer,
    p_source  text,
    p_mission_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_caller_id     uuid;
    v_capped_amount integer;
    v_daily_total   integer;
    v_remaining     integer;
    v_final_amount  integer;
    v_current_stats jsonb;
    v_current_xp    integer;
    v_new_xp        integer;
    v_new_level     integer;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL OR v_caller_id != p_user_id THEN
        RETURN jsonb_build_object(
            'awarded', false,
            'reason',  'Niet geautoriseerd: je kunt alleen XP aan jezelf toekennen'
        );
    END IF;

    IF p_amount <= 0 THEN
        RETURN jsonb_build_object('awarded', false, 'reason', 'Ongeldig XP bedrag');
    END IF;
    v_capped_amount := LEAST(p_amount, 25);

    SELECT COALESCE(SUM(amount), 0)
      INTO v_daily_total
      FROM public.xp_transactions
     WHERE user_id = p_user_id
       AND created_at > now() - interval '24 hours';

    IF v_daily_total >= 200 THEN
        RETURN jsonb_build_object(
            'awarded', false,
            'reason',  'Dagelijks XP limiet bereikt (200 XP per 24 uur)'
        );
    END IF;

    v_remaining := 200 - v_daily_total;
    v_final_amount := LEAST(v_capped_amount, v_remaining);

    SELECT stats
      INTO v_current_stats
      FROM public.users
     WHERE id = p_user_id
       FOR UPDATE;

    IF v_current_stats IS NULL THEN
        v_current_stats := '{"xp": 0, "level": 1}'::jsonb;
    END IF;

    v_current_xp := COALESCE((v_current_stats->>'xp')::integer, 0);
    v_new_xp     := v_current_xp + v_final_amount;
    v_new_level  := public.calculate_level(v_new_xp);

    -- Set bypass flag so the protect_stats_column trigger allows this update.
    PERFORM set_config('app.bypass_stats_protection', 'true', true);

    UPDATE public.users
       SET stats = v_current_stats
                   || jsonb_build_object('xp', v_new_xp, 'level', v_new_level),
           updated_at = now()
     WHERE id = p_user_id;

    PERFORM set_config('app.bypass_stats_protection', 'false', true);

    INSERT INTO public.xp_transactions (user_id, amount, source, mission_id)
    VALUES (p_user_id, v_final_amount, p_source, p_mission_id);

    RETURN jsonb_build_object(
        'awarded',  true,
        'newxp',    v_new_xp,
        'newlevel', v_new_level,
        'awarded_amount', v_final_amount
    );
END;
$$;

REVOKE ALL ON FUNCTION public.award_xp(uuid, integer, text, text) FROM public;
REVOKE ALL ON FUNCTION public.award_xp(uuid, integer, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.award_xp(uuid, integer, text, text) TO authenticated;
