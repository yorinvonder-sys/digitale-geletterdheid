import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const aiLab = read('src/features/ai-lab/AiLab.tsx');
const chatbot = read('src/features/ai-lab/previews/ChatbotTrainerPreview.tsx');

for (const missionId of [
  'chatbot-trainer',
  'ai-tekengame',
]) {
  assert.match(
    aiLab,
    new RegExp(`completeMission\\?\\.\\('${missionId.replaceAll('-', '\\-')}'\\)`),
    `${missionId} should use the auth-bound app-shell completion callback`,
  );
}

assert.match(
  aiLab,
  /completeMission[\s\S]*await completeMission\('ai-beleid-brainstorm'\)[\s\S]*: devPreviewMode/,
  'ai-beleid-brainstorm should fail closed without the auth-bound callback outside dev preview',
);

assert.match(
  aiLab,
  /const completed = completeMission[\s\S]*await completeMission\(selectedRole\.id\)[\s\S]*: devPreviewMode/,
  'J1P2 automatic completion must fail closed without an app-shell callback outside dev preview',
);
assert.doesNotMatch(
  aiLab,
  /Award XP based on mission difficulty[\s\S]*saveProgress\(\{[\s\S]*missionsCompleted/,
  'generic AI Lab completion must not persist client-authored completion state',
);
assert.match(
  aiLab,
  /catch \(error\) \{[\s\S]*autoCompletionAttemptsRef\.current\.delete\(selectedRole\.id\)/,
  'failed automatic completion must remain retryable without updating local completion',
);

assert.match(
  aiLab,
  /isDedicatedProgressMission\(selectedRole\.id\)/,
  'Dedicated mission state must not be overwritten by the generic AI Lab autosave',
);

assert.match(
  aiLab,
  /onComplete=\{async \(passed, score\) => \{[\s\S]*return completeMission[\s\S]*completeMission\(missionId\)[\s\S]*: devPreviewMode/,
  'assessment completion must return the durable app-shell outcome',
);
assert.doesNotMatch(
  aiLab,
  /void completeMission\?\.\('review-week-2'\)/,
  'review-week-2 completion must not be fire-and-forget',
);

assert.doesNotMatch(
  aiLab,
  /onLevelComplete=\{\(level\) => handleAwardXP\(100, `Chatbot Level/,
  'Chatbot completion must not use a repeatable client-side XP callback',
);

assert.match(
  chatbot,
  /const completed = await onLevelComplete\?\.\(1\);[\s\S]*if \(completed !== false\) setShowConclusion\(false\);/,
  'Chatbot conclusion must wait for durable completion before closing',
);

assert.match(
  chatbot,
  /flex-col md:flex-row/,
  'Chatbot training panels should stack on mobile',
);

assert.match(
  chatbot,
  /w-full md:w-64/,
  'Chatbot intent panel should fit the mobile viewport',
);

assert.match(
  chatbot,
  /w-full md:w-80/,
  'Chatbot test panel should fit the mobile viewport',
);

console.log('J1P2 dedicated completion checks passed');
