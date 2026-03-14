
import React, { useState, useEffect } from 'react';
import { AgentRole } from '../types';
import { ChevronRight, ChevronLeft, Target, Play } from 'lucide-react';

interface MissionBriefingProps {
    role: AgentRole;
    onStart: () => void;
    onBack: () => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({ role, onStart, onBack }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [readCountdown, setReadCountdown] = useState(2); // 2-second reading timer

    const steps = role.steps || [];
    const isLastStep = steps.length === 0 || currentStepIndex === steps.length - 1;
    const currentStep = steps[currentStepIndex];

    // Reset and start countdown when reaching the last step
    useEffect(() => {
        if (isLastStep) {
            setReadCountdown(2);
            const timer = setInterval(() => {
                setReadCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isLastStep, currentStepIndex]);

    const handleNext = () => {
        if (currentStepIndex < role.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            onStart();
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        } else {
            onBack();
        }
    };



    return (
        <div className="w-full h-full max-w-3xl mx-auto flex items-center justify-center p-2 animate-in fade-in zoom-in-95 duration-500">

            {/* Main Card Container - Single Column Text Only */}
            <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-auto max-h-[90vh]">

                {/* Content Area */}
                <div className="relative flex-1 p-6 md:p-10 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                    {/* Scroll fade hint at bottom */}
                    <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent -mb-8 z-10" />

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6 shrink-0">
                        <div className="p-3 bg-lab-bg rounded-2xl text-lab-primary shadow-sm">
                            {role.icon}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-lab-dark leading-tight" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{role.title}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold bg-lab-bg text-lab-textLight px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-200 inline-flex">{role.difficulty} Level</span>
                            </div>
                        </div>
                    </div>

                    {/* Context Section - ONLY VISIBLE ON STEP 1 (Index 0) */}
                    {currentStepIndex === 0 && (
                        <div className="mb-8 space-y-4 animate-in slide-in-from-top-4 fade-in duration-500">
                            <div className="bg-lab-bg p-4 rounded-xl border-l-4 border-lab-primary">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {role.briefingImage && (
                                        <div className="w-full md:w-1/3 h-40 rounded-xl overflow-hidden shadow-sm shrink-0 bg-slate-100">
                                            {imageError ? (
                                                <div className="w-full h-full bg-gradient-to-br from-lab-bg to-slate-100 flex items-center justify-center">
                                                    <div className="p-4 bg-white/80 rounded-2xl shadow-inner text-lab-primary">
                                                        {role.icon}
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={role.briefingImage}
                                                    alt="Briefing"
                                                    className="w-full h-full object-cover"
                                                    decoding="async"
                                                    loading="lazy"
                                                    onError={() => setImageError(true)}
                                                />
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs font-bold text-lab-textLight uppercase tracking-widest mb-1">De Uitdaging</p>
                                        <p className="text-base text-lab-text font-medium leading-relaxed" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            {role.problemScenario}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-lab-primary font-bold text-base bg-lab-bg p-3 rounded-xl border border-slate-200">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                    <Target size={18} />
                                </div>
                                <span>Doel: {role.missionObjective}</span>
                            </div>
                        </div>
                    )}

                    {/* Current Step Content */}
                    <div className="flex-1 flex flex-col justify-center min-h-[160px] py-2">
                        <div key={currentStepIndex} className="animate-in slide-in-from-right-8 fade-in duration-300">
                            {currentStep && (
                                <>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-lab-dark text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                                            STAP {currentStepIndex + 1} VAN {steps.length}
                                        </span>
                                        <h3 className="text-xl font-extrabold text-lab-dark" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{currentStep.title}</h3>
                                    </div>

                                    <p className="text-lab-text text-lg leading-relaxed mb-6 font-medium" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {currentStep.description}
                                    </p>

                                    <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex items-start gap-4 shadow-sm">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-lab-green animate-pulse motion-reduce:animate-none"></div>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-lab-textLight uppercase tracking-wide block mb-1">Voorbeeld Actie</span>
                                            <p className="text-base font-bold text-lab-green italic">"{currentStep.example}"</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-100 shrink-0">
                        <button
                            onClick={handlePrev}
                            className="p-3 rounded-xl hover:bg-lab-bg text-lab-textLight transition-all duration-300 focus-visible:ring-2 focus-visible:ring-lab-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Vorige stap"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-2 flex-1 justify-center">
                            {steps.map((_, i) => (
                                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentStepIndex ? 'w-8 bg-lab-primary' : 'w-2 bg-slate-200'}`} />
                            ))}
                        </div>

                        {isLastStep && readCountdown > 0 ? (
                            <div className="px-8 py-3 bg-slate-100 text-lab-textLight rounded-full font-bold text-sm flex items-center gap-3 cursor-not-allowed">
                                <div className="relative w-6 h-6">
                                    <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-slate-200"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        <path
                                            className="text-lab-primary"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeDasharray={`${((2 - readCountdown) / 2) * 100}, 100`}
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-lab-text">
                                        {readCountdown}
                                    </span>
                                </div>
                                <span>Even lezen...</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleNext}
                                className={`
                            px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-lab-primary
                            ${isLastStep ? 'bg-lab-primary text-white hover:bg-lab-primaryDark' :
                                        'bg-lab-dark text-white hover:bg-slate-700'}
                        `}
                            >
                                {isLastStep ? 'Start Missie' : 'Volgende'}
                                {isLastStep ? <Play size={16} fill="currentColor" /> : <ChevronRight size={16} />}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
