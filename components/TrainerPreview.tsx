
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
                const chatInput = document.querySelector('input[placeholder*="antwoord"], textarea');
                if (chatInput) (chatInput as HTMLInputElement).focus();
            }}
            className={`
                w-full max-w-xs px-6 py-4 rounded-full font-bold text-lg transition-all duration-300
                flex items-center justify-center gap-3 relative overflow-hidden
                ${isReady
                    ? 'text-white shadow-xl active:scale-95 cursor-pointer'
                    : 'cursor-not-allowed'
                }
            `}
            style={{
                backgroundColor: isReady ? '#D97848' : '#E7D8BD',
                color: isReady ? '#FFFFFF' : '#445865',
                border: isReady ? undefined : '1px solid #E7D8BD',
            }}
            onMouseEnter={e => { if (isReady) e.currentTarget.style.backgroundColor = '#D97848'; }}
            onMouseLeave={e => { if (isReady) e.currentTarget.style.backgroundColor = '#D97848'; }}
        >
            {!isReady ? (
                <>
                    <div className="relative w-7 h-7">
                        <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#E7D8BD"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#D97848"
                                strokeWidth="3"
                                strokeDasharray={`${((3 - countdown) / 3) * 100}, 100`}
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black" style={{ color: '#445865' }}>
                            {countdown}
                        </span>
                    </div>
                    <span className="text-sm" style={{ color: '#445865' }}>Lees eerst de stappen hieronder...</span>
                </>
            ) : (
                <>
                    <BrainCircuit size={24} />
                    Ik snap het, start!
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
            <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: '#FCF6EA' }}>
                {/* Content — fits in one viewport without scrolling */}
                <div className="flex-1 flex flex-col items-center justify-center p-5 md:p-8 relative z-10">
                    {/* Pip mascot + Title inline */}
                    <div className="flex items-center gap-3 mb-3">
                        <img
                            src="/mascot/pip-excited.webp"
                            alt="Pip"
                            className="w-14 h-14 object-contain"
                        />
                        <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>
                            Welkom bij AI Trainer!
                        </h2>
                    </div>
                    <p className="text-center max-w-md mb-5 leading-relaxed text-sm" style={{ color: '#445865' }}>
                        Leer een computer om afval te sorteren. Jij geeft voorbeelden, en de AI leert daarvan.
                    </p>

                    {/* Wat ga je doen */}
                    <div className="rounded-2xl p-5 max-w-lg w-full mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#D97848' }}>
                            Wat ga je doen?
                        </h3>
                        <p className="text-sm mb-4" style={{ color: '#445865' }}>
                            Je typt zinnen in het chatveld links. Pip leest jouw zin en sorteert het in de juiste bak hier rechts.
                        </p>

                        <div className="space-y-3">
                            {/* Stap 1 & 2 side by side */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl p-3" style={{ backgroundColor: '#FCF6EA', border: '1px solid #FCF6EA' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{ backgroundColor: '#D97848' }}>1</span>
                                        <span className="font-bold text-sm" style={{ color: '#08283B' }}>Voorbeeld plastic</span>
                                    </div>
                                    <p className="text-sm font-mono ml-8" style={{ color: '#D97848' }}>"Een flesje is plastic"</p>
                                </div>
                                <div className="rounded-xl p-3" style={{ backgroundColor: '#FCF6EA', border: '1px solid #FCF6EA' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{ backgroundColor: '#5F947D' }}>2</span>
                                        <span className="font-bold text-sm" style={{ color: '#08283B' }}>Voorbeeld papier</span>
                                    </div>
                                    <p className="text-sm font-mono ml-8" style={{ color: '#5F947D' }}>"Een krant is papier"</p>
                                </div>
                            </div>

                            {/* Stap 3 & 4 side by side */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl p-3" style={{ backgroundColor: '#FCF6EA', border: '1px solid #FCF6EA' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{ backgroundColor: '#0B453F' }}>3</span>
                                        <span className="font-bold text-sm" style={{ color: '#08283B' }}>Herhaal</span>
                                    </div>
                                    <p className="text-xs ml-8" style={{ color: '#445865' }}>
                                        Minstens 3 per categorie
                                    </p>
                                </div>
                                <div className="rounded-xl p-3" style={{ backgroundColor: '#FCF6EA', border: '1px solid #FCF6EA' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{ backgroundColor: '#5F947D' }}>4</span>
                                        <span className="font-bold text-sm" style={{ color: '#08283B' }}>Test de AI</span>
                                    </div>
                                    <p className="text-sm font-mono ml-8" style={{ color: '#5F947D' }}>"Waar hoort cola bij?"</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Samenvatting */}
                    <div className="rounded-xl p-3 max-w-lg w-full mb-5" style={{ backgroundColor: 'rgba(217, 119, 87, 0.06)', border: '1px solid rgba(217, 119, 87, 0.2)' }}>
                        <p className="text-sm text-center leading-relaxed" style={{ color: '#445865' }}>
                            <strong style={{ color: '#D97848' }}>Kort gezegd:</strong> typ voorbeelden in de chat links. Kijk rechts hoe de AI ze sorteert. Test daarna of de AI het snapt.
                        </p>
                    </div>

                    {/* Start Button with Countdown */}
                    <StartButton countdown={readCountdown} onStart={() => setHasStarted(true)} />
                </div>
            </div>
        );
    }

    // Calculate if we should show hints
    const needsPlasticExamples = data.classAItems.length < 2;
    const needsPaperExamples = data.classBItems.length < 2;
    const showInstructionBanner = data.classAItems.length === 0 && data.classBItems.length === 0;

    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden font-sans" style={{ backgroundColor: '#FCF6EA', borderLeft: '1px solid #E7D8BD' }}>

            {/* Header */}
            <div className="px-4 py-3 flex justify-between items-center shrink-0 z-20" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E7D8BD' }}>
                <div className="flex items-center gap-3">
                    <img src="/mascot/pip-thinking.webp" alt="Pip" className="w-8 h-8 object-contain" loading="lazy" />
                    <div>
                        <h3 className="font-bold text-xs tracking-wider uppercase" style={{ color: '#D97848' }}>Pip's Sorteer Lab</h3>
                        <span className="font-bold text-sm" style={{ color: '#08283B' }}>Afval Sorteerder</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="text-[10px] px-2 py-1 rounded-full flex items-center font-bold" style={{ backgroundColor: '#FCF6EA', color: '#445865', border: '1px solid #E7D8BD' }}>
                        <span>DATASET: {data.classAItems.length + data.classBItems.length}</span>
                    </div>
                    {/* Completion Button */}
                    {(data.classAItems.length > 0 && data.classBItems.length > 0) && (
                        <button
                            onClick={() => setShowConclusion(true)}
                            className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors text-white"
                            style={{ backgroundColor: '#5F947D' }}
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
                <div className="mx-4 mt-4 rounded-2xl p-3 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                    <div className="flex items-start gap-3">
                        <img src="/mascot/pip-waving.webp" alt="Pip" className="w-10 h-10 object-contain shrink-0" loading="lazy" />
                        <div>
                            <h4 className="font-bold text-sm mb-1" style={{ color: '#08283B' }}>Wat moet je nu doen?</h4>
                            <p className="text-xs leading-relaxed mb-2" style={{ color: '#445865' }}>
                                Typ een zin in het <strong>chatveld links</strong>. Vertel de AI wat voor soort afval iets is.
                            </p>
                            <div className="rounded-lg px-3 py-2 space-y-1" style={{ backgroundColor: '#FCF6EA', border: '1px solid #FCF6EA' }}>
                                <p className="text-xs font-medium" style={{ color: '#445865' }}>Typ bijvoorbeeld:</p>
                                <p className="text-sm font-mono" style={{ color: '#D97848' }}>"Een plastic flesje is plastic"</p>
                                <p className="text-sm font-mono" style={{ color: '#5F947D' }}>"Een krant is papier"</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-y-auto">

                {/* Visualisation of the Brain/Model */}
                <div className="flex justify-center py-2">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse-soft" style={{ backgroundColor: '#FFFFFF', border: '4px solid rgba(139, 111, 158, 0.3)' }}>
                            <Database size={40} style={{ color: '#0B453F' }} />
                        </div>
                        {/* Connections */}
                        <div className="absolute top-1/2 left-full w-8 h-1" style={{ backgroundColor: 'rgba(139, 111, 158, 0.2)' }}></div>
                        <div className="absolute top-1/2 right-full w-8 h-1" style={{ backgroundColor: 'rgba(139, 111, 158, 0.2)' }}></div>
                    </div>
                </div>

                {/* Contextuele hint op basis van voortgang */}
                {data.classAItems.length > 0 && data.classBItems.length === 0 && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(42, 157, 143, 0.06)', border: '1px solid rgba(42, 157, 143, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#5F947D' }}>Nu heb je plastic voorbeelden gegeven. Typ nu een <strong>papier</strong> voorbeeld, bijv: <em>"Een kartonnen doos is papier"</em></p>
                    </div>
                )}
                {data.classAItems.length === 0 && data.classBItems.length > 0 && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(217, 119, 87, 0.06)', border: '1px solid rgba(217, 119, 87, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#D97848' }}>Nu heb je papier voorbeelden gegeven. Typ nu een <strong>plastic</strong> voorbeeld, bijv: <em>"Een plastic tasje is plastic"</em></p>
                    </div>
                )}
                {data.classAItems.length >= 1 && data.classBItems.length >= 1 && !data.testItem && (data.classAItems.length + data.classBItems.length) < 6 && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(139, 111, 158, 0.06)', border: '1px solid rgba(139, 111, 158, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#0B453F' }}>Goed bezig! Voeg nog meer voorbeelden toe. Hoe meer je geeft, hoe slimmer de AI wordt. Probeer minstens 3 per categorie.</p>
                    </div>
                )}
                {data.classAItems.length >= 3 && data.classBItems.length >= 3 && !data.testItem && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#5F947D' }}>Je hebt genoeg voorbeelden! <strong>Test nu de AI</strong> door te vragen: <em>"Waar hoort een cola flesje bij?"</em></p>
                    </div>
                )}

                {/* Training Buckets */}
                <div className="grid grid-cols-2 gap-4 flex-1 min-h-[200px]">

                    {/* Class A Bucket (Left) - PLASTIC */}
                    <div className="rounded-2xl p-4 flex flex-col relative" style={{ backgroundColor: 'rgba(217, 119, 87, 0.04)', border: '2px solid rgba(217, 119, 87, 0.2)' }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-2" style={{ backgroundColor: '#D97848' }}>
                            <Trash2 size={12} /> {data.classALabel || "Plastic"}
                        </div>

                        <div className="mt-4 flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                            {data.classAItems.length === 0 && (
                                <div className="text-center text-xs mt-6 space-y-3" style={{ color: '#445865' }}>
                                    <div className="text-2xl">🥤</div>
                                    <p className="font-medium">Hier is nog niks</p>
                                    <p className="text-[11px]" style={{ color: '#445865' }}>Als jij een plastic voorbeeld typt in de chat, komt het hier terecht.</p>
                                    <div className="rounded-lg p-3 text-left" style={{ backgroundColor: '#FFFFFF', border: '1px solid #FCF6EA' }}>
                                        <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: '#D97848' }}>Typ dit in de chat:</p>
                                        <p className="text-xs font-mono" style={{ color: '#445865' }}>"Een plastic flesje is plastic"</p>
                                        <p className="text-xs font-mono" style={{ color: '#445865' }}>"Een lege chipszak is plastic"</p>
                                    </div>
                                </div>
                            )}
                            {needsPlasticExamples && data.classAItems.length > 0 && data.classAItems.length < 2 && (
                                <div className="rounded-lg p-2 text-center text-xs" style={{ backgroundColor: 'rgba(217, 119, 87, 0.06)', border: '1px dashed rgba(217, 119, 87, 0.3)', color: '#D97848' }}>
                                    Typ nog een plastic voorbeeld in de chat!
                                </div>
                            )}
                            {data.classAItems.map((item, i) => (
                                <div key={i} className="text-sm px-3 py-2 rounded-lg animate-in zoom-in slide-in-from-top-2 duration-300 flex items-center gap-2" style={{ backgroundColor: 'rgba(217, 119, 87, 0.08)', border: '1px solid rgba(217, 119, 87, 0.2)', color: '#D97848' }}>
                                    <Check size={14} className="shrink-0" style={{ color: '#D97848' }} /> {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Class B Bucket (Right) - PAPER */}
                    <div className="rounded-2xl p-4 flex flex-col relative" style={{ backgroundColor: 'rgba(42, 157, 143, 0.04)', border: '2px solid rgba(42, 157, 143, 0.2)' }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-2" style={{ backgroundColor: '#5F947D' }}>
                            <FileText size={12} /> {data.classBLabel || "Papier"}
                        </div>

                        <div className="mt-4 flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                            {data.classBItems.length === 0 && (
                                <div className="text-center text-xs mt-6 space-y-3" style={{ color: '#445865' }}>
                                    <div className="text-2xl">📰</div>
                                    <p className="font-medium">Hier is nog niks</p>
                                    <p className="text-[11px]" style={{ color: '#445865' }}>Als jij een papier voorbeeld typt in de chat, komt het hier terecht.</p>
                                    <div className="rounded-lg p-3 text-left" style={{ backgroundColor: '#FFFFFF', border: '1px solid #FCF6EA' }}>
                                        <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: '#5F947D' }}>Typ dit in de chat:</p>
                                        <p className="text-xs font-mono" style={{ color: '#445865' }}>"Een oude krant is papier"</p>
                                        <p className="text-xs font-mono" style={{ color: '#445865' }}>"Een kartonnen doos is papier"</p>
                                    </div>
                                </div>
                            )}
                            {needsPaperExamples && data.classBItems.length > 0 && data.classBItems.length < 2 && (
                                <div className="rounded-lg p-2 text-center text-xs" style={{ backgroundColor: 'rgba(42, 157, 143, 0.06)', border: '1px dashed rgba(42, 157, 143, 0.3)', color: '#5F947D' }}>
                                    Typ nog een papier voorbeeld in de chat!
                                </div>
                            )}
                            {data.classBItems.map((item, i) => (
                                <div key={i} className="text-sm px-3 py-2 rounded-lg animate-in zoom-in slide-in-from-top-2 duration-300 flex items-center gap-2" style={{ backgroundColor: 'rgba(42, 157, 143, 0.08)', border: '1px solid rgba(42, 157, 143, 0.2)', color: '#1a7a6f' }}>
                                    <Check size={14} className="shrink-0" style={{ color: '#5F947D' }} /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Testing Zone */}
                <div className="rounded-2xl p-4 relative min-h-[100px] flex items-center justify-between gap-4 shrink-0 z-10" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                    <div className="absolute -top-3 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FCF6EA', color: '#445865', border: '1px solid #E7D8BD' }}>
                        TEST ZONE
                    </div>

                    {data.testItem ? (
                        <>
                            <div className="font-bold px-4 py-3 rounded-xl shadow-sm text-lg animate-in slide-in-from-left" style={{ backgroundColor: '#FCF6EA', color: '#08283B', border: '1px solid #E7D8BD' }}>
                                "{data.testItem.name}"
                            </div>

                            <ArrowRight className="shrink-0" style={{ color: '#E7D8BD' }} />

                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-white shadow-sm animate-in zoom-in duration-500"
                                style={{
                                    backgroundColor: data.testItem.predictedClass === 'A' ? '#D97848' :
                                        data.testItem.predictedClass === 'B' ? '#5F947D' : '#445865'
                                }}
                            >
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
                        <div className="w-full text-center text-sm flex flex-col items-center gap-2" style={{ color: '#445865' }}>
                            <img src="/mascot/pip-thinking.webp" alt="Pip denkt na" className="w-12 h-12 object-contain" loading="lazy" />
                            <span className="font-medium" style={{ color: '#08283B' }}>Hier test je de AI straks</span>
                            <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: '#FCF6EA', border: '1px solid #FCF6EA' }}>
                                <p style={{ color: '#445865' }}>Als je genoeg voorbeelden hebt gegeven, typ dan in de chat:</p>
                                <p className="font-mono font-medium mt-1" style={{ color: '#D97848' }}>"Waar hoort een cola flesje bij?"</p>
                            </div>
                            <p className="text-[10px]" style={{ color: '#445865' }}>De AI probeert dan zelf te bedenken waar het bij hoort.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
