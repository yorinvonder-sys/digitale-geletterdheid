-- ============================================================================
-- Consent Management voor Minderjarigen (AVG Art. 8)
-- ============================================================================
-- Doel: Toestemmingsbeheer voor data processing, AI interactie, analytics
-- en peer feedback. Ouderlijke toestemming vereist voor leerlingen <16 jaar.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.student_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('data_processing', 'ai_interaction', 'analytics', 'peer_feedback')),
  granted BOOLEAN NOT NULL DEFAULT false,
  granted_by TEXT NOT NULL CHECK (granted_by IN ('student', 'parent', 'school')),
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  parent_email TEXT,
  parent_name TEXT,
  ip_address TEXT,
  consent_version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, consent_type)
);

-- Index voor snelle lookups
CREATE INDEX IF NOT EXISTS idx_student_consents_student_id ON public.student_consents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_consents_school_id ON public.student_consents(school_id);

-- RLS inschakelen
ALTER TABLE public.student_consents ENABLE ROW LEVEL SECURITY;

-- Leerlingen kunnen hun eigen consents lezen
CREATE POLICY "Students read own consents"
  ON public.student_consents FOR SELECT
  USING (student_id = auth.uid());

-- Leerlingen kunnen hun eigen consents aanmaken
CREATE POLICY "Students insert own consents"
  ON public.student_consents FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Leerlingen kunnen hun eigen consents updaten (grant/revoke)
CREATE POLICY "Students update own consents"
  ON public.student_consents FOR UPDATE
  USING (student_id = auth.uid());

-- Docenten kunnen consents van hun school lezen
CREATE POLICY "Teachers read school consents"
  ON public.student_consents FOR SELECT
  USING (public.is_teacher_in_school(school_id));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_student_consents_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_student_consents_updated_at
  BEFORE UPDATE ON public.student_consents
  FOR EACH ROW EXECUTE FUNCTION public.update_student_consents_updated_at();
