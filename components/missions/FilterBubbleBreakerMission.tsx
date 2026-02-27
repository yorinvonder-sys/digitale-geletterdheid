import React, { useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Check, X, Brain, Sparkles, ArrowLeftRight } from 'lucide-react';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: any;
    vsoProfile?: any;
}

interface FeedItem { emoji: string; title: string; source: string; engagement: string; category: string; }
interface Challenge { question: string; options: string[]; correctIndex: number; explanation: string; }

const PROFILE_A = { name: 'Daan', age: 14, country: 'Nederland', emoji: '⚽', interests: ['Voetbal', 'Gaming', 'Sneakers'], color: 'blue' };
const PROFILE_B = { name: 'Priya', age: 35, country: 'India', emoji: '📰', interests: ['Nieuws', 'Koken', 'Technologie'], color: 'purple' };

const FEED_A: FeedItem[] = [
    { emoji: '⚽', title: 'Ajax wint met 3-0 van PSV!', source: 'NOS Sport', engagement: '45K likes', category: 'Sport' },
    { emoji: '🎮', title: 'Nieuwe Fortnite update is EPISCH', source: 'GameKings', engagement: '120K views', category: 'Gaming' },
    { emoji: '👟', title: 'Nike Air Max 2026 — nu beschikbaar', source: 'Gesponsord', engagement: 'Ad', category: 'Reclame' },
    { emoji: '😂', title: 'Leraar valt van stoel — VIRAL', source: 'TikTok Compilatie', engagement: '2.3M views', category: 'Entertainment' },
    { emoji: '🏆', title: 'Top 10 FIFA skills die je MOET kennen', source: 'ProGamer NL', engagement: '89K views', category: 'Gaming' },
];

const FEED_B: FeedItem[] = [
    { emoji: '🌍', title: 'Klimaattop: nieuwe afspraken bereikt', source: 'BBC World', engagement: '12K shares', category: 'Nieuws' },
    { emoji: '🍛', title: 'Authentiek curry recept uit Mumbai', source: 'Chef Sanjeev', engagement: '340K saves', category: 'Koken' },
    { emoji: '🤖', title: 'AI doorbraak: robot leert zelf lopen', source: 'Tech Today', engagement: '67K likes', category: 'Technologie' },
    { emoji: '💊', title: 'Ayurveda: oude wijsheid, modern bewijs', source: 'Health India', engagement: 'Gesponsord', category: 'Gezondheid' },
    { emoji: '📊', title: 'Beurs Update: Sensex stijgt 2%', source: 'Economic Times', engagement: '5K likes', category: 'Financiën' },
];

const CHALLENGES: Challenge[] = [
    { question: 'Waarom ziet Daan (14, NL) HEEL andere content dan Priya (35, India)?', options: ['Omdat het internet willekeurig content toont', 'Omdat een algoritme content selecteert op basis van leeftijd, locatie en interesses', 'Omdat Priya meer betaalt voor het internet', 'Omdat Daan een betere telefoon heeft'], correctIndex: 1, explanation: 'Algoritmes analyseren je leeftijd, locatie, klikgedrag en interesses om te voorspellen wat jij wilt zien. Daardoor leeft iedereen in een eigen "bubbel" van content.' },
    { question: 'Daan ziet NOOIT nieuws over klimaat of technologie. Wat is het gevaar hiervan?', options: ['Niets, hij is pas 14', 'Hij mist belangrijke informatie en denkt dat de wereld alleen uit sport en gaming bestaat', 'Het algoritme beschermt hem', 'Iedereen ziet hetzelfde'], correctIndex: 1, explanation: 'Dit heet een filterbubbel: je ziet alleen content die bevestigt wat je al leuk vindt. Je mist dan belangrijke perspectieven.' },
    { question: 'Daan ziet een "Gesponsord" bericht over Nike sneakers. Waarom juist HIJ?', options: ['Nike stuurt reclame naar iedereen', 'Daan heeft eerder gezocht naar sneakers, dus het algoritme target hem', 'Het is toeval', 'Zijn ouders hebben Nike gekocht'], correctIndex: 1, explanation: 'Adverteerders betalen om reclame te tonen aan specifieke doelgroepen. Omdat Daan "sneakers" als interesse heeft, wordt hij getarget.' },
    { question: 'Hoe kun je je eigen filterbubbel doorbreken?', options: ['Je kunt er niks aan doen', 'Bewust zoeken naar andere onderwerpen en diverse bronnen volgen', 'Een andere telefoon kopen', 'Alle apps verwijderen'], correctIndex: 1, explanation: 'Je kunt actief je bubbel doorbreken door andere onderwerpen op te zoeken, diverse nieuwsbronnen te volgen, en "Niet geïnteresseerd" te gebruiken.' },
    { question: 'Is een filterbubbel ALTIJD slecht?', options: ['Ja, het is altijd gevaarlijk', 'Nee, het kan handig zijn maar wordt een probleem als je geen ander perspectief meer ziet', 'Nee, want je ziet wat je leuk vindt', 'Ja, want het is illegaal'], correctIndex: 1, explanation: 'Een filterbubbel heeft voordelen én nadelen. Het probleem ontstaat als je niet WEET dat je in een bubbel zit.' }
];

export const FilterBubbleBreakerMission: React.FC<Props> = ({ onBack, onComplete }) => {
    const [phase, setPhase] = useState<'intro' | 'compare' | 'challenge' | 'results'>('intro');
    const [currentChallenge, setCurrentChallenge] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [answers, setAnswers] = useState<boolean[]>([]);
    const [activeFeed, setActiveFeed] = useState<'A' | 'B' | 'both'>('both');

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);
        const isCorrect = index === CHALLENGES[currentChallenge].correctIndex;
        if (isCorrect) setScore(s => s + 20);
        setAnswers(prev => [...prev, isCorrect]);
        setShowExplanation(true);
    };

    const nextChallenge = () => {
        setSelectedAnswer(null);
        setShowExplanation(false);
        if (currentChallenge < CHALLENGES.length - 1) setCurrentChallenge(c => c + 1);
        else setPhase('results');
    };

    const getBadge = () => {
        if (score >= 80) return { emoji: '🫧', title: 'Bubble Breaker', color: 'from-purple-500 to-indigo-600' };
        if (score >= 60) return { emoji: '👀', title: 'Bewuste Scroller', color: 'from-blue-500 to-cyan-500' };
        return { emoji: '🌱', title: 'Bubbel Ontdekker', color: 'from-green-500 to-emerald-500' };
    };

    const renderFeedCard = (item: FeedItem, isB: boolean) => (
        <div key={item.title} className={`p-3 rounded-xl border ${isB ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'} transition-all hover:shadow-md`}>
            <div className="flex items-start gap-2">
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500">{item.source}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${item.engagement === 'Ad' || item.engagement === 'Gesponsord' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{item.engagement}</span>
                    </div>
                    <span className={`inline-block mt-1 text-[8px] px-2 py-0.5 rounded-full font-bold ${isB ? 'bg-purple-200 text-purple-700' : 'bg-blue-200 text-blue-700'}`}>{item.category}</span>
                </div>
            </div>
        </div>
    );

    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 text-white overflow-y-auto p-4 pb-safe">
                <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-6"><ArrowLeft size={18} /> <span className="text-sm font-bold">Terug</span></button>
                <div className="max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto border border-white/20 animate-bounce"><span className="text-4xl">🫧</span></div>
                    <h1 className="text-3xl font-black">Filter Bubble Breaker</h1>
                    <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto">Twee mensen openen dezelfde app — maar zien <span className="text-purple-400 font-bold">totaal andere content</span>. Hoe kan dat?</p>
                    <div className="flex gap-4 justify-center">
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 text-center w-36">
                            <span className="text-2xl">{PROFILE_A.emoji}</span>
                            <p className="text-sm font-black mt-1">{PROFILE_A.name}</p>
                            <p className="text-[10px] text-blue-300">{PROFILE_A.age} jaar, {PROFILE_A.country}</p>
                            <div className="flex flex-wrap gap-1 justify-center mt-2">{PROFILE_A.interests.map(i => <span key={i} className="text-[8px] bg-blue-500/30 px-1.5 py-0.5 rounded-full">{i}</span>)}</div>
                        </div>
                        <div className="flex items-center"><ArrowLeftRight size={24} className="text-white/30" /></div>
                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl p-4 text-center w-36">
                            <span className="text-2xl">{PROFILE_B.emoji}</span>
                            <p className="text-sm font-black mt-1">{PROFILE_B.name}</p>
                            <p className="text-[10px] text-purple-300">{PROFILE_B.age} jaar, {PROFILE_B.country}</p>
                            <div className="flex flex-wrap gap-1 justify-center mt-2">{PROFILE_B.interests.map(i => <span key={i} className="text-[8px] bg-purple-500/30 px-1.5 py-0.5 rounded-full">{i}</span>)}</div>
                        </div>
                    </div>
                    <button onClick={() => setPhase('compare')} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-purple-500/30">Bekijk hun feeds →</button>
                </div>
            </div>
        );
    }

    if (phase === 'compare') {
        return (
            <div className="min-h-screen bg-slate-50 overflow-y-auto p-4 pb-safe">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => setPhase('intro')} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-4"><ArrowLeft size={18} /> <span className="text-sm font-bold">Terug</span></button>
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-black text-slate-900">Vergelijk de feeds</h2>
                        <p className="text-sm text-slate-500">Dezelfde app, totaal andere content. Spot de verschillen!</p>
                    </div>
                    <div className="flex bg-slate-200 p-1 rounded-2xl mb-6 max-w-sm mx-auto">
                        {(['both', 'A', 'B'] as const).map(f => (
                            <button key={f} onClick={() => setActiveFeed(f)} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${activeFeed === f ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>
                                {f === 'both' ? '🔀 Beide' : f === 'A' ? `${PROFILE_A.emoji} ${PROFILE_A.name}` : `${PROFILE_B.emoji} ${PROFILE_B.name}`}
                            </button>
                        ))}
                    </div>
                    <div className={`grid ${activeFeed === 'both' ? 'grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'} gap-4`}>
                        {(activeFeed === 'both' || activeFeed === 'A') && (
                            <div>
                                <div className="flex items-center gap-2 mb-3 bg-blue-100 px-3 py-2 rounded-xl"><span>{PROFILE_A.emoji}</span><span className="text-xs font-black text-blue-800">Feed van {PROFILE_A.name}</span></div>
                                <div className="space-y-2">{FEED_A.map(item => renderFeedCard(item, false))}</div>
                            </div>
                        )}
                        {(activeFeed === 'both' || activeFeed === 'B') && (
                            <div>
                                <div className="flex items-center gap-2 mb-3 bg-purple-100 px-3 py-2 rounded-xl"><span>{PROFILE_B.emoji}</span><span className="text-xs font-black text-purple-800">Feed van {PROFILE_B.name}</span></div>
                                <div className="space-y-2">{FEED_B.map(item => renderFeedCard(item, true))}</div>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-8">
                        <button onClick={() => setPhase('challenge')} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-black hover:scale-105 transition-transform active:scale-95 shadow-xl">Start de vragen →</button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'challenge') {
        const ch = CHALLENGES[currentChallenge];
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white overflow-y-auto p-4 pb-safe">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => setPhase('compare')} className="text-slate-400 hover:text-slate-700"><ArrowLeft size={18} /></button>
                        <div className="flex gap-1.5">{CHALLENGES.map((_, i) => (<div key={i} className={`w-8 h-1.5 rounded-full ${i < currentChallenge ? 'bg-emerald-500' : i === currentChallenge ? 'bg-indigo-500' : 'bg-slate-200'}`} />))}</div>
                        <div className="bg-indigo-100 px-3 py-1 rounded-full"><span className="text-xs font-black text-indigo-700">{score} pts</span></div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center"><Brain size={16} className="text-white" /></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vraag {currentChallenge + 1}/{CHALLENGES.length}</span></div>
                        <h3 className="text-lg font-black text-slate-900 leading-snug">{ch.question}</h3>
                    </div>
                    <div className="space-y-3">
                        {ch.options.map((opt, i) => {
                            const isSelected = selectedAnswer === i;
                            const isCorrect = i === ch.correctIndex;
                            const done = selectedAnswer !== null;
                            let bg = 'bg-white border-slate-200 hover:border-indigo-300';
                            if (done && isCorrect) bg = 'bg-emerald-50 border-emerald-400';
                            else if (done && isSelected) bg = 'bg-red-50 border-red-400';
                            else if (done) bg = 'bg-slate-50 border-slate-100 opacity-50';
                            return (<button key={i} onClick={() => handleAnswer(i)} disabled={done} className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${bg}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black ${done && isCorrect ? 'bg-emerald-500 text-white' : done && isSelected ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{done && isCorrect ? <Check size={14} /> : done && isSelected ? <X size={14} /> : String.fromCharCode(65 + i)}</div>
                                    <span className="text-sm font-medium text-slate-700">{opt}</span>
                                </div>
                            </button>);
                        })}
                    </div>
                    {showExplanation && (
                        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                            <div className="flex items-start gap-2"><Sparkles size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" /><p className="text-sm text-indigo-800">{ch.explanation}</p></div>
                            <button onClick={nextChallenge} className="w-full mt-4 py-3 bg-indigo-500 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2">{currentChallenge < CHALLENGES.length - 1 ? <>Volgende <ChevronRight size={16} /></> : <>Resultaat <Trophy size={16} /></>}</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const badge = getBadge();
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 text-white overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 pb-safe">
            <div className="max-w-sm w-full text-center space-y-6">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl`}><span className="text-5xl">{badge.emoji}</span></div>
                <h1 className="text-2xl font-black">{badge.title}</h1>
                <p className="text-white/60 text-sm">{answers.filter(a => a).length}/{CHALLENGES.length} vragen goed</p>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{score}/100</div>
                    <p className="text-white/50 text-xs mt-1">Bubble Score</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-left space-y-2 border border-white/10">
                    <p className="text-xs font-bold text-white/80 mb-2">💡 3 tips om je bubbel te breken:</p>
                    <p className="text-xs text-white/60">1. Volg bewust accounts met andere meningen</p>
                    <p className="text-xs text-white/60">2. Zoek actief naar andere onderwerpen</p>
                    <p className="text-xs text-white/60">3. Gebruik "Niet geïnteresseerd" bij eenzijdige content</p>
                </div>
                <button onClick={() => onComplete(true)} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2"><Trophy size={20} /> Missie Voltooid!</button>
            </div>
            </div>
        </div>
    );
};
