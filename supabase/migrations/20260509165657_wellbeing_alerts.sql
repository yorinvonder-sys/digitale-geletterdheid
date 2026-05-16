-- Welzijnsdetectie: tabel voor docentnotificaties bij zorgwekkende leerlingberichten
-- Privacy-by-design: we slaan NOOIT de originele tekst op, alleen de categorie en timestamp

CREATE TABLE IF NOT EXISTS public.wellbeing_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('suicidaal', 'zelfbeschadiging', 'pesten', 'geweld_misbruik', 'psychisch')),
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    notes TEXT, -- docent kan notities toevoegen na review
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index voor snel opvragen per student en chronologisch
CREATE INDEX IF NOT EXISTS idx_wellbeing_alerts_student
    ON public.wellbeing_alerts(student_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_wellbeing_alerts_unreviewed
    ON public.wellbeing_alerts(reviewed_at)
    WHERE reviewed_at IS NULL;

-- RLS: alleen docenten en admins mogen alerts lezen
ALTER TABLE public.wellbeing_alerts ENABLE ROW LEVEL SECURITY;

-- Studenten mogen NIETS zien van deze tabel
-- Docenten mogen alerts lezen en reviewen
DROP POLICY IF EXISTS "Docenten kunnen wellbeing alerts lezen" ON public.wellbeing_alerts;
CREATE POLICY "Docenten kunnen wellbeing alerts lezen"
    ON public.wellbeing_alerts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('teacher', 'admin')
        )
    );

DROP POLICY IF EXISTS "Docenten kunnen wellbeing alerts reviewen" ON public.wellbeing_alerts;
CREATE POLICY "Docenten kunnen wellbeing alerts reviewen"
    ON public.wellbeing_alerts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('teacher', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('teacher', 'admin')
        )
    );

-- RPC functie voor het loggen van alerts (kan vanuit client worden aangeroepen)
CREATE OR REPLACE FUNCTION public.log_wellbeing_alert(
    p_student_id TEXT,
    p_category TEXT,
    p_detected_at TIMESTAMPTZ
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.wellbeing_alerts (student_id, category, detected_at)
    VALUES (p_student_id, p_category, COALESCE(p_detected_at, NOW()));
END;
$$;
