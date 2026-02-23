-- ===========================================================================
-- AVG Art. 18 FIX: Processing Restriction Column
-- ===========================================================================
-- Adds processing_restricted flag to public.users so the restrictProcessing
-- Edge Function can mark accounts that have invoked their right to restriction.
-- The audit_logs table is the authoritative record; this column enables
-- server-side filtering of restricted users from analytics pipelines.
-- ===========================================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS processing_restricted        BOOLEAN   DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS processing_restricted_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS processing_restricted_reason TEXT;

-- Index for fast filtering of restricted users in analytics queries
CREATE INDEX IF NOT EXISTS users_processing_restricted_idx
  ON public.users (processing_restricted)
  WHERE processing_restricted = TRUE;

-- RLS: users can read their own restriction status; teachers can see all
-- (existing RLS policies on users table already cover this via is_teacher())
