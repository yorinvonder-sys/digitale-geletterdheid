-- ===========================================================================
-- XP SPENDING: separate ledger so XP can be spent without corrupting earnings
-- ===========================================================================
-- Problem: spending XP (AI-Lab tips, avatar shop) was implemented by calling
-- award_xp with a negative amount. award_xp rejects any amount <= 0, so:
--   1. nothing was ever deducted (tips and shop items were effectively free)
--   2. the learner saw the rejection reason as a red error message
--
-- Why not allow negative amounts in xp_transactions:
--   award_xp derives the rolling 24h earning cap from SUM(amount) over that
--   table. A negative row would *increase* the remaining daily allowance, so
--   spending XP would hand out extra earning headroom. That is a real
--   regression, not a theoretical one.
--
-- Solution: a separate append-only ledger (xp_spends) plus a SECURITY DEFINER
-- spend_xp function. Spendable balance = stats.xp - SUM(xp_spends.amount).
--
-- stats.xp is deliberately NEVER lowered. It represents lifetime earned XP and
-- drives level, badges (e.g. "500 XP") and the leaderboard; lowering it would
-- demote learners and corrupt those surfaces.
--
-- Note on placement: the balance is kept OUT of users.stats on purpose.
-- update_student_stats merges arbitrary client-supplied JSON and only forces
-- xp/level back to their server values, so any spend counter stored inside
-- stats would be client-writable — a learner could reset it to 0 and buy
-- everything for free. A dedicated table with no client write policy cannot be
-- tampered with.
-- ===========================================================================

-- 1. Append-only spend ledger
CREATE TABLE IF NOT EXISTS public.xp_spends (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount     integer NOT NULL CHECK (amount > 0 AND amount <= 10000),
    reason     text NOT NULL,
    ref_id     text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for the balance query (SUM per user) and history listings.
CREATE INDEX IF NOT EXISTS idx_xp_spends_user
    ON public.xp_spends (user_id, created_at DESC);

-- 2. RLS: learners may read their own spends, never write them.
ALTER TABLE public.xp_spends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own xp_spends" ON public.xp_spends;
CREATE POLICY "Users can read own xp_spends"
    ON public.xp_spends
    FOR SELECT
    USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for authenticated users.
-- Only spend_xp (SECURITY DEFINER) may insert rows.

-- 3. spend_xp: atomically check balance and record the spend.
--    Takes no user id — the caller is always auth.uid(), so there is no way to
--    spend on behalf of someone else.
CREATE OR REPLACE FUNCTION public.spend_xp(
    p_amount integer,
    p_reason text,
    p_ref_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid;
    v_earned  integer;
    v_spent   integer;
    v_balance integer;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('spent', false, 'reason', 'Niet ingelogd');
    END IF;

    IF p_amount IS NULL OR p_amount <= 0 OR p_amount > 10000 THEN
        RETURN jsonb_build_object('spent', false, 'reason', 'Ongeldig XP bedrag');
    END IF;

    IF p_reason IS NULL OR length(btrim(p_reason)) = 0 THEN
        RETURN jsonb_build_object('spent', false, 'reason', 'Ongeldige reden');
    END IF;

    -- Lock the user row for the duration of the transaction. award_xp locks the
    -- same row, so concurrent earn/spend calls serialise instead of racing
    -- (prevents double-spend on a rapid double click).
    SELECT COALESCE((stats->>'xp')::integer, 0)
      INTO v_earned
      FROM public.users
     WHERE id = v_user_id
       FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('spent', false, 'reason', 'Gebruiker niet gevonden');
    END IF;

    SELECT COALESCE(SUM(amount), 0)
      INTO v_spent
      FROM public.xp_spends
     WHERE user_id = v_user_id;

    v_balance := v_earned - v_spent;

    IF v_balance < p_amount THEN
        RETURN jsonb_build_object(
            'spent',   false,
            'reason',  'Niet genoeg XP',
            'balance', v_balance
        );
    END IF;

    INSERT INTO public.xp_spends (user_id, amount, reason, ref_id)
    VALUES (v_user_id, p_amount, left(p_reason, 100), left(p_ref_id, 200));

    RETURN jsonb_build_object(
        'spent',   true,
        'amount',  p_amount,
        'balance', v_balance - p_amount,
        'earned',  v_earned
    );
END;
$$;

REVOKE ALL ON FUNCTION public.spend_xp(integer, text, text) FROM public;
REVOKE ALL ON FUNCTION public.spend_xp(integer, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.spend_xp(integer, text, text) TO authenticated;

-- 4. get_xp_balance: one round trip for the spendable balance.
--    Clients could sum xp_spends themselves via the SELECT policy, but that
--    fetches every row on each load; this returns the aggregate directly.
CREATE OR REPLACE FUNCTION public.get_xp_balance()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid;
    v_earned  integer;
    v_spent   integer;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('earned', 0, 'spent', 0, 'balance', 0);
    END IF;

    SELECT COALESCE((stats->>'xp')::integer, 0)
      INTO v_earned
      FROM public.users
     WHERE id = v_user_id;

    SELECT COALESCE(SUM(amount), 0)
      INTO v_spent
      FROM public.xp_spends
     WHERE user_id = v_user_id;

    v_earned := COALESCE(v_earned, 0);

    RETURN jsonb_build_object(
        'earned',  v_earned,
        'spent',   v_spent,
        'balance', v_earned - v_spent
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_xp_balance() FROM public;
REVOKE ALL ON FUNCTION public.get_xp_balance() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_xp_balance() TO authenticated;
