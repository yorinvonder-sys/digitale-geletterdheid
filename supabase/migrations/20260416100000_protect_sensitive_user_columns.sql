-- Protect sensitive columns on public.users from direct client-side modification.
--
-- Background: The RLS policy `users_update_own_or_teacher` (migration
-- 20260301170000, lines 103-114) allows any authenticated user to UPDATE their
-- own row with `auth.uid() = id`. It has no column-level restriction. The
-- `protect_stats_column` trigger (20260227300000) guards the `stats` column, but
-- `role`, `school_id`, and `email` are unprotected. A malicious teacher (or any
-- authenticated user) could craft:
--
--   supabase.from('users').update({ role: 'admin' }).eq('id', myUid)
--
-- and self-promote. This migration adds a BEFORE UPDATE trigger that blocks
-- direct changes to these columns unless the caller explicitly sets a bypass
-- flag via set_config (the same pattern used by protect_stats_column).
--
-- Bypass: SECURITY DEFINER functions that legitimately need to change these
-- columns (e.g., a future admin-promote RPC) must call:
--
--   PERFORM set_config('app.bypass_sensitive_column_protection', 'true', true);
--
-- before their UPDATE statement. The flag is transaction-scoped (SET LOCAL).
--
-- Downstream effects:
--   * All existing client-side code that updates users (TeacherFirstLoginWizard,
--     update_student_stats RPC, UserProfile component) only writes to
--     display_name, stats, student_class, year_group — unaffected.
--   * Supabase Auth manages email changes through auth.users, not public.users.
--   * Yorin's admin actions via the Supabase dashboard use the service role,
--     which bypasses RLS entirely — unaffected.
--   * Edge functions using service_role_key create their own client and bypass
--     RLS — unaffected.

CREATE OR REPLACE FUNCTION public.protect_sensitive_columns()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Allow SECURITY DEFINER functions to bypass via transaction-local flag.
    IF current_setting('app.bypass_sensitive_column_protection', true) = 'true' THEN
        RETURN NEW;
    END IF;

    -- Block direct changes to role (privilege escalation prevention).
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        RAISE EXCEPTION 'Direct modification of role is not allowed. Use admin tools or a SECURITY DEFINER function.';
    END IF;

    -- Block direct changes to school_id (school-scoping integrity).
    IF OLD.school_id IS DISTINCT FROM NEW.school_id THEN
        RAISE EXCEPTION 'Direct modification of school_id is not allowed. School assignment is managed by administrators.';
    END IF;

    -- Block direct changes to email (managed by Supabase Auth, not public.users).
    IF OLD.email IS DISTINCT FROM NEW.email THEN
        RAISE EXCEPTION 'Direct modification of email is not allowed. Email changes are managed through authentication.';
    END IF;

    RETURN NEW;
END;
$$;

-- Fire BEFORE UPDATE so the row is never actually written with bad values.
-- Multiple BEFORE UPDATE triggers on the same table fire in alphabetical order
-- by trigger name. This trigger (protect_sensitive_columns_trigger) fires after
-- the existing protect_stats_column_trigger — both must pass for the UPDATE to
-- proceed.
DROP TRIGGER IF EXISTS protect_sensitive_columns_trigger ON public.users;
CREATE TRIGGER protect_sensitive_columns_trigger
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_sensitive_columns();

-- Verify: list all BEFORE UPDATE triggers on users for operator audit.
-- (This is a DO block that logs to server console; no schema change.)
DO $$
BEGIN
    RAISE NOTICE 'Active BEFORE UPDATE triggers on public.users:';
    PERFORM tgname FROM pg_trigger
        WHERE tgrelid = 'public.users'::regclass
          AND tgtype & 16 = 16  -- BEFORE
          AND NOT tgisinternal;
END;
$$;
