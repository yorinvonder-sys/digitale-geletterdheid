
import React, { useState, useEffect } from 'react';
import { AgentRole } from '@/types';
import { ChevronRight, ChevronLeft, Target, Play } from 'lucide-react';
import { getMissionGoal } from '@/config/missionGoals';
import { MissionGoalBanner } from '@/features/missions/templates/shared/MissionGoalBanner';
import { MissionMetaChips } from '@/features/missions/templates/shared/MissionMetaChips';
import { KeesMessage } from '@/components/brand/KeesMessage';
import { getMissionMeta } from '@/config/missionMeta';
import { getKeesMissionIntro } from '@/config/keesVoice';

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
    const missionGoal = getMissionGoal(role.id);
    const meta = getMissionMeta(role.id);
    const heroLabel = [meta.topicLabel, meta.leerjaar != null ? `Leerjaar ${meta.leerjaar}` : null]
        .filter(Boolean)
        .join(' · ');

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
        <div className="w-full h-full max-w-3xl mx-auto flex items-center justify-center px-4 sm:px-6 py-2 animate-in fade-in zoom-in-95 duration-500">

            {/* Main Card Container - Single Column Text Only */}
            <div className="w-full bg-white rounded-[1.6rem] shadow-xl border border-duck-ink/15 overflow-hidden flex flex-col h-auto max-h-[90vh]">

                {/* Content Area */}
                <div className="relative flex-1 p-6 pb-28 md:p-10 md:pb-10 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                    {/* Scroll fade hint at bottom */}
                    <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent -mb-8 z-10" />

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 border-b border-duck-ink/15 pb-6 shrink-0">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-[1.1rem] bg-duck-acid text-duck-ink shadow-duck-soft">
                            {role.icon}
                        </div>
                        <div className="min-w-0">
                            {heroLabel && (
                                <p className="mb-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-duck-ink/55">{heroLabel}</p>
                            )}
                            <h2 className="max-w-full whitespace-normal break-words [overflow-wrap:anywhere] text-2xl font-black leading-tight text-duck-ink" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{role.title}</h2>
                            <MissionMetaChips meta={meta} className="mt-2" />
                        </div>
                    </div>

                    {/* Context Section - ONLY VISIBLE ON STEP 1 (Index 0) */}
                    {currentStepIndex === 0 && (
                        <div className="mb-8 space-y-4 animate-in slide-in-from-top-4 fade-in duration-500">
                            <div className="bg-duck-bg p-4 rounded-xl border-l-4 border-duck-acid">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {role.briefingImage && (
                                        <div className="w-full md:w-1/3 h-40 rounded-xl overflow-hidden shadow-sm shrink-0 bg-duck-bg">
                                            {imageError ? (
                                                <div className="w-full h-full bg-gradient-to-br from-duck-bg to-duck-bgLight flex items-center justify-center">
                                                    <div className="p-4 bg-white/80 rounded-2xl shadow-inner text-duck-ink">
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
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-duck-ink/60 uppercase tracking-widest mb-1">De Uitdaging</p>
                                        <p className="text-base text-duck-ink font-medium leading-relaxed break-words" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            {role.problemScenario}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-duck-ink font-bold text-base bg-duck-bg p-3 rounded-xl border border-duck-ink/15">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                    <Target size={18} />
                                </div>
                                <span>Doel: {role.missionObjective}</span>
                            </div>

                            {missionGoal && (
                                <MissionGoalBanner goal={missionGoal} compact />
                            )}

                            <KeesMessage
                                message={getKeesMissionIntro(role.title)}
                                mood="wave"
                                layout="row"
                                duckClassName="h-9 w-9"
                            />
                        </div>
                    )}

                    {/* Current Step Content */}
                    <div className="flex-1 flex flex-col justify-center min-h-[160px] py-2">
                        <div key={currentStepIndex} className="animate-in slide-in-from-right-8 fade-in duration-300">
                            {currentStep && (
                                <>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-duck-ink text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                                            STAP {currentStepIndex + 1} VAN {steps.length}
                                        </span>
                                        <h3 className="text-xl font-extrabold text-duck-ink" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{currentStep.title}</h3>
                                    </div>

                                    <p className="text-duck-ink text-lg leading-relaxed mb-6 font-medium" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {currentStep.description}
                                    </p>

                                    <div className="bg-white border-2 border-duck-ink/15 p-4 rounded-2xl flex items-start gap-4 shadow-sm">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-duck-ink animate-pulse motion-reduce:animate-none"></div>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-duck-ink/60 uppercase tracking-wide block mb-1">Voorbeeld Actie</span>
                                            <p className="text-base font-bold text-duck-ink italic">"{currentStep.example}"</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="fixed inset-x-4 bottom-4 z-30 flex items-center gap-4 rounded-2xl border border-duck-ink/15 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur md:static md:mt-8 md:rounded-none md:border-x-0 md:border-b-0 md:bg-transparent md:px-0 md:pt-6 md:shadow-none md:backdrop-blur-0 border-t md:border-t">
                        <button
                            onClick={handlePrev}
                            className="p-3 rounded-xl hover:bg-duck-bg text-duck-ink/60 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-duck-acid min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Vorige stap"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-2 flex-1 justify-center">
                            {steps.map((_, i) => (
                                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentStepIndex ? 'w-8 bg-duck-acid' : 'w-2 bg-duck-ink/15'}`} />
                            ))}
                        </div>

                        {isLastStep && readCountdown > 0 ? (
                            <div className="px-8 py-3 bg-duck-bg text-duck-ink/60 rounded-full font-bold text-sm flex items-center gap-3 cursor-not-allowed">
                                <div className="relative w-6 h-6">
                                    <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-duck-ink/60"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        <path
                                            className="text-duck-ink"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeDasharray={`${((2 - readCountdown) / 2) * 100}, 100`}
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-duck-ink">
                                        {readCountdown}
                                    </span>
                                </div>
                                <span>Even lezen...</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleNext}
                                className={`
                            px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-duck-acid
                            ${isLastStep ? 'bg-duck-acid text-duck-ink hover:opacity-90' :
                                        'bg-duck-ink text-white hover:opacity-80'}
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
