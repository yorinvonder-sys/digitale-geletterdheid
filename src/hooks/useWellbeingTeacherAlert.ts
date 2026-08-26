import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/services/supabase';
import { getCurrentUserId } from './useMissionAutoSave';
import type { WellbeingMatch } from './useWellbeingMonitor';

/** Venster waarbinnen een bevestigde aflevering een nieuwe treffer van dezelfde categorie dekt. */
const DEDUP_WINDOW_MS = 60_000;

/**
 * Docentmelding bij een welzijnssignaal, hetzelfde vangnet als op de
 * chatroutes: alleen de categorie en het tijdstip gaan mee, nooit de
 * originele tekst van de leerling. De afleverstatus is per categorie:
 * `notifiedFor(categorie)` is pas true nadat Supabase een melding voor
 * précies die categorie bevestigd heeft geregistreerd (een RPC-fout komt als
 * `error`-veld terug, niet als exception, dus beide paden worden
 * gecontroleerd). Zo kan de hulplijn-overlay nooit een melding beloven die
 * niet is aangekomen, en kan een geslaagde melding voor categorie B nooit
 * doorgaan voor een aflevering van categorie A. Per categorie loopt maximaal
 * één verzoek tegelijk, zodat twee snelle treffers geen dubbele melding sturen.
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

    // Ref voor de logica (altijd actueel binnen async callbacks) + een teller
    // als state zodat de overlay her-rendert zodra een aflevering bevestigt.
    const confirmedAtRef = useRef<Record<string, number>>({});
    const [, bumpConfirmed] = useState(0);
    // Per categorie maximaal één RPC tegelijk.
    const pendingCategories = useRef<Set<string>>(new Set());

    const notifiedFor = useCallback((category: WellbeingMatch['category'] | undefined): boolean => {
        if (!category) return false;
        const confirmed = confirmedAtRef.current[category];
        return confirmed !== undefined && Date.now() - confirmed < DEDUP_WINDOW_MS;
    }, []);

    const onAlert = useCallback(async (match: WellbeingMatch) => {
        if (!active || !studentId) return;
        const category = match.category;
        const confirmed = confirmedAtRef.current[category];
        if (confirmed !== undefined && Date.now() - confirmed < DEDUP_WINDOW_MS) return;
        if (pendingCategories.current.has(category)) return;
        pendingCategories.current.add(category);
        // Log alert naar Supabase voor docentnotificatie (zonder originele tekst — privacy)
        try {
            const { error } = await supabase.rpc('log_wellbeing_alert' as any, {
                p_student_id: studentId,
                p_category: category,
                p_detected_at: match.timestamp,
            });
            if (error) throw error;
            confirmedAtRef.current[category] = Date.now();
            bumpConfirmed((n) => n + 1);
        } catch (err) {
            // Niets bevestigen bij falen: notifiedFor blijft false en de overlay
            // toont de eerlijke tekst zonder meldingsbelofte.
            console.error('Wellbeing alert logging failed:', err);
        } finally {
            pendingCategories.current.delete(category);
        }
    }, [active, studentId]);

    return { notifiedFor, onAlert };
}
