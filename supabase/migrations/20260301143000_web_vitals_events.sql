-- Structured Web Vitals storage for route-level p50/p75/p95 reporting.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.web_vitals_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_name text NOT NULL DEFAULT 'web_vital',
  route text NOT NULL,
  device_class text NOT NULL,
  nav_type text NOT NULL DEFAULT 'unknown',
  build_id text,
  metric_name text NOT NULL,
  metric_value double precision NOT NULL,
  metric_rating text NOT NULL,
  page_key text,
  cta_key text,
  role text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'web_vitals_events_metric_name_check'
  ) THEN
    ALTER TABLE public.web_vitals_events
      ADD CONSTRAINT web_vitals_events_metric_name_check
      CHECK (metric_name IN ('LCP', 'INP', 'CLS', 'FCP', 'TTFB'));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'web_vitals_events_metric_rating_check'
  ) THEN
    ALTER TABLE public.web_vitals_events
      ADD CONSTRAINT web_vitals_events_metric_rating_check
      CHECK (metric_rating IN ('good', 'needs-improvement', 'poor'));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'web_vitals_events_metric_value_check'
  ) THEN
    ALTER TABLE public.web_vitals_events
      ADD CONSTRAINT web_vitals_events_metric_value_check
      CHECK (metric_value >= 0);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'web_vitals_events_device_class_check'
  ) THEN
    ALTER TABLE public.web_vitals_events
      ADD CONSTRAINT web_vitals_events_device_class_check
      CHECK (device_class IN ('mobile', 'tablet', 'desktop', 'unknown'));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'web_vitals_events_nav_type_check'
  ) THEN
    ALTER TABLE public.web_vitals_events
      ADD CONSTRAINT web_vitals_events_nav_type_check
      CHECK (nav_type IN ('navigate', 'reload', 'back_forward', 'prerender', 'unknown'));
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS web_vitals_events_created_at_idx
  ON public.web_vitals_events (created_at DESC);

CREATE INDEX IF NOT EXISTS web_vitals_events_route_metric_created_idx
  ON public.web_vitals_events (route, metric_name, created_at DESC);

CREATE OR REPLACE VIEW public.web_vitals_route_daily AS
SELECT
  date_trunc('day', created_at AT TIME ZONE 'Europe/Amsterdam')::date AS day_nl,
  route,
  device_class,
  metric_name,
  COUNT(*) AS samples,
  percentile_cont(0.50) WITHIN GROUP (ORDER BY metric_value) AS p50,
  percentile_cont(0.75) WITHIN GROUP (ORDER BY metric_value) AS p75,
  percentile_cont(0.95) WITHIN GROUP (ORDER BY metric_value) AS p95
FROM public.web_vitals_events
GROUP BY 1, 2, 3, 4;

CREATE OR REPLACE VIEW public.web_vitals_route_last_24h AS
SELECT
  route,
  device_class,
  metric_name,
  COUNT(*) AS samples,
  percentile_cont(0.50) WITHIN GROUP (ORDER BY metric_value) AS p50,
  percentile_cont(0.75) WITHIN GROUP (ORDER BY metric_value) AS p75,
  percentile_cont(0.95) WITHIN GROUP (ORDER BY metric_value) AS p95
FROM public.web_vitals_events
WHERE created_at >= now() - interval '24 hours'
GROUP BY 1, 2, 3;

REVOKE ALL ON TABLE public.web_vitals_events FROM anon, authenticated;
REVOKE ALL ON TABLE public.web_vitals_events FROM PUBLIC;
REVOKE ALL ON TABLE public.web_vitals_route_daily FROM anon, authenticated;
REVOKE ALL ON TABLE public.web_vitals_route_daily FROM PUBLIC;
REVOKE ALL ON TABLE public.web_vitals_route_last_24h FROM anon, authenticated;
REVOKE ALL ON TABLE public.web_vitals_route_last_24h FROM PUBLIC;
