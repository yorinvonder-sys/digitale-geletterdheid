import React, { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Pill, Reveal } from '../components/storyBrand';

type Beat = {
    id: string;
    /** Kleine bovenregel boven de marker, alleen waar die iets toevoegt. */
    over?: string;
    marker: string;
    /**
     * `time` is een concreet moment op de maandagochtend en krijgt de acid-nadruk.
     * `state` is een toestand zonder klok en valt bewust terug — zo is zichtbaar
     * dat de klok ophoudt met tikken en het verhaal uitzoomt.
     */
    kind: 'time' | 'state';
    title: string;
    body: string;
};

const BEATS: Beat[] = [
    {
        id: 'inloggen',
        over: 'Maandag',
        marker: '08:30',
        kind: 'time',
        title: 'De helft van de klas komt niet eens ingelogd.',
        body: 'Wachtwoord kwijt. Account werkt niet. “Meneer, moet dit via Teams of via die andere app?” Tien minuten verder en de les is nog niet begonnen.',
    },
    {
        id: 'afhaken',
        marker: '08:41',
        kind: 'time',
        title: 'Mila heeft haar hand weer laten zakken.',
        body: 'Ze stak hem twee keer op. Beide keren stond je aan de andere kant van het lokaal, bij iemand die niet kon inloggen. Ze is niet boos. Ze is gewoon gestopt met vragen.',
    },
    {
        id: 'ai',
        marker: '09:04',
        kind: 'time',
        title: 'En dus vraagt ze het aan iets dat wél meteen antwoordt.',
        body: 'Telefoon half onder de tafel, AI open. Niet uit brutaliteit — het is het enige in dit lokaal dat direct reageert. De een wordt er slimmer van, de ander vooral afhankelijker. En aan niets kun je zien wie wie is.',
    },
    {
        id: 'bel',
        marker: 'Na de bel',
        kind: 'state',
        title: 'En wat heeft dit uur opgeleverd?',
        body: 'Niets wat je kunt aanwijzen. De voortgang staat in een spreadsheet. Ergens. Waarschijnlijk. Straks vraagt de mentor hoe het met Mila gaat en heb je een gevoel — geen antwoord. Zij heeft dit uur wél iets geleerd. Alleen niets van wat op je planning stond.',
    },
];

/* De eerste drie beats hangen aan de tikkende klok; de vierde is de breuk. */
const TICKS = BEATS.slice(0, 3);
const TEAR = BEATS[3];

/* Oplopende inspringing: de tekst drijft weg van de lijn naarmate het erger wordt. */
const INDENTS = ['', 'md:pl-10', 'md:pl-20'];

/** Tijdstip of toestand, als grootste element van de beat. */
function BeatMarker({ beat }: { beat: Beat }) {
    return (
        <>
            {beat.over && (
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-duck-bg/45 md:text-xs">
                    {beat.over}
                </span>
            )}
            <span
                className={`block font-display font-black leading-none ${
                    beat.kind === 'time'
                        ? 'text-5xl tabular-nums text-duck-acid md:text-7xl'
                        : 'text-2xl uppercase tracking-tight text-duck-bg/35 md:text-4xl'
                }`}
            >
                {beat.marker}
            </span>
        </>
    );
}

function BeatBlock({ beat, indent = '' }: { beat: Beat; indent?: string }) {
    return (
        <Reveal className={`pb-16 md:pb-24 ${indent}`}>
            <BeatMarker beat={beat} />
            <h3 className="mt-4 max-w-2xl font-display text-3xl font-black leading-[1.05] md:mt-5 md:text-5xl">
                {beat.title}
            </h3>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-duck-bg/65 md:text-lg">
                {beat.body}
            </p>
        </Reveal>
    );
}

export function Probleem() {
    const clockRef = useRef<HTMLDivElement>(null);
    const reduceMotion = usePrefersReducedMotion();

    /*
     * De acid-lijn vult mee met de scroll: dát is wat de klok laat tikken.
     * Benoemde randen, gelijk aan MilaReis — de decimale offsetvorm levert hier
     * een waarde die op 0 blijft staan.
     */
    const { scrollYProgress } = useScroll({
        target: clockRef,
        offset: ['start end', 'end center'],
    });

    return (
        <section id="probleem" className="scroll-mt-24 relative bg-duck-ink text-duck-bg grain">
            <div className="mx-auto max-w-6xl px-6 py-24 md:px-14 md:py-36">
                {/* De kop blijft op de gedeelde middenas, gelijk aan de andere hoofdstukken. */}
                <div className="mx-auto max-w-4xl text-center">
                    <Reveal>
                        <Pill dark>Hoofdstuk 1 · Het probleem</Pill>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
                            Het begint zoals <em className="italic text-duck-acid">elke maandag</em>{' '}
                            begint.
                        </h2>
                    </Reveal>
                </div>

                {/* Het blok zelf staat gecentreerd; de inhoud lijnt links uit op de tijdlijn. */}
                <div className="mx-auto mt-16 max-w-4xl md:mt-24">
                    {/* De tikkende klok. De lijn staat buiten de beat-animaties en is
                        daardoor doorlopend zichtbaar. */}
                    <div ref={clockRef} className="relative pl-7 md:pl-12">
                        <span
                            aria-hidden="true"
                            className="absolute bottom-0 left-0 top-3 w-[3px] rounded-full bg-duck-bg/15"
                        />
                        <motion.span
                            aria-hidden="true"
                            className="absolute bottom-0 left-0 top-3 w-[3px] origin-top rounded-full bg-duck-acid"
                            /* Bij reduced motion geen transform: de lijn staat meteen vol. */
                            style={reduceMotion ? undefined : { scaleY: scrollYProgress }}
                        />
                        {TICKS.map((beat, i) => (
                            <BeatBlock key={beat.id} beat={beat} indent={INDENTS[i]} />
                        ))}
                    </div>

                    {/* De scheurlijn: één helft loopt door, de andere drijft weg. */}
                    <div className="relative pl-7 md:pl-12">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
                        >
                            <span className="absolute left-0 top-0 h-full w-[3px] rounded-full bg-duck-bg/15" />
                            <span className="absolute left-0 top-0 h-full w-[3px] origin-top rotate-[4deg] rounded-full bg-duck-acid/45 md:rotate-[6deg]" />
                        </span>
                        <BeatBlock beat={TEAR} />
                    </div>
                </div>
            </div>
        </section>
    );
}
