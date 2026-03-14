-- ===========================================================================
-- Accountant Module: Abonnementen / Terugkerende Kosten
-- ===========================================================================
-- Slaat terugkerende kosten op (Claude, hosting, Vercel, etc.)
-- Transacties worden automatisch gegenereerd op basis van frequentie.
-- ===========================================================================

CREATE TABLE IF NOT EXISTS accountant_subscriptions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name            TEXT        NOT NULL,                          -- "Claude Pro", "Vercel Pro"
    supplier        TEXT,                                          -- Leverancier
    amount          NUMERIC(10,2) NOT NULL CHECK (amount > 0),    -- Bedrag per periode (excl. BTW)
    vat_amount      NUMERIC(10,2) NOT NULL DEFAULT 0,             -- BTW-bedrag per periode
    vat_rate        INT         NOT NULL DEFAULT 21
                                CHECK (vat_rate IN (0, 9, 21)),
    category        TEXT        NOT NULL DEFAULT 'automatisering',
    frequency       TEXT        NOT NULL DEFAULT 'monthly'
                                CHECK (frequency IN ('monthly', 'quarterly', 'yearly')),
    start_date      DATE        NOT NULL,                          -- Eerste betaaldag
    end_date        DATE,                                          -- NULL = doorlopend
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    last_generated  DATE,                                          -- Laatst gegenereerde transactiedatum
    notes           TEXT,                                          -- Extra notities
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE accountant_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "accountant_subscriptions_select_own" ON accountant_subscriptions;
CREATE POLICY "accountant_subscriptions_select_own"
    ON accountant_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_subscriptions_insert_own" ON accountant_subscriptions;
CREATE POLICY "accountant_subscriptions_insert_own"
    ON accountant_subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_subscriptions_update_own" ON accountant_subscriptions;
CREATE POLICY "accountant_subscriptions_update_own"
    ON accountant_subscriptions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_subscriptions_delete_own" ON accountant_subscriptions;
CREATE POLICY "accountant_subscriptions_delete_own"
    ON accountant_subscriptions FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_accountant_subscriptions_user
    ON accountant_subscriptions (user_id, is_active);
