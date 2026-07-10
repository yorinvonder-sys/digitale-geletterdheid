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
  const description = [
    'De mail lijkt van je docent te komen.',
    'Het adres eindigt op "@magister-berichten.com", niet op het domein van je school.',
    'Een domein is het stuk na de @, bijvoorbeeld "school.nl".',
  ].join(' ');

  assert.doesNotMatch(source, /De mail beweert van je docent te komen, maar/);
  for (const sentence of description.split(/(?<=[.])\s+/)) assert.match(source, new RegExp(sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  const { longestSentence } = await import('../evaluation/language-evaluator.mjs');
  assert.equal(longestSentence(description).words < 20, true);
});
