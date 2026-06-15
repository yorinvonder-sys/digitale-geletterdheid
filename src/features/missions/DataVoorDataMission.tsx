import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, ThumbsUp, ThumbsDown, Sparkles, Pause } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import { MissionGoalBanner } from './templates/shared/MissionGoalBanner';
import {
    type DataVoorDataRoundStat,
    getDataVoorDataRoundStats,
    saveDataVoorDataAnswers,
} from '@/services/dataVoorDataService';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: any;
    vsoProfile?: any;
}

interface DataVoorDataState {
    phase: 'intro' | 'auction' | 'reflection' | 'results';
    currentRound: number;
    choices: ('deal' | 'no-deal')[];
}

interface AuctionRound {
    emoji: string;
    service: string;
    benefit: string;
    dataAsked: string[];
    privacyRisk: 'low' | 'medium' | 'high' | 'extreme';
    explanation: string;
}

const ROUNDS: AuctionRound[] = [
    {
        emoji: '🎵', service: 'Gratis muziek streamen', benefit: 'Onbeperkt muziek luisteren zonder reclame',
        dataAsked: ['Luistergeschiedenis', 'Leeftijd'],
        privacyRisk: 'low', explanation: 'Luistergeschiedenis delen is relatief onschuldig. Spotify & Apple Music doen dit al. Risico: je profiel wordt gebruikt voor gerichte reclame.',
    },
    {
        emoji: '🎮', service: 'Premium game account', benefit: 'Alle DLCs, skins en battle passes — gratis',
        dataAsked: ['Speeltijd per dag', 'Vriendenlijst', 'Chatberichten'],
        privacyRisk: 'medium', explanation: 'Chatberichten delen gaat ver! Je privégesprekken kunnen worden geanalyseerd. Speeltijd is minder gevoelig, maar kan gebruikt worden om "verslavingsprofielen" te maken.',
    },
    {
        emoji: '📱', service: 'Nieuwste iPhone gratis', benefit: 'Elk jaar het nieuwste model, helemaal gratis',
        dataAsked: ['Locatie 24/7', 'Alle foto\'s', 'Contactenlijst', 'Browsegeschiedenis'],
        privacyRisk: 'high', explanation: 'Dit is een ENORME hoeveelheid data. Je locatie 24/7 + foto\'s + contacten = je hele leven is zichtbaar. Bedrijven kunnen weten waar je bent, met wie, en wat je doet.',
    },
    {
        emoji: '💰', service: '€500 per maand', benefit: 'Elke maand €500 op je rekening — geen vragen',
        dataAsked: ['BSN-nummer', 'Medische gegevens', 'Bankgegevens', 'Biometrische data (vingerafdruk)'],
        privacyRisk: 'extreme', explanation: 'BSN + medische data + biometrisch = je complete identiteit. Dit kan leiden tot identiteitsfraude, verzekeringsdiscriminatie en onherstelbare schade. Biometrische data kun je NIET veranderen als het lekt!',
    },
    {
        emoji: '🏫', service: 'Altijd een 8+ op school', benefit: 'AI maakt je huiswerk en past je cijfers aan',
        dataAsked: ['Schoolresultaten', 'Leerlingdossier', 'Gedragsrapporten', 'Camera in klaslokaal'],
        privacyRisk: 'extreme', explanation: 'Afgezien van de ethische problemen (fraude!): een camera in het klaslokaal + je complete dossier = totale surveillance. En als dit lekt, is je schoolcarrière voorgoed beschadigd.',
    }
];

const RISK_COLORS = { low: 'bg-duck-ink', medium: 'bg-duck-coral', high: 'bg-lab-coral', extreme: 'bg-lab-coral' };
const RISK_LABELS = { low: 'Laag risico', medium: 'Gemiddeld risico', high: 'Hoog risico', extreme: 'Extreem risico' };
const SCOPE_LABELS = { class: 'jouw klas', school: 'jouw school' } as const;

export const DataVoorDataMission: React.FC<Props> = ({ onBack, onComplete }) => {
    const { state: saved, setState: setSaved, clearSave } = useMissionAutoSave<DataVoorDataState>(
        'data-voor-data',
        { phase: 'intro', currentRound: 0, choices: [] }
    );
    const phase = saved.phase;
    const currentRound = saved.currentRound;
    const choices = saved.choices;
    const setPhase = (p: DataVoorDataState['phase']) => setSaved(prev => ({ ...prev, phase: p }));
    const setCurrentRound = (updater: React.SetStateAction<number>) => setSaved(prev => ({
        ...prev,
        currentRound: typeof updater === 'function' ? updater(prev.currentRound) : updater,
    }));
    const setChoices = (updater: React.SetStateAction<('deal' | 'no-deal')[]>) => setSaved(prev => ({
        ...prev,
        choices: typeof updater === 'function' ? updater(prev.choices) : updater,
    }));

    // Transient UI state - niet opgeslagen
    const [showExplanation, setShowExplanation] = useState(false);
    const [hasChosen, setHasChosen] = useState(false);
    const [roundStats, setRoundStats] = useState<Record<number, DataVoorDataRoundStat>>({});
    const [hasLoadedStats, setHasLoadedStats] = useState(false);
    const [saveWarning, setSaveWarning] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadStats = async () => {
            const stats = await getDataVoorDataRoundStats();
            if (cancelled) return;
            setRoundStats(stats);
            setHasLoadedStats(true);
        };

        void loadStats();

        return () => {
            cancelled = true;
        };
    }, []);

    const refreshRoundStats = async () => {
        const stats = await getDataVoorDataRoundStats();
        setRoundStats(stats);
        setHasLoadedStats(true);
    };

    const persistAnswers = async (nextChoices: ('deal' | 'no-deal')[]) => {
        const savedSuccessfully = await saveDataVoorDataAnswers(nextChoices, nextChoices.length === ROUNDS.length);
        if (savedSuccessfully) {
            setSaveWarning(null);
            await refreshRoundStats();
        } else {
            setSaveWarning('Je keuze staat lokaal in deze missie, maar kon nog niet anoniem worden opgeslagen.');
        }
        return savedSuccessfully;
    };

    const renderBackButton = (containerClassName = 'max-w-lg mx-auto mb-6') => (
        <div className={containerClassName}>
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-duck-muted hover:text-duck-ink transition-all duration-300"
                aria-label="Terug naar dashboard"
            >
                <ArrowLeft size={18} />
                <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Terug naar dashboard
                </span>
            </button>
        </div>
    );

    const handleChoice = (choice: 'deal' | 'no-deal') => {
        if (hasChosen) return;
        const nextChoices = [...choices, choice];
        setHasChosen(true);
        setChoices(nextChoices);
        setShowExplanation(true);
        void persistAnswers(nextChoices);
    };

    const nextRound = () => {
        setHasChosen(false);
        setShowExplanation(false);
        // Na ronde 3 (index 2): toon reflectie
        if (currentRound === 2) {
            setPhase('reflection');
            return;
        }
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
        if (s >= 80) return { emoji: '🛡️', title: 'Privacy Kampioen', color: 'from-duck-ink to-duck-ink' };
        if (s >= 50) return { emoji: '⚖️', title: 'Data Diplomaat', color: 'from-duck-ink to-duck-ink' };
        return { emoji: '💸', title: 'Data Verkoper', color: 'from-duck-coral to-duck-coral' };
    };

    const getRoundStatText = (roundIndex: number) => {
        const stat = roundStats[roundIndex];
        if (!hasLoadedStats) return 'Anonieme statistieken laden...';
        if (!stat) return 'Nog niet genoeg anonieme antwoorden';
        return `${stat.dealPercentage}% DEAL (${SCOPE_LABELS[stat.scope]})`;
    };

    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-duck-bg text-duck-ink overflow-y-auto p-4 pb-safe">
                {renderBackButton()}
                <div className="max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-duck-coral/10 rounded-3xl flex items-center justify-center mx-auto border border-duck-coral/20 animate-bounce"><span className="text-4xl">💰</span></div>
                    <h1 className="text-3xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Data voor Data</h1>
                    <p className="text-duck-muted text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Hoeveel van je persoonlijke data zou jij inruilen voor gratis diensten? In deze veiling bepaal jij je prijs — maar elke <span className="text-duck-coral font-bold">deal heeft een keerzijde</span>.
                    </p>
                    <MissionGoalBanner goal={getMissionGoal('data-voor-data')!} compact />
                    <div className="bg-white border border-duck-line rounded-2xl p-4 max-w-sm mx-auto">
                        <p className="text-xs text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Je vergelijkt je keuzes met <span className="font-bold text-duck-ink">echte, anonieme leerlingantwoorden</span>.
                            We tonen alleen percentages als er genoeg antwoorden zijn om iedereen anoniem te houden.
                        </p>
                    </div>
                    <div className="bg-white border border-duck-line rounded-2xl p-4 max-w-xs mx-auto">
                        <div className="flex items-center justify-around">
                            <div className="text-center">
                                <ThumbsUp size={24} className="text-duck-ink mx-auto" />
                                <p className="text-[10px] text-duck-muted mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>DEAL!</p>
                            </div>
                            <div className="text-2xl text-duck-line">of</div>
                            <div className="text-center">
                                <ThumbsDown size={24} className="text-duck-coral mx-auto" />
                                <p className="text-[10px] text-duck-muted mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>NO DEAL!</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-duck-muted text-xs" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>5 rondes - vergelijk je keuzes met anonieme leerlingdata</p>
                    <button onClick={() => setPhase('auction')} className="px-8 py-4 bg-duck-coral hover:bg-duck-coral text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl shadow-duck-coral/30 focus-visible:ring-2 focus-visible:ring-duck-coral">Start de veiling →</button>
                </div>
            </div>
        );
    }

    if (phase === 'reflection') {
        const dealCount = choices.filter(c => c === 'deal').length;
        return (
            <div className="min-h-screen bg-duck-bg text-duck-ink overflow-y-auto p-4 pb-safe">
                {renderBackButton()}
                <div className="max-w-lg mx-auto space-y-6">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-duck-ink/10 rounded-2xl flex items-center justify-center mx-auto border border-duck-ink/20">
                            <Pause size={32} className="text-duck-ink" />
                        </div>
                        <h2 className="text-2xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Even pauzeren...</h2>
                        <p className="text-sm text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Je hebt tot nu toe <span className="font-black text-duck-coral">{dealCount}x</span> je data gedeeld.
                            Kijk terug: zou je een eerdere ronde nu anders beantwoorden?
                        </p>
                    </div>

                    <div className="space-y-3">
                        {ROUNDS.slice(0, 3).map((round, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-duck-line p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{round.emoji}</span>
                                        <span className="text-sm font-black text-duck-ink" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{round.service}</span>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-flex border ${choices[i] === 'deal' ? 'bg-duck-ink/10 text-duck-ink border-duck-ink/20' : 'bg-duck-coral/10 text-duck-coral border-duck-coral/20'}`}>
                                        {choices[i] === 'deal' ? 'DEAL' : 'NO DEAL'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {round.dataAsked.map((d, j) => (
                                        <span key={j} className="text-[10px] bg-duck-bg border border-duck-line px-2 py-0.5 rounded-full text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{d}</span>
                                    ))}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${RISK_COLORS[round.privacyRisk]}`} />
                                    <span className="text-[10px] text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{RISK_LABELS[round.privacyRisk]}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-duck-ink/5 border border-duck-ink/20 rounded-2xl p-4">
                        <p className="text-xs text-duck-muted text-center" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            De volgende 2 rondes worden zwaarder. Denk goed na over wat je data waard is!
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setCurrentRound(c => c + 1);
                            setPhase('auction');
                        }}
                        className="w-full py-4 bg-duck-coral hover:bg-duck-coral text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl shadow-duck-coral/30 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-duck-coral"
                    >
                        Verder met de veiling <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    if (phase === 'auction') {
        const round = ROUNDS[currentRound];
        const currentStat = roundStats[currentRound];
        return (
            <div className="min-h-screen bg-duck-bg text-duck-ink overflow-y-auto p-4 pb-safe">
                <div className="max-w-lg mx-auto">
                    {renderBackButton('mb-4')}
                    {saveWarning && (
                        <div className="bg-duck-coral/10 border border-duck-coral/30 text-duck-ink rounded-2xl p-3 text-xs font-bold mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {saveWarning}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black text-duck-muted uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Ronde {currentRound + 1}/{ROUNDS.length}</span>
                        <div className="flex gap-1.5">{ROUNDS.map((_, i) => (<div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-300 ${i < currentRound ? (choices[i] === 'deal' ? 'bg-duck-ink' : 'bg-duck-coral') : i === currentRound ? 'bg-gradient-to-r from-duck-coral to-duck-coral' : 'bg-duck-line'}`} />))}</div>
                    </div>

                    <div className="bg-white rounded-2xl border border-duck-line p-6 mb-6 text-center">
                        <span className="text-5xl mb-3 block">{round.emoji}</span>
                        <h3 className="text-xl font-black mb-1 text-duck-ink" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{round.service}</h3>
                        <p className="text-sm text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{round.benefit}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-duck-line p-4 mb-6">
                        <p className="text-[10px] font-black text-duck-muted uppercase tracking-widest mb-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>In ruil voor:</p>
                        <div className="flex flex-wrap gap-2">
                            {round.dataAsked.map((d, i) => (
                                <span key={i} className="inline-flex bg-duck-bg border border-duck-line px-3 py-1.5 rounded-full text-xs font-bold text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{d}</span>
                            ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${RISK_COLORS[round.privacyRisk]}`} />
                            <span className="text-xs text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{RISK_LABELS[round.privacyRisk]}</span>
                        </div>
                    </div>

                    {!hasChosen && (
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handleChoice('deal')} className="py-5 bg-duck-ink/10 hover:bg-duck-ink/20 border-2 border-duck-ink/30 rounded-2xl font-black text-lg transition-all duration-300 active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#5F947D]">
                                <ThumbsUp size={28} className="text-duck-ink" />
                                <span className="text-duck-ink">DEAL!</span>
                            </button>
                            <button onClick={() => handleChoice('no-deal')} className="py-5 bg-duck-coral/10 hover:bg-duck-coral/20 border-2 border-duck-coral/30 rounded-2xl font-black text-lg transition-all duration-300 active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-duck-coral">
                                <ThumbsDown size={28} className="text-duck-coral" />
                                <span className="text-duck-coral">NO DEAL!</span>
                            </button>
                        </div>
                    )}

                    {showExplanation && (
                        <div className="mt-6 space-y-4">
                            <div className="bg-duck-coral/5 border border-duck-coral/20 rounded-2xl p-4">
                                <div className="flex items-start gap-2"><Sparkles size={16} className="text-duck-coral mt-0.5 flex-shrink-0" /><p className="text-sm text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{round.explanation}</p></div>
                            </div>
                            {currentStat ? (
                                <div className="bg-white rounded-2xl border border-duck-line p-3 flex items-center justify-between gap-3">
                                    <div>
                                        <span className="text-xs text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Anonieme antwoorden uit {SCOPE_LABELS[currentStat.scope]}:</span>
                                        <p className="text-[10px] text-duck-muted mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Gebaseerd op echte leerlingkeuzes</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-duck-line rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-duck-coral to-duck-coral rounded-full" style={{ width: `${currentStat.dealPercentage}%` }} /></div>
                                        <span className="text-xs font-black text-duck-coral">{currentStat.dealPercentage}%</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-duck-line p-4">
                                    <p className="text-xs text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {hasLoadedStats
                                            ? 'Nog te weinig anonieme antwoorden van leerlingen om dit percentage veilig te tonen.'
                                            : 'Anonieme leerlingstatistieken worden geladen...'}
                                    </p>
                                </div>
                            )}
                            <button onClick={nextRound} className="w-full py-3 bg-duck-coral hover:bg-duck-coral text-white rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-duck-coral">
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
        <div className="min-h-screen bg-duck-bg text-duck-ink overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 pb-safe">
            <div className="max-w-sm w-full text-center space-y-6">
                {renderBackButton('max-w-sm w-full mb-0')}
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl`}><span className="text-5xl">{badge.emoji}</span></div>
                <h1 className="text-2xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{badge.title}</h1>
                <p className="text-duck-muted text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{dealCount}x DEAL — {ROUNDS.length - dealCount}x NO DEAL</p>
                <div className="bg-white rounded-2xl p-4 border border-duck-line">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-duck-coral to-duck-coral">{getScore()}/100</div>
                    <p className="text-duck-muted text-xs mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Privacy Score</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-left space-y-3 border border-duck-line">
                    <p className="text-xs font-bold text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Jouw keuzes vs. anonieme leerlingantwoorden:</p>
                    {ROUNDS.map((r, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-xs text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{r.emoji} {r.service.split(' ').slice(0, 2).join(' ')}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-flex border ${choices[i] === 'deal' ? 'bg-duck-ink/10 text-duck-ink border-duck-ink/20' : 'bg-duck-coral/10 text-duck-coral border-duck-coral/20'}`}>{choices[i] === 'deal' ? 'DEAL' : 'NO DEAL'}</span>
                                <span className="text-[10px] text-duck-muted">{getRoundStatText(i)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl p-4 text-left border border-duck-line">
                    <p className="text-xs font-bold text-duck-muted mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>De les:</p>
                    <p className="text-xs text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>"Gratis" bestaat niet op internet. Je betaalt altijd met je data. Hoe meer je deelt, hoe meer macht je weggeeft. Kies bewust!</p>
                </div>
                <button onClick={() => { clearSave(); onComplete(true); }} className="w-full py-4 bg-duck-ink hover:bg-duck-ink text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#5F947D]"><Trophy size={20} /> Missie Voltooid!</button>
            </div>
            </div>
        </div>
    );
};
