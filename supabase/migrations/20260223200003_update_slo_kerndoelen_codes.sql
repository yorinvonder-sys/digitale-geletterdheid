-- Data migratie: de SLO codes in de codebase worden geupdatet
-- De database bevat slechts verwijzingen via mission_id, niet via SLO codes direct
-- Dus er is geen data migratie nodig in de database zelf
-- De SLO code update is een frontend-only wijziging

-- Wel toevoegen: check constraint op education_level
ALTER TABLE users ADD CONSTRAINT chk_education_level
    CHECK (education_level IS NULL OR education_level IN ('mavo', 'havo', 'vwo'));

-- Check constraint op year_group
ALTER TABLE users ADD CONSTRAINT chk_year_group
    CHECK (year_group IS NULL OR year_group BETWEEN 1 AND 3);
