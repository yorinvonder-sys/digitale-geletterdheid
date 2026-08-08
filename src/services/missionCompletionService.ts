import { supabase } from './supabase';
import { parseMissionCompletion } from './missionCompletionContract';

/**
 * @param scorePercent 0-100. Weggelaten laat een eerder vastgelegde score ongemoeid.
 *   De server klemt de waarde nogmaals; dit is alleen om onzin niet te versturen.
 */
export const markMissionCompleted = async (
    missionId: string,
    scorePercent?: number,
): Promise<string[]> => {
    const args: { p_mission_id: string; p_score_percent?: number } = {
        p_mission_id: missionId,
    };
    if (typeof scorePercent === 'number' && Number.isFinite(scorePercent)) {
        args.p_score_percent = Math.round(Math.min(100, Math.max(0, scorePercent)));
    }

    const { data, error } = await supabase.rpc('mark_mission_completed', args);
    if (error) {
        throw new Error('Mission completion RPC failed');
    }
    return parseMissionCompletion(data, missionId);
};
