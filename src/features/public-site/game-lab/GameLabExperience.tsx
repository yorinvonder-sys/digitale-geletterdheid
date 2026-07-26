import React, { useCallback, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SectionLabel } from '@/features/public-site/homepageChrome';
import { PlayableGame } from '@/features/public-site/game-lab/PlayableGame';
import { GameLabChat } from '@/features/public-site/game-lab/GameLabChat';
import { DEFAULT_GAME_SPEC, parseGameSpec, specSummary } from '@/features/public-site/game-lab/gameSpec';
import type { GameSpec } from '@/features/public-site/game-lab/gameSpec';

/**
 * Binnenkant van de game-lab sectie. Rendert bewust géén <section> en géén
 * data-section: die staan in `ScholenLanding.tsx` en moeten er vanaf de eerste
 * paint zijn, omdat `useHomepageAnalytics` maar één keer naar `[data-section]`
 * zoekt.
 */

const MAX_PROMPTS = 10;

const GameLabExperience: React.FC = () => {
    const [spec, setSpec] = useState<GameSpec>(() => structuredClone(DEFAULT_GAME_SPEC) as GameSpec);
    const reduceMotion = usePrefersReducedMotion();

    const handleAssistantText = useCallback((rawText: string) => {
        setSpec((previous) => parseGameSpec(rawText, previous).spec);
    }, []);

    return (
        <div>
            <div className="max-w-2xl">
                <SectionLabel>Probeer het zelf</SectionLabel>
                <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05] text-white">
                    Bouw je eigen game. Tien prompts, geen account.
                </h2>
                <p className="mt-5 text-pretty text-base font-semibold leading-7 text-white/65">
                    Dit is een echte game — speel hem met spatie of een tik. Vraag de AI om een ander thema,
                    een ander karakter, meer obstakels of een nieuw doel, en je ziet het meteen veranderen.
                    Zo werken leerlingen bij DGSkills: niet over techniek lezen, maar hem aansturen.
                </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                <div>
                    <PlayableGame spec={spec} reduceMotion={reduceMotion} />

                    <div className="mt-5 rounded-[1.25rem] border border-white/15 bg-white/[0.04] p-4">
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/50">
                            Jouw game-instellingen
                        </h3>
                        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                            {specSummary(spec).map((row) => (
                                <div key={row.label}>
                                    <dt className="text-[11px] font-bold uppercase tracking-wide text-white/45">{row.label}</dt>
                                    <dd className="text-sm font-extrabold text-white">{row.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                <GameLabChat currentSpec={spec} onAssistantText={handleAssistantText} maxMessages={MAX_PROMPTS} />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-white/50">
                <span>SLO-kerndoel 21A — Computational thinking</span>
                <span aria-hidden="true" className="hidden h-3 w-px bg-white/20 sm:block" />
                <span>Geen account nodig. We slaan de inhoud van je gesprek niet op.</span>
            </div>
        </div>
    );
};

export default GameLabExperience;
