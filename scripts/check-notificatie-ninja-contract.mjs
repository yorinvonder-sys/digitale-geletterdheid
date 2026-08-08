import assert from 'node:assert/strict';
import fs from 'node:fs';

const files = {
  goals: fs.readFileSync('src/config/missionGoals.ts', 'utf8'),
  config: fs.readFileSync('src/features/missions/templates/scenario-engine/configs/notificatie-ninja.ts', 'utf8'),
  engine: fs.readFileSync('src/features/missions/templates/scenario-engine/ScenarioEngine.tsx', 'utf8'),
};

assert.match(
  files.goals,
  /'notificatie-ninja':[\s\S]{0,650}evidence: 'Je selecteert minimaal twee effectieve notificatie-instellingen of gewoontes/,
  'Notification Ninja evidence must describe the selection task the learner actually performs',
);
assert.match(
  files.config,
  /Ik herken en selecteer minimaal 2 concrete instellingen of gewoontes/,
  'Notification Ninja local objective must match its measurable interaction',
);
assert.match(
  files.engine,
  /criteria\.type === 'score-threshold'[\s\S]*: true/,
  'Rounds-complete Notification Ninja must complete after all rounds without a hidden score gate',
);

console.log('Notification Ninja contract checks passed');
