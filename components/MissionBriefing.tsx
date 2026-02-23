
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
    const [readCountdown, setReadCountdown] = useState(5); // 5-second reading timer

    const steps = role.steps || [];
    const isLastStep = steps.length === 0 || currentStepIndex === steps.length - 1;
    const currentStep = steps[currentStepIndex];

    // Reset and start countdown when reaching the last step
    useEffect(() => {
        if (isLastStep) {
            setReadCountdown(5);
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
            <div className="w-full bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden flex flex-col h-auto max-h-[85vh]">

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-10 flex flex-col justify-between overflow-y-auto custom-scrollbar">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6 shrink-0">
                        <div className="p-3 bg-slate-100 rounded-2xl text-slate-700 shadow-sm">
                            {role.icon}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">{role.title}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">{role.difficulty} Level</span>
                            </div>
                        </div>
                    </div>

                    {/* Context Section - ONLY VISIBLE ON STEP 1 (Index 0) */}
                    {currentStepIndex === 0 && (
                        <div className="mb-8 space-y-4 animate-in slide-in-from-top-4 fade-in duration-500">
                            <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-slate-300">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {role.briefingImage && (
                                        <div className="w-full md:w-1/3 h-40 rounded-xl overflow-hidden shadow-sm shrink-0 bg-slate-200">
                                            {imageError ? (
                                                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                                    <div className="p-4 bg-white/80 rounded-2xl shadow-inner text-slate-400">
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
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">De Uitdaging</p>
                                        <p className="text-base text-slate-600 font-medium leading-relaxed">
                                            {role.problemScenario}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-lab-primary font-bold text-base bg-indigo-50 p-3 rounded-xl border border-indigo-100">
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
                                        <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                                            STAP {currentStepIndex + 1} VAN {steps.length}
                                        </span>
                                        <h3 className="text-xl font-extrabold text-slate-800">{currentStep.title}</h3>
                                    </div>

                                    <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
                                        {currentStep.description}
                                    </p>

                                    <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex items-start gap-4 shadow-sm">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Voorbeeld Actie</span>
                                            <p className="text-base font-bold text-emerald-700 italic">"{currentStep.example}"</p>
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
                            className="p-3 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-2 flex-1 justify-center">
                            {steps.map((_, i) => (
                                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentStepIndex ? 'w-8 bg-slate-800' : 'w-2 bg-slate-200'}`} />
                            ))}
                        </div>

                        {isLastStep && readCountdown > 0 ? (
                            <div className="px-8 py-3 bg-slate-200 text-slate-500 rounded-xl font-bold text-sm flex items-center gap-3 cursor-not-allowed">
                                <div className="relative w-6 h-6">
                                    <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-slate-300"
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
                                            strokeDasharray={`${((5 - readCountdown) / 5) * 100}, 100`}
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-600">
                                        {readCountdown}
                                    </span>
                                </div>
                                <span>Even lezen...</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleNext}
                                className={`
                            px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95
                            ${isLastStep ? 'bg-lab-primary text-white hover:bg-lab-primaryDark' :
                                        'bg-slate-900 text-white hover:bg-slate-800'}
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
