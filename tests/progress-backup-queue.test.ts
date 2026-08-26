import assert from 'node:assert/strict';
import test, { beforeEach } from 'node:test';

import {
    readPending,
    stashPending,
    clearPending,
    volgendTicket,
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

// ─── Grensgevallen: precies gelijke volgnummers ───────────────────────────────
// Hier zat de valkuil. De gewone racetests gebruiken 100 tegen 200, en die
// slagen ook als iemand `<=` per ongeluk in `<` verandert. Deze twee toetsen de
// grens zelf, en leggen vast welke kant het gelijkspel op valt: bewaren wint,
// want een overbodige hervezending is onschadelijk en verdwenen werk niet.

test('bij een gelijk volgnummer wordt het werk bewaard, niet weggegooid', () => {
    clearPending(LEERLING, MISSIE, 100);
    stashPending(LEERLING, MISSIE, { gameCode: 'gelijkspel' }, 100);

    assert.deepEqual(readPending(LEERLING, MISSIE), { gameCode: 'gelijkspel' });
});

test('bij een gelijk volgnummer blijft wachtend werk staan', () => {
    stashPending(LEERLING, MISSIE, { gameCode: 'wacht' }, 100);
    clearPending(LEERLING, MISSIE, 100);

    assert.deepEqual(readPending(LEERLING, MISSIE), { gameCode: 'wacht' });
});

// ─── Volgnummers ──────────────────────────────────────────────────────────────

test('volgnummers lopen op en leunen niet op de klok', () => {
    const eerste = volgendTicket(LEERLING, MISSIE);
    const tweede = volgendTicket(LEERLING, MISSIE);
    assert.ok(tweede > eerste, 'een volgende poging moet een hoger nummer krijgen');

    // Een NTP-correctie of handmatige klokwijziging mag niets uitmaken: als hier
    // Date.now() achter zat, kon een latere poging een lager nummer krijgen en
    // kwam de fout terug die deze wachtrij juist moet voorkomen.
    const echteNow = Date.now;
    try {
        Date.now = () => 0;
        const derde = volgendTicket(LEERLING, MISSIE);
        assert.ok(derde > tweede, 'een teruggezette klok mag het nummer niet verlagen');
    } finally {
        Date.now = echteNow;
    }
});

test('een volgnummer loopt door op wat er al bewaard staat', () => {
    // Merkteken en wachtrij staan hoog; de teller zelf is opgeruimd.
    clearPending(LEERLING, MISSIE, 500);
    stashPending(LEERLING, MISSIE, { gameCode: 'a' }, 900);
    (globalThis as any).localStorage.inhoud.delete(
        `dgskills:pending-progress:ticket:${LEERLING}:${MISSIE}`,
    );

    assert.ok(
        volgendTicket(LEERLING, MISSIE) > 900,
        'het nummer moet boven alles uitkomen wat er al ligt',
    );
});

test('een geblokkeerde opslag laat de opdracht niet omvallen', () => {
    (globalThis as any).localStorage = maakOpslag(true);

    assert.doesNotThrow(() => stashPending(LEERLING, MISSIE, { gameCode: 'a' }, 100));
    assert.doesNotThrow(() => clearPending(LEERLING, MISSIE, 100));
    assert.doesNotThrow(() => readPending(LEERLING, MISSIE));
    assert.doesNotThrow(() => volgendTicket(LEERLING, MISSIE));
    assert.equal(readPending(LEERLING, MISSIE), null);
});
