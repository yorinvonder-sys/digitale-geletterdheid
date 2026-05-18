import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

const j2p1Configs = [
  ['data-journalist', 'src/features/missions/templates/data-viewer/configs/data-journalist.ts', 65],
  ['spreadsheet-specialist', 'src/features/missions/templates/data-viewer/configs/spreadsheet-specialist.ts', 65],
  ['api-verkenner', 'src/features/missions/templates/data-viewer/configs/api-verkenner.ts', 65],
  ['dashboard-designer', 'src/features/missions/templates/data-viewer/configs/dashboard-designer.ts', 65],
  ['factchecker', 'src/features/missions/templates/scenario-engine/configs/factchecker.ts', 60],
  ['ai-bias-detective', 'src/features/missions/templates/scenario-engine/configs/ai-bias-detective.ts', 60],
  ['data-review', 'src/features/missions/templates/review-arena/configs/data-review.ts', 70],
];

for (const [missionId, path, threshold] of j2p1Configs) {
  const source = read(path);
  assert.match(source, /missionGoal:\s*\{/, `${missionId}: mist missionGoal`);
  assert.match(source, /primaryGoal:\s*'/, `${missionId}: mist primaryGoal`);
  assert.match(source, new RegExp(`threshold:\\s*${threshold}\\b`), `${missionId}: mist threshold ${threshold}`);
  assert.match(source, /evidence:\s*'[^']*Leerlingbewijs:[^']*Docentbewijs:/s, `${missionId}: evidence moet leerling- en docentbewijs noemen`);
}

for (const [missionId, path] of j2p1Configs.slice(0, 4)) {
  const source = read(path);
  const criteriaCount = (source.match(/textEvidenceCriteria:\s*\[/g) ?? []).length;
  assert.ok(criteriaCount >= 3, `${missionId}: verwacht textEvidenceCriteria bij alle observatievragen`);
  assert.match(source, /minEvidenceCriteria:\s*2/, `${missionId}: verwacht minimaal twee evidencecriteria`);
}

const dataViewer = read('src/features/missions/templates/data-viewer/DataViewer.tsx');
assert.match(dataViewer, /interface TextEvidenceCriterion/, 'DataViewer moet text evidence criteria typeren');
assert.match(dataViewer, /function evaluateTextEvidence/, 'DataViewer moet text evidence evalueren');
assert.match(dataViewer, /const isMissionComplete =/, 'DataViewer moet expliciete completionstatus berekenen');
assert.match(dataViewer, /onComplete\(isMissionComplete\)/, 'DataViewer moet completion aan evidence en score koppelen');
assert.match(dataViewer, /completionStatus=\{completionStatus\}/, 'DataViewer moet completionstatus tonen');

const scenarioEngine = read('src/features/missions/templates/scenario-engine/ScenarioEngine.tsx');
assert.match(scenarioEngine, /completionThreshold/, 'ScenarioEngine moet mission threshold gebruiken');
assert.match(scenarioEngine, /onComplete\(isMissionComplete\)/, 'ScenarioEngine moet completion aan threshold koppelen');

const reviewArena = read('src/features/missions/templates/review-arena/ReviewArena.tsx');
assert.match(reviewArena, /score >= round\.maxScore \* 0\.5/, 'ReviewArena follow-up moet bij 50% of hoger openen');
assert.match(reviewArena, /onComplete\(isMissionComplete\)/, 'ReviewArena moet completion aan threshold koppelen');

const completionScreen = read('src/features/missions/templates/shared/CompletionScreen.tsx');
assert.match(completionScreen, /completionStatus\?:/, 'CompletionScreen moet optionele completionstatus accepteren');
assert.match(completionScreen, /Nog niet voltooid|Bewijs compleet/, 'CompletionScreen moet completionstatus zichtbaar maken');

console.log(`J2 P1 workability contract check passed for ${j2p1Configs.length} missions.`);
