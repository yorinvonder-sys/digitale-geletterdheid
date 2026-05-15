import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

const checks = [
  {
    name: 'website-bouwer has a server-side AI system instruction',
    ok: () => read('supabase/functions/_shared/systemInstructions.ts').includes('"website-bouwer"'),
  },
  {
    name: 'binary-choice labels are configurable per round',
    ok: () => {
      const types = read('src/features/missions/templates/scenario-engine/types.ts');
      const ui = read('src/features/missions/templates/scenario-engine/sub/BinaryChoiceRound.tsx');
      const config = read('src/features/missions/templates/scenario-engine/configs/notificatie-ninja.ts');
      return types.includes('acceptLabel') && types.includes('rejectLabel')
        && !ui.includes('✓ Accepteren')
        && !ui.includes('✕ Weigeren')
        && config.includes("acceptLabel: 'Nuttig voor mij'")
        && config.includes("rejectLabel: 'Nuttig voor de app'");
    },
  },
  {
    name: 'builder canvas requires written evidence before step completion',
    ok: () => {
      const builder = read('src/features/missions/templates/builder-canvas/BuilderCanvas.tsx');
      const panel = read('src/features/missions/templates/builder-canvas/sub/StepInstructionPanel.tsx');
      return builder.includes('minTextLength') && builder.includes('textEntries')
        && panel.includes('Schrijf eerst') && panel.includes('canProceed');
    },
  },
  {
    name: 'rapid-fire timeout has an explicit answered state',
    ok: () => {
      const rapid = read('src/features/missions/templates/review-arena/sub/RapidFire.tsx');
      return rapid.includes("type AnswerState") && rapid.includes("'timeout'")
        && !rapid.includes('handleAnswer(null, 0)');
    },
  },
  {
    name: 'match-pairs score accounts for wrong attempts',
    ok: () => {
      const pairs = read('src/features/missions/templates/review-arena/sub/MatchPairs.tsx');
      return pairs.includes('wrongAttempts') && pairs.includes('penalty');
    },
  },
  {
    name: 'debate score model no longer over-counts beyond maxScore',
    ok: () => {
      const debate = read('src/features/missions/templates/debate-arena/DebateArena.tsx');
      return debate.includes('const argumentMax') && debate.includes('reflectionScore');
    },
  },
];

const failed = checks.filter((check) => !check.ok());

for (const check of checks) {
  console.log(`${failed.includes(check) ? 'FAIL' : 'PASS'} ${check.name}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
