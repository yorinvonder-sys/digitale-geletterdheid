import React from 'react';
import { Check, X } from 'lucide-react';
import type { ScenarioRound } from '../types';

export const SelectCorrectRound: React.FC<{
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onToggle: (id: number) => void;
    onSubmit: () => void;
}> = ({ round, selections, submitted, onToggle, onSubmit }) => {
    const correctCount = round.items.filter((item) => item.correct).length;
    const minSelections = round.minSelections ?? correctCount;
    const canSubmit = selections.length >= Math.max(1, minSelections);
    const instruction = round.selectionInstruction
        ?? (minSelections > 1
            ? `Selecteer minimaal ${minSelections} opties`
            : 'Selecteer de beste optie');

    return (
    <>
        {!submitted && (
            <p
                className="text-[10px] font-black text-[#445865] uppercase tracking-widest mt-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {instruction}
            </p>
        )}
        <div className="grid grid-cols-2 gap-2 mb-3 mt-3">
            {round.items.map((item) => {
                const isSelected = selections.includes(item.id);
                let border = 'border-[#E7D8BD]';
                let bg = 'bg-white';

                if (isSelected && !submitted) { border = 'border-[#D97848] ring-1 ring-[#D97848]/20'; bg = 'bg-[#D97848]/5'; }
                if (submitted && isSelected && item.correct) { border = 'border-[#5F947D]'; bg = 'bg-[#5F947D]/5'; }
                if (submitted && isSelected && !item.correct) { border = 'border-lab-coral'; bg = 'bg-[#D97848]/10'; }
                if (submitted && !isSelected && item.correct) { border = 'border-[#5F947D]/40'; bg = 'bg-[#5F947D]/5'; }
                if (submitted && !isSelected && !item.correct) { bg = 'bg-[#E7D8BD]'; }

                const isWrong = submitted && ((isSelected && !item.correct) || (!isSelected && item.correct));
                const feedbackText = isWrong && item.wrongFeedback ? item.wrongFeedback : item.explanation;

                return (
                    <button
                        key={item.id}
                        onClick={() => !submitted && onToggle(item.id)}
                        disabled={submitted}
                        data-qa="scenario-option"
                        className={`w-full rounded-xl border-2 p-3 text-left transition-all duration-200 sm:p-4 ${border} ${bg}`}
                    >
                        <div className="flex items-start gap-2 sm:gap-3">
                            <span className="shrink-0 text-lg mt-0.5 sm:text-xl">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5 sm:mb-1">
                                    <span
                                        className="min-w-0 max-w-full text-sm font-bold text-[#08283B] break-words"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {item.title}
                                    </span>
                                    {isSelected && !submitted && (
                                        <span className="shrink-0 text-[10px] bg-[#D97848]/10 text-[#D97848] px-2 py-0.5 rounded-full font-bold">geselecteerd</span>
                                    )}
                                    {submitted && isSelected && (
                                        item.correct
                                            ? <Check size={14} className="shrink-0 text-[#5F947D]" />
                                            : <X size={14} className="shrink-0 text-lab-muted" />
                                    )}
                                    {submitted && !isSelected && item.correct && (
                                        <span className="shrink-0 text-[10px] text-[#5F947D] font-bold">gemist!</span>
                                    )}
                                </div>
                                <p className="sr-only">{item.description}</p>
                                {submitted && (isSelected || item.correct) && (
                                    <p
                                        className="text-[11px] text-[#445865] mt-2 italic"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {feedbackText}
                                    </p>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
        {!submitted && minSelections > 1 && (
            <p
                className="text-center text-xs text-[#445865] mb-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {selections.length} van minimaal {Math.max(1, minSelections)} item{minSelections !== 1 ? 's' : ''} geselecteerd
            </p>
        )}
        {!submitted && (
            <div className="sticky bottom-0 z-10 -mx-1 bg-[#FCF6EA]/95 px-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm sm:static sm:m-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-0">
                <button
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    data-qa="scenario-submit"
                    className={`w-full py-3 rounded-full font-black text-sm transition-all duration-300 ${
                        canSubmit
                            ? 'bg-[#D97848] hover:bg-[#D97848] hover:brightness-95 hover:shadow-md active:scale-[0.98] text-white'
                            : 'bg-[#E7D8BD] text-[#445865] cursor-not-allowed'
                    }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer mijn keuze
                </button>
            </div>
        )}
    </>
    );
};
