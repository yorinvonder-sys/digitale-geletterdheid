import assert from 'node:assert/strict';
import test from 'node:test';

import {
    TOUR_DISABLED_KEY,
    TOUR_KEY_PREFIX,
    isTourDisabled,
    isTourSeen,
    markTourSeen,
    tourSeenKey,
    type KeyValueStore,
} from '../../src/features/onboarding/core/tourStorage.ts';

/** Minimale Storage-vervanger; geen jsdom nodig. */
const fakeStore = (initial: Record<string, string> = {}): KeyValueStore & { dump(): Record<string, string> } => {
    const map = new Map<string, string>(Object.entries(initial));
    return {
        getItem: (key) => map.get(key) ?? null,
        setItem: (key, value) => { map.set(key, value); },
        dump: () => Object.fromEntries(map),
    };
};

/** Gooit bij elke aanroep — Safari privémodus, uitgeschakelde cookies. */
const throwingStore: KeyValueStore = {
    getItem: () => { throw new Error('opslag geblokkeerd'); },
    setItem: () => { throw new Error('opslag geblokkeerd'); },
};

test('de vlag van de ene leerling lekt niet naar de andere op dezelfde computer', () => {
    const store = fakeStore();

    markTourSeen(store, 'leerling-a', 'student');

    assert.equal(isTourSeen(store, 'leerling-a', 'student'), true, 'leerling A heeft hem gezien');
    assert.equal(
        isTourSeen(store, 'leerling-b', 'student'),
        false,
        'leerling B mag de rondleiding NIET overslaan omdat A hem af had',
    );
});

test('docent- en leerlingrondleiding zijn losse sleutels voor dezelfde persoon', () => {
    const store = fakeStore();

    markTourSeen(store, 'docent-1', 'teacher');

    assert.equal(isTourSeen(store, 'docent-1', 'teacher'), true);
    assert.equal(isTourSeen(store, 'docent-1', 'student'), false);
});

test('een ontbrekend gebruikers-id valt terug op een eigen naamruimte, niet op een gedeelde', () => {
    assert.equal(tourSeenKey(undefined, 'student'), `${TOUR_KEY_PREFIX}seen.anoniem.student`);
    assert.equal(tourSeenKey('', 'student'), `${TOUR_KEY_PREFIX}seen.anoniem.student`);
    assert.notEqual(tourSeenKey(undefined, 'student'), tourSeenKey('leerling-a', 'student'));
});

test('elke sleutel valt onder het opruimvoorvoegsel van uitloggen', () => {
    const store = fakeStore();
    markTourSeen(store, 'leerling-a', 'student');
    markTourSeen(store, 'docent-1', 'teacher');

    for (const key of Object.keys(store.dump())) {
        assert.ok(
            key.startsWith(TOUR_KEY_PREFIX),
            `${key} zou bij uitloggen blijven staan — dat is precies hoe de lekbug ontstond`,
        );
    }
    assert.ok(TOUR_DISABLED_KEY.startsWith(TOUR_KEY_PREFIX));
});

test('geblokkeerde opslag laat de app niet vallen', () => {
    assert.equal(isTourSeen(throwingStore, 'leerling-a', 'student'), false);
    assert.doesNotThrow(() => markTourSeen(throwingStore, 'leerling-a', 'student'));
    assert.equal(isTourDisabled('', throwingStore), false);
    assert.equal(isTourSeen(null, 'leerling-a', 'student'), false);
});

test('de uitschakelaar werkt via URL en via opslag', () => {
    assert.equal(isTourDisabled('?tour=off', fakeStore()), true);
    assert.equal(isTourDisabled('?qa=1&tour=off', fakeStore()), true);
    assert.equal(isTourDisabled('', fakeStore({ [TOUR_DISABLED_KEY]: 'true' })), true);
    assert.equal(isTourDisabled('', fakeStore()), false);
    assert.equal(isTourDisabled('?tour=on', fakeStore()), false);
});
