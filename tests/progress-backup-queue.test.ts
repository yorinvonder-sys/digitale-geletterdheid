import assert from 'node:assert/strict';
import test, { beforeEach } from 'node:test';

import {
    readPending,
    stashPending,
    clearPending,
} from '../src/services/progressBackupQueue.ts';

/** Nagemaakte opslag: geen browser nodig, en we kunnen hem laten falen. */
function maakOpslag(faalt = false) {
    const inhoud = new Map<string, string>();
    return {
        inhoud,
        getItem(k: string) {
            if (faalt) throw new Error('opslag geblokkeerd');
            return inhoud.has(k) ? inhoud.get(k)! : null;
        },
        setItem(k: string, v: string) {
            if (faalt) throw new Error('opslag vol');
            inhoud.set(k, v);
        },
        removeItem(k: string) {
            if (faalt) throw new Error('opslag geblokkeerd');
            inhoud.delete(k);
        },
        clear() { inhoud.clear(); },
        key() { return null; },
        get length() { return inhoud.size; },
    } as unknown as Storage & { inhoud: Map<string, string> };
}

const LEERLING = 'leerling-1';
const MISSIE = 'game-programmeur';

beforeEach(() => {
    (globalThis as any).localStorage = maakOpslag();
});

test('werk dat de server niet haalde is later terug te lezen', () => {
    stashPending(LEERLING, MISSIE, { gameCode: 'a' }, 100);
    assert.deepEqual(readPending(LEERLING, MISSIE), { gameCode: 'a' });
});

test('een geslaagde opslag ruimt de wachtrij op', () => {
    stashPending(LEERLING, MISSIE, { gameCode: 'a' }, 100);
    clearPending(LEERLING, MISSIE, 200);
    assert.equal(readPending(LEERLING, MISSIE), null);
});

test('een ingehaalde poging bewaart niets meer', () => {
    // De nieuwere opslag (gestart op 200) is geslaagd...
    clearPending(LEERLING, MISSIE, 200);
    // ...en pas dáárna faalt de tragere, oudere poging (gestart op 100).
    stashPending(LEERLING, MISSIE, { gameCode: 'oud' }, 100);

    // Zonder deze regel zou het oude werk in de wachtrij komen en bij het
    // volgende laden over het nieuwere heen worden gezet.
    assert.equal(readPending(LEERLING, MISSIE), null);
});

test('een trage geslaagde poging wist geen nieuwer wachtend werk', () => {
    // De nieuwere opslag (gestart op 200) faalde en staat in de wachtrij...
    stashPending(LEERLING, MISSIE, { gameCode: 'nieuw' }, 200);
    // ...daarna komt de oudere poging (gestart op 100) alsnog goed binnen.
    clearPending(LEERLING, MISSIE, 100);

    assert.deepEqual(readPending(LEERLING, MISSIE), { gameCode: 'nieuw' });
});

test('het merkteken loopt alleen vooruit', () => {
    clearPending(LEERLING, MISSIE, 200);
    clearPending(LEERLING, MISSIE, 100); // trage, oudere poging komt alsnog binnen

    // Het merkteken moet op 200 blijven staan, dus een poging van 150 telt als
    // ingehaald en mag niets bewaren.
    stashPending(LEERLING, MISSIE, { gameCode: 'oud' }, 150);
    assert.equal(readPending(LEERLING, MISSIE), null);

    // Terwijl werk van ná 200 wél bewaard wordt.
    stashPending(LEERLING, MISSIE, { gameCode: 'nieuwer' }, 250);
    assert.deepEqual(readPending(LEERLING, MISSIE), { gameCode: 'nieuwer' });
});

test('nieuwer wachtend werk wordt niet door ouder overschreven', () => {
    stashPending(LEERLING, MISSIE, { gameCode: 'nieuw' }, 300);
    stashPending(LEERLING, MISSIE, { gameCode: 'oud' }, 200);
    assert.deepEqual(readPending(LEERLING, MISSIE), { gameCode: 'nieuw' });
});

test('het werk van de ene leerling komt niet bij de andere terecht', () => {
    stashPending('leerling-a', MISSIE, { gameCode: 'van a' }, 100);
    assert.equal(readPending('leerling-b', MISSIE), null);
    assert.deepEqual(readPending('leerling-a', MISSIE), { gameCode: 'van a' });
});

test('een te grote opslag wordt niet half bewaard', () => {
    stashPending(LEERLING, MISSIE, { gameCode: 'x'.repeat(1_100_000) }, 100);
    assert.equal(readPending(LEERLING, MISSIE), null);
});

test('een geblokkeerde opslag laat de opdracht niet omvallen', () => {
    (globalThis as any).localStorage = maakOpslag(true);

    assert.doesNotThrow(() => stashPending(LEERLING, MISSIE, { gameCode: 'a' }, 100));
    assert.doesNotThrow(() => clearPending(LEERLING, MISSIE, 100));
    assert.doesNotThrow(() => readPending(LEERLING, MISSIE));
    assert.equal(readPending(LEERLING, MISSIE), null);
});
