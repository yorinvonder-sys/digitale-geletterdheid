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
        <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                {/* Header Pattern */}
                <div className="h-32 bg-indigo-600 relative overflow-hidden flex items-center justify-center">
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
                        <div className="bg-white text-indigo-600 px-6 py-2 rounded-full font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                            <CheckCircle2 size={24} className="text-green-500" />
                            {title}
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-500 font-medium mb-8 leading-relaxed">
                        {description}
                    </p>

                    {/* AI Insight Box */}
                    <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <BrainCircuit size={120} />
                        </div>

                        <div className="flex items-start gap-4 relatie z-10">
                            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                                <Lightbulb size={24} fill="currentColor" className="text-indigo-500" />
                            </div>
                            <div>
                                <h3 className="text-indigo-900 font-black text-lg uppercase tracking-wide mb-2">
                                    AI Insight: {aiConcept.title}
                                </h3>
                                <div className="text-indigo-800/80 leading-relaxed space-y-2 text-sm md:text-base">
                                    {aiConcept.text.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex gap-2">
                            {onPrint && (
                                <button
                                    onClick={onPrint}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-100 hover:text-indigo-700 transition-all flex items-center gap-2"
                                >
                                    <Share2 size={18} /> Print
                                </button>
                            )}
                            {onDownload && (
                                <button
                                    onClick={onDownload}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-100 hover:text-indigo-700 transition-all flex items-center gap-2"
                                >
                                    <Share2 size={18} /> PDF
                                </button>
                            )}
                        </div>

                        {onExit && (
                            <button
                                onClick={onExit}
                                className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-600 hover:scale-[1.02] transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                Terug naar Mission Control <ArrowRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
