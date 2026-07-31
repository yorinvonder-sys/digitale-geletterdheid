import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('ScenarioEngine-feedbackactie heeft een touchdoel van minimaal 44px', async () => {
  const source = await readFile('src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx', 'utf8');
  assert.match(
    source,
    /data-qa="scenario-next"[\s\S]{0,400}className="[^"]*min-h-\[44px\][^"]*"/,
  );
});

test('eerste Mail Detective-signaal gebruikt korte A2/B1-zinnen', async () => {
  const source = await readFile('src/features/missions/templates/scenario-engine/configs/mail-detective.ts', 'utf8');

  // Lees de daadwerkelijke beschrijving uit de config in plaats van letterlijke
  // zinnen te matchen: de copy mag om didactische redenen wijzigen (#248
  // maakte de kaarten platte waarnemingen), het taalniveau niet.
  const roundStart = source.indexOf("id: 'signalen-herkennen'");
  assert.notEqual(roundStart, -1, "ronde 'signalen-herkennen' niet gevonden in mail-detective.ts");
  const items = source.slice(source.indexOf('items: [', roundStart));
  const match = /description:\s*'((?:[^'\\]|\\.)*)'/.exec(items);
  assert.ok(match, 'beschrijving van het eerste signaal niet gevonden');
  const description = match[1].replace(/\\'/g, "'");

  assert.doesNotMatch(source, /De mail beweert van je docent te komen, maar/);

  const { longestSentence } = await import('../evaluation/language-evaluator.mjs');
  const longest = longestSentence(description);
  assert.ok(longest.words < 20, `langste zin telt ${longest.words} woorden: "${longest.sentence}"`);
});

test('Code Denker legt decompositie uit in korte A2/B1-zinnen', async () => {
  const source = await readFile('src/features/missions/templates/scenario-engine/configs/code-denker.ts', 'utf8');
  const description = [
    'De voorbeelden gebruiken vier bouwstenen van computational thinking.',
    'Decompositie deelt een groot probleem op in kleine stukken.',
    'Patroonherkenning zoekt herhalingen.',
    'Abstractie bewaart alleen belangrijke details.',
    'Een algoritme is een stap-voor-staprecept.',
    'Welke voorbeelden tonen decompositie?',
    'Selecteer ze.',
  ].join(' ');

  assert.doesNotMatch(source, /Elk voorbeeld hieronder past bij één van de vier bouwstenen/);
  for (const sentence of description.split(/(?<=[.?])\s+/)) {
    assert.match(source, new RegExp(sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  const { longestSentence } = await import('../evaluation/language-evaluator.mjs');
  assert.equal(longestSentence(description).words < 20, true);
});
