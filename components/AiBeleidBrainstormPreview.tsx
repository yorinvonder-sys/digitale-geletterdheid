import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Lightbulb, AlertTriangle, ShieldCheck, Sparkles, ThumbsUp, Send, ChevronRight, Trophy, ArrowLeft, CheckCircle2, Users, XCircle } from 'lucide-react';
import { submitAiBeleidIdee, getAiBeleidIdeeen, stemOpIdee, submitAiBeleidSurvey, AiBeleidSurveyData } from '../services/teacherService';
import { AiBeleidIdee } from '../types';
import { MissionConclusion } from './MissionConclusion';

// =====================================================================
// CONTENT FILTER - Block inappropriate content
// =====================================================================
const BLOCKED_WORDS = [
    // Geweld / gevaar
    'fik', 'brand', 'opblazen', 'explosie', 'bom', 'wapen', 'dood', 'moord', 'vermoord', 'slachten',
    'aanslag', 'terroris', 'geweld', 'schieten', 'schiet', 'afmaken', 'pijn', 'martelen', 'slaan',
    // Scheldwoorden
    'kanker', 'kut', 'fuck', 'shit', 'pik', 'lul', 'hoer', 'slet', 'bitch', 'dick', 'cock',
    'kech', 'kansen', 'homo', 'flikker', 'mongool', 'debiel', 'idioot', 'achterlijk', 'retard',
    // Ongewenst schoolgedrag
    'spijbelen', 'stelen', 'hacken', 'inbreken', 'fraude', 'vals', 'schade', 'verniel',
    // Drugs/alcohol voor minderjarigen
    'drugs', 'wiet', 'coke', 'cocaine', 'mdma', 'xtc', 'drank', 'zuipen', 'dronken', 'joint',
    // Overig ongepast
    'naakt', 'seks', 'porn', 'xxx', 'nsfw', 'naked', 'nude'
];

const BLOCKED_PHRASES = [
    'in de fik', 'in brand', 'laten ontploffen', 'naar de klote', 'kapot maken',
    'iedereen dood', 'school opblazen', 'leraren vermoorden', 'docenten slaan',
    'ai mensen doden', 'ai wapens', 'ai aanval'
];

/**
 * Check if text contains inappropriate content
 * Returns a reason string if blocked, null if OK
 */
const checkContentFilter = (text: string): string | null => {
    const lowerText = text.toLowerCase().replace(/[^a-z0-9\s]/g, ''); // Remove special chars

    // Check blocked phrases first (more specific)
    for (const phrase of BLOCKED_PHRASES) {
        if (lowerText.includes(phrase)) {
            return 'ongepaste taal of inhoud';
        }
    }

    // Check individual blocked words
    for (const word of BLOCKED_WORDS) {
        // Word boundary check - the word must be a separate word or at word boundaries
        const regex = new RegExp(`\\b${word}`, 'i');
        if (regex.test(lowerText)) {
            return 'ongepaste taal';
        }
    }

    return null; // Content is OK
};

/**
 * Filter an array of ideas to remove inappropriate ones
 */
const filterInappropriateIdeas = (ideas: AiBeleidIdee[]): AiBeleidIdee[] => {
    return ideas.filter(idea => checkContentFilter(idea.idee) === null);
};

interface AiBeleidBrainstormPreviewProps {
    user?: {
        uid: string;
        displayName: string | null;
        studentClass?: string;
        schoolId?: string;
    };
    onComplete?: () => void;
}

const CATEGORIES = [
    {
        id: 'regels' as const,
        label: 'Regels',
        description: 'Wat mag wel/niet met AI?',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: ShieldCheck,
        prompt: 'Welke regels moeten er zijn voor AI op school?'
    },
    {
        id: 'mogelijkheden' as const,
        label: 'Mogelijkheden',
        description: 'Hoe kan AI helpen?',
        color: 'from-emerald-500 to-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        icon: Lightbulb,
        prompt: 'Hoe zou AI kunnen helpen bij leren?'
    },
    {
        id: 'zorgen' as const,
        label: 'Zorgen',
        description: 'Waar maak je je zorgen over?',
        color: 'from-amber-500 to-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: AlertTriangle,
        prompt: 'Welke risicos zie je bij AI gebruik?'
    },
    {
        id: 'suggesties' as const,
        label: 'Suggesties',
        description: 'Ideeën voor de school',
        color: 'from-violet-500 to-violet-600',
        bgColor: 'bg-violet-50',
        borderColor: 'border-violet-200',
        icon: Sparkles,
        prompt: 'Welke concrete suggesties heb je?'
    }
];

type Phase = 'survey' | 'intro' | 'categories' | 'submit' | 'browse' | 'complete';

export const AiBeleidBrainstormPreview: React.FC<AiBeleidBrainstormPreviewProps> = ({ user, onComplete }) => {
    // Check if user already participated - if so, skip to browse
    const hasParticipatedKey = user ? `ai_beleid_participated_${user.uid}` : null;
    const hasParticipated = hasParticipatedKey ? localStorage.getItem(hasParticipatedKey) === 'true' : false;

    const [phase, setPhase] = useState<Phase>(hasParticipated ? 'browse' : 'intro');

    // Survey State
    const [surveyData, setSurveyData] = useState<Omit<AiBeleidSurveyData, 'uid' | 'studentName' | 'studentClass' | 'timestamp'>>({
        freqUse: '',
        purpose: '',
        useful: '',
        missing: ''
    });
    const [surveySubmitting, setSurveySubmitting] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
    const [ideeText, setIdeeText] = useState('');
    const [ideeen, setIdeeen] = useState<AiBeleidIdee[]>([]);
    const [myIdeeen, setMyIdeeen] = useState<AiBeleidIdee[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
    const [showSuccess, setShowSuccess] = useState(false);
    const [contentError, setContentError] = useState<string | null>(null);

    // Load existing ideas
    useEffect(() => {
        if (phase === 'browse' || phase === 'categories') {
            loadIdeeen();
        }
    }, [phase]);

    const loadIdeeen = async () => {
        setLoading(true);
        const result = await getAiBeleidIdeeen(undefined, user?.schoolId);
        // Filter out inappropriate content before displaying
        const filteredResult = filterInappropriateIdeas(result);
        setIdeeen(filteredResult);
        if (user) {
            setMyIdeeen(filteredResult.filter(i => i.uid === user.uid));
            // Initialize votedIds from server data - find all ideas this user already voted on
            const alreadyVoted = new Set<string>();
            filteredResult.forEach(idee => {
                if (idee.gestemdeUids?.includes(user.uid)) {
                    alreadyVoted.add(idee.id!);
                }
            });
            setVotedIds(alreadyVoted);
        }
        setLoading(false);
    };

    const handleSubmitIdee = async () => {
        if (!ideeText.trim() || !selectedCategory || !user) return;

        // Content filter check
        const filterResult = checkContentFilter(ideeText);
        if (filterResult) {
            setContentError(`Je idee bevat ${filterResult}. Probeer het anders te formuleren.`);
            return;
        }
        setContentError(null);

        setSubmitting(true);
        const id = await submitAiBeleidIdee({
            uid: user.uid,
            studentName: user.displayName || 'Anoniem',
            studentClass: user.studentClass,
            schoolId: user.schoolId,
            categorie: selectedCategory.id,
            idee: ideeText.trim()
        });

        if (id) {
            setShowSuccess(true);
            setIdeeText('');
            // Mark as participated in localStorage so next time they skip to browse
            if (hasParticipatedKey) {
                localStorage.setItem(hasParticipatedKey, 'true');
            }
            await loadIdeeen();
            setTimeout(() => {
                setShowSuccess(false);
                setPhase('browse');
            }, 2000); // Increased from 1500 to 2000 for clearer feedback
        }
        setSubmitting(false);
    };

    const handleVote = async (ideeId: string) => {
        if (!user || votedIds.has(ideeId)) return;

        const success = await stemOpIdee(ideeId, user.uid);
        if (success) {
            setVotedIds(prev => new Set([...prev, ideeId]));
            // Optimistic update
            setIdeeen(prev => prev.map(i =>
                i.id === ideeId ? { ...i, stemmen: (i.stemmen || 0) + 1 } : i
            ));
        }
    };

    const getCategoryById = (id: string) => CATEGORIES.find(c => c.id === id);

    const handleSurveySubmit = async () => {
        if (!user) return;
        setSurveySubmitting(true);
        try {
            await submitAiBeleidSurvey({
                uid: user.uid,
                studentName: user.displayName || 'Anoniem',
                studentClass: user.studentClass,
                ...surveyData
            });
            setPhase('categories');
        } catch (error) {
            console.error("Survey submission failed", error);
        } finally {
            setSurveySubmitting(false);
        }
    };

    // Survey Phase (Now SECOND, after intro)
    if (phase === 'survey') {
        return (
            <div className="min-h-full h-full overflow-y-auto bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex flex-col items-center p-6 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-8 shadow-2xl border border-indigo-100 max-w-2xl w-full"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                            <Users size={32} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Eerst even dit...</h1>
                        <p className="text-slate-500">We zijn benieuwd hoe jij AI gebruikt! Deze gegevens worden <span className="font-bold text-indigo-600">anoniem</span> verwerkt.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Question 1 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">
                                1. Hoe vaak gebruik jij AI voor school?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Nooit', 'Soms (1x per maand)', 'Regelmatig (wekelijks)', 'Vaak (dagelijks)'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setSurveyData(prev => ({ ...prev, freqUse: option }))}
                                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${surveyData.freqUse === option
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-600'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question 2 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                2. Waar gebruik je dit voor?
                            </label>
                            <input
                                type="text"
                                placeholder="Bijv. tekst samenvatten, ideeën bedenken..."
                                value={surveyData.purpose}
                                onChange={e => setSurveyData(prev => ({ ...prev, purpose: e.target.value }))}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>

                        {/* Question 3 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                3. Wat vind je er handig aan?
                            </label>
                            <input
                                type="text"
                                placeholder="Bijv. het gaat sneller, het helpt bij..."
                                value={surveyData.useful}
                                onChange={e => setSurveyData(prev => ({ ...prev, useful: e.target.value }))}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>

                        {/* Question 4 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                4. Wat vind jij dat er nog ontbreekt op school wat betreft AI?
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Bijv. meer uitleg, betere tools..."
                                value={surveyData.missing}
                                onChange={e => setSurveyData(prev => ({ ...prev, missing: e.target.value }))}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleSurveySubmit}
                            disabled={!surveyData.freqUse || !surveyData.purpose || surveySubmitting}
                            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {surveySubmitting ? (
                                <>Versturen...</>
                            ) : (
                                <>
                                    Ga Verder
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Intro Phase (Now FIRST)
    if (phase === 'intro') {
        return (
            <div className="min-h-full bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-6 mx-auto">
                        <Scale className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3">AI Beleid Brainstorm</h1>
                    <p className="text-slate-600 max-w-md mx-auto text-lg">
                        Jouw mening telt! Help mee met het vormgeven van de AI-regels op school.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 max-w-lg w-full mb-8"
                >
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-indigo-500" />
                        Hoe werkt het?
                    </h3>
                    <ul className="text-left space-y-3 text-slate-600">
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</span>
                            <span>Eerst vullen we een korte enquête in over jouw AI-gebruik</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</span>
                            <span>Kies een categorie en deel jouw idee of mening</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">3</span>
                            <span>Bekijk ideeën van anderen en stem op de beste!</span>
                        </li>
                    </ul>
                </motion.div>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setPhase('survey')}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                    Start de Enquête
                    <ChevronRight size={24} />
                </motion.button>
            </div>
        );
    }

    // Survey Phase (Now SECOND)
    if (phase === 'categories') {
        return (
            <div className="min-h-full bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Kies een Categorie</h2>
                    <p className="text-slate-500 text-center mb-8">Waar wil je over nadenken?</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {CATEGORIES.map((cat, idx) => (
                            <motion.button
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setPhase('submit');
                                }}
                                className={`${cat.bgColor} ${cat.borderColor} border-2 rounded-2xl p-6 text-left hover:scale-[1.02] transition-all group`}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    <cat.icon size={24} />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{cat.label}</h3>
                                <p className="text-slate-600 text-sm">{cat.description}</p>
                            </motion.button>
                        ))}
                    </div>

                    {myIdeeen.length > 0 && (
                        <div className="text-center">
                            <button
                                onClick={() => setPhase('browse')}
                                className="text-indigo-600 font-bold hover:underline flex items-center gap-2 mx-auto"
                            >
                                Bekijk alle ideeën ({ideeen.length})
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Submit Phase
    if (phase === 'submit' && selectedCategory) {
        return (
            <div className="min-h-full bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6">
                <div className="max-w-lg mx-auto">
                    <button
                        onClick={() => setPhase('categories')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 font-medium"
                    >
                        <ArrowLeft size={18} />
                        Terug naar categorieën
                    </button>

                    <div className={`${selectedCategory.bgColor} ${selectedCategory.borderColor} border-2 rounded-2xl p-6 mb-6`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                <selectedCategory.icon size={28} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-xl">{selectedCategory.label}</h3>
                                <p className="text-slate-600">{selectedCategory.prompt}</p>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {showSuccess ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center"
                            >
                                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-emerald-700">Idee Ingediend!</h3>
                                <p className="text-emerald-600">Bedankt voor je bijdrage 🎉</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100"
                            >
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Jouw idee
                                </label>
                                <textarea
                                    value={ideeText}
                                    onChange={(e) => {
                                        setIdeeText(e.target.value.slice(0, 280));
                                        if (contentError) setContentError(null); // Clear error on typing
                                    }}
                                    placeholder="Schrijf hier je gedachte, regel of suggestie..."
                                    className={`w-full h-32 p-4 border-2 rounded-xl focus:ring-2 outline-none resize-none text-slate-700 transition-colors ${contentError
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                                        }`}
                                />

                                {/* Content Error Message */}
                                {contentError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                                    >
                                        <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                        <p className="text-red-600 text-sm font-medium">{contentError}</p>
                                    </motion.div>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                    <span className={`text-sm font-medium ${ideeText.length >= 250 ? 'text-amber-500' : 'text-slate-400'}`}>
                                        {ideeText.length}/280
                                    </span>
                                    <button
                                        onClick={handleSubmitIdee}
                                        disabled={!ideeText.trim() || submitting}
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Bezig...
                                            </>
                                        ) : (
                                            <>
                                                Indienen
                                                <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    // Browse Phase
    if (phase === 'browse') {
        const sortedIdeeen = [...ideeen].sort((a, b) => (b.stemmen || 0) - (a.stemmen || 0));
        const topThree = sortedIdeeen.slice(0, 3);

        return (
            <div className="min-h-full bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setPhase('categories')}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium"
                        >
                            <ArrowLeft size={18} />
                            Nieuw idee
                        </button>
                        <button
                            onClick={() => setPhase('complete')}
                            className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                        >
                            Afronden ✓
                        </button>
                    </div>

                    {/* Top 3 Leaderboard */}
                    {topThree.length > 0 && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-amber-200">
                            <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-4">
                                <Trophy className="text-amber-500" size={20} />
                                Top Ideeën
                            </h3>
                            <div className="space-y-3">
                                {topThree.map((idee, idx) => {
                                    const cat = getCategoryById(idee.categorie);
                                    return (
                                        <div key={idee.id} className="flex items-center gap-3 bg-white/80 rounded-xl p-3">
                                            <span className={`w-8 h-8 flex items-center justify-center font-black text-lg ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : 'text-amber-700'
                                                }`}>
                                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-700 font-medium truncate">{idee.idee}</p>
                                                <span className="text-xs text-slate-400">{cat?.label}</span>
                                            </div>
                                            <span className="text-amber-600 font-bold flex items-center gap-1">
                                                <ThumbsUp size={14} /> {idee.stemmen || 0}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* All Ideas */}
                    <h3 className="font-bold text-slate-900 mb-4">Alle Ideeën ({ideeen.length})</h3>

                    {loading ? (
                        <div className="text-center py-12 text-slate-400">Laden...</div>
                    ) : ideeen.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                            Nog geen ideeën. Wees de eerste!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ideeen.map((idee) => {
                                const cat = getCategoryById(idee.categorie);
                                const hasVoted = votedIds.has(idee.id!) || idee.gestemdeUids?.includes(user?.uid || '');

                                return (
                                    <motion.div
                                        key={idee.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`bg-white rounded-xl p-4 border-2 ${cat?.borderColor || 'border-slate-200'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 bg-gradient-to-br ${cat?.color || 'from-slate-400 to-slate-500'} rounded-lg flex items-center justify-center text-white shrink-0`}>
                                                {cat && <cat.icon size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-700 mb-2">{idee.idee}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <span>{cat?.label}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleVote(idee.id!)}
                                                disabled={hasVoted}
                                                className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold transition-all ${hasVoted
                                                    ? 'bg-indigo-100 text-indigo-500'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600'
                                                    }`}
                                            >
                                                <ThumbsUp size={16} />
                                                {idee.stemmen || 0}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Complete Phase
    if (phase === 'complete') {
        return (
            <MissionConclusion
                title="Brainstorm Voltooid!"
                description={`Je hebt ${myIdeeen.length} idee${myIdeeen.length !== 1 ? 'ën' : ''} gedeeld en ${votedIds.size} keer gestemd. Bedankt voor je bijdrage aan het AI-beleid van de school!`}
                aiConcept={{
                    title: "Democratische AI Besluitvorming",
                    text: "Door leerlingen te betrekken bij AI-beleid, wordt het beleid gedragen door de hele schoolgemeenschap. Jouw stem en ideeën helpen de school om AI op een eerlijke en nuttige manier in te zetten."
                }}
                onExit={onComplete || (() => { })}
            />
        );
    }

    return null;
};

export default AiBeleidBrainstormPreview;
