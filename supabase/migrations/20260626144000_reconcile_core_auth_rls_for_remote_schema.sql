-- ============================================================================
-- Remote reconciliation: core auth, RLS, consent, and rate limiting
-- ============================================================================
-- This intentionally keeps 20260509165658 unchanged. The live remote schema has
-- public.audit_logs.uid as text, while the older local replay baseline has it as
-- uuid. Cast both sides in audit policies so the final policy shape is safe for
-- both histories.
--
-- Fixes the high-risk findings from the 2026-05-09 Codex security report:
-- - privileged MFA regression for admin/developer
-- - RLS policies trusting mutable public.users.role/school_id
-- - cross-school reads/writes for assessment and compliance tables
-- - direct student/client consent and rate-limit bypasses
-- - unauthenticated wellbeing alert insertion
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Trusted auth helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_mfa_aal2()
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

CREATE OR REPLACE FUNCTION public.get_caller_app_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_is_legacy_admin boolean;
BEGIN
  SELECT
    raw_app_meta_data->>'role',
    raw_app_meta_data->>'admin' = 'true'
  INTO v_role, v_is_legacy_admin
  FROM auth.users
  WHERE id = auth.uid();

  IF v_role IN ('student', 'teacher', 'admin', 'developer') THEN
    RETURN v_role;
  END IF;

  IF v_is_legacy_admin THEN
    RETURN 'admin';
  END IF;

  RETURN null;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_caller_school_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id text;
BEGIN
  SELECT raw_app_meta_data->>'schoolId'
    INTO v_school_id
  FROM auth.users
  WHERE id = auth.uid();

  RETURN v_school_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_teacher()
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
      AND (
        raw_app_meta_data->>'role' IN ('teacher', 'admin', 'developer')
        OR raw_app_meta_data->>'admin' = 'true'
      )
  )
  AND public.is_mfa_aal2();
END;
$$;

CREATE OR REPLACE FUNCTION public.is_teacher_in_school(target_school_id text)
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

GRANT EXECUTE ON FUNCTION public.is_mfa_aal2() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_caller_app_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_caller_school_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_teacher() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_teacher_in_school(text) TO authenticated;

-- ---------------------------------------------------------------------------
-- public.users: keep client-editable profile fields separate from authority
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.protect_users_sensitive_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auth_uid uuid := auth.uid();
  v_trusted_role text;
  v_trusted_school_id text;
  v_is_self boolean;
BEGIN
  IF current_setting('role', true) <> 'authenticated' THEN
    RETURN NEW;
  END IF;

  IF current_setting('app.bypass_user_sensitive_profile_protection', true) = 'true' THEN
    RETURN NEW;
  END IF;

  v_is_self := v_auth_uid IS NOT NULL AND NEW.id = v_auth_uid;
  v_trusted_role := public.get_caller_app_role();
  v_trusted_school_id := public.get_caller_school_id();

  IF TG_OP = 'INSERT' THEN
    IF v_is_self THEN
      NEW.role := coalesce(v_trusted_role, 'student');
      NEW.school_id := v_trusted_school_id;
      IF NEW.stats IS NOT NULL AND NOT public.is_teacher() THEN
        NEW.stats := null;
      END IF;
      RETURN NEW;
    END IF;

    IF NOT public.is_teacher_in_school(NEW.school_id) THEN
      RAISE EXCEPTION 'Unauthorized profile insert outside caller school';
    END IF;

    RETURN NEW;
  END IF;

  IF v_is_self THEN
    NEW.role := coalesce(v_trusted_role, OLD.role);

    IF v_trusted_school_id IS NOT NULL THEN
      NEW.school_id := v_trusted_school_id;
    ELSE
      NEW.school_id := OLD.school_id;
    END IF;

    IF OLD.stats IS DISTINCT FROM NEW.stats
       AND coalesce(current_setting('app.bypass_stats_protection', true), 'false') <> 'true'
       AND NOT public.is_teacher() THEN
      NEW.stats := OLD.stats;
    END IF;
  ELSIF NOT public.is_teacher_in_school(coalesce(OLD.school_id, NEW.school_id)) THEN
    RAISE EXCEPTION 'Unauthorized profile update outside caller school';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_users_sensitive_profile_columns ON public.users;
CREATE TRIGGER trg_protect_users_sensitive_profile_columns
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_users_sensitive_profile_columns();

-- Keep same-school users RLS, but the trigger above prevents self-promotion.
DROP POLICY IF EXISTS "users_select_own_or_teacher" ON public.users;
CREATE POLICY "users_select_own_or_teacher"
  ON public.users
  FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_teacher_in_school(school_id)
  );

DROP POLICY IF EXISTS "users_update_own_or_teacher" ON public.users;
CREATE POLICY "users_update_own_or_teacher"
  ON public.users
  FOR UPDATE
  USING (
    auth.uid() = id
    OR public.is_teacher_in_school(school_id)
  )
  WITH CHECK (
    auth.uid() = id
    OR public.is_teacher_in_school(school_id)
  );

DROP POLICY IF EXISTS "users_insert_authenticated" ON public.users;
CREATE POLICY "users_insert_authenticated"
  ON public.users
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR public.is_teacher_in_school(school_id)
  );

DROP POLICY IF EXISTS "users_delete_teacher_only" ON public.users;
CREATE POLICY "users_delete_teacher_only"
  ON public.users
  FOR DELETE
  USING (public.is_teacher_in_school(school_id));

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;

-- ---------------------------------------------------------------------------
-- AI oversight and audit logs: use trusted app metadata + MFA + school scope
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "teachers_read_own_school_oversight" ON public.ai_oversight_events;
CREATE POLICY "teachers_read_own_school_oversight"
  ON public.ai_oversight_events
  FOR SELECT
  USING (public.is_teacher_in_school(school_id::text));

DROP POLICY IF EXISTS "teachers_insert_own_school_oversight" ON public.ai_oversight_events;
CREATE POLICY "teachers_insert_own_school_oversight"
  ON public.ai_oversight_events
  FOR INSERT
  WITH CHECK (
    teacher_uid = auth.uid()
    AND public.is_teacher_in_school(school_id::text)
  );

DROP POLICY IF EXISTS "audit_logs_teacher_select_school" ON public.audit_logs;
CREATE POLICY "audit_logs_teacher_select_school"
  ON public.audit_logs
  FOR SELECT
  USING (
    audit_logs.uid::text = auth.uid()::text
    OR public.is_teacher_in_school(audit_logs.school_id::text)
  );

DROP POLICY IF EXISTS "audit_logs_insert_own" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_own"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (
    uid::text = auth.uid()::text
    AND (
      school_id IS NULL
      OR school_id = public.get_caller_school_id()
      OR school_id = (SELECT u.school_id::text FROM public.users u WHERE u.id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- Assessment, recommendations, releases, and nulmeting: school-scoped teachers
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Docenten lezen eindmeting vrijgaves" ON public.eindmeting_releases;
CREATE POLICY "Docenten lezen eindmeting vrijgaves"
  ON public.eindmeting_releases
  FOR SELECT
  USING (public.is_teacher_in_school(school_id::text));

DROP POLICY IF EXISTS "Docenten maken eindmeting vrijgaves" ON public.eindmeting_releases;
CREATE POLICY "Docenten maken eindmeting vrijgaves"
  ON public.eindmeting_releases
  FOR INSERT
  WITH CHECK (
    released_by = auth.uid()
    AND public.is_teacher_in_school(school_id::text)
  );

DROP POLICY IF EXISTS "Leerlingen lezen eigen klas vrijgave" ON public.eindmeting_releases;
CREATE POLICY "Leerlingen lezen eigen klas vrijgave"
  ON public.eindmeting_releases
  FOR SELECT
  USING (
    school_id::text = (SELECT u.school_id::text FROM public.users u WHERE u.id = auth.uid())
    AND student_class = (SELECT u.student_class FROM public.users u WHERE u.id = auth.uid())
  );

DROP POLICY IF EXISTS "Docenten lezen assessment resultaten" ON public.assessment_results;
CREATE POLICY "Docenten lezen assessment resultaten"
  ON public.assessment_results
  FOR SELECT
  USING (
    public.is_teacher_in_school(
      coalesce(
        school_id::text,
        (SELECT u.school_id::text FROM public.users u WHERE u.id = assessment_results.user_id)
      )
    )
  );

DROP POLICY IF EXISTS "Leerlingen maken eigen assessment" ON public.assessment_results;
CREATE POLICY "Leerlingen maken eigen assessment"
  ON public.assessment_results
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
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
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      school_id IS NULL
      OR school_id::text = coalesce(
        public.get_caller_school_id(),
        (SELECT u.school_id::text FROM public.users u WHERE u.id = auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Docenten lezen aanbevelingen" ON public.growth_recommendations;
CREATE POLICY "Docenten lezen aanbevelingen"
  ON public.growth_recommendations
  FOR SELECT
  USING (
    public.is_teacher_in_school(
      coalesce(
        school_id::text,
        (SELECT u.school_id::text FROM public.users u WHERE u.id = growth_recommendations.user_id)
      )
    )
  );

DROP POLICY IF EXISTS "Leerlingen maken eigen aanbeveling" ON public.growth_recommendations;

DROP POLICY IF EXISTS "Docenten keuren aanbevelingen goed" ON public.growth_recommendations;
CREATE POLICY "Docenten keuren aanbevelingen goed"
  ON public.growth_recommendations
  FOR UPDATE
  USING (
    public.is_teacher_in_school(
      coalesce(
        school_id::text,
        (SELECT u.school_id::text FROM public.users u WHERE u.id = growth_recommendations.user_id)
      )
    )
  )
  WITH CHECK (
    public.is_teacher_in_school(
      coalesce(
        school_id::text,
        (SELECT u.school_id::text FROM public.users u WHERE u.id = growth_recommendations.user_id)
      )
    )
    AND (teacher_approved_by IS NULL OR teacher_approved_by = auth.uid())
  );

DROP POLICY IF EXISTS "Docenten lezen nulmeting resultaten" ON public.nulmeting_results;
CREATE POLICY "Docenten lezen nulmeting resultaten"
  ON public.nulmeting_results
  FOR SELECT
  USING (
    public.is_teacher_in_school((SELECT u.school_id::text FROM public.users u WHERE u.id = nulmeting_results.user_id))
  );

-- ---------------------------------------------------------------------------
-- Wellbeing alerts: authenticated own alert creation, same-school review only
-- ---------------------------------------------------------------------------

ALTER TABLE public.wellbeing_alerts
  ADD COLUMN IF NOT EXISTS school_id text;

UPDATE public.wellbeing_alerts wa
SET school_id = u.school_id
FROM public.users u
WHERE wa.school_id IS NULL
  AND u.id::text = wa.student_id;

CREATE INDEX IF NOT EXISTS idx_wellbeing_alerts_school_unreviewed
  ON public.wellbeing_alerts(school_id, reviewed_at)
  WHERE reviewed_at IS NULL;

DROP POLICY IF EXISTS "Docenten kunnen wellbeing alerts lezen" ON public.wellbeing_alerts;
CREATE POLICY "Docenten kunnen wellbeing alerts lezen"
  ON public.wellbeing_alerts
  FOR SELECT
  USING (
    public.is_teacher_in_school(
      coalesce(
        school_id,
        (SELECT u.school_id::text FROM public.users u WHERE u.id::text = wellbeing_alerts.student_id)
      )
    )
  );

DROP POLICY IF EXISTS "Docenten kunnen wellbeing alerts reviewen" ON public.wellbeing_alerts;
CREATE POLICY "Docenten kunnen wellbeing alerts reviewen"
  ON public.wellbeing_alerts
  FOR UPDATE
  USING (
    public.is_teacher_in_school(
      coalesce(
        school_id,
        (SELECT u.school_id::text FROM public.users u WHERE u.id::text = wellbeing_alerts.student_id)
      )
    )
  )
  WITH CHECK (
    public.is_teacher_in_school(
      coalesce(
        school_id,
        (SELECT u.school_id::text FROM public.users u WHERE u.id::text = wellbeing_alerts.student_id)
      )
    )
    AND (reviewed_by IS NULL OR reviewed_by = auth.uid())
  );

CREATE OR REPLACE FUNCTION public.log_wellbeing_alert(
  p_student_id text,
  p_category text,
  p_detected_at timestamptz
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id uuid := auth.uid();
  v_school_id text;
  v_detected_at timestamptz;
BEGIN
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF p_student_id IS NULL OR p_student_id <> v_student_id::text THEN
    RAISE EXCEPTION 'Students may only log alerts for their own account';
  END IF;

  IF p_category NOT IN ('suicidaal', 'zelfbeschadiging', 'pesten', 'geweld_misbruik', 'psychisch') THEN
    RAISE EXCEPTION 'Unknown wellbeing category';
  END IF;

  SELECT school_id
    INTO v_school_id
  FROM public.users
  WHERE id = v_student_id;

  v_detected_at := coalesce(p_detected_at, now());
  IF v_detected_at < now() - interval '1 day' OR v_detected_at > now() + interval '5 minutes' THEN
    v_detected_at := now();
  END IF;

  INSERT INTO public.wellbeing_alerts(student_id, school_id, category, detected_at)
  VALUES (v_student_id::text, v_school_id, p_category, v_detected_at);
END;
$$;

REVOKE ALL ON FUNCTION public.log_wellbeing_alert(text, text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_wellbeing_alert(text, text, timestamptz) TO authenticated;

-- ---------------------------------------------------------------------------
-- Consent and durable rate-limit RPCs: server-side boundaries only
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.has_student_consent(
  p_student_id uuid,
  p_consent_type text,
  p_consent_version text DEFAULT '1.0'
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.student_consents sc
    WHERE sc.student_id = p_student_id
      AND sc.consent_type = p_consent_type
      AND sc.granted = true
      AND sc.revoked_at IS NULL
      AND sc.consent_version = p_consent_version
  );
$$;

REVOKE ALL ON FUNCTION public.has_student_consent(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_student_consent(uuid, text, text) TO authenticated, service_role;

DROP POLICY IF EXISTS "Students insert own consents" ON public.student_consents;
DROP POLICY IF EXISTS "Students update own consents" ON public.student_consents;

CREATE OR REPLACE FUNCTION public.consume_edge_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
RETURNS TABLE (
  allowed boolean,
  remaining integer,
  retry_after_seconds integer,
  limit_value integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := clock_timestamp();
  v_row public.edge_request_limits%ROWTYPE;
  v_window_start timestamptz;
BEGIN
  IF p_key IS NULL OR length(trim(p_key)) = 0 OR length(p_key) > 200 THEN
    RAISE EXCEPTION 'Invalid rate limit key';
  END IF;

  IF p_key !~ '^[A-Za-z0-9:_|.-]+$' THEN
    RAISE EXCEPTION 'Invalid rate limit key namespace';
  END IF;

  IF p_limit IS NULL OR p_limit < 1 OR p_limit > 1000 THEN
    RAISE EXCEPTION 'Invalid rate limit value';
  END IF;

  IF p_window_seconds IS NULL OR p_window_seconds < 1 OR p_window_seconds > 86400 THEN
    RAISE EXCEPTION 'Invalid rate limit window';
  END IF;

  DELETE FROM public.edge_request_limits
  WHERE updated_at < v_now - interval '2 days';

  LOOP
    SELECT *
    INTO v_row
    FROM public.edge_request_limits
    WHERE key = p_key
    FOR UPDATE;

    IF NOT FOUND THEN
      BEGIN
        INSERT INTO public.edge_request_limits(key, window_started_at, request_count, updated_at)
        VALUES (p_key, v_now, 1, v_now)
        RETURNING *
        INTO v_row;
      EXCEPTION
        WHEN unique_violation THEN
          CONTINUE;
      END;

      allowed := true;
      remaining := greatest(p_limit - 1, 0);
      retry_after_seconds := 0;
      limit_value := p_limit;
      RETURN NEXT;
      RETURN;
    END IF;

    v_window_start := v_row.window_started_at + make_interval(secs => p_window_seconds);

    IF v_window_start <= v_now THEN
      UPDATE public.edge_request_limits
      SET window_started_at = v_now,
          request_count = 1,
          updated_at = v_now
      WHERE key = p_key
      RETURNING *
      INTO v_row;

      allowed := true;
      remaining := greatest(p_limit - 1, 0);
      retry_after_seconds := 0;
      limit_value := p_limit;
      RETURN NEXT;
      RETURN;
    END IF;

    IF v_row.request_count >= p_limit THEN
      allowed := false;
      remaining := 0;
      retry_after_seconds := greatest(ceil(extract(epoch from (v_window_start - v_now)))::integer, 1);
      limit_value := p_limit;
      RETURN NEXT;
      RETURN;
    END IF;

    UPDATE public.edge_request_limits
    SET request_count = request_count + 1,
        updated_at = v_now
    WHERE key = p_key
    RETURNING *
    INTO v_row;

    allowed := true;
    remaining := greatest(p_limit - v_row.request_count, 0);
    retry_after_seconds := 0;
    limit_value := p_limit;
    RETURN NEXT;
    RETURN;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_edge_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_edge_rate_limit(TEXT, INTEGER, INTEGER) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_edge_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;

-- The weekly Drive backup trigger uses service-role secrets from Vault and
-- starts a backup for all connected users. It must only be callable by the
-- database cron owner and service-role contexts, never through public RPC.
REVOKE ALL ON FUNCTION public.trigger_gdrive_backup() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.trigger_gdrive_backup() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.trigger_gdrive_backup() TO postgres, service_role;
