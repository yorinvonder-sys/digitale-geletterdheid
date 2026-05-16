import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const missionGoals = read('src/config/missionGoals.ts');
const templateRegistry = read('src/config/templateRegistry.ts');
const devPreview = read('src/features/dev-tools/DevMissionPreview.tsx');

const j2p3Missions = [
  ['ux-detective', 'data-viewer'],
  ['podcast-producer', 'builder-canvas'],
  ['meme-machine', 'builder-canvas'],
  ['digital-storyteller', 'builder-canvas'],
  ['brand-builder', 'builder-canvas'],
  ['video-editor', 'builder-canvas'],
  ['online-helden', 'scenario-engine'],
  ['media-review', 'review-arena'],
];

for (const [missionId, templateType] of j2p3Missions) {
  const goalStart = missionGoals.indexOf(`'${missionId}': {`);
  expect(goalStart >= 0, `${missionId}: ontbreekt in MISSION_GOALS`);
  if (goalStart >= 0) {
    const rest = missionGoals.slice(goalStart + 1);
    const nextEntry = rest.search(/\n    '[^']+': \{/);
    const goalChunk = missionGoals.slice(goalStart, nextEntry >= 0 ? goalStart + 1 + nextEntry : undefined);
    expect(goalChunk.includes('primaryGoal:'), `${missionId}: mist primaryGoal`);
    expect(goalChunk.includes('criteria:'), `${missionId}: mist criteria`);
    expect(goalChunk.includes('evidence:'), `${missionId}: mist evidence`);
  }

  const registryStart = templateRegistry.indexOf(`'${missionId}':`);
  expect(registryStart >= 0, `${missionId}: ontbreekt in templateRegistry`);
  if (registryStart >= 0) {
    const registryLine = templateRegistry.slice(registryStart, templateRegistry.indexOf('\n', registryStart));
    expect(registryLine.includes(`templateType: '${templateType}'`), `${missionId}: verwacht templateType ${templateType}`);
  }
}

const engineFiles = [
  ['BuilderCanvas', 'src/features/missions/templates/builder-canvas/BuilderCanvas.tsx'],
  ['DataViewer', 'src/features/missions/templates/data-viewer/DataViewer.tsx'],
  ['ScenarioEngine', 'src/features/missions/templates/scenario-engine/ScenarioEngine.tsx'],
  ['ReviewArena', 'src/features/missions/templates/review-arena/ReviewArena.tsx'],
];

for (const [name, path] of engineFiles) {
  const source = read(path);
  expect(source.includes("import { getMissionGoal } from '@/config/missionGoals';"), `${name}: mist getMissionGoal import`);
  expect(source.includes('config.missionGoal ?? getMissionGoal(config.missionId)'), `${name}: mist missionGoal fallback`);
  expect(source.includes('onComplete('), `${name}: mist completion path`);
}

expect(devPreview.includes("isTemplateMission(missionId)"), 'DevMissionPreview: mist template-mission branch');
expect(devPreview.includes('<TemplateMissionRouter'), 'DevMissionPreview: mist TemplateMissionRouter voor template previews');
expect(!devPreview.includes("missionId === 'media-review'") || devPreview.indexOf("missionId === 'media-review'") > devPreview.indexOf('isTemplateMission(missionId)'), 'media-review preview mag geen verborgen assessment override krijgen');

expect(!missionGoals.includes("'sustainability-scanner':"), 'sustainability-scanner mag niet terugkomen in MISSION_GOALS');
expect(!templateRegistry.includes("'sustainability-scanner':"), 'sustainability-scanner mag niet terugkomen in templateRegistry');

if (failures.length > 0) {
  console.error('J2 P3 workability contract check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`J2 P3 workability contract check passed for ${j2p3Missions.length} missions.`);
