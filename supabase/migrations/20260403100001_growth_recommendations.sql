-- Groeiaanbevelingen: AI-gegenereerde leerling-aanbevelingen met menselijk toezicht
--
-- Doel: AI genereert gepersonaliseerde leerroute-aanbevelingen per leerling per schooljaar.
-- Docenten moeten elke aanbeveling expliciet goedkeuren voordat een leerling deze kan zien.
--
-- Compliance context:
--   - EU AI Act Art. 12 (traceerbaarheid): input_context en model_version worden opgeslagen
--     als onveranderlijk audit trail. Geen PII in input_context — alleen geaggregeerde scores
--     en domein-labels.
--   - EU AI Act Art. 14 (menselijk toezicht): leerlingen zien een aanbeveling pas na
--     expliciete goedkeuring door een docent (teacher_approved = true). Dit is een harde
--     access control op database-niveau, niet alleen UI-level.
--   - AVG Art. 22: geautomatiseerde besluitvorming over minderjarigen vereist menselijke
--     tussenkomst. De teacher_approved kolom is de technische implementatie hiervan.

CREATE TABLE public.growth_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_year smallint NOT NULL,
  -- The app uses text school_id values from public.users/school_configs.
  school_id text,

  -- AI-gegenereerde aanbeveling
  recommendation_text text NOT NULL,
  focus_domains text[] NOT NULL,  -- bijv. ARRAY['programmeren', 'veiligheid_privacy']

  -- AI Act Art. 12: audit trail — exacte input naar AI (géén PII, alleen scores/labels)
  input_context jsonb NOT NULL,
  -- AI Act Art. 12: welk model de aanbeveling heeft gegenereerd
  model_version text NOT NULL,    -- bijv. 'gemini-2.0-flash-001'

  -- AI Act Art. 14: menselijk toezicht door docent
  -- NULL = nog niet beoordeeld, true = goedgekeurd, false = afgewezen
  teacher_approved boolean DEFAULT NULL,
  teacher_approved_at timestamptz,
  teacher_approved_by uuid REFERENCES auth.users(id),
  teacher_notes text,

  created_at timestamptz NOT NULL DEFAULT now(),

  -- Één actieve aanbeveling per leerling per schooljaar
  CONSTRAINT unique_recommendation UNIQUE (user_id, school_year)
);

-- Indexen voor veelgebruikte queries
CREATE INDEX idx_recommendations_user ON public.growth_recommendations(user_id);
CREATE INDEX idx_recommendations_school_year ON public.growth_recommendations(school_year);
-- Partial index: alleen als school_id gevuld is (nullable kolom)
CREATE INDEX idx_recommendations_school ON public.growth_recommendations(school_id)
  WHERE school_id IS NOT NULL;
-- Partial index voor docent-dashboard: "toon openstaande aanbevelingen ter goedkeuring"
CREATE INDEX idx_recommendations_pending ON public.growth_recommendations(teacher_approved)
  WHERE teacher_approved IS NULL;

-- RLS: row-level security inschakelen
ALTER TABLE public.growth_recommendations ENABLE ROW LEVEL SECURITY;

-- Leerlingen lezen alleen hun eigen goedgekeurde aanbeveling
-- Art. 14: de teacher_approved = true check is hier de technische harde grens
CREATE POLICY "Leerlingen lezen eigen goedgekeurde aanbeveling"
  ON public.growth_recommendations FOR SELECT
  USING (auth.uid() = user_id AND teacher_approved = true);

-- Leerlingen mogen een nieuwe aanbeveling aanvragen voor zichzelf
CREATE POLICY "Leerlingen maken eigen aanbeveling"
  ON public.growth_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Docenten lezen alle aanbevelingen (ook openstaande ter goedkeuring)
CREATE POLICY "Docenten lezen aanbevelingen"
  ON public.growth_recommendations FOR SELECT
  USING (is_teacher());

-- Docenten keuren aanbevelingen goed of af (Art. 14 menselijk toezicht)
CREATE POLICY "Docenten keuren aanbevelingen goed"
  ON public.growth_recommendations FOR UPDATE
  USING (is_teacher())
  WITH CHECK (is_teacher());

-- Tabelcommentaar voor documentatie in de databasecatalogus
COMMENT ON TABLE public.growth_recommendations IS
  'AI-gegenereerde leerling-aanbevelingen per schooljaar. Leerlingen zien pas een aanbeveling '
  'na expliciete docent-goedkeuring (EU AI Act Art. 14, AVG Art. 22).';

COMMENT ON COLUMN public.growth_recommendations.input_context IS
  'Exacte input naar het AI-model als audit trail (EU AI Act Art. 12). Bevat geen PII — '
  'alleen geaggregeerde scores en domein-labels.';

COMMENT ON COLUMN public.growth_recommendations.model_version IS
  'Versie van het AI-model dat de aanbeveling heeft gegenereerd (EU AI Act Art. 12 traceerbaarheid).';

COMMENT ON COLUMN public.growth_recommendations.teacher_approved IS
  'NULL = wacht op beoordeling, true = goedgekeurd, false = afgewezen. '
  'Leerlingen kunnen alleen goedgekeurde (true) aanbevelingen zien via RLS (EU AI Act Art. 14).';
