/**
 * PromptMasterMission.tsx
 * 
 * Interactieve prompt engineering ervaring waar leerlingen leren door te DOEN.
 * Ze typen prompts, zien ECHTE AI-output, krijgen feedback en verbeteren.
 * 
 * Niveaus:
 * 1. Beginner: Basisprincipes (specifiek zijn, context geven)
 * 2. Gevorderd: Structuur (stap-voor-stap, format specificeren)
 * 3. Expert: Geavanceerd (persona's, constraints, voorbeelden)
 */

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, ArrowRight, Trophy, RotateCcw, Lightbulb, Zap, Target, Send, Bot, ThumbsUp, ThumbsDown, Star, Image, FileText, HelpCircle, Code, ChevronRight, Loader2, Brain, Eye, Palette } from 'lucide-react';
import { UserStats, VsoProfile } from '../../types';
import { createChatSession, sendMessageToGemini } from '../../services/geminiService';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: UserStats;
    vsoProfile?: VsoProfile;
}

// Types
interface Challenge {
    id: string;
    level: 'beginner' | 'gevorderd' | 'expert';
    type: 'image' | 'text' | 'help' | 'code';
    goal: string;
    scenario: string;
    badOutputExample: string;
    goodOutputExample: string;
    exampleImage?: string; // URL for image-type challenges
    feedbackCriteria: {
        keyword: string;
        label: string;
        hint: string;
    }[];
    minScore: number; // Minimum criteria to pass
    tips: string[];
}

// Challenge data met realistische AI output voorbeelden
const CHALLENGES: Challenge[] = [
    // BEGINNER LEVEL
    {
        id: 'b1',
        level: 'beginner',
        type: 'image',
        goal: '🎨 Laat de AI een specifieke hond tekenen',
        scenario: 'Je wilt een afbeelding voor je dierenpresentatie. Je vraagt de AI om een hond te tekenen.',
        badOutputExample: 'De AI tekent een bruine straathond in een witte ruimte. Saai, geen achtergrond, verkeerde kleur.',
        goodOutputExample: 'De AI tekent een schattige golden retriever puppy die vrolijk rent door een groen park met de zon op de achtergrond.',
        exampleImage: '/assets/agents/prompt_master.png',
        feedbackCriteria: [
            { keyword: 'golden|retriever|labrador|puppy|pup|puppie|poedel|teckel|husky|beagle|bulldog|herder|terrier|chihuahua|dalmatier|corgi|mopshond|boxer|rottweiler|pitbull|dobermann|schnauzer|shiba|akita|border|collie|pomeranian|maltees|jack russell|sint bernard|cocker|spaniel|ras|soort|type', label: 'Specifiek ras', hint: 'Welk soort hond wil je precies?' },
            { keyword: 'park|tuin|bos|strand|buiten|gras|veld|weide|natuur|buitenshuis|landschap|berg|buitenlucht|grasveld|plein|straat|thuis|huis|kamer|binnen|rivier|meer|water|zon|zonnig|zomer|lente|herfst|winter|sneeuw|regen|achtergrond|omgeving|setting|locatie|plek|waar|ergens', label: 'Locatie', hint: 'Waar staat de hond?' },
            { keyword: 'rennen|spelen|zitten|liggen|staan|lopen|slapen|eten|drinken|springen|kwispelen|blaffen|apporteren|halen|rennt|rent|loopt|sprint|wandelen|joggen|hardlopen|beweegt|actie|doet|gedrag', label: 'Actie', hint: 'Wat doet de hond?' },
            { keyword: 'vrolijk|schattig|speels|blij|leuk|grappig|lief|aandoenlijk|gelukkig|enthousiast|energiek|rustig|kalm|slaperig|moe|alert|wild|braaf|stoer|mooi|prachtig|adorable|cute|happy|vriendelijk|knuffel|aaibaar', label: 'Sfeer', hint: 'Welke uitstraling?' },
        ],
        minScore: 1,
        tips: ['Beschrijf het ras, niet gewoon "hond"', 'Voeg een achtergrond toe', 'Geef aan wat de hond doet']
    },
    {
        id: 'b2',
        level: 'beginner',
        type: 'text',
        goal: '✍️ Vraag de AI om een kort verhaal te schrijven',
        scenario: 'Je hebt een verhaal nodig voor een schoolopdracht over avontuur. Beschrijf zo duidelijk mogelijk wat voor verhaal je wilt: hoe lang moet het zijn, over wie gaat het, en waar speelt het zich af?',
        badOutputExample: 'De AI schrijft: "Er was eens iemand. Die deed iets. Het einde." (te kort, geen details)',
        goodOutputExample: 'De AI schrijft een spannend verhaal van 100 woorden over een jonge ontdekker in een magische grot.',
        feedbackCriteria: [
            { keyword: 'verhaal|avontuur|spanning|actie|fantasy|sprookje|myst|detective|griezelig|eng|komisch|romantisch|science fiction|sf|drama|story|vertel|schrijf|maak|creëer', label: 'Genre', hint: 'Wat voor soort verhaal? (spannend, grappig, avontuur...)' },
            { keyword: 'woorden|lang|kort|zin|alinea|pagina|paragraaf|tekst|groot|klein|mini|kort|halve|hele|ongeveer|zo\'n|zinnen|regels', label: 'Lengte', hint: 'Hoe lang moet het zijn? (kort, lang, 100 woorden...)' },
            { keyword: 'jongen|meisje|kind|held|ontdekker|ridder|prinses|piraat|tovenaar|heks|robot|alien|dier|kat|hond|draak|persoon|figuur|karakter|hoofdpersoon|protagonist|iemand|mens|magier|detective|agent|superheld|koning|koningin', label: 'Hoofdpersoon', hint: 'Over wie gaat het? (een jongen, een prinses...)' },
            { keyword: 'grot|bos|kasteel|ruimte|zee|oceaan|berg|dorp|stad|school|huis|jungle|woestijn|eiland|planeet|schip|trein|toekomst|verleden|middeleeuwen|fantasy wereld|magisch|land|koninkrijk|universum|galaxy|wereld|plek|locatie|waar|setting', label: 'Setting', hint: 'Waar speelt het zich af? (in een bos, op een eiland...)' },
        ],
        minScore: 1,
        tips: ['Geef een genre aan (grappig, spannend, avontuurlijk)', 'Zeg hoe lang je het wilt (kort, 100 woorden)', 'Beschrijf de hoofdpersoon (een dappere jongen, een slimme prinses)']
    },

    // GEVORDERD LEVEL
    {
        id: 'g1',
        level: 'gevorderd',
        type: 'image',
        goal: '🖼️ Ontwerp een logo voor een bakkerij',
        scenario: 'Je oom opent een bakkerij genaamd "Broodjes Goud" en heeft een logo nodig.',
        badOutputExample: 'De AI maakt een rommelig plaatje met te veel elementen, onduidelijke tekst, en verkeerde kleuren.',
        goodOutputExample: 'De AI maakt een strak, minimalistisch logo met een gouden brood-icoon, warme bruine tinten, moderne uitstraling.',
        exampleImage: '/assets/agents/de_visie.webp',
        feedbackCriteria: [
            { keyword: 'logo|embleem|icoon|merk', label: 'Type', hint: 'Is het een logo of een illustratie?' },
            { keyword: 'brood|tarwe|croissant|bakken', label: 'Symbool', hint: 'Welk symbool past bij een bakkerij?' },
            { keyword: 'goud|bruin|warm|beige|oranje', label: 'Kleuren', hint: 'Welke kleuren passen?' },
            { keyword: 'modern|minimalistisch|strak|simpel|clean', label: 'Stijl', hint: 'Klassiek of modern?' },
            { keyword: 'broodjes goud|naam|tekst', label: 'Naam', hint: 'Moet de naam erin?' },
        ],
        minScore: 1,
        tips: ['Specificeer de stijl (modern, retro)', 'Geef kleuren aan die passen', 'Beschrijf welk symbool/icoon']
    },
    {
        id: 'g4',
        level: 'gevorderd',
        type: 'text',
        goal: '📧 Schrijf een nette e-mail',
        scenario: 'Je bent ziek en moet je afmelden bij je docent via e-mail.',
        badOutputExample: 'De AI schrijft: "hey ik ben ziek dus kom niet doei" (te informeel, onbeleefd)',
        goodOutputExample: 'De AI schrijft een beleefde, formele e-mail met onderwerp, begroeting, reden, en afsluiting.',
        feedbackCriteria: [
            { keyword: 'email|mail|bericht|sturen', label: 'Type', hint: 'Zeg dat het een e-mail moet zijn' },
            { keyword: 'docent|leraar|meneer|mevrouw|juf', label: 'Ontvanger', hint: 'Aan wie is het gericht?' },
            { keyword: 'ziek|afmelding|afwezig|niet komen', label: 'Reden', hint: 'Wat is de boodschap?' },
            { keyword: 'formeel|beleefd|netjes|professioneel', label: 'Toon', hint: 'Formeel of informeel?' },
            { keyword: 'onderwerp|begroeting|afsluiting|groet', label: 'Structuur', hint: 'Vraag om e-mail onderdelen' },
        ],
        minScore: 1,
        tips: ['Geef aan dat het formeel moet zijn', 'Vermeld wie de ontvanger is', 'Vraag om onderwerp en begroeting']
    },

    // EXPERT LEVEL
    {
        id: 'e1',
        level: 'expert',
        type: 'text',
        goal: '🎭 Laat AI een persona aannemen',
        scenario: 'Je wilt dat de AI als een middeleeuwse ridder praat voor je toneelstuk.',
        badOutputExample: 'De AI praat gewoon modern: "Hey, wat kan ik voor je doen vandaag?"',
        goodOutputExample: 'De AI speelt de rol: "Gegroet, edele reiziger! Ik, Sir Galahad, sta tot uw dienst..."',
        feedbackCriteria: [
            { keyword: 'ridder|middeleeuwen|sir|edel|zwaard', label: 'Persona', hint: 'Wie moet de AI zijn?' },
            { keyword: 'spreek als|doe alsof|gedraag|wees|persona', label: 'Instructie', hint: 'Zeg dat de AI een ROL moet spelen' },
            { keyword: 'toneelstuk|scene|dialoog|tekst', label: 'Context', hint: 'Waarvoor is het?' },
            { keyword: 'ouderwets|formeel|oud|thee|gij', label: 'Taalgebruik', hint: 'Hoe moet de AI praten?' },
            { keyword: 'begin|start|voorbeeld|demonstreer', label: 'Actie', hint: 'Wat moet de AI doen?' },
        ],
        minScore: 2,
        tips: ['Geef die AI een specifieke persona/rol', 'Beschrijf hoe die persoon praat', 'Geef context waarom']
    },
    {
        id: 'e2',
        level: 'expert',
        type: 'help',
        goal: '🎯 Stel beperkingen en formats in',
        scenario: 'Je wilt een recept voor pannenkoeken, maar met beperkingen.',
        badOutputExample: 'De AI geeft een lang recept met gluten, zuivel, en ingewikkelde stappen.',
        goodOutputExample: 'De AI geeft een glutenvrij recept in bullet points, met tijdsindicatie per stap.',
        feedbackCriteria: [
            { keyword: 'recept|pannenkoek|maken|bakken', label: 'Onderwerp', hint: 'Wat wil je?' },
            { keyword: 'glutenvrij|zonder|vegan|lactose', label: 'Beperking', hint: 'Zijn er restricties?' },
            { keyword: 'bullet|punten|stappen|genummerd', label: 'Format', hint: 'In welk format?' },
            { keyword: 'minuten|tijd|snel|lang', label: 'Tijdsindicatie', hint: 'Vraag om tijden erbij' },
            { keyword: 'makkelijk|simpel|ingredienten|weinig', label: 'Complexiteit', hint: 'Hoe complex mag het zijn?' },
        ],
        minScore: 2,
        tips: ['Geef dieetbeperkingen aan', 'Vraag om een specifiek format (bullets, tabel)', 'Voeg praktische eisen toe (tijd, ingrediënten)']
    },
];

// Analyseer prompt met echte AI (Gemini)
async function analyzePromptWithAI(
    prompt: string,
    challenge: Challenge,
    onThinkingStep: (step: string) => void
): Promise<{ output: string; score: number; feedback: { label: string; found: boolean; hint: string; explanation?: string }[]; generatedImageUrl?: string }> {

    onThinkingStep('🔍 Prompt analyseren...');

    // Create a structured analysis prompt for Gemini
    const analysisPrompt = `Je bent een EERLIJKE maar BEGRIPVOLLE prompt engineering leraar voor kinderen (10-14 jaar). Je beoordeelt prompts RECHTVAARDIG - niet te streng, maar ook niet alles goedkeuren.

JOUW OPDRACHT: Analyseer de prompt van de leerling en bepaal welke criteria ECHT aanwezig zijn.

=== DE OPDRACHT VOOR DE LEERLING ===
"${challenge.goal}"

SCENARIO: ${challenge.scenario}

=== WAT DE LEERLING SCHREEF ===
"${prompt}"

=== CRITERIA OM TE BEOORDELEN ===
${challenge.feedbackCriteria.map((c, i) => `${i + 1}. ${c.label}: Zoek naar: "${c.keyword.split('|').slice(0, 8).join(', ')}..."`).join('\n')}

=== HOE TE BEOORDELEN (BELANGRIJK!) ===

PRINCIPE: Beoordeel zoals een REDELIJKE docent zou doen. Kijk naar de INTENTIE, niet alleen exacte woorden.

✅ GEVONDEN betekent:
- Het concept staat ECHT in de prompt (exact of synoniemen)
- Er is een DUIDELIJKE verwijzing naar het criterium
- Voorbeelden die WEL tellen:
  * "golden retriever" → Specifiek ras ✅
  * "labrador" → Specifiek ras ✅  
  * "in het park" → Locatie ✅
  * "in de tuin" → Locatie ✅
  * "die rent" of "rennend" → Actie ✅
  * "die ligt te slapen" → Actie ✅
  * "vrolijke hond" → Sfeer ✅
  * "schattige puppy" → Sfeer ✅

❌ NIET_GEVONDEN betekent:
- Het concept ontbreekt ECHT in de prompt
- Alleen "hond" zonder type = GEEN specifiek ras
- Geen locatie genoemd = GEEN locatie
- Geen actie/werkwoord = GEEN actie
- Voorbeelden die NIET tellen:
  * "teken een hond" (zonder ras) → Specifiek ras ❌
  * "teken een hond" (zonder plek) → Locatie ❌
  * "teken een hond" (zonder wat hij doet) → Actie ❌

SPECIALE GEVALLEN (wees hier redelijk):
- "mooie hond" = wel sfeer (mooi is een beschrijving)
- "witte hond" = GEEN ras (wit is alleen kleur, geen type hond)
- "grote hond" = GEEN ras (groot is alleen grootte)
- "hond in zijn mand" = wel locatie (mand is een plek)
- "slapende hond" = wel actie (slapen is een actie)
- "puppie" of "pup" = wel specifiek ras (type hond)

=== GEEF JE BEOORDELING ===

Analyseer EERLIJK en geef voor ELK criterium:
1. GEVONDEN of NIET_GEVONDEN
2. KORTE uitleg (max 10 woorden) - citeer wat je vond OF leg uit wat ontbreekt

SCORE = aantal criteria dat ECHT GEVONDEN is (0-${challenge.feedbackCriteria.length})

Format EXACT zo (belangrijk voor parsing!):
SCORE: [getal]
SAMENVATTING: [Beschrijf in max 30 woorden wat de AI zou maken op basis van deze prompt]
CRITERIA:
1. ${challenge.feedbackCriteria[0]?.label}: [GEVONDEN/NIET_GEVONDEN] - [uitleg]
${challenge.feedbackCriteria.slice(1).map((c, i) => `${i + 2}. ${c.label}: [GEVONDEN/NIET_GEVONDEN] - [uitleg]`).join('\n')}`;

    try {
        // Create a chat session for analysis
        const chatSession = createChatSession('Je bent een behulpzame prompt engineering leraar.');

        await new Promise(r => setTimeout(r, 800)); // Small delay for UX
        onThinkingStep('🧠 AI denkt na...');

        const response = await sendMessageToGemini(chatSession, analysisPrompt);

        onThinkingStep('📊 Resultaat verwerken...');
        await new Promise(r => setTimeout(r, 500));

        // Parse the AI response
        const scoreMatch = response.match(/SCORE:\s*(\d+)/i);
        const summaryMatch = response.match(/SAMENVATTING:\s*([^\n]+)/i);

        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        const summary = summaryMatch ? summaryMatch[1].trim() : challenge.goodOutputExample;

        // Parse individual criteria
        const feedback: { label: string; found: boolean; hint: string; explanation?: string }[] = [];

        for (const criterion of challenge.feedbackCriteria) {
            const criterionRegex = new RegExp(`${criterion.label}:\s*(GEVONDEN|NIET_GEVONDEN)\s*-?\s*(.*)`, 'i');
            const match = response.match(criterionRegex);

            if (match) {
                feedback.push({
                    label: criterion.label,
                    found: match[1].toUpperCase() === 'GEVONDEN',
                    hint: criterion.hint,
                    explanation: match[2]?.trim() || undefined
                });
            } else {
                // Fallback: use simple keyword matching if AI parsing fails
                const regex = new RegExp(criterion.keyword, 'i');
                feedback.push({
                    label: criterion.label,
                    found: regex.test(prompt.toLowerCase()),
                    hint: criterion.hint
                });
            }
        }

        // Build output message
        let output: string;
        if (score >= challenge.minScore) {
            output = summary || challenge.goodOutputExample;
        } else {
            output = `De AI begreep je prompt niet helemaal goed. ${summary || challenge.badOutputExample}`;
        }

        return { output, score, feedback };

    } catch (error) {
        console.error('AI analysis failed:', error);

        // Fallback to enhanced keyword matching
        const normalizedPrompt = prompt.toLowerCase();
        const feedback: { label: string; found: boolean; hint: string }[] = [];
        let score = 0;

        challenge.feedbackCriteria.forEach(criterion => {
            const regex = new RegExp(criterion.keyword, 'i');
            const found = regex.test(normalizedPrompt);
            if (found) score++;
            feedback.push({
                label: criterion.label,
                found,
                hint: criterion.hint
            });
        });

        let output: string;
        if (score >= challenge.minScore) {
            output = challenge.goodOutputExample;
        } else {
            output = challenge.badOutputExample;
        }

        return { output, score, feedback };
    }
}

// Visual component for displaying AI output
const ResultVisual: React.FC<{
    type: 'image' | 'text' | 'help' | 'code';
    content: string;
    isIdeal?: boolean;
    isSuccess?: boolean;
    exampleImage?: string;
    generatedImage?: string; // NEW: AI-generated image based on student prompt
}> = ({ type, content, isIdeal, isSuccess, exampleImage, generatedImage }) => {
    // Icons & Colors based on type
    const getBgColor = () => {
        if (isIdeal) return 'bg-emerald-900/20 border-emerald-500/30'; // Ideal is always green-ish
        if (isSuccess) return 'bg-emerald-900/20 border-emerald-500/30'; // Success user result
        return 'bg-amber-900/20 border-amber-500/30'; // Failed user result
    };

    const getHeader = () => {
        if (isIdeal) return <div className="flex items-center gap-2 text-emerald-400 mb-2 font-bold"><Target size={16} /> Ideaal Resultaat</div>;
        return <div className="flex items-center gap-2 text-slate-300 mb-2 font-bold"><Bot size={16} /> Jouw Resultaat</div>;
    };

    // IMAGE CHALLENGE VISUALIZATION
    if (type === 'image') {
        // Determine which image to show: generatedImage for student results, exampleImage for ideal
        const imageToShow = generatedImage || (isIdeal ? exampleImage : null);

        return (
            <div className={`p-4 rounded-2xl border-2 border-dashed ${getBgColor()} h-full flex flex-col`}>
                {getHeader()}
                <div className="flex-1 min-h-[200px] bg-slate-900/50 rounded-xl flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group">
                    {/* Show actual image if available */}
                    {imageToShow ? (
                        <>
                            <img
                                src={imageToShow}
                                alt={isIdeal ? "Voorbeeld resultaat" : "Jouw gegenereerde afbeelding"}
                                className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                                <p className="text-emerald-100 text-sm font-medium drop-shadow-lg">
                                    {content.replace(/^De AI.*?:\s*/i, '')}
                                </p>
                            </div>
                            <div className={`absolute top-2 right-2 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full z-10 ${isIdeal ? 'bg-emerald-500' : isSuccess ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                                {isIdeal ? 'Perfect' : isSuccess ? 'Goed gedaan!' : 'Jouw resultaat'}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-50" />
                            {/* Abstract shapes to simulate image */}
                            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
                            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />

                            <Image size={32} className={`mb-3 relative z-10 ${isIdeal || isSuccess ? 'text-emerald-400' : 'text-amber-400'}`} />
                            <p className={`text-sm relative z-10 font-medium ${isIdeal || isSuccess ? 'text-emerald-100' : 'text-amber-100'}`}>
                                {content.replace(/^De AI.*?:\s*/i, '')}
                            </p>
                            {isSuccess && <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Goed gedaan!</div>}
                        </>
                    )}
                </div>
            </div>
        );
    }

    // CODE CHALLENGE VISUALIZATION
    if (type === 'code') {
        return (
            <div className={`p-4 rounded-2xl border ${getBgColor()} h-full flex flex-col font-mono text-sm`}>
                {getHeader()}
                <div className="flex-1 bg-slate-950 rounded-xl p-4 overflow-x-auto relative">
                    <div className="flex gap-1.5 mb-3 opacity-50">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <code className="text-slate-300 block leading-relaxed">
                        <span className="text-purple-400">def</span> <span className="text-yellow-400">calculator</span>():<br />
                        &nbsp;&nbsp;<span className="text-slate-500"># {content.substring(0, 50)}...</span><br />
                        &nbsp;&nbsp;<span className="text-purple-400">return</span> result
                    </code>
                    <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
                        // Output: {content}
                    </div>
                </div>
            </div>
        );
    }

    // TEXT/DEFAULT VISUALIZATION
    return (
        <div className={`p-4 rounded-2xl border ${getBgColor()} h-full flex flex-col`}>
            {getHeader()}
            <div className="flex-1 bg-white rounded-xl p-4 text-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-200" />
                {/* Simulate paper lines */}
                <div className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-5/6" />
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm font-medium border-l-4 border-slate-300">
                    "{content}"
                </div>
            </div>
        </div>
    );
};

export const PromptMasterMission: React.FC<Props> = ({ onBack, onComplete, vsoProfile }) => {
    // State
    const [phase, setPhase] = useState<'intro' | 'challenge' | 'result'>('intro');
    const [currentLevel, setCurrentLevel] = useState<'beginner' | 'gevorderd' | 'expert'>('beginner');
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [userPrompt, setUserPrompt] = useState('');
    const [aiResponse, setAiResponse] = useState<{ output: string; score: number; feedback: { label: string; found: boolean; hint: string; explanation?: string }[]; generatedImageUrl?: string } | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
    const [attempts, setAttempts] = useState(0);

    // NEW: Loading and thinking states
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [thinkingStep, setThinkingStep] = useState('');

    // Get current challenges for level
    const levelChallenges = CHALLENGES.filter(c => c.level === currentLevel);
    const currentChallenge = levelChallenges[challengeIndex];
    
    // Adjusted minScore based on VSO profile
    const effectiveMinScore = vsoProfile === 'dagbesteding' 
        ? Math.max(1, currentChallenge.minScore - 1) 
        : currentChallenge.minScore;

    const allLevelsDone = currentLevel === 'expert' && challengeIndex >= levelChallenges.length - 1 && completedChallenges.includes(currentChallenge?.id);

    // Handlers
    const handleSubmitPrompt = async () => {
        if (!userPrompt.trim() || !currentChallenge || isAnalyzing) return;

        setAttempts(a => a + 1);
        setIsAnalyzing(true);
        setThinkingStep('🔍 Prompt analyseren...');

        try {
            // Use real AI analysis
            const result = await analyzePromptWithAI(
                userPrompt,
                currentChallenge,
                (step) => setThinkingStep(step)
            );

            setAiResponse(result);
            setShowFeedback(true);

            if (result.score >= effectiveMinScore && !completedChallenges.includes(currentChallenge.id)) {
                setTotalScore(s => s + result.score * 10);
                setCompletedChallenges([...completedChallenges, currentChallenge.id]);
            }
        } catch (error) {
            console.error('AI analysis error:', error);
            // Show a simple error feedback
            setAiResponse({
                output: 'Er ging iets mis bij het analyseren. Probeer het opnieuw.',
                score: 0,
                feedback: []
            });
            setShowFeedback(true);
        } finally {
            setIsAnalyzing(false);
            setThinkingStep('');
        }
    };

    const handleTryAgain = () => {
        // Keep userPrompt but hide the main result screen
        setShowFeedback(false);
    };

    const handleNext = () => {
        setUserPrompt('');
        setAiResponse(null);
        setShowFeedback(false);
        setAttempts(0);

        if (challengeIndex < levelChallenges.length - 1) {
            setChallengeIndex(i => i + 1);
        } else if (currentLevel === 'beginner') {
            setCurrentLevel('gevorderd');
            setChallengeIndex(0);
        } else if (currentLevel === 'gevorderd') {
            setCurrentLevel('expert');
            setChallengeIndex(0);
        } else {
            setPhase('result');
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'image': return <Image size={16} />;
            case 'text': return <FileText size={16} />;
            case 'help': return <HelpCircle size={16} />;
            case 'code': return <Code size={16} />;
            default: return <Sparkles size={16} />;
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'from-emerald-500 to-green-500';
            case 'gevorderd': return 'from-amber-500 to-orange-500';
            case 'expert': return 'from-purple-500 to-pink-500';
            default: return 'from-blue-500 to-indigo-500';
        }
    };

    // INTRO SCREEN
    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col">
                {/* Header - matches other missions */}
                <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Terug
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                Prompt Lab <Zap size={16} className="text-amber-400" />
                            </h1>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                Prompt Engineering
                            </p>
                        </div>
                    </div>
                    <div className="w-20" /> {/* Spacer for centering */}
                </header>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/30">
                            <Sparkles size={48} />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                            Leer Prompt Engineering door te <span className="text-purple-400">DOEN</span>
                        </h2>

                        <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                            Typ je eigen prompts, zie wat de AI maakt, en ontdek wat er beter kan!
                        </p>

                        {/* Levels Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                                <div className="text-3xl mb-2">🌱</div>
                                <h3 className="font-bold mb-1 text-emerald-400">Beginner</h3>
                                <p className="text-xs text-slate-500">Specifiek zijn, context geven</p>
                            </div>
                            <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                                <div className="text-3xl mb-2">⚡</div>
                                <h3 className="font-bold mb-1 text-amber-400">Gevorderd</h3>
                                <p className="text-xs text-slate-500">Structuur, format, toon</p>
                            </div>
                            <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                                <div className="text-3xl mb-2">🎯</div>
                                <h3 className="font-bold mb-1 text-purple-400">Expert</h3>
                                <p className="text-xs text-slate-500">Persona's, beperkingen</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setPhase('challenge')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
                        >
                            Start het Lab! 🧪
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // CHALLENGE SCREEN
    if (phase === 'challenge' && currentChallenge) {
        const passed = aiResponse && aiResponse.score >= effectiveMinScore;

        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col">
                {/* Header - consistent with other missions */}
                <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">
                            <ArrowLeft size={16} /> Stoppen
                        </button>
                        <div className="flex items-center gap-3">
                            {/* Level Badge with Progress */}
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${currentLevel === 'beginner' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    currentLevel === 'gevorderd' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                        'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    }`}>
                                    {currentLevel === 'beginner' ? '🌱 Beginner' :
                                        currentLevel === 'gevorderd' ? '⚡ Gevorderd' : '🎯 Expert'}
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase">
                                    Niveau {currentLevel === 'beginner' ? 1 : currentLevel === 'gevorderd' ? 2 : 3}/3
                                </span>
                                {vsoProfile && (
                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded border border-indigo-500/30 font-bold uppercase tracking-tight">
                                        {vsoProfile === 'dagbesteding' ? 'Focus: Ervaren' : 'Focus: Beheersen'}
                                    </span>
                                )}
                            </div>
                            <div className="h-4 w-px bg-slate-700" />
                            <span className="text-sm text-slate-400">
                                Uitdaging {challengeIndex + 1}/{levelChallenges.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-400">
                            <Star size={16} fill="currentColor" />
                            <span className="font-bold">{totalScore}</span>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto p-4 md:p-8">
                    {/* Goal Card */}
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
                        {/* Level Progress Bar */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex-1 flex items-center gap-1">
                                {['beginner', 'gevorderd', 'expert'].map((level, i) => (
                                    <div key={level} className="flex-1 flex items-center">
                                        <div className={`h-1.5 flex-1 rounded-full transition-all ${level === currentLevel ? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse' :
                                            (level === 'beginner' || (level === 'gevorderd' && currentLevel === 'expert'))
                                                ? 'bg-emerald-500' : 'bg-slate-700'
                                            }`} />
                                        {i < 2 && <div className="w-2 h-2 rounded-full mx-1 bg-slate-700" />}
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold">
                                {currentLevel === 'beginner' ? '2 niveaus te gaan' :
                                    currentLevel === 'gevorderd' ? '1 niveau te gaan' : 'Laatste niveau!'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-xl ${currentLevel === 'beginner' ? 'bg-emerald-500/20 text-emerald-400' :
                                currentLevel === 'gevorderd' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-purple-500/20 text-purple-400'
                                }`}>
                                {getTypeIcon(currentChallenge.type)}
                            </div>
                            <span className="font-bold text-lg">{currentChallenge.goal}</span>
                        </div>
                        <p className="text-slate-400">{currentChallenge.scenario}</p>
                    </div>

                    {/* Input Area */}
                    {!showFeedback ? (
                        <div className="mb-6 relative">
                            {/* Thinking Overlay */}
                            {isAnalyzing && (
                                <div className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 animate-in fade-in">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full animate-pulse"></div>
                                        <div className="relative z-10 p-4 bg-slate-800 rounded-full border-2 border-purple-500/50">
                                            <Brain size={32} className="text-purple-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white animate-pulse">{thinkingStep}</p>
                                        <p className="text-sm text-slate-400 mt-1">De AI denkt na over je prompt...</p>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
                                    </div>
                                </div>
                            )}

                            <label className="block text-sm font-bold text-slate-300 mb-3">
                                {attempts > 0 ? 'Verbeter je prompt:' : 'Typ je prompt aan de AI:'}
                            </label>
                            <textarea
                                value={userPrompt}
                                onChange={e => setUserPrompt(e.target.value)}
                                placeholder="Typ hier je opdracht voor de AI..."
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 text-white placeholder-slate-500 min-h-[120px] focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                disabled={isAnalyzing}
                            />
                            <button
                                onClick={handleSubmitPrompt}
                                disabled={userPrompt.trim().length < 5 || isAnalyzing}
                                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> AI Analyseert...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} /> {attempts > 0 ? 'Opnieuw Versturen' : 'Verstuur naar AI'}
                                    </>
                                )}
                            </button>

                            {/* Show what's missing while editing after first attempt */}
                            {attempts > 0 && aiResponse && (
                                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4">
                                    <h4 className="font-bold flex items-center gap-2 text-slate-300">
                                        <Target size={18} className="text-purple-400" />
                                        Wat moet je nog toevoegen?
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {aiResponse.feedback.map((item, i) => (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-xl flex items-center gap-3 border transition-all ${item.found
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 opacity-50'
                                                    : 'bg-red-500/10 border-red-500/20 shadow-lg shadow-red-500/5'
                                                    }`}
                                            >
                                                {item.found ? (
                                                    <div className="w-6 h-6 bg-emerald-500/50 rounded-full flex items-center justify-center text-emerald-100">
                                                        ✓
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                                        !
                                                    </div>
                                                )}
                                                <div>
                                                    <span className={`font-bold text-sm ${item.found ? 'text-emerald-300/60' : 'text-white'}`}>
                                                        {item.label}
                                                    </span>
                                                    {!item.found && (
                                                        <p className="text-xs text-red-100/60">{item.hint}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 bg-amber-500/10 rounded-2xl p-5 border border-amber-500/20">
                                        <h4 className="font-bold mb-3 flex items-center gap-2 text-amber-300 text-sm">
                                            <Lightbulb size={16} /> Tips voor dit niveau:
                                        </h4>
                                        <ul className="space-y-2">
                                            {currentChallenge.tips.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-2 text-[13px] text-slate-400">
                                                    <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}

                    {/* AI Response & Feedback */}
                    {showFeedback && aiResponse && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            {/* Simulated AI Response */}
                            {/* Simulated AI Response & Comparison */}
                            <div className={`grid gap-4 ${passed ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
                                {/* Students Result */}
                                <ResultVisual
                                    type={currentChallenge.type}
                                    content={aiResponse.output}
                                    isSuccess={passed}
                                    exampleImage={passed ? currentChallenge.exampleImage : undefined}
                                    generatedImage={aiResponse.generatedImageUrl}
                                />

                                {/* Show Ideal Result if user failed */}
                                {!passed && (
                                    <div className="animate-in fade-in slide-in-from-right-4 delay-150">
                                        <ResultVisual
                                            type={currentChallenge.type}
                                            content={currentChallenge.goodOutputExample}
                                            isIdeal
                                            exampleImage={currentChallenge.exampleImage}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Result Summary - Moved below visuals */}
                            <div className={`rounded-xl p-4 flex items-center justify-between ${passed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${passed ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                        {passed ? <ThumbsUp size={20} /> : <ThumbsDown size={20} />}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {passed ? 'Missie Geslaagd!' : 'Nog niet helemaal...'}
                                        </h4>
                                        <p className="text-sm text-slate-400">
                                            {passed ? 'Je prompt gaf een geweldig resultaat.' : 'Kijk naar het verschil tussen jouw resultaat en het doel.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Checklist */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <Target size={18} className="text-purple-400" />
                                    Wat zat er in je prompt?
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {aiResponse.feedback.map((item, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-xl flex items-center gap-3 ${item.found
                                                ? 'bg-emerald-500/20 border border-emerald-500/30'
                                                : 'bg-red-500/10 border border-red-500/20'
                                                }`}
                                        >
                                            {item.found ? (
                                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                    <Sparkles size={12} />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 bg-red-500/50 rounded-full flex items-center justify-center text-xs">
                                                    ✗
                                                </div>
                                            )}
                                            <div>
                                                <span className={`font-bold text-sm ${item.found ? 'text-emerald-300' : 'text-red-300'}`}>
                                                    {item.label}
                                                </span>
                                                {!item.found && (
                                                    <p className="text-xs text-white/50">{item.hint}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips (if not passed) */}
                            {!passed && (
                                <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/30">
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-amber-300">
                                        <Lightbulb size={18} /> Tips om te verbeteren:
                                    </h4>
                                    <ul className="space-y-2">
                                        {currentChallenge.tips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-purple-200">
                                                <ChevronRight size={14} className="mt-1 text-amber-400 flex-shrink-0" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4">
                                {!passed && (
                                    <button
                                        onClick={handleTryAgain}
                                        className="flex-1 bg-white/10 border border-white/20 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-black/20"
                                    >
                                        <RotateCcw size={18} /> Verbeteren
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={aiResponse.score < 2}
                                    className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${passed
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                                        }`}
                                >
                                    {allLevelsDone ? 'Bekijk resultaat' : 'Volgende uitdaging'} <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        );
    }

    // RESULT SCREEN
    if (phase === 'result') {
        const maxScore = CHALLENGES.length * 50;
        const percentage = Math.round((totalScore / maxScore) * 100);
        const passed = percentage >= 60;

        return (
            <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex items-center justify-center">
                <div className="max-w-lg w-full text-center">
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 ${passed
                        ? 'bg-emerald-500 shadow-2xl shadow-emerald-500/30'
                        : 'bg-amber-500 shadow-2xl shadow-amber-500/30'
                        }`}>
                        <Trophy size={56} />
                    </div>

                    <h1 className="text-4xl font-black mb-4">
                        {passed ? 'Prompt Master! 🎉' : 'Goed bezig!'}
                    </h1>

                    <p className="text-xl text-slate-400 mb-8">
                        {passed
                            ? 'Je beheerst nu de kunst van prompt engineering!'
                            : 'Je hebt veel geleerd over hoe je effectieve prompts schrijft.'
                        }
                    </p>

                    <div className="bg-slate-800 rounded-2xl p-8 mb-8 border border-slate-700">
                        <div className="text-6xl font-black mb-2 text-purple-400">
                            {totalScore} pts
                        </div>
                        <p className="text-slate-400 font-bold mb-4">{completedChallenges.length}/{CHALLENGES.length} uitdagingen voltooid</p>

                        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                            <div className="bg-emerald-500/20 rounded-xl p-3">
                                <div className="font-bold text-emerald-300">Beginner</div>
                                <div className="text-white">{completedChallenges.filter(id => CHALLENGES.find(c => c.id === id)?.level === 'beginner').length}/2</div>
                            </div>
                            <div className="bg-amber-500/20 rounded-xl p-3">
                                <div className="font-bold text-amber-300">Gevorderd</div>
                                <div className="text-white">{completedChallenges.filter(id => CHALLENGES.find(c => c.id === id)?.level === 'gevorderd').length}/2</div>
                            </div>
                            <div className="bg-purple-500/20 rounded-xl p-3">
                                <div className="font-bold text-purple-300">Expert</div>
                                <div className="text-white">{completedChallenges.filter(id => CHALLENGES.find(c => c.id === id)?.level === 'expert').length}/2</div>
                            </div>
                        </div>
                    </div>

                    {/* Key Learnings */}
                    <div className="bg-slate-800 rounded-2xl p-6 mb-8 text-left border border-slate-700">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                            <Lightbulb size={18} className="text-yellow-400" /> Wat je geleerd hebt:
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400">✓</span> Specifieke details geven betere resultaten
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400">✓</span> Context en doel helpen de AI begrijpen
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400">✓</span> Format en structuur vragen geeft overzicht
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400">✓</span> Persona's en beperkingen geven controle
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={() => onComplete(passed)}
                        className="w-full bg-purple-600 hover:bg-purple-700 py-5 rounded-xl font-bold transition-colors"
                    >
                        Terug naar Dashboard 🏠
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
