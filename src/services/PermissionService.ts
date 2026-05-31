// Game permissions — localStorage cache + Supabase Realtime for live updates.

import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

const CACHE_KEY_PREFIX = 'game-permissions-cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(schoolId?: string, yearGroup?: number): string {
    const scope = schoolId || 'global';
    return yearGroup ? `${CACHE_KEY_PREFIX}-${scope}-y${yearGroup}` : `${CACHE_KEY_PREFIX}-${scope}`;
}

export interface GamePermissions {
    enabled_games: string[];
    blocked_games: string[];
    custom_settings?: Record<string, any>;
    updated_at?: string;
}


function getCachedPermissions(schoolId?: string, yearGroup?: number): GamePermissions | null {
    try {
        const key = getCacheKey(schoolId, yearGroup);
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


function setCachedPermissions(permissions: GamePermissions, schoolId?: string, yearGroup?: number): void {
    try {
        localStorage.setItem(getCacheKey(schoolId, yearGroup), JSON.stringify({
            permissions,
            timestamp: Date.now(),
        }));
    } catch {
        // localStorage might be full, ignore
    }
}

function invalidateCache(schoolId?: string, yearGroup?: number): void {
    localStorage.removeItem(getCacheKey(schoolId, yearGroup));
}

function normalizeYearGroup(yearGroup?: number): number {
    return Number.isInteger(yearGroup) && yearGroup! >= 1 && yearGroup! <= 6 ? yearGroup! : 1;
}

function normalizeGameIds(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((gameId): gameId is string => (
        typeof gameId === 'string' && /^[a-z0-9][a-z0-9_-]{0,79}$/.test(gameId)
    )))].slice(0, 100);
}

function rowToPermissions(row: any): GamePermissions {
    const d = (row?.data as Record<string, any>) || {};
    return {
        enabled_games: normalizeGameIds(d.enabled_games),
        blocked_games: normalizeGameIds(d.blocked_games),
        custom_settings: d.custom_settings && typeof d.custom_settings === 'object' && !Array.isArray(d.custom_settings)
            ? d.custom_settings as Record<string, any>
            : {},
        updated_at: row?.updated_at,
    };
}


export const getGamePermissions = async (schoolId?: string, yearGroup?: number): Promise<GamePermissions> => {
    const normalizedYearGroup = normalizeYearGroup(yearGroup);
    const cached = getCachedPermissions(schoolId, normalizedYearGroup);
    if (cached) return cached;

    try {
        let row: any = null;
        if (schoolId) {
            const { data, error } = await supabase
                .from('game_permissions')
                .select('data, updated_at, school_id, year_group')
                .eq('school_id', schoolId)
                .eq('year_group', normalizedYearGroup)
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            row = data;
        }

        if (!row) {
            const { data, error } = await supabase
                .from('game_permissions')
                .select('data, updated_at, school_id, year_group')
                .is('school_id', null)
                .eq('year_group', normalizedYearGroup)
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            row = data;
        }

        const permissions: GamePermissions = row ? rowToPermissions(row) : {
            enabled_games: [],
            blocked_games: [],
            custom_settings: {},
        };

        setCachedPermissions(permissions, schoolId, normalizedYearGroup);
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
        const normalizedYearGroup = normalizeYearGroup(yearGroup);
        // Read current data first to merge
        const current = await getGamePermissions(schoolId, normalizedYearGroup);
        const mergedData = {
            enabled_games: normalizeGameIds(permissions.enabled_games ?? current.enabled_games),
            blocked_games: normalizeGameIds(permissions.blocked_games ?? current.blocked_games),
            custom_settings: permissions.custom_settings && typeof permissions.custom_settings === 'object'
                ? permissions.custom_settings
                : current.custom_settings ?? {},
        };

        const { error } = await (supabase as any).rpc('set_game_permissions', {
            p_school_id: schoolId || null,
            p_year_group: normalizedYearGroup,
            p_permissions: mergedData,
        });

        if (error) throw error;

        invalidateCache(schoolId, normalizedYearGroup);

        return true;
    } catch (error) {
        console.error('[Permissions] Failed to update:', error);
        return false;
    }
};


export const isGameEnabled = async (gameId: string, schoolId?: string, yearGroup?: number): Promise<boolean> => {
    const permissions = await getGamePermissions(schoolId, yearGroup);
    if (permissions.blocked_games.includes(gameId)) return false;
    if (permissions.enabled_games.length === 0) return true; // empty = all allowed

    return permissions.enabled_games.includes(gameId);
};


export const subscribeToPermissions = (
    schoolId: string | undefined,
    onUpdate: (permissions: GamePermissions) => void,
    yearGroup?: number
): (() => void) => {
    const normalizedYearGroup = normalizeYearGroup(yearGroup);
    getGamePermissions(schoolId, normalizedYearGroup).then(onUpdate).catch(console.error);

    const channel: RealtimeChannel = supabase
        .channel(`game-permissions-${schoolId || 'global'}-y${normalizedYearGroup}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'game_permissions',
        }, () => {
            invalidateCache(schoolId, normalizedYearGroup);
            getGamePermissions(schoolId, normalizedYearGroup).then(onUpdate).catch(console.error);
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
    yearGroup?: number,
): Promise<boolean> => {
    const current = await getGamePermissions(schoolId, yearGroup);
    let enabledGames = [...(current.enabled_games || [])];

    if (enabled && !enabledGames.includes(gameId)) {
        enabledGames.push(gameId);
    } else if (!enabled) {
        enabledGames = enabledGames.filter(g => g !== gameId);
    }

    return updateGamePermissions({ enabled_games: enabledGames }, schoolId, yearGroup);
};


function permissionsToRecord(perms: GamePermissions): Record<string, GamePermission> {
    const record: Record<string, GamePermission> = {};
    for (const gameId of (perms.enabled_games || [])) {
        record[gameId] = { enabled: true, updatedAt: perms.updated_at };
    }
    return record;
}
