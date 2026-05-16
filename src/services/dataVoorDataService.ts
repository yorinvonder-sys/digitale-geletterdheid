import { supabase } from './supabase';

export type DataVoorDataChoice = 'deal' | 'no-deal';
export type DataVoorDataStatsScope = 'class' | 'school';

export interface DataVoorDataRoundStat {
    roundIndex: number;
    dealPercentage: number;
    scope: DataVoorDataStatsScope;
}

const MAX_ROUNDS = 5;
const VALID_CHOICES = new Set<DataVoorDataChoice>(['deal', 'no-deal']);

const sanitizeChoices = (choices: DataVoorDataChoice[]): DataVoorDataChoice[] =>
    choices.filter((choice): choice is DataVoorDataChoice => VALID_CHOICES.has(choice)).slice(0, MAX_ROUNDS);

const hasAuthenticatedSession = async (): Promise<boolean> => {
    try {
        const { data } = await supabase.auth.getSession();
        return Boolean(data.session?.user?.id);
    } catch {
        return false;
    }
};

export async function saveDataVoorDataAnswers(
    choices: DataVoorDataChoice[],
    isCompleted: boolean
): Promise<boolean> {
    const sanitizedChoices = sanitizeChoices(choices);
    if (!(await hasAuthenticatedSession())) return false;

    try {
        const { error } = await (supabase as any).rpc('submit_data_for_data_answers', {
            p_answers: sanitizedChoices,
            p_status: isCompleted ? 'completed' : 'in_progress',
        });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Kon Data voor Data-antwoorden niet opslaan:', error);
        return false;
    }
}

export async function getDataVoorDataRoundStats(): Promise<Record<number, DataVoorDataRoundStat>> {
    if (!(await hasAuthenticatedSession())) return {};

    try {
        const { data, error } = await (supabase as any).rpc('get_data_for_data_round_stats');
        if (error) throw error;

        const stats: Record<number, DataVoorDataRoundStat> = {};

        for (const row of Array.isArray(data) ? data : []) {
            const roundIndex = Number(row?.round_index);
            const dealPercentage = Number(row?.deal_percentage);
            const scope = row?.scope === 'school' ? 'school' : 'class';

            if (!Number.isInteger(roundIndex) || roundIndex < 0 || roundIndex >= MAX_ROUNDS) continue;
            if (!Number.isFinite(dealPercentage) || dealPercentage < 0 || dealPercentage > 100) continue;

            stats[roundIndex] = {
                roundIndex,
                dealPercentage,
                scope,
            };
        }

        return stats;
    } catch (error) {
        console.error('Kon Data voor Data-statistieken niet ophalen:', error);
        return {};
    }
}
