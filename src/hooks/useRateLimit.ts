import { useCallback, useRef } from 'react';

interface RateLimitOptions {
    /** Max number of actions allowed within the window */
    maxActions: number;
    /** Time window in milliseconds (default: 60000 = 1 minute) */
    windowMs?: number;
    /** Cooldown in ms after hitting the limit (default: 10000 = 10 seconds) */
    cooldownMs?: number;
}

interface RateLimitResult {
    /** Check if an action is allowed. Returns true if allowed, false if rate-limited. */
    checkLimit: () => boolean;
    /** Number of remaining actions in the current window */
    remaining: () => number;
    /** Whether the user is currently rate-limited */
    isLimited: () => boolean;
    /** Reset the rate limiter */
    reset: () => void;
}

/**
 * Generic client-side rate limiting hook.
 * 
 * Prevents spam on forms like:
 * - Teacher message sending
 * - Feedback submission  
 * - Library save actions
 * - Challenge sends in duel system
 * 
 * NOTE: This is a UX guard only — real rate limiting must also
 * happen server-side (Supabase RLS + Edge Functions).
 * 
 * @example
 * const { checkLimit, isLimited } = useRateLimit({ maxActions: 5, windowMs: 60000 });
 * 
 * const handleSubmit = () => {
 *   if (!checkLimit()) {
 *     toast.error('Te snel! Wacht even voor je opnieuw probeert.');
 *     return;
 *   }
 *   // ...submit form
 * };
 */
export function useRateLimit(options: RateLimitOptions): RateLimitResult {
    const { maxActions, windowMs = 60_000, cooldownMs = 10_000 } = options;

    const timestamps = useRef<number[]>([]);
    const cooldownUntil = useRef<number>(0);

    const pruneOld = useCallback(() => {
        const now = Date.now();
        timestamps.current = timestamps.current.filter(
            (ts) => now - ts < windowMs
        );
    }, [windowMs]);

    const checkLimit = useCallback((): boolean => {
        const now = Date.now();

        // Check cooldown first
        if (now < cooldownUntil.current) {
            return false;
        }

        pruneOld();

        if (timestamps.current.length >= maxActions) {
            // Activate cooldown
            cooldownUntil.current = now + cooldownMs;
            return false;
        }

        timestamps.current.push(now);
        return true;
    }, [maxActions, cooldownMs, pruneOld]);

    const remaining = useCallback((): number => {
        pruneOld();
        const now = Date.now();
        if (now < cooldownUntil.current) return 0;
        return Math.max(0, maxActions - timestamps.current.length);
    }, [maxActions, pruneOld]);

    const isLimited = useCallback((): boolean => {
        const now = Date.now();
        if (now < cooldownUntil.current) return true;
        pruneOld();
        return timestamps.current.length >= maxActions;
    }, [maxActions, pruneOld]);

    const reset = useCallback(() => {
        timestamps.current = [];
        cooldownUntil.current = 0;
    }, []);

    return { checkLimit, remaining, isLimited, reset };
}
