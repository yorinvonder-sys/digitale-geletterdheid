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
assert.ok(
  files.agent.includes("missionObjective: 'Teken 10 korte objecten en ontdek welke patronen de AI herkent.'"),
  'AI Tekengame mission objective must match the 10-round game',
);
assert.ok(
  files.agent.includes('Je krijgt een woord en hebt 45 seconden om te tekenen.'),
  'AI Tekengame step copy must match the 45-second timer',
);

console.log('AI Tekengame contract checks passed');
