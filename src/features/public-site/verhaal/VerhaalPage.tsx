import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/services/analyticsService';
import { LogoLockup, Marquee, HARD_SHADOW } from './components/storyBrand';
import { ChapterRail, ScrollProgress } from './components/ChapterRail';
import { FilmChapter } from './sections/FilmChapter';
import { Proloog } from './sections/Proloog';
import { Probleem } from './sections/Probleem';
import { Ontmoeting } from './sections/Ontmoeting';
import { MilaReis } from './sections/MilaReis';
import { NuJij } from './sections/NuJij';
import { Docent } from './sections/Docent';
import { Bewijs } from './sections/Bewijs';
import { Epiloog } from './sections/Epiloog';
import './verhaal.css';

/** Navigatiebalk die pas verschijnt zodra de bezoeker voorbij het eerste scherm is. */
function Nav() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.header
                    initial={{ y: -80 }}
                    animate={{ y: 0 }}
                    exit={{ y: -80 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-x-0 top-0 z-40 border-b-[3px] border-duck-ink bg-duck-bg/90 backdrop-blur-md"
                >
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-14">
                        <a href="#proloog" className="flex items-center gap-2.5" aria-label="Naar het begin">
                            <LogoLockup height={30} />
                        </a>
                        <div className="flex items-center gap-3">
                            <a
                                href="#bewijs"
                                className="hidden text-sm font-bold text-duck-ink/70 hover:text-duck-ink md:inline-block"
                            >
                                SLO-koppeling
                            </a>
                            <a
                                href="/login"
                                className="group relative inline-flex min-h-[44px] items-center px-2 text-sm font-bold text-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                            >
                                Inloggen
                                <span className="absolute bottom-1.5 left-2 h-0.5 w-[calc(100%-1rem)] origin-left scale-x-0 bg-duck-ink transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
                            </a>
                            <a
                                href="#epiloog"
                                className={`min-h-[44px] rounded-full border-[3px] border-duck-ink bg-duck-acid px-5 py-2 text-sm font-bold text-duck-ink ${HARD_SHADOW} transition-transform hover:-translate-y-0.5`}
                            >
                                Plan schoolpilot →
                            </a>
                        </div>
                    </div>
                </motion.header>
            )}
        </AnimatePresence>
    );
}

/**
 * `/verhaal` — de scrollytelling-verhaalpagina.
 *
 * De opbouw volgt de hoofdstukken: de film over Jayden (alleen voor eerste
 * bezoekers), daarna Proloog → Probleem → Ontmoeting → Mila → Docent → Bewijs
 * → Epiloog.
 */
export function VerhaalPage() {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Het verhaal van een les die wél werkt | DGSkills';

        const existing = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
        const originalDescription = existing?.getAttribute('content') ?? null;
        const wasCreated = existing === null;
        const descriptionEl = existing ?? document.createElement('meta');
        if (wasCreated) {
            descriptionEl.setAttribute('name', 'description');
            document.head.appendChild(descriptionEl);
        }
        descriptionEl.setAttribute(
            'content',
            'Digitale geletterdheid voor VO en VSO, verteld als verhaal: van de pijn in de klas naar missies, docentdashboard en aantoonbare SLO-dekking.',
        );

        trackEvent('seo_page_view', { cluster: 'story', page: 'verhaal' });

        return () => {
            document.title = originalTitle;
            if (wasCreated) {
                descriptionEl.remove();
            } else if (originalDescription !== null) {
                descriptionEl.setAttribute('content', originalDescription);
            }
        };
    }, []);

    return (
        <div className="verhaal relative bg-duck-bg font-sans text-duck-ink antialiased">
            <ScrollProgress />
            <Nav />
            <ChapterRail />

            <main>
                <FilmChapter />
                <Proloog />
                <Probleem />
                <Ontmoeting />
                <MilaReis />
                <NuJij />
                <Marquee
                    dark
                    items={[
                        'De klas werkt zelfstandig',
                        'Jij ziet wie vastzit',
                        'De spreadsheet gaat met pensioen',
                        'Bewijs, geen rapport',
                    ]}
                />
                <Docent />
                <Bewijs />
                <Epiloog />
            </main>
        </div>
    );
}
