import React from 'react';
import { motion } from 'framer-motion';
import { ChapterMarker, Reveal, BrowserFrame } from '../components/storyBrand';
import { VERHAAL_STATS } from '../verhaalStats';

const STUDENTS = [
    { init: 'MV', pct: 82, state: 'ok' },
    { init: 'NK', pct: 64, state: 'ok' },
    { init: 'SB', pct: 47, state: 'ok' },
    { init: 'LJ', pct: 29, state: 'help' },
];

const SLO_BARS = [
    { label: 'Informatievaardigheid', pct: 68 },
    { label: 'Digitale veiligheid', pct: 51 },
    { label: 'Creatie & maken', pct: 84 },
];

const POINTS = [
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

export function Docent() {
    return (
        <section id="docent" className="scroll-mt-24 relative overflow-hidden bg-duck-bg grain">
            <div className="mx-auto max-w-6xl px-6 py-24 md:px-14 md:py-36">
                <ChapterMarker
                    kicker="Hoofdstuk 4 · De docent"
                    number="4"
                    title={
                        <>
                            Ondertussen, <em className="italic">twee meter verderop</em>: jij.
                        </>
                    }
                />
                <Reveal delay={0.15} className="mt-8 max-w-2xl">
                    <p className="text-lg leading-relaxed text-duck-ink/70 md:text-xl">
                        Terwijl de klas werkt, kijk jij mee in je dashboard. Wie is klaar, wie heeft hulp
                        nodig, welke SLO-doelen zijn geraakt —{' '}
                        <strong className="text-duck-ink">zonder rondje langs alle tafels</strong>.
                    </p>
                </Reveal>

                <div className="relative mt-14">
                    <Reveal>
                        <BrowserFrame url="dgskills.app/klas" className="mx-auto max-w-4xl">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-display text-xl font-black">Klas 3D · Periode 1</p>
                                <span className="rounded-full border-2 border-duck-ink bg-duck-acid px-3 py-1 text-xs font-bold">
                                    2 hulpvragen
                                </span>
                            </div>

                            {/* leerlingkaarten */}
                            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                                {STUDENTS.map((s, i) => (
                                    <motion.div
                                        key={s.init}
                                        initial={{ opacity: 0, y: 14 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.15 + i * 0.1 }}
                                        className={`rounded-xl border-2 p-3 ${
                                            s.state === 'help'
                                                ? 'border-duck-ink bg-duck-ink text-duck-bg'
                                                : 'border-duck-ink/15 bg-duck-bg'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black ${
                                                    s.state === 'help'
                                                        ? 'border-duck-acid bg-duck-acid text-duck-ink'
                                                        : 'border-duck-ink bg-white'
                                                }`}
                                            >
                                                {s.init}
                                            </span>
                                            <span className="font-display text-xl font-black">{s.pct}%</span>
                                        </div>
                                        {s.state === 'help' && (
                                            <span className="mt-2 inline-block rounded-full bg-duck-acid px-2 py-0.5 text-[10px] font-bold text-duck-ink">
                                                Hulp gevraagd
                                            </span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* SLO-dekking */}
                            <div className="mt-6 rounded-xl border-2 border-duck-ink/15 bg-duck-bg p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs font-bold uppercase tracking-widest text-duck-ink/50">
                                        SLO-dekking
                                    </p>
                                    <span className="text-xs font-bold text-duck-ink">
                                        {VERHAAL_STATS.kerndoelenRegulier} kerndoelen in beeld
                                    </span>
                                </div>
                                <div className="mt-3 space-y-3">
                                    {SLO_BARS.map((b, i) => (
                                        <div key={b.label}>
                                            <div className="mb-1 flex justify-between text-xs">
                                                <span className="font-medium">{b.label}</span>
                                                <span className="font-bold">{b.pct}%</span>
                                            </div>
                                            <div className="h-2.5 rounded-full bg-duck-ink/10">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${b.pct}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        delay: 0.2 + i * 0.15,
                                                        duration: 1,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    }}
                                                    className="h-full rounded-full bg-gradient-to-r from-duck-ink to-duck-acid"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </BrowserFrame>
                    </Reveal>
                </div>

                <div className="mt-14 grid gap-4 md:grid-cols-3">
                    {POINTS.map((pt, i) => (
                        <Reveal key={pt.title} delay={0.08 * i}>
                            <div className="h-full rounded-2xl border-[3px] border-duck-ink bg-white p-5 shadow-[5px_5px_0_0_rgba(32,32,35,1)]">
                                <span className="font-display text-3xl font-black text-duck-ink/30">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3 className="mt-2 font-display text-xl font-black">{pt.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-duck-ink/65">{pt.body}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
