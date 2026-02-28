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
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            const r = el.getBoundingClientRect();
            setRect({
                top: r.top - PADDING,
                left: r.left - PADDING,
                width: r.width + PADDING * 2,
                height: r.height + PADDING * 2,
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
    const getTooltipStyle = useCallback((): React.CSSProperties => {
        if (!rect) {
            // Centered for non-target steps
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            };
        }

        const pos = currentStep?.position || 'bottom';
        const style: React.CSSProperties = { position: 'absolute', maxWidth: 320 };

        if (pos === 'bottom') {
            style.top = rect.top + rect.height + TOOLTIP_GAP;
            style.left = rect.left + rect.width / 2;
            style.transform = 'translateX(-50%)';
        } else if (pos === 'top') {
            style.bottom = window.innerHeight - rect.top + TOOLTIP_GAP;
            style.left = rect.left + rect.width / 2;
            style.transform = 'translateX(-50%)';
        } else if (pos === 'left') {
            style.top = rect.top + rect.height / 2;
            style.right = window.innerWidth - rect.left + TOOLTIP_GAP;
            style.transform = 'translateY(-50%)';
        } else {
            style.top = rect.top + rect.height / 2;
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
                        fill="rgba(15, 23, 42, 0.6)"
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
                            boxShadow: '0 0 0 3px rgba(99,102,241,0.5), 0 0 20px 4px rgba(99,102,241,0.15)',
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
                    transition={{ duration: 0.2 }}
                    style={{ ...getTooltipStyle(), pointerEvents: 'auto' }}
                    className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
                >
                    {/* Step counter bar */}
                    <div className="flex h-1">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 ${i <= currentStepIndex ? 'bg-indigo-500' : 'bg-slate-100'}`}
                            />
                        ))}
                    </div>

                    <div className="px-4 py-3">
                        {/* Title + skip */}
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="text-sm font-bold text-slate-900 leading-tight">{currentStep.title}</h3>
                            <button
                                onClick={skipTutorial}
                                className="shrink-0 p-1 text-slate-300 hover:text-slate-500 rounded transition-colors"
                                title="Tutorial overslaan"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{currentStep.content}</p>

                        {/* Required click hint — only show when element is actually found */}
                        {currentStep.requireClick && rect && !targetNotFound && (
                            <p className="text-[11px] text-indigo-600 font-semibold mb-3 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                Klik op het uitgelichte element
                            </p>
                        )}

                        {/* Navigation — always show a way forward */}
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-medium">
                                {currentStepIndex + 1}/{steps.length}
                            </span>
                            <div className="flex items-center gap-1">
                                {!isFirstStep && (
                                    <button
                                        onClick={prevStep}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                )}
                                {/* Show Next button when: not requireClick, OR element was not found (fallback) */}
                                {(!currentStep.requireClick || targetNotFound) && (
                                    <button
                                        onClick={isLastStep ? skipTutorial : nextStep}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors"
                                    >
                                        {isLastStep ? 'Klaar' : 'Volgende'}
                                        <ChevronRight size={14} />
                                    </button>
                                )}
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
            className="fixed bottom-6 right-6 w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 z-40"
            title="Tutorial Herhalen"
        >
            <span className="text-sm">?</span>
        </button>
    );
};

export default TutorialSpotlight;
