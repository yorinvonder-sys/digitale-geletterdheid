-- ============================================================================
-- Fix audit log cleanup timestamp column
-- ============================================================================
-- Remote lint signaleert dat public.audit_logs geen created_at-kolom heeft.
-- De tabel gebruikt timestamp; deze functie houdt de bestaande retentiebedoeling
-- intact zonder de append-only trigger voor normale gebruikers te verzwakken.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    ALTER TABLE public.audit_logs DISABLE TRIGGER audit_logs_immutable;
    DELETE FROM public.audit_logs WHERE "timestamp" < NOW() - INTERVAL '3 years';
    ALTER TABLE public.audit_logs ENABLE TRIGGER audit_logs_immutable;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
COMMENT ON FUNCTION public.cleanup_old_audit_logs() IS
    'Ruimt audit logs ouder dan 3 jaar op via de timestamp-kolom. Bypassed tijdelijk de append-only trigger voor retentie.';
