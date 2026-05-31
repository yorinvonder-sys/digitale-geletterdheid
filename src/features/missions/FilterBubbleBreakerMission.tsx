import React, { useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Brain, Sparkles, ArrowLeftRight, Search } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import { MissionGoalBanner } from './templates/shared/MissionGoalBanner';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: any;
    vsoProfile?: any;
}

interface FeedItem { emoji: string; title: string; source: string; engagement: string; category: string; }
interface EvidenceTask { title: string; signal: string; prompt: string; feedback: string; }
type FeedVerdictId = 'A' | 'B' | 'both';
type MissingPerspectiveId = 'climate' | 'world' | 'health';

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

const EVIDENCE_TASKS: EvidenceTask[] = [
    {
        title: 'Profielsignaal',
        signal: 'Daan en Priya openen dezelfde app, maar leeftijd, land en interesses sturen hun startpunt.',
        prompt: 'Pin welk profielsignaal de feed waarschijnlijk verandert.',
        feedback: 'Goed gepind: algoritmes gebruiken contextsignalen om te voorspellen wat iemand wil zien.'
    },
    {
        title: 'Ontbrekend perspectief',
        signal: 'Daan ziet sport, gaming en sneakers, maar geen klimaat, wereldnieuws of technologie.',
        prompt: 'Leg uit welk perspectief ontbreekt en waarom dat zijn wereldbeeld smaller maakt.',
        feedback: 'Sterk bewijs: een bubbel gaat niet alleen over wat je ziet, maar ook over wat onzichtbaar blijft.'
    },
    {
        title: 'Advertentie-route',
        signal: 'De sneakerpost is gesponsord en past precies bij Daans interesses.',
        prompt: 'Pin welk gedrag of datapunt deze advertentie waarschijnlijk triggert.',
        feedback: 'Slim: advertenties zijn ook algoritmische keuzes. Ze kunnen nuttig zijn, maar ook je blik beperken.'
    },
    {
        title: 'Bubbelbreker',
        signal: 'Een feed verandert pas als je bewust andere bronnen, onderwerpen of signalen toevoegt.',
        prompt: 'Bedenk één actie waarmee Daan zijn feed deze week kan testen.',
        feedback: 'Actiegericht: een bubbel doorbreek je door bewust nieuwe signalen aan je feed te geven.'
    },
    {
        title: 'Kans versus risico',
        signal: 'Personalisatie kan handig zijn, maar wordt riskant als je niet merkt dat je perspectieven mist.',
        prompt: 'Schrijf één voordeel én één risico van personalisatie op.',
        feedback: 'Mooi afgewogen: filterbubbels zijn niet alleen slecht, maar je moet ze wel kunnen herkennen.'
    }
];

const FEED_VERDICTS: Array<{
    id: FeedVerdictId;
    label: string;
    description: string;
    feedback: string;
}> = [
    {
        id: 'A',
        label: 'Daan wordt gestuurd',
        description: 'Veel sport, gaming, virals en reclame.',
        feedback: 'Sterk signaal: Daan ziet vooral snelle aandachtstrekkers. Kijk straks ook naar wat hij mist.'
    },
    {
        id: 'B',
        label: 'Priya wordt gestuurd',
        description: 'Veel nieuws, tech, gezondheid en financiën.',
        feedback: 'Goede observatie: ook serieuze content kan een bubbel zijn als andere perspectieven verdwijnen.'
    },
    {
        id: 'both',
        label: 'Allebei in een bubbel',
        description: 'Beide feeds lijken logisch, maar zijn smal.',
        feedback: 'Meest precies: algoritmes sturen beide feeds. Het gevaar zit in wat onzichtbaar blijft.'
    }
];

const MISSING_PERSPECTIVES: Array<{
    id: MissingPerspectiveId;
    label: string;
    clue: string;
    evidence: string;
}> = [
    {
        id: 'climate',
        label: 'Klimaat en wereldnieuws',
        clue: 'Daan ziet sport, gaming en virals, maar geen brede nieuwscontext.',
        evidence: 'Sterk bewijs: dit laat zien dat de feed hem vooral in snelle interesses houdt.'
    },
    {
        id: 'world',
        label: 'Andere landen en culturen',
        clue: 'Priya krijgt internationale bronnen; Daan blijft dicht bij zijn hobby-bubbel.',
        evidence: 'Goed bewijs: een bubbel gaat niet alleen over wat je ziet, maar ook over wie je niet hoort.'
    },
    {
        id: 'health',
        label: 'Gezondheid en reclamekritiek',
        clue: 'Beide feeds bevatten gesponsorde berichten, maar Daan krijgt vooral sneaker-targeting.',
        evidence: 'Slim bewijs: advertenties zijn ook algoritmische keuzes en kunnen je wereld smaller maken.'
    }
];

interface FilterBubbleState {
    phase: 'intro' | 'compare' | 'analyze' | 'challenge' | 'results';
    currentChallenge: number;
    score: number;
    answers: boolean[];
    analyzeResponse: string;
    reflectie: string;
    evidenceNotes?: string[];
    feedVerdict?: FeedVerdictId | null;
    missingPerspective?: MissingPerspectiveId | null;
}

export const FilterBubbleBreakerMission: React.FC<Props> = ({ onBack, onComplete }) => {
    const { state: saved, setState: setSaved, clearSave } = useMissionAutoSave<FilterBubbleState>(
        'filter-bubble-breaker',
        { phase: 'intro', currentChallenge: 0, score: 0, answers: [], analyzeResponse: '', reflectie: '' }
    );
    const phase = saved.phase;
    const currentChallenge = saved.currentChallenge;
    const score = saved.score;
    const answers = saved.answers;
    const evidenceNotes = saved.evidenceNotes ?? [];
    const feedVerdict = saved.feedVerdict ?? null;
    const missingPerspective = saved.missingPerspective ?? null;
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
    const [activeFeed, setActiveFeed] = useState<'A' | 'B' | 'both'>(() =>
        typeof window !== 'undefined' && window.innerWidth < 640 ? 'A' : 'both'
    );
    const selectedFeedVerdict = FEED_VERDICTS.find(option => option.id === feedVerdict);
    const selectedMissingPerspective = MISSING_PERSPECTIVES.find(option => option.id === missingPerspective);

    const nextChallenge = () => {
        if (currentChallenge < EVIDENCE_TASKS.length - 1) setCurrentChallenge(c => c + 1);
        else setPhase('results');
    };

    const setEvidenceNote = (value: string) => {
        setSaved(prev => {
            const notes = [...(prev.evidenceNotes ?? [])];
            notes[currentChallenge] = value;
            return { ...prev, evidenceNotes: notes };
        });
    };

    const submitEvidence = () => {
        const note = (evidenceNotes[currentChallenge] ?? '').trim();
        if (note.length < 12 || answers[currentChallenge] !== undefined) return;
        setAnswers(prev => {
            const next = [...prev];
            next[currentChallenge] = true;
            return next;
        });
        setScore(s => s + 20);
    };

    const getBadge = () => {
        if (score >= 80) return { emoji: '🫧', title: 'Bubble Breaker', color: 'from-[#0B453F] to-[#D97848]' };
        if (score >= 60) return { emoji: '👀', title: 'Bewuste Scroller', color: 'from-[#5F947D] to-[#D97848]' };
        return { emoji: '🌱', title: 'Bubbel Ontdekker', color: 'from-[#5F947D] to-[#5F947D]' };
    };

    const feedFeedback = activeFeed === 'both'
        ? 'Feedback: je vergelijkt twee werelden tegelijk. Let op categorieën, advertenties en wat iemand juist niet ziet.'
        : activeFeed === 'A'
          ? 'Feedback: Daan krijgt vooral sport, gaming en reclame. Vraag je af welk wereldnieuws of ander perspectief ontbreekt.'
          : 'Feedback: Priya krijgt juist nieuws, koken en technologie. Een andere profielset geeft dus een andere werkelijkheid.';

    const renderFeedCard = (item: FeedItem, isB: boolean) => (
        <div key={item.title} className={`p-3 rounded-2xl border transition-all duration-300 hover:shadow-md ${isB ? 'bg-[#0B453F]/5 border-[#0B453F]/20' : 'bg-[#5F947D]/5 border-[#5F947D]/20'}`}>
            <div className="flex items-start gap-2">
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#08283B] leading-tight" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#445865]">{item.source}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${item.engagement === 'Ad' || item.engagement === 'Gesponsord' ? 'bg-[#D97848]/10 text-[#D97848]' : 'bg-[#E7D8BD] text-[#445865]'}`}>{item.engagement}</span>
                    </div>
                    <span className={`inline-flex mt-1 text-[8px] px-2 py-0.5 rounded-full font-bold border ${isB ? 'bg-[#0B453F]/10 text-[#0B453F] border-[#0B453F]/20' : 'bg-[#5F947D]/10 text-[#5F947D] border-[#5F947D]/20'}`}>{item.category}</span>
                </div>
            </div>
        </div>
    );

    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-[#FCF6EA] text-[#08283B] overflow-y-auto p-4 pb-safe">
                <button onClick={onBack} className="flex items-center gap-2 text-[#445865] hover:text-[#08283B] transition-all duration-300 mb-6"><ArrowLeft size={18} /> <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Terug</span></button>
                <div className="max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-[#0B453F]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#0B453F]/20 animate-bounce"><span className="text-4xl">🫧</span></div>
                    <h1 className="text-3xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Filter Bubble Breaker</h1>
                    <p className="text-[#445865] text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Twee mensen openen dezelfde app — maar zien <span className="text-[#D97848] font-bold">totaal andere content</span>. Jouw missie: onderzoek welke bubbel-score hun feed krijgt.</p>
                    <MissionGoalBanner goal={getMissionGoal('filter-bubble-breaker')!} compact />
                    <div className="flex gap-4 justify-center">
                        <div className="bg-[#5F947D]/10 border border-[#5F947D]/20 rounded-2xl p-4 text-center w-36">
                            <span className="text-2xl">{PROFILE_A.emoji}</span>
                            <p className="text-sm font-black mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{PROFILE_A.name}</p>
                            <p className="text-[10px] text-[#5F947D]">{PROFILE_A.age} jaar, {PROFILE_A.country}</p>
                            <div className="flex flex-wrap gap-1 justify-center mt-2">{PROFILE_A.interests.map(i => <span key={i} className="text-[8px] bg-[#5F947D]/15 text-[#5F947D] px-1.5 py-0.5 rounded-full border border-[#5F947D]/20">{i}</span>)}</div>
                        </div>
                        <div className="flex items-center"><ArrowLeftRight size={24} className="text-[#E7D8BD]" /></div>
                        <div className="bg-[#0B453F]/10 border border-[#0B453F]/20 rounded-2xl p-4 text-center w-36">
                            <span className="text-2xl">{PROFILE_B.emoji}</span>
                            <p className="text-sm font-black mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{PROFILE_B.name}</p>
                            <p className="text-[10px] text-[#0B453F]">{PROFILE_B.age} jaar, {PROFILE_B.country}</p>
                            <div className="flex flex-wrap gap-1 justify-center mt-2">{PROFILE_B.interests.map(i => <span key={i} className="text-[8px] bg-[#0B453F]/15 text-[#0B453F] px-1.5 py-0.5 rounded-full border border-[#0B453F]/20">{i}</span>)}</div>
                        </div>
                    </div>
                    <button onClick={() => setPhase('compare')} className="px-8 py-4 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97848]/30 focus-visible:ring-2 focus-visible:ring-[#D97848]">Onderzoek hun feeds →</button>
                </div>
            </div>
        );
    }

    if (phase === 'compare') {
        return (
            <div className="min-h-dvh overflow-hidden bg-[#FCF6EA] p-3 pb-24 sm:p-4 sm:pb-4">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => setPhase('intro')} className="flex items-center gap-2 text-[#445865] hover:text-[#08283B] transition-all duration-300 mb-4"><ArrowLeft size={18} /> <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Terug</span></button>
                    <div className="text-center mb-3 sm:mb-6">
                        <h2 className="text-xl font-black text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Vergelijk de feeds</h2>
                        <p className="text-sm text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Dezelfde app, totaal andere content. Spot de verschillen!</p>
                    </div>
                    <div className="mb-3 flex max-w-sm rounded-full bg-[#E7D8BD] p-1 sm:mx-auto sm:mb-4">
                        {(['both', 'A', 'B'] as const).map(f => (
                            <button key={f} onClick={() => setActiveFeed(f)} className={`flex-1 py-2 rounded-full text-xs font-black transition-all duration-300 ${activeFeed === f ? 'bg-white shadow-md text-[#08283B]' : 'text-[#445865]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {f === 'both' ? '🔀 Beide' : f === 'A' ? `${PROFILE_A.emoji} ${PROFILE_A.name}` : `${PROFILE_B.emoji} ${PROFILE_B.name}`}
                            </button>
                        ))}
                    </div>
                    <div className="mb-3 rounded-2xl border border-[#D97848]/20 bg-[#D97848]/8 p-3">
                        <p className="text-xs font-bold leading-snug text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {feedFeedback}
                        </p>
                        <p className="mt-1 text-[11px] leading-snug text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Bubbel-score: je verdient 1 inzichtpunt als je ziet welk perspectief ontbreekt.
                        </p>
                        <p className="mt-1 text-[11px] leading-snug text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Volgende stap: kies welke informatie ontbreekt en leg uit waarom dat belangrijk is.
                        </p>
                    </div>
                    <div className="mb-3 rounded-2xl border border-[#E7D8BD] bg-white p-3" data-qa="filter-feed-split-challenge">
                        <p className="text-xs font-black text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Eerste call: welke feed wordt het sterkst gestuurd door het algoritme?
                        </p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                            {FEED_VERDICTS.map(option => {
                                const selected = feedVerdict === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setSaved(prev => ({ ...prev, feedVerdict: option.id }))}
                                        aria-pressed={selected}
                                        data-qa={`filter-feed-verdict-${option.id}`}
                                        className={`min-h-[92px] rounded-xl border p-3 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#D97848] ${selected ? 'border-[#D97848] bg-[#D97848]/10' : 'border-[#E7D8BD] bg-[#FFFDF7] hover:border-[#D97848]/40'}`}
                                    >
                                        <span className="block text-xs font-black text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{option.label}</span>
                                        <span className="mt-1 block text-[11px] font-semibold leading-snug text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{option.description}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {selectedFeedVerdict && (
                            <div className="mt-3 rounded-xl border border-[#5F947D]/25 bg-[#5F947D]/10 p-3 text-xs font-bold leading-snug text-[#08283B]" data-qa="filter-feed-verdict-feedback" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {selectedFeedVerdict.feedback}
                            </div>
                        )}
                    </div>
                    <div className={`grid max-h-[calc(100dvh-250px)] gap-3 overflow-hidden ${activeFeed === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'}`}>
                        {(activeFeed === 'both' || activeFeed === 'A') && (
                            <div>
                                <div className="flex items-center gap-2 mb-3 bg-[#5F947D]/10 border border-[#5F947D]/20 px-3 py-2 rounded-full"><span>{PROFILE_A.emoji}</span><span className="text-xs font-black text-[#5F947D]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Feed van {PROFILE_A.name}</span></div>
                                <div className="space-y-2">{FEED_A.map(item => renderFeedCard(item, false))}</div>
                            </div>
                        )}
                        {(activeFeed === 'both' || activeFeed === 'B') && (
                            <div>
                                <div className="flex items-center gap-2 mb-3 bg-[#0B453F]/10 border border-[#0B453F]/20 px-3 py-2 rounded-full"><span>{PROFILE_B.emoji}</span><span className="text-xs font-black text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Feed van {PROFILE_B.name}</span></div>
                                <div className="space-y-2">{FEED_B.map(item => renderFeedCard(item, true))}</div>
                            </div>
                        )}
                    </div>
                    <div className="fixed inset-x-4 bottom-4 z-30 text-center sm:static sm:mt-6">
                        <button
                            onClick={() => setPhase('analyze')}
                            disabled={!feedVerdict}
                            className={`w-full max-w-sm rounded-full px-8 py-4 font-black shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848] active:scale-95 sm:w-auto ${feedVerdict ? 'bg-[#D97848] text-white hover:bg-[#D97848]' : 'cursor-not-allowed bg-[#E7D8BD] text-[#445865] shadow-none'}`}
                        >
                            {feedVerdict ? 'Ga dieper analyseren →' : 'Kies eerst een feed-signaal'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'analyze') {
        const analyzeResponse = saved.analyzeResponse;
        const setAnalyzeResponse = (val: string) => setSaved(prev => ({ ...prev, analyzeResponse: val }));
        const canStartChallenge = Boolean(missingPerspective) && analyzeResponse.trim().length >= 10;
        return (
            <div className="min-h-screen bg-[#FCF6EA] overflow-y-auto p-4 pb-safe">
                <div className="max-w-lg mx-auto space-y-6">
                    <button onClick={() => setPhase('compare')} className="flex items-center gap-2 text-[#445865] hover:text-[#08283B] transition-all duration-300"><ArrowLeft size={18} /> <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Terug</span></button>

                    <div className="bg-white rounded-2xl shadow-xl border border-[#E7D8BD] p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-[#0B453F]/10 rounded-xl flex items-center justify-center mx-auto border border-[#0B453F]/20">
                            <Search size={24} className="text-[#0B453F]" />
                        </div>
                        <h2 className="text-xl font-black text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Analyseer de bubbel</h2>
                        <p className="text-sm text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Pin eerst <span className="font-black text-[#D97848]">1 ontbrekend perspectief</span> uit {PROFILE_A.name}s feed.
                            Leg daarna in 1-2 zinnen uit waarom dit belangrijk is om te weten.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E7D8BD] bg-white p-4 shadow-sm" data-qa="filter-missing-perspective-panel">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Bewijs pinnen</p>
                                <p className="text-sm font-black text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Wat blijft buiten beeld?</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-[10px] font-black ${missingPerspective ? 'bg-[#5F947D]/10 text-[#5F947D]' : 'bg-[#D97848]/10 text-[#D97848]'}`}>
                                {missingPerspective ? 'Gepind' : 'Kies bewijs'}
                            </span>
                        </div>
                        <div className="grid gap-2">
                            {MISSING_PERSPECTIVES.map(option => {
                                const selected = missingPerspective === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setSaved(prev => ({ ...prev, missingPerspective: option.id }))}
                                        aria-pressed={selected}
                                        data-qa={`filter-missing-perspective-${option.id}`}
                                        className={`rounded-xl border p-3 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#D97848] ${selected ? 'border-[#D97848] bg-[#D97848]/10 shadow-md' : 'border-[#E7D8BD] bg-[#FFFDF7] hover:border-[#D97848]/40'}`}
                                    >
                                        <span className="block text-sm font-black text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{option.label}</span>
                                        <span className="mt-1 block text-xs font-semibold leading-snug text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{option.clue}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {selectedMissingPerspective && (
                            <div className="mt-3 rounded-xl border border-[#5F947D]/25 bg-[#5F947D]/10 p-3 text-xs font-bold leading-snug text-[#08283B]" data-qa="filter-missing-perspective-feedback" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {selectedMissingPerspective.evidence}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-[#445865] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Ter herinnering: {PROFILE_A.name} ziet alleen</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {FEED_A.map(item => (
                                <span key={item.title} className="text-[10px] bg-[#5F947D]/10 text-[#5F947D] px-2 py-1 rounded-full border border-[#5F947D]/20 font-bold">{item.category}</span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Jouw analyse:</label>
                        <textarea
                            value={analyzeResponse}
                            onChange={e => setAnalyzeResponse(e.target.value)}
                            placeholder={selectedMissingPerspective ? `Bijv: ${selectedMissingPerspective.label} ontbreekt. Dit is belangrijk omdat...` : 'Pin eerst bewijs, schrijf daarna je analyse.'}
                            className="w-full p-4 rounded-2xl border-2 border-[#E7D8BD] bg-white text-sm text-[#08283B] placeholder-[#E7D8BD] focus:border-[#0B453F] focus:outline-none transition-all duration-300 resize-none"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif", minHeight: '120px' }}
                        />
                        <p className="text-[10px] text-[#445865] text-right" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{analyzeResponse.length} tekens</p>
                    </div>

                    <button
                        onClick={() => setPhase('challenge')}
                        disabled={!canStartChallenge}
                        data-qa="filter-start-evidence-check"
                        className={`w-full py-4 rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97848] ${!canStartChallenge ? 'bg-[#E7D8BD] text-[#445865] shadow-none cursor-not-allowed' : 'bg-[#D97848] text-white hover:bg-[#D97848] shadow-[#D97848]/30'}`}
                    >
                        Start bewijscheck <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    if (phase === 'challenge') {
        const task = EVIDENCE_TASKS[currentChallenge];
        const currentEvidenceNote = evidenceNotes[currentChallenge] ?? '';
        const evidenceSubmitted = answers[currentChallenge] !== undefined;
        const canPinEvidence = currentEvidenceNote.trim().length >= 12;
        return (
            <div className="min-h-screen bg-[#FCF6EA] overflow-y-auto p-4 pb-safe">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => setPhase('compare')} className="text-[#445865] hover:text-[#08283B] transition-all duration-300"><ArrowLeft size={18} /></button>
                        <div className="flex gap-1.5">{EVIDENCE_TASKS.map((_, i) => (<div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-300 ${i < currentChallenge ? 'bg-[#5F947D]' : i === currentChallenge ? 'bg-gradient-to-r from-[#D97848] to-[#D97848]' : 'bg-[#E7D8BD]'}`} />))}</div>
                        <div className="bg-[#D97848]/10 px-3 py-1 rounded-full border border-[#D97848]/20"><span className="text-xs font-black text-[#D97848]">{score} pts</span></div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E7D8BD] p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-[#D97848] rounded-xl flex items-center justify-center"><Brain size={16} className="text-white" /></div>
                            <span className="text-[10px] font-black text-[#445865] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Bewijskaart {currentChallenge + 1}/{EVIDENCE_TASKS.length}</span>
                        </div>
                        <h3 className="text-lg font-black text-[#08283B] leading-snug" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{task.title}</h3>
                        <p className="mt-3 rounded-2xl border border-[#D97848]/20 bg-[#D97848]/8 p-4 text-sm font-bold leading-relaxed text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{task.signal}</p>
                    </div>
                    <div className="rounded-2xl border border-[#E7D8BD] bg-white p-4 shadow-sm">
                        <label className="text-xs font-black uppercase tracking-widest text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {task.prompt}
                        </label>
                        <textarea
                            value={currentEvidenceNote}
                            onChange={event => setEvidenceNote(event.target.value)}
                            disabled={evidenceSubmitted}
                            data-qa="filter-evidence-note"
                            placeholder="Schrijf je bewijs in 1 korte zin."
                            className="mt-3 w-full rounded-2xl border-2 border-[#E7D8BD] bg-[#FCF6EA] p-4 text-sm text-[#08283B] placeholder-[#BCA989] transition-all duration-300 resize-none focus:border-[#0B453F] focus:outline-none disabled:opacity-80"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif", minHeight: '120px' }}
                        />
                        <p className="mt-2 text-right text-[10px] text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{currentEvidenceNote.length} tekens</p>
                        <button
                            type="button"
                            onClick={submitEvidence}
                            disabled={!canPinEvidence || evidenceSubmitted}
                            data-qa="filter-pin-evidence"
                            className={`mt-3 w-full rounded-full py-3 text-sm font-black transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848] ${canPinEvidence && !evidenceSubmitted ? 'bg-[#D97848] text-white shadow-lg shadow-[#D97848]/25 active:scale-95' : 'cursor-not-allowed bg-[#E7D8BD] text-[#445865]'}`}
                        >
                            {evidenceSubmitted ? 'Bewijs gepind' : 'Pin bewijs'}
                        </button>
                    </div>
                    {evidenceSubmitted && (
                        <div className="mt-6 bg-[#D97848]/5 border border-[#D97848]/20 rounded-2xl p-4">
                            <div className="flex items-start gap-2">
                                <Sparkles size={16} className="text-[#D97848] mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    <p className="font-black text-[#D97848]">Feedback</p>
                                    <p>{task.feedback}</p>
                                    <p className="mt-2 font-black text-[#D97848]">Waarom maakt dit uit?</p>
                                    <p>Je koppelt nu een zichtbaar feed-signaal aan een gevolg. Dat is sterker bewijs dan een losse kennisvraag.</p>
                                    <p className="mt-2 font-black text-[#D97848]">Volgende stap</p>
                                    <p>Gebruik dit signaal straks om je eigen feed bewuster te sturen.</p>
                                </div>
                            </div>
                            <button onClick={nextChallenge} className="w-full mt-4 py-3 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]">{currentChallenge < EVIDENCE_TASKS.length - 1 ? <>Volgende bewijskaart <ChevronRight size={16} /></> : <>Resultaat <Trophy size={16} /></>}</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const badge = getBadge();
    return (
        <div className="min-h-screen bg-[#FCF6EA] text-[#08283B] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 pb-safe">
            <div className="max-w-sm w-full text-center space-y-6">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl`}><span className="text-5xl">{badge.emoji}</span></div>
                <h1 className="text-2xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{badge.title}</h1>
                <p className="text-[#445865] text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{answers.filter(a => a).length}/{EVIDENCE_TASKS.length} bewijschecks gepind</p>
                <div className="bg-white rounded-2xl p-4 border border-[#E7D8BD]">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D97848] to-[#D97848]">{score}/100</div>
                    <p className="text-[#445865] text-xs mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Bubbel Lab Score</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-left space-y-2 border border-[#E7D8BD]">
                    <p className="text-xs font-black text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Gepind bewijs: {selectedMissingPerspective?.label ?? 'Ontbrekend perspectief'}</p>
                    <p className="text-xs text-[#445865] pb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{saved.analyzeResponse}</p>
                    <p className="text-xs font-bold text-[#445865] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>3 tips om je bubbel te breken:</p>
                    <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>1. Volg bewust accounts met andere meningen</p>
                    <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>2. Zoek actief naar andere onderwerpen</p>
                    <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>3. Gebruik "Niet geïnteresseerd" bij eenzijdige content</p>
                </div>
                {/* Reflectie */}
                <div className="bg-white rounded-2xl p-4 border border-[#0B453F]/20 text-left space-y-3">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-[#0B453F]" />
                        <p className="text-xs font-black uppercase tracking-widest text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Reflectie</p>
                    </div>
                    <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Wat heb je geleerd in deze missie? Waar zou je dit in het dagelijks leven tegenkomen?</p>
                    <textarea
                        value={saved.reflectie}
                        onChange={e => setSaved(prev => ({ ...prev, reflectie: e.target.value }))}
                        placeholder="Wat heb je geleerd? Waar kom je dit nog meer tegen?"
                        className="w-full p-3 rounded-xl border-2 border-[#E7D8BD] bg-[#FCF6EA] text-sm resize-none focus:border-[#0B453F] focus:outline-none transition-all duration-300"
                        style={{ minHeight: '80px', fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                </div>
                <button onClick={() => { clearSave(); onComplete(true); }} disabled={saved.reflectie.trim().length < 10} className={`w-full py-4 rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#5F947D] ${saved.reflectie.trim().length < 10 ? 'bg-[#E7D8BD] text-[#445865] shadow-none cursor-not-allowed' : 'bg-[#5F947D] text-white hover:bg-[#5F947D]'}`}><Trophy size={20} /> Missie Voltooid!</button>
            </div>
            </div>
        </div>
    );
};
