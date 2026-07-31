function slug(value) {
  return String(value || 'review-ronde').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function buildReviewObservation(snapshot) {
  const base = { stepId: slug(snapshot.heading), heading: snapshot.heading || '', instruction: snapshot.instruction || '', scoreText: snapshot.scoreText || '', options: snapshot.options || [] };
  if (snapshot.flags?.completion) return { ...base, phase: 'completion' };
  if (snapshot.flags?.intro) return { ...base, phase: 'intro' };
  if (snapshot.flags?.followUp) return { ...base, phase: 'follow-up' };
  if (snapshot.flags?.continue) return { ...base, phase: 'round', roundType: 'review-continue' };
  if (snapshot.flags?.categorySubmit) return { ...base, phase: 'round', roundType: 'review-categorize-submit' };
  if (snapshot.flags?.['drag-sort']) return { ...base, phase: 'round', roundType: 'review-drag-sort' };
  if (snapshot.flags?.['match-pairs']) return { ...base, phase: 'round', roundType: 'review-match-pairs' };
  if (snapshot.flags?.categorize) return { ...base, phase: 'round', roundType: 'review-categorize' };
  if (snapshot.flags?.['rapid-fire']) return { ...base, phase: 'round', roundType: 'review-rapid-fire' };
  if (snapshot.flags?.transition) return { ...base, phase: 'transition' };
  return { ...base, phase: 'unknown' };
}

async function text(locator) { return await locator.count() ? (await locator.first().innerText()).replace(/\s+/g, ' ').trim() : ''; }
async function options(locator, attr = 'data-index') {
  return locator.evaluateAll((nodes, attribute) => nodes.map((node, index) => ({ id: node.getAttribute(attribute) ?? String(index), text: node.textContent?.replace(/\s+/g, ' ').trim() || '' })), attr);
}

export async function observeReview(page) {
  const root = page.locator('[data-qa="review-arena"]');
  const followUp = page.locator('[data-qa="followup-option"]:not([disabled])');
  const categories = page.locator('[data-qa="review-category"]');
  const rapid = page.locator('[data-qa="review-rapid-true"]:not([disabled]), [data-qa="review-rapid-false"]:not([disabled])');
  let visibleOptions = [];
  if (await followUp.count()) visibleOptions = await options(followUp, 'data-followup-option-index');
  else if (await categories.count()) visibleOptions = await options(categories);
  else if (await rapid.count()) visibleOptions = await options(rapid);
  return buildReviewObservation({
    heading: await text(page.getByRole('heading', { level: 3 })),
    instruction: await text(await root.count() ? root : page.locator('body')),
    scoreText: await text(page.getByText(/\d+\/\d+ punten \(\d+%\)/)),
    options: visibleOptions,
    flags: {
      intro: await page.locator('[data-qa="mission-intro"]').count() > 0,
      completion: await page.locator('[data-qa="mission-completion"]').count() > 0,
      followUp: await followUp.count() > 0,
      continue: await page.locator('[data-qa="review-continue"]').count() > 0,
      categorySubmit: await page.locator('[data-qa="review-submit"]:not([disabled])').count() > 0 && await categories.count() > 0,
      'drag-sort': await page.locator('[data-qa="review-drag-item"]').count() > 0,
      'match-pairs': await page.locator('[data-qa="review-match-left"][data-matched="false"]').count() > 0,
      categorize: await page.locator('[data-qa="review-category-item"]').count() > 0,
      'rapid-fire': await rapid.count() > 0,
      transition: await root.count() > 0,
    },
  });
}

export async function performReviewDecision(page, decision) {
  if (decision.action === 'start') return page.locator('[data-qa="mission-start"]').click();
  if (decision.action === 'submit-review-order') return page.locator('[data-qa="review-submit"]').click();
  if (decision.action === 'match-visible-pair') {
    const unmatchedLeft = page.locator('[data-qa="review-match-left"][data-matched="false"]');
    const before = await unmatchedLeft.count();
    const left = unmatchedLeft.first();
    await left.click();
    const rights = page.locator('[data-qa="review-match-right"][data-matched="false"]');
    for (let index = 0; index < await rights.count(); index += 1) {
      await rights.nth(index).click();
      await page.waitForTimeout(120);
      if (await unmatchedLeft.count() < before) return;
    }
    return;
  }
  if (decision.action === 'place-review-item') {
    await page.locator('[data-qa="review-category-item"]').first().click();
    const categories = page.locator('[data-qa="review-category-label"]');
    return categories.nth(Number(decision.categoryIndex) % await categories.count()).click();
  }
  if (decision.action === 'submit-review-categories') return page.locator('[data-qa="review-submit"]:not([disabled])').click();
  if (decision.action === 'answer-review-rapid') return page.locator(decision.value ? '[data-qa="review-rapid-true"]' : '[data-qa="review-rapid-false"]').click();
  if (decision.action === 'continue-review') {
    await page.locator('[data-qa="review-continue"]').click();
    return page.waitForTimeout(400);
  }
  if (decision.action === 'answer-follow-up') {
    await page.locator(`[data-qa="followup-option"][data-followup-option-index="${decision.optionId}"]`).click();
    await page.locator('[data-qa="followup-submit"]').click();
    return page.waitForTimeout(400);
  }
  if (decision.action === 'wait-transition') return page.waitForTimeout(900);
  if (decision.action === 'confirm-completion') return page.locator('[data-qa="confirm-completion"]').click();
  throw new Error(`Onbekende Review Arena-actie: ${decision.action}`);
}
