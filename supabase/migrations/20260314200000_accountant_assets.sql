-- ===========================================================================
-- Accountant Module: Bedrijfsmiddelen / Afschrijvingen
-- ===========================================================================
-- Slaat bedrijfsmiddelen op (laptop, bureau, software, etc.) en berekent
-- lineaire of degressieve afschrijving voor de IB-aangifte.
-- ===========================================================================

CREATE TABLE IF NOT EXISTS accountant_assets (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name                TEXT        NOT NULL,                          -- "MacBook Pro", "Bureau", "Software licentie"
    purchase_date       DATE        NOT NULL,
    purchase_price      NUMERIC(10,2) NOT NULL CHECK (purchase_price > 0),
    residual_value      NUMERIC(10,2) NOT NULL DEFAULT 0,             -- Restwaarde
    useful_life_years   INT         NOT NULL CHECK (useful_life_years > 0),
    depreciation_method TEXT        NOT NULL DEFAULT 'linear'
                                    CHECK (depreciation_method IN ('linear', 'declining')),
    category            TEXT        NOT NULL
                                    CHECK (category IN ('computer', 'meubilair', 'software', 'vervoer', 'overig')),
    notes               TEXT,
    is_disposed         BOOLEAN     NOT NULL DEFAULT FALSE,           -- Afgestoten?
    disposal_date       DATE,
    disposal_amount     NUMERIC(10,2),                                -- Verkoopprijs bij afstoten
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE accountant_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "accountant_assets_select_own" ON accountant_assets;
CREATE POLICY "accountant_assets_select_own"
    ON accountant_assets FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_assets_insert_own" ON accountant_assets;
CREATE POLICY "accountant_assets_insert_own"
    ON accountant_assets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_assets_update_own" ON accountant_assets;
CREATE POLICY "accountant_assets_update_own"
    ON accountant_assets FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_assets_delete_own" ON accountant_assets;
CREATE POLICY "accountant_assets_delete_own"
    ON accountant_assets FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_accountant_assets_user
    ON accountant_assets (user_id, is_disposed);
