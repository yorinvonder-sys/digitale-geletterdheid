import { TEMPLATE_MISSIONS } from './templateRegistry';

// Rough, honest time estimates rendered as "~X min" on the mission intro.
// Defaults are per template-engine (missions of one engine run a similar
// length); add a per-mission override only when one clearly deviates.
const ENGINE_MINUTES: Record<string, number> = {
    'scenario-engine': 15,
    'puzzle-lab': 15,
    'tool-guide': 15,
    'review-arena': 15,
    'simulation-lab': 20,
    'data-viewer': 20,
    'debate-arena': 20,
    'builder-canvas': 30,
};

const MISSION_OVERRIDES: Record<string, number> = {};

export function getMissionDurationMinutes(missionId: string): number | undefined {
    const override = MISSION_OVERRIDES[missionId];
    if (override != null) return override;
    const engine = TEMPLATE_MISSIONS[missionId]?.templateType;
    return engine ? ENGINE_MINUTES[engine] : undefined;
}

export function getMissionDurationLabel(missionId: string): string | undefined {
    const minutes = getMissionDurationMinutes(missionId);
    return minutes == null ? undefined : `~${minutes} min`;
}
