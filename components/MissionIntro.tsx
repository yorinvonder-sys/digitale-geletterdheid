
import React, { useState } from 'react';
import { ChevronRight, Play } from 'lucide-react';

interface IntroProject {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    image?: string;
}

interface MissionIntroProps {
    weekNumber: number;
    projects: IntroProject[];
    onFinish: () => void;
}

export const MissionIntro: React.FC<MissionIntroProps> = ({ weekNumber, projects, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    if (!projects || projects.length === 0) return null;
    const currentProject = projects[currentIndex];

    const handleNext = () => {
        if (currentIndex < projects.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onFinish();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4 pt-safe pb-safe pl-safe pr-safe">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[95vh] flex flex-col">
                <div className="p-8 md:p-12 flex flex-col items-center text-center overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
                        Dit ga jij bouwen!
                    </h3>
                    <h4 className="text-2xl md:text-3xl font-black mb-6" style={{ color: currentProject.color }}>
                        {currentProject.title}
                    </h4>

                    <p className="text-slate-500 font-bold text-lg mb-8">
                        {currentProject.description}
                    </p>

                    {/* Preview Area (Mocking Image 3) */}
                    <div className="w-full aspect-square max-w-[400px] bg-slate-50 rounded-[2.5rem] mb-10 relative flex items-center justify-center border border-slate-100 shadow-inner group overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

                        {/* Center Visual */}
                        <div className="relative z-10 w-full h-full transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                            {currentProject.image ? (
                                <img
                                    src={currentProject.image}
                                    alt={currentProject.title}
                                    className="w-full h-full object-cover rounded-[2.5rem]"
                                    decoding="async"
                                />
                            ) : (
                                <div className="scale-125">
                                    {currentProject.icon}
                                </div>
                            )}
                        </div>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-6 flex gap-2">
                            {projects.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                    >
                        {currentIndex === projects.length - 1 ? (
                            <>Start Missies <Play size={20} fill="currentColor" /></>
                        ) : (
                            <>Volgend Project <ChevronRight size={20} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
