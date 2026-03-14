import React, { useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, ThumbsUp, ThumbsDown, Scale, Sparkles } from 'lucide-react';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: any;
    vsoProfile?: any;
}

interface AuctionRound {
    emoji: string;
    service: string;
    benefit: string;
    dataAsked: string[];
    privacyRisk: 'low' | 'medium' | 'high' | 'extreme';
    explanation: string;
    avgStat: number; // percentage of people who accept
}

const ROUNDS: AuctionRound[] = [
    {
        emoji: '🎵', service: 'Gratis muziek streamen', benefit: 'Onbeperkt muziek luisteren zonder reclame',
        dataAsked: ['Luistergeschiedenis', 'Leeftijd'],
        privacyRisk: 'low', explanation: 'Luistergeschiedenis delen is relatief onschuldig. Spotify & Apple Music doen dit al. Risico: je profiel wordt gebruikt voor gerichte reclame.',
        avgStat: 85
    },
    {
        emoji: '🎮', service: 'Premium game account', benefit: 'Alle DLCs, skins en battle passes — gratis',
        dataAsked: ['Speeltijd per dag', 'Vriendenlijst', 'Chatberichten'],
        privacyRisk: 'medium', explanation: 'Chatberichten delen gaat ver! Je privégesprekken kunnen worden geanalyseerd. Speeltijd is minder gevoelig, maar kan gebruikt worden om "verslavingsprofielen" te maken.',
        avgStat: 62
    },
    {
        emoji: '📱', service: 'Nieuwste iPhone gratis', benefit: 'Elk jaar het nieuwste model, helemaal gratis',
        dataAsked: ['Locatie 24/7', 'Alle foto\'s', 'Contactenlijst', 'Browsegeschiedenis'],
        privacyRisk: 'high', explanation: 'Dit is een ENORME hoeveelheid data. Je locatie 24/7 + foto\'s + contacten = je hele leven is zichtbaar. Bedrijven kunnen weten waar je bent, met wie, en wat je doet.',
        avgStat: 38
    },
    {
        emoji: '💰', service: '€500 per maand', benefit: 'Elke maand €500 op je rekening — geen vragen',
        dataAsked: ['BSN-nummer', 'Medische gegevens', 'Bankgegevens', 'Biometrische data (vingerafdruk)'],
        privacyRisk: 'extreme', explanation: 'BSN + medische data + biometrisch = je complete identiteit. Dit kan leiden tot identiteitsfraude, verzekeringsdiscriminatie en onherstelbare schade. Biometrische data kun je NIET veranderen als het lekt!',
        avgStat: 12
    },
    {
        emoji: '🏫', service: 'Altijd een 8+ op school', benefit: 'AI maakt je huiswerk en past je cijfers aan',
        dataAsked: ['Schoolresultaten', 'Leerlingdossier', 'Gedragsrapporten', 'Camera in klaslokaal'],
        privacyRisk: 'extreme', explanation: 'Afgezien van de ethische problemen (fraude!): een camera in het klaslokaal + je complete dossier = totale surveillance. En als dit lekt, is je schoolcarrière voorgoed beschadigd.',
        avgStat: 8
    }
];

const RISK_COLORS = { low: 'bg-[#10B981]', medium: 'bg-[#D97757]', high: 'bg-red-500', extreme: 'bg-red-700' };
const RISK_LABELS = { low: 'Laag risico', medium: 'Gemiddeld risico', high: 'Hoog risico', extreme: 'Extreem risico' };

export const DataVoorDataMission: React.FC<Props> = ({ onBack, onComplete }) => {
    const [phase, setPhase] = useState<'intro' | 'auction' | 'results'>('intro');
    const [currentRound, setCurrentRound] = useState(0);
    const [choices, setChoices] = useState<('deal' | 'no-deal')[]>([]);
    const [showExplanation, setShowExplanation] = useState(false);
    const [hasChosen, setHasChosen] = useState(false);

    const handleChoice = (choice: 'deal' | 'no-deal') => {
        if (hasChosen) return;
        setHasChosen(true);
        setChoices(prev => [...prev, choice]);
        setShowExplanation(true);
    };

    const nextRound = () => {
        setHasChosen(false);
        setShowExplanation(false);
        if (currentRound < ROUNDS.length - 1) setCurrentRound(c => c + 1);
        else setPhase('results');
    };

    const getScore = () => {
        let score = 0;
        choices.forEach((choice, i) => {
            const risk = ROUNDS[i].privacyRisk;
            if (choice === 'no-deal' && (risk === 'high' || risk === 'extreme')) score += 25;
            else if (choice === 'no-deal' && risk === 'medium') score += 15;
            else if (choice === 'deal' && risk === 'low') score += 10;
            else if (choice === 'deal' && risk === 'extreme') score -= 10;
        });
        return Math.max(0, Math.min(100, score));
    };

    const getBadge = () => {
        const s = getScore();
        if (s >= 80) return { emoji: '🛡️', title: 'Privacy Kampioen', color: 'from-[#10B981] to-[#2A9D8F]' };
        if (s >= 50) return { emoji: '⚖️', title: 'Data Diplomaat', color: 'from-[#2A9D8F] to-[#8B6F9E]' };
        return { emoji: '💸', title: 'Data Verkoper', color: 'from-[#D97757] to-[#C46849]' };
    };

    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-[#FAF9F0] text-[#1A1A19] overflow-y-auto p-4 pb-safe">
                <button onClick={onBack} className="flex items-center gap-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300 mb-6"><ArrowLeft size={18} /> <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Terug</span></button>
                <div className="max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-[#D97757]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#D97757]/20 animate-bounce"><span className="text-4xl">💰</span></div>
                    <h1 className="text-3xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Data voor Data</h1>
                    <p className="text-[#3D3D38] text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Hoeveel van je persoonlijke data zou jij inruilen voor gratis diensten? In deze veiling bepaal jij je prijs — maar elke <span className="text-[#D97757] font-bold">deal heeft een keerzijde</span>.
                    </p>
                    <div className="bg-white border border-[#E8E6DF] rounded-2xl p-4 max-w-xs mx-auto">
                        <div className="flex items-center justify-around">
                            <div className="text-center">
                                <ThumbsUp size={24} className="text-[#10B981] mx-auto" />
                                <p className="text-[10px] text-[#6B6B66] mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>DEAL!</p>
                            </div>
                            <div className="text-2xl text-[#E8E6DF]">of</div>
                            <div className="text-center">
                                <ThumbsDown size={24} className="text-[#D97757] mx-auto" />
                                <p className="text-[10px] text-[#6B6B66] mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>NO DEAL!</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-[#6B6B66] text-xs" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>5 rondes -- vergelijk je keuzes met anderen</p>
                    <button onClick={() => setPhase('auction')} className="px-8 py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97757]/30 focus-visible:ring-2 focus-visible:ring-[#D97757]">Start de veiling →</button>
                </div>
            </div>
        );
    }

    if (phase === 'auction') {
        const round = ROUNDS[currentRound];
        return (
            <div className="min-h-screen bg-[#FAF9F0] text-[#1A1A19] overflow-y-auto p-4 pb-safe">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Ronde {currentRound + 1}/{ROUNDS.length}</span>
                        <div className="flex gap-1.5">{ROUNDS.map((_, i) => (<div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-300 ${i < currentRound ? (choices[i] === 'deal' ? 'bg-[#10B981]' : 'bg-[#D97757]') : i === currentRound ? 'bg-gradient-to-r from-[#D97757] to-[#C46849]' : 'bg-[#E8E6DF]'}`} />))}</div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 mb-6 text-center">
                        <span className="text-5xl mb-3 block">{round.emoji}</span>
                        <h3 className="text-xl font-black mb-1 text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{round.service}</h3>
                        <p className="text-sm text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{round.benefit}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-6">
                        <p className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest mb-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>In ruil voor:</p>
                        <div className="flex flex-wrap gap-2">
                            {round.dataAsked.map((d, i) => (
                                <span key={i} className="inline-flex bg-[#FAF9F0] border border-[#E8E6DF] px-3 py-1.5 rounded-full text-xs font-bold text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{d}</span>
                            ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${RISK_COLORS[round.privacyRisk]}`} />
                            <span className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{RISK_LABELS[round.privacyRisk]}</span>
                        </div>
                    </div>

                    {!hasChosen && (
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handleChoice('deal')} className="py-5 bg-[#10B981]/10 hover:bg-[#10B981]/20 border-2 border-[#10B981]/30 rounded-2xl font-black text-lg transition-all duration-300 active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#10B981]">
                                <ThumbsUp size={28} className="text-[#10B981]" />
                                <span className="text-[#10B981]">DEAL!</span>
                            </button>
                            <button onClick={() => handleChoice('no-deal')} className="py-5 bg-[#D97757]/10 hover:bg-[#D97757]/20 border-2 border-[#D97757]/30 rounded-2xl font-black text-lg transition-all duration-300 active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#D97757]">
                                <ThumbsDown size={28} className="text-[#D97757]" />
                                <span className="text-[#D97757]">NO DEAL!</span>
                            </button>
                        </div>
                    )}

                    {showExplanation && (
                        <div className="mt-6 space-y-4">
                            <div className="bg-[#D97757]/5 border border-[#D97757]/20 rounded-2xl p-4">
                                <div className="flex items-start gap-2"><Sparkles size={16} className="text-[#D97757] mt-0.5 flex-shrink-0" /><p className="text-sm text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{round.explanation}</p></div>
                            </div>
                            <div className="bg-white rounded-2xl border border-[#E8E6DF] p-3 flex items-center justify-between">
                                <span className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Anderen die DEAL kozen:</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-[#F0EEE8] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#D97757] to-[#C46849] rounded-full" style={{ width: `${round.avgStat}%` }} /></div>
                                    <span className="text-xs font-black text-[#D97757]">{round.avgStat}%</span>
                                </div>
                            </div>
                            <button onClick={nextRound} className="w-full py-3 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]">
                                {currentRound < ROUNDS.length - 1 ? <>Volgende ronde <ChevronRight size={16} /></> : <>Bekijk resultaat <Trophy size={16} /></>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const badge = getBadge();
    const dealCount = choices.filter(c => c === 'deal').length;
    return (
        <div className="min-h-screen bg-[#FAF9F0] text-[#1A1A19] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 pb-safe">
            <div className="max-w-sm w-full text-center space-y-6">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl`}><span className="text-5xl">{badge.emoji}</span></div>
                <h1 className="text-2xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{badge.title}</h1>
                <p className="text-[#6B6B66] text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{dealCount}x DEAL — {ROUNDS.length - dealCount}x NO DEAL</p>
                <div className="bg-white rounded-2xl p-4 border border-[#E8E6DF]">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D97757] to-[#C46849]">{getScore()}/100</div>
                    <p className="text-[#6B6B66] text-xs mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Privacy Score</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-left space-y-3 border border-[#E8E6DF]">
                    <p className="text-xs font-bold text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Jouw keuzes vs. het gemiddelde:</p>
                    {ROUNDS.map((r, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{r.emoji} {r.service.split(' ').slice(0, 2).join(' ')}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-flex border ${choices[i] === 'deal' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#D97757]/10 text-[#D97757] border-[#D97757]/20'}`}>{choices[i] === 'deal' ? 'DEAL' : 'NO DEAL'}</span>
                                <span className="text-[10px] text-[#6B6B66]">({r.avgStat}% deal)</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl p-4 text-left border border-[#E8E6DF]">
                    <p className="text-xs font-bold text-[#3D3D38] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>De les:</p>
                    <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>"Gratis" bestaat niet op internet. Je betaalt altijd met je data. Hoe meer je deelt, hoe meer macht je weggeeft. Kies bewust!</p>
                </div>
                <button onClick={() => onComplete(true)} className="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#10B981]"><Trophy size={20} /> Missie Voltooid!</button>
            </div>
            </div>
        </div>
    );
};
