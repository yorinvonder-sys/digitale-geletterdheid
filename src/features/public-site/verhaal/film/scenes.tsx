import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { Headphones, Zap, Crown, Sparkles, Rocket, ShoppingBag, Trophy } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Duck, INK_SOFT, HARD_SHADOW } from '../components/storyBrand';
import { MinecraftLift, VideoEditIcon } from './MinecraftLift';
import { FRUSTRATION_LINES } from './timeline';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Typt tekst teken voor teken, startend op `from` seconden binnen de scène. */
function Typed({
    t,
    from,
    text,
    className = '',
    speed = 22,
}: {
    t: number;
    from: number;
    text: string;
    className?: string;
    speed?: number;
}) {
    const shown = Math.max(0, Math.floor((t - from) * speed));
    const isTyping = t >= from && shown < text.length;
    return (
        <span className={className}>
            {text.slice(0, shown)}
            {isTyping && (
                <span className="verhaal-caret text-duck-acid" aria-hidden="true">
                    ▏
                </span>
            )}
        </span>
    );
}

/* ------------------- Scène 1 · De frustratie (0–10s) ---------------------- */

export function SceneFrustratie({ t }: { t: number }) {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-duck-bg">
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-10 text-xs font-bold uppercase tracking-[0.3em] text-duck-bg/40"
            >
                Elke docent kent zo’n leerling
            </motion.p>

            <div className="w-full max-w-2xl space-y-5 text-center md:space-y-7">
                <p className="font-display text-2xl font-black leading-snug text-duck-bg/95 md:text-4xl">
                    <Typed
                        t={t}
                        from={FRUSTRATION_LINES[0].from}
                        text={FRUSTRATION_LINES[0].text}
                        speed={FRUSTRATION_LINES[0].speed}
                    />
                </p>
                <p className="font-display text-2xl font-black leading-snug text-duck-bg/70 md:text-4xl">
                    <Typed
                        t={t}
                        from={FRUSTRATION_LINES[1].from}
                        text={FRUSTRATION_LINES[1].text}
                        speed={FRUSTRATION_LINES[1].speed}
                    />
                </p>
                <p className="font-display text-2xl font-black leading-snug text-duck-bg/50 md:text-4xl">
                    <Typed
                        t={t}
                        from={FRUSTRATION_LINES[2].from}
                        text={FRUSTRATION_LINES[2].text}
                        speed={FRUSTRATION_LINES[2].speed}
                    />
                </p>
            </div>

            <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={t > 6.8 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE }}
                className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-duck-acid md:text-base"
            >
                Herkenbaar? Wacht maar.
            </motion.p>
        </div>
    );
}

/* --------------------- Scène 2 · Het raadsel (10–19s) --------------------- */
/* Harde cut naar acid: dezelfde Jayden blijkt briljant. */

export function SceneRaadsel({ t }: { t: number }) {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-duck-ink">
            <motion.p
                initial={{ opacity: 0, scale: 0.85 }}
                animate={t > 0.3 ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: 'spring', bounce: 0.4 }}
                className="text-center font-display text-3xl font-black leading-tight md:text-5xl"
            >
                En díézelfde Jayden…
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 40, rotate: -1.5 }}
                animate={t > 1.3 ? { opacity: 1, y: 0, rotate: -1.5 } : {}}
                transition={{ duration: 0.7, ease: EASE }}
                className={`mt-8 flex items-center gap-4 rounded-2xl border-[3px] border-duck-ink bg-duck-bg px-5 py-4 ${HARD_SHADOW}`}
            >
                <MinecraftLift t={t} />
                <p className="max-w-[220px] text-left text-sm font-bold leading-snug md:text-base">
                    bouwde een werkende lift in Minecraft. Met redstone-logica.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40, rotate: 1.5 }}
                animate={t > 3.2 ? { opacity: 1, y: 0, rotate: 1.5 } : {}}
                transition={{ duration: 0.7, ease: EASE }}
                className={`mt-5 flex items-center gap-4 rounded-2xl border-[3px] border-duck-ink bg-duck-bg px-5 py-4 ${HARD_SHADOW}`}
            >
                <VideoEditIcon />
                <p className="max-w-[220px] text-left text-sm font-bold leading-snug md:text-base">
                    Maakte een video-edit die de hele groepsapp domineerde.
                </p>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                animate={t > 5.8 ? { opacity: 1, scale: 1, rotate: -1 } : {}}
                transition={{ type: 'spring', bounce: 0.45 }}
                className="mt-9 rounded-2xl border-[3px] border-duck-ink bg-duck-ink px-6 py-4 font-display text-2xl font-black text-duck-acid shadow-[6px_6px_0_0_rgba(32,32,35,0.35)] md:text-4xl"
            >
                Hoe kan dit allebei waar zijn?
            </motion.p>
        </div>
    );
}

/* -------------------- Scène 3 · Het antwoord (19–29s) --------------------- */
/* De eend overbrugt twee werelden: fundament én excellentie. */

export function SceneAntwoord({ t }: { t: number }) {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-duck-bg">
            <div className="flex w-full max-w-3xl items-center justify-between gap-3 md:gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={t > 0.4 ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease: EASE }}
                    className={`w-32 rounded-2xl border-2 border-duck-bg/25 ${INK_SOFT} p-4 text-center md:w-48`}
                >
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-duck-bg/50 md:text-xs">
                        De basis
                    </p>
                    <p className="mt-2 text-xs leading-snug text-duck-bg/70 md:text-sm">
                        E-mail. Wachtwoorden. Nepnieuws herkennen.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={t > 0.9 ? { scale: 1, rotate: 0 } : {}}
                    transition={{ type: 'spring', bounce: 0.4 }}
                    className="shrink-0"
                >
                    <Duck size={90} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={t > 0.4 ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease: EASE }}
                    className={`w-32 rounded-2xl border-2 border-duck-acid ${INK_SOFT} p-4 text-center md:w-48`}
                >
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-duck-acid md:text-xs">
                        De uitblinkers
                    </p>
                    <p className="mt-2 text-xs leading-snug text-duck-bg/80 md:text-sm">
                        Bouwen. Coderen. Creëren met AI.
                    </p>
                </motion.div>
            </div>

            {/* de brug groeit tussen beide werelden */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={t > 1.6 ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, ease: EASE }}
                className="mt-2 h-1 w-full max-w-3xl origin-center rounded-full bg-duck-acid"
            />

            <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={t > 2.6 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE }}
                className="mt-9 max-w-2xl text-center font-display text-2xl font-black leading-snug md:text-4xl"
            >
                DGSkills dicht het gat in de basis —{' '}
                <span className="text-duck-bg/60">zodat niemand achterblijft —</span>
            </motion.p>
            <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={t > 5.2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE }}
                className="mt-3 max-w-2xl text-center font-display text-2xl font-black leading-snug text-duck-acid md:text-4xl"
            >
                én laat uitblinkers écht uitblinken.
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={t > 7.2 ? { opacity: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-duck-bg/60 md:text-sm"
            >
                <span>Fundament</span>
                <span className="text-duck-acid">→</span>
                <span>Excellent</span>
            </motion.div>
        </div>
    );
}

/* --------------------- Scène 4 · Het bewijs (29–39s) ---------------------- */
/* Montage: missie af, XP knalt, portfolio vult zich. Van basis naar bouwer. */

export function SceneBewijs({ t }: { t: number }) {
    const phase = t < 3.2 ? 0 : t < 6.4 ? 1 : 2;

    return (
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-duck-bg">
            <AnimatePresence mode="wait">
                {phase === 0 && (
                    <motion.div
                        key="p0"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="flex flex-col items-center"
                    >
                        <div
                            className={`w-full max-w-sm rounded-2xl border-[3px] border-duck-acid ${INK_SOFT} p-5 text-left`}
                        >
                            <p className="text-[11px] font-bold uppercase tracking-widest text-duck-bg/50">
                                Missie · Digitale basis
                            </p>
                            <p className="mt-1 font-display text-2xl font-black">De E-mail Expert</p>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 0.5, duration: 1.6, ease: 'easeInOut' }}
                                className="mt-4 h-3 rounded-full bg-duck-acid"
                            />
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={t > 2.4 ? { opacity: 1 } : {}}
                                className="mt-2 text-xs font-bold text-duck-acid"
                            >
                                ✓ Bijlage verstuurd. Zonder hulp.
                            </motion.p>
                        </div>
                    </motion.div>
                )}

                {phase === 1 && (
                    <motion.div
                        key="p1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative flex h-64 w-full max-w-md items-center justify-center"
                    >
                        {['+25 XP', '+90 XP', '+120 XP'].map((xp, i) => (
                            <motion.span
                                key={xp}
                                initial={{ opacity: 0, y: 60 }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    y: [-40 - i * 30, -100 - i * 40, -150 - i * 40, -190 - i * 40],
                                }}
                                transition={{ delay: 0.2 + i * 0.5, duration: 2.1, ease: 'easeOut' }}
                                className="absolute rounded-xl border-[3px] border-duck-ink bg-duck-acid px-4 py-2 font-display text-2xl font-black text-duck-ink shadow-[4px_4px_0_0_rgba(32,32,35,1)]"
                                style={{ left: `${20 + i * 28}%` }}
                            >
                                {xp}
                            </motion.span>
                        ))}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="absolute bottom-0 font-display text-xl font-black text-duck-bg/90 md:text-2xl"
                        >
                            Jayden vliegt erdoorheen.
                        </motion.p>
                    </motion.div>
                )}

                {phase === 2 && (
                    <motion.div
                        key="p2"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="flex flex-col items-center"
                    >
                        <div
                            className={`w-full max-w-sm rounded-2xl border-[3px] border-duck-bg/25 ${INK_SOFT} p-5`}
                        >
                            <p className="font-display text-xl font-black">Portfolio — Jayden</p>
                            {['Mijn eigen mini-game', 'Nepnieuws-checklist ✓'].map((n, i) => (
                                <motion.div
                                    key={n}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.45 }}
                                    className="mt-2.5 flex items-center justify-between rounded-xl border-2 border-duck-bg/25 px-4 py-2.5 text-sm"
                                >
                                    <span className="font-bold">{n}</span>
                                    <span className="rounded-full bg-duck-acid px-2 py-0.5 text-xs font-black text-duck-ink">
                                        {i === 0 ? 'EXPERT' : 'BASIS'}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4, duration: 0.6, ease: EASE }}
                            className="mt-8 text-center font-display text-2xl font-black leading-snug md:text-4xl"
                        >
                            Elk bewijsstuk levert <span className="text-duck-acid">XP</span> op.
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* -------------------- Scène 5 · De beloning (39–48s) ---------------------- */
/* Jayden geeft zijn XP uit in de avatarwinkel. De items, prijzen en zeldzaam-
 * heden hieronder staan letterlijk zo in `src/config/avatarCatalog.ts` — deze
 * winkel bestaat echt, dus de school-facing claim is gedekt.
 *
 * Het saldo loopt eerst op naar 3.750 XP. De montage ervoor toont +25/+90/+120
 * als greep uit véél meer missies ("Jayden vliegt erdoorheen"); de oplopende
 * teller maakt die sprong zichtbaar in plaats van hem stilzwijgend te maken. */

const SALDO_VOOR = 3750;
const SALDO_NA = SALDO_VOOR - 3500; // de jetpack kost 3.500 XP

/** Zeldzaamheidsranden, vertaald naar de donkere filmachtergrond. */
const RING_ZELDZAAM = 'border-duck-bg/25';
const RING_EPISCH = 'border-duck-error/60';
const RING_LEGENDARISCH = 'border-duck-acid/70';

const WINKEL_ITEMS = [
    { label: 'Koptelefoon', price: 250, ring: RING_ZELDZAAM, Icon: Headphones },
    { label: 'Skateboard', price: 500, ring: RING_EPISCH, Icon: Zap },
    { label: 'Kroon', price: 800, ring: RING_EPISCH, Icon: Crown },
    { label: 'Gouden Kroon', price: 2500, ring: RING_LEGENDARISCH, Icon: Crown },
    { label: 'Cyber Vleugels', price: 3000, ring: RING_LEGENDARISCH, Icon: Sparkles },
    { label: 'Jetpack', price: 3500, ring: RING_LEGENDARISCH, Icon: Rocket },
] as const;

/** Het item dat Jayden koopt — de laatste tegel in het raster. */
const GEKOZEN_INDEX = WINKEL_ITEMS.length - 1;

const nl = (n: number) => n.toLocaleString('nl-NL');

/**
 * Oplopend XP-getal. Draait op de eigen klok van Framer, niet op de filmklok:
 * `getFilmRenderKey` tekent bewust grof, en een teller die alleen op scène-
 * grenzen bijwerkt zou stilstaan.
 */
function XpTeller({
    from,
    to,
    duration,
    delay = 0,
}: {
    from: number;
    to: number;
    duration: number;
    delay?: number;
}) {
    const reduceMotion = usePrefersReducedMotion();
    const value = useMotionValue(reduceMotion ? to : from);
    const [shown, setShown] = useState(reduceMotion ? to : from);

    useMotionValueEvent(value, 'change', (v) => setShown(Math.round(v)));

    useEffect(() => {
        if (reduceMotion) {
            setShown(to);
            return;
        }
        value.set(from);
        setShown(from);
        const controls = animate(value, to, { duration, delay, ease: 'easeOut' });
        return () => controls.stop();
    }, [value, from, to, duration, delay, reduceMotion]);

    return <>{nl(shown)}</>;
}

/** De saldopil uit de echte winkel: trofee, "TE BESTEDEN", bedrag in XP. */
function SaldoPil({ from, to, delay = 0 }: { from: number; to: number; delay?: number }) {
    return (
        <div className="inline-flex items-center gap-3 rounded-full border-[3px] border-duck-ink bg-duck-acid px-4 py-2 text-duck-ink shadow-[4px_4px_0_0_rgba(32,32,35,1)]">
            <Trophy size={18} fill="currentColor" strokeWidth={2} />
            <span className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">Te besteden</span>
                <span className="font-display text-xl font-black md:text-2xl">
                    <XpTeller from={from} to={to} duration={1.4} delay={delay} /> XP
                </span>
            </span>
        </div>
    );
}

/* ---------------------------------------------------------------------------
 * Jayden als 3D-blokjesfiguur.
 *
 * Dezelfde voxelvorm als de 3D-avatar in de app (`AvatarViewer`), maar
 * opgebouwd uit CSS-kubussen in plaats van three.js: elk lichaamsdeel is één
 * blok met drie zichtbare vlakken — voorkant, rechterzijde en bovenkant — elk
 * in een eigen tint van dezelfde kleur. Dat scheelt de complete WebGL-bundel op
 * de homepage, waar de avatar zeven seconden in beeld is.
 *
 * Drie dingen die bewust zo staan:
 *  - Blokken en vlakken staan in DOM-volgorde van achter naar voor. Een ouder
 *    met opacity < 1 — zoals de intro van de jetpack — dwingt de browser de
 *    3D-context plat te slaan; met deze volgorde levert dat exact hetzelfde
 *    beeld op in plaats van omgeklapte vlakken.
 *  - De ademhaling staat als keyframe in `verhaal.css`, niet in framer-motion:
 *    `getFilmRenderKey` tekent deze scène maar vier keer opnieuw, dus een
 *    animatie die aan een React-render hangt zou schokken.
 *  - De jetpack zit op zijn rug, net als in de app (`AvatarViewer`, case
 *    'jetpack'): tanks erachter, schouderbanden over de borst, vlammen eronder.
 *    Een plat vooraanzicht kon dat niet en zette de tanks naast zijn armen.
 * ------------------------------------------------------------------------- */

/** Drie tinten van één kleur: de bovenkant vangt licht, de zijkant valt weg. */
function tinten(basis: string) {
    const kanalen = [1, 3, 5].map((i) => parseInt(basis.slice(i, i + 2), 16));
    const meng = (doel: number, deel: number) =>
        `#${kanalen
            .map((c) => Math.round(c + (doel - c) * deel).toString(16).padStart(2, '0'))
            .join('')}`;
    return { voor: basis, boven: meng(255, 0.2), zij: meng(0, 0.3) };
}

type Tint = ReturnType<typeof tinten>;

const HUID = tinten('#f5d0b0');
const SHIRT = tinten('#d97848');
const MOUW = tinten('#b95c31');
const BROEK = tinten('#08283b');
const HAAR = tinten('#2b2118');
const TANK = tinten('#e1ff01'); // duck-acid
const METAAL = tinten('#f2f1ec'); // duck-bg
const BAND = tinten('#202023'); // duck-ink

const VLAK = 'absolute border-[3px] border-duck-ink';

interface BlokMaat {
    /** Breedte, hoogte en diepte in px bij schaal 1. */
    b: number;
    h: number;
    d: number;
    tint: Tint;
    /** Details óp een vlak, zoals ogen op het gezicht of haar op de kruin. */
    voor?: React.ReactNode;
    boven?: React.ReactNode;
    zij?: React.ReactNode;
}

/** De drie zichtbare vlakken van één blok, gesorteerd van achter naar voor. */
function Vlakken({ b, h, d, tint, voor, boven, zij }: BlokMaat) {
    return (
        <>
            <div
                className={VLAK}
                style={{
                    width: b,
                    height: d,
                    left: 0,
                    top: (h - d) / 2,
                    background: tint.boven,
                    transform: `rotateX(90deg) translateZ(${h / 2}px)`,
                }}
            >
                {boven}
            </div>
            <div
                className={VLAK}
                style={{
                    width: d,
                    height: h,
                    left: (b - d) / 2,
                    top: 0,
                    background: tint.zij,
                    transform: `rotateY(90deg) translateZ(${b / 2}px)`,
                }}
            >
                {zij}
            </div>
            <div
                className={VLAK}
                style={{ width: b, height: h, left: 0, top: 0, background: tint.voor }}
            >
                {voor}
            </div>
        </>
    );
}

/**
 * Eén blok op zijn plek. `x` is het midden ten opzichte van de middenas, `y` de
 * bovenkant ten opzichte van de kruin, `z` het midden in de diepte (negatief =
 * naar achteren, want de kijker staat aan de positieve kant).
 */
function Blok({ x = 0, y = 0, z = 0, ...maat }: BlokMaat & { x?: number; y?: number; z?: number }) {
    return (
        <div
            className="jayden-3d absolute left-1/2 top-0"
            style={{
                width: maat.b,
                height: maat.h,
                transform: `translate3d(${x - maat.b / 2}px, ${y}px, ${z}px)`,
            }}
        >
            <Vlakken {...maat} />
        </div>
    );
}

const OOG = 'absolute h-[6px] w-[6px] bg-duck-ink';

/** Tanks, doppen en vlammen: op de rug, dus vóór de rest in de DOM. */
function Jetpack() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.45, delay: 0.35 }}
            className="jayden-3d absolute inset-0"
        >
            {[-1, 1].map((kant) => (
                <React.Fragment key={kant}>
                    <Blok b={10} h={8} d={10} x={kant * 32} y={32} z={-24} tint={METAAL} />
                    <Blok b={16} h={64} d={16} x={kant * 32} y={40} z={-24} tint={TANK} />
                    {/*
                     * De vlam schaalt vanaf zijn bovenkant. Framer zet dat als
                     * `translate3d(...) scaleY(...)`: eerst schalen, dan
                     * verplaatsen, zodat de vlam op zijn plek blijft staan.
                     */}
                    <motion.div
                        className="jayden-3d absolute left-1/2 top-0 origin-top"
                        style={{ width: 10, height: 20 }}
                        initial={{ x: kant * 32 - 5, y: 104, z: -24, scaleY: 0 }}
                        animate={{ x: kant * 32 - 5, y: 104, z: -24, scaleY: [0, 1, 0.72, 1] }}
                        transition={{ duration: 0.8, delay: 0.85 + (kant + 1) * 0.05 }}
                    >
                        <Vlakken b={10} h={20} d={10} tint={METAAL} />
                    </motion.div>
                </React.Fragment>
            ))}
        </motion.div>
    );
}

function JaydenAvatar({ jetpack }: { jetpack: boolean }) {
    return (
        <div className="scale-90 md:scale-125" aria-hidden="true">
            <div className="jayden-scene relative h-[162px] w-[104px]">
                <div className="jayden-stage absolute inset-0">
                    {jetpack && <Jetpack />}

                    {/* De achterste arm eerst: zie de DOM-volgorde hierboven. */}
                    <Blok b={16} h={56} d={22} x={-29} y={53} tint={MOUW} />
                    <Blok b={20} h={48} d={22} x={-8.5} y={114} tint={BROEK} />
                    <Blok b={20} h={48} d={22} x={8.5} y={114} tint={BROEK} />
                    <Blok b={48} h={64} d={26} x={0} y={53} tint={SHIRT} />

                    {/* Schouderbanden: lopen over de borst naar de tanks achter hem. */}
                    {jetpack &&
                        [-1, 1].map((kant) => (
                            <Blok key={kant} b={8} h={18} d={44} x={kant * 13} y={58} tint={BAND} />
                        ))}

                    <Blok
                        b={56}
                        h={56}
                        d={56}
                        x={0}
                        y={0}
                        tint={HUID}
                        boven={<span className="absolute inset-0" style={{ background: HAAR.boven }} />}
                        zij={
                            <span
                                className="absolute inset-x-0 top-0 h-[14px]"
                                style={{ background: HAAR.zij }}
                            />
                        }
                        voor={
                            <>
                                <span
                                    className="absolute inset-x-0 top-0 h-[14px]"
                                    style={{ background: HAAR.voor }}
                                />
                                <span className={OOG} style={{ left: 11, top: 22 }} />
                                <span className={OOG} style={{ right: 11, top: 22 }} />
                                <span className="absolute bottom-[9px] left-1/2 h-[4px] w-4 -translate-x-1/2 bg-duck-ink/70" />
                            </>
                        }
                    />

                    <Blok b={16} h={56} d={22} x={29} y={53} tint={MOUW} />
                </div>
            </div>
        </div>
    );
}

export function SceneBeloning({ t }: { t: number }) {
    const phase = t < 2.8 ? 0 : t < 6.2 ? 1 : 2;
    const gekozen = t > 3.6;
    const gekocht = t > 5.4;

    return (
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-duck-bg">
            <AnimatePresence mode="wait">
                {phase === 0 && (
                    <motion.div
                        key="p0"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="flex flex-col items-center"
                    >
                        <SaldoPil from={0} to={SALDO_VOOR} delay={0.2} />
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6, duration: 0.6, ease: EASE }}
                            className="mt-8 max-w-md text-center font-display text-2xl font-black leading-snug md:text-4xl"
                        >
                            Missie na missie. <span className="text-duck-acid">XP stapelt op.</span>
                        </motion.p>
                    </motion.div>
                )}

                {phase === 1 && (
                    <motion.div
                        key="p1"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="flex w-full max-w-sm flex-col items-center"
                    >
                        <div className={`w-full rounded-2xl border-[3px] border-duck-bg/25 ${INK_SOFT} p-5`}>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-duck-bg/50">
                                Winkel · Accessoires
                            </p>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {WINKEL_ITEMS.map((item, i) => {
                                    const isGekozen = gekozen && i === GEKOZEN_INDEX;
                                    return (
                                        <motion.div
                                            key={item.label}
                                            animate={{
                                                scale: isGekozen ? 1.06 : 1,
                                                opacity: gekozen && !isGekozen ? 0.3 : 1,
                                            }}
                                            transition={{ duration: 0.35, ease: EASE }}
                                            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-1.5 py-3 text-center ${
                                                isGekozen ? 'border-duck-acid bg-duck-acid/10' : item.ring
                                            }`}
                                        >
                                            <item.Icon
                                                size={20}
                                                strokeWidth={2.5}
                                                className={isGekozen ? 'text-duck-acid' : 'text-duck-bg/70'}
                                            />
                                            <span className="text-[9px] font-black uppercase leading-tight tracking-wider text-duck-bg/80">
                                                {item.label}
                                            </span>
                                            <span
                                                className={`text-[10px] font-black ${
                                                    isGekozen ? 'text-duck-acid' : 'text-duck-bg/60'
                                                }`}
                                            >
                                                {nl(item.price)} XP
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={gekozen ? { opacity: 1, y: 0, scale: gekocht ? 0.94 : 1 } : {}}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="mt-5 inline-flex items-center gap-2 rounded-full border-[3px] border-duck-ink bg-duck-acid px-6 py-2.5 font-display text-lg font-black text-duck-ink shadow-[4px_4px_0_0_rgba(32,32,35,1)]"
                        >
                            <ShoppingBag size={18} strokeWidth={2.5} />
                            {gekocht ? 'Gekocht!' : 'Kopen · 3.500 XP'}
                        </motion.div>
                    </motion.div>
                )}

                {phase === 2 && (
                    <motion.div
                        key="p2"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="flex flex-col items-center"
                    >
                        <JaydenAvatar jetpack />
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
                            /* md:mt-12 vangt op dat `scale-125` de avatar visueel laat
                               uitlopen zonder dat zijn layoutvak meegroeit. */
                            className="mt-6 md:mt-12"
                        >
                            <SaldoPil from={SALDO_VOOR} to={SALDO_NA} delay={1.1} />
                        </motion.div>
                        {/*
                         * Bewust aan de mount gehangen en niet aan `t`: bij
                         * prefers-reduced-motion bevriest Film.tsx de film op 47s,
                         * en dat is 7,0s in deze scène. Een drempel daarboven zou
                         * de clou juist voor die bezoekers onzichtbaar maken.
                         */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.9, duration: 0.6, ease: EASE }}
                            className="mt-7 text-center font-display text-2xl font-black leading-snug md:text-4xl"
                        >
                            Van basis… <span className="text-duck-acid">naar bouwer.</span>
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
