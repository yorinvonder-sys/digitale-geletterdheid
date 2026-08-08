import assert from 'node:assert/strict';
import fs from 'node:fs';

const files = {
  builder: fs.readFileSync('src/features/missions/templates/builder-canvas/BuilderCanvas.tsx', 'utf8'),
  config: fs.readFileSync('src/features/missions/templates/builder-canvas/configs/website-bouwer.ts', 'utf8'),
  agent: fs.readFileSync('src/config/agents/year1.tsx', 'utf8'),
};

assert.match(
  files.builder,
  // Het argument mag varieren (main geeft een scoredrempel door in plaats van
  // `true`); de eis is dat er op bevestiging wordt gewacht voor het wissen.
  /const completed = await onComplete\([^)]*\);[\s\S]*if \(completed !== false\)[\s\S]*clearSave\(\)/,
  'Website Bouwer must retain local work until durable completion succeeds',
);
assert.match(
  files.builder,
  /textEntry: config\.missionId === 'website-bouwer'[\s\S]*\? undefined/,
  'Website Bouwer must not send raw assignment text to the AI coach context',
);
assert.match(
  files.config,
  /Gebruik geen echte naam, adres, school, foto of contactgegevens/,
  'Website Bouwer must explicitly prohibit real personal data',
);
assert.equal(
  /iets echts over jou|met jouw naam|met mijn naam/.test(files.config),
  false,
  'Website Bouwer visible copy must not solicit real learner identity',
);
assert.match(
  files.agent,
  /werk in het <style>-blok in de <head>/,
  'Website Bouwer coach and visible CSS instruction must agree',
);

console.log('Website Bouwer contract checks passed');
