-- Pilot aanvragen opslag
-- Formulierinzendingen van dgskills.app/scholen#gratis-pilot

-- Drop oude versie (had afwijkend schema)
DROP TABLE IF EXISTS pilot_requests CASCADE;

CREATE TABLE pilot_requests (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_naam   TEXT NOT NULL,
  contact_persoon TEXT NOT NULL,
  email         TEXT NOT NULL,
  rol           TEXT,
  bericht       TEXT,
  aantal_leerlingen TEXT,
  ip_address    TEXT,
  status        TEXT DEFAULT 'nieuw' CHECK (status IN ('nieuw', 'contact_gelegd', 'pilot_actief', 'afgerond', 'afgewezen')),
  notities      TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Index voor snel zoeken op status
CREATE INDEX idx_pilot_requests_status ON pilot_requests (status);
CREATE INDEX idx_pilot_requests_created ON pilot_requests (created_at DESC);

-- RLS: alleen service_role (edge function) kan inserten, admins/developers kunnen lezen
ALTER TABLE pilot_requests ENABLE ROW LEVEL SECURITY;

-- Edge functions gebruiken service_role key, dus geen RLS-policy nodig voor insert.
-- Lees-policy voor admins/developers via het dashboard:
CREATE POLICY "Admins and developers can read pilot requests"
  ON pilot_requests FOR SELECT
  USING (
    (current_setting('request.jwt.claims', true)::json->>'role') IN ('admin', 'developer')
    OR current_setting('role', true) = 'service_role'
  );

-- Service role kan alles (voor edge function insert + status updates):
CREATE POLICY "Service role full access"
  ON pilot_requests FOR ALL
  USING (current_setting('role', true) = 'service_role');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_pilot_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pilot_requests_updated_at
  BEFORE UPDATE ON pilot_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_pilot_requests_updated_at();

-- Data retention: pilot requests worden 3 jaar bewaard (AVG Art. 5(1)(e))
-- Opruiming via bestaande cron-infrastructuur indien nodig.
