-- ===========================================================================
-- OAuth state table for Google Drive connection flow
-- ===========================================================================
-- Stores short-lived, hashed OAuth state tokens to securely link
-- the Google OAuth callback to the initiating user.
-- This replaces passing the JWT as state (which exposed it in the URL).
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.google_drive_oauth_states (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_hash      TEXT NOT NULL UNIQUE,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_role  TEXT NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    consumed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.google_drive_oauth_states ENABLE ROW LEVEL SECURITY;

-- No RLS policies needed — this table is only accessed via service role key
-- from Edge Functions (gdrive-auth inserts, gdrive-callback updates).

-- Index for fast lookup by state_hash
CREATE INDEX IF NOT EXISTS idx_gdrive_oauth_states_hash
    ON public.google_drive_oauth_states (state_hash)
    WHERE consumed_at IS NULL;

-- Auto-cleanup expired states (older than 1 hour)
SELECT cron.unschedule('purge-gdrive-oauth-states')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-gdrive-oauth-states');

SELECT cron.schedule(
    'purge-gdrive-oauth-states',
    '0 * * * *',
    $$DELETE FROM public.google_drive_oauth_states WHERE expires_at < NOW() - INTERVAL '1 hour'$$
);
