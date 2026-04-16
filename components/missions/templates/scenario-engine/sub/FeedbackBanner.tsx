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

export const FeedbackBanner: React.FC<{
    round: ScenarioRound;
    selections: number[];
    onNext: () => void;
    isLast: boolean;
    hideButton?: boolean;
}> = ({ round, selections, onNext, isLast, hideButton }) => {
    const score = scoreRound(round, selections);
    const good = score >= 15; // 60% of 25

    return (
        <div
            className={`rounded-2xl border-2 p-4 mt-4 ${
                good ? 'border-[#10B981] bg-[#10B981]/5' : 'border-[#D97757] bg-[#D97757]/5'
            }`}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{good ? '🎉' : '💡'}</span>
                <span
                    className="text-sm font-black text-[#1A1A19]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {good ? (round.feedbackCorrect ?? 'Goed gedaan!') : (round.feedbackIncorrect ?? 'Bijna!')}
                </span>
            </div>
            <p
                className="text-xs text-[#6B6B66] mb-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Ronde score:{' '}
                <strong className={good ? 'text-[#10B981]' : 'text-[#D97757]'}>{score}/25</strong>
            </p>
            {!hideButton && (
                <button
                    onClick={onNext}
                    className="w-full py-2.5 rounded-full font-black text-sm bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white transition-all duration-200"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {isLast ? 'Bekijk eindresultaat' : 'Volgende ronde →'}
                </button>
            )}
        </div>
    );
};
