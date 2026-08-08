import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const pitch = read('src/features/missions/review/PitchPoliceMission.tsx');
const app = read('src/app/AuthenticatedApp.tsx');
const goals = read('src/config/missionGoals.ts');
const slo = read('src/config/slo-kerndoelen-mapping.ts');
const basis = read('src/config/basisvaardigheden-mapping.ts');
const curriculum = read('src/config/curriculum.ts');

assert.match(
  pitch,
  /const completionLockRef = useRef\(false\)/,
  'Pitch Police completion must have a synchronous double-submit lock',
);
assert.match(
  pitch,
  /const completed = await onComplete\(true\);[\s\S]*if \(completed === true\) clearSave\(\);/,
  'Pitch Police must clear autosave only after a successful auth-bound completion',
);
assert.match(
  pitch,
  /disabled=\{isCompleting\}/,
  'Pitch Police completion button must be disabled while saving',
);
assert.doesNotMatch(
  pitch,
  /clearSave\(\);\s*onComplete\(true\)/,
  'Pitch Police must not clear autosave before completion',
);
assert.match(
  app,
  /if \(success\) return handleMissionComplete\('pitch-police'\);/,
  'Pitch Police shell must return the auth-bound completion result',
);

const goalBlock = goals.slice(goals.indexOf("'pitch-police':"), goals.indexOf("'prompt-master':"));
assert.match(goalBlock, /min: 8/);
assert.match(goalBlock, /alle acht slides een passende oplossing/);
assert.match(goalBlock, /Alle acht slides zijn verbeterd/);
assert.doesNotMatch(goalBlock, /uitleggen|noemen/);

const sloP2 = slo.indexOf('// Periode 2: AI & Creatie');
const sloPitch = slo.indexOf("id: 'pitch-police'");
assert.ok(sloPitch > sloP2, 'Pitch Police SLO mapping must be placed in the J1P2 section');

const basisP2 = basis.indexOf('// LEERJAAR 1 — Periode 2: AI & Creatie');
const basisPitch = basis.indexOf("missionId: 'pitch-police'");
assert.ok(basisPitch > basisP2, 'Pitch Police basic-skills mapping must be placed in the J1P2 section');
assert.match(basis.slice(basisPitch, basisPitch + 220), /kiest per slide een passende verbetering/);

const curriculumP2 = curriculum.slice(curriculum.indexOf('2: {', curriculum.indexOf('yearGroups')), curriculum.indexOf('3: {', curriculum.indexOf('yearGroups')));
assert.match(curriculumP2, /reviewMissions: \[[\s\S]*'pitch-police'/);

console.log('Pitch Police contract checks passed');
