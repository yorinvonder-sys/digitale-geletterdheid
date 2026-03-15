import React, { useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Check, X, Brain, Sparkles, ArrowLeftRight, Search } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';

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

interface FilterBubbleState {
    phase: 'intro' | 'compare' | 'analyze' | 'challenge' | 'results';
    currentChallenge: number;
    score: number;
    answers: boolean[];
    analyzeResponse: string;
}

export const FilterBubbleBreakerMission: React.FC<Props> = ({ onBack, onComplete }) => {
    const { state: saved, setState: setSaved, clearSave } = useMissionAutoSave<FilterBubbleState>(
        'filter-bubble-breaker',
        { phase: 'intro', currentChallenge: 0, score: 0, answers: [], analyzeResponse: '' }
    );
    const phase = saved.phase;
    const currentChallenge = saved.currentChallenge;
    const score = saved.score;
    const answers = saved.answers;
    const setPhase = (p: FilterBubbleState['phase']) => setSaved(prev => ({ ...prev, phase: p }));
    const setCurrentChallenge = (updater: React.SetStateAction<number>) => setSaved(prev => ({
        ...prev,
        currentChallenge: typeof updater === 'function' ? updater(prev.currentChallenge) : updater,
    }));
    const setScore = (updater: React.SetStateAction<number>) => setSaved(prev => ({
        ...prev,
        score: typeof updater === 'function' ? updater(prev.score) : updater,
    }));
    const setAnswers = (updater: React.SetStateAction<boolean[]>) => setSaved(prev => ({
        ...prev,
        answers: typeof updater === 'function' ? updater(prev.answers) : updater,
    }));
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
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
        if (score >= 80) return { emoji: '🫧', title: 'Bubble Breaker', color: 'from-[#8B6F9E] to-[#D97757]' };
        if (score >= 60) return { emoji: '👀', title: 'Bewuste Scroller', color: 'from-[#2A9D8F] to-[#D97757]' };
        return { emoji: '🌱', title: 'Bubbel Ontdekker', color: 'from-[#10B981] to-[#2A9D8F]' };
    };

    const renderFeedCard = (item: FeedItem, isB: boolean) => (
        <div key={item.title} className={`p-3 rounded-2xl border transition-all duration-300 hover:shadow-md ${isB ? 'bg-[#8B6F9E]/5 border-[#8B6F9E]/20' : 'bg-[#2A9D8F]/5 border-[#2A9D8F]/20'}`}>
            <div className="flex items-start gap-2">
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1A1A19] leading-tight" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#6B6B66]">{item.source}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${item.engagement === 'Ad' || item.engagement === 'Gesponsord' ? 'bg-[#D97757]/10 text-[#D97757]' : 'bg-[#F0EEE8] text-[#6B6B66]'}`}>{item.engagement}</span>
                    </div>
                    <span className={`inline-flex mt-1 text-[8px] px-2 py-0.5 rounded-full font-bold border ${isB ? 'bg-[#8B6F9E]/10 text-[#8B6F9E] border-[#8B6F9E]/20' : 'bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/20'}`}>{item.category}</span>
                </div>
            </div>
        </div>
    );

    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-[#FAF9F0] text-[#1A1A19] overflow-y-auto p-4 pb-safe">
                <button onClick={onBack} className="flex items-center gap-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300 mb-6"><ArrowLeft size={18} /> <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Terug</span></button>
                <div className="max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-[#8B6F9E]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#8B6F9E]/20 animate-bounce"><span className="text-4xl">🫧</span></div>
                    <h1 className="text-3xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Filter Bubble Breaker</h1>
                    <p className="text-[#3D3D38] text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Twee mensen openen dezelfde app — maar zien <span className="text-[#D97757] font-bold">totaal andere content</span>. Hoe kan dat?</p>
                    <div className="flex gap-4 justify-center">
                        <div className="bg-[#2A9D8F]/10 border border-[#2A9D8F]/20 rounded-2xl p-4 text-center w-36">
                            <span className="text-2xl">{PROFILE_A.emoji}</span>
                            <p className="text-sm font-black mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{PROFILE_A.name}</p>
                            <p className="text-[10px] text-[#2A9D8F]">{PROFILE_A.age} jaar, {PROFILE_A.country}</p>
                            <div className="flex flex-wrap gap-1 justify-center mt-2">{PROFILE_A.interests.map(i => <span key={i} className="text-[8px] bg-[#2A9D8F]/15 text-[#2A9D8F] px-1.5 py-0.5 rounded-full border border-[#2A9D8F]/20">{i}</span>)}</div>
                        </div>
                        <div className="flex items-center"><ArrowLeftRight size={24} className="text-[#E8E6DF]" /></div>
                        <div className="bg-[#8B6F9E]/10 border border-[#8B6F9E]/20 rounded-2xl p-4 text-center w-36">
                            <span className="text-2xl">{PROFILE_B.emoji}</span>
                            <p className="text-sm font-black mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{PROFILE_B.name}</p>
                            <p className="text-[10px] text-[#8B6F9E]">{PROFILE_B.age} jaar, {PROFILE_B.country}</p>
                            <div className="flex flex-wrap gap-1 justify-center mt-2">{PROFILE_B.interests.map(i => <span key={i} className="text-[8px] bg-[#8B6F9E]/15 text-[#8B6F9E] px-1.5 py-0.5 rounded-full border border-[#8B6F9E]/20">{i}</span>)}</div>
                        </div>
                    </div>
                    <button onClick={() => setPhase('compare')} className="px-8 py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97757]/30 focus-visible:ring-2 focus-visible:ring-[#D97757]">Bekijk hun feeds →</button>
                </div>
            </div>
        );
    }

    if (phase === 'compare') {
        return (
            <div className="min-h-screen bg-[#FAF9F0] overflow-y-auto p-4 pb-safe">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => setPhase('intro')} className="flex items-center gap-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300 mb-4"><ArrowLeft size={18} /> <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Terug</span></button>
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Vergelijk de feeds</h2>
                        <p className="text-sm text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Dezelfde app, totaal andere content. Spot de verschillen!</p>
                    </div>
                    <div className="flex bg-[#F0EEE8] p-1 rounded-full mb-6 max-w-sm mx-auto">
                        {(['both', 'A', 'B'] as const).map(f => (
                            <button key={f} onClick={() => setActiveFeed(f)} className={`flex-1 py-2 rounded-full text-xs font-black transition-all duration-300 ${activeFeed === f ? 'bg-white shadow-md text-[#1A1A19]' : 'text-[#6B6B66]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {f === 'both' ? '🔀 Beide' : f === 'A' ? `${PROFILE_A.emoji} ${PROFILE_A.name}` : `${PROFILE_B.emoji} ${PROFILE_B.name}`}
                            </button>
                        ))}
                    </div>
                    <div className={`grid ${activeFeed === 'both' ? 'grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'} gap-4`}>
                        {(activeFeed === 'both' || activeFeed === 'A') && (
                            <div>
                                <div className="flex items-center gap-2 mb-3 bg-[#2A9D8F]/10 border border-[#2A9D8F]/20 px-3 py-2 rounded-full"><span>{PROFILE_A.emoji}</span><span className="text-xs font-black text-[#2A9D8F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Feed van {PROFILE_A.name}</span></div>
                                <div className="space-y-2">{FEED_A.map(item => renderFeedCard(item, false))}</div>
                            </div>
                        )}
                        {(activeFeed === 'both' || activeFeed === 'B') && (
                            <div>
                                <div className="flex items-center gap-2 mb-3 bg-[#8B6F9E]/10 border border-[#8B6F9E]/20 px-3 py-2 rounded-full"><span>{PROFILE_B.emoji}</span><span className="text-xs font-black text-[#8B6F9E]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Feed van {PROFILE_B.name}</span></div>
                                <div className="space-y-2">{FEED_B.map(item => renderFeedCard(item, true))}</div>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-8">
                        <button onClick={() => setPhase('analyze')} className="px-8 py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black transition-all duration-300 active:scale-95 shadow-xl focus-visible:ring-2 focus-visible:ring-[#D97757]">Ga dieper analyseren →</button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'analyze') {
        const analyzeResponse = saved.analyzeResponse;
        const setAnalyzeResponse = (val: string) => setSaved(prev => ({ ...prev, analyzeResponse: val }));
        return (
            <div className="min-h-screen bg-[#FAF9F0] overflow-y-auto p-4 pb-safe">
                <div className="max-w-lg mx-auto space-y-6">
                    <button onClick={() => setPhase('compare')} className="flex items-center gap-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300"><ArrowLeft size={18} /> <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Terug</span></button>

                    <div className="bg-white rounded-2xl shadow-xl border border-[#E8E6DF] p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-[#8B6F9E]/10 rounded-xl flex items-center justify-center mx-auto border border-[#8B6F9E]/20">
                            <Search size={24} className="text-[#8B6F9E]" />
                        </div>
                        <h2 className="text-xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Analyseer de bubbel</h2>
                        <p className="text-sm text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Zoek <span className="font-black text-[#D97757]">1 onderwerp</span> dat {PROFILE_A.name} zou missen in zijn feed.
                            Leg in 1-2 zinnen uit waarom dit onderwerp belangrijk is om te weten.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Ter herinnering: {PROFILE_A.name} ziet alleen</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {FEED_A.map(item => (
                                <span key={item.title} className="text-[10px] bg-[#2A9D8F]/10 text-[#2A9D8F] px-2 py-1 rounded-full border border-[#2A9D8F]/20 font-bold">{item.category}</span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Jouw analyse:</label>
                        <textarea
                            value={analyzeResponse}
                            onChange={e => setAnalyzeResponse(e.target.value)}
                            placeholder="Bijv: Daan mist nieuws over klimaatverandering. Dit is belangrijk omdat..."
                            className="w-full p-4 rounded-2xl border-2 border-[#E8E6DF] bg-white text-sm text-[#1A1A19] placeholder-[#B5B5AF] focus:border-[#8B6F9E] focus:outline-none transition-all duration-300 resize-none"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif", minHeight: '120px' }}
                        />
                        <p className="text-[10px] text-[#6B6B66] text-right" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{analyzeResponse.length} tekens</p>
                    </div>

                    <button
                        onClick={() => setPhase('challenge')}
                        disabled={analyzeResponse.trim().length < 10}
                        className={`w-full py-4 text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757] ${analyzeResponse.trim().length < 10 ? 'bg-[#E8E6DF] text-[#B5B5AF] shadow-none cursor-not-allowed' : 'bg-[#D97757] hover:bg-[#C46849] shadow-[#D97757]/30'}`}
                    >
                        Start de vragen <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    if (phase === 'challenge') {
        const ch = CHALLENGES[currentChallenge];
        return (
            <div className="min-h-screen bg-[#FAF9F0] overflow-y-auto p-4 pb-safe">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => setPhase('compare')} className="text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300"><ArrowLeft size={18} /></button>
                        <div className="flex gap-1.5">{CHALLENGES.map((_, i) => (<div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-300 ${i < currentChallenge ? 'bg-[#10B981]' : i === currentChallenge ? 'bg-gradient-to-r from-[#D97757] to-[#C46849]' : 'bg-[#E8E6DF]'}`} />))}</div>
                        <div className="bg-[#D97757]/10 px-3 py-1 rounded-full border border-[#D97757]/20"><span className="text-xs font-black text-[#D97757]">{score} pts</span></div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E8E6DF] p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-[#D97757] rounded-xl flex items-center justify-center"><Brain size={16} className="text-white" /></div><span className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Vraag {currentChallenge + 1}/{CHALLENGES.length}</span></div>
                        <h3 className="text-lg font-black text-[#1A1A19] leading-snug" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{ch.question}</h3>
                    </div>
                    <div className="space-y-3">
                        {ch.options.map((opt, i) => {
                            const isSelected = selectedAnswer === i;
                            const isCorrect = i === ch.correctIndex;
                            const done = selectedAnswer !== null;
                            let bg = 'bg-white border-[#E8E6DF] hover:border-[#D97757]/40';
                            if (done && isCorrect) bg = 'bg-[#10B981]/5 border-[#10B981]';
                            else if (done && isSelected) bg = 'bg-red-50 border-red-400';
                            else if (done) bg = 'bg-[#F0EEE8] border-[#F0EEE8] opacity-50';
                            return (<button key={i} onClick={() => handleAnswer(i)} disabled={done} className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 ${bg}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black ${done && isCorrect ? 'bg-[#10B981] text-white' : done && isSelected ? 'bg-red-500 text-white' : 'bg-[#F0EEE8] text-[#6B6B66]'}`}>{done && isCorrect ? <Check size={14} /> : done && isSelected ? <X size={14} /> : String.fromCharCode(65 + i)}</div>
                                    <span className="text-sm font-medium text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{opt}</span>
                                </div>
                            </button>);
                        })}
                    </div>
                    {showExplanation && (
                        <div className="mt-6 bg-[#D97757]/5 border border-[#D97757]/20 rounded-2xl p-4">
                            <div className="flex items-start gap-2"><Sparkles size={16} className="text-[#D97757] mt-0.5 flex-shrink-0" /><p className="text-sm text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{ch.explanation}</p></div>
                            <button onClick={nextChallenge} className="w-full mt-4 py-3 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]">{currentChallenge < CHALLENGES.length - 1 ? <>Volgende <ChevronRight size={16} /></> : <>Resultaat <Trophy size={16} /></>}</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const badge = getBadge();
    return (
        <div className="min-h-screen bg-[#FAF9F0] text-[#1A1A19] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 pb-safe">
            <div className="max-w-sm w-full text-center space-y-6">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl`}><span className="text-5xl">{badge.emoji}</span></div>
                <h1 className="text-2xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{badge.title}</h1>
                <p className="text-[#6B6B66] text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{answers.filter(a => a).length}/{CHALLENGES.length} vragen goed</p>
                <div className="bg-white rounded-2xl p-4 border border-[#E8E6DF]">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D97757] to-[#C46849]">{score}/100</div>
                    <p className="text-[#6B6B66] text-xs mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Bubble Score</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-left space-y-2 border border-[#E8E6DF]">
                    <p className="text-xs font-bold text-[#3D3D38] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>3 tips om je bubbel te breken:</p>
                    <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>1. Volg bewust accounts met andere meningen</p>
                    <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>2. Zoek actief naar andere onderwerpen</p>
                    <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>3. Gebruik "Niet geïnteresseerd" bij eenzijdige content</p>
                </div>
                <button onClick={() => { clearSave(); onComplete(true); }} className="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#10B981]"><Trophy size={20} /> Missie Voltooid!</button>
            </div>
            </div>
        </div>
    );
};
