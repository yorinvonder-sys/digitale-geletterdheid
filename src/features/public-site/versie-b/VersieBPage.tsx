import React, { useEffect, useState } from 'react';
import { useHomepageAnalytics } from '@/hooks/useHomepageAnalytics';
import { LogoLockup, HARD_SHADOW } from '../verhaal/components/storyBrand';
import { Hero } from './sections/Hero';
import { Rollen } from './sections/Rollen';
import { Afsluiting } from './sections/Afsluiting';

/**
 * Variant B van de homepage.
 *
 * Zie `docs/marketing/homepage-ab-test-opzet.md` §3 voor de hypothese. Kort: A
 * vertelt een lineair verhaal van ~24 schermen; B laat de bezoeker binnen twee
 * schermen afslaan naar zijn eigen rol en geeft per belofte een doorstuurbaar
 * bewijsstuk. De hero is bewust vrijwel gelijk aan A, zodat de vergelijking het
 * verschil in structuur meet en niet in belofte.
 *
 * Wat B bewust *niet* doet, uit het ontwerpkader:
 * - geen sectie die het scrollen overneemt (P10);
 * - geen beweging die je niet uit kunt zetten — alle animatie loopt via
 *   `Reveal`, dat `prefers-reduced-motion` respecteert (P9);
 * - geen verhalende koppen zonder feitelijke inhoud (P2);
 * - één hoofdactie per scherm (P3).
 *
 * Let op bij opruimen: deze variant leent `storyBrand`, `Accordion` en
 * `VERHAAL_STATS` uit de map van variant A. Wint B en gaat A weg, dan moeten
 * die drie meeverhuizen in plaats van meeverdwijnen.
 */

/** Verschijnt zodra de bezoeker voorbij het eerste scherm is. */
function Nav() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!show) return null;

    return (
        <header className="fixed inset-x-0 top-0 z-40 border-b-[3px] border-duck-ink bg-duck-bg/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 md:px-10 lg:px-16">
                {/*
                    Het beeldmerk stond hier op 28px. Op die maat valt de eend uit
                    elkaar tot een donkere vlek — herkenbaar als woordmerk, niet als
                    merk. Bovendien was het klikvlak 28px hoog, onder de 44px die je
                    op een touchscreen nodig hebt: een logo dat je niet kunt raken.
                */}
                <a
                    href="#hero"
                    className="flex min-h-[44px] items-center gap-2.5 rounded-full pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                    aria-label="Naar het begin"
                >
                    <LogoLockup height={34} />
                </a>
                <div className="flex items-center gap-4">
                    <a
                        href="#schoolleiding"
                        data-cta="versieb_nav_slo"
                        className="hidden text-sm font-bold text-duck-ink/70 hover:text-duck-ink md:inline-block"
                    >
                        SLO-dekking
                    </a>
                    <a
                        href="#ict"
                        data-cta="versieb_nav_ict"
                        className="hidden text-sm font-bold text-duck-ink/70 hover:text-duck-ink md:inline-block"
                    >
                        ICT &amp; privacy
                    </a>
                    <a
                        href="/login"
                        data-cta="versieb_nav_login"
                        className="inline-flex min-h-[44px] items-center text-sm font-bold text-duck-ink"
                    >
                        Inloggen
                    </a>
                    <a
                        href="#pilot"
                        data-cta="versieb_nav_schoolpilot"
                        className={`min-h-[44px] rounded-full border-[3px] border-duck-ink bg-duck-acid px-5 py-2 text-sm font-bold text-duck-ink ${HARD_SHADOW} transition-transform hover:-translate-y-0.5`}
                    >
                        Plan schoolpilot
                    </a>
                </div>
            </div>
        </header>
    );
}

export function VersieBPage({
    variantForced = false,
}: {
    /** True bij `?variant=` — dan niet meten, zie homepageVariant.ts. */
    variantForced?: boolean;
} = {}) {
    /*
     * Zelfde meting als variant A, met `:b` achter het paginalabel. De
     * analytics-laag stuurt alleen een vaste set velden door, dus een los
     * `variant`-veld zou stilzwijgend verdwijnen.
     */
    useHomepageAnalytics('versie-b:b', '.versie-b > main > section[id]', !variantForced);

    return (
        <div className="versie-b relative bg-duck-bg font-sans text-duck-ink antialiased">
            <Nav />
            <main>
                <Hero />
                <Rollen />
                <Afsluiting />
            </main>
        </div>
    );
}
