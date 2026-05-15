-- ===========================================================================
-- G-09 FIX: Comprehensive Data Retention Policies (AVG Art. 5(1)(e))
-- ===========================================================================
-- This migration enables pg_cron and schedules automated cleanup jobs for
-- tables that accumulate data over time, ensuring compliance with the
-- AVG storage limitation principle.
--
-- Retention periods are proportional to the data's purpose:
--   - Ephemeral data (presence, challenges): hours/days
--   - Operational data (activities, feedback): 1 year
--   - Compliance data (audit logs): 3 years (AVG Art. 30 ROPA requirement)
-- ===========================================================================

-- 1. Ensure pg_cron is available on fresh local databases.
-- Supabase cloud projects usually already provide it; local/staging bootstrap
-- environments may not. If pg_cron cannot be created, skip scheduling instead
-- of blocking the rest of the schema from being validated.
DO $$
BEGIN
    IF to_regnamespace('cron') IS NULL THEN
        BEGIN
            EXECUTE 'CREATE EXTENSION IF NOT EXISTS pg_cron';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'pg_cron is not available in this environment: %', SQLERRM;
        END;
    END IF;
END;
$$;

-- 2. Schedule cron jobs (unschedule first to make idempotent)
DO $retention_cron$
BEGIN
    IF to_regnamespace('cron') IS NULL THEN
        RAISE NOTICE 'Skipping data-retention cron scheduling because schema cron is not available.';
        RETURN;
    END IF;

-- ===========================================================================
-- EPHEMERAL DATA — Very short retention
-- ===========================================================================

-- duel_presence: 1-day retention (online status is ephemeral)
-- Runs every 30 minutes
IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-duel-presence') THEN
    PERFORM cron.unschedule('purge-duel-presence');
END IF;
PERFORM cron.schedule(
    'purge-duel-presence',
    '*/30 * * * *',
    $$DELETE FROM public.duel_presence WHERE online_at < NOW() - INTERVAL '1 day'$$
);

-- duel_challenges: 7-day retention (challenges expire quickly)
-- Runs daily at 05:00 UTC
IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-duel-challenges') THEN
    PERFORM cron.unschedule('purge-duel-challenges');
END IF;
PERFORM cron.schedule(
    'purge-duel-challenges',
    '0 5 * * *',
    $$DELETE FROM public.duel_challenges WHERE created_at < NOW() - INTERVAL '7 days'$$
);

-- active_duels: 7-day retention (finished duels are no longer needed)
-- Runs daily at 05:10 UTC
IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-active-duels') THEN
    PERFORM cron.unschedule('purge-active-duels');
END IF;
PERFORM cron.schedule(
    'purge-active-duels',
    '10 5 * * *',
    $$DELETE FROM public.active_duels WHERE created_at < NOW() - INTERVAL '7 days'$$
);

-- ===========================================================================
-- OPERATIONAL DATA — 1-year retention
-- ===========================================================================

-- student_activities: 1-year retention (activity logs for teacher dashboard)
-- Runs weekly on Sunday at 03:00 UTC
IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-student-activities') THEN
    PERFORM cron.unschedule('purge-student-activities');
END IF;
PERFORM cron.schedule(
    'purge-student-activities',
    '0 3 * * 0',
    $$DELETE FROM public.student_activities WHERE timestamp < NOW() - INTERVAL '1 year'$$
);

-- feedback: 1-year retention (student feedback)
-- Runs weekly on Sunday at 03:30 UTC
IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-feedback') THEN
    PERFORM cron.unschedule('purge-feedback');
END IF;
PERFORM cron.schedule(
    'purge-feedback',
    '30 3 * * 0',
    $$DELETE FROM public.feedback WHERE created_at < NOW() - INTERVAL '1 year'$$
);

-- shared_games: 1-year retention (published student work)
-- Runs weekly on Sunday at 04:00 UTC
IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-shared-games') THEN
    PERFORM cron.unschedule('purge-shared-games');
END IF;
PERFORM cron.schedule(
    'purge-shared-games',
    '0 4 * * 0',
    $$DELETE FROM public.shared_games WHERE created_at < NOW() - INTERVAL '1 year'$$
);

-- ===========================================================================
-- COMPLIANCE DATA — 3-year retention
-- ===========================================================================

-- audit_logs: 3-year retention (AVG Art. 30 requires maintaining records of processing)
-- Runs weekly on Sunday at 04:30 UTC
IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-audit-logs') THEN
    PERFORM cron.unschedule('purge-audit-logs');
END IF;
PERFORM cron.schedule(
    'purge-audit-logs',
    '30 4 * * 0',
    $$DELETE FROM public.audit_logs WHERE created_at < NOW() - INTERVAL '3 years'$$
);
END;
$retention_cron$;
