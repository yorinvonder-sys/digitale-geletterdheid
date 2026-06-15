import React from 'react';
import { Check, X } from 'lucide-react';
import type { ScenarioRound } from '../types';

const ScenarioIcon = ({ icon, className }: { icon: string; className: string }) => (
    icon.startsWith('/assets/') ? (
        <img src={icon} alt="" className={`object-contain ${className}`} width={24} height={24} loading="lazy" decoding="async" />
    ) : (
        <span className={className}>{icon}</span>
    )
);

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
                className="text-[10px] font-black text-duck-ink/60 uppercase tracking-widest mt-4"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {instruction}
            </p>
        )}
        <div className="grid gap-3 mb-4 mt-4">
            {round.items.map((item) => {
                const isSelected = selections.includes(item.id);
                let border = 'border-duck-gray';
                let bg = 'bg-white';

                if (isSelected && !submitted) { border = 'border-duck-acid ring-1 ring-duck-acid/20'; bg = 'bg-duck-acid/5'; }
                if (submitted && isSelected && item.correct) { border = 'border-duck-ink'; bg = 'bg-duck-ink/5'; }
                if (submitted && isSelected && !item.correct) { border = 'border-duck-error'; bg = 'bg-duck-acid/10'; }
                if (submitted && !isSelected && item.correct) { border = 'border-duck-ink/40'; bg = 'bg-duck-ink/5'; }
                if (submitted && !isSelected && !item.correct) { bg = 'bg-duck-gray'; }

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
                            <ScenarioIcon icon={item.icon} className="h-6 w-6 shrink-0 text-xl mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                                    <span
                                        className="min-w-0 max-w-full text-sm font-bold text-duck-ink break-words"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {item.title}
                                    </span>
                                    {isSelected && !submitted && (
                                        <span className="shrink-0 text-[10px] bg-duck-acid/10 text-duck-ink px-2 py-0.5 rounded-full font-bold">geselecteerd</span>
                                    )}
                                    {submitted && isSelected && (
                                        item.correct
                                            ? <Check size={14} className="shrink-0 text-duck-ink" />
                                            : <X size={14} className="shrink-0 text-duck-ink/60" />
                                    )}
                                    {submitted && !isSelected && item.correct && (
                                        <span className="shrink-0 text-[10px] text-duck-ink font-bold">gemist!</span>
                                    )}
                                </div>
                                <p
                                    className="text-xs text-duck-ink/60 leading-relaxed"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.description}
                                </p>
                                {submitted && (isSelected || item.correct) && (
                                    <p
                                        className="text-[11px] text-duck-ink/60 mt-2 italic"
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
                className="text-center text-xs text-duck-ink/60 mb-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {selections.length} van minimaal {Math.max(1, minSelections)} item{minSelections !== 1 ? 's' : ''} geselecteerd
            </p>
        )}
        {!submitted && (
            <button
                onClick={onSubmit}
                disabled={!canSubmit}
                className={`w-full py-3 rounded-full font-black text-sm transition-all duration-300 ${
                    canSubmit
                        ? 'bg-duck-acid hover:bg-duck-acid hover:brightness-95 hover:shadow-md active:scale-[0.98] text-duck-ink'
                        : 'bg-duck-gray text-duck-ink/60 cursor-not-allowed'
                }`}
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Controleer mijn keuze
            </button>
        )}
    </>
    );
};
