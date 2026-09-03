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
-- schoolbeheerder en het DGSkills-beheer, niet de lesgevende docent. Zij komen
-- net als docenten alleen binnen MET AAL2 — `is_teacher()` eist sinds
-- 20260626144000 MFA voor elke bevoorrechte rol (de vrijstelling uit
-- 20260413100000 is daar stil teruggedraaid).
--
-- Schrijven naar de twee nieuwe tabellen is een AUTORISATIEbeslissing en loopt
-- daarom via `public.is_class_scoping_admin()`: admin|developer MET AAL2, naar
-- het model van de bestaande `public.is_branding_admin()`.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Wie mag de klasindeling en de scope-modus beheren?
-- ---------------------------------------------------------------------------
-- Zelfde vorm als public.is_branding_admin(): bevoorrechte rol EN AAL2. Dit is
-- bewust strenger dan `get_caller_app_role()` alleen, want het toekennen van
-- een klas bepaalt wie er bij leerlinggegevens kan.
CREATE OR REPLACE FUNCTION public.is_class_scoping_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND (
        raw_app_meta_data->>'role' IN ('admin', 'developer')
        OR raw_app_meta_data->>'admin' = 'true'
      )
  )
  AND public.is_mfa_aal2();
END;
$$;

COMMENT ON FUNCTION public.is_class_scoping_admin() IS
  'True als de aanroeper admin|developer is MET AAL2. Poort voor het beheren van teacher_classes en school_access_settings.';

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

-- Lezen: docenten en beheerders van de school zien de toewijzingen binnen hun
-- school, inclusief hun eigen. Dit is personeelsmetadata, geen leerlingdata,
-- dus bewust schoolbreed: de beheerder moet het overzicht kunnen beheren.
--
-- Bewust GEEN losse `auth.uid() = teacher_id`-tak: die zou een docent zonder
-- MFA zijn eigen toewijzingen laten lezen en daarmee om de AAL2-eis van
-- is_teacher_in_school() heen lopen. De autorisatiestaat valt volledig achter
-- dezelfde grens als de leerlinggegevens die eruit volgen.
DROP POLICY IF EXISTS "teacher_classes_select_own_or_school" ON public.teacher_classes;
CREATE POLICY "teacher_classes_select_own_or_school"
  ON public.teacher_classes
  FOR SELECT
  USING (public.is_teacher_in_school(school_id));

-- Schrijven: uitsluitend admin/developer binnen de eigen school. Een docent mag
-- zichzelf nooit klassen toekennen — dat zou de hele maatregel waardeloos maken.
DROP POLICY IF EXISTS "teacher_classes_insert_admin" ON public.teacher_classes;
CREATE POLICY "teacher_classes_insert_admin"
  ON public.teacher_classes
  FOR INSERT
  WITH CHECK (
    public.is_class_scoping_admin()
    AND school_id = public.get_caller_school_id()
  );

DROP POLICY IF EXISTS "teacher_classes_update_admin" ON public.teacher_classes;
CREATE POLICY "teacher_classes_update_admin"
  ON public.teacher_classes
  FOR UPDATE
  USING (
    public.is_class_scoping_admin()
    AND school_id = public.get_caller_school_id()
  )
  WITH CHECK (
    public.is_class_scoping_admin()
    AND school_id = public.get_caller_school_id()
  );

DROP POLICY IF EXISTS "teacher_classes_delete_admin" ON public.teacher_classes;
CREATE POLICY "teacher_classes_delete_admin"
  ON public.teacher_classes
  FOR DELETE
  USING (
    public.is_class_scoping_admin()
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
    public.is_class_scoping_admin()
    AND school_id = public.get_caller_school_id()
  );

DROP POLICY IF EXISTS "school_access_settings_update_admin" ON public.school_access_settings;
CREATE POLICY "school_access_settings_update_admin"
  ON public.school_access_settings
  FOR UPDATE
  USING (
    public.is_class_scoping_admin()
    AND school_id = public.get_caller_school_id()
  )
  WITH CHECK (
    public.is_class_scoping_admin()
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
SET search_path = pg_catalog, public
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
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_mode text;
  v_role text;
  v_has_any_assignment boolean;
BEGIN
  -- Schoolgrens, rolcheck en MFA blijven ONGEWIJZIGD de eerste horde. Deze
  -- functie kan nooit ruimer zijn dan is_teacher_in_school(). `IS NOT TRUE`
  -- in plaats van `NOT`, zodat een toekomstige NULL-uitkomst dichtvalt en niet
  -- stilzwijgend doorloopt.
  IF public.is_teacher_in_school(target_school_id) IS NOT TRUE THEN
    RETURN false;
  END IF;

  -- Schoolbeheerder en DGSkills-beheer houden schoolbreed zicht. MFA is op dit
  -- punt al bewezen door is_teacher_in_school() hierboven.
  v_role := public.get_caller_app_role();
  IF v_role IN ('admin', 'developer') THEN
    RETURN true;
  END IF;

  v_mode := public.teacher_scope_mode(target_school_id);

  -- Schoolbrede modus: het gedrag van vóór deze migratie, ongewijzigd.
  IF v_mode = 'school' THEN
    RETURN true;
  END IF;

  -- Vanaf hier geldt een klasgebonden modus. Een leerling ZONDER klas is aan
  -- geen enkele docent toe te wijzen en valt daarom dicht — ook voor een docent
  -- die zelf nog geen toewijzingen heeft. Deze check staat bewust VOOR de
  -- class_soft-uitzondering: anders zou juist de nog niet ingerichte docent de
  -- niet-ingedeelde leerlingen wel zien, en dat is precies andersom dan bedoeld.
  -- Alleen admin/developer (hierboven) houden zicht op niet-ingedeelde leerlingen.
  IF target_class IS NULL OR btrim(target_class) = '' THEN
    RETURN false;
  END IF;

  IF v_mode = 'class_soft' THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.teacher_classes tc
      WHERE tc.teacher_id = auth.uid()
        AND tc.school_id = target_school_id
    ) INTO v_has_any_assignment;

    -- Nog niet ingericht voor deze docent: toegang blijft zoals die was.
    -- Dit is een compatibiliteits-fallback voor de uitrol, GEEN privacymaatregel:
    -- zolang een school in class_soft staat is de klasgrens niet afdwingbaar.
    IF v_has_any_assignment IS NOT TRUE THEN
      RETURN true;
    END IF;
  END IF;

  -- class_soft (met toewijzingen) en class_strict: alleen de eigen klassen.
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
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_school_id text;
  v_class text;
  v_found boolean := false;
  v_target_role text;
BEGIN
  IF target_user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT u.school_id, u.student_class, true
    INTO v_school_id, v_class, v_found
  FROM public.users u
  WHERE u.id = target_user_id;

  -- Onbekende gebruiker: dicht. Nooit "bij twijfel toegang".
  IF v_found IS NOT TRUE THEN
    RETURN false;
  END IF;

  -- Deze functie doet uitspraken over LEERLINGEN. De rol komt uit de
  -- server-gezette app_metadata, dezelfde bron die de rest van het systeem
  -- vertrouwt; public.users.role is client-bewerkbaar geweest en is hier geen
  -- gezag. Een docent- of beheerdersrij valt dicht: voor personeelsrijen blijft
  -- de schoolbrede helper de juiste toets.
  SELECT raw_app_meta_data->>'role'
    INTO v_target_role
  FROM auth.users
  WHERE id = target_user_id;

  IF coalesce(v_target_role, 'student') <> 'student' THEN
    RETURN false;
  END IF;

  RETURN public.is_teacher_of_class(v_school_id, v_class);
END;
$$;

COMMENT ON FUNCTION public.is_teacher_of_student(uuid) IS
  'Mag de aanroepende docent de gegevens van deze leerling zien? Klasgebonden tegenhanger van is_teacher_in_school(); onbekende leerling => false.';

-- ---------------------------------------------------------------------------
-- 4. Triggers: doelvalidatie, server-gezette actor, auditspoor
-- ---------------------------------------------------------------------------
-- Zelfde vorm als log_school_branding_change() bij school_branding.

-- Valideer dat de toewijzing een BEVOEGDE gebruiker van DEZELFDE school
-- betreft, en stempel de actor server-side. `created_by` uit de client is een
-- bewering; auth.uid() is dat niet.
CREATE OR REPLACE FUNCTION public.teacher_classes_validate_and_stamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_target_role text;
  v_target_school text;
BEGIN
  SELECT au.raw_app_meta_data->>'role', au.raw_app_meta_data->>'schoolId'
    INTO v_target_role, v_target_school
  FROM auth.users au
  WHERE au.id = NEW.teacher_id;

  IF v_target_role IS NULL OR v_target_role NOT IN ('teacher', 'admin', 'developer') THEN
    RAISE EXCEPTION 'teacher_classes: % is geen docent- of beheerdersaccount', NEW.teacher_id
      USING ERRCODE = 'check_violation';
  END IF;

  IF v_target_school IS DISTINCT FROM NEW.school_id THEN
    RAISE EXCEPTION 'teacher_classes: account % hoort niet bij school %', NEW.teacher_id, NEW.school_id
      USING ERRCODE = 'check_violation';
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.created_by := auth.uid();
    NEW.created_at := now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_teacher_classes_validate ON public.teacher_classes;
CREATE TRIGGER trg_teacher_classes_validate
  BEFORE INSERT OR UPDATE ON public.teacher_classes
  FOR EACH ROW EXECUTE FUNCTION public.teacher_classes_validate_and_stamp();

CREATE OR REPLACE FUNCTION public.school_access_settings_stamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_by := auth.uid();
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_school_access_settings_stamp ON public.school_access_settings;
CREATE TRIGGER trg_school_access_settings_stamp
  BEFORE INSERT OR UPDATE ON public.school_access_settings
  FOR EACH ROW EXECUTE FUNCTION public.school_access_settings_stamp();

-- Auditspoor. Ook DELETE wordt gelogd — juist het WEGHALEN van een toewijzing
-- verruimt in class_soft de toegang van een docent, en dat mag geen spoorloze
-- handeling zijn. De trigger vangt ook mutaties buiten het beheerscherm om
-- (directe API-call, service-role, roosterimport).
CREATE OR REPLACE FUNCTION public.log_class_scoping_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_data jsonb;
  v_school text;
BEGIN
  -- Bewust twee aparte takken en GEEN SQL-CASE: PL/pgSQL lost de veldverwijzing
  -- in beide takken van een CASE op, waardoor OLD.teacher_scope ook bij een
  -- teacher_classes-mutatie geraakt zou worden ("record OLD has no field").
  IF TG_TABLE_NAME = 'teacher_classes' THEN
    IF TG_OP = 'DELETE' THEN
      v_school := OLD.school_id;
      v_data := jsonb_build_object(
        'teacher_id', OLD.teacher_id,
        'student_class', OLD.student_class,
        'source', OLD.source
      );
    ELSE
      v_school := NEW.school_id;
      v_data := jsonb_build_object(
        'teacher_id', NEW.teacher_id,
        'student_class', NEW.student_class,
        'source', NEW.source
      );
    END IF;
  ELSE
    v_school := NEW.school_id;
    v_data := jsonb_build_object(
      'teacher_scope_old', CASE WHEN TG_OP = 'UPDATE' THEN OLD.teacher_scope ELSE NULL END,
      'teacher_scope_new', NEW.teacher_scope
    );
  END IF;

  INSERT INTO public.audit_logs (action, uid, school_id, data)
  VALUES (TG_TABLE_NAME || '_' || lower(TG_OP), auth.uid(), v_school, v_data);

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_teacher_classes_audit ON public.teacher_classes;
CREATE TRIGGER trg_teacher_classes_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_classes
  FOR EACH ROW EXECUTE FUNCTION public.log_class_scoping_change();

DROP TRIGGER IF EXISTS trg_school_access_settings_audit ON public.school_access_settings;
CREATE TRIGGER trg_school_access_settings_audit
  AFTER INSERT OR UPDATE ON public.school_access_settings
  FOR EACH ROW EXECUTE FUNCTION public.log_class_scoping_change();

-- ---------------------------------------------------------------------------
-- 5. Rechten — zelfde patroon als de bestaande RLS-helpers
-- ---------------------------------------------------------------------------
-- teacher_scope_mode() is een INTERN hulpmiddel. Zou `authenticated` hem mogen
-- aanroepen, dan kan elke ingelogde gebruiker de beveiligingsstand van een
-- willekeurige school opvragen door school-ids te raden. De SECURITY DEFINER-
-- functies hieronder draaien als eigenaar en kunnen hem gewoon aanroepen; de
-- app leest de stand via de RLS-beschermde tabel school_access_settings.
REVOKE ALL ON FUNCTION public.teacher_scope_mode(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_class_scoping_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_class_scoping_admin() TO authenticated;
REVOKE ALL ON FUNCTION public.is_teacher_of_class(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_teacher_of_student(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_teacher_of_class(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_teacher_of_student(uuid) TO authenticated;

-- Tabelrechten volgens het bestaande patroon in deze repo: `authenticated`
-- krijgt de grant, RLS bepaalt wat er daadwerkelijk doorkomt. Geen DELETE op
-- school_access_settings, want daar bestaat bewust geen DELETE-policy voor.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.teacher_classes TO authenticated;
GRANT ALL ON TABLE public.teacher_classes TO service_role;

GRANT SELECT, INSERT, UPDATE ON TABLE public.school_access_settings TO authenticated;
GRANT ALL ON TABLE public.school_access_settings TO service_role;
