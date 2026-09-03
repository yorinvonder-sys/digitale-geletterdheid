\set ON_ERROR_STOP on
\pset format unaligned
\pset tuples_only on

CREATE OR REPLACE FUNCTION pg_temp.as_user(p_uid text, p_aal text DEFAULT 'aal2')
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  PERFORM set_config('test.uid', p_uid, false);
  PERFORM set_config('request.jwt.claims', json_build_object('aal', p_aal)::text, false);
END; $$;

CREATE TEMP TABLE res (n int GENERATED ALWAYS AS IDENTITY, name text, expected boolean, actual boolean);

CREATE OR REPLACE FUNCTION pg_temp.chk(p_name text, p_expected boolean, p_actual boolean)
RETURNS void LANGUAGE sql AS $$ INSERT INTO res(name, expected, actual) VALUES (p_name, p_expected, p_actual); $$;

-- ===== MODUS 'school' (geen instellingenrij) — huidig gedrag moet ONGEWIJZIGD zijn =====
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a1');
SELECT pg_temp.chk('school | docent A1 ziet leerling in EIGEN klas A1', true,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e1'));
SELECT pg_temp.chk('school | docent A1 ziet leerling in ANDERE klas A2 (regressie-check)', true,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e2'));
SELECT pg_temp.chk('school | docent A1 ziet leerling ZONDER klas', true,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e3'));
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000b1');
SELECT pg_temp.chk('school | docent van school B ziet leerling school A NIET', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e1'));

-- ===== MODUS 'class_soft' =====
INSERT INTO public.school_access_settings (school_id, teacher_scope) VALUES ('school-a','class_soft');

SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a1');
SELECT pg_temp.chk('soft | docent MET toewijzing ziet eigen klas A1', true,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e1'));
SELECT pg_temp.chk('soft | docent MET toewijzing ziet vreemde klas A2 NIET', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e2'));
SELECT pg_temp.chk('soft | docent MET toewijzing ziet leerling zonder klas NIET', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e3'));
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a2');
SELECT pg_temp.chk('soft | docent ZONDER toewijzing houdt schoolbrede toegang (A1)', true,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e1'));
SELECT pg_temp.chk('soft | docent ZONDER toewijzing houdt schoolbrede toegang (A2)', true,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e2'));
SELECT pg_temp.chk('soft | docent ZONDER toewijzing ziet leerling ZONDER klas NIET', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e3'));
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a3','aal2');
SELECT pg_temp.chk('soft | schoolbeheerder MET MFA houdt schoolbreed zicht (A2)', true,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e2'));
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a3','aal1');
SELECT pg_temp.chk('soft | schoolbeheerder ZONDER MFA ziet niets (AAL2 sinds 20260626144000)', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e2'));

-- ===== MODUS 'class_strict' =====
UPDATE public.school_access_settings SET teacher_scope='class_strict' WHERE school_id='school-a';

SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a1');
SELECT pg_temp.chk('strict | docent MET toewijzing ziet eigen klas A1', true,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e1'));
SELECT pg_temp.chk('strict | docent MET toewijzing ziet vreemde klas A2 NIET', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e2'));
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a2');
SELECT pg_temp.chk('strict | docent ZONDER toewijzing ziet NIETS (fail closed)', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e1'));
SELECT pg_temp.chk('strict | docent ZONDER toewijzing ziet leerling zonder klas NIET', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e3'));
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a3','aal2');
SELECT pg_temp.chk('strict | schoolbeheerder MET MFA houdt schoolbreed zicht', true,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e2'));
SELECT pg_temp.chk('strict | schoolbeheerder ziet ook leerling ZONDER klas', true,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e3'));

-- ===== Erfelijke grenzen: MFA, schoolgrens, onbekende leerling =====
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a1','aal1');
SELECT pg_temp.chk('MFA | docent zonder aal2 ziet eigen klas NIET', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e1'));
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a1');
SELECT pg_temp.chk('grens | onbekende leerling-uuid => false', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-00000000dead'));
SELECT pg_temp.chk('grens | NULL => false', false,
  public.is_teacher_of_student(NULL));
SELECT pg_temp.chk('grens | leerling andere school => false', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e4'));
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000e1');
SELECT pg_temp.chk('grens | leerling zelf is geen docent => false', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e2'));
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a1');
SELECT pg_temp.chk('grens | doelaccount is een DOCENT => false (geen leerling)', false,
  public.is_teacher_of_student('00000000-0000-4000-8000-0000000000a2'));

-- Recursie: zet een users-policy op die de helper aanroept — de constructie van
-- stap 3 uit het migratiepad. Als dat een lus geeft, faalt dit met stack depth.
DROP POLICY IF EXISTS users_select_own_or_teacher_scoped ON public.users;
CREATE POLICY users_select_own_or_teacher_scoped ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_teacher_of_student(id));
GRANT SELECT ON public.users TO authenticated;
DO $rec$
DECLARE v_ok boolean;
BEGIN
  BEGIN
    PERFORM public.is_teacher_of_student('00000000-0000-4000-8000-0000000000e1');
    v_ok := true;
  EXCEPTION WHEN others THEN
    v_ok := false;
  END;
  INSERT INTO res(name, expected, actual)
  VALUES ('recursie | users-policy roept helper aan zonder oneindige lus', true, v_ok);
END $rec$;
DROP POLICY IF EXISTS users_select_own_or_teacher_scoped ON public.users;

-- ===== Nooit ruimer dan de bestaande schoolbrede helper =====
SELECT pg_temp.as_user('00000000-0000-4000-8000-0000000000a1');
SELECT pg_temp.chk('containment | is_teacher_of_class impliceert is_teacher_in_school', true,
  NOT public.is_teacher_of_class('school-b','B1') OR public.is_teacher_in_school('school-b'));

SELECT format('%s  %s', CASE WHEN expected IS NOT DISTINCT FROM actual THEN 'PASS' ELSE 'FAIL' END, name) FROM res ORDER BY n;
SELECT format('--- %s van %s geslaagd ---',
  count(*) FILTER (WHERE expected IS NOT DISTINCT FROM actual), count(*)) FROM res;
DO $$
DECLARE v_fail int;
BEGIN
  SELECT count(*) INTO v_fail FROM res WHERE expected IS DISTINCT FROM actual;
  IF v_fail > 0 THEN RAISE EXCEPTION '% assertie(s) gefaald', v_fail; END IF;
END $$;
