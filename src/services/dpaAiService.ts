/**
 * DPA AI Service — snel-invullen voor de DPA Generator
 *
 * Roept de /extractDpaSchoolData edge function aan, die met de slimste Mistral-AI
 * de school- en vertegenwoordigergegevens uit een geplakte tekst haalt.
 * De AI verzint niets: ontbrekende velden komen leeg ("") terug.
 *
 * GEEN opslag — puur een eenmalige extractie om het formulier voor te vullen.
 */

import { EDGE_FUNCTION_URL, authenticatedFetch } from './supabase';

/** De 7 school-zijde velden die de AI mag invullen (subset van DpaFormData). */
export interface DpaExtraction {
    schoolNaam: string;
    bezoekadres: string;
    postcodePlaats: string;
    kvkNummer: string;
    vertegenwoordigerNaam: string;
    vertegenwoordigerFunctie: string;
    vertegenwoordigerEmail: string;
}

/**
 * Haalt de schoolgegevens uit een geplakte tekst via de Mistral-edge-function.
 * @throws Error met een nette NL-melding als de call faalt.
 */
export async function extractDpaSchoolData(rawText: string): Promise<DpaExtraction> {
    const response = await authenticatedFetch(`${EDGE_FUNCTION_URL}/extractDpaSchoolData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rawText }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.message || `Invullen mislukt (status ${response.status}).`);
    }

    const data = await response.json();
    if (!data.result) throw new Error('Geen resultaat ontvangen van de AI.');
    return data.result as DpaExtraction;
}
