-- MFA Trusted Sessions — IP-based MFA grace period
-- After successful MFA verification, the user can skip MFA for 30 minutes
-- from the same IP address. If the IP changes, MFA is required again.
--
-- Security measures:
-- - IP is stored as a SHA-256 hash (privacy + prevents leaking raw IPs)
-- - Sessions auto-expire after 30 minutes
-- - Max 5 trusted sessions per user (prevents abuse)
-- - RLS: users can only manage their own sessions
-- - Cleanup function removes expired sessions

CREATE TABLE IF NOT EXISTS public.mfa_trusted_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_hash text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    expires_at timestamptz NOT NULL,
    user_agent_hash text  -- optional: extra fingerprint layer
);

-- Index for fast lookups by user + IP
CREATE INDEX idx_mfa_trusted_sessions_user_ip
    ON public.mfa_trusted_sessions (user_id, ip_hash);

-- Index for cleanup of expired sessions
CREATE INDEX idx_mfa_trusted_sessions_expires
    ON public.mfa_trusted_sessions (expires_at);

-- RLS: users can only see/manage their own trusted sessions
ALTER TABLE public.mfa_trusted_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own trusted sessions"
    ON public.mfa_trusted_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trusted sessions"
    ON public.mfa_trusted_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trusted sessions"
    ON public.mfa_trusted_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- Function to check if a user has a valid trusted session for a given IP hash
CREATE OR REPLACE FUNCTION public.has_mfa_trust(p_user_id uuid, p_ip_hash text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.mfa_trusted_sessions
        WHERE user_id = p_user_id
          AND ip_hash = p_ip_hash
          AND expires_at > now()
    );
$$;

-- Function to create a trusted session (with max 5 limit per user)
CREATE OR REPLACE FUNCTION public.create_mfa_trust(
    p_user_id uuid,
    p_ip_hash text,
    p_user_agent_hash text DEFAULT NULL,
    p_duration_minutes int DEFAULT 30
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session_id uuid;
    v_count int;
BEGIN
    -- Remove expired sessions for this user first
    DELETE FROM public.mfa_trusted_sessions
    WHERE user_id = p_user_id AND expires_at <= now();

    -- Check max sessions limit (5 per user)
    SELECT count(*) INTO v_count
    FROM public.mfa_trusted_sessions
    WHERE user_id = p_user_id;

    IF v_count >= 5 THEN
        -- Remove oldest session to make room
        DELETE FROM public.mfa_trusted_sessions
        WHERE id = (
            SELECT id FROM public.mfa_trusted_sessions
            WHERE user_id = p_user_id
            ORDER BY created_at ASC
            LIMIT 1
        );
    END IF;

    -- Remove existing trust for same IP (replace with fresh one)
    DELETE FROM public.mfa_trusted_sessions
    WHERE user_id = p_user_id AND ip_hash = p_ip_hash;

    -- Create new trusted session
    INSERT INTO public.mfa_trusted_sessions (user_id, ip_hash, expires_at, user_agent_hash)
    VALUES (
        p_user_id,
        p_ip_hash,
        now() + (p_duration_minutes || ' minutes')::interval,
        p_user_agent_hash
    )
    RETURNING id INTO v_session_id;

    RETURN v_session_id;
END;
$$;

-- Cleanup function: remove all expired sessions (call periodically via cron or edge function)
CREATE OR REPLACE FUNCTION public.cleanup_expired_mfa_sessions()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deleted int;
BEGIN
    DELETE FROM public.mfa_trusted_sessions
    WHERE expires_at <= now();
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$;

-- Revoke all trust for a user (e.g., on password change or security event)
CREATE OR REPLACE FUNCTION public.revoke_all_mfa_trust(p_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
    DELETE FROM public.mfa_trusted_sessions WHERE user_id = p_user_id;
$$;
