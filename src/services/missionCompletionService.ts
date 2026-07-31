import { supabase } from './supabase';
import { parseMissionCompletion } from './missionCompletionContract';

export const markMissionCompleted = async (missionId: string): Promise<string[]> => {
    const { data, error } = await supabase.rpc('mark_mission_completed', {
        p_mission_id: missionId,
    });
    if (error) {
        throw new Error('Mission completion RPC failed');
    }
    return parseMissionCompletion(data, missionId);
};
