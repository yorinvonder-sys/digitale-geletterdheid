import assert from 'node:assert/strict';
import test from 'node:test';

import {
    DRAWING_MODERATION_NOTICE,
    createModeratedDrawingResult,
    isModeratedDrawingResult,
} from '../src/services/drawingModeration.ts';

test('ONGEPAST als hoofdgok wordt als moderatie herkend', () => {
    assert.equal(isModeratedDrawingResult({
        mainGuess: 'ONGEPAST',
        guesses: [{ label: 'ONGEPAST', confidence: 0 }],
        reasoning: 'model-uitleg'
    }), true);
});

test('ongepast in kleine letters wordt ook als moderatie herkend', () => {
    assert.equal(isModeratedDrawingResult({
        mainGuess: 'ongepast',
        guesses: [{ label: 'kat', confidence: 80 }],
        reasoning: 'model-uitleg'
    }), true);
});

test('ONGEPAST verderop in de guesses-lijst wordt herkend', () => {
    assert.equal(isModeratedDrawingResult({
        guesses: [
            { label: 'huis', confidence: 60 },
            { label: ' Ongepast ', confidence: 0 }
        ],
        reasoning: 'model-uitleg'
    }), true);
});

test('een gewone gok is geen moderatie', () => {
    assert.equal(isModeratedDrawingResult({
        mainGuess: 'kat',
        guesses: [{ label: 'kat', confidence: 90 }, { label: 'hond', confidence: 10 }],
        reasoning: 'Vier poten en snorharen'
    }), false);
});

test('het expliciete moderated-veld van de server telt ook zonder label', () => {
    assert.equal(isModeratedDrawingResult({
        moderated: true,
        guesses: [],
        mainGuess: null,
        reasoning: ''
    }), true);
});

test('een moderatie-antwoord levert geen guesses of reasoning door aan de speler', () => {
    const payload = {
        mainGuess: 'ONGEPAST',
        guesses: [{ label: 'ONGEPAST', confidence: 0 }],
        reasoning: 'gevoelige modeltekst'
    };

    assert.equal(isModeratedDrawingResult(payload), true);

    const doorgegeven = createModeratedDrawingResult();
    assert.deepEqual(doorgegeven.guesses, []);
    assert.equal(doorgegeven.mainGuess, '');
    assert.equal(doorgegeven.reasoning, '');
    assert.equal(doorgegeven.moderated, true);
});

test('de melding aan de leerling bevat geen label en geen modeltekst', () => {
    assert.equal(DRAWING_MODERATION_NOTICE.toUpperCase().includes('ONGEPAST'), false);
    assert.equal(/beoordelen/.test(DRAWING_MODERATION_NOTICE), true);
});
