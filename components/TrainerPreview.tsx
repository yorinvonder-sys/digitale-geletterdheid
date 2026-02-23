
import React, { useState, useEffect } from 'react';
import { TrainerData } from '../types';
import { Database, ArrowRight, BrainCircuit, Check, HelpCircle, Trash2, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { MissionConclusion } from './MissionConclusion';

interface TrainerPreviewProps {
    data: TrainerData;
}

// Countdown Start Button Component
const StartButton: React.FC<{ onStart: () => void; countdown: number }> = ({ onStart, countdown }) => {
    const isReady = countdown === 0;

    return (
        <button
            disabled={!isReady}
            onClick={() => {
                onStart();
                // Scroll to chat or focus - for now just visual feedback
                const chatInput = document.querySelector('input[placeholder*="antwoord"], textarea');
                if (chatInput) (chatInput as HTMLInputElement).focus();
            }}
            className={`
                w-full max-w-xs px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300
                flex items-center justify-center gap-3 relative overflow-hidden
                ${isReady
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/40 hover:scale-105 cursor-pointer active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }
            `}
        >
            {!isReady ? (
                <>
                    <div className="relative w-7 h-7">
                        <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-slate-700"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="text-purple-500"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray={`${((3 - countdown) / 3) * 100}, 100`}
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
                            {countdown}
                        </span>
                    </div>
                    <span className="text-sm">Lees de instructies...</span>
                </>
            ) : (
                <>
                    <BrainCircuit size={24} />
                    Start Training!
                </>
            )}
        </button>
    );
};

export const TrainerPreview: React.FC<TrainerPreviewProps> = ({ data }) => {
    const [showConclusion, setShowConclusion] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [readCountdown, setReadCountdown] = useState(3);

    // 5-second reading timer before start button is enabled
    useEffect(() => {
        if (!hasStarted && readCountdown > 0) {
            const timer = setInterval(() => {
                setReadCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [hasStarted, readCountdown]);

    // INTRO SCREEN: Show when no training data exists OR if the user hasn't clicked start yet
    const hasNoData = data.classAItems.length === 0 && data.classBItems.length === 0 && !data.testItem;
    const showIntro = hasNoData && !hasStarted;

    if (showIntro) {
        return (
            <div className="w-full h-full flex flex-col bg-slate-900 text-slate-200 relative overflow-hidden">
                {/* Neural Network Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
                    <div className="absolute top-20 right-20 w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-slate-900"></div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-start p-8 md:p-12 relative z-10 overflow-y-auto custom-scrollbar pt-12 md:pt-16">
                    {/* Icon */}
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                            <BrainCircuit size={48} className="text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg">
                            🧠
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight text-center">
                        Welkom, AI Trainer!
                    </h2>
                    <p className="text-slate-400 text-center max-w-sm mb-8 leading-relaxed">
                        Leer een AI model hoe het afval moet sorteren door <strong className="text-blue-400">voorbeelden</strong> te geven.
                    </p>

                    {/* Instructions */}
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-5 max-w-sm w-full mb-6">
                        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Sparkles size={14} /> Hoe werkt het?
                        </h3>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex items-start gap-3">
                                <span className="bg-blue-500/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                                <span>Geef trainingsdata: "Een bananenschil hoort bij GFT"</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                                <span>Voeg meerdere voorbeelden toe voor elke categorie</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs">3</span>
                                <span>Test de AI: "Waar hoort een plastic fles?"</span>
                            </li>
                        </ul>
                    </div>

                    {/* Start Button with Countdown */}
                    <div className="w-full flex justify-center pb-8">
                        <StartButton countdown={readCountdown} onStart={() => setHasStarted(true)} />
                    </div>
                </div>
            </div>
        );
    }

    // Calculate if we should show hints
    const needsPlasticExamples = data.classAItems.length < 2;
    const needsPaperExamples = data.classBItems.length < 2;
    const showInstructionBanner = data.classAItems.length === 0 && data.classBItems.length === 0;

    return (
        <div className="w-full h-full flex flex-col bg-slate-900 border-l border-slate-800 relative overflow-hidden font-sans">

            {/* Header */}
            <div className="bg-slate-950 px-4 py-3 flex justify-between items-center border-b border-slate-800 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-purple-500 rounded text-white shadow-lg shadow-purple-500/20">
                        <BrainCircuit size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xs text-purple-400 tracking-wider uppercase">Neural Network V1.0</h3>
                        <span className="text-white font-bold text-sm">Afval Sorteerder</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 flex items-center">
                        <span>DATASET: {data.classAItems.length + data.classBItems.length}</span>
                    </div>
                    {/* Completion Button */}
                    {(data.classAItems.length > 0 && data.classBItems.length > 0) && (
                        <button
                            onClick={() => setShowConclusion(true)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-lg shadow-green-900/20"
                        >
                            <CheckCircle2 size={12} /> <span>Klaar</span>
                        </button>
                    )}
                </div>
            </div>

            {showConclusion && (
                <MissionConclusion
                    title="Missie Voltooid: AI Trainer"
                    description="Je hebt je eerste AI-model getraind! Door voorbeelden te geven, leerde de computer het verschil tussen categorieën."
                    aiConcept={{
                        title: "Supervised Learning",
                        text: "Dit heet 'Supervised Learning' (Leren met toezicht). De AI leert door gelabelde voorbeelden te zien: 'Dit is een banaan', 'Dit is papier'. Hoe meer gevarieerde voorbeelden jij geeft, hoe slimmer en nauwkeuriger het model wordt!"
                    }}
                    onExit={() => setShowConclusion(false)}
                />
            )}

            {/* Instruction Banner - Shows when no data yet */}
            {showInstructionBanner && (
                <div className="mx-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-3 text-white shadow-lg shadow-purple-500/20">
                    <div className="flex items-start gap-3">
                        <div className="bg-white/20 rounded-lg p-1.5 shrink-0">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm mb-1">👋 Jouw opdracht</h4>
                            <p className="text-xs text-white/90 leading-relaxed">
                                Typ in de chat voorbeelden van <strong>plastic</strong> en <strong>papier</strong> afval.
                                Bijv: <em>"Een plastic flesje is plastic"</em> of <em>"Een krant is papier"</em>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-y-auto">

                {/* Visualisation of the Brain/Model */}
                <div className="flex justify-center py-2">
                    <div className="relative">
                        <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-purple-500/30 flex items-center justify-center animate-pulse-soft">
                            <Database size={40} className="text-purple-400" />
                        </div>
                        {/* Connections */}
                        <div className="absolute top-1/2 left-full w-8 h-1 bg-purple-500/30"></div>
                        <div className="absolute top-1/2 right-full w-8 h-1 bg-purple-500/30"></div>
                    </div>
                </div>

                {/* Training Buckets */}
                <div className="grid grid-cols-2 gap-4 flex-1 min-h-[200px]">

                    {/* Class A Bucket (Left) - PLASTIC */}
                    <div className="bg-blue-900/10 border-2 border-blue-500/30 rounded-2xl p-4 flex flex-col relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-2">
                            <Trash2 size={12} /> {data.classALabel || "Plastic"}
                        </div>

                        <div className="mt-4 flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                            {data.classAItems.length === 0 && (
                                <div className="text-center text-slate-400 text-xs mt-6 space-y-3">
                                    <div className="text-2xl">🥤</div>
                                    <p className="font-medium">Nog geen plastic voorbeelden</p>
                                    <div className="bg-slate-800/50 rounded-lg p-3 text-left">
                                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wide mb-2">💡 Probeer dit:</p>
                                        <p className="text-slate-300 text-xs italic">"Een plastic flesje is plastic"</p>
                                        <p className="text-slate-300 text-xs italic">"Een lege chipszak is plastic"</p>
                                    </div>
                                </div>
                            )}
                            {needsPlasticExamples && data.classAItems.length > 0 && data.classAItems.length < 2 && (
                                <div className="bg-blue-500/10 border border-dashed border-blue-400/30 rounded-lg p-2 text-center text-xs text-blue-300">
                                    ✨ Voeg nog een plastic voorbeeld toe!
                                </div>
                            )}
                            {data.classAItems.map((item, i) => (
                                <div key={i} className="bg-blue-500/20 border border-blue-500/30 text-blue-200 text-sm px-3 py-2 rounded-lg animate-in zoom-in slide-in-from-top-2 duration-300 flex items-center gap-2">
                                    <span className="text-lg">🥤</span> {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Class B Bucket (Right) - PAPER */}
                    <div className="bg-green-900/10 border-2 border-green-500/30 rounded-2xl p-4 flex flex-col relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-2">
                            <FileText size={12} /> {data.classBLabel || "Papier"}
                        </div>

                        <div className="mt-4 flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                            {data.classBItems.length === 0 && (
                                <div className="text-center text-slate-400 text-xs mt-6 space-y-3">
                                    <div className="text-2xl">📰</div>
                                    <p className="font-medium">Nog geen papier voorbeelden</p>
                                    <div className="bg-slate-800/50 rounded-lg p-3 text-left">
                                        <p className="text-[10px] text-green-400 font-bold uppercase tracking-wide mb-2">💡 Probeer dit:</p>
                                        <p className="text-slate-300 text-xs italic">"Een oude krant is papier"</p>
                                        <p className="text-slate-300 text-xs italic">"Een kartonnen doos is papier"</p>
                                    </div>
                                </div>
                            )}
                            {needsPaperExamples && data.classBItems.length > 0 && data.classBItems.length < 2 && (
                                <div className="bg-green-500/10 border border-dashed border-green-400/30 rounded-lg p-2 text-center text-xs text-green-300">
                                    ✨ Voeg nog een papier voorbeeld toe!
                                </div>
                            )}
                            {data.classBItems.map((item, i) => (
                                <div key={i} className="bg-green-500/20 border border-green-500/30 text-green-200 text-sm px-3 py-2 rounded-lg animate-in zoom-in slide-in-from-top-2 duration-300 flex items-center gap-2">
                                    <span className="text-lg">📰</span> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Testing Zone */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 relative min-h-[100px] flex items-center justify-between gap-4 shrink-0 z-10">
                    <div className="absolute -top-3 left-4 bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-600">
                        TEST ZONE
                    </div>

                    {data.testItem ? (
                        <>
                            <div className="bg-white text-slate-900 font-bold px-4 py-3 rounded-lg shadow-lg text-lg animate-in slide-in-from-left">
                                "{data.testItem.name}"
                            </div>

                            <ArrowRight className="text-slate-500" />

                            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-white shadow-lg animate-in zoom-in duration-500 ${data.testItem.predictedClass === 'A' ? 'bg-blue-600' :
                                data.testItem.predictedClass === 'B' ? 'bg-green-600' : 'bg-slate-600'
                                }`}>
                                {data.testItem.predictedClass === 'A' && <Trash2 size={20} />}
                                {data.testItem.predictedClass === 'B' && <FileText size={20} />}
                                {data.testItem.predictedClass === 'unknown' && <HelpCircle size={20} />}

                                <span>
                                    {data.testItem.predictedClass === 'A' ? data.classALabel :
                                        data.testItem.predictedClass === 'B' ? data.classBLabel : "Onbekend"}
                                </span>

                                <span className="text-[10px] ml-2 opacity-70 font-mono">
                                    {Math.round(data.testItem.confidence * 100)}%
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                            <div className="bg-slate-700/50 rounded-full p-3">
                                <HelpCircle className="text-yellow-400" size={28} />
                            </div>
                            <span className="font-medium">Test de AI!</span>
                            <div className="bg-slate-700/50 rounded-lg px-3 py-2 text-xs">
                                <p className="text-slate-300">Als je genoeg voorbeelden hebt gegeven, vraag dan:</p>
                                <p className="text-yellow-400 font-medium mt-1">"Waar hoort een cola flesje bij?"</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
