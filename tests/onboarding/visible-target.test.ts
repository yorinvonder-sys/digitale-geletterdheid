import assert from 'node:assert/strict';
import test from 'node:test';

import { pickVisibleIndex } from '../../src/features/onboarding/core/visibleTarget.ts';

/** Een element dat door `display:none` verborgen is, meet 0×0. */
const verborgen = { width: 0, height: 0 };
const zichtbaar = { width: 120, height: 40 };

test('op desktop wordt de verborgen mobiele tweeling overgeslagen', () => {
    // DOM-volgorde: mobiele header eerst, desktopheader daarna.
    assert.equal(pickVisibleIndex([verborgen, zichtbaar]), 1);
});

test('op mobiel wint de eerste, want die is dan zichtbaar', () => {
    assert.equal(pickVisibleIndex([zichtbaar, verborgen]), 0);
});

test('zonder zichtbaar element is er niets om uit te lichten', () => {
    assert.equal(pickVisibleIndex([verborgen, verborgen]), -1);
    assert.equal(pickVisibleIndex([]), -1);
});

test('een element met alleen breedte of alleen hoogte telt niet als zichtbaar', () => {
    assert.equal(pickVisibleIndex([{ width: 120, height: 0 }]), -1);
    assert.equal(pickVisibleIndex([{ width: 0, height: 40 }]), -1);
});

test('bij één enkel zichtbaar element blijft het gedrag ongewijzigd', () => {
    assert.equal(pickVisibleIndex([zichtbaar]), 0);
});
