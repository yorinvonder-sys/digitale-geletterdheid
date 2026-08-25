-- Reconcile: ai_beleid_surveys en ai_beleid_feedback bestaan in productie
-- (met RLS en de vote_on_idea-RPC) maar ontbraken als CREATE TABLE in de
-- repo-migraties. Dit bestand legt de HUIDIGE productiestaat vast, zodat een
-- verse replay dezelfde schema-vorm oplevert en de drift gesloten is.
--
-- Bron: live catalogusinspectie van project tdaylulsnbhhjuufmdzk op
-- 2026-08-25 (kolommen, policies en functiedefinitie letterlijk overgenomen).
-- Alle statements zijn idempotent; op productie is dit een no-op behalve het
-- bijwerken van de migratiehistorie.
--
-- LET OP: pas dit alleen toe na expliciet akkoord van Yorin, via de gewone
-- gecontroleerde route (geen kale `supabase db push`; zie
-- project_supabase_migration_drift).

CREATE TABLE IF NOT EXISTS public.ai_beleid_surveys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  school_id text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_beleid_feedback (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid text NOT NULL,
  categorie text NOT NULL,
  idee text NOT NULL,
  stemmen integer DEFAULT 0,
  gestemde_uids text[] DEFAULT '{}'::text[],
  school_id text,
  "timestamp" timestamptz DEFAULT now()
);

ALTER TABLE public.ai_beleid_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_beleid_feedback ENABLE ROW LEVEL SECURITY;

-- Policies exact zoals ze in productie staan (2026-08-25).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_beleid_surveys' AND policyname = 'ai_beleid_surveys_insert'
  ) THEN
    CREATE POLICY ai_beleid_surveys_insert
      ON public.ai_beleid_surveys FOR INSERT TO authenticated
      WITH CHECK ((auth.uid() IS NOT NULL) AND (uid = (auth.uid())::text));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_beleid_surveys' AND policyname = 'ai_beleid_surveys_select'
  ) THEN
    CREATE POLICY ai_beleid_surveys_select
      ON public.ai_beleid_surveys FOR SELECT TO authenticated
      USING (public.is_teacher_in_school(school_id));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_beleid_feedback' AND policyname = 'ai_beleid_feedback_insert'
  ) THEN
    CREATE POLICY ai_beleid_feedback_insert
      ON public.ai_beleid_feedback FOR INSERT TO authenticated
      WITH CHECK (
        (auth.uid() IS NOT NULL)
        AND (uid = (auth.uid())::text)
        AND (stemmen = 0)
        AND (gestemde_uids = '{}'::text[])
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_beleid_feedback' AND policyname = 'ai_beleid_feedback_select'
  ) THEN
    CREATE POLICY ai_beleid_feedback_select
      ON public.ai_beleid_feedback FOR SELECT TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_beleid_feedback' AND policyname = 'ai_beleid_feedback_update'
  ) THEN
    CREATE POLICY ai_beleid_feedback_update
      ON public.ai_beleid_feedback FOR UPDATE TO authenticated
      USING (uid = (auth.uid())::text)
      WITH CHECK (uid = (auth.uid())::text);
  END IF;
END
$$;

-- Atomische stem-RPC, letterlijk zoals in productie (SECURITY DEFINER,
-- school-scoped, dubbelstem-preventie met FOR UPDATE row lock).
CREATE OR REPLACE FUNCTION public.vote_on_idea(p_idea_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_uids text[];
  v_caller text;
  v_caller_school_id text;
  v_idea_school_id text;
  v_current_votes integer;
BEGIN
  v_caller := auth.uid()::text;

  IF v_caller IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_authenticated');
  END IF;

  SELECT u.school_id
    INTO v_caller_school_id
  FROM public.users u
  WHERE u.id = auth.uid()
     OR u.uid = v_caller
  LIMIT 1;

  IF v_caller_school_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'caller_school_not_found');
  END IF;

  SELECT
    coalesce(f.gestemde_uids, ARRAY[]::text[]),
    coalesce(f.stemmen, 0),
    f.school_id
    INTO v_uids, v_current_votes, v_idea_school_id
  FROM public.ai_beleid_feedback f
  WHERE f.id = p_idea_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'idea_not_found');
  END IF;

  IF v_idea_school_id IS NULL OR v_idea_school_id <> v_caller_school_id THEN
    RETURN jsonb_build_object('success', false, 'reason', 'out_of_scope');
  END IF;

  IF v_caller = ANY(v_uids) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'already_voted');
  END IF;

  UPDATE public.ai_beleid_feedback
  SET stemmen = v_current_votes + 1,
      gestemde_uids = array_append(v_uids, v_caller)
  WHERE id = p_idea_id
    AND school_id = v_caller_school_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'update_out_of_scope');
  END IF;

  RETURN jsonb_build_object('success', true, 'new_votes', v_current_votes + 1);
END;
$function$;
