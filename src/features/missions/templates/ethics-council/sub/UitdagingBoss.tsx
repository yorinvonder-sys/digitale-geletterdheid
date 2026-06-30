import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface UitdagingBossProps {
    counterArgument: string;
    savedResponse: string;
    maxScore: number;
    onComplete: (score: number, response: string) => void;
}

const MIN_CHARS = 20;

/**
 * Mini-boss stage — "Verdedig je standpunt".
 * Visual pattern mirrors debate-arena/sub/ChallengePhase.tsx.
 * Score scales with response length up to maxScore.
 */
export const UitdagingBoss: React.FC<UitdagingBossProps> = ({
    counterArgument,
    savedResponse,
    maxScore,
    onComplete,
}) => {
    const [response, setResponse] = useState(savedResponse);

    const charCount = response.trim().length;
    const canContinue = charCount >= MIN_CHARS;

    const computeScore = (): number =>
        Math.min(maxScore, Math.round((Math.min(charCount, 150) / 150) * maxScore));

    const handleSubmit = () => {
        onComplete(computeScore(), response);
    };

    return (
        <div className="space-y-4">
            {/* Boss header */}
            <div>
                <p
                    className="text-[10px] font-black text-duck-ink/50 uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Miniboss
                </p>
                <h2
                    className="text-lg font-black text-duck-ink mb-1"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    Verdedig je standpunt
                </h2>
                <p
                    className="text-xs text-duck-ink/60"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Een tegenstander heeft een argument. Wat antwoord jij?
                </p>
            </div>

            {/* Counter-argument card */}
            <div className="bg-white rounded-2xl border-2 border-duck-acid/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-duck-acid/10 rounded-xl flex items-center justify-center text-base">
                        ⚡
                    </div>
                    <div
                        className="text-xs font-black text-duck-ink uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Tegenargument
                    </div>
                </div>
                <p
                    className="text-sm text-duck-ink/60 leading-relaxed italic"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    {counterArgument}
                </p>
            </div>

            {/* Response input */}
            <div className="bg-white rounded-2xl border border-duck-gray p-4">
                <label
                    className="text-xs font-bold text-duck-ink/60 block mb-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Jouw reactie
                </label>
                <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Leg uit waarom je het eens of oneens bent met dit tegenargument, of nuanceer het..."
                    rows={4}
                    className="w-full text-sm text-duck-ink bg-duck-bg border border-duck-gray rounded-xl p-3 resize-none focus:outline-none focus:border-duck-acid transition-colors"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                />
                <div
                    className={`text-right text-[10px] mt-1 ${canContinue ? 'text-duck-ink' : 'text-duck-ink/60'}`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {charCount}/{MIN_CHARS} min.
                </div>
            </div>

            {/* Length progress hint */}
            {charCount > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-1 w-full bg-duck-gray rounded-full overflow-hidden"
                >
                    <motion.div
                        className="h-full bg-duck-ink rounded-full"
                        animate={{ width: `${Math.min((charCount / 150) * 100, 100)}%` }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.div>
            )}

            <button
                onClick={handleSubmit}
                disabled={!canContinue}
                className="w-full py-3 bg-duck-acid text-duck-ink rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Naar het vonnis
                <ChevronRight size={16} />
            </button>
        </div>
    );
};
