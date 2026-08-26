import assert from 'node:assert/strict';
import test from 'node:test';

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
    // "persoonsgegevens", anders mist de check juist de vaktaal.
    assert.equal(relevanceFactor('Het gaat om persoonsgegevens van leerlingen.', LEGAAL_KEYWORDS), 1);
    assert.equal(relevanceFactor('Ik gebruik schoolgegevens uit het systeem.', LEGAAL_KEYWORDS), 1);
});

test('een kort kernbegrip telt wél als het als heel woord voorkomt', () => {
    assert.equal(relevanceFactor('Mag dat zomaar?', LEGAAL_KEYWORDS), 1);
});
