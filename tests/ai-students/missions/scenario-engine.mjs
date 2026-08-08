function parseMinimum(text) {
  const match = String(text || '').match(/minimaal\s+(\d+)/i);
  return match ? Number(match[1]) : 1;
}

function normalizedControls(controls = {}) {
  return {
    select: controls.select || [],
    order: controls.order || [],
    drag: controls.drag || [],
    binaryAccept: controls.binaryAccept || [],
    followUp: controls.followUp || [],
    confidence: controls.confidence || [],
  };
}

export function buildObservation(snapshot) {
  const controls = normalizedControls(snapshot.controls);
  const stepId = String(snapshot.heading || 'onbekende-stap').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const base = {
    stepId,
    heading: snapshot.heading || '',
    instruction: snapshot.instruction || '',
    scoreText: snapshot.scoreText || '',
    options: [],
    availableRecoveryActions: [],
  };

  if (snapshot.flags?.completion) return { ...base, phase: 'completion' };
  if (snapshot.flags?.intro) return { ...base, phase: 'intro' };
  if (controls.followUp.length) return { ...base, phase: 'follow-up', options: controls.followUp };
  if (controls.confidence.length) return { ...base, phase: 'confidence', options: controls.confidence };
  if (snapshot.flags?.feedback) return { ...base, phase: 'feedback' };
  if (controls.select.length) {
    return {
      ...base,
      phase: 'round',
      roundType: 'select-correct',
      minimumSelections: parseMinimum(snapshot.instruction),
      options: controls.select,
    };
  }
  if (controls.order.length) {
    return {
      ...base,
      phase: 'round',
      roundType: 'order-priority',
      options: controls.order,
      availableRecoveryActions: ['reset-order'],
    };
  }
  if (controls.drag.length) {
    return {
      ...base,
      phase: 'round',
      roundType: 'order-drag',
      options: controls.drag,
      dragOrder: controls.drag.map((item) => item.id),
    };
  }
  if (controls.binaryAccept.length) {
    return {
      ...base,
      phase: 'round',
      roundType: 'binary-choice',
      options: controls.binaryAccept,
    };
  }
  return { ...base, phase: 'unknown' };
}

async function elements(locator, idAttribute) {
  return locator.evaluateAll((nodes, attribute) => nodes.map((node, index) => ({
    id: node.getAttribute(attribute) ?? String(index),
    text: node.getAttribute('aria-label') || node.textContent?.replace(/\s+/g, ' ').trim() || '',
  })), idAttribute);
}

async function firstText(locator) {
  return await locator.count() ? (await locator.first().textContent())?.replace(/\s+/g, ' ').trim() || '' : '';
}

export async function observeScenario(page) {
  const select = page.locator('[data-qa="scenario-option"]');
  const order = page.locator('[data-qa="scenario-order-item"]');
  const drag = page.locator('[data-qa="scenario-drag-item"]');
  const binaryAccept = page.locator('[data-qa="scenario-binary-accept"]');
  const followUp = page.locator('[data-qa="followup-option"]');
  const confidence = page.locator('[data-qa="confidence-option"]');
  const bodyText = await firstText(page.locator('body'));
  const heading = await firstText(page.getByRole('heading', { level: 3 }));
  const completionScore = await firstText(page.getByText(/\d+\/\d+ punten \(\d+%\)/));
  const activeScore = await firstText(page.getByText(/^\d+ pts$/));

  return buildObservation({
    heading,
    instruction: bodyText,
    scoreText: completionScore || activeScore,
    controls: {
      select: await elements(select, 'data-scenario-item-id'),
      order: await elements(order, 'data-scenario-item-id'),
      drag: await elements(drag, 'data-scenario-item-id'),
      binaryAccept: await elements(binaryAccept, 'data-scenario-item-id'),
      followUp: await elements(followUp, 'data-followup-option-index'),
      confidence: await elements(confidence, 'data-confidence-level'),
    },
    flags: {
      intro: await page.locator('[data-qa="mission-intro"]').count() > 0,
      completion: await page.locator('[data-qa="mission-completion"]').count() > 0,
      feedback: await page.locator('[data-qa="scenario-feedback"]').count() > 0,
    },
  });
}

function itemSelector(qa, id) {
  if (!/^\d+$/.test(String(id))) throw new Error(`Ongeldig scenario-item-id: ${id}`);
  return `[data-qa="${qa}"][data-scenario-item-id="${id}"]`;
}

async function currentDragOrder(page) {
  const items = await elements(page.locator('[data-qa="scenario-drag-item"]'), 'data-scenario-item-id');
  return items.map((item) => item.id);
}

export async function performScenarioDecision(page, decision) {
  if (decision.action === 'start') {
    await page.getByRole('button', { name: /start de missie/i }).click();
    return;
  }
  if (decision.action === 'answer-select') {
    for (const id of decision.optionIds) await page.locator(itemSelector('scenario-option', id)).click();
    await page.getByRole('button', { name: /controleer mijn keuze/i }).click();
    return;
  }
  if (decision.action === 'answer-order') {
    for (const id of decision.optionIds) await page.locator(itemSelector('scenario-order-item', id)).click();
    await page.getByRole('button', { name: /controleer volgorde/i }).click();
    return;
  }
  if (decision.action === 'answer-drag') {
    const desired = decision.optionIds.map(String);
    const maxClicks = (desired.length * desired.length) + 10;
    let clicks = 0;
    for (let target = 0; target < desired.length; target++) {
      const wantedId = desired[target];
      let current = await currentDragOrder(page);
      let index = current.indexOf(wantedId);
      if (index === -1) throw new Error(`Ongeldig scenario-item-id: ${wantedId}`);
      while (index > target) {
        if (clicks >= maxClicks) throw new Error(`Kon gewenste sleepvolgorde niet bereiken binnen ${maxClicks} klikken`);
        await page.locator(itemSelector('scenario-drag-up', wantedId)).click();
        clicks++;
        current = await currentDragOrder(page);
        index = current.indexOf(wantedId);
      }
    }
    await page.getByRole('button', { name: /controleer volgorde/i }).click();
    return;
  }
  if (decision.action === 'answer-binary') {
    for (const [id, accepted] of Object.entries(decision.choices)) {
      const qa = accepted ? 'scenario-binary-accept' : 'scenario-binary-reject';
      await page.locator(itemSelector(qa, id)).click();
    }
    await page.getByRole('button', { name: /controleer keuzes/i }).click();
    return;
  }
  if (decision.action === 'answer-confidence') {
    await page.locator(`[data-qa="confidence-option"][data-confidence-level="${decision.optionId}"]`).click();
    return;
  }
  if (decision.action === 'answer-follow-up') {
    await page.locator(`[data-qa="followup-option"][data-followup-option-index="${decision.optionId}"]`).click();
    await page.getByRole('button', { name: /doorgaan/i }).click();
    return;
  }
  if (decision.action === 'next') {
    await page.getByRole('button', { name: /volgende ronde|bekijk eindresultaat/i }).click();
    return;
  }
  if (decision.action === 'confirm-completion') {
    await page.getByRole('button', { name: /missie voltooid/i }).click();
    return;
  }
  throw new Error(`Onbekende ScenarioEngine-actie: ${decision.action}`);
}
