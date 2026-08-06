import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldAutoStart, type AutoStartInput } from '../../src/features/onboarding/core/autostart.ts';

/** Een verse gebruiker op een klaar dashboard — de rondleiding hoort te starten. */
const verseGebruiker: AutoStartInput = {
    enabled: true,
    completed: false,
    seenThisSession: false,
    disabled: false,
    ready: true,
    isDemo: false,
};

test('een verse gebruiker krijgt de rondleiding', () => {
    assert.equal(shouldAutoStart(verseGebruiker), true);
});

test('elke afzonderlijke rem houdt de rondleiding tegen', () => {
    const remmen: Array<[string, Partial<AutoStartInput>]> = [
        ['host wil geen autostart', { enabled: false }],
        ['al afgerond volgens de server', { completed: true }],
        ['deze sessie al gezien', { seenThisSession: true }],
        ['uitgeschakeld voor smoke tests', { disabled: true }],
        ['scherm nog niet klaar', { ready: false }],
        ['publieke demo of marketingpreview', { isDemo: true }],
    ];

    for (const [omschrijving, rem] of remmen) {
        assert.equal(
            shouldAutoStart({ ...verseGebruiker, ...rem }),
            false,
            `${omschrijving} zou de rondleiding moeten tegenhouden`,
        );
    }
});

test('de marketingsite krijgt nooit een rondleiding, ook niet als al het andere klopt', () => {
    assert.equal(shouldAutoStart({ ...verseGebruiker, isDemo: true, enabled: true, ready: true }), false);
});
