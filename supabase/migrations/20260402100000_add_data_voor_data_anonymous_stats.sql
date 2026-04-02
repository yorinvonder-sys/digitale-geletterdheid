-- ============================================================================
-- Data voor Data: echte, anonieme leerlingstatistieken
-- ============================================================================
-- Doel:
-- 1. Sla keuzes per leerling minimalistisch op, zonder namen of extra PII.
-- 2. Toon alleen geanonimiseerde aggregaties aan leerlingen.
-- 3. Bescherm kleine groepen met k-anonimiteit:
--    - klasniveau pas vanaf 5 antwoorden
--    - schoolniveau pas vanaf 10 antwoorden
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.data_for_data_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_data_for_data_answers_array CHECK (jsonb_typeof(answers) = 'array')
);

CREATE INDEX IF NOT EXISTS idx_data_for_data_answers_updated_at
  ON public.data_for_data_answers (updated_at DESC);

ALTER TABLE public.data_for_data_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students read own data_for_data answers" ON public.data_for_data_answers;
CREATE POLICY "Students read own data_for_data answers"
  ON public.data_for_data_answers
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students insert own data_for_data answers" ON public.data_for_data_answers;
CREATE POLICY "Students insert own data_for_data answers"
  ON public.data_for_data_answers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students update own data_for_data answers" ON public.data_for_data_answers;
CREATE POLICY "Students update own data_for_data answers"
  ON public.data_for_data_answers
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.submit_data_for_data_answers(
  p_answers jsonb,
  p_status text DEFAULT 'in_progress'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid := auth.uid();
  v_answer_count integer;
  v_effective_status text;
  v_processing_restricted boolean;
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF jsonb_typeof(coalesce(p_answers, 'null'::jsonb)) <> 'array' THEN
    RAISE EXCEPTION 'Answers must be a JSON array';
  END IF;

  v_answer_count := jsonb_array_length(p_answers);

  IF v_answer_count > 5 THEN
    RAISE EXCEPTION 'Too many answers';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(p_answers) AS choice(value)
    WHERE choice.value NOT IN ('deal', 'no-deal')
  ) THEN
    RAISE EXCEPTION 'Invalid answer value';
  END IF;

  SELECT coalesce(processing_restricted, false)
    INTO v_processing_restricted
  FROM public.users
  WHERE id = v_caller_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Caller profile missing';
  END IF;

  -- Respecteer privacybeperkingen: sla geen analytics op voor restricted users.
  IF v_processing_restricted THEN
    DELETE FROM public.data_for_data_answers
    WHERE user_id = v_caller_id;
    RETURN true;
  END IF;

  v_effective_status := CASE
    WHEN p_status = 'completed' AND v_answer_count = 5 THEN 'completed'
    WHEN v_answer_count = 5 THEN 'completed'
    ELSE 'in_progress'
  END;

  INSERT INTO public.data_for_data_answers (
    user_id,
    answers,
    status,
    completed_at,
    updated_at
  )
  VALUES (
    v_caller_id,
    p_answers,
    v_effective_status,
    CASE WHEN v_effective_status = 'completed' THEN now() ELSE NULL END,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE
  SET answers = EXCLUDED.answers,
      status = EXCLUDED.status,
      completed_at = CASE
        WHEN EXCLUDED.status = 'completed' THEN now()
        ELSE NULL
      END,
      updated_at = now();

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_data_for_data_round_stats()
RETURNS TABLE (
  round_index integer,
  deal_percentage integer,
  scope text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid := auth.uid();
  v_school_id text;
  v_class_id text;
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT school_id, student_class
    INTO v_school_id, v_class_id
  FROM public.users
  WHERE id = v_caller_id;

  IF v_school_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH rounds AS (
    SELECT generate_series(0, 4) AS round_index
  ),
  eligible_submissions AS (
    SELECT
      answers.user_id,
      answers.answers,
      users.school_id,
      users.student_class
    FROM public.data_for_data_answers AS answers
    JOIN public.users AS users
      ON users.id = answers.user_id
    WHERE users.role = 'student'
      AND users.school_id = v_school_id
      AND coalesce(users.processing_restricted, false) = false
      AND jsonb_typeof(answers.answers) = 'array'
  ),
  class_stats AS (
    SELECT
      rounds.round_index,
      count(*) FILTER (
        WHERE eligible_submissions.student_class = v_class_id
          AND jsonb_array_length(eligible_submissions.answers) > rounds.round_index
      )::integer AS total_answers,
      count(*) FILTER (
        WHERE eligible_submissions.student_class = v_class_id
          AND jsonb_array_length(eligible_submissions.answers) > rounds.round_index
          AND eligible_submissions.answers ->> rounds.round_index = 'deal'
      )::integer AS deal_answers
    FROM rounds
    LEFT JOIN eligible_submissions
      ON true
    GROUP BY rounds.round_index
  ),
  school_stats AS (
    SELECT
      rounds.round_index,
      count(*) FILTER (
        WHERE jsonb_array_length(eligible_submissions.answers) > rounds.round_index
      )::integer AS total_answers,
      count(*) FILTER (
        WHERE jsonb_array_length(eligible_submissions.answers) > rounds.round_index
          AND eligible_submissions.answers ->> rounds.round_index = 'deal'
      )::integer AS deal_answers
    FROM rounds
    LEFT JOIN eligible_submissions
      ON true
    GROUP BY rounds.round_index
  )
  SELECT
    class_stats.round_index,
    round((class_stats.deal_answers::numeric * 100) / NULLIF(class_stats.total_answers, 0))::integer AS deal_percentage,
    'class'::text AS scope
  FROM class_stats
  WHERE class_stats.total_answers >= 5

  UNION ALL

  SELECT
    school_stats.round_index,
    round((school_stats.deal_answers::numeric * 100) / NULLIF(school_stats.total_answers, 0))::integer AS deal_percentage,
    'school'::text AS scope
  FROM school_stats
  WHERE school_stats.total_answers >= 10
    AND NOT EXISTS (
      SELECT 1
      FROM class_stats
      WHERE class_stats.round_index = school_stats.round_index
        AND class_stats.total_answers >= 5
    )

  ORDER BY round_index;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_data_for_data_answers(jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_data_for_data_round_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_data_for_data_answers(jsonb, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_data_for_data_round_stats() TO authenticated;
