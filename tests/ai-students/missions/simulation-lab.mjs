function slug(value) {
  return String(value || 'onbekende-simulatie').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function buildSimulationObservation(snapshot) {
  const base = {
    stepId: slug(snapshot.heading),
    heading: snapshot.heading || '',
    instruction: snapshot.instruction || '',
    scoreText: snapshot.scoreText || '',
    options: snapshot.options || [],
  };
  if (snapshot.flags?.completion) return { ...base, phase: 'completion' };
  if (snapshot.flags?.intro) return { ...base, phase: 'intro' };
  if (snapshot.flags?.followUp) return { ...base, phase: 'follow-up' };
  if (snapshot.flags?.confidence) return { ...base, phase: 'confidence' };
  if (snapshot.flags?.parameterPrompt) return { ...base, phase: 'round', roundType: 'simulation-parameter' };
  if (snapshot.flags?.submit) return { ...base, phase: 'round', roundType: 'simulation-submit' };
  if (snapshot.flags?.question) return { ...base, phase: 'round', roundType: 'simulation-question' };
  if (snapshot.flags?.next) return { ...base, phase: 'round', roundType: 'simulation-next' };
  return { ...base, phase: 'unknown' };
}

async function visibleText(locator) {
  return await locator.count() ? (await locator.first().innerText()).replace(/\s+/g, ' ').trim() : '';
}

async function optionData(locator, attribute) {
  return locator.evaluateAll((nodes, attr) => nodes.map((node, index) => ({
    id: node.getAttribute(attr) ?? String(index),
    text: node.textContent?.replace(/\s+/g, ' ').trim() || '',
  })), attribute);
}

export async function observeSimulation(page) {
  const root = page.locator('[data-qa="simulation-lab"]');
  const activeQuestion = page.locator('[data-qa="simulation-question"]')
    .filter({ has: page.locator('[data-qa="simulation-answer"]:not([disabled]), [data-qa="simulation-submit"]:not([disabled])') })
    .first();
  const followUp = page.locator('[data-qa="followup-option"]:not([disabled])');
  const confidence = page.locator('[data-qa="confidence-option"]');
  const submit = activeQuestion.locator('[data-qa="simulation-submit"]:not([disabled])');
  const answers = activeQuestion.locator('[data-qa="simulation-answer"]:not([disabled])');
  const next = page.locator('[data-qa="simulation-next"]:not([disabled])');
  const body = await visibleText(await root.count() ? root : page.locator('body'));
  const questionHeading = await visibleText(activeQuestion.locator('p').first());
  const heading = questionHeading || await visibleText(page.getByRole('heading', { level: 2 }));
  let options = [];
  if (await followUp.count()) options = await optionData(followUp, 'data-followup-option-index');
  else if (await confidence.count()) options = await optionData(confidence, 'data-confidence-level');
  else if (await answers.count()) options = await optionData(answers, 'data-option-index');
  return buildSimulationObservation({
    heading,
    instruction: body,
    scoreText: await visibleText(page.getByText(/\d+\/\d+ punten \(\d+%\)/)),
    options,
    flags: {
      intro: await page.locator('[data-qa="mission-intro"]').count() > 0,
      completion: await page.locator('[data-qa="mission-completion"]').count() > 0,
      followUp: await followUp.count() > 0,
      confidence: await confidence.count() > 0,
      submit: await submit.count() > 0,
      question: await answers.count() > 0,
      parameterPrompt: body.includes('Probeer het!'),
      next: await next.count() > 0,
    },
  });
}

export async function performSimulationDecision(page, decision) {
  if (decision.action === 'start') return page.locator('[data-qa="mission-start"]').click();
  if (decision.action === 'change-simulation-parameter') {
    const select = page.locator('[data-qa="simulation-parameter-option"]').nth(1);
    if (await select.count()) return select.click();
    const toggle = page.locator('[data-qa="simulation-parameter-toggle"]').first();
    if (await toggle.count()) return toggle.click();
    const slider = page.locator('[data-qa="simulation-parameter-slider"]').first();
    if (await slider.count()) return slider.press('ArrowRight');
    throw new Error('Geen zichtbare simulatieparameter gevonden.');
  }
  if (decision.action === 'answer-simulation-question') {
    const activeQuestion = page.locator('[data-qa="simulation-question"]')
      .filter({ has: page.locator('[data-qa="simulation-answer"]:not([disabled]), [data-qa="simulation-submit"]:not([disabled])') })
      .first();
    return activeQuestion.locator(`[data-qa="simulation-answer"][data-option-index="${decision.optionId}"]`).click();
  }
  if (decision.action === 'submit-simulation-answer') return page.locator('[data-qa="simulation-submit"]:not([disabled])').first().click();
  if (decision.action === 'answer-confidence') return page.locator(`[data-qa="confidence-option"][data-confidence-level="${decision.optionId}"]`).click();
  if (decision.action === 'answer-follow-up') {
    await page.locator(`[data-qa="followup-option"][data-followup-option-index="${decision.optionId}"]`).click();
    return page.locator('[data-qa="followup-submit"]').click();
  }
  if (decision.action === 'next-simulation') return page.locator('[data-qa="simulation-next"]:not([disabled])').click();
  if (decision.action === 'confirm-completion') return page.locator('[data-qa="confirm-completion"]').click();
  throw new Error(`Onbekende Simulation Lab-actie: ${decision.action}`);
}
