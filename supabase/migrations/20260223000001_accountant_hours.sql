-- ===========================================================================
-- Urenregistratie voor ZZP/Freelancer — Urencriterium module
-- ===========================================================================
-- Tabel:
--   accountant_hours — geregistreerde werkuren per dag
-- Urencriterium:
--   Minimaal 1.225 uur per jaar nodig voor zelfstandigenaftrek (€5.030)
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Tabel: accountant_hours
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accountant_hours (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date        DATE        NOT NULL,
    hours       NUMERIC(4,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
    description TEXT        NOT NULL,
    client      TEXT,       -- nullable: opdrachtgever / project
    billable    BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE accountant_hours ENABLE ROW LEVEL SECURITY;

-- Verwijder bestaande policies indien aanwezig (idempotent)
DROP POLICY IF EXISTS "hours_select_own" ON accountant_hours;
DROP POLICY IF EXISTS "hours_insert_own" ON accountant_hours;
DROP POLICY IF EXISTS "hours_update_own" ON accountant_hours;
DROP POLICY IF EXISTS "hours_delete_own" ON accountant_hours;

-- Gebruikers mogen alleen hun eigen uren inzien
CREATE POLICY "hours_select_own"
    ON accountant_hours FOR SELECT
    USING (auth.uid() = user_id);

-- Gebruikers mogen alleen eigen uren aanmaken
CREATE POLICY "hours_insert_own"
    ON accountant_hours FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Gebruikers mogen alleen eigen uren bijwerken
CREATE POLICY "hours_update_own"
    ON accountant_hours FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Gebruikers mogen alleen eigen uren verwijderen
CREATE POLICY "hours_delete_own"
    ON accountant_hours FOR DELETE
    USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Index voor performante queries op gebruiker + datum
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_accountant_hours_user_date
    ON accountant_hours (user_id, date DESC);
