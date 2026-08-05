-- Reconcile remote migration history with local baseline assumptions.
--
-- Some older production migrations refer to public.profiles, while the live
-- database currently has public.users but no profiles compatibility view. The
-- local baseline already creates this view for fresh replay, so this migration
-- makes the remote schema end in the same shape before applying older missing
-- migrations.

DO $$
BEGIN
  IF to_regclass('public.users') IS NULL THEN
    RAISE EXCEPTION 'Cannot create public.profiles compatibility view because public.users is missing';
  END IF;

  IF to_regclass('public.profiles') IS NULL THEN
    EXECUTE $view$
      CREATE VIEW public.profiles
      WITH (security_invoker = true)
      AS
      SELECT
        id,
        uid,
        email,
        display_name,
        role,
        school_id,
        student_class,
        stats,
        created_at,
        updated_at
      FROM public.users
    $view$;
  END IF;
END;
$$;
