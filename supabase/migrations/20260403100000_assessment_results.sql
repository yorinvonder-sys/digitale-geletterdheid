-- =============================================================================
-- Migratie: assessment_results
-- Doel: Centrale tabel voor zowel nulmetingen als eindmetingen per leerling
--       per schooljaar. Vervangt de enkelvoudige nulmeting_results tabel niet,
--       maar voegt een generiek assessmentmodel toe met backfill van bestaande
--       nulmeting-data.
-- Datum: 2026-04-03
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.assessment_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_year smallint NOT NULL,
  assessment_type text NOT NULL CHECK (assessment_type IN ('nulmeting', 'eindmeting')),
  -- The app uses text school_id values from public.users/school_configs.
  -- Keep this text-scoped so local and production migrations match app writes.
  school_id text,
  overall_score smallint NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  niveau text NOT NULL CHECK (niveau IN ('starter', 'basis', 'gevorderd')),
  total_time_seconds integer NOT NULL,
  score_digitale_systemen smallint NOT NULL CHECK (score_digitale_systemen BETWEEN 0 AND 100),
  score_media_en_ai smallint NOT NULL CHECK (score_media_en_ai BETWEEN 0 AND 100),
  score_programmeren smallint NOT NULL CHECK (score_programmeren BETWEEN 0 AND 100),
  score_veiligheid_privacy smallint NOT NULL CHECK (score_veiligheid_privacy BETWEEN 0 AND 100),
  score_welzijn_maatschappij smallint NOT NULL CHECK (score_welzijn_maatschappij BETWEEN 0 AND 100),
  time_digitale_systemen integer,
  time_media_en_ai integer,
  time_programmeren integer,
  time_veiligheid_privacy integer,
  time_welzijn_maatschappij integer,
  details_digitale_systemen jsonb DEFAULT '{}',
  details_media_en_ai jsonb DEFAULT '{}',
  details_programmeren jsonb DEFAULT '{}',
  details_veiligheid_privacy jsonb DEFAULT '{}',
  details_welzijn_maatschappij jsonb DEFAULT '{}',
  reflectie_dilemma text,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  -- Één nulmeting én één eindmeting per leerling per schooljaar
  CONSTRAINT unique_user_assessment UNIQUE (user_id, school_year, assessment_type)
);

-- -----------------------------------------------------------------------------
-- RLS inschakelen
-- -----------------------------------------------------------------------------
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Leerlingen lezen alleen hun eigen assessment-resultaten
CREATE POLICY "Leerlingen lezen eigen assessment"
  ON public.assessment_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Leerlingen mogen alleen hun eigen assessment aanmaken
CREATE POLICY "Leerlingen maken eigen assessment"
  ON public.assessment_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Leerlingen mogen alleen hun eigen assessment bijwerken
CREATE POLICY "Leerlingen updaten eigen assessment"
  ON public.assessment_results
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Docenten mogen alle assessment-resultaten lezen (via is_teacher() helper)
CREATE POLICY "Docenten lezen assessment resultaten"
  ON public.assessment_results
  FOR SELECT
  USING (is_teacher());

-- -----------------------------------------------------------------------------
-- Indexen
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_assessment_user
  ON public.assessment_results (user_id);

CREATE INDEX IF NOT EXISTS idx_assessment_type
  ON public.assessment_results (assessment_type);

CREATE INDEX IF NOT EXISTS idx_assessment_school_year
  ON public.assessment_results (school_year);

-- Partiële index: alleen rijen met een school_id (nullable kolom)
CREATE INDEX IF NOT EXISTS idx_assessment_school
  ON public.assessment_results (school_id)
  WHERE school_id IS NOT NULL;

-- -----------------------------------------------------------------------------
-- Backfill: bestaande nulmeting_results overnemen als 'nulmeting' schooljaar 2025
-- -----------------------------------------------------------------------------
INSERT INTO public.assessment_results (
  id,
  user_id,
  school_year,
  assessment_type,
  school_id,
  overall_score,
  niveau,
  total_time_seconds,
  score_digitale_systemen,
  score_media_en_ai,
  score_programmeren,
  score_veiligheid_privacy,
  score_welzijn_maatschappij,
  time_digitale_systemen,
  time_media_en_ai,
  time_programmeren,
  time_veiligheid_privacy,
  time_welzijn_maatschappij,
  details_digitale_systemen,
  details_media_en_ai,
  details_programmeren,
  details_veiligheid_privacy,
  details_welzijn_maatschappij,
  reflectie_dilemma,
  completed_at,
  created_at
)
SELECT
  nr.id,
  nr.user_id,
  2025 AS school_year,
  'nulmeting' AS assessment_type,
  (SELECT u.school_id FROM public.users u WHERE u.id = nr.user_id) AS school_id,
  nr.overall_score,
  nr.niveau,
  nr.total_time_seconds,
  nr.score_digitale_systemen,
  nr.score_media_en_ai,
  nr.score_programmeren,
  nr.score_veiligheid_privacy,
  nr.score_welzijn_maatschappij,
  nr.time_digitale_systemen,
  nr.time_media_en_ai,
  nr.time_programmeren,
  nr.time_veiligheid_privacy,
  nr.time_welzijn_maatschappij,
  nr.details_digitale_systemen,
  nr.details_media_en_ai,
  nr.details_programmeren,
  nr.details_veiligheid_privacy,
  nr.details_welzijn_maatschappij,
  nr.reflectie_dilemma,
  nr.completed_at,
  nr.created_at
FROM public.nulmeting_results nr
ON CONFLICT (user_id, school_year, assessment_type) DO NOTHING;
