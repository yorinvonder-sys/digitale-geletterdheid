/**
 * DeepfakeDetectorMission.tsx
 * 
 * Leerlingen leren AI-gegenereerde content herkennen.
 * Ze analyseren afbeeldingen, teksten en claims om te bepalen wat echt of fake is.
 * 
 * SLO-doelen: Mediawijsheid, kritische media-analyse, AI-awareness
 */

import React, { useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Check, X, Eye, Brain, Shield, Sparkles, ThumbsUp, ThumbsDown, HelpCircle, Zap, Camera, FileText, MessageSquare, MessageCircle, Lightbulb } from 'lucide-react';
import { UserStats, VsoProfile } from '@/types';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { StudentAIChat } from '@/features/ai-chat/StudentAIChat';
import { MissionGoalBanner } from './templates/shared/MissionGoalBanner';
import type { MissionGoal } from './templates/shared/types';

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
    userId?: string; // voor AI-copiloot
}

const MISSION_GOAL: MissionGoal = {
    primaryGoal: 'Herken deepfake-signalen in beeld, tekst en claims en maak een kort actieplan tegen misleiding.',
    criteria: {
        type: 'component-complete',
        min: 3,
        description: 'Alle drie Deepfake Detector levels zijn voltooid.',
    },
    evidence: 'Classificaties, uitleg bij signalen en een afrondende beoordeling.',
};

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
    /** 3e stap van de 3-stappenmethode: verdiepingsvraag na de uitleg */
    challengeQuestion: string;
    /** Vereenvoudigde versie voor VSO dagbesteding */
    challengeQuestionVso?: string;
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
        category: 'Anatomie fouten',
        challengeQuestion: 'Welke andere lichaamsdelen zou je altijd controleren als je twijfelt of een foto echt is?',
        challengeQuestionVso: 'Als je een foto ziet: wat check je als eerste om te zien of het echt is?',
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
        category: 'Nepnieuws herkennen',
        challengeQuestion: 'Als je een bericht ziet dat te mooi of te bizar klinkt om waar te zijn — waar zou je het dan controleren?',
        challengeQuestionVso: 'Je ziet een raar nieuwsbericht. Wat doe je als eerste?',
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
        category: 'Detail fouten',
        challengeQuestion: 'Naast vingers en sieraden: welke andere kleine details zou je bij een portretfoto altijd checken?',
        challengeQuestionVso: 'In een echte foto: kloppen de details altijd? Geef een voorbeeld.',
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
        category: 'Chatbot herkenning',
        challengeQuestion: 'Hoe zou je veilig kunnen checken of een online profiel van een echte persoon is, zonder zelf risico te lopen?',
        challengeQuestionVso: 'Je krijgt een berichtje van iemand die je niet kent. Wat doe je?',
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
        category: 'Misleidende claims',
        challengeQuestion: 'Waarom werkt een claim als "bewezen door Harvard-wetenschappers" zo goed, ook als er geen bron bij staat?',
        challengeQuestionVso: 'Je ziet een bericht met "wetenschappers bewezen dat...". Wat doe je voordat je het deelt?',
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
        category: 'Tekst in afbeeldingen',
        challengeQuestion: 'Naast tekst op borden: op welke andere plekken in een foto zou AI nog meer fouten kunnen maken met letters of cijfers?',
        challengeQuestionVso: 'Je ziet een foto van een straat. Waar kijk jij naar om te zien of de tekst klopt?',
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
        category: 'AI schrijfstijl',
        challengeQuestion: 'Hoe zou jij dit essay herschrijven om het menselijker te laten klinken? Wat zou je toevoegen?',
        challengeQuestionVso: 'Wat mist er in dit stuk om het "menselijk" te laten klinken?',
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
        category: 'Persoonlijke verhalen',
        challengeQuestion: 'Kan een AI ook een overtuigend persoonlijk verhaal schrijven? Hoe zou je dat onderscheiden van een echt verhaal?',
        challengeQuestionVso: 'Is een persoonlijk verhaal altijd echt? Hoe check je dat?',
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
        category: 'Perfectie als indicator',
        challengeQuestion: 'Waarom is "te perfect" een waarschuwingssignaal bij digitale content? Wanneer is perfectie juist verdacht?',
        challengeQuestionVso: 'Zou jij een "te mooie" foto vertrouwen? Waarom wel of niet?',
    }
];

// Swipe-style card component
const ContentCard: React.FC<{
    challenge: DetectionChallenge;
    showHints: boolean;
}> = ({ challenge, showHints }) => {
    const getIcon = () => {
        switch (challenge.type) {
            case 'image': return <Camera className="text-[#0B453F]" size={20} />;
            case 'text': return <FileText className="text-[#5F947D]" size={20} />;
            case 'claim': return <MessageSquare className="text-[#D97848]" size={20} />;
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
        <div className="bg-white rounded-2xl border border-[#E7D8BD] p-6 space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-[#FCF6EA] rounded-lg border border-[#E7D8BD]">
                    {getIcon()}
                </div>
                <span className="text-[#445865] text-sm font-medium">{getTypeLabel()}</span>
                <span className="ml-auto text-xs px-2 py-1 bg-[#FCF6EA] rounded-full text-[#445865] border border-[#E7D8BD] inline-flex">
                    {challenge.category}
                </span>
            </div>

            <div className="bg-[#FCF6EA] rounded-2xl p-5 border border-[#E7D8BD]">
                <p className="text-[#08283B] text-lg leading-relaxed italic">
                    "{challenge.content}"
                </p>
            </div>

            {showHints && (
                <div className="bg-[#D97848]/10 rounded-xl p-4 border border-[#D97848]/20 animate-in fade-in">
                    <div className="flex items-start gap-2">
                        <HelpCircle size={18} className="text-[#D97848] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[#D97848] font-bold text-sm mb-1">Hints:</p>
                            <ul className="text-[#445865] text-sm space-y-1">
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

export const DeepfakeDetectorMission: React.FC<Props> = ({ onBack, onComplete, vsoProfile, userId }) => {
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
    const [isChatOpen, setIsChatOpen] = useState(false);

    const levelChallenges = CHALLENGES.filter(c => c.level === currentLevel);
    const currentChallenge = levelChallenges[currentChallengeIndex];
    const totalChallenges = CHALLENGES.length;

    // Globale challenge-index voor correcte voortgangsbalk over alle niveaus
    const globalChallengeIndex =
        currentLevel === 'beginner' ? currentChallengeIndex :
        currentLevel === 'gevorderd' ? 3 + currentChallengeIndex :
        6 + currentChallengeIndex;

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
        // VSO dagbesteding-leerlingen krijgen hints altijd aan
        setShowHints(vsoProfile === 'dagbesteding');

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
            <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center p-4 pb-24 sm:pb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-lg w-full text-center space-y-5 sm:space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#D97848]/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-[#D97848] to-[#D97848] w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl sm:w-32 sm:h-32">
                            <Eye size={56} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h1 className="text-3xl font-black text-[#08283B] sm:text-4xl" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Deepfake Detector</h1>
                        <p className="text-[#445865] text-base sm:text-lg">
                            Kun jij AI-gegenereerde content herkennen? Leer de tekenen te spotten
                            die verraden of iets door een mens of door AI is gemaakt!
                        </p>
                    </div>

                    <MissionGoalBanner goal={MISSION_GOAL} />

                    <div className="grid grid-cols-3 gap-2 text-center sm:gap-4">
                        <div className="bg-white rounded-xl p-3 border border-[#E7D8BD] sm:p-4">
                            <Camera className="w-7 h-7 text-[#0B453F] mx-auto mb-2 sm:w-8 sm:h-8" />
                            <p className="text-[#08283B] font-bold text-xs sm:text-sm">AI Afbeeldingen</p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-[#E7D8BD] sm:p-4">
                            <FileText className="w-7 h-7 text-[#5F947D] mx-auto mb-2 sm:w-8 sm:h-8" />
                            <p className="text-[#08283B] font-bold text-xs sm:text-sm">AI Teksten</p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-[#E7D8BD] sm:p-4">
                            <Shield className="w-7 h-7 text-[#5F947D] mx-auto mb-2 sm:w-8 sm:h-8" />
                            <p className="text-[#08283B] font-bold text-xs sm:text-sm">Nepnieuws</p>
                        </div>
                    </div>

                    <div className="bg-[#D97848]/10 rounded-xl p-4 border border-[#D97848]/20">
                        <p className="text-[#445865] text-sm">
                            <strong className="text-[#D97848]">Let op:</strong> In deze missie beschrijven we afbeeldingen met tekst
                            in plaats van echte foto's te tonen. Dit helpt je te focussen op de details!
                        </p>
                    </div>

                    <button
                        onClick={() => setState(prev => ({ ...prev, showIntro: false }))}
                        className="fixed inset-x-4 bottom-4 z-30 py-4 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black uppercase tracking-wide shadow-2xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848] sm:static sm:w-full sm:hover:shadow-lg sm:hover:shadow-[#D97848]/30"
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
            <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#5F947D]/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-[#5F947D] w-24 h-24 rounded-full flex items-center justify-center shadow-2xl">
                            <Trophy size={48} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            {currentLevel === 'beginner' ? 'Beginner Voltooid!' : 'Gevorderd Voltooid!'}
                        </h2>
                        <p className="text-[#445865]">
                            {currentLevel === 'beginner'
                                ? 'Je kent de basics! Nu de subtielere AI-tekens herkennen...'
                                : 'Uitstekend! Tijd voor de expert uitdagingen waar AI bijna niet te onderscheiden is.'}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#E7D8BD]">
                        <div className="flex justify-around">
                            <div>
                                <p className="text-3xl font-black text-[#5F947D]">{correctAnswers}</p>
                                <p className="text-[#445865] text-sm">Correct</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-[#D97848]">{score}</p>
                                <p className="text-[#445865] text-sm">Punten</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-[#D97848]">{streak}</p>
                                <p className="text-[#445865] text-sm">Max Streak</p>
                            </div>
                        </div>
                    </div>

                    {/* Reflectievraag tussen levels */}
                    <div className="bg-[#5F947D]/10 rounded-2xl p-5 border border-[#5F947D]/20 text-left">
                        <p className="text-[#5F947D] font-bold text-sm mb-1 flex items-center gap-2">
                            <Lightbulb size={16} />
                            Denk even terug
                        </p>
                        <p className="text-[#445865] text-sm">
                            {currentLevel === 'beginner'
                                ? 'Welk AI-kenmerk uit dit level vond jij het duidelijkst? En welke zou je makkelijk missen in het echte leven?'
                                : 'De gevorderde uitdagingen zijn lastiger. Wat is het verschil tussen misleidend menselijk geschreven content en AI-content?'}
                        </p>
                    </div>

                    <button
                        onClick={handleNextLevel}
                        className="w-full py-4 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#D97848]/30 transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97848]"
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
            <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#D97848]/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-[#D97848] to-[#D97848] w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                            <Sparkles size={64} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>MISSIE VOLTOOID!</h1>
                        <p className="text-[#445865] text-lg">
                            Je bent nu een echte Deepfake Detective! Je kunt AI-gegenereerde content
                            herkennen en kritisch nadenken over wat je online ziet.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#E7D8BD]">
                        <div className="flex justify-around">
                            <div>
                                <p className="text-3xl font-black text-[#5F947D]">{correctAnswers}/{totalChallenges}</p>
                                <p className="text-[#445865] text-sm">Correct</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-[#D97848]">{score}</p>
                                <p className="text-[#445865] text-sm">Totaal Punten</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0B453F]/10 rounded-2xl p-6 border border-[#0B453F]/20">
                        <h3 className="text-lg font-bold text-[#0B453F] mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Wat heb je geleerd?</h3>
                        <ul className="text-[#445865] text-sm text-left space-y-1">
                            <li>AI-afbeeldingen herkennen aan detail-fouten</li>
                            <li>AI-tekst herkennen aan monotone schrijfstijl</li>
                            <li>Verschil tussen AI en menselijk geschreven fake nieuws</li>
                            <li>Kritisch kijken naar "perfecte" content</li>
                            <li>Chatbots herkennen aan te gepolijste antwoorden</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => { clearSave(); onComplete(true); }}
                        className="w-full py-4 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#D97848]/30 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]"
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
        <div className="min-h-screen overflow-y-auto bg-[#FCF6EA]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E7D8BD]">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        aria-label="Terug naar Mission Control"
                        className="p-2 text-[#445865] hover:text-[#08283B] transition-all duration-300"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex ${currentLevel === 'beginner' ? 'bg-[#5F947D]/10 text-[#5F947D] border-[#5F947D]/30' :
                                    currentLevel === 'gevorderd' ? 'bg-[#D97848]/10 text-[#D97848] border-[#D97848]/30' :
                                        'bg-[#0B453F]/10 text-[#0B453F] border-[#0B453F]/30'
                                }`}>
                                {currentLevel === 'beginner' ? 'Beginner' :
                                    currentLevel === 'gevorderd' ? 'Gevorderd' : 'Expert'}
                            </span>
                            {vsoProfile && (
                                <span className="text-[10px] bg-[#0B453F]/10 text-[#0B453F] px-2 py-1 rounded-full border border-[#0B453F]/30 font-bold uppercase tracking-tight ml-2 inline-flex">
                                    {vsoProfile === 'dagbesteding' ? 'Focus: Ervaren' : 'Focus: Beheersen'}
                                </span>
                            )}
                        </div>

                        {streak >= 2 && (
                            <div className="flex items-center gap-1 bg-[#D97848]/10 px-2 py-1 rounded-full animate-pulse border border-[#D97848]/30">
                                <Zap size={14} className="text-[#D97848]" />
                                <span className="text-[#D97848] font-bold text-xs">{streak}x</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-[#E7D8BD]">
                            <Sparkles size={14} className="text-[#D97848]" />
                            <span className="text-[#08283B] font-bold text-sm">{score}</span>
                        </div>

                        {/* AI-copiloot knop */}
                        <button
                            onClick={() => setIsChatOpen(true)}
                            aria-label="Open AI-assistent"
                            className="flex items-center gap-1.5 bg-[#0B453F] hover:bg-[#0B453F] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shadow-sm"
                        >
                            <MessageCircle size={14} />
                            <span className="hidden sm:inline">Vraag hulp</span>
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div
                    className="h-1 bg-[#E7D8BD]"
                    role="progressbar"
                    aria-valuenow={globalChallengeIndex + 1}
                    aria-valuemax={totalChallenges}
                    aria-label={`Missie voortgang: ${globalChallengeIndex + 1} van ${totalChallenges} challenges`}
                >
                    <div
                        className="h-full bg-gradient-to-r from-[#D97848] to-[#D97848] transition-all duration-500"
                        style={{ width: `${((globalChallengeIndex + 1) / totalChallenges) * 100}%` }}
                    />
                </div>
            </div>

            {/* AI-copiloot — gebruikt missie-specifieke deepfake-detector instructie server-side */}
            <StudentAIChat
                roleId="deepfake-detector"
                userIdentifier={userId ?? 'anonymous'}
                isOpen={isChatOpen}
                onOpenChange={setIsChatOpen}
                context={{
                    currentChallenge: currentChallenge ? {
                        title: currentChallenge.title,
                        description: currentChallenge.content,
                        hint: showFeedback ? currentChallenge.explanation : currentChallenge.hints[0],
                    } : null,
                    missionStage: showFeedback ? 'feedback' : 'question',
                    challengeQuestion: showFeedback
                        ? (vsoProfile === 'dagbesteding' && currentChallenge?.challengeQuestionVso
                            ? currentChallenge.challengeQuestionVso
                            : currentChallenge?.challengeQuestion)
                        : undefined,
                    level: currentLevel,
                    vsoProfile: vsoProfile ?? null,
                }}
            />

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                {/* Challenge title */}
                <div className="text-center">
                    <h2 className="text-2xl font-black text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{currentChallenge.title}</h2>
                    <p className="text-[#445865] mt-1">Is dit door een mens gemaakt of door AI gegenereerd?</p>
                </div>

                {/* Content card */}
                <ContentCard challenge={currentChallenge} showHints={showHints} />

                {/* Hint button */}
                {!showFeedback && !showHints && (
                    <div className="text-center">
                        <button
                            onClick={() => setShowHints(true)}
                            className="text-[#445865] text-sm font-medium hover:text-[#D97848] transition-all duration-300 flex items-center gap-2 mx-auto"
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
                            className="py-6 bg-[#5F947D]/10 hover:bg-[#5F947D]/20 border-2 border-[#5F947D]/30 hover:border-[#5F947D] rounded-2xl transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-[#D97848]"
                        >
                            <ThumbsUp size={32} className="text-[#5F947D] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[#5F947D] font-black text-lg">ECHT</span>
                            <p className="text-[#5F947D]/60 text-xs mt-1">Door een mens gemaakt</p>
                        </button>

                        <button
                            onClick={() => handleAnswer('ai')}
                            className="py-6 bg-[#0B453F]/10 hover:bg-[#0B453F]/20 border-2 border-[#0B453F]/30 hover:border-[#0B453F] rounded-2xl transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-[#D97848]"
                        >
                            <ThumbsDown size={32} className="text-[#0B453F] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[#0B453F] font-black text-lg">AI</span>
                            <p className="text-[#0B453F]/60 text-xs mt-1">Door AI gegenereerd</p>
                        </button>
                    </div>
                )}

                {/* Feedback */}
                {showFeedback && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        {/* Result banner */}
                        <div className={`rounded-2xl p-6 border-2 ${isCorrect
                                ? 'bg-[#5F947D]/10 border-[#5F947D]'
                                : 'bg-lab-coral/10 border-lab-coral'
                            }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isCorrect ? 'bg-[#5F947D]' : 'bg-lab-coral'
                                    }`}>
                                    {isCorrect ? <Check size={32} className="text-white" /> : <X size={32} className="text-white" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-black text-xl ${isCorrect ? 'text-[#5F947D]' : 'text-lab-muted'}`}>
                                        {isCorrect ? 'Correct!' : 'Helaas!'}
                                    </p>
                                    <p className="text-[#08283B]">
                                        Dit was {currentChallenge.isAIGenerated ? 'AI-gegenereerd' : 'door een mens gemaakt'}.
                                    </p>
                                </div>
                                {isCorrect && streak >= 2 && (
                                    <div className="text-right">
                                        <p className="text-[#D97848] font-bold text-sm">+50 bonus!</p>
                                        <p className="text-[#D97848]/60 text-xs">{streak}x streak</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stap 2: Uitleg */}
                        <div className="bg-white rounded-xl p-5 border border-[#E7D8BD]">
                            <h4 className="text-[#08283B] font-bold mb-2 flex items-center gap-2">
                                <Brain size={18} className="text-[#0B453F]" />
                                Uitleg
                            </h4>
                            <p className="text-[#445865] text-sm">{currentChallenge.explanation}</p>

                            {currentChallenge.telltaleSign && (
                                <div className="mt-3 p-3 bg-[#5F947D]/10 rounded-lg border border-[#5F947D]/20">
                                    <p className="text-[#445865] text-sm">
                                        <strong className="text-[#5F947D]">Kenmerkend teken:</strong> {currentChallenge.telltaleSign}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Stap 3: Challenge — verdiepingsvraag (3-stappenmethode) */}
                        <div className="bg-gradient-to-br from-[#0B453F]/10 to-[#0B453F]/5 rounded-xl p-5 border border-[#0B453F]/25">
                            <h4 className="text-[#0B453F] font-bold mb-2 flex items-center gap-2 text-sm">
                                <Lightbulb size={16} className="text-[#0B453F]" />
                                Denk verder
                            </h4>
                            <p className="text-[#445865] text-sm leading-relaxed">
                                {vsoProfile === 'dagbesteding' && currentChallenge.challengeQuestionVso
                                    ? currentChallenge.challengeQuestionVso
                                    : currentChallenge.challengeQuestion}
                            </p>
                            <p className="text-[#0B453F]/60 text-xs mt-2 italic">
                                Denk hierover na, of vraag de AI-assistent om het samen te bespreken →
                            </p>
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#D97848]/30 transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                        >
                            Volgende <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
