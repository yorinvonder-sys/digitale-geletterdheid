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
                <h2 className="text-lg font-black text-[#1A1A19] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Wat vind jij?
                </h2>
                <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
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
                                    ? 'border-[#8B6F9E] bg-[#8B6F9E]/10'
                                    : 'border-[#E8E6DF] bg-white hover:border-[#8B6F9E]/40'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                                        isSelected ? 'border-[#8B6F9E] bg-[#8B6F9E]' : 'border-[#E8E6DF]'
                                    }`}
                                >
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div>
                                    <div
                                        className={`font-black text-sm mb-1 ${isSelected ? 'text-[#8B6F9E]' : 'text-[#1A1A19]'}`}
                                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                                    >
                                        {pos.label}
                                    </div>
                                    <p className="text-xs text-[#6B6B66] leading-relaxed" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
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
                    className="px-4 py-3 border border-[#E8E6DF] rounded-xl text-sm font-bold text-[#6B6B66] hover:bg-[#F5F4EE] transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={!state.selectedPosition}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Bouw je argumenten
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
