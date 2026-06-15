import React, { useState } from 'react';
import { FileSearch, AlertTriangle, CheckCircle2, HelpCircle, Clock, User, Globe, Target, ChevronDown, ChevronUp } from 'lucide-react';

interface CraapItem {
    letter: string;
    label: string;
    question: string;
    icon: React.ReactNode;
}

const CRAAP_ITEMS: CraapItem[] = [
    { letter: 'C', label: 'Currency', question: 'Hoe oud is deze informatie?', icon: <Clock size={14} /> },
    { letter: 'R', label: 'Relevance', question: 'Past dit bij wat ik zoek?', icon: <Target size={14} /> },
    { letter: 'A', label: 'Authority', question: 'Wie heeft dit geschreven?', icon: <User size={14} /> },
    { letter: 'A', label: 'Accuracy', question: 'Wordt het bewijs geleverd?', icon: <CheckCircle2 size={14} /> },
    { letter: 'P', label: 'Purpose', question: 'Waarom is dit geschreven?', icon: <Globe size={14} /> },
];

const FactcheckerPreview: React.FC = () => {
    const [ratings, setRatings] = useState<Record<number, 'ok' | 'twijfel' | 'nep' | null>>({});
    const [showChecklist, setShowChecklist] = useState(true);

    const setRating = (index: number, value: 'ok' | 'twijfel' | 'nep') => {
        setRatings(prev => ({ ...prev, [index]: prev[index] === value ? null : value }));
    };

    const filledCount = Object.values(ratings).filter(v => v !== null && v !== undefined).length;

    return (
        <div className="w-full h-full bg-gradient-to-br from-duck-ink to-duck-bgLight flex flex-col overflow-hidden">
            {/* Header */}
            <div className="shrink-0 bg-duck-ink px-4 py-3 flex items-center gap-2">
                <FileSearch size={18} className="text-duck-acid" />
                <span className="text-white font-bold text-sm">Factcheck Werkblad</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {/* Fake news article */}
                <div className="bg-white rounded-xl border-2 border-duck-acid overflow-hidden shadow-sm">
                    <div className="bg-duck-acid/50 px-4 py-2 flex items-center gap-2 border-b border-duck-acid">
                        <AlertTriangle size={14} className="text-duck-ink" />
                        <span className="text-xs font-bold text-duck-ink">BEWERING OM TE CHECKEN</span>
                    </div>
                    <div className="p-4">
                        <h3 className="font-black text-duck-ink text-sm leading-tight">
                            "Scholen gaan per 2027 over op vierdaagse schoolweek"
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-duck-ink/60">
                            <span className="bg-duck-bg px-2 py-0.5 rounded-full">📅 15 november 2024</span>
                            <span className="bg-duck-bg px-2 py-0.5 rounded-full">🌐 nieuwsflits247.nl</span>
                            <span className="bg-duck-bg px-2 py-0.5 rounded-full">👤 Auteur onbekend</span>
                        </div>
                        <p className="text-xs text-duck-ink/60 mt-3 leading-relaxed">
                            "Volgens bronnen binnen het ministerie van Onderwijs worden er plannen gemaakt om alle basisscholen en middelbare scholen over te laten stappen op een vierdaagse schoolweek. Dit zou in 2027 moeten ingaan en miljoenen euro's besparen..."
                        </p>
                    </div>
                </div>

                {/* CRAAP Checklist */}
                <div className="bg-white rounded-xl border border-duck-acid shadow-sm overflow-hidden">
                    <button
                        onClick={() => setShowChecklist(!showChecklist)}
                        className="w-full px-4 py-2.5 flex items-center justify-between bg-duck-acid hover:bg-duck-acid/70 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-duck-ink">CRAAP-test</span>
                            <span className="text-[10px] bg-duck-ink text-duck-acid px-2 py-0.5 rounded-full font-bold">
                                {filledCount}/5
                            </span>
                        </div>
                        {showChecklist ? <ChevronUp size={16} className="text-duck-ink" /> : <ChevronDown size={16} className="text-duck-ink" />}
                    </button>

                    {showChecklist && (
                        <div className="divide-y divide-amber-50">
                            {CRAAP_ITEMS.map((item, i) => (
                                <div key={i} className="px-4 py-3">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="w-6 h-6 bg-duck-acid rounded-full flex items-center justify-center text-xs font-black text-duck-ink">
                                            {item.letter}
                                        </span>
                                        <span className="text-xs font-bold text-duck-ink/60">{item.label}</span>
                                        <span className="text-duck-ink/60 ml-auto">{item.icon}</span>
                                    </div>
                                    <p className="text-[11px] text-duck-ink/60 mb-2 pl-8">{item.question}</p>
                                    <div className="flex gap-1.5 pl-8">
                                        <button
                                            onClick={() => setRating(i, 'ok')}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${ratings[i] === 'ok' ? 'bg-duck-ink text-duck-acid ring-2 ring-duck-ink' : 'bg-duck-bg text-duck-ink/60 hover:bg-duck-ink hover:text-duck-acid'}`}
                                        >
                                            <CheckCircle2 size={10} /> Oké
                                        </button>
                                        <button
                                            onClick={() => setRating(i, 'twijfel')}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${ratings[i] === 'twijfel' ? 'bg-duck-acid text-duck-ink ring-2 ring-duck-acid' : 'bg-duck-bg text-duck-ink/60 hover:bg-duck-acid hover:text-duck-ink'}`}
                                        >
                                            <HelpCircle size={10} /> Twijfel
                                        </button>
                                        <button
                                            onClick={() => setRating(i, 'nep')}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${ratings[i] === 'nep' ? 'bg-duck-error text-white ring-2 ring-duck-error' : 'bg-duck-bg text-duck-ink/60 hover:bg-duck-error hover:text-white'}`}
                                        >
                                            <AlertTriangle size={10} /> Niet oké
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Verdict box */}
                <div className="bg-duck-acid/20 border-2 border-duck-acid rounded-xl p-4">
                    <h4 className="font-bold text-duck-ink text-sm">Jouw oordeel</h4>
                    <p className="text-xs text-duck-ink/60 mt-1">
                        Vul de CRAAP-test in en bespreek je conclusie in de chat. Is deze bewering betrouwbaar, twijfelachtig of onbetrouwbaar?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FactcheckerPreview;
