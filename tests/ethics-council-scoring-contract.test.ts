import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

import {
    relevanceFactor,
    substanceFactor,
} from '../src/features/missions/templates/ethics-council/sub/textSubstance.ts';
import config from '../src/features/missions/templates/ethics-council/configs/review-week-3.ts';

const LEGAAL_KEYWORDS = config.legaalKeywords ?? [];
const TRANSPARANT_KEYWORDS = config.transparantKeywords ?? [];

// ── relevanceFactor: inhoudelijke check ───────────────────────

test('een inhoudelijk relevant antwoord houdt factor 1', () => {
    assert.equal(
        relevanceFactor(
            'Ik vraag eerst toestemming voordat ik iemands foto in mijn app zet.',
            LEGAAL_KEYWORDS
        ),
        1
    );
    assert.equal(
        relevanceFactor(
            'Mijn app legt in gewone taal uit wat er met je antwoorden gebeurt.',
            TRANSPARANT_KEYWORDS
        ),
        1
    );
});

test('gevarieerde maar irrelevante tekst zakt naar de zwakke factor', () => {
    const nonsense = 'bananen fiets maandag zwembad olifant tandenborstel';

    // Toon eerst aan dat de bestaande anti-letterbrij-laag hier niets doet:
    // de tekst is gevarieerd, dus alleen de inhoudelijke check kan hem raken.
    assert.equal(substanceFactor(nonsense), 1);

    assert.equal(relevanceFactor(nonsense, LEGAAL_KEYWORDS), 0.7);
    assert.equal(relevanceFactor(nonsense, TRANSPARANT_KEYWORDS), 0.7);
});

test('een kernbegrip in verbogen vorm telt mee', () => {
    assert.equal(relevanceFactor('Ik heb alle toestemmingen geregeld.', ['toestemming']), 1);
    assert.equal(relevanceFactor('Ik bewaar persoonsgegevens van klasgenoten.', ['gegeven']), 1);
});

test('de match is hoofdletterongevoelig', () => {
    assert.equal(relevanceFactor('TOESTEMMING is verplicht', ['toestemming']), 1);
    assert.equal(relevanceFactor('ik vraag toestemming', ['Toestemming']), 1);
});

test('een lege keywordlijst geeft altijd 1', () => {
    assert.equal(relevanceFactor('bananen fiets maandag zwembad', []), 1);
    assert.equal(relevanceFactor('', []), 1);
});

test('de zwakke factor is instelbaar en blijft een deelscore, geen nul', () => {
    assert.equal(relevanceFactor('bananen fiets', ['toestemming'], 0.5), 0.5);
    assert.ok(relevanceFactor('bananen fiets', ['toestemming']) > 0);
});

// ── Regressie: substanceFactor blijft ongewijzigd ─────────────

test('substanceFactor knijpt letterbrij en herhaling nog steeds af', () => {
    assert.equal(substanceFactor('aaaaaaaaaaaaaaaaaaaa'), 0.25);
    assert.equal(substanceFactor('test test test test test'), 0.25);
});

test('substanceFactor laat een echte zin ongemoeid', () => {
    assert.equal(
        substanceFactor('Ik vraag toestemming voordat ik gegevens van anderen opsla.'),
        1
    );
});

// ── Config-contract ───────────────────────────────────────────

test('de tekstdossiers met een lijst hebben een ruime set kernbegrippen', () => {
    assert.ok(LEGAAL_KEYWORDS.length >= 20, `legaal: ${LEGAAL_KEYWORDS.length}`);
    assert.ok(TRANSPARANT_KEYWORDS.length >= 20, `transparant: ${TRANSPARANT_KEYWORDS.length}`);
});

test('het uitdagingsdossier krijgt bewust geen keywordlijst', () => {
    // Een reactie op één specifiek tegenargument laat zich niet vangen in een
    // vaste woordenlijst; daar zou de factor eerlijke antwoorden korten.
    assert.ok(!('uitdagingKeywords' in config));
});

// ── Adversariële gevallen ─────────────────────────────────────
// Beide reviewrondes (Codex-gate én de Playwright-speeltest) vonden
// onafhankelijk van elkaar hetzelfde gat: korte kernbegrippen matchten als
// losse letterreeks midden in doodgewone woorden, waardoor een volstrekt
// onderwerploos antwoord de rem ontliep. Deze tests pinnen dat dicht.

test('een kort kernbegrip raakt niet toevallig midden in een gewoon woord', () => {
    const offTopic = [
        'Ik ging boodschappen doen en wilde iets kopen voor mijn collega.',
        'De magnetron maakte een grappig geluid en mijn gezin moest lachen.',
    ];
    for (const zin of offTopic) {
        assert.equal(
            relevanceFactor(zin, LEGAAL_KEYWORDS),
            0.7,
            `had off-topic moeten zijn: ${zin}`
        );
        assert.equal(
            relevanceFactor(zin, TRANSPARANT_KEYWORDS),
            0.7,
            `had off-topic moeten zijn (transparant): ${zin}`
        );
    }
});

test('een goed antwoord in eigen woorden houdt de volle factor', () => {
    // Geen vakterm, wel duidelijk over het dilemma — mag nooit gekort worden.
    const parafrases = [
        'Je mag iemands gegevens niet zomaar gebruiken als diegene daar geen ja op heeft gezegd.',
        'Er staan dingen van kinderen in en zij konden daar niet mee instemmen.',
    ];
    for (const zin of parafrases) {
        assert.equal(relevanceFactor(zin, LEGAAL_KEYWORDS), 1, `werd onterecht gekort: ${zin}`);
    }
});

test('een lang kernbegrip telt ook binnen een samenstelling', () => {
    // Nederlandse samenstellingen: 'gegeven' hoort te matchen in
    // "persoonsgegevens", anders mist de check juist de vaktaal. Getest met
    // een lijst van één begrip zodat de twee-begrippen-drempel het
    // samenstellingsgedrag zelf niet maskeert.
    assert.equal(relevanceFactor('Ik bewaar persoonsgegevens in het systeem.', ['gegeven']), 1);
    assert.equal(relevanceFactor('Ik gebruik schoolgegevens uit het systeem.', ['gegeven']), 1);
    // En in een echte zin telt de samenstelling gewoon mee als één van de
    // twee vereiste begrippen.
    assert.equal(relevanceFactor('Ik bewaar persoonsgegevens zonder toestemming.', LEGAAL_KEYWORDS), 1);
});

test('een kort kernbegrip telt wél als heel woord, maar één treffer alleen is niet genoeg', () => {
    // 'mag' is een heel woord en dus een geldige treffer, maar een antwoord
    // moet minstens twee verschillende kernbegrippen raken voor de volle
    // factor — anders geeft elk alledaags woord uit de lijst gratis punten.
    assert.equal(relevanceFactor('Mag dat zomaar?', LEGAAL_KEYWORDS), 0.7);
    assert.equal(relevanceFactor('Mag je zomaar toestemming overslaan?', LEGAAL_KEYWORDS), 1);
});

test('één woord telt nooit als twee begrippen, ook niet via overlappende lijst-items', () => {
    // Bypass uit de slotronde: 'persoonsgegevens' raakt zowel 'persoon' als
    // 'gegeven', en 'begrijpelijk' raakt 'begrijp' — maar het blijft één
    // woord en dus één treffer. Los ingestuurd hoort dat 0.7 te geven.
    assert.equal(relevanceFactor('persoonsgegevens', LEGAAL_KEYWORDS), 0.7);
    assert.equal(relevanceFactor('gevraagd', LEGAAL_KEYWORDS), 0.7);
    assert.equal(relevanceFactor('begrijpelijk', TRANSPARANT_KEYWORDS), 0.7);
    // Hetzelfde woord twee keer typen is óók maar één begrip.
    assert.equal(relevanceFactor('toestemming toestemming', LEGAAL_KEYWORDS), 0.7);
});

test('geen kernbegrip staat dubbel in een lijst', () => {
    for (const [naam, lijst] of [['legaal', LEGAAL_KEYWORDS], ['transparant', TRANSPARANT_KEYWORDS]] as const) {
        assert.equal(new Set(lijst).size, lijst.length, `dubbele entry in ${naam}Keywords`);
    }
});

test('één generiek kernbegrip in verder onderwerploze tekst geeft geen volle factor', () => {
    // De directe omzeiling uit de gate-review: alledaagse lijstwoorden als
    // 'school' of 'project' in een verhaal dat nergens over het dilemma gaat.
    assert.equal(
        relevanceFactor('Ik ging gisteren na school lekker voetballen met vrienden op het veld.', LEGAAL_KEYWORDS),
        0.7
    );
    assert.equal(
        relevanceFactor('Mijn project ging over voetbal en we hebben heel hard gerend buiten.', TRANSPARANT_KEYWORDS),
        0.7
    );
});

test('de matcher gebruikt geen lookbehind-regex (crasht op oudere iPad-Safari)', async () => {
    // Scholen draaien op iPads t/m iPadOS 15/16.3, waar lookbehind een
    // SyntaxError gooit bij het BOUWEN van de regex — de missie crashte dan
    // precies op het inleveren. Tokenisatie heeft dat probleem niet.
    const bron = await readFile(
        new URL('../src/features/missions/templates/ethics-council/sub/textSubstance.ts', import.meta.url),
        'utf8'
    );
    assert.ok(!bron.includes('(?<'), 'geen lookbehind/lookbehind-negatie in textSubstance.ts');
});
