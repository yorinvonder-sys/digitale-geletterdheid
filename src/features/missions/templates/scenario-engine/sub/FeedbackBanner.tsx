import React from 'react';
import type { ScenarioRound } from '../types';

/** Schaal waarop de scoreRound-functies hieronder rekenen. */
const ITEM_SCORE_SCALE = 25;

/**
 * Evenredige aftrek: het aandeel juist aangevinkte items minus het aandeel
 * onterecht aangevinkte items. Alles aanvinken levert daardoor 0 op, terwijl
 * een foutloos antwoord de volle schaal haalt. De oude vaste aftrek van 4 punten
 * per fout liet "vink alles aan" nog ruim de helft scoren.
 */
function scoreSelectCorrect(items: ScenarioRound['items'], selections: number[]): number {
    const correctIds = items.filter((i) => i.correct).map((i) => i.id);
    const incorrectIds = items.filter((i) => !i.correct).map((i) => i.id);
    const correctSelected = selections.filter((id) => correctIds.includes(id)).length;
    const incorrectSelected = selections.filter((id) => incorrectIds.includes(id)).length;
    // Zonder juiste items valt er niets te vinden: dan telt alleen de aftrek.
    // Zonder onjuiste items is er niets fout te doen: dan telt alleen de treffer.
    const hitRate = correctIds.length > 0 ? correctSelected / correctIds.length : 1;
    const falseRate = incorrectIds.length > 0 ? incorrectSelected / incorrectIds.length : 0;
    return Math.max(0, Math.round((hitRate - falseRate) * ITEM_SCORE_SCALE));
}

function scoreOrderPriority(items: ScenarioRound['items'], order: number[]): number {
    if (order.length !== items.length) return 0;
    let correct = 0;
    for (let i = 0; i < order.length; i++) {
        // Geen non-null-assert: na een config-wijziging kan een opgeslagen id
        // verdwenen zijn, en deze functie draait bij elke render via totalScore.
        const item = items.find((it) => it.id === order[i]);
        if (!item) continue;
        if (item.correctPosition === i) correct++;
        else if (Math.abs((item.correctPosition ?? 0) - i) === 1) correct += 0.5;
    }
    return Math.round((correct / items.length) * ITEM_SCORE_SCALE);
}

/**
 * Juist minus fout: altijd dezelfde knop indrukken levert bij een evenwichtige
 * set 0 op in plaats van de helft. Onbeantwoorde items tellen niet mee.
 */
function scoreBinaryChoice(items: ScenarioRound['items'], selections: number[]): number {
    const acceptedIds = new Set(selections.filter((id) => id > 0));
    const rejectedIds = new Set(selections.filter((id) => id < 0).map((id) => -id));
    let correct = 0;
    let wrong = 0;
    for (const item of items) {
        const accepted = acceptedIds.has(item.id);
        const rejected = rejectedIds.has(item.id);
        if (!accepted && !rejected) continue;
        if (item.correct === true ? accepted : rejected) correct++;
        else wrong++;
    }
    if (items.length === 0) return 0;
    return Math.max(0, Math.round(((correct - wrong) / items.length) * ITEM_SCORE_SCALE));
}

export function scoreRound(round: ScenarioRound, selections: number[]): number {
    switch (round.type) {
        case 'select-correct': return scoreSelectCorrect(round.items, selections);
        case 'order-priority': return scoreOrderPriority(round.items, selections);
        case 'binary-choice': return scoreBinaryChoice(round.items, selections);
    }
}

/** Punten binnen round.maxScore die voor de followUp-vraag gereserveerd zijn. */
export function followUpWeight(round: ScenarioRound): number {
    if (!round.followUp) return 0;
    return Math.max(0, Math.min(round.followUpWeight ?? 0, round.maxScore));
}

/**
 * Maximaal haalbare itemscore: alle punten van de ronde, min wat voor de
 * followUp-vraag gereserveerd is.
 *
 * Eerder viel dit zonder followUpWeight terug op de vaste schaal van 25 die
 * scoreRound hanteert. Bij een ronde met een afwijkende `maxScore` bleef de rest
 * daardoor onbereikbaar: in `online-helden` (rondes van 30, 40 en 30) leverde
 * een foutloos antwoord 75 van de 100 punten op, terwijl de slaagdrempel wél
 * tegen 100 rekent. Voor de elf andere scenario-missies staat elke ronde op 25
 * en verandert er niets.
 */
export function itemsMaxScore(round: ScenarioRound): number {
    return Math.max(0, round.maxScore - followUpWeight(round));
}

/** Itemscore geschaald naar itemsMaxScore. Bij een ronde van 25 identiek aan scoreRound. */
export function scaledItemScore(round: ScenarioRound, selections: number[]): number {
    const base = scoreRound(round, selections);
    const max = itemsMaxScore(round);
    if (max === ITEM_SCORE_SCALE) return base;
    return Math.round((base / ITEM_SCORE_SCALE) * max);
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

    // De feedback verschijnt pas na inzenden; zonder aankondiging mist een
    // schermlezer hem volledig. role="status" leest hem voor, de focus brengt
    // toetsenbord- en schermlezergebruikers naar de uitslag toe.
    const bannerRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        bannerRef.current?.focus();
    }, []);

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
            ref={bannerRef}
            role="status"
            aria-live="polite"
            tabIndex={-1}
            className={`rounded-2xl border-2 p-4 mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink/40 ${
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
                className="text-xs text-duck-ink/70 mb-3"
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
