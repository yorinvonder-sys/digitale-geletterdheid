import React from 'react';
import type { ScenarioRound } from '../types';

export const BinaryChoiceRound: React.FC<{
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onChoice: (id: number, accepted: boolean) => void;
    onSubmit: () => void;
}> = ({ round, selections, submitted, onChoice, onSubmit }) => {
    const acceptedIds = new Set(selections.filter((id) => id > 0));
    const rejectedIds = new Set(selections.filter((id) => id < 0).map((id) => -id));
    const allAnswered = (acceptedIds.size + rejectedIds.size) === round.items.length;
    const acceptLabel = round.acceptLabel ?? 'Accepteren';
    const rejectLabel = round.rejectLabel ?? 'Weigeren';

    return (
        <>
            <div className="space-y-3 mb-4 mt-4">
                {round.items.map((item) => {
                    const isAccepted = acceptedIds.has(item.id);
                    const isRejected = rejectedIds.has(item.id);
                    const isAnswered = isAccepted || isRejected;
                    const isCorrectAnswer = item.correct === true ? isAccepted : isRejected;
                    const isWrong = submitted && isAnswered && !isCorrectAnswer;
                    const feedbackText = isWrong && item.wrongFeedback ? item.wrongFeedback : item.explanation;

                    return (
                        <div
                            key={item.id}
                            className={`rounded-2xl border-2 p-4 transition-all duration-200 ${
                                submitted && isAnswered
                                    ? isCorrectAnswer
                                        ? 'border-[#5F947D] bg-[#5F947D]/5'
                                        : 'border-lab-coral bg-[#D97848]/10'
                                    : 'border-[#E7D8BD] bg-white'
                            }`}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-xl mt-0.5">{item.icon}</span>
                                <div className="flex-1">
                                    <p
                                        className="text-sm font-bold text-[#08283B] mb-1"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {item.title}
                                    </p>
                                    <p
                                        className="text-xs text-[#445865] leading-relaxed"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {!submitted && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onChoice(item.id, true)}
                                        className={`flex-1 min-h-[44px] py-2 rounded-lg text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848]/40 ${
                                            isAccepted
                                                ? 'bg-[#D97848] text-white'
                                                : 'bg-[#FCF6EA] text-[#445865] hover:bg-[#D97848]/10 hover:text-[#D97848] border border-[#E7D8BD]'
                                        }`}
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        ✓ {acceptLabel}
                                    </button>
                                    <button
                                        onClick={() => onChoice(item.id, false)}
                                        className={`flex-1 min-h-[44px] py-2 rounded-lg text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08283B]/30 ${
                                            isRejected
                                                ? 'bg-[#08283B] text-white'
                                                : 'bg-[#FCF6EA] text-[#445865] hover:bg-[#08283B]/10 hover:text-[#08283B] border border-[#E7D8BD]'
                                        }`}
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        ✕ {rejectLabel}
                                    </button>
                                </div>
                            )}

                            {submitted && isAnswered && (
                                <div
                                    className={`mt-2 text-[11px] italic leading-relaxed ${
                                        isCorrectAnswer ? 'text-[#5F947D]' : 'text-[#08283B]'
                                    }`}
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {isCorrectAnswer ? '✓ ' : '✕ '}
                                    {feedbackText}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!submitted && allAnswered && (
                <button
                    onClick={onSubmit}
                    className="w-full py-3 rounded-full font-black text-sm bg-[#D97848] hover:bg-[#D97848] hover:brightness-95 hover:shadow-md active:scale-[0.98] text-white transition-all duration-300"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer keuzes
                </button>
            )}
            {!submitted && !allAnswered && (
                <p
                    className="text-center text-xs text-[#445865] mt-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Beantwoord alle scenario's om door te gaan
                </p>
            )}
        </>
    );
};
