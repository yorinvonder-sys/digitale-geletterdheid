import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle2, ArrowRight, BrainCircuit, Share2 } from 'lucide-react';

interface MissionConclusionProps {
    title?: string;
    description?: string;
    aiConcept?: {
        title: string;
        text: string;
    };
    onExit?: () => void;
    onPrint?: () => void;
    onDownload?: () => void;
    children?: React.ReactNode;
}

export const MissionConclusion: React.FC<MissionConclusionProps> = ({
    title = "Missie Voltooid",
    description = "Goed gedaan!",
    aiConcept = { title: "Insight", text: "AI heeft je geholpen." },
    onExit,
    onPrint,
    onDownload,
    children
}) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-50 bg-[#08283B]/95 backdrop-blur overflow-y-auto animate-in fade-in duration-500">
        <div className="min-h-full flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                {/* Header Pattern */}
                <div className="h-32 bg-[#D97848] relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="absolute bg-white rounded-full w-2 h-2" style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                opacity: Math.random()
                            }}></div>
                        ))}
                    </div>
                    <div className={`transform transition-all duration-700 ${showContent ? 'scale-100 translate-y-0' : 'scale-50 translate-y-10 opacity-0'}`}>
                        <div className="bg-white text-[#D97848] px-6 py-2 rounded-full font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                            <CheckCircle2 size={24} className="text-[#5F947D]" />
                            {title}
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-black text-[#08283B] mb-4 tracking-tight leading-tight" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        {title}
                    </h2>
                    <p className="text-lg text-[#445865] font-medium mb-8 leading-relaxed" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {description}
                    </p>

                    {/* AI Insight Box */}
                    <div className={`bg-gradient-to-br from-[#FCF6EA] to-[#E7D8BD] border border-[#E7D8BD] rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <BrainCircuit size={120} />
                        </div>

                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 bg-[#FCF6EA] rounded-2xl flex items-center justify-center text-[#5F947D] shrink-0 border border-[#E7D8BD]">
                                <Lightbulb size={24} fill="currentColor" className="text-[#5F947D]" />
                            </div>
                            <div>
                                <h3 className="text-[#08283B] font-black text-lg uppercase tracking-wide mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                    AI Insight: {aiConcept.title}
                                </h3>
                                <div className="text-[#445865] leading-relaxed space-y-2 text-sm md:text-base" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {aiConcept.text.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {children}

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4 border-t border-[#E7D8BD]">
                        <div className="flex gap-2">
                            {onPrint && (
                                <button
                                    onClick={onPrint}
                                    className="px-6 py-3 bg-[#FCF6EA] text-[#445865] rounded-full font-bold uppercase tracking-widest hover:bg-[#E7D8BD] hover:text-[#D97848] transition-all duration-300 flex items-center gap-2 border border-[#E7D8BD] focus-visible:ring-2 focus-visible:ring-[#D97848]"
                                >
                                    <Share2 size={18} /> Print
                                </button>
                            )}
                            {onDownload && (
                                <button
                                    onClick={onDownload}
                                    className="px-6 py-3 bg-[#FCF6EA] text-[#445865] rounded-full font-bold uppercase tracking-widest hover:bg-[#E7D8BD] hover:text-[#D97848] transition-all duration-300 flex items-center gap-2 border border-[#E7D8BD] focus-visible:ring-2 focus-visible:ring-[#D97848]"
                                >
                                    <Share2 size={18} /> PDF
                                </button>
                            )}
                        </div>

                        {onExit && (
                            <button
                                onClick={onExit}
                                className="w-full md:w-auto px-8 py-4 bg-[#D97848] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#D97848] hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-[#D97848]/20 active:scale-95 flex items-center justify-center gap-3 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                            >
                                Terug naar Mission Control <ArrowRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};
