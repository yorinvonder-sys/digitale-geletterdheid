-- Minimale, echte weergave van de auth-laag zoals Supabase die biedt.
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE auth.users (
  id uuid PRIMARY KEY,
  email text,
  raw_app_meta_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_user_meta_data jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('test.uid', true), '')::uuid;
$$;
CREATE ROLE authenticated;
CREATE ROLE anon;
CREATE ROLE service_role;

CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  uid uuid,
  email text,
  display_name text,
  role text NOT NULL DEFAULT 'student',
  school_id text,
  student_class text,
  stats jsonb DEFAULT '{}'::jsonb
);

-- audit_logs: de vorm die log_class_scoping_change() gebruikt (zelfde kolommen
-- als het bestaande school_branding-auditpatroon).
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  uid uuid,
  school_id text,
  data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- public.users krijgt RLS MET een policy die de nieuwe helper aanroept. Dat is
-- precies de constructie van stap 3 uit het migratiepad, en de enige manier om
-- te bewijzen dat een policy -> helper -> SELECT op users geen oneindige
-- recursie oplevert. Zonder deze policy zou de recursiecheck niets kunnen raken.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
