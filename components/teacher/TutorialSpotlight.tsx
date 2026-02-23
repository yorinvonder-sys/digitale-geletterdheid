import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, SkipForward, ChevronLeft, Sparkles, HelpCircle } from 'lucide-react';
import { useTutorial, TutorialStep } from '../../contexts/TutorialContext';

interface SpotlightPosition {
    top: number;
    left: number;
    width: number;
    height: number;
}

const TutorialSpotlight: React.FC = () => {
    const {
        isActive,
        currentStep,
        currentStepIndex,
        steps,
        nextStep,
        prevStep,
        skipTutorial,
        completeStep
    } = useTutorial();

    const [spotlightPos, setSpotlightPos] = useState<SpotlightPosition | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [isTargetResolved, setIsTargetResolved] = useState(true);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Find and position spotlight on target element
    useEffect(() => {
        if (!isActive || !currentStep?.target) {
            setSpotlightPos(null);
            setIsTargetResolved(true);
            return;
        }

        let clickCleanup: (() => void) | null = null;
        let retryTimer: number | null = null;
        let mutationObserver: MutationObserver | null = null;
        let retries = 0;
        const maxRetries = 40;

        const attachRequiredClickListener = (element: Element) => {
            if (!currentStep.requireClick || clickCleanup) return;
            const handleClick = () => {
                completeStep();
            };
            element.addEventListener('click', handleClick, { once: true });
            clickCleanup = () => {
                element.removeEventListener('click', handleClick);
            };
        };

        const updatePosition = () => {
            const element = document.querySelector(currentStep.target!);
            if (element) {
                setIsTargetResolved(true);
                const rect = element.getBoundingClientRect();
                const padding = 8;
                setSpotlightPos({
                    top: rect.top - padding,
                    left: rect.left - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2,
                });

                // Position tooltip based on step preference
                const tooltipWidth = 340;
                const tooltipHeight = 180;
                const preferredPosition = currentStep.position || 'bottom';
                let top = rect.bottom + 16;
                let left = rect.left + rect.width / 2 - tooltipWidth / 2;

                if (preferredPosition === 'top') {
                    top = rect.top - tooltipHeight - 16;
                }
                if (preferredPosition === 'left') {
                    top = rect.top + rect.height / 2 - tooltipHeight / 2;
                    left = rect.left - tooltipWidth - 16;
                }
                if (preferredPosition === 'right') {
                    top = rect.top + rect.height / 2 - tooltipHeight / 2;
                    left = rect.right + 16;
                }

                // Adjust if would go off screen
                if (left < 16) left = 16;
                if (left + tooltipWidth > window.innerWidth - 16) {
                    left = window.innerWidth - tooltipWidth - 16;
                }
                if (top < 16) top = 16;
                if (top + tooltipHeight > window.innerHeight - 16) {
                    top = rect.top - tooltipHeight - 16;
                }
                if (top < 16) {
                    top = 16;
                }

                setTooltipPos({ top, left });
                attachRequiredClickListener(element);
                return true;
            }
            setIsTargetResolved(false);
            setSpotlightPos(null);
            return false;
        };

        const initialResolved = updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        const retryResolve = () => {
            if (updatePosition()) return;
            if (retries >= maxRetries) return;
            retries += 1;
            retryTimer = window.setTimeout(retryResolve, 120);
        };

        if (!initialResolved) {
            retryResolve();
            mutationObserver = new MutationObserver(() => {
                updatePosition();
            });
            mutationObserver.observe(document.body, { childList: true, subtree: true });
        }

        return () => {
            if (retryTimer) {
                window.clearTimeout(retryTimer);
            }
            mutationObserver?.disconnect();
            clickCleanup?.();
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [isActive, currentStep, completeStep]);

    if (!isActive || !currentStep) return null;

    const isFullscreen = !currentStep.target;
    const isLastStep = currentStepIndex === steps.length - 1;
    const isFirstStep = currentStepIndex === 0;
    const canSkipTutorial = isLastStep;

    return (
        <AnimatePresence>
            <motion.div
                key="tutorial-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] pointer-events-none"
            >
                {/* Dark overlay with spotlight cutout */}
                {isFullscreen ? (
                    // Fullscreen overlay for intro/outro slides
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
                ) : spotlightPos && (
                    // Overlay with spotlight hole
                    <svg className="absolute inset-0 w-full h-full">
                        <defs>
                            <mask id="spotlight-mask">
                                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                <rect
                                    x={spotlightPos.left}
                                    y={spotlightPos.top}
                                    width={spotlightPos.width}
                                    height={spotlightPos.height}
                                    rx="12"
                                    fill="black"
                                />
                            </mask>
                        </defs>
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            fill="rgba(15, 23, 42, 0.85)"
                            mask="url(#spotlight-mask)"
                        />
                    </svg>
                )}

                {/* Spotlight ring animation around target */}
                {spotlightPos && !isFullscreen && (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute pointer-events-none"
                        style={{
                            top: spotlightPos.top - 4,
                            left: spotlightPos.left - 4,
                            width: spotlightPos.width + 8,
                            height: spotlightPos.height + 8,
                        }}
                    >
                        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400 animate-pulse" />
                        <div className="absolute inset-0 rounded-2xl border-4 border-indigo-500/30 animate-ping" />
                    </motion.div>
                )}

                {/* Tooltip / Content Card */}
                <motion.div
                    ref={tooltipRef}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`absolute bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden pointer-events-auto ${isFullscreen ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md' : 'w-[340px]'}`}
                    style={!isFullscreen ? { top: tooltipPos.top, left: tooltipPos.left } : undefined}
                >
                    {/* Progress bar */}
                    <div className="h-1.5 bg-slate-100 flex">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 transition-all duration-300 ${i <= currentStepIndex ? 'bg-indigo-500' : 'bg-transparent'}`}
                            />
                        ))}
                    </div>

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">{currentStep.title}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        Stap {currentStepIndex + 1} van {steps.length}
                                    </p>
                                </div>
                            </div>
                            {canSkipTutorial && (
                                <button
                                    onClick={skipTutorial}
                                    className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <p className="text-slate-600 font-medium leading-relaxed mb-6 min-h-[3rem]">
                            {currentStep.content}
                        </p>

                        {/* Required click indicator */}
                        {currentStep.requireClick && (
                            <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-amber-700">
                                    {isTargetResolved
                                        ? 'Klik op het gemarkeerde element om verder te gaan'
                                        : 'Even wachten: we laden dit onderdeel...'}
                                </span>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between gap-3">
                            <button
                                onClick={prevStep}
                                disabled={isFirstStep}
                                className={`p-3 rounded-xl text-slate-400 hover:bg-slate-50 transition-all ${isFirstStep ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {!currentStep.requireClick && (
                                <button
                                    onClick={nextStep}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                                >
                                    {isLastStep ? 'Afronden' : 'Volgende'}
                                    <ChevronRight size={18} />
                                </button>
                            )}

                            {currentStep.requireClick && canSkipTutorial && (
                                <button
                                    onClick={skipTutorial}
                                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                                >
                                    <SkipForward size={16} />
                                    Tutorial Overslaan
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Small button to restart tutorial
export const TutorialRestartButton: React.FC = () => {
    const { startTutorial, hasCompleted } = useTutorial();

    // Only show if user has completed tutorial before
    if (!hasCompleted) return null;

    return (
        <button
            onClick={startTutorial}
            className="fixed bottom-6 right-6 w-12 h-12 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-40 group"
            title="Tutorial Opnieuw Starten"
        >
            <HelpCircle size={20} />
            <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Tutorial Herhalen
            </span>
        </button>
    );
};

export default TutorialSpotlight;
