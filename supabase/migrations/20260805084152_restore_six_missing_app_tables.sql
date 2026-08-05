-- ============================================================================
-- Herstel de zes app-tabellen die in productie ontbreken
-- ----------------------------------------------------------------------------
-- Versmalde variant van 20260626145000_reconcile_missing_app_tables_for_remote_schema
-- (branch codex/release-dgskills-waiting-room-2026-06-26, PR #164).
--
-- Waarom versmald: het origineel raakt alle 18 tabellen uit die reconcile en zou
-- de RLS-policies van de 12 BESTAANDE tabellen herschrijven. Dat is niet nodig
-- en vergroot het risico. Deze variant raakt uitsluitend de 6 tabellen die
-- daadwerkelijk ontbreken; bestaande tabellen blijven volledig ongemoeid.
--
-- Bewust NIET overgenomen uit het origineel (raakt bestaande tabellen):
--   - ALTER TABLE public.teacher_messages ALTER COLUMN read SET DEFAULT/NOT NULL
--   - REVOKE UPDATE ON public.teacher_messages FROM authenticated
--   - DROP POLICY "Recipients mark teacher messages read" ON public.teacher_messages
--
-- Eén aanpassing t.o.v. het origineel: de backfill gebruikte
-- COALESCE(timestamp, created_at, now()), maar public.teacher_messages heeft in
-- deze database GEEN created_at-kolom. Dat zou de migratie laten falen.
-- Aangepast naar COALESCE(timestamp, now()).
--
-- Vooraf geverifieerd tegen productie: users.id = uuid, teacher_messages.id = uuid,
-- pgcrypto aanwezig, en get_caller_app_role() / get_caller_school_id() /
-- is_teacher_in_school(text) bestaan alle drie.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. Tabellen
-- ---------------------------------------------------------------------------

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

CREATE TABLE IF NOT EXISTS public.teacher_message_reads (
  message_id uuid NOT NULL REFERENCES public.teacher_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);

-- ---------------------------------------------------------------------------
-- 2. Bestaande leesbevestigingen overzetten
--    Zonder dit lijken alle eerder gelezen docentberichten weer ongelezen.
--    Strikt afgeschermd: alleen read=true, alleen persoonlijke berichten, en
--    alleen als target_id een geldige uuid is. ON CONFLICT DO NOTHING.
-- ---------------------------------------------------------------------------

INSERT INTO public.teacher_message_reads (message_id, user_id, read_at)
SELECT id, target_id::uuid, COALESCE(timestamp, now())
FROM public.teacher_messages
WHERE read = true
  AND target_type = 'student'
  AND target_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
ON CONFLICT (message_id, user_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 3. Indexen
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_developer_milestones_user_created
  ON public.developer_milestones(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bomberman_lobbies_school_status
  ON public.bomberman_lobbies(school_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_school_created
  ON public.feedback(school_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_abuse_logs_user_created
  ON public.xp_abuse_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_teacher_message_reads_user_read_at
  ON public.teacher_message_reads(user_id, read_at DESC);

-- ---------------------------------------------------------------------------
-- 4. Data API-rechten en RLS. Geen anon-toegang tot leerling-operationele data.
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.developer_milestones,
  public.developer_settings,
  public.bomberman_lobbies,
  public.feedback,
  public.xp_abuse_logs,
  public.teacher_message_reads
TO authenticated, service_role;

ALTER TABLE public.developer_milestones   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bomberman_lobbies      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_abuse_logs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_message_reads  ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 5. Policies (letterlijk overgenomen uit het origineel)
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Developer users manage own milestones" ON public.developer_milestones;
CREATE POLICY "Developer users manage own milestones"
  ON public.developer_milestones
  FOR ALL
  TO authenticated
  USING (user_id::text = auth.uid()::text AND public.get_caller_app_role() = 'developer')
  WITH CHECK (user_id::text = auth.uid()::text AND public.get_caller_app_role() = 'developer');

DROP POLICY IF EXISTS "Developer users manage own settings" ON public.developer_settings;
CREATE POLICY "Developer users manage own settings"
  ON public.developer_settings
  FOR ALL
  TO authenticated
  USING (user_id::text = auth.uid()::text AND public.get_caller_app_role() = 'developer')
  WITH CHECK (user_id::text = auth.uid()::text AND public.get_caller_app_role() = 'developer');

DROP POLICY IF EXISTS "School users can read bomberman lobbies" ON public.bomberman_lobbies;
CREATE POLICY "School users can read bomberman lobbies"
  ON public.bomberman_lobbies
  FOR SELECT
  TO authenticated
  USING (
    host_uid::text = auth.uid()::text
    OR (school_id IS NOT NULL AND school_id = public.get_caller_school_id())
  );

DROP POLICY IF EXISTS "School users can write bomberman lobbies" ON public.bomberman_lobbies;
CREATE POLICY "School users can write bomberman lobbies"
  ON public.bomberman_lobbies
  FOR ALL
  TO authenticated
  USING (
    host_uid::text = auth.uid()::text
    OR (school_id IS NOT NULL AND school_id = public.get_caller_school_id())
  )
  WITH CHECK (
    host_uid::text = auth.uid()::text
    OR (school_id IS NOT NULL AND school_id = public.get_caller_school_id())
  );

DROP POLICY IF EXISTS "Users submit own feedback" ON public.feedback;
CREATE POLICY "Users submit own feedback"
  ON public.feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

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
  WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users read own xp abuse logs" ON public.xp_abuse_logs;
CREATE POLICY "Users read own xp abuse logs"
  ON public.xp_abuse_logs
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users read own teacher message receipts" ON public.teacher_message_reads;
CREATE POLICY "Users read own teacher message receipts"
  ON public.teacher_message_reads
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users insert own teacher message receipts" ON public.teacher_message_reads;
CREATE POLICY "Users insert own teacher message receipts"
  ON public.teacher_message_reads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id::text = auth.uid()::text
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
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (
    user_id::text = auth.uid()::text
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
