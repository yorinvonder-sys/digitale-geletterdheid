import React from 'react';
import { Check, X } from 'lucide-react';
import type { ScenarioRound } from '../types';

export const SelectCorrectRound: React.FC<{
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onToggle: (id: number) => void;
    onSubmit: () => void;
}> = ({ round, selections, submitted, onToggle, onSubmit }) => (
    <>
        <div className="grid gap-3 mb-4 mt-4">
            {round.items.map((item) => {
                const isSelected = selections.includes(item.id);
                let border = 'border-[#E8E6DF]';
                let bg = 'bg-white';

                if (isSelected && !submitted) { border = 'border-[#D97757] ring-1 ring-[#D97757]/20'; bg = 'bg-[#D97757]/5'; }
                if (submitted && isSelected && item.correct) { border = 'border-[#10B981]'; bg = 'bg-[#10B981]/5'; }
                if (submitted && isSelected && !item.correct) { border = 'border-red-400'; bg = 'bg-red-50'; }
                if (submitted && !isSelected && item.correct) { border = 'border-[#10B981]/40'; bg = 'bg-[#10B981]/5'; }
                if (submitted && !isSelected && !item.correct) { bg = 'bg-[#F0EEE8]'; }

                const isWrong = submitted && ((isSelected && !item.correct) || (!isSelected && item.correct));
                const feedbackText = isWrong && item.wrongFeedback ? item.wrongFeedback : item.explanation;

                return (
                    <button
                        key={item.id}
                        onClick={() => !submitted && onToggle(item.id)}
                        disabled={submitted}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${border} ${bg}`}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="text-sm font-bold text-[#1A1A19]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {item.title}
                                    </span>
                                    {isSelected && !submitted && (
                                        <span className="text-[10px] bg-[#D97757]/10 text-[#D97757] px-2 py-0.5 rounded-full font-bold">geselecteerd</span>
                                    )}
                                    {submitted && isSelected && (
                                        item.correct
                                            ? <Check size={14} className="text-[#10B981]" />
                                            : <X size={14} className="text-red-500" />
                                    )}
                                    {submitted && !isSelected && item.correct && (
                                        <span className="text-[10px] text-[#10B981] font-bold">gemist!</span>
                                    )}
                                </div>
                                <p
                                    className="text-xs text-[#6B6B66] leading-relaxed"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.description}
                                </p>
                                {submitted && (isSelected || item.correct) && (
                                    <p
                                        className="text-[11px] text-[#3D3D38] mt-2 italic"
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
        {!submitted && selections.length > 0 && (
            <p
                className="text-center text-xs text-[#6B6B66] mb-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {selections.length} item{selections.length !== 1 ? 's' : ''} geselecteerd
            </p>
        )}
        {!submitted && (
            <button
                onClick={onSubmit}
                disabled={selections.length === 0}
                className={`w-full py-3 rounded-full font-black text-sm transition-all duration-300 ${
                    selections.length > 0
                        ? 'bg-[#D97757] hover:bg-[#C46849] text-white'
                        : 'bg-[#E8E6DF] text-[#6B6B66] cursor-not-allowed'
                }`}
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Controleer mijn keuze
            </button>
        )}
    </>
);
