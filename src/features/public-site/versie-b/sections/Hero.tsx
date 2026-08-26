import React from 'react';
import { Pill, LogoLockup, HARD_SHADOW, HARD_SHADOW_LG } from '../../verhaal/components/storyBrand';
import { VERHAAL_STATS } from '../../verhaal/verhaalStats';

/**
 * Drie bewijspunten, identiek aan variant A. Elk punt is onderbouwd: het
 * missieaantal komt uit de curriculumconfiguratie, de SLO-koppeling is
 * zichtbaar in het docentdashboard en "gebouwd door een docent" is de
 * kernpositionering. Bewust geen dekkings-, AVG- of AI Act-claims.
 */
const BEWIJSPUNTEN = [
    `${VERHAAL_STATS.missies} kant-en-klare missies`,
    'Gekoppeld aan de SLO-kerndoelen',
    'Gebouwd door een docent',
];

/** Vier dingen die een leerling in een missie máákt — illustraties, geen schermafdrukken. */
const UITGELICHT = [
    { beeld: '/assets/previews/maak/maak-game.webp', titel: 'Bouw je eigen game' },
    { beeld: '/assets/previews/maak/maak-beeld.webp', titel: 'Maak beeld met AI' },
    { beeld: '/assets/previews/maak/maak-website.webp', titel: 'Zet een website in elkaar' },
    { beeld: '/assets/previews/maak/maak-chatbot.webp', titel: 'Train je eigen chatbot' },
];

/**
 * Het eerste scherm van variant B.
 *
 * Bewust bijna gelijk aan dat van variant A: dat scherm doet aantoonbaar wat
 * het moet doen, en de A/B-test moet het verschil in *structuur* meten, niet in
 * *belofte*. Twee dingen wijken af, allebei uit het ontwerpkader:
 *
 * - **Eén hoofdactie** in plaats van vijf concurrerende (principe P3). "Plan een
 *   schoolpilot" is de knop; een missie bekijken is een tekstlink eronder.
 * - **De kop blijft woordelijk gelijk** aan A. Die staat vast in `index.html`
 *   als LCP-element; een afwijkende kop zou eerst A tonen en dan omklappen.
 */
export function Hero() {
    return (
        <section
            id="hero"
            className="relative flex min-h-[100svh] scroll-mt-20 flex-col overflow-hidden bg-duck-bg px-6 pb-14 pt-5 md:px-10 md:pb-16 lg:px-16"
        >
            <div className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between gap-4">
                <a
                    href="#hero"
                    aria-label="DGSkills, naar het begin"
                    className="inline-flex min-h-[44px] items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                >
                    <LogoLockup height={30} />
                </a>
                <a
                    href="/login"
                    data-cta="versieb_hero_login"
                    className="inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-bold text-duck-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                >
                    Inloggen
                </a>
            </div>

            <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-10 py-8 lg:grid-cols-2 lg:gap-12 lg:py-4">
                <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
                    <Pill filled>Digitale geletterdheid voor VO &amp; VSO</Pill>

                    <h1 className="mt-6 max-w-xl font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl xl:text-6xl">
                        Digitale geletterdheid, missie voor missie
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-relaxed text-duck-ink/75 md:text-lg">
                        DGSkills is de kant-en-klare leeromgeving voor VO en VSO. Leerlingen
                        oefenen AI, online veiligheid en digitale vaardigheden in{' '}
                        {VERHAAL_STATS.missies} korte missies, met XP, badges en directe
                        feedback. Jij ziet per SLO-kerndoel wie het al kan.
                    </p>

                    {/* Eén hoofdactie. De tweede stap staat er bewust als tekstlink
                        onder: twee even zware knoppen laten de bezoeker kiezen op een
                        moment dat hij nog niets weet. */}
                    <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                        <a
                            href="/pilot"
                            data-cta="versieb_hero_schoolpilot"
                            className={`inline-flex min-h-[52px] items-center rounded-full border-[3px] border-duck-ink bg-duck-acid px-8 py-3.5 text-lg font-bold text-duck-ink ${HARD_SHADOW} transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2`}
                        >
                            Plan een schoolpilot
                        </a>
                        <a
                            href="/leerlingdemo"
                            data-cta="versieb_hero_leerlingdemo"
                            className="inline-flex min-h-[44px] items-center text-sm font-bold text-duck-ink/75 underline underline-offset-4 hover:text-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                        >
                            Of bekijk eerst een missie — zonder account
                        </a>
                    </div>

                    <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t-2 border-duck-ink/10 pt-5 text-xs font-bold uppercase tracking-[0.14em] text-duck-ink/75 lg:justify-start">
                        {BEWIJSPUNTEN.map((punt) => (
                            <li key={punt} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-duck-ink/50" aria-hidden="true" />
                                {punt}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-full min-w-0">
                    <div className={`rounded-2xl border-[3px] border-duck-ink bg-white p-6 md:p-7 ${HARD_SHADOW_LG}`}>
                        <p className="font-display text-lg font-black md:text-xl">Dit doen leerlingen</p>
                        <p className="mt-1 text-sm text-duck-ink/70">
                            {VERHAAL_STATS.missies} missies over {VERHAAL_STATS.leerjaren} leerjaren
                        </p>
                        <ul className="mt-5 grid grid-cols-2 gap-4">
                            {UITGELICHT.map((missie) => (
                                <li key={missie.beeld}>
                                    <img
                                        src={missie.beeld}
                                        alt={missie.titel}
                                        width={800}
                                        height={500}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full rounded-xl border-2 border-duck-ink object-cover"
                                    />
                                    <p className="mt-2 text-sm font-bold leading-tight">{missie.titel}</p>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-5 border-t-2 border-duck-ink/10 pt-4 text-xs italic leading-relaxed text-duck-ink/70">
                            Voorbeelden van wat leerlingen maken.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
