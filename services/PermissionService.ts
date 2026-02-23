// Game permissions — localStorage cache + Supabase Realtime for live updates.

import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

const CACHE_KEY_PREFIX = 'game-permissions-cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(yearGroup?: number): string {
    return yearGroup ? `${CACHE_KEY_PREFIX}-y${yearGroup}` : CACHE_KEY_PREFIX;
}

export interface GamePermissions {
    enabled_games: string[];
    blocked_games: string[];
    custom_settings?: Record<string, any>;
    updated_at?: string;
}


function getCachedPermissions(yearGroup?: number): GamePermissions | null {
    try {
        const key = getCacheKey(yearGroup);
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { permissions, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_TTL) {
            localStorage.removeItem(key);
            return null;
        }

        return permissions;
    } catch {
        return null;
    }
}


function setCachedPermissions(permissions: GamePermissions, yearGroup?: number): void {
    try {
        localStorage.setItem(getCacheKey(yearGroup), JSON.stringify({
            permissions,
            timestamp: Date.now(),
        }));
    } catch {
        // localStorage might be full, ignore
    }
}

function invalidateCache(yearGroup?: number): void {
    localStorage.removeItem(getCacheKey(yearGroup));
}


export const getGamePermissions = async (schoolId?: string, yearGroup?: number): Promise<GamePermissions> => {
    const cached = getCachedPermissions(yearGroup);
    if (cached) return cached;

    try {
        let q = supabase
            .from('game_permissions')
            .select('*');

        if (schoolId) {
            q = q.eq('school_id', schoolId);
        } else {
            q = q.is('school_id', null);
        }

        if (yearGroup) {
            q = q.eq('year_group', yearGroup);
        }

        const { data, error } = await q.maybeSingle();

        if (error) throw error;

        const permissions: GamePermissions = data ? {
            enabled_games: (data.enabled_games as string[]) || [],
            blocked_games: (data.blocked_games as string[]) || [],
            custom_settings: (data.custom_settings as Record<string, any>) || {},
            updated_at: data.updated_at,
        } : {
            enabled_games: [],
            blocked_games: [],
            custom_settings: {},
        };

        setCachedPermissions(permissions, yearGroup);
        return permissions;
    } catch (error) {
        console.error('[Permissions] Failed to fetch:', error);
        return {
            enabled_games: [],
            blocked_games: [],
            custom_settings: {},
        };
    }
};


export const updateGamePermissions = async (
    permissions: Partial<GamePermissions>,
    schoolId?: string,
    yearGroup?: number
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('game_permissions')
            .upsert({
                school_id: schoolId || null,
                year_group: yearGroup || null,
                ...permissions,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'school_id' });

        if (error) throw error;

        invalidateCache(yearGroup);

        return true;
    } catch (error) {
        console.error('[Permissions] Failed to update:', error);
        return false;
    }
};


export const isGameEnabled = async (gameId: string, schoolId?: string): Promise<boolean> => {
    const permissions = await getGamePermissions(schoolId);
    if (permissions.blocked_games.includes(gameId)) return false;
    if (permissions.enabled_games.length === 0) return true; // empty = all allowed

    return permissions.enabled_games.includes(gameId);
};


export const subscribeToPermissions = (
    schoolId: string | undefined,
    onUpdate: (permissions: GamePermissions) => void,
    yearGroup?: number
): (() => void) => {
    getGamePermissions(schoolId, yearGroup).then(onUpdate).catch(console.error);

    const channel: RealtimeChannel = supabase
        .channel('game-permissions')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'game_permissions',
        }, () => {
            invalidateCache(yearGroup);
            getGamePermissions(schoolId, yearGroup).then(onUpdate).catch(console.error);
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

// Per-game record API — bridges TeacherGameToggle / GamesPanel to array storage.

export interface GamePermission {
    enabled: boolean;
    updatedAt?: string;
}


export const getPermissions = (): Record<string, GamePermission> => {
    const cached = getCachedPermissions();
    if (!cached) return {};
    return permissionsToRecord(cached);
};


export const getGamePermission = (gameId: string): GamePermission => {
    const all = getPermissions();
    return all[gameId] || { enabled: false };
};


export const setGamePermission = async (
    gameId: string,
    enabled: boolean,
    _teacherId?: string,
    schoolId?: string,
): Promise<boolean> => {
    const current = await getGamePermissions(schoolId);
    let enabledGames = [...(current.enabled_games || [])];

    if (enabled && !enabledGames.includes(gameId)) {
        enabledGames.push(gameId);
    } else if (!enabled) {
        enabledGames = enabledGames.filter(g => g !== gameId);
    }

    return updateGamePermissions({ enabled_games: enabledGames }, schoolId);
};


function permissionsToRecord(perms: GamePermissions): Record<string, GamePermission> {
    const record: Record<string, GamePermission> = {};
    for (const gameId of (perms.enabled_games || [])) {
        record[gameId] = { enabled: true, updatedAt: perms.updated_at };
    }
    return record;
}
