-- ============================================================================
-- Teacher dashboard school-scope hardening
-- ============================================================================
-- Doel:
--   Verstrak docent-RLS voor dashboardtabellen zodat privileged toegang niet
--   langer alleen op rol/MFA leunt, maar ook expliciet op school-scope via
--   public.is_teacher_in_school(school_id).
--
-- Scope:
--   - assessment_results: teacher SELECT alleen eigen school
--   - growth_recommendations: teacher SELECT alleen eigen school; review via RPC
--   - eindmeting_releases: teacher SELECT/INSERT alleen eigen school
--
-- Belangrijk:
--   - Bestaande leerling/eigen policies blijven intact.
--   - Alleen veilige backfill voor ontbrekende school_id op bestaande rijen.
--   - Idempotent via DROP POLICY IF EXISTS + CREATE POLICY.
-- ============================================================================

-- Vul bestaande assessment/aanbevelingsrijen met school_id uit public.users.
-- Zonder deze backfill verdwijnen oudere nullable school_id-rijen terecht achter
-- de nieuwe school-scope policies, maar dan missen docenten mogelijk eigen data.
UPDATE public.assessment_results ar
SET school_id = u.school_id
FROM public.users u
WHERE ar.user_id = u.id
  AND ar.school_id IS NULL
  AND u.school_id IS NOT NULL;
UPDATE public.growth_recommendations gr
SET school_id = u.school_id
FROM public.users u
WHERE gr.user_id = u.id
  AND gr.school_id IS NULL
  AND u.school_id IS NOT NULL;
-- ----------------------------------------------------------------------------
-- assessment_results
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Docenten lezen assessment resultaten" ON public.assessment_results;
CREATE POLICY "Docenten lezen assessment resultaten"
  ON public.assessment_results
  FOR SELECT
  USING (public.is_teacher_in_school(school_id));
-- ----------------------------------------------------------------------------
-- growth_recommendations
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Docenten lezen aanbevelingen" ON public.growth_recommendations;
CREATE POLICY "Docenten lezen aanbevelingen"
  ON public.growth_recommendations
  FOR SELECT
  USING (public.is_teacher_in_school(school_id));
-- Directe browser-updates blijven dicht; docenten reviewen via
-- public.review_growth_recommendation(), met schoolcheck en auditlog.
DROP POLICY IF EXISTS "Docenten keuren aanbevelingen goed" ON public.growth_recommendations;
CREATE POLICY "Docenten keuren aanbevelingen goed"
  ON public.growth_recommendations
  FOR UPDATE
  USING (false)
  WITH CHECK (false);
CREATE OR REPLACE FUNCTION public.review_growth_recommendation(
  p_recommendation_id uuid,
  p_approved boolean,
  p_notes text DEFAULT NULL
)
RETURNS public.growth_recommendations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.growth_recommendations%ROWTYPE;
BEGIN
  IF NOT public.is_teacher() THEN
    RAISE EXCEPTION 'Unauthorized: teacher/admin/developer with MFA required';
  END IF;

  SELECT *
    INTO v_row
  FROM public.growth_recommendations
  WHERE id = p_recommendation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recommendation not found';
  END IF;

  IF NOT public.is_teacher_in_school(v_row.school_id) THEN
    RAISE EXCEPTION 'Unauthorized: only same-school teachers may review recommendations';
  END IF;

  UPDATE public.growth_recommendations
  SET
    teacher_approved = p_approved,
    teacher_approved_at = now(),
    teacher_approved_by = auth.uid(),
    teacher_notes = CASE
      WHEN p_notes IS NULL THEN teacher_notes
      ELSE left(p_notes, 2000)
    END
  WHERE id = p_recommendation_id
  RETURNING * INTO v_row;

  INSERT INTO public.audit_logs (action, uid, school_id, data)
  VALUES (
    'growth_recommendation_reviewed',
    auth.uid()::text,
    v_row.school_id,
    jsonb_build_object(
      'recommendation_id', v_row.id,
      'student_id', v_row.user_id,
      'school_year', v_row.school_year,
      'approved', p_approved
    )
  );

  RETURN v_row;
END;
$$;
REVOKE ALL ON FUNCTION public.review_growth_recommendation(uuid, boolean, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.review_growth_recommendation(uuid, boolean, text) TO authenticated;
-- ----------------------------------------------------------------------------
-- eindmeting_releases
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Docenten lezen eindmeting vrijgaves" ON public.eindmeting_releases;
CREATE POLICY "Docenten lezen eindmeting vrijgaves"
  ON public.eindmeting_releases
  FOR SELECT
  USING (public.is_teacher_in_school(school_id));
DROP POLICY IF EXISTS "Docenten maken eindmeting vrijgaves" ON public.eindmeting_releases;
CREATE POLICY "Docenten maken eindmeting vrijgaves"
  ON public.eindmeting_releases
  FOR INSERT
  WITH CHECK (public.is_teacher_in_school(school_id));
