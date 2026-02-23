ALTER TABLE game_permissions ADD COLUMN IF NOT EXISTS year_group smallint DEFAULT 1;
CREATE INDEX IF NOT EXISTS idx_game_permissions_year ON game_permissions(school_id, year_group);
