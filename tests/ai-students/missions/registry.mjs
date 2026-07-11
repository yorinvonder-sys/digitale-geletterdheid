import { observeScenario, performScenarioDecision } from './scenario-engine.mjs';
import { observePuzzle, performPuzzleDecision } from './puzzle-lab.mjs';
import { observeFortress, performFortressDecision, redactFortressDecision } from './password-fortress.mjs';
import { observeSimulation, performSimulationDecision } from './simulation-lab.mjs';

const SCENARIO_ENGINE_IDS = new Set(['mail-detective']);
const PUZZLE_LAB_IDS = new Set([
  'encryption-expert',
  'cyber-detective',
  'wachtwoord-warrior',
  'data-handelaar',
  'security-auditor',
]);
const SIMULATION_LAB_IDS = new Set([
  'privacy-by-design', 'bug-hunter', 'code-reviewer', 'ai-spiegel', 'algorithm-architect',
]);

export function getMissionAdapter(missionId) {
  if (SCENARIO_ENGINE_IDS.has(missionId)) {
    return {
      id: 'scenario-engine',
      observe: observeScenario,
      perform: performScenarioDecision,
      previewPath: `/dev/mission-preview?mission=${encodeURIComponent(missionId)}&reset=1`,
    };
  }
  if (PUZZLE_LAB_IDS.has(missionId)) {
    return {
      id: 'puzzle-lab',
      observe: observePuzzle,
      perform: performPuzzleDecision,
      previewPath: `/dev/mission-preview?mission=${encodeURIComponent(missionId)}&reset=1`,
    };
  }
  if (missionId === 'wachtwoord-fortress') {
    return {
      id: 'password-fortress',
      observe: observeFortress,
      perform: performFortressDecision,
      redactDecision: redactFortressDecision,
      previewPath: `/dev/mission-preview?mission=${encodeURIComponent(missionId)}&reset=1`,
    };
  }
  if (SIMULATION_LAB_IDS.has(missionId)) {
    return {
      id: 'simulation-lab',
      observe: observeSimulation,
      perform: performSimulationDecision,
      previewPath: `/dev/mission-preview?mission=${encodeURIComponent(missionId)}&reset=1`,
    };
  }
  throw new Error(`De AI-testklas ondersteunt deze missie nog niet: "${missionId}".`);
}
