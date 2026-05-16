-- Tighten legacy shared_games policies that predate school-scoped publishing.
-- The replacement policies are created in 20260504170000_game_project_persistence.sql.
DROP POLICY IF EXISTS "shared_games_select" ON public.shared_games;
DROP POLICY IF EXISTS "shared_games_insert" ON public.shared_games;
DROP POLICY IF EXISTS "shared_games_update" ON public.shared_games;
DROP POLICY IF EXISTS "shared_games_delete" ON public.shared_games;
