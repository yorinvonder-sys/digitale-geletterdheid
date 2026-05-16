-- ============================================================================
-- Game project persistence: gallery, publishing, personal saves, and reset
-- ============================================================================
-- Security goals:
-- - Student work is scoped to the creator for drafts/library items.
-- - Published gallery items are visible only to same-school classmates/teachers.
-- - Game counters/likes/scores use RPCs so clients cannot forge arbitrary rows.
-- - Teacher reset clears persisted mission drafts as well as summary stats.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
-- ---------------------------------------------------------------------------
-- Mission progress: cloud autosave for in-progress student work.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mission_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mission_id text NOT NULL,
  school_id text,
  progress_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'in_progress',
  score integer,
  game_code text,
  book_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mission_progress_user_mission_unique UNIQUE (user_id, mission_id),
  CONSTRAINT mission_progress_status_check CHECK (status IN ('not_started', 'in_progress', 'completed', 'reset'))
);
ALTER TABLE public.mission_progress
  ADD COLUMN IF NOT EXISTS school_id text,
  ADD COLUMN IF NOT EXISTS progress_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'in_progress',
  ADD COLUMN IF NOT EXISTS score integer,
  ADD COLUMN IF NOT EXISTS game_code text,
  ADD COLUMN IF NOT EXISTS book_data jsonb,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS idx_mission_progress_user_mission
  ON public.mission_progress(user_id, mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_progress_school
  ON public.mission_progress(school_id, mission_id, updated_at DESC);
DROP TRIGGER IF EXISTS trg_mission_progress_updated_at ON public.mission_progress;
CREATE TRIGGER trg_mission_progress_updated_at
  BEFORE UPDATE ON public.mission_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mission_progress_owner_select" ON public.mission_progress;
CREATE POLICY "mission_progress_owner_select"
  ON public.mission_progress
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_teacher_in_school(school_id)
  );
DROP POLICY IF EXISTS "mission_progress_owner_insert" ON public.mission_progress;
CREATE POLICY "mission_progress_owner_insert"
  ON public.mission_progress
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      school_id IS NULL
      OR school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "mission_progress_owner_update" ON public.mission_progress;
CREATE POLICY "mission_progress_owner_update"
  ON public.mission_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      school_id IS NULL
      OR school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "mission_progress_owner_delete" ON public.mission_progress;
CREATE POLICY "mission_progress_owner_delete"
  ON public.mission_progress
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR public.is_teacher_in_school(school_id)
  );
-- ---------------------------------------------------------------------------
-- Personal library: explicit saves students can reopen later.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  name text NOT NULL,
  school_id text,
  description text,
  thumbnail text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  mission_id text NOT NULL,
  mission_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT library_items_type_check CHECK (type IN ('game', 'book', 'chatbot', 'drawing'))
);
ALTER TABLE public.library_items
  ADD COLUMN IF NOT EXISTS school_id text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS thumbnail text,
  ADD COLUMN IF NOT EXISTS data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS mission_id text,
  ADD COLUMN IF NOT EXISTS mission_name text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS idx_library_items_user_updated
  ON public.library_items(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_library_items_school
  ON public.library_items(school_id, mission_id);
DROP TRIGGER IF EXISTS trg_library_items_updated_at ON public.library_items;
CREATE TRIGGER trg_library_items_updated_at
  BEFORE UPDATE ON public.library_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "library_items_owner_select" ON public.library_items;
CREATE POLICY "library_items_owner_select"
  ON public.library_items
  FOR SELECT
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "library_items_owner_insert" ON public.library_items;
CREATE POLICY "library_items_owner_insert"
  ON public.library_items
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND length(trim(name)) BETWEEN 1 AND 80
    AND (
      school_id IS NULL
      OR school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "library_items_owner_update" ON public.library_items;
CREATE POLICY "library_items_owner_update"
  ON public.library_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "library_items_owner_delete" ON public.library_items;
CREATE POLICY "library_items_owner_delete"
  ON public.library_items
  FOR DELETE
  USING (auth.uid() = user_id);
-- ---------------------------------------------------------------------------
-- Published gallery: shared games/books classmates can play/read.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shared_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  creator_uid uuid,
  creator_name text NOT NULL,
  school_id text,
  student_class text,
  mission_id text,
  title text NOT NULL,
  description text,
  game_code text,
  book_data jsonb,
  thumbnail text,
  created_at timestamptz NOT NULL DEFAULT now(),
  play_count integer NOT NULL DEFAULT 0,
  likes text[] NOT NULL DEFAULT ARRAY[]::text[],
  has_obstacles boolean NOT NULL DEFAULT false,
  high_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  creator_xp_earned integer NOT NULL DEFAULT 0
);
ALTER TABLE public.shared_games
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS creator_uid uuid,
  ADD COLUMN IF NOT EXISTS school_id text,
  ADD COLUMN IF NOT EXISTS student_class text,
  ADD COLUMN IF NOT EXISTS mission_id text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS game_code text,
  ADD COLUMN IF NOT EXISTS book_data jsonb,
  ADD COLUMN IF NOT EXISTS thumbnail text,
  ADD COLUMN IF NOT EXISTS play_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likes text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS has_obstacles boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS high_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS creator_xp_earned integer NOT NULL DEFAULT 0;
UPDATE public.shared_games
SET user_id = creator_uid::uuid
WHERE user_id IS NULL
  AND creator_uid IS NOT NULL
  AND creator_uid::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
CREATE INDEX IF NOT EXISTS idx_shared_games_school_class_created
  ON public.shared_games(school_id, student_class, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_games_creator
  ON public.shared_games(user_id, created_at DESC);
ALTER TABLE public.shared_games ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "shared_games_classmates_select" ON public.shared_games;
CREATE POLICY "shared_games_classmates_select"
  ON public.shared_games
  FOR SELECT
  USING (
    coalesce(user_id::text, creator_uid::text) = auth.uid()::text
    OR public.is_teacher_in_school(school_id)
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.school_id IS NOT NULL
        AND u.school_id = shared_games.school_id
        AND (
          shared_games.student_class IS NULL
          OR u.student_class = shared_games.student_class
        )
    )
  );
DROP POLICY IF EXISTS "shared_games_owner_insert" ON public.shared_games;
CREATE POLICY "shared_games_owner_insert"
  ON public.shared_games
  FOR INSERT
  WITH CHECK (
    coalesce(user_id::text, creator_uid::text) = auth.uid()::text
    AND length(trim(title)) BETWEEN 1 AND 80
    AND (
      school_id IS NULL
      OR school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "shared_games_owner_update" ON public.shared_games;
CREATE POLICY "shared_games_owner_update"
  ON public.shared_games
  FOR UPDATE
  USING (
    coalesce(user_id::text, creator_uid::text) = auth.uid()::text
    OR public.is_teacher_in_school(school_id)
  )
  WITH CHECK (
    coalesce(user_id::text, creator_uid::text) = auth.uid()::text
    OR public.is_teacher_in_school(school_id)
  );
DROP POLICY IF EXISTS "shared_games_owner_delete" ON public.shared_games;
CREATE POLICY "shared_games_owner_delete"
  ON public.shared_games
  FOR DELETE
  USING (
    coalesce(user_id::text, creator_uid::text) = auth.uid()::text
    OR public.is_teacher_in_school(school_id)
  );
CREATE OR REPLACE FUNCTION public.can_access_shared_game(p_game_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.shared_games sg
    WHERE sg.id = p_game_id
      AND (
        coalesce(sg.user_id::text, sg.creator_uid::text) = auth.uid()::text
        OR public.is_teacher_in_school(sg.school_id)
        OR EXISTS (
          SELECT 1
          FROM public.users u
          WHERE u.id = auth.uid()
            AND u.school_id IS NOT NULL
            AND u.school_id = sg.school_id
            AND (
              sg.student_class IS NULL
              OR u.student_class = sg.student_class
            )
        )
      )
  );
$$;
CREATE OR REPLACE FUNCTION public.increment_play_count(game_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.can_access_shared_game(game_id) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.shared_games
  SET play_count = coalesce(play_count, 0) + 1
  WHERE id = game_id;
END;
$$;
CREATE OR REPLACE FUNCTION public.atomic_toggle_like(p_game_id uuid, p_user_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id text := auth.uid()::text;
  v_likes text[];
  v_liked boolean;
BEGIN
  IF auth.uid() IS NULL OR p_user_id IS DISTINCT FROM v_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF NOT public.can_access_shared_game(p_game_id) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT coalesce(likes, ARRAY[]::text[])
    INTO v_likes
  FROM public.shared_games
  WHERE id = p_game_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game not found';
  END IF;

  IF v_user_id = ANY(v_likes) THEN
    v_likes := array_remove(v_likes, v_user_id);
    v_liked := false;
  ELSE
    v_likes := array_append(v_likes, v_user_id);
    v_liked := true;
  END IF;

  UPDATE public.shared_games
  SET likes = v_likes
  WHERE id = p_game_id;

  RETURN jsonb_build_object('liked', v_liked, 'likeCount', cardinality(v_likes));
END;
$$;
CREATE OR REPLACE FUNCTION public.record_shared_game_score(p_game_id uuid, p_score integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id text := auth.uid()::text;
  v_high_scores jsonb;
  v_existing_score integer := 0;
  v_existing_score_text text;
  v_before_milestone integer := 0;
  v_after_milestone integer := 0;
  v_new_milestone boolean := false;
BEGIN
  IF auth.uid() IS NULL OR p_score IS NULL OR p_score < 0 OR p_score > 50000 THEN
    RAISE EXCEPTION 'Invalid score';
  END IF;

  IF NOT public.can_access_shared_game(p_game_id) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT coalesce(high_scores, '{}'::jsonb)
    INTO v_high_scores
  FROM public.shared_games
  WHERE id = p_game_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game not found';
  END IF;

  v_existing_score_text := v_high_scores -> v_user_id ->> 'score';
  IF v_existing_score_text ~ '^[0-9]+$' THEN
    v_existing_score := v_existing_score_text::integer;
  END IF;

  IF p_score > v_existing_score THEN
    v_before_milestone := floor(v_existing_score / 1000.0)::integer;
    v_after_milestone := floor(p_score / 1000.0)::integer;
    v_new_milestone := v_after_milestone > v_before_milestone;

    UPDATE public.shared_games
    SET high_scores = jsonb_set(
      v_high_scores,
      ARRAY[v_user_id],
      jsonb_build_object(
        'score', p_score,
        'milestone_reached', v_after_milestone,
        'updated_at', now()
      ),
      true
    )
    WHERE id = p_game_id;
  END IF;

  RETURN jsonb_build_object('xpAwarded', 0, 'newMilestone', v_new_milestone);
END;
$$;
-- ---------------------------------------------------------------------------
-- Shared projects: generic shared artifacts used by other creative missions.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shared_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  created_by uuid,
  type text NOT NULL,
  name text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  school_id text,
  student_class text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shared_projects
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS created_by uuid,
  ADD COLUMN IF NOT EXISTS school_id text,
  ADD COLUMN IF NOT EXISTS student_class text,
  ADD COLUMN IF NOT EXISTS data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
UPDATE public.shared_projects
SET user_id = created_by::uuid
WHERE user_id IS NULL
  AND created_by IS NOT NULL
  AND created_by::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
CREATE INDEX IF NOT EXISTS idx_shared_projects_user_created
  ON public.shared_projects(user_id, created_at DESC);
ALTER TABLE public.shared_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "shared_projects_owner_select" ON public.shared_projects;
CREATE POLICY "shared_projects_owner_select"
  ON public.shared_projects
  FOR SELECT
  USING (
    coalesce(user_id::text, created_by::text) = auth.uid()::text
    OR public.is_teacher_in_school(school_id)
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.school_id IS NOT NULL
        AND u.school_id = shared_projects.school_id
        AND (
          shared_projects.student_class IS NULL
          OR u.student_class = shared_projects.student_class
        )
    )
  );
DROP POLICY IF EXISTS "shared_projects_owner_insert" ON public.shared_projects;
CREATE POLICY "shared_projects_owner_insert"
  ON public.shared_projects
  FOR INSERT
  WITH CHECK (
    coalesce(user_id::text, created_by::text) = auth.uid()::text
    AND length(trim(name)) BETWEEN 1 AND 100
    AND (
      school_id IS NULL
      OR school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "shared_projects_owner_delete" ON public.shared_projects;
CREATE POLICY "shared_projects_owner_delete"
  ON public.shared_projects
  FOR DELETE
  USING (
    coalesce(user_id::text, created_by::text) = auth.uid()::text
    OR public.is_teacher_in_school(school_id)
  );
-- ---------------------------------------------------------------------------
-- Teacher reset: keep the existing RPC name but also clear persisted drafts.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reset_student_progress(p_student_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_target_school_id text;
  v_current_stats jsonb;
BEGIN
  IF NOT public.is_teacher() THEN
    RAISE EXCEPTION 'Unauthorized: teacher/admin/developer with MFA required';
  END IF;

  SELECT school_id, stats
    INTO v_target_school_id, v_current_stats
  FROM public.users
  WHERE id = p_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found: %', p_student_id;
  END IF;

  IF NOT public.is_teacher_in_school(v_target_school_id) THEN
    RAISE EXCEPTION 'Unauthorized: only same-school privileged users may reset progress';
  END IF;

  DELETE FROM public.mission_progress
  WHERE user_id = p_student_id;

  v_current_stats := coalesce(v_current_stats, '{}'::jsonb) - 'missionProgress'
    || jsonb_build_object(
      'xp', 0,
      'level', 1,
      'missionsCompleted', '[]'::jsonb
    );

  UPDATE public.users
  SET stats = v_current_stats
  WHERE id = p_student_id;

  RETURN true;
END;
$$;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mission_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shared_games TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.shared_projects TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_play_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.atomic_toggle_like(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_shared_game_score(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_shared_game(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_student_progress(uuid) TO authenticated;
