import React, { useId } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { DebateArenaConfig, DebateArenaState, ArgumentEntry } from '../DebateArena';
import { isMeaningfulAnswer, answerQualityHint } from '../../shared/answerQuality';

// De kleur zit alleen in de stip en loopt op van rood (te kort) naar zwart
// (uitstekend); het label blijft duck-ink, want duck-acid en duck-error halen als
// kleine tekst op wit te weinig contrast.
function getArgumentQuality(charCount: number): { dotColor: string; label: string } {
    if (charCount >= 100) return { dotColor: '#202023', label: 'Uitstekend' };
    if (charCount >= 50) return { dotColor: '#e1ff01', label: 'Goed' };
    if (charCount >= 20) return { dotColor: '#c2c1bd', label: 'Basis' };
    return { dotColor: '#ff3c21', label: 'Te kort' };
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
    const uid = useId();
    const claimId = `${uid}-claim`;
    const evidenceId = `${uid}-evidence`;
    const stakeholderLabelId = `${uid}-stakeholder`;
    const activeArg = state.arguments[state.activeArgumentIndex];
    const validCount = state.arguments.filter(
        (a) => isMeaningfulAnswer(a.claim) && isMeaningfulAnswer(a.evidence)
    ).length;

    const selectedPos = config.positions.find((p) => p.id === state.selectedPosition);

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-black text-duck-ink mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Bouw je argumenten
                </h2>
                <p className="text-xs text-duck-ink/60 mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Onderbouw je positie met minimaal 2 sterke argumenten.
                </p>
                {selectedPos && (
                    <div className="inline-flex items-center gap-1.5 bg-duck-ink/10 border border-duck-ink/20 rounded-full px-3 py-1">
                        <span className="text-xs font-bold text-duck-ink" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Jouw positie: {selectedPos.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Argument tabs */}
            <div className="flex gap-2 mb-4">
                {state.arguments.map((arg, i) => {
                    const valid = isMeaningfulAnswer(arg.claim) && isMeaningfulAnswer(arg.evidence);
                    const isActive = i === state.activeArgumentIndex;
                    return (
                        <button
                            key={i}
                            onClick={() => onSetActiveIndex(i)}
                            className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                                isActive
                                    ? 'border-duck-acid bg-duck-acid/10 text-duck-ink'
                                    : valid
                                      ? 'border-duck-ink bg-duck-ink/5 text-duck-ink'
                                      : 'border-duck-gray bg-white text-duck-ink/60'
                            }`}
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {valid ? '✓ ' : ''}Arg {i + 1}
                        </button>
                    );
                })}
            </div>

            {/* Argument card */}
            <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-4">
                <div className="text-xs font-black text-duck-ink uppercase tracking-widest mb-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Argument {state.activeArgumentIndex + 1}
                </div>

                <div className="mb-3">
                    <label htmlFor={claimId} className="text-xs font-bold text-duck-ink/60 block mb-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Ik vind dat...
                    </label>
                    <textarea
                        id={claimId}
                        value={activeArg.claim}
                        onChange={(e) => onUpdateArgument(state.activeArgumentIndex, 'claim', e.target.value)}
                        placeholder="Geef jouw standpunt weer in eigen woorden..."
                        rows={2}
                        className="w-full text-sm text-duck-ink bg-duck-bg border border-duck-gray rounded-xl p-3 resize-none focus:outline-none focus:border-duck-acid transition-colors"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                    {config.argumentQualityIndicators ? (() => {
                        const q = getArgumentQuality(activeArg.claim.trim().length);
                        return (
                            <div className="inline-flex items-center gap-1 mt-0.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: q.dotColor }} aria-hidden="true" />
                                <span className="text-xs text-duck-ink">{q.label}</span>
                            </div>
                        );
                    })() : (
                        <div className={`text-right text-[10px] mt-0.5 ${isMeaningfulAnswer(activeArg.claim) ? 'text-duck-ink' : 'text-duck-ink/60'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {activeArg.claim.trim().length}/20 min.
                        </div>
                    )}
                    {answerQualityHint(activeArg.claim) && (
                        <div className="text-[10px] text-duck-ink/60 mt-0.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {answerQualityHint(activeArg.claim)}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor={evidenceId} className="text-xs font-bold text-duck-ink/60 block mb-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Want...
                    </label>
                    <textarea
                        id={evidenceId}
                        value={activeArg.evidence}
                        onChange={(e) => onUpdateArgument(state.activeArgumentIndex, 'evidence', e.target.value)}
                        placeholder="Onderbouw met een feit, voorbeeld of redenering..."
                        rows={2}
                        className="w-full text-sm text-duck-ink bg-duck-bg border border-duck-gray rounded-xl p-3 resize-none focus:outline-none focus:border-duck-acid transition-colors"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                    {config.argumentQualityIndicators ? (() => {
                        const q = getArgumentQuality(activeArg.evidence.trim().length);
                        return (
                            <div className="inline-flex items-center gap-1 mt-0.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: q.dotColor }} aria-hidden="true" />
                                <span className="text-xs text-duck-ink">{q.label}</span>
                            </div>
                        );
                    })() : (
                        <div className={`text-right text-[10px] mt-0.5 ${isMeaningfulAnswer(activeArg.evidence) ? 'text-duck-ink' : 'text-duck-ink/60'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {activeArg.evidence.trim().length}/20 min.
                        </div>
                    )}
                    {answerQualityHint(activeArg.evidence) && (
                        <div className="text-[10px] text-duck-ink/60 mt-0.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {answerQualityHint(activeArg.evidence)}
                        </div>
                    )}
                </div>

                <div>
                    {/* Geen <label>: dit hoort bij een groep knoppen, niet bij één invoerveld. */}
                    <span id={stakeholderLabelId} className="text-xs font-bold text-duck-ink/60 block mb-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Dit raakt het perspectief van...
                    </span>
                    <div role="group" aria-labelledby={stakeholderLabelId} className="flex flex-wrap gap-2">
                        {config.stakeholders.map((sh) => (
                            <button
                                key={sh.id}
                                onClick={() => onUpdateArgument(state.activeArgumentIndex, 'stakeholderId', sh.id)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                    activeArg.stakeholderId === sh.id
                                        ? 'border-duck-acid bg-duck-acid/10 text-duck-ink'
                                        : 'border-duck-gray bg-duck-bg text-duck-ink/60 hover:border-duck-acid/40'
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
                    aria-label="Terug naar positie kiezen"
                    className="px-4 py-3 border border-duck-gray rounded-xl text-sm font-bold text-duck-ink/60 hover:bg-duck-bg transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={validCount < 2}
                    className="flex-1 py-3 bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-duck-ink rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {validCount < 2 ? `Nog ${2 - validCount} argument${2 - validCount === 1 ? '' : 'en'} nodig` : 'Beantwoord tegenargument'}
                    {validCount >= 2 && <ChevronRight size={16} />}
                </button>
            </div>
        </div>
    );
};
