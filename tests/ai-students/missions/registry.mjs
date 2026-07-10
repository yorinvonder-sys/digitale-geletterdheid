import { observeScenario, performScenarioDecision } from './scenario-engine.mjs';

const SCENARIO_ENGINE_IDS = new Set(['mail-detective']);

export function getMissionAdapter(missionId) {
  if (!SCENARIO_ENGINE_IDS.has(missionId)) {
    throw new Error(`Fase 3 ondersteunt alleen de pilotmissie mail-detective, niet "${missionId}".`);
  }
  return {
    id: 'scenario-engine',
    observe: observeScenario,
    perform: performScenarioDecision,
    previewPath: `/dev/mission-preview?mission=${encodeURIComponent(missionId)}&reset=1`,
  };
}
