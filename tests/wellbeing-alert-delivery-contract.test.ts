import assert from 'node:assert/strict';
import test from 'node:test';

import { createWellbeingAlertDelivery } from '../src/hooks/wellbeingAlertDelivery.ts';

/**
 * Uitvoerbare gedragstests voor de docentmelding-aflevering: concurrency,
 * foutpaden en het dedup-venster. Dit is het bewijs dat de CI-guard niet uit
 * broncode-patronen hoeft af te leiden.
 */

type Deferred = { resolve: () => void; reject: (err: Error) => void };

function makeControllableSend() {
    const calls: Array<{ category: string; deferred: Deferred }> = [];
    const send = (category: string): Promise<void> =>
        new Promise<void>((resolve, reject) => {
            calls.push({ category, deferred: { resolve, reject } });
        });
    return { calls, send };
}

const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

test('twee snelle treffers van dezelfde categorie sturen precies één melding', async () => {
    const { calls, send } = makeControllableSend();
    const delivery = createWellbeingAlertDelivery({ send });
    const eerste = delivery.deliver('pesten', 't1');
    const tweede = delivery.deliver('pesten', 't2');
    assert.equal(calls.length, 1);
    calls[0].deferred.resolve();
    await Promise.all([eerste, tweede]);
    assert.equal(calls.length, 1);
    assert.equal(delivery.notifiedFor('pesten'), true);
});

test('een fout bevestigt nooit; zonder wachtende treffer volgt geen retry', async () => {
    const { calls, send } = makeControllableSend();
    const delivery = createWellbeingAlertDelivery({ send });
    const poging = delivery.deliver('pesten', 't1');
    calls[0].deferred.reject(new Error('rpc-fout'));
    await poging;
    assert.equal(calls.length, 1);
    assert.equal(delivery.notifiedFor('pesten'), false);
});

test('een tijdens pending binnengekomen treffer krijgt na een fout één vervolgpoging', async () => {
    const { calls, send } = makeControllableSend();
    const delivery = createWellbeingAlertDelivery({ send });
    const eerste = delivery.deliver('pesten', 't1');
    const tweede = delivery.deliver('pesten', 't2'); // komt binnen terwijl het eerste verzoek loopt
    calls[0].deferred.reject(new Error('rpc-fout'));
    await flush();
    assert.equal(calls.length, 2, 'de gewachte treffer verdient één seriële vervolgpoging');
    calls[1].deferred.resolve();
    await Promise.all([eerste, tweede]);
    assert.equal(delivery.notifiedFor('pesten'), true);
});

test('ook de vervolgpoging faalt: geen bevestiging en geen retry-storm', async () => {
    const { calls, send } = makeControllableSend();
    const delivery = createWellbeingAlertDelivery({ send });
    const eerste = delivery.deliver('pesten', 't1');
    void delivery.deliver('pesten', 't2');
    calls[0].deferred.reject(new Error('rpc-fout'));
    await flush();
    calls[1].deferred.reject(new Error('rpc-fout'));
    await eerste;
    await flush();
    assert.equal(calls.length, 2, 'maximaal één vervolgpoging');
    assert.equal(delivery.notifiedFor('pesten'), false);
});

test('categorieën zijn onafhankelijk: B-succes telt nooit als A-aflevering', async () => {
    const { calls, send } = makeControllableSend();
    const delivery = createWellbeingAlertDelivery({ send });
    const a = delivery.deliver('cat-a', 't1');
    const b = delivery.deliver('cat-b', 't2');
    assert.equal(calls.length, 2);
    // B slaagt, A faalt daarna (buiten volgorde).
    calls[1].deferred.resolve();
    await flush();
    calls[0].deferred.reject(new Error('rpc-fout'));
    await Promise.all([a, b]);
    assert.equal(delivery.notifiedFor('cat-b'), true);
    assert.equal(delivery.notifiedFor('cat-a'), false);
});

test('binnen het dedup-venster dekt een bevestigde aflevering nieuwe treffers, daarbuiten niet', async () => {
    const { calls, send } = makeControllableSend();
    let klok = 1_000;
    const delivery = createWellbeingAlertDelivery({ send, now: () => klok, dedupWindowMs: 60_000 });
    const eerste = delivery.deliver('pesten', 't1');
    calls[0].deferred.resolve();
    await eerste;
    klok += 30_000;
    await delivery.deliver('pesten', 't2');
    assert.equal(calls.length, 1, 'binnen het venster geen nieuwe melding');
    assert.equal(delivery.notifiedFor('pesten'), true);
    klok += 40_000; // totaal 70s na bevestiging
    assert.equal(delivery.notifiedFor('pesten'), false, 'buiten het venster geen belofte meer');
    const derde = delivery.deliver('pesten', 't3');
    assert.equal(calls.length, 2, 'buiten het venster wél een nieuwe melding');
    calls[1].deferred.resolve();
    await derde;
});
