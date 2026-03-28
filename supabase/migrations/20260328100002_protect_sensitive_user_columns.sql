-- ============================================================================
-- CRIT-4 FIX: Prevent students from modifying sensitive columns on their own
-- user row (role, school_id, must_change_password, chat_locked).
-- ============================================================================
-- Problem: The RLS policy "users_update_own_or_teacher" allows users to update
-- their own row (auth.uid() = id). This means a student can issue:
--
--   supabase.from('users').update({ role: 'teacher' }).eq('id', myId)
--
-- ...and escalate their privileges to teacher/admin. Similarly they could
-- unlock their chat (chat_locked), change their school, or bypass the
-- must_change_password flag.
--
-- Solution: A BEFORE UPDATE trigger that silently resets sensitive columns
-- to their OLD values when the caller is a student. Teachers/admins/developers
-- are unaffected and can still modify these columns for students in their school
-- (already gated by RLS school-scope policies).
--
-- We also harden the existing protect_stats_column trigger to check the JWT
-- role instead of the mutable public.users.role column.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Part A: Trigger to protect sensitive columns from student self-mutation
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.protect_sensitive_user_columns()
RETURNS TRIGGER AS $$
DECLARE
    caller_role text;
BEGIN
    -- Get role from JWT app_metadata (tamper-proof, set by auth system).
    -- Falls back to 'student' if not present (principle of least privilege).
    caller_role := coalesce(
        current_setting('request.jwt.claims', true)::json->'app_metadata'->>'role',
        'student'
    );

    -- Students cannot change sensitive columns.
    -- The trigger silently resets them to the old values rather than raising
    -- an exception, so legitimate profile updates (name, avatar, etc.) still
    -- succeed without the client needing to know about this guard.
    IF caller_role = 'student' THEN
        NEW.role                := OLD.role;
        NEW.school_id           := OLD.school_id;
        NEW.must_change_password := OLD.must_change_password;
        NEW.chat_locked         := OLD.chat_locked;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger (before the existing protect_stats_column trigger
-- so sensitive columns are locked down before stats protection runs).
DROP TRIGGER IF EXISTS trg_protect_sensitive_user_columns ON public.users;
CREATE TRIGGER trg_protect_sensitive_user_columns
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_sensitive_user_columns();

-- ---------------------------------------------------------------------------
-- Part B: Harden protect_stats_column to use JWT role instead of mutable
-- public.users.role column.
-- ---------------------------------------------------------------------------
-- Previous version did:
--   SELECT role INTO v_caller_role FROM public.users WHERE id = auth.uid();
--
-- This is vulnerable because if a student somehow modifies their role column
-- (even transiently), the stats protection would let them through.
-- Now we read from the JWT app_metadata which is set server-side and
-- cannot be tampered with by the client.

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
        -- Get role from JWT app_metadata (tamper-proof) instead of public.users.role.
        v_caller_role := coalesce(
            current_setting('request.jwt.claims', true)::json->'app_metadata'->>'role',
            'student'
        );

        -- Teachers, admins, and developers may modify stats directly.
        IF v_caller_role IN ('teacher', 'admin', 'developer') THEN
            RETURN NEW;
        END IF;

        RAISE EXCEPTION 'Direct modification of stats is not allowed. Use the award_xp or update_student_stats function.';
    END IF;

    RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Verify: both triggers are active on public.users
-- ---------------------------------------------------------------------------
-- trg_protect_sensitive_user_columns — blocks student role/school_id mutation
-- trg_protect_stats_column           — blocks student stats mutation
-- Both fire BEFORE UPDATE, FOR EACH ROW.
