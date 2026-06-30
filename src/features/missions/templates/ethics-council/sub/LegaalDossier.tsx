import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { AvgAdvocaatInfo } from '../EthicsCouncil';

type LegaalVerdict = 'ja' | 'twijfel' | 'nee';

interface LegaalDossierProps {
    advocaat: AvgAdvocaatInfo;
    maxScore: number;
    /** Restored from saved state (null = fresh start) */
    savedVerdict: LegaalVerdict | null;
    savedJustification: string;
    onComplete: (score: number, verdict: LegaalVerdict, justification: string) => void;
}

const VERDICT_OPTIONS: Array<{ value: LegaalVerdict; label: string; emoji: string }> = [
    { value: 'ja',      label: 'Ja — mijn project voldoet',           emoji: '✅' },
    { value: 'twijfel', label: 'Twijfel — misschien, maar niet zeker', emoji: '🤔' },
    { value: 'nee',     label: 'Nee — er klopt iets niet',            emoji: '❌' },
];

/**
 * Dossier 1 — Legaal.
 * Progressive reveal: shows the AVG-advocaat's keyArgument first;
 * a "tik voor meer" toggle reveals the full perspective.
 * Then a 3-option traffic-light verdict + a one-line justification input.
 */
export const LegaalDossier: React.FC<LegaalDossierProps> = ({
    advocaat,
    maxScore,
    savedVerdict,
    savedJustification,
    onComplete,
}) => {
    const [perspectiveOpen, setPerspectiveOpen] = useState(false);
    const [verdict, setVerdict] = useState<LegaalVerdict | null>(savedVerdict);
    const [justification, setJustification] = useState(savedJustification);

    const canSubmit = verdict !== null && justification.trim().length >= 10;

    const scoreForVerdict = (): number => {
        // Any reasoned verdict earns base points; nee/twijfel + justification are just as valid
        const base = verdict === 'ja' ? maxScore : Math.round(maxScore * 0.85);
        // Justification quality bonus (up to 10 chars threshold)
        const qualityBonus = justification.trim().length >= 40 ? Math.round(maxScore * 0.1) : 0;
        return Math.min(base + qualityBonus, maxScore);
    };

    const handleSubmit = () => {
        if (!verdict) return;
        onComplete(scoreForVerdict(), verdict, justification);
    };

    return (
        <div className="space-y-4">
            {/* Dossier header */}
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{advocaat.emoji}</span>
                <div>
                    <p
                        className="text-[10px] font-black text-duck-ink/50 uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Dossier 1 — Legaal
                    </p>
                    <h3
                        className="text-base font-black text-duck-ink"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {advocaat.name}
                    </h3>
                    <p
                        className="text-xs text-duck-ink/50"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {advocaat.role}
                    </p>
                </div>
            </div>

            {/* Key argument (always visible) */}
            <div className="bg-white rounded-2xl border-2 border-duck-ink/15 p-4">
                <p
                    className="text-sm font-bold text-duck-ink leading-relaxed"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    "{advocaat.keyArgument}"
                </p>

                {/* Progressive reveal toggle */}
                <button
                    onClick={() => setPerspectiveOpen((o) => !o)}
                    className="mt-3 flex items-center gap-1 text-[11px] font-bold text-duck-ink/50 hover:text-duck-ink transition-colors"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${perspectiveOpen ? 'rotate-180' : ''}`}
                    />
                    {perspectiveOpen ? 'Verberg toelichting' : 'Tik voor de volledige toelichting'}
                </button>

                <AnimatePresence>
                    {perspectiveOpen && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-duck-ink/60 leading-relaxed mt-3 overflow-hidden"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {advocaat.perspective}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* Traffic-light verdict */}
            <div className="space-y-2">
                <p
                    className="text-xs font-bold text-duck-ink/60"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Wat is jouw oordeel over jóuw eigen project?
                </p>
                {VERDICT_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => setVerdict(opt.value)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left
                            ${verdict === opt.value
                                ? 'border-duck-ink bg-duck-ink/5'
                                : 'border-duck-gray bg-white hover:border-duck-acid/40'
                            }`}
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        <span className="text-lg shrink-0">{opt.emoji}</span>
                        <span className="text-sm font-semibold text-duck-ink">{opt.label}</span>
                    </button>
                ))}
            </div>

            {/* Justification */}
            <AnimatePresence>
                {verdict && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-1"
                    >
                        <label
                            className="text-xs font-bold text-duck-ink/60 block"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Onderbouw in één zin waarom:
                        </label>
                        <input
                            type="text"
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Mijn project is legaal/niet legaal omdat..."
                            className="w-full text-sm text-duck-ink bg-duck-bg border border-duck-gray rounded-xl px-3 py-2.5 focus:outline-none focus:border-duck-acid transition-colors"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        />
                        <p
                            className={`text-right text-[10px] ${justification.trim().length >= 10 ? 'text-duck-ink' : 'text-duck-ink/40'}`}
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {justification.trim().length} / min. 10 tekens
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

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
