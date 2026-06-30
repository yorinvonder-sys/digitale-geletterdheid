import React from 'react';
import { Categorize } from '../../review-arena/sub/Categorize';

interface EerlijkDossierProps {
    categories: string[];
    items: Array<{ label: string; correctCategory: string }>;
    maxScore: number;
    onComplete: (score: number) => void;
}

/**
 * Dossier 2 — Eerlijk.
 * Thin wrapper around the shared Categorize component.
 * The Categorize onComplete signature is (score: number, maxScore: number) => void;
 * we project it down to the engine's (score: number) callback.
 */
export const EerlijkDossier: React.FC<EerlijkDossierProps> = ({
    categories,
    items,
    maxScore,
    onComplete,
}) => (
    <div className="space-y-4">
        {/* Dossier header */}
        <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔍</span>
            <div>
                <p
                    className="text-[10px] font-black text-duck-ink/50 uppercase tracking-widest"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Dossier 2 — Eerlijk
                </p>
                <h3
                    className="text-base font-black text-duck-ink"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    Eerlijkheidsrechter
                </h3>
                <p
                    className="text-xs text-duck-ink/50"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Ethicus voor eerlijkheid en bias
                </p>
            </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-duck-ink/15 p-4">
            <p
                className="text-sm font-bold text-duck-ink leading-relaxed"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
                "Eerlijk betekent: niemand wordt systematisch benadeeld door jouw project — ook niet per ongeluk."
            </p>
        </div>

        <div className="bg-white rounded-2xl border border-duck-gray p-4">
            {/* Wire Categorize: its onComplete passes (score, maxScore); we only need score */}
            <Categorize
                title="Wie valt buiten de boot?"
                description="Sorteer elke situatie: werkt jouw project hiervoor even goed, of valt deze gebruiker buiten de boot?"
                categories={categories}
                items={items}
                maxScore={maxScore}
                onComplete={(score, _maxScore) => onComplete(score)}
            />
        </div>
    </div>
);
