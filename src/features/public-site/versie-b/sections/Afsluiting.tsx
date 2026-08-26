import React from 'react';
import { Reveal, Pill, Duck, HARD_SHADOW } from '../../verhaal/components/storyBrand';
import { Accordion, type AccordionItem } from '../../verhaal/components/Accordion';
import { PilotForm } from '../../PilotForm';
import { VERHAAL_STATS } from '../../verhaal/verhaalStats';

/** Woordelijk overgenomen uit de bestaande pagina, inclusief de rol per vraag. */
const FAQ: AccordionItem[] = [
    {
        role: 'Docenten',
        q: 'Moet ik zelf AI-lessen ontwerpen?',
        a: 'Nee. Je start met kant-en-klare missies en routes. Wil je later aanpassen, dan kan dat — maar het hoeft echt niet.',
    },
    {
        role: 'Schoolleiding',
        q: 'Wat levert een pilot op?',
        a: 'Deelname, voortgang en SLO-koppeling op papier. Plus advies over wat nodig is als je verder wil. Niet alleen: “de leerlingen waren enthousiast”.',
    },
    {
        role: 'ICT & privacy',
        q: 'Kunnen we privacy en AI vooraf beoordelen?',
        a: 'Ja — en dat is precies de bedoeling. Verwerkersafspraken, DPIA-ondersteuning en AI-transparantie zitten standaard in de pilot. Neem de tijd die je nodig hebt.',
    },
    {
        role: 'Pilot',
        q: 'Hoe snel kan een school starten?',
        a: 'Binnen 10 werkdagen na de eerste afstemming. Geen projectplan van tien pagina’s, geen maanden aanlooptijd.',
    },
];

/** Wat er in de schoolpilot zit. Overgenomen uit de bestaande pagina. */
const PILOT = [
    'Kickoff-call — wij bereiden ons voor, niet alleen jij',
    'Startgids voor de eerste les (voor de docent, niet de ICT-er)',
    `${VERHAAL_STATS.missies} missies die leerlingen direct kunnen starten`,
    'Klas en route ingericht vóór les één',
    'Pilotrapport na 6 weken — met vervolgadvies',
];

const FOOTER_LINKS = [
    { href: '/leerlingdemo', label: 'Bekijk een missie', cta: 'versieb_footer_leerlingdemo' },
    { href: '/compliance-hub', label: 'Compliance-dossier', cta: 'versieb_footer_compliance' },
    { href: '/ict', label: 'Voor ICT', cta: 'versieb_footer_ict' },
    { href: '/ict/privacy/policy', label: 'Privacyverklaring', cta: 'versieb_footer_privacy' },
    { href: '/scholen', label: 'Voor scholen', cta: 'versieb_footer_scholen' },
];

export function Afsluiting() {
    return (
        <>
            {/* -------------------------------- vragen -------------------------------- */}
            <section id="vragen" className="scroll-mt-20 border-t-[3px] border-duck-ink bg-duck-bgLight">
                <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
                    <Reveal>
                        <Pill>Veelgestelde vragen</Pill>
                        <h2 className="mt-4 font-display text-2xl font-black leading-[1.1] tracking-tight md:text-4xl">
                            De vier vragen die scholen als eerste stellen.
                        </h2>
                    </Reveal>
                    <div className="mt-8">
                        <Accordion items={FAQ} />
                    </div>
                </div>
            </section>

            {/* -------------------------------- pilot --------------------------------- */}
            <section id="pilot" className="scroll-mt-20 bg-duck-acid">
                <div className="mx-auto max-w-6xl px-6 pb-14 pt-16 md:px-10 md:pt-20 lg:px-16">
                    <div className="mx-auto max-w-3xl text-center">
                        <Reveal>
                            <h2 className="font-display text-3xl font-black leading-[1.05] tracking-tight text-duck-ink md:text-5xl">
                                Probeer het met één klas.
                            </h2>
                            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-duck-ink/75 md:text-lg">
                                Live binnen 10 werkdagen, geen creditcard. Na zes weken ligt er een
                                rapport waarmee je een schoolbesluit kunt onderbouwen.
                            </p>
                        </Reveal>
                    </div>

                    <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
                        <Reveal delay={0.05}>
                            <div className={`rounded-2xl border-[3px] border-duck-ink bg-duck-bg p-5 ${HARD_SHADOW}`}>
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

                        <Reveal delay={0.1}>
                            <section
                                id="aanvraagformulier"
                                aria-label="Pilot aanvraagformulier"
                                className={`rounded-3xl border-[3px] border-duck-ink bg-duck-bgLight p-6 md:p-8 ${HARD_SHADOW}`}
                            >
                                <PilotForm idPrefix="versieb-pilot" />
                            </section>
                        </Reveal>
                    </div>

                    {/*
                        Footer. Bewust uitgebreider dan op variant A: een inkoper of
                        privacyfunctionaris zoekt hier wie de afzender is en waar het
                        dossier staat. Ontbreekt nog: rechtspersoon, KvK-nummer en
                        vestigingsadres — die gegevens staan nergens in de codebase en
                        zijn niet te verzinnen. Zie de audit, knelpunt 8.
                    */}
                    <footer className="mt-20 border-t-[3px] border-duck-ink pb-4 pt-8">
                        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div className="flex items-center gap-3">
                                <Duck size={40} />
                                <div>
                                    <p className="font-display text-xl font-black text-duck-ink">DGSkills</p>
                                    <p className="text-xs text-duck-ink/70">
                                        Digitale geletterdheid voor VO &amp; VSO — gebouwd door een docent
                                    </p>
                                </div>
                            </div>
                            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-duck-ink/80">
                                {FOOTER_LINKS.map((l) => (
                                    <a
                                        key={l.href}
                                        href={l.href}
                                        data-cta={l.cta}
                                        className="underline-offset-4 hover:underline"
                                    >
                                        {l.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                        <p className="mt-6 text-xs font-medium text-duck-ink/70">
                            <a href="mailto:info@dgskills.app" className="underline-offset-4 hover:underline">
                                info@dgskills.app
                            </a>
                        </p>
                    </footer>
                </div>
            </section>
        </>
    );
}
