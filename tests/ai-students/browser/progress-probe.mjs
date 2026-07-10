function isSensitiveKey(key) {
  return /token|secret|password|authorization|email/i.test(key);
}

function redactValue(value) {
  if (Array.isArray(value)) return value.map(redactValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, nested]) => [
    key,
    isSensitiveKey(key) ? '[REDACTED]' : redactValue(nested),
  ]));
}

export function selectMissionProgress(storage, missionId) {
  const previewKey = `dgskills_mission_${missionId}`;
  const userSuffix = `_${missionId}`;
  const key = Object.keys(storage).find((candidate) => (
    candidate === previewKey
    || (candidate.startsWith('dgskills_mission_') && candidate.endsWith(userSuffix))
  ));
  if (!key) return null;
  try {
    return { key, state: JSON.parse(storage[key]) };
  } catch {
    return { key, state: null, parseError: true };
  }
}

export function redactProgress(progress) {
  if (!progress) return null;
  return { ...progress, state: redactValue(progress.state) };
}

export function compareProgress(before, after) {
  const beforeState = before?.state;
  const afterState = after?.state;
  const preserved = Boolean(
    beforeState
    && afterState
    && beforeState.phase === afterState.phase
    && beforeState.currentRound === afterState.currentRound
  );
  return {
    preserved,
    before: redactProgress(before),
    after: redactProgress(after),
  };
}

export async function captureLocalProgress(page, missionId) {
  const storage = await page.evaluate(() => Object.fromEntries(
    Object.keys(window.localStorage).map((key) => [key, window.localStorage.getItem(key)])
  ));
  return redactProgress(selectMissionProgress(storage, missionId));
}

export async function verifyRefreshRecovery(page, missionId, observe) {
  await page.waitForTimeout(1_100);
  const before = await captureLocalProgress(page, missionId);
  const observationBefore = await observe(page);
  await page.reload({ waitUntil: 'networkidle' });
  const observationAfter = await observe(page);
  const after = await captureLocalProgress(page, missionId);
  const comparison = compareProgress(before, after);
  return {
    ...comparison,
    sameVisibleStep: observationBefore.stepId === observationAfter.stepId
      && observationBefore.phase === observationAfter.phase,
    observationBefore: { phase: observationBefore.phase, stepId: observationBefore.stepId },
    observationAfter: { phase: observationAfter.phase, stepId: observationAfter.stepId },
  };
}
