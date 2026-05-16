-- ===========================================================================
-- Restore app tables referenced by the React client but absent from generated
-- remote types.
--
-- This migration is intentionally review-first: it creates/aligns the tables
-- the app already references, enables RLS, and grants explicit Data API access
-- to authenticated/service_role only. It is NOT applied automatically by Codex.
-- ===========================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Developer workspace tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.developer_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title text,
  description text,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  category text,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.developer_tasks
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'todo',
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.developer_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_data jsonb,
  data jsonb DEFAULT '{}'::jsonb,
  version integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.developer_plans
  ADD COLUMN IF NOT EXISTS plan_data jsonb,
  ADD COLUMN IF NOT EXISTS data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.developer_plans
SET plan_data = data
WHERE plan_data IS NULL
  AND data IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.developer_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  deadline date,
  completed boolean NOT NULL DEFAULT false,
  tasks jsonb NOT NULL DEFAULT '[]'::jsonb,
  phase text,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'pending',
  learning_goal text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.developer_settings (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Realtime classroom game tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.bomberman_lobbies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_uid uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  host_name text NOT NULL,
  school_id text,
  class_id text,
  players jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'waiting',
  max_players integer NOT NULL DEFAULT 4,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.duel_presence (
  uid uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  "class" text,
  school_id text,
  online_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.duel_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_uid uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  challenger_name text NOT NULL,
  challenged_uid uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  challenged_name text NOT NULL,
  school_id text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.active_duels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_uid uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  player1_name text NOT NULL,
  player2_uid uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  player2_name text NOT NULL,
  school_id text,
  current_round integer NOT NULL DEFAULT 1,
  max_rounds integer NOT NULL DEFAULT 3,
  current_drawer uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  current_word text,
  player1_score integer NOT NULL DEFAULT 0,
  player2_score integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'drawing',
  drawing_data jsonb,
  round_start_time timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Operational safety/feedback tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_class text NOT NULL DEFAULT 'Onbekend',
  school_id text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.xp_abuse_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_blocks
  ADD COLUMN IF NOT EXISTS blocked_name text,
  ADD COLUMN IF NOT EXISTS reason text;

ALTER TABLE public.class_settings
  ADD COLUMN IF NOT EXISTS class_id text,
  ADD COLUMN IF NOT EXISTS enabled_missions text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS difficulty text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS xp_multiplier numeric NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS class_settings_class_id_key
  ON public.class_settings(class_id)
  WHERE class_id IS NOT NULL;

ALTER TABLE public.teacher_messages
  ADD COLUMN IF NOT EXISTS sender_name text,
  ADD COLUMN IF NOT EXISTS text text,
  ADD COLUMN IF NOT EXISTS read boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS timestamp timestamptz NOT NULL DEFAULT now();

UPDATE public.teacher_messages
SET text = content
WHERE text IS NULL
  AND content IS NOT NULL;

UPDATE public.teacher_messages
SET read = false
WHERE read IS NULL;

ALTER TABLE public.teacher_messages
  ALTER COLUMN read SET DEFAULT false,
  ALTER COLUMN read SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.teacher_message_reads (
  message_id uuid NOT NULL REFERENCES public.teacher_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);

INSERT INTO public.teacher_message_reads (message_id, user_id, read_at)
SELECT
  id,
  target_id::uuid,
  COALESCE(timestamp, created_at, now())
FROM public.teacher_messages
WHERE read = true
  AND target_type = 'student'
  AND target_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
ON CONFLICT (message_id, user_id) DO NOTHING;

ALTER TABLE public.gamification_events
  ADD COLUMN IF NOT EXISTS type text,
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS multiplier numeric,
  ADD COLUMN IF NOT EXISTS target_class text,
  ADD COLUMN IF NOT EXISTS start_time timestamptz,
  ADD COLUMN IF NOT EXISTS end_time timestamptz;

ALTER TABLE public.highlighted_work
  ADD COLUMN IF NOT EXISTS uid uuid REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS student_name text,
  ADD COLUMN IF NOT EXISTS mission_id text,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS content text,
  ADD COLUMN IF NOT EXISTS teacher_note text;

ALTER TABLE public.teacher_notes
  ADD COLUMN IF NOT EXISTS teacher_uid uuid REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS student_uid uuid REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS text text,
  ADD COLUMN IF NOT EXISTS category text;

ALTER TABLE public.student_groups
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS class_id text,
  ADD COLUMN IF NOT EXISTS student_uids uuid[] NOT NULL DEFAULT '{}'::uuid[];

-- ---------------------------------------------------------------------------
-- Indexes and constraints
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_developer_tasks_user_created
  ON public.developer_tasks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_developer_plans_user_version
  ON public.developer_plans(user_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_developer_milestones_user_created
  ON public.developer_milestones(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bomberman_lobbies_school_status
  ON public.bomberman_lobbies(school_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_duel_presence_school_online
  ON public.duel_presence(school_id, online_at DESC);
CREATE INDEX IF NOT EXISTS idx_duel_challenges_target_status
  ON public.duel_challenges(challenged_uid, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_active_duels_players_status
  ON public.active_duels(player1_uid, player2_uid, status);
CREATE INDEX IF NOT EXISTS idx_feedback_school_created
  ON public.feedback(school_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_abuse_logs_user_created
  ON public.xp_abuse_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_teacher_message_reads_user_read_at
  ON public.teacher_message_reads(user_id, read_at DESC);

DO $$
BEGIN
  ALTER TABLE public.developer_tasks
    ADD CONSTRAINT developer_tasks_status_check
    CHECK (status IN ('todo', 'pending', 'in_progress', 'done', 'completed', 'blocked', 'waiting_external'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.developer_tasks
    ADD CONSTRAINT developer_tasks_priority_check
    CHECK (priority IN ('low', 'medium', 'high'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.bomberman_lobbies
    ADD CONSTRAINT bomberman_lobbies_status_check
    CHECK (status IN ('waiting', 'playing', 'finished'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.duel_challenges
    ADD CONSTRAINT duel_challenges_status_check
    CHECK (status IN ('pending', 'accepted', 'declined', 'expired'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.active_duels
    ADD CONSTRAINT active_duels_status_check
    CHECK (status IN ('drawing', 'guessing', 'round_end', 'finished'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Explicit Data API grants + RLS. No anon access for student operational data.
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.developer_tasks,
  public.developer_plans,
  public.developer_milestones,
  public.developer_settings,
  public.bomberman_lobbies,
  public.duel_presence,
  public.duel_challenges,
  public.active_duels,
  public.feedback,
  public.xp_abuse_logs,
  public.user_blocks,
  public.class_settings,
  public.teacher_messages,
  public.teacher_message_reads,
  public.gamification_events,
  public.highlighted_work,
  public.teacher_notes,
  public.student_groups
TO authenticated, service_role;

-- Read state is tracked per recipient in teacher_message_reads. Keep message
-- rows insert/read-only for authenticated clients; content edits stay server-side.
REVOKE UPDATE ON TABLE public.teacher_messages FROM authenticated;

ALTER TABLE public.developer_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bomberman_lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duel_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duel_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_duels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_abuse_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlighted_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Developer users manage own tasks" ON public.developer_tasks;
CREATE POLICY "Developer users manage own tasks"
  ON public.developer_tasks
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() AND public.get_caller_app_role() = 'developer')
  WITH CHECK (user_id = auth.uid() AND public.get_caller_app_role() = 'developer');

DROP POLICY IF EXISTS "Developer users manage own plans" ON public.developer_plans;
CREATE POLICY "Developer users manage own plans"
  ON public.developer_plans
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() AND public.get_caller_app_role() = 'developer')
  WITH CHECK (user_id = auth.uid() AND public.get_caller_app_role() = 'developer');

DROP POLICY IF EXISTS "Developer users manage own milestones" ON public.developer_milestones;
CREATE POLICY "Developer users manage own milestones"
  ON public.developer_milestones
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() AND public.get_caller_app_role() = 'developer')
  WITH CHECK (user_id = auth.uid() AND public.get_caller_app_role() = 'developer');

DROP POLICY IF EXISTS "Developer users manage own settings" ON public.developer_settings;
CREATE POLICY "Developer users manage own settings"
  ON public.developer_settings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() AND public.get_caller_app_role() = 'developer')
  WITH CHECK (user_id = auth.uid() AND public.get_caller_app_role() = 'developer');

DROP POLICY IF EXISTS "School users can read bomberman lobbies" ON public.bomberman_lobbies;
CREATE POLICY "School users can read bomberman lobbies"
  ON public.bomberman_lobbies
  FOR SELECT
  TO authenticated
  USING (
    host_uid = auth.uid()
    OR (school_id IS NOT NULL AND school_id = public.get_caller_school_id())
  );

DROP POLICY IF EXISTS "School users can write bomberman lobbies" ON public.bomberman_lobbies;
CREATE POLICY "School users can write bomberman lobbies"
  ON public.bomberman_lobbies
  FOR ALL
  TO authenticated
  USING (
    host_uid = auth.uid()
    OR (school_id IS NOT NULL AND school_id = public.get_caller_school_id())
  )
  WITH CHECK (
    host_uid = auth.uid()
    OR (school_id IS NOT NULL AND school_id = public.get_caller_school_id())
  );

DROP POLICY IF EXISTS "Users manage own duel presence" ON public.duel_presence;
CREATE POLICY "Users manage own duel presence"
  ON public.duel_presence
  FOR ALL
  TO authenticated
  USING (uid = auth.uid())
  WITH CHECK (
    uid = auth.uid()
    AND (school_id IS NULL OR school_id = public.get_caller_school_id())
  );

DROP POLICY IF EXISTS "School users read duel presence" ON public.duel_presence;
CREATE POLICY "School users read duel presence"
  ON public.duel_presence
  FOR SELECT
  TO authenticated
  USING (
    uid = auth.uid()
    OR (school_id IS NOT NULL AND school_id = public.get_caller_school_id())
  );

DROP POLICY IF EXISTS "Participants manage duel challenges" ON public.duel_challenges;
CREATE POLICY "Participants manage duel challenges"
  ON public.duel_challenges
  FOR ALL
  TO authenticated
  USING (challenger_uid = auth.uid() OR challenged_uid = auth.uid())
  WITH CHECK (challenger_uid = auth.uid() OR challenged_uid = auth.uid());

DROP POLICY IF EXISTS "Participants manage active duels" ON public.active_duels;
CREATE POLICY "Participants manage active duels"
  ON public.active_duels
  FOR ALL
  TO authenticated
  USING (player1_uid = auth.uid() OR player2_uid = auth.uid())
  WITH CHECK (player1_uid = auth.uid() OR player2_uid = auth.uid());

DROP POLICY IF EXISTS "Users submit own feedback" ON public.feedback;
CREATE POLICY "Users submit own feedback"
  ON public.feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Privileged users read feedback for school" ON public.feedback;
CREATE POLICY "Privileged users read feedback for school"
  ON public.feedback
  FOR SELECT
  TO authenticated
  USING (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(feedback.school_id::text)
  );

DROP POLICY IF EXISTS "Privileged users delete feedback for school" ON public.feedback;
CREATE POLICY "Privileged users delete feedback for school"
  ON public.feedback
  FOR DELETE
  TO authenticated
  USING (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(feedback.school_id::text)
  );

DROP POLICY IF EXISTS "Users insert own xp abuse logs" ON public.xp_abuse_logs;
CREATE POLICY "Users insert own xp abuse logs"
  ON public.xp_abuse_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users read own xp abuse logs" ON public.xp_abuse_logs;
CREATE POLICY "Users read own xp abuse logs"
  ON public.xp_abuse_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users manage own block list" ON public.user_blocks;
CREATE POLICY "Users manage own block list"
  ON public.user_blocks
  FOR ALL
  TO authenticated
  USING (blocker_id = auth.uid())
  WITH CHECK (blocker_id = auth.uid());

DROP POLICY IF EXISTS "School users read class settings" ON public.class_settings;
CREATE POLICY "School users read class settings"
  ON public.class_settings
  FOR SELECT
  TO authenticated
  USING (
    school_id IS NOT NULL
    AND school_id = public.get_caller_school_id()
  );

DROP POLICY IF EXISTS "Privileged users manage school class settings" ON public.class_settings;
CREATE POLICY "Privileged users manage school class settings"
  ON public.class_settings
  FOR ALL
  TO authenticated
  USING (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(class_settings.school_id::text)
  )
  WITH CHECK (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(class_settings.school_id::text)
  );

DROP POLICY IF EXISTS "School users read teacher messages" ON public.teacher_messages;
CREATE POLICY "School users read teacher messages"
  ON public.teacher_messages
  FOR SELECT
  TO authenticated
  USING (
    (target_type = 'student' AND target_id = (SELECT auth.uid())::text)
    OR (
      target_type IN ('class', 'all')
      AND school_id IS NOT NULL
      AND school_id = (SELECT public.get_caller_school_id())
    )
  );

DROP POLICY IF EXISTS "Privileged users send teacher messages" ON public.teacher_messages;
CREATE POLICY "Privileged users send teacher messages"
  ON public.teacher_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT public.get_caller_app_role()) = 'developer'
    OR public.is_teacher_in_school(teacher_messages.school_id::text)
  );

DROP POLICY IF EXISTS "Recipients mark teacher messages read" ON public.teacher_messages;

DROP POLICY IF EXISTS "Users read own teacher message receipts" ON public.teacher_message_reads;
CREATE POLICY "Users read own teacher message receipts"
  ON public.teacher_message_reads
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users insert own teacher message receipts" ON public.teacher_message_reads;
CREATE POLICY "Users insert own teacher message receipts"
  ON public.teacher_message_reads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.teacher_messages tm
      WHERE tm.id = teacher_message_reads.message_id
        AND (
          (tm.target_type = 'student' AND tm.target_id = (SELECT auth.uid())::text)
          OR (
            tm.target_type IN ('class', 'all')
            AND tm.school_id IS NOT NULL
            AND tm.school_id = (SELECT public.get_caller_school_id())
          )
        )
    )
  );

DROP POLICY IF EXISTS "Users update own teacher message receipts" ON public.teacher_message_reads;
CREATE POLICY "Users update own teacher message receipts"
  ON public.teacher_message_reads
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.teacher_messages tm
      WHERE tm.id = teacher_message_reads.message_id
        AND (
          (tm.target_type = 'student' AND tm.target_id = (SELECT auth.uid())::text)
          OR (
            tm.target_type IN ('class', 'all')
            AND tm.school_id IS NOT NULL
            AND tm.school_id = (SELECT public.get_caller_school_id())
          )
        )
    )
  );

DROP POLICY IF EXISTS "School users read gamification events" ON public.gamification_events;
CREATE POLICY "School users read gamification events"
  ON public.gamification_events
  FOR SELECT
  TO authenticated
  USING (
    school_id IS NOT NULL
    AND school_id = public.get_caller_school_id()
  );

DROP POLICY IF EXISTS "Privileged users manage gamification events" ON public.gamification_events;
CREATE POLICY "Privileged users manage gamification events"
  ON public.gamification_events
  FOR ALL
  TO authenticated
  USING (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(gamification_events.school_id::text)
  )
  WITH CHECK (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(gamification_events.school_id::text)
  );

DROP POLICY IF EXISTS "School users read highlighted work" ON public.highlighted_work;
CREATE POLICY "School users read highlighted work"
  ON public.highlighted_work
  FOR SELECT
  TO authenticated
  USING (
    school_id IS NOT NULL
    AND school_id = public.get_caller_school_id()
  );

DROP POLICY IF EXISTS "Privileged users manage highlighted work" ON public.highlighted_work;
CREATE POLICY "Privileged users manage highlighted work"
  ON public.highlighted_work
  FOR ALL
  TO authenticated
  USING (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(highlighted_work.school_id::text)
  )
  WITH CHECK (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(highlighted_work.school_id::text)
  );

DROP POLICY IF EXISTS "Privileged users manage teacher notes" ON public.teacher_notes;
CREATE POLICY "Privileged users manage teacher notes"
  ON public.teacher_notes
  FOR ALL
  TO authenticated
  USING (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(teacher_notes.school_id::text)
    OR (
      teacher_uid = auth.uid()
      AND school_id IS NOT NULL
      AND school_id = public.get_caller_school_id()
    )
  )
  WITH CHECK (
    public.get_caller_app_role() = 'developer'
    OR (
      teacher_uid = auth.uid()
      AND public.is_teacher_in_school(teacher_notes.school_id::text)
    )
  );

DROP POLICY IF EXISTS "Privileged users manage student groups" ON public.student_groups;
CREATE POLICY "Privileged users manage student groups"
  ON public.student_groups
  FOR ALL
  TO authenticated
  USING (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(student_groups.school_id::text)
  )
  WITH CHECK (
    public.get_caller_app_role() = 'developer'
    OR public.is_teacher_in_school(student_groups.school_id::text)
  );
