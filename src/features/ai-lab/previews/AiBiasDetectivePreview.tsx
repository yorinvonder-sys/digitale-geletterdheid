import React, { useState } from 'react';
import { Search, AlertTriangle, Users, BookOpen, ArrowRight, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface Recommendation {
    title: string;
    genre: string;
    emoji: string;
}

const BOYS_RECS: Recommendation[] = [
    { title: 'De Laatste Held', genre: 'Actie', emoji: '⚔️' },
    { title: 'Oorlog der Draken', genre: 'Fantasy/Actie', emoji: '🐉' },
    { title: 'Racen naar de Top', genre: 'Sport', emoji: '🏎️' },
    { title: 'Geheime Missie X', genre: 'Thriller', emoji: '🕵️' },
];

const GIRLS_RECS: Recommendation[] = [
    { title: 'Verliefd op School', genre: 'Romance', emoji: '💕' },
    { title: 'De Dagdromer', genre: 'Romance', emoji: '🌸' },
    { title: 'Beste Vriendinnen', genre: 'Vriendschap', emoji: '👯' },
    { title: 'Sterren & Geheimen', genre: 'Romance/Drama', emoji: '✨' },
];

type BiasType = 'gender' | 'data' | 'design' | null;
type Verdict = 'eerlijk' | 'oneerlijk' | null;

const AiBiasDetectivePreview: React.FC = () => {
    const [selectedBias, setSelectedBias] = useState<BiasType>(null);
    const [verdict, setVerdict] = useState<Verdict>(null);

    return (
        <div className="w-full h-full bg-gradient-to-br from-duck-acid to-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-duck-acid to-duck-acid px-4 py-3 flex items-center gap-2">
                <Search size={18} className="text-duck-ink" />
                <span className="text-white font-bold text-sm">AI Bias Detective</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {/* Case description */}
                <div className="bg-white rounded-xl border-2 border-duck-acid overflow-hidden shadow-sm">
                    <div className="bg-duck-acid/50 px-4 py-2 flex items-center gap-2 border-b border-duck-acid">
                        <AlertTriangle size={14} className="text-duck-ink" />
                        <span className="text-xs font-bold text-duck-ink">ZAAK: Boeken-AI op school</span>
                    </div>
                    <div className="p-3">
                        <p className="text-xs text-duck-ink/60 leading-relaxed">
                            De school gebruikt een AI die automatisch boeken aanbeveelt. Maar leerlingen klagen: de aanbevelingen lijken niet eerlijk verdeeld. Onderzoek de output!
                        </p>
                    </div>
                </div>

                {/* Side-by-side recommendations */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Boys */}
                    <div className="bg-white rounded-xl border border-duck-ink/15 overflow-hidden shadow-sm">
                        <div className="bg-duck-ink px-3 py-2 border-b border-duck-ink">
                            <div className="flex items-center gap-1.5">
                                <Users size={12} className="text-white" />
                                <span className="text-[10px] font-bold text-white">AI voor jongens</span>
                            </div>
                        </div>
                        <div className="p-2 space-y-1.5">
                            {BOYS_RECS.map((rec, i) => (
                                <div key={i} className="flex items-center gap-2 bg-duck-ink/10 rounded-lg px-2 py-1.5">
                                    <span className="text-sm">{rec.emoji}</span>
                                    <div>
                                        <div className="text-[10px] font-bold text-duck-ink/60 leading-tight">{rec.title}</div>
                                        <div className="text-[9px] text-duck-ink/60">{rec.genre}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Girls */}
                    <div className="bg-white rounded-xl border border-duck-ink/15 overflow-hidden shadow-sm">
                        <div className="bg-duck-acid px-3 py-2 border-b border-duck-acid">
                            <div className="flex items-center gap-1.5">
                                <Users size={12} className="text-duck-ink" />
                                <span className="text-[10px] font-bold text-duck-ink">AI voor meisjes</span>
                            </div>
                        </div>
                        <div className="p-2 space-y-1.5">
                            {GIRLS_RECS.map((rec, i) => (
                                <div key={i} className="flex items-center gap-2 bg-duck-acid/50 rounded-lg px-2 py-1.5">
                                    <span className="text-sm">{rec.emoji}</span>
                                    <div>
                                        <div className="text-[10px] font-bold text-duck-ink/60 leading-tight">{rec.title}</div>
                                        <div className="text-[9px] text-duck-ink/60">{rec.genre}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Analysis: Bias type selection */}
                <div className="bg-white rounded-xl border border-duck-acid p-3 shadow-sm">
                    <div className="text-[10px] font-bold text-duck-ink/60 uppercase mb-2">Welk type bias zie je hier?</div>
                    <div className="space-y-1.5">
                        {([
                            { type: 'gender' as BiasType, label: 'Genderbias', desc: 'Verschil in behandeling op basis van geslacht' },
                            { type: 'data' as BiasType, label: 'Databias', desc: 'Trainingsdata was niet representatief' },
                            { type: 'design' as BiasType, label: 'Designbias', desc: 'De makers hebben stereotypen ingebouwd' },
                        ]).map(({ type, label, desc }) => (
                            <button
                                key={type}
                                onClick={() => setSelectedBias(selectedBias === type ? null : type)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${selectedBias === type ? 'bg-duck-acid text-duck-ink ring-2 ring-duck-acid' : 'bg-duck-bg text-duck-ink/60 hover:bg-duck-acid hover:text-duck-ink'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBias === type ? 'border-duck-acid bg-duck-acid' : 'border-duck-ink/15'}`}>
                                    {selectedBias === type && <CheckCircle2 size={10} className="text-duck-ink" />}
                                </div>
                                <div>
                                    <span className="font-bold">{label}</span>
                                    <span className="text-duck-ink/60 ml-1">— {desc}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Verdict */}
                <div className="bg-white rounded-xl border border-duck-acid p-3 shadow-sm">
                    <div className="text-[10px] font-bold text-duck-ink/60 uppercase mb-2">Jouw oordeel</div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setVerdict(verdict === 'eerlijk' ? null : 'eerlijk')}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${verdict === 'eerlijk' ? 'bg-duck-ink/60 text-white ring-2 ring-duck-ink' : 'bg-duck-bg text-duck-ink/60 hover:bg-duck-ink hover:text-white'}`}
                        >
                            <CheckCircle2 size={14} /> Eerlijk
                        </button>
                        <button
                            onClick={() => setVerdict(verdict === 'oneerlijk' ? null : 'oneerlijk')}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${verdict === 'oneerlijk' ? 'bg-duck-acid text-duck-ink ring-2 ring-duck-acid' : 'bg-duck-bg text-duck-ink/60 hover:bg-duck-acid hover:text-duck-ink'}`}
                        >
                            <XCircle size={14} /> Oneerlijk
                        </button>
                    </div>
                </div>

                {/* Task hint */}
                <div className="bg-duck-acid/20 border-2 border-duck-acid rounded-xl p-3">
                    <h4 className="font-bold text-duck-ink text-xs flex items-center gap-1.5">
                        <ArrowRight size={12} />
                        Onderzoek verder in de chat
                    </h4>
                    <p className="text-[11px] text-duck-ink mt-1">
                        Vergelijk de aanbevelingen. Wat valt op? Waar komt dit verschil vandaan? Hoe zou je de AI eerlijker maken?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AiBiasDetectivePreview;
