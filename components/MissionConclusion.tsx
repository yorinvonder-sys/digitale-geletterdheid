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
}

export const MissionConclusion: React.FC<MissionConclusionProps> = ({
    title = "Missie Voltooid",
    description = "Goed gedaan!",
    aiConcept = { title: "Insight", text: "AI heeft je geholpen." },
    onExit,
    onPrint,
    onDownload
}) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-50 bg-[#1A1A19]/95 backdrop-blur overflow-y-auto animate-in fade-in duration-500">
        <div className="min-h-full flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                {/* Header Pattern */}
                <div className="h-32 bg-[#D97757] relative overflow-hidden flex items-center justify-center">
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
                        <div className="bg-white text-[#D97757] px-6 py-2 rounded-full font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                            <CheckCircle2 size={24} className="text-[#10B981]" />
                            {title}
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-black text-[#1A1A19] mb-4 tracking-tight leading-tight" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        {title}
                    </h2>
                    <p className="text-lg text-[#6B6B66] font-medium mb-8 leading-relaxed" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {description}
                    </p>

                    {/* AI Insight Box */}
                    <div className={`bg-gradient-to-br from-[#FAF9F0] to-[#F0EEE8] border border-[#E8E6DF] rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <BrainCircuit size={120} />
                        </div>

                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 bg-[#FAF9F0] rounded-2xl flex items-center justify-center text-[#2A9D8F] shrink-0 border border-[#E8E6DF]">
                                <Lightbulb size={24} fill="currentColor" className="text-[#2A9D8F]" />
                            </div>
                            <div>
                                <h3 className="text-[#1A1A19] font-black text-lg uppercase tracking-wide mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                    AI Insight: {aiConcept.title}
                                </h3>
                                <div className="text-[#3D3D38] leading-relaxed space-y-2 text-sm md:text-base" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {aiConcept.text.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4 border-t border-[#F0EEE8]">
                        <div className="flex gap-2">
                            {onPrint && (
                                <button
                                    onClick={onPrint}
                                    className="px-6 py-3 bg-[#FAF9F0] text-[#3D3D38] rounded-full font-bold uppercase tracking-widest hover:bg-[#F0EEE8] hover:text-[#D97757] transition-all duration-300 flex items-center gap-2 border border-[#E8E6DF] focus-visible:ring-2 focus-visible:ring-[#D97757]"
                                >
                                    <Share2 size={18} /> Print
                                </button>
                            )}
                            {onDownload && (
                                <button
                                    onClick={onDownload}
                                    className="px-6 py-3 bg-[#FAF9F0] text-[#3D3D38] rounded-full font-bold uppercase tracking-widest hover:bg-[#F0EEE8] hover:text-[#D97757] transition-all duration-300 flex items-center gap-2 border border-[#E8E6DF] focus-visible:ring-2 focus-visible:ring-[#D97757]"
                                >
                                    <Share2 size={18} /> PDF
                                </button>
                            )}
                        </div>

                        {onExit && (
                            <button
                                onClick={onExit}
                                className="w-full md:w-auto px-8 py-4 bg-[#D97757] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#C46849] hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-[#D97757]/20 active:scale-95 flex items-center justify-center gap-3 focus-visible:ring-2 focus-visible:ring-[#D97757]"
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
