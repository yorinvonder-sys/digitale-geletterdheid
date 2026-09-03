\set ON_ERROR_STOP on
\pset format unaligned
\pset tuples_only on

GRANT USAGE ON SCHEMA public, auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated;
GRANT SELECT ON public.users TO authenticated;

CREATE TEMP TABLE rres (n int GENERATED ALWAYS AS IDENTITY, name text, ok boolean);
GRANT SELECT, INSERT ON rres TO authenticated;

-- 1. Docent A1 probeert zichzelf klas A2 toe te kennen -> moet WEIGEREN.
SET SESSION AUTHORIZATION authenticated;
SELECT set_config('test.uid','00000000-0000-4000-8000-0000000000a1',false);
SELECT set_config('request.jwt.claims','{"aal":"aal2"}',false);
DO $$
BEGIN
  INSERT INTO public.teacher_classes (teacher_id, school_id, student_class)
  VALUES ('00000000-0000-4000-8000-0000000000a1','school-a','A2');
  INSERT INTO rres(name, ok) VALUES ('RLS | docent kan zichzelf GEEN klas toekennen', false);
EXCEPTION WHEN insufficient_privilege THEN
  INSERT INTO rres(name, ok) VALUES ('RLS | docent kan zichzelf GEEN klas toekennen', true);
END $$;

-- 2. Docent A1 probeert zijn eigen koppelrij te verwijderen -> moet WEIGEREN.
DO $$
DECLARE v_deleted int;
BEGIN
  DELETE FROM public.teacher_classes WHERE teacher_id = '00000000-0000-4000-8000-0000000000a1';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  INSERT INTO rres(name, ok) VALUES ('RLS | docent kan eigen koppeling niet verwijderen', v_deleted = 0);
EXCEPTION WHEN insufficient_privilege THEN
  INSERT INTO rres(name, ok) VALUES ('RLS | docent kan eigen koppeling niet verwijderen', true);
END $$;

-- 3. Docent van school B ziet de koppelingen van school A niet.
SELECT set_config('test.uid','00000000-0000-4000-8000-0000000000b1',false);
INSERT INTO rres(name, ok)
SELECT 'RLS | docent school B ziet koppelingen school A niet', count(*) = 0
FROM public.teacher_classes;

-- 4. Docent A1 ziet zijn eigen koppeling wel.
SELECT set_config('test.uid','00000000-0000-4000-8000-0000000000a1',false);
INSERT INTO rres(name, ok)
SELECT 'RLS | docent ziet eigen koppeling wel', count(*) = 1
FROM public.teacher_classes;

-- 5. Docent kan de scope-modus van zijn school niet zelf omzetten.
DO $$
DECLARE v_upd int;
BEGIN
  UPDATE public.school_access_settings SET teacher_scope = 'school' WHERE school_id = 'school-a';
  GET DIAGNOSTICS v_upd = ROW_COUNT;
  INSERT INTO rres(name, ok) VALUES ('RLS | docent kan scope-modus niet versoepelen', v_upd = 0);
EXCEPTION WHEN insufficient_privilege THEN
  INSERT INTO rres(name, ok) VALUES ('RLS | docent kan scope-modus niet versoepelen', true);
END $$;

-- 6a. Beheerder ZONDER MFA mag NIET toekennen (is_class_scoping_admin eist AAL2).
SELECT set_config('test.uid','00000000-0000-4000-8000-0000000000a3',false);
SELECT set_config('request.jwt.claims','{"aal":"aal1"}',false);
DO $$
BEGIN
  INSERT INTO public.teacher_classes (teacher_id, school_id, student_class)
  VALUES ('00000000-0000-4000-8000-0000000000a2','school-a','A2');
  INSERT INTO rres(name, ok) VALUES ('RLS | beheerder ZONDER MFA kan niet toekennen', false);
EXCEPTION WHEN insufficient_privilege THEN
  INSERT INTO rres(name, ok) VALUES ('RLS | beheerder ZONDER MFA kan niet toekennen', true);
END $$;

-- 6b. Beheerder MET MFA kan wel toekennen.
SELECT set_config('request.jwt.claims','{"aal":"aal2"}',false);
DO $$
BEGIN
  INSERT INTO public.teacher_classes (teacher_id, school_id, student_class, created_by)
  VALUES ('00000000-0000-4000-8000-0000000000a2','school-a','A2','00000000-0000-4000-8000-0000000000a3');
  INSERT INTO rres(name, ok) VALUES ('RLS | schoolbeheerder kan wel toekennen', true);
EXCEPTION WHEN insufficient_privilege THEN
  INSERT INTO rres(name, ok) VALUES ('RLS | schoolbeheerder kan wel toekennen', false);
END $$;

-- 7. Beheerder van school A kan GEEN koppeling voor school B maken.
DO $$
BEGIN
  INSERT INTO public.teacher_classes (teacher_id, school_id, student_class)
  VALUES ('00000000-0000-4000-8000-0000000000b1','school-b','B1');
  INSERT INTO rres(name, ok) VALUES ('RLS | beheerder kan niet buiten eigen school koppelen', false);
EXCEPTION WHEN insufficient_privilege THEN
  INSERT INTO rres(name, ok) VALUES ('RLS | beheerder kan niet buiten eigen school koppelen', true);
END $$;


-- 8. teacher_scope_mode() is geen publieke orakelfunctie meer.
SET SESSION AUTHORIZATION authenticated;
DO $$
BEGIN
  PERFORM public.teacher_scope_mode('school-b');
  INSERT INTO rres(name, ok) VALUES ('RLS | teacher_scope_mode niet aanroepbaar door authenticated', false);
EXCEPTION WHEN insufficient_privilege THEN
  INSERT INTO rres(name, ok) VALUES ('RLS | teacher_scope_mode niet aanroepbaar door authenticated', true);
END $$;

-- 9. Doelvalidatie: een LEERLING koppelen als 'docent' moet weigeren.
SELECT set_config('test.uid','00000000-0000-4000-8000-0000000000a3',false);
SELECT set_config('request.jwt.claims','{"aal":"aal2"}',false);
DO $$
BEGIN
  INSERT INTO public.teacher_classes (teacher_id, school_id, student_class)
  VALUES ('00000000-0000-4000-8000-0000000000e1','school-a','A1');
  INSERT INTO rres(name, ok) VALUES ('trigger | leerling kan niet als docent gekoppeld worden', false);
EXCEPTION WHEN check_violation THEN
  INSERT INTO rres(name, ok) VALUES ('trigger | leerling kan niet als docent gekoppeld worden', true);
END $$;

-- 10. Doelvalidatie: docent van een ANDERE school koppelen moet weigeren.
DO $$
BEGIN
  INSERT INTO public.teacher_classes (teacher_id, school_id, student_class)
  VALUES ('00000000-0000-4000-8000-0000000000b1','school-a','A1');
  INSERT INTO rres(name, ok) VALUES ('trigger | docent van andere school kan niet gekoppeld worden', false);
EXCEPTION WHEN check_violation THEN
  INSERT INTO rres(name, ok) VALUES ('trigger | docent van andere school kan niet gekoppeld worden', true);
END $$;

-- 11. created_by wordt SERVER-side gestempeld, niet overgenomen van de client.
DELETE FROM public.teacher_classes WHERE student_class = 'A3';
INSERT INTO public.teacher_classes (teacher_id, school_id, student_class, created_by)
VALUES ('00000000-0000-4000-8000-0000000000a2','school-a','A3','00000000-0000-4000-8000-0000000000e1');
INSERT INTO rres(name, ok)
SELECT 'trigger | created_by komt van auth.uid(), niet van de client',
       created_by = '00000000-0000-4000-8000-0000000000a3'
FROM public.teacher_classes WHERE student_class = 'A3';

RESET SESSION AUTHORIZATION;

-- 12. Auditspoor: insert en delete komen allebei in audit_logs.
INSERT INTO rres(name, ok)
SELECT 'audit | toekennen wordt gelogd', count(*) > 0
FROM public.audit_logs WHERE action = 'teacher_classes_insert';

DELETE FROM public.teacher_classes WHERE student_class = 'A3';
INSERT INTO rres(name, ok)
SELECT 'audit | INTREKKEN van een toewijzing wordt gelogd', count(*) > 0
FROM public.audit_logs WHERE action = 'teacher_classes_delete';

INSERT INTO rres(name, ok)
SELECT 'audit | wijziging van de scope-modus wordt gelogd', count(*) > 0
FROM public.audit_logs WHERE action LIKE 'school_access_settings_%';

RESET SESSION AUTHORIZATION;
SELECT format('%s  %s', CASE WHEN ok THEN 'PASS' ELSE 'FAIL' END, name) FROM rres ORDER BY n;
SELECT format('--- %s van %s geslaagd ---', count(*) FILTER (WHERE ok), count(*)) FROM rres;
DO $$
DECLARE v int;
BEGIN
  SELECT count(*) INTO v FROM rres WHERE NOT ok;
  IF v > 0 THEN RAISE EXCEPTION '% RLS-assertie(s) gefaald', v; END IF;
END $$;
