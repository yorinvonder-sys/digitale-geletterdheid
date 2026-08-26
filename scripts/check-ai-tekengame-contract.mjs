import assert from 'node:assert/strict';
import fs from 'node:fs';

const files = {
  game: fs.readFileSync('src/features/ai-lab/previews/DrawingGamePreview.tsx', 'utf8'),
  service: fs.readFileSync('src/services/aiProviderService.ts', 'utf8'),
  agent: fs.readFileSync('src/config/agents/year1.tsx', 'utf8'),
};

const analyzeSection = files.service.slice(
  files.service.indexOf('export const analyzeDrawingWithAI'),
  files.service.length,
);

assert.ok(
  analyzeSection.includes("throw error instanceof Error ? error : new Error('AI drawing analysis failed');"),
  'analyzeDrawingWithAI must rethrow failures so DrawingGamePreview can use local canvas analysis',
);
assert.equal(
  analyzeSection.includes('const fallbackGuess = possibleLabels[0]'),
  false,
  'analyzeDrawingWithAI must not fake a successful result by guessing possibleLabels[0]',
);
assert.equal(
  analyzeSection.includes('(Offline modus)'),
  false,
  'drawing analysis service must not return a misleading offline success message',
);
assert.ok(
  files.game.includes("aria-hidden={gamePhase === 'draw'}"),
  'hidden AI explanation sidebar must be aria-hidden during the draw phase',
);
// Het missiedoel moet de twee harde spelregels noemen (10 rondes, 45 seconden),
// maar de exacte formulering mag verbeteren. Deze check pinde eerder op één
// letterlijke zin en viel daardoor om zodra de copy — inhoudelijk juister —
// werd bijgewerkt; nu toetst hij de belofte zelf.
const tekengameObjective = files.agent.match(/missionObjective: '([^']*[Tt]eken[^']*)'/)?.[1] ?? '';
assert.match(
  tekengameObjective,
  /\b10\b/,
  'AI Tekengame mission objective must promise the 10 rounds the game delivers',
);
assert.match(
  tekengameObjective,
  /\b45\b/,
  'AI Tekengame mission objective must promise the 45-second timer the game enforces',
);
assert.ok(
  files.agent.includes('Je krijgt een woord en hebt 45 seconden om te tekenen.'),
  'AI Tekengame step copy must match the 45-second timer',
);
assert.match(
  files.game,
  /const completed = await onLevelComplete\?\.\(1\);[\s\S]*if \(completed !== false\)\s*\{?\s*setShowConclusion\(false\);/,
  'AI Tekengame conclusion must wait for durable completion before closing',
);
assert.doesNotMatch(
  files.game,
  /setShowConclusion\(true\);\s*if \(onLevelComplete\) onLevelComplete\(1\);/,
  'AI Tekengame must not fire completion before the learner reads its conclusion',
);
assert.match(
  files.game,
  /flex-col md:flex-row/,
  'AI Tekengame analysis layout should stack on mobile',
);
assert.match(
  files.game,
  /w-full md:w-64/,
  'AI Tekengame educational panel should fit the mobile viewport',
);
assert.match(
  files.game,
  /aria-label="Terug naar menu"/,
  'AI Tekengame exit control should have an accessible name',
);
assert.match(
  files.game,
  /aria-label=\{`Tekencanvas voor/,
  'AI Tekengame canvas should have an accessible label',
);

console.log('AI Tekengame contract checks passed');
