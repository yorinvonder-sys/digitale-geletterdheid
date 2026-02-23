// Sharing, browsing, and interacting with student-created games/books.

import { supabase, callEdgeFunction } from './supabase';
import { BookData } from '../types';

export interface PlayerScore {
    score: number;
    milestone_reached: number;
    updated_at: string;
}

export interface SharedGame {
    id: string;
    creator_uid: string;
    creator_name: string;
    school_id?: string;
    student_class?: string;
    mission_id?: string;
    title: string;
    description?: string;
    game_code?: string;
    book_data?: BookData;
    thumbnail?: string;
    created_at: string;
    play_count: number;
    likes: string[];
    has_obstacles?: boolean;
    creator_xp_earned?: number;
    high_scores?: Record<string, PlayerScore>;
}

export async function publishGame(
    userId: string,
    userName: string,
    title: string,
    content: { gameCode?: string, bookData?: BookData },
    description?: string,
    studentClass?: string,
    missionId?: string,
    schoolId?: string
): Promise<string> {
    const gameData: Record<string, any> = {
        creator_uid: userId,
        creator_name: userName,
        title: title.trim(),
        play_count: 0,
        likes: [],
        creator_xp_earned: 0,
    };

    if (content.gameCode) gameData.game_code = content.gameCode;
    if (content.bookData) gameData.book_data = content.bookData;
    if (studentClass) gameData.student_class = studentClass;
    if (missionId) gameData.mission_id = missionId;
    if (schoolId) gameData.school_id = schoolId;
    if (description?.trim()) gameData.description = description.trim();

    const { data, error } = await supabase
        .from('shared_games')
        .insert(gameData)
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
}


export async function getSharedGames(classFilter?: string, schoolId?: string): Promise<SharedGame[]> {
    let q = supabase.from('shared_games').select('*');

    if (schoolId) q = q.eq('school_id', schoolId);
    if (classFilter) q = q.eq('student_class', classFilter);

    q = q.order('created_at', { ascending: false }).limit(50);

    const { data, error } = await q;
    if (error) throw error;
    return (data || []) as SharedGame[];
}


export async function getSharedGame(gameId: string): Promise<SharedGame | null> {
    const { data, error } = await supabase
        .from('shared_games')
        .select('*')
        .eq('id', gameId)
        .maybeSingle();

    if (error) throw error;
    return data as SharedGame | null;
}


export async function incrementPlayCount(gameId: string): Promise<void> {
    // Use RPC to atomically increment
    const { error } = await supabase.rpc('increment_play_count', { game_id: gameId });

    if (error) {
        // Fallback: manual increment
        const { data } = await supabase
            .from('shared_games')
            .select('play_count')
            .eq('id', gameId)
            .single();

        if (data) {
            await supabase
                .from('shared_games')
                .update({ play_count: (data.play_count || 0) + 1 })
                .eq('id', gameId);
        }
    }
}


/**
 * Toggle like on a game (atomic — prevents TOCTOU race conditions)
 */
export async function toggleLike(gameId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('atomic_toggle_like', {
        p_game_id: gameId,
        p_user_id: userId,
    });

    if (error) {
        console.error('[GameGallery] atomic_toggle_like error:', error);
        return false;
    }

    const result = data as Record<string, any> || {};
    return !!result.liked;
}


export async function deleteSharedGame(gameId: string): Promise<void> {
    const { error } = await supabase
        .from('shared_games')
        .delete()
        .eq('id', gameId);

    if (error) throw error;
}


/**
 * Check if user has already published a very similar game.
 * Uses first+last character slices for fast comparison instead of
 * length-only check (which was trivially bypassable by adding whitespace).
 */
export async function hasUserPublishedGame(userId: string, gameCode: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('shared_games')
        .select('game_code')
        .eq('creator_uid', userId)
        .limit(20);

    if (error || !data) return false;

    // Normalise: strip whitespace for comparison
    const normalised = gameCode.replace(/\s+/g, '');
    const head = normalised.slice(0, 200);
    const tail = normalised.slice(-100);

    for (const game of data) {
        if (!game.game_code) continue;
        const existing = game.game_code.replace(/\s+/g, '');
        if (existing.slice(0, 200) === head && existing.slice(-100) === tail) {
            return true;
        }
    }

    return false;
}


export async function recordGameScore(
    gameId: string,
    playerId: string,
    score: number
): Promise<{ xpAwarded: number; newMilestone: boolean }> {
    try {
        const result = await callEdgeFunction<{ xpAwarded: number; newMilestone: boolean }>(
            'recordGameScore',
            { gameId, score }
        );

        return {
            xpAwarded: result?.xpAwarded || 0,
            newMilestone: result?.newMilestone === true,
        };
    } catch (error) {
        console.error('[GameGallery] recordGameScore error:', error);
        return { xpAwarded: 0, newMilestone: false };
    }
}
