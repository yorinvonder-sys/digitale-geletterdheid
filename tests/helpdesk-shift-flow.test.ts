import assert from 'node:assert/strict';
import test from 'node:test';

import {
    bouwStappen,
    huidigeMailId,
    huidigeOnderbrekingId,
    isKlaar,
} from '../src/features/missions/templates/helpdesk-shift/shiftFlow.ts';
import type { HelpdeskShiftConfig, ShiftMail } from '../src/features/missions/templates/helpdesk-shift/types.ts';
import type { Onderbreking } from '../src/features/missions/templates/helpdesk-shift/office/officeTypes.ts';

const mail = (id: number): ShiftMail => ({
    id,
    fromName: `Afzender ${id}`,
    fromAddress: `a${id}@onsschool.nl`,
    subject: `Onderwerp ${id}`,
    preview: 'Voorbeeld',
    body: ['Tekst'],
    juisteActie: 'melden',
    tell: 'Signaal',
    uitleg: 'Uitleg',
    gevolg: {},
});

const config = (aantal: number): HelpdeskShiftConfig => ({
    missionId: 'test',
    title: 'Test',
    introEmoji: '📬',
    introTitle: 'Test',
    introDescription: 'Test',
    startStand: { veiligeAccounts: 12, verlorenGeld: 0, meldingen: 0 },
    mails: Array.from({ length: aantal }, (_, i) => mail(i + 1)),
    maxScore: 100,
    badges: [],
    takeaways: [],
});

const onderbreking = (id: string, naBericht: number): Onderbreking => ({
    id,
    soort: 'telefoon',
    naBericht,
    plek: 'telefoon',
    aanhef: 'Aanhef',
    tekst: ['Tekst'],
    keuzes: [],
    tell: 'Signaal',
    uitleg: 'Uitleg',
});

test('zonder onderbrekingen is elke stap een bericht, in volgorde', () => {
    const stappen = bouwStappen(config(3), []);
    assert.deepEqual(stappen, [
        { soort: 'mail', mailId: 1 },
        { soort: 'mail', mailId: 2 },
        { soort: 'mail', mailId: 3 },
    ]);
});

test('een onderbreking komt precies na het bericht waar hij bij hoort', () => {
    const stappen = bouwStappen(config(3), [onderbreking('telefoon', 2)]);
    assert.deepEqual(stappen, [
        { soort: 'mail', mailId: 1 },
        { soort: 'mail', mailId: 2 },
        { soort: 'onderbreking', onderbrekingId: 'telefoon' },
        { soort: 'mail', mailId: 3 },
    ]);
});

test('een onderbreking voorbij het laatste bericht valt niet weg maar komt achteraan', () => {
    const stappen = bouwStappen(config(2), [onderbreking('laat', 9)]);
    assert.deepEqual(stappen.at(-1), { soort: 'onderbreking', onderbrekingId: 'laat' });
    assert.equal(stappen.length, 3);
});

test('meerdere onderbrekingen op dezelfde plek behouden hun volgorde', () => {
    const stappen = bouwStappen(config(2), [onderbreking('een', 1), onderbreking('twee', 1)]);
    assert.deepEqual(stappen.map((s) => (s.soort === 'mail' ? `m${s.mailId}` : s.onderbrekingId)), [
        'm1', 'een', 'twee', 'm2',
    ]);
});

test('de huidige stap zegt of er een bericht of een onderbreking aan de beurt is', () => {
    const stappen = bouwStappen(config(2), [onderbreking('telefoon', 1)]);
    assert.equal(huidigeMailId(stappen, 0), 1);
    assert.equal(huidigeOnderbrekingId(stappen, 0), null);
    assert.equal(huidigeMailId(stappen, 1), null);
    assert.equal(huidigeOnderbrekingId(stappen, 1), 'telefoon');
    assert.equal(huidigeMailId(stappen, 2), 2);
});

test('de ochtend is pas klaar als alle stappen gedaan zijn', () => {
    const stappen = bouwStappen(config(2), [onderbreking('telefoon', 1)]);
    assert.equal(isKlaar(stappen, 2), false);
    assert.equal(isKlaar(stappen, 3), true);
});

test('voorbij het einde is er geen stap meer, zonder te crashen', () => {
    const stappen = bouwStappen(config(1), []);
    assert.equal(huidigeMailId(stappen, 5), null);
    assert.equal(huidigeOnderbrekingId(stappen, 5), null);
});
