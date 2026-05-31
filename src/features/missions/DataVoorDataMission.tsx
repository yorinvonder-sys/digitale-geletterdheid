import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, ThumbsUp, ThumbsDown, Sparkles, Pause, Search, Scale, Users } from 'lucide-react';
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
    revealedRounds?: number[];
    introChoice?: 'inspect-offer' | 'check-data-price' | 'compare-class';
    evidencePins?: Record<number, string>;
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

const RISK_COLORS = { low: 'bg-[#5F947D]', medium: 'bg-[#D97848]', high: 'bg-lab-coral', extreme: 'bg-lab-coral' };
const RISK_LABELS = { low: 'Laag risico', medium: 'Gemiddeld risico', high: 'Hoog risico', extreme: 'Extreem risico' };
const SCOPE_LABELS = { class: 'jouw klas', school: 'jouw school' } as const;

const INTRO_ACTIONS = [
    {
        id: 'inspect-offer',
        icon: Search,
        title: 'Onderzoek het aanbod',
        prompt: 'Wat krijg je precies?',
        feedback: 'Goede start: eerst check je of de belofte concreet genoeg is voordat je iets weggeeft.',
    },
    {
        id: 'check-data-price',
        icon: Scale,
        title: 'Check de data-prijs',
        prompt: 'Welke data vragen ze?',
        feedback: 'Slim: in deze missie zit de echte prijs vaak verstopt in de data die gevraagd wordt.',
    },
    {
        id: 'compare-class',
        icon: Users,
        title: 'Vergelijk met de klas',
        prompt: 'Wat vinden anderen?',
        feedback: 'Sterk: je vergelijkt jouw keuze straks met anonieme klasdata zonder privacy te lekken.',
    },
] as const;

export const DataVoorDataMission: React.FC<Props> = ({ onBack, onComplete }) => {
    const { state: saved, setState: setSaved, clearSave } = useMissionAutoSave<DataVoorDataState>(
        'data-voor-data',
        { phase: 'intro', currentRound: 0, choices: [] }
    );
    const phase = saved.phase;
    const currentRound = saved.currentRound;
    const choices = saved.choices;
    const revealedRounds = saved.revealedRounds ?? [];
    const introChoice = saved.introChoice;
    const evidencePins = saved.evidencePins ?? {};
    const setPhase = (p: DataVoorDataState['phase']) => setSaved(prev => ({ ...prev, phase: p }));
    const setCurrentRound = (updater: React.SetStateAction<number>) => setSaved(prev => ({
        ...prev,
        currentRound: typeof updater === 'function' ? updater(prev.currentRound) : updater,
    }));
    const setChoices = (updater: React.SetStateAction<('deal' | 'no-deal')[]>) => setSaved(prev => ({
        ...prev,
        choices: typeof updater === 'function' ? updater(prev.choices) : updater,
    }));
    const revealCurrentRound = () => setSaved(prev => ({
        ...prev,
        revealedRounds: [...new Set([...(prev.revealedRounds ?? []), currentRound])],
    }));
    const selectIntroChoice = (choice: DataVoorDataState['introChoice']) => setSaved(prev => ({
        ...prev,
        introChoice: choice,
    }));
    const pinEvidence = (value: string) => setSaved(prev => ({
        ...prev,
        evidencePins: {
            ...(prev.evidencePins ?? {}),
            [currentRound]: value,
        },
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
                className="flex items-center gap-2 text-[#445865] hover:text-[#08283B] transition-all duration-300"
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
        if (hasChosen || !evidencePins[currentRound]) return;
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
        if (s >= 80) return { emoji: '🛡️', title: 'Privacy Kampioen', color: 'from-[#5F947D] to-[#5F947D]' };
        if (s >= 50) return { emoji: '⚖️', title: 'Data Diplomaat', color: 'from-[#5F947D] to-[#0B453F]' };
        return { emoji: '💸', title: 'Data Verkoper', color: 'from-[#D97848] to-[#D97848]' };
    };

    const getRoundStatText = (roundIndex: number) => {
        const stat = roundStats[roundIndex];
        if (!hasLoadedStats) return 'Anonieme statistieken laden...';
        if (!stat) return 'Nog niet genoeg anonieme antwoorden';
        return `${stat.dealPercentage}% DEAL (${SCOPE_LABELS[stat.scope]})`;
    };

    if (phase === 'intro') {
        const selectedIntroAction = INTRO_ACTIONS.find(action => action.id === introChoice);
        return (
            <div className="min-h-screen bg-[#FCF6EA] text-[#08283B] overflow-y-auto p-4 pb-safe">
                {renderBackButton()}
                <div className="max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-[#D97848]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#D97848]/20 animate-bounce"><span className="text-4xl">💰</span></div>
                    <h1 className="text-3xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Data voor Data</h1>
                    <p className="text-[#445865] text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Hoeveel van je persoonlijke data zou jij inruilen voor gratis diensten? In deze veiling bepaal jij je prijs — maar elke <span className="text-[#D97848] font-bold">deal heeft een keerzijde</span>.
                    </p>
                    <MissionGoalBanner goal={getMissionGoal('data-voor-data')!} compact />
                    <div className="bg-white border border-[#E7D8BD] rounded-2xl p-4 max-w-sm mx-auto">
                        <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Je vergelijkt je keuzes met <span className="font-bold text-[#08283B]">echte, anonieme leerlingantwoorden</span>.
                            We tonen alleen percentages als er genoeg antwoorden zijn om iedereen anoniem te houden.
                        </p>
                    </div>
                    <div className="bg-white border border-[#E7D8BD] rounded-2xl p-4 text-left shadow-sm" data-qa="data-barter-triage">
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#D97848]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    Eerste actie
                                </p>
                                <h2 className="mt-1 text-lg font-black text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                    Je krijgt een gratis aanbod. Wat doe je als eerste?
                                </h2>
                            </div>
                            <span className="shrink-0 rounded-full border border-[#E7D8BD] bg-[#FCF6EA] px-3 py-1 text-xs font-black text-[#445865]">
                                1/5
                            </span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {INTRO_ACTIONS.map((action) => {
                                const Icon = action.icon;
                                const isSelected = introChoice === action.id;
                                return (
                                    <button
                                        key={action.id}
                                        type="button"
                                        onClick={() => selectIntroChoice(action.id)}
                                        data-qa="data-barter-triage-action"
                                        aria-pressed={isSelected}
                                        className={`rounded-2xl border p-3 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#D97848] active:scale-[0.98] ${
                                            isSelected
                                                ? 'border-[#D97848] bg-[#D97848]/10 shadow-sm'
                                                : 'border-[#E7D8BD] bg-[#FFFDF7] hover:border-[#D97848]/50'
                                        }`}
                                    >
                                        <Icon size={22} className={isSelected ? 'text-[#D97848]' : 'text-[#5F947D]'} />
                                        <p className="mt-2 text-sm font-black text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            {action.title}
                                        </p>
                                        <p className="mt-1 text-xs leading-snug text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            {action.prompt}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-4 rounded-xl border border-[#5F947D]/20 bg-[#5F947D]/10 p-3" data-qa="data-barter-triage-feedback">
                            <p className="text-xs font-bold leading-relaxed text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {selectedIntroAction?.feedback ?? 'Kies eerst je aanpak. Goede privacykeuzes beginnen met een scherpe vraag.'}
                            </p>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-[#5F947D]/25 bg-[#5F947D]/10 p-3 text-center">
                                <ThumbsUp size={22} className="text-[#5F947D] mx-auto" />
                                <p className="text-[10px] text-[#445865] mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>DEAL</p>
                            </div>
                            <div className="rounded-2xl border border-[#D97848]/25 bg-[#D97848]/10 p-3 text-center">
                                <ThumbsDown size={22} className="text-[#D97848] mx-auto" />
                                <p className="text-[10px] text-[#445865] mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>NO DEAL</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-[#445865] text-xs" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>5 rondes - vergelijk je keuzes met anonieme leerlingdata</p>
                    <button
                        onClick={() => setPhase('auction')}
                        disabled={!introChoice}
                        data-qa="data-barter-start"
                        className="px-8 py-4 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97848]/30 focus-visible:ring-2 focus-visible:ring-[#D97848] disabled:cursor-not-allowed disabled:bg-[#E7D8BD] disabled:text-[#445865] disabled:shadow-none"
                    >
                        Start de veiling →
                    </button>
                </div>
            </div>
        );
    }

    if (phase === 'reflection') {
        const dealCount = choices.filter(c => c === 'deal').length;
        return (
            <div className="min-h-screen bg-[#FCF6EA] text-[#08283B] overflow-y-auto p-4 pb-safe">
                {renderBackButton()}
                <div className="max-w-lg mx-auto space-y-6">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-[#0B453F]/10 rounded-2xl flex items-center justify-center mx-auto border border-[#0B453F]/20">
                            <Pause size={32} className="text-[#0B453F]" />
                        </div>
                        <h2 className="text-2xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Even pauzeren...</h2>
                        <p className="text-sm text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Je hebt tot nu toe <span className="font-black text-[#D97848]">{dealCount}x</span> je data gedeeld.
                            Kijk terug: zou je een eerdere ronde nu anders beantwoorden?
                        </p>
                    </div>

                    <div className="space-y-3">
                        {ROUNDS.slice(0, 3).map((round, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-[#E7D8BD] p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{round.emoji}</span>
                                        <span className="text-sm font-black text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{round.service}</span>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-flex border ${choices[i] === 'deal' ? 'bg-[#5F947D]/10 text-[#5F947D] border-[#5F947D]/20' : 'bg-[#D97848]/10 text-[#D97848] border-[#D97848]/20'}`}>
                                        {choices[i] === 'deal' ? 'DEAL' : 'NO DEAL'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {round.dataAsked.map((d, j) => (
                                        <span key={j} className={`text-[10px] border px-2 py-0.5 rounded-full font-bold ${evidencePins[i] === d ? 'bg-[#D97848]/10 border-[#D97848]/30 text-[#D97848]' : 'bg-[#FCF6EA] border-[#E7D8BD] text-[#445865]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{d}</span>
                                    ))}
                                </div>
                                <p className="mt-2 text-[10px] font-bold text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    Bewijs gepind: <span className="text-[#08283B]">{evidencePins[i] ?? 'nog geen bewijs'}</span>
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${RISK_COLORS[round.privacyRisk]}`} />
                                    <span className="text-[10px] text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{RISK_LABELS[round.privacyRisk]}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#0B453F]/5 border border-[#0B453F]/20 rounded-2xl p-4">
                        <p className="text-xs text-[#445865] text-center" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            De volgende 2 rondes worden zwaarder. Denk goed na over wat je data waard is!
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setCurrentRound(c => c + 1);
                            setPhase('auction');
                        }}
                        className="w-full py-4 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97848]/30 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97848]"
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
        const roundChoice = choices[currentRound];
        const priceRevealed = revealedRounds.includes(currentRound) || Boolean(roundChoice);
        const selectedEvidence = evidencePins[currentRound];
        const canChooseRound = priceRevealed && Boolean(selectedEvidence);
        return (
            <div className="min-h-screen bg-[#FCF6EA] text-[#08283B] overflow-y-auto p-4 pb-safe">
                <div className="max-w-lg mx-auto">
                    {renderBackButton('mb-4')}
                    {saveWarning && (
                        <div className="bg-[#D97848]/10 border border-[#D97848]/30 text-[#08283B] rounded-2xl p-3 text-xs font-bold mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {saveWarning}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black text-[#445865] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Ronde {currentRound + 1}/{ROUNDS.length}</span>
                        <div className="flex gap-1.5">{ROUNDS.map((_, i) => (<div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-300 ${i < currentRound ? (choices[i] === 'deal' ? 'bg-[#5F947D]' : 'bg-[#D97848]') : i === currentRound ? 'bg-gradient-to-r from-[#D97848] to-[#D97848]' : 'bg-[#E7D8BD]'}`} />))}</div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E7D8BD] p-6 mb-6 text-center">
                        <span className="text-5xl mb-3 block">{round.emoji}</span>
                        <h3 className="text-xl font-black mb-1 text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{round.service}</h3>
                        <p className="text-sm text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{round.benefit}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-6" data-qa="data-price-reveal-card">
                        <p className="text-[10px] font-black text-[#445865] uppercase tracking-widest mb-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Verborgen datakosten
                        </p>
                        {!priceRevealed ? (
                            <div className="space-y-3">
                                <div className="rounded-xl border border-[#E7D8BD] bg-[#FCF6EA] p-3 text-left">
                                    <p className="text-sm font-black text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        De deal klinkt gratis. De prijs staat nog in de kleine lettertjes.
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Open de datakosten voordat je beslist. Daarna kies je pas DEAL of NO DEAL.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={revealCurrentRound}
                                    data-qa="data-price-reveal-button"
                                    className="w-full rounded-xl bg-[#08283B] px-4 py-3 text-sm font-black text-white transition-all duration-200 hover:bg-[#0B453F] focus-visible:ring-2 focus-visible:ring-[#D97848] active:scale-[0.98]"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Toon de echte prijs
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-wrap gap-2">
                                    {round.dataAsked.map((d, i) => (
                                        <span key={i} className="inline-flex bg-[#FCF6EA] border border-[#E7D8BD] px-3 py-1.5 rounded-full text-xs font-bold text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{d}</span>
                                    ))}
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${RISK_COLORS[round.privacyRisk]}`} />
                                    <span className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{RISK_LABELS[round.privacyRisk]}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {priceRevealed && (
                        <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-6" data-qa="data-risk-evidence-panel">
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Bewijs pinnen
                                    </p>
                                    <h4 className="mt-1 text-base font-black text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                        Welke datavraag bepaalt je keuze?
                                    </h4>
                                </div>
                                <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black ${selectedEvidence ? 'bg-[#5F947D]/10 text-[#5F947D]' : 'bg-[#D97848]/10 text-[#D97848]'}`}>
                                    {selectedEvidence ? 'Bewijs klaar' : 'Nog kiezen'}
                                </span>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {round.dataAsked.map((dataPoint) => {
                                    const selected = selectedEvidence === dataPoint;
                                    return (
                                        <button
                                            key={dataPoint}
                                            type="button"
                                            onClick={() => pinEvidence(dataPoint)}
                                            disabled={Boolean(roundChoice)}
                                            aria-pressed={selected}
                                            data-qa="data-risk-evidence-token"
                                            className={`min-h-[58px] rounded-xl border px-3 py-2 text-left text-xs font-black transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#D97848] active:scale-[0.98] disabled:cursor-default ${
                                                selected
                                                    ? 'border-[#D97848] bg-[#D97848]/10 text-[#08283B] shadow-sm'
                                                    : 'border-[#E7D8BD] bg-[#FFFDF7] text-[#445865] hover:border-[#D97848]/40'
                                            }`}
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {dataPoint}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-3 rounded-xl border border-[#5F947D]/20 bg-[#5F947D]/10 p-3" data-qa="data-risk-evidence-feedback">
                                <p className="text-xs font-bold leading-relaxed text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {selectedEvidence
                                        ? `Je bewijs is ${selectedEvidence}. Kies nu of de beloning deze datakost waard is.`
                                        : 'Pin eerst het belangrijkste risico. Daarna maak je pas je deal-keuze.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {!hasChosen && !roundChoice && priceRevealed && (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleChoice('deal')}
                                disabled={!canChooseRound}
                                className="py-5 bg-[#5F947D]/10 hover:bg-[#5F947D]/20 border-2 border-[#5F947D]/30 rounded-2xl font-black text-lg transition-all duration-300 active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#5F947D] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ThumbsUp size={28} className="text-[#5F947D]" />
                                <span className="text-[#5F947D]">DEAL!</span>
                            </button>
                            <button
                                onClick={() => handleChoice('no-deal')}
                                disabled={!canChooseRound}
                                className="py-5 bg-[#D97848]/10 hover:bg-[#D97848]/20 border-2 border-[#D97848]/30 rounded-2xl font-black text-lg transition-all duration-300 active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#D97848] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ThumbsDown size={28} className="text-[#D97848]" />
                                <span className="text-[#D97848]">NO DEAL!</span>
                            </button>
                        </div>
                    )}

                    {roundChoice && !showExplanation && (
                        <div className="rounded-2xl border border-[#5F947D]/25 bg-[#5F947D]/10 p-4" data-qa="data-price-resume-card">
                            <p className="text-sm font-black text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                Je had deze ronde al gekozen: {roundChoice === 'deal' ? 'DEAL' : 'NO DEAL'}.
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                De verborgen prijs is zichtbaar gebleven. Ga verder naar de volgende ronde.
                            </p>
                            <button onClick={nextRound} className="mt-3 w-full rounded-full bg-[#D97848] py-3 text-sm font-black text-white transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]">
                                Volgende ronde <ChevronRight size={16} className="inline" />
                            </button>
                        </div>
                    )}

                    {!priceRevealed && (
                        <div className="rounded-2xl border border-[#E7D8BD] bg-[#FFFDF7] p-4 text-center">
                            <p className="text-xs font-bold text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                Nog geen keuze: eerst de verborgen datakosten openen.
                            </p>
                        </div>
                    )}

                    {showExplanation && (
                        <div className="mt-6 space-y-4">
                            <div className="bg-[#D97848]/5 border border-[#D97848]/20 rounded-2xl p-4">
                                <div className="flex items-start gap-2"><Sparkles size={16} className="text-[#D97848] mt-0.5 flex-shrink-0" /><p className="text-sm text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{round.explanation}</p></div>
                                <p className="mt-3 text-xs font-black text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    Jouw bewijs: <span className="text-[#D97848]">{selectedEvidence}</span>
                                </p>
                            </div>
                            {currentStat ? (
                                <div className="bg-white rounded-2xl border border-[#E7D8BD] p-3 flex items-center justify-between gap-3">
                                    <div>
                                        <span className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Anonieme antwoorden uit {SCOPE_LABELS[currentStat.scope]}:</span>
                                        <p className="text-[10px] text-[#445865] mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Gebaseerd op echte leerlingkeuzes</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-[#E7D8BD] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#D97848] to-[#D97848] rounded-full" style={{ width: `${currentStat.dealPercentage}%` }} /></div>
                                        <span className="text-xs font-black text-[#D97848]">{currentStat.dealPercentage}%</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4">
                                    <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {hasLoadedStats
                                            ? 'Nog te weinig anonieme antwoorden van leerlingen om dit percentage veilig te tonen.'
                                            : 'Anonieme leerlingstatistieken worden geladen...'}
                                    </p>
                                </div>
                            )}
                            <button onClick={nextRound} className="w-full py-3 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]">
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
        <div className="min-h-screen bg-[#FCF6EA] text-[#08283B] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 pb-safe">
            <div className="max-w-sm w-full text-center space-y-6">
                {renderBackButton('max-w-sm w-full mb-0')}
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl`}><span className="text-5xl">{badge.emoji}</span></div>
                <h1 className="text-2xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{badge.title}</h1>
                <p className="text-[#445865] text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{dealCount}x DEAL — {ROUNDS.length - dealCount}x NO DEAL</p>
                <div className="bg-white rounded-2xl p-4 border border-[#E7D8BD]">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D97848] to-[#D97848]">{getScore()}/100</div>
                    <p className="text-[#445865] text-xs mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Privacy Score</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-left space-y-3 border border-[#E7D8BD]">
                    <p className="text-xs font-bold text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Jouw keuzes vs. anonieme leerlingantwoorden:</p>
                    {ROUNDS.map((r, i) => (
                        <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
                            <div className="min-w-0">
                                <span className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{r.emoji} {r.service.split(' ').slice(0, 2).join(' ')}</span>
                                <p className="truncate text-[10px] font-bold text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Bewijs: {evidencePins[i] ?? 'niet gepind'}</p>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-flex border ${choices[i] === 'deal' ? 'bg-[#5F947D]/10 text-[#5F947D] border-[#5F947D]/20' : 'bg-[#D97848]/10 text-[#D97848] border-[#D97848]/20'}`}>{choices[i] === 'deal' ? 'DEAL' : 'NO DEAL'}</span>
                                <span className="text-[10px] text-[#445865]">{getRoundStatText(i)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl p-4 text-left border border-[#E7D8BD]">
                    <p className="text-xs font-bold text-[#445865] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>De les:</p>
                    <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>"Gratis" bestaat niet op internet. Je betaalt altijd met je data. Hoe meer je deelt, hoe meer macht je weggeeft. Kies bewust!</p>
                </div>
                <button onClick={() => { clearSave(); onComplete(true); }} className="w-full py-4 bg-[#5F947D] hover:bg-[#5F947D] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#5F947D]"><Trophy size={20} /> Missie Voltooid!</button>
            </div>
            </div>
        </div>
    );
};
