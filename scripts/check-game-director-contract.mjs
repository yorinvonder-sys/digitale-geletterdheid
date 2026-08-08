import assert from 'node:assert/strict';
import fs from 'node:fs';

const files = {
  mission: fs.readFileSync('src/features/missions/GameDirectorMission.tsx', 'utf8'),
  workspace: fs.readFileSync('src/features/missions/game-director/CodeWorkspace.tsx', 'utf8'),
  block: fs.readFileSync('src/features/missions/game-director/CodeBlock.tsx', 'utf8'),
  app: fs.readFileSync('src/app/AuthenticatedApp.tsx', 'utf8'),
};

assert.match(
  files.block,
  /data-drop-zone="child"[\s\S]*data-parent-id=\{block\.id\}/,
  'Game Director control blocks must expose a touch drop target for nested blocks',
);
assert.match(
  files.block,
  /elementFromPoint\(touch\.clientX, touch\.clientY\)[\s\S]*parentId: dropZone\.dataset\.parentId \|\| null/,
  'Game Director touch-drop must target the deepest drop zone under the learner finger',
);
assert.match(
  files.workspace,
  /addBlockFromDefinition\(definition, customEvent\.detail\?\.parentId \|\| null\)/,
  'Game Director workspace must route touch drops into the selected parent block',
);
assert.match(
  files.mission,
  /blocks: PlacedBlock\[\][\s\S]*blocks: \[\][\s\S]*progress\.blocks \|\| \[\]/,
  'Game Director block code must be part of restart-safe mission progress',
);
assert.match(
  files.mission,
  /const completed = await onComplete\(true\);[\s\S]*if \(completed !== false\)[\s\S]*clearSave\(\)/,
  'Game Director must preserve local progress until durable completion succeeds',
);
assert.match(
  files.app,
  /if \(success\) return handleMissionComplete\('game-director'\)/,
  'Game Director must return its auth-bound completion result to the mission',
);

console.log('Game Director contract checks passed');
