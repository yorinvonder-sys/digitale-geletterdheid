-- Flexible Scheduling: school_containers + school_container_missions
-- Allows schools to organize missions into custom containers (periods, project weeks, weekly lessons)
-- instead of the rigid 4-period structure.
-- Schools with scheduling_model = 'default' continue using the static CURRICULUM config.
-- Schools with scheduling_model = 'custom' read from these tables.

-- ============================================================
-- 1. school_containers
-- ============================================================
CREATE TABLE IF NOT EXISTS school_containers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id text NOT NULL,
    year_group smallint NOT NULL,
    sort_order smallint NOT NULL,
    label text NOT NULL,
    subtitle text,
    container_type text NOT NULL DEFAULT 'period',
    slo_focus text[] DEFAULT '{}',
    slo_focus_vso text[],
    color_key text,
    icon_key text,
    start_date date,
    end_date date,
    is_review_gate boolean DEFAULT false,
    assessment_id text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT fk_school_containers_school FOREIGN KEY (school_id) REFERENCES school_configs(school_id) ON DELETE CASCADE,
    CONSTRAINT uq_school_container_order UNIQUE (school_id, year_group, sort_order)
);

-- ============================================================
-- 2. school_container_missions
-- ============================================================
CREATE TABLE IF NOT EXISTS school_container_missions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    container_id uuid NOT NULL REFERENCES school_containers(id) ON DELETE CASCADE,
    mission_id text NOT NULL,
    sort_order smallint NOT NULL,
    is_review boolean DEFAULT false,
    is_required boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT uq_container_mission UNIQUE (container_id, mission_id)
);

-- ============================================================
-- 3. Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_school_containers_school_year
    ON school_containers(school_id, year_group);

CREATE INDEX IF NOT EXISTS idx_container_missions_container
    ON school_container_missions(container_id);

CREATE INDEX IF NOT EXISTS idx_container_missions_mission
    ON school_container_missions(mission_id);

-- ============================================================
-- 4. scheduling_model column on school_configs
-- ============================================================
ALTER TABLE school_configs ADD COLUMN IF NOT EXISTS scheduling_model text DEFAULT 'default';

-- ============================================================
-- 5. RLS
-- ============================================================
ALTER TABLE school_containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_container_missions ENABLE ROW LEVEL SECURITY;

-- school_containers: SELECT
CREATE POLICY "school_containers_select"
    ON school_containers
    FOR SELECT
    TO authenticated
    USING (
        school_id = (SELECT (auth.jwt()->'app_metadata'->>'schoolId'))
    );

-- school_containers: INSERT
CREATE POLICY "school_containers_insert"
    ON school_containers
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT (auth.jwt()->'app_metadata'->>'role')) IN ('admin', 'developer')
        AND school_id = (SELECT (auth.jwt()->'app_metadata'->>'schoolId'))
    );

-- school_containers: UPDATE
CREATE POLICY "school_containers_update"
    ON school_containers
    FOR UPDATE
    TO authenticated
    USING (
        (SELECT (auth.jwt()->'app_metadata'->>'role')) IN ('admin', 'developer')
        AND school_id = (SELECT (auth.jwt()->'app_metadata'->>'schoolId'))
    )
    WITH CHECK (
        (SELECT (auth.jwt()->'app_metadata'->>'role')) IN ('admin', 'developer')
        AND school_id = (SELECT (auth.jwt()->'app_metadata'->>'schoolId'))
    );

-- school_containers: DELETE
CREATE POLICY "school_containers_delete"
    ON school_containers
    FOR DELETE
    TO authenticated
    USING (
        (SELECT (auth.jwt()->'app_metadata'->>'role')) IN ('admin', 'developer')
        AND school_id = (SELECT (auth.jwt()->'app_metadata'->>'schoolId'))
    );

-- school_container_missions: SELECT
CREATE POLICY "container_missions_select"
    ON school_container_missions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM school_containers sc
            WHERE sc.id = container_id
              AND sc.school_id = (SELECT (auth.jwt()->'app_metadata'->>'schoolId'))
        )
    );

-- school_container_missions: INSERT
CREATE POLICY "container_missions_insert"
    ON school_container_missions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT (auth.jwt()->'app_metadata'->>'role')) IN ('admin', 'developer')
        AND EXISTS (
            SELECT 1 FROM school_containers sc
            WHERE sc.id = container_id
              AND sc.school_id = (SELECT (auth.jwt()->'app_metadata'->>'schoolId'))
        )
    );

-- school_container_missions: UPDATE
CREATE POLICY "container_missions_update"
    ON school_container_missions
    FOR UPDATE
    TO authenticated
    USING (
        (SELECT (auth.jwt()->'app_metadata'->>'role')) IN ('admin', 'developer')
        AND EXISTS (
            SELECT 1 FROM school_containers sc
            WHERE sc.id = container_id
              AND sc.school_id = (SELECT (auth.jwt()->'app_metadata'->>'schoolId'))
        )
    )
    WITH CHECK (
        (SELECT (auth.jwt()->'app_metadata'->>'role')) IN ('admin', 'developer')
        AND EXISTS (
            SELECT 1 FROM school_containers sc
            WHERE sc.id = container_id
              AND sc.school_id = (SELECT (auth.jwt()->'app_metadata'->>'schoolId'))
        )
    );

-- school_container_missions: DELETE
CREATE POLICY "container_missions_delete"
    ON school_container_missions
    FOR DELETE
    TO authenticated
    USING (
        (SELECT (auth.jwt()->'app_metadata'->>'role')) IN ('admin', 'developer')
        AND EXISTS (
            SELECT 1 FROM school_containers sc
            WHERE sc.id = container_id
              AND sc.school_id = (SELECT (auth.jwt()->'app_metadata'->>'schoolId'))
        )
    );

-- ============================================================
-- 6. updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
    CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON school_containers
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
