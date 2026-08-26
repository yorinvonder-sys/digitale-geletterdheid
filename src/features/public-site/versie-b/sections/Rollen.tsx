import React from 'react';
import { Reveal, Pill, HARD_SHADOW, HARD_SHADOW_LG } from '../../verhaal/components/storyBrand';
import { VERHAAL_STATS } from '../../verhaal/verhaalStats';

/**
 * De kern van variant B.
 *
 * Een schoolaankoop wordt niet door één persoon gedaan: docent, schoolleiding
 * en ICT kijken los van elkaar, met een eigen vraag, en delen hun bevindingen
 * later met elkaar. Variant A vraagt van alle drie dezelfde lineaire route.
 * Variant B laat ze binnen twee schermen afslaan naar hun eigen blok, en geeft
 * elk blok een **artefact**: iets wat je kunt doorsturen naar een collega die
 * er niet bij was. Een bewering kun je niet doorsturen, een voorbeeldrapport
 * wel.
 */

const ROLLEN = [
    {
        id: 'docent',
        rol: 'Docent',
        vraag: 'Kan ik hier maandag mee voor de klas?',
    },
    {
        id: 'schoolleiding',
        rol: 'Schoolleiding',
        vraag: 'Dekt dit de kerndoelen, en kan ik dat aantonen?',
    },
    {
        id: 'ict',
        rol: 'ICT & privacy',
        vraag: 'Kunnen we dit vooraf beoordelen?',
    },
];

/** Wat de docent eraan heeft. Woordelijk overgenomen uit de bestaande pagina. */
const DOCENT_PUNTEN = [
    {
        title: 'Je ziet wie vastzit',
        body: 'Voortgang en leervragen in één scherm. Je helpt gericht — in plaats van 29 keer dezelfde vraag te beantwoorden.',
    },
    {
        title: 'Jij hebt het laatste woord',
        body: 'De AI kijkt mee, jij beslist. Een afgeronde stap draai je terug of keur je alsnog goed — met je eigen reden erbij.',
    },
    {
        title: 'Geen zondagsvoorbereiding',
        body: 'Je start met wat er al ligt. Geen werkbladen ontwerpen, geen AI-cursus vóór de eerste les.',
    },
];

/** De SLO-domeinen en kerndoelcodes komen één-op-één uit `src/config/sloKerndoelen.ts`. */
const DOMEINEN = [
    {
        id: 'Domein 21',
        title: 'Digitale systemen, media, data en AI',
        codes: ['21A', '21B', '21C', '21D'],
    },
    { id: 'Domein 22', title: 'Digitale producten en programmeren', codes: ['22A', '22B'] },
    { id: 'Domein 23', title: 'Veiligheid, welzijn en maatschappij', codes: ['23A', '23B', '23C'] },
];

/** Wat ICT en privacy vooraf kunnen beoordelen. Overgenomen uit de bestaande pagina. */
const ICT_PUNTEN = [
    ['Microsoft 365-login', 'Inloggen via de schoolomgeving die je al hebt. ICT richt niets nieuws in.'],
    ['Verwerkersovereenkomst', 'Het privacyteam wil eerst de afspraken zien? Goed plan. Dat kan.'],
    ['DPIA-ondersteuning', 'DGSkills levert wat je nodig hebt voor de DPIA-check. Scholen beoordelen zelf — zo hoort het.'],
    ['AI-transparantie', 'Hoe de AI werkt is uitlegbaar voor leerlingen, docenten en schoolbeleid. Geen zwarte doos.'],
    ['Eén aanspreekpunt', 'Geen ticketnummer, geen wachtrij van drie dagen.'],
];

/** Een doorstuurbaar bewijsstuk naast een belofte — principe P4 uit het ontwerpkader. */
function Artefact({
    href,
    cta,
    label,
    beschrijving,
}: {
    href: string;
    cta: string;
    label: string;
    beschrijving: string;
}) {
    return (
        <a
            href={href}
            data-cta={cta}
            // `text-duck-ink` staat er expliciet: dit kaartje wordt ook in het
            // donkere schoolleiding-blok gebruikt, en daar erfde het de lichte
            // tekstkleur — bijna-witte letters op een witte kaart. Dat breekt
            // stil, want de opmaak ziet er verder normaal uit.
            className={`group flex items-start gap-4 rounded-2xl border-[3px] border-duck-ink bg-white p-4 text-duck-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 ${HARD_SHADOW}`}
        >
            <span
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-duck-ink bg-duck-acid text-sm font-black"
                aria-hidden="true"
            >
                →
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-bold leading-snug">{label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-duck-ink/70">
                    {beschrijving}
                </span>
            </span>
        </a>
    );
}

/** Kop van een rolblok: eerst de rol, dan een feitelijke zin die op zichzelf leesbaar is. */
function BlokKop({ rol, kop }: { rol: string; kop: string }) {
    return (
        <>
            <Pill>{rol}</Pill>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-black leading-[1.1] tracking-tight md:text-4xl">
                {kop}
            </h2>
        </>
    );
}

export function Rollen() {
    return (
        <>
            {/* ------------------------------ rolkeuze ------------------------------ */}
            <section id="rollen" className="scroll-mt-20 border-y-[3px] border-duck-ink bg-duck-bgLight">
                <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16 lg:px-16">
                    <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-duck-ink/50">
                        Waar kom je voor?
                    </p>
                    <ul className="mt-6 grid gap-4 md:grid-cols-3">
                        {ROLLEN.map((r) => (
                            <li key={r.id}>
                                <a
                                    href={`#${r.id}`}
                                    data-cta={`versieb_rolkeuze_${r.id}`}
                                    className={`flex h-full flex-col gap-2 rounded-2xl border-[3px] border-duck-ink bg-duck-bg p-5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 ${HARD_SHADOW}`}
                                >
                                    <span className="font-display text-lg font-black">{r.rol}</span>
                                    <span className="text-sm leading-relaxed text-duck-ink/75">
                                        “{r.vraag}”
                                    </span>
                                    <span className="mt-auto pt-3 text-xs font-bold uppercase tracking-[0.14em] text-duck-ink/60">
                                        Lees verder ↓
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ------------------------------- docent ------------------------------- */}
            <section id="docent" className="scroll-mt-20 bg-duck-bg">
                <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20 lg:px-16">
                    <Reveal>
                        <BlokKop
                            rol="Docent"
                            kop="Je pakt een missie en gaat lesgeven — voorbereiden hoeft niet."
                        />
                    </Reveal>

                    <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
                        <Reveal delay={0.05}>
                            <ul className="space-y-5">
                                {DOCENT_PUNTEN.map((p) => (
                                    <li key={p.title}>
                                        <h3 className="font-display text-lg font-black">{p.title}</h3>
                                        <p className="mt-1 text-sm leading-relaxed text-duck-ink/75">
                                            {p.body}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-7">
                                <Artefact
                                    href="/leerlingdemo"
                                    cta="versieb_docent_leerlingdemo"
                                    label="Speel een missie zoals een leerling hem ziet"
                                    beschrijving="Open de leerlingdemo — geen account nodig, fictieve gegevens."
                                />
                            </div>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <img
                                src="/assets/storytelling/docent-kijkt-mee-dashboard.webp"
                                alt="Over de schouder van een docent: op zijn laptop staat het DGSkills-docentendashboard met de aandachtspunten, de missiekaart van de klas en de SLO-dekking, terwijl de leerlingen achter hem aan het werk zijn."
                                width={1200}
                                height={800}
                                loading="lazy"
                                decoding="async"
                                className={`w-full rounded-2xl border-[3px] border-duck-ink object-cover ${HARD_SHADOW_LG}`}
                            />
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ---------------------------- schoolleiding ---------------------------- */}
            <section id="schoolleiding" className="scroll-mt-20 bg-duck-ink text-duck-bg">
                <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20 lg:px-16">
                    <Reveal>
                        <Pill dark>Schoolleiding</Pill>
                        <h2 className="mt-4 max-w-2xl font-display text-2xl font-black leading-[1.1] tracking-tight md:text-4xl">
                            Na afloop kun je aanwijzen welke kerndoelen aan bod zijn gekomen.
                        </h2>
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-duck-bg/75 md:text-base">
                            Elke missie is getagd met de SLO-conceptkerndoelen. Het curriculum beslaat{' '}
                            {VERHAAL_STATS.missies} missies over {VERHAAL_STATS.leerjaren} leerjaren en
                            raakt {VERHAAL_STATS.domeinen} SLO-domeinen. Geen reconstructie achteraf.
                        </p>
                    </Reveal>

                    <ul className="mt-10 grid gap-4 md:grid-cols-3">
                        {DOMEINEN.map((d) => (
                            <li
                                key={d.id}
                                className="rounded-2xl border-[3px] border-duck-bg/20 bg-duck-bg/5 p-5"
                            >
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-duck-acid">
                                    {d.id}
                                </p>
                                <h3 className="mt-2 font-display text-lg font-black leading-snug">
                                    {d.title}
                                </h3>
                                <p className="mt-3 flex flex-wrap gap-1.5">
                                    {d.codes.map((code) => (
                                        <span
                                            key={code}
                                            className="rounded-full border border-duck-bg/30 px-2 py-0.5 text-[11px] font-bold text-duck-bg/80"
                                        >
                                            {code}
                                        </span>
                                    ))}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <Artefact
                            href="/compliance/slo-rapport"
                            cta="versieb_schoolleiding_slo_rapport"
                            label="Bekijk een voorbeeld-SLO-dekkingsrapport"
                            beschrijving="Zo ziet de verantwoording eruit die je na een pilot in handen hebt."
                        />
                        <Artefact
                            href="/compliance/checklist"
                            cta="versieb_schoolleiding_checklist"
                            label="Compliance-checklist voor VO-scholen"
                            beschrijving="Praktische aandachtspunten om intern langs te lopen."
                        />
                    </div>
                </div>
            </section>

            {/* -------------------------------- ICT --------------------------------- */}
            <section id="ict" className="scroll-mt-20 bg-duck-bg">
                <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20 lg:px-16">
                    <Reveal>
                        <BlokKop
                            rol="ICT &amp; privacy"
                            kop="Alles wat je nodig hebt om dit vooraf te beoordelen, staat online."
                        />
                    </Reveal>

                    <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
                        <Reveal delay={0.05}>
                            <dl className="space-y-4">
                                {ICT_PUNTEN.map(([titel, tekst]) => (
                                    <div
                                        key={titel}
                                        className="border-l-[3px] border-duck-ink/15 pl-4"
                                    >
                                        <dt className="font-bold">{titel}</dt>
                                        <dd className="mt-0.5 text-sm leading-relaxed text-duck-ink/75">
                                            {tekst}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <div className="grid gap-4">
                                <Artefact
                                    href="/ict/privacy"
                                    cta="versieb_ict_privacy"
                                    label="Security &amp; privacy-dossier"
                                    beschrijving="Privacy by design, datastromen en waar de gegevens staan."
                                />
                                <Artefact
                                    href="/ict/privacy/ai"
                                    cta="versieb_ict_ai_transparantie"
                                    label="AI-transparantieverklaring"
                                    beschrijving="Welke AI wordt ingezet, waarvoor, en met welke gegevens."
                                />
                                <Artefact
                                    href="/ict/integraties"
                                    cta="versieb_ict_integraties"
                                    label="Integraties &amp; single sign-on"
                                    beschrijving="Microsoft 365, Google Workspace, SURFconext, Magister, SOMtoday."
                                />
                                <Artefact
                                    href="/ict/technisch"
                                    cta="versieb_ict_technisch"
                                    label="Technische vereisten"
                                    beschrijving="Web-based, geen installatie, werkt op Chromebook en iPad."
                                />
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>
        </>
    );
}
