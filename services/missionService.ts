import { supabase } from './supabase';

/** Recursively strips undefined values and caps nesting depth for Postgres JSONB. */
function sanitizeForPostgres(data: any, maxDepth = 5, currentDepth = 0): any {
    if (currentDepth > maxDepth) return null;
    if (data === undefined || data === null) return null;
    if (typeof data !== 'object') return data;
    if (Array.isArray(data)) {
        return data.map(item => sanitizeForPostgres(item, maxDepth, currentDepth + 1));
    }
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
            result[key] = sanitizeForPostgres(value, maxDepth, currentDepth + 1);
        }
    }
    return result;
}

export const saveMissionProgress = async (
    userId: string,
    missionId: string,
    progressData: Record<string, any>,
    schoolId?: string
): Promise<boolean> => {
    try {
        const sanitized = sanitizeForPostgres(progressData);

        const { error } = await supabase
            .from('mission_progress')
            .upsert({
                user_id: userId,
                mission_id: missionId,
                progress_data: sanitized,
                school_id: schoolId,
                status: sanitized?.status || 'in_progress',
                score: sanitized?.score || null,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,mission_id',
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Error saving progress for ${missionId}:`, error);
        return false;
    }
};

export const loadMissionProgress = async (
    userId: string,
    missionId: string
): Promise<Record<string, any> | null> => {
    try {
        const { data, error } = await supabase
            .from('mission_progress')
            .select('progress_data')
            .eq('user_id', userId)
            .eq('mission_id', missionId)
            .maybeSingle();

        if (error) throw error;
        return data?.progress_data || null;
    } catch (error) {
        console.error(`Error loading progress for ${missionId}:`, error);
        return null;
    }
};

export const resetMissionProgress = async (
    userId: string,
    missionId: string
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('mission_progress')
            .delete()
            .eq('user_id', userId)
            .eq('mission_id', missionId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Error resetting progress for ${missionId}:`, error);
        return false;
    }
};

export const getAllMissionProgress = async (
    userId: string
): Promise<Record<string, any>> => {
    try {
        const { data, error } = await supabase
            .from('mission_progress')
            .select('mission_id, progress_data, status, score')
            .eq('user_id', userId);

        if (error) throw error;

        const result: Record<string, any> = {};
        (data || []).forEach(row => {
            result[row.mission_id] = row.progress_data || {};
        });
        return result;
    } catch (error) {
        console.error('Error loading all progress:', error);
        return {};
    }
};

// Shorthand for game-specific code save/load via mission_progress

export const saveGameCode = async (
    userId: string,
    missionId: string,
    code: string
): Promise<boolean> => {
    return saveMissionProgress(userId, missionId, { gameCode: code, status: 'in_progress' });
};

export const loadGameCode = async (
    userId: string,
    missionId: string
): Promise<string | null> => {
    const progress = await loadMissionProgress(userId, missionId);
    return progress?.gameCode || null;
};

export interface SharedProject {
    type: string;
    data: any;
    name: string;
    createdBy: string;
    createdAt: Date;
}

export const shareProject = async (project: SharedProject): Promise<string> => {
    const { data, error } = await supabase
        .from('shared_projects')
        .insert({
            type: project.type,
            data: sanitizeForPostgres(project.data),
            name: project.name,
            created_by: project.createdBy,
            created_at: project.createdAt.toISOString(),
        })
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
};

export const getSharedProject = async (shareId: string): Promise<SharedProject | null> => {
    try {
        const { data, error } = await supabase
            .from('shared_projects')
            .select('*')
            .eq('id', shareId)
            .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        return {
            type: data.type,
            data: data.data,
            name: data.name,
            createdBy: data.created_by,
            createdAt: new Date(data.created_at),
        };
    } catch (error) {
        console.error('Error loading shared project:', error);
        return null;
    }
};
