-- ============================================================================
-- Local schema baseline
-- ============================================================================
-- The migrations in this repository start with hardening/feature patches that
-- assume a few original application tables already exist. Fresh local Supabase
-- databases do not have those tables, so `supabase start` stops before Edge
-- Functions can be served through the normal CLI path.
--
-- This baseline is intentionally minimal and idempotent. It creates only the
-- foundational objects that later migrations already expect, and it avoids
-- replacing existing helper functions on databases that already have them.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- User profiles mirrored from auth.users
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  uid uuid UNIQUE,
  email text,
  display_name text,
  identifier text,
  role text NOT NULL DEFAULT 'student',
  school_id text,
  student_class text,
  avatar_config jsonb DEFAULT '{}'::jsonb,
  stats jsonb DEFAULT '{}'::jsonb,
  last_login timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS uid uuid,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS identifier text,
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS school_id text,
  ADD COLUMN IF NOT EXISTS student_class text,
  ADD COLUMN IF NOT EXISTS avatar_config jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS stats jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS last_login timestamptz,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS users_uid_unique_idx
  ON public.users(uid)
  WHERE uid IS NOT NULL;

CREATE INDEX IF NOT EXISTS users_school_class_idx
  ON public.users(school_id, student_class);

DO $baseline_profiles$
BEGIN
  IF to_regclass('public.profiles') IS NULL THEN
    EXECUTE $view$
      CREATE VIEW public.profiles
      WITH (security_invoker = true)
      AS
      SELECT
        id,
        uid,
        email,
        display_name,
        role,
        school_id,
        student_class,
        stats,
        created_at,
        updated_at
      FROM public.users
    $view$;
  END IF;
END;
$baseline_profiles$;

-- ---------------------------------------------------------------------------
-- Minimal auth metadata helpers used by early curriculum policies.
-- Later hardening migrations add stronger helpers; do not overwrite existing
-- production functions if this baseline is ever applied as a pending migration.
-- ---------------------------------------------------------------------------

DO $baseline$
BEGIN
  IF to_regprocedure('public.get_my_school_id()') IS NULL THEN
    EXECUTE $fn$
      CREATE FUNCTION public.get_my_school_id()
      RETURNS text
      LANGUAGE sql
      STABLE
      SECURITY DEFINER
      SET search_path = public
      AS $$
        SELECT raw_app_meta_data->>'schoolId'
        FROM auth.users
        WHERE id = auth.uid()
      $$;
    $fn$;
  END IF;

  IF to_regprocedure('public.get_my_role()') IS NULL THEN
    EXECUTE $fn$
      CREATE FUNCTION public.get_my_role()
      RETURNS text
      LANGUAGE sql
      STABLE
      SECURITY DEFINER
      SET search_path = public
      AS $$
        SELECT coalesce(raw_app_meta_data->>'role', raw_user_meta_data->>'role')
        FROM auth.users
        WHERE id = auth.uid()
      $$;
    $fn$;
  END IF;

  IF to_regprocedure('public.get_caller_school_id()') IS NULL THEN
    EXECUTE $fn$
      CREATE FUNCTION public.get_caller_school_id()
      RETURNS text
      LANGUAGE sql
      STABLE
      SECURITY DEFINER
      SET search_path = public
      AS $$
        SELECT raw_app_meta_data->>'schoolId'
        FROM auth.users
        WHERE id = auth.uid()
      $$;
    $fn$;
  END IF;

  IF to_regprocedure('public.is_mfa_aal2()') IS NULL THEN
    EXECUTE $fn$
      CREATE FUNCTION public.is_mfa_aal2()
      RETURNS boolean
      LANGUAGE plpgsql
      STABLE
      SET search_path = public
      AS $$
      DECLARE
        v_claims jsonb;
      BEGIN
        BEGIN
          v_claims := nullif(current_setting('request.jwt.claims', true), '')::jsonb;
        EXCEPTION WHEN others THEN
          RETURN false;
        END;

        RETURN coalesce(v_claims->>'aal', 'aal1') = 'aal2';
      END;
      $$;
    $fn$;
  END IF;

  IF to_regprocedure('public.is_teacher()') IS NULL THEN
    EXECUTE $fn$
      CREATE FUNCTION public.is_teacher()
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
            AND raw_app_meta_data->>'role' IN ('teacher', 'admin', 'developer')
        )
        AND public.is_mfa_aal2();
      END;
      $$;
    $fn$;
  END IF;

  IF to_regprocedure('public.is_teacher_in_school(text)') IS NULL THEN
    EXECUTE $fn$
      CREATE FUNCTION public.is_teacher_in_school(target_school_id text)
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        v_caller_school_id text;
      BEGIN
        IF NOT public.is_teacher() THEN
          RETURN false;
        END IF;

        v_caller_school_id := public.get_caller_school_id();

        IF v_caller_school_id IS NULL OR target_school_id IS NULL THEN
          RETURN false;
        END IF;

        RETURN v_caller_school_id = target_school_id;
      END;
      $$;
    $fn$;
  END IF;
END;
$baseline$;

-- ---------------------------------------------------------------------------
-- Mission progress expected by mission services, exports, and peer review RPCs.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.mission_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id text NOT NULL,
  school_id text,
  progress_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'in_progress',
  score numeric,
  game_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, mission_id)
);

ALTER TABLE public.mission_progress
  ADD COLUMN IF NOT EXISTS school_id text,
  ADD COLUMN IF NOT EXISTS progress_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'in_progress',
  ADD COLUMN IF NOT EXISTS score numeric,
  ADD COLUMN IF NOT EXISTS game_code text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS mission_progress_user_updated_idx
  ON public.mission_progress(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS mission_progress_school_mission_idx
  ON public.mission_progress(school_id, mission_id);

ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mission_progress_select_own_or_teacher" ON public.mission_progress;
CREATE POLICY "mission_progress_select_own_or_teacher"
  ON public.mission_progress
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_teacher_in_school(school_id)
  );

DROP POLICY IF EXISTS "mission_progress_insert_own" ON public.mission_progress;
CREATE POLICY "mission_progress_insert_own"
  ON public.mission_progress
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      school_id IS NULL
      OR school_id = public.get_caller_school_id()
    )
  );

DROP POLICY IF EXISTS "mission_progress_update_own" ON public.mission_progress;
CREATE POLICY "mission_progress_update_own"
  ON public.mission_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      school_id IS NULL
      OR school_id = public.get_caller_school_id()
    )
  );

DROP POLICY IF EXISTS "mission_progress_delete_own_or_teacher" ON public.mission_progress;
CREATE POLICY "mission_progress_delete_own_or_teacher"
  ON public.mission_progress
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR public.is_teacher_in_school(school_id)
  );

-- ---------------------------------------------------------------------------
-- Audit logs expected by retention, GDPR, and later hardening migrations.
-- Keep both uid/data and user_id/metadata because earlier code used both
-- shapes while the hardening migrations converge policies.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  uid uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  data jsonb,
  metadata jsonb,
  school_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS uid uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS action text,
  ADD COLUMN IF NOT EXISTS data jsonb,
  ADD COLUMN IF NOT EXISTS metadata jsonb,
  ADD COLUMN IF NOT EXISTS school_id text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS audit_logs_user_created_idx
  ON public.audit_logs(coalesce(user_id, uid), created_at DESC);

CREATE INDEX IF NOT EXISTS audit_logs_school_created_idx
  ON public.audit_logs(school_id, created_at DESC)
  WHERE school_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Global/school game permissions expected by early year-group migration.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.game_permissions (
  id text PRIMARY KEY,
  school_id text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.game_permissions
  ADD COLUMN IF NOT EXISTS school_id text,
  ADD COLUMN IF NOT EXISTS data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS game_permissions_school_idx
  ON public.game_permissions(school_id);

-- ---------------------------------------------------------------------------
-- Bomberman rooms table expected by the later "missing columns" migration.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.bomberman_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code text UNIQUE,
  status text NOT NULL DEFAULT 'waiting',
  players jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
