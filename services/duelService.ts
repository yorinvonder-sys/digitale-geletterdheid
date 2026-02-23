import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
export interface OnlinePlayer {
    uid: string;
    name: string;
    class?: string;
    school_id?: string;
    online_at: string;
}

export interface DuelChallenge {
    id?: string;
    challenger_uid: string;
    challenger_name: string;
    challenged_uid: string;
    challenged_name: string;
    school_id?: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    created_at?: string;
}

export interface ActiveDuel {
    id?: string;
    player1_uid: string;
    player1_name: string;
    player2_uid: string;
    player2_name: string;
    school_id?: string;
    current_round: number;
    max_rounds: number;
    current_drawer: string;
    current_word?: string;
    player1_score: number;
    player2_score: number;
    status: 'drawing' | 'guessing' | 'round_end' | 'finished';
    drawing_data?: any;
    round_start_time?: string;
    created_at?: string;
    updated_at?: string;
}

// --- Presence ---
export const setPlayerOnline = async (uid: string, name: string, classId?: string, schoolId?: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('duel_presence')
            .upsert({
                uid,
                name,
                class: classId,
                school_id: schoolId,
                online_at: new Date().toISOString(),
            }, { onConflict: 'uid' });

        if (error) throw error;
    } catch (error) {
        console.error('[Duel] Failed to set online:', error);
    }
};

export const setPlayerOffline = async (uid: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('duel_presence')
            .delete()
            .eq('uid', uid);
        if (error) throw error;
    } catch (error) {
        console.error('[Duel] Failed to set offline:', error);
    }
};

export const subscribeToOnlinePlayers = (
    schoolId: string | undefined,
    onUpdate: (players: OnlinePlayer[]) => void
): (() => void) => {
    const fetchPlayers = async () => {
        // Only show players online in the last 2 minutes
        const twoMinutesAgo = new Date(Date.now() - 120000).toISOString();

        let q = supabase
            .from('duel_presence')
            .select('*')
            .gte('online_at', twoMinutesAgo);

        if (schoolId) q = q.eq('school_id', schoolId);

        const { data, error } = await q;
        if (error) {
            console.error('[Duel] Failed to fetch online players:', error);
            return;
        }
        onUpdate((data || []) as OnlinePlayer[]);
    };

    fetchPlayers();

    const channel: RealtimeChannel = supabase
        .channel('duel-presence')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'duel_presence',
        }, () => {
            fetchPlayers();
        })
        .subscribe();

    // Heartbeat to keep presence alive
    const heartbeat = setInterval(() => {
        fetchPlayers();
    }, 30000);

    return () => {
        clearInterval(heartbeat);
        supabase.removeChannel(channel);
    };
};

// --- Challenges ---
export const sendChallenge = async (challenge: Omit<DuelChallenge, 'id' | 'created_at' | 'status'>): Promise<string> => {
    const { data, error } = await supabase
        .from('duel_challenges')
        .insert({
            ...challenge,
            status: 'pending',
        })
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
};

export const respondToChallenge = async (challengeId: string, accept: boolean): Promise<void> => {
    const { error } = await supabase
        .from('duel_challenges')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', challengeId);

    if (error) throw error;
};

export const subscribeToChallenges = (
    uid: string,
    onUpdate: (challenges: DuelChallenge[]) => void
): (() => void) => {
    const fetchChallenges = async () => {
        const { data, error } = await supabase
            .from('duel_challenges')
            .select('*')
            .eq('challenged_uid', uid)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (!error) onUpdate((data || []) as DuelChallenge[]);
    };

    fetchChallenges();

    const channel: RealtimeChannel = supabase
        .channel(`duel-challenges-${uid}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'duel_challenges',
            filter: `challenged_uid=eq.${uid}`,
        }, () => {
            fetchChallenges();
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

export const cleanupExpiredChallenges = async (): Promise<void> => {
    const fiveMinutesAgo = new Date(Date.now() - 300000).toISOString();

    await supabase
        .from('duel_challenges')
        .update({ status: 'expired' })
        .eq('status', 'pending')
        .lt('created_at', fiveMinutesAgo);
};

// --- Active duels ---
export const createDuel = async (duel: Omit<ActiveDuel, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
    const { data, error } = await supabase
        .from('active_duels')
        .insert(duel)
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
};

export const updateDuel = async (duelId: string, updates: Partial<ActiveDuel>): Promise<void> => {
    const { error } = await supabase
        .from('active_duels')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', duelId);

    if (error) throw error;
};

export const subscribeToDuel = (
    duelId: string,
    onUpdate: (duel: ActiveDuel | null) => void
): (() => void) => {
    const fetchDuel = async () => {
        const { data, error } = await supabase
            .from('active_duels')
            .select('*')
            .eq('id', duelId)
            .maybeSingle();

        if (!error) onUpdate(data as ActiveDuel | null);
    };

    fetchDuel();

    const channel: RealtimeChannel = supabase
        .channel(`active-duel-${duelId}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'active_duels',
            filter: `id=eq.${duelId}`,
        }, () => {
            fetchDuel();
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

export const endDuel = async (duelId: string, winnerId?: string): Promise<void> => {
    await updateDuel(duelId, {
        status: 'finished',
    });
};

export const updateDrawingData = async (duelId: string, drawingData: any): Promise<void> => {
    await updateDuel(duelId, { drawing_data: drawingData });
};

export const submitGuess = async (duelId: string, guess: string, guesserId: string): Promise<boolean> => {
    const { data: duel, error } = await supabase
        .from('active_duels')
        .select('current_word, player1_uid, player1_score, player2_score')
        .eq('id', duelId)
        .single();

    if (error || !duel) return false;

    const isCorrect = guess.toLowerCase().trim() === (duel.current_word || '').toLowerCase().trim();

    if (isCorrect) {
        const isPlayer1 = guesserId === duel.player1_uid;
        const scoreUpdate = isPlayer1
            ? { player1_score: (duel.player1_score || 0) + 1 }
            : { player2_score: (duel.player2_score || 0) + 1 };

        await updateDuel(duelId, {
            ...scoreUpdate,
            status: 'round_end',
        });
    }

    return isCorrect;
};

export const getActiveDuelForUser = async (uid: string): Promise<ActiveDuel | null> => {
    const { data, error } = await supabase
        .from('active_duels')
        .select('*')
        .neq('status', 'finished')
        .or(`player1_uid.eq.${uid},player2_uid.eq.${uid}`)
        .maybeSingle();

    if (error) {
        console.error('[Duel] Failed to get active duel:', error);
        return null;
    }
    return data as ActiveDuel | null;
};
