import { supabase } from './supabase';
import {
    readPending,
    stashPending,
    clearPending,
    volgendTicket,
} from './progressBackupQueue';

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
    // Volgnummer van DEZE poging. Alles hieronder hangt eraan: het bepaalt of
    // ons werk nog het nieuwste is als het antwoord binnenkomt. Bewust een
    // teller en geen klok -- zie progressBackupQueue.
    const ticket = volgendTicket(userId, missionId);

    try {
        const sanitized = sanitizeForPostgres(progressData);

        // Via de server, want een rij die op 'completed' staat is door de leerling
        // zelf niet meer bij te werken: de RLS-regel filtert hem al weg in de
        // USING-clausule. Werkbanken als game-programmeur lopen na hun automatische
        // voltooiing gewoon door, en verloren daardoor stil alles wat daarna kwam.
        const { error: rpcError } = await supabase.rpc('save_mission_progress', {
            p_mission_id: missionId,
            p_progress_data: sanitized,
        });

        if (!rpcError) {
            clearPending(userId, missionId, ticket);
            return true;
        }

        // Overgangspad: zolang migratie 20260808180000 niet is toegepast bestaat de
        // functie nog niet. Zonder deze terugval zou een frontend die eerder uitrolt
        // ELKE opslag laten mislukken in plaats van alleen die na voltooiing.
        // Weghalen zodra de migratie overal draait.
        //
        // Alleen terugvallen als de functie ONTBREEKT. Op elke fout terugvallen
        // maakt de grenzen in de functie zelf waardeloos: een te grote opslag zou
        // dan gewoon via de rechtstreekse weg alsnog binnenkomen, want daar staat
        // geen groottegrens op.
        const functieOntbreekt =
            rpcError.code === 'PGRST202' ||
            rpcError.code === '42883' ||
            /could not find the function|does not exist/i.test(rpcError.message ?? '');

        if (!functieOntbreekt) throw rpcError;

        console.error(`Server save function missing for ${missionId}, falling back:`, rpcError.message);

        const { error } = await supabase
            .from('mission_progress')
            .upsert({
                user_id: userId,
                mission_id: missionId,
                progress_data: sanitized,
                school_id: schoolId,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,mission_id',
            });

        if (error) throw error;
        clearPending(userId, missionId, ticket);
        return true;
    } catch (error) {
        console.error(`Error saving progress for ${missionId}:`, error);
        // Niets bereikte de server. Bewaar het lokaal, zodat een herlaad of een
        // wegvallend netwerk het werk van de leerling niet wist.
        stashPending(userId, missionId, sanitizeForPostgres(progressData), ticket);
        return false;
    }
};

export const loadMissionProgress = async (
    userId: string,
    missionId: string
): Promise<Record<string, any> | null> => {
    // Staat er werk klaar dat de server nooit heeft bereikt, probeer dat dan eerst
    // alsnog te versturen. Lukt dat, dan is de server weer de waarheid en is de
    // lokale kopie opgeruimd. Lukt het niet, dan is die kopie het nieuwste wat de
    // leerling heeft -- die tonen is beter dan een leeg scherm.
    const pending = readPending(userId, missionId);
    if (pending) {
        const verstuurd = await saveMissionProgress(userId, missionId, pending);
        if (!verstuurd) return pending;
    }

    try {
        const { data, error } = await supabase
            .from('mission_progress')
            .select('progress_data')
            .eq('user_id', userId)
            .eq('mission_id', missionId)
            .maybeSingle();

        if (error) throw error;
        return (data?.progress_data as unknown as Record<string, any>) || null;
    } catch (error) {
        console.error(`Error loading progress for ${missionId}:`, error);
        // Hebben we het werk nog in handen -- net verstuurd of nog wachtend --
        // toon dat dan liever dan een leeg scherm.
        return pending ?? null;
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
            createdBy: data.created_by ?? '',
            createdAt: new Date(data.created_at ?? Date.now()),
        };
    } catch (error) {
        console.error('Error loading shared project:', error);
        return null;
    }
};
