import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const portfolio = read('src/features/missions/templates/builder-canvas/configs/portfolio-builder.ts');
const prototype = read('src/features/missions/templates/builder-canvas/configs/prototype-developer.ts');
const pitch = read('src/features/missions/templates/builder-canvas/configs/pitch-perfect.ts');
const year3 = read('src/config/agents/year3.tsx');

const roleBlock = (source: string, id: string) => {
    const start = source.indexOf(`id: '${id}'`);
    const end = source.indexOf("id: '", start + 1);
    assert.ok(start >= 0, `role ${id} ontbreekt`);
    return source.slice(start, end >= 0 ? end : undefined);
};

test('portfolio-content vraagt niet om identificeerbare profiel- of deelgegevens', () => {
    assert.match(portfolio, /pseudoniem|initialen|zonder naam/i);
    assert.match(portfolio, /afgeschermd|geredigeerd/i);
    assert.match(portfolio, /door je docent goedgekeurde omgeving/i);
    assert.doesNotMatch(portfolio, /Neem op: 1\) Wie je bent \(naam, leerjaar, richting\)/i);
    assert.doesNotMatch(portfolio, /Welke secties.*Contact\)/i);
    assert.doesNotMatch(portfolio, /Maak je portfolio deelbaar/i);
    assert.doesNotMatch(portfolio, /\[LINK\/PDF\]/i);
});

test('prototype-content gebruikt toestemming, dataminimalisatie en anonieme Tester A/B-observaties', () => {
    assert.match(prototype, /vrijwillige peer- of volwassen testers met toestemming/i);
    assert.match(prototype, /anonieme Tester A[/-]?(?: en )?Tester B|Tester A\/B/i);
    assert.match(prototype, /zo min mogelijk gegevens|data minimaliseerde/i);
    assert.doesNotMatch(prototype, /Wie heeft je prototype getest/i);
    assert.doesNotMatch(prototype, /klasgenoot, familielid/i);
    assert.doesNotMatch(prototype, /wat deden of zeiden ze/i);
    assert.doesNotMatch(prototype, /Laat minimaal 2 personen je prototype testen/i);
});

test('pitch-content stuurt naar timer/rubric of anonieme feedback zonder opnames of links', () => {
    assert.match(pitch, /timer en rubric-zelfreview/i);
    assert.match(pitch, /anonieme peerfeedback/i);
    assert.doesNotMatch(pitch, /Zet je pitch op video/i);
    assert.doesNotMatch(pitch, /Wie heb je je pitch laten horen/i);
    assert.doesNotMatch(pitch, /\[BESCHRIJVING\/LINK\]/i);
});

test('de drie J3-P4 coaches zijn op leeftijd 14 en volgen de privacyveilige actieve configuratie', () => {
    for (const id of ['portfolio-builder', 'prototype-developer', 'pitch-perfect']) {
        const role = roleBlock(year3, id);
        assert.match(role, /leerlingen van 14 jaar/i, `${id} noemt leeftijd 14 niet`);
        assert.doesNotMatch(role, /15-16 jaar/i, `${id} bevat oude leeftijd 15-16`);
    }

    const portfolioRole = roleBlock(year3, 'portfolio-builder');
    assert.match(portfolioRole, /pseudoniem|initialen|geen naam/i);
    assert.match(portfolioRole, /afgeschermd|geredigeerd/i);
    assert.match(portfolioRole, /goedgekeurde omgeving/i);
    assert.doesNotMatch(portfolioRole, /\[LINK\/PDF\]|openbare link aanvragen/i);

    const prototypeRole = roleBlock(year3, 'prototype-developer');
    assert.match(prototypeRole, /toestemming/i);
    assert.match(prototypeRole, /Tester A\/B/i);
    assert.doesNotMatch(prototypeRole, /Tester 1 zei|Tester 2 zei/i);

    const pitchRole = roleBlock(year3, 'pitch-perfect');
    assert.match(pitchRole, /timer.*rubric-zelfreview|anonieme peerfeedback/i);
    assert.doesNotMatch(pitchRole, /\[BESCHRIJVING\/LINK\]|op video/i);
});
