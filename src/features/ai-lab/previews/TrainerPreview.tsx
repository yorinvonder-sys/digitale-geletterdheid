
import React, { useState, useEffect } from 'react';
import { TrainerData } from '@/types';
import { Database, ArrowRight, BrainCircuit, Check, HelpCircle, Trash2, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { MissionConclusion } from '@/features/missions/shared/MissionConclusion';

interface TrainerPreviewProps {
    data: TrainerData;
}

const AI_TRAINER_ACCENT = '#202023';
const AI_TRAINER_ACCENT_SOFT = 'rgba(95, 148, 125, 0.06)';
const AI_TRAINER_ACCENT_BORDER = 'rgba(95, 148, 125, 0.2)';
const PLASTIC_ACCENT = '#202023';
const PLASTIC_ACCENT_SOFT = 'rgba(11, 69, 63, 0.06)';
const PLASTIC_ACCENT_BORDER = 'rgba(11, 69, 63, 0.2)';

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
                w-full max-w-[17rem] px-5 py-3 rounded-full font-bold text-base transition-all duration-300
                flex items-center justify-center gap-3 relative overflow-hidden
                ${isReady
                    ? 'text-white shadow-xl active:scale-95 cursor-pointer'
                    : 'cursor-not-allowed'
                }
            `}
            style={{
                backgroundColor: isReady ? AI_TRAINER_ACCENT : '#e3e2dc',
                color: isReady ? '#FFFFFF' : '#6f6e69',
                border: isReady ? undefined : '1px solid #E7D8BD',
            }}
            onMouseEnter={e => { if (isReady) e.currentTarget.style.backgroundColor = AI_TRAINER_ACCENT; }}
            onMouseLeave={e => { if (isReady) e.currentTarget.style.backgroundColor = AI_TRAINER_ACCENT; }}
        >
            {!isReady ? (
                <>
                    <div className="relative w-7 h-7">
                        <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e3e2dc"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={AI_TRAINER_ACCENT}
                                strokeWidth="3"
                                strokeDasharray={`${((3 - countdown) / 3) * 100}, 100`}
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black" style={{ color: '#6f6e69' }}>
                            {countdown}
                        </span>
                    </div>
                    <span className="text-sm" style={{ color: '#6f6e69' }}>Lees eerst de stappen hieronder...</span>
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
            <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: '#f2f1ec' }}>
                {/* Content — fits in one viewport without scrolling */}
                <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-5 relative z-10 overflow-y-auto">
                    {/* Mascot + title inline */}
                    <div className="flex items-center gap-2 mb-2">
                        <img
                            src="/assets/brand/dgskills-duck-guide-v3.png"
                            alt="DGSkills eend"
                            className="w-11 h-11 object-contain"
                        />
                        <h2 className="text-xl font-black tracking-tight text-balance" style={{ color: '#202023' }}>
                            Welkom bij AI Trainer!
                        </h2>
                    </div>
                    <p className="text-center max-w-md mb-3 leading-snug text-xs md:text-sm" style={{ color: '#6f6e69' }}>
                        Leer een computer om afval te sorteren. Jij geeft voorbeelden, en de AI leert daarvan.
                    </p>

                    {/* Wat ga je doen */}
                    <div className="rounded-2xl p-3.5 max-w-lg w-full mb-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: AI_TRAINER_ACCENT }}>
                            Wat ga je doen?
                        </h3>
                        <p className="text-xs md:text-sm mb-3 leading-snug" style={{ color: '#6f6e69' }}>
                            Je typt zinnen in het chatveld onderaan. De AI leest jouw zin en sorteert het in de juiste bak hierboven.
                        </p>

                        <div className="space-y-2">
                            {/* Stap 1 & 2 side by side */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-xl p-2.5" style={{ backgroundColor: '#f2f1ec', border: '1px solid #E7D8BD' }}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[11px] text-white" style={{ backgroundColor: PLASTIC_ACCENT }}>1</span>
                                        <span className="font-bold text-xs" style={{ color: '#202023' }}>Voorbeeld plastic</span>
                                    </div>
                                    <p className="text-xs font-mono ml-7 leading-snug" style={{ color: PLASTIC_ACCENT }}>"Een flesje is plastic"</p>
                                </div>
                                <div className="rounded-xl p-2.5" style={{ backgroundColor: '#f2f1ec', border: '1px solid #E7D8BD' }}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[11px] text-white" style={{ backgroundColor: '#202023' }}>2</span>
                                        <span className="font-bold text-xs" style={{ color: '#202023' }}>Voorbeeld papier</span>
                                    </div>
                                    <p className="text-xs font-mono ml-7 leading-snug" style={{ color: '#202023' }}>"Een krant is papier"</p>
                                </div>
                            </div>

                            {/* Stap 3 & 4 side by side */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-xl p-2.5" style={{ backgroundColor: '#f2f1ec', border: '1px solid #E7D8BD' }}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[11px] text-white" style={{ backgroundColor: '#202023' }}>3</span>
                                        <span className="font-bold text-xs" style={{ color: '#202023' }}>Herhaal</span>
                                    </div>
                                    <p className="text-[11px] ml-7 leading-snug" style={{ color: '#6f6e69' }}>
                                        Minstens 3 per bak
                                    </p>
                                </div>
                                <div className="rounded-xl p-2.5" style={{ backgroundColor: '#f2f1ec', border: '1px solid #E7D8BD' }}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[11px] text-white" style={{ backgroundColor: '#202023' }}>4</span>
                                        <span className="font-bold text-xs" style={{ color: '#202023' }}>Test de AI</span>
                                    </div>
                                    <p className="text-xs font-mono ml-7 leading-snug" style={{ color: '#202023' }}>"Waar hoort een eierdoos bij?"</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Samenvatting */}
                    <div className="rounded-xl p-2.5 max-w-lg w-full mb-3" style={{ backgroundColor: AI_TRAINER_ACCENT_SOFT, border: `1px solid ${AI_TRAINER_ACCENT_BORDER}` }}>
                        <p className="text-xs text-center leading-snug" style={{ color: '#6f6e69' }}>
                            <strong style={{ color: AI_TRAINER_ACCENT }}>Kort gezegd:</strong> je bouwt eerst een dataset, daarna test je de robot met iets nieuws. Pas dan zie je of je training goed genoeg was.
                        </p>
                    </div>

                    {/* Start Button with Countdown */}
                    <StartButton countdown={readCountdown} onStart={() => setHasStarted(true)} />
                </div>
            </div>
        );
    }

    // Calculate if we should show hints
    const totalTrainingItems = data.classAItems.length + data.classBItems.length;
    const needsPlasticExamples = data.classAItems.length < 2;
    const needsPaperExamples = data.classBItems.length < 2;
    const showInstructionBanner = data.classAItems.length === 0 && data.classBItems.length === 0;
    const hasBalancedDataset = data.classAItems.length >= 3 && data.classBItems.length >= 3;
    const hasTestedModel = Boolean(data.testItem);
    const canCompleteMission = hasBalancedDataset && hasTestedModel;
    const classALabel = data.classALabel && data.classALabel !== 'A' ? data.classALabel : 'Plastic';
    const classBLabel = data.classBLabel && data.classBLabel !== 'B' ? data.classBLabel : 'Papier';
    const trainingSteps = [
        { label: 'Plastic voorbeelden', done: data.classAItems.length >= 3, value: `${Math.min(data.classAItems.length, 3)}/3` },
        { label: 'Papier voorbeelden', done: data.classBItems.length >= 3, value: `${Math.min(data.classBItems.length, 3)}/3` },
        { label: 'AI getest', done: hasTestedModel, value: hasTestedModel ? '1/1' : '0/1' },
    ];

    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden font-sans" style={{ backgroundColor: '#f2f1ec', borderLeft: '1px solid #E7D8BD' }}>

            {/* Header */}
            <div className="px-4 py-3 flex justify-between items-center shrink-0 z-20" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E7D8BD' }}>
                <div className="flex items-center gap-3">
                    <img src="/assets/brand/dgskills-duck-guide-v3.png" alt="DGSkills eend" className="w-8 h-8 object-contain" loading="lazy" />
                    <div>
                        <h3 className="font-bold text-xs tracking-wider uppercase" style={{ color: AI_TRAINER_ACCENT }}>Sorteer Lab</h3>
                        <span className="font-bold text-sm" style={{ color: '#202023' }}>Afval Sorteerder</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="text-[10px] px-2 py-1 rounded-full flex items-center font-bold" style={{ backgroundColor: '#f2f1ec', color: '#6f6e69', border: '1px solid #E7D8BD' }}>
                        <span>DATASET: {data.classAItems.length + data.classBItems.length}</span>
                    </div>
                    {/* Completion Button */}
                    {canCompleteMission && (
                        <button
                            onClick={() => setShowConclusion(true)}
                            className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors text-white"
                            style={{ backgroundColor: '#202023' }}
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
                        <img src="/assets/brand/dgskills-duck-guide-v3.png" alt="DGSkills eend" className="w-10 h-10 object-contain shrink-0" loading="lazy" />
                        <div>
                            <h4 className="font-bold text-sm mb-1" style={{ color: '#202023' }}>Wat moet je nu doen?</h4>
                            <p className="text-xs leading-relaxed mb-2" style={{ color: '#6f6e69' }}>
                                Typ een zin in het <strong>chatveld onderaan</strong>. Vertel de AI wat voor soort afval iets is.
                            </p>
                            <div className="rounded-lg px-3 py-2 space-y-1" style={{ backgroundColor: '#f2f1ec', border: '1px solid #E7D8BD' }}>
                                <p className="text-xs font-medium" style={{ color: '#6f6e69' }}>Typ bijvoorbeeld:</p>
                                <p className="text-sm font-mono" style={{ color: PLASTIC_ACCENT }}>"Een plastic flesje is plastic"</p>
                                <p className="text-sm font-mono" style={{ color: '#202023' }}>"Een krant is papier"</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-y-auto min-h-0">

                {/* Model Status */}
                <div className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                    <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(95, 148, 125, 0.08)', border: '2px solid rgba(95, 148, 125, 0.22)' }}>
                                <Database size={28} style={{ color: '#202023' }} />
                            </div>
                            <div className="absolute -right-2 -bottom-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: hasBalancedDataset ? '#202023' : '#ff3c21' }}>
                                {totalTrainingItems}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-sm mb-1" style={{ color: '#202023' }}>AI-robot training</h4>
                            <p className="text-xs leading-relaxed mb-3" style={{ color: '#6f6e69' }}>
                                De robot leert niet van één colafles. Hij vergelijkt meerdere voorbeelden, ontdekt patronen en probeert daarna een nieuw voorwerp zelf te sorteren.
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {trainingSteps.map(step => (
                                    <div key={step.label} className="rounded-xl p-2" style={{ backgroundColor: step.done ? 'rgba(95, 148, 125, 0.08)' : '#f2f1ec', border: `1px solid ${step.done ? 'rgba(95, 148, 125, 0.25)' : '#e3e2dc'}` }}>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            {step.done ? <Check size={13} style={{ color: '#202023' }} /> : <Sparkles size={13} style={{ color: '#ff3c21' }} />}
                                            <span className="text-[10px] font-black uppercase" style={{ color: step.done ? '#202023' : '#6f6e69' }}>{step.value}</span>
                        </div>
                                        <p className="text-[11px] leading-tight" style={{ color: '#6f6e69' }}>{step.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contextuele hint op basis van voortgang */}
                {data.classAItems.length > 0 && data.classBItems.length === 0 && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(95, 148, 125, 0.06)', border: '1px solid rgba(95, 148, 125, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#202023' }}>Nu heb je plastic voorbeelden gegeven. Typ nu een <strong>papier</strong> voorbeeld, bijv: <em>"Een kartonnen doos is papier"</em></p>
                    </div>
                )}
                {data.classAItems.length === 0 && data.classBItems.length > 0 && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: PLASTIC_ACCENT_SOFT, border: `1px solid ${PLASTIC_ACCENT_BORDER}` }}>
                        <p className="text-xs" style={{ color: PLASTIC_ACCENT }}>Nu heb je papier voorbeelden gegeven. Typ nu een <strong>plastic</strong> voorbeeld, bijv: <em>"Een plastic tasje is plastic"</em></p>
                    </div>
                )}
                {data.classAItems.length >= 1 && data.classBItems.length >= 1 && !data.testItem && (data.classAItems.length + data.classBItems.length) < 6 && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(11, 69, 63, 0.06)', border: '1px solid rgba(11, 69, 63, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#202023' }}>Goed bezig! Voeg nog meer voorbeelden toe. Hoe meer je geeft, hoe slimmer de AI wordt. Probeer minstens 3 per categorie.</p>
                    </div>
                )}
                {hasBalancedDataset && !data.testItem && (
                    <div className="mx-2 rounded-lg p-2 text-center" style={{ backgroundColor: AI_TRAINER_ACCENT_SOFT, border: `1px solid ${AI_TRAINER_ACCENT_BORDER}` }}>
                        <p className="text-xs" style={{ color: '#202023' }}>Je dataset is sterk genoeg. <strong>Test nu de AI</strong> met iets nieuws, bijvoorbeeld: <em>"Waar hoort een eierdoos bij?"</em></p>
                    </div>
                )}

                {/* Training Buckets */}
                <div className="grid grid-cols-2 gap-4 flex-1 min-h-[200px]">

                    {/* Class A Bucket (Left) - PLASTIC */}
                    <div className="rounded-2xl p-4 flex flex-col relative" style={{ backgroundColor: 'rgba(11, 69, 63, 0.04)', border: `2px solid ${PLASTIC_ACCENT_BORDER}` }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-2" style={{ backgroundColor: PLASTIC_ACCENT }}>
                            <Trash2 size={12} /> {classALabel}
                        </div>

                        <div className="mt-4 flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                            {data.classAItems.length === 0 && (
                                <div className="text-center text-xs mt-6 space-y-3" style={{ color: '#6f6e69' }}>
                                    <div className="text-2xl">🥤</div>
                                    <p className="font-medium">Hier is nog niks</p>
                                    <p className="text-[11px]" style={{ color: '#6f6e69' }}>Als jij een plastic voorbeeld typt in de chat, komt het hier terecht.</p>
                                    <div className="rounded-lg p-3 text-left" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                                        <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: PLASTIC_ACCENT }}>Typ dit in de chat:</p>
                                        <p className="text-xs font-mono" style={{ color: '#6f6e69' }}>"Een plastic flesje is plastic"</p>
                                        <p className="text-xs font-mono" style={{ color: '#6f6e69' }}>"Een lege chipszak is plastic"</p>
                                    </div>
                                </div>
                            )}
                            {needsPlasticExamples && data.classAItems.length > 0 && data.classAItems.length < 2 && (
                                <div className="rounded-lg p-2 text-center text-xs" style={{ backgroundColor: PLASTIC_ACCENT_SOFT, border: '1px dashed rgba(11, 69, 63, 0.3)', color: PLASTIC_ACCENT }}>
                                    Typ nog een plastic voorbeeld in de chat!
                                </div>
                            )}
                            {data.classAItems.map((item, i) => (
                                <div key={i} className="text-sm px-3 py-2 rounded-lg animate-in zoom-in slide-in-from-top-2 duration-300 flex items-center gap-2" style={{ backgroundColor: 'rgba(11, 69, 63, 0.08)', border: `1px solid ${PLASTIC_ACCENT_BORDER}`, color: PLASTIC_ACCENT }}>
                                    <Check size={14} className="shrink-0" style={{ color: PLASTIC_ACCENT }} /> {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Class B Bucket (Right) - PAPER */}
                    <div className="rounded-2xl p-4 flex flex-col relative" style={{ backgroundColor: 'rgba(95, 148, 125, 0.04)', border: '2px solid rgba(95, 148, 125, 0.2)' }}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-2" style={{ backgroundColor: '#202023' }}>
                            <FileText size={12} /> {classBLabel}
                        </div>

                        <div className="mt-4 flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                            {data.classBItems.length === 0 && (
                                <div className="text-center text-xs mt-6 space-y-3" style={{ color: '#6f6e69' }}>
                                    <div className="text-2xl">📰</div>
                                    <p className="font-medium">Hier is nog niks</p>
                                    <p className="text-[11px]" style={{ color: '#6f6e69' }}>Als jij een papier voorbeeld typt in de chat, komt het hier terecht.</p>
                                    <div className="rounded-lg p-3 text-left" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                                        <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: '#202023' }}>Typ dit in de chat:</p>
                                        <p className="text-xs font-mono" style={{ color: '#6f6e69' }}>"Een oude krant is papier"</p>
                                        <p className="text-xs font-mono" style={{ color: '#6f6e69' }}>"Een kartonnen doos is papier"</p>
                                    </div>
                                </div>
                            )}
                            {needsPaperExamples && data.classBItems.length > 0 && data.classBItems.length < 2 && (
                                <div className="rounded-lg p-2 text-center text-xs" style={{ backgroundColor: 'rgba(95, 148, 125, 0.06)', border: '1px dashed rgba(95, 148, 125, 0.3)', color: '#202023' }}>
                                    Typ nog een papier voorbeeld in de chat!
                                </div>
                            )}
                            {data.classBItems.map((item, i) => (
                                <div key={i} className="text-sm px-3 py-2 rounded-lg animate-in zoom-in slide-in-from-top-2 duration-300 flex items-center gap-2" style={{ backgroundColor: 'rgba(95, 148, 125, 0.08)', border: '1px solid rgba(95, 148, 125, 0.2)', color: '#202023' }}>
                                    <Check size={14} className="shrink-0" style={{ color: '#202023' }} /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Testing Zone */}
                <div className="rounded-2xl p-4 relative min-h-[100px] flex items-center justify-between gap-4 shrink-0 z-10" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                    <div className="absolute -top-3 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f2f1ec', color: '#6f6e69', border: '1px solid #E7D8BD' }}>
                        TEST ZONE
                    </div>

                    {data.testItem ? (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: '#6f6e69' }}>Nieuw testvoorwerp</p>
                                <div className="font-bold px-4 py-3 rounded-xl shadow-sm text-base animate-in slide-in-from-left" style={{ backgroundColor: '#f2f1ec', color: '#202023', border: '1px solid #E7D8BD' }}>
                                    "{data.testItem.name}"
                                </div>
                            </div>

                            <ArrowRight className="shrink-0" style={{ color: '#e3e2dc' }} />

                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: '#6f6e69' }}>Voorspelling van jouw AI</p>
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-white shadow-sm animate-in zoom-in duration-500"
                                    style={{
                                        backgroundColor: data.testItem.predictedClass === 'A' ? PLASTIC_ACCENT :
                                            data.testItem.predictedClass === 'B' ? '#202023' : '#6f6e69'
                                    }}
                                >
                                    {data.testItem.predictedClass === 'A' && <Trash2 size={20} />}
                                    {data.testItem.predictedClass === 'B' && <FileText size={20} />}
                                    {data.testItem.predictedClass === 'unknown' && <HelpCircle size={20} />}

                                    <span>
                                        {data.testItem.predictedClass === 'A' ? classALabel :
                                            data.testItem.predictedClass === 'B' ? classBLabel : "Onbekend"}
                                    </span>

                                    <span className="text-[10px] ml-2 opacity-80 font-mono">
                                        {Math.round(data.testItem.confidence * 100)}%
                                    </span>
                                </div>
                                <p className="text-[11px] mt-2 leading-snug" style={{ color: '#6f6e69' }}>
                                    Dit is het vervolg: controleer of de voorspelling klopt. Twijfelt de AI of zit hij fout? Voeg een beter voorbeeld toe en test opnieuw.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="w-full text-center text-sm flex flex-col items-center gap-2" style={{ color: '#6f6e69' }}>
                            <img src="/assets/brand/dgskills-duck-guide-v3.png" alt="DGSkills eend denkt mee" className="w-12 h-12 object-contain" loading="lazy" />
                            <span className="font-medium" style={{ color: '#202023' }}>Hier test je de AI straks</span>
                            <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: '#f2f1ec', border: '1px solid #E7D8BD' }}>
                                <p style={{ color: '#6f6e69' }}>Als je genoeg voorbeelden hebt gegeven, typ dan in de chat:</p>
                                <p className="font-mono font-medium mt-1" style={{ color: PLASTIC_ACCENT }}>"Waar hoort een cola flesje bij?"</p>
                            </div>
                            <p className="text-[10px]" style={{ color: '#6f6e69' }}>De AI probeert dan zelf te bedenken waar het bij hoort.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
