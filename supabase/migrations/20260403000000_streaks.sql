-- Daily streak tracking for student motivation
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_date date;

-- RPC to atomically update streak on login/activity
CREATE OR REPLACE FUNCTION update_streak(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last date;
  v_current int;
  v_longest int;
  v_today date := current_date;
BEGIN
  SELECT last_active_date, current_streak, longest_streak
    INTO v_last, v_current, v_longest
    FROM profiles WHERE id = p_user_id;

  IF v_last = v_today THEN
    -- Already active today, no-op
    RETURN json_build_object('current_streak', v_current, 'longest_streak', v_longest, 'updated', false);
  ELSIF v_last = v_today - 1 THEN
    -- Consecutive day: increment
    v_current := v_current + 1;
  ELSE
    -- Gap: reset
    v_current := 1;
  END IF;

  IF v_current > v_longest THEN
    v_longest := v_current;
  END IF;

  UPDATE profiles
     SET current_streak = v_current,
         longest_streak = v_longest,
         last_active_date = v_today
   WHERE id = p_user_id;

  RETURN json_build_object('current_streak', v_current, 'longest_streak', v_longest, 'updated', true);
END;
$$;
