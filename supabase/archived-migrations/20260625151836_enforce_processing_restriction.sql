-- ===========================================================================
-- AVG Art. 18: Processing restriction enforcement
-- ===========================================================================
-- Strict but workable policy:
-- - Block new AI/provider calls and optional analytics in Edge Functions.
-- - Block new non-essential own student writes through RLS as defense-in-depth.
-- - Keep SELECT, export/delete/restrict, audit, consent records, teacher
--   oversight, and existing school records available.
-- ===========================================================================

CREATE OR REPLACE FUNCTION public.current_user_processing_restricted()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (
      SELECT u.processing_restricted
      FROM public.users u
      WHERE u.id = auth.uid()
      LIMIT 1
    ),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_processing_restricted() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_user_processing_restricted() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_processing_restricted() TO authenticated, service_role;

COMMENT ON FUNCTION public.current_user_processing_restricted() IS
  'Returns whether the current authenticated user has invoked AVG Art. 18 processing restriction. Used only to block new non-essential writes; it does not hide existing school records.';

-- ---------------------------------------------------------------------------
-- Learning progress and assessment writes
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "mission_progress_insert_own" ON public.mission_progress;
DROP POLICY IF EXISTS "mission_progress_owner_insert" ON public.mission_progress;
CREATE POLICY "mission_progress_insert_own"
  ON public.mission_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT public.current_user_processing_restricted()
    AND (
      school_id IS NULL
      OR school_id = public.get_caller_school_id()
    )
  );

DROP POLICY IF EXISTS "mission_progress_update_own" ON public.mission_progress;
DROP POLICY IF EXISTS "mission_progress_owner_update" ON public.mission_progress;
CREATE POLICY "mission_progress_update_own"
  ON public.mission_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND NOT public.current_user_processing_restricted()
    AND (
      school_id IS NULL
      OR school_id = public.get_caller_school_id()
    )
  );

DROP POLICY IF EXISTS "Leerlingen maken eigen nulmeting" ON public.nulmeting_results;
CREATE POLICY "Leerlingen maken eigen nulmeting"
  ON public.nulmeting_results
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT public.current_user_processing_restricted()
  );

DROP POLICY IF EXISTS "Leerlingen updaten eigen nulmeting" ON public.nulmeting_results;
CREATE POLICY "Leerlingen updaten eigen nulmeting"
  ON public.nulmeting_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND NOT public.current_user_processing_restricted()
  );

DROP POLICY IF EXISTS "Leerlingen maken eigen assessment" ON public.assessment_results;
CREATE POLICY "Leerlingen maken eigen assessment"
  ON public.assessment_results
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT public.current_user_processing_restricted()
    AND (
      school_id IS NULL
      OR school_id::text = coalesce(
        public.get_caller_school_id(),
        (SELECT u.school_id::text FROM public.users u WHERE u.id = auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Leerlingen updaten eigen assessment" ON public.assessment_results;
CREATE POLICY "Leerlingen updaten eigen assessment"
  ON public.assessment_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND NOT public.current_user_processing_restricted()
    AND (
      school_id IS NULL
      OR school_id::text = coalesce(
        public.get_caller_school_id(),
        (SELECT u.school_id::text FROM public.users u WHERE u.id = auth.uid())
      )
    )
  );

-- Client-side inserts into growth_recommendations remain disabled by the later
-- security hardening migration. The Edge Function does the restriction check
-- before any service-role insert or provider call.

-- ---------------------------------------------------------------------------
-- Feedback, saved work and shared work writes
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users submit own feedback" ON public.feedback;
CREATE POLICY "Users submit own feedback"
  ON public.feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND NOT public.current_user_processing_restricted()
  );

DROP POLICY IF EXISTS "library_items_owner_insert" ON public.library_items;
CREATE POLICY "library_items_owner_insert"
  ON public.library_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT public.current_user_processing_restricted()
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
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND NOT public.current_user_processing_restricted()
  );

DROP POLICY IF EXISTS "shared_games_owner_insert" ON public.shared_games;
CREATE POLICY "shared_games_owner_insert"
  ON public.shared_games
  FOR INSERT
  TO authenticated
  WITH CHECK (
    coalesce(user_id::text, creator_uid::text) = auth.uid()::text
    AND NOT public.current_user_processing_restricted()
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
  TO authenticated
  USING (
    coalesce(user_id::text, creator_uid::text) = auth.uid()::text
    OR public.is_teacher_in_school(school_id)
  )
  WITH CHECK (
    (
      coalesce(user_id::text, creator_uid::text) = auth.uid()::text
      AND NOT public.current_user_processing_restricted()
    )
    OR public.is_teacher_in_school(school_id)
  );

DROP POLICY IF EXISTS "shared_projects_owner_insert" ON public.shared_projects;
CREATE POLICY "shared_projects_owner_insert"
  ON public.shared_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    coalesce(user_id::text, created_by::text) = auth.uid()::text
    AND NOT public.current_user_processing_restricted()
    AND length(trim(name)) BETWEEN 1 AND 100
    AND (
      school_id IS NULL
      OR school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- Duel/gameplay writes: split FOR ALL policies so delete/select stay available
-- while inserts/updates are blocked for restricted users.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Participants manage duel challenges" ON public.duel_challenges;
DROP POLICY IF EXISTS "Participants read duel challenges" ON public.duel_challenges;
CREATE POLICY "Participants read duel challenges"
  ON public.duel_challenges
  FOR SELECT
  TO authenticated
  USING (challenger_uid = auth.uid() OR challenged_uid = auth.uid());

DROP POLICY IF EXISTS "Participants insert duel challenges" ON public.duel_challenges;
CREATE POLICY "Participants insert duel challenges"
  ON public.duel_challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (challenger_uid = auth.uid() OR challenged_uid = auth.uid())
    AND NOT public.current_user_processing_restricted()
  );

DROP POLICY IF EXISTS "Participants update duel challenges" ON public.duel_challenges;
CREATE POLICY "Participants update duel challenges"
  ON public.duel_challenges
  FOR UPDATE
  TO authenticated
  USING (challenger_uid = auth.uid() OR challenged_uid = auth.uid())
  WITH CHECK (
    (challenger_uid = auth.uid() OR challenged_uid = auth.uid())
    AND NOT public.current_user_processing_restricted()
  );

DROP POLICY IF EXISTS "Participants delete duel challenges" ON public.duel_challenges;
CREATE POLICY "Participants delete duel challenges"
  ON public.duel_challenges
  FOR DELETE
  TO authenticated
  USING (challenger_uid = auth.uid() OR challenged_uid = auth.uid());

DROP POLICY IF EXISTS "Participants manage active duels" ON public.active_duels;
DROP POLICY IF EXISTS "Participants read active duels" ON public.active_duels;
CREATE POLICY "Participants read active duels"
  ON public.active_duels
  FOR SELECT
  TO authenticated
  USING (player1_uid = auth.uid() OR player2_uid = auth.uid());

DROP POLICY IF EXISTS "Participants insert active duels" ON public.active_duels;
CREATE POLICY "Participants insert active duels"
  ON public.active_duels
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (player1_uid = auth.uid() OR player2_uid = auth.uid())
    AND NOT public.current_user_processing_restricted()
  );

DROP POLICY IF EXISTS "Participants update active duels" ON public.active_duels;
CREATE POLICY "Participants update active duels"
  ON public.active_duels
  FOR UPDATE
  TO authenticated
  USING (player1_uid = auth.uid() OR player2_uid = auth.uid())
  WITH CHECK (
    (player1_uid = auth.uid() OR player2_uid = auth.uid())
    AND NOT public.current_user_processing_restricted()
  );

DROP POLICY IF EXISTS "Participants delete active duels" ON public.active_duels;
CREATE POLICY "Participants delete active duels"
  ON public.active_duels
  FOR DELETE
  TO authenticated
  USING (player1_uid = auth.uid() OR player2_uid = auth.uid());
