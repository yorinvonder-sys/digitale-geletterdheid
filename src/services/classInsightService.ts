// Klas-inzicht service
// Vraagt een AI-gegenereerde samenvatting aan van waar de klas vastloopt.
//
// Privacy: de edge function stuurt ALLEEN anonieme geaggregeerde tellingen naar Mistral.
// Geen namen, geen user-ids, geen PII verlaat de server richting de AI.

import { supabase } from './supabase';
import { logger } from '@/utils/logger';

export interface ClassInsightPoint {
    title: string;
    observation: string;
    suggestion: string;
}

export interface ClassInsight {
    points: ClassInsightPoint[];
    generatedAt: string;
    classScope: string;
    classSize: number;
    note?: string;
}

/**
 * Vraag een AI-samenvatting aan van de klassituatie.
 * @param studentClass - Optionele klas-filter (bv. "3A"). Zonder filter: hele school.
 */
export async function requestClassInsight(studentClass?: string): Promise<ClassInsight> {
    const { data, error } = await supabase.functions.invoke('getClassInsight', {
        body: studentClass ? { studentClass } : {},
    });

    if (error) {
        logger.error('[classInsightService] requestClassInsight error:', error);
        // supabase-js geeft bij non-2xx een generieke error; de echte NL-melding
        // (incl. MFA-hint) staat in de response-body op error.context.
        let serverMessage: string | undefined;
        const ctx = (error as { context?: unknown }).context;
        if (ctx instanceof Response) {
            try {
                const bodyJson = await ctx.clone().json();
                const parts = [
                    typeof bodyJson?.error === 'string' ? bodyJson.error : undefined,
                    typeof bodyJson?.note === 'string' ? bodyJson.note : undefined,
                ].filter(Boolean);
                if (parts.length > 0) serverMessage = parts.join(' ');
            } catch {
                // body niet leesbaar; val terug op generieke melding
            }
        }
        throw new Error(
            serverMessage
                || (error as { message?: string }).message
                || 'Kon geen klas-inzicht genereren. Probeer het later opnieuw.',
        );
    }

    if (!data || typeof data !== 'object') {
        throw new Error('Onverwachte respons van de server.');
    }

    return data as ClassInsight;
}
