import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('bouwt Simulation Lab-observaties uitsluitend uit zichtbare toestand', async () => {
  const { buildSimulationObservation } = await import('../missions/simulation-lab.mjs');
  const observation = buildSimulationObservation({
    heading: 'Wat verandert er?',
    instruction: 'Pas eerst een instelling aan en kies daarna een antwoord.',
    scoreText: '0/100 punten (0%)',
    options: [{ id: '0', text: 'Meer data' }, { id: '1', text: 'Minder data' }],
    flags: { question: true },
  });
  assert.equal(observation.phase, 'round');
  assert.equal(observation.roundType, 'simulation-question');
  assert.deepEqual(observation.options.map(({ id }) => id), ['0', '1']);
  assert.equal('correctAnswer' in observation, false);
  assert.equal('config' in observation, false);
});

test('herkent intro, zekerheid, verdieping, navigatie en voltooiing', async () => {
  const { buildSimulationObservation } = await import('../missions/simulation-lab.mjs');
  const base = { heading: '', instruction: '', scoreText: '', options: [] };
  assert.equal(buildSimulationObservation({ ...base, flags: { intro: true } }).phase, 'intro');
  assert.equal(buildSimulationObservation({ ...base, flags: { confidence: true } }).phase, 'confidence');
  assert.equal(buildSimulationObservation({ ...base, flags: { followUp: true } }).phase, 'follow-up');
  assert.equal(buildSimulationObservation({ ...base, flags: { next: true } }).roundType, 'simulation-next');
  assert.equal(buildSimulationObservation({ ...base, flags: { completion: true } }).phase, 'completion');
});

test('registry ondersteunt alle vijf Simulation Lab-missies', async () => {
  const { getMissionAdapter } = await import('../missions/registry.mjs');
  for (const missionId of ['privacy-by-design', 'bug-hunter', 'code-reviewer', 'ai-spiegel', 'algorithm-architect']) {
    assert.equal(getMissionAdapter(missionId).id, 'simulation-lab');
  }
});

test('adapter gebruikt stabiele QA-selectors en bevat geen antwoordoracle', async () => {
  const source = await readFile('tests/ai-students/missions/simulation-lab.mjs', 'utf8');
  assert.match(source, /data-qa/);
  assert.match(source, /activeQuestion\.locator/);
  assert.doesNotMatch(source, /correctAnswer|computeVisuals|\.\/configs/);
});

test('Simulation Lab-bedieningen halen de touchhoogte van 44px', async () => {
  const component = await readFile('src/features/missions/templates/simulation-lab/SimulationLab.tsx', 'utf8');
  const parameters = await readFile('src/features/missions/templates/simulation-lab/sub/ParameterControl.tsx', 'utf8');
  const questions = await readFile('src/features/missions/templates/simulation-lab/sub/QuestionCard.tsx', 'utf8');
  const followUp = await readFile('src/features/missions/templates/shared/FollowUpCard.tsx', 'utf8');
  assert.match(component, /data-qa="simulation-next"[\s\S]{0,500}min-h-\[44px\]/);
  assert.match(parameters, /data-qa="simulation-parameter-option"[\s\S]{0,500}min-h-\[44px\]/);
  assert.match(questions, /data-qa="simulation-answer"[\s\S]{0,500}min-h-\[44px\]/);
  assert.match(questions, /data-qa="simulation-submit"[\s\S]{0,500}min-h-\[44px\]/);
  assert.match(component, />\s*Vorige[\s\S]{0,1000}data-qa="simulation-next"/);
  assert.match(component, /onClick=\{\(\) => setState[\s\S]{0,500}min-h-\[44px\]/);
  assert.match(followUp, /data-qa="followup-option"[\s\S]{0,500}min-h-\[44px\]/);
});

test('runner controleert Simulation Lab-voortgang na een stabiele stapwissel', async () => {
  const source = await readFile('tests/ai-students/browser/run-scenario-pilot.mjs', 'utf8');
  assert.match(source, /'simulation-lab'/);
});
