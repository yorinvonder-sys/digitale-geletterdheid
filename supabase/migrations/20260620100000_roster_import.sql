-- ============================================================================
-- Roster-import ondersteuning
-- ----------------------------------------------------------------------------
-- Voor de automatische account-aanmaak vanuit een Magister-roster-export
-- (edge function importRoster). Voegt de geboortedatum toe (gedeeld met de
-- 13+ AI-leeftijdspoort) en een index voor idempotente lookups per school.
--
-- `date_of_birth` met IF NOT EXISTS zodat deze migratie volgorde-onafhankelijk
-- is t.o.v. de age-gate-migratie (20260620000000_ai_age_gate_13plus.sql).
-- ============================================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS date_of_birth date;

COMMENT ON COLUMN public.users.date_of_birth IS
  'Geboortedatum leerling — voor de 13+ AI-leeftijdspoort en leeftijd-afhankelijke permissies. Server-side gebruikt; niet naar client/AI in de applicatie sturen.';

-- Idempotente roster-import: snelle lookup op e-mail (de auth-identiteit) zodat
-- her-imports bestaande leerlingen updaten i.p.v. dupliceren, en zodat een e-mail
-- die al bij een andere school hoort geweigerd kan worden (geen account-kaping).
CREATE INDEX IF NOT EXISTS users_email_idx
  ON public.users(email);
