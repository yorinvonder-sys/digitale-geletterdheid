/**
 * Accountant Hours Service — Urenregistratie voor ZZP
 *
 * Biedt functies voor:
 * - CRUD-operaties op urenregistraties
 * - Berekening urencriterium (1.225 uur/jaar voor zelfstandigenaftrek)
 * - Aggregaties per maand en per opdrachtgever
 */

import { supabase } from './supabase';

// De accountant_hours tabel is nieuw en zit nog niet in de gegenereerde types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ===========================================================================
// Constanten
// ===========================================================================

/** Minimaal aantal uren per jaar voor zelfstandigenaftrek (€5.030 in 2025) */
export const URENCRITERIUM = 1225;

// ===========================================================================
// Types
// ===========================================================================

export interface HourEntry {
    id?: string;
    user_id: string;
    date: string;           // ISO datum: YYYY-MM-DD
    hours: number;          // Aantal uren (max 24, stap 0.5)
    description: string;    // Omschrijving van de werkzaamheden
    client?: string;        // Optioneel: opdrachtgever / project
    billable: boolean;      // Declarabel aan klant
    created_at?: string;
}

// ===========================================================================
// CRUD
// ===========================================================================

/**
 * Haal alle urenregistraties op voor een gebruiker in een bepaald jaar,
 * gesorteerd op datum aflopend (nieuwste eerst).
 */
export async function getHourEntries(userId: string, year: number): Promise<HourEntry[]> {
    const startDate = `${year}-01-01`;
    const endDate   = `${year}-12-31`;

    const { data, error } = await db
        .from('accountant_hours')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

    if (error) throw new Error(`Uren ophalen mislukt: ${error.message}`);
    return (data || []) as HourEntry[];
}

/**
 * Maak een nieuwe urenregistratie aan.
 */
export async function createHourEntry(
    entry: Omit<HourEntry, 'id' | 'created_at'>,
): Promise<HourEntry> {
    const { data, error } = await db
        .from('accountant_hours')
        .insert(entry)
        .select()
        .single();

    if (error) throw new Error(`Uren opslaan mislukt: ${error.message}`);
    return data as HourEntry;
}

/**
 * Werk een bestaande urenregistratie bij.
 */
export async function updateHourEntry(id: string, updates: Partial<HourEntry>): Promise<void> {
    const { error } = await db
        .from('accountant_hours')
        .update(updates)
        .eq('id', id);

    if (error) throw new Error(`Uren bijwerken mislukt: ${error.message}`);
}

/**
 * Verwijder een urenregistratie.
 */
export async function deleteHourEntry(id: string): Promise<void> {
    const { error } = await db
        .from('accountant_hours')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Uren verwijderen mislukt: ${error.message}`);
}

// ===========================================================================
// Aggregaties & berekeningen
// ===========================================================================

/**
 * Bereken het totaal aantal geregistreerde uren.
 */
export function getYearHoursTotal(entries: HourEntry[]): number {
    return entries.reduce((sum, e) => sum + e.hours, 0);
}

/**
 * Groepeer uren per kalendermaand (1–12).
 * Geeft altijd een array van 12 maanden terug, ook als er geen uren zijn.
 */
export function getHoursByMonth(entries: HourEntry[]): { month: number; hours: number }[] {
    const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, hours: 0 }));

    for (const entry of entries) {
        const monthIndex = parseInt(entry.date.split('-')[1]) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            months[monthIndex].hours += entry.hours;
        }
    }

    return months;
}

/**
 * Groepeer uren per opdrachtgever, gesorteerd op uren aflopend.
 * Uren zonder opdrachtgever worden gecombineerd onder "Overig".
 */
export function getHoursByClient(entries: HourEntry[]): { client: string; hours: number }[] {
    const map = new Map<string, number>();

    for (const entry of entries) {
        const client = entry.client?.trim() || 'Overig';
        map.set(client, (map.get(client) || 0) + entry.hours);
    }

    return Array.from(map.entries())
        .map(([client, hours]) => ({ client, hours }))
        .sort((a, b) => b.hours - a.hours);
}
