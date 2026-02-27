/**
 * DataDetectiveMission.tsx
 * 
 * Leerlingen analyseren datasets en ontdekken verborgen patronen.
 * Ze leren kritisch nadenken over data, conclusies trekken, en misleidende grafieken herkennen.
 * 
 * SLO-doelen: Informatievaardigheden, kritisch denken, data-analyse
 */

import React, { useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Check, X, BarChart3, TrendingUp, AlertTriangle, Lightbulb, Target, Sparkles, Brain, Eye } from 'lucide-react';
import { UserStats, VsoProfile } from '../../types';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: UserStats;
    vsoProfile?: VsoProfile;
}

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
    };
    question: string;
    options: {
        id: string;
        text: string;
        isCorrect: boolean;
        explanation: string;
    }[];
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
            colors: ['#10B981', '#3B82F6', '#06B6D4', '#F59E0B', '#EF4444']
        },
        question: 'Welke conclusie is het meest logisch op basis van deze data?',
        options: [
            { id: 'a', text: 'De app verzamelt vooral data om contentaanbevelingen te verbeteren', isCorrect: true, explanation: 'Correct. Kijkgedrag en zoekopdrachten zijn veruit het grootst en sturen meestal aanbevelingen.' },
            { id: 'b', text: 'Locatie en microfoon zijn de belangrijkste databronnen', isCorrect: false, explanation: 'Niet volgens de grafiek: deze twee zijn juist veel lager dan kijkgedrag en zoekopdrachten.' },
            { id: 'c', text: 'De app verzamelt geen privacygevoelige data', isCorrect: false, explanation: 'Locatie, contacten en microfoontoegang kunnen wel degelijk privacygevoelig zijn.' },
            { id: 'd', text: 'De app gebruikt alleen data als je iets post', isCorrect: false, explanation: 'Ook passief gedrag (kijken en zoeken) wordt duidelijk verzameld.' }
        ],
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
            colors: ['#F59E0B']
        },
        question: 'Welke combinatie van kans en risico past het beste bij deze trend?',
        options: [
            { id: 'a', text: 'Kans: sneller relevante producten vinden. Risico: je ziet minder alternatieven.', isCorrect: true, explanation: 'Correct. Personalisatie verhoogt gemak, maar kan ook een filterbubbel in je keuzes veroorzaken.' },
            { id: 'b', text: 'Kans: volledige privacy. Risico: geen aanbiedingen.', isCorrect: false, explanation: 'Personalisatie betekent meestal juist dat er veel data wordt gebruikt, niet volledige privacy.' },
            { id: 'c', text: 'Kans: minder data-opslag. Risico: slechtere beveiliging.', isCorrect: false, explanation: 'Deze grafiek zegt niets over minder data-opslag of beveiliging.' },
            { id: 'd', text: 'Kans: geen advertenties meer. Risico: geen risico.', isCorrect: false, explanation: 'Personalisatie leidt vaak juist tot meer gerichte advertenties en heeft altijd afwegingen.' }
        ],
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
            colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
        },
        question: 'Welke toepassing vraagt de meeste kritische controle van gebruikers?',
        options: [
            { id: 'a', text: 'Fraudedetectie, omdat veiligheid nooit nodig is', isCorrect: false, explanation: 'Fraudedetectie is juist vaak nuttig en beschermt gebruikers.' },
            { id: 'b', text: 'Productverbetering, want dat is altijd verboden', isCorrect: false, explanation: 'Productverbetering kan legitiem zijn, mits duidelijk en zorgvuldig.' },
            { id: 'c', text: 'Verkoop aan partners, want data verlaat dan het oorspronkelijke platform', isCorrect: true, explanation: 'Correct. Zodra data gedeeld of verkocht wordt aan derden, neemt het privacyrisico sterk toe.' },
            { id: 'd', text: 'Advertenties, want advertenties zijn per definitie illegaal', isCorrect: false, explanation: 'Advertenties zijn niet automatisch illegaal; het gaat om transparantie, toestemming en proportionaliteit.' }
        ],
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
            colors: ['#8B5CF6', '#8B5CF6', '#8B5CF6']
        },
        question: 'Waarom kan deze presentatie misleidend zijn?',
        options: [
            { id: 'a', text: 'De Y-as begint niet bij 0, waardoor de stijging veel groter lijkt', isCorrect: true, explanation: 'Correct. De stijging is klein, maar visueel wordt die overdreven door de afgesneden as.' },
            { id: 'b', text: 'Er staan te weinig balken om een conclusie te trekken', isCorrect: false, explanation: 'Drie meetpunten kunnen nog steeds een trend tonen; de as-instelling is hier het echte probleem.' },
            { id: 'c', text: 'Paars mag niet gebruikt worden voor privacydata', isCorrect: false, explanation: 'Kleurkeuze is niet de kern van de misleiding.' },
            { id: 'd', text: 'De data moet altijd in een cirkeldiagram staan', isCorrect: false, explanation: 'Het type grafiek is niet verplicht; eerlijke schaal is belangrijker.' }
        ],
        insight: 'Controleer altijd schaal en context. Bedrijven kunnen met echte data toch een misleidend beeld neerzetten.',
        isMisleading: true,
        misleadingReason: 'Y-as start niet bij 0'
    },

    // EXPERT - Kritisch redeneren over kansen en gevaren
    {
        id: 'e1',
        level: 'expert',
        title: '🧠 Correlatie of oorzakelijk?',
        scenario: 'Een platform ziet: leerlingen die veel "study tips"-video’s kijken, halen hogere cijfers. Het bedrijf zegt: "Onze app veroorzaakt betere cijfers."',
        dataType: 'table',
        data: {
            labels: ['Leerling A (gem. 8.1)', 'Leerling B (gem. 5.4)', 'Leerling C (gem. 8.7)', 'Leerling D (gem. 4.9)'],
            values: [14, 9, 16, 8],
            colors: ['#F59E0B']
        },
        question: 'Wat is de beste kritische reactie?',
        options: [
            { id: 'a', text: 'De app is zeker de enige oorzaak van betere cijfers', isCorrect: false, explanation: 'Dat kun je niet zeker weten zonder extra onderzoek en controle van andere factoren.' },
            { id: 'b', text: 'Correlatie is zichtbaar, maar motivatie, begeleiding of thuissituatie kunnen ook meespelen', isCorrect: true, explanation: 'Correct. Samenhang is niet hetzelfde als oorzaak; er kunnen meerdere verklaringen zijn.' },
            { id: 'c', text: 'Data mag nooit gebruikt worden voor onderwijsverbetering', isCorrect: false, explanation: 'Data kan juist kansen bieden in onderwijs, mits zorgvuldig en eerlijk ingezet.' },
            { id: 'd', text: 'Omdat de cijfers verschillen, is de data waardeloos', isCorrect: false, explanation: 'Verschillen zijn juist normaal in echte data en kunnen nuttige signalen geven.' }
        ],
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
            colors: ['#EF4444', '#10B981']
        },
        question: 'Welke conclusie is het sterkst?',
        options: [
            { id: 'a', text: 'Gebruikers willen altijd vrijwillig volledige tracking', isCorrect: false, explanation: 'Niet per se. Ontwerpkeuzes kunnen gebruikers richting een snelle keuze duwen.' },
            { id: 'b', text: 'Het ontwerp kan een dark pattern zijn: makkelijk accepteren, lastig weigeren', isCorrect: true, explanation: 'Correct. Dit is een bekend risico: de keuze lijkt vrij, maar de interface stuurt gedrag.' },
            { id: 'c', text: 'Omdat 94% klikt, is er geen privacyprobleem', isCorrect: false, explanation: 'Een hoge acceptatie betekent niet automatisch dat toestemming bewust of eerlijk is gegeven.' },
            { id: 'd', text: 'Cookies zijn altijd illegaal', isCorrect: false, explanation: 'Cookies kunnen legaal zijn, maar transparantie en echte keuzevrijheid blijven cruciaal.' }
        ],
        insight: 'Bewust internetgedrag betekent: niet blind accepteren, maar begrijpen waarvoor je toestemming geeft.'
    }
];

// Simple bar chart component
const BarChart: React.FC<{ data: DataChallenge['data'], isMisleading?: boolean }> = ({ data, isMisleading }) => {
    const maxValue = Math.max(...data.values);
    const minForMisleading = isMisleading ? Math.min(...data.values) * 0.95 : 0;

    return (
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-end justify-around gap-2 h-48">
                {data.labels.map((label, i) => {
                    const height = isMisleading
                        ? ((data.values[i] - minForMisleading) / (maxValue - minForMisleading)) * 100
                        : (data.values[i] / maxValue) * 100;
                    return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                            <span className="text-white font-bold text-sm">{data.values[i]}</span>
                            <div
                                className="w-full rounded-t-lg transition-all duration-500"
                                style={{
                                    height: `${height}%`,
                                    backgroundColor: data.colors?.[i] || '#3B82F6',
                                    minHeight: '20px'
                                }}
                            />
                            <span className="text-slate-400 text-xs font-medium text-center">{label}</span>
                        </div>
                    );
                })}
            </div>
            {isMisleading && (
                <div className="mt-2 text-xs text-slate-500 text-center">
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
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <svg viewBox="0 0 100 100" className="w-full h-48">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#334155" strokeWidth="0.5" />
                ))}

                {/* Line */}
                <path d={pathD} fill="none" stroke={data.colors?.[0] || '#F59E0B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {/* Points */}
                {points.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="3" fill={data.colors?.[0] || '#F59E0B'} />
                        <text x={p.x} y={p.y - 8} textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">
                            {data.values[i]}°
                        </text>
                    </g>
                ))}
            </svg>
            <div className="flex justify-between mt-2">
                {data.labels.map((label, i) => (
                    <span key={i} className="text-slate-400 text-xs font-medium">{label}</span>
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
            color: data.colors?.[i] || '#3B82F6',
            label: data.labels[i],
            value: value,
            percentage: ((value / total) * 100).toFixed(0)
        };
    });

    return (
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
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
                            <span className="text-white font-medium text-sm">{slice.label}: {slice.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const DataDetectiveMission: React.FC<Props> = ({ onBack, onComplete, vsoProfile }) => {
    const [currentLevel, setCurrentLevel] = useState<'beginner' | 'gevorderd' | 'expert'>('beginner');
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [showMissionComplete, setShowMissionComplete] = useState(false);

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

    const handleAnswer = (optionId: string) => {
        if (showFeedback) return;
        setSelectedAnswer(optionId);
        setShowFeedback(true);

        const option = currentChallenge.options.find(o => o.id === optionId);
        if (option?.isCorrect) {
            setScore(prev => prev + 100);
            setCorrectAnswers(prev => prev + 1);
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setShowFeedback(false);

        if (currentChallengeIndex < levelChallenges.length - 1) {
            setCurrentChallengeIndex(prev => prev + 1);
        } else {
            // Level complete
            if (currentLevel === 'beginner') {
                setShowLevelComplete(true);
            } else if (currentLevel === 'gevorderd') {
                setShowLevelComplete(true);
            } else {
                setShowMissionComplete(true);
            }
        }
    };

    const handleNextLevel = () => {
        setShowLevelComplete(false);
        setCurrentChallengeIndex(0);
        if (currentLevel === 'beginner') {
            setCurrentLevel('gevorderd');
        } else if (currentLevel === 'gevorderd') {
            setCurrentLevel('expert');
        }
    };

    // Intro screen
    if (showIntro) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl">
                            <BarChart3 size={64} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-white">Data Detective</h1>
                        <p className="text-slate-400 text-lg">
                            Onderzoek hoe bedrijven data gebruiken, ontdek gevaren en kansen,
                            en train jezelf om online slimme keuzes te maken.
                        </p>
                        <p className="text-slate-500 text-sm font-semibold">
                            3 levels met praktijkcases uit het echte internetleven — neem de tijd en lees goed!
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <Eye className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                            <p className="text-white font-bold text-sm">Patronen Zien</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                            <p className="text-white font-bold text-sm">Misleiding Spotten</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <p className="text-white font-bold text-sm">Kritisch Denken</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowIntro(false)}
                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black uppercase tracking-wide hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                    >
                        Start Onderzoek 🔍
                    </button>
                </div>
            </div>
            </div>
        );
    }

    // Level complete screen
    if (showLevelComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl">
                            <Trophy size={48} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">
                            {currentLevel === 'beginner' ? 'Beginner Voltooid!' : 'Gevorderd Voltooid!'}
                        </h2>
                        <p className="text-slate-400">
                            {currentLevel === 'beginner'
                                ? 'Je beheerst de basis van data-analyse. Tijd voor complexere patronen!'
                                : 'Uitstekend! Nu de expert uitdagingen...'}
                        </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <div className="flex justify-around">
                            <div>
                                <p className="text-3xl font-black text-emerald-400">{correctAnswers}</p>
                                <p className="text-slate-400 text-sm">Correct</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-cyan-400">{score}</p>
                                <p className="text-slate-400 text-sm">Punten</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleNextLevel}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black uppercase tracking-wide hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-yellow-500/30 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-yellow-500 to-orange-600 w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                            <Sparkles size={64} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white">MISSIE VOLTOOID!</h1>
                        <p className="text-slate-400 text-lg">
                            Je bent nu een echte Data Detective! Je begrijpt beter wat bedrijven
                            met data doen en hoe je bewust omgaat met kansen en gevaren online.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <div className="flex justify-around">
                            <div>
                                <p className="text-3xl font-black text-emerald-400">{correctAnswers}/{totalChallenges}</p>
                                <p className="text-slate-400 text-sm">Correct</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-yellow-400">{score}</p>
                                <p className="text-slate-400 text-sm">Totaal Punten</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20">
                        <h3 className="text-lg font-bold text-cyan-400 mb-2">💡 Wat heb je geleerd?</h3>
                        <ul className="text-slate-300 text-sm text-left space-y-1">
                            <li>✅ Welke data bedrijven verzamelen en waarom</li>
                            <li>✅ Welke kansen data kan bieden (gemak, veiligheid, personalisatie)</li>
                            <li>✅ Welke gevaren er zijn (tracking, manipulatie, dark patterns)</li>
                            <li>✅ Hoe je misleidende dataverhalen herkent</li>
                            <li>✅ Hoe je bewuste privacykeuzes maakt</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl p-6 border border-violet-500/20">
                        <h3 className="text-lg font-bold text-violet-400 mb-2">📝 Mijn 3 Dataregels</h3>
                        <p className="text-slate-300 text-sm mb-3">Schrijf voor jezelf 3 regels op die je vanaf vandaag toepast. Bijvoorbeeld:</p>
                        <ul className="text-slate-400 text-sm text-left space-y-1 italic">
                            <li>1. Ik check altijd welke permissions een app vraagt voor ik installeer.</li>
                            <li>2. Ik klik niet op "Alles accepteren" maar pas cookies aan.</li>
                            <li>3. Ik deel geen persoonlijke info in ruil voor gratis diensten zonder na te denken.</li>
                        </ul>
                        <p className="text-slate-500 text-xs mt-3">Tip: deel je regels met een klasgenoot en vergelijk!</p>
                    </div>

                    <button
                        onClick={() => onComplete(true)}
                        className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-2xl font-black uppercase tracking-wide hover:shadow-lg transition-all"
                    >
                        Terug naar Mission Control 🚀
                    </button>
                </div>
            </div>
            </div>
        );
    }

    // Main game screen
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentLevel === 'beginner' ? 'bg-emerald-500/20 text-emerald-400' :
                                    currentLevel === 'gevorderd' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-purple-500/20 text-purple-400'
                                }`}>
                                {vsoProfile === 'dagbesteding' ? '🌱 Beginner' :
                                    currentLevel === 'beginner' ? '🌱 Beginner' :
                                        currentLevel === 'gevorderd' ? '⚡ Gevorderd' : '🎯 Expert'}
                            </span>
                            {vsoProfile && (
                                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded border border-cyan-500/30 font-bold uppercase tracking-tight ml-2">
                                    {vsoProfile === 'dagbesteding' ? 'Focus: Ervaren' : 'Focus: Beheersen'}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-full">
                            <Target size={14} className="text-cyan-400" />
                            <span className="text-white font-bold text-sm">{score}</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-slate-800">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${((completedChallenges + 1) / totalChallenges) * 100}%` }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                {/* Challenge title */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-white">{currentChallenge.title}</h2>
                    <p className="text-slate-400">{currentChallenge.scenario}</p>
                </div>

                {/* Data visualization */}
                <div className="relative">
                    {currentChallenge.isMisleading && (
                        <div className="absolute -top-2 -right-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            ⚠️ Bekijk kritisch!
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
                        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left text-slate-400 py-2">Stad</th>
                                        <th className="text-right text-slate-400 py-2">IJssalons</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentChallenge.data.labels.map((label, i) => (
                                        <tr key={i} className="border-b border-slate-700/50">
                                            <td className="text-white py-2">{label}</td>
                                            <td className="text-right text-cyan-400 font-bold py-2">{currentChallenge.data.values[i]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Question */}
                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-white font-bold text-center">{currentChallenge.question}</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {currentChallenge.options.map((option) => {
                        const isSelected = selectedAnswer === option.id;
                        const showResult = showFeedback && isSelected;

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleAnswer(option.id)}
                                disabled={showFeedback}
                                className={`w-full p-4 rounded-xl text-left transition-all ${showResult
                                        ? option.isCorrect
                                            ? 'bg-emerald-500/20 border-2 border-emerald-500'
                                            : 'bg-red-500/20 border-2 border-red-500'
                                        : isSelected
                                            ? 'bg-cyan-500/20 border-2 border-cyan-500'
                                            : 'bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${showResult
                                            ? option.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                                            : 'bg-slate-700'
                                        }`}>
                                        {showResult ? (
                                            option.isCorrect ? <Check size={16} className="text-white" /> : <X size={16} className="text-white" />
                                        ) : (
                                            <span className="text-white font-bold text-sm">{option.id.toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{option.text}</p>
                                        {showResult && (
                                            <p className={`text-sm mt-2 ${option.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {option.explanation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Feedback & Next */}
                {showFeedback && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="text-cyan-400 font-bold text-sm mb-1">💡 Inzicht</p>
                                    <p className="text-slate-300 text-sm">{currentChallenge.insight}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-black uppercase tracking-wide hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            Volgende <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
