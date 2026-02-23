import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
export interface BombermanLobby {
    id?: string;
    host_uid: string;
    host_name: string;
    school_id?: string;
    class_id?: string;
    players: BombermanPlayer[];
    status: 'waiting' | 'playing' | 'finished';
    max_players: number;
    settings: BombermanSettings;
    created_at?: string;
    updated_at?: string;
}

export interface BombermanPlayer {
    uid: string;
    name: string;
    ready: boolean;
    score: number;
    alive: boolean;
}

export interface BombermanSettings {
    map_size: 'small' | 'medium' | 'large';
    powerups_enabled: boolean;
    time_limit_seconds: number;
    lives: number;
}

// --- Lobby management ---
export const createLobby = async (lobby: Omit<BombermanLobby, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
    const { data, error } = await supabase
        .from('bomberman_lobbies')
        .insert(lobby)
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
};

export const getLobby = async (lobbyId: string): Promise<BombermanLobby | null> => {
    const { data, error } = await supabase
        .from('bomberman_lobbies')
        .select('*')
        .eq('id', lobbyId)
        .maybeSingle();

    if (error) throw error;
    return data as BombermanLobby | null;
};

export const updateLobby = async (lobbyId: string, updates: Partial<BombermanLobby>): Promise<void> => {
    const { error } = await supabase
        .from('bomberman_lobbies')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', lobbyId);

    if (error) throw error;
};

export const deleteLobby = async (lobbyId: string): Promise<void> => {
    const { error } = await supabase
        .from('bomberman_lobbies')
        .delete()
        .eq('id', lobbyId);

    if (error) throw error;
};

// --- Player management ---
export const joinLobby = async (lobbyId: string, player: BombermanPlayer): Promise<boolean> => {
    try {
        const { data: lobby, error: fetchError } = await supabase
            .from('bomberman_lobbies')
            .select('players, max_players, status')
            .eq('id', lobbyId)
            .single();

        if (fetchError || !lobby) return false;
        if (lobby.status !== 'waiting') return false;

        const players = (lobby.players as BombermanPlayer[]) || [];
        if (players.length >= lobby.max_players) return false;
        if (players.some(p => p.uid === player.uid)) return true; // Already joined

        const { error } = await supabase
            .from('bomberman_lobbies')
            .update({
                players: [...players, player],
                updated_at: new Date().toISOString(),
            })
            .eq('id', lobbyId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('[Bomberman] Failed to join lobby:', error);
        return false;
    }
};

export const leaveLobby = async (lobbyId: string, uid: string): Promise<void> => {
    try {
        const { data: lobby, error: fetchError } = await supabase
            .from('bomberman_lobbies')
            .select('players')
            .eq('id', lobbyId)
            .single();

        if (fetchError || !lobby) return;

        const players = (lobby.players as BombermanPlayer[]) || [];
        const updated = players.filter(p => p.uid !== uid);

        const { error } = await supabase
            .from('bomberman_lobbies')
            .update({
                players: updated,
                updated_at: new Date().toISOString(),
            })
            .eq('id', lobbyId);

        if (error) throw error;
    } catch (error) {
        console.error('[Bomberman] Failed to leave lobby:', error);
    }
};

export const setPlayerReady = async (lobbyId: string, uid: string, ready: boolean): Promise<void> => {
    try {
        const { data: lobby, error: fetchError } = await supabase
            .from('bomberman_lobbies')
            .select('players')
            .eq('id', lobbyId)
            .single();

        if (fetchError || !lobby) return;

        const players = (lobby.players as BombermanPlayer[]) || [];
        const updated = players.map(p => p.uid === uid ? { ...p, ready } : p);

        const { error } = await supabase
            .from('bomberman_lobbies')
            .update({
                players: updated,
                updated_at: new Date().toISOString(),
            })
            .eq('id', lobbyId);

        if (error) throw error;
    } catch (error) {
        console.error('[Bomberman] Failed to set ready:', error);
    }
};

// --- Realtime ---
export const subscribeToLobby = (
    lobbyId: string,
    onUpdate: (lobby: BombermanLobby | null) => void
): (() => void) => {
    const fetchLobby = async () => {
        const lobby = await getLobby(lobbyId);
        onUpdate(lobby);
    };

    fetchLobby();

    const channel: RealtimeChannel = supabase
        .channel(`bomberman-lobby-${lobbyId}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'bomberman_lobbies',
            filter: `id=eq.${lobbyId}`,
        }, () => {
            fetchLobby();
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

/**
 * Get available lobbies to join
 */
export const getAvailableLobbies = async (schoolId?: string): Promise<BombermanLobby[]> => {
    let q = supabase
        .from('bomberman_lobbies')
        .select('*')
        .eq('status', 'waiting')
        .order('created_at', { ascending: false });

    if (schoolId) q = q.eq('school_id', schoolId);

    const { data, error } = await q;
    if (error) throw error;
    return (data || []) as BombermanLobby[];
};

// --- Teacher controls ---
export const endAllGames = async (schoolId: string): Promise<void> => {
    const { error } = await supabase
        .from('bomberman_lobbies')
        .update({
            status: 'finished',
            updated_at: new Date().toISOString(),
        })
        .eq('school_id', schoolId)
        .neq('status', 'finished');

    if (error) console.error('[Bomberman] Failed to end all games:', error);
};

export const pauseAllGames = async (schoolId: string): Promise<void> => {
    const { error } = await supabase
        .from('bomberman_lobbies')
        .update({
            status: 'waiting',
            updated_at: new Date().toISOString(),
        })
        .eq('school_id', schoolId)
        .eq('status', 'playing');

    if (error) console.error('[Bomberman] Failed to pause all games:', error);
};

/**
 * Subscribe to active (non-finished) lobbies with player count info.
 * Used by teacher GamesPanel to see live game activity.
 */
export const subscribeToActiveLobbies = (
    onUpdate: (lobbies: (BombermanLobby & { playerCount: number })[]) => void
): (() => void) => {
    const fetchLobbies = async () => {
        const { data, error } = await supabase
            .from('bomberman_lobbies')
            .select('*')
            .neq('status', 'finished')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Bomberman] Failed to fetch active lobbies:', error);
            onUpdate([]);
            return;
        }

        const lobbies = (data || []).map(d => ({
            ...(d as BombermanLobby),
            playerCount: ((d.players as BombermanPlayer[]) || []).length,
        }));
        onUpdate(lobbies);
    };

    fetchLobbies();

    const channel: RealtimeChannel = supabase
        .channel('bomberman-active-lobbies')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'bomberman_lobbies',
        }, () => {
            fetchLobbies();
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

/**
 * Force-start all waiting lobbies (teacher action).
 */
export const forceStartAllLobbies = async (_teacherId: string): Promise<number> => {
    const { data, error } = await supabase
        .from('bomberman_lobbies')
        .update({
            status: 'playing',
            updated_at: new Date().toISOString(),
        })
        .eq('status', 'waiting')
        .select('id');

    if (error) {
        console.error('[Bomberman] Failed to force start lobbies:', error);
        return 0;
    }
    return (data || []).length;
};

/**
 * Force-start waiting lobbies filtered by class (teacher action).
 */
export const forceStartLobbiesByClass = async (classId: string, _teacherId: string): Promise<number> => {
    const { data, error } = await supabase
        .from('bomberman_lobbies')
        .update({
            status: 'playing',
            updated_at: new Date().toISOString(),
        })
        .eq('status', 'waiting')
        .eq('class_id', classId)
        .select('id');

    if (error) {
        console.error('[Bomberman] Failed to force start lobbies for class:', error);
        return 0;
    }
    return (data || []).length;
};

