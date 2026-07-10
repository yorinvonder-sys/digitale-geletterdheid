import assert from 'node:assert/strict';
import test from 'node:test';

import { loadPersona } from '../persona/load-personas.mjs';

const selectObservation = {
  phase: 'round',
  roundType: 'select-correct',
  stepId: 'fase-1',
  instruction: 'Selecteer minimaal 2 opties',
  minimumSelections: 2,
  options: [
    { id: '1', text: 'Officieel schoolbericht zonder link' },
    { id: '2', text: 'Onbekende afzender vraagt om je wachtwoord' },
    { id: '3', text: 'Open meteen de verdachte .exe-bijlage' },
    { id: '4', text: 'Bericht in het beveiligde Magister' },
  ],
};

test('dezelfde persona en seed geven exact dezelfde beslissing', async () => {
  const { decideNextAction } = await import('../behavior/decision-engine.mjs');
  const persona = await loadPersona('snelle-sam');
  const first = decideNextAction({ observation: selectObservation, persona, seed: 'pilot-42' });
  const second = decideNextAction({ observation: selectObservation, persona, seed: 'pilot-42' });
  assert.deepEqual(first, second);
});

test('persona’s maken verschillende keuzes op basis van zichtbaar materiaal', async () => {
  const { decideNextAction } = await import('../behavior/decision-engine.mjs');
  const sam = await loadPersona('snelle-sam');
  const tess = await loadPersona('taalzwakke-tess');
  const samDecision = decideNextAction({ observation: selectObservation, persona: sam, seed: 'pilot-different' });
  const tessDecision = decideNextAction({ observation: selectObservation, persona: tess, seed: 'pilot-different' });

  assert.equal(samDecision.action, 'answer-select');
  assert.equal(tessDecision.action, 'answer-select');
  assert.equal(samDecision.optionIds.length >= 2, true);
  assert.equal(tessDecision.optionIds.length >= 2, true);
  assert.notDeepEqual(samDecision.optionIds, tessDecision.optionIds);
});

test('decision engine gebruikt geen correct-answer oracle', async () => {
  const { decideNextAction } = await import('../behavior/decision-engine.mjs');
  const iris = await loadPersona('ipad-iris');
  const poisoned = {
    ...selectObservation,
    options: selectObservation.options.map((option, index) => ({
      ...option,
      correct: index === 0,
      correctPosition: 99 - index,
    })),
  };
  const clean = decideNextAction({ observation: selectObservation, persona: iris, seed: 'no-oracle' });
  const ignored = decideNextAction({ observation: poisoned, persona: iris, seed: 'no-oracle' });
  assert.deepEqual(ignored, clean);
});

test('ondersteunt volgorde, binaire keuze, confidence en verdieping', async () => {
  const { decideNextAction } = await import('../behavior/decision-engine.mjs');
  const persona = await loadPersona('taalzwakke-tess');
  const base = { persona, seed: 'all-actions' };

  const order = decideNextAction({ ...base, observation: {
    phase: 'round', roundType: 'order-priority', stepId: 'fase-2', options: selectObservation.options,
  } });
  const binary = decideNextAction({ ...base, observation: {
    phase: 'round', roundType: 'binary-choice', stepId: 'fase-3', options: selectObservation.options,
  } });
  const confidence = decideNextAction({ ...base, observation: {
    phase: 'confidence', stepId: 'fase-3', options: [{ id: '1', text: 'Gok' }, { id: '2', text: 'Redelijk zeker' }, { id: '3', text: 'Heel zeker' }],
  } });
  const followUp = decideNextAction({ ...base, observation: {
    phase: 'follow-up', stepId: 'fase-4', options: selectObservation.options,
  } });

  assert.equal(order.action, 'answer-order');
  assert.equal(new Set(order.optionIds).size, selectObservation.options.length);
  assert.equal(binary.action, 'answer-binary');
  assert.equal(Object.keys(binary.choices).length, selectObservation.options.length);
  assert.equal(confidence.action, 'answer-confidence');
  assert.match(confidence.optionId, /^[123]$/);
  assert.equal(followUp.action, 'answer-follow-up');
  assert.equal(selectObservation.options.some((option) => option.id === followUp.optionId), true);
});
