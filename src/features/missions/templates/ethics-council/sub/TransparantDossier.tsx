import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface TransparantDossierProps {
    hint?: string;
    maxScore: number;
    savedText: string;
    onComplete: (score: number, text: string) => void;
}

const MIN_CHARS = 30;
const GOOD_CHARS = 100;

/**
 * Dossier 3 — Transparant.
 * A one-paragraph explanation field with a live quality meter.
 * Score scales with length/quality up to maxScore.
 */
export const TransparantDossier: React.FC<TransparantDossierProps> = ({
    hint,
    maxScore,
    savedText,
    onComplete,
}) => {
    const [text, setText] = useState(savedText);

    const len = text.trim().length;
    const canSubmit = len >= MIN_CHARS;

    // Quality meter: 0-1 based on char count
    const quality = Math.min(len / GOOD_CHARS, 1);
    const meterColor =
        quality >= 0.8
            ? 'bg-duck-ink'
            : quality >= 0.4
            ? 'bg-duck-acid'
            : 'bg-duck-gray';

    const meterLabel =
        quality >= 0.8 ? 'Uitstekend!' : quality >= 0.4 ? 'Goed bezig' : 'Schrijf meer';

    const computeScore = (): number => Math.max(1, Math.round(quality * maxScore));

    const handleSubmit = () => {
        onComplete(computeScore(), text);
    };

    return (
        <div className="space-y-4">
            {/* Dossier header */}
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🪟</span>
                <div>
                    <p
                        className="text-[10px] font-black text-duck-ink/50 uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Dossier 3 — Transparant
                    </p>
                    <h3
                        className="text-base font-black text-duck-ink"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        Transparantie-officier
                    </h3>
                    <p
                        className="text-xs text-duck-ink/50"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Expert in openheid en verantwoording
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-duck-ink/15 p-4">
                <p
                    className="text-sm font-bold text-duck-ink leading-relaxed"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    "Transparant betekent: een gebruiker begrijpt hoe jouw project werkt zonder de broncode te lezen."
                </p>
            </div>

            {/* Explanation field */}
            <div className="bg-white rounded-2xl border border-duck-gray p-4 space-y-3">
                <label
                    className="text-xs font-bold text-duck-ink/60 block"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Leg uit wat jouw project doet — voor een gewone gebruiker:
                </label>

                {hint && (
                    <p
                        className="text-[11px] text-duck-ink/40 italic"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {hint}
                    </p>
                )}

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Mijn project is een... Het werkt door... Een gebruiker ziet..."
                    rows={5}
                    className="w-full text-sm text-duck-ink bg-duck-bg border border-duck-gray rounded-xl p-3 resize-none focus:outline-none focus:border-duck-acid transition-colors"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                />

                {/* Live quality meter */}
                <div className="space-y-1">
                    <div className="h-1.5 w-full bg-duck-gray rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full transition-colors duration-300 ${meterColor}`}
                            animate={{ width: `${quality * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <div className="flex justify-between">
                        <span
                            className="text-[10px] text-duck-ink/40"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {len} tekens
                        </span>
                        <AnimatePresence mode="wait">
                            {len > 0 && (
                                <motion.span
                                    key={meterLabel}
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[10px] font-bold text-duck-ink"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {meterLabel}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full py-3 bg-duck-acid text-duck-ink rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Dossier afsluiten
                <ChevronRight size={16} />
            </button>
        </div>
    );
};
