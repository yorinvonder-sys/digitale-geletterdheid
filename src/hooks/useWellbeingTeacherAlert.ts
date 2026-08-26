import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/services/supabase';
import { getCurrentUserId } from './useMissionAutoSave';
import type { WellbeingMatch } from './useWellbeingMonitor';
import { createWellbeingAlertDelivery } from './wellbeingAlertDelivery';

/**
 * Docentmelding bij een welzijnssignaal, hetzelfde vangnet als op de
 * chatroutes: alleen de categorie en het tijdstip gaan mee, nooit de
 * originele tekst van de leerling. `notifiedFor(categorie)` is pas true nadat
 * Supabase een melding voor précies die categorie bevestigd heeft
 * geregistreerd (een RPC-fout komt als `error`-veld terug, niet als
 * exception, dus beide paden worden gecontroleerd). Het concurrency- en
 * foutgedrag (één verzoek per categorie, seriële vervolgpoging bij een
 * gefaald verzoek met wachtende treffer) staat in wellbeingAlertDelivery.ts
 * en wordt daar met contracttests bewezen.
 */
export function useWellbeingTeacherAlert(studentIdOverride?: string | null): {
    /** true wanneer voor déze categorie een aflevering bevestigd is (binnen het dedup-venster). */
    notifiedFor: (category: WellbeingMatch['category'] | undefined) => boolean;
    onAlert: (match: WellbeingMatch) => void;
} {
    // Routes met een eigen leerling-id (chat) geven dat door; template-routes
    // vallen terug op het id uit de Supabase-sessie in localStorage.
    const fallbackId = useRef(getCurrentUserId()).current;
    const studentId = studentIdOverride !== undefined ? studentIdOverride : fallbackId;
    const active = Boolean(studentId)
        && studentId !== 'anonymous'
        && !((import.meta as any).env?.DEV === true && String(studentId).startsWith('dev-'));

    // Teller als state zodat de overlay her-rendert zodra een aflevering bevestigt.
    const [, bumpConfirmed] = useState(0);
    const deliveryRef = useRef<ReturnType<typeof createWellbeingAlertDelivery> | null>(null);
    if (!deliveryRef.current) {
        deliveryRef.current = createWellbeingAlertDelivery({
            // Log alert naar Supabase voor docentnotificatie (zonder originele tekst — privacy)
            send: async (category, timestamp) => {
                try {
                    const { error } = await supabase.rpc('log_wellbeing_alert' as any, {
                        p_student_id: studentId,
                        p_category: category,
                        p_detected_at: timestamp,
                    });
                    if (error) throw error;
                } catch (err) {
                    console.error('Wellbeing alert logging failed:', err);
                    throw err;
                }
            },
            onConfirmed: () => bumpConfirmed((n) => n + 1),
        });
    }
    const delivery = deliveryRef.current;

    const onAlert = useCallback((match: WellbeingMatch) => {
        if (!active || !studentId) return;
        delivery.deliver(match.category, match.timestamp).catch((err) => {
            console.error('Wellbeing alert logging failed:', err);
        });
    }, [active, studentId, delivery]);

    return { notifiedFor: delivery.notifiedFor, onAlert };
}
