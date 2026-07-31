function slug(value) {
  return String(value || 'onbekende-puzzel')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function buildPuzzleObservation(snapshot) {
  const base = {
    stepId: slug(snapshot.heading),
    heading: snapshot.heading || '',
    instruction: snapshot.instruction || '',
    scoreText: snapshot.scoreText || '',
    options: snapshot.options || [],
    availableRecoveryActions: snapshot.skipAvailable ? ['skip'] : [],
  };
  if (snapshot.flags?.completion) return { ...base, phase: 'completion' };
  if (snapshot.flags?.intro) return { ...base, phase: 'intro' };
  if (snapshot.flags?.transitioning) return { ...base, phase: 'transition' };
  if (base.options.length) return { ...base, phase: 'round', roundType: 'puzzle-choice' };
  if (snapshot.inputVisible) return { ...base, phase: 'round', roundType: 'puzzle-text' };
  if (snapshot.skipAvailable) return { ...base, phase: 'round', roundType: 'puzzle-recovery' };
  return { ...base, phase: 'unknown' };
}

async function text(locator) {
  return await locator.count() ? (await locator.first().textContent())?.replace(/\s+/g, ' ').trim() || '' : '';
}

async function visibleText(locator) {
  return await locator.count() ? (await locator.first().innerText()).trim() : '';
}

async function options(locator) {
  return locator.evaluateAll((nodes) => nodes.map((node, index) => ({
    id: node.getAttribute('data-puzzle-option-index') ?? String(index),
    text: node.textContent?.replace(/\s+/g, ' ').trim() || '',
  })));
}

export async function observePuzzle(page) {
  const optionLocator = page.locator('[data-qa="puzzle-option"]');
  const puzzleRoot = page.locator('[data-qa="puzzle-lab"]');
  const bodyText = await visibleText(await puzzleRoot.count() ? puzzleRoot : page.locator('body'));
  const inputVisible = await page.getByPlaceholder('antwoord...').count() > 0;
  const skipAvailable = await page.locator('[data-qa="puzzle-skip"]').count() > 0;
  const optionCount = await optionLocator.count();
  return buildPuzzleObservation({
    heading: await text(page.getByRole('heading', { level: 2 })),
    instruction: bodyText,
    scoreText: await text(page.getByText(/\d+\/\d+ punten \(\d+%\)/)),
    inputVisible,
    options: await options(optionLocator),
    skipAvailable,
    flags: {
      intro: await page.locator('[data-qa="mission-intro"]').count() > 0,
      completion: await page.locator('[data-qa="mission-completion"]').count() > 0,
      transitioning: bodyText.includes('ACCESS GRANTED') || (
        await puzzleRoot.count() > 0 && !inputVisible && !skipAvailable && optionCount === 0
      ),
    },
  });
}

export async function performPuzzleDecision(page, decision) {
  if (decision.action === 'start') {
    await page.getByRole('button', { name: /start de missie/i }).click();
    return;
  }
  if (decision.action === 'answer-puzzle-choice') {
    if (!/^\d+$/.test(String(decision.optionId))) throw new Error('Ongeldige Puzzle Lab-optie.');
    await page.locator(`[data-qa="puzzle-option"][data-puzzle-option-index="${decision.optionId}"]`).click();
    return;
  }
  if (decision.action === 'answer-puzzle-text') {
    await page.getByPlaceholder('antwoord...').fill(decision.value);
    await page.locator('[data-qa="puzzle-submit"]').click();
    return;
  }
  if (decision.action === 'skip') {
    await page.locator('[data-qa="puzzle-skip"]').click();
    return;
  }
  if (decision.action === 'wait-transition') {
    await page.waitForTimeout(2300);
    return;
  }
  if (decision.action === 'confirm-completion') {
    await page.getByRole('button', { name: /missie voltooid/i }).click();
    return;
  }
  throw new Error(`Onbekende Puzzle Lab-actie: ${decision.action}`);
}
