-- ============================================================================
-- Nulmeting (Digitale Escaperoom) resultaten
-- ============================================================================
-- Doel: Slaat het resultaat op van de intake-assessment per leerling.
-- Elke leerling heeft maximaal één nulmeting-resultaat (UNIQUE op user_id).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.nulmeting_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Overall scores
  overall_score smallint NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  niveau text NOT NULL CHECK (niveau IN ('starter', 'basis', 'gevorderd')),
  total_time_seconds integer NOT NULL,

  -- Scores per domein (0-100)
  score_digitale_systemen smallint NOT NULL CHECK (score_digitale_systemen BETWEEN 0 AND 100),
  score_media_en_ai smallint NOT NULL CHECK (score_media_en_ai BETWEEN 0 AND 100),
  score_programmeren smallint NOT NULL CHECK (score_programmeren BETWEEN 0 AND 100),
  score_veiligheid_privacy smallint NOT NULL CHECK (score_veiligheid_privacy BETWEEN 0 AND 100),
  score_welzijn_maatschappij smallint NOT NULL CHECK (score_welzijn_maatschappij BETWEEN 0 AND 100),

  -- Tijd per kamer (seconden)
  time_digitale_systemen integer,
  time_media_en_ai integer,
  time_programmeren integer,
  time_veiligheid_privacy integer,
  time_welzijn_maatschappij integer,

  -- Details per kamer (JSON voor gedetailleerde analyse)
  details_digitale_systemen jsonb DEFAULT '{}',
  details_media_en_ai jsonb DEFAULT '{}',
  details_programmeren jsonb DEFAULT '{}',
  details_veiligheid_privacy jsonb DEFAULT '{}',
  details_welzijn_maatschappij jsonb DEFAULT '{}',

  -- Open reflectie uit Kamer 5 (Dilemma) — apart veld voor docent-inzage
  reflectie_dilemma text,

  -- Metadata
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),

  -- Eén resultaat per leerling
  CONSTRAINT unique_user_nulmeting UNIQUE (user_id)
);

-- Indexen
CREATE INDEX IF NOT EXISTS idx_nulmeting_user ON public.nulmeting_results(user_id);
CREATE INDEX IF NOT EXISTS idx_nulmeting_niveau ON public.nulmeting_results(niveau);

-- RLS inschakelen
ALTER TABLE public.nulmeting_results ENABLE ROW LEVEL SECURITY;

-- Leerlingen mogen alleen hun eigen resultaat lezen
CREATE POLICY "Leerlingen lezen eigen nulmeting"
  ON public.nulmeting_results FOR SELECT
  USING (auth.uid() = user_id);

-- Leerlingen mogen hun eigen resultaat aanmaken
CREATE POLICY "Leerlingen maken eigen nulmeting"
  ON public.nulmeting_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Leerlingen mogen hun eigen resultaat updaten (opnieuw doen)
CREATE POLICY "Leerlingen updaten eigen nulmeting"
  ON public.nulmeting_results FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Docenten mogen resultaten van alle leerlingen lezen
-- Gebruikt is_teacher() helper uit migratie 20260222030000
CREATE POLICY "Docenten lezen nulmeting resultaten"
  ON public.nulmeting_results FOR SELECT
  USING (is_teacher());
