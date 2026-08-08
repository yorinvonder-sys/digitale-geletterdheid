import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('src/features/missions/review/CloudCleanerMission.tsx', 'utf8');
const appShell = fs.readFileSync('src/app/AuthenticatedApp.tsx', 'utf8');

assert.match(
  source,
  /useState\(\(\) => savedState\.remainingFileIds\.length === 0\)/,
  'Cloud Cleaner must restore its completion CTA after reload with zero files remaining',
);
assert.ok(
  (source.match(/role="button"/g) || []).length >= 3 &&
    (source.match(/onKeyDown=/g) || []).length >= 3,
  'Cloud Cleaner file, folder and trash interactions must support keyboard selection',
);
assert.equal(
  source.includes('Overslaan'),
  false,
  'Cloud Cleaner reasoning evidence must not be skippable',
);
assert.match(
  source,
  /const completed = await onComplete\(true\);[\s\S]*if \(completed !== false\)[\s\S]*clearSave\(\)/,
  'Cloud Cleaner must retain progress until durable completion succeeds',
);
assert.match(
  source,
  /correctReflections: number;[\s\S]*correctReflections: 0/,
  'Cloud Cleaner must persist whether the learner answered a reflection correctly',
);
assert.match(
  source,
  /correctReflections === 0[\s\S]*FINAL_REFLECTION\.question[\s\S]*disabled=\{correctReflections === 0\}/,
  'Cloud Cleaner must require a final reflection when no earlier reflection was completed',
);
assert.match(
  appShell,
  /if \(activeModule === 'cloud-cleaner'\)[\s\S]*if \(success\) return handleMissionComplete\('cloud-cleaner'\)/,
  'Cloud Cleaner app-shell integration must return the durable completion promise',
);
assert.equal(
  /lg:hidden fixed bottom-4 left-4/.test(source),
  false,
  'Cloud Cleaner mobile folder control must not cover workspace content',
);

console.log('Cloud Cleaner contract checks passed');
