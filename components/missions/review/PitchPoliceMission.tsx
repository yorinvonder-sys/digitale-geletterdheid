import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Monitor, X, Play, Palette, Type, Layout, MousePointer, Image as ImageIcon, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import type { VsoProfile } from '../../../types';

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
        textColor: "text-slate-900",
        issue: "text-overload",
        feedback: "Véél te veel tekst! Mensen gaan dit lezen in plaats van naar jou luisteren.",
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
        bg: "bg-yellow-300",
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
        bg: "bg-purple-600",
        textColor: "text-green-400",
        font: "font-serif",
        issue: "chaos",
        feedback: "Wow, rustig aan! Te veel verschillende kleuren en lettertypes maken het onrustig.",
        customRender: (fixed) => (
            <div className={`p-8 h-full flex flex-col items-center justify-center transition-all duration-500 ${fixed ? 'bg-slate-100' : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500'}`}>
                <h1 className={`text-5xl mb-8 transition-all duration-500 ${fixed ? 'font-sans font-bold text-slate-800' : 'font-[Comic_Sans_MS] text-yellow-300 drop-shadow-lg'}`}>
                    {fixed ? "Thema: De Kermis" : "~~~ WELKOM OP DE KERMIS!!! ~~~"}
                </h1>
                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                    <div className={`p-6 rounded-xl transition-all duration-500 ${fixed ? 'bg-white shadow-md text-slate-700' : 'bg-lime-400 text-red-600 font-mono rotate-3 border-4 border-blue-500'}`}>
                        <h3 className="text-xl font-bold mb-2">Attracties</h3>
                        <p>Botsauto's & Reuzenrad</p>
                    </div>
                    <div className={`p-6 rounded-xl transition-all duration-500 ${fixed ? 'bg-white shadow-md text-slate-700' : 'bg-orange-500 text-blue-800 font-serif -rotate-2 border-dashed border-4 border-white'}`}>
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
        textColor: "text-slate-900",
        issue: "distraction",
        feedback: "Is dit een presentatie of een meme-pagina? De GIFs leiden af van je serieuze boodschap.",
        customRender: (fixed) => (
            <div className="relative h-full w-full p-8 overflow-hidden">
                <h1 className="text-4xl font-bold mb-6 relative z-10">Gevolgen van Opwarming</h1>
                <ul className="list-disc pl-6 space-y-4 text-xl relative z-10 bg-white/80 p-4 rounded-xl max-w-xl">
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20 rotate-45 font-black text-red-500">OMG!!</div>
                    </>
                )}

                {/* Relevant Image - Only visible when FIXED */}
                {fixed && (
                    <img
                        src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&h=400&fit=crop"
                        className="absolute top-20 right-20 w-64 h-48 card-shadow rounded-lg object-cover rotate-2 border-4 border-white shadow-xl animate-in fade-in zoom-in duration-700"
                        alt="Mountains"
                    />
                )}
            </div>
        ),
        options: [
            { id: 'a', text: "GIFs kleiner maken", correct: false },
            { id: 'b', text: "Vervang GIFs door één relevante foto", correct: true },
            { id: 'c', text: "Gebruik alleen tekst, geen plaatjes", correct: false }
        ]
    },
    {
        id: 5,
        title: "Samenvatting",
        content: "Bedankt voor het luisteren. Zijn er nog vragen? Je kunt me mailen op naam@school.nl voor meer info.",
        bg: "bg-slate-800",
        textColor: "text-slate-600", // Low contrast intentionally for initial state
        issue: "size",
        feedback: "Kan iemand dit lezen? De tekst is veel te klein en valt weg!",
        customRender: (fixed) => (
            <div className={`h-full flex flex-col items-center justify-center p-8 transition-all duration-500 ${fixed ? 'bg-slate-800 text-white' : 'bg-slate-800 text-slate-500'}`}>
                <h1 className={`font-bold transition-all duration-500 ${fixed ? 'text-6xl mb-8' : 'text-xs mb-2'}`}>
                    BEDANKT!
                </h1>
                <p className={`transition-all duration-500 ${fixed ? 'text-2xl' : 'text-[8px]'}`}>
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
        textColor: "text-slate-900",
        issue: "image-stretch",
        feedback: "Hé, die auto is helemaal platgedrukt! Dat ziet er gek uit.",
        customRender: (fixed) => (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold mb-8">Mijn Droomauto</h1>
                <img
                    src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop"
                    alt="Sports Car"
                    className={`transition-all duration-500 shadow-xl ${fixed ? 'w-96 h-64 object-cover rounded-xl' : 'w-96 h-32 object-fill border-4 border-red-500 rotate-1'}`}
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
        bg: "bg-slate-100",
        textColor: "text-slate-900",
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
        textColor: "text-slate-900",
        issue: "chart-chaos",
        feedback: "Help! Deze grafiek is veel te ingewikkeld en onduidelijk. Niemand snapt dit in 3 seconden.",
        customRender: (fixed) => (
            <div className="h-full flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-8">Schoolcijfers</h1>
                {fixed ? (
                    <div className="flex items-end gap-6 h-64 w-96 border-b-4 border-slate-800 p-4">
                        <div className="flex-1 bg-blue-500 rounded-t-lg h-[80%] relative group shadow-lg"><span className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-xl">8.0</span></div>
                        <div className="flex-1 bg-emerald-500 rounded-t-lg h-[70%] relative group shadow-lg"><span className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-xl">7.0</span></div>
                        <div className="flex-1 bg-amber-500 rounded-t-lg h-[75%] relative group shadow-lg"><span className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-xl">7.5</span></div>
                    </div>
                ) : (
                    <div className="relative w-72 h-72 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-[40px] border-slate-100 animate-spin-slow"></div>
                        <div className="absolute inset-0 rounded-full border-[40px] border-t-red-500 border-r-blue-500 border-b-green-500 border-l-yellow-500 opacity-80"></div>
                        <div className="absolute inset-8 rounded-full border-[20px] border-purple-500 border-dashed animate-pulse"></div>
                        <span className="font-bold text-6xl rotate-45 text-slate-300">?</span>
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
    const [showIntro, setShowIntro] = useState(true);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [slideState, setSlideState] = useState<'broken' | 'fixed'>('broken');
    const [showFeedback, setShowFeedback] = useState<boolean | null>(null); // true = correct, false = wrong

    const currentSlide = SLIDES[currentSlideIndex];
    const isFixed = slideState === 'fixed';

    const handleOptionSelect = (isCorrect: boolean) => {
        if (isCorrect) {
            setShowFeedback(true);

            // Wait a bit, then fix the slide
            setTimeout(() => {
                setSlideState('fixed');
                setShowFeedback(null);
            }, 1000);

        } else {
            setShowFeedback(false);
            setTimeout(() => setShowFeedback(null), 2000);
        }
    };

    const handleNextSlide = () => {
        if (currentSlideIndex < SLIDES.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
            setSlideState('broken');
        } else {
            onComplete(true);
        }
    };

    // INTRO SCREEN
    if (showIntro) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-slate-900 flex flex-col items-center justify-center p-6 font-sans text-white relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>

                <div className="max-w-2xl w-full text-center relative z-10">
                    {/* Icon */}
                    <div className="relative inline-block mb-8">
                        <div className="w-28 h-28 bg-gradient-to-br from-[#C43E1C] to-orange-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-orange-500/30 transform rotate-3">
                            <Monitor size={56} className="text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl shadow-lg transform -rotate-6">
                            🚨
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        Welkom bij de <span className="text-orange-400">Pitch Politie!</span>
                    </h1>

                    <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-xl mx-auto">
                        Jij bent vandaag de presentatie-expert. Help medeleerlingen hun saaie of rommelige slides te verbeteren!
                    </p>

                    {/* Instructions Card */}
                    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 mb-8 text-left">
                        <h3 className="text-sm font-black text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap size={16} /> Hoe werkt het?
                        </h3>
                        <ul className="space-y-4 text-lg">
                            <li className="flex items-start gap-4">
                                <span className="bg-orange-500/20 text-orange-400 rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">1</span>
                                <span className="text-slate-200">Je ziet <strong className="text-white">slides met fouten</strong> – te veel tekst, slechte kleuren, of chaos</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-orange-500/20 text-orange-400 rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">2</span>
                                <span className="text-slate-200">Lees het <strong className="text-white">Politie Rapport</strong> om te zien wat er mis is</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-orange-500/20 text-orange-400 rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">3</span>
                                <span className="text-slate-200">Kies de <strong className="text-white">beste oplossing</strong> om de slide te fixen</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">✓</span>
                                <span className="text-slate-200">Zie de slide <strong className="text-white">live verbeteren</strong> voor je ogen!</span>
                            </li>
                        </ul>
                    </div>

                    {/* Tips */}
                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                            <Type size={16} className="text-blue-400" />
                            <span>Minder tekst = Beter</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                            <Palette size={16} className="text-purple-400" />
                            <span>Goed contrast is key</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                            <Layout size={16} className="text-green-400" />
                            <span>Keep it simple</span>
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={() => setShowIntro(false)}
                        className="px-12 py-5 bg-gradient-to-r from-[#C43E1C] to-orange-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-orange-500/30 hover:scale-105 hover:shadow-orange-500/50 transition-all flex items-center gap-3 mx-auto group"
                    >
                        <Play size={24} fill="currentColor" />
                        Start de Inspectie
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Back button */}
                    <button
                        onClick={onBack}
                        className="mt-6 text-slate-400 hover:text-white text-sm font-medium flex items-center gap-2 mx-auto transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Terug naar missies
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-white">
            {/* PowerPoint-like Header */}
            <header className="bg-[#C43E1C] px-4 py-2 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">Presentatie1 - PowerPoint</span>
                        <div className="flex gap-4 text-[11px] text-white/80">
                            <span className="font-bold border-b border-white">Start</span>
                            <span>Invoegen</span>
                            <span>Ontwerpen</span>
                            <span>Overgangen</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                    <Play size={14} fill="currentColor" />
                    <span className="text-xs font-bold uppercase tracking-wide">Diavoorstelling</span>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-[#1a1a1a] h-1">
                <div
                    className="h-full bg-[#C43E1C] transition-all duration-500 ease-out"
                    style={{ width: `${((currentSlideIndex + (isFixed ? 1 : 0)) / SLIDES.length) * 100}%` }}
                />
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Thumbnails Sidebar */}
                <aside className="w-48 bg-[#2d2d2d] border-r border-[#3d3d3d] p-4 flex flex-col gap-4 overflow-y-auto hidden md:flex">
                    {SLIDES.map((slide, idx) => (
                        <div
                            key={slide.id}
                            className={`
                                aspect-video bg-white rounded flex items-center justify-center text-slate-900 text-[10px] p-2 relative transition-all
                                ${idx === currentSlideIndex ? 'ring-2 ring-[#C43E1C] scale-105 opacity-100' : 'opacity-40 hover:opacity-100'}
                            `}
                        >
                            <span className="font-bold text-slate-400">Dia {idx + 1}</span>
                            {idx < currentSlideIndex && (
                                <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                                    <CheckCircle size={10} className="text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </aside>

                {/* Main Slide Editor */}
                <main className="flex-1 bg-[#1a1a1a] p-8 flex items-center justify-center relative flex-col gap-6">
                    {/* The Slide Container */}
                    <div className="relative w-full max-w-4xl aspect-video group">
                        <div className={`
                            w-full h-full bg-white shadow-2xl relative overflow-hidden transition-all duration-700
                            ${!isFixed && currentSlide.issue === 'chaos' ? 'animate-pulse' : ''}
                            ${currentSlide.bg}
                            ${isFixed && currentSlide.id === 2 ? 'text-slate-900' : currentSlide.textColor}
                        `}>
                            {/* Render Custom or Default Content */}
                            {currentSlide.customRender ? (
                                currentSlide.customRender(isFixed)
                            ) : (
                                <div className="p-12 h-full flex flex-col">
                                    <h1 className="text-4xl font-bold mb-6">{currentSlide.title}</h1>
                                    <div className="text-lg leading-relaxed whitespace-pre-wrap">
                                        {isFixed && currentSlide.fixedContent ? currentSlide.fixedContent : currentSlide.content}
                                    </div>
                                </div>
                            )}

                            {/* "Bad Design" Alert Badge - Only show when NOT fixed */}
                            {!isFixed && (
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                        <AlertTriangle size={14} />
                                        <span>FOUT!</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Next Button - Appears only when Fixed */}
                    {isFixed && (
                        <button
                            onClick={handleNextSlide}
                            className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-green-500 hover:scale-105 transition-all flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in"
                        >
                            {currentSlideIndex < SLIDES.length - 1 ? 'Volgende Dia' : 'Afronden'} <ArrowRight size={20} />
                        </button>
                    )}

                    {/* Feedback Overlay */}
                    {showFeedback === true && (
                        <div className="absolute inset-0 flex items-center justify-center bg-transparent z-50 pointer-events-none">
                            <div className="bg-green-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in zoom-in slide-in-from-bottom-10 fade-in duration-300">
                                <CheckCircle size={24} />
                                <span className="font-bold text-lg">Goed Gekozen! ✨</span>
                            </div>
                        </div>
                    )}
                    {showFeedback === false && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-[1px] animate-in fade-in cursor-not-allowed">
                            <div className="bg-white text-slate-800 px-8 py-8 rounded-2xl shadow-2xl flex flex-col items-center animate-in shake">
                                <div className="bg-red-100 p-3 rounded-full mb-4">
                                    <X size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-black mb-2">Dat is niet de beste optie</h3>
                                <p className="text-slate-500 text-center">Probeer het nog eens!</p>
                            </div>
                        </div>
                    )}
                </main>

                {/* Inspector Panel - Only visible when NOT fixed */}
                <aside className={`w-80 bg-[#2d2d2d] border-l border-[#3d3d3d] flex flex-col transition-all duration-500 ${isFixed ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                                🕵️‍♂️ Politie Rapport
                            </h3>
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#3d3d3d]">
                                <p className="text-red-400 font-bold text-xs uppercase mb-1 flex items-center gap-1">
                                    <AlertTriangle size={12} /> Overtreding:
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {currentSlide.feedback}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Jouw Oplossing:</h4>
                            {currentSlide.options.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleOptionSelect(opt.correct)}
                                    className="w-full text-left p-4 rounded-xl bg-[#3d3d3d] hover:bg-[#4d4d4d] border border-transparent hover:border-[#C43E1C] transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-start gap-3 relative z-10">
                                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold group-hover:bg-[#C43E1C] transition-colors shrink-0">
                                            {opt.id.toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                                            {opt.text}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
