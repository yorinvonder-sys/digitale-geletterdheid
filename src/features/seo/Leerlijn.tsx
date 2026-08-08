import React, { useEffect } from 'react';
import { trackEvent } from '@/services/analyticsService';
import { DuckMark } from '@/components/brand/DuckMark';
import { getKerndoelBadgeClasses, SLO_KERNDOELEN } from '@/config/sloKerndoelen';
import type { SloKerndoelCode } from '@/config/sloKerndoelen';
import {
    LEERLIJN,
    COVERAGE,
    COVERAGE_BY_DOMAIN,
    COVERED_KERNDOEL_COUNT,
    REGULIER_VO_CODES,
    UNIQUE_MISSION_COUNT,
    VSO_CODES,
} from './leerlijnData';
import type { LeerlijnMission, LeerlijnYear } from './leerlijnData';

const PERIOD_COUNT = LEERLIJN.reduce((acc, year) => acc + year.periods.length, 0);

const LEVEL_LABELS: Record<string, string> = { mavo: 'mavo', havo: 'havo', vwo: 'vwo' };

function yearAnchor(year: number): string {
    return `leerjaar-${year}`;
}

const KerndoelBadge: React.FC<{ code: SloKerndoelCode; withLabel?: boolean }> = ({ code, withLabel }) => {
    const kerndoel = SLO_KERNDOELEN[code];
    if (!kerndoel) return null;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${getKerndoelBadgeClasses(code)}`}
            title={`${code} · ${kerndoel.label} — ${kerndoel.omschrijving}`}
        >
            {code}
            {withLabel && <span className="font-semibold">· {kerndoel.label}</span>}
        </span>
    );
};

const MissionRow: React.FC<{ mission: LeerlijnMission }> = ({ mission }) => (
    <li className="flex flex-col gap-2 border-t border-duck-ink/10 py-3 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-duck-ink">{mission.title}</span>
            {mission.isReview && (
                <span className="rounded-full border border-duck-ink/25 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-duck-ink/60">
                    Check
                </span>
            )}
            {mission.duration && <span className="text-xs font-medium text-duck-ink/50">{mission.duration}</span>}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {mission.kerndoelen.map((code) => (
                <KerndoelBadge key={code} code={code} />
            ))}
        </div>
    </li>
);

const YearSection: React.FC<{ year: LeerlijnYear }> = ({ year }) => (
    <section id={yearAnchor(year.year)} className="scroll-mt-24">
        <div className="rounded-3xl border border-duck-ink/15 bg-white p-6 md:p-10">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <h2 className="font-display text-3xl font-black text-duck-ink md:text-4xl">
                    Leerjaar {year.year} — {year.title}
                </h2>
                <span className="rounded-full border border-duck-ink/20 px-3 py-1 text-xs font-bold text-duck-ink/70">
                    {year.levels.map((l) => LEVEL_LABELS[l] ?? l).join(' · ')}
                </span>
                <span className="text-sm font-semibold text-duck-ink/60">{year.missionCount} opdrachten</span>
            </div>
            <p className="mt-2 text-base font-semibold text-duck-ink/70">{year.subtitle}</p>
            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-duck-ink/70">{year.description}</p>

            <div className="mt-8 space-y-6">
                {year.periods.map((period) => (
                    <div key={period.number} className="rounded-2xl border border-duck-ink/15 bg-duck-bg p-5 md:p-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                            <h3 className="text-lg font-extrabold text-duck-ink">
                                Periode {period.number} · {period.title}
                            </h3>
                            <span className="text-xs font-semibold text-duck-ink/50">
                                {period.missions.length} opdrachten
                            </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-duck-ink/60">{period.subtitle}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wide text-duck-ink/50">
                                Focus
                            </span>
                            {period.sloFocus.map((code) => (
                                <KerndoelBadge key={code} code={code} withLabel />
                            ))}
                        </div>

                        <ul className="mt-4">
                            {period.missions.map((mission) => (
                                <MissionRow key={`${period.number}-${mission.id}`} mission={mission} />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export const Leerlijn: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Leerlijn digitale geletterdheid: opdrachten en SLO-kerndoelen per leerjaar | DGSkills';

        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta(
            'name',
            'description',
            `Welke opdrachten krijgt een leerling in leerjaar 1, 2 en 3, en welke SLO-kerndoelen digitale geletterdheid dekken ze? Volledig overzicht van ${UNIQUE_MISSION_COUNT} opdrachten met dekkingsmatrix.`,
        );
        setMeta('property', 'og:title', 'Leerlijn digitale geletterdheid: opdrachten per leerjaar | DGSkills');
        setMeta(
            'property',
            'og:description',
            'Per leerjaar en periode: welke opdrachten leerlingen doen en welke SLO-kerndoelen daarmee gedekt worden.',
        );

        trackEvent('seo_page_view', { cluster: 'curriculum', page: 'leerlijn' });

        return () => {
            document.title = originalTitle;
        };
    }, []);

    return (
        <div className="min-h-screen bg-duck-bg font-sans text-duck-ink antialiased selection:bg-duck-acid selection:text-duck-ink">
            <nav className="sticky top-0 z-40 border-b border-duck-ink/10 bg-duck-bg/90 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
                    <a href="/" className="flex items-center gap-2.5" aria-label="DGSkills homepage">
                        <DuckMark className="size-8" />
                        <span className="text-[15px] font-bold tracking-tight text-duck-ink">DGSkills</span>
                    </a>
                    <div className="flex items-center gap-5 text-[13px]">
                        <a href="/scholen" className="hidden font-medium text-duck-ink/60 transition-colors hover:text-duck-ink sm:inline">
                            Voor scholen
                        </a>
                        <a
                            href="/slo-kerndoelen-digitale-geletterdheid"
                            className="hidden font-medium text-duck-ink/60 transition-colors hover:text-duck-ink md:inline"
                        >
                            Kerndoelen
                        </a>
                        <a
                            href="/pilot"
                            className="rounded-full bg-duck-acid px-4 py-2 font-semibold text-duck-ink transition-colors hover:bg-duck-acid/80"
                        >
                            Pilot aanvragen
                        </a>
                    </div>
                </div>
            </nav>

            <main id="leerlijn-main" className="mx-auto max-w-6xl px-5 pb-24 pt-12 md:px-8 md:pt-20">
                {/* Hero */}
                <header>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-duck-ink/50">
                        Leerlijn digitale geletterdheid · VO
                    </p>
                    <h1 className="mt-4 max-w-4xl text-balance font-display text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.05]">
                        Welke opdrachten krijgt een leerling — en welk kerndoel dekt elke opdracht?
                    </h1>
                    <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-duck-ink/70">
                        Dit is het volledige aanbod van DGSkills, opdracht voor opdracht. Per leerjaar en
                        periode zie je wat leerlingen doen en aan welke SLO-kerndoelen digitale geletterdheid
                        dat gekoppeld is. De lijst komt rechtstreeks uit het product, niet uit een brochure —
                        komt er een opdracht bij, dan staat die hier ook.
                    </p>

                    <dl className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                        {[
                            { label: 'Opdrachten', value: String(UNIQUE_MISSION_COUNT) },
                            { label: 'Leerjaren', value: String(LEERLIJN.length) },
                            { label: 'Periodes', value: String(PERIOD_COUNT) },
                            {
                                label: 'Kerndoelen met aanbod',
                                value: `${COVERED_KERNDOEL_COUNT} / ${REGULIER_VO_CODES.length}`,
                            },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-2xl border border-duck-ink/15 bg-white p-4">
                                <dt className="text-[11px] font-bold uppercase tracking-wide text-duck-ink/50">
                                    {stat.label}
                                </dt>
                                <dd className="mt-1 text-2xl font-black text-duck-ink">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </header>

                {/* Inhoudsopgave */}
                <nav aria-label="Inhoudsopgave" className="mt-12 rounded-2xl border border-duck-ink/15 bg-white p-5">
                    <h2 className="text-[11px] font-bold uppercase tracking-wide text-duck-ink/50">Op deze pagina</h2>
                    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-duck-ink/80">
                        <li>
                            <a href="#dekking" className="underline-offset-4 hover:underline">
                                Dekking per kerndoel
                            </a>
                        </li>
                        {LEERLIJN.map((year) => (
                            <li key={year.year}>
                                <a href={`#${yearAnchor(year.year)}`} className="underline-offset-4 hover:underline">
                                    Leerjaar {year.year}: {year.title}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a href="#vso" className="underline-offset-4 hover:underline">
                                VSO
                            </a>
                        </li>
                        <li>
                            <a href="#verantwoording" className="underline-offset-4 hover:underline">
                                Verantwoording
                            </a>
                        </li>
                        <li>
                            <a href="#vragen" className="underline-offset-4 hover:underline">
                                Veelgestelde vragen
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Dekkingsmatrix */}
                <section id="dekking" className="mt-16 scroll-mt-24">
                    <h2 className="font-display text-3xl font-black md:text-4xl">Dekking per kerndoel</h2>
                    <p className="mt-4 max-w-3xl text-[15px] leading-7 text-duck-ink/70">
                        De SLO-conceptkerndoelen digitale geletterdheid (september 2025) bestaan uit drie
                        domeinen met samen {REGULIER_VO_CODES.length} kerndoelen. Hieronder staat hoeveel
                        opdrachten er per leerjaar aan elk kerndoel gekoppeld zijn. Eén opdracht telt bij
                        meerdere kerndoelen mee als die er ook meerdere raakt, dus de kolommen tellen op tot
                        meer dan het aantal opdrachten.
                    </p>

                    <div className="mt-8 overflow-x-auto rounded-2xl border border-duck-ink/15 bg-white">
                        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                            <caption className="sr-only">
                                Aantal opdrachten per SLO-kerndoel, uitgesplitst naar leerjaar
                            </caption>
                            <thead>
                                <tr className="border-b border-duck-ink/15 text-[11px] uppercase tracking-wide text-duck-ink/50">
                                    <th scope="col" className="px-4 py-3 font-bold">
                                        Kerndoel
                                    </th>
                                    {LEERLIJN.map((year) => (
                                        <th key={year.year} scope="col" className="px-4 py-3 text-center font-bold">
                                            Leerjaar {year.year}
                                        </th>
                                    ))}
                                    <th scope="col" className="px-4 py-3 text-center font-bold">
                                        Totaal
                                    </th>
                                </tr>
                            </thead>
                            {COVERAGE_BY_DOMAIN.map((domain) => (
                                <tbody key={domain.domeinNummer}>
                                    <tr className="bg-duck-bg">
                                        <th
                                            scope="colgroup"
                                            colSpan={LEERLIJN.length + 2}
                                            className="px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-duck-ink/70"
                                        >
                                            Domein {domain.domeinNummer} · {domain.domein}
                                        </th>
                                    </tr>
                                    {domain.rows.map((row) => (
                                        <tr key={row.code} className="border-t border-duck-ink/10 align-top">
                                            <th scope="row" className="px-4 py-3 font-semibold">
                                                <span className="flex flex-wrap items-center gap-2">
                                                    <KerndoelBadge code={row.code} />
                                                    <span className="text-duck-ink">{row.label}</span>
                                                </span>
                                                <span className="mt-1 block max-w-md text-xs font-normal leading-5 text-duck-ink/60">
                                                    {row.omschrijving}
                                                </span>
                                            </th>
                                            {row.perYear.map((count, index) => (
                                                <td
                                                    key={LEERLIJN[index].year}
                                                    className="px-4 py-3 text-center font-bold tabular-nums text-duck-ink"
                                                >
                                                    {count > 0 ? count : <span className="text-duck-ink/30">—</span>}
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 text-center font-black tabular-nums">{row.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            ))}
                        </table>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-duck-ink/70">
                        {COVERED_KERNDOEL_COUNT} van de {REGULIER_VO_CODES.length} kerndoelen heeft aanbod in
                        de leerlijn. Een school die de leerlijn volledig draait, kan per kerndoel aanwijzen
                        welke opdrachten eraan gewerkt hebben.
                    </p>
                </section>

                {/* Per leerjaar */}
                <div className="mt-16 space-y-12">
                    {LEERLIJN.map((year) => (
                        <YearSection key={year.year} year={year} />
                    ))}
                </div>

                {/* VSO */}
                <section id="vso" className="mt-16 scroll-mt-24 rounded-3xl border border-duck-ink/15 bg-white p-6 md:p-10">
                    <h2 className="font-display text-2xl font-black md:text-3xl">En het VSO?</h2>
                    <p className="mt-4 max-w-3xl text-[15px] leading-7 text-duck-ink/70">
                        Naast de reguliere kerndoelen kent het voortgezet speciaal onderwijs functionele
                        kerndoelen (domeinen 18 tot en met 20, november 2025). De opdrachten in deze leerlijn
                        zijn daar apart aan gekoppeld, zodat een VSO-school dezelfde opdrachten kan gebruiken
                        en toch op de eigen kerndoelen kan verantwoorden.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                        {VSO_CODES.map((code) => (
                            <KerndoelBadge key={code} code={code} withLabel />
                        ))}
                    </div>
                </section>

                {/* Verantwoording */}
                <section id="verantwoording" className="mt-16 scroll-mt-24">
                    <h2 className="font-display text-2xl font-black md:text-3xl">Waar komen deze gegevens vandaan?</h2>
                    <div className="mt-4 max-w-3xl space-y-4 text-[15px] leading-7 text-duck-ink/70">
                        <p>
                            De opdrachtenlijst en de koppeling naar kerndoelen komen uit dezelfde
                            curriculumconfiguratie die de leerlingomgeving aanstuurt. Deze pagina leest die
                            gegevens rechtstreeks, zodat het overzicht niet los kan gaan lopen van wat
                            leerlingen daadwerkelijk krijgen.
                        </p>
                        <p>
                            De kerndoelen zelf komen uit de definitieve conceptkerndoelen digitale
                            geletterdheid van SLO (september 2025) en de functionele kerndoelen voor het VSO
                            (november 2025). Het zijn conceptkerndoelen: de wettelijke invoering ligt later,
                            en de formulering kan nog wijzigen.
                        </p>
                        <p>
                            De koppeling tussen opdracht en kerndoel is een inhoudelijke keuze van ons,
                            gemaakt op basis van wat de leerling in de opdracht doet. Een school blijft zelf
                            verantwoordelijk voor haar aanbod en de verantwoording daarvan.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-duck-ink">
                        <a href="/slo-kerndoelen-digitale-geletterdheid" className="underline underline-offset-4">
                            Uitleg over de kerndoelen
                        </a>
                        <a href="/compliance/slo-rapport" className="underline underline-offset-4">
                            Voorbeeld dekkingsrapport
                        </a>
                        <a
                            href="/resources/SLO_definitieve_conceptkerndoelen_digitale_geletterdheid.pdf"
                            className="underline underline-offset-4"
                        >
                            Conceptkerndoelen van SLO (pdf)
                        </a>
                    </div>
                </section>

                {/* FAQ */}
                <section id="vragen" className="mt-16 scroll-mt-24">
                    <h2 className="font-display text-2xl font-black md:text-3xl">Veelgestelde vragen</h2>
                    <div className="mt-6 space-y-6">
                        {[
                            {
                                q: 'Moeten we alle opdrachten draaien?',
                                a: 'Nee. De leerlijn is een compleet aanbod, geen verplicht rooster. Een school kan periodes overslaan of een eigen selectie maken; in het docentendashboard zie je dan welke kerndoelen daarmee meer of minder aandacht krijgen.',
                            },
                            {
                                q: 'Hoeveel tijd kost een opdracht?',
                                a: 'De meeste opdrachten duren 15 tot 30 minuten, afhankelijk van het type. Waar we een betrouwbare schatting hebben, staat die bij de opdracht. Een periode is zo met ongeveer één lesuur per week te vullen.',
                            },
                            {
                                q: 'Waarom staat één opdracht bij meerdere kerndoelen?',
                                a: 'Omdat opdrachten zelden over één ding gaan. Een opdracht over nepmail raakt zowel veiligheid en privacy als mediawijsheid. We koppelen aan wat de leerling in de opdracht daadwerkelijk doet, niet aan wat het onderwerp suggereert.',
                            },
                            {
                                q: 'Kunnen wij hiermee verantwoorden richting de inspectie?',
                                a: 'Deze pagina laat zien welk aanbod er is en welke kerndoelen daarbij horen. Wat leerlingen daadwerkelijk hebben gedaan, staat in het docentendashboard en in het dekkingsrapport. De school bepaalt zelf hoe zij haar aanbod verantwoordt.',
                            },
                        ].map((item) => (
                            <div key={item.q} className="rounded-2xl border border-duck-ink/15 bg-white p-5 md:p-6">
                                <h3 className="text-base font-extrabold text-duck-ink">{item.q}</h3>
                                <p className="mt-2 text-[15px] leading-7 text-duck-ink/70">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* CTA + footer */}
            <section className="bg-duck-ink px-5 pb-12 pt-20 text-white md:px-10">
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                    <h2 className="text-balance font-display text-[clamp(2rem,5vw,3.4rem)] font-black leading-[1.06]">
                        Zelf zien hoe dit in de klas werkt?
                    </h2>
                    <p className="mt-5 max-w-md text-pretty text-base font-semibold leading-7 text-white/65">
                        Plan een pilot en draai een periode met een echte klas.
                    </p>
                    <a
                        href="/pilot"
                        className="mt-8 inline-flex min-h-[56px] items-center gap-3 rounded-full bg-duck-acid px-9 py-4 text-base font-extrabold text-duck-ink transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                    >
                        Plan een pilot
                    </a>
                </div>

                <footer className="mx-auto mt-20 max-w-6xl border-t border-white/10 pt-8 text-sm font-semibold text-white/65">
                    <div className="grid gap-8 md:grid-cols-3 md:items-center">
                        <a
                            href="/"
                            className="inline-flex min-h-[44px] w-fit items-center rounded font-extrabold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                        >
                            dgskills.app
                        </a>
                        <div className="flex items-center gap-3 md:justify-center">
                            <DuckMark className="size-9 brightness-0 invert" />
                            <span className="text-lg font-extrabold tracking-tight text-white">DGSkills</span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
                            <a
                                href="/scholen"
                                className="inline-flex min-h-[44px] items-center rounded transition-colors hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                            >
                                Voor scholen
                            </a>
                            <a
                                href="/ict/privacy/policy"
                                className="inline-flex min-h-[44px] items-center rounded transition-colors hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                            >
                                Privacy
                            </a>
                            <a
                                href="mailto:info@dgskills.app"
                                className="inline-flex min-h-[44px] items-center rounded transition-colors hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                            >
                                Contact
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/50">
                        <p>Yorin Vonder · KvK 81819889 · info@dgskills.app</p>
                    </div>
                </footer>
            </section>
        </div>
    );
};
