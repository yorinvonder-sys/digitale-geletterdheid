import React from 'react';
import { motion } from 'framer-motion';
import { Eyes, Pill, HARD_SHADOW } from '../components/storyBrand';
import { VERHAAL_STATS } from '../verhaalStats';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Decoratieve zijkaartjes: een korte missiekaart, XP en de streak van Mila.
 *
 * Ze verschijnen pas vanaf `xl` en staan buiten de tekstkolom (max-w-4xl,
 * gecentreerd), zodat ze nooit over de kop of de lopende tekst vallen.
 */
function ZwevendeProps() {
    return (
        <div aria-hidden="true">
            <motion.div
                initial={{ opacity: 0, y: 30, rotate: -8 }}
                animate={{ opacity: 1, y: 0, rotate: -8 }}
                transition={{ delay: 1.1, duration: 0.7, ease: EASE }}
                className={`absolute left-[4%] top-[31%] hidden w-32 rounded-xl border-[3px] border-duck-ink bg-white p-2 ${HARD_SHADOW} xl:block`}
            >
                <p className="text-[10px] font-bold uppercase tracking-widest text-duck-ink/50">
                    MILA · MISSIE 01
                </p>
                <div className="mt-1.5 space-y-1">
                    {['Startklaar', '1 van 93 missies', 'Bewijs verzamelen'].map((r) => (
                        <p key={r} className="rounded bg-duck-ink/5 px-1.5 py-0.5 text-[9px] text-duck-ink/50">
                            {r}
                        </p>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -20, rotate: 6 }}
                animate={{ opacity: 1, y: 0, rotate: 6 }}
                transition={{ delay: 1.3, duration: 0.7, ease: EASE }}
                className={`absolute right-[2%] top-[24%] hidden rounded-xl border-[3px] border-duck-ink bg-duck-acid px-4 py-3 ${HARD_SHADOW} xl:block`}
            >
                <p className="font-display text-2xl font-black">+25 XP</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Sterke prompt</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20, rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: -4 }}
                transition={{ delay: 1.5, duration: 0.7, ease: EASE }}
                className="absolute bottom-[18%] right-[3%] hidden rounded-full border-[3px] border-duck-ink bg-white px-4 py-2 shadow-[5px_5px_0_0_rgba(32,32,35,1)] xl:block"
            >
                <p className="text-xs font-bold">🔥 12 dagen streak</p>
            </motion.div>
        </div>
    );
}

export function Proloog() {
    return (
        <section
            id="proloog"
            className="relative flex min-h-[100svh] scroll-mt-24 flex-col items-center justify-center overflow-hidden bg-duck-bg px-6 text-center grain"
        >
            <ZwevendeProps />

            <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
                className="relative z-10 mb-8"
            >
                <Eyes size={64} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
                className="relative z-10"
            >
                <Pill filled>Digitale geletterdheid voor VO &amp; VSO</Pill>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7, ease: EASE }}
                className="relative z-10 mt-8 max-w-4xl font-display text-5xl font-black leading-[0.98] tracking-tight md:text-7xl lg:text-8xl"
            >
                Dit is het verhaal van een les die{' '}
                <span className="relative inline-block">
                    <span className="relative z-10 inline-block px-1">wél</span>
                    <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.4, duration: 0.5, ease: EASE }}
                        className="absolute inset-x-0 bottom-0 z-0 h-[0.52em] origin-left bg-duck-acid"
                        aria-hidden="true"
                    />
                </span>{' '}
                werkt.
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.6, ease: EASE }}
                className="relative z-10 mt-8 max-w-xl text-lg leading-relaxed text-duck-ink/70 md:text-xl"
            >
                Met in de hoofdrol: <strong className="text-duck-ink">Mila</strong>, leerling.{' '}
                <strong className="text-duck-ink">Haar docent</strong>, {VERHAAL_STATS.missies}{' '}
                kant-en-klare missies — en eindelijk een les die blijft hangen.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.6, ease: EASE }}
                className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
            >
                <a
                    href="#probleem"
                    className="min-h-[44px] rounded-full border-[3px] border-duck-ink bg-duck-ink px-8 py-4 font-bold text-duck-acid shadow-[6px_6px_0_0_rgba(32,32,35,0.3)] transition-transform hover:-translate-y-0.5"
                >
                    Begin het verhaal ↓
                </a>
                <a
                    href="#epiloog"
                    className={`min-h-[44px] rounded-full border-[3px] border-duck-ink bg-duck-acid px-8 py-4 font-bold text-duck-ink ${HARD_SHADOW} transition-transform hover:-translate-y-0.5`}
                >
                    Plan schoolpilot →
                </a>
            </motion.div>

        </section>
    );
}
