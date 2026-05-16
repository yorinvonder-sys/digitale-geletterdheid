import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const j2p2Goals = [
  ['algorithm-architect', 'src/features/missions/templates/simulation-lab/configs/algorithm-architect.ts'],
  ['web-developer', 'src/features/missions/templates/builder-canvas/configs/web-developer.ts'],
  ['network-navigator', 'src/features/missions/templates/data-viewer/configs/network-navigator.ts'],
  ['app-prototyper', 'src/features/missions/templates/builder-canvas/configs/app-prototyper.ts'],
  ['bug-hunter', 'src/features/missions/templates/simulation-lab/configs/bug-hunter.ts'],
  ['automation-engineer', 'src/features/missions/templates/builder-canvas/configs/automation-engineer.ts'],
  ['code-reviewer', 'src/features/missions/templates/simulation-lab/configs/code-reviewer.ts'],
  ['privacy-by-design', 'src/features/missions/templates/simulation-lab/configs/privacy-by-design.ts'],
  ['wachtwoord-warrior', 'src/features/missions/templates/puzzle-lab/configs/wachtwoord-warrior.ts'],
  ['code-review-2', 'src/features/missions/templates/review-arena/configs/code-review-2.ts'],
];

for (const [missionId, file] of j2p2Goals) {
  const source = read(file);
  assert.match(source, /missionGoal:\s*\{/, `${missionId} should define a template-level missionGoal`);
  assert.match(source, /primaryGoal:\s*'/, `${missionId} should define primaryGoal`);
  assert.match(source, /criteria:\s*\{/, `${missionId} should define criteria`);
  assert.match(source, /evidence:\s*'/, `${missionId} should define teacher-visible evidence`);
}

const reviewArena = read('src/features/missions/templates/review-arena/ReviewArena.tsx');
assert.match(reviewArena, /MissionGoal/, 'ReviewArena should import or type MissionGoal');
assert.match(reviewArena, /missionGoal\?:\s*MissionGoal/, 'ReviewArenaConfig should accept missionGoal');
assert.match(reviewArena, /getMissionGoal\(config\.missionId\)/, 'ReviewArena should use shared missionGoal fallback');
assert.match(reviewArena, /goal=\{config\.missionGoal \?\? getMissionGoal\(config\.missionId\)\}/, 'ReviewArena IntroScreen should receive a goal');

const devPreview = read('src/features/dev-tools/DevMissionPreview.tsx');
assert.match(devPreview, /AccessControlEngineerMission/, 'DevMissionPreview should import access-control dedicated mission');
assert.match(devPreview, /missionId === 'access-control-engineer'[\s\S]*<AccessControlEngineerMission/, 'access-control preview should use the dedicated component');

const introScreen = read('src/features/missions/templates/shared/IntroScreen.tsx');
assert.match(introScreen, /overflow-y-auto/, 'IntroScreen should allow scrolling on short or portrait viewports');
assert.ok(
  introScreen.indexOf('<button') < introScreen.indexOf('{features && features.length > 0'),
  'IntroScreen start CTA should appear before long feature lists',
);

const puzzleLab = read('src/features/missions/templates/puzzle-lab/PuzzleLab.tsx');
assert.match(puzzleLab, /fixed inset-x-4 bottom-4/, 'PuzzleLab mobile start CTA should be fixed near the bottom');
assert.match(puzzleLab, /pb-24 sm:pb-4/, 'PuzzleLab intro should reserve room for fixed mobile CTA');

const engines = [
  ['simulation-lab', 'src/features/missions/templates/simulation-lab/SimulationLab.tsx', /phase === 'results'[\s\S]*onComplete=\{handleComplete\}/],
  ['builder-canvas', 'src/features/missions/templates/builder-canvas/BuilderCanvas.tsx', /phase === 'results'[\s\S]*onComplete=\{handleComplete\}/],
  ['data-viewer', 'src/features/missions/templates/data-viewer/DataViewer.tsx', /phase === 'results'[\s\S]*onComplete=\{handleComplete\}/],
  ['puzzle-lab', 'src/features/missions/templates/puzzle-lab/PuzzleLab.tsx', /phase === 'results'[\s\S]*onComplete\(true\)/],
  ['review-arena', 'src/features/missions/templates/review-arena/ReviewArena.tsx', /phase === 'complete'[\s\S]*onComplete=\{handleComplete\}/],
  ['access-control-engineer', 'src/features/missions/AccessControlEngineerMission.tsx', /onComplete\(true\)/],
];

for (const [engine, file, completionPattern] of engines) {
  const source = read(file);
  assert.match(source, completionPattern, `${engine} should expose a completion path`);
}

console.log('J2 P2 workability contract checks passed');
