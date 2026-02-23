// XP rate limiting and anti-farming detection.
// Uses in-memory cache (resets on deploy) + logs abuse to `xp_abuse_logs`.

import { supabase } from './supabase';

interface RateLimitEntry {
    timestamps: number[];
    totalXpLast24h: number;
    lastReset: number;
}

const rateLimitCache: Map<string, RateLimitEntry> = new Map();

const XP_DAILY_CAP = 200;
const XP_PER_MINUTE_CAP = 50;
const XP_PER_ACTION_MAX = 25;
const SUSPICIOUS_THRESHOLD = 3;
const RATE_WINDOW_MS = 60000;

export function checkXpRateLimit(userId: string, amount: number): {
    allowed: boolean;
    reason?: string;
    adjustedAmount?: number;
} {
    const now = Date.now();
    let entry = rateLimitCache.get(userId);

    // Reset after 24h
    if (!entry || now - entry.lastReset > 86400000) {
        entry = {
            timestamps: [],
            totalXpLast24h: 0,
            lastReset: now,
        };
        rateLimitCache.set(userId, entry);
    }

    entry.timestamps = entry.timestamps.filter(t => now - t < RATE_WINDOW_MS);

    if (amount > XP_PER_ACTION_MAX) {
        return {
            allowed: true,
            reason: 'amount_capped',
            adjustedAmount: XP_PER_ACTION_MAX,
        };
    }

    const recentXp = entry.timestamps.length;
    if (recentXp >= 10) {
        logSuspiciousActivity(userId, 'rate_limit_per_minute', {
            recentActions: recentXp,
            attemptedAmount: amount,
        });
        return {
            allowed: false,
            reason: 'Te veel XP verzoeken per minuut',
        };
    }

    if (entry.totalXpLast24h + amount > XP_DAILY_CAP) {
        const remaining = Math.max(0, XP_DAILY_CAP - entry.totalXpLast24h);
        if (remaining === 0) {
            return {
                allowed: false,
                reason: 'Dagelijks XP limiet bereikt',
            };
        }
        return {
            allowed: true,
            reason: 'daily_cap_partial',
            adjustedAmount: remaining,
        };
    }

    // Only push timestamp here — totalXpLast24h is updated in recordXpAward to avoid double-counting
    entry.timestamps.push(now);
    return { allowed: true };
}

export function recordXpAward(userId: string, amount: number): void {
    const entry = rateLimitCache.get(userId);
    if (entry) {
        entry.timestamps.push(Date.now());
        entry.totalXpLast24h += amount;
    }
}

async function logSuspiciousActivity(
    userId: string,
    activityType: string,
    details: Record<string, any>
): Promise<void> {
    try {
        await supabase.from('xp_abuse_logs').insert({
            user_id: userId,
            activity_type: activityType,
            details,
        });
    } catch (error) {
        console.error('[XPProtection] Failed to log suspicious activity:', error);
    }
}

export async function getXpAbuseSummary(userId: string): Promise<{
    totalViolations: number;
    recentViolations: number;
    isSuspicious: boolean;
}> {
    try {
        const { data, error } = await supabase
            .from('xp_abuse_logs')
            .select('id, created_at')
            .eq('user_id', userId);

        if (error) throw error;

        const totalViolations = data?.length || 0;
        const oneDayAgo = Date.now() - 86400000;
        const recentViolations = (data || []).filter(
            row => new Date(row.created_at).getTime() > oneDayAgo
        ).length;

        return {
            totalViolations,
            recentViolations,
            isSuspicious: recentViolations >= SUSPICIOUS_THRESHOLD,
        };
    } catch (error) {
        console.error('[XPProtection] Failed to get abuse summary:', error);
        return { totalViolations: 0, recentViolations: 0, isSuspicious: false };
    }
}

/** For development/testing only — no-op in production builds */
export function resetRateLimit(userId: string): void {
    if (!(import.meta as any).env?.DEV) return;
    rateLimitCache.delete(userId);
}
