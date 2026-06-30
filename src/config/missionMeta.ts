import { KERNDOEL_MISSIONS } from './slo-kerndoelen-mapping';
import { SLO_KERNDOELEN } from './sloKerndoelen';
import { ROLES } from './agents';
import { getXPReward } from './xp';
import { getMissionDurationLabel } from './missionDurations';

export interface MissionChipMeta {
    /** Human-friendly SLO domain label, e.g. "Veiligheid & privacy". */
    topicLabel?: string;
    topicColor?: 'blue' | 'purple' | 'amber';
    leerjaar?: number;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    xp?: number;
    durationLabel?: string;
}

/**
 * Assembles the lightweight "meta chip" data for a mission intro from existing
 * sources. Everything is best-effort: a field is omitted when its source has no
 * entry for this mission, so the UI renders only what genuinely exists.
 *
 *  - topic + leerjaar  → SLO mapping (available for every mission)
 *  - difficulty + xp   → AgentRole (only missions that have a chat role)
 *  - duration          → per-engine estimate (only template missions)
 */
export function getMissionMeta(missionId: string): MissionChipMeta {
    const slo = KERNDOEL_MISSIONS.find((m) => m.id === missionId);
    const firstCode = slo?.sloKerndoelen?.[0];
    const kerndoel = firstCode ? SLO_KERNDOELEN[firstCode] : undefined;
    const role = ROLES.find((r) => r.id === missionId);

    return {
        topicLabel: kerndoel?.label,
        topicColor: kerndoel?.kleur,
        leerjaar: slo?.yearGroup,
        difficulty: role?.difficulty,
        xp: role ? getXPReward(role.difficulty) : undefined,
        durationLabel: getMissionDurationLabel(missionId),
    };
}
