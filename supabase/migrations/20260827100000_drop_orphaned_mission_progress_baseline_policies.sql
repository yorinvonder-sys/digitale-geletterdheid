-- ============================================================================
-- Verwijder verweesde baseline-policies op public.mission_progress
-- ----------------------------------------------------------------------------
-- Achtergrond: 20260220000000_schema_baseline.sql maakt vier policies met de
-- oude naamgeving (`mission_progress_*_own` / `*_own_or_teacher`).
-- 20260504170000_game_project_persistence.sql VERVANGT die door nieuw benoemde
-- policies (`mission_progress_owner_*`), maar dropt de oude namen NIET. Op een
-- verse database uit deze repo-migraties blijven dus BEIDE sets bestaan.
--
-- Waarom dat een probleem is: RLS combineert permissieve policies met OR. De
-- guard tegen AVG Art. 18-verwerkingsbeperking staat alleen op de nieuwe
-- `mission_progress_owner_insert` / `_owner_update`
-- (`AND NOT public.current_user_processing_restricted()`, toegevoegd in
-- 20260805104252_enforce_processing_restriction_in_rls.sql). De oude
-- `mission_progress_insert_own` / `_update_own` missen die guard, dus een
-- leerling met verwerkingsbeperking kan op een verse build tóch nieuwe
-- voortgang wegschrijven — de bescherming lekt weg.
--
-- Op PRODUCTIE bestaan de oude `_own`-policies niet (daar staan alleen de
-- `owner_*`-policies); dit is dus geen live gat, maar drift tussen productie en
-- de repo-migraties. Na deze migratie steunt mission_progress uitsluitend op de
-- `owner_*`-policies, zodat de Art. 18-guard niet meer via een guard-loze
-- duplicaat te omzeilen is. De vier gedropte policies zijn duplicaten of ruimere
-- varianten van de `owner_*`-set: `owner_select` == `select_own_or_teacher`,
-- `owner_delete` == `delete_own_or_teacher` op de repo-build, en `owner_insert`/
-- `owner_update` zijn juist STRENGER (zij dragen de Art. 18-guard). Er gaat dus
-- geen legitieme bevoegdheid verloren.
--
-- NB: dit reconcilieert niet elke `owner_*`-policy met productie. De
-- repo-`owner_delete` mist nog productie's strengere `status <> 'completed'`-
-- voorwaarde op de eigen-branch; die drift zit in `owner_delete` zelf, staat los
-- van deze migratie en valt buiten de scope hiervan.
--
-- DROP ... IF EXISTS maakt de migratie idempotent en een no-op op productie.
-- ============================================================================

DROP POLICY IF EXISTS "mission_progress_select_own_or_teacher" ON public.mission_progress;
DROP POLICY IF EXISTS "mission_progress_insert_own" ON public.mission_progress;
DROP POLICY IF EXISTS "mission_progress_update_own" ON public.mission_progress;
DROP POLICY IF EXISTS "mission_progress_delete_own_or_teacher" ON public.mission_progress;
