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

test('failed completion cannot fall through to the completion side effect', async () => {
  const completion = await source('src/features/missions/templates/shared/CompletionScreen.tsx');
  assert.match(completion, /onClick=\{passed \? onComplete : onRetry\}/);
  assert.match(completion, /disabled=\{!passed && !onRetry\}/);
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

test('nieuwe ScenarioEngine-rondevarianten expose stable hooks', async () => {
  const spotTheFlags = await source('src/features/missions/templates/scenario-engine/sub/SpotTheFlagsRound.tsx');
  const inboxTriage = await source('src/features/missions/templates/scenario-engine/sub/InboxTriageRound.tsx');
  const orderDrag = await source('src/features/missions/templates/scenario-engine/sub/OrderDragRound.tsx');

  assert.match(spotTheFlags, /data-qa="scenario-option"/);
  assert.match(spotTheFlags, /data-qa="scenario-submit"/);

  assert.match(inboxTriage, /data-qa="scenario-binary-accept"/);
  assert.match(inboxTriage, /data-qa="scenario-binary-reject"/);
  assert.match(inboxTriage, /data-scenario-item-id=\{item\.id\}/);
  assert.match(inboxTriage, /data-qa="scenario-submit"/);

  assert.match(orderDrag, /data-qa="scenario-drag-item"/);
  assert.match(orderDrag, /data-qa="scenario-drag-up"/);
  assert.match(orderDrag, /data-qa="scenario-drag-down"/);
  assert.match(orderDrag, /data-scenario-item-id=\{itemId\}/);
  assert.match(orderDrag, /data-qa="scenario-submit"/);
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
