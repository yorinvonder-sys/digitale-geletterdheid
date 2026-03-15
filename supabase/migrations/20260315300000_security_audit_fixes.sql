-- Security Audit Fix: 15 maart 2026
-- Fixes: get_next_invoice_number permissiecheck + MFA functies search_path
--
-- Rollback:
--   Herstel originele functies vanuit migraties:
--   - 20260223000002_accountant_invoices.sql (get_next_invoice_number)
--   - 20260314153000_harden_mfa_trust_device_binding.sql (has_mfa_trust, create_mfa_trust)
--   - 20260314100000_mfa_trusted_sessions.sql (cleanup_expired_mfa_sessions, revoke_all_mfa_trust)

-- ============================================================================
-- Fix 1: get_next_invoice_number — permissiecheck + SET search_path
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_next_invoice_number(p_user_id uuid, p_year int)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    last_num int;
BEGIN
    -- Security: alleen eigen factuurnummers opvragen
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Geen toegang tot factuurnummers van andere gebruikers';
    END IF;

    SELECT COALESCE(MAX(CAST(SPLIT_PART(invoice_number, '-', 2) AS INT)), 0)
    INTO last_num
    FROM accountant_invoices
    WHERE user_id = p_user_id
      AND invoice_number LIKE p_year || '-%';
    RETURN p_year || '-' || LPAD((last_num + 1)::TEXT, 3, '0');
END;
$$;

-- ============================================================================
-- Fix 2: MFA functies — SET search_path = public toevoegen
-- ============================================================================

-- has_mfa_trust (versie uit 20260314153000 met device binding)
DROP FUNCTION IF EXISTS public.has_mfa_trust(uuid, text, text);

CREATE OR REPLACE FUNCTION public.has_mfa_trust(
  p_user_id uuid,
  p_ip_hash text,
  p_user_agent_hash text DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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

-- create_mfa_trust (versie uit 20260314153000 met device binding)
CREATE OR REPLACE FUNCTION public.create_mfa_trust(
  p_user_id uuid,
  p_ip_hash text,
  p_user_agent_hash text DEFAULT NULL,
  p_duration_minutes int DEFAULT 30
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- cleanup_expired_mfa_sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_mfa_sessions()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- revoke_all_mfa_trust
CREATE OR REPLACE FUNCTION public.revoke_all_mfa_trust(p_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    DELETE FROM public.mfa_trusted_sessions WHERE user_id = p_user_id;
$$;
