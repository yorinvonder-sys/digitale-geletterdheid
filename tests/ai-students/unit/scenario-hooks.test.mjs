import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function source(file) {
  return readFile(file, 'utf8');
}

test('shared mission screens expose stable intro and completion hooks', async () => {
  const intro = await source('src/features/missions/templates/shared/IntroScreen.tsx');
  const completion = await source('src/features/missions/templates/shared/CompletionScreen.tsx');
  assert.match(intro, /data-qa="mission-intro"/);
  assert.match(intro, /data-qa="mission-start"/);
  assert.match(completion, /data-qa="mission-completion"/);
  assert.match(completion, /data-qa="confirm-completion"/);
});

test('ScenarioEngine round controls expose stable hooks and semantic item ids', async () => {
  const select = await source('src/features/missions/templates/scenario-engine/sub/SelectCorrectRound.tsx');
  const order = await source('src/features/missions/templates/scenario-engine/sub/OrderPriorityRound.tsx');
  const binary = await source('src/features/missions/templates/scenario-engine/sub/BinaryChoiceRound.tsx');
  const feedback = await source('src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx');

  assert.match(select, /data-qa="scenario-option"/);
  assert.match(select, /data-scenario-item-id=\{item\.id\}/);
  assert.match(select, /data-qa="scenario-submit"/);

  assert.match(order, /data-qa="scenario-reset-order"/);
  assert.match(order, /data-qa="scenario-order-item"/);
  assert.match(order, /data-scenario-item-id=\{item\.id\}/);
  assert.match(order, /data-qa="scenario-submit"/);

  assert.match(binary, /data-qa="scenario-binary-accept"/);
  assert.match(binary, /data-qa="scenario-binary-reject"/);
  assert.match(binary, /data-scenario-item-id=\{item\.id\}/);
  assert.match(binary, /aria-label=\{`\$\{acceptLabel\}: \$\{item\.title\}`\}/);
  assert.match(binary, /aria-label=\{`\$\{rejectLabel\}: \$\{item\.title\}`\}/);
  assert.match(binary, /data-qa="scenario-submit"/);

  assert.match(feedback, /data-qa="scenario-feedback"/);
  assert.match(feedback, /data-qa="scenario-next"/);
});

test('confidence and follow-up controls expose stable hooks without answer metadata', async () => {
  const confidence = await source('src/features/missions/templates/shared/ConfidenceRating.tsx');
  const followUp = await source('src/features/missions/templates/shared/FollowUpCard.tsx');
  assert.match(confidence, /data-qa="confidence-option"/);
  assert.match(confidence, /data-confidence-level=\{l\.value\}/);
  assert.match(followUp, /data-qa="followup-option"/);
  assert.match(followUp, /data-followup-option-index=\{i\}/);
  assert.match(followUp, /data-qa="followup-submit"/);
  assert.doesNotMatch(followUp, /data-correct-answer/);
});
