
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
                backgroundColor: isReady ? '#D97757' : '#E8E6DF',
                color: isReady ? '#FFFFFF' : '#6B6B66',
                border: isReady ? undefined : '1px solid #D5D3CC',
            }}
            onMouseEnter={e => { if (isReady) e.currentTarget.style.backgroundColor = '#C46849'; }}
            onMouseLeave={e => { if (isReady) e.currentTarget.style.backgroundColor = '#D97757'; }}
        >
            {!isReady ? (
                <>
                    <div className="relative w-7 h-7">
                        <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#D5D3CC"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#D97757"
                                strokeWidth="3"
                                strokeDasharray={`${((3 - countdown) / 3) * 100}, 100`}
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black" style={{ color: '#3D3D38' }}>
                            {countdown}
                        </span>
                    </div>
                    <span className="text-sm" style={{ color: '#6B6B66' }}>Lees eerst de stappen hieronder...</span>
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
            <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: '#FAF9F0' }}>
                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-start p-6 md:p-10 relative z-10 overflow-y-auto custom-scrollbar pt-8 md:pt-12">
                    {/* Pip mascot */}
                    <div className="relative mb-5">
                        <img
                            src="/mascot/pip-excited.webp"
                            alt="Pip"
                            className="w-20 h-20 object-contain"
                        />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-black mb-2 tracking-tight text-center" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                        Welkom bij AI Trainer!
                    </h2>
                    <p className="text-center max-w-md mb-6 leading-relaxed text-sm" style={{ color: '#3D3D38' }}>
                        In deze opdracht ga jij een computer leren om afval te sorteren. Jij geeft voorbeelden, en de AI leert daarvan.
                    </p>

                    {/* Wat ga je doen - heel expliciet */}
                    <div className="rounded-2xl p-5 max-w-md w-full mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#D97757' }}>
                            Wat ga je doen?
                        </h3>
                        <p className="text-sm mb-4" style={{ color: '#3D3D38' }}>
                            Je typt zinnen in het chatveld links. Pip leest jouw zin en sorteert het in de juiste bak hier rechts.
                        </p>

                        <div className="space-y-4">
                            {/* Stap 1 */}
                            <div className="rounded-xl p-3" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{ backgroundColor: '#D97757' }}>1</span>
                                    <span className="font-bold text-sm" style={{ color: '#1A1A19' }}>Geef een voorbeeld van plastic</span>
                                </div>
                                <p className="text-xs ml-8 mb-2" style={{ color: '#6B6B66' }}>Typ dit in het chatveld links:</p>
                                <div className="ml-8 rounded-lg px-3 py-2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                                    <p className="text-sm font-mono" style={{ color: '#D97757' }}>"Een plastic flesje is plastic"</p>
                                </div>
                            </div>

                            {/* Stap 2 */}
                            <div className="rounded-xl p-3" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{ backgroundColor: '#2A9D8F' }}>2</span>
                                    <span className="font-bold text-sm" style={{ color: '#1A1A19' }}>Geef een voorbeeld van papier</span>
                                </div>
                                <p className="text-xs ml-8 mb-2" style={{ color: '#6B6B66' }}>Typ dit in het chatveld links:</p>
                                <div className="ml-8 rounded-lg px-3 py-2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                                    <p className="text-sm font-mono" style={{ color: '#2A9D8F' }}>"Een krant is papier"</p>
                                </div>
                            </div>

                            {/* Stap 3 */}
                            <div className="rounded-xl p-3" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{ backgroundColor: '#8B6F9E' }}>3</span>
                                    <span className="font-bold text-sm" style={{ color: '#1A1A19' }}>Herhaal dit een paar keer</span>
                                </div>
                                <p className="text-xs ml-8" style={{ color: '#6B6B66' }}>
                                    Geef minstens 3 voorbeelden per categorie. Hoe meer voorbeelden, hoe slimmer de AI wordt.
                                </p>
                            </div>

                            {/* Stap 4 */}
                            <div className="rounded-xl p-3" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{ backgroundColor: '#10B981' }}>4</span>
                                    <span className="font-bold text-sm" style={{ color: '#1A1A19' }}>Test de AI</span>
                                </div>
                                <p className="text-xs ml-8 mb-2" style={{ color: '#6B6B66' }}>Vraag de AI om iets nieuws te sorteren:</p>
                                <div className="ml-8 rounded-lg px-3 py-2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                                    <p className="text-sm font-mono" style={{ color: '#10B981' }}>"Waar hoort een cola flesje bij?"</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Samenvatting */}
                    <div className="rounded-xl p-3 max-w-md w-full mb-6" style={{ backgroundColor: 'rgba(217, 119, 87, 0.06)', border: '1px solid rgba(217, 119, 87, 0.2)' }}>
                        <p className="text-xs text-center leading-relaxed" style={{ color: '#3D3D38' }}>
                            <strong style={{ color: '#D97757' }}>Kort gezegd:</strong> typ voorbeelden in de chat links. Kijk rechts hoe de AI ze sorteert. Test daarna of de AI het snapt.
                        </p>
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
        <div className="w-full h-full flex flex-col relative overflow-hidden font-sans" style={{ backgroundColor: '#FAF9F0', borderLeft: '1px solid #E8E6DF' }}>

            {/* Header */}
            <div className="px-4 py-3 flex justify-between items-center shrink-0 z-20" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E6DF' }}>
                <div className="flex items-center gap-3">
                    <img src="/mascot/pip-thinking.webp" alt="Pip" className="w-8 h-8 object-contain" />
                    <div>
                        <h3 className="font-bold text-xs tracking-wider uppercase" style={{ color: '#D97757' }}>Pip's Sorteer Lab</h3>
                        <span className="font-bold text-sm" style={{ color: '#1A1A19' }}>Afval Sorteerder</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="text-[10px] px-2 py-1 rounded-full flex items-center font-bold" style={{ backgroundColor: '#FAF9F0', color: '#6B6B66', border: '1px solid #E8E6DF' }}>
                        <span>DATASET: {data.classAItems.length + data.classBItems.length}</span>
                    </div>
                    {/* Completion Button */}
                    {(data.classAItems.length > 0 && data.classBItems.length > 0) && (
                        <button
                            onClick={() => setShowConclusion(true)}
                            className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors text-white"
                            style={{ backgroundColor: '#10B981' }}
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
                <div className="mx-4 mt-4 rounded-2xl p-3 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                    <div className="flex items-start gap-3">
                        <img src="/mascot/pip-waving.webp" alt="Pip" className="w-10 h-10 object-contain shrink-0" />
                        <div>
                            <h4 className="font-bold text-sm mb-1" style={{ color: '#1A1A19' }}>Wat moet je nu doen?</h4>
                            <p className="text-xs leading-relaxed mb-2" style={{ color: '#3D3D38' }}>
                                Typ een zin in het <strong>chatveld links</strong>. Vertel de AI wat voor soort afval iets is.
                            </p>
                            <div className="rounded-lg px-3 py-2 space-y-1" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <p className="text-xs font-medium" style={{ color: '#6B6B66' }}>Typ bijvoorbeeld:</p>
                                <p className="text-sm font-mono" style={{ color: '#D97757' }}>"Een plastic flesje is plastic"</p>
                                <p className="text-sm font-mono" style={{ color: '#2A9D8F' }}>"Een krant is papier"</p>
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
                            <Database size={40} style={{ color: '#8B6F9E' }} />
                        </div>
                        {/* Connections */}
                        <div className="absolute top-1/2 left-full w-8 h-1" style={{ backgroundColor: 'rgba(139, 111, 158, 0.2)' }}></div>
                        <div className="absolute top-1/2 right-full w-8 h-1" style={{ backgroundColor: 'rgba(139, 111, 158, 0.2)' }}></div>
                    </div>
                </div>

                {/* Contextuele hint op basis van voortgang */}
                {data.classAItems.length > 0 && data.classBItems.length === 0 && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(42, 157, 143, 0.06)', border: '1px solid rgba(42, 157, 143, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#2A9D8F' }}>Nu heb je plastic voorbeelden gegeven. Typ nu een <strong>papier</strong> voorbeeld, bijv: <em>"Een kartonnen doos is papier"</em></p>
                    </div>
                )}
                {data.classAItems.length === 0 && data.classBItems.length > 0 && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(217, 119, 87, 0.06)', border: '1px solid rgba(217, 119, 87, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#D97757' }}>Nu heb je papier voorbeelden gegeven. Typ nu een <strong>plastic</strong> voorbeeld, bijv: <em>"Een plastic tasje is plastic"</em></p>
                    </div>
                )}
                {data.classAItems.length >= 1 && data.classBItems.length >= 1 && !data.testItem && (data.classAItems.length + data.classBItems.length) < 6 && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(139, 111, 158, 0.06)', border: '1px solid rgba(139, 111, 158, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#8B6F9E' }}>Goed bezig! Voeg nog meer voorbeelden toe. Hoe meer je geeft, hoe slimmer de AI wordt. Probeer minstens 3 per categorie.</p>
                    </div>
                )}
                {data.classAItems.length >= 3 && data.classBItems.length >= 3 && !data.testItem && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#10B981' }}>Je hebt genoeg voorbeelden! <strong>Test nu de AI</strong> door te vragen: <em>"Waar hoort een cola flesje bij?"</em></p>
                    </div>
                )}

                {/* Training Buckets */}
                <div className="grid grid-cols-2 gap-4 flex-1 min-h-[200px]">

                    {/* Class A Bucket (Left) - PLASTIC */}
                    <div className="rounded-2xl p-4 flex flex-col relative" style={{ backgroundColor: 'rgba(217, 119, 87, 0.04)', border: '2px solid rgba(217, 119, 87, 0.2)' }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-2" style={{ backgroundColor: '#D97757' }}>
                            <Trash2 size={12} /> {data.classALabel || "Plastic"}
                        </div>

                        <div className="mt-4 flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                            {data.classAItems.length === 0 && (
                                <div className="text-center text-xs mt-6 space-y-3" style={{ color: '#6B6B66' }}>
                                    <div className="text-2xl">🥤</div>
                                    <p className="font-medium">Hier is nog niks</p>
                                    <p className="text-[11px]" style={{ color: '#9C9C95' }}>Als jij een plastic voorbeeld typt in de chat, komt het hier terecht.</p>
                                    <div className="rounded-lg p-3 text-left" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0EEE8' }}>
                                        <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: '#D97757' }}>Typ dit in de chat:</p>
                                        <p className="text-xs font-mono" style={{ color: '#3D3D38' }}>"Een plastic flesje is plastic"</p>
                                        <p className="text-xs font-mono" style={{ color: '#3D3D38' }}>"Een lege chipszak is plastic"</p>
                                    </div>
                                </div>
                            )}
                            {needsPlasticExamples && data.classAItems.length > 0 && data.classAItems.length < 2 && (
                                <div className="rounded-lg p-2 text-center text-xs" style={{ backgroundColor: 'rgba(217, 119, 87, 0.06)', border: '1px dashed rgba(217, 119, 87, 0.3)', color: '#D97757' }}>
                                    Typ nog een plastic voorbeeld in de chat!
                                </div>
                            )}
                            {data.classAItems.map((item, i) => (
                                <div key={i} className="text-sm px-3 py-2 rounded-lg animate-in zoom-in slide-in-from-top-2 duration-300 flex items-center gap-2" style={{ backgroundColor: 'rgba(217, 119, 87, 0.08)', border: '1px solid rgba(217, 119, 87, 0.2)', color: '#C46849' }}>
                                    <Check size={14} className="shrink-0" style={{ color: '#D97757' }} /> {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Class B Bucket (Right) - PAPER */}
                    <div className="rounded-2xl p-4 flex flex-col relative" style={{ backgroundColor: 'rgba(42, 157, 143, 0.04)', border: '2px solid rgba(42, 157, 143, 0.2)' }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-2" style={{ backgroundColor: '#2A9D8F' }}>
                            <FileText size={12} /> {data.classBLabel || "Papier"}
                        </div>

                        <div className="mt-4 flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                            {data.classBItems.length === 0 && (
                                <div className="text-center text-xs mt-6 space-y-3" style={{ color: '#6B6B66' }}>
                                    <div className="text-2xl">📰</div>
                                    <p className="font-medium">Hier is nog niks</p>
                                    <p className="text-[11px]" style={{ color: '#9C9C95' }}>Als jij een papier voorbeeld typt in de chat, komt het hier terecht.</p>
                                    <div className="rounded-lg p-3 text-left" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0EEE8' }}>
                                        <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: '#2A9D8F' }}>Typ dit in de chat:</p>
                                        <p className="text-xs font-mono" style={{ color: '#3D3D38' }}>"Een oude krant is papier"</p>
                                        <p className="text-xs font-mono" style={{ color: '#3D3D38' }}>"Een kartonnen doos is papier"</p>
                                    </div>
                                </div>
                            )}
                            {needsPaperExamples && data.classBItems.length > 0 && data.classBItems.length < 2 && (
                                <div className="rounded-lg p-2 text-center text-xs" style={{ backgroundColor: 'rgba(42, 157, 143, 0.06)', border: '1px dashed rgba(42, 157, 143, 0.3)', color: '#2A9D8F' }}>
                                    Typ nog een papier voorbeeld in de chat!
                                </div>
                            )}
                            {data.classBItems.map((item, i) => (
                                <div key={i} className="text-sm px-3 py-2 rounded-lg animate-in zoom-in slide-in-from-top-2 duration-300 flex items-center gap-2" style={{ backgroundColor: 'rgba(42, 157, 143, 0.08)', border: '1px solid rgba(42, 157, 143, 0.2)', color: '#1a7a6f' }}>
                                    <Check size={14} className="shrink-0" style={{ color: '#2A9D8F' }} /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Testing Zone */}
                <div className="rounded-2xl p-4 relative min-h-[100px] flex items-center justify-between gap-4 shrink-0 z-10" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                    <div className="absolute -top-3 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FAF9F0', color: '#6B6B66', border: '1px solid #E8E6DF' }}>
                        TEST ZONE
                    </div>

                    {data.testItem ? (
                        <>
                            <div className="font-bold px-4 py-3 rounded-xl shadow-sm text-lg animate-in slide-in-from-left" style={{ backgroundColor: '#FAF9F0', color: '#1A1A19', border: '1px solid #E8E6DF' }}>
                                "{data.testItem.name}"
                            </div>

                            <ArrowRight className="shrink-0" style={{ color: '#D5D3CC' }} />

                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-white shadow-sm animate-in zoom-in duration-500"
                                style={{
                                    backgroundColor: data.testItem.predictedClass === 'A' ? '#D97757' :
                                        data.testItem.predictedClass === 'B' ? '#2A9D8F' : '#6B6B66'
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
                        <div className="w-full text-center text-sm flex flex-col items-center gap-2" style={{ color: '#6B6B66' }}>
                            <img src="/mascot/pip-thinking.webp" alt="Pip denkt na" className="w-12 h-12 object-contain" />
                            <span className="font-medium" style={{ color: '#1A1A19' }}>Hier test je de AI straks</span>
                            <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <p style={{ color: '#3D3D38' }}>Als je genoeg voorbeelden hebt gegeven, typ dan in de chat:</p>
                                <p className="font-mono font-medium mt-1" style={{ color: '#D97757' }}>"Waar hoort een cola flesje bij?"</p>
                            </div>
                            <p className="text-[10px]" style={{ color: '#9C9C95' }}>De AI probeert dan zelf te bedenken waar het bij hoort.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
