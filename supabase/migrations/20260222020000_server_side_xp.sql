-- ===========================================================================
-- FINDING #5 FIX: Server-side XP rate limiting & atomic award function
-- ===========================================================================
-- Problem: XP rate limiting was client-side only. Any user could bypass it
-- by calling the Supabase API directly to set their XP to any value.
--
-- Solution:
--   1. xp_transactions table for logging all XP awards
--   2. award_xp RPC function with server-side enforcement:
--      - auth.uid() must match the target user
--      - Per-action cap: 25 XP
--      - Daily cap: 200 XP (rolling 24h window)
--      - FOR UPDATE row lock to prevent TOCTOU races
--   3. RLS policy on users.stats to block direct client writes
-- ===========================================================================

-- 1. Create xp_transactions table (idempotent)
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount      integer NOT NULL CHECK (amount > 0 AND amount <= 25),
    source      text NOT NULL,
    mission_id  text,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for the daily-cap query (user + time range)
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_day
    ON public.xp_transactions (user_id, created_at DESC);

-- 2. RLS on xp_transactions: users can read their own rows, never insert/update/delete directly
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own xp_transactions" ON public.xp_transactions;
CREATE POLICY "Users can read own xp_transactions"
    ON public.xp_transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for authenticated users.
-- Only the award_xp function (running as SECURITY DEFINER) can insert rows.

-- 3. Block direct writes to the stats column on the users table.
--    We use a trigger rather than an RLS policy because the users table likely
--    already has RLS policies allowing self-updates for other columns (display_name,
--    avatar_config, etc.). A trigger specifically targets the stats column.

CREATE OR REPLACE FUNCTION public.protect_stats_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_caller_role text;
BEGIN
    -- Allow if called from a SECURITY DEFINER context (i.e., our RPC function).
    -- current_setting('role') is 'authenticated' for normal client calls,
    -- but the SECURITY DEFINER function runs as the function owner (postgres/supabase_admin).
    IF current_setting('role', true) = 'authenticated' THEN
        -- If the stats column is being changed, check who is doing it.
        IF OLD.stats IS DISTINCT FROM NEW.stats THEN
            -- Allow teachers and admins to modify stats directly (for reset, badges, etc.)
            SELECT role INTO v_caller_role
              FROM public.users
             WHERE id = auth.uid();

            IF v_caller_role IN ('teacher', 'admin') THEN
                RETURN NEW;
            END IF;

            -- Block students from directly modifying stats — they must use award_xp RPC.
            RAISE EXCEPTION 'Direct modification of stats is not allowed. Use the award_xp function.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_stats_column ON public.users;
CREATE TRIGGER trg_protect_stats_column
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_stats_column();

-- 4. Level calculation helper (same thresholds as client)
CREATE OR REPLACE FUNCTION public.calculate_level(xp_amount integer)
RETURNS integer
LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
    thresholds integer[] := ARRAY[
        0, 50, 105, 165, 231, 304, 384, 472, 569, 676,
        793, 922, 1064, 1220, 1392, 1581, 1789, 2018, 2270, 2547
    ];
    i integer;
BEGIN
    FOR i IN REVERSE array_upper(thresholds, 1)..1 LOOP
        IF xp_amount >= thresholds[i] THEN
            RETURN LEAST(i, 50);
        END IF;
    END LOOP;
    RETURN 1;
END;
$$;

-- 5. The main award_xp RPC function
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
    -- A. Verify the caller is the target user
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL OR v_caller_id != p_user_id THEN
        RETURN jsonb_build_object(
            'awarded', false,
            'reason',  'Niet geautoriseerd: je kunt alleen XP aan jezelf toekennen'
        );
    END IF;

    -- B. Validate and cap the requested amount (per-action cap: 25 XP)
    IF p_amount <= 0 THEN
        RETURN jsonb_build_object('awarded', false, 'reason', 'Ongeldig XP bedrag');
    END IF;
    v_capped_amount := LEAST(p_amount, 25);

    -- C. Check daily cap (200 XP in rolling 24h window)
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

    -- D. Lock the user row to prevent concurrent race conditions
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

    -- E. Update the user's stats (this bypasses the trigger because we run as SECURITY DEFINER)
    UPDATE public.users
       SET stats = v_current_stats
                   || jsonb_build_object('xp', v_new_xp, 'level', v_new_level),
           updated_at = now()
     WHERE id = p_user_id;

    -- F. Log the transaction (also bypasses client RLS since SECURITY DEFINER)
    INSERT INTO public.xp_transactions (user_id, amount, source, mission_id)
    VALUES (p_user_id, v_final_amount, p_source, p_mission_id);

    -- G. Return result
    RETURN jsonb_build_object(
        'awarded',  true,
        'newxp',    v_new_xp,
        'newlevel', v_new_level,
        'awarded_amount', v_final_amount
    );
END;
$$;

-- Restrict execution of the function to authenticated users only
REVOKE ALL ON FUNCTION public.award_xp(uuid, integer, text, text) FROM public;
REVOKE ALL ON FUNCTION public.award_xp(uuid, integer, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.award_xp(uuid, integer, text, text) TO authenticated;

-- 6. Optional: rate-limit check helper for client preflight (informational only)
CREATE OR REPLACE FUNCTION public.check_xp_rate_limit(
    p_user_id uuid,
    p_amount  integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_daily_total integer;
    v_remaining   integer;
BEGIN
    IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
        RETURN jsonb_build_object('allowed', false, 'reason', 'Niet geautoriseerd');
    END IF;

    SELECT COALESCE(SUM(amount), 0)
      INTO v_daily_total
      FROM public.xp_transactions
     WHERE user_id = p_user_id
       AND created_at > now() - interval '24 hours';

    v_remaining := GREATEST(0, 200 - v_daily_total);

    RETURN jsonb_build_object(
        'allowed',   v_remaining > 0,
        'remaining', v_remaining,
        'daily_total', v_daily_total
    );
END;
$$;

REVOKE ALL ON FUNCTION public.check_xp_rate_limit(uuid, integer) FROM public;
REVOKE ALL ON FUNCTION public.check_xp_rate_limit(uuid, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.check_xp_rate_limit(uuid, integer) TO authenticated;
