import { supabase } from './supabase';

export const saveGameCode = async (
    userId: string,
    missionId: string,
    code: string
): Promise<void> => {
    const { error } = await supabase
        .from('mission_progress')
        .upsert({
            user_id: userId,
            mission_id: missionId,
            game_code: code,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id,mission_id',
        });

    if (error) {
        console.error('Error saving game code:', error);
        throw error;
    }
};

export const loadGameCode = async (
    userId: string,
    missionId: string
): Promise<string | null> => {
    const { data, error } = await supabase
        .from('mission_progress')
        .select('game_code')
        .eq('user_id', userId)
        .eq('mission_id', missionId)
        .maybeSingle();

    if (error) {
        console.error('Error loading game code:', error);
        return null;
    }

    return data?.game_code || null;
};
