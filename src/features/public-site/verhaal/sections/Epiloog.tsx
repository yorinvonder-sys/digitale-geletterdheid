import React from 'react';
import { Reveal, Duck, Pill, HARD_SHADOW } from '../components/storyBrand';
import { PilotForm } from '../../PilotForm';
import { VERHAAL_STATS } from '../verhaalStats';

const PILOT = [
    'Kickoff-call — wij bereiden ons voor, niet alleen jij',
    'Startgids voor de eerste les (voor de docent, niet de ICT-er)',
    `${VERHAAL_STATS.missies} missies die leerlingen direct kunnen starten`,
    'Klas en route ingericht vóór les één',
    'Pilotrapport na 6 weken — met vervolgadvies',
];

export function Epiloog() {
    return (
        <section id="epiloog" className="scroll-mt-24 relative overflow-hidden bg-duck-acid grain">
            <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:px-14 md:pt-36">
                <div className="mx-auto max-w-4xl text-center">
                    <Reveal>
                        <Pill>Epiloog · Jouw beurt</Pill>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h2 className="mt-6 font-display text-5xl font-black leading-[1.0] tracking-tight text-duck-ink md:text-7xl">
                            Klaar voor het <em className="italic">volgende hoofdstuk</em>?
                        </h2>
                    </Reveal>
                    <Reveal delay={0.18}>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-duck-ink/75">
                            Plan een schoolpilot. Live binnen 10 werkdagen, geen creditcard — echt
                            niet. De eend houdt de agenda alvast vrij.
                        </p>
                    </Reveal>
                </div>

                <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
                    <div>
                        <Reveal delay={0.3}>
                            <div
                                className={`max-w-md rounded-2xl border-[3px] border-duck-ink bg-duck-bg p-5 ${HARD_SHADOW}`}
                            >
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-duck-ink/50">
                                    In de schoolpilot — zonder reclametaal
                                </p>
                                <ul className="mt-3 space-y-2.5">
                                    {PILOT.map((p) => (
                                        <li key={p} className="flex gap-2.5 text-sm text-duck-ink/80">
                                            <span
                                                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-duck-ink text-[10px] font-black text-duck-acid"
                                                aria-hidden="true"
                                            >
                                                ✓
                                            </span>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    </div>

                    {/* Het aanvraagformulier staat inline: de bezoeker hoeft de scroll
                        niet te verlaten om zich aan te melden. */}
                    <Reveal delay={0.15}>
                        <section
                            id="aanvraagformulier"
                            aria-label="Pilot aanvraagformulier"
                            className={`rounded-3xl border-[3px] border-duck-ink bg-duck-bgLight p-6 md:p-8 ${HARD_SHADOW} lg:sticky lg:top-24`}
                        >
                            <PilotForm idPrefix="verhaal-epiloog" />
                        </section>
                    </Reveal>
                </div>

                {/* footer */}
                <footer className="mt-24 border-t-[3px] border-duck-ink pb-4 pt-8">
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div className="flex items-center gap-3">
                            <Duck size={40} />
                            <div>
                                <p className="font-display text-xl font-black text-duck-ink">DGSkills</p>
                                <p className="text-xs text-duck-ink/60">
                                    Digitale geletterdheid voor VO &amp; VSO
                                </p>
                            </div>
                        </div>
                        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-duck-ink/80">
                            <a href="#probleem" className="underline-offset-4 hover:underline">
                                Het verhaal
                            </a>
                            <a href="#bewijs" className="underline-offset-4 hover:underline">
                                SLO-koppeling
                            </a>
                            <a href="/ict/privacy" className="underline-offset-4 hover:underline">
                                Privacy &amp; AI
                            </a>
                            <a href="/scholen" className="underline-offset-4 hover:underline">
                                Voor scholen
                            </a>
                            <a
                                href="mailto:info@dgskills.app"
                                className="underline-offset-4 hover:underline"
                            >
                                Contact
                            </a>
                        </nav>
                    </div>
                    <div className="mt-6 flex flex-col justify-between gap-2 text-xs font-medium text-duck-ink/70 md:flex-row">
                        <p>Yorin Vonder · info@dgskills.app</p>
                    </div>
                </footer>
            </div>
        </section>
    );
}
