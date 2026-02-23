-- ===========================================================================
-- S-07 FIX: Server-Side Authorization for Teacher Operations
-- ===========================================================================
-- This migration addresses the security finding that teacher operations
-- (resetStudentProgress, deleteStudent, awardXP) in teacherService.ts
-- perform direct Supabase client calls without server-side authorization.
--
-- Changes:
--   1. Creates an is_teacher() helper function that checks auth metadata
--   2. Enables RLS on the users table with appropriate policies
--   3. Creates server-side RPC functions for reset_student_progress and
--      delete_student that verify the caller is a teacher before executing
-- ===========================================================================

-- ===========================================================================
-- 1. HELPER FUNCTION: is_teacher()
-- ===========================================================================
-- Returns true if the current authenticated user has a teacher, admin, or
-- developer role in their app metadata. Uses SECURITY DEFINER to allow
-- reading auth.users without granting direct access.
-- ===========================================================================

CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' IN ('teacher', 'admin', 'developer')
  );
END;
$$;

-- ===========================================================================
-- 2. ROW-LEVEL SECURITY POLICIES ON users TABLE
-- ===========================================================================
-- Enable RLS (idempotent — no error if already enabled)
-- ===========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- SELECT: Users can read their own row; teachers can read all rows
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "users_select_own_or_teacher" ON public.users;
CREATE POLICY "users_select_own_or_teacher"
  ON public.users
  FOR SELECT
  USING (
    auth.uid() = id
    OR is_teacher()
  );

-- ---------------------------------------------------------------------------
-- UPDATE: Users can update their own row; teachers can update any row
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "users_update_own_or_teacher" ON public.users;
CREATE POLICY "users_update_own_or_teacher"
  ON public.users
  FOR UPDATE
  USING (
    auth.uid() = id
    OR is_teacher()
  )
  WITH CHECK (
    auth.uid() = id
    OR is_teacher()
  );

-- ---------------------------------------------------------------------------
-- DELETE: Only teachers/admins/developers can delete rows
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "users_delete_teacher_only" ON public.users;
CREATE POLICY "users_delete_teacher_only"
  ON public.users
  FOR DELETE
  USING (
    is_teacher()
  );

-- ---------------------------------------------------------------------------
-- INSERT: Allow authenticated users to insert (for registration flows)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "users_insert_authenticated" ON public.users;
CREATE POLICY "users_insert_authenticated"
  ON public.users
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR is_teacher()
  );

-- ===========================================================================
-- 3. SERVER-SIDE RPC FUNCTIONS
-- ===========================================================================
-- These functions enforce teacher authorization at the database level,
-- so even if the client-side code is tampered with, unauthorized users
-- cannot perform these operations.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- reset_student_progress(p_student_id UUID)
-- Resets XP to 0, level to 1, and clears missionsCompleted for a student.
-- Only callable by teachers/admins/developers.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION reset_student_progress(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_stats JSONB;
BEGIN
  -- Verify caller is a teacher
  IF NOT is_teacher() THEN
    RAISE EXCEPTION 'Unauthorized: only teachers can reset student progress';
  END IF;

  -- Fetch current stats
  SELECT stats INTO v_current_stats
  FROM public.users
  WHERE id = p_student_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found: %', p_student_id;
  END IF;

  -- Merge reset values into existing stats (preserving other fields like badges)
  v_current_stats := COALESCE(v_current_stats, '{}'::JSONB)
    || jsonb_build_object(
         'xp', 0,
         'level', 1,
         'missionsCompleted', '[]'::JSONB
       );

  UPDATE public.users
  SET stats = v_current_stats
  WHERE id = p_student_id;

  RETURN TRUE;
END;
$$;

-- ---------------------------------------------------------------------------
-- delete_student(p_student_id UUID)
-- Deletes a student row from the users table.
-- Only callable by teachers/admins/developers.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION delete_student(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is a teacher
  IF NOT is_teacher() THEN
    RAISE EXCEPTION 'Unauthorized: only teachers can delete students';
  END IF;

  DELETE FROM public.users
  WHERE id = p_student_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found: %', p_student_id;
  END IF;

  RETURN TRUE;
END;
$$;
