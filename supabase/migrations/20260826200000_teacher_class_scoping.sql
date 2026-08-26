-- ============================================================================
-- Docent-klas-koppeling (fundament voor klasgebonden toegang)
-- ----------------------------------------------------------------------------
-- Probleem dat deze migratie adresseert:
--   `public.is_teacher_in_school(target_school_id)` geeft ELKE docent van een
--   school toegang tot de gegevens van ELKE leerling van die school. De
--   compliance-documentatie (verwerkingsregister V-06, beveiligingsbijlage B,
--   privacybijsluiter E, DPIA R08) belooft klasgebonden toegang. Er bestond
--   geen enkele vastlegging van welke klassen een docent lesgeeft.
--
-- Wat deze migratie WEL doet:
--   1. `public.teacher_classes`        — de ontbrekende koppeltabel (met RLS).
--   2. `public.school_access_settings` — per school een scope-modus, zodat
--      scholen die al draaien niet van het ene op het andere moment hun
--      docenten zonder toegang zetten.
--   3. Drie helpers naast de bestaande schoolbrede variant:
--        public.teacher_scope_mode(text)             -> text
--        public.is_teacher_of_class(text, text)      -> boolean
--        public.is_teacher_of_student(uuid)          -> boolean
--
-- Wat deze migratie NIET doet (bewust):
--   Geen enkele bestaande policy wordt aangeraakt. Het gedrag van het platform
--   is na deze migratie identiek aan ervoor. De helpers staan klaar zodat
--   policies er per tabel, per school en stapsgewijs op over kunnen — zie
--   docs/compliance/ontwerp-docent-klas-koppeling.md voor het migratiepad.
--
-- Scope-modi (public.school_access_settings.teacher_scope):
--   'school'       (DEFAULT, = huidig gedrag) docent ziet de hele school.
--   'class_soft'   docent MET klastoewijzingen is klasgebonden; docent ZONDER
--                  toewijzingen houdt schoolbrede toegang. Uitrolstand.
--   'class_strict' altijd klasgebonden. Geen toewijzing = geen toegang.
--                  Dit is de stand waarin de compliance-belofte waar is.
--
-- Admin en developer houden in ALLE modi schoolbrede toegang: dat zijn de
-- schoolbeheerder en het DGSkills-beheer, niet de lesgevende docent.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Koppeltabel docent -> klas
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teacher_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id text NOT NULL,
  student_class text NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT teacher_classes_unique UNIQUE (teacher_id, school_id, student_class),
  CONSTRAINT teacher_classes_source_check CHECK (source IN ('manual', 'roster_import')),
  CONSTRAINT teacher_classes_class_not_blank CHECK (btrim(student_class) <> ''),
  CONSTRAINT teacher_classes_school_not_blank CHECK (btrim(school_id) <> '')
);

COMMENT ON TABLE public.teacher_classes IS
  'Welke klassen een docent lesgeeft. Basis voor klasgebonden toegang tot leerlinggegevens; zie public.is_teacher_of_student().';
COMMENT ON COLUMN public.teacher_classes.source IS
  'manual = door schoolbeheerder gezet; roster_import = afgeleid uit een roosterimport.';

-- Omgekeerde lookup: welke docenten horen bij deze klas.
CREATE INDEX IF NOT EXISTS teacher_classes_school_class_idx
  ON public.teacher_classes(school_id, student_class);

ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;

-- Lezen: je eigen toewijzingen, of — als docent/beheerder van de school — de
-- toewijzingen binnen je school. Dit is personeelsmetadata, geen leerlingdata,
-- dus bewust schoolbreed: de beheerder moet het overzicht kunnen beheren.
DROP POLICY IF EXISTS "teacher_classes_select_own_or_school" ON public.teacher_classes;
CREATE POLICY "teacher_classes_select_own_or_school"
  ON public.teacher_classes
  FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR public.is_teacher_in_school(school_id)
  );

-- Schrijven: uitsluitend admin/developer binnen de eigen school. Een docent mag
-- zichzelf nooit klassen toekennen — dat zou de hele maatregel waardeloos maken.
DROP POLICY IF EXISTS "teacher_classes_insert_admin" ON public.teacher_classes;
CREATE POLICY "teacher_classes_insert_admin"
  ON public.teacher_classes
  FOR INSERT
  WITH CHECK (
    public.get_caller_app_role() IN ('admin', 'developer')
    AND school_id = public.get_caller_school_id()
  );

DROP POLICY IF EXISTS "teacher_classes_update_admin" ON public.teacher_classes;
CREATE POLICY "teacher_classes_update_admin"
  ON public.teacher_classes
  FOR UPDATE
  USING (
    public.get_caller_app_role() IN ('admin', 'developer')
    AND school_id = public.get_caller_school_id()
  )
  WITH CHECK (
    public.get_caller_app_role() IN ('admin', 'developer')
    AND school_id = public.get_caller_school_id()
  );

DROP POLICY IF EXISTS "teacher_classes_delete_admin" ON public.teacher_classes;
CREATE POLICY "teacher_classes_delete_admin"
  ON public.teacher_classes
  FOR DELETE
  USING (
    public.get_caller_app_role() IN ('admin', 'developer')
    AND school_id = public.get_caller_school_id()
  );

-- ---------------------------------------------------------------------------
-- 2. Per-school scope-modus
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_access_settings (
  school_id text PRIMARY KEY,
  teacher_scope text NOT NULL DEFAULT 'school',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT school_access_settings_scope_check
    CHECK (teacher_scope IN ('school', 'class_soft', 'class_strict'))
);

COMMENT ON TABLE public.school_access_settings IS
  'Per school: hoe ver reikt de toegang van een docent tot leerlinggegevens. Ontbrekende rij = school-modus = huidig (schoolbreed) gedrag.';
COMMENT ON COLUMN public.school_access_settings.teacher_scope IS
  'school = schoolbreed (default, ongewijzigd gedrag) | class_soft = klasgebonden voor docenten MET toewijzingen | class_strict = altijd klasgebonden.';

ALTER TABLE public.school_access_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "school_access_settings_select_school" ON public.school_access_settings;
CREATE POLICY "school_access_settings_select_school"
  ON public.school_access_settings
  FOR SELECT
  USING (public.is_teacher_in_school(school_id));

DROP POLICY IF EXISTS "school_access_settings_insert_admin" ON public.school_access_settings;
CREATE POLICY "school_access_settings_insert_admin"
  ON public.school_access_settings
  FOR INSERT
  WITH CHECK (
    public.get_caller_app_role() IN ('admin', 'developer')
    AND school_id = public.get_caller_school_id()
  );

DROP POLICY IF EXISTS "school_access_settings_update_admin" ON public.school_access_settings;
CREATE POLICY "school_access_settings_update_admin"
  ON public.school_access_settings
  FOR UPDATE
  USING (
    public.get_caller_app_role() IN ('admin', 'developer')
    AND school_id = public.get_caller_school_id()
  )
  WITH CHECK (
    public.get_caller_app_role() IN ('admin', 'developer')
    AND school_id = public.get_caller_school_id()
  );

-- Geen DELETE-policy: een school "ontkoppelen" gebeurt door teacher_scope terug
-- op 'school' te zetten, niet door de rij te verwijderen. Zo blijft updated_by
-- als spoor bestaan (AI Act Art. 12 / auditbaarheid).

-- ---------------------------------------------------------------------------
-- 3. Helpers
-- ---------------------------------------------------------------------------

-- Actieve modus voor een school. Ontbrekende rij => 'school' (huidig gedrag).
CREATE OR REPLACE FUNCTION public.teacher_scope_mode(target_school_id text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mode text;
BEGIN
  IF target_school_id IS NULL THEN
    RETURN 'school';
  END IF;

  SELECT teacher_scope
    INTO v_mode
  FROM public.school_access_settings
  WHERE school_id = target_school_id;

  RETURN coalesce(v_mode, 'school');
END;
$$;

COMMENT ON FUNCTION public.teacher_scope_mode(text) IS
  'Scope-modus van een school. Fail-safe: onbekende school => school (huidig, schoolbreed gedrag).';

-- Mag de aanroeper deze klas van deze school zien?
CREATE OR REPLACE FUNCTION public.is_teacher_of_class(
  target_school_id text,
  target_class text
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mode text;
  v_role text;
  v_has_any_assignment boolean;
BEGIN
  -- Schoolgrens, rolcheck en MFA blijven ONGEWIJZIGD de eerste horde. Deze
  -- functie kan nooit ruimer zijn dan is_teacher_in_school().
  IF NOT public.is_teacher_in_school(target_school_id) THEN
    RETURN false;
  END IF;

  -- Schoolbeheerder en DGSkills-beheer houden schoolbreed zicht.
  v_role := public.get_caller_app_role();
  IF v_role IN ('admin', 'developer') THEN
    RETURN true;
  END IF;

  v_mode := public.teacher_scope_mode(target_school_id);

  IF v_mode = 'school' THEN
    RETURN true;
  END IF;

  IF v_mode = 'class_soft' THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.teacher_classes tc
      WHERE tc.teacher_id = auth.uid()
        AND tc.school_id = target_school_id
    ) INTO v_has_any_assignment;

    -- Nog niet ingericht voor deze docent: gedrag blijft zoals het was.
    IF NOT v_has_any_assignment THEN
      RETURN true;
    END IF;
  END IF;

  -- class_soft (met toewijzingen) en class_strict: alleen de eigen klassen.
  -- Een leerling zonder klas is niet toe te wijzen en valt hier dicht.
  IF target_class IS NULL OR btrim(target_class) = '' THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.teacher_classes tc
    WHERE tc.teacher_id = auth.uid()
      AND tc.school_id = target_school_id
      AND tc.student_class = target_class
  );
END;
$$;

COMMENT ON FUNCTION public.is_teacher_of_class(text, text) IS
  'Klasgebonden variant van is_teacher_in_school(). Nooit ruimer dan die functie; gedrag per school gestuurd door school_access_settings.teacher_scope.';

-- Mag de aanroeper de gegevens van deze leerling zien?
-- Dit is de functie waar policies op over kunnen: zij haalt school en klas van
-- de leerling zelf op, zodat een policy alleen een user_id hoeft te kennen.
CREATE OR REPLACE FUNCTION public.is_teacher_of_student(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id text;
  v_class text;
  v_found boolean := false;
BEGIN
  IF target_user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT u.school_id, u.student_class, true
    INTO v_school_id, v_class, v_found
  FROM public.users u
  WHERE u.id = target_user_id;

  -- Onbekende leerling: dicht. Nooit "bij twijfel toegang".
  IF NOT v_found THEN
    RETURN false;
  END IF;

  RETURN public.is_teacher_of_class(v_school_id, v_class);
END;
$$;

COMMENT ON FUNCTION public.is_teacher_of_student(uuid) IS
  'Mag de aanroepende docent de gegevens van deze leerling zien? Klasgebonden tegenhanger van is_teacher_in_school(); onbekende leerling => false.';

-- ---------------------------------------------------------------------------
-- 4. Rechten — zelfde patroon als de bestaande RLS-helpers
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.teacher_scope_mode(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_teacher_of_class(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_teacher_of_student(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.teacher_scope_mode(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_teacher_of_class(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_teacher_of_student(uuid) TO authenticated;

-- Tabelrechten volgens het bestaande patroon in deze repo: `authenticated`
-- krijgt de grant, RLS bepaalt wat er daadwerkelijk doorkomt. Geen DELETE op
-- school_access_settings, want daar bestaat bewust geen DELETE-policy voor.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.teacher_classes TO authenticated;
GRANT ALL ON TABLE public.teacher_classes TO service_role;

GRANT SELECT, INSERT, UPDATE ON TABLE public.school_access_settings TO authenticated;
GRANT ALL ON TABLE public.school_access_settings TO service_role;
