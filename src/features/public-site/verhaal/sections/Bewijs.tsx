import React from 'react';
import { ChapterMarker, Reveal, Pill, INK_SOFT } from '../components/storyBrand';
import { Accordion, type AccordionItem } from '../components/Accordion';
import { EchtProduct } from './EchtProduct';

/*
 * De domeinen en kerndoelcodes komen één-op-één uit `src/config/sloKerndoelen.ts`
 * (SLO-conceptkerndoelen, september 2025).
 */
const DOMAINS = [
    {
        id: 'Domein 21',
        title: 'Digitale systemen, media, data en AI',
        items: [
            ['21A', 'Digitale systemen'],
            ['21B', 'Media & informatie'],
            ['21C', 'Data & dataverwerking'],
            ['21D', 'Kunstmatige intelligentie'],
        ],
    },
    {
        id: 'Domein 22',
        title: 'Digitale producten en programmeren',
        items: [
            ['22A', 'Digitale producten'],
            ['22B', 'Programmeren'],
        ],
    },
    {
        id: 'Domein 23',
        title: 'Veiligheid, welzijn en maatschappij',
        items: [
            ['23A', 'Veiligheid & privacy'],
            ['23B', 'Digitaal welzijn'],
            ['23C', 'Maatschappij'],
        ],
    },
];

const LEADERSHIP: Array<[string, string]> = [
    [
        'SLO zit erin, niet ernaast',
        'Kerndoelen zijn standaard onderdeel van elke missie. Na de les kun je aanwijzen wat er geleerd is.',
    ],
    [
        'Geen zondagsvoorbereiding',
        'Docenten starten met wat er al ligt. Geen werkbladen ontwerpen, geen AI-cursus vóór les één.',
    ],
    [
        'Rapport na zes weken',
        'Deelname, voortgang en SLO-koppeling op papier — iets om een schoolbesluit op te baseren.',
    ],
    [
        'Past bijna overal',
        'Mentorles, projectweek, keuzeuur of gewone les. Als het maar niet de 47e Teams-vergadering is.',
    ],
];

const ICT: Array<[string, string]> = [
    [
        'Microsoft 365-login',
        'Inloggen via de schoolomgeving die je al hebt. ICT richt niets nieuws in.',
    ],
    [
        'Verwerkersovereenkomst',
        'Het privacyteam wil eerst de afspraken zien? Goed plan. Dat kan.',
    ],
    [
        'DPIA-support',
        'DGSkills levert wat je nodig hebt voor de DPIA-check. Scholen beoordelen zelf — zo hoort het.',
    ],
    [
        'AI-transparantie',
        'Hoe de AI werkt is uitlegbaar voor leerlingen, docenten en schoolbeleid. Geen zwarte doos.',
    ],
    ['Eén aanspreekpunt', 'Geen ticketnummer, geen wachtrij van drie dagen.'],
];

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

export function Bewijs() {
    return (
        <section id="bewijs" className="scroll-mt-24 relative bg-duck-ink text-duck-bg grain">
            <div className="mx-auto max-w-6xl px-6 py-24 md:px-14 md:py-36">
                <ChapterMarker
                    dark
                    kicker="Hoofdstuk 5 · Het bewijs"
                    number="5"
                    title={
                        <>
                            Elk goed verhaal <em className="italic text-duck-acid">laat iets achter</em>.
                        </>
                    }
                />
                <Reveal delay={0.15} className="mt-8 max-w-2xl">
                    <p className="text-lg leading-relaxed text-duck-bg/70 md:text-xl">
                        Geen PowerPoint vol beloften, maar deelname, voortgang en SLO-koppeling op papier.
                        Iets om een schoolbesluit op te baseren.
                    </p>
                </Reveal>

                {/* SLO-domeinen */}
                <div className="mt-14 grid gap-4 md:grid-cols-3">
                    {DOMAINS.map((d, i) => (
                        <Reveal key={d.id} delay={0.08 * i}>
                            <div className={`h-full rounded-2xl border-2 border-duck-bg/20 ${INK_SOFT} p-5`}>
                                <span className="inline-block rounded-full bg-duck-acid px-3 py-1 text-[11px] font-black uppercase tracking-widest text-duck-ink">
                                    {d.id}
                                </span>
                                <h3 className="mt-3 font-display text-xl font-black leading-snug">
                                    {d.title}
                                </h3>
                                <ul className="mt-4 space-y-2">
                                    {d.items.map(([code, label]) => (
                                        <li
                                            key={code}
                                            className="flex items-center gap-2.5 text-sm text-duck-bg/75"
                                        >
                                            <span className="rounded-md border border-duck-acid/50 px-1.5 py-0.5 text-[10px] font-black text-duck-acid">
                                                {code}
                                            </span>
                                            {label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    ))}
                </div>
                <Reveal delay={0.2}>
                    <p className="mt-4 text-xs italic text-duck-bg/45">
                        Gebaseerd op de SLO-conceptkerndoelen (september 2025). Definitieve vaststelling
                        volgt via een AMvB.
                    </p>
                </Reveal>

                <EchtProduct />

                {/* schoolleiding + ICT */}
                <div className="mt-16 grid gap-10 lg:grid-cols-2">
                    <div>
                        <Reveal>
                            <Pill dark>Voor schoolleiding</Pill>
                        </Reveal>
                        <div className="mt-6 divide-y divide-duck-bg/15 border-y border-duck-bg/15">
                            {LEADERSHIP.map(([t, b], i) => (
                                <Reveal key={t} delay={0.06 * i}>
                                    <div className="flex gap-5 py-5">
                                        <span className="font-display text-2xl font-black text-duck-acid">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <h4 className="font-display text-lg font-black">{t}</h4>
                                            <p className="mt-1 text-sm leading-relaxed text-duck-bg/65">{b}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Reveal>
                            <Pill dark>Voor ICT &amp; privacy</Pill>
                        </Reveal>
                        <div className="mt-6 space-y-3">
                            {ICT.map(([t, b], i) => (
                                <Reveal key={t} delay={0.06 * i}>
                                    <div
                                        className={`flex gap-4 rounded-xl border-2 border-duck-bg/20 ${INK_SOFT} p-4`}
                                    >
                                        <span
                                            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-duck-acid text-xs font-black text-duck-ink"
                                            aria-hidden="true"
                                        >
                                            ✓
                                        </span>
                                        <div>
                                            <h4 className="text-sm font-bold">{t}</h4>
                                            <p className="mt-0.5 text-sm text-duck-bg/60">{b}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-16">
                    <Reveal>
                        <Pill dark>De vragen die in elk schoolteam op tafel komen</Pill>
                    </Reveal>
                    <Reveal delay={0.1} className="mt-6">
                        <Accordion items={FAQ} dark />
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
