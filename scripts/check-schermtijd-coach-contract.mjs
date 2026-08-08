import assert from 'node:assert/strict';
import fs from 'node:fs';

const files = {
  debate: fs.readFileSync('src/features/missions/templates/debate-arena/DebateArena.tsx', 'utf8'),
  config: fs.readFileSync('src/features/missions/templates/debate-arena/configs/schermtijd-coach.ts', 'utf8'),
  mapping: fs.readFileSync('src/config/slo-kerndoelen-mapping.ts', 'utf8'),
  agents: fs.readFileSync('src/config/agents/year1.tsx', 'utf8'),
};

assert.match(
  files.debate,
  /const completed = await onComplete\(true\);[\s\S]*if \(completed !== false\)[\s\S]*clearSave\(\)/,
  'Screen Time Coach must retain progress until durable completion succeeds',
);
assert.match(
  files.config,
  /Welke concrete afspraak wil jij zelf proberen om bewuster met je schermtijd om te gaan/,
  'Screen Time Coach must collect the promised reflection on learner behavior',
);
assert.match(
  files.mapping,
  /id: 'schermtijd-coach'[\s\S]{0,160}sloKerndoelen: \['23B'\][\s\S]{0,80}sloVsoKerndoelen: \['20A'\]/,
  'Screen Time Coach mapping must not claim an AI outcome without an AI activity',
);
assert.match(
  files.agents,
  /id: 'schermtijd-coach'[\s\S]{0,1200}goalCriteria: \{ type: 'steps-complete' as const, min: 5 \}/,
  'Screen Time Coach agent card and canonical five-phase goal must agree',
);

console.log('Screen Time Coach contract checks passed');
