-- ============================================================================
-- Security hardening: ensure RLS + is_developer() helper
-- ============================================================================
-- Production already has RLS enabled on all tables with appropriate policies.
-- This migration ensures:
--   1. is_developer() helper function exists
--   2. web_vitals_events has RLS enabled (was the only table missing it)
-- ============================================================================

-- Helper: Check if caller has developer role in app_metadata
CREATE OR REPLACE FUNCTION public.is_developer()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'developer'
  );
END;
$$;

-- Enable RLS on web_vitals_events (was the only table without it)
ALTER TABLE IF EXISTS public.web_vitals_events ENABLE ROW LEVEL SECURITY;
