-- ===========================================================================
-- Audit Log Hardening — EU AI Act Art. 12 (Traceability)
--
-- Maakt audit_logs tamper-resistant:
-- 1. Append-only trigger (voorkomt UPDATE/DELETE)
-- 2. RLS policies (scoped lezen, eigen INSERT)
-- 3. Retentie-functie die trigger kan bypassen
-- ===========================================================================

-- ── 1. Append-only trigger ──────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs zijn onwijzigbaar (EU AI Act Art. 12)';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_logs_immutable
    BEFORE UPDATE OR DELETE ON public.audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION prevent_audit_log_mutation();

COMMENT ON TRIGGER audit_logs_immutable ON public.audit_logs IS
    'Voorkomt wijziging of verwijdering van audit logs. Vereist voor EU AI Act Art. 12 traceerbaarheid.';

-- ── 2. RLS policies ────────────────────────────────────────────────────────

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Studenten: alleen eigen audit logs lezen
CREATE POLICY "audit_logs_student_select_own"
    ON public.audit_logs FOR SELECT
    USING (uid = auth.uid());

-- Docenten/admins: eigen school audit logs lezen
CREATE POLICY "audit_logs_teacher_select_school"
    ON public.audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
              AND u.role IN ('teacher', 'admin', 'developer')
              AND (
                  audit_logs.school_id = u.school_id
                  OR audit_logs.uid = auth.uid()
              )
        )
    );

-- Alle geauthenticeerde gebruikers: eigen logs aanmaken
CREATE POLICY "audit_logs_insert_own"
    ON public.audit_logs FOR INSERT
    WITH CHECK (uid = auth.uid());

-- ── 3. Retentie-functie met trigger bypass ──────────────────────────────────
-- Vervangt de directe DELETE in de pg_cron job met een functie die
-- de immutable trigger tijdelijk uitschakelt.

CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    ALTER TABLE public.audit_logs DISABLE TRIGGER audit_logs_immutable;
    DELETE FROM public.audit_logs WHERE created_at < NOW() - INTERVAL '3 years';
    ALTER TABLE public.audit_logs ENABLE TRIGGER audit_logs_immutable;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION cleanup_old_audit_logs() IS
    'Ruimt audit logs ouder dan 3 jaar op. Bypassed de append-only trigger. Draait als SECURITY DEFINER.';

-- Update de bestaande pg_cron job om de functie aan te roepen i.p.v. directe DELETE
SELECT cron.unschedule('purge-audit-logs')
    WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-audit-logs');

SELECT cron.schedule(
    'purge-audit-logs',
    '30 4 * * 0',
    $$SELECT cleanup_old_audit_logs()$$
);
