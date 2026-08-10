import React from 'react';
import { motion } from 'framer-motion';
import { Eyes, Pill, LogoLockup, BrowserFrame, HARD_SHADOW } from '../components/storyBrand';
import { HeroDashboardPreview } from '@/features/public-site/demo/HeroDashboardPreview';
import { VERHAAL_STATS } from '../verhaalStats';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Drie korte bewijspunten onder de CTA's.
 *
 * Elk punt is onderbouwd: het missieaantal komt uit `VERHAAL_STATS` (afgeleid
 * uit het curriculum), de SLO-koppeling is zichtbaar in het docentdashboard en
 * "gebouwd door een docent" is de kernpositionering uit het merkdocument.
 * Bewust geen dekkings-, AVG- of AI Act-claims: die zijn niet bewijsbaar op een
 * publieke pagina.
 */
const BEWIJSPUNTEN = [
    `${VERHAAL_STATS.missies} kant-en-klare missies`,
    'Gekoppeld aan de SLO-kerndoelen',
    'Gebouwd door een docent',
];

/**
 * Het eerste scherm van de homepage.
 *
 * De opdracht aan deze sectie: een bezoeker moet binnen vijf seconden weten wat
 * DGSkills is, voor wie het bedoeld is, wat leerlingen doen, wat het de docent
 * oplevert en wat de volgende stap is. Daarom staat hier het merk (logo), de
 * doelgroep (pill), de categorie (kop), de belofte voor leerling én docent
 * (subtekst), twee duidelijke acties en een echt stuk product — geen tekening.
 */
export function Proloog({ onPlayFilm }: { onPlayFilm: () => void }) {
    return (
        // De ruimere padding vanaf lg is nodig omdat de tekst daar links
        // uitlijnt en de vaste hoofdstuknavigatie op ±24-34px van de rand
        // zweeft; zonder die ruimte lopen de stippen dwars door de kop.
        <section
            id="proloog"
            className="relative flex min-h-[100svh] scroll-mt-24 flex-col overflow-hidden bg-duck-bg px-6 pb-16 pt-5 grain md:px-10 md:pb-20 lg:px-16"
        >
            {/* Merkbalk: de naam DGSkills staat direct in beeld. De zwevende
                navigatie van de pagina verschijnt pas na het eerste scherm. */}
            <div className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between gap-4">
                <a
                    href="#proloog"
                    aria-label="DGSkills, naar het begin"
                    className="inline-flex min-h-[44px] items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                >
                    <LogoLockup height={30} />
                </a>
                <a
                    href="/login"
                    className="inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-bold text-duck-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                >
                    Inloggen
                </a>
            </div>

            <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-10 py-8 lg:grid-cols-2 lg:gap-12 lg:py-4">
                {/* ------------------------------ tekstkolom ------------------------------ */}
                <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
                        className="mb-6"
                    >
                        <Eyes size={48} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
                    >
                        <Pill filled>Digitale geletterdheid voor VO &amp; VSO</Pill>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
                        className="mt-6 max-w-xl font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl xl:text-6xl"
                    >
                        Digitale geletterdheid, missie voor missie
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
                        className="mt-6 max-w-xl text-base leading-relaxed text-duck-ink/75 md:text-lg"
                    >
                        DGSkills is de kant-en-klare leeromgeving voor VO en VSO. Leerlingen
                        oefenen AI, online veiligheid en digitale vaardigheden in{' '}
                        {VERHAAL_STATS.missies} korte missies, met XP, badges en directe
                        feedback. Jij ziet per SLO-kerndoel wie het al kan.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.5, ease: EASE }}
                        className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:items-start lg:justify-start"
                    >
                        <a
                            href="/leerlingdemo"
                            className={`inline-flex min-h-[44px] items-center rounded-full border-[3px] border-duck-ink bg-duck-acid px-7 py-3.5 font-bold text-duck-ink ${HARD_SHADOW} transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2`}
                        >
                            Bekijk een missie
                        </a>
                        <a
                            href="/pilot"
                            className="inline-flex min-h-[44px] items-center rounded-full border-[3px] border-duck-ink bg-duck-ink px-7 py-3.5 font-bold text-duck-acid transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                        >
                            Plan een schoolpilot
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold text-duck-ink/70 lg:justify-start"
                    >
                        <button
                            type="button"
                            onClick={onPlayFilm}
                            className="inline-flex min-h-[44px] items-center gap-1.5 underline-offset-4 hover:text-duck-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                        >
                            <span aria-hidden="true">▶</span> Film: van vastlopen naar digitaal vaardig (49 sec)
                        </button>
                        <a
                            href="#probleem"
                            className="inline-flex min-h-[44px] items-center underline-offset-4 hover:text-duck-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                        >
                            Lees het verhaal ↓
                        </a>
                    </motion.div>

                    <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.95, duration: 0.5 }}
                        className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t-2 border-duck-ink/10 pt-5 text-xs font-bold uppercase tracking-[0.14em] text-duck-ink/75 lg:justify-start"
                    >
                        {BEWIJSPUNTEN.map((punt) => (
                            <li key={punt} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-duck-ink/50" aria-hidden="true" />
                                {punt}
                            </li>
                        ))}
                    </motion.ul>
                </div>

                {/* ----------------------------- productkolom ----------------------------- */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.7, ease: EASE }}
                    className="w-full min-w-0"
                >
                    {/*
                     * Het dashboard is hier een illustratie, geen bedienbaar
                     * onderdeel: `inert` houdt de tientallen knoppen erin uit de
                     * tabvolgorde en houdt zijn eigen h1 ("Goedenavond ...") uit
                     * de voorleesvolgorde, zodat dit scherm één kop houdt. Wie
                     * het echt wil gebruiken, klikt op "Bekijk een missie".
                     */}
                    <div inert>
                        <BrowserFrame url="dgskills.app · missieoverzicht">
                            <HeroDashboardPreview which="student" />
                        </BrowserFrame>
                    </div>
                    <p className="mt-3 text-center text-xs italic text-duck-ink/70 lg:text-left">
                        Live uit het echte product. De leerlinggegevens zijn fictief.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
