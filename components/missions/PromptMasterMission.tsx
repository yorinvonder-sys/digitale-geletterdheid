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
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';

interface PromptMasterProgress {
    currentLevel: 'beginner' | 'gevorderd' | 'expert';
    challengeIndex: number;
    totalScore: number;
    completedChallenges: string[];
}

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
        exampleImage: '/assets/agents/prompt_master.webp',
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
        if (isIdeal) return 'bg-[#10B981]/10 border-[#10B981]/30';
        if (isSuccess) return 'bg-[#10B981]/10 border-[#10B981]/30';
        return 'bg-[#D97757]/10 border-[#D97757]/30';
    };

    const getHeader = () => {
        if (isIdeal) return <div className="flex items-center gap-2 text-[#10B981] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}><Target size={16} /> <span className="font-bold">Ideaal Resultaat</span></div>;
        return <div className="flex items-center gap-2 text-[#3D3D38] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}><Bot size={16} /> <span className="font-bold">Jouw Resultaat</span></div>;
    };

    // IMAGE CHALLENGE VISUALIZATION
    if (type === 'image') {
        // Determine which image to show: generatedImage for student results, exampleImage for ideal
        const imageToShow = generatedImage || (isIdeal ? exampleImage : null);

        return (
            <div className={`p-4 rounded-2xl border ${getBgColor()} h-full flex flex-col`}>
                {getHeader()}
                <div className="flex-1 min-h-[200px] bg-[#F0EEE8] rounded-xl flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group">
                    {/* Show actual image if available */}
                    {imageToShow ? (
                        <>
                            <img
                                src={imageToShow}
                                alt={isIdeal ? "Voorbeeld resultaat" : "Jouw gegenereerde afbeelding"}
                                className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A19]/70 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                                <p className="text-white text-sm font-medium drop-shadow-lg" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {content.replace(/^De AI.*?:\s*/i, '')}
                                </p>
                            </div>
                            <div className={`absolute top-2 right-2 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full z-10`} style={{ backgroundColor: isIdeal || isSuccess ? '#10B981' : '#D97757' }}>
                                {isIdeal ? 'Perfect' : isSuccess ? 'Goed gedaan!' : 'Jouw resultaat'}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-[#F0EEE8] to-[#E8E6DF] opacity-50" />
                            {/* Abstract shapes to simulate image */}
                            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-[#D97757]/10 rounded-full blur-xl" />
                            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-[#8B6F9E]/10 rounded-full blur-2xl" />

                            <Image size={32} className={`mb-3 relative z-10`} style={{ color: isIdeal || isSuccess ? '#10B981' : '#D97757' }} />
                            <p className={`text-sm relative z-10 font-medium`} style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: isIdeal || isSuccess ? '#10B981' : '#D97757' }}>
                                {content.replace(/^De AI.*?:\s*/i, '')}
                            </p>
                            {isSuccess && <div className="absolute top-2 right-2 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#10B981' }}>Goed gedaan!</div>}
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
                <div className="flex-1 bg-[#1A1A19] rounded-xl p-4 overflow-x-auto relative">
                    <div className="flex gap-1.5 mb-3 opacity-50">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <code className="text-[#E8E6DF] block leading-relaxed">
                        <span className="text-[#8B6F9E]">def</span> <span className="text-[#D97757]">calculator</span>():<br />
                        &nbsp;&nbsp;<span className="text-[#6B6B66]"># {content.substring(0, 50)}...</span><br />
                        &nbsp;&nbsp;<span className="text-[#8B6F9E]">return</span> result
                    </code>
                    <div className="mt-4 pt-4 border-t border-[#3D3D38] text-xs text-[#6B6B66]">
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
            <div className="flex-1 bg-white rounded-xl p-4 text-[#3D3D38] shadow-sm relative overflow-y-auto max-h-[300px]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-[#E8E6DF]" />
                {/* Simulate paper lines */}
                <div className="space-y-3">
                    <div className="h-4 bg-[#F0EEE8] rounded w-3/4" />
                    <div className="h-4 bg-[#F0EEE8] rounded w-full" />
                    <div className="h-4 bg-[#F0EEE8] rounded w-5/6" />
                </div>

                <div className="mt-4 p-3 bg-[#FAF9F0] rounded-lg text-sm font-medium border-l-4 border-[#D97757]">
                    "{content}"
                </div>
            </div>
        </div>
    );
};

export const PromptMasterMission: React.FC<Props> = ({ onBack, onComplete, vsoProfile }) => {
    // Persistent progress state (auto-saved to localStorage)
    const { state: progress, setState: setProgress, clearSave } = useMissionAutoSave<PromptMasterProgress>(
        'prompt-master',
        { currentLevel: 'beginner', challengeIndex: 0, totalScore: 0, completedChallenges: [] }
    );

    // Transient UI state
    const [phase, setPhase] = useState<'intro' | 'challenge' | 'result'>('intro');
    const [userPrompt, setUserPrompt] = useState('');
    const [aiResponse, setAiResponse] = useState<{ output: string; score: number; feedback: { label: string; found: boolean; hint: string; explanation?: string }[]; generatedImageUrl?: string } | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // NEW: Loading and thinking states
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [thinkingStep, setThinkingStep] = useState('');

    // Get current challenges for level
    const levelChallenges = CHALLENGES.filter(c => c.level === progress.currentLevel);
    const currentChallenge = levelChallenges[progress.challengeIndex];

    // Global progress across all challenges
    const globalIndex = CHALLENGES.findIndex(c => c.id === currentChallenge?.id);
    const totalChallenges = CHALLENGES.length;
    
    // Adjusted minScore based on VSO profile
    const effectiveMinScore = vsoProfile === 'dagbesteding' 
        ? Math.max(1, currentChallenge.minScore - 1) 
        : currentChallenge.minScore;

    const allLevelsDone = progress.currentLevel === 'expert' && progress.challengeIndex >= levelChallenges.length - 1 && progress.completedChallenges.includes(currentChallenge?.id);

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

            if (result.score >= effectiveMinScore && !progress.completedChallenges.includes(currentChallenge.id)) {
                setProgress(prev => ({
                    ...prev,
                    totalScore: prev.totalScore + result.score * 10,
                    completedChallenges: [...prev.completedChallenges, currentChallenge.id],
                }));
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

        if (progress.challengeIndex < levelChallenges.length - 1) {
            setProgress(prev => ({ ...prev, challengeIndex: prev.challengeIndex + 1 }));
        } else if (progress.currentLevel === 'beginner') {
            setProgress(prev => ({ ...prev, currentLevel: 'gevorderd', challengeIndex: 0 }));
        } else if (progress.currentLevel === 'gevorderd') {
            setProgress(prev => ({ ...prev, currentLevel: 'expert', challengeIndex: 0 }));
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
            case 'beginner': return 'from-[#2A9D8F] to-[#10B981]';
            case 'gevorderd': return 'from-[#D97757] to-[#C46849]';
            case 'expert': return 'from-[#8B6F9E] to-[#D97757]';
            default: return 'from-[#2A9D8F] to-[#D97757]';
        }
    };

    // INTRO SCREEN
    if (phase === 'intro') {
        return (
            <div className="min-h-screen overflow-y-auto bg-[#FAF9F0] text-[#1A1A19] flex flex-col" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                {/* Header */}
                <header className="bg-white border-b border-[#E8E6DF] px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300 font-bold text-sm uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Terug
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#D97757]/10 text-[#D97757] rounded-xl">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black uppercase tracking-tight flex items-center gap-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                Prompt Lab <Zap size={16} className="text-[#D97757]" />
                            </h1>
                            <p className="text-[10px] text-[#6B6B66] uppercase tracking-widest font-bold">
                                Prompt Engineering
                            </p>
                        </div>
                    </div>
                    <div className="w-20" /> {/* Spacer for centering */}
                </header>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl text-white" style={{ background: 'linear-gradient(135deg, #D97757, #C46849)', boxShadow: '0 25px 50px -12px rgba(217,119,87,0.3)' }}>
                            <Sparkles size={48} />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            Leer Prompt Engineering door te <span className="text-[#D97757]">DOEN</span>
                        </h2>

                        <p className="text-lg text-[#6B6B66] mb-10 leading-relaxed">
                            Typ je eigen prompts, zie wat de AI maakt, en ontdek wat er beter kan!
                        </p>

                        {/* Levels Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF]">
                                <div className="text-3xl mb-2">🌱</div>
                                <h3 className="font-bold mb-1 text-[#2A9D8F]">Beginner</h3>
                                <p className="text-xs text-[#6B6B66]">Specifiek zijn, context geven</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF]">
                                <div className="text-3xl mb-2">⚡</div>
                                <h3 className="font-bold mb-1 text-[#D97757]">Gevorderd</h3>
                                <p className="text-xs text-[#6B6B66]">Structuur, format, toon</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF]">
                                <div className="text-3xl mb-2">🎯</div>
                                <h3 className="font-bold mb-1 text-[#8B6F9E]">Expert</h3>
                                <p className="text-xs text-[#6B6B66]">Persona's, beperkingen</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setPhase('challenge')}
                            className="text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            style={{ backgroundColor: '#D97757' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C46849')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97757')}
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
            <div className="min-h-screen overflow-y-auto bg-[#FAF9F0] text-[#1A1A19] flex flex-col" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                {/* Header */}
                <header className="bg-white border-b border-[#E8E6DF] px-6 py-4 sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <button onClick={onBack} className="flex items-center gap-2 text-[#6B6B66] hover:text-[#1A1A19] text-sm font-bold uppercase tracking-widest transition-all duration-300">
                            <ArrowLeft size={16} /> Stoppen
                        </button>
                        <div className="flex items-center gap-3">
                            {/* Level Badge with Progress */}
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border inline-flex items-center`}
                                    style={{
                                        backgroundColor: progress.currentLevel === 'beginner' ? 'rgba(42,157,143,0.1)' : progress.currentLevel === 'gevorderd' ? 'rgba(217,119,87,0.1)' : 'rgba(139,111,158,0.1)',
                                        color: progress.currentLevel === 'beginner' ? '#2A9D8F' : progress.currentLevel === 'gevorderd' ? '#D97757' : '#8B6F9E',
                                        borderColor: progress.currentLevel === 'beginner' ? 'rgba(42,157,143,0.3)' : progress.currentLevel === 'gevorderd' ? 'rgba(217,119,87,0.3)' : 'rgba(139,111,158,0.3)'
                                    }}>
                                    {progress.currentLevel === 'beginner' ? '🌱 Beginner' :
                                        progress.currentLevel === 'gevorderd' ? '⚡ Gevorderd' : '🎯 Expert'}
                                </span>
                                <span className="text-[10px] text-[#6B6B66] font-bold uppercase">
                                    Niveau {progress.currentLevel === 'beginner' ? 1 : progress.currentLevel === 'gevorderd' ? 2 : 3}/3
                                </span>
                                {vsoProfile && (
                                    <span className="text-[10px] px-2 py-1 rounded-full border font-bold uppercase tracking-tight" style={{ backgroundColor: 'rgba(139,111,158,0.1)', color: '#8B6F9E', borderColor: 'rgba(139,111,158,0.3)' }}>
                                        {vsoProfile === 'dagbesteding' ? 'Focus: Ervaren' : 'Focus: Beheersen'}
                                    </span>
                                )}
                            </div>
                            <div className="h-4 w-px bg-[#E8E6DF]" />
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {CHALLENGES.map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                backgroundColor: progress.completedChallenges.includes(CHALLENGES[i].id)
                                                    ? '#10B981'
                                                    : i === globalIndex
                                                        ? '#D97757'
                                                        : '#E8E6DF'
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-[#6B6B66] font-bold">
                                    {globalIndex + 1}/{totalChallenges}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#D97757]">
                            <Star size={16} fill="currentColor" />
                            <span className="font-bold">{progress.totalScore}</span>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto p-4 md:p-8">
                    {/* Goal Card */}
                    <div className="bg-white rounded-2xl p-6 border border-[#E8E6DF] mb-6">
                        {/* Level Progress Bar */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex-1 flex items-center gap-1">
                                {['beginner', 'gevorderd', 'expert'].map((level, i) => (
                                    <div key={level} className="flex-1 flex items-center">
                                        <div className={`h-1.5 flex-1 rounded-full transition-all`}
                                            style={{
                                                background: level === progress.currentLevel
                                                    ? 'linear-gradient(to right, #D97757, #C46849)'
                                                    : (level === 'beginner' || (level === 'gevorderd' && progress.currentLevel === 'expert'))
                                                        ? '#10B981'
                                                        : '#E8E6DF'
                                            }} />
                                        {i < 2 && <div className="w-2 h-2 rounded-full mx-1 bg-[#E8E6DF]" />}
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] text-[#6B6B66] font-bold">
                                {progress.currentLevel === 'beginner' ? '2 niveaus te gaan' :
                                    progress.currentLevel === 'gevorderd' ? '1 niveau te gaan' : 'Laatste niveau!'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl"
                                style={{
                                    backgroundColor: progress.currentLevel === 'beginner' ? 'rgba(42,157,143,0.1)' : progress.currentLevel === 'gevorderd' ? 'rgba(217,119,87,0.1)' : 'rgba(139,111,158,0.1)',
                                    color: progress.currentLevel === 'beginner' ? '#2A9D8F' : progress.currentLevel === 'gevorderd' ? '#D97757' : '#8B6F9E'
                                }}>
                                {getTypeIcon(currentChallenge.type)}
                            </div>
                            <span className="font-bold text-lg text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{currentChallenge.goal}</span>
                        </div>
                        <p className="text-[#6B6B66]">{currentChallenge.scenario}</p>
                    </div>

                    {/* Input Area */}
                    {!showFeedback ? (
                        <div className="mb-6 relative">
                            {/* Thinking Overlay */}
                            {isAnalyzing && (
                                <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 animate-in fade-in">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#D97757]/20 blur-xl rounded-full animate-pulse"></div>
                                        <div className="relative z-10 p-4 bg-white rounded-full border-2 border-[#D97757]/50 shadow-lg">
                                            <Brain size={32} className="text-[#D97757] animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-[#1A1A19] animate-pulse">{thinkingStep}</p>
                                        <p className="text-sm text-[#6B6B66] mt-1">De AI denkt na over je prompt...</p>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-[#D97757] rounded-full animate-bounce [animation-delay:0ms]"></div>
                                        <div className="w-2 h-2 bg-[#D97757] rounded-full animate-bounce [animation-delay:150ms]"></div>
                                        <div className="w-2 h-2 bg-[#D97757] rounded-full animate-bounce [animation-delay:300ms]"></div>
                                    </div>
                                </div>
                            )}

                            <label className="block text-sm font-bold text-[#3D3D38] mb-3">
                                {attempts > 0 ? 'Verbeter je prompt:' : 'Typ je prompt aan de AI:'}
                            </label>
                            <textarea
                                value={userPrompt}
                                onChange={e => setUserPrompt(e.target.value)}
                                placeholder="Typ hier je opdracht voor de AI..."
                                className="w-full bg-white border-2 border-[#E8E6DF] rounded-2xl p-4 text-[#1A1A19] placeholder-[#6B6B66] min-h-[120px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97757] transition-all duration-300 resize-none"
                                disabled={isAnalyzing}
                            />
                            <button
                                onClick={handleSubmitPrompt}
                                disabled={userPrompt.trim().length < 5 || isAnalyzing}
                                className="mt-4 w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg text-white"
                                style={{ backgroundColor: '#D97757' }}
                                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#C46849'; }}
                                onMouseLeave={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#D97757'; }}
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
                                    <h4 className="font-bold flex items-center gap-2 text-[#3D3D38]">
                                        <Target size={18} className="text-[#D97757]" />
                                        Wat moet je nog toevoegen?
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {aiResponse.feedback.map((item, i) => (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-xl flex items-center gap-3 border transition-all duration-300`}
                                                style={{
                                                    backgroundColor: item.found ? 'rgba(16,185,129,0.05)' : 'rgba(217,119,87,0.05)',
                                                    borderColor: item.found ? 'rgba(16,185,129,0.2)' : 'rgba(217,119,87,0.2)',
                                                    opacity: item.found ? 0.5 : 1
                                                }}
                                            >
                                                {item.found ? (
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#10B981' }}>
                                                        ✓
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#D97757' }}>
                                                        !
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-bold text-sm" style={{ color: item.found ? '#10B981' : '#1A1A19' }}>
                                                        {item.label}
                                                    </span>
                                                    {!item.found && (
                                                        <p className="text-xs text-[#6B6B66]">{item.hint}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 bg-[#D97757]/5 rounded-2xl p-5 border border-[#D97757]/20">
                                        <h4 className="font-bold mb-3 flex items-center gap-2 text-[#D97757] text-sm">
                                            <Lightbulb size={16} /> Tips voor dit niveau:
                                        </h4>
                                        <ul className="space-y-2">
                                            {currentChallenge.tips.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-2 text-[13px] text-[#6B6B66]">
                                                    <div className="w-1 h-1 rounded-full bg-[#D97757] mt-1.5 flex-shrink-0" />
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
                            <div className="rounded-2xl p-4 flex items-center justify-between border"
                                style={{
                                    backgroundColor: passed ? 'rgba(16,185,129,0.05)' : 'rgba(217,119,87,0.05)',
                                    borderColor: passed ? 'rgba(16,185,129,0.2)' : 'rgba(217,119,87,0.2)'
                                }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: passed ? '#10B981' : '#D97757' }}>
                                        {passed ? <ThumbsUp size={20} /> : <ThumbsDown size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold" style={{ color: passed ? '#10B981' : '#D97757' }}>
                                            {passed ? 'Missie Geslaagd!' : 'Nog niet helemaal...'}
                                        </h4>
                                        <p className="text-sm text-[#6B6B66]">
                                            {passed ? 'Je prompt gaf een geweldig resultaat.' : 'Kijk naar het verschil tussen jouw resultaat en het doel.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Checklist */}
                            <div className="bg-white rounded-2xl p-6 border border-[#E8E6DF]">
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-[#1A1A19]">
                                    <Target size={18} className="text-[#D97757]" />
                                    Wat zat er in je prompt?
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {aiResponse.feedback.map((item, i) => (
                                        <div
                                            key={i}
                                            className="p-3 rounded-xl flex items-center gap-3 border"
                                            style={{
                                                backgroundColor: item.found ? 'rgba(16,185,129,0.05)' : 'rgba(217,119,87,0.05)',
                                                borderColor: item.found ? 'rgba(16,185,129,0.3)' : 'rgba(217,119,87,0.2)'
                                            }}
                                        >
                                            {item.found ? (
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#10B981' }}>
                                                    <Sparkles size={12} />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'rgba(217,119,87,0.5)' }}>
                                                    ✗
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-bold text-sm" style={{ color: item.found ? '#10B981' : '#D97757' }}>
                                                    {item.label}
                                                </span>
                                                {!item.found && (
                                                    <p className="text-xs text-[#6B6B66]">{item.hint}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips (if not passed) */}
                            {!passed && (
                                <div className="bg-[#D97757]/5 rounded-2xl p-6 border border-[#D97757]/20">
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-[#D97757]">
                                        <Lightbulb size={18} /> Tips om te verbeteren:
                                    </h4>
                                    <ul className="space-y-2">
                                        {currentChallenge.tips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-[#3D3D38]">
                                                <ChevronRight size={14} className="mt-1 text-[#D97757] flex-shrink-0" />
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
                                        className="flex-1 bg-white border border-[#E8E6DF] text-[#3D3D38] py-4 rounded-full font-bold hover:bg-[#F0EEE8] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                                    >
                                        <RotateCcw size={18} /> Verbeteren
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={aiResponse.score < 2}
                                    className="flex-1 py-4 rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-300 shadow-lg"
                                    style={{ background: passed ? 'linear-gradient(to right, #10B981, #2A9D8F)' : 'linear-gradient(to right, #D97757, #C46849)' }}
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
        const percentage = Math.round((progress.totalScore / maxScore) * 100);
        const passed = percentage >= 60;

        return (
            <div className="min-h-screen overflow-y-auto bg-[#FAF9F0] text-[#1A1A19] p-4 md:p-8 flex items-center justify-center" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-lg w-full text-center">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 text-white"
                        style={{ backgroundColor: passed ? '#10B981' : '#D97757', boxShadow: passed ? '0 25px 50px -12px rgba(16,185,129,0.3)' : '0 25px 50px -12px rgba(217,119,87,0.3)' }}>
                        <Trophy size={56} />
                    </div>

                    <h1 className="text-4xl font-black mb-4" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        {passed ? 'Prompt Master!' : 'Goed bezig!'}
                    </h1>

                    <p className="text-xl text-[#6B6B66] mb-8">
                        {passed
                            ? 'Je beheerst nu de kunst van prompt engineering!'
                            : 'Je hebt veel geleerd over hoe je effectieve prompts schrijft.'
                        }
                    </p>

                    <div className="bg-white rounded-2xl p-8 mb-8 border border-[#E8E6DF]">
                        <div className="text-6xl font-black mb-2 text-[#D97757]">
                            {progress.totalScore} pts
                        </div>
                        <p className="text-[#6B6B66] font-bold mb-4">{progress.completedChallenges.length}/{CHALLENGES.length} uitdagingen voltooid</p>

                        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                            <div className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(42,157,143,0.05)', borderColor: 'rgba(42,157,143,0.2)' }}>
                                <div className="font-bold text-[#2A9D8F]">Beginner</div>
                                <div className="text-[#1A1A19]">{progress.completedChallenges.filter(id => CHALLENGES.find(c => c.id === id)?.level === 'beginner').length}/2</div>
                            </div>
                            <div className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(217,119,87,0.05)', borderColor: 'rgba(217,119,87,0.2)' }}>
                                <div className="font-bold text-[#D97757]">Gevorderd</div>
                                <div className="text-[#1A1A19]">{progress.completedChallenges.filter(id => CHALLENGES.find(c => c.id === id)?.level === 'gevorderd').length}/2</div>
                            </div>
                            <div className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(139,111,158,0.05)', borderColor: 'rgba(139,111,158,0.2)' }}>
                                <div className="font-bold text-[#8B6F9E]">Expert</div>
                                <div className="text-[#1A1A19]">{progress.completedChallenges.filter(id => CHALLENGES.find(c => c.id === id)?.level === 'expert').length}/2</div>
                            </div>
                        </div>
                    </div>

                    {/* Key Learnings */}
                    <div className="bg-white rounded-2xl p-6 mb-8 text-left border border-[#E8E6DF]">
                        <h4 className="font-bold mb-3 flex items-center gap-2 text-[#1A1A19]">
                            <Lightbulb size={18} className="text-[#D97757]" /> Wat je geleerd hebt:
                        </h4>
                        <ul className="space-y-2 text-sm text-[#3D3D38]">
                            <li className="flex items-start gap-2">
                                <span className="text-[#10B981]">✓</span> Specifieke details geven betere resultaten
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#10B981]">✓</span> Context en doel helpen de AI begrijpen
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#10B981]">✓</span> Format en structuur vragen geeft overzicht
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#10B981]">✓</span> Persona's en beperkingen geven controle
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={() => { clearSave(); onComplete(passed); }}
                        className="w-full py-5 rounded-full font-bold transition-all duration-300 text-white shadow-lg hover:shadow-xl"
                        style={{ backgroundColor: '#D97757' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C46849')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97757')}
                    >
                        Terug naar Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
