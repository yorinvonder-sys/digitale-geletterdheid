import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('herkent de zichtbare Review Arena-rondetypen zonder antwoordmetadata', async () => {
  const { buildReviewObservation } = await import('../missions/review-arena.mjs');
  for (const type of ['drag-sort', 'match-pairs', 'categorize', 'rapid-fire']) {
    const value = buildReviewObservation({ heading: 'Ronde', instruction: 'Zichtbare opdracht', flags: { [type]: true } });
    assert.equal(value.roundType, `review-${type}`);
    assert.equal('answer' in value, false);
  }
});

test('registry ondersteunt alle zeven Review Arena-missies', async () => {
  const { getMissionAdapter } = await import('../missions/registry.mjs');
  for (const id of ['review-week-2', 'data-review', 'code-review-2', 'media-review', 'security-review', 'advanced-code-review', 'impact-review']) {
    const adapter = getMissionAdapter(id);
    assert.equal(adapter.id, 'review-arena');
    assert.equal(adapter.maxSteps, 100);
  }
});

test('Review Arena-bedieningen gebruiken stabiele hooks en minimaal 44px touchdoelen', async () => {
  for (const file of ['DragSort', 'MatchPairs', 'Categorize', 'RapidFire']) {
    const source = await readFile(`src/features/missions/templates/review-arena/sub/${file}.tsx`, 'utf8');
    assert.match(source, /data-qa="review-/);
  }
  const drag = await readFile('src/features/missions/templates/review-arena/sub/DragSort.tsx', 'utf8');
  const pairs = await readFile('src/features/missions/templates/review-arena/sub/MatchPairs.tsx', 'utf8');
  assert.doesNotMatch(drag, /min-h-\[36px\]|min-w-\[36px\]/);
  assert.match(pairs, /data-matched=\{isMatched\}/);
});

test('Review Arena-adapter bevat geen antwoordoracle', async () => {
  const source = await readFile('tests/ai-students/missions/review-arena.mjs', 'utf8');
  assert.doesNotMatch(source, /correctPosition|correctCategory|currentQuestion\.answer|\.\/configs/);
});

test('Review Arena sluit synchrone dubbele round- en follow-up-completion uit', async () => {
  const source = await readFile('src/features/missions/templates/review-arena/ReviewArena.tsx', 'utf8');
  assert.match(source, /completedRoundTransitions\.current\.has\(round\.id\)/);
  assert.match(source, /completedRoundTransitions\.current\.add\(round\.id\)/);
  assert.match(source, /completedFollowUpTransitions\.current\.has\(round\.id\)/);
  assert.match(source, /completedFollowUpTransitions\.current\.add\(round\.id\)/);
});

test('Review Arena wist de doorloop-refs bij een missiewissel en bij opnieuw beginnen', async () => {
  // Alle zeven review-arena-missies delen dezelfde vier ronde-ids. Blijven de
  // refs uit de dubbelklik-beveiliging staan bij een wissel of herstart, dan
  // blokkeren ze de volgende missie meteen op ronde 1.
  const source = await readFile('src/features/missions/templates/review-arena/ReviewArena.tsx', 'utf8');
  const resetBlocks = source.match(/setState\(initialState\)/g) ?? [];
  assert.equal(resetBlocks.length, 2, 'verwacht precies twee reset-paden: missiewissel en opnieuw beginnen');

  for (const ref of ['submittedThisSession', 'completedRoundTransitions', 'completedFollowUpTransitions']) {
    const clears = source.match(new RegExp(`${ref}\\.current\\.clear\\(\\)`, 'g')) ?? [];
    assert.equal(clears.length, 2, `${ref} moet in beide reset-paden gewist worden`);
  }
});

test('review-arena-missies delen dezelfde ronde-ids, dus refs mogen nooit missie-overstijgend blijven staan', async () => {
  const ids = new Set();
  for (const mission of ['review-week-2', 'data-review', 'code-review-2', 'media-review', 'security-review', 'advanced-code-review', 'impact-review']) {
    const config = await readFile(`src/features/missions/templates/review-arena/configs/${mission}.ts`, 'utf8');
    for (const [, id] of config.matchAll(/id: '(round-[a-z-]+)'/g)) ids.add(id);
  }
  // Deelt de hele familie precies vier ronde-ids, dan is de aanname onder de
  // vorige test hard: een ref op ronde-id is niet uniek per missie.
  assert.equal(ids.size, 4, `verwacht vier gedeelde ronde-ids, kreeg: ${[...ids].join(', ')}`);
});

test('runner neemt na refresh altijd een verse observatie voor de volgende beslissing', async () => {
  const source = await readFile('tests/ai-students/browser/run-scenario-pilot.mjs', 'utf8');
  assert.match(source, /refreshProbe = await verifyRefreshRecovery[\s\S]{0,120}continue;/);
});
