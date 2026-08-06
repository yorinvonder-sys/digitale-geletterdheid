import assert from 'node:assert/strict';
import fs from 'node:fs';

const files = {
  engine: fs.readFileSync('src/features/missions/templates/scenario-engine/ScenarioEngine.tsx', 'utf8'),
  goals: fs.readFileSync('src/config/missionGoals.ts', 'utf8'),
  app: fs.readFileSync('src/app/AuthenticatedApp.tsx', 'utf8'),
};

assert.match(
  files.goals,
  /'code-denker':[\s\S]*type: 'rounds-complete'/,
  'Code Denker goal must remain rounds-based',
);
assert.match(
  files.engine,
  /missionGoal\?\.criteria\.type === 'score-threshold'[\s\S]*: true/,
  'Scenario completion may reject only missions with an explicit score threshold',
);
assert.match(
  files.engine,
  /const completed = await onComplete\(success\);[\s\S]*if \(completed !== false\)[\s\S]*clearSave\(\)/,
  'Scenario progress must remain available until durable completion succeeds',
);
assert.match(
  files.app,
  /if \(success\) return handleMissionComplete\(tmId\)/,
  'Template missions must receive the auth-bound completion result',
);

console.log('Code Denker contract checks passed');
