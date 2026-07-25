import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Duck, INK_SOFT, HARD_SHADOW } from '../components/storyBrand';
import { MinecraftLift, VideoEditIcon } from './MinecraftLift';

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
                        from={0.8}
                        text="“Jayden kan geen bestand bijvoegen in een e-mail.”"
                        speed={38}
                    />
                </p>
                <p className="font-display text-2xl font-black leading-snug text-duck-bg/70 md:text-4xl">
                    <Typed t={t} from={2.8} text="“Herkent geen nepnieuws als het hem bijt.”" speed={38} />
                </p>
                <p className="font-display text-2xl font-black leading-snug text-duck-bg/50 md:text-4xl">
                    <Typed t={t} from={4.6} text="“Vraagt hoe je een pdf opslaat.”" speed={38} />
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
                            Van basis… <span className="text-duck-acid">naar bouwer.</span>
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
