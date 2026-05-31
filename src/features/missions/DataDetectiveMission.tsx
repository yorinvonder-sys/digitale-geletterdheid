/**
 * DataDetectiveMission.tsx
 *
 * Leerlingen analyseren datasets en ontdekken verborgen patronen.
 * Ze leren kritisch nadenken over data, conclusies trekken, en misleidende grafieken herkennen.
 *
 * SLO-doelen: Informatievaardigheden, kritisch denken, data-analyse
 */

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Check, BarChart3, TrendingUp, AlertTriangle, Lightbulb, Target, Sparkles, Brain, Eye, FileSearch } from 'lucide-react';
import { UserStats, VsoProfile } from '@/types';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { MissionGoalBanner } from './templates/shared/MissionGoalBanner';
import type { MissionGoal } from './templates/shared/types';

interface DataDetectiveState {
    currentLevel: 'beginner' | 'gevorderd' | 'expert';
    currentChallengeIndex: number;
    score: number;
    correctAnswers: number;
    showIntro: boolean;
    showLevelComplete: boolean;
    showMissionComplete: boolean;
    conclusionLog: {
        challengeId: string;
        title: string;
        evidenceLabel: string;
        evidenceValue: number;
        conclusion: string;
    }[];
}

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: UserStats;
    vsoProfile?: VsoProfile;
}

const MISSION_GOAL: MissionGoal = {
    primaryGoal: 'Onderzoek hoe apps data gebruiken en kies bewust welke data je wel of niet deelt.',
    criteria: {
        type: 'component-complete',
        min: 3,
        description: 'Alle drie Data Detective levels zijn voltooid.',
    },
    evidence: 'Gepinde datapuntbewijzen, conclusiekaarten en een afrondende beoordeling.',
};

// Types
interface DataChallenge {
    id: string;
    level: 'beginner' | 'gevorderd' | 'expert';
    title: string;
    scenario: string;
    dataType: 'bar' | 'line' | 'pie' | 'table';
    data: {
        labels: string[];
        values: number[];
        colors?: string[];
        tableHeaders?: {
            label: string;
            value: string;
        };
    };
    conclusionPrompt: string;
    modelConclusion: string;
    feedback: string;
    insight: string; // What students should learn
    isMisleading?: boolean; // For "spot the misleading graph" challenges
    misleadingReason?: string;
}

// Challenge data
const CHALLENGES: DataChallenge[] = [
    // BEGINNER - Begrijpen welke data bedrijven verzamelen
    {
        id: 'b1',
        level: 'beginner',
        title: '📱 App Data-Tracker',
        scenario: 'Een video-app laat zien welke soorten data zij verzamelt om de app "persoonlijker" te maken.',
        dataType: 'bar',
        data: {
            labels: ['Kijkgedrag', 'Zoekopdrachten', 'Locatie', 'Contacten', 'Microfoon'],
            values: [92, 81, 57, 21, 13],
            colors: ['#5F947D', '#D97848', '#0B453F', '#D7C95F', '#D97848']
        },
        conclusionPrompt: 'Schrijf je detectiveconclusie: welke databron stuurt deze app vooral, en wat betekent dat voor jou?',
        modelConclusion: 'De app verzamelt vooral kijkgedrag en zoekopdrachten om aanbevelingen te sturen.',
        feedback: 'Kijkgedrag en zoekopdrachten zijn veruit het grootst. Locatie, contacten en microfoon zijn lager, maar blijven privacygevoelig.',
        insight: 'Bedrijven bouwen vooral profielen op basis van je dagelijkse gedrag. Dat kan handig zijn, maar vraagt ook om bewuste keuzes.'
    },
    {
        id: 'b2',
        level: 'beginner',
        title: '🎯 Personalisatie Trend',
        scenario: 'Een webshop test gepersonaliseerde aanbevelingen gedurende een week.',
        dataType: 'line',
        data: {
            labels: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'],
            values: [2, 3, 4, 5, 6, 8, 9],
            colors: ['#D7C95F']
        },
        conclusionPrompt: 'Maak een kans-risico kaart: wat wordt beter door personalisatie, en wat kan smaller worden?',
        modelConclusion: 'Kans: sneller relevante producten vinden. Risico: je ziet minder alternatieven.',
        feedback: 'De trend laat meer gepersonaliseerde aanbevelingen zien. Dat kan gemak geven, maar ook je keuzes sturen.',
        insight: 'Data kan je ervaring verbeteren, maar ook sturen wat je wel en niet te zien krijgt.'
    },

    // GEVORDERD - Risico en ethiek bij bedrijfsgebruik
    {
        id: 'g1',
        level: 'gevorderd',
        title: '🏢 Waar gaat de data heen?',
        scenario: 'Een bedrijf geeft aan waar gebruikersdata voor wordt ingezet.',
        dataType: 'pie',
        data: {
            labels: ['Productverbetering', 'Fraudedetectie', 'Advertenties', 'Verkoop aan partners'],
            values: [38, 24, 26, 12],
            colors: ['#5F947D', '#D97848', '#D7C95F', '#D97848']
        },
        conclusionPrompt: 'Markeer de risicoroute: welke bestemming van data verdient de meeste controle, en waarom?',
        modelConclusion: 'Verkoop aan partners vraagt de meeste controle, want data verlaat dan het oorspronkelijke platform.',
        feedback: 'Fraudedetectie en productverbetering kunnen nuttig zijn. Delen of verkopen aan partners vergroot het privacyrisico.',
        insight: 'Niet elk datagebruik is verkeerd, maar doorgifte aan derden verdient extra kritisch toezicht.'
    },
    {
        id: 'g2',
        level: 'gevorderd',
        title: '⚠️ Mooie cijfers, misleidend verhaal',
        scenario: 'Een platform claimt: "Onze privacy is spectaculair verbeterd!" en toont deze grafiek.',
        dataType: 'bar',
        data: {
            labels: ['Q1', 'Q2', 'Q3'],
            values: [72, 74, 76],
            colors: ['#0B453F', '#0B453F', '#0B453F']
        },
        conclusionPrompt: 'Schrijf een waarschuwing voor de grafiek: welk ontwerpdetail maakt het verhaal groter dan de data?',
        modelConclusion: 'De Y-as begint niet bij 0, waardoor de stijging veel groter lijkt dan hij is.',
        feedback: 'De stijging is klein, maar de afgesneden as blaast het verschil visueel op.',
        insight: 'Controleer altijd schaal en context. Bedrijven kunnen met echte data toch een misleidend beeld neerzetten.',
        isMisleading: true,
        misleadingReason: 'Y-as start niet bij 0'
    },

    // EXPERT - Kritisch redeneren over kansen en gevaren
    {
        id: 'e1',
        level: 'expert',
        title: '🧠 Correlatie of oorzakelijk?',
        scenario: 'Een platform ziet: leerlingen die veel "study tips"-video\'s kijken, halen hogere cijfers. Het bedrijf zegt: "Onze app veroorzaakt betere cijfers."',
        dataType: 'table',
        data: {
            labels: ['Leerling A (gem. 8.1)', 'Leerling B (gem. 5.4)', 'Leerling C (gem. 8.7)', 'Leerling D (gem. 4.9)'],
            values: [14, 9, 16, 8],
            colors: ['#D7C95F'],
            tableHeaders: {
                label: 'Leerling',
                value: 'Study tips-video\'s bekeken',
            },
        },
        conclusionPrompt: 'Schrijf een kritische reactie op de claim: wat zie je wel, en wat mag je nog niet bewijzen?',
        modelConclusion: 'Er is samenhang zichtbaar, maar motivatie, begeleiding of thuissituatie kunnen ook meespelen.',
        feedback: 'Samenhang is niet hetzelfde als oorzaak. Voor een oorzaakclaim heb je extra onderzoek en controlegroepen nodig.',
        insight: 'Goede data-geletterdheid betekent: kansen zien, maar claims van bedrijven altijd kritisch toetsen.'
    },
    {
        id: 'e2',
        level: 'expert',
        title: '🔐 Toestemming of duwtje?',
        scenario: 'Een cookie-pop-up gebruikt opvallende knoppen. 94% klikt op "Alles accepteren".',
        dataType: 'pie',
        data: {
            labels: ['Alles accepteren', 'Instellingen aanpassen'],
            values: [94, 6],
            colors: ['#D97848', '#5F947D']
        },
        conclusionPrompt: 'Beoordeel de keuzevrijheid: waarom bewijst 94% accepteren niet automatisch echte toestemming?',
        modelConclusion: 'Het ontwerp kan een dark pattern zijn: makkelijk accepteren, lastig weigeren.',
        feedback: 'Een hoge acceptatie betekent niet automatisch bewuste toestemming. De interface kan gedrag sturen.',
        insight: 'Bewust internetgedrag betekent: niet blind accepteren, maar begrijpen waarvoor je toestemming geeft.'
    }
];

// Simple bar chart component
const BarChart: React.FC<{ data: DataChallenge['data'], isMisleading?: boolean }> = ({ data, isMisleading }) => {
    const maxValue = Math.max(...data.values);
    const minForMisleading = isMisleading ? Math.min(...data.values) * 0.95 : 0;

    return (
        <div className="rounded-2xl p-3 sm:p-4 overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
            <div className="flex h-28 items-end justify-around gap-1 sm:h-36 sm:gap-2">
                {data.labels.map((label, i) => {
                    const height = isMisleading
                        ? ((data.values[i] - minForMisleading) / (maxValue - minForMisleading)) * 100
                        : (data.values[i] / maxValue) * 100;
                    return (
                        <div key={i} className="min-w-0 flex flex-col items-center gap-2 flex-1">
                            <span className="font-bold text-sm" style={{ color: '#08283B' }}>{data.values[i]}</span>
                            <div
                                className="w-full rounded-t-lg transition-all duration-500"
                                style={{
                                    height: `${height}%`,
                                    backgroundColor: data.colors?.[i] || '#D97848',
                                    minHeight: '20px'
                                }}
                            />
                            <span className="max-w-full break-words text-center text-[10px] font-medium leading-tight sm:text-xs" style={{ color: '#445865' }}>{label}</span>
                        </div>
                    );
                })}
            </div>
            {isMisleading && (
                <div className="mt-2 text-xs text-center" style={{ color: '#445865' }}>
                    Y-as: {Math.floor(minForMisleading)} - {maxValue}
                </div>
            )}
        </div>
    );
};

// Simple line chart component
const LineChart: React.FC<{ data: DataChallenge['data'] }> = ({ data }) => {
    const maxValue = Math.max(...data.values);
    const minValue = Math.min(...data.values);
    const range = maxValue - minValue || 1;

    const points = data.values.map((value, i) => ({
        x: (i / (data.values.length - 1)) * 100,
        y: 100 - ((value - minValue) / range) * 80 - 10
    }));

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
            <svg viewBox="0 0 100 100" className="h-32 w-full sm:h-40">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#E7D8BD" strokeWidth="0.5" />
                ))}

                {/* Line */}
                <path d={pathD} fill="none" stroke={data.colors?.[0] || '#D97848'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {/* Points */}
                {points.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="3" fill={data.colors?.[0] || '#D97848'} />
                        <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#08283B" fontSize="6" fontWeight="bold">
                            {data.values[i]}°
                        </text>
                    </g>
                ))}
            </svg>
            <div className="flex justify-between mt-2">
                {data.labels.map((label, i) => (
                    <span key={i} className="text-xs font-medium" style={{ color: '#445865' }}>{label}</span>
                ))}
            </div>
        </div>
    );
};

// Simple pie chart component
const PieChart: React.FC<{ data: DataChallenge['data'] }> = ({ data }) => {
    const total = data.values.reduce((a, b) => a + b, 0);
    let currentAngle = 0;

    const slices = data.values.map((value, i) => {
        const angle = (value / total) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;

        const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
        const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
        const x2 = 50 + 40 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
        const y2 = 50 + 40 * Math.sin((startAngle + angle - 90) * Math.PI / 180);

        const largeArc = angle > 180 ? 1 : 0;

        return {
            path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
            color: data.colors?.[i] || '#D97848',
            label: data.labels[i],
            value: value,
            percentage: ((value / total) * 100).toFixed(0)
        };
    });

    return (
        <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
            <div className="flex items-center gap-4">
                <svg viewBox="0 0 100 100" className="w-40 h-40">
                    {slices.map((slice, i) => (
                        <path key={i} d={slice.path} fill={slice.color} className="transition-all hover:opacity-80" />
                    ))}
                </svg>
                <div className="flex flex-col gap-2">
                    {slices.map((slice, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
                            <span className="font-medium text-sm" style={{ color: '#08283B' }}>{slice.label}: {slice.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const DataDetectiveMission: React.FC<Props> = ({ onBack, onComplete, vsoProfile }) => {
    const { state, setState, clearSave } = useMissionAutoSave<DataDetectiveState>(
        'data-detective',
        {
            currentLevel: 'beginner',
            currentChallengeIndex: 0,
            score: 0,
            correctAnswers: 0,
            showIntro: true,
            showLevelComplete: false,
            showMissionComplete: false,
            conclusionLog: [],
        }
    );

    const { currentLevel, currentChallengeIndex, score, correctAnswers, showIntro, showLevelComplete, showMissionComplete, conclusionLog = [] } = state;

    // Transient UI state - niet opgeslagen
    const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
    const [conclusionDraft, setConclusionDraft] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const feedbackRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!showFeedback) return;
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [showFeedback]);

    const levelChallenges = CHALLENGES.filter(c => c.level === currentLevel);
    const currentChallenge = levelChallenges[currentChallengeIndex];
    const totalChallenges = CHALLENGES.length;
    const completedChallenges = CHALLENGES.filter(c =>
        c.level === 'beginner' ? true :
            c.level === 'gevorderd' ? currentLevel !== 'beginner' :
                currentLevel === 'expert'
    ).slice(0, currentLevel === 'beginner' ? currentChallengeIndex :
        currentLevel === 'gevorderd' ? 2 + currentChallengeIndex :
            4 + currentChallengeIndex).length;

    const handleSubmitConclusion = () => {
        if (showFeedback || !selectedEvidence || conclusionDraft.trim().length < 20) return;
        setShowFeedback(true);
        setState(prev => ({
            ...prev,
            score: prev.score + 100,
            correctAnswers: prev.correctAnswers + 1,
            conclusionLog: [
                ...(prev.conclusionLog ?? []).filter(entry => entry.challengeId !== currentChallenge.id),
                {
                    challengeId: currentChallenge.id,
                    title: currentChallenge.title,
                    evidenceLabel: pinnedEvidence?.label ?? 'Datapunt',
                    evidenceValue: pinnedEvidence?.value ?? 0,
                    conclusion: conclusionDraft.trim(),
                },
            ],
        }));
    };

    const handleNext = () => {
        setSelectedEvidence(null);
        setConclusionDraft('');
        setShowFeedback(false);

        if (currentChallengeIndex < levelChallenges.length - 1) {
            setState(prev => ({ ...prev, currentChallengeIndex: prev.currentChallengeIndex + 1 }));
        } else {
            // Level complete
            if (currentLevel === 'expert') {
                setState(prev => ({ ...prev, showMissionComplete: true }));
            } else {
                setState(prev => ({ ...prev, showLevelComplete: true }));
            }
        }
    };

    const handleNextLevel = () => {
        setSelectedEvidence(null);
        setConclusionDraft('');
        setState(prev => ({
            ...prev,
            showLevelComplete: false,
            currentChallengeIndex: 0,
            currentLevel: prev.currentLevel === 'beginner' ? 'gevorderd' : 'expert',
        }));
    };

    // Intro screen
    if (showIntro) {
        return (
            <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: '#FCF6EA' }}>
            <div className="min-h-full flex items-center justify-center p-4 pb-24 sm:pb-4">
                <div className="max-w-lg w-full text-center space-y-5 sm:space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 blur-3xl rounded-full animate-pulse" style={{ backgroundColor: 'rgba(11, 69, 63, 0.22)' }} />
                        <div className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl sm:w-32 sm:h-32" style={{ background: 'linear-gradient(to bottom right, #0B453F, #0B453F)' }}>
                            <BarChart3 size={56} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h1 className="text-3xl font-black sm:text-4xl" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>Data Detective</h1>
                        <p className="text-base sm:text-lg" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                            Onderzoek hoe bedrijven data gebruiken, ontdek gevaren en kansen,
                            en train jezelf om online slimme keuzes te maken.
                        </p>
                        <p className="text-sm font-semibold" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                            3 levels met praktijkcases uit het echte internetleven — neem de tijd en lees goed!
                        </p>
                    </div>

                    <MissionGoalBanner goal={MISSION_GOAL} />

                    <div className="grid grid-cols-3 gap-2 text-center sm:gap-4">
                        <div className="rounded-2xl p-3 sm:p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                            <Eye className="w-7 h-7 mx-auto mb-2 sm:w-8 sm:h-8" style={{ color: '#5F947D' }} />
                            <p className="font-bold text-xs sm:text-sm" style={{ color: '#08283B' }}>Patronen Zien</p>
                        </div>
                        <div className="rounded-2xl p-3 sm:p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                            <AlertTriangle className="w-7 h-7 mx-auto mb-2 sm:w-8 sm:h-8" style={{ color: '#D97848' }} />
                            <p className="font-bold text-xs sm:text-sm" style={{ color: '#08283B' }}>Misleiding Spotten</p>
                        </div>
                        <div className="rounded-2xl p-3 sm:p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                            <Brain className="w-7 h-7 mx-auto mb-2 sm:w-8 sm:h-8" style={{ color: '#0B453F' }} />
                            <p className="font-bold text-xs sm:text-sm" style={{ color: '#08283B' }}>Kritisch Denken</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setState(prev => ({ ...prev, showIntro: false }))}
                        className="fixed inset-x-4 bottom-4 z-30 py-4 text-white rounded-full font-black uppercase tracking-wide shadow-2xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#0B453F] sm:static sm:w-full sm:shadow-none"
                        style={{ backgroundColor: '#0B453F' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0B453F')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0B453F')}
                    >
                        Start Onderzoek
                    </button>
                </div>
            </div>
            </div>
        );
    }

    // Level complete screen
    if (showLevelComplete) {
        return (
            <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: '#FCF6EA' }}>
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 blur-3xl rounded-full animate-pulse" style={{ backgroundColor: 'rgba(95, 148, 125, 0.2)' }} />
                        <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(to bottom right, #5F947D, #5F947D)' }}>
                            <Trophy size={48} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>
                            {currentLevel === 'beginner' ? 'Beginner Voltooid!' : 'Gevorderd Voltooid!'}
                        </h2>
                        <p style={{ color: '#445865' }}>
                            {currentLevel === 'beginner'
                                ? 'Je beheerst de basis van data-analyse. Tijd voor complexere patronen!'
                                : 'Uitstekend! Nu de expert uitdagingen...'}
                        </p>
                    </div>

                    <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                        <div className="flex justify-around">
                            <div>
                                <p className="text-3xl font-black" style={{ color: '#5F947D' }}>{correctAnswers}</p>
                                <p className="text-sm" style={{ color: '#445865' }}>Conclusies</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black" style={{ color: '#D97848' }}>{score}</p>
                                <p className="text-sm" style={{ color: '#445865' }}>Punten</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleNextLevel}
                        className="w-full py-4 text-white rounded-full font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                        style={{ backgroundColor: '#D97848' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D97848')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97848')}
                    >
                        Volgende Level <ChevronRight size={24} />
                    </button>
                </div>
            </div>
            </div>
        );
    }

    // Mission complete screen
    if (showMissionComplete) {
        return (
            <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: '#FCF6EA' }}>
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 blur-3xl rounded-full animate-pulse" style={{ backgroundColor: 'rgba(217, 120, 72, 0.2)' }} />
                        <div className="relative w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce" style={{ background: 'linear-gradient(to bottom right, #D97848, #D97848)' }}>
                            <Sparkles size={64} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>MISSIE VOLTOOID!</h1>
                        <p className="text-lg" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                            Je bent nu een echte Data Detective! Je begrijpt beter wat bedrijven
                            met data doen en hoe je bewust omgaat met kansen en gevaren online.
                        </p>
                    </div>

                    <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                        <div className="flex justify-around">
                            <div>
                                <p className="text-3xl font-black" style={{ color: '#5F947D' }}>{correctAnswers}/{totalChallenges}</p>
                                <p className="text-sm" style={{ color: '#445865' }}>Conclusies</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black" style={{ color: '#D97848' }}>{score}</p>
                                <p className="text-sm" style={{ color: '#445865' }}>Totaal Punten</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(95, 148, 125, 0.06)', border: '1px solid rgba(95, 148, 125, 0.2)' }}>
                        <h3 className="text-lg font-bold mb-2" style={{ color: '#5F947D' }}>Wat heb je geleerd?</h3>
                        <ul className="text-sm text-left space-y-1" style={{ color: '#445865' }}>
                            <li>Welke data bedrijven verzamelen en waarom</li>
                            <li>Welke kansen data kan bieden (gemak, veiligheid, personalisatie)</li>
                            <li>Welke gevaren er zijn (tracking, manipulatie, dark patterns)</li>
                            <li>Hoe je misleidende dataverhalen herkent</li>
                            <li>Hoe je bewuste privacykeuzes maakt</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(11, 69, 63, 0.06)', border: '1px solid rgba(11, 69, 63, 0.2)' }}>
                        <h3 className="text-lg font-bold mb-2" style={{ color: '#0B453F' }}>Mijn 3 Dataregels</h3>
                        <p className="text-sm mb-3" style={{ color: '#445865' }}>Schrijf voor jezelf 3 regels op die je vanaf vandaag toepast. Bijvoorbeeld:</p>
                        <ul className="text-sm text-left space-y-1 italic" style={{ color: '#445865' }}>
                            <li>1. Ik check altijd welke permissions een app vraagt voor ik installeer.</li>
                            <li>2. Ik klik niet op "Alles accepteren" maar pas cookies aan.</li>
                            <li>3. Ik deel geen persoonlijke info in ruil voor gratis diensten zonder na te denken.</li>
                        </ul>
                        <p className="text-xs mt-3" style={{ color: '#445865' }}>Tip: deel je regels met een klasgenoot en vergelijk!</p>
                    </div>

                    <div className="rounded-2xl p-5 text-left" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }} data-qa="data-detective-teacher-evidence">
                        <h3 className="text-lg font-bold mb-3" style={{ color: '#0B453F' }}>Bewijs voor je docent</h3>
                        <div className="space-y-2">
                            {conclusionLog.slice(-3).map(entry => (
                                <div key={entry.challengeId} className="rounded-xl p-3" style={{ backgroundColor: '#FCF6EA', border: '1px solid #E7D8BD' }}>
                                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#D97848' }}>{entry.title}</p>
                                    <p className="mt-1 text-xs font-bold" style={{ color: '#0B453F' }}>Gepind: {entry.evidenceLabel} ({entry.evidenceValue})</p>
                                    <p className="mt-1 text-xs leading-snug" style={{ color: '#445865' }}>{entry.conclusion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => { clearSave(); onComplete(true); }}
                        className="w-full py-4 text-white rounded-full font-black uppercase tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                        style={{ backgroundColor: '#D97848' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D97848')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97848')}
                    >
                        Terug naar Mission Control
                    </button>
                </div>
            </div>
            </div>
        );
    }

    // Main game screen
    const evidenceOptions = currentChallenge.data.labels.map((label, index) => ({
        id: `${currentChallenge.id}-${index}`,
        label,
        value: currentChallenge.data.values[index],
        color: currentChallenge.data.colors?.[index] ?? '#0B453F',
    }));
    const pinnedEvidence = evidenceOptions.find(option => option.id === selectedEvidence);

    return (
        <div className="min-h-dvh overflow-hidden" style={{ backgroundColor: '#FCF6EA' }} data-qa="data-detective-active">
            {/* Header */}
            <div className="sticky top-0 z-20 backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid #E7D8BD' }}>
                <div className="mx-auto flex max-w-4xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
                    <button
                        onClick={onBack}
                        className="p-2 transition-colors"
                        style={{ color: '#445865' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#08283B')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#445865')}
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center" style={{
                                backgroundColor: currentLevel === 'beginner' ? 'rgba(95, 148, 125, 0.1)' :
                                    currentLevel === 'gevorderd' ? 'rgba(217, 120, 72, 0.1)' :
                                        'rgba(11, 69, 63, 0.1)',
                                color: currentLevel === 'beginner' ? '#5F947D' :
                                    currentLevel === 'gevorderd' ? '#D97848' :
                                        '#0B453F',
                                border: `1px solid ${currentLevel === 'beginner' ? 'rgba(95, 148, 125, 0.2)' :
                                    currentLevel === 'gevorderd' ? 'rgba(217, 120, 72, 0.2)' :
                                        'rgba(11, 69, 63, 0.2)'}`
                            }}>
                                {vsoProfile === 'dagbesteding' ? 'Beginner' :
                                    currentLevel === 'beginner' ? 'Beginner' :
                                        currentLevel === 'gevorderd' ? 'Gevorderd' : 'Expert'}
                            </span>
                            {vsoProfile && (
                                <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tight ml-2" style={{ backgroundColor: 'rgba(95, 148, 125, 0.1)', color: '#5F947D', border: '1px solid rgba(95, 148, 125, 0.2)' }}>
                                    {vsoProfile === 'dagbesteding' ? 'Focus: Ervaren' : 'Focus: Beheersen'}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(217, 120, 72, 0.1)', border: '1px solid rgba(217, 120, 72, 0.2)' }}>
                            <Target size={14} style={{ color: '#D97848' }} />
                            <span className="font-bold text-sm" style={{ color: '#D97848' }}>{score}</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1" style={{ backgroundColor: '#E7D8BD' }}>
                    <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${((completedChallenges + 1) / totalChallenges) * 100}%`, background: 'linear-gradient(to right, #0B453F, #0B453F)' }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto flex h-[calc(100dvh-57px)] max-w-3xl flex-col gap-3 overflow-y-auto px-3 py-3 pb-24 sm:h-[calc(100dvh-65px)] sm:gap-4 sm:px-4 sm:py-4 sm:pb-6 custom-scrollbar">
                {/* Challenge title */}
                <div className="shrink-0 space-y-1 text-center">
                    <h2 className="text-xl font-black sm:text-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>{currentChallenge.title}</h2>
                    <p className="text-xs leading-snug sm:text-base" style={{ color: '#445865' }}>{currentChallenge.scenario}</p>
                </div>

                <div
                    className="shrink-0 rounded-2xl border bg-white p-3 shadow-sm sm:p-4"
                    style={{ borderColor: '#E7D8BD' }}
                    data-qa="data-detective-evidence-panel"
                >
                    <div className="mb-3 flex items-start gap-3">
                        <div className="rounded-xl p-2" style={{ backgroundColor: 'rgba(11, 69, 63, 0.08)', color: '#0B453F' }}>
                            <FileSearch size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#D97848' }}>
                                Data-room actie
                            </p>
                            <p className="text-sm font-bold leading-snug" style={{ color: '#08283B' }}>
                                Pin eerst het bewijs dat je straks gebruikt voor je keuze.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {evidenceOptions.map(option => {
                            const isSelected = selectedEvidence === option.id;

                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setSelectedEvidence(option.id)}
                                    aria-pressed={isSelected}
                                    data-qa={`data-detective-evidence-${option.id}`}
                                    className="min-h-[58px] rounded-xl border p-2 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0B453F] sm:p-3"
                                    style={{
                                        backgroundColor: isSelected ? 'rgba(95, 148, 125, 0.1)' : '#FCF6EA',
                                        borderColor: isSelected ? '#5F947D' : '#E7D8BD',
                                    }}
                                >
                                    <span className="flex items-center justify-between gap-2">
                                        <span className="truncate text-xs font-black" style={{ color: '#08283B' }}>{option.label}</span>
                                        {isSelected && <Check size={14} style={{ color: '#5F947D' }} />}
                                    </span>
                                    <span className="mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black text-white" style={{ backgroundColor: option.color }}>
                                        {option.value}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div
                        className="mt-3 rounded-xl border px-3 py-2 text-xs font-semibold leading-snug"
                        style={{
                            borderColor: pinnedEvidence ? 'rgba(95, 148, 125, 0.3)' : '#E7D8BD',
                            backgroundColor: pinnedEvidence ? 'rgba(95, 148, 125, 0.08)' : '#FCF6EA',
                            color: pinnedEvidence ? '#0B453F' : '#445865',
                        }}
                        data-qa="data-detective-evidence-status"
                    >
                        {pinnedEvidence
                            ? `Gepind bewijs: ${pinnedEvidence.label} (${pinnedEvidence.value}). Gebruik dit om je antwoord te verdedigen.`
                            : 'Nog geen bewijs gepind. Kies een datapunt voordat je een conclusie trekt.'}
                    </div>
                </div>

                {/* Data visualization */}
                <div className="relative max-h-[160px] shrink-0 overflow-hidden sm:max-h-[190px]">
                    {currentChallenge.isMisleading && (
                        <div className="absolute -top-2 -right-2 z-10 text-white text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#D97848' }}>
                            Bekijk kritisch!
                        </div>
                    )}

                    {currentChallenge.dataType === 'bar' && (
                        <BarChart data={currentChallenge.data} isMisleading={currentChallenge.isMisleading} />
                    )}
                    {currentChallenge.dataType === 'line' && (
                        <LineChart data={currentChallenge.data} />
                    )}
                    {currentChallenge.dataType === 'pie' && (
                        <PieChart data={currentChallenge.data} />
                    )}
                    {currentChallenge.dataType === 'table' && (
                        <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                            <table className="w-full">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E7D8BD' }}>
                                        <th className="text-left py-2" style={{ color: '#445865' }}>
                                            {currentChallenge.data.tableHeaders?.label ?? 'Categorie'}
                                        </th>
                                        <th className="text-right py-2" style={{ color: '#445865' }}>
                                            {currentChallenge.data.tableHeaders?.value ?? 'Waarde'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentChallenge.data.labels.map((label, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #E7D8BD' }}>
                                            <td className="py-2" style={{ color: '#08283B' }}>{label}</td>
                                            <td className="text-right font-bold py-2" style={{ color: '#D97848' }}>{currentChallenge.data.values[i]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Conclusion prompt */}
                <div className="shrink-0 rounded-2xl p-3 sm:p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                    <p className="text-center text-xs font-black uppercase tracking-widest" style={{ color: '#D97848' }}>Conclusiekaart</p>
                    <p className="mt-1 text-center text-sm font-bold sm:text-base" style={{ color: '#08283B' }}>{currentChallenge.conclusionPrompt}</p>
                </div>

                {/* Conclusion card */}
                <div className="shrink-0 rounded-2xl border bg-white p-3 sm:p-4" style={{ borderColor: '#E7D8BD' }}>
                    <label className="text-xs font-black uppercase tracking-widest" style={{ color: selectedEvidence ? '#0B453F' : '#445865' }}>
                        {selectedEvidence ? 'Verdedig je conclusie met het gepinde bewijs' : 'Pin eerst een datapunt om je conclusie te ontgrendelen'}
                    </label>
                    <textarea
                        value={conclusionDraft}
                        onChange={event => setConclusionDraft(event.target.value)}
                        disabled={!selectedEvidence || showFeedback}
                        data-qa="data-detective-conclusion-input"
                        placeholder={pinnedEvidence ? `Bijv: ${pinnedEvidence.label} (${pinnedEvidence.value}) laat zien dat...` : 'Kies eerst bewijs hierboven.'}
                        className="mt-3 w-full rounded-2xl border-2 p-3 text-sm leading-relaxed outline-none transition-all duration-300 resize-none disabled:cursor-not-allowed disabled:opacity-70 sm:p-4"
                        style={{
                            minHeight: '96px',
                            backgroundColor: selectedEvidence ? '#FCF6EA' : '#F7EFE1',
                            borderColor: selectedEvidence ? '#E7D8BD' : '#E7D8BD',
                            color: '#08283B',
                        }}
                    />
                    <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-[10px] font-semibold" style={{ color: '#445865' }}>{conclusionDraft.trim().length}/20 tekens minimaal</p>
                        <button
                            type="button"
                            onClick={handleSubmitConclusion}
                            disabled={!selectedEvidence || conclusionDraft.trim().length < 20 || showFeedback}
                            data-qa="data-detective-submit-conclusion"
                            className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#0B453F]"
                            style={{
                                backgroundColor: selectedEvidence && conclusionDraft.trim().length >= 20 && !showFeedback ? '#0B453F' : '#E7D8BD',
                                color: selectedEvidence && conclusionDraft.trim().length >= 20 && !showFeedback ? '#FFFFFF' : '#445865',
                            }}
                        >
                            Pin conclusie
                        </button>
                    </div>
                </div>

                {/* Feedback & Next */}
                {showFeedback && (
                    <div ref={feedbackRef} className="shrink-0 animate-in fade-in slide-in-from-bottom-4" data-qa="data-detective-feedback">
                        <div className="rounded-2xl p-3 sm:p-4" style={{ backgroundColor: 'rgba(95, 148, 125, 0.06)', border: '1px solid rgba(95, 148, 125, 0.2)' }}>
                            <div className="flex items-start gap-3">
                                <Lightbulb className="flex-shrink-0 mt-1" size={20} style={{ color: '#5F947D' }} />
                                <div>
                                    <p className="font-bold text-sm mb-1" style={{ color: '#5F947D' }}>Inzicht</p>
                                    <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: '#D97848' }}>Modelconclusie</p>
                                    <p className="mb-2 text-xs leading-snug sm:text-sm" style={{ color: '#08283B' }}>{currentChallenge.modelConclusion}</p>
                                    <p className="mb-2 text-xs leading-snug sm:text-sm" style={{ color: '#445865' }}>{currentChallenge.feedback}</p>
                                    <p className="text-xs leading-snug sm:text-sm" style={{ color: '#445865' }}>{currentChallenge.insight}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="fixed inset-x-4 bottom-4 z-30 flex min-h-[48px] items-center justify-center gap-2 rounded-full py-3 font-black uppercase tracking-wide text-white shadow-2xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848] sm:static sm:mt-3 sm:w-full sm:shadow-none"
                            style={{ backgroundColor: '#D97848' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D97848')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97848')}
                        >
                            Volgende <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
