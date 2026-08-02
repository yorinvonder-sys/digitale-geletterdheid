// Aankopen in de avatar-winkel. De prijs wordt uitsluitend server-side
// opgezocht; deze module stuurt alleen een item-id mee.

import { supabase } from './supabase';

export type PurchaseCode =
    | 'PURCHASED'
    | 'ALREADY_OWNED'
    | 'INSUFFICIENT_XP'
    | 'ITEM_NOT_FOUND'
    | 'INVALID_ITEM_ID'
    | 'NOT_AUTHENTICATED'
    | 'PROFILE_NOT_FOUND'
    | 'RPC_ERROR';

export interface PurchaseResult {
    ok: boolean;
    code: PurchaseCode;
    itemId?: string;
    price?: number;
    /** Totaal ooit verdiend; wordt door een aankoop niet geraakt. */
    xp?: number;
    /** Som van alle uitgaven ná deze aankoop. */
    xpSpent?: number;
    /** Besteedbaar saldo ná deze aankoop. */
    balance?: number;
    /** Alleen bij INSUFFICIENT_XP: hoeveel er tekort is. */
    needed?: number;
    inventory?: string[];
}

/**
 * Koopt een item via de `purchase_avatar_item`-RPC.
 *
 * De functie vergrendelt de gebruikersrij, zoekt de prijs zelf op, weigert bij
 * te weinig saldo of bezit, legt het eigendom vast en geeft het gezaghebbende
 * saldo terug. De client rekent niets zelf uit — dat was precies de reden dat
 * aankopen eerder gratis bleken.
 */
export const purchaseAvatarItem = async (itemId: string): Promise<PurchaseResult> => {
    try {
        // De gegenereerde databasetypes kennen deze functie nog niet; de
        // migratie loopt vooruit op het regenereren van die types.
        const { data, error } = await (supabase.rpc as unknown as (
            fn: string,
            args: Record<string, unknown>
        ) => Promise<{ data: PurchaseResult | null; error: { message: string } | null }>)(
            'purchase_avatar_item',
            { p_item_id: itemId }
        );

        if (error || !data) {
            console.error('[avatarShop] aankoop mislukt:', error?.message);
            return { ok: false, code: 'RPC_ERROR' };
        }

        return data;
    } catch (err) {
        console.error('[avatarShop] onverwachte fout bij aankoop:', err);
        return { ok: false, code: 'RPC_ERROR' };
    }
};
