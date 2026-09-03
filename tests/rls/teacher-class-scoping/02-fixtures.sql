INSERT INTO auth.users (id, email, raw_app_meta_data) VALUES
 ('00000000-0000-4000-8000-0000000000a1','t-a1@x.test','{"role":"teacher","schoolId":"school-a"}'),
 ('00000000-0000-4000-8000-0000000000a2','t-none@x.test','{"role":"teacher","schoolId":"school-a"}'),
 ('00000000-0000-4000-8000-0000000000a3','admin-a@x.test','{"role":"admin","schoolId":"school-a"}'),
 ('00000000-0000-4000-8000-0000000000b1','t-b@x.test','{"role":"teacher","schoolId":"school-b"}'),
 ('00000000-0000-4000-8000-0000000000e1','s-a1@x.test','{"role":"student","schoolId":"school-a"}'),
 ('00000000-0000-4000-8000-0000000000e2','s-a2@x.test','{"role":"student","schoolId":"school-a"}'),
 ('00000000-0000-4000-8000-0000000000e3','s-noclass@x.test','{"role":"student","schoolId":"school-a"}'),
 ('00000000-0000-4000-8000-0000000000e4','s-b1@x.test','{"role":"student","schoolId":"school-b"}');

INSERT INTO public.users (id, uid, email, display_name, role, school_id, student_class) VALUES
 ('00000000-0000-4000-8000-0000000000a1','00000000-0000-4000-8000-0000000000a1','t-a1@x.test','Docent A1','teacher','school-a',NULL),
 ('00000000-0000-4000-8000-0000000000a2','00000000-0000-4000-8000-0000000000a2','t-none@x.test','Docent Zonder','teacher','school-a',NULL),
 ('00000000-0000-4000-8000-0000000000a3','00000000-0000-4000-8000-0000000000a3','admin-a@x.test','Beheerder A','admin','school-a',NULL),
 ('00000000-0000-4000-8000-0000000000b1','00000000-0000-4000-8000-0000000000b1','t-b@x.test','Docent B','teacher','school-b',NULL),
 ('00000000-0000-4000-8000-0000000000e1','00000000-0000-4000-8000-0000000000e1','s-a1@x.test','Leerling A1','student','school-a','A1'),
 ('00000000-0000-4000-8000-0000000000e2','00000000-0000-4000-8000-0000000000e2','s-a2@x.test','Leerling A2','student','school-a','A2'),
 ('00000000-0000-4000-8000-0000000000e3','00000000-0000-4000-8000-0000000000e3','s-noclass@x.test','Leerling zonder klas','student','school-a',NULL),
 ('00000000-0000-4000-8000-0000000000e4','00000000-0000-4000-8000-0000000000e4','s-b1@x.test','Leerling B1','student','school-b','B1');

-- Docent A1 geeft les aan klas A1 (en NIET aan A2).
INSERT INTO public.teacher_classes (teacher_id, school_id, student_class, created_by) VALUES
 ('00000000-0000-4000-8000-0000000000a1','school-a','A1','00000000-0000-4000-8000-0000000000a3');
