import assert from 'node:assert/strict';
import test from 'node:test';

import {
    pasGevolgToe,
    scoreMail,
    scoreShift,
    verwerkHandeling,
} from '../src/features/missions/templates/helpdesk-shift/scoring.ts';
import type {
    HelpdeskShiftConfig,
    SchoolState,
    ShiftMail,
} from '../src/features/missions/templates/helpdesk-shift/types.ts';

function mail(overrides: Partial<ShiftMail> & { id: number }): ShiftMail {
    return {
        fromName: 'Afzender',
        fromAddress: 'afzender@onsschool.nl',
        subject: 'Onderwerp',
        preview: 'Voorbeeld',
        body: ['Tekst'],
        juisteActie: 'melden',
        tell: 'Signaal',
        uitleg: 'Uitleg',
        gevolg: {},
        ...overrides,
    };
}

function config(overrides: Partial<HelpdeskShiftConfig> = {}): HelpdeskShiftConfig {
    return {
        missionId: 'test-shift',
        title: 'Test',
        introEmoji: '📬',
        introTitle: 'Test',
        introDescription: 'Test',
        startStand: { veiligeAccounts: 12, verlorenGeld: 0, meldingen: 0 },
        mails: [],
        maxScore: 100,
        badges: [],
        takeaways: [],
        ...overrides,
    };
}

const gaaf: SchoolState = { veiligeAccounts: 12, verlorenGeld: 0, meldingen: 0 };

test('een juiste handeling levert de volle punten, een acceptabele de helft', () => {
    const m = mail({ id: 1, juisteActie: 'melden', acceptabeleActie: 'weggooien' });
    assert.equal(scoreMail(m, 'melden'), 1);
    assert.equal(scoreMail(m, 'weggooien'), 0.5);
    assert.equal(scoreMail(m, 'doorlaten'), 0);
});

test('zonder acceptabel alternatief is alles behalve de juiste handeling nul', () => {
    const m = mail({ id: 1, juisteActie: 'doorlaten' });
    assert.equal(scoreMail(m, 'doorlaten'), 1);
    assert.equal(scoreMail(m, 'melden'), 0);
    assert.equal(scoreMail(m, 'weggooien'), 0);
});

test('een foutloze dienst met een ongeschonden school levert de volle score', () => {
    const c = config({
        mails: [
            mail({ id: 1, juisteActie: 'melden' }),
            mail({ id: 2, juisteActie: 'doorlaten' }),
        ],
    });
    const score = scoreShift(c, [
        { mailId: 1, gekozenActie: 'melden', punten: 1 },
        { mailId: 2, gekozenActie: 'doorlaten', punten: 1 },
    ], gaaf);
    assert.equal(score, 100);
});

test('een verkeerde handeling kost punten', () => {
    const c = config({
        mails: [
            mail({ id: 1, juisteActie: 'melden' }),
            mail({ id: 2, juisteActie: 'melden' }),
        ],
    });
    const score = scoreShift(c, [
        { mailId: 1, gekozenActie: 'melden', punten: 1 },
        { mailId: 2, gekozenActie: 'doorlaten', punten: 0 },
    ], gaaf);
    // De helft van het beslissingsdeel (70) plus het volle schooldeel (30).
    assert.equal(score, 65);
});

test('schade aan de school drukt de score, ook bij goede beslissingen', () => {
    const c = config({ mails: [mail({ id: 1, juisteActie: 'melden' })] });
    const score = scoreShift(c, [{ mailId: 1, gekozenActie: 'melden', punten: 1 }], {
        veiligeAccounts: 6,
        verlorenGeld: 0,
        meldingen: 1,
    });
    assert.equal(score, 85);
});

test('de score blijft binnen nul en het maximum', () => {
    const c = config({ mails: [mail({ id: 1, juisteActie: 'melden' })] });
    const bodem = scoreShift(c, [{ mailId: 1, gekozenActie: 'doorlaten', punten: 0 }], {
        veiligeAccounts: 0,
        verlorenGeld: 5000,
        meldingen: 0,
    });
    assert.equal(bodem, 0);

    const plafond = scoreShift(c, [{ mailId: 1, gekozenActie: 'melden', punten: 1 }], {
        veiligeAccounts: 99,
        verlorenGeld: 0,
        meldingen: 1,
    });
    assert.equal(plafond, 100);
});

test('een gevolg kan de meters nooit onder nul duwen', () => {
    const stand = pasGevolgToe(
        { veiligeAccounts: 1, verlorenGeld: 0, meldingen: 0 },
        { melding: 'Drie accounts weg.', accountsKwijt: 3, geldKwijt: 250 }
    );
    assert.equal(stand.veiligeAccounts, 0);
    assert.equal(stand.verlorenGeld, 250);
});

test('een terechte melding telt op bij de meldingen en laat geen spoor achter', () => {
    const m = mail({ id: 1, juisteActie: 'melden' });
    const { stand, gebeurtenis } = verwerkHandeling(m, 'melden', gaaf);
    assert.equal(stand.meldingen, 1);
    assert.equal(stand.veiligeAccounts, 12);
    assert.equal(gebeurtenis, null);
});

test('een foute handeling past het gevolg toe en meldt het', () => {
    const m = mail({
        id: 1,
        juisteActie: 'melden',
        gevolg: { doorlaten: { melding: 'Meneer Smits klikte.', accountsKwijt: 1, geldKwijt: 400 } },
    });
    const { stand, gebeurtenis } = verwerkHandeling(m, 'doorlaten', gaaf);
    assert.equal(stand.veiligeAccounts, 11);
    assert.equal(stand.verlorenGeld, 400);
    assert.equal(gebeurtenis, 'Meneer Smits klikte.');
});

test('een acceptabele handeling kost de school niets', () => {
    const m = mail({
        id: 1,
        juisteActie: 'melden',
        acceptabeleActie: 'weggooien',
        gevolg: { weggooien: { melding: 'Zou niet moeten gebeuren.', accountsKwijt: 5 } },
    });
    const { stand, gebeurtenis } = verwerkHandeling(m, 'weggooien', gaaf);
    assert.equal(stand.veiligeAccounts, 12);
    assert.equal(gebeurtenis, null);
});
