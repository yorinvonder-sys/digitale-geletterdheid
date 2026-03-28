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
        <div className="w-full h-full bg-gradient-to-br from-amber-50 to-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3 flex items-center gap-2">
                <FileSearch size={18} className="text-amber-200" />
                <span className="text-white font-bold text-sm">Factcheck Werkblad</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {/* Fake news article */}
                <div className="bg-white rounded-xl border-2 border-amber-200 overflow-hidden shadow-sm">
                    <div className="bg-amber-100/50 px-4 py-2 flex items-center gap-2 border-b border-amber-200">
                        <AlertTriangle size={14} className="text-amber-600" />
                        <span className="text-xs font-bold text-amber-800">BEWERING OM TE CHECKEN</span>
                    </div>
                    <div className="p-4">
                        <h3 className="font-black text-slate-800 text-sm leading-tight">
                            "Scholen gaan per 2027 over op vierdaagse schoolweek"
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-500">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-full">📅 15 november 2024</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded-full">🌐 nieuwsflits247.nl</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded-full">👤 Auteur onbekend</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                            "Volgens bronnen binnen het ministerie van Onderwijs worden er plannen gemaakt om alle basisscholen en middelbare scholen over te laten stappen op een vierdaagse schoolweek. Dit zou in 2027 moeten ingaan en miljoenen euro's besparen..."
                        </p>
                    </div>
                </div>

                {/* CRAAP Checklist */}
                <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
                    <button
                        onClick={() => setShowChecklist(!showChecklist)}
                        className="w-full px-4 py-2.5 flex items-center justify-between bg-amber-50 hover:bg-amber-100/70 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-amber-800">CRAAP-test</span>
                            <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                                {filledCount}/5
                            </span>
                        </div>
                        {showChecklist ? <ChevronUp size={16} className="text-amber-600" /> : <ChevronDown size={16} className="text-amber-600" />}
                    </button>

                    {showChecklist && (
                        <div className="divide-y divide-amber-50">
                            {CRAAP_ITEMS.map((item, i) => (
                                <div key={i} className="px-4 py-3">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-black text-amber-700">
                                            {item.letter}
                                        </span>
                                        <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                        <span className="text-slate-400 ml-auto">{item.icon}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mb-2 pl-8">{item.question}</p>
                                    <div className="flex gap-1.5 pl-8">
                                        <button
                                            onClick={() => setRating(i, 'ok')}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${ratings[i] === 'ok' ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50'}`}
                                        >
                                            <CheckCircle2 size={10} /> Oké
                                        </button>
                                        <button
                                            onClick={() => setRating(i, 'twijfel')}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${ratings[i] === 'twijfel' ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300' : 'bg-slate-100 text-slate-500 hover:bg-amber-50'}`}
                                        >
                                            <HelpCircle size={10} /> Twijfel
                                        </button>
                                        <button
                                            onClick={() => setRating(i, 'nep')}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${ratings[i] === 'nep' ? 'bg-red-100 text-red-700 ring-2 ring-red-300' : 'bg-slate-100 text-slate-500 hover:bg-red-50'}`}
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
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                    <h4 className="font-bold text-amber-800 text-sm">Jouw oordeel</h4>
                    <p className="text-xs text-amber-700 mt-1">
                        Vul de CRAAP-test in en bespreek je conclusie in de chat. Is deze bewering betrouwbaar, twijfelachtig of onbetrouwbaar?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FactcheckerPreview;
