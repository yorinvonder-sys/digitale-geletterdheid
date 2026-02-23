import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Layout, Lock, Stars, BarChart3, Info, Users, Trophy, Settings, Mail, Download, Zap } from 'lucide-react';

// --- Animated Components ---

const TabsAnimation = () => (
    <div className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl flex gap-2 w-full max-w-[200px]">
            {[1, 2, 3].map((i) => (
                <div key={i} className={`h-8 rounded-lg flex-1 transition-all duration-500 flex items-center justify-center ${i === 1 ? 'bg-white shadow-lg scale-105' : 'bg-white/30'}`}>
                    <div className={`w-4 h-1 rounded-full ${i === 1 ? 'bg-indigo-500' : 'bg-white/50'}`} />
                </div>
            ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-6 h-6 bg-white rounded-full shadow-xl absolute -top-2 right-1/4 flex items-center justify-center text-indigo-500">
                <Layout size={14} />
            </div>
        </div>
    </div>
);

const StudentsAnimation = () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-2">
        <div className="w-full max-w-[180px] bg-white/20 backdrop-blur-sm rounded-xl p-2 space-y-2">
            {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2 p-1.5 bg-white/40 rounded-lg animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                    <div className="w-6 h-6 rounded-full bg-blue-400/50" />
                    <div className="h-2 w-16 bg-blue-400/30 rounded" />
                </div>
            ))}
        </div>
        <div className="flex gap-2">
            <div className="p-2 bg-white rounded-lg shadow-lg" style={{ animationDelay: '500ms' }}>
                <Mail size={16} className="text-blue-500" />
            </div>
            <div className="p-2 bg-white rounded-lg shadow-lg" style={{ animationDelay: '700ms' }}>
                <Download size={16} className="text-blue-500" />
            </div>
        </div>
    </div>
);

const GamificationAnimation = () => (
    <div className="w-full h-full flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-amber-400/20 rounded-full animate-ping" />
        </div>
        <div className="relative z-10 transform hover:scale-110 transition-transform duration-300">
            <Trophy size={48} className="text-white drop-shadow-lg" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-md">
                XP +50
            </div>
        </div>
        <div className="absolute bottom-4 flex gap-1">
            {[1, 2, 3].map((i) => (
                <Stars key={i} size={12} className="text-yellow-200 animate-spin" style={{ animationDuration: `${i + 2}s` }} />
            ))}
        </div>
    </div>
);

const HeatmapAnimation = () => (
    <div className="w-full h-full flex items-center justify-center p-6">
        <div className="grid grid-cols-3 gap-1.5 w-full max-w-[160px]">
            {[...Array(9)].map((_, i) => (
                <div
                    key={i}
                    className={`aspect-square rounded-md transition-all duration-700 ${[0, 4, 8].includes(i) ? 'bg-red-400 animate-pulse' :
                        [2, 6].includes(i) ? 'bg-emerald-400' :
                            'bg-emerald-200'
                        }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                />
            ))}
        </div>
        <div className="absolute bottom-4 right-8 bg-white text-emerald-600 p-1.5 rounded-lg shadow-lg">
            <BarChart3 size={16} />
        </div>
    </div>
);

interface Slide {
    title: string;
    description: string;
    component: React.ReactNode;
    color: string;
}

const SLIDES: Slide[] = [
    {
        title: "Nieuw: Overzichtelijke Tabs",
        description: "Het dashboard is vernieuwd! Je vindt nu alles terug in 4 logische tabs: Overzicht, Leerlingen, Gamificatie en Instellingen. Rustiger én sneller.",
        component: <TabsAnimation />,
        color: "bg-indigo-500"
    },
    {
        title: "Leerlingen & Acties",
        description: "Onder 'Leerlingen' vind je de klaslijst én acties zoals berichten sturen of CSV exporteren. Alles rondom de leerling op één plek.",
        component: <StudentsAnimation />,
        color: "bg-blue-500"
    },
    {
        title: "Gamificatie Centraal",
        description: "Leaderboards, XP Boost events en de Gouden Prompt Gallery staan nu samen onder 'Gamificatie. Alles om de klas te motiveren!",
        component: <GamificationAnimation />,
        color: "bg-amber-500"
    },
    {
        title: "Direct Inzicht",
        description: "Op het 'Overzicht' zie je direct hoe de klas er voor staat met de Begrip Heatmap en belangrijke meldingen. Focus Modus blijft altijd bovenin beschikbaar.",
        component: <HeatmapAnimation />,
        color: "bg-emerald-500"
    }
];

interface OnboardingProps {
    onClose: () => void;
}

export const TeacherOnboarding: React.FC<OnboardingProps> = ({ onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const next = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onClose();
        }
    };

    const prev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const slide = SLIDES[currentSlide];

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in duration-300">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 flex">
                    {SLIDES.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 transition-all duration-500 ${i <= currentSlide ? slide.color : 'bg-transparent'}`}
                        />
                    ))}
                </div>

                <div className="p-10 pt-14 text-center">
                    {/* Visual Container */}
                    <div className={`w-full aspect-video ${slide.color} rounded-3xl mb-8 shadow-xl overflow-hidden relative transition-all duration-500 group`}>
                        {slide.component}
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{slide.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed mb-10 min-h-[5rem]">
                        {slide.description}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={prev}
                            disabled={currentSlide === 0}
                            className={`p-4 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all ${currentSlide === 0 ? 'opacity-0' : 'opacity-100'}`}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <button
                            onClick={next}
                            className={`flex-1 py-4 ${slide.color} text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-200 hover:scale-105 transition-all active:scale-95`}
                        >
                            {currentSlide === SLIDES.length - 1 ? "Start Dashboard" : "Volgende Stap"}
                        </button>
                    </div>
                </div>

                {/* Close button top right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export const TeacherInfoButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="fixed bottom-6 right-6 w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-40 group"
        title="Info & Uitleg"
    >
        <Info size={18} />
        <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Uitleg
        </span>
    </button>
);
