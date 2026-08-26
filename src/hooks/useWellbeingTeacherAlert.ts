import { useCallback, useRef } from 'react';
import { supabase } from '@/services/supabase';
import { getCurrentUserId } from './useMissionAutoSave';
import type { WellbeingMatch } from './useWellbeingMonitor';

/**
 * Docentmelding bij een welzijnssignaal, hetzelfde vangnet als op de
 * chatroutes (useAgentLogic, useStudentAssistant, PromptMaster): alleen de
 * categorie en het tijdstip gaan mee, nooit de originele tekst van de
 * leerling. Zonder ingelogde leerling (dev-preview, anoniem) wordt er niets
 * verstuurd en staat `active` op false, zodat de hulplijn-overlay dan geen
 * docentmelding belooft die niet bestaat.
 */
export function useWellbeingTeacherAlert(): {
    active: boolean;
    onAlert: (match: WellbeingMatch) => void;
} {
    const studentId = useRef(getCurrentUserId()).current;
    const active = Boolean(studentId)
        && !((import.meta as any).env?.DEV === true && String(studentId).startsWith('dev-'));

    const onAlert = useCallback(async (match: WellbeingMatch) => {
        if (!active || !studentId) return;
        // Log alert naar Supabase voor docentnotificatie (zonder originele tekst — privacy)
        try {
            await supabase.rpc('log_wellbeing_alert' as any, {
                p_student_id: studentId,
                p_category: match.category,
                p_detected_at: match.timestamp,
            });
        } catch (err) {
            console.error('Wellbeing alert logging failed:', err);
        }
    }, [active, studentId]);

    return { active, onAlert };
}
