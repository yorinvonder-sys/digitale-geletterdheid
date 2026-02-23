
import React, { useState } from 'react';
import { Rocket, MessageSquare, Target, Trophy, ChevronRight, ChevronLeft, Brain, Sparkles, Zap, CheckCircle, Play } from 'lucide-react';

interface StudentOnboardingProps {
    onComplete: () => void;
    userName?: string;
}

const ONBOARDING_STEPS = [
    {
        id: 'welcome',
        icon: <Rocket size={48} />,
        title: 'Welkom bij DGSkills!',
        subtitle: 'Jouw digitale vaardigheden avontuur begint nu',
        description: 'Hier leer jij hoe je digitale tools en AI kunt gebruiken als superkracht. Van slimme presentaties tot je eigen creaties - jij bouwt aan je toekomst.',
        animation: 'rocket',
        color: 'from-indigo-500 to-purple-600',
    },
    {
        id: 'what',
        icon: <Target size={48} />,
        title: 'WAT ga je doen?',
        subtitle: 'Missies voltooien',
        description: 'Je werkt aan gave missies: presentaties maken, verhalen schrijven, games bouwen en meer. Direct aan de slag met praktische opdrachten!',
        features: [
            { icon: '🎮', text: 'Games bouwen' },
            { icon: '📖', text: 'Verhalen schrijven' },
            { icon: '🎨', text: 'Creaties maken' },
        ],
        animation: 'pulse',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        id: 'how',
        icon: <MessageSquare size={48} />,
        title: 'HOE werkt het?',
        subtitle: 'Leren door doen',
        description: 'Sommige missies hebben een AI-assistent die je helpt. Deze kun je vragen stellen en ideeën mee uitwerken. Andere missies doe je zelfstandig of met je klas.',
        demoChat: [
            { role: 'user', text: 'Maak de speler blauw' },
            { role: 'ai', text: 'Top! Ik pas de kleur aan... 🎨' },
        ],
        animation: 'chat',
        color: 'from-sky-500 to-blue-600',
    },
    {
        id: 'why',
        icon: <Brain size={48} />,
        title: 'WAAROM is dit belangrijk?',
        subtitle: 'Digitale skills voor de toekomst',
        description: 'Digitale vaardigheden en AI veranderen de wereld. Door nu te leren hoe je deze tools goed gebruikt, heb jij straks een enorme voorsprong.',
        stats: [
            { value: '85%', label: 'van banen gebruikt digitale tools' },
            { value: '3x', label: 'effectiever met goede skills' },
        ],
        animation: 'brain',
        color: 'from-amber-500 to-orange-500',
    },
    {
        id: 'xp',
        icon: <Trophy size={48} />,
        title: 'Verdien XP & Level Up!',
        subtitle: 'Jouw voortgang telt',
        description: 'Voor elke actie verdien je XP. Stuur berichten, ontdek nieuwe dingen, en behaal missies. Hoe meer je doet, hoe hoger je level!',
        xpExamples: [
            { action: 'Bericht versturen', xp: '+5 XP' },
            { action: 'Goede vraag stellen', xp: '+10 XP' },
            { action: 'Missie afronden', xp: '+100 XP' },
        ],
        animation: 'sparkle',
        color: 'from-yellow-500 to-amber-500',
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
        <div className="fixed inset-0 z-[200] bg-slate-900 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Gradient orbs */}
                <div className={`absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-3xl animate-pulse`} />
                <div className={`absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-3xl animate-pulse`} style={{ animationDelay: '1s' }} />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Progress Dots (non-clickable) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
                {ONBOARDING_STEPS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-white' : i < currentStep ? 'w-2 bg-white/50' : 'w-2 bg-white/20'
                            }`}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 md:p-12 pt-20 md:pt-24 overflow-y-auto">
                <div className="max-w-lg md:max-w-xl lg:max-w-2xl w-full flex flex-col items-center">

                    {/* Icon */}
                    <div className={`mx-auto mb-6 w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-2xl shrink-0`}>
                        {step.icon}
                    </div>

                    {/* Text Content */}
                    <div className="text-center mb-6 shrink-0">
                        <p className="text-xs md:text-sm font-bold text-white/50 uppercase tracking-widest mb-1 md:mb-2">
                            {step.subtitle}
                        </p>
                        <h1 className="text-2xl md:text-4xl font-black text-white mb-2 md:mb-4 tracking-tight">
                            {step.title}
                        </h1>
                        <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-md mx-auto">
                            {step.description}
                        </p>
                    </div>

                    {/* Step-specific content */}
                    {step.features && (
                        <div className="grid grid-cols-3 gap-2 mb-6 w-full">
                            {step.features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center gap-1 bg-white/5 backdrop-blur border border-white/10 rounded-xl p-3 animate-in zoom-in"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <span className="text-2xl">{feature.icon}</span>
                                    <span className="text-white font-medium text-xs text-center">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {step.demoChat && (
                        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 mb-6 space-y-3 w-full">
                            {step.demoChat.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in ${msg.role === 'user' ? 'slide-in-from-right' : 'slide-in-from-left'}`}
                                    style={{ animationDelay: `${i * 300}ms` }}
                                >
                                    <div className={`px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {step.stats && (
                        <div className="grid grid-cols-2 gap-4 mb-6 w-full">
                            {step.stats.map((stat, i) => (
                                <div
                                    key={i}
                                    className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center animate-in zoom-in"
                                    style={{ animationDelay: `${i * 200}ms` }}
                                >
                                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                                    <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {step.xpExamples && (
                        <div className="space-y-2 mb-6 w-full">
                            {step.xpExamples.map((ex, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3 animate-in slide-in-from-bottom"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <span className="text-white font-medium">{ex.action}</span>
                                    <span className="text-emerald-400 font-bold text-sm bg-emerald-400/10 px-2 py-1 rounded">{ex.xp}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 w-full mt-auto mb-4 md:mb-0">
                        {!isFirstStep && (
                            <button
                                onClick={handlePrevious}
                                className="px-6 py-4 md:py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 bg-white/10 text-white hover:bg-white/20 active:scale-95"
                            >
                                <ChevronLeft size={20} />
                                <span className="hidden md:inline">Vorige</span>
                                <span className="md:hidden">Terug</span>
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!canProceed}
                            className={`flex-1 py-4 md:py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl bg-gradient-to-r ${step.color} text-white ${canProceed ? 'hover:shadow-lg hover:scale-[1.02] active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
                        >
                            {isLastStep ? (
                                <>
                                    <Play size={20} fill="currentColor" />
                                    <span>Start je Avontuur!</span>
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
                    <p className="text-center text-slate-500 text-sm mt-2 font-medium pb-4 md:pb-0">
                        Stap {currentStep + 1} van {ONBOARDING_STEPS.length}
                    </p>
                </div>
            </div>

            {/* CSS for floating animation */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default StudentOnboarding;
