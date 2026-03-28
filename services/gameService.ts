import { supabase } from './supabase';

// The mission_progress table is not in the generated DB types.
const missionProgressTable = () => (supabase as any).from('mission_progress');

export const saveGameCode = async (
    userId: string,
    missionId: string,
    code: string
): Promise<void> => {
    const { error } = await missionProgressTable()
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
    const { data, error } = await missionProgressTable()
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
