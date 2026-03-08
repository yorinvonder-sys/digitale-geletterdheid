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
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';

interface DeepfakeDetectorState {
    currentLevel: 'beginner' | 'gevorderd' | 'expert';
    currentChallengeIndex: number;
    score: number;
    streak: number;
    correctAnswers: number;
    showIntro: boolean;
    showLevelComplete: boolean;
    showMissionComplete: boolean;
}

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
            case 'image': return <Camera className="text-[#8B6F9E]" size={20} />;
            case 'text': return <FileText className="text-[#2A9D8F]" size={20} />;
            case 'claim': return <MessageSquare className="text-[#D97757]" size={20} />;
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
        <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-[#FAF9F0] rounded-lg border border-[#F0EEE8]">
                    {getIcon()}
                </div>
                <span className="text-[#6B6B66] text-sm font-medium">{getTypeLabel()}</span>
                <span className="ml-auto text-xs px-2 py-1 bg-[#FAF9F0] rounded-full text-[#6B6B66] border border-[#E8E6DF] inline-flex">
                    {challenge.category}
                </span>
            </div>

            <div className="bg-[#FAF9F0] rounded-2xl p-5 border border-[#F0EEE8]">
                <p className="text-[#1A1A19] text-lg leading-relaxed italic">
                    "{challenge.content}"
                </p>
            </div>

            {showHints && (
                <div className="bg-[#D97757]/10 rounded-xl p-4 border border-[#D97757]/20 animate-in fade-in">
                    <div className="flex items-start gap-2">
                        <HelpCircle size={18} className="text-[#D97757] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[#D97757] font-bold text-sm mb-1">Hints:</p>
                            <ul className="text-[#3D3D38] text-sm space-y-1">
                                {challenge.hints.map((hint, i) => (
                                    <li key={i}>- {hint}</li>
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
    const { state, setState, clearSave } = useMissionAutoSave<DeepfakeDetectorState>(
        'deepfake-detector',
        {
            currentLevel: 'beginner',
            currentChallengeIndex: 0,
            score: 0,
            streak: 0,
            correctAnswers: 0,
            showIntro: true,
            showLevelComplete: false,
            showMissionComplete: false,
        }
    );

    const { currentLevel, currentChallengeIndex, score, streak, correctAnswers, showIntro, showLevelComplete, showMissionComplete } = state;

    // Transient UI state - niet opgeslagen
    const [answer, setAnswer] = useState<'real' | 'ai' | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showHints, setShowHints] = useState(vsoProfile === 'dagbesteding');

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
            setState(prev => ({
                ...prev,
                score: prev.score + 100 + streakBonus,
                streak: prev.streak + 1,
                correctAnswers: prev.correctAnswers + 1,
            }));
        } else {
            setState(prev => ({ ...prev, streak: 0 }));
        }
    };

    const handleNext = () => {
        setAnswer(null);
        setShowFeedback(false);
        setShowHints(false);

        if (currentChallengeIndex < levelChallenges.length - 1) {
            setState(prev => ({ ...prev, currentChallengeIndex: prev.currentChallengeIndex + 1 }));
        } else {
            if (currentLevel === 'expert') {
                setState(prev => ({ ...prev, showMissionComplete: true }));
            } else {
                setState(prev => ({ ...prev, showLevelComplete: true }));
            }
        }
    };

    const handleNextLevel = () => {
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
            <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#D97757]/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-[#D97757] to-[#C46849] w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl">
                            <Eye size={64} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Deepfake Detector</h1>
                        <p className="text-[#3D3D38] text-lg">
                            Kun jij AI-gegenereerde content herkennen? Leer de tekenen te spotten
                            die verraden of iets door een mens of door AI is gemaakt!
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white rounded-xl p-4 border border-[#E8E6DF]">
                            <Camera className="w-8 h-8 text-[#8B6F9E] mx-auto mb-2" />
                            <p className="text-[#1A1A19] font-bold text-sm">AI Afbeeldingen</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-[#E8E6DF]">
                            <FileText className="w-8 h-8 text-[#2A9D8F] mx-auto mb-2" />
                            <p className="text-[#1A1A19] font-bold text-sm">AI Teksten</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-[#E8E6DF]">
                            <Shield className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
                            <p className="text-[#1A1A19] font-bold text-sm">Nepnieuws</p>
                        </div>
                    </div>

                    <div className="bg-[#D97757]/10 rounded-xl p-4 border border-[#D97757]/20">
                        <p className="text-[#3D3D38] text-sm">
                            <strong className="text-[#D97757]">Let op:</strong> In deze missie beschrijven we afbeeldingen met tekst
                            in plaats van echte foto's te tonen. Dit helpt je te focussen op de details!
                        </p>
                    </div>

                    <button
                        onClick={() => setState(prev => ({ ...prev, showIntro: false }))}
                        className="w-full py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#D97757]/30 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                    >
                        Start Detectie
                    </button>
                </div>
            </div>
        );
    }

    // Level complete screen
    if (showLevelComplete) {
        return (
            <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#10B981]/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-[#10B981] w-24 h-24 rounded-full flex items-center justify-center shadow-2xl">
                            <Trophy size={48} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            {currentLevel === 'beginner' ? 'Beginner Voltooid!' : 'Gevorderd Voltooid!'}
                        </h2>
                        <p className="text-[#3D3D38]">
                            {currentLevel === 'beginner'
                                ? 'Je kent de basics! Nu de subtielere AI-tekens herkennen...'
                                : 'Uitstekend! Tijd voor de expert uitdagingen waar AI bijna niet te onderscheiden is.'}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#E8E6DF]">
                        <div className="flex justify-around">
                            <div>
                                <p className="text-3xl font-black text-[#10B981]">{correctAnswers}</p>
                                <p className="text-[#6B6B66] text-sm">Correct</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-[#D97757]">{score}</p>
                                <p className="text-[#6B6B66] text-sm">Punten</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-[#D97757]">{streak}</p>
                                <p className="text-[#6B6B66] text-sm">Max Streak</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleNextLevel}
                        className="w-full py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#D97757]/30 transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757]"
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
            <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#D97757]/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-[#D97757] to-[#C46849] w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                            <Sparkles size={64} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>MISSIE VOLTOOID!</h1>
                        <p className="text-[#3D3D38] text-lg">
                            Je bent nu een echte Deepfake Detective! Je kunt AI-gegenereerde content
                            herkennen en kritisch nadenken over wat je online ziet.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#E8E6DF]">
                        <div className="flex justify-around">
                            <div>
                                <p className="text-3xl font-black text-[#10B981]">{correctAnswers}/{totalChallenges}</p>
                                <p className="text-[#6B6B66] text-sm">Correct</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-[#D97757]">{score}</p>
                                <p className="text-[#6B6B66] text-sm">Totaal Punten</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#8B6F9E]/10 rounded-2xl p-6 border border-[#8B6F9E]/20">
                        <h3 className="text-lg font-bold text-[#8B6F9E] mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Wat heb je geleerd?</h3>
                        <ul className="text-[#3D3D38] text-sm text-left space-y-1">
                            <li>AI-afbeeldingen herkennen aan detail-fouten</li>
                            <li>AI-tekst herkennen aan monotone schrijfstijl</li>
                            <li>Verschil tussen AI en menselijk geschreven fake nieuws</li>
                            <li>Kritisch kijken naar "perfecte" content</li>
                            <li>Chatbots herkennen aan te gepolijste antwoorden</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => { clearSave(); onComplete(true); }}
                        className="w-full py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#D97757]/30 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                    >
                        Terug naar Mission Control
                    </button>
                </div>
            </div>
        );
    }

    // Main game screen
    const isCorrect = answer !== null && (answer === 'ai') === currentChallenge.isAIGenerated;

    return (
        <div className="min-h-screen overflow-y-auto bg-[#FAF9F0]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E8E6DF]">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="p-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex ${currentLevel === 'beginner' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' :
                                    currentLevel === 'gevorderd' ? 'bg-[#D97757]/10 text-[#D97757] border-[#D97757]/30' :
                                        'bg-[#8B6F9E]/10 text-[#8B6F9E] border-[#8B6F9E]/30'
                                }`}>
                                {currentLevel === 'beginner' ? 'Beginner' :
                                    currentLevel === 'gevorderd' ? 'Gevorderd' : 'Expert'}
                            </span>
                            {vsoProfile && (
                                <span className="text-[10px] bg-[#8B6F9E]/10 text-[#8B6F9E] px-2 py-1 rounded-full border border-[#8B6F9E]/30 font-bold uppercase tracking-tight ml-2 inline-flex">
                                    {vsoProfile === 'dagbesteding' ? 'Focus: Ervaren' : 'Focus: Beheersen'}
                                </span>
                            )}
                        </div>

                        {streak >= 2 && (
                            <div className="flex items-center gap-1 bg-[#D97757]/10 px-2 py-1 rounded-full animate-pulse border border-[#D97757]/30">
                                <Zap size={14} className="text-[#D97757]" />
                                <span className="text-[#D97757] font-bold text-xs">{streak}x</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-[#E8E6DF]">
                            <Sparkles size={14} className="text-[#D97757]" />
                            <span className="text-[#1A1A19] font-bold text-sm">{score}</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-[#F0EEE8]">
                    <div
                        className="h-full bg-gradient-to-r from-[#D97757] to-[#C46849] transition-all duration-500"
                        style={{ width: `${((currentChallengeIndex + 1) / totalChallenges) * 100}%` }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                {/* Challenge title */}
                <div className="text-center">
                    <h2 className="text-2xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{currentChallenge.title}</h2>
                    <p className="text-[#6B6B66] mt-1">Is dit door een mens gemaakt of door AI gegenereerd?</p>
                </div>

                {/* Content card */}
                <ContentCard challenge={currentChallenge} showHints={showHints} />

                {/* Hint button */}
                {!showFeedback && !showHints && (
                    <div className="text-center">
                        <button
                            onClick={() => setShowHints(true)}
                            className="text-[#6B6B66] text-sm font-medium hover:text-[#D97757] transition-all duration-300 flex items-center gap-2 mx-auto"
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
                            className="py-6 bg-[#10B981]/10 hover:bg-[#10B981]/20 border-2 border-[#10B981]/30 hover:border-[#10B981] rounded-2xl transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-[#D97757]"
                        >
                            <ThumbsUp size={32} className="text-[#10B981] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[#10B981] font-black text-lg">ECHT</span>
                            <p className="text-[#10B981]/60 text-xs mt-1">Door een mens gemaakt</p>
                        </button>

                        <button
                            onClick={() => handleAnswer('ai')}
                            className="py-6 bg-[#8B6F9E]/10 hover:bg-[#8B6F9E]/20 border-2 border-[#8B6F9E]/30 hover:border-[#8B6F9E] rounded-2xl transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-[#D97757]"
                        >
                            <ThumbsDown size={32} className="text-[#8B6F9E] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[#8B6F9E] font-black text-lg">AI</span>
                            <p className="text-[#8B6F9E]/60 text-xs mt-1">Door AI gegenereerd</p>
                        </button>
                    </div>
                )}

                {/* Feedback */}
                {showFeedback && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        {/* Result banner */}
                        <div className={`rounded-2xl p-6 border-2 ${isCorrect
                                ? 'bg-[#10B981]/10 border-[#10B981]'
                                : 'bg-red-500/10 border-red-500'
                            }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isCorrect ? 'bg-[#10B981]' : 'bg-red-500'
                                    }`}>
                                    {isCorrect ? <Check size={32} className="text-white" /> : <X size={32} className="text-white" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-black text-xl ${isCorrect ? 'text-[#10B981]' : 'text-red-500'}`}>
                                        {isCorrect ? 'Correct!' : 'Helaas!'}
                                    </p>
                                    <p className="text-[#1A1A19]">
                                        Dit was {currentChallenge.isAIGenerated ? 'AI-gegenereerd' : 'door een mens gemaakt'}.
                                    </p>
                                </div>
                                {isCorrect && streak >= 2 && (
                                    <div className="text-right">
                                        <p className="text-[#D97757] font-bold text-sm">+50 bonus!</p>
                                        <p className="text-[#D97757]/60 text-xs">{streak}x streak</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="bg-white rounded-xl p-5 border border-[#E8E6DF]">
                            <h4 className="text-[#1A1A19] font-bold mb-2 flex items-center gap-2">
                                <Brain size={18} className="text-[#8B6F9E]" />
                                Uitleg
                            </h4>
                            <p className="text-[#3D3D38] text-sm">{currentChallenge.explanation}</p>

                            {currentChallenge.telltaleSign && (
                                <div className="mt-3 p-3 bg-[#2A9D8F]/10 rounded-lg border border-[#2A9D8F]/20">
                                    <p className="text-[#3D3D38] text-sm">
                                        <strong className="text-[#2A9D8F]">Kenmerkend teken:</strong> {currentChallenge.telltaleSign}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#D97757]/30 transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                        >
                            Volgende <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
