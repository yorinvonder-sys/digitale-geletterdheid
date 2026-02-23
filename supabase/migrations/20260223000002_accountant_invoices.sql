-- ============================================================================
-- Facturen module voor ZZP boekhoudapp
-- ============================================================================

-- Facturen tabel
CREATE TABLE IF NOT EXISTS accountant_invoices (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_number   TEXT        NOT NULL,
    client_name      TEXT        NOT NULL,
    client_address   TEXT,
    client_vat_number TEXT,
    client_email     TEXT,
    issue_date       DATE        NOT NULL DEFAULT CURRENT_DATE,
    due_date         DATE,
    status           TEXT        NOT NULL DEFAULT 'concept'
                                 CHECK (status IN ('concept','verzonden','betaald','vervallen')),
    subtotal         NUMERIC(10,2) NOT NULL DEFAULT 0,
    vat_amount       NUMERIC(10,2) NOT NULL DEFAULT 0,
    total            NUMERIC(10,2) NOT NULL DEFAULT 0,
    notes            TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Factuurregels tabel
CREATE TABLE IF NOT EXISTS accountant_invoice_lines (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id   UUID          NOT NULL REFERENCES accountant_invoices(id) ON DELETE CASCADE,
    description  TEXT          NOT NULL,
    quantity     NUMERIC(10,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price   NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    vat_rate     INT           NOT NULL DEFAULT 21 CHECK (vat_rate IN (0, 9, 21)),
    vat_amount   NUMERIC(10,2) NOT NULL DEFAULT 0,
    line_total   NUMERIC(10,2) NOT NULL DEFAULT 0,
    sort_order   INT           NOT NULL DEFAULT 0
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS accountant_invoices_user_date_idx
    ON accountant_invoices (user_id, issue_date DESC);

CREATE INDEX IF NOT EXISTS accountant_invoice_lines_invoice_id_idx
    ON accountant_invoice_lines (invoice_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE accountant_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountant_invoice_lines ENABLE ROW LEVEL SECURITY;

-- Policies voor accountant_invoices
CREATE POLICY "accountant_invoices_select_own"
    ON accountant_invoices FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "accountant_invoices_insert_own"
    ON accountant_invoices FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "accountant_invoices_update_own"
    ON accountant_invoices FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "accountant_invoices_delete_own"
    ON accountant_invoices FOR DELETE
    USING (auth.uid() = user_id);

-- Policies voor accountant_invoice_lines (via invoice_id van eigen gebruiker)
CREATE POLICY "accountant_invoice_lines_select_own"
    ON accountant_invoice_lines FOR SELECT
    USING (invoice_id IN (
        SELECT id FROM accountant_invoices WHERE user_id = auth.uid()
    ));

CREATE POLICY "accountant_invoice_lines_insert_own"
    ON accountant_invoice_lines FOR INSERT
    WITH CHECK (invoice_id IN (
        SELECT id FROM accountant_invoices WHERE user_id = auth.uid()
    ));

CREATE POLICY "accountant_invoice_lines_update_own"
    ON accountant_invoice_lines FOR UPDATE
    USING (invoice_id IN (
        SELECT id FROM accountant_invoices WHERE user_id = auth.uid()
    ));

CREATE POLICY "accountant_invoice_lines_delete_own"
    ON accountant_invoice_lines FOR DELETE
    USING (invoice_id IN (
        SELECT id FROM accountant_invoices WHERE user_id = auth.uid()
    ));

-- ============================================================================
-- PostgreSQL functie: volgend factuurnummer
-- ============================================================================

CREATE OR REPLACE FUNCTION get_next_invoice_number(p_user_id UUID, p_year INT)
RETURNS TEXT AS $$
DECLARE
    last_num INT;
BEGIN
    SELECT COALESCE(MAX(CAST(SPLIT_PART(invoice_number, '-', 2) AS INT)), 0)
    INTO last_num
    FROM accountant_invoices
    WHERE user_id = p_user_id
      AND invoice_number LIKE p_year || '-%';
    RETURN p_year || '-' || LPAD((last_num + 1)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
