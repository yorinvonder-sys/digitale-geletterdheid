// XP awarding, level calculation, and transaction history.
// Security: Uses server-side RPC for atomic XP awards with built-in rate limiting.

import { supabase } from './supabase';

/**
 * Award XP to a user via server-side RPC.
 *
 * The `award_xp` PostgreSQL function enforces:
 * - auth.uid() == target user (no awarding XP to others)
 * - Per-action cap: max 25 XP
 * - Per-minute rate limit: max 5 awards
 * - Daily cap: max 200 XP
 * - FOR UPDATE row lock (prevents TOCTOU races)
 * - Atomic xp_transactions insert (bypasses client RLS block)
 */
export const awardXP = async (
    userId: string,
    amount: number,
    source: string,
    missionId?: string
): Promise<{ awarded: boolean; awardedAmount?: number; newXP?: number; newLevel?: number; reason?: string }> => {
    try {
        const { data, error } = await supabase.rpc('award_xp', {
            p_user_id: userId,
            p_amount: amount,
            p_source: source,
            p_mission_id: missionId ?? undefined,
        });

        if (error) {
            console.error('[XP] RPC award_xp error:', error);
            return { awarded: false, reason: 'Fout bij XP toekenning' };
        }

        const result = data as Record<string, any> || {};
        return {
            awarded: !!result.awarded,
            awardedAmount: result.awardedAmount ?? result.awarded_amount,
            newXP: result.newXP ?? result.newxp,
            newLevel: result.newLevel ?? result.newlevel,
            reason: result.reason,
        };
    } catch (error) {
        console.error('Error awarding XP:', error);
        return { awarded: false, reason: 'Fout bij XP toekenning' };
    }
};

/**
 * Spend XP via server-side RPC.
 *
 * XP is never deducted from stats.xp — that value is lifetime earned XP and
 * drives level, badges and the leaderboard. Spending is recorded in a separate
 * ledger; the spendable balance is stats.xp minus everything spent.
 *
 * The `spend_xp` PostgreSQL function enforces:
 * - the spender is always auth.uid() (no spending on someone else's behalf)
 * - sufficient balance, checked under a FOR UPDATE row lock (no double-spend)
 * - append-only ledger insert (clients have no write access to the table)
 */
export const spendXP = async (
    amount: number,
    reason: string,
    refId?: string
): Promise<{ spent: boolean; balance?: number; reason?: string }> => {
    try {
        const { data, error } = await supabase.rpc('spend_xp', {
            p_amount: amount,
            p_reason: reason,
            p_ref_id: refId ?? undefined,
        });

        if (error) {
            console.error('[XP] RPC spend_xp error:', error);
            return { spent: false, reason: 'Fout bij XP afschrijving' };
        }

        const result = (data as Record<string, any>) || {};
        return {
            spent: !!result.spent,
            balance: result.balance,
            reason: result.reason,
        };
    } catch (error) {
        console.error('Error spending XP:', error);
        return { spent: false, reason: 'Fout bij XP afschrijving' };
    }
};

/**
 * Spendable XP balance: lifetime earned XP minus everything spent.
 */
export const getXPBalance = async (): Promise<{ earned: number; spent: number; balance: number }> => {
    try {
        const { data, error } = await supabase.rpc('get_xp_balance');

        if (error) throw error;

        const result = (data as Record<string, any>) || {};
        return {
            earned: result.earned ?? 0,
            spent: result.spent ?? 0,
            balance: result.balance ?? 0,
        };
    } catch (error) {
        console.error('Error getting XP balance:', error);
        return { earned: 0, spent: 0, balance: 0 };
    }
};

export const getXPHistory = async (userId: string, limit = 20): Promise<any[]> => {
    try {
        const { data, error } = await supabase
            .from('xp_transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error getting XP history:', error);
        return [];
    }
};

export const getUserXP = async (userId: string): Promise<{ xp: number; level: number }> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('stats')
            .eq('id', userId)
            .single();

        if (error) throw error;
        const stats = (data?.stats as any) || {};
        return {
            xp: stats.xp || 0,
            level: stats.level || 1,
        };
    } catch (error) {
        console.error('Error getting user XP:', error);
        return { xp: 0, level: 1 };
    }
};
