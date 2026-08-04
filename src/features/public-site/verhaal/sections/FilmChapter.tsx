import React, { useState } from 'react';
import { Film, hasSeenFilm } from '../film/Film';
import { LogoLockup } from '../components/storyBrand';

/**
 * Hoofdstuk nul: de film over Jayden, bovenaan de pagina.
 *
 * Alleen eerste bezoekers krijgen de film te zien. Wie hem al gezien heeft komt
 * direct op de Proloog uit. De status wordt in de eerste render bepaald, zodat
 * de pagina niet verspringt wanneer de film wordt toegevoegd.
 */
export function FilmChapter() {
    const [seen] = useState(hasSeenFilm);

    if (seen) return null;

    return (
        <section id="film" className="relative bg-duck-ink grain">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
                <LogoLockup height={28} dark />
                <span className="hidden text-xs font-bold uppercase tracking-[0.25em] text-duck-bg/50 sm:block">
                    Een korte film over Jayden · 43 sec
                </span>
            </div>

            <div className="relative border-b-[3px] border-duck-acid/40">
                <Film />
            </div>
        </section>
    );
}
