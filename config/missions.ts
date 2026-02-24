import { CURRICULUM } from './curriculum';
import { ROLES } from './agents';

export interface MissionInfo {
    id: string;
    name: string;
    short: string;
}

/**
 * Build a flat mission list for a given year group.
 * Combines curriculum mission IDs with agent titles from ROLES.
 */
export function getMissionsForYear(yearGroup: number = 1): MissionInfo[] {
    const yearConfig = CURRICULUM.yearGroups[yearGroup];
    if (!yearConfig) return [];

    const missions: MissionInfo[] = [];
    const seen = new Set<string>();

    for (const periodConfig of Object.values(yearConfig.periods)) {
        const allIds = [
            ...periodConfig.missions,
            ...(periodConfig.reviewMissions || []),
        ];

        for (const id of allIds) {
            if (seen.has(id)) continue;
            seen.add(id);

            const agent = ROLES.find(r => r.id === id);
            const name = agent?.title || id;
            const short = name
                .split(/[\s-]+/)
                .map(w => w[0]?.toUpperCase() || '')
                .join('')
                .slice(0, 2);

            missions.push({ id, name, short });
        }
    }

    return missions;
}

/** Legacy export: leerjaar 1 missions for backward compat */
export const ALL_MISSIONS = getMissionsForYear(1);
