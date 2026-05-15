-- ============================================================================
-- Eindmeting vrijgave per klas
-- Doel: Docenten geven de eindmeting vrij voor een specifieke klas.
--       Leerlingen zien de eindmeting pas als hun klas is vrijgegeven.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.eindmeting_releases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  -- The app uses text school_id values from public.users/school_configs.
  school_id text NOT NULL,
  school_year smallint NOT NULL,
  student_class text NOT NULL,           -- bijv. 'MH1A', 'V2B'
  released_by uuid NOT NULL REFERENCES auth.users(id),  -- docent die vrijgaf
  released_at timestamptz NOT NULL DEFAULT now(),

  -- Één vrijgave per klas per schooljaar
  CONSTRAINT unique_release UNIQUE (school_id, school_year, student_class)
);

-- RLS
ALTER TABLE public.eindmeting_releases ENABLE ROW LEVEL SECURITY;

-- Docenten mogen vrijgaves lezen en aanmaken
CREATE POLICY "Docenten lezen eindmeting vrijgaves"
  ON public.eindmeting_releases FOR SELECT
  USING (is_teacher());

CREATE POLICY "Docenten maken eindmeting vrijgaves"
  ON public.eindmeting_releases FOR INSERT
  WITH CHECK (is_teacher());

-- Leerlingen mogen checken of hun klas is vrijgegeven
CREATE POLICY "Leerlingen lezen eigen klas vrijgave"
  ON public.eindmeting_releases FOR SELECT
  USING (
    school_id = (SELECT u.school_id FROM public.users u WHERE u.id = auth.uid())
    AND student_class = (SELECT u.student_class FROM public.users u WHERE u.id = auth.uid())
  );

-- Index voor snelle lookup
CREATE INDEX idx_eindmeting_release_lookup
  ON public.eindmeting_releases (school_id, school_year, student_class);
