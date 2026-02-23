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

-- 1. pg_cron is managed by Supabase — already enabled, no action needed.
-- (Attempting CREATE EXTENSION or GRANT on an existing pg_cron install causes errors.)

-- 2. Schedule cron jobs (unschedule first to make idempotent)

-- ===========================================================================
-- EPHEMERAL DATA — Very short retention
-- ===========================================================================

-- duel_presence: 1-day retention (online status is ephemeral)
-- Runs every 30 minutes
SELECT cron.unschedule('purge-duel-presence') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-duel-presence');
SELECT cron.schedule(
    'purge-duel-presence',
    '*/30 * * * *',
    $$DELETE FROM public.duel_presence WHERE online_at < NOW() - INTERVAL '1 day'$$
);

-- duel_challenges: 7-day retention (challenges expire quickly)
-- Runs daily at 05:00 UTC
SELECT cron.unschedule('purge-duel-challenges') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-duel-challenges');
SELECT cron.schedule(
    'purge-duel-challenges',
    '0 5 * * *',
    $$DELETE FROM public.duel_challenges WHERE created_at < NOW() - INTERVAL '7 days'$$
);

-- active_duels: 7-day retention (finished duels are no longer needed)
-- Runs daily at 05:10 UTC
SELECT cron.unschedule('purge-active-duels') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-active-duels');
SELECT cron.schedule(
    'purge-active-duels',
    '10 5 * * *',
    $$DELETE FROM public.active_duels WHERE created_at < NOW() - INTERVAL '7 days'$$
);

-- ===========================================================================
-- OPERATIONAL DATA — 1-year retention
-- ===========================================================================

-- student_activities: 1-year retention (activity logs for teacher dashboard)
-- Runs weekly on Sunday at 03:00 UTC
SELECT cron.unschedule('purge-student-activities') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-student-activities');
SELECT cron.schedule(
    'purge-student-activities',
    '0 3 * * 0',
    $$DELETE FROM public.student_activities WHERE timestamp < NOW() - INTERVAL '1 year'$$
);

-- feedback: 1-year retention (student feedback)
-- Runs weekly on Sunday at 03:30 UTC
SELECT cron.unschedule('purge-feedback') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-feedback');
SELECT cron.schedule(
    'purge-feedback',
    '30 3 * * 0',
    $$DELETE FROM public.feedback WHERE created_at < NOW() - INTERVAL '1 year'$$
);

-- shared_games: 1-year retention (published student work)
-- Runs weekly on Sunday at 04:00 UTC
SELECT cron.unschedule('purge-shared-games') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-shared-games');
SELECT cron.schedule(
    'purge-shared-games',
    '0 4 * * 0',
    $$DELETE FROM public.shared_games WHERE created_at < NOW() - INTERVAL '1 year'$$
);

-- ===========================================================================
-- COMPLIANCE DATA — 3-year retention
-- ===========================================================================

-- audit_logs: 3-year retention (AVG Art. 30 requires maintaining records of processing)
-- Runs weekly on Sunday at 04:30 UTC
SELECT cron.unschedule('purge-audit-logs') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-audit-logs');
SELECT cron.schedule(
    'purge-audit-logs',
    '30 4 * * 0',
    $$DELETE FROM public.audit_logs WHERE created_at < NOW() - INTERVAL '3 years'$$
);
