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

const RISK_COLORS = { low: 'bg-green-500', medium: 'bg-amber-500', high: 'bg-red-500', extreme: 'bg-red-700' };
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
        if (s >= 80) return { emoji: '🛡️', title: 'Privacy Kampioen', color: 'from-emerald-500 to-teal-600' };
        if (s >= 50) return { emoji: '⚖️', title: 'Data Diplomaat', color: 'from-blue-500 to-indigo-500' };
        return { emoji: '💸', title: 'Data Verkoper', color: 'from-amber-500 to-red-500' };
    };

    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-950 via-slate-950 to-slate-950 text-white p-4 pb-safe">
                <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-6"><ArrowLeft size={18} /> <span className="text-sm font-bold">Terug</span></button>
                <div className="max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-amber-500/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30 animate-bounce"><span className="text-4xl">💰</span></div>
                    <h1 className="text-3xl font-black">Data voor Data</h1>
                    <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto">
                        Hoeveel van je persoonlijke data zou jij inruilen voor gratis diensten? In deze veiling bepaal jij je prijs — maar elke <span className="text-amber-400 font-bold">deal heeft een keerzijde</span>.
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-xs mx-auto">
                        <div className="flex items-center justify-around">
                            <div className="text-center">
                                <ThumbsUp size={24} className="text-emerald-400 mx-auto" />
                                <p className="text-[10px] text-white/60 mt-1">DEAL!</p>
                            </div>
                            <div className="text-2xl text-white/20">of</div>
                            <div className="text-center">
                                <ThumbsDown size={24} className="text-red-400 mx-auto" />
                                <p className="text-[10px] text-white/60 mt-1">NO DEAL!</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-white/40 text-xs">5 rondes • vergelijk je keuzes met anderen</p>
                    <button onClick={() => setPhase('auction')} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-amber-500/30">Start de veiling →</button>
                </div>
            </div>
        );
    }

    if (phase === 'auction') {
        const round = ROUNDS[currentRound];
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-4 pb-safe">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ronde {currentRound + 1}/{ROUNDS.length}</span>
                        <div className="flex gap-1.5">{ROUNDS.map((_, i) => (<div key={i} className={`w-8 h-1.5 rounded-full ${i < currentRound ? (choices[i] === 'deal' ? 'bg-emerald-500' : 'bg-red-500') : i === currentRound ? 'bg-amber-500' : 'bg-white/10'}`} />))}</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl border border-amber-500/20 p-6 mb-6 text-center">
                        <span className="text-5xl mb-3 block">{round.emoji}</span>
                        <h3 className="text-xl font-black mb-1">{round.service}</h3>
                        <p className="text-sm text-white/60">{round.benefit}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 mb-6">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">In ruil voor:</p>
                        <div className="flex flex-wrap gap-2">
                            {round.dataAsked.map((d, i) => (
                                <span key={i} className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-white/80">📎 {d}</span>
                            ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${RISK_COLORS[round.privacyRisk]}`} />
                            <span className="text-xs text-white/50">{RISK_LABELS[round.privacyRisk]}</span>
                        </div>
                    </div>

                    {!hasChosen && (
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handleChoice('deal')} className="py-5 bg-emerald-500/20 hover:bg-emerald-500/30 border-2 border-emerald-500/40 rounded-2xl font-black text-lg transition-all active:scale-95 flex flex-col items-center gap-1">
                                <ThumbsUp size={28} className="text-emerald-400" />
                                <span className="text-emerald-400">DEAL!</span>
                            </button>
                            <button onClick={() => handleChoice('no-deal')} className="py-5 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/40 rounded-2xl font-black text-lg transition-all active:scale-95 flex flex-col items-center gap-1">
                                <ThumbsDown size={28} className="text-red-400" />
                                <span className="text-red-400">NO DEAL!</span>
                            </button>
                        </div>
                    )}

                    {showExplanation && (
                        <div className="mt-6 space-y-4">
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                                <div className="flex items-start gap-2"><Sparkles size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" /><p className="text-sm text-white/80">{round.explanation}</p></div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                                <span className="text-xs text-white/50">Anderen die DEAL kozen:</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${round.avgStat}%` }} /></div>
                                    <span className="text-xs font-black text-amber-400">{round.avgStat}%</span>
                                </div>
                            </div>
                            <button onClick={nextRound} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-colors">
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
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-amber-950 text-white p-4 pb-safe flex items-center justify-center">
            <div className="max-w-sm w-full text-center space-y-6">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl`}><span className="text-5xl">{badge.emoji}</span></div>
                <h1 className="text-2xl font-black">{badge.title}</h1>
                <p className="text-white/60 text-sm">{dealCount}x DEAL — {ROUNDS.length - dealCount}x NO DEAL</p>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{getScore()}/100</div>
                    <p className="text-white/50 text-xs mt-1">Privacy Score</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-left space-y-3 border border-white/10">
                    <p className="text-xs font-bold text-white/80">📊 Jouw keuzes vs. het gemiddelde:</p>
                    {ROUNDS.map((r, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-xs text-white/60">{r.emoji} {r.service.split(' ').slice(0, 2).join(' ')}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${choices[i] === 'deal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{choices[i] === 'deal' ? 'DEAL' : 'NO DEAL'}</span>
                                <span className="text-[10px] text-white/30">({r.avgStat}% deal)</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-left border border-white/10">
                    <p className="text-xs font-bold text-white/80 mb-2">💡 De les:</p>
                    <p className="text-xs text-white/60">"Gratis" bestaat niet op internet. Je betaalt altijd met je data. Hoe meer je deelt, hoe meer macht je weggeeft. Kies bewust!</p>
                </div>
                <button onClick={() => onComplete(true)} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2"><Trophy size={20} /> Missie Voltooid!</button>
            </div>
        </div>
    );
};
