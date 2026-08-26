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
