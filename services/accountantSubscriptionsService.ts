/**
 * Accountant Subscriptions Service — Terugkerende kosten
 *
 * Beheert abonnementen (Claude, Vercel, hosting, etc.) en genereert
 * automatisch transacties op basis van frequentie.
 */

import { supabase } from './supabase';
import { TransactionCategory, createTransaction } from './accountantService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ===========================================================================
// Types
// ===========================================================================

export type SubscriptionFrequency = 'monthly' | 'quarterly' | 'yearly';

export const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
    monthly:   'Maandelijks',
    quarterly: 'Per kwartaal',
    yearly:    'Jaarlijks',
};

export interface Subscription {
    id?: string;
    user_id: string;
    name: string;
    supplier?: string;
    amount: number;
    vat_amount: number;
    vat_rate: 0 | 9 | 21;
    category: TransactionCategory;
    frequency: SubscriptionFrequency;
    start_date: string;       // YYYY-MM-DD
    end_date?: string | null;
    is_active: boolean;
    last_generated?: string | null;
    notes?: string;
    created_at?: string;
}

// ===========================================================================
// CRUD
// ===========================================================================

export async function getSubscriptions(userId: string): Promise<Subscription[]> {
    const { data, error } = await db
        .from('accountant_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('is_active', { ascending: false })
        .order('name', { ascending: true });

    if (error) throw new Error(`Abonnementen ophalen mislukt: ${error.message}`);
    return (data || []) as Subscription[];
}

export async function createSubscription(
    sub: Omit<Subscription, 'id' | 'created_at' | 'last_generated'>
): Promise<Subscription> {
    const { data, error } = await db
        .from('accountant_subscriptions')
        .insert(sub)
        .select()
        .single();

    if (error) throw new Error(`Abonnement aanmaken mislukt: ${error.message}`);
    return data as Subscription;
}

export async function updateSubscription(
    id: string,
    updates: Partial<Subscription>
): Promise<void> {
    const { error } = await db
        .from('accountant_subscriptions')
        .update(updates)
        .eq('id', id);

    if (error) throw new Error(`Abonnement bijwerken mislukt: ${error.message}`);
}

export async function deleteSubscription(id: string): Promise<void> {
    const { error } = await db
        .from('accountant_subscriptions')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Abonnement verwijderen mislukt: ${error.message}`);
}

// ===========================================================================
// Auto-generatie van transacties
// ===========================================================================

/**
 * Berekent de volgende betaaldatum op basis van frequentie.
 */
function addInterval(date: Date, frequency: SubscriptionFrequency): Date {
    const next = new Date(date);
    switch (frequency) {
        case 'monthly':   next.setMonth(next.getMonth() + 1); break;
        case 'quarterly': next.setMonth(next.getMonth() + 3); break;
        case 'yearly':    next.setFullYear(next.getFullYear() + 1); break;
    }
    return next;
}

function toISO(d: Date): string {
    return d.toISOString().split('T')[0];
}

/**
 * Genereert ontbrekende transacties voor alle actieve abonnementen.
 * Wordt aangeroepen bij het laden van het dashboard.
 *
 * Logica:
 * - Voor elk actief abonnement: bereken alle betaaldata vanaf start_date
 *   (of last_generated) tot vandaag.
 * - Maak een transactie aan voor elke gemiste datum.
 * - Update last_generated naar de laatst gegenereerde datum.
 *
 * Retourneert het aantal aangemaakte transacties.
 */
export async function generateMissingTransactions(userId: string): Promise<number> {
    const subs = await getSubscriptions(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let totalCreated = 0;

    for (const sub of subs) {
        if (!sub.is_active || !sub.id) continue;

        // Bepaal startpunt: last_generated + interval, of start_date
        let cursor: Date;
        if (sub.last_generated) {
            cursor = addInterval(new Date(sub.last_generated), sub.frequency);
        } else {
            cursor = new Date(sub.start_date);
        }

        // Einddatum check
        const endDate = sub.end_date ? new Date(sub.end_date) : null;

        let lastGenerated: string | null = null;

        while (cursor <= today) {
            if (endDate && cursor > endDate) break;

            // Maak transactie aan (negatief bedrag = uitgave)
            const totalAmount = sub.amount + sub.vat_amount;
            await createTransaction({
                user_id:     userId,
                date:        toISO(cursor),
                amount:      -totalAmount,
                description: `${sub.name}${sub.supplier ? ` — ${sub.supplier}` : ''} (abonnement)`,
                category:    sub.category,
                imported_from: 'manual',
            });

            lastGenerated = toISO(cursor);
            totalCreated++;

            cursor = addInterval(cursor, sub.frequency);
        }

        // Update last_generated als er transacties zijn aangemaakt
        if (lastGenerated) {
            await updateSubscription(sub.id, { last_generated: lastGenerated });
        }
    }

    return totalCreated;
}

// ===========================================================================
// Helpers
// ===========================================================================

/**
 * Berekent het maandelijkse totaal van alle actieve abonnementen.
 */
export function calculateMonthlyTotal(subs: Subscription[]): number {
    return subs
        .filter(s => s.is_active)
        .reduce((total, s) => {
            const fullAmount = s.amount + s.vat_amount;
            switch (s.frequency) {
                case 'monthly':   return total + fullAmount;
                case 'quarterly': return total + fullAmount / 3;
                case 'yearly':    return total + fullAmount / 12;
            }
        }, 0);
}

/**
 * Berekent het jaarlijkse totaal van alle actieve abonnementen.
 */
export function calculateYearlyTotal(subs: Subscription[]): number {
    return subs
        .filter(s => s.is_active)
        .reduce((total, s) => {
            const fullAmount = s.amount + s.vat_amount;
            switch (s.frequency) {
                case 'monthly':   return total + fullAmount * 12;
                case 'quarterly': return total + fullAmount * 4;
                case 'yearly':    return total + fullAmount;
            }
        }, 0);
}
