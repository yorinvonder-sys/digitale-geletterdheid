import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useTutorial } from '@/contexts/TutorialContext';
import { pickVisibleIndex } from '@/features/onboarding/core/visibleTarget';
import { computeTooltipStyle } from '@/features/onboarding/core/placement';

interface SpotlightRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

const PADDING = 10;
const TOOLTIP_MAX_WIDTH = 320;
/** Startschatting; wordt na de eerste render vervangen door de echte afmeting. */
const TOOLTIP_SIZE_ESTIMATE = { width: TOOLTIP_MAX_WIDTH, height: 200 };

/**
 * Zoekt het element dat de gebruiker daadwerkelijk ziet.
 *
 * Dezelfde `data-tutorial`-sleutel staat vaak twee keer in de DOM: mobiele en
 * desktopvariant van dezelfde knop. `querySelector` pakt de eerste, ook als die
 * door `display:none` verborgen is — dat leverde een spotlight van 0×0 in de
 * hoek op. Zie src/features/onboarding/core/visibleTarget.ts.
 */
const findVisibleTarget = (selector: string): HTMLElement | null => {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (candidates.length === 0) return null;
    const index = pickVisibleIndex(candidates.map((el) => el.getBoundingClientRect()));
    return index === -1 ? null : candidates[index];
};

const TutorialSpotlight: React.FC = () => {
    const {
        isActive,
        currentStep,
        currentStepIndex,
        steps,
        nextStep,
        prevStep,
        skipTutorial,
        completeStep,
        isBlocked,
    } = useTutorial();

    const [rect, setRect] = useState<SpotlightRect | null>(null);
    const [targetNotFound, setTargetNotFound] = useState(false);
    /** Het element waar deze stap over gaat — gedeeld met de klik-doorvoer. */
    const targetElRef = useRef<HTMLElement | null>(null);
    /**
     * De echte afmeting van de ballon. Een vaste schatting volstaat niet: de
     * teksten verschillen per stap, en met een te grote schatting schuift de
     * ballon onnodig weg van zijn element.
     */
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [tooltipSize, setTooltipSize] = useState(TOOLTIP_SIZE_ESTIMATE);

    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;

    // Reset targetNotFound when step changes
    useEffect(() => {
        setTargetNotFound(false);
    }, [currentStepIndex]);

    // Meet de ballon nadat hij gerenderd is en herplaats hem met de echte maat.
    useLayoutEffect(() => {
        const el = tooltipRef.current;
        if (!el) return;
        const { width, height } = el.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        setTooltipSize((vorige) => (
            Math.abs(vorige.width - width) < 1 && Math.abs(vorige.height - height) < 1
                ? vorige
                : { width, height }
        ));
    }, [currentStepIndex, rect, isActive]);

    // Track target element position
    useEffect(() => {
        // Zolang een modal het scherm bezit meten we niets: het doel kan
        // eronder verdwenen zijn en de spotlight is toch verborgen.
        if (!isActive || !currentStep || isBlocked) return;

        if (!currentStep.target) {
            targetElRef.current = null;
            setRect(null);
            return;
        }

        let clickCleanup: (() => void) | null = null;
        let retryTimer: number | null = null;
        let hasScrolled = false;
        let rafId: number | null = null;

        const attachClick = (el: Element) => {
            if (!currentStep.requireClick || clickCleanup) return;
            const handler = () => completeStep();
            el.addEventListener('click', handler, { once: true });
            clickCleanup = () => el.removeEventListener('click', handler);
        };

        const measure = () => {
            const el = findVisibleTarget(currentStep.target!);
            if (!el) {
                targetElRef.current = null;
                setRect(null);
                return false;
            }
            targetElRef.current = el;
            if (!hasScrolled) {
                hasScrolled = true;
                const r = el.getBoundingClientRect();
                const elHeight = r.height;
                // Large elements (taller than 60% of viewport): scroll to top edge
                // Small elements: center them
                const block: ScrollLogicalPosition = elHeight > window.innerHeight * 0.6 ? 'start' : 'center';
                el.scrollIntoView({ behavior: 'smooth', block });
                // Wait for smooth scroll to finish before measuring
                window.setTimeout(() => measure(), 400);
                return true; // Return true to stop retries — we'll re-measure after scroll
            }
            const r = el.getBoundingClientRect();
            // For large elements, clamp the spotlight to the visible portion of the viewport
            const visibleTop = Math.max(r.top, 0);
            const visibleBottom = Math.min(r.bottom, window.innerHeight);
            const visibleHeight = Math.max(visibleBottom - visibleTop, 60); // min 60px spotlight
            setRect({
                top: visibleTop - PADDING,
                left: r.left - PADDING,
                width: r.width + PADDING * 2,
                height: visibleHeight + PADDING * 2,
            });
            attachClick(el);
            return true;
        };

        // Initial attempt + retries with targetNotFound fallback
        if (!measure()) {
            let retries = 0;
            const retry = () => {
                if (measure()) return;
                if (retries > 20) {
                    setTargetNotFound(true);
                    return;
                }
                retries++;
                retryTimer = window.setTimeout(retry, 150);
            };
            retry();
        }

        // Keep position in sync on scroll/resize
        const onLayout = () => {
            rafId = requestAnimationFrame(() => measure());
        };
        window.addEventListener('scroll', onLayout, true);
        window.addEventListener('resize', onLayout);

        return () => {
            if (retryTimer) clearTimeout(retryTimer);
            if (rafId) cancelAnimationFrame(rafId);
            clickCleanup?.();
            window.removeEventListener('scroll', onLayout, true);
            window.removeEventListener('resize', onLayout);
        };
    }, [isActive, currentStep, completeStep, isBlocked]);

    /**
     * Doel blijft weg: ga door in plaats van vastlopen.
     *
     * De oude foutmelding ("target not found") stond in beeld bij een
     * dertienjarige die er niets mee kon. Een ontbrekend doel is een fout in de
     * staplijst, niet iets waar de gebruiker op moet wachten — de waarschuwing
     * hoort in de console en in de dekkingstest, niet op het scherm.
     */
    useEffect(() => {
        if (!targetNotFound || !isActive || isBlocked) return;
        console.warn(`[rondleiding] doel ontbreekt voor stap "${currentStep?.id}" — stap overgeslagen`);
        const timer = window.setTimeout(() => nextStep(), 600);
        return () => clearTimeout(timer);
    }, [targetNotFound, isActive, isBlocked, currentStep?.id, nextStep]);

    // Compute tooltip position relative to spotlight rect
    const isFullscreen = !currentStep?.target;

    const getTooltipStyle = useCallback((): React.CSSProperties => {
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const base: React.CSSProperties = { position: 'absolute', maxWidth: TOOLTIP_MAX_WIDTH };

        // Schermvullende stap: precies in het midden, zonder transform (framer-motion
        // schrijft die eigenschap zelf en zou hem overschrijven).
        if (!rect) {
            return {
                ...base,
                left: Math.max(0, (viewport.width - tooltipSize.width) / 2),
                top: Math.max(0, (viewport.height - tooltipSize.height) / 2),
            };
        }

        return {
            ...base,
            ...computeTooltipStyle(rect, currentStep?.position ?? 'bottom', viewport, tooltipSize),
        };
    }, [rect, currentStep?.position, tooltipSize]);

    // Verbergen zolang een modal het scherm bezit; de stap blijft bewaard en de
    // rondleiding gaat verder zodra de modal dicht is.
    if (!isActive || !currentStep || isBlocked) return null;

    /** Deze stap wil dat de gebruiker het element zelf aanklikt. */
    const needsClick = currentStep.requireClick === true && rect !== null && !targetNotFound;

    return (
        <AnimatePresence>
            <motion.div
                key="tutorial-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999]"
                style={{ pointerEvents: 'none' }}
            >
                {/* Semi-transparent backdrop with spotlight cutout */}
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }} onClick={(e) => { e.stopPropagation(); }}>
                    <defs>
                        <mask id="tut-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            {rect && (
                                <rect
                                    x={rect.left}
                                    y={rect.top}
                                    width={rect.width}
                                    height={rect.height}
                                    rx="10"
                                    fill="black"
                                />
                            )}
                        </mask>
                    </defs>
                    <rect
                        x="0" y="0" width="100%" height="100%"
                        fill="rgba(26, 26, 25, 0.6)"
                        mask="url(#tut-mask)"
                    />
                </svg>

                {/* Make the spotlight hole clickable (pass-through) */}
                {rect && (
                    <div
                        className="absolute"
                        style={{
                            top: rect.top,
                            left: rect.left,
                            width: rect.width,
                            height: rect.height,
                            pointerEvents: 'auto',
                            borderRadius: 10,
                            boxShadow: '0 0 0 3px rgba(217, 120, 72,0.5), 0 0 20px 4px rgba(217, 120, 72,0.15)',
                        }}
                        onClick={() => {
                            // Klik doorgeven aan het element dat we ook opgemeten hebben,
                            // niet aan de eerste treffer in de DOM (die verborgen kan zijn).
                            targetElRef.current?.click();
                        }}
                    />
                )}

                {/* Tooltip */}
                <motion.div
                    key={currentStep.id}
                    ref={tooltipRef}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    style={{ ...getTooltipStyle(), pointerEvents: 'auto' }}
                    className="rounded-2xl shadow-2xl overflow-hidden bg-duck-bgLight border border-duck-ink/15"
                >
                    {/* Step counter bar */}
                    <div className="flex h-1">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 transition-colors duration-300 ${i <= currentStepIndex ? 'bg-duck-acid' : 'bg-duck-gray'}`}
                            />
                        ))}
                    </div>

                    {/* Fullscreen intro: brand mascot centered above content */}
                    {isFullscreen && (
                        <div className="flex justify-center pt-4 pb-1">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-duck-bg">
                                    <motion.img
                                        src="/assets/brand/dgskills-duck-guide-v3.png"
                                    alt=""
                                    className="w-12 h-12 object-contain"
                                    aria-hidden="true"
                                    animate={{ y: [0, -3, 0], rotate: [0, 2, -2, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>
                        </div>
                    )}

                    <div className={`px-4 py-3 ${isFullscreen ? 'pt-1' : ''} flex items-start gap-3`}>
                        {/* Brand mascot: inline guide for targeted steps */}
                        {!isFullscreen && (
                            <div className="shrink-0 mt-0.5">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-duck-bg">
                                    <motion.img
                                        src="/assets/brand/dgskills-duck-guide-v3.png"
                                        alt=""
                                        className="w-8 h-8 object-contain"
                                        aria-hidden="true"
                                        animate={{ y: [0, -2, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className={`flex-1 min-w-0 ${isFullscreen ? 'text-center' : ''}`}>
                            {/* Title + skip */}
                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h3 className="text-sm font-bold leading-tight text-duck-ink" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{currentStep.title}</h3>
                                <button
                                    onClick={skipTutorial}
                                    className="shrink-0 p-1 rounded transition-colors text-duck-ink/60"
                                    title="Tutorial overslaan"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Description */}
                            <p className="text-xs leading-relaxed mb-3 text-duck-ink/60">{currentStep.content}</p>

                            {/* Required click hint */}
                            {needsClick && (
                                <p className="text-[11px] font-semibold mb-3 flex items-center gap-1.5 text-duck-ink">
                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-duck-acid" />
                                    Klik op het uitgelichte element
                                </p>
                            )}

                            {/* Navigation */}
                            <div className={`flex items-center ${isFullscreen ? 'justify-center gap-3' : 'justify-between'}`}>
                                <span className="text-[10px] font-medium text-duck-ink/60">
                                    {currentStepIndex + 1}/{steps.length}
                                </span>
                                <div className="flex items-center gap-1">
                                    {!isFirstStep && (
                                        <button
                                            onClick={prevStep}
                                            className="p-1.5 rounded-lg transition-colors text-duck-ink/60"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                    )}
                                    {/*
                                      * De doorknop is er altijd. Hij was verborgen bij
                                      * `requireClick`-stappen, waardoor iemand die de klik
                                      * miste — of alleen een toetsenbord gebruikt — alleen
                                      * nog kon afbreken. Bij zo'n stap klikt de knop het
                                      * uitgelichte element namens de gebruiker aan.
                                      */}
                                    <button
                                        onClick={() => {
                                            if (needsClick) {
                                                targetElRef.current?.click();
                                                return;
                                            }
                                            if (isLastStep) skipTutorial();
                                            else nextStep();
                                        }}
                                        className="flex items-center gap-1 px-3 py-1.5 text-duck-ink text-xs font-semibold rounded-full transition-all duration-300 bg-duck-acid"
                                    >
                                        {needsClick ? 'Doe het' : isLastStep ? 'Klaar' : 'Volgende'}
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Small button to restart tutorial (unchanged)
export const TutorialRestartButton: React.FC = () => {
    const { startTutorial, hasCompleted } = useTutorial();
    if (!hasCompleted) return null;

    return (
        <button
            onClick={startTutorial}
            className="fixed bottom-24 lg:bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 z-40 bg-duck-bgLight border border-duck-ink/15 text-duck-ink/60"
            title="Tutorial Herhalen"
        >
            <span className="text-sm">?</span>
        </button>
    );
};

export default TutorialSpotlight;
