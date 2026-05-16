-- ===========================================================================
-- School Branding — Self-Service Huisstijl
--
-- Scholen (coordinatoren / ICT-afdelingen) configureren zelf hun merk:
-- kleuren, logo, mascotte, schoolnaam, welkomstbericht. Geen developer-
-- tussenkomst nodig.
--
-- Security model:
--   SELECT : elke gebruiker van de school (nodig voor student-side render).
--   WRITE  : alleen rol admin|developer + MFA AAL2 van dezelfde school.
--
-- Impact op reporting/permissions/data exposure:
--   - Branding is NIET persoonsgegevens — lagere gevoeligheid dan users/stats.
--   - Logo/mascot/kleuren renderen publiek in student-views binnen de school.
--   - RLS triple-gate (school_id + role + AAL2) voorkomt cross-school pollution.
--   - Elke wijziging → audit_logs (EU AI Act Art. 12 traceability).
-- ===========================================================================

-- ── 1. Branding-admin helper (role + MFA) ───────────────────────────────────
-- Waarom niet is_teacher() hergebruiken?
--   is_teacher() staat 'teacher' rol toe; branding moet tot school-leiderschap
--   beperkt blijven (admin|developer). Aparte helper voorkomt per ongeluk
--   verlenen van branding-rechten aan docenten.

CREATE OR REPLACE FUNCTION public.is_branding_admin()
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
          AND raw_app_meta_data->>'role' IN ('admin', 'developer')
    )
    AND public.is_mfa_aal2();
END;
$$;
COMMENT ON FUNCTION public.is_branding_admin() IS
    'Returnt true als caller admin|developer is MET AAL2. Gebruikt door school_branding RLS write-policies.';
-- ── 2. Tabel school_branding ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.school_branding (
    id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id             text        NOT NULL UNIQUE
                                      REFERENCES public.school_configs(school_id)
                                      ON DELETE CASCADE,

    -- Identiteit
    school_display_name   text,
    welcome_message       text,

    -- Kleuren — strikt 6-digit hex. Regex blokkeert rgb()/javascript:/names.
    primary_color         text,
    primary_dark_color    text,
    accent_color          text,
    secondary_color       text,
    background_color      text,

    -- Assets — storage-paden, geen externe URLs (SSRF-guard).
    -- Pad-conventie: '<school_id>/<kind>-<hash>.webp'
    logo_path             text,
    mascot_path           text,
    favicon_path          text,

    -- Mascot-toggles
    mascot_enabled        boolean     NOT NULL DEFAULT true,
    custom_mascot_enabled boolean     NOT NULL DEFAULT false,

    -- WCAG contrast — server-side berekend bij save voor audit & deploy-gate
    contrast_primary_on_bg  numeric(5,2),
    contrast_accent_on_bg   numeric(5,2),
    wcag_aa_compliant       boolean   DEFAULT false,

    -- Audit-velden
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    created_by  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
    version     integer     NOT NULL DEFAULT 1,

    -- Constraints: hex-format, lengte-caps
    CONSTRAINT primary_color_hex     CHECK (primary_color     IS NULL OR primary_color     ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT primary_dark_hex      CHECK (primary_dark_color IS NULL OR primary_dark_color ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT accent_color_hex      CHECK (accent_color      IS NULL OR accent_color      ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT secondary_color_hex   CHECK (secondary_color   IS NULL OR secondary_color   ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT background_color_hex  CHECK (background_color  IS NULL OR background_color  ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT school_display_name_len CHECK (school_display_name IS NULL OR length(school_display_name) <= 80),
    CONSTRAINT welcome_message_len     CHECK (welcome_message     IS NULL OR length(welcome_message)     <= 240)
);
CREATE INDEX IF NOT EXISTS idx_school_branding_school_id
    ON public.school_branding(school_id);
COMMENT ON TABLE public.school_branding IS
    'Self-service huisstijl per school. SELECT open voor same-school, WRITE admin|developer + AAL2.';
-- ── 3. Triggers: version-bump, stempel, audit ──────────────────────────────

CREATE OR REPLACE FUNCTION public.school_branding_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.created_by := auth.uid();
    NEW.updated_by := auth.uid();
    RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_school_branding_on_insert ON public.school_branding;
CREATE TRIGGER trg_school_branding_on_insert
    BEFORE INSERT ON public.school_branding
    FOR EACH ROW EXECUTE FUNCTION public.school_branding_on_insert();
CREATE OR REPLACE FUNCTION public.school_branding_on_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    NEW.version    := COALESCE(OLD.version, 0) + 1;
    NEW.updated_by := auth.uid();
    -- created_at/created_by zijn immutable
    NEW.created_at := OLD.created_at;
    NEW.created_by := OLD.created_by;
    RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_school_branding_on_update ON public.school_branding;
CREATE TRIGGER trg_school_branding_on_update
    BEFORE UPDATE ON public.school_branding
    FOR EACH ROW EXECUTE FUNCTION public.school_branding_on_update();
-- Audit-trigger: elke wijziging → audit_logs met changed-fields diff.
-- SECURITY DEFINER zodat de INSERT RLS-check (uid = auth.uid()) slaagt
-- en de audit_logs-owner de rechten heeft.
CREATE OR REPLACE FUNCTION public.log_school_branding_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_changed jsonb;
BEGIN
    IF TG_OP = 'UPDATE' THEN
        SELECT jsonb_object_agg(key, value)
          INTO v_changed
          FROM jsonb_each(to_jsonb(NEW))
         WHERE to_jsonb(NEW) -> key IS DISTINCT FROM to_jsonb(OLD) -> key
           AND key NOT IN ('updated_at', 'version', 'updated_by');
    END IF;

    INSERT INTO public.audit_logs (action, uid, school_id, data)
    VALUES (
        'school_branding_' || lower(TG_OP),
        auth.uid(),
        COALESCE(NEW.school_id, OLD.school_id),
        jsonb_build_object(
            'branding_id',    COALESCE(NEW.id, OLD.id),
            'version',        COALESCE(NEW.version, OLD.version),
            'changed_fields', v_changed
        )
    );

    RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS trg_school_branding_audit ON public.school_branding;
CREATE TRIGGER trg_school_branding_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.school_branding
    FOR EACH ROW EXECUTE FUNCTION public.log_school_branding_change();
-- ── 4. RLS policies ────────────────────────────────────────────────────────

ALTER TABLE public.school_branding ENABLE ROW LEVEL SECURITY;
-- SELECT: elke ingelogde gebruiker van dezelfde school leest (nodig voor
-- student-side rendering). Geen MFA-eis — lezen is een lees-operatie
-- die bij elke student-login nodig is.
DROP POLICY IF EXISTS "school_branding_select_same_school" ON public.school_branding;
CREATE POLICY "school_branding_select_same_school"
    ON public.school_branding
    FOR SELECT
    USING (school_id = public.get_caller_school_id());
-- INSERT: alleen branding-admin van eigen school.
DROP POLICY IF EXISTS "school_branding_insert_admin_same_school" ON public.school_branding;
CREATE POLICY "school_branding_insert_admin_same_school"
    ON public.school_branding
    FOR INSERT
    WITH CHECK (
        school_id = public.get_caller_school_id()
        AND public.is_branding_admin()
    );
-- UPDATE: alleen branding-admin van eigen school.
DROP POLICY IF EXISTS "school_branding_update_admin_same_school" ON public.school_branding;
CREATE POLICY "school_branding_update_admin_same_school"
    ON public.school_branding
    FOR UPDATE
    USING (
        school_id = public.get_caller_school_id()
        AND public.is_branding_admin()
    )
    WITH CHECK (
        school_id = public.get_caller_school_id()
        AND public.is_branding_admin()
    );
-- DELETE: alleen developer-rol (niet admin) — reset tot defaults kan ook
-- via UPDATE met NULLs, DELETE is voor noodgevallen / opruimen.
DROP POLICY IF EXISTS "school_branding_delete_developer_same_school" ON public.school_branding;
CREATE POLICY "school_branding_delete_developer_same_school"
    ON public.school_branding
    FOR DELETE
    USING (
        school_id = public.get_caller_school_id()
        AND EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
              AND raw_app_meta_data->>'role' = 'developer'
        )
        AND public.is_mfa_aal2()
    );
-- ── 5. Grants ──────────────────────────────────────────────────────────────

GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_branding TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_branding_admin() TO authenticated;
