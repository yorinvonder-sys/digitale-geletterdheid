-- Add a server-side length cap on public.users.display_name.
--
-- Why: the new TeacherFirstLoginWizard issues a direct
-- supabase.from('users').update({display_name, stats}) from the client.
-- The client caps input at 80 chars (DISPLAY_NAME_MAX), but a malicious
-- caller can bypass the form and submit an unbounded payload because the
-- column is plain TEXT with no constraint. The Supabase JS client would
-- happily stream a multi-megabyte string to the database where it is
-- stored and later reflected to other users (TeacherDashboard,
-- TeacherModals, StudentList, etc.).
--
-- 200 chars is generous: it covers titles, hyphenated names, and salutations
-- ("Mevrouw De Vries-Van der Berg") without breaking any existing data.
-- Adjust upward if the data warrants it; never wider than ~500.
--
-- Downstream effects:
--   * Existing rows are unaffected (CHECK is enforced on INSERT/UPDATE).
--   * Future writes that exceed 200 chars fail with check_violation.
--   * Reporting and exports continue to work because they read
--     display_name as plain text; no truncation needed elsewhere.

ALTER TABLE public.users
  ADD CONSTRAINT users_display_name_max_length
  CHECK (display_name IS NULL OR char_length(display_name) <= 200);

COMMENT ON CONSTRAINT users_display_name_max_length ON public.users IS
  'Server-side length cap. Client-side TeacherFirstLoginWizard caps at 80 chars; this prevents direct API bypass.';
