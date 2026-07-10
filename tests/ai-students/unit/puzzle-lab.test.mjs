import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('bouwt Puzzle Lab-observaties uitsluitend uit zichtbare informatie', async () => {
  const { buildPuzzleObservation } = await import('../missions/puzzle-lab.mjs');
  const observation = buildPuzzleObservation({
    heading: 'Kraak de code',
    instruction: 'Gebruik de zichtbare aanwijzingen.',
    scoreText: '0 pts',
    inputVisible: true,
    options: [],
    flags: { intro: false, completion: false, transitioning: false },
  });

  assert.equal(observation.phase, 'round');
  assert.equal(observation.roundType, 'puzzle-text');
  assert.equal(observation.heading, 'Kraak de code');
  assert.equal('answer' in observation, false);
});

test('taalmeting behoudt zichtbare regeleinden van logblokken', async () => {
  const { longestSentence } = await import('../evaluation/language-evaluator.mjs');
  const visibleLog = [
    'Bekijk de volgende regels:',
    '2024-01-22 02:47:13 | LOGIN FAILED | user: admin',
    '2024-01-22 02:47:15 | LOGIN FAILED | user: admin',
    'Wat voor type aanval zie je hier?',
  ].join('\n');
  assert.equal(longestSentence(visibleLog).words < 28, true);
});

test('herkent intro, meerkeuze, overgang en voltooiing', async () => {
  const { buildPuzzleObservation } = await import('../missions/puzzle-lab.mjs');
  const base = { heading: '', instruction: '', scoreText: '', inputVisible: false, options: [] };
  assert.equal(buildPuzzleObservation({ ...base, flags: { intro: true } }).phase, 'intro');
  assert.equal(buildPuzzleObservation({ ...base, options: [{ id: '0', text: 'A' }], flags: {} }).roundType, 'puzzle-choice');
  assert.equal(buildPuzzleObservation({ ...base, skipAvailable: true, flags: {} }).roundType, 'puzzle-recovery');
  assert.equal(buildPuzzleObservation({ ...base, flags: { transitioning: true } }).phase, 'transition');
  assert.equal(buildPuzzleObservation({ ...base, flags: { completion: true } }).phase, 'completion');
});

test('Puzzle Lab-adapter gebruikt toegankelijke selectors en lekt geen antwoordmetadata', async () => {
  const source = await readFile('tests/ai-students/missions/puzzle-lab.mjs', 'utf8');
  assert.match(source, /getByRole/);
  assert.match(source, /getByPlaceholder/);
  assert.doesNotMatch(source, /\.answer|validator|correctAnswer|data-correct/);
});

test('alle Puzzle Lab-bedieningen hebben een touchhoogte van minimaal 44px', async () => {
  const source = await readFile('src/features/missions/templates/puzzle-lab/PuzzleLab.tsx', 'utf8');
  for (const qa of ['puzzle-option', 'puzzle-input', 'puzzle-submit', 'puzzle-hint', 'puzzle-skip']) {
    assert.match(source, new RegExp(`data-qa="${qa}"[\\s\\S]{0,800}min-h-\\[44px\\]`));
  }
});

test('Puzzle Lab behoudt regeleinden in puzzelbeschrijvingen', async () => {
  const source = await readFile('src/features/missions/templates/puzzle-lab/PuzzleLab.tsx', 'utf8');
  assert.match(source, /<p className="[^"]*whitespace-pre-line[^"]*">\s*\{puzzle\.description\}/);
});

test('registry ondersteunt precies de vijf Puzzle Lab-missies naast de pilot', async () => {
  const { getMissionAdapter } = await import('../missions/registry.mjs');
  for (const id of ['encryption-expert', 'cyber-detective', 'wachtwoord-warrior', 'data-handelaar', 'security-auditor']) {
    assert.equal(getMissionAdapter(id).id, 'puzzle-lab');
  }
  assert.equal(getMissionAdapter('mail-detective').id, 'scenario-engine');
  assert.throws(() => getMissionAdapter('website-bouwer'), /ondersteunt/i);
});
