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
export function useWellbeingTeacherAlert(): {
    status: WellbeingTeacherAlertStatus;
    /** true zodra de melding bevestigd bij Supabase is geregistreerd. */
    notified: boolean;
    onAlert: (match: WellbeingMatch) => void;
} {
    const studentId = useRef(getCurrentUserId()).current;
    const active = Boolean(studentId)
        && !((import.meta as any).env?.DEV === true && String(studentId).startsWith('dev-'));
    const [status, setStatus] = useState<WellbeingTeacherAlertStatus>('inactive');

    const onAlert = useCallback(async (match: WellbeingMatch) => {
        if (!active || !studentId) return;
        setStatus('pending');
        // Log alert naar Supabase voor docentnotificatie (zonder originele tekst — privacy)
        try {
            const { error } = await supabase.rpc('log_wellbeing_alert' as any, {
                p_student_id: studentId,
                p_category: match.category,
                p_detected_at: match.timestamp,
            });
            if (error) throw error;
            setStatus('sent');
        } catch (err) {
            console.error('Wellbeing alert logging failed:', err);
            setStatus('failed');
        }
    }, [active, studentId]);

    return { status, notified: status === 'sent', onAlert };
}
