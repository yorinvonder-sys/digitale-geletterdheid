import assert from 'node:assert/strict';
import test from 'node:test';

test('taalevaluatie voegt afzonderlijke zichtbare tekstblokken niet samen', async () => {
  const { longestSentence } = await import('../evaluation/language-evaluator.mjs');
  const result = longestSentence('SELECTEER MINIMAAL 3 OPTIES\nKorte titel zonder punt\nDit is een korte beschrijving.');
  assert.equal(result.words, 5);
  assert.equal(result.sentence, 'Dit is een korte beschrijving.');
});

test('lange A2/B1-zin wordt als simulatie met menselijke validatie gemarkeerd', async () => {
  const { evaluateLanguageLoad } = await import('../evaluation/language-evaluator.mjs');
  const persona = { id: 'taalzwakke-tess', readingLevel: 'a2-b1' };
  const sentence = `${Array.from({ length: 30 }, (_, index) => `woord${index}`).join(' ')}.`;
  const issues = evaluateLanguageLoad({
    missionId: 'mail-detective', persona, stepId: 'fase-1', visibleText: sentence, evidence: 'screenshot.png',
  });
  assert.equal(issues.length, 1);
  assert.equal(issues[0].evidenceType, 'SIMULATION');
  assert.equal(issues[0].requiresHumanValidation, true);
  assert.equal(issues[0].pedagogicalImpact, true);
  assert.match(issues[0].actualBehavior, /30 woorden/);
});
