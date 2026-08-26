import assert from 'node:assert/strict';
import test from 'node:test';

import {
    resolveHomepageVariant,
    VARIANT_B_READY,
} from '../../src/features/public-site/homepageVariant.ts';

/*
 * De verdeling over A en B zit in de app achter `VARIANT_B_READY`, die tot de
 * bouw van variant B uit staat. Juist dáárom staan deze tests er: de code die
 * straks het zwaarst telt, is in de browser nu niet te bereiken. De tests geven
 * `splitEnabled` expliciet mee en toetsen het gedrag los van die vlag.
 */

/** Minimale window-stub: alleen wat homepageVariant.ts werkelijk aanraakt. */
function stubWindow({ search = '', store = new Map<string, string>(), throwOnStorage = false } = {}) {
    const localStorage = {
        getItem(key: string) {
            if (throwOnStorage) throw new Error('storage geblokkeerd');
            return store.has(key) ? store.get(key)! : null;
        },
        setItem(key: string, value: string) {
            if (throwOnStorage) throw new Error('storage geblokkeerd');
            store.set(key, value);
        },
    };
    (globalThis as Record<string, unknown>).window = {
        location: { search },
        localStorage,
    };
    return store;
}

test.afterEach(() => {
    delete (globalThis as Record<string, unknown>).window;
});

test('de vlag staat uit zolang variant B niet af is', () => {
    // Vangnet: gaat B live vóórdat de pagina bestaat, dan faalt dit bewust.
    assert.equal(VARIANT_B_READY, false);
});

test('zonder verdeling krijgt iedereen A en wordt er niets opgeslagen', () => {
    const store = stubWindow();
    const result = resolveHomepageVariant({ splitEnabled: false });
    assert.deepEqual(result, { variant: 'a', forced: false });
    assert.equal(store.size, 0, 'een uitgeschakelde test mag geen opslag achterlaten');
});

test('?variant=b forceert B, ook als de verdeling uit staat', () => {
    const store = stubWindow({ search: '?variant=b' });
    const result = resolveHomepageVariant({ splitEnabled: false });
    assert.deepEqual(result, { variant: 'b', forced: true });
    assert.equal(store.size, 0, 'een geforceerd bezoek mag niet blijven plakken');
});

test('?variant=A werkt hoofdletterongevoelig en met spaties', () => {
    stubWindow({ search: '?variant=%20A%20' });
    assert.deepEqual(resolveHomepageVariant({ splitEnabled: true }), { variant: 'a', forced: true });
});

test('een onzinwaarde in ?variant wordt genegeerd', () => {
    stubWindow({ search: '?variant=paars' });
    const result = resolveHomepageVariant({ splitEnabled: false });
    assert.equal(result.forced, false);
    assert.equal(result.variant, 'a');
});

test('een toegewezen variant blijft plakken over bezoeken heen', () => {
    const store = stubWindow();
    const eerste = resolveHomepageVariant({ splitEnabled: true });
    assert.equal(eerste.forced, false);
    assert.ok(eerste.variant === 'a' || eerste.variant === 'b');
    assert.equal(store.size, 1, 'de keuze hoort onthouden te worden');

    // Twintig vervolgbezoeken moeten allemaal dezelfde variant geven. Bij een
    // niet-plakkende implementatie is de kans daarop 1 op ruim een miljoen.
    for (let i = 0; i < 20; i += 1) {
        assert.equal(resolveHomepageVariant({ splitEnabled: true }).variant, eerste.variant);
    }
});

test('een eerder opgeslagen keuze wint van een nieuwe trekking', () => {
    stubWindow({ store: new Map([['dgskills:homepage-variant', 'b']]) });
    assert.deepEqual(resolveHomepageVariant({ splitEnabled: true }), { variant: 'b', forced: false });
});

test('over veel verse bezoekers vallen beide varianten', () => {
    const gezien = new Set<string>();
    for (let i = 0; i < 200; i += 1) {
        stubWindow(); // elke ronde een verse bezoeker met lege opslag
        gezien.add(resolveHomepageVariant({ splitEnabled: true }).variant);
    }
    assert.deepEqual([...gezien].sort(), ['a', 'b'], 'de verdeling moet beide kanten op gaan');
});

test('geblokkeerde opslag laat de pagina niet omvallen', () => {
    stubWindow({ throwOnStorage: true });
    const result = resolveHomepageVariant({ splitEnabled: true });
    assert.equal(result.forced, false);
    assert.ok(result.variant === 'a' || result.variant === 'b');
});
