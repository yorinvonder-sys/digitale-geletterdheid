import React from 'react';
import type { ScenarioRound } from '../types';
import { scoringKind, scoreRound, itemsMaxScore, scaledItemScore } from './scoring';

// De pure scoreformules staan in ./scoring.ts (JSX-vrij, zodat contracttests ze
// rechtstreeks kunnen aanroepen). Deze re-export houdt de bestaande importpaden
// van ScenarioEngine.tsx intact.
export { followUpWeight, itemsMaxScore, scaledItemScore, scoreRound, scoringKind } from './scoring';

const warnedRounds = new Set<string>();

/**
 * Een select-correct-ronde met één afleider is niet betrouwbaar te scoren: "vink
 * alles aan" en "alle juiste items plus die ene afleider" zijn dan letterlijk
 * dezelfde selectie, dus geen enkele formule kan de gokker van de bijna-perfecte
 * leerling scheiden. De scoring kiest daar een middenweg (zie MAX_FALSE_PENALTY
 * in ./scoring.ts); de echte oplossing is een tweede afleider in de config. Deze
 * waarschuwing maakt dat zichtbaar voor de auteur, alleen in ontwikkelmodus.
 */
function warnIfUnscorable(round: ScenarioRound): void {
    if (!import.meta.env.DEV) return;
    if (scoringKind(round) !== 'select-correct') return;
    if (warnedRounds.has(round.id)) return;
    const distractors = round.items.filter((i) => !i.correct).length;
    if (distractors >= 2) return;
    warnedRounds.add(round.id);
    console.warn(
        `[scenario-engine] Ronde "${round.id}" heeft ${distractors} afleider(s). ` +
        'Met minder dan twee afleiders is "alles aanvinken" niet te onderscheiden van een ' +
        'bijna-foutloos antwoord en levert het de helft van de punten op. Voeg een tweede afleider toe.'
    );
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
        warnIfUnscorable(round);
    }, [round]);

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
