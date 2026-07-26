import React, { useEffect, useState } from 'react';

export interface Chapter {
    id: string;
    label: string;
    num: string;
}

export const CHAPTERS: Chapter[] = [
    { id: 'film', label: 'De film', num: '▶' },
    { id: 'proloog', label: 'Proloog', num: '·' },
    { id: 'probleem', label: 'Het probleem', num: '1' },
    { id: 'ontmoeting', label: 'De ontmoeting', num: '2' },
    { id: 'mila', label: 'Mila', num: '3' },
    // Tussendoortje zonder nummer, zodat de bestaande hoofdstuknummering klopt.
    { id: 'zelf', label: 'Nu jij', num: '·' },
    { id: 'docent', label: 'De docent', num: '4' },
    { id: 'bewijs', label: 'Het bewijs', num: '5' },
    { id: 'epiloog', label: 'Epiloog', num: '·' },
];

/**
 * Vaste hoofdstukrail links. De actieve stip rekt uit; het label verschijnt
 * uitsluitend bij hover/focus en staat absoluut gepositioneerd, zodat het
 * nooit over de inhoud van de pagina valt.
 */
export function ChapterRail() {
    const [active, setActive] = useState<string>('proloog');
    // Het filmhoofdstuk bestaat alleen voor eerste bezoekers.
    const [hasFilm, setHasFilm] = useState(false);

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        // De filmsectie wordt pas na een effect gerenderd; wacht een frame zodat
        // we niet meten voordat FilmChapter zijn beslissing heeft genomen.
        const raf = requestAnimationFrame(() => {
            const filmEl = document.getElementById('film');
            setHasFilm(!!filmEl);
            setActive(filmEl ? 'film' : 'proloog');

            const observer = new IntersectionObserver(
                (entries) => {
                    for (const e of entries) {
                        if (e.isIntersecting) setActive(e.target.id);
                    }
                },
                { rootMargin: '-45% 0px -45% 0px' },
            );
            CHAPTERS.forEach((c) => {
                const el = document.getElementById(c.id);
                if (el) observer.observe(el);
            });
            cleanup = () => observer.disconnect();
        });

        return () => {
            cancelAnimationFrame(raf);
            cleanup?.();
        };
    }, []);

    const chapters = CHAPTERS.filter((c) => c.id !== 'film' || hasFilm);

    return (
        <nav
            aria-label="Hoofdstukken"
            className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 md:flex lg:left-6"
        >
            {chapters.map((c) => {
                const isActive = active === c.id;
                return (
                    <a
                        key={c.id}
                        href={`#${c.id}`}
                        className="group relative flex h-8 items-center focus:outline-none"
                        aria-label={c.label}
                        aria-current={isActive ? 'true' : undefined}
                    >
                        <span
                            className={`block rounded-full border-2 border-duck-ink transition-all duration-300 ${
                                isActive
                                    ? 'h-8 w-3 bg-duck-acid'
                                    : 'h-3 w-3 bg-duck-bg group-hover:bg-duck-acid/60'
                            }`}
                        />
                        <span
                            className={`pointer-events-none absolute left-6 -translate-x-1 whitespace-nowrap rounded-full border-2 border-duck-ink px-3 py-1 text-[11px] font-bold uppercase tracking-widest opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${
                                isActive
                                    ? 'bg-duck-ink text-duck-bg'
                                    : 'bg-duck-bg text-duck-ink'
                            }`}
                        >
                            {c.num !== '·' && <span className="mr-1.5">{c.num}</span>}
                            {c.label}
                        </span>
                    </a>
                );
            })}
        </nav>
    );
}

/** Dunne voortgangsbalk bovenaan de pagina. */
export function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            setProgress(max > 0 ? h.scrollTop / max : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <div className="fixed inset-x-0 top-0 z-50 h-1.5 bg-duck-ink/10" aria-hidden="true">
            <div
                className="h-full origin-left bg-duck-acid"
                style={{ transform: `scaleX(${progress})` }}
            />
        </div>
    );
}
