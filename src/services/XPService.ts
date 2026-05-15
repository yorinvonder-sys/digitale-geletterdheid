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
): Promise<{ awarded: boolean; newXP?: number; newLevel?: number; reason?: string }> => {
    try {
        const { data, error } = await supabase.rpc('award_xp', {
            p_user_id: userId,
            p_amount: amount,
            p_source: source,
            p_mission_id: missionId || null,
        });

        if (error) {
            console.error('[XP] RPC award_xp error:', error);
            return { awarded: false, reason: 'Fout bij XP toekenning' };
        }

        const result = data as Record<string, any> || {};
        return {
            awarded: !!result.awarded,
            newXP: result.newXP ?? result.newxp,
            newLevel: result.newLevel ?? result.newlevel,
            reason: result.reason,
        };
    } catch (error) {
        console.error('Error awarding XP:', error);
        return { awarded: false, reason: 'Fout bij XP toekenning' };
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
