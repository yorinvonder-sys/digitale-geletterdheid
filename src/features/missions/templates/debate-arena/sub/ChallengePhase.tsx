import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { DebateArenaConfig, DebateArenaState } from '../DebateArena';

export interface ChallengePhaseProps {
    config: DebateArenaConfig;
    state: DebateArenaState;
    onUpdateResponse: (val: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export const ChallengePhase: React.FC<ChallengePhaseProps> = ({ config, state, onUpdateResponse, onNext, onBack }) => {
    const canContinue = state.counterResponse.trim().length >= 20;

    return (
        <div>
            <div className="mb-5">
                <h2 className="text-lg font-black text-[#08283B] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Verdedig je standpunt
                </h2>
                <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Een tegenstander heeft een argument. Wat antwoord jij?
                </p>
            </div>

            {/* Counter-argument card */}
            <div className="bg-white rounded-2xl border-2 border-[#D97848]/30 p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#D97848]/10 rounded-xl flex items-center justify-center text-base">
                        ⚡
                    </div>
                    <div className="text-xs font-black text-[#D97848] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Tegenargument
                    </div>
                </div>
                <p className="text-sm text-[#445865] leading-relaxed italic" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    {config.counterArgument}
                </p>
            </div>

            {/* Response input */}
            <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-5">
                <label className="text-xs font-bold text-[#445865] block mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Jouw reactie
                </label>
                <textarea
                    value={state.counterResponse}
                    onChange={(e) => onUpdateResponse(e.target.value)}
                    placeholder="Leg uit waarom je het eens of oneens bent met dit tegenargument, of nuanceer het..."
                    rows={4}
                    className="w-full text-sm text-[#08283B] bg-[#FCF6EA] border border-[#E7D8BD] rounded-xl p-3 resize-none focus:outline-none focus:border-[#D97848] transition-colors"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                />
                <div className={`text-right text-[10px] mt-1 ${canContinue ? 'text-[#5F947D]' : 'text-[#445865]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    {state.counterResponse.trim().length}/20 min.
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    aria-label="Terug naar argumenten"
                    className="px-4 py-3 border border-[#E7D8BD] rounded-xl text-sm font-bold text-[#445865] hover:bg-[#FCF6EA] transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={!canContinue}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Reflecteer
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
