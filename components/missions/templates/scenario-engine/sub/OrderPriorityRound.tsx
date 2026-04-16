import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { ScenarioRound } from '../types';

export const OrderPriorityRound: React.FC<{
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onAdd: (id: number) => void;
    onReset: () => void;
    onSubmit: () => void;
}> = ({ round, selections, submitted, onAdd, onReset, onSubmit }) => {
    const remaining = round.items.filter((it) => !selections.includes(it.id));

    return (
        <div className="mt-4">
            {selections.length > 0 && (
                <div className="bg-[#FAF9F0] rounded-xl p-3 mb-4 border border-[#E8E6DF]">
                    <div className="flex items-center justify-between mb-2">
                        <span
                            className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Jouw volgorde
                        </span>
                        {!submitted && (
                            <button
                                onClick={onReset}
                                className="text-[#6B6B66] hover:text-[#D97757] transition-colors"
                                aria-label="Opnieuw beginnen"
                            >
                                <RotateCcw size={14} />
                            </button>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        {selections.map((id, i) => {
                            const item = round.items.find((it) => it.id === id)!;
                            const isCorrect = submitted && item.correctPosition === i;
                            const isClose = submitted && !isCorrect && Math.abs((item.correctPosition ?? 0) - i) === 1;
                            return (
                                <div
                                    key={id}
                                    className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                                        submitted
                                            ? isCorrect ? 'bg-[#10B981]/10 text-[#10B981]'
                                            : isClose ? 'bg-amber-50 text-amber-600'
                                            : 'bg-red-50 text-red-500'
                                            : 'bg-white text-[#3D3D38]'
                                    }`}
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                            submitted
                                                ? isCorrect ? 'bg-[#10B981] text-white'
                                                : isClose ? 'bg-amber-400 text-white'
                                                : 'bg-red-400 text-white'
                                                : 'bg-[#D97757]/20 text-[#D97757]'
                                        }`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span>{item.icon}</span>
                                    <span className="flex-1">{item.title}</span>
                                    {submitted && isCorrect && <Check size={12} />}
                                    {submitted && !isCorrect && (
                                        <span className="text-[10px] opacity-70">
                                            (#{(item.correctPosition ?? 0) + 1})
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {!submitted && remaining.length > 0 && (
                <div className="space-y-2 mb-4">
                    <p
                        className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Klik in volgorde (meest manipulatief eerst)
                    </p>
                    {remaining.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onAdd(item.id)}
                            className="w-full p-3 rounded-xl border-2 border-[#E8E6DF] bg-white hover:border-[#D97757] hover:bg-[#D97757]/5 text-left transition-all duration-200 flex items-center gap-3"
                        >
                            <span className="text-lg">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-bold text-[#1A1A19]"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.title}
                                </p>
                                <p
                                    className="text-xs text-[#6B6B66] truncate"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {submitted && (
                <div className="space-y-2 mb-4">
                    {selections.map((id) => {
                        const item = round.items.find((it) => it.id === id)!;
                        return (
                            <div
                                key={id}
                                className="p-3 rounded-xl bg-[#FAF9F0] border border-[#E8E6DF] text-xs text-[#3D3D38] italic"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                <span className="font-bold not-italic">{item.icon} {item.title}:</span>{' '}
                                {item.explanation}
                            </div>
                        );
                    })}
                </div>
            )}

            {!submitted && selections.length === round.items.length && (
                <button
                    onClick={onSubmit}
                    className="w-full py-3 rounded-full font-black text-sm bg-[#D97757] hover:bg-[#C46849] text-white transition-all duration-300"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer volgorde
                </button>
            )}
        </div>
    );
};
