function slug(value) {
  return String(value || 'onbekende-ronde').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function buildFortressObservation(snapshot) {
  const base = {
    stepId: slug(snapshot.heading),
    heading: snapshot.heading || '',
    instruction: snapshot.instruction || '',
    scoreText: snapshot.scoreText || '',
    attemptCount: snapshot.attemptCount || 0,
    options: [],
    availableRecoveryActions: [
      ...(snapshot.flags?.hint ? ['hint'] : []),
      ...(snapshot.flags?.skip ? ['skip'] : []),
    ],
  };
  if (snapshot.flags?.completion) return { ...base, phase: 'completion' };
  if (snapshot.flags?.intro) return { ...base, phase: 'intro' };
  if (snapshot.flags?.revealing) return { ...base, phase: 'transition' };
  if (snapshot.flags?.next) return { ...base, phase: 'round', roundType: 'fortress-next' };
  if (snapshot.flags?.input) return { ...base, phase: 'round', roundType: 'password-entry' };
  if (snapshot.flags?.root) return { ...base, phase: 'transition' };
  return { ...base, phase: 'unknown' };
}

async function visibleText(locator) {
  return await locator.count() ? (await locator.first().innerText()).trim() : '';
}

async function compactText(locator) {
  return (await visibleText(locator)).replace(/\s+/g, ' ').trim();
}

export async function observeFortress(page) {
  const root = page.locator('[data-qa="password-fortress"]');
  const body = redactFortressVisibleText(await visibleText(await root.count() ? root : page.locator('body')));
  const attempts = body.match(/(\d+) mislukte test(?:en)?/)?.[1];
  return buildFortressObservation({
    heading: await compactText(page.getByRole('heading', { level: 2 })),
    instruction: body,
    scoreText: await compactText(page.getByText(/\d+\/\d+ punten \(\d+%\)/)),
    attemptCount: attempts ? Number(attempts) : 0,
    flags: {
      intro: await page.locator('[data-qa="mission-intro"]').count() > 0,
      completion: await page.locator('[data-qa="mission-completion"]').count() > 0,
      input: await page.getByLabel('Jouw oefenwachtwoord').count() > 0,
      revealing: await page.locator('[data-qa="fortress-test"]').getByText('AANVAL LOOPT…', { exact: true }).count() > 0,
      next: await page.locator('[data-qa="fortress-next"]').count() > 0,
      hint: await page.locator('[data-qa="fortress-hint"]').count() > 0,
      skip: await page.locator('[data-qa="fortress-skip"]').count() > 0,
      root: await root.count() > 0,
    },
  });
}

export function redactFortressDecision(decision) {
  if (decision?.action !== 'test-password') return decision;
  return { ...decision, value: '[REDACTED_SYNTHETIC_PASSWORD]' };
}

export function redactFortressVisibleText(text) {
  return String(text || '')
    .replaceAll('abc123', '[REDACTED_SYNTHETIC_PASSWORD]')
    .replaceAll('Kobalt-Vork!7Rivier-Mist', '[REDACTED_SYNTHETIC_PASSWORD]');
}

export async function performFortressDecision(page, decision) {
  if (decision.action === 'start') {
    await page.getByRole('button', { name: /start de missie/i }).click();
    return;
  }
  if (decision.action === 'test-password') {
    await page.getByLabel('Jouw oefenwachtwoord').fill(decision.value);
    await page.locator('[data-qa="fortress-test"]').click();
    return;
  }
  if (decision.action === 'request-hint') {
    await page.locator('[data-qa="fortress-hint"]').click();
    return;
  }
  if (decision.action === 'skip') {
    await page.locator('[data-qa="fortress-skip"]').click();
    return;
  }
  if (decision.action === 'next-fortress-round') {
    await page.locator('[data-qa="fortress-next"]').click();
    return;
  }
  if (decision.action === 'wait-transition') {
    await page.waitForTimeout(3800);
    return;
  }
  if (decision.action === 'confirm-completion') {
    await page.getByRole('button', { name: /missie voltooid/i }).click();
    return;
  }
  throw new Error(`Onbekende Password Fortress-actie: ${decision.action}`);
}
