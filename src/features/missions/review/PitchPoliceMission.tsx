import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Monitor, X, Play, Palette, Type, Layout, MousePointer, Image as ImageIcon, Zap, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { VsoProfile } from '@/types';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import { MissionGoalBanner } from '../templates/shared/MissionGoalBanner';

interface PitchPoliceState {
    currentSlideIndex: number;
    slideStates: Record<number, 'broken' | 'fixed'>;
    showIntro: boolean;
}

interface PitchPoliceProps {
    onComplete: (success: boolean) => void;
    onBack: () => void;
    vsoProfile?: VsoProfile;
}

interface SlideOption {
    id: string;
    text: string;
    correct: boolean;
}

interface SlideData {
    id: number;
    title: string;
    content: string;
    fixedContent?: React.ReactNode; // Optional custom fixed content
    bg: string;
    textColor: string;
    font?: string;
    images?: string[];
    issue: string; // text-overload, contrast, chaos, distraction, size
    feedback: string;
    options: SlideOption[];
    customRender?: (fixed: boolean) => React.ReactNode; // For complex slides like Chaos/GIFs
}

const SLIDES: SlideData[] = [
    {
        id: 1,
        title: "Mijn Hobby: Gamen",
        content: "In deze presentatie ga ik vertellen over mijn hobby. Mijn hobby is gamen en dat doe ik heel vaak. Ik speel vooral Minecraft en Fortnite. In Minecraft bouw ik huizen en kastelen en in Fortnite probeer ik te winnen. Het is heel leuk omdat je met vrienden kan spelen. Ik speel meestal op mijn PlayStation maar soms ook op de computer. Gamen is goed voor je reactiesnelheid en je leert samenwerken. Maar je moet niet te lang spelen want dat is slecht voor je ogen. Ik speel ongeveer 2 uur per dag.",
        fixedContent: (
            <ul className="list-disc pl-6 space-y-2 text-2xl">
                <li>Hobby: Gamen (Minecraft & Fortnite)</li>
                <li>Leuk aspect: Samenwerken met vrienden</li>
                <li>Platform: PlayStation & PC</li>
                <li>Voordelen: Reactiesnelheid & teamwork</li>
                <li>Let op: Maximaal 2 uur per dag</li>
            </ul>
        ),
        bg: "bg-white",
        textColor: "text-[#08283B]",
        issue: "text-overload",
        feedback: "Veel te veel tekst! Mensen gaan dit lezen in plaats van naar jou luisteren.",
        options: [
            { id: 'a', text: "Tekst kleiner maken zodat het beter past", correct: false },
            { id: 'b', text: "Samenvatten in steekwoorden (bulletpoints)", correct: true },
            { id: 'c', text: "Leuke achtergrondmuziek toevoegen", correct: false }
        ]
    },
    {
        id: 2,
        title: "Mijn Vakantie",
        content: "In de zomer ging ik naar Spanje",
        bg: "bg-lab-gold",
        textColor: "text-white",
        issue: "contrast",
        feedback: "Au! Witte tekst op een gele achtergrond is onleesbaar.",
        options: [
            { id: 'a', text: "Tekst zwart maken voor beter contrast", correct: true },
            { id: 'b', text: "Achtergrond nog feller geel maken", correct: false },
            { id: 'c', text: "Alle letters in HOOFDLETTERS typen", correct: false }
        ]
    },
    {
        id: 3,
        title: "De Kermis",
        content: "Welkom op de kermis!",
        bg: "bg-lab-teal",
        textColor: "text-lab-sage",
        font: "font-serif",
        issue: "chaos",
        feedback: "Wow, rustig aan! Te veel verschillende kleuren en lettertypes maken het onrustig.",
        customRender: (fixed) => (
            <div className={`p-8 h-full flex flex-col items-center justify-center transition-all duration-500 ${fixed ? 'bg-[#FCF6EA]' : 'bg-gradient-to-r from-lab-coral via-lab-coral to-lab-coral'}`}>
                <h1 className={`text-5xl mb-8 transition-all duration-500 ${fixed ? 'font-bold text-[#08283B]' : 'font-[Comic_Sans_MS] text-lab-gold drop-shadow-lg'}`} style={fixed ? { fontFamily: "'Newsreader', Georgia, serif" } : undefined}>
                    {fixed ? "Thema: De Kermis" : "~~~ WELKOM OP DE KERMIS!!! ~~~"}
                </h1>
                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                    <div className={`p-6 rounded-2xl transition-all duration-500 ${fixed ? 'bg-white shadow-md text-[#445865] border border-[#E7D8BD]' : 'bg-lab-sage text-white font-mono rotate-3 border-4 border-lab-coral'}`}>
                        <h3 className="text-xl font-bold mb-2">Attracties</h3>
                        <p>Botsauto's & Reuzenrad</p>
                    </div>
                    <div className={`p-6 rounded-2xl transition-all duration-500 ${fixed ? 'bg-white shadow-md text-[#445865] border border-[#E7D8BD]' : 'bg-lab-coral text-white font-serif -rotate-2 border-dashed border-4 border-white'}`}>
                        <h3 className="text-xl font-bold mb-2">Eten</h3>
                        <p>Suikerspin & Popcorn</p>
                    </div>
                </div>
            </div>
        ),
        options: [
            { id: 'a', text: "Nog meer kleuren toevoegen voor de sfeer", correct: false },
            { id: 'b', text: "Kies 1 rustige stijl en maximaal 3 kleuren", correct: true },
            { id: 'c', text: "Alles laten bewegen", correct: false }
        ]
    },
    {
        id: 4,
        title: "Klimaatverandering",
        content: "Het klimaat verandert. De aarde warmt op.",
        bg: "bg-white",
        textColor: "text-[#08283B]",
        issue: "distraction",
        feedback: "Is dit een presentatie of een meme-pagina? De GIFs leiden af van je serieuze boodschap.",
        customRender: (fixed) => (
            <div className="relative h-full w-full p-8 overflow-hidden">
                <h1 className="text-4xl font-bold mb-6 relative z-10" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Gevolgen van Opwarming</h1>
                <ul className="list-disc pl-6 space-y-4 text-xl relative z-10 bg-white/80 p-4 rounded-2xl max-w-xl" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    <li>Stijgende zeespiegel</li>
                    <li>Extreme weersomstandigheden</li>
                    <li>Verlies van biodiversiteit</li>
                </ul>

                {/* Distracting Elements - Only visible when NOT fixed */}
                {!fixed && (
                    <>
                        <img src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" className="absolute top-4 right-4 w-32 h-32 rotate-12" alt="Distraction" loading="lazy" decoding="async" />
                        <img src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif" className="absolute bottom-4 right-20 w-40 h-40 -rotate-6" alt="Cat" loading="lazy" decoding="async" />
                        <img src="https://media.giphy.com/media/l0MYJnJQ4EiYLxvQ4/giphy.gif" className="absolute bottom-10 left-10 w-24 h-24" alt="Dancing" loading="lazy" decoding="async" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20 rotate-45 font-black text-lab-muted">OMG!!</div>
                    </>
                )}

                {/* Relevant Image - Only visible when FIXED */}
                {fixed && (
                    <img
                        src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&h=400&fit=crop"
                        className="absolute top-20 right-20 w-64 h-48 rounded-2xl object-cover rotate-2 border-4 border-white shadow-xl animate-in fade-in zoom-in duration-700"
                        alt="Mountains"
                    />
                )}
            </div>
        ),
        options: [
            { id: 'a', text: "GIFs kleiner maken", correct: false },
            { id: 'b', text: "Vervang GIFs door een relevante foto", correct: true },
            { id: 'c', text: "Gebruik alleen tekst, geen plaatjes", correct: false }
        ]
    },
    {
        id: 5,
        title: "Samenvatting",
        content: "Bedankt voor het luisteren. Zijn er nog vragen? Je kunt me mailen op naam@school.nl voor meer info.",
        bg: "bg-[#08283B]",
        textColor: "text-[#445865]", // Low contrast intentionally for initial state
        issue: "size",
        feedback: "Kan iemand dit lezen? De tekst is veel te klein en valt weg!",
        customRender: (fixed) => (
            <div className={`h-full flex flex-col items-center justify-center p-8 transition-all duration-500 ${fixed ? 'bg-[#08283B] text-white' : 'bg-[#08283B] text-[#445865]'}`}>
                <h1 className={`font-bold transition-all duration-500 ${fixed ? 'text-6xl mb-8' : 'text-xs mb-2'}`} style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    BEDANKT!
                </h1>
                <p className={`transition-all duration-500 ${fixed ? 'text-2xl' : 'text-[8px]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Zijn er nog vragen?
                </p>
            </div>
        ),
        options: [
            { id: 'a', text: "Gebruik een vergrootglas icoon", correct: false },
            { id: 'b', text: "Zet alles in Hoofdletters", correct: false },
            { id: 'c', text: "Maak de tekst GROOT en duidelijk", correct: true }
        ]
    },
    {
        id: 6,
        title: "Droomauto",
        content: "Dit is de auto die ik later wil kopen.",
        bg: "bg-white",
        textColor: "text-[#08283B]",
        issue: "image-stretch",
        feedback: "Die auto is helemaal platgedrukt! Dat ziet er gek uit.",
        customRender: (fixed) => (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Mijn Droomauto</h1>
                <img
                    src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop"
                    alt="Sports Car"
                    className={`transition-all duration-500 shadow-xl ${fixed ? 'w-96 h-64 object-cover rounded-2xl' : 'w-96 h-32 object-fill border-4 border-lab-coral rotate-1'}`}
                />
            </div>
        ),
        options: [
            { id: 'a', text: "Afbeelding uitrekken tot hij past", correct: false },
            { id: 'b', text: "Originele verhoudingen behouden (Shift)", correct: true },
            { id: 'c', text: "Een lagere auto kopen", correct: false }
        ]
    },
    {
        id: 7,
        title: "Waarom ik fan ben",
        content: "Ik vint het egt heel leuk omdat hun goeie musiek maken en ik luister er elken dag naar.",
        bg: "bg-[#FCF6EA]",
        textColor: "text-[#08283B]",
        issue: "spelling",
        feedback: "Ai... Zoveel taalfouten leiden af van je verhaal. Het staat ook een beetje slordig.",
        fixedContent: "Ik vind het echt heel leuk, omdat ze goede muziek maken. Ik luister er elke dag naar.",
        options: [
            { id: 'a', text: "Het maakt niet uit, als ze het maar snappen", correct: false },
            { id: 'b', text: "Gebruik de spellingcontrole", correct: true },
            { id: 'c', text: "Schrijf alles in het Engels", correct: false }
        ]
    },
    {
        id: 8,
        title: "Mijn Cijfers",
        content: "Hier zie je een overzicht van mijn schoolcijfers.",
        bg: "bg-white",
        textColor: "text-[#08283B]",
        issue: "chart-chaos",
        feedback: "Help! Deze grafiek is veel te ingewikkeld en onduidelijk. Niemand snapt dit in 3 seconden.",
        customRender: (fixed) => (
            <div className="h-full flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Schoolcijfers</h1>
                {fixed ? (
                    <div className="flex items-end gap-6 h-64 w-96 border-b-4 border-[#08283B] p-4">
                        <div className="flex-1 bg-[#5F947D] rounded-t-lg h-[80%] relative group shadow-lg"><span className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-xl">8.0</span></div>
                        <div className="flex-1 bg-[#D97848] rounded-t-lg h-[70%] relative group shadow-lg"><span className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-xl">7.0</span></div>
                        <div className="flex-1 bg-[#0B453F] rounded-t-lg h-[75%] relative group shadow-lg"><span className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-xl">7.5</span></div>
                    </div>
                ) : (
                    <div className="relative w-72 h-72 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-[40px] border-[#E7D8BD] animate-spin-slow"></div>
                        <div className="absolute inset-0 rounded-full border-[40px] border-t-lab-coral border-r-[#5F947D] border-b-[#5F947D] border-l-[#D97848] opacity-80"></div>
                        <div className="absolute inset-8 rounded-full border-[20px] border-[#0B453F] border-dashed animate-pulse"></div>
                        <span className="font-bold text-6xl rotate-45 text-[#E7D8BD]">?</span>
                    </div>
                )}
            </div>
        ),
        options: [
            { id: 'a', text: "Maak er een 3D draaiende taart van", correct: false },
            { id: 'b', text: "Gebruik een heldere staafgrafiek", correct: true },
            { id: 'c', text: "Zet alle cijfers in een lange tekst", correct: false }
        ]
    }
];

export const PitchPoliceMission: React.FC<PitchPoliceProps> = ({ onComplete, onBack }) => {
    const { state, setState, clearSave } = useMissionAutoSave<PitchPoliceState>(
        'pitch-police',
        {
            currentSlideIndex: 0,
            slideStates: {},
            showIntro: true,
        }
    );

    const { currentSlideIndex, slideStates, showIntro } = state;

    // Transient UI state - niet opgeslagen
    const [showFeedback, setShowFeedback] = useState<boolean | null>(null);
    const [showMobileInspector, setShowMobileInspector] = useState(false);
    const [visibleIntroSteps, setVisibleIntroSteps] = useState(0);

    const introSteps = [
        { label: 'Bekijk slides', strong: 'met fouten' },
        { label: 'Lees het', strong: 'Politie Rapport' },
        { label: 'Kies de', strong: 'beste oplossing' },
        { label: 'Zie de slide', strong: 'live verbeteren' },
    ];

    useEffect(() => {
        if (!showIntro) return;

        setVisibleIntroSteps(0);
        const timers = introSteps.map((_, index) =>
            window.setTimeout(() => setVisibleIntroSteps(index + 1), 700 + index * 1000)
        );

        return () => timers.forEach(window.clearTimeout);
    }, [showIntro]);

    const currentSlide = SLIDES[currentSlideIndex];
    const slideState = slideStates[currentSlideIndex] || 'broken';
    const isFixed = slideState === 'fixed';

    const handleOptionSelect = (isCorrect: boolean) => {
        if (isCorrect) {
            setShowFeedback(true);

            // Wait a bit, then fix the slide
            setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    slideStates: { ...prev.slideStates, [prev.currentSlideIndex]: 'fixed' },
                }));
                setShowFeedback(null);
                setShowMobileInspector(false);
            }, 1000);

        } else {
            setShowFeedback(false);
            setTimeout(() => setShowFeedback(null), 2000);
        }
    };

    const handleNextSlide = () => {
        if (currentSlideIndex < SLIDES.length - 1) {
            setState(prev => ({
                ...prev,
                currentSlideIndex: prev.currentSlideIndex + 1,
            }));
        } else {
            clearSave();
            onComplete(true);
        }
    };

    const handlePrevSlide = () => {
        if (currentSlideIndex > 0) {
            setState(prev => ({
                ...prev,
                currentSlideIndex: prev.currentSlideIndex - 1,
            }));
        }
    };

    // INTRO SCREEN
    if (showIntro) {
        const introReady = visibleIntroSteps >= introSteps.length;

        return (
            <div className="h-screen bg-[#FCF6EA] flex flex-col items-center justify-center p-4 text-[#08283B] relative overflow-hidden" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-xl w-full text-center relative z-10">
                    {/* Icon + Title row */}
                    <div className="flex items-center justify-center gap-4 mb-3">
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 bg-[#D97848] rounded-2xl flex items-center justify-center shadow-xl shadow-[#D97848]/25 rotate-3">
                                <Monitor size={32} className="text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#5F947D] rounded-lg flex items-center justify-center text-sm shadow-lg -rotate-6 text-white font-bold">
                                !
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-left" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            <span className="text-[#08283B]">Pitch Politie</span>
                        </h1>
                    </div>

                    <p className="text-base text-[#445865] mb-5 max-w-md mx-auto">
                        Jij bent de presentatie-expert. Help medeleerlingen hun rommelige slides te verbeteren!
                    </p>

                    <MissionGoalBanner goal={getMissionGoal('pitch-police')!} compact className="mb-5" />

                    {/* Instructions Card — compact */}
                    <div className="bg-[#FFFDF7] border border-[#E7D8BD] rounded-xl p-5 mb-5 text-left shadow-sm">
                        <h3 className="text-xs font-black text-[#D97848] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Zap size={14} /> Hoe werkt het?
                        </h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            {introSteps.map((step, index) => {
                                const visible = visibleIntroSteps > index;
                                const isLast = index === introSteps.length - 1;

                                return (
                                    <div
                                        key={step.label}
                                        className={`flex items-start gap-2 transition-all duration-500 ${
                                            visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                                        }`}
                                    >
                                        <span className={`${isLast ? 'bg-[#5F947D]/10 text-[#5F947D]' : 'bg-[#D97848]/10 text-[#D97848]'} rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs`}>
                                            {isLast ? '✓' : index + 1}
                                        </span>
                                        <span className="text-[#445865]">{step.label} <strong className="text-[#08283B]">{step.strong}</strong></span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        <div className="bg-[#FFFDF7] border border-[#E7D8BD] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs">
                            <Type size={14} className="text-[#5F947D]" />
                            <span className="text-[#445865]">Minder tekst = beter</span>
                        </div>
                        <div className="bg-[#FFFDF7] border border-[#E7D8BD] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs">
                            <Palette size={14} className="text-[#0B453F]" />
                            <span className="text-[#445865]">Goed contrast</span>
                        </div>
                        <div className="bg-[#FFFDF7] border border-[#E7D8BD] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs">
                            <Layout size={14} className="text-[#5F947D]" />
                            <span className="text-[#445865]">Rustige layout</span>
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={() => {
                            if (introReady) setState(prev => ({ ...prev, showIntro: false }));
                        }}
                        disabled={!introReady}
                        className={`px-10 py-4 rounded-full font-black text-lg shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto group focus-visible:ring-2 focus-visible:ring-[#0B453F] ${
                            introReady
                                ? 'bg-[#D7C95F] text-[#08283B] shadow-[#D7C95F]/30 hover:scale-105'
                                : 'bg-[#E7D8BD] text-[#445865] shadow-none cursor-not-allowed'
                        }`}
                    >
                        <Play size={20} fill="currentColor" />
                        {introReady ? 'Start de Inspectie' : 'Lees eerst de stappen'}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Back button */}
                    <button
                        onClick={onBack}
                        className="mt-4 text-[#445865] hover:text-[#0B453F] text-sm font-medium flex items-center gap-2 mx-auto transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#0B453F] rounded-full px-3 py-1"
                    >
                        <ArrowLeft size={16} />
                        Terug naar missies
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-lab-cream flex flex-col text-lab-ink" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
            {/* PowerPoint-like Header */}
            <header className="bg-lab-teal px-3 py-2 sm:px-4 flex items-center justify-between gap-2 overflow-hidden shadow-md text-white">
                <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex min-w-0 flex-col">
                        <span className="max-w-[210px] truncate text-sm font-medium sm:max-w-none">Presentatie1 - PowerPoint</span>
                        <div className="hidden gap-4 text-[11px] text-white/80 sm:flex">
                            <span className="font-bold border-b border-white">Start</span>
                            <span>Invoegen</span>
                            <span>Ontwerpen</span>
                            <span>Overgangen</span>
                        </div>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 bg-lab-gold px-2 py-1.5 sm:px-3 rounded-full text-lab-ink">
                    <Play size={14} fill="currentColor" />
                    <span className="hidden text-xs font-bold uppercase tracking-wide sm:inline">Diavoorstelling</span>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-lab-line h-1">
                <div
                    className="h-full bg-lab-gold transition-all duration-500 ease-out"
                    style={{ width: `${((currentSlideIndex + (isFixed ? 1 : 0)) / SLIDES.length) * 100}%` }}
                />
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Thumbnails Sidebar - hidden on mobile */}
                <aside className="w-48 bg-lab-paper border-r border-lab-line p-4 flex-col gap-4 overflow-y-auto hidden lg:flex">
                    {SLIDES.map((slide, idx) => (
                        <div
                            key={slide.id}
                            className={`
                                aspect-video rounded-lg border flex items-center justify-center text-lab-ink text-[10px] p-2 relative transition-all duration-300
                                ${idx === currentSlideIndex ? 'bg-lab-paper border-lab-coral ring-2 ring-lab-coral scale-105 opacity-100 shadow-sm' : 'bg-lab-cream border-lab-line opacity-70 hover:opacity-100'}
                            `}
                        >
                            <span className="font-bold text-lab-muted">Dia {idx + 1}</span>
                            {slideStates[idx] === 'fixed' && (
                                <div className="absolute top-1 right-1 bg-lab-sage rounded-full p-0.5">
                                    <CheckCircle size={10} className="text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </aside>

                {/* Main Slide Editor */}
                <main className="flex-1 bg-lab-teal p-4 lg:p-8 flex items-center justify-center relative flex-col gap-4 lg:gap-6">
                    {/* The Slide Container */}
                    <div className="relative w-full max-w-4xl aspect-video group">
                        <div className={`
                            w-full h-full bg-lab-paper shadow-2xl relative overflow-hidden transition-all duration-700
                            ${!isFixed && currentSlide.issue === 'chaos' ? 'animate-pulse' : ''}
                            ${currentSlide.bg}
                            ${isFixed && currentSlide.id === 2 ? 'text-[#08283B]' : currentSlide.textColor}
                        `}>
                            {/* Render Custom or Default Content */}
                            {currentSlide.customRender ? (
                                currentSlide.customRender(isFixed)
                            ) : (
                                <div className="p-12 h-full flex flex-col bg-lab-paper">
                                    <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{currentSlide.title}</h1>
                                    <div className="text-lg leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {isFixed && currentSlide.fixedContent ? currentSlide.fixedContent : currentSlide.content}
                                    </div>
                                </div>
                            )}

                            {/* "Bad Design" Alert Badge - Only show when NOT fixed */}
                            {!isFixed && (
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-lab-coral text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-lab-coral">
                                        <AlertTriangle size={14} />
                                        <span>FOUT!</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {isFixed && (
                        <div className="flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in">
                            {currentSlideIndex > 0 && (
                                <button
                                    onClick={handlePrevSlide}
                                    className="bg-lab-muted text-white px-4 py-3 rounded-full font-bold text-sm lg:text-lg shadow-lg hover:bg-lab-muted hover:scale-105 transition-all duration-300 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-lab-muted"
                                >
                                    <ChevronLeft size={20} /> <span className="hidden sm:inline">Vorige</span>
                                </button>
                            )}
                            <button
                                onClick={handleNextSlide}
                                className="bg-lab-sage text-white px-6 lg:px-8 py-3 rounded-full font-bold text-sm lg:text-lg shadow-lg hover:bg-lab-sage hover:text-white hover:scale-105 transition-all duration-300 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-lab-sage"
                            >
                                {currentSlideIndex < SLIDES.length - 1 ? 'Volgende Dia' : 'Afronden'} <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* Mobile slide indicator dots */}
                    <div className="flex lg:hidden items-center gap-1.5">
                        {SLIDES.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    idx === currentSlideIndex
                                        ? 'bg-lab-coral w-6'
                                        : slideStates[idx] === 'fixed'
                                            ? 'bg-lab-sage'
                                            : 'bg-lab-muted'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Mobile Inspector Toggle */}
                    {!isFixed && (
                        <button
                            onClick={() => setShowMobileInspector(!showMobileInspector)}
                            className="lg:hidden bg-lab-gold text-lab-ink px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-lab-gold transition-all duration-300 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-lab-teal"
                        >
                            <AlertTriangle size={16} /> Bekijk Rapport & Opties
                        </button>
                    )}

                    {/* Feedback Overlay */}
                    {showFeedback === true && (
                        <div className="absolute inset-0 flex items-center justify-center bg-transparent z-50 pointer-events-none">
                            <div className="bg-lab-sage text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in zoom-in slide-in-from-bottom-10 fade-in duration-300">
                                <CheckCircle size={24} />
                                <span className="font-bold text-lg">Goed Gekozen!</span>
                            </div>
                        </div>
                    )}
                    {showFeedback === false && (
                        <div className="absolute inset-0 flex items-center justify-center bg-lab-teal/40 z-50 backdrop-blur-[1px] animate-in fade-in cursor-not-allowed">
                            <div className="bg-lab-paper text-lab-ink px-8 py-8 rounded-2xl shadow-2xl flex flex-col items-center animate-in shake">
                                <div className="bg-lab-coral p-3 rounded-full mb-4">
                                    <X size={32} className="text-lab-muted" />
                                </div>
                                <h3 className="text-xl font-black mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Dat is niet de beste optie</h3>
                                <p className="text-lab-muted text-center">Probeer het nog eens!</p>
                            </div>
                        </div>
                    )}
                </main>

                {/* Inspector Panel - Desktop: sidebar, Mobile: bottom sheet */}
                <aside className={`
                    hidden lg:flex w-80 bg-lab-paper border-l border-lab-line flex-col transition-all duration-500
                    ${isFixed ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}
                `}>
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-black text-lab-ink mb-2 flex items-center gap-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                Politie Rapport
                            </h3>
                            <div className="bg-lab-cream p-4 rounded-2xl border border-lab-line">
                                <p className="text-lab-coral font-bold text-xs uppercase mb-1 flex items-center gap-1">
                                    <AlertTriangle size={12} /> Overtreding:
                                </p>
                                <p className="text-lab-muted text-sm leading-relaxed">
                                    {currentSlide.feedback}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-lab-muted uppercase tracking-widest pl-1">Jouw Oplossing:</h4>
                            {currentSlide.options.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleOptionSelect(opt.correct)}
                                    className="w-full text-left p-4 rounded-2xl bg-lab-cream hover:bg-lab-teal border border-lab-line hover:border-lab-teal transition-all duration-300 group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-lab-teal"
                                >
                                    <div className="flex items-start gap-3 relative z-10">
                                        <div className="w-6 h-6 rounded-full bg-lab-teal text-white flex items-center justify-center text-xs font-bold group-hover:bg-lab-gold group-hover:text-lab-ink transition-all duration-300 shrink-0">
                                            {opt.id.toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-lab-muted group-hover:text-white">
                                            {opt.text}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Mobile Inspector Bottom Sheet */}
                {showMobileInspector && !isFixed && (
                    <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                        <div className="absolute inset-0 bg-lab-teal/40 backdrop-blur-sm" onClick={() => setShowMobileInspector(false)} />
                        <div className="relative bg-lab-paper rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom fade-in duration-300">
                            <div className="w-10 h-1 bg-lab-line rounded-full mx-auto mb-4" />
                            <div className="mb-4">
                                <h3 className="text-lg font-black text-lab-ink mb-2 flex items-center gap-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                    Politie Rapport
                                </h3>
                                <div className="bg-lab-cream p-4 rounded-2xl border border-lab-line">
                                    <p className="text-lab-coral font-bold text-xs uppercase mb-1 flex items-center gap-1">
                                        <AlertTriangle size={12} /> Overtreding:
                                    </p>
                                    <p className="text-lab-muted text-sm leading-relaxed">
                                        {currentSlide.feedback}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-lab-muted uppercase tracking-widest pl-1">Jouw Oplossing:</h4>
                                {currentSlide.options.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleOptionSelect(opt.correct)}
                                        className="w-full text-left p-4 rounded-2xl bg-lab-cream hover:bg-lab-teal border border-lab-line hover:border-lab-teal transition-all duration-300 group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-lab-teal"
                                    >
                                        <div className="flex items-start gap-3 relative z-10">
                                            <div className="w-6 h-6 rounded-full bg-lab-teal flex items-center justify-center text-xs font-bold group-hover:bg-lab-gold group-hover:text-lab-ink transition-all duration-300 shrink-0 text-white">
                                                {opt.id.toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-lab-muted group-hover:text-white">
                                                {opt.text}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
