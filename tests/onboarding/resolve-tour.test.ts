import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveTourSteps, type ResolvableStep } from '../../src/features/onboarding/core/resolveTour.ts';

const stappen: ResolvableStep[] = [
    { id: 'welkom', target: null },
    { id: 'missies', target: '[data-tutorial="student-main-missions"]' },
    { id: 'xp', target: '[data-tutorial="student-xp"]' },
    { id: 'bericht', target: '[data-tutorial="teacher-students-message"]', beforeEnter: () => undefined },
];

const ids = (lijst: ResolvableStep[]) => lijst.map((s) => s.id);

test('een stap zonder zichtbaar doel valt weg', () => {
    // Op desktop bestaat de XP-knop alleen in de verborgen mobiele koptekst.
    const zichtbaar = new Set(['[data-tutorial="student-main-missions"]']);
    const uitkomst = resolveTourSteps(stappen, (sel) => zichtbaar.has(sel));

    assert.deepEqual(ids(uitkomst), ['welkom', 'missies', 'bericht']);
});

test('een schermvullende stap blijft altijd staan', () => {
    assert.deepEqual(ids(resolveTourSteps(stappen, () => false)), ['welkom', 'bericht']);
});

test('een stap die eerst navigeert blijft staan, ook als zijn doel er nu niet is', () => {
    // Dit is het verschil dat telt: de berichtknop bestaat pas op het tabblad
    // Leerlingen. Wegfilteren zou die stap voorgoed laten verdwijnen.
    const uitkomst = resolveTourSteps(stappen, () => false);
    assert.ok(ids(uitkomst).includes('bericht'));
});

test('staat alles op het scherm, dan verandert er niets', () => {
    assert.deepEqual(ids(resolveTourSteps(stappen, () => true)), ids(stappen));
});

test('de volgorde blijft behouden', () => {
    const zichtbaar = new Set(['[data-tutorial="student-xp"]']);
    assert.deepEqual(ids(resolveTourSteps(stappen, (sel) => zichtbaar.has(sel))), ['welkom', 'xp', 'bericht']);
});

test('een lege uitkomst is mogelijk en mag geen fout geven', () => {
    assert.deepEqual(resolveTourSteps([{ id: 'x', target: '[data-x]' }], () => false), []);
});
