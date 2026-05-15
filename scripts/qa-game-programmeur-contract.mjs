import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const year1 = read('src/config/agents/year1.tsx');
const shared = read('src/config/agents/shared.tsx');
const useAgentLogic = read('src/hooks/useAgentLogic.ts');
const useChatSession = read('src/hooks/useChatSession.ts');
const gamePreview = read('src/features/games/GamePreview.tsx');
const gameGallery = read('src/features/games/GameGallery.tsx');
const aiLab = read('src/features/ai-lab/AiLab.tsx');

const gameRoleMatch = year1.match(/id: 'game-programmeur'[\s\S]*?initialCode: `/);
assert.ok(gameRoleMatch, 'Game Programmeur role block should exist');
const gameRole = gameRoleMatch[0];

assert.match(
  gameRole,
  /goalCriteria:\s*\{\s*type:\s*'steps-complete',\s*min:\s*5\s*\}/,
  'Game Programmeur should use 5 completed steps as its goal criterion',
);

assert.match(
  gameRole,
  /---STEP_COMPLETE:5---/,
  'Game Programmeur AI instructions should explicitly allow completing step 5',
);

assert.match(
  gameRole,
  /variabele|regel|codewijziging/i,
  'Game Programmeur AI instructions should require visible code evidence before step completion',
);

assert.doesNotMatch(
  shared,
  /Waarbij X het stapnummer is \(1, 2, of 3\)/,
  'Shared step-completion instruction should not hardcode only steps 1-3',
);

assert.match(
  useAgentLogic,
  /Stap\s+\$\{index \+ 1\}/,
  'Mission context should include numbered step details for the AI',
);

assert.match(
  useChatSession,
  /Stap\s+\$\{index \+ 1\}/,
  'Refreshed chat session context should keep numbered step details',
);

assert.doesNotMatch(
  useAgentLogic,
  /Hier is de start-code van de game/,
  'Game Programmeur start code should not be sent as an unawaited initial AI message',
);

assert.match(
  gamePreview,
  /completedSteps\?\s*:\s*number\[\]/,
  'GamePreview should accept completedSteps for mission-completion UI',
);

assert.match(
  gamePreview,
  /completedSteps\.length\s*>=\s*5[\s\S]*setShowConclusion\(true\)/,
  'GamePreview should show completion only after all five Game Programmeur steps are complete',
);

const loadProgressBlock = useAgentLogic.match(/if \(!skipLoading(?: && !cloudSyncDisabled)?\) \{[\s\S]*?Promise\.race/);
assert.ok(loadProgressBlock, 'useAgentLogic should have a cloud-load branch');
assert.match(
  loadProgressBlock[0],
  /selectedRole\.id === 'game-programmeur'[\s\S]*setActiveGameCode\(selectedRole\.initialCode\)/,
  'Game Programmeur should seed Super Code Jumper before async progress loading to avoid flashing the generic preview',
);

assert.match(
  aiLab,
  /selectedRole\?\.id === 'game-programmeur' && \(activeGameCode \|\| selectedRole\.initialCode\)/,
  'AiLab should render GamePreview from initialCode on the first Game Programmeur paint',
);

assert.match(
  gamePreview,
  /hasUserPublishedGame/,
  'Publishing should check for duplicate or nearly unchanged games before publishGame',
);

assert.match(
  gamePreview,
  /<Toast\b/,
  'Save and publish outcomes should be shown with the shared Toast component',
);

assert.match(
  gamePreview,
  /aria-label="Opslaan in Bibliotheek"/,
  'Save button should have a stable aria-label',
);

assert.match(
  gamePreview,
  /aria-label="Vorige versie herstellen"/,
  'Undo button should have a stable aria-label',
);

assert.match(
  gamePreview,
  /aria-label="Herstel originele game"/,
  'Reset button should have a stable aria-label',
);

assert.match(
  gamePreview,
  /aria-label="Herstart game-preview"/,
  'Restart button should have a stable aria-label',
);

assert.doesNotMatch(
  aiLab,
  /Typ hieronder om de code te veranderen!/,
  'The overlapping Game Programmeur tooltip should be removed from the mission UI',
);

assert.match(
  gameGallery,
  /flex-wrap|overflow-x-auto/,
  'Gallery filters should remain usable on narrow/mobile viewports',
);

console.log('Game Programmeur contract checks passed');
