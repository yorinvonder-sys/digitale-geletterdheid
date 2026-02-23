import { supabase } from './supabase';

const challengeRateLimits: Map<string, number[]> = new Map();
const MAX_CHALLENGES_PER_MINUTE = 5;

export async function blockUser(blockerId: string, blockedId: string, blockedName: string, reason?: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('user_blocks')
            .insert({
                blocker_id: blockerId,
                blocked_id: blockedId,
                blocked_name: blockedName,
                reason: reason || null,
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('[Blocking] Failed to block user:', error);
        return false;
    }
}

export async function unblockUser(blockerId: string, blockedId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('user_blocks')
            .delete()
            .eq('blocker_id', blockerId)
            .eq('blocked_id', blockedId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('[Blocking] Failed to unblock user:', error);
        return false;
    }
}

export async function getBlockedUsers(blockerId: string): Promise<string[]> {
    try {
        const { data, error } = await supabase
            .from('user_blocks')
            .select('blocked_id')
            .eq('blocker_id', blockerId);

        if (error) throw error;
        return (data || []).map(row => row.blocked_id);
    } catch (error) {
        console.error('[Blocking] Failed to get blocked users:', error);
        return [];
    }
}

export async function isBlockedBy(userId: string, potentialBlockerId: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('user_blocks')
            .select('id')
            .eq('blocker_id', potentialBlockerId)
            .eq('blocked_id', userId)
            .maybeSingle();

        if (error) throw error;
        return !!data;
    } catch (error) {
        console.error('[Blocking] Failed to check block status:', error);
        return false;
    }
}

export async function hasBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    return isBlockedBy(blockedId, blockerId);
}

/** Rate-limits challenge sends per user (in-memory, resets on deploy). */
export function canSendChallenge(userId: string): boolean {
    const now = Date.now();
    const timestamps = challengeRateLimits.get(userId) || [];
    const recent = timestamps.filter(t => now - t < 60000);

    if (recent.length >= MAX_CHALLENGES_PER_MINUTE) {
        return false;
    }

    recent.push(now);
    challengeRateLimits.set(userId, recent);
    return true;
}

export async function getBlockRecords(blockerId: string): Promise<Array<{
    blockedId: string;
    blockedName: string;
    reason?: string;
    createdAt: string;
}>> {
    try {
        const { data, error } = await supabase
            .from('user_blocks')
            .select('blocked_id, blocked_name, reason, created_at')
            .eq('blocker_id', blockerId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(row => ({
            blockedId: row.blocked_id,
            blockedName: row.blocked_name,
            reason: row.reason,
            createdAt: row.created_at,
        }));
    } catch (error) {
        console.error('[Blocking] Failed to get block records:', error);
        return [];
    }
}
