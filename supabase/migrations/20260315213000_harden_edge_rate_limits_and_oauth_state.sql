-- ============================================================================
-- Harden public edge endpoints with durable rate limiting and OAuth state storage
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.edge_request_limits (
  key TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.edge_request_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.edge_request_limits FROM PUBLIC;
REVOKE ALL ON TABLE public.edge_request_limits FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_edge_rate_limit(
  p_key TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
)
RETURNS TABLE (
  allowed BOOLEAN,
  remaining INTEGER,
  retry_after_seconds INTEGER,
  limit_value INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now TIMESTAMPTZ := clock_timestamp();
  v_row public.edge_request_limits%ROWTYPE;
  v_window_start TIMESTAMPTZ;
BEGIN
  IF p_key IS NULL OR length(trim(p_key)) = 0 THEN
    RAISE EXCEPTION 'Rate limit key ontbreekt';
  END IF;

  IF p_limit IS NULL OR p_limit < 1 THEN
    RAISE EXCEPTION 'Rate limit moet minimaal 1 zijn';
  END IF;

  IF p_window_seconds IS NULL OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'Rate limit window moet minimaal 1 seconde zijn';
  END IF;

  LOOP
    SELECT *
    INTO v_row
    FROM public.edge_request_limits
    WHERE key = p_key
    FOR UPDATE;

    IF NOT FOUND THEN
      BEGIN
        INSERT INTO public.edge_request_limits (key, window_started_at, request_count, updated_at)
        VALUES (p_key, v_now, 1, v_now)
        RETURNING *
        INTO v_row;
      EXCEPTION
        WHEN unique_violation THEN
          CONTINUE;
      END;

      allowed := true;
      remaining := GREATEST(p_limit - 1, 0);
      retry_after_seconds := 0;
      limit_value := p_limit;
      RETURN NEXT;
      RETURN;
    END IF;

    v_window_start := v_row.window_started_at + make_interval(secs => p_window_seconds);

    IF v_window_start <= v_now THEN
      UPDATE public.edge_request_limits
      SET window_started_at = v_now,
          request_count = 1,
          updated_at = v_now
      WHERE key = p_key
      RETURNING *
      INTO v_row;

      allowed := true;
      remaining := GREATEST(p_limit - 1, 0);
      retry_after_seconds := 0;
      limit_value := p_limit;
      RETURN NEXT;
      RETURN;
    END IF;

    IF v_row.request_count >= p_limit THEN
      allowed := false;
      remaining := 0;
      retry_after_seconds := GREATEST(CEIL(EXTRACT(EPOCH FROM (v_window_start - v_now)))::INTEGER, 1);
      limit_value := p_limit;
      RETURN NEXT;
      RETURN;
    END IF;

    UPDATE public.edge_request_limits
    SET request_count = request_count + 1,
        updated_at = v_now
    WHERE key = p_key
    RETURNING *
    INTO v_row;

    allowed := true;
    remaining := GREATEST(p_limit - v_row.request_count, 0);
    retry_after_seconds := 0;
    limit_value := p_limit;
    RETURN NEXT;
    RETURN;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_edge_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_edge_rate_limit(TEXT, INTEGER, INTEGER) TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.google_drive_oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_hash TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('developer', 'admin')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  consumed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_google_drive_oauth_states_expires_at
  ON public.google_drive_oauth_states (expires_at);

ALTER TABLE public.google_drive_oauth_states ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.google_drive_oauth_states FROM PUBLIC;
REVOKE ALL ON TABLE public.google_drive_oauth_states FROM anon, authenticated;
