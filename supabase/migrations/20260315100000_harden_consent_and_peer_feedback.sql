-- ============================================================================
-- Harden parental consent flow and peer feedback writes
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.parental_consent_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  school_name TEXT NOT NULL,
  consent_types TEXT[] NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'expired', 'cancelled')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  approved_ip_hash TEXT,
  approved_user_agent_hash TEXT,
  CONSTRAINT parental_consent_requests_consent_types_check
    CHECK (
      array_length(consent_types, 1) IS NOT NULL
      AND consent_types <@ ARRAY['data_processing', 'ai_interaction', 'analytics', 'peer_feedback']::TEXT[]
    )
);

CREATE INDEX IF NOT EXISTS idx_parental_consent_requests_student_id
  ON public.parental_consent_requests(student_id, status);

CREATE INDEX IF NOT EXISTS idx_parental_consent_requests_school_id
  ON public.parental_consent_requests(school_id, status);

ALTER TABLE public.parental_consent_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students read own parental consent requests" ON public.parental_consent_requests;
CREATE POLICY "Students read own parental consent requests"
  ON public.parental_consent_requests FOR SELECT
  USING (student_id = auth.uid() OR requested_by = auth.uid());

DROP POLICY IF EXISTS "Teachers read school parental consent requests" ON public.parental_consent_requests;
CREATE POLICY "Teachers read school parental consent requests"
  ON public.parental_consent_requests FOR SELECT
  USING (public.is_teacher_in_school(school_id));

CREATE OR REPLACE FUNCTION public.student_requires_parental_consent(p_student_id UUID DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_year_group smallint;
BEGIN
  IF p_student_id IS NULL THEN
    RETURN true;
  END IF;

  SELECT year_group
    INTO v_year_group
  FROM public.users
  WHERE id = p_student_id;

  IF v_year_group IS NULL THEN
    RETURN true;
  END IF;

  RETURN v_year_group <= 4;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_own_consent(
  p_consent_type TEXT,
  p_granted boolean,
  p_consent_version TEXT DEFAULT '1.0'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id UUID := auth.uid();
  v_school_id TEXT;
BEGIN
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF p_consent_type NOT IN ('data_processing', 'ai_interaction', 'analytics', 'peer_feedback') THEN
    RAISE EXCEPTION 'Unknown consent type: %', p_consent_type;
  END IF;

  SELECT school_id
    INTO v_school_id
  FROM public.users
  WHERE id = v_student_id;

  IF v_school_id IS NULL THEN
    RAISE EXCEPTION 'Missing school scope for user %', v_student_id;
  END IF;

  IF p_granted THEN
    IF public.student_requires_parental_consent(v_student_id) THEN
      RAISE EXCEPTION 'Parental consent required';
    END IF;

    INSERT INTO public.student_consents (
      student_id,
      school_id,
      consent_type,
      granted,
      granted_by,
      granted_at,
      revoked_at,
      parent_email,
      parent_name,
      ip_address,
      consent_version
    )
    VALUES (
      v_student_id,
      v_school_id,
      p_consent_type,
      true,
      'student',
      now(),
      null,
      null,
      null,
      null,
      coalesce(nullif(p_consent_version, ''), '1.0')
    )
    ON CONFLICT (student_id, consent_type)
    DO UPDATE SET
      school_id = EXCLUDED.school_id,
      granted = true,
      granted_by = 'student',
      granted_at = now(),
      revoked_at = null,
      parent_email = null,
      parent_name = null,
      ip_address = null,
      consent_version = EXCLUDED.consent_version;
  ELSE
    UPDATE public.student_consents
    SET granted = false,
        revoked_at = now()
    WHERE student_id = v_student_id
      AND consent_type = p_consent_type;
  END IF;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.student_requires_parental_consent(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_own_consent(TEXT, boolean, TEXT) TO authenticated;

DROP POLICY IF EXISTS "Students insert own consents" ON public.student_consents;
DROP POLICY IF EXISTS "Students update own consents" ON public.student_consents;

CREATE OR REPLACE FUNCTION public.submit_peer_feedback(
  p_mission_id TEXT,
  p_to_student_id UUID,
  p_feedback_text TEXT,
  p_rating INTEGER,
  p_criteria JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_from_student_id UUID := auth.uid();
  v_from_school_id TEXT;
  v_from_class_id TEXT;
  v_to_school_id TEXT;
  v_to_class_id TEXT;
  v_feedback_id UUID;
BEGIN
  IF v_from_student_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF p_to_student_id IS NULL OR p_to_student_id = v_from_student_id THEN
    RAISE EXCEPTION 'Invalid peer target';
  END IF;

  IF nullif(trim(coalesce(p_mission_id, '')), '') IS NULL THEN
    RAISE EXCEPTION 'Mission is required';
  END IF;

  IF nullif(trim(coalesce(p_feedback_text, '')), '') IS NULL OR char_length(trim(p_feedback_text)) < 20 THEN
    RAISE EXCEPTION 'Feedback must contain at least 20 characters';
  END IF;

  IF char_length(p_feedback_text) > 1000 THEN
    RAISE EXCEPTION 'Feedback is too long';
  END IF;

  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  IF coalesce(jsonb_typeof(p_criteria), 'object') <> 'object' THEN
    RAISE EXCEPTION 'Criteria must be a JSON object';
  END IF;

  SELECT school_id, student_class
    INTO v_from_school_id, v_from_class_id
  FROM public.users
  WHERE id = v_from_student_id;

  SELECT school_id, student_class
    INTO v_to_school_id, v_to_class_id
  FROM public.users
  WHERE id = p_to_student_id;

  IF v_from_school_id IS NULL OR v_from_class_id IS NULL THEN
    RAISE EXCEPTION 'Caller school/class missing';
  END IF;

  IF v_to_school_id IS NULL OR v_to_class_id IS NULL THEN
    RAISE EXCEPTION 'Target school/class missing';
  END IF;

  IF v_from_school_id <> v_to_school_id OR v_from_class_id <> v_to_class_id THEN
    RAISE EXCEPTION 'Peer feedback is limited to classmates in the same school';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.mission_progress
    WHERE user_id = v_from_student_id
      AND mission_id = p_mission_id
      AND status = 'completed'
  ) THEN
    RAISE EXCEPTION 'Complete the mission before giving peer feedback';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.mission_progress
    WHERE user_id = p_to_student_id
      AND mission_id = p_mission_id
      AND status = 'completed'
  ) THEN
    RAISE EXCEPTION 'Peer has not completed this mission';
  END IF;

  INSERT INTO public.peer_feedback (
    mission_id,
    from_student_id,
    to_student_id,
    school_id,
    class_id,
    feedback_text,
    rating,
    criteria
  )
  VALUES (
    p_mission_id,
    v_from_student_id,
    p_to_student_id,
    v_from_school_id,
    v_from_class_id,
    trim(p_feedback_text),
    p_rating,
    coalesce(p_criteria, '{}'::JSONB)
  )
  RETURNING id INTO v_feedback_id;

  RETURN v_feedback_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.vote_peer_feedback_helpful(
  p_feedback_id UUID,
  p_helpful boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.peer_feedback
  SET helpful_vote = p_helpful,
      updated_at = now()
  WHERE id = p_feedback_id
    AND to_student_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Peer feedback not found or not accessible';
  END IF;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_random_peer_for_review(
  p_mission_id TEXT
)
RETURNS TABLE(student_id UUID, display_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id UUID := auth.uid();
  v_school_id TEXT;
  v_class_id TEXT;
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT school_id, student_class
    INTO v_school_id, v_class_id
  FROM public.users
  WHERE id = v_caller_id;

  IF v_school_id IS NULL OR v_class_id IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.mission_progress
    WHERE user_id = v_caller_id
      AND mission_id = p_mission_id
      AND status = 'completed'
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH eligible AS (
    SELECT mp.user_id
    FROM public.mission_progress mp
    JOIN public.users u
      ON u.id = mp.user_id
    WHERE mp.mission_id = p_mission_id
      AND mp.status = 'completed'
      AND mp.user_id <> v_caller_id
      AND u.school_id = v_school_id
      AND u.student_class = v_class_id
      AND NOT EXISTS (
        SELECT 1
        FROM public.peer_feedback pf
        WHERE pf.from_student_id = v_caller_id
          AND pf.to_student_id = mp.user_id
          AND pf.mission_id = p_mission_id
      )
    ORDER BY random()
    LIMIT 1
  )
  SELECT eligible.user_id, 'Klasgenoot'::TEXT
  FROM eligible;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_peer_feedback(TEXT, UUID, TEXT, INTEGER, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vote_peer_feedback_helpful(UUID, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_random_peer_for_review(TEXT) TO authenticated;

DROP POLICY IF EXISTS "Students can create feedback for classmates" ON public.peer_feedback;
DROP POLICY IF EXISTS "Students can update helpful_vote on received feedback" ON public.peer_feedback;
