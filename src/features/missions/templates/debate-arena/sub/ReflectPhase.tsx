import React from 'react';
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import type { DebateArenaConfig, DebateArenaState } from '../DebateArena';

export interface ReflectPhaseProps {
    config: DebateArenaConfig;
    state: DebateArenaState;
    onUpdateAnswer: (q: string, val: string) => void;
    onSelectFinalPosition: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export const ReflectPhase: React.FC<ReflectPhaseProps> = ({ config, state, onUpdateAnswer, onSelectFinalPosition, onNext, onBack }) => {
    const allAnswered = config.reflectionQuestions.every(
        (q) => (state.reflectionAnswers[q] ?? '').trim().length >= 20
    );

    return (
        <div>
            <div className="mb-5">
                <h2 className="text-lg font-black text-[#08283B] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Reflecteer
                </h2>
                <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Goede debaters denken na over hun eigen standpunten.
                </p>
            </div>

            {/* Reflection questions */}
            <div className="space-y-4 mb-5">
                {config.reflectionQuestions.map((q, i) => {
                    const answer = state.reflectionAnswers[q] ?? '';
                    const valid = answer.trim().length >= 20;
                    return (
                        <div key={i} className="bg-white rounded-2xl border border-[#E7D8BD] p-4">
                            <div className="flex items-start gap-2 mb-2">
                                <div className="w-5 h-5 bg-[#0B453F]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] font-black text-[#0B453F]">{i + 1}</span>
                                </div>
                                <label className="text-sm font-bold text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {q}
                                </label>
                            </div>
                            <textarea
                                value={answer}
                                onChange={(e) => onUpdateAnswer(q, e.target.value)}
                                placeholder="Schrijf je antwoord hier..."
                                rows={3}
                                className="w-full text-sm text-[#08283B] bg-[#FCF6EA] border border-[#E7D8BD] rounded-xl p-3 resize-none focus:outline-none focus:border-[#0B453F] transition-colors"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            />
                            <div className={`text-right text-[10px] mt-1 ${valid ? 'text-[#5F947D]' : 'text-[#445865]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {answer.trim().length}/20 min.
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Optional position shift */}
            <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-[#0B453F]" />
                    <span className="text-xs font-black text-[#0B453F] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Eindpositie (optioneel)
                    </span>
                </div>
                <p className="text-xs text-[#445865] mb-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Is je mening veranderd? Je kunt je positie aanpassen. Dat is juist een teken van goed denken.
                </p>
                <div className="space-y-2">
                    {config.positions.map((pos) => {
                        const effectiveFinal = state.finalPosition ?? state.selectedPosition;
                        const isSelected = effectiveFinal === pos.id;
                        const isInitial = state.selectedPosition === pos.id;
                        return (
                            <button
                                key={pos.id}
                                onClick={() => onSelectFinalPosition(pos.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all text-sm ${
                                    isSelected
                                        ? 'border-[#0B453F] bg-[#0B453F]/10 font-bold text-[#0B453F]'
                                        : 'border-[#E7D8BD] bg-[#FCF6EA] text-[#445865] hover:border-[#0B453F]/40'
                                }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {pos.label}
                                {isInitial && <span className="text-[10px] text-[#445865] ml-2">(was jouw keuze)</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    aria-label="Terug naar tegenargument"
                    className="px-4 py-3 border border-[#E7D8BD] rounded-xl text-sm font-bold text-[#445865] hover:bg-[#FCF6EA] transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={!allAnswered}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Bekijk resultaat
                    <Trophy size={16} />
                </button>
            </div>
        </div>
    );
};
