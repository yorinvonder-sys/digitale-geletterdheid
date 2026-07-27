import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Pill, Reveal } from '../components/storyBrand';

/**
 * Handgetekende SVG-iconen als subtiel watermerk rechtsonder bij elke beat.
 * Ze staan bewust buiten de titelrij, zijn doorzichtig en licht gekanteld, en
 * vangen geen klikken — zie de gouden regels in het plan.
 */
function BeatIcon({ children, rotate = -8 }: { children: React.ReactNode; rotate?: number }) {
    return (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 right-0 inline-flex h-24 w-24 items-center justify-center rounded-3xl border-[3px] border-duck-bg/20 bg-duck-acid/10 opacity-40 md:right-6 md:h-36 md:w-36"
            style={{ transform: `rotate(${rotate}deg)` }}
        >
            <svg
                viewBox="0 0 48 48"
                className="h-14 w-14 opacity-60 md:h-20 md:w-20"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {children}
            </svg>
        </span>
    );
}

/* Streekkleur = duck-bg (#f2f1ec), de papierkleur op het donkere vlak. */
const STROKE = { stroke: '#f2f1ec', strokeWidth: 3 };

const ICONS = [
    /* 1 · verloren sleutel — niet ingelogd */
    <BeatIcon key="key" rotate={-8}>
        <circle cx="17" cy="20" r="8" {...STROKE} />
        <circle cx="17" cy="20" r="2.6" fill="#f2f1ec" />
        <path d="M23 26 36 39" {...STROKE} />
        <path d="M31 34l4-4M35 38l4-4" {...STROKE} />
        <path d="M10 10c1.5-1.6 3.4-2.6 5.5-3" {...STROKE} opacity="0.5" />
    </BeatIcon>,
    /* 2 · afspeelknop op een scherm — YouTube */
    <BeatIcon key="play" rotate={6}>
        <rect x="6" y="10" width="36" height="26" rx="6" {...STROKE} />
        <path d="M21 17.5v11l9.5-5.5z" fill="#f2f1ec" />
        <path d="M14 42h20" {...STROKE} opacity="0.5" />
    </BeatIcon>,
    /* 3 · stiekeme vonk — AI via de achterdeur */
    <BeatIcon key="spark" rotate={-6}>
        <path
            d="M24 4l4.6 12.4L42 18l-10 8.8 3.4 13.2L24 32.4 12.6 40 16 26.8 6 18l13.4-1.6z"
            {...STROKE}
            fill="#f2f1ec"
            fillOpacity="0.15"
        />
        <path d="M38 6l2 5M42 4l1.2 3.2" {...STROKE} />
    </BeatIcon>,
    /* 4 · gespleten cirkel — de kloof */
    <BeatIcon key="split" rotate={5}>
        <path d="M24 6a18 18 0 0 1 0 36" {...STROKE} />
        <path d="M24 6a18 18 0 0 0 0 36" {...STROKE} strokeDasharray="4 5" />
        <path d="M24 4v40" {...STROKE} />
        <path d="M31 12l4-3M33 38l4 3" {...STROKE} opacity="0.6" />
    </BeatIcon>,
];

const BEATS = [
    {
        kicker: 'Maandag, 8:30',
        title: 'De helft van de klas komt niet eens ingelogd.',
        body: 'Wachtwoord kwijt. Account werkt niet. “Meneer, moet dit via Teams of via die andere app?” Tien minuten verder en de les is nog niet begonnen.',
    },
    {
        kicker: 'Maandag, 8:41',
        title: 'De andere helft zit inmiddels op YouTube.',
        body: 'En de voortgang? Die staat in een spreadsheet. Ergens. Waarschijnlijk. In elk geval niet daar waar je hem nodig hebt als de mentor ernaar vraagt.',
    },
    {
        kicker: 'Ondertussen',
        title: 'AI is allang de klas binnen — via de achterdeur.',
        body: 'Leerlingen gebruiken het dagelijks. Zonder richtlijnen, zonder lessen, zonder dat iemand het hen leert. De een wordt er slimmer van, de ander vooral afhankelijker.',
    },
    {
        kicker: 'De scheurlijn',
        title: 'De kloof groeit. Niet tussen leerjaren — binnen je klas.',
        body: 'Jayden bouwt een lift in Minecraft maar kan geen bestand bijvoegen in een e-mail. Dat is geen tegenspraak: dat is een fundament dat ontbreekt.',
    },
];

function Beat({ beat, index }: { beat: (typeof BEATS)[number]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.35'] });
    const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <motion.div ref={ref} style={{ y, opacity }} className="flex gap-6 md:gap-10">
            <div className="flex flex-col items-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-duck-bg/40 font-display text-lg font-black text-duck-acid">
                    {index + 1}
                </span>
                {index < BEATS.length - 1 && <span className="mt-2 w-[2px] flex-1 bg-duck-bg/20" />}
            </div>
            {/* De onderruimte houdt het watermerk vrij van de lopende tekst. */}
            <div className="relative pb-24 md:pb-32">
                {ICONS[index]}
                <Pill dark>{beat.kicker}</Pill>
                <h3 className="mt-5 max-w-2xl font-display text-3xl font-black leading-[1.05] md:text-5xl">
                    {beat.title}
                </h3>
                <p className="relative mt-4 max-w-xl text-base leading-relaxed text-duck-bg/65 md:text-lg">
                    {beat.body}
                </p>
            </div>
        </motion.div>
    );
}

export function Probleem() {
    return (
        <section id="probleem" className="scroll-mt-24 relative bg-duck-ink text-duck-bg grain">
            <div className="mx-auto max-w-6xl px-6 py-24 md:px-14 md:py-36">
                <Reveal>
                    <Pill dark>Hoofdstuk 1 · Het probleem</Pill>
                </Reveal>
                <Reveal delay={0.08}>
                    <h2 className="mt-6 max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
                        Eerst even <em className="italic text-duck-acid">de pijn</em>. Je kent hem wel.
                    </h2>
                </Reveal>

                <div className="mt-16 md:mt-24">
                    {BEATS.map((b, i) => (
                        <Beat key={b.kicker} beat={b} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
