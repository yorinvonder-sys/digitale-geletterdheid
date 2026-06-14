import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { ScenarioRound } from '../types';

const ScenarioIcon = ({ icon, className }: { icon: string; className: string }) => (
    icon.startsWith('/assets/') ? (
        <img src={icon} alt="" className={`shrink-0 object-contain ${className}`} width={24} height={24} loading="lazy" decoding="async" />
    ) : (
        <span className={className}>{icon}</span>
    )
);

export const OrderPriorityRound: React.FC<{
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onAdd: (id: number) => void;
    onReset: () => void;
    onSubmit: () => void;
}> = ({ round, selections, submitted, onAdd, onReset, onSubmit }) => {
    const remaining = round.items.filter((it) => !selections.includes(it.id));
    const instruction = round.orderInstruction ?? 'Klik de items in de juiste volgorde';

    return (
        <div className="mt-4">
            {selections.length > 0 && (
                <div className="bg-[#FCF6EA] rounded-xl p-3 mb-4 border border-[#E7D8BD]">
                    <div className="flex items-center justify-between mb-2">
                        <span
                            className="text-[10px] font-black text-[#445865] uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Jouw volgorde
                        </span>
                        {!submitted && (
                            <button
                                onClick={onReset}
                                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-[#445865] hover:text-[#D97848] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848]/40"
                                aria-label="Opnieuw beginnen"
                            >
                                <RotateCcw size={14} />
                            </button>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        {selections.map((id, i) => {
                            const item = round.items.find((it) => it.id === id);
                            if (!item) return null;
                            const isCorrect = submitted && item.correctPosition === i;
                            const isClose = submitted && !isCorrect && Math.abs((item.correctPosition ?? 0) - i) === 1;
                            return (
                                <div
                                    key={id}
                                    className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                                        submitted
                                            ? isCorrect ? 'bg-[#5F947D]/10 text-[#5F947D]'
                                            : isClose ? 'bg-lab-gold text-lab-ink'
                                            : 'bg-lab-coral text-white'
                                            : 'bg-white text-[#445865]'
                                    }`}
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                            submitted
                                                ? isCorrect ? 'bg-[#5F947D] text-white'
                                                : isClose ? 'bg-lab-gold text-white'
                                                : 'bg-lab-coral text-white'
                                                : 'bg-[#D97848]/20 text-[#D97848]'
                                        }`}
                                    >
                                        {i + 1}
                                    </span>
                                    <ScenarioIcon icon={item.icon} className="h-5 w-5" />
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
                        className="text-[10px] font-black text-[#445865] uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {instruction}
                    </p>
                    {remaining.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onAdd(item.id)}
                            className="w-full min-h-[44px] p-3 rounded-xl border-2 border-[#E7D8BD] bg-white hover:border-[#D97848] hover:bg-[#D97848]/5 text-left transition-all duration-200 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848]/40"
                        >
                            <ScenarioIcon icon={item.icon} className="h-6 w-6 text-lg" />
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-bold text-[#08283B]"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.title}
                                </p>
                                <p
                                    className="text-xs text-[#445865] line-clamp-3"
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
                        const item = round.items.find((it) => it.id === id);
                        if (!item) return null;
                        return (
                            <div
                                key={id}
                                className="p-3 rounded-xl bg-[#FCF6EA] border border-[#E7D8BD] text-xs text-[#445865] italic"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                <span className="inline-flex items-center gap-1 font-bold not-italic">
                                    <ScenarioIcon icon={item.icon} className="h-4 w-4" />
                                    {item.title}:
                                </span>{' '}
                                {item.explanation}
                            </div>
                        );
                    })}
                </div>
            )}

            {!submitted && selections.length === round.items.length && (
                <button
                    onClick={onSubmit}
                    className="w-full py-3 rounded-full font-black text-sm bg-[#D97848] hover:bg-[#D97848] text-white transition-all duration-300"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer volgorde
                </button>
            )}
        </div>
    );
};
