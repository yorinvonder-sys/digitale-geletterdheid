import assert from 'node:assert/strict';
import test from 'node:test';

import { ITEM_SCORE_SCALE, scoreRound, scoreRoundLegacy } from '../src/features/missions/templates/scenario-engine/sub/scoring.ts';
import type { ScenarioRound } from '../src/features/missions/templates/scenario-engine/types.ts';

/** Volgorde-ronde met n items, waarvan de juiste volgorde 1, 2, … n is. */
function orderRound(n: number): ScenarioRound {
    return {
        id: `orde-${n}`,
        emoji: '🔢',
        title: `Zet ${n} stappen op volgorde`,
        description: 'Testronde',
        type: 'order-priority',
        items: Array.from({ length: n }, (_, i) => ({
            id: i + 1,
            icon: '•',
            title: `Stap ${i + 1}`,
            description: '',
            correctPosition: i,
            explanation: '',
        })),
        maxScore: ITEM_SCORE_SCALE,
    };
}

const perfectOrder = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1);

function shuffled(n: number): number[] {
    const order = perfectOrder(n);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}

test('een foutloze volgorde levert nog steeds de volle itemscore op', () => {
    for (const n of [4, 5, 6]) {
        assert.equal(scoreRound(orderRound(n), perfectOrder(n)), ITEM_SCORE_SCALE, `n=${n}`);
    }
});

/**
 * Bovengrens op de gemiddelde gokscore. De aftrek van de verwachte gokscore zet
 * het gemiddelde niet exact op 0: door de ondergrens op 0 tellen de permutaties
 * die tóch boven de verwachting uitkomen wél mee. Exact uitgerekend over alle
 * permutaties levert dat 15,2% (n=4), 12,0% (n=5) en 9,7% (n=6) van de schaal —
 * tegen 44%, 37% en 30% met de oude formule.
 */
const MAX_GUESS_FRACTION = 0.2;

test('willekeurig slepen levert gemiddeld bijna niets op', () => {
    const runs = 2000;
    for (const n of [4, 5, 6]) {
        const round = orderRound(n);
        let total = 0;
        for (let i = 0; i < runs; i++) {
            total += scoreRound(round, shuffled(n));
        }
        const average = total / runs;
        assert.ok(
            average < ITEM_SCORE_SCALE * MAX_GUESS_FRACTION,
            `n=${n}: gemiddelde gokscore ${average.toFixed(2)} is niet onder ${(ITEM_SCORE_SCALE * MAX_GUESS_FRACTION).toFixed(2)}`,
        );
    }
});

test('één verwisseling van twee buren scoort ruim boven de helft', () => {
    for (const n of [4, 5, 6]) {
        const order = perfectOrder(n);
        [order[0], order[1]] = [order[1], order[0]];
        const score = scoreRound(orderRound(n), order);
        assert.ok(
            score > ITEM_SCORE_SCALE / 2,
            `n=${n}: bijna-foutloze volgorde scoort ${score}, niet meer dan ${ITEM_SCORE_SCALE / 2}`,
        );
    }
});

/**
 * Grandfather-garantie: rondes die vóór de gokcorrectie zijn ingezonden
 * (opgeslagen voortgang zonder bevroren `earnedItemScore`) worden met de
 * legacy-formule gescoord en houden zo exact hun destijds getoonde score.
 * Voorbeeld uit de tegenlezing: één burenwissel bij n=4 was 19/25 en zou met
 * de nieuwe formule 14/25 worden — de legacy-route houdt hem op 19.
 */
test('legacy-formule houdt eerder ingezonden rondes op hun oude score', () => {
    const round = orderRound(4);
    const swapped = [2, 1, 3, 4];
    assert.equal(scoreRoundLegacy(round, swapped), 19);
    assert.equal(scoreRound(round, swapped), 14);
    assert.equal(scoreRoundLegacy(round, perfectOrder(4)), ITEM_SCORE_SCALE);
});
