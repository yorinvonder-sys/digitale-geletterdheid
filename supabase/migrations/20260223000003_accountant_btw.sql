-- Migratie: BTW-aangifte ondersteuning
-- Voegt zakelijk/privé markering en kilometerregistratie toe aan transacties

ALTER TABLE accountant_transactions ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE accountant_transactions ADD COLUMN IF NOT EXISTS km_distance NUMERIC(8,2);

CREATE INDEX IF NOT EXISTS idx_accountant_transactions_private ON accountant_transactions (user_id, is_private) WHERE is_private = FALSE;
