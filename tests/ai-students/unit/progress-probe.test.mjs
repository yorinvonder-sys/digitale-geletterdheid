import assert from 'node:assert/strict';
import test from 'node:test';

test('selecteert alleen de user-scoped of preview-opslagsleutel van de missie', async () => {
  const { selectMissionProgress } = await import('../browser/progress-probe.mjs');
  const storage = {
    dgskills_mission_other: '{"phase":"intro"}',
    dgskills_mission_mail_detective: '{"wrong":true}',
    'dgskills_mission_mail-detective': '{"phase":"active","currentRound":1}',
    'sb-secret-auth-token': '{"access_token":"secret"}',
  };
  assert.deepEqual(selectMissionProgress(storage, 'mail-detective'), {
    key: 'dgskills_mission_mail-detective',
    state: { phase: 'active', currentRound: 1 },
  });
});

test('vergelijking accepteert dezelfde stap na refresh en redigeert payload', async () => {
  const { compareProgress, redactProgress } = await import('../browser/progress-probe.mjs');
  const before = { key: 'dgskills_mission_user_mail-detective', state: { phase: 'active', currentRound: 2, access_token: 'secret' } };
  const after = { key: before.key, state: { phase: 'active', currentRound: 2, access_token: 'secret' } };
  assert.equal(compareProgress(before, after).preserved, true);
  assert.doesNotMatch(JSON.stringify(redactProgress(before)), /secret/);
});
