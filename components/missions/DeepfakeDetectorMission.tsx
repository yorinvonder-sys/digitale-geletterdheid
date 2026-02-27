/**
 * DeepfakeDetectorMission.tsx
 * 
 * Leerlingen leren AI-gegenereerde content herkennen.
 * Ze analyseren afbeeldingen, teksten en claims om te bepalen wat echt of fake is.
 * 
 * SLO-doelen: Mediawijsheid, kritische media-analyse, AI-awareness
 */

import React, { useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Check, X, Eye, Brain, Shield, AlertTriangle, Sparkles, ThumbsUp, ThumbsDown, HelpCircle, Zap, Camera, FileText, MessageSquare } from 'lucide-react';
import { UserStats, VsoProfile } from '../../types';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: UserStats;
    vsoProfile?: VsoProfile;
}

// Types
interface DetectionChallenge {
    id: string;
    level: 'beginner' | 'gevorderd' | 'expert';
    type: 'image' | 'text' | 'claim';
    title: string;
    content: string; // Image URL or text content
    isAIGenerated: boolean;
    hints: string[];
    explanation: string;
    telltaleSign?: string; // What gives it away
    category: string;
}

// Challenge data - Mix of real and AI-generated descriptions
const CHALLENGES: DetectionChallenge[] = [
    // BEGINNER - Obvious cases
    {
        id: 'b1',
        level: 'beginner',
        type: 'image',
        title: '🖼️ Foto Analyse',
        content: 'Een foto van een hond met 7 poten die in een park speelt. De achtergrond ziet er normaal uit, maar het dier heeft duidelijk te veel ledematen.',
        isAIGenerated: true,
        hints: ['Tel het aantal poten', 'Klopt de anatomie?'],
        explanation: 'AI heeft moeite met het correct tellen van lichaamsdelen. Dieren met te veel of te weinig poten, vingers, of ogen zijn vaak AI-gegenereerd.',
        telltaleSign: 'Verkeerd aantal lichaamsdelen (7 poten)',
        category: 'Anatomie fouten'
    },
    {
        id: 'b2',
        level: 'beginner',
        type: 'text',
        title: '📝 Nieuwsbericht',
        content: '"Vandaag heeft de minister van Onderwijs aangekondigd dat alle scholen voortaan op woensdag dicht zullen zijn. Dit gaat in per 1 september 2025."',
        isAIGenerated: false,
        hints: ['Is het taalgebruik normaal?', 'Klinkt het als echt nieuws?'],
        explanation: 'Dit is een verzonnen nieuwsbericht om te illustreren, maar het volgt normale nieuwsstructuur. Niet alles dat fake klinkt is AI - menselijk geschreven nepnieuws bestaat ook!',
        category: 'Nepnieuws herkennen'
    },
    {
        id: 'b3',
        level: 'beginner',
        type: 'image',
        title: '🎨 Kunstwerk',
        content: 'Een geschilderd portret van een vrouw. Bij nauwkeurig kijken zie je dat haar oorbel in haar wang lijkt te smelten, en haar vingers zijn wazig en lijken samen te vloeien.',
        isAIGenerated: true,
        hints: ['Kijk naar kleine details', 'Zijn randen scherp?'],
        explanation: 'AI-gegenereerde afbeeldingen hebben vaak problemen met kleine details zoals sieraden, vingers, en overgangen tussen objecten.',
        telltaleSign: 'Smeltende oorbel en wazige vingers',
        category: 'Detail fouten'
    },

    // GEVORDERD - Harder to spot
    {
        id: 'g1',
        level: 'gevorderd',
        type: 'text',
        title: '💬 AI Chatbot of Mens?',
        content: '"Hoi! Ik ben Lisa, 14 jaar, en ik zit in de derde klas. Als je vragen hebt over huiswerk of zo, stuur me gerust een berichtje! Ik help graag. Wist je trouwens dat ik van voetbal houd? We kunnen ook praten over sport als je wilt!"',
        isAIGenerated: true,
        hints: ['Is het TE vriendelijk?', 'Voelt het natuurlijk?'],
        explanation: 'Dit bericht is TE perfect gestructureerd en vriendelijk. Echte tieners schrijven informeler, met typefouten en minder "perfecte" zinnen. Dit volgt een typisch AI-chatbot patroon.',
        telltaleSign: 'Te gepolijst en gestructureerd voor een tiener',
        category: 'Chatbot herkenning'
    },
    {
        id: 'g2',
        level: 'gevorderd',
        type: 'claim',
        title: '📊 Virale Claim',
        content: '"BEWEZEN: Als je elke dag 2 liter water drinkt, word je 30% slimmer! Wetenschappers van Harvard hebben dit ontdekt in een baanbrekend onderzoek."',
        isAIGenerated: false,
        hints: ['Zijn er bronnen?', 'Klinkt het te mooi om waar te zijn?'],
        explanation: 'Dit is menselijk geschreven nepnieuws/clickbait, GEEN AI. Maar het bevat typische misleidingstechnieken: overdreven claims, valse autoriteit ("Harvard"), en geen echte bron.',
        category: 'Misleidende claims'
    },
    {
        id: 'g3',
        level: 'gevorderd',
        type: 'image',
        title: '📸 Straatfoto',
        content: 'Een foto van een drukke winkelstraat. Alles ziet er normaal uit, maar bij nauwkeurig kijken zie je dat sommige winkelnaamborden onleesbare, vervormd tekst bevatten die nergens op slaat.',
        isAIGenerated: true,
        hints: ['Lees de teksten in de afbeelding', 'Klopt alle tekst?'],
        explanation: 'AI heeft grote moeite met het genereren van leesbare tekst in afbeeldingen. Winkelborden, posters, en T-shirts bevatten vaak onzin of vervormde letters.',
        telltaleSign: 'Onleesbare/onzinnige tekst op borden',
        category: 'Tekst in afbeeldingen'
    },

    // EXPERT - Very subtle
    {
        id: 'e1',
        level: 'expert',
        type: 'text',
        title: '✍️ Essay Fragment',
        content: '"De industriële revolutie was een periode van grote veranderingen. Het begon in Engeland rond 1760. Fabrieken ontstonden. Mensen verhuisden naar steden. De maatschappij veranderde fundamenteel. Nieuwe technologieën werden uitgevonden."',
        isAIGenerated: true,
        hints: ['Let op de zinsstructuur', 'Is er variatie in schrijfstijl?'],
        explanation: 'Dit is AI-gegenereerd. Let op: elke zin is kort en feitelijk. Er is geen persoonlijke stijl, geen meningen, en geen verbindingswoorden tussen zinnen. Dit is typisch voor basis-AI tekst.',
        telltaleSign: 'Monotone korte zinnen zonder persoonlijke stem',
        category: 'AI schrijfstijl'
    },
    {
        id: 'e2',
        level: 'expert',
        type: 'claim',
        title: '🗞️ Sociale Media Post',
        content: '"Mijn opa werkte 40 jaar in een fabriek. Hij had geen smartphone of computer nodig. Nu zit ik de hele dag achter een scherm en verdien ik minder dan hij. Misschien was vroeger toch beter? 🤔"',
        isAIGenerated: false,
        hints: ['Heeft het een persoonlijk perspectief?', 'Zijn er emoties?'],
        explanation: 'Dit is waarschijnlijk door een mens geschreven. Het heeft een persoonlijk verhaal, emotie, en reflectie. AI zou minder persoonlijke anekdotes gebruiken.',
        category: 'Persoonlijke verhalen'
    },
    {
        id: 'e3',
        level: 'expert',
        type: 'image',
        title: '🌅 Landschapsfoto',
        content: 'Een prachtige zonsondergang boven een meer met bergen op de achtergrond. De foto ziet er professioneel uit, de kleuren zijn levendig, en de reflectie in het water lijkt perfect.',
        isAIGenerated: true,
        hints: ['Is het TE perfect?', 'Zijn er onnatuurlijke elementen?'],
        explanation: 'AI-landschappen zijn vaak "te perfect" - de kleuren zijn te verzadigd, de compositie is te ideaal, en er zijn geen "imperfecties" die je in echte foto\'s ziet (vogels, wolken, menselijke aanwezigheid).',
        telltaleSign: 'Onnatuurlijk perfecte compositie en kleuren',
        category: 'Perfectie als indicator'
    }
];

// Swipe-style card component
const ContentCard: React.FC<{
    challenge: DetectionChallenge;
    showHints: boolean;
}> = ({ challenge, showHints }) => {
    const getIcon = () => {
        switch (challenge.type) {
            case 'image': return <Camera className="text-purple-400" size={20} />;
            case 'text': return <FileText className="text-blue-400" size={20} />;
            case 'claim': return <MessageSquare className="text-amber-400" size={20} />;
        }
    };

    const getTypeLabel = () => {
        switch (challenge.type) {
            case 'image': return 'Afbeelding Beschrijving';
            case 'text': return 'Tekst Fragment';
            case 'claim': return 'Online Claim';
        }
    };

    return (
        <div className="bg-slate-800/80 rounded-3xl border-2 border-slate-700/50 p-6 space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                    {getIcon()}
                </div>
                <span className="text-slate-400 text-sm font-medium">{getTypeLabel()}</span>
                <span className="ml-auto text-xs px-2 py-1 bg-slate-700/50 rounded-full text-slate-400">
                    {challenge.category}
                </span>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-700/30">
                <p className="text-white text-lg leading-relaxed italic">
                    "{challenge.content}"
                </p>
            </div>

            {showHints && (
                <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 animate-in fade-in">
                    <div className="flex items-start gap-2">
                        <HelpCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-amber-400 font-bold text-sm mb-1">💡 Hints:</p>
                            <ul className="text-amber-200/80 text-sm space-y-1">
                                {challenge.hints.map((hint, i) => (
                                    <li key={i}>• {hint}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const DeepfakeDetectorMission: React.FC<Props> = ({ onBack, onComplete, vsoProfile }) => {
    const [currentLevel, setCurrentLevel] = useState<'beginner' | 'gevorderd' | 'expert'>('beginner');
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [answer, setAnswer] = useState<'real' | 'ai' | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showHints, setShowHints] = useState(vsoProfile === 'dagbesteding');
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [showMissionComplete, setShowMissionComplete] = useState(false);

    const levelChallenges = CHALLENGES.filter(c => c.level === currentLevel);
    const currentChallenge = levelChallenges[currentChallengeIndex];
    const totalChallenges = CHALLENGES.length;

    const handleAnswer = (userAnswer: 'real' | 'ai') => {
        if (showFeedback) return;
        setAnswer(userAnswer);
        setShowFeedback(true);

        const isCorrect = (userAnswer === 'ai') === currentChallenge.isAIGenerated;

        if (isCorrect) {
            const streakBonus = streak >= 2 ? 50 : 0;
            setScore(prev => prev + 100 + streakBonus);
            setStreak(prev => prev + 1);
            setCorrectAnswers(prev => prev + 1);
        } else {
            setStreak(0);
        }
    };

    const handleNext = () => {
        setAnswer(null);
        setShowFeedback(false);
        setShowHints(false);

        if (currentChallengeIndex < levelChallenges.length - 1) {
            setCurrentChallengeIndex(prev => prev + 1);
        } else {
            if (currentLevel === 'expert') {
                setShowMissionComplete(true);
            } else {
                setShowLevelComplete(true);
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
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl">
                            <Eye size={64} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-white">Deepfake Detector</h1>
                        <p className="text-slate-400 text-lg">
                            Kun jij AI-gegenereerde content herkennen? Leer de tekenen te spotten
                            die verraden of iets door een mens of door AI is gemaakt!
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <p className="text-white font-bold text-sm">AI Afbeeldingen</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                            <p className="text-white font-bold text-sm">AI Teksten</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                            <p className="text-white font-bold text-sm">Nepnieuws</p>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                        <p className="text-amber-300 text-sm">
                            ⚠️ <strong>Let op:</strong> In deze missie beschrijven we afbeeldingen met tekst
                            in plaats van echte foto's te tonen. Dit helpt je te focussen op de details!
                        </p>
                    </div>

                    <button
                        onClick={() => setShowIntro(false)}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-black uppercase tracking-wide hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                        Start Detectie 🔍
                    </button>
                </div>
            </div>
        );
    }

    // Level complete screen
    if (showLevelComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
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
                                ? 'Je kent de basics! Nu de subtielere AI-tekens herkennen...'
                                : 'Uitstekend! Tijd voor de expert uitdagingen waar AI bijna niet te onderscheiden is.'}
                        </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <div className="flex justify-around">
                            <div>
                                <p className="text-3xl font-black text-emerald-400">{correctAnswers}</p>
                                <p className="text-slate-400 text-sm">Correct</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-purple-400">{score}</p>
                                <p className="text-slate-400 text-sm">Punten</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-amber-400">{streak}</p>
                                <p className="text-slate-400 text-sm">Max Streak</p>
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
        );
    }

    // Mission complete screen
    if (showMissionComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
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
                            Je bent nu een echte Deepfake Detective! Je kunt AI-gegenereerde content
                            herkennen en kritisch nadenken over wat je online ziet.
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

                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                        <h3 className="text-lg font-bold text-purple-400 mb-2">🧠 Wat heb je geleerd?</h3>
                        <ul className="text-slate-300 text-sm text-left space-y-1">
                            <li>✅ AI-afbeeldingen herkennen aan detail-fouten</li>
                            <li>✅ AI-tekst herkennen aan monotone schrijfstijl</li>
                            <li>✅ Verschil tussen AI en menselijk geschreven fake nieuws</li>
                            <li>✅ Kritisch kijken naar "perfecte" content</li>
                            <li>✅ Chatbots herkennen aan te gepolijste antwoorden</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => onComplete(true)}
                        className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-2xl font-black uppercase tracking-wide hover:shadow-lg transition-all"
                    >
                        Terug naar Mission Control 🚀
                    </button>
                </div>
            </div>
        );
    }

    // Main game screen
    const isCorrect = answer !== null && (answer === 'ai') === currentChallenge.isAIGenerated;

    return (
        <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900">
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
                                {currentLevel === 'beginner' ? '🌱 Beginner' :
                                    currentLevel === 'gevorderd' ? '⚡ Gevorderd' : '🎯 Expert'}
                            </span>
                            {vsoProfile && (
                                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30 font-bold uppercase tracking-tight ml-2">
                                    {vsoProfile === 'dagbesteding' ? 'Focus: Ervaren' : 'Focus: Beheersen'}
                                </span>
                            )}
                        </div>

                        {streak >= 2 && (
                            <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-full animate-pulse">
                                <Zap size={14} className="text-amber-400" />
                                <span className="text-amber-400 font-bold text-xs">{streak}x</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-full">
                            <Sparkles size={14} className="text-purple-400" />
                            <span className="text-white font-bold text-sm">{score}</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-slate-800">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${((currentChallengeIndex + 1) / totalChallenges) * 100}%` }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                {/* Challenge title */}
                <div className="text-center">
                    <h2 className="text-2xl font-black text-white">{currentChallenge.title}</h2>
                    <p className="text-slate-400 mt-1">Is dit door een mens gemaakt of door AI gegenereerd?</p>
                </div>

                {/* Content card */}
                <ContentCard challenge={currentChallenge} showHints={showHints} />

                {/* Hint button */}
                {!showFeedback && !showHints && (
                    <div className="text-center">
                        <button
                            onClick={() => setShowHints(true)}
                            className="text-slate-400 text-sm font-medium hover:text-amber-400 transition-colors flex items-center gap-2 mx-auto"
                        >
                            <HelpCircle size={16} />
                            Hint nodig?
                        </button>
                    </div>
                )}

                {/* Answer buttons */}
                {!showFeedback && (
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleAnswer('real')}
                            className="py-6 bg-emerald-500/20 hover:bg-emerald-500/30 border-2 border-emerald-500/50 hover:border-emerald-500 rounded-2xl transition-all group"
                        >
                            <ThumbsUp size={32} className="text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-emerald-400 font-black text-lg">ECHT</span>
                            <p className="text-emerald-400/60 text-xs mt-1">Door een mens gemaakt</p>
                        </button>

                        <button
                            onClick={() => handleAnswer('ai')}
                            className="py-6 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 hover:border-red-500 rounded-2xl transition-all group"
                        >
                            <ThumbsDown size={32} className="text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-red-400 font-black text-lg">AI</span>
                            <p className="text-red-400/60 text-xs mt-1">Door AI gegenereerd</p>
                        </button>
                    </div>
                )}

                {/* Feedback */}
                {showFeedback && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        {/* Result banner */}
                        <div className={`rounded-2xl p-6 border-2 ${isCorrect
                                ? 'bg-emerald-500/20 border-emerald-500'
                                : 'bg-red-500/20 border-red-500'
                            }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                                    }`}>
                                    {isCorrect ? <Check size={32} className="text-white" /> : <X size={32} className="text-white" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-black text-xl ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {isCorrect ? 'Correct!' : 'Helaas!'}
                                    </p>
                                    <p className="text-white">
                                        Dit was {currentChallenge.isAIGenerated ? 'AI-gegenereerd' : 'door een mens gemaakt'}.
                                    </p>
                                </div>
                                {isCorrect && streak >= 2 && (
                                    <div className="text-right">
                                        <p className="text-amber-400 font-bold text-sm">🔥 +50 bonus!</p>
                                        <p className="text-amber-400/60 text-xs">{streak}x streak</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Brain size={18} className="text-purple-400" />
                                Uitleg
                            </h4>
                            <p className="text-slate-300 text-sm">{currentChallenge.explanation}</p>

                            {currentChallenge.telltaleSign && (
                                <div className="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                    <p className="text-purple-300 text-sm">
                                        <strong>🔍 Kenmerkend teken:</strong> {currentChallenge.telltaleSign}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-black uppercase tracking-wide hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            Volgende <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
