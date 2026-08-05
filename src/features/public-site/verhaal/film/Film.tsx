import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SceneFrustratie, SceneRaadsel, SceneAntwoord, SceneBewijs, SceneBeloning } from './scenes';
import { Leader } from './Leader';
import {
    getFilmRenderKey,
    LEADER_DURATION,
    FRUSTRATION_DURATION,
    PUZZLE_DURATION,
    ANSWER_DURATION,
    PROOF_DURATION,
    REWARD_DURATION,
} from './timeline';

interface Scene {
    id: string;
    label: string;
    /** Duur in seconden. */
    dur: number;
    /** Achtergrondklasse; bepaalt ook de contrastkleur van de bediening. */
    bg: string;
    light: boolean;
    Comp: React.ComponentType<{ t: number }>;
}

// De duren komen uit timeline.ts, dat ze ook gebruikt om te bepalen wanneer
// React nieuwe scène-inhoud moet tekenen. Één bron, dus die twee kunnen niet
// uit elkaar lopen.
const SCENES: Scene[] = [
    { id: 'leader', label: 'Leader', dur: LEADER_DURATION, bg: 'bg-[#3a3a38]', light: false, Comp: Leader },
    { id: 'frustratie', label: 'De frustratie', dur: FRUSTRATION_DURATION, bg: 'bg-duck-ink', light: false, Comp: SceneFrustratie },
    { id: 'raadsel', label: 'Het raadsel', dur: PUZZLE_DURATION, bg: 'bg-duck-acid', light: true, Comp: SceneRaadsel },
    { id: 'antwoord', label: 'Het antwoord', dur: ANSWER_DURATION, bg: 'bg-duck-ink', light: false, Comp: SceneAntwoord },
    { id: 'bewijs', label: 'Het bewijs', dur: PROOF_DURATION, bg: 'bg-duck-ink', light: false, Comp: SceneBewijs },
    { id: 'beloning', label: 'De beloning', dur: REWARD_DURATION, bg: 'bg-duck-ink', light: false, Comp: SceneBeloning },
];

/** Totale speelduur: 49 seconden. */
export const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);

export const FILM_SEEN_KEY = 'dgskills-film-seen';

export function markFilmSeen() {
    try {
        localStorage.setItem(FILM_SEEN_KEY, '1');
    } catch {
        /* private mode — dan blijft de film gewoon zichtbaar */
    }
}

export function hasSeenFilm(): boolean {
    try {
        return localStorage.getItem(FILM_SEEN_KEY) === '1';
    } catch {
        return false;
    }
}

/**
 * De korte film over Jayden (49 sec), gedreven door een requestAnimationFrame-
 * klok in plaats van video. Bediening: pauze, overslaan, scènestippen, opnieuw
 * afspelen en een voortgangsbalk.
 *
 * Afwijkingen t.o.v. de blueprint, bewust toegevoegd:
 *  - `prefers-reduced-motion`: geen autoplay, de film start pas op verzoek.
 *  - De klok loopt alleen als de film in beeld is én het tabblad actief is.
 *  - Hervatten na pauze telt de pauzetijd niet mee.
 */
export function Film({ onFinish }: { onFinish?: () => void }) {
    const reduceMotion = usePrefersReducedMotion();

    const [elapsed, setElapsed] = useState(0);
    const [done, setDone] = useState(false);
    const [paused, setPaused] = useState(false);
    /*
     * Twee onafhankelijke voorwaarden, bewust in twee states.
     *
     * Eén gedeelde `visible`-state werkte niet: de IntersectionObserver en de
     * visibilitychange-handler overschreven elkaar ("last writer wins"). Terug-
     * keren naar het tabblad zette de klok dan weer aan terwijl de film buiten
     * beeld stond — de observer vuurt namelijk niet opnieuw, want de intersectie
     * veranderde niet. De film speelde ongezien uit en markeerde zichzelf als
     * gezien, zodat hoofdstuk nul nooit meer verscheen.
     */
    const [inViewport, setInViewport] = useState(false);
    const [documentVisible, setDocumentVisible] = useState(
        () => (typeof document === 'undefined' ? true : !document.hidden),
    );
    /** Bij reduced motion pas spelen nadat de bezoeker er zelf om vraagt. */
    const [armed, setArmed] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const rafId = useRef<number | undefined>(undefined);
    const startedAt = useRef<number>(0);
    const elapsedRef = useRef(0);
    const renderKeyRef = useRef(getFilmRenderKey(0));
    const progressPercentRef = useRef(0);
    const finished = useRef(false);

    const syncProgress = useCallback((nextElapsed: number) => {
        const progress = Math.min(1, Math.max(0, nextElapsed / TOTAL));
        if (progressFillRef.current) {
            progressFillRef.current.style.transform = `scaleX(${progress})`;
        }

        const roundedPercent = Math.round(progress * 100);
        if (roundedPercent !== progressPercentRef.current) {
            progressPercentRef.current = roundedPercent;
            progressBarRef.current?.setAttribute('aria-valuenow', String(roundedPercent));
        }
    }, []);

    // Beperkte beweging: niet automatisch spelen. We tonen de slotscène als
    // stilstaand beeld — dat is de clou van de film — met een startknop erbij.
    useEffect(() => {
        if (!reduceMotion) return;
        setArmed(false);
        const payoff = SCENES.slice(0, SCENES.length - 1).reduce((a, s) => a + s.dur, 0) + 7;
        elapsedRef.current = payoff;
        renderKeyRef.current = getFilmRenderKey(payoff);
        syncProgress(payoff);
        setElapsed(payoff);
    }, [reduceMotion, syncProgress]);

    const markDone = useCallback(() => {
        if (finished.current) return;
        finished.current = true;
        markFilmSeen();
        setDone(true);
        onFinish?.();
    }, [onFinish]);

    const jumpTo = useCallback(
        (target: number) => {
            const clamped = Math.min(TOTAL, Math.max(0, target));
            elapsedRef.current = clamped;
            renderKeyRef.current = getFilmRenderKey(clamped);
            startedAt.current = performance.now() - clamped * 1000;
            syncProgress(clamped);
            setElapsed(clamped);
            if (clamped >= TOTAL) markDone();
            else setDone(false);
        },
        [markDone, syncProgress],
    );

    // Pauzeer wanneer de film buiten beeld is: geen rAF-loop voor niets.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setInViewport(entry.isIntersecting),
            { threshold: 0.25 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Pauzeer wanneer het tabblad naar de achtergrond gaat.
    useEffect(() => {
        const onVisibility = () => setDocumentVisible(!document.hidden);
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, []);

    /** De film speelt alleen als hij én in beeld is én het tabblad actief is. */
    const canPlay = inViewport && documentVisible;

    // De klok.
    useEffect(() => {
        if (paused || done || !canPlay || !armed) return;
        let cancelled = false;

        // Hervat exact waar we gebleven waren — pauzetijd telt niet mee.
        startedAt.current = performance.now() - elapsedRef.current * 1000;

        const tick = (now: number) => {
            if (cancelled) return;
            rafId.current = undefined;

            const t = (now - startedAt.current) / 1000;
            if (t >= TOTAL) {
                elapsedRef.current = TOTAL;
                renderKeyRef.current = getFilmRenderKey(TOTAL);
                syncProgress(TOTAL);
                setElapsed(TOTAL);
                markDone();
                return;
            }

            elapsedRef.current = t;
            syncProgress(t);

            const nextRenderKey = getFilmRenderKey(t);
            if (nextRenderKey !== renderKeyRef.current) {
                renderKeyRef.current = nextRenderKey;
                setElapsed(t);
            }

            if (!cancelled) rafId.current = requestAnimationFrame(tick);
        };

        rafId.current = requestAnimationFrame(tick);
        return () => {
            cancelled = true;
            if (rafId.current !== undefined) {
                cancelAnimationFrame(rafId.current);
                rafId.current = undefined;
            }
        };
    }, [paused, done, canPlay, armed, markDone, syncProgress]);

    // Welke scène hoort bij de huidige tijd?
    let acc = 0;
    let idx = 0;
    for (let i = 0; i < SCENES.length; i++) {
        if (elapsed < acc + SCENES[i].dur) {
            idx = i;
            break;
        }
        acc += SCENES[i].dur;
        idx = i;
    }
    const activeIdx = done ? SCENES.length - 1 : idx;
    const scene = SCENES[activeIdx];
    const sceneStart = SCENES.slice(0, activeIdx).reduce((a, s) => a + s.dur, 0);
    const localT = Math.min(scene.dur, Math.max(0, elapsed - sceneStart));

    const sceneStartOf = (i: number) => SCENES.slice(0, i).reduce((a, s) => a + s.dur, 0);

    const skip = () => {
        setArmed(true);
        // Wie bewust overslaat, wil de film niet bij het volgende bezoek opnieuw
        // zien — ook niet als hij wegscrollt vóór de slotscène is uitgespeeld.
        markFilmSeen();
        jumpTo(TOTAL - SCENES[SCENES.length - 1].dur + 0.01);
    };

    const replay = () => {
        finished.current = false;
        setDone(false);
        setPaused(false);
        setArmed(true);
        jumpTo(0);
    };

    /** Vanaf het stilstaande beeld: speel de film alsnog vanaf het begin. */
    const startFromBeginning = () => {
        finished.current = false;
        setDone(false);
        setPaused(false);
        setArmed(true);
        jumpTo(0);
    };

    // Contrastafhankelijke knopstijlen: op het acid-vlak is ink leesbaar,
    // op de donkere vlakken juist paper.
    const controlClass = scene.light
        ? 'border-duck-ink text-duck-ink hover:bg-duck-ink hover:text-duck-acid'
        : 'border-duck-bg/40 text-duck-bg hover:bg-duck-bg hover:text-duck-ink';

    return (
        <div
            ref={containerRef}
            className={`relative h-[100svh] overflow-hidden transition-colors duration-700 ${scene.bg} grain`}
            role="region"
            aria-label="Korte film over Jayden"
        >
            {/* bovenbalk */}
            <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 px-5 py-4 md:px-10">
                <span
                    className={`text-xs font-black uppercase tracking-[0.25em] ${
                        scene.light ? 'text-duck-ink/60' : 'text-duck-bg/50'
                    }`}
                >
                    DGSkills · een korte film
                </span>

                <div className="flex items-center gap-2">
                    {!done && (
                        <>
                            <button
                                type="button"
                                onClick={() => (armed ? setPaused((v) => !v) : startFromBeginning())}
                                className={`min-h-[44px] rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-colors ${controlClass}`}
                            >
                                {!armed ? 'Speel de film af' : paused ? 'Verder' : 'Pauze'}
                            </button>
                            <button
                                type="button"
                                onClick={skip}
                                className={`min-h-[44px] rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-colors ${controlClass}`}
                            >
                                Sla over
                            </button>
                        </>
                    )}
                    {done && (
                        <button
                            type="button"
                            onClick={replay}
                            className={`min-h-[44px] rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-colors ${controlClass}`}
                        >
                            Opnieuw afspelen
                        </button>
                    )}
                </div>
            </div>

            {/* de scène zelf */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={scene.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0"
                >
                    <scene.Comp t={localT} />
                </motion.div>
            </AnimatePresence>

            {/* onderaan: scènestippen + voortgang */}
            <div className="absolute inset-x-0 bottom-0 z-30 px-5 pb-5 md:px-10">
                <div className="mb-3 flex items-center justify-center gap-2">
                    {SCENES.map((s, i) => {
                        const isActive = !done && i === activeIdx;
                        const passed = done || i < activeIdx;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                    setArmed(true);
                                    jumpTo(sceneStartOf(i) + 0.01);
                                }}
                                aria-label={`Ga naar scène ${i + 1}: ${s.label}`}
                                aria-current={isActive ? 'true' : undefined}
                                className="flex h-11 items-center px-1"
                            >
                                <span
                                    className={`block h-2 rounded-full border transition-all duration-300 ${
                                        scene.light ? 'border-duck-ink' : 'border-duck-bg/60'
                                    } ${
                                        isActive
                                            ? `w-10 ${scene.light ? 'bg-duck-ink' : 'bg-duck-acid'}`
                                            : passed
                                                ? `w-2 ${scene.light ? 'bg-duck-ink/60' : 'bg-duck-bg/60'}`
                                                : 'w-2 bg-transparent'
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>
                <div
                    ref={progressBarRef}
                    className={`h-1 w-full overflow-hidden rounded-full ${
                        scene.light ? 'bg-duck-ink/15' : 'bg-duck-bg/15'
                    }`}
                    role="progressbar"
                    aria-label="Voortgang van de film"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round((elapsed / TOTAL) * 100)}
                >
                    <div
                        ref={progressFillRef}
                        className={`h-full origin-left transform-gpu ${
                            scene.light ? 'bg-duck-ink' : 'bg-duck-acid'
                        }`}
                        style={{ transform: `scaleX(${Math.min(1, elapsed / TOTAL)})` }}
                    />
                </div>
            </div>
        </div>
    );
}
