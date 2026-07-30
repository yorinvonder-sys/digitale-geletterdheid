import React from 'react';
import type { ScenarioRound } from '../types';

function scoreSelectCorrect(items: ScenarioRound['items'], selections: number[]): number {
    const correctIds = items.filter((i) => i.correct).map((i) => i.id);
    const correctSelected = selections.filter((id) => correctIds.includes(id)).length;
    const incorrectSelected = selections.filter((id) => !correctIds.includes(id)).length;
    return Math.max(0, Math.round((correctSelected / correctIds.length) * 25 - incorrectSelected * 4));
}

function scoreOrderPriority(items: ScenarioRound['items'], order: number[]): number {
    if (order.length !== items.length) return 0;
    let correct = 0;
    for (let i = 0; i < order.length; i++) {
        const item = items.find((it) => it.id === order[i])!;
        if (item.correctPosition === i) correct++;
        else if (Math.abs((item.correctPosition ?? 0) - i) === 1) correct += 0.5;
    }
    return Math.round((correct / items.length) * 25);
}

function scoreBinaryChoice(items: ScenarioRound['items'], selections: number[]): number {
    const acceptedIds = new Set(selections.filter((id) => id > 0));
    const rejectedIds = new Set(selections.filter((id) => id < 0).map((id) => -id));
    let correct = 0;
    for (const item of items) {
        if (item.correct === true && acceptedIds.has(item.id)) correct++;
        if (item.correct === false && rejectedIds.has(item.id)) correct++;
    }
    return Math.round((correct / items.length) * 25);
}

export function scoreRound(round: ScenarioRound, selections: number[]): number {
    switch (round.type) {
        case 'select-correct': return scoreSelectCorrect(round.items, selections);
        case 'order-priority': return scoreOrderPriority(round.items, selections);
        case 'binary-choice': return scoreBinaryChoice(round.items, selections);
    }
}

/** Schaal waarop de scoreRound-functies hierboven rekenen. */
const ITEM_SCORE_SCALE = 25;

/** Punten binnen round.maxScore die voor de followUp-vraag gereserveerd zijn. */
export function followUpWeight(round: ScenarioRound): number {
    if (!round.followUp) return 0;
    return Math.max(0, Math.min(round.followUpWeight ?? 0, round.maxScore));
}

/**
 * Maximaal haalbare itemscore. Zonder followUpWeight blijft dit de historische
 * schaal van 25 die scoreRound hanteert, ook als round.maxScore daarvan afwijkt.
 */
export function itemsMaxScore(round: ScenarioRound): number {
    const weight = followUpWeight(round);
    return weight > 0 ? round.maxScore - weight : ITEM_SCORE_SCALE;
}

/** Itemscore geschaald naar itemsMaxScore. Zonder followUpWeight identiek aan scoreRound. */
export function scaledItemScore(round: ScenarioRound, selections: number[]): number {
    const base = scoreRound(round, selections);
    if (followUpWeight(round) <= 0) return base;
    return Math.round((base / ITEM_SCORE_SCALE) * itemsMaxScore(round));
}

export const FeedbackBanner: React.FC<{
    round: ScenarioRound;
    selections: number[];
    onNext: () => void;
    isLast: boolean;
    hideButton?: boolean;
}> = ({ round, selections, onNext, isLast, hideButton }) => {
    // rawScore staat altijd op de schaal 0–25; drempels horen daarop te rekenen.
    // score/scoreMax zijn wat de leerling ziet en zijn geschaald wanneer de ronde
    // punten reserveert voor de followUp-vraag.
    const rawScore = scoreRound(round, selections);
    const good = rawScore >= 15; // 60% of 25
    const score = scaledItemScore(round, selections);
    const scoreMax = itemsMaxScore(round);
    // Alleen een foutloos antwoord verdient de feestelijke tekst. Vergelijk op de
    // getoonde schaal (score/scoreMax), niet op round.maxScore: die bevat ook de
    // punten die voor de followUp-vraag zijn gereserveerd, en die meet deze banner niet.
    const perfect = scoreMax > 0 && score >= scoreMax;

    // De config-tekst `feedbackCorrect` viert vaak een foutloos antwoord ("Perfect!"),
    // dus die tonen we alleen bij een volledige itemscore. Goed-maar-niet-foutloos
    // krijgt een kloppende tekst in plaats van een vals "Perfect!".
    const heading = perfect
        ? (round.feedbackCorrect ?? 'Helemaal goed!')
        : good
            ? 'Goed bezig! Bijna foutloos — bekijk de uitleg voor de laatste puntjes.'
            : (round.feedbackIncorrect ?? 'Bijna!');

    return (
        <div
            data-qa="scenario-feedback"
            className={`rounded-2xl border-2 p-4 mt-4 ${
                good ? 'border-duck-ink bg-duck-ink/5' : 'border-duck-acid bg-duck-acid/5'
            }`}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{perfect ? '🎉' : good ? '👍' : '💡'}</span>
                <span
                    className="text-sm font-black text-duck-ink"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {heading}
                </span>
            </div>
            <p
                className="text-xs text-duck-ink/60 mb-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Ronde score:{' '}
                <strong className={good ? 'text-duck-ink' : 'text-duck-error'}>{score}/{scoreMax}</strong>
            </p>
            {!hideButton && (
                <button
                    data-qa="scenario-next"
                    onClick={onNext}
                    className="w-full min-h-[44px] py-2.5 rounded-full font-black text-sm bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-duck-ink transition-all duration-200"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {isLast ? 'Bekijk eindresultaat' : 'Volgende ronde →'}
                </button>
            )}
        </div>
    );
};
