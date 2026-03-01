-- DGSkills Web Vitals dashboard queries
-- Use in Supabase SQL editor (production) for route-level tracking.

-- 1) Last 24h p50/p75/p95 for mobile routes
SELECT
  route,
  metric_name,
  samples,
  ROUND(p50::numeric, 2) AS p50,
  ROUND(p75::numeric, 2) AS p75,
  ROUND(p95::numeric, 2) AS p95
FROM public.web_vitals_route_last_24h
WHERE device_class = 'mobile'
ORDER BY route, metric_name;

-- 2) Daily trend (last 14 days) for LCP and INP on key routes
SELECT
  day_nl,
  route,
  metric_name,
  samples,
  ROUND(p75::numeric, 2) AS p75
FROM public.web_vitals_route_daily
WHERE day_nl >= (CURRENT_DATE - INTERVAL '14 days')
  AND route IN ('/', '/scholen', '/login')
  AND metric_name IN ('LCP', 'INP')
  AND device_class = 'mobile'
ORDER BY day_nl DESC, route, metric_name;

-- 3) Build-over-build comparison (last 24h)
SELECT
  build_id,
  route,
  metric_name,
  COUNT(*) AS samples,
  ROUND(percentile_cont(0.75) WITHIN GROUP (ORDER BY metric_value)::numeric, 2) AS p75
FROM public.web_vitals_events
WHERE created_at >= now() - interval '24 hours'
  AND device_class = 'mobile'
GROUP BY build_id, route, metric_name
ORDER BY build_id DESC, route, metric_name;
