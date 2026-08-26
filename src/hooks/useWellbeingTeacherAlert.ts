import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/services/supabase';
import { getCurrentUserId } from './useMissionAutoSave';
import type { WellbeingMatch } from './useWellbeingMonitor';

export type WellbeingTeacherAlertStatus = 'inactive' | 'pending' | 'sent' | 'failed';

/**
 * Docentmelding bij een welzijnssignaal, hetzelfde vangnet als op de
 * chatroutes (useAgentLogic, useStudentAssistant, PromptMaster): alleen de
 * categorie en het tijdstip gaan mee, nooit de originele tekst van de
 * leerling. `notified` wordt pas true nadat Supabase de melding aantoonbaar
 * heeft geregistreerd — een RPC-fout komt als `error`-veld terug, niet als
 * exception, dus beide paden worden gecontroleerd. Zo belooft de
 * hulplijn-overlay nooit een docentmelding die niet is aangekomen.
 */
export function useWellbeingTeacherAlert(studentIdOverride?: string | null): {
    status: WellbeingTeacherAlertStatus;
    /** true zodra de melding bevestigd bij Supabase is geregistreerd. */
    notified: boolean;
    onAlert: (match: WellbeingMatch) => void;
} {
    // Routes met een eigen leerling-id (chat) geven dat door; template-routes
    // vallen terug op het id uit de Supabase-sessie in localStorage.
    const fallbackId = useRef(getCurrentUserId()).current;
    const studentId = studentIdOverride !== undefined ? studentIdOverride : fallbackId;
    const active = Boolean(studentId)
        && studentId !== 'anonymous'
        && !((import.meta as any).env?.DEV === true && String(studentId).startsWith('dev-'));
    const [status, setStatus] = useState<WellbeingTeacherAlertStatus>('inactive');
    // Per categorie het tijdstip van de laatst BEVESTIGDE aflevering. Een nieuwe
    // treffer van dezelfde categorie binnen dit venster is aantoonbaar al bij de
    // docent gemeld; dan sturen we geen tweede RPC maar blijft 'sent' terecht
    // staan. Een ándere categorie krijgt wél een eigen melding.
    const confirmedAt = useRef<Record<string, number>>({});
    const DEDUP_WINDOW_MS = 60_000;
    // Staleness-guard: alleen het jongste verzoek mag de status nog zetten,
    // anders kan een traag, ouder RPC-resultaat een nieuwere status overschrijven.
    const requestSeq = useRef(0);

    const onAlert = useCallback(async (match: WellbeingMatch) => {
        if (!active || !studentId) return;
        const confirmed = confirmedAt.current[match.category];
        if (confirmed !== undefined && Date.now() - confirmed < DEDUP_WINDOW_MS) {
            setStatus('sent');
            return;
        }
        const requestId = ++requestSeq.current;
        setStatus('pending');
        // Log alert naar Supabase voor docentnotificatie (zonder originele tekst — privacy)
        try {
            const { error } = await supabase.rpc('log_wellbeing_alert' as any, {
                p_student_id: studentId,
                p_category: match.category,
                p_detected_at: match.timestamp,
            });
            if (error) throw error;
            confirmedAt.current[match.category] = Date.now();
            if (requestSeq.current === requestId) setStatus('sent');
        } catch (err) {
            console.error('Wellbeing alert logging failed:', err);
            if (requestSeq.current === requestId) setStatus('failed');
        }
    }, [active, studentId]);

    return { status, notified: status === 'sent', onAlert };
}
