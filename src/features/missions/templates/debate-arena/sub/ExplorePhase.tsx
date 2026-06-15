import React from 'react';
import { ChevronRight } from 'lucide-react';
import { FollowUpCard } from '../../shared/FollowUpCard';
import type { DebateArenaConfig, DebateArenaState } from '../DebateArena';

const STAKEHOLDER_COLORS = ['#ff3c21', '#202023', '#202023', '#202023', '#e1ff01', '#ff3c21'];

export interface ExplorePhaseProps {
    config: DebateArenaConfig;
    state: DebateArenaState;
    onMarkRead: (id: string) => void;
    onSetActiveIndex: (i: number) => void;
    onNext: () => void;
    onQuizComplete: (correct: boolean) => void;
}

export const ExplorePhase: React.FC<ExplorePhaseProps> = ({ config, state, onMarkRead, onSetActiveIndex, onNext, onQuizComplete }) => {
    const active = config.stakeholders[state.activeStakeholderIndex];
    const color = STAKEHOLDER_COLORS[state.activeStakeholderIndex % STAKEHOLDER_COLORS.length];
    const allRead = state.stakeholdersRead.length >= config.stakeholders.length;
    const isRead = state.stakeholdersRead.includes(active.id);

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-black text-duck-ink mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Leer de betrokkenen kennen
                </h2>
                <p className="text-xs text-duck-ink/60" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Lees alle {config.stakeholders.length} perspectieven voordat je positie kiest.
                </p>
            </div>

            {/* Stakeholder tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {config.stakeholders.map((sh, i) => {
                    const read = state.stakeholdersRead.includes(sh.id);
                    const isActive = i === state.activeStakeholderIndex;
                    return (
                        <button
                            key={sh.id}
                            onClick={() => onSetActiveIndex(i)}
                            className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all duration-200 ${
                                isActive
                                    ? 'border-duck-ink bg-duck-ink/10'
                                    : 'border-duck-gray bg-white hover:border-duck-ink/40'
                            }`}
                        >
                            <span className="text-lg leading-none">{sh.emoji}</span>
                            <span className="text-[10px] font-bold text-duck-ink/60" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {sh.name}
                            </span>
                            {read && <span className="text-[9px] text-duck-ink font-bold">✓ gelezen</span>}
                        </button>
                    );
                })}
            </div>

            {/* Active stakeholder card */}
            <div
                className="bg-white rounded-2xl border-2 p-5 mb-4 transition-all duration-300"
                style={{ borderColor: color }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: `${color}18` }}
                    >
                        {active.emoji}
                    </div>
                    <div>
                        <div className="font-black text-duck-ink text-base" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            {active.name}
                        </div>
                        <div className="text-xs text-duck-ink/60" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {active.role}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-duck-ink/60 leading-relaxed mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    "{active.perspective}"
                </p>

                <div className="rounded-xl p-3" style={{ background: `${color}10`, borderLeft: `3px solid ${color}` }}>
                    <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color, fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Kernargument
                    </div>
                    <p className="text-sm text-duck-ink/60" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {active.keyArgument}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mb-4">
                <button
                    onClick={() => onSetActiveIndex(Math.max(0, state.activeStakeholderIndex - 1))}
                    disabled={state.activeStakeholderIndex === 0}
                    className="flex-1 py-2.5 border border-duck-gray rounded-xl text-sm font-bold text-duck-ink/60 disabled:opacity-30 transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    ← Vorige
                </button>
                {!isRead ? (
                    <button
                        onClick={() => onMarkRead(active.id)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]"
                        style={{ background: color, fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Gelezen ✓
                    </button>
                ) : state.activeStakeholderIndex < config.stakeholders.length - 1 ? (
                    <button
                        onClick={() => onSetActiveIndex(state.activeStakeholderIndex + 1)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]"
                        style={{ background: color, fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Volgende →
                    </button>
                ) : null}
            </div>

            {allRead && config.explorationQuiz && !state.explorationQuizAnswered && (
                <FollowUpCard
                    followUp={config.explorationQuiz}
                    onComplete={onQuizComplete}
                />
            )}

            {allRead && (!config.explorationQuiz || state.explorationQuizAnswered) && (
                <button
                    onClick={onNext}
                    className="w-full py-3.5 bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Kies jouw positie
                    <ChevronRight size={16} />
                </button>
            )}

            {!allRead && (
                <p className="text-center text-xs text-duck-ink/60 mt-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Lees alle perspectieven om door te gaan ({state.stakeholdersRead.length}/{config.stakeholders.length} gelezen)
                </p>
            )}
        </div>
    );
};
