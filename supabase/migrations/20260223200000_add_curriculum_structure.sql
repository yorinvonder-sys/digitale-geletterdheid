-- Leerjaar en niveau aan gebruikers toevoegen
ALTER TABLE users ADD COLUMN IF NOT EXISTS year_group smallint;
ALTER TABLE users ADD COLUMN IF NOT EXISTS education_level text;

-- School-configuratie voor periodebenaming en -aantal
CREATE TABLE IF NOT EXISTS school_configs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id text NOT NULL UNIQUE,
    period_naming text DEFAULT 'Periode',
    periods_per_year smallint DEFAULT 4,
    max_year_mavo smallint DEFAULT 2,
    max_year_havo smallint DEFAULT 3,
    max_year_vwo smallint DEFAULT 3,
    custom_config jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE school_configs ENABLE ROW LEVEL SECURITY;

-- Teachers can read their own school config
CREATE POLICY "Teachers can read own school config" ON school_configs
    FOR SELECT USING (
        school_id IN (SELECT get_my_school_id())
    );

-- Teachers/admins can insert/update their own school config
CREATE POLICY "Teachers can manage own school config" ON school_configs
    FOR ALL USING (
        school_id IN (SELECT get_my_school_id())
        AND (SELECT get_my_role()) IN ('teacher', 'admin', 'developer')
    );

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_users_year_group ON users(year_group);
CREATE INDEX IF NOT EXISTS idx_users_education_level ON users(education_level);
