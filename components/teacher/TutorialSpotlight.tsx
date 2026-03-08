import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useTutorial } from '../../contexts/TutorialContext';

interface SpotlightRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

const PADDING = 10;
const TOOLTIP_GAP = 12;

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
            const el = document.querySelector(currentStep.target!);
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
        const TOOLTIP_HEIGHT_ESTIMATE = 160; // approx tooltip height for clamping
        const VIEWPORT_MARGIN = 12;

        if (pos === 'bottom') {
            let top = rect.top + rect.height + TOOLTIP_GAP;
            // If tooltip would go below viewport, flip to top
            if (top + TOOLTIP_HEIGHT_ESTIMATE > window.innerHeight - VIEWPORT_MARGIN) {
                top = Math.max(VIEWPORT_MARGIN, rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP);
            }
            style.top = top;
            style.left = Math.min(Math.max(VIEWPORT_MARGIN, rect.left + rect.width / 2), window.innerWidth - VIEWPORT_MARGIN);
            style.transform = 'translateX(-50%)';
        } else if (pos === 'top') {
            let top = rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP;
            // If tooltip would go above viewport, flip to bottom
            if (top < VIEWPORT_MARGIN) {
                top = rect.top + rect.height + TOOLTIP_GAP;
            }
            // Clamp to viewport bottom
            top = Math.min(top, window.innerHeight - TOOLTIP_HEIGHT_ESTIMATE - VIEWPORT_MARGIN);
            style.top = Math.max(VIEWPORT_MARGIN, top);
            style.left = Math.min(Math.max(VIEWPORT_MARGIN, rect.left + rect.width / 2), window.innerWidth - VIEWPORT_MARGIN);
            style.transform = 'translateX(-50%)';
        } else if (pos === 'left') {
            style.top = Math.max(VIEWPORT_MARGIN, Math.min(rect.top + rect.height / 2, window.innerHeight - TOOLTIP_HEIGHT_ESTIMATE - VIEWPORT_MARGIN));
            style.right = window.innerWidth - rect.left + TOOLTIP_GAP;
            style.transform = 'translateY(-50%)';
        } else {
            style.top = Math.max(VIEWPORT_MARGIN, Math.min(rect.top + rect.height / 2, window.innerHeight - TOOLTIP_HEIGHT_ESTIMATE - VIEWPORT_MARGIN));
            style.left = rect.left + rect.width + TOOLTIP_GAP;
            style.transform = 'translateY(-50%)';
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
                            boxShadow: '0 0 0 3px rgba(217,119,87,0.5), 0 0 20px 4px rgba(217,119,87,0.15)',
                        }}
                        onClick={() => {
                            // Let clicks pass through to the actual element
                            const el = document.querySelector(currentStep.target!) as HTMLElement;
                            el?.click();
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
                    style={{ ...getTooltipStyle(), pointerEvents: 'auto', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E6DF' }}
                    className="rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Step counter bar */}
                    <div className="flex h-1">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 transition-colors duration-300"
                                style={{ backgroundColor: i <= currentStepIndex ? '#D97757' : '#F0EEE8' }}
                            />
                        ))}
                    </div>

                    {/* Fullscreen intro: Pip centered above content */}
                    {isFullscreen && (
                        <div className="flex justify-center pt-4 pb-1">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FAF9F0' }}>
                                    <motion.img
                                        src="/mascot/pip-excited.webp"
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
                        {/* Pip mascot — inline guide for targeted steps */}
                        {!isFullscreen && (
                            <div className="shrink-0 mt-0.5">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FAF9F0' }}>
                                    <motion.img
                                        src="/mascot/pip-waving.webp"
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
                                <h3 className="text-sm font-bold leading-tight" style={{ color: '#1A1A19', fontFamily: "'Newsreader', Georgia, serif" }}>{currentStep.title}</h3>
                                <button
                                    onClick={skipTutorial}
                                    className="shrink-0 p-1 rounded transition-colors"
                                    style={{ color: '#6B6B66' }}
                                    title="Tutorial overslaan"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Description */}
                            <p className="text-xs leading-relaxed mb-3" style={{ color: '#3D3D38' }}>{currentStep.content}</p>

                            {/* Required click hint */}
                            {currentStep.requireClick && rect && !targetNotFound && (
                                <p className="text-[11px] font-semibold mb-3 flex items-center gap-1.5" style={{ color: '#D97757' }}>
                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#D97757' }} />
                                    Klik op het uitgelichte element
                                </p>
                            )}

                            {/* Navigation */}
                            <div className={`flex items-center ${isFullscreen ? 'justify-center gap-3' : 'justify-between'}`}>
                                <span className="text-[10px] font-medium" style={{ color: '#6B6B66' }}>
                                    {currentStepIndex + 1}/{steps.length}
                                </span>
                                <div className="flex items-center gap-1">
                                    {!isFirstStep && (
                                        <button
                                            onClick={prevStep}
                                            className="p-1.5 rounded-lg transition-colors"
                                            style={{ color: '#6B6B66' }}
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                    )}
                                    {(!currentStep.requireClick || targetNotFound) && (
                                        <button
                                            onClick={isLastStep ? skipTutorial : nextStep}
                                            className="flex items-center gap-1 px-3 py-1.5 text-white text-xs font-semibold rounded-full transition-all duration-300"
                                            style={{ backgroundColor: '#D97757' }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C46849'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D97757'}
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
            className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 z-40"
            style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E6DF', color: '#6B6B66' }}
            title="Tutorial Herhalen"
        >
            <span className="text-sm">?</span>
        </button>
    );
};

export default TutorialSpotlight;
