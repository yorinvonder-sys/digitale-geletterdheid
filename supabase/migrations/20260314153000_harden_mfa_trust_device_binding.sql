-- Harden MFA trust by binding trust records to both network and device.
-- This keeps the trust signal useful for risk checks, but prevents a shared
-- network from implicitly trusting every browser on that network.

DROP FUNCTION IF EXISTS public.has_mfa_trust(uuid, text);

CREATE OR REPLACE FUNCTION public.has_mfa_trust(
  p_user_id uuid,
  p_ip_hash text,
  p_user_agent_hash text DEFAULT NULL
)
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
      AND (
        user_agent_hash IS NULL
        OR p_user_agent_hash IS NULL
        OR user_agent_hash = p_user_agent_hash
      )
  );
$$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mfa_trusted_sessions_user_ip_ua
  ON public.mfa_trusted_sessions (user_id, ip_hash, coalesce(user_agent_hash, ''));

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
  DELETE FROM public.mfa_trusted_sessions
  WHERE user_id = p_user_id
    AND expires_at <= now();

  SELECT count(*) INTO v_count
  FROM public.mfa_trusted_sessions
  WHERE user_id = p_user_id;

  IF v_count >= 5 THEN
    DELETE FROM public.mfa_trusted_sessions
    WHERE id = (
      SELECT id
      FROM public.mfa_trusted_sessions
      WHERE user_id = p_user_id
      ORDER BY created_at ASC
      LIMIT 1
    );
  END IF;

  DELETE FROM public.mfa_trusted_sessions
  WHERE user_id = p_user_id
    AND ip_hash = p_ip_hash
    AND coalesce(user_agent_hash, '') = coalesce(p_user_agent_hash, '');

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
