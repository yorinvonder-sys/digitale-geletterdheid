
import React, { useState } from 'react';
import { ChevronRight, Play, Loader2 } from 'lucide-react';

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
    const [imageLoading, setImageLoading] = useState(true);
    if (!projects || projects.length === 0) return null;
    const currentProject = projects[currentIndex];

    const handleNext = () => {
        if (currentIndex < projects.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setImageLoading(true);
        } else {
            onFinish();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-duck-ink/40 backdrop-blur-xl flex items-center justify-center p-4 pt-safe pb-safe pl-safe pr-safe">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[95vh] flex flex-col border border-duck-line">
                <div className="p-8 md:p-12 flex flex-col items-center text-center overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    <h3 className="text-3xl md:text-4xl font-black text-duck-ink mb-2 tracking-tight" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        Dit ga jij bouwen!
                    </h3>
                    <h4 className="text-2xl md:text-3xl font-black mb-6" style={{ color: currentProject.color, fontFamily: "'Newsreader', Georgia, serif" }}>
                        {currentProject.title}
                    </h4>

                    <p className="text-duck-muted font-bold text-lg mb-8" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {currentProject.description}
                    </p>

                    {/* Preview Area */}
                    <div className="w-full aspect-square max-w-[400px] bg-duck-bg rounded-2xl mb-10 relative flex items-center justify-center border border-duck-line shadow-inner group overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#E7D8BD_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

                        {/* Center Visual */}
                        <div className="relative z-10 w-full h-full transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
                            {currentProject.image ? (
                                <>
                                    {imageLoading && (
                                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                                            <Loader2 size={32} className="text-duck-coral animate-spin" />
                                        </div>
                                    )}
                                    <img
                                        src={currentProject.image}
                                        alt={currentProject.title}
                                        className={`w-full h-full object-cover rounded-2xl transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                                        decoding="async"
                                        onLoad={() => setImageLoading(false)}
                                    />
                                </>
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
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-duck-coral' : 'w-2 bg-duck-line'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        aria-label={currentIndex === projects.length - 1 ? 'Start missies' : `Ga naar volgend project: ${projects[currentIndex + 1]?.title || ''}`}
                        className="w-full bg-duck-coral text-white py-6 rounded-full font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-duck-coral transition-all duration-300 shadow-xl shadow-duck-coral/20 focus-visible:ring-2 focus-visible:ring-duck-coral"
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
