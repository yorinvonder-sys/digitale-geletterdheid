import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { DebateArenaConfig, DebateArenaState, ArgumentEntry } from '../DebateArena';

function getArgumentQuality(charCount: number): { color: string; label: string } {
    if (charCount >= 100) return { color: '#D97848', label: 'Uitstekend' };
    if (charCount >= 50) return { color: '#5F947D', label: 'Goed' };
    if (charCount >= 20) return { color: '#D7C95F', label: 'Basis' };
    return { color: '#D97848', label: 'Te kort' };
}

export interface ArguePhaseProps {
    config: DebateArenaConfig;
    state: DebateArenaState;
    onUpdateArgument: (index: number, field: keyof ArgumentEntry, value: string) => void;
    onSetActiveIndex: (i: number) => void;
    onNext: () => void;
    onBack: () => void;
}

export const ArguePhase: React.FC<ArguePhaseProps> = ({ config, state, onUpdateArgument, onSetActiveIndex, onNext, onBack }) => {
    const activeArg = state.arguments[state.activeArgumentIndex];
    const validCount = state.arguments.filter(
        (a) => a.claim.trim().length >= 20 && a.evidence.trim().length >= 20
    ).length;

    const selectedPos = config.positions.find((p) => p.id === state.selectedPosition);

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-black text-[#08283B] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Bouw je argumenten
                </h2>
                <p className="text-xs text-[#445865] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Onderbouw je positie met minimaal 2 sterke argumenten.
                </p>
                {selectedPos && (
                    <div className="inline-flex items-center gap-1.5 bg-[#0B453F]/10 border border-[#0B453F]/20 rounded-full px-3 py-1">
                        <span className="text-xs font-bold text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Jouw positie: {selectedPos.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Argument tabs */}
            <div className="flex gap-2 mb-4">
                {state.arguments.map((arg, i) => {
                    const valid = arg.claim.trim().length >= 20 && arg.evidence.trim().length >= 20;
                    const isActive = i === state.activeArgumentIndex;
                    return (
                        <button
                            key={i}
                            onClick={() => onSetActiveIndex(i)}
                            className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                                isActive
                                    ? 'border-[#D97848] bg-[#D97848]/10 text-[#D97848]'
                                    : valid
                                      ? 'border-[#5F947D] bg-[#5F947D]/5 text-[#5F947D]'
                                      : 'border-[#E7D8BD] bg-white text-[#445865]'
                            }`}
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {valid ? '✓ ' : ''}Arg {i + 1}
                        </button>
                    );
                })}
            </div>

            {/* Argument card */}
            <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-4">
                <div className="text-xs font-black text-[#D97848] uppercase tracking-widest mb-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Argument {state.activeArgumentIndex + 1}
                </div>

                <div className="mb-3">
                    <label className="text-xs font-bold text-[#445865] block mb-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Ik vind dat...
                    </label>
                    <textarea
                        value={activeArg.claim}
                        onChange={(e) => onUpdateArgument(state.activeArgumentIndex, 'claim', e.target.value)}
                        placeholder="Geef jouw standpunt weer in eigen woorden..."
                        rows={2}
                        className="w-full text-sm text-[#08283B] bg-[#FCF6EA] border border-[#E7D8BD] rounded-xl p-3 resize-none focus:outline-none focus:border-[#D97848] transition-colors"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                    {config.argumentQualityIndicators ? (() => {
                        const q = getArgumentQuality(activeArg.claim.trim().length);
                        return (
                            <div className="inline-flex items-center gap-1 mt-0.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: q.color }} />
                                <span className="text-xs" style={{ color: q.color }}>{q.label}</span>
                            </div>
                        );
                    })() : (
                        <div className={`text-right text-[10px] mt-0.5 ${activeArg.claim.trim().length >= 20 ? 'text-[#5F947D]' : 'text-[#445865]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {activeArg.claim.trim().length}/20 min.
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="text-xs font-bold text-[#445865] block mb-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Want...
                    </label>
                    <textarea
                        value={activeArg.evidence}
                        onChange={(e) => onUpdateArgument(state.activeArgumentIndex, 'evidence', e.target.value)}
                        placeholder="Onderbouw met een feit, voorbeeld of redenering..."
                        rows={2}
                        className="w-full text-sm text-[#08283B] bg-[#FCF6EA] border border-[#E7D8BD] rounded-xl p-3 resize-none focus:outline-none focus:border-[#D97848] transition-colors"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                    {config.argumentQualityIndicators ? (() => {
                        const q = getArgumentQuality(activeArg.evidence.trim().length);
                        return (
                            <div className="inline-flex items-center gap-1 mt-0.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: q.color }} />
                                <span className="text-xs" style={{ color: q.color }}>{q.label}</span>
                            </div>
                        );
                    })() : (
                        <div className={`text-right text-[10px] mt-0.5 ${activeArg.evidence.trim().length >= 20 ? 'text-[#5F947D]' : 'text-[#445865]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {activeArg.evidence.trim().length}/20 min.
                        </div>
                    )}
                </div>

                <div>
                    <label className="text-xs font-bold text-[#445865] block mb-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Dit raakt het perspectief van...
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {config.stakeholders.map((sh) => (
                            <button
                                key={sh.id}
                                onClick={() => onUpdateArgument(state.activeArgumentIndex, 'stakeholderId', sh.id)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                    activeArg.stakeholderId === sh.id
                                        ? 'border-[#D97848] bg-[#D97848]/10 text-[#D97848]'
                                        : 'border-[#E7D8BD] bg-[#FCF6EA] text-[#445865] hover:border-[#D97848]/40'
                                }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {sh.emoji} {sh.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-4 py-3 border border-[#E7D8BD] rounded-xl text-sm font-bold text-[#445865] hover:bg-[#FCF6EA] transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={validCount < 2}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {validCount < 2 ? `Nog ${2 - validCount} argument${2 - validCount === 1 ? '' : 'en'} nodig` : 'Beantwoord tegenargument'}
                    {validCount >= 2 && <ChevronRight size={16} />}
                </button>
            </div>
        </div>
    );
};
