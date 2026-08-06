
import React, { useState } from 'react';
import { Rocket, Trophy, ChevronRight, ChevronLeft, Play } from 'lucide-react';
import { KeesMessage } from '@/components/brand/KeesMessage';
import { KEES_INTRO } from '@/config/keesVoice';

interface StudentOnboardingProps {
    onComplete: () => void;
    userName?: string;
}

// Twee schermen, bewust kort: hierna volgen nog de avatarbouwer (4 stappen) en de
// nulmeting. Elk XP-getal hieronder is herleidbaar tot de code — +5/+10 uit
// AiLab.tsx, en +25 en 200/dag uit de server-side XP-migratie (`LEAST(p_amount,
// 25)`). Beloof hier nooit meer dan de server daadwerkelijk uitkeert.
const ONBOARDING_STEPS = [
    {
        id: 'welcome',
        icon: <Rocket size={48} />,
        title: 'Welkom bij DGSkills!',
        subtitle: 'Even voorstellen',
        description: 'Bij DGSkills doe je missies: korte opdrachten waarin je ontdekt wat je met computers, internet en AI kunt. Je hoeft van tevoren niets te kunnen — je leert het gewoon door het te doen.',
        animation: 'rocket',
        showMascot: true,
    },
    {
        id: 'xp',
        icon: <Trophy size={48} />,
        title: 'Verdien XP terwijl je bezig bent',
        subtitle: 'Zo werkt XP',
        description: 'XP zijn punten die je verdient tijdens missies. Hoe meer XP, hoe hoger je level. En je spaart er kleding en accessoires voor je avatar mee in de winkel. Per dag kun je maximaal 200 XP verdienen, dus rustig aan — het is geen race.',
        xpExamples: [
            { action: 'Bericht sturen in een missie', xp: '+5 XP' },
            { action: 'Uitgebreid antwoord geven', xp: '+10 XP' },
            { action: 'Missie afronden', xp: '+25 XP' },
        ],
        animation: 'sparkle',
        showMascot: false,
    },
];

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ onComplete, userName }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [canProceed, setCanProceed] = useState(true);

    const step = ONBOARDING_STEPS[currentStep];
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

    const handleNext = () => {
        if (!canProceed) return;
        if (isLastStep) {
            onComplete();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const isFirstStep = currentStep === 0;

    return (
        <div className="fixed inset-0 z-[200] bg-duck-ink overflow-hidden">
            {/* Background: subtle grid + floating particles */}
            <div className="absolute inset-0" aria-hidden="true">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* Acid glow blob (achtergrond, niet als tekst) */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-duck-acid opacity-5 blur-3xl animate-duck-enter motion-reduce:animate-none" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-duck-acid opacity-5 blur-3xl" style={{ animationDelay: '1s' }} />

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-duck-float motion-reduce:animate-none"
                        style={{
                            left: `${(i * 5.3 + 7) % 100}%`,
                            top: `${(i * 7.1 + 3) % 100}%`,
                            animationDelay: `${(i * 0.37) % 5}s`,
                            animationDuration: `${3 + (i % 4)}s`,
                        }}
                    />
                ))}
            </div>

            {/* Progress dots — acid actief, ink/10 inactief */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={ONBOARDING_STEPS.length}>
                {ONBOARDING_STEPS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-500 ${
                            i === currentStep
                                ? 'w-8 bg-duck-acid ring-1 ring-duck-ink/15'
                                : i < currentStep
                                ? 'w-2 bg-white/50'
                                : 'w-2 bg-white/20'
                        }`}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 md:p-12 pt-20 md:pt-24 overflow-y-auto">
                <div className="max-w-lg md:max-w-xl lg:max-w-2xl w-full flex flex-col items-center">

                    {/* Mascot op welkomstscherm — Kees stelt zichzelf voor */}
                    {step.showMascot ? (
                        <div className="mb-6 w-full max-w-sm mx-auto shrink-0">
                            <KeesMessage
                                message={KEES_INTRO}
                                mood="wave"
                                layout="stacked"
                                duckClassName="w-16 h-16 md:w-20 md:h-20"
                            />
                        </div>
                    ) : (
                        <div className="mx-auto mb-6 w-20 h-20 md:w-24 md:h-24 bg-duck-acid rounded-3xl flex items-center justify-center text-duck-ink shadow-duck-soft shrink-0">
                            {step.icon}
                        </div>
                    )}

                    {/* Text Content */}
                    <div className="text-center mb-6 shrink-0">
                        <p className="text-xs md:text-sm font-extrabold text-white/50 uppercase tracking-widest mb-1 md:mb-2">
                            {step.subtitle}
                        </p>
                        <h1 className="font-display text-2xl md:text-4xl font-black text-white mb-2 md:mb-4 tracking-tight">
                            {step.title}
                        </h1>
                        <p className="text-base md:text-lg text-white/65 leading-relaxed max-w-md mx-auto">
                            {step.description}
                        </p>
                    </div>

                    {/* Step-specific content */}
                    {step.xpExamples && (
                        <div className="space-y-2 mb-6 w-full">
                            {step.xpExamples.map((ex, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-white/5 backdrop-blur border border-white/10 rounded-[1rem] px-4 py-3 animate-in slide-in-from-bottom"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <span className="text-white font-medium">{ex.action}</span>
                                    <span className="font-extrabold text-sm bg-duck-acid text-duck-ink px-3 py-1 rounded-full">{ex.xp}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 w-full mt-auto mb-4 md:mb-0">
                        {!isFirstStep && (
                            <button
                                onClick={handlePrevious}
                                className="min-h-[44px] px-6 py-3 md:py-4 rounded-full font-extrabold text-base flex items-center justify-center gap-2 transition-all duration-300 bg-white/10 text-white hover:bg-white/20 active:scale-95 border border-white/20"
                            >
                                <ChevronLeft size={20} />
                                <span className="hidden md:inline">Vorige</span>
                                <span className="md:hidden">Terug</span>
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!canProceed}
                            className={`flex-1 min-h-[44px] py-3 md:py-4 rounded-full font-extrabold text-base flex items-center justify-center gap-3 transition-all duration-300 ${
                                canProceed
                                    ? 'bg-duck-acid text-duck-ink border border-duck-acid hover:scale-[1.02] active:scale-95 shadow-duck-soft'
                                    : 'bg-duck-acid/50 text-duck-ink/50 border border-transparent cursor-not-allowed'
                            }`}
                        >
                            {isLastStep ? (
                                <>
                                    <Play size={20} fill="currentColor" />
                                    {/* Hierna volgt de avatarbouwer, niet het dashboard. */}
                                    <span>Maak je avatar</span>
                                </>
                            ) : (
                                <>
                                    <span>Volgende</span>
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Step counter */}
                    <p className="text-center text-white/50 text-sm mt-2 font-medium pb-4 md:pb-0">
                        Stap {currentStep + 1} van {ONBOARDING_STEPS.length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentOnboarding;
