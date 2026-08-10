import React from 'react';
import { Film, TOTAL } from '../film/Film';
import { LogoLockup } from '../components/storyBrand';

/**
 * De korte film over Jayden.
 *
 * De film stond eerder bovenaan de pagina en startte vanzelf voor elke nieuwe
 * bezoeker. Dat kostte 49 seconden vóórdat er ook maar iets over DGSkills werd
 * verteld. Nu opent de bezoeker hem zelf vanuit de hero; is hij niet geopend,
 * dan bestaat deze sectie niet.
 */
export function FilmChapter({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;

    return (
        <section id="film" className="relative scroll-mt-4 bg-duck-ink grain">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-14">
                <LogoLockup height={28} dark />
                <div className="flex items-center gap-4">
                    <span className="hidden text-xs font-bold uppercase tracking-[0.25em] text-duck-bg/50 sm:block">
                        Een korte film over Jayden · {Math.round(TOTAL)} sec
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-[44px] rounded-full border-2 border-duck-bg/40 px-4 py-1.5 text-xs font-bold text-duck-bg transition-colors hover:bg-duck-bg hover:text-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid"
                    >
                        Sluiten
                    </button>
                </div>
            </div>

            <div className="relative border-y-[3px] border-duck-acid/40">
                <Film onSkip={onClose} />
            </div>
        </section>
    );
}
