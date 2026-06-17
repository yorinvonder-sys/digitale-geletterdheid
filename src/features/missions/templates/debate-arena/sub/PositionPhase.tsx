import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { DebateArenaConfig, DebateArenaState } from '../DebateArena';

export interface PositionPhaseProps {
    config: DebateArenaConfig;
    state: DebateArenaState;
    onSelect: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export const PositionPhase: React.FC<PositionPhaseProps> = ({ config, state, onSelect, onNext, onBack }) => {
    return (
        <div>
            <div className="mb-5">
                <h2 className="text-lg font-black text-duck-ink mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Wat vind jij?
                </h2>
                <p className="text-xs text-duck-ink/60" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Kies de positie die het best bij jouw mening past. Je kunt aan het einde reflecteren of die is veranderd.
                </p>
            </div>

            <div className="space-y-3 mb-6">
                {config.positions.map((pos) => {
                    const isSelected = state.selectedPosition === pos.id;
                    return (
                        <button
                            key={pos.id}
                            onClick={() => onSelect(pos.id)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                                isSelected
                                    ? 'border-duck-ink bg-duck-ink/10'
                                    : 'border-duck-gray bg-white hover:border-duck-ink/40'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                                        isSelected ? 'border-duck-ink bg-duck-ink' : 'border-duck-gray'
                                    }`}
                                >
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div>
                                    <div
                                        className={`font-black text-sm mb-1 ${isSelected ? 'text-duck-ink' : 'text-duck-ink'}`}
                                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                                    >
                                        {pos.label}
                                    </div>
                                    <p className="text-xs text-duck-ink/60 leading-relaxed" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {pos.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    aria-label="Terug naar verkennen"
                    className="px-4 py-3 border border-duck-gray rounded-xl text-sm font-bold text-duck-ink/60 hover:bg-duck-bg transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={!state.selectedPosition}
                    className="flex-1 py-3 bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-duck-ink rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Bouw je argumenten
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
