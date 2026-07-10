import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('bouwt semantische observaties zonder antwoordmetadata', async () => {
  const { buildObservation } = await import('../missions/scenario-engine.mjs');
  const observation = buildObservation({
    heading: 'Wat is er verdacht?',
    instruction: 'Selecteer minimaal 3 opties',
    scoreText: '0 pts',
    controls: {
      select: [{ id: '1', text: 'Afzender controleren' }, { id: '2', text: 'Link openen' }],
      order: [], binaryAccept: [], followUp: [], confidence: [],
    },
    flags: { intro: false, completion: false, feedback: false },
  });

  assert.equal(observation.phase, 'round');
  assert.equal(observation.roundType, 'select-correct');
  assert.equal(observation.minimumSelections, 3);
  assert.equal(observation.options.length, 2);
  assert.equal('correct' in observation.options[0], false);
});

test('herkent intro, feedback, confidence, verdieping en voltooiing', async () => {
  const { buildObservation } = await import('../missions/scenario-engine.mjs');
  const empty = { heading: '', instruction: '', scoreText: '', controls: { select: [], order: [], binaryAccept: [], followUp: [], confidence: [] } };
  assert.equal(buildObservation({ ...empty, flags: { intro: true } }).phase, 'intro');
  assert.equal(buildObservation({ ...empty, flags: { feedback: true } }).phase, 'feedback');
  assert.equal(buildObservation({ ...empty, controls: { ...empty.controls, confidence: [{ id: '2', text: 'Zeker' }] }, flags: {} }).phase, 'confidence');
  assert.equal(buildObservation({ ...empty, controls: { ...empty.controls, followUp: [{ id: '0', text: 'Optie' }] }, flags: {} }).phase, 'follow-up');
  assert.equal(buildObservation({ ...empty, flags: { completion: true }, scoreText: '75/100 punten (75%)' }).phase, 'completion');
});

test('adapter gebruikt toegankelijke of data-qa-selectors en geen CSS-klassepad', async () => {
  const source = await readFile('tests/ai-students/missions/scenario-engine.mjs', 'utf8');
  assert.match(source, /getByRole/);
  assert.match(source, /data-qa/);
  assert.doesNotMatch(source, /locator\(['"]\./);
  assert.doesNotMatch(source, /data-correct-answer/);
});
