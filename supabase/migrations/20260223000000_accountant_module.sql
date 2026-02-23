-- ===========================================================================
-- Accountant Module voor ZZP/Freelancer
-- ===========================================================================
-- Tabellen:
--   1. accountant_receipts    — gescande/handmatige bonnetjes
--   2. accountant_transactions — alle financiële transacties
--   3. accountant_settings    — belastingjaar-instellingen per gebruiker
-- Storage:
--   - Bucket 'receipts' (private) voor bonnetje-afbeeldingen
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Supabase Storage bucket voor bonnetje-foto's (private)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'receipts',
    'receipts',
    false,
    10485760,   -- 10 MB per bestand
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- RLS voor storage: gebruikers mogen alleen eigen bestanden openen
DROP POLICY IF EXISTS "accountant_storage_insert_own" ON storage.objects;
CREATE POLICY "accountant_storage_insert_own"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'receipts'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "accountant_storage_select_own" ON storage.objects;
CREATE POLICY "accountant_storage_select_own"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'receipts'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "accountant_storage_delete_own" ON storage.objects;
CREATE POLICY "accountant_storage_delete_own"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'receipts'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ===========================================================================
-- 1. TABEL: accountant_receipts
-- ===========================================================================
-- Slaat bonnetjes op (gescand via AI of handmatig ingevoerd).
-- image_url verwijst naar Supabase Storage (receipts/{user_id}/{uuid}.jpg).
-- ===========================================================================

CREATE TABLE IF NOT EXISTS accountant_receipts (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url   TEXT,                                   -- Storage URL (optioneel bij handmatig)
    supplier    TEXT,                                   -- Leverancier/winkel
    date        DATE        NOT NULL,
    amount      NUMERIC(10,2) NOT NULL CHECK (amount > 0),  -- Totaalbedrag incl. BTW (altijd positief)
    vat_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,           -- BTW-bedrag
    vat_rate    INT         NOT NULL DEFAULT 21             -- BTW-percentage: 0, 9 of 21
                            CHECK (vat_rate IN (0, 9, 21)),
    description TEXT,                                   -- Omschrijving
    category    TEXT        NOT NULL DEFAULT 'overig',  -- ZZP-categorie
    ai_scanned  BOOLEAN     NOT NULL DEFAULT FALSE,     -- Gescand door Gemini Vision?
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE accountant_receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "accountant_receipts_select_own" ON accountant_receipts;
CREATE POLICY "accountant_receipts_select_own"
    ON accountant_receipts FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_receipts_insert_own" ON accountant_receipts;
CREATE POLICY "accountant_receipts_insert_own"
    ON accountant_receipts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_receipts_update_own" ON accountant_receipts;
CREATE POLICY "accountant_receipts_update_own"
    ON accountant_receipts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_receipts_delete_own" ON accountant_receipts;
CREATE POLICY "accountant_receipts_delete_own"
    ON accountant_receipts FOR DELETE
    USING (auth.uid() = user_id);

-- Index voor snel ophalen per gebruiker + datum
CREATE INDEX IF NOT EXISTS idx_accountant_receipts_user_date
    ON accountant_receipts (user_id, date DESC);

-- ===========================================================================
-- 2. TABEL: accountant_transactions
-- ===========================================================================
-- Bijhoudt alle financiële transacties.
-- Positief bedrag = inkomst, negatief bedrag = uitgave.
-- Kan gekoppeld zijn aan een bonnetje (receipt_id).
-- ===========================================================================

CREATE TABLE IF NOT EXISTS accountant_transactions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date            DATE        NOT NULL,
    amount          NUMERIC(10,2) NOT NULL,             -- + inkomst, - uitgave
    description     TEXT        NOT NULL,
    category        TEXT        NOT NULL DEFAULT 'overig',
    bank_reference  TEXT,                               -- Bankreferentie (bij CSV-import)
    imported_from   TEXT,                               -- 'ing' | 'rabobank' | 'abn' | 'manual'
    receipt_id      UUID        REFERENCES accountant_receipts(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE accountant_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "accountant_transactions_select_own" ON accountant_transactions;
CREATE POLICY "accountant_transactions_select_own"
    ON accountant_transactions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_transactions_insert_own" ON accountant_transactions;
CREATE POLICY "accountant_transactions_insert_own"
    ON accountant_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_transactions_update_own" ON accountant_transactions;
CREATE POLICY "accountant_transactions_update_own"
    ON accountant_transactions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_transactions_delete_own" ON accountant_transactions;
CREATE POLICY "accountant_transactions_delete_own"
    ON accountant_transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Index voor snel ophalen per gebruiker + jaar
CREATE INDEX IF NOT EXISTS idx_accountant_transactions_user_date
    ON accountant_transactions (user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_accountant_transactions_user_year
    ON accountant_transactions (user_id, EXTRACT(YEAR FROM date));

-- ===========================================================================
-- 3. TABEL: accountant_settings
-- ===========================================================================
-- Belastingjaar-instellingen per gebruiker (KvK, bedrijfsnaam, startersaftrek).
-- Één rij per gebruiker (UNIQUE op user_id).
-- ===========================================================================

CREATE TABLE IF NOT EXISTS accountant_settings (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    tax_year        INT         NOT NULL DEFAULT 2025,
    kvk_number      TEXT,
    business_name   TEXT,
    starter_aftrek  BOOLEAN     NOT NULL DEFAULT FALSE, -- Eerste 3 jaar ZZP
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE accountant_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "accountant_settings_select_own" ON accountant_settings;
CREATE POLICY "accountant_settings_select_own"
    ON accountant_settings FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_settings_insert_own" ON accountant_settings;
CREATE POLICY "accountant_settings_insert_own"
    ON accountant_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_settings_update_own" ON accountant_settings;
CREATE POLICY "accountant_settings_update_own"
    ON accountant_settings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "accountant_settings_delete_own" ON accountant_settings;
CREATE POLICY "accountant_settings_delete_own"
    ON accountant_settings FOR DELETE
    USING (auth.uid() = user_id);
