
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Bot, Sparkles, CheckCircle2, Plus, Trash2, ArrowRight, ArrowLeft, Loader2, Target, MessageCircle, AlertCircle, HelpCircle, Pencil, Play, Trophy, Share } from 'lucide-react';
import { MissionConclusion } from '@/features/missions/shared/MissionConclusion';
import { shareProject } from '@/services/missionService';
import { ShareModal } from '@/components/app-shell/ShareModal';

const CHATBOT_THEME_VARS = {
    '--chatbot-bg': '#F4FAF8',
    '--chatbot-surface': '#FFFFFF',
    '--chatbot-soft': '#E7F3EE',
    '--chatbot-warm': '#FFF7E2',
    '--chatbot-field': '#F8FCFB',
    '--chatbot-line': '#CFE2DA',
    '--chatbot-ink': '#102A43',
    '--chatbot-muted': '#4B6475',
    '--chatbot-primary': '#256D85',
    '--chatbot-primary-strong': '#164E63',
    '--chatbot-success': '#5F947D',
    '--chatbot-accent': '#D7C95F',
} as React.CSSProperties & Record<string, string>;

const CHATBOT_INTRO_STEPS = [
    {
        title: 'Kies je bot',
        text: 'Start met een voorbeeldproject of ontwerp je eigen chatbot.',
    },
    {
        title: 'Train met zinnen',
        text: 'Voeg voorbeeldzinnen toe die gebruikers zouden kunnen typen.',
    },
    {
        title: 'Schrijf antwoorden',
        text: 'Bepaal wat je chatbot terugzegt bij elk onderwerp.',
    },
    {
        title: 'Test en verbeter',
        text: 'Laat de chatbot vragen beantwoorden en train hem slimmer.',
    },
];

/** State data that can be persisted for this mission */
interface ChatbotPersistState {
    mode?: 'intro' | 'training' | 'setup';
    activeScenarioId?: string | number;
    activeScenario?: Scenario;
    intents?: Intent[];
    customName?: string;
    customContext?: string;
    customIcon?: string;
    customTestQuestions?: string[];
}

interface ChatbotTrainerPreviewProps {
    onLevelComplete?: (level: number) => void;
    initialState?: ChatbotPersistState;
    sharedState?: ChatbotPersistState;
    onSave?: (data: ChatbotPersistState) => void;
}

interface TrainingExample {
    id: string;
    text: string;
}

interface Intent {
    id: string;
    name: string;
    icon: string;
    description: string;
    trainingExamples: TrainingExample[];
    response: string;
    required: boolean;
}

interface TestMessage {
    sender: 'customer' | 'bot';
    text: string;
    confidence?: number;
    matchedIntent?: string;
    status?: 'confident' | 'unsure' | 'no_match';
}

interface Scenario {
    id: string | number;
    name: string;
    icon: string;
    description: string;
    context: string;
    intents: Intent[];
    testMessages: string[];
    minScore: number;
    isCustom?: boolean;
}

// Pre-defined scenarios
const DEFAULT_SCENARIOS: Scenario[] = [
    {
        id: 1,
        name: 'Huiswerk Maatje',
        icon: '🎓',
        description: 'Bouw een AI die helpt met schoolwerk',
        context: 'Je bouwt een slimme assistent voor leerlingen. Hij moet kunnen helpen met vakken zoals Wiskunde, Engels en Plannen.',
        minScore: 70,
        intents: [
            {
                id: 'greeting',
                name: 'Begroeting',
                icon: '👋',
                description: 'Klant zegt hallo',
                trainingExamples: [],
                response: '',
                required: true,
            },
            {
                id: 'math',
                name: 'Wiskunde Hulp',
                icon: '🔢',
                description: 'Vragen over sommen of rekenen',
                trainingExamples: [],
                response: '',
                required: true,
            },
            {
                id: 'language',
                name: 'Taal & Spelling',
                icon: '📝',
                description: 'Vragen over grammatica of woorden',
                trainingExamples: [],
                response: '',
                required: true,
            },
            {
                id: 'study_tips',
                name: 'Studie Tips',
                icon: '💡',
                description: 'Hulp bij leren en plannen',
                trainingExamples: [],
                response: '',
                required: false,
            },
        ],
        testMessages: [
            'Hoi, ik heb hulp nodig.',
            'Ik snap niks van breuken, help!',
            'Is het gebeurd met een d of t?',
            'Hoe bereken je de oppervlakte?',
            'Ik kan me niet concentreren.',
            'Wat is de persoonsvorm?',
        ],
    },
    {
        id: 2,
        name: 'Webshop Support',
        icon: '📦',
        description: 'Help klanten met hun bestellingen',
        context: 'Je werkt bij de klantenservice van een grote webshop. Help klanten met vragen over hun pakketjes!',
        minScore: 70,
        intents: [
            {
                id: 'greeting',
                name: 'Begroeting',
                icon: '👋',
                description: 'Klant zegt hallo',
                trainingExamples: [],
                response: '',
                required: true,
            },
            {
                id: 'status',
                name: 'Status Check',
                icon: '🔍',
                description: 'Waar is mijn pakketje?',
                trainingExamples: [],
                response: '',
                required: true,
            },
            {
                id: 'return',
                name: 'Retourneren',
                icon: '↩️',
                description: 'Ik wil iets terugsturen',
                trainingExamples: [],
                response: '',
                required: true,
            },
            {
                id: 'refund',
                name: 'Geld Terug',
                icon: '💰',
                description: 'Wanneer krijg ik mijn geld?',
                trainingExamples: [],
                response: '',
                required: false,
            },
        ],
        testMessages: [
            'Hoi!',
            'Waar is mijn bestelling?',
            'Ik wil dit product niet meer',
            'Hoe kan ik retourneren?',
            'Ik heb mijn geld nog niet terug',
            'Goedemiddag',
        ],
    }
];

// Simple fuzzy matching algorithm
function calculateSimilarity(message: string, examples: TrainingExample[]): number {
    if (examples.length === 0) return 0;

    const messageLower = message.toLowerCase();
    const messageWords = messageLower.split(/\s+/).filter(w => w.length > 2);

    let maxScore = 0;

    for (const example of examples) {
        const exampleLower = example.text.toLowerCase();
        const exampleWords = exampleLower.split(/\s+/).filter(w => w.length > 2);

        // Exact match
        if (messageLower === exampleLower) {
            return 1.0;
        }

        // Word overlap
        let matchingWords = 0;
        for (const word of messageWords) {
            if (exampleWords.some(ew => ew.includes(word) || word.includes(ew))) {
                matchingWords++;
            }
        }

        // Substring match
        const containsExample = messageLower.includes(exampleLower) || exampleLower.includes(messageLower);

        const wordScore = (messageWords.length > 0 && exampleWords.length > 0)
            ? matchingWords / Math.max(messageWords.length, exampleWords.length)
            : 0;
        const substringBonus = containsExample ? 0.3 : 0;

        const score = Math.min(1, wordScore + substringBonus);
        maxScore = Math.max(maxScore, score);
    }

    return maxScore;
}

function classifyIntent(message: string, intents: Intent[]): { intent: Intent | null; confidence: number; status: 'confident' | 'unsure' | 'no_match' } {
    const scores = intents.map(intent => ({
        intent,
        confidence: calculateSimilarity(message, intent.trainingExamples)
    }));

    scores.sort((a, b) => b.confidence - a.confidence);
    const best = scores[0];

    if (!best || best.confidence === 0) {
        return { intent: null, confidence: 0, status: 'no_match' };
    }

    if (best.confidence >= 0.6) {
        return { intent: best.intent, confidence: best.confidence, status: 'confident' };
    }

    if (best.confidence >= 0.3) {
        return { intent: best.intent, confidence: best.confidence, status: 'unsure' };
    }

    return { intent: null, confidence: best.confidence, status: 'no_match' };
}

export const ChatbotTrainerPreview: React.FC<ChatbotTrainerPreviewProps> = ({ onLevelComplete, initialState, sharedState, onSave }) => {
    // Mode: 'intro' | 'setup' | 'training'
    const [mode, setMode] = useState<'intro' | 'setup' | 'training'>('intro');

    // Custom Scenario Wizard State
    const [customName, setCustomName] = useState('');
    const [customContext, setCustomContext] = useState('');
    const [customIcon, setCustomIcon] = useState('🤖');
    const [customTestQuestions, setCustomTestQuestions] = useState<string[]>(['', '', '']);
    const [activeScenario, setActiveScenario] = useState<Scenario>(DEFAULT_SCENARIOS[0]);

    // Training State
    const [intents, setIntents] = useState<Intent[]>([]);
    const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
    const [newExample, setNewExample] = useState('');

    // Testing logic
    const [isTesting, setIsTesting] = useState(false);
    const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
    const [testScore, setTestScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [showConclusion, setShowConclusion] = useState(false);

    // Add intent helper
    const [newIntentName, setNewIntentName] = useState('');
    const [isAddingIntent, setIsAddingIntent] = useState(false);
    const [visibleIntroSteps, setVisibleIntroSteps] = useState(0);

    // Sharing State
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [isSharing, setIsSharing] = useState(false);
    const [isSharedView, setIsSharedView] = useState(false);
    const [copied, setCopied] = useState(false);

    const chatRef = useRef<HTMLDivElement>(null);
    const justRestored = useRef(false);

    // Restore state from initialData
    // Restore state from initialData or sharedData
    useEffect(() => {
        if (sharedState) {
            console.log("Restoring SHARED Chatbot state:", sharedState);
            setIsSharedView(true);
            if (sharedState.customName) setCustomName(sharedState.customName);
            if (sharedState.customContext) setCustomContext(sharedState.customContext);
            if (sharedState.customIcon) setCustomIcon(sharedState.customIcon);
            if (sharedState.customTestQuestions) setCustomTestQuestions(sharedState.customTestQuestions);
            if (sharedState.activeScenario) activeScenario.isCustom ? setActiveScenario({ ...sharedState.activeScenario, isCustom: true }) : setActiveScenario(sharedState.activeScenario);
            if (sharedState.intents) setIntents(sharedState.intents);

            // Directly go to training mode
            setMode('training');
            justRestored.current = true;
            return;
        }

        if (initialState) {
            console.log("Restoring Chatbot Trainer state:", initialState);
            if (initialState.mode) setMode(initialState.mode);
            if (initialState.customName) setCustomName(initialState.customName);
            if (initialState.customContext) setCustomContext(initialState.customContext);
            if (initialState.customIcon) setCustomIcon(initialState.customIcon);
            if (initialState.customTestQuestions) setCustomTestQuestions(initialState.customTestQuestions);
            if (initialState.activeScenario) setActiveScenario(initialState.activeScenario);
            if (initialState.intents) setIntents(initialState.intents);

            // Mark as restored so we don't overwrite intents with default scenario intents
            justRestored.current = true;
        }
    }, [sharedState, initialState]); // Run once on mount (or when sharedState arrives)

    // Auto-save state
    useEffect(() => {
        if (!onSave) return;
        const timer = setTimeout(() => {
            onSave({
                mode,
                activeScenario,
                intents,
                customName,
                customContext,
                customIcon,
                customTestQuestions
            });
        }, 1500); // 1.5s debounce
        return () => clearTimeout(timer);
    }, [mode, activeScenario, intents, customName, customContext, customIcon, customTestQuestions, onSave]);

    // Initialize intents when scenario changes
    useEffect(() => {
        if (mode === 'training') {
            if (justRestored.current) {
                justRestored.current = false;
                return;
            }
            setIntents(JSON.parse(JSON.stringify(activeScenario.intents)));
            setSelectedIntent(activeScenario.intents[0]?.id || null);
            setTestMessages([]);
            setIsTesting(false);
            setShowResults(false);
            setTestScore(0);
        }
    }, [activeScenario, mode]);

    useEffect(() => {
        if (mode !== 'intro') return;

        setVisibleIntroSteps(0);
        const timers = CHATBOT_INTRO_STEPS.map((_, index) =>
            window.setTimeout(() => setVisibleIntroSteps(index + 1), 700 + index * 1000)
        );

        return () => timers.forEach(window.clearTimeout);
    }, [mode]);

    // Auto-scroll chat
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [testMessages]);

    const selectedIntentData = intents.find(i => i.id === selectedIntent);

    const startCustomScenario = () => {
        if (!customName || !customContext) return;

        // Filter valid questions
        const validQuestions = customTestQuestions.filter(q => q.trim().length > 0);
        if (validQuestions.length < 2) {
            alert("Voeg minimaal 2 testvragen toe die gebruikers zouden kunnen stellen.");
            return;
        }

        const newScenario: Scenario = {
            id: 'custom-' + Date.now(),
            name: customName,
            icon: customIcon,
            description: 'Jouw eigen chatbot project',
            context: customContext,
            minScore: 60,
            testMessages: validQuestions,
            isCustom: true,
            intents: [
                {
                    id: 'greeting',
                    name: 'Begroeting',
                    icon: '👋',
                    description: 'Standaard begroeting',
                    trainingExamples: [],
                    response: '',
                    required: true
                },
                {
                    id: 'custom-1',
                    name: 'Algemene Vraag',
                    icon: '❓',
                    description: 'Een vraag over jouw onderwerp',
                    trainingExamples: [],
                    response: '',
                    required: true
                }
            ]
        };

        justRestored.current = false;
        setActiveScenario(newScenario);
        setMode('training');
    };

    const addExample = () => {
        if (!newExample.trim() || !selectedIntent) return;

        setIntents(prev => prev.map(intent => {
            if (intent.id === selectedIntent) {
                return {
                    ...intent,
                    trainingExamples: [
                        ...intent.trainingExamples,
                        { id: Date.now().toString(), text: newExample.trim() }
                    ]
                };
            }
            return intent;
        }));
        setNewExample('');
    };

    const removeExample = (exampleId: string) => {
        setIntents(prev => prev.map(intent => {
            if (intent.id === selectedIntent) {
                return {
                    ...intent,
                    trainingExamples: intent.trainingExamples.filter(e => e.id !== exampleId)
                };
            }
            return intent;
        }));
    };

    const updateResponse = (response: string) => {
        setIntents(prev => prev.map(intent => {
            if (intent.id === selectedIntent) {
                return { ...intent, response };
            }
            return intent;
        }));
    };

    const addNewIntent = () => {
        if (!newIntentName.trim()) return;

        const newId = `custom-${Date.now()}`;
        const newIntent: Intent = {
            id: newId,
            name: newIntentName,
            icon: '✨',
            description: 'Nieuwe intent',
            trainingExamples: [],
            response: '',
            required: false // User created intents are not hard-required, but recommended
        };

        setIntents(prev => [...prev, newIntent]);
        setNewIntentName('');
        setIsAddingIntent(false);
        setSelectedIntent(newId);
    };

    const deleteIntent = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Weet je zeker dat je deze intent wilt verwijderen?')) {
            setIntents(prev => prev.filter(i => i.id !== id));
            if (selectedIntent === id) {
                setSelectedIntent(null);
            }
        }
    };

    const getIntentStatus = (intent: Intent): 'ready' | 'partial' | 'empty' => {
        const hasExamples = intent.trainingExamples.length >= 2;
        const hasResponse = intent.response.trim().length > 0;

        if (hasExamples && hasResponse) return 'ready';
        if (intent.trainingExamples.length > 0 || hasResponse) return 'partial';
        return 'empty';
    };

    const canStartTest = () => {
        const requiredIntents = intents.filter(i => i.required);
        return requiredIntents.every(i => getIntentStatus(i) === 'ready');
    };

    const startTest = async () => {
        setIsTesting(true);
        setTestMessages([]);
        setTestScore(0);
        setShowResults(false);

        const messages = activeScenario.testMessages;
        let score = 0;
        const newMessages: TestMessage[] = [];

        // Simulate chat flow
        for (let i = 0; i < messages.length; i++) {
            const customerMsg = messages[i];

            // Add customer message
            newMessages.push({ sender: 'customer', text: customerMsg });
            setTestMessages([...newMessages]);

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Classify intent
            const result = classifyIntent(customerMsg, intents);

            let botResponse: TestMessage;

            if (result.status === 'confident' && result.intent?.response) {
                botResponse = {
                    sender: 'bot',
                    text: result.intent.response,
                    confidence: result.confidence,
                    matchedIntent: result.intent.name,
                    status: 'confident'
                };
                score += 20;
            } else if (result.status === 'unsure' && result.intent?.response) {
                botResponse = {
                    sender: 'bot',
                    text: result.intent.response,
                    confidence: result.confidence,
                    matchedIntent: result.intent.name,
                    status: 'unsure'
                };
                score += 10;
            } else {
                botResponse = {
                    sender: 'bot',
                    text: '🤔 Sorry, ik begrijp je vraag niet helemaal. Kun je het anders formuleren?',
                    confidence: result.confidence,
                    status: 'no_match'
                };
            }

            newMessages.push(botResponse);
            setTestMessages([...newMessages]);
            setTestScore(score);

            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        setShowResults(true);

        const maxScore = messages.length * 20;
        const percentage = Math.round((score / maxScore) * 100);

        if (percentage >= activeScenario.minScore && onLevelComplete) {
            onLevelComplete(1);
        }
    };

    const handleShare = async () => {
        if (!activeScenario.isCustom) return;
        setIsSharing(true);
        setShowShareModal(true);

        try {
            const projectData: ChatbotPersistState = {
                activeScenario,
                intents,
                customName,
                customContext,
                customIcon,
                customTestQuestions
            };

            const shareId = await shareProject({
                type: 'chatbot',
                data: projectData,
                name: customName || 'Mijn Chatbot',
                createdBy: 'student', // Anonymous
                createdAt: new Date()
            });

            const link = `${window.location.origin}/missions?shared_bot=${shareId}`;
            setShareUrl(link);
        } catch (err) {
            console.error(err);
            alert("Er ging iets mis bij het delen. Probeer het opnieuw.");
            setShowShareModal(false);
        } finally {
            setIsSharing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- RENDER MODES ---

    // 1. INTRO
    if (mode === 'intro') {
        const introReady = visibleIntroSteps >= CHATBOT_INTRO_STEPS.length;

        return (
            <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ ...CHATBOT_THEME_VARS, backgroundColor: 'var(--chatbot-bg)', color: 'var(--chatbot-ink)' }}>
                <div className="flex-1 flex flex-col items-center justify-start p-5 md:p-6 relative z-10 overflow-y-auto">
                    <div className="relative mb-4 flex w-full max-w-md items-start justify-center gap-3">
                        <img src="/assets/storytelling/beaver-storyteller.webp" alt="DGSkills bever" className="w-16 h-16 object-contain shrink-0" loading="lazy" />
                        <div
                            className="relative mt-1 rounded-2xl px-4 py-3 text-left text-sm font-bold leading-snug shadow-sm"
                            style={{ backgroundColor: 'var(--chatbot-surface)', border: '1px solid var(--chatbot-line)', color: 'var(--chatbot-muted)' }}
                        >
                            <span
                                className="absolute left-[-7px] top-5 h-3.5 w-3.5 rotate-45"
                                style={{ backgroundColor: 'var(--chatbot-surface)', borderBottom: '1px solid var(--chatbot-line)', borderLeft: '1px solid var(--chatbot-line)' }}
                            />
                            Ik laat je eerst de stappen zien. Als stap 4 zichtbaar is, kun je beginnen.
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black mb-2 text-center" style={{ color: 'var(--chatbot-ink)' }}>AI Chatbot Trainer</h2>
                    <p className="text-center max-w-md mb-4 text-base md:text-lg font-medium" style={{ color: 'var(--chatbot-muted)' }}>
                        Bouw je eigen chatbot en leer hoe AI-gesprekken werken!
                    </p>

                    {/* Explanation Box */}
                    <div className="rounded-2xl p-4 max-w-md w-full mb-5 shadow-sm" style={{ backgroundColor: 'var(--chatbot-surface)', border: '1px solid var(--chatbot-line)' }}>
                        <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2" style={{ color: 'var(--chatbot-primary)' }}>
                            <HelpCircle size={16} /> Zo werkt het:
                        </h3>
                        <ul className="space-y-2 text-sm" style={{ color: 'var(--chatbot-muted)' }}>
                            {CHATBOT_INTRO_STEPS.map((step, index) => {
                                const isVisible = visibleIntroSteps > index;
                                const isLast = index === CHATBOT_INTRO_STEPS.length - 1;

                                return (
                                    <li
                                        key={step.title}
                                        className={`flex items-start gap-2 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                                        aria-hidden={!isVisible}
                                    >
                                        <span
                                            className="rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                                            style={{
                                                backgroundColor: isLast ? 'rgba(95,148,125,0.12)' : 'rgba(37,109,133,0.12)',
                                                color: isLast ? 'var(--chatbot-success)' : 'var(--chatbot-primary)',
                                            }}
                                        >
                                            {isLast ? '✓' : index + 1}
                                        </span>
                                        <span><strong style={{ color: 'var(--chatbot-ink)' }}>{step.title}</strong> — {step.text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <button
                            onClick={() => {
                                if (introReady) setMode('setup');
                            }}
                            disabled={!introReady}
                            className={`w-full p-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-between group ${
                                introReady ? 'shadow-lg hover:scale-[1.02] cursor-pointer' : 'cursor-not-allowed opacity-70'
                            }`}
                            style={introReady
                                ? { backgroundColor: 'var(--chatbot-accent)', color: 'var(--chatbot-ink)', boxShadow: '0 14px 30px rgba(215,201,95,0.32)' }
                                : { backgroundColor: 'var(--chatbot-line)', color: 'var(--chatbot-muted)' }
                            }
                        >
                            <span className="flex items-center gap-3">
                                <Sparkles /> {introReady ? 'Start Nieuw Project' : 'Lees eerst de stappen'}
                            </span>
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. SETUP (Scenario Selection)
    if (mode === 'setup') {
        return (
            <div className="w-full h-full flex flex-col overflow-hidden" style={{ ...CHATBOT_THEME_VARS, backgroundColor: 'var(--chatbot-bg)', color: 'var(--chatbot-ink)' }}>
                <div className="p-5 md:p-6 pb-3 shrink-0">
                    <button onClick={() => setMode('intro')} className="mb-3 flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--chatbot-muted)' }}>
                        <ArrowLeft size={16} /> Terug
                    </button>
                    <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif", color: 'var(--chatbot-ink)' }}>Wat wil je maken?</h2>
                    <p style={{ color: 'var(--chatbot-muted)' }}>Kies meteen een voorbeeldproject of verzin je eigen chatbot.</p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 md:px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-none">
                        {/* Existing Scenarios as quick start */}
                        {DEFAULT_SCENARIOS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    justRestored.current = false;
                                    setActiveScenario(s);
                                    setMode('training');
                                }}
                                className="p-4 rounded-2xl text-left transition-all flex items-start gap-4 group hover:-translate-y-0.5 hover:shadow-md"
                                style={{ backgroundColor: 'var(--chatbot-surface)', border: '1px solid var(--chatbot-line)' }}
                            >
                                <div className="text-3xl w-14 h-14 flex items-center justify-center rounded-xl shadow-inner transition-colors" style={{ backgroundColor: 'var(--chatbot-soft)' }}>
                                    {s.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1 transition-colors" style={{ color: 'var(--chatbot-ink)' }}>{s.name}</h4>
                                    <p className="text-sm mb-2" style={{ color: 'var(--chatbot-muted)' }}>{s.description}</p>
                                    <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: 'var(--chatbot-soft)', color: 'var(--chatbot-primary-strong)' }}>Voorbeeld</span>
                                </div>
                            </button>
                        ))}

                        {/* Custom Option - Highlighted */}
                        <div className="md:col-span-2 rounded-2xl p-4 md:p-5 shadow-lg relative overflow-hidden group" style={{ backgroundColor: 'var(--chatbot-primary)', color: '#FFFFFF', border: '2px solid var(--chatbot-primary)' }}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles size={96} />
                            </div>

                            <div className="relative z-10 grid gap-4 xl:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.55fr)] xl:items-start">
                                <div>
                                    <span className="text-xs font-bold px-2 py-1 rounded mb-2 inline-block" style={{ backgroundColor: 'var(--chatbot-success)', color: '#FFFFFF' }}>VRIJE KEUZE</span>
                                    <h3 className="text-xl md:text-2xl font-black mb-2 flex items-center gap-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                        <Pencil size={24} /> Ontwerp je eigen Bot
                                    </h3>
                                    <p className="max-w-xl text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                        Jij bent de baas! Maak een chatbot voor jouw favoriete game, hobby, sportclub, huishoudhulp of wat dan ook.
                                    </p>
                                    <div className="mt-3 hidden xl:flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF' }}>
                                        <Bot size={18} /> Eerst invullen, daarna trainen.
                                    </div>
                                </div>

                                <div className="rounded-xl p-3 md:p-4" style={{ backgroundColor: 'rgba(16,42,67,0.18)', border: '1px solid rgba(255,255,255,0.16)' }}>
                                    <div className="grid gap-3 lg:grid-cols-2">
                                        <label className="block">
                                            <span className="block text-xs font-bold uppercase mb-1" style={{ color: 'rgba(255,255,255,0.82)' }}>Naam van je Bot</span>
                                            <input
                                                type="text"
                                                placeholder="Bijv. GameGuide Pro"
                                                value={customName}
                                                onChange={e => setCustomName(e.target.value)}
                                                className="w-full rounded-xl px-3 py-2.5 focus:outline-none placeholder:text-[#4B6475]/55 shadow-sm"
                                                style={{ backgroundColor: 'var(--chatbot-field)', border: '1px solid rgba(255,255,255,0.42)', color: 'var(--chatbot-ink)' }}
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="block text-xs font-bold uppercase mb-1" style={{ color: 'rgba(255,255,255,0.82)' }}>Wat doet hij?</span>
                                            <input
                                                type="text"
                                                placeholder="Bijv. Geeft tips over Minecraft"
                                                value={customContext}
                                                onChange={e => setCustomContext(e.target.value)}
                                                className="w-full rounded-xl px-3 py-2.5 focus:outline-none placeholder:text-[#4B6475]/55 shadow-sm"
                                                style={{ backgroundColor: 'var(--chatbot-field)', border: '1px solid rgba(255,255,255,0.42)', color: 'var(--chatbot-ink)' }}
                                            />
                                        </label>
                                    </div>
                                    <div className="mt-3">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <label className="text-xs font-bold uppercase" style={{ color: 'rgba(255,255,255,0.82)' }}>
                                                3 testvragen
                                            </label>
                                            <span className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: 'var(--chatbot-warm)', color: 'var(--chatbot-primary-strong)' }}>
                                                Minimaal 2 invullen
                                            </span>
                                        </div>
                                        <div className="grid gap-2 md:grid-cols-3">
                                            {customTestQuestions.map((q, i) => (
                                                <input
                                                    key={i}
                                                    type="text"
                                                    placeholder={`Vraag ${i + 1}...`}
                                                    value={q}
                                                    onChange={e => {
                                                        const newArr = [...customTestQuestions];
                                                        newArr[i] = e.target.value;
                                                        setCustomTestQuestions(newArr);
                                                    }}
                                                    className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none placeholder:text-[#4B6475]/55 shadow-sm"
                                                    style={{ backgroundColor: 'var(--chatbot-field)', border: '1px solid rgba(255,255,255,0.42)', color: 'var(--chatbot-ink)' }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={startCustomScenario}
                                        disabled={!customName || !customContext || customTestQuestions.filter(q => q.trim()).length < 2}
                                        className="w-full py-3 font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 flex items-center justify-center gap-2"
                                        style={{ backgroundColor: 'var(--chatbot-accent)', color: 'var(--chatbot-ink)' }}
                                    >
                                        Start Maken <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. MAIN TRAINING UI
    const maxScore = activeScenario.testMessages.length * 20;
    const scorePercentage = Math.round((testScore / maxScore) * 100);

    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ ...CHATBOT_THEME_VARS, backgroundColor: 'var(--chatbot-bg)', color: 'var(--chatbot-ink)' }}>
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ backgroundColor: 'var(--chatbot-surface)', borderBottom: '1px solid var(--chatbot-line)' }}>
                <div className="flex items-center gap-3">
                    {!isSharedView && (
                        <button onClick={() => setMode('setup')} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--chatbot-muted)' }}>
                            <ArrowLeft size={18} />
                        </button>
                    )}
                    <span className="text-2xl">{activeScenario.icon}</span>
                    <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--chatbot-ink)' }}>{activeScenario.name}</h3>
                        <p className="text-xs" style={{ color: 'var(--chatbot-muted)' }}>{activeScenario.context}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {activeScenario.isCustom && !isSharedView && (
                        <button
                            onClick={handleShare}
                            className="text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg"
                            style={{ backgroundColor: 'var(--chatbot-primary)' }}
                        >
                            <Share size={14} /> Delen
                        </button>
                    )}
                    {activeScenario.isCustom && (
                        <span className="text-xs px-2 py-1 rounded font-bold" style={{ backgroundColor: 'var(--chatbot-soft)', color: 'var(--chatbot-primary-strong)', border: '1px solid var(--chatbot-line)' }}>
                            {isSharedView ? 'Gedeeld Project' : 'Jouw Project'}
                        </span>
                    )}
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                shareUrl={shareUrl}
                isSharing={isSharing}
                title="Deel je Chatbot!"
                description="Laat anderen jouw creatie testen."
            />

            {showConclusion && (
                <MissionConclusion
                    title="Missie Voltooid!"
                    description={`Je hebt je eigen chatbot '${activeScenario.name}' succesvol getraind!`}
                    aiConcept={{
                        title: "Training Data & Bias",
                        text: "Je hebt gemerkt dat de bot alleen antwoord kan geven op dingen die jij hem geleerd hebt. Als je bepaalde vragen vergeet te trainen, 'snapt' de AI het niet. Dit noemen we de beperking van je 'Dataset'."
                    }}
                    onExit={() => setShowConclusion(false)}
                />
            )}

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Intent List */}
                <div className="w-64 p-3 flex flex-col shrink-0" style={{ backgroundColor: 'var(--chatbot-surface)', borderRight: '1px solid var(--chatbot-line)' }}>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--chatbot-muted)' }}>
                            <Target size={12} /> Intents (Onderwerpen)
                        </h4>
                        {activeScenario.isCustom && (
                            <button
                                onClick={() => setIsAddingIntent(true)}
                                className="text-xs text-white px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                style={{ backgroundColor: 'var(--chatbot-primary)' }}
                            >
                                <Plus size={12} /> Nieuw
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {intents.map(intent => {
                            const status = getIntentStatus(intent);
                            const isSelected = selectedIntent === intent.id;

                            return (
                                <button
                                    key={intent.id}
                                    onClick={() => setSelectedIntent(intent.id)}
                                    className="w-full p-2.5 rounded-lg text-left transition-all text-sm group relative"
                                    style={isSelected
                                        ? { backgroundColor: 'var(--chatbot-primary)', color: '#FFFFFF', boxShadow: '0 4px 6px -1px rgba(37,109,133,0.22)' }
                                        : { backgroundColor: 'var(--chatbot-soft)', color: 'var(--chatbot-muted)' }
                                    }
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-base">{intent.icon}</span>
                                        <span className="font-medium truncate flex-1">{intent.name}</span>
                                        {status === 'ready' && <CheckCircle2 size={14} className="text-lab-sage shrink-0" />}
                                        {status === 'partial' && <AlertCircle size={14} className="text-lab-gold shrink-0" />}
                                        {status === 'empty' && intent.required && (
                                            <div className="bg-lab-coral/20 rounded-full p-1 animate-pulse">
                                                <AlertCircle size={14} className="text-lab-coral shrink-0" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-[10px] opacity-70 mt-1 flex justify-between items-center">
                                        <span>{intent.trainingExamples.length} voorbeelden</span>
                                        {activeScenario.isCustom && !intent.required && (
                                            <div
                                                onClick={(e) => deleteIntent(intent.id, e)}
                                                className="opacity-0 group-hover:opacity-100 hover:text-lab-coral p-1"
                                            >
                                                <Trash2 size={12} />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}

                        {isAddingIntent && (
                            <div className="p-2 rounded-lg animate-in fade-in slide-in-from-top-2" style={{ backgroundColor: 'var(--chatbot-soft)' }}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Naam (bv. Openingstijden)"
                                    value={newIntentName}
                                    onChange={(e) => setNewIntentName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addNewIntent()}
                                    className="w-full rounded px-2 py-1 text-sm outline-none mb-2"
                                    style={{ backgroundColor: 'var(--chatbot-field)', border: '1px solid var(--chatbot-line)', color: 'var(--chatbot-ink)' }}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={addNewIntent}
                                        disabled={!newIntentName.trim()}
                                        className="flex-1 text-white text-xs py-1 rounded"
                                        style={{ backgroundColor: '#5F947D' }}
                                    >
                                        Toevoegen
                                    </button>
                                    <button
                                        onClick={() => setIsAddingIntent(false)}
                                        className="px-2 text-xs py-1 rounded"
                                        style={{ backgroundColor: 'var(--chatbot-line)', color: 'var(--chatbot-muted)' }}
                                    >
                                        Annuleer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {!isTesting && (
                        <button
                            onClick={() => {
                                if (canStartTest()) {
                                    startTest();
                                } else {
                                    const missing = intents.filter(i => i.required && getIntentStatus(i) !== 'ready').map(i => i.name).join(', ');
                                    alert(`Maak eerst deze intents af: ${missing}`);
                                }
                            }}
                            className="mt-3 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                            style={canStartTest()
                                ? { backgroundColor: '#5F947D', color: '#FFFFFF', boxShadow: '0 4px 6px -1px rgba(95, 148, 125,0.3)' }
                                : { backgroundColor: 'var(--chatbot-soft)', color: 'var(--chatbot-muted)', opacity: 0.7 }
                            }
                        >
                            <Play size={16} fill="currentColor" />
                            Testen
                        </button>
                    )}

                    {isTesting && !showResults && (
                        <div className="mt-3 py-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(95, 148, 125,0.1)' }}>
                            <Loader2 size={20} className="animate-spin mx-auto" style={{ color: '#5F947D' }} />
                            <p className="text-xs mt-1" style={{ color: '#5F947D' }}>De chatbot is aan het testen...</p>
                        </div>
                    )}
                </div>

                {/* Middle: Training Panel */}
                <div className="flex-1 p-4 md:p-5 flex flex-col min-w-0" style={{ backgroundColor: 'var(--chatbot-bg)' }}>
                    {selectedIntentData ? (
                        <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-inner" style={{ backgroundColor: 'rgba(37,109,133,0.1)', color: 'var(--chatbot-primary)', border: '1px solid rgba(37,109,133,0.2)' }}>
                                        {selectedIntentData.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl md:text-2xl tracking-tight" style={{ fontFamily: "'Newsreader', Georgia, serif", color: 'var(--chatbot-ink)' }}>{selectedIntentData.name}</h3>
                                        <p className="text-sm" style={{ color: 'var(--chatbot-muted)' }}>{selectedIntentData.description}</p>
                                    </div>
                                </div>
                                {selectedIntentData.required && (
                                    <span className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wide" style={{ backgroundColor: 'rgba(37,109,133,0.1)', color: 'var(--chatbot-primary)', border: '1px solid rgba(37,109,133,0.2)' }}>
                                        Verplicht
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                                {/* STEP 1: TRAINING EXAMPLES */}
                                <div className="rounded-2xl p-4 shadow-sm group transition-all" style={{ backgroundColor: 'var(--chatbot-surface)', border: '1px solid var(--chatbot-line)' }}>
                                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--chatbot-primary)' }}>
                                        <span className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: 'var(--chatbot-primary)' }}>1</span>
                                        Trainingsdata (Wat zegt de gebruiker?)
                                    </h4>
                                    <p className="text-xs mb-3" style={{ color: 'var(--chatbot-muted)' }}>
                                        Voeg minimaal 2-3 voorbeeldzinnen toe die mensen zouden kunnen typen over dit onderwerp.
                                    </p>

                                    <div className="space-y-2 mb-3">
                                        {selectedIntentData.trainingExamples.length === 0 ? (
                                            <div className="text-sm py-3 px-4 rounded-lg" style={{ color: 'var(--chatbot-muted)', backgroundColor: 'rgba(37,109,133,0.06)', border: '1px dashed rgba(37,109,133,0.3)' }}>
                                                Nog geen voorbeelden. Typ een zin in het tekstveld hieronder en klik op <strong>+</strong> om toe te voegen.
                                            </div>
                                        ) : (
                                            selectedIntentData.trainingExamples.slice().reverse().map((example) => (
                                                <div key={example.id} className="flex items-center gap-3 px-3 py-2 rounded-lg group/item" style={{ backgroundColor: 'rgba(37,109,133,0.06)', border: '1px solid rgba(37,109,133,0.16)' }}>
                                                    <MessageSquare size={14} className="shrink-0" style={{ color: 'var(--chatbot-primary)' }} />
                                                    <span className="text-sm flex-1" style={{ color: 'var(--chatbot-muted)' }}>"{example.text}"</span>
                                                    <button
                                                        onClick={() => removeExample(example.id)}
                                                        className="hover:text-lab-coral opacity-0 group-hover/item:opacity-100 transition-all p-1"
                                                        style={{ color: 'var(--chatbot-muted)' }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold" style={{ color: 'var(--chatbot-muted)' }}>Voorbeeldzin toevoegen</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newExample}
                                                onChange={(e) => setNewExample(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addExample()}
                                                placeholder="Bijv. 'Wat kost een pizza margherita?'"
                                                className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                                                style={{ backgroundColor: 'var(--chatbot-field)', border: '1px solid var(--chatbot-line)', color: 'var(--chatbot-ink)' }}
                                            />
                                            <button
                                                onClick={addExample}
                                                disabled={!newExample.trim()}
                                                className="px-4 rounded-xl transition-colors shadow-lg disabled:opacity-50 text-white"
                                                style={{ backgroundColor: 'var(--chatbot-primary)' }}
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* STEP 2: RESPONSE */}
                                <div className="rounded-2xl p-4 shadow-sm transition-all" style={{ backgroundColor: 'var(--chatbot-surface)', border: '1px solid var(--chatbot-line)' }}>
                                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#5F947D' }}>
                                        <span className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: '#5F947D' }}>2</span>
                                        Chatbotantwoord (Output)
                                    </h4>
                                    <p className="text-xs mb-3" style={{ color: 'var(--chatbot-muted)' }}>
                                        Schrijf hier het antwoord dat de chatbot moet geven als iemand over dit onderwerp praat.
                                    </p>

                                    <div className="relative">
                                        <Bot className="absolute top-3 left-3" size={20} style={{ color: 'rgba(95, 148, 125,0.5)' }} />
                                        <textarea
                                            value={selectedIntentData.response}
                                            onChange={(e) => updateResponse(e.target.value)}
                                            placeholder={`Wat moet de chatbot antwoorden als iemand over '${selectedIntentData.name}' begint?`}
                                            rows={3}
                                            className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all resize-none"
                                            style={{ backgroundColor: 'var(--chatbot-field)', border: '1px solid var(--chatbot-line)', color: 'var(--chatbot-ink)' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center" style={{ color: 'var(--chatbot-muted)' }}>
                            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 opacity-50" style={{ backgroundColor: 'var(--chatbot-soft)' }}>
                                <Target size={40} />
                            </div>
                            <p className="font-bold">Selecteer een Intent</p>
                            <p className="text-sm opacity-60">Kies links een onderwerp om te trainen</p>
                        </div>
                    )}
                </div>

                {/* Right: Test Chat */}
                <div className="w-80 flex flex-col shrink-0" style={{ backgroundColor: 'var(--chatbot-surface)', borderLeft: '1px solid var(--chatbot-line)' }}>
                    <div className="p-4" style={{ borderBottom: '1px solid var(--chatbot-line)' }}>
                        <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--chatbot-muted)' }}>
                            <MessageCircle size={12} /> Test Omgeving
                        </h4>
                    </div>

                    <div
                        ref={chatRef}
                        className="flex-1 p-4 overflow-y-auto space-y-4"
                        style={{ backgroundImage: 'radial-gradient(circle at center, var(--chatbot-line) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    >
                        {!isTesting && testMessages.length === 0 && (
                            <div className="text-center mt-10" style={{ color: 'var(--chatbot-muted)' }}>
                                <p className="text-sm">Zodra je start met testen,</p>
                                <p className="text-xs">simuleert de chatbot een gesprek.</p>
                            </div>
                        )}

                        {testMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div
                                    className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm"
                                    style={msg.sender === 'customer'
                                        ? { backgroundColor: 'var(--chatbot-primary)', color: '#FFFFFF', borderBottomRightRadius: 0 }
                                        : msg.status === 'confident'
                                            ? { backgroundColor: 'var(--chatbot-soft)', color: 'var(--chatbot-muted)', border: '1px solid rgba(16,185,129,0.3)', borderBottomLeftRadius: 0 }
                                            : msg.status === 'unsure'
                                                ? { backgroundColor: 'var(--chatbot-soft)', color: 'var(--chatbot-muted)', border: '1px solid rgba(245,158,11,0.3)', borderBottomLeftRadius: 0 }
                                                : { backgroundColor: 'var(--chatbot-soft)', color: 'var(--chatbot-muted)', border: '1px solid rgba(239,68,68,0.3)', borderBottomLeftRadius: 0 }
                                    }
                                >
                                    <p>{msg.text}</p>
                                    {msg.sender === 'bot' && msg.confidence !== undefined && (
                                        <div className="flex items-center gap-2 mt-1.5 pt-1.5" style={{ borderTop: '1px solid var(--chatbot-line)' }}>
                                            {msg.status === 'confident' && <span className="w-2 h-2 rounded-full bg-lab-sage" />}
                                            {msg.status === 'unsure' && <span className="w-2 h-2 rounded-full bg-lab-gold" />}
                                            {msg.status === 'no_match' && <span className="w-2 h-2 rounded-full bg-lab-coral" />}
                                            <span className="text-[10px] opacity-70 font-mono">
                                                {(msg.confidence * 100).toFixed(0)}% • {msg.matchedIntent || 'Geen match'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Results Overlay */}
                    {showResults && (
                        <div className="p-4 animate-in slide-in-from-bottom-10" style={{ backgroundColor: 'var(--chatbot-surface)', borderTop: '1px solid var(--chatbot-line)' }}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold" style={{ color: 'var(--chatbot-muted)' }}>Test Score</span>
                                <div
                                    className="px-3 py-1 rounded-full font-black text-sm"
                                    style={scorePercentage >= activeScenario.minScore
                                        ? { backgroundColor: 'rgba(16,185,129,0.1)', color: '#5F947D' }
                                        : { backgroundColor: 'rgba(245,158,11,0.1)', color: '#D7C95F' }
                                    }
                                >
                                    {scorePercentage}%
                                </div>
                            </div>

                            {scorePercentage >= activeScenario.minScore ? (
                                <button
                                    onClick={() => setShowConclusion(true)}
                                    className="w-full py-3 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                                    style={{ backgroundColor: '#5F947D' }}
                                >
                                    <Trophy size={18} /> Afronden
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-xs text-center mb-2" style={{ color: 'var(--chatbot-muted)' }}>Je hebt minimaal {activeScenario.minScore}% nodig.</p>
                                    <button
                                        onClick={() => setShowResults(false)}
                                        className="w-full py-3 rounded-xl font-bold transition-all"
                                        style={{ backgroundColor: 'var(--chatbot-soft)', color: 'var(--chatbot-muted)' }}
                                    >
                                        Verder Trainen
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
