-- ===========================================================================
-- Google Drive Auto-Backup Infrastructure
-- ===========================================================================
-- Adds support for automatic weekly backups of boekhouding data to Google Drive.
-- Components:
--   1. google_drive_connections — stores OAuth2 tokens (encrypted) per user
--   2. accountant_backup_log — tracks all backups (manual + automatic)
--   3. pg_net extension — HTTP calls from database
--   4. trigger function + pg_cron job — weekly backup trigger
-- ===========================================================================

-- 1. Enable pg_net for HTTP calls from pg_cron
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Google Drive connections table
CREATE TABLE IF NOT EXISTS public.google_drive_connections (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Encrypted refresh token (AES-256-GCM, encrypted in Edge Function)
    refresh_token_encrypted TEXT NOT NULL,
    -- Short-lived access token (cached for convenience, refreshed server-side)
    access_token            TEXT,
    access_token_expires_at TIMESTAMPTZ,
    -- Drive folder IDs
    root_folder_id          TEXT,
    -- Metadata
    google_email            TEXT,
    connected_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_backup_at          TIMESTAMPTZ,
    last_backup_status      TEXT CHECK (last_backup_status IN ('success', 'failed')),
    last_backup_error       TEXT
);

ALTER TABLE public.google_drive_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gdrive_select_own" ON public.google_drive_connections
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "gdrive_delete_own" ON public.google_drive_connections
    FOR DELETE USING (auth.uid() = user_id);
-- Insert/update via service role only (Edge Functions handle token storage)

-- 3. Backup log table
CREATE TABLE IF NOT EXISTS public.accountant_backup_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    backup_date     TIMESTAMPTZ NOT NULL DEFAULT now(),
    backup_type     TEXT NOT NULL DEFAULT 'manual' CHECK (backup_type IN ('manual', 'auto_gdrive', 'manual_gdrive')),
    file_name       TEXT,
    file_size_bytes BIGINT,
    drive_file_id   TEXT
);

ALTER TABLE public.accountant_backup_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "backup_log_select_own" ON public.accountant_backup_log
    FOR SELECT USING (auth.uid() = user_id);
-- Insert via service role only (Edge Functions log backups)

-- 4. Function to trigger backup via pg_net
-- Reads Supabase URL and service role key from Vault.
-- Before this works, run in SQL Editor:
--   SELECT vault.create_secret('https://<ref>.supabase.co', 'supabase_url');
--   SELECT vault.create_secret('<service-role-key>', 'service_role_key');
CREATE OR REPLACE FUNCTION public.trigger_gdrive_backup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    _service_key text;
    _supabase_url text;
BEGIN
    SELECT decrypted_secret INTO _service_key
    FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

    SELECT decrypted_secret INTO _supabase_url
    FROM vault.decrypted_secrets WHERE name = 'supabase_url' LIMIT 1;

    IF _service_key IS NULL OR _supabase_url IS NULL THEN
        RAISE WARNING 'gdrive backup: vault secrets not configured (supabase_url / service_role_key)';
        RETURN;
    END IF;

    PERFORM net.http_post(
        url := _supabase_url || '/functions/v1/gdrive-backup',
        headers := jsonb_build_object(
            'Authorization', 'Bearer ' || _service_key,
            'Content-Type', 'application/json',
            'x-backup-cron', 'true'
        ),
        body := '{}'::jsonb
    );
END;
$$;

-- 5. Schedule weekly backup: Sunday 02:00 UTC
SELECT cron.unschedule('gdrive-weekly-backup')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'gdrive-weekly-backup');

SELECT cron.schedule(
    'gdrive-weekly-backup',
    '0 2 * * 0',
    $$SELECT public.trigger_gdrive_backup()$$
);
