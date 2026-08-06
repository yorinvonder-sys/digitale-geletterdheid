import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useTutorial, resolveTutorialTarget } from '@/contexts/TutorialContext';

interface SpotlightRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

const PADDING = 10;
const TOOLTIP_GAP = 12;
/** ~1,2s vangnet. Daarna verschijnt de "Volgende"-knop als uitweg. */
const MAX_MEASURE_RETRIES = 8;
/** Halve tooltipbreedte (maxWidth 320) — nodig om hem binnen beeld te klemmen. */
const TOOLTIP_HALF_WIDTH = 160;

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
    } = useTutorial();

    const [rect, setRect] = useState<SpotlightRect | null>(null);
    const [targetNotFound, setTargetNotFound] = useState(false);

    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;

    // Reset targetNotFound when step changes
    useEffect(() => {
        setTargetNotFound(false);
    }, [currentStepIndex]);

    // Track target element position
    useEffect(() => {
        if (!isActive || !currentStep) return;

        if (!currentStep.target) {
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
            // resolveTutorialTarget i.p.v. querySelector: een element met
            // `display:none` (Tailwind `lg:hidden`) staat wél in de DOM maar meet
            // nul — dat gaf een lege spotlight en een tooltip buiten beeld.
            const el = resolveTutorialTarget(currentStep.target!);
            if (!el) {
                setRect(null);
                return false;
            }
            if (!hasScrolled) {
                hasScrolled = true;
                const r = el.getBoundingClientRect();
                const elHeight = r.height;
                // Large elements (taller than 60% of viewport): scroll to top edge
                // Small elements: center them
                const block: ScrollLogicalPosition = elHeight > window.innerHeight * 0.6 ? 'start' : 'center';
                el.scrollIntoView({ behavior: 'smooth', block });
                // Meet opnieuw ná het scrollen, via dezelfde retry-machine: zo
                // blijft het vangnet werken als het element intussen verdwijnt.
                window.setTimeout(() => { if (!measure()) scheduleRetry(); }, 400);
                return false; // Er is nog geen rect; laat de retry-machine doorlopen.
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

        // Eén retry-machine voor élk pad dat (nog) geen rect oplevert. Na het
        // budget verschijnt de "Volgende"-knop, zodat een leerling nooit vastloopt.
        let retries = 0;
        const scheduleRetry = () => {
            if (retryTimer) return;
            retryTimer = window.setTimeout(() => {
                retryTimer = null;
                if (measure()) return;
                if (retries++ > MAX_MEASURE_RETRIES) {
                    setTargetNotFound(true);
                    return;
                }
                scheduleRetry();
            }, 150);
        };

        // Initial attempt + retries with targetNotFound fallback
        if (!measure()) scheduleRetry();

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
    }, [isActive, currentStep, completeStep]);

    // Compute tooltip position relative to spotlight rect
    const isFullscreen = !currentStep?.target;

    const getTooltipStyle = useCallback((): React.CSSProperties => {
        if (!rect) {
            return {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: 360,
            };
        }

        const pos = currentStep?.position || 'bottom';
        const style: React.CSSProperties = { position: 'absolute', maxWidth: 320 };
        // Gemeten hoogte is ~185px bij de langste stap; te laag schatten duwde de
        // knoppenrij onder de onderrand van het scherm.
        const TOOLTIP_HEIGHT_ESTIMATE = 200;
        const VIEWPORT_MARGIN = 12;
        // BELANGRIJK: hier géén `transform` zetten. Dit is een framer-motion
        // `motion.div` met een y-animatie, en die schrijft `transform` zelf — een
        // `translateX(-50%)` werd dus stil weggegooid, waardoor de tooltip met zijn
        // LINKERRAND op het middelpunt landde en rechts buiten beeld liep.
        // We rekenen de linkerbovenhoek daarom direct uit en klemmen die.
        const clampLeft = (centerX: number) => Math.min(
            Math.max(VIEWPORT_MARGIN, centerX - TOOLTIP_HALF_WIDTH),
            Math.max(VIEWPORT_MARGIN, window.innerWidth - VIEWPORT_MARGIN - TOOLTIP_HALF_WIDTH * 2),
        );
        /** Houd de tooltip binnen de boven- en onderrand van het scherm. */
        const fitTop = (top: number) => Math.min(
            Math.max(VIEWPORT_MARGIN, top),
            Math.max(VIEWPORT_MARGIN, window.innerHeight - VIEWPORT_MARGIN - TOOLTIP_HEIGHT_ESTIMATE),
        );
        const clampTop = (centerY: number) => fitTop(centerY - TOOLTIP_HEIGHT_ESTIMATE / 2);

        if (pos === 'bottom') {
            let top = rect.top + rect.height + TOOLTIP_GAP;
            // If tooltip would go below viewport, flip to top
            if (top + TOOLTIP_HEIGHT_ESTIMATE > window.innerHeight - VIEWPORT_MARGIN) {
                top = Math.max(VIEWPORT_MARGIN, rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP);
            }
            style.top = fitTop(top);
            style.left = clampLeft(rect.left + rect.width / 2);
        } else if (pos === 'top') {
            let top = rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP;
            // If tooltip would go above viewport, flip to bottom
            if (top < VIEWPORT_MARGIN) {
                top = rect.top + rect.height + TOOLTIP_GAP;
            }
            style.top = fitTop(top);
            style.left = clampLeft(rect.left + rect.width / 2);
        } else if (pos === 'left') {
            style.top = clampTop(rect.top + rect.height / 2);
            // Klemmen is hier geen luxe: bij een doel links in beeld werd dit groter
            // dan de vensterbreedte en verdween de hele tooltip — inclusief het
            // kruisje en "Volgende" — buiten het scherm.
            style.left = clampLeft(rect.left - TOOLTIP_GAP - TOOLTIP_HALF_WIDTH);
        } else {
            style.top = clampTop(rect.top + rect.height / 2);
            style.left = clampLeft(rect.left + rect.width + TOOLTIP_GAP + TOOLTIP_HALF_WIDTH);
        }

        return style;
    }, [rect, currentStep?.position]);

    if (!isActive || !currentStep) return null;

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
                {/* Alleen bij requireClick: anders kan een leerling bij een puur
                    informatieve stap doorklikken en de rondleiding achterlaten op
                    een scherm dat niet meer gemonteerd is. */}
                {rect && currentStep.requireClick && (
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
                            // Let clicks pass through to the actual element
                            resolveTutorialTarget(currentStep.target!)?.click();
                        }}
                    />
                )}

                {/* Tooltip */}
                <motion.div
                    key={currentStep.id}
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
                                {/* Enige uitweg tijdens een requireClick-stap, dus
                                    een volwaardig raakvlak van 44px. */}
                                <button
                                    onClick={skipTutorial}
                                    className="shrink-0 flex min-h-[44px] min-w-[44px] items-center justify-center rounded transition-colors text-duck-ink/60"
                                    title="Rondleiding overslaan"
                                    aria-label="Rondleiding overslaan"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Description */}
                            <p className="text-xs leading-relaxed mb-3 text-duck-ink/60">{currentStep.content}</p>

                            {/* Required click hint */}
                            {currentStep.requireClick && rect && !targetNotFound && (
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
                                    {(!currentStep.requireClick || targetNotFound) && (
                                        <button
                                            onClick={isLastStep ? skipTutorial : nextStep}
                                            className="flex items-center gap-1 px-3 py-1.5 text-duck-ink text-xs font-semibold rounded-full transition-all duration-300 bg-duck-acid"
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = ''}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                                        >
                                            {isLastStep ? 'Klaar' : 'Volgende'}
                                            <ChevronRight size={14} />
                                        </button>
                                    )}
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
