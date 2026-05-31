/**
 * PromptMasterMission.tsx
 * 
 * Interactieve prompt engineering ervaring waar leerlingen leren door te DOEN.
 * Ze typen prompts, zien concrete resultaatfeedback, krijgen rubric-feedback en verbeteren.
 * 
 * Niveaus:
 * 1. Beginner: Basisprincipes (specifiek zijn, context geven)
 * 2. Gevorderd: Structuur (stap-voor-stap, format specificeren)
 * 3. Expert: Geavanceerd (persona's, constraints, voorbeelden)
 */

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Sparkles, ArrowRight, Trophy, RotateCcw, Lightbulb, Zap, Target, Send, Bot, ThumbsUp, ThumbsDown, Star, Image, FileText, HelpCircle, Code, ChevronRight, Loader2, Brain, Eye, Palette } from 'lucide-react';
import { UserStats, VsoProfile } from '@/types';
import { isGeneratedImageDataUrl } from '@/services/geminiImageLogic';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import {
    buildLocalPromptResult,
    calculatePromptMasterMaxScore,
    isChallengePassed,
    type PromptMasterChallenge,
} from './promptMasterLogic';
import { MissionGoalBanner } from './templates/shared/MissionGoalBanner';
import type { MissionGoal } from './templates/shared/types';

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
    qaMode?: boolean;
    qaInitialPhase?: 'intro' | 'challenge' | 'result';
}

const MISSION_GOAL: MissionGoal = {
    primaryGoal: 'Schrijf prompts die steeds beter worden doordat je context, vorm en duidelijke eisen toevoegt.',
    criteria: {
        type: 'score-threshold',
        threshold: 60,
        description: 'De missie is behaald als je eindscore minstens 60% is.',
    },
    evidence: 'Verbeterde prompts met AI-feedback over specificiteit, context en resultaatvorm.',
};

// Types
interface Challenge extends PromptMasterChallenge {
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
    minScore: number; // Regular learner threshold, mirrored by promptMasterLogic.
    tips: string[];
}

type PromptMasterFeedbackItem = {
    label: string;
    found: boolean;
    hint: string;
    explanation?: string;
};

interface PromptMasterAiResponse {
    output: string;
    score: number;
    feedback: PromptMasterFeedbackItem[];
    generatedImageUrl?: string;
    generatedImageError?: string;
    generatedIdealImageUrl?: string;
    generatedIdealImageError?: string;
    isGeneratingIdealImage?: boolean;
}

interface PromptRescueChoice {
    id: 'doel' | 'context' | 'eisen';
    label: string;
    description: string;
    feedback: string;
    starterPrompt: string;
    focus: string;
}

const PROMPT_RESCUE_CHOICES: PromptRescueChoice[] = [
    {
        id: 'doel',
        label: 'Doel redden',
        description: 'Maak eerst duidelijk wat de AI precies moet maken.',
        feedback: 'Sterke reddingsroute: een duidelijk doel voorkomt dat AI zomaar iets algemeens teruggeeft.',
        starterPrompt: 'Maak een duidelijke afbeelding van een golden retriever puppy.',
        focus: '+ focus'
    },
    {
        id: 'context',
        label: 'Context geven',
        description: 'Vertel voor wie het resultaat is en waar het gebruikt wordt.',
        feedback: 'Slim gekozen: context maakt de prompt bruikbaar voor jouw situatie, niet voor zomaar iemand.',
        starterPrompt: 'Maak een afbeelding voor mijn dierenpresentatie van een golden retriever puppy in een park.',
        focus: '+ relevantie'
    },
    {
        id: 'eisen',
        label: 'Eisen stellen',
        description: 'Voeg meetbare details toe zoals stijl, lengte, plek of actie.',
        feedback: 'Goede kwaliteitszet: eisen maken straks zichtbaar wat er nog mist in je prompt.',
        starterPrompt: 'Maak een vrolijke afbeelding van een golden retriever puppy die rent door een zonnig groen park.',
        focus: '+ kwaliteit'
    }
];

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
        minScore: 3,
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
        minScore: 3,
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
        minScore: 4,
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
        minScore: 4,
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
        minScore: 4,
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
        minScore: 4,
        tips: ['Geef dieetbeperkingen aan', 'Vraag om een specifiek format (bullets, tabel)', 'Voeg praktische eisen toe (tijd, ingrediënten)']
    },
];

const formatLearnerImageError = () => 'De afbeelding kon nu niet worden gemaakt. Probeer het straks opnieuw.';

async function analyzePromptWithAI(
    prompt: string,
    challenge: Challenge,
    onThinkingStep: (step: string) => void,
    vsoProfile?: VsoProfile
): Promise<PromptMasterAiResponse> {

    onThinkingStep('🔍 Prompt analyseren...');

    await new Promise(r => setTimeout(r, 350));
    onThinkingStep('📊 Resultaat verwerken...');
    await new Promise(r => setTimeout(r, 250));

    const baseResult = buildLocalPromptResult(prompt, challenge, vsoProfile);
    let generatedImageError: string | undefined;
    if (challenge.type === 'image') {
        generatedImageError = 'Deze opdracht gebruikt lokale promptanalyse zodat je feedback ook werkt wanneer beeld-AI tijdelijk niet beschikbaar is.';
    }

    return { ...baseResult, generatedImageError };
}

// Visual component for displaying AI output
const ResultVisual: React.FC<{
    type: 'image' | 'text' | 'help' | 'code';
    content: string;
    isIdeal?: boolean;
    isSuccess?: boolean;
    generatedImage?: string; // NEW: AI-generated image based on student prompt
    imageError?: string;
    isGeneratingImage?: boolean;
}> = ({ type, content, isIdeal, isSuccess, generatedImage, imageError, isGeneratingImage }) => {
    // Icons & Colors based on type
    const getBgColor = () => {
        if (isIdeal) return 'bg-[#5F947D]/10 border-[#5F947D]/30';
        if (isSuccess) return 'bg-[#5F947D]/10 border-[#5F947D]/30';
        return 'bg-[#D97848]/10 border-[#D97848]/30';
    };

    const getHeader = () => {
        if (isIdeal) return <div className="flex items-center gap-2 text-[#5F947D] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}><Target size={16} /> <span className="font-bold">Ideaal Resultaat</span></div>;
        return <div className="flex items-center gap-2 text-[#445865] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}><Bot size={16} /> <span className="font-bold">Jouw Resultaat</span></div>;
    };

    // IMAGE CHALLENGE VISUALIZATION
    if (type === 'image') {
        const imageToShow = isGeneratedImageDataUrl(generatedImage) ? generatedImage : null;
        const missingImageTitle = isGeneratingImage
            ? isIdeal
                ? 'Gemini Nano Banana maakt het ideale voorbeeld...'
                : 'Gemini Nano Banana maakt je afbeelding...'
            : imageError
            ? 'Beeldvoorbeeld niet opgehaald'
            : isIdeal
                ? 'Ideale afbeelding nog niet beschikbaar'
                : 'Geen echte Gemini Nano Banana-afbeelding ontvangen';
        const missingImageDetail = isGeneratingImage
            ? 'Even geduld, de echte AI-afbeelding wordt opgehaald.'
            : imageError
            ? formatLearnerImageError()
            : isIdeal
                ? content.replace(/^De AI.*?:\s*/i, '')
                : 'Je prompt is wel beoordeeld, maar er wordt hier geen nep-preview meer getoond.';

        return (
            <div className={`p-4 rounded-2xl border ${getBgColor()} h-full flex flex-col`}>
                {getHeader()}
                <div className="flex-1 min-h-[200px] bg-[#E7D8BD] rounded-xl flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group">
                    {/* Show actual image if available */}
                    {imageToShow ? (
                        <>
                            <img
                                src={imageToShow}
                                alt={isIdeal ? "Ideaal gegenereerde afbeelding" : "Jouw gegenereerde afbeelding"}
                                className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#08283B]/70 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                                <p className="text-[#FFFDF7] text-sm font-medium drop-shadow-lg" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {content.replace(/^De AI.*?:\s*/i, '')}
                                </p>
                            </div>
                            <div className={`absolute top-2 right-2 text-[#FFFDF7] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full z-10`} style={{ backgroundColor: isIdeal || isSuccess ? '#5F947D' : '#D97848' }}>
                                {isIdeal ? 'Perfect' : isSuccess ? 'Goed gedaan!' : 'Jouw resultaat'}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FCF6EA] to-[#E7D8BD]" />
                            <div className="relative z-10 flex flex-col items-center gap-3 px-4">
                                {isGeneratingImage && (
                                    <div className="rounded-full bg-[#FFFDF7]/90 p-3 text-[#D97848] shadow-sm">
                                        <Loader2 size={24} className="animate-spin" />
                                    </div>
                                )}
                                <div className="bg-[#FFFDF7]/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-[#E7D8BD] max-w-[90%]">
                                    <p className="mb-2 text-[12px] font-black uppercase tracking-wide text-[#D97848]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {missingImageTitle}
                                    </p>
                                    <p className="text-[13px] text-[#445865] font-medium text-center leading-relaxed" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {missingImageDetail}
                                    </p>
                                </div>
                                {!isIdeal && (
                <p className="rounded-full border border-[#D97848]/25 bg-[#D97848]/10 px-3 py-1 text-[10px] font-bold text-[#D97848]">
                    Je prompt wordt lokaal beoordeeld op duidelijke criteria.
                </p>
                                )}
                            </div>
                            {isSuccess && <div className="absolute top-2 right-2 text-[#FFFDF7] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#5F947D' }}>Goed gedaan!</div>}
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
                <div className="flex-1 bg-[#08283B] rounded-xl p-4 overflow-x-auto relative">
                    <div className="flex gap-1.5 mb-3 opacity-50">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D97848]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D7C95F]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#5F947D]" />
                    </div>
                    <code className="text-[#E7D8BD] block leading-relaxed">
                        <span className="text-[#0B453F]">def</span> <span className="text-[#D97848]">calculator</span>():<br />
                        &nbsp;&nbsp;<span className="text-[#445865]"># {content.substring(0, 50)}...</span><br />
                        &nbsp;&nbsp;<span className="text-[#0B453F]">return</span> result
                    </code>
                    <div className="mt-4 pt-4 border-t border-[#445865] text-xs text-[#445865]">
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
            <div className="flex-1 bg-[#FFFDF7] rounded-xl p-4 text-[#445865] shadow-sm relative overflow-y-auto max-h-[300px]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-[#E7D8BD]" />
                {/* Simulate paper lines */}
                <div className="space-y-3">
                    <div className="h-4 bg-[#E7D8BD] rounded w-3/4" />
                    <div className="h-4 bg-[#E7D8BD] rounded w-full" />
                    <div className="h-4 bg-[#E7D8BD] rounded w-5/6" />
                </div>

                <div className="mt-4 p-3 bg-[#FCF6EA] rounded-lg text-sm font-medium border-l-4 border-[#D97848]">
                    "{content}"
                </div>
            </div>
        </div>
    );
};

const ResultFeedbackRail: React.FC<{
    passed: boolean;
    feedback: PromptMasterFeedbackItem[];
    tips: string[];
    className?: string;
}> = ({ passed, feedback, tips, className = '' }) => (
    <aside className={`space-y-3 ${className}`}>
        <div className="rounded-2xl p-4 border"
            style={{
                backgroundColor: passed ? 'rgba(95, 148, 125,0.08)' : 'rgba(217, 120, 72,0.08)',
                borderColor: passed ? 'rgba(95, 148, 125,0.25)' : 'rgba(217, 120, 72,0.25)'
            }}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#FFFDF7] shrink-0" style={{ backgroundColor: passed ? '#5F947D' : '#D97848' }}>
                    {passed ? <ThumbsUp size={20} /> : <ThumbsDown size={20} />}
                </div>
                <div>
                    <h4 className="font-bold" style={{ color: passed ? '#5F947D' : '#D97848' }}>
                        {passed ? 'Missie Geslaagd!' : 'Nog niet helemaal...'}
                    </h4>
                    <p className="text-sm text-[#445865]">
                        {passed ? 'Je prompt gaf een geweldig resultaat.' : 'Kijk naar het verschil tussen jouw resultaat en het doel.'}
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-[#FFFDF7] rounded-2xl p-4 border border-[#E7D8BD]">
            <h4 className="font-bold mb-3 flex items-center gap-2 text-[#08283B]">
                <Target size={18} className="text-[#D97848]" />
                Wat zat er in je prompt?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {feedback.map((item, i) => (
                    <div
                        key={i}
                        className="p-3 rounded-xl flex items-center gap-3 border"
                        style={{
                            backgroundColor: item.found ? 'rgba(95, 148, 125,0.08)' : 'rgba(217, 120, 72,0.08)',
                            borderColor: item.found ? 'rgba(95, 148, 125,0.3)' : 'rgba(217, 120, 72,0.25)'
                        }}
                    >
                        {item.found ? (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#FFFDF7] shrink-0" style={{ backgroundColor: '#5F947D' }}>
                                <Sparkles size={12} />
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#FFFDF7] text-xs shrink-0" style={{ backgroundColor: 'rgba(217, 120, 72,0.5)' }}>
                                x
                            </div>
                        )}
                        <div className="min-w-0">
                            <span className="font-bold text-sm" style={{ color: item.found ? '#5F947D' : '#D97848' }}>
                                {item.label}
                            </span>
                            {!item.found && (
                                <p className="text-xs text-[#445865] leading-snug">{item.hint}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {!passed && (
            <div className="bg-[#D97848]/5 rounded-2xl p-4 border border-[#D97848]/20">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-[#D97848]">
                    <Lightbulb size={18} /> Tips om te verbeteren:
                </h4>
                <ul className="space-y-2">
                    {tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#445865]">
                            <ChevronRight size={14} className="mt-1 text-[#D97848] flex-shrink-0" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </aside>
);

const PromptExampleComparison: React.FC<{ challenge: Challenge }> = ({ challenge }) => {
    const weakPrompt = challenge.id === 'b1'
        ? 'Teken een hond.'
        : challenge.type === 'image'
            ? 'Maak een plaatje.'
            : 'Schrijf iets.';
    const strongPrompt = challenge.id === 'b1'
        ? 'Teken een vrolijke golden retriever puppy die door een zonnig park rent.'
        : challenge.goodOutputExample;

    const comparisonImages = challenge.id === 'b1'
        ? {
            weak: '/assets/missions/prompt-master-vague-dog.webp',
            strong: '/assets/missions/prompt-master-specific-dog.webp',
        }
        : null;

    const ResultImage = ({ src, detailed }: { src: string; detailed?: boolean }) => (
        <div className={`relative hidden aspect-[21/9] min-h-[90px] overflow-hidden rounded-xl border md:block ${detailed ? 'border-[#5F947D]/35 bg-[#FCF6EA]' : 'border-[#E7D8BD] bg-[#F3E4CB]'}`}>
            <img
                src={src}
                alt={detailed ? 'Specifiek AI-resultaat: een vrolijke golden retriever puppy rent door een zonnig park.' : 'Vaag AI-resultaat: een generieke bruine hond in een lege witte ruimte.'}
                className="h-full w-full object-cover"
                loading="lazy"
            />
            <div className="absolute left-3 top-3 rounded-full bg-[#FFFDF7]/95 px-3 py-1 text-[10px] font-black uppercase text-[#445865] shadow-sm">
                {detailed ? 'Goed resultaat' : 'Slecht resultaat'}
            </div>
        </div>
    );

    return (
        <section className="mb-3 rounded-2xl border border-[#E7D8BD] bg-[#FFFDF7] p-3 shadow-sm" aria-label="Prompt voorbeeld vergelijken">
            <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D7C95F]/30 text-[#08283B]">
                    <Eye size={18} />
                </div>
                <div>
                    <h3 className="font-black text-[#08283B]">Bekijk eerst het verschil</h3>
                    <p className="text-xs font-semibold text-[#445865]">Vergelijk een te vage prompt met een prompt die meer details geeft.</p>
                </div>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
                <article className="rounded-xl border border-[#E7D8BD] bg-[#FCF6EA] p-2">
                    {comparisonImages && (
                        <ResultImage src={comparisonImages.weak} />
                    )}
                    <div className="mt-2">
                        <p className="text-[10px] font-black uppercase text-[#D97848]">Slechte prompt</p>
                        <p className="mt-1 rounded-xl bg-[#FFFDF7] p-2 text-xs font-bold text-[#08283B] md:text-sm">"{weakPrompt}"</p>
                        <p className="mt-1 text-xs font-semibold leading-snug text-[#445865] line-clamp-2">{challenge.badOutputExample}</p>
                    </div>
                </article>
                <article className="rounded-xl border border-[#5F947D]/35 bg-[#FCF6EA] p-2">
                    {comparisonImages && (
                        <ResultImage src={comparisonImages.strong} detailed />
                    )}
                    <div className="mt-2">
                        <p className="text-[10px] font-black uppercase text-[#5F947D]">Goede prompt</p>
                        <p className="mt-1 rounded-xl bg-[#FFFDF7] p-2 text-xs font-bold text-[#08283B] md:text-sm">"{strongPrompt}"</p>
                        <p className="mt-1 text-xs font-semibold leading-snug text-[#445865] line-clamp-2">{challenge.goodOutputExample}</p>
                    </div>
                </article>
            </div>
        </section>
    );
};

export const PromptMasterMission: React.FC<Props> = ({ onBack, onComplete, vsoProfile, qaMode = false, qaInitialPhase }) => {
    // Persistent progress state (auto-saved to localStorage)
    const { state: progress, setState: setProgress, clearSave, hasSavedProgress } = useMissionAutoSave<PromptMasterProgress>(
        'prompt-master',
        { currentLevel: 'beginner', challengeIndex: 0, totalScore: 0, completedChallenges: [] }
    );

    // Always start with the mission explanation, even when a saved challenge exists.
    const [phase, setPhase] = useState<'intro' | 'challenge' | 'result'>(qaInitialPhase ?? 'intro');
    const [userPrompt, setUserPrompt] = useState('');
    const [aiResponse, setAiResponse] = useState<PromptMasterAiResponse | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [selectedRescueChoice, setSelectedRescueChoice] = useState<PromptRescueChoice | null>(null);
    const idealImageRequestRef = useRef(0);

    // NEW: Loading and thinking states
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [thinkingStep, setThinkingStep] = useState('');

    // Get current challenges for level
    const levelChallenges = CHALLENGES.filter(c => c.level === progress.currentLevel);
    const currentChallenge = levelChallenges[progress.challengeIndex];

    // Global progress across all challenges
    const globalIndex = CHALLENGES.findIndex(c => c.id === currentChallenge?.id);
    const totalChallenges = CHALLENGES.length;

    const allLevelsDone = progress.currentLevel === 'expert' && progress.challengeIndex >= levelChallenges.length - 1 && progress.completedChallenges.includes(currentChallenge?.id);
    const currentResponsePassed = Boolean(aiResponse && currentChallenge && isChallengePassed(aiResponse.score, currentChallenge, vsoProfile));

    const handleStartLab = () => {
        if (!selectedRescueChoice) return;
        setUserPrompt(currentChallenge?.id === 'b1' ? selectedRescueChoice.starterPrompt : '');
        setPhase('challenge');
    };

    useEffect(() => {
        if (qaMode || !showFeedback || !aiResponse || !currentChallenge || currentChallenge.type !== 'image' || currentResponsePassed) return;
        if (aiResponse.generatedIdealImageUrl || aiResponse.generatedIdealImageError || aiResponse.isGeneratingIdealImage) return;

        setAiResponse(prev => prev ? {
            ...prev,
            isGeneratingIdealImage: false,
            generatedIdealImageError: 'Bekijk de voorbeeldprompt en je criterialijst om je beeldprompt te verbeteren.',
        } : prev);
    }, [aiResponse, currentChallenge, currentResponsePassed, qaMode, showFeedback]);

    // Handlers
    const handleSubmitPrompt = async () => {
        if (!userPrompt.trim() || !currentChallenge || isAnalyzing) return;

        idealImageRequestRef.current += 1;
        setAttempts(a => a + 1);
        setIsAnalyzing(true);
        setThinkingStep('🔍 Prompt analyseren...');

        try {
            if (qaMode) {
                const result = buildLocalPromptResult(userPrompt, currentChallenge, vsoProfile);
                const qaImageMessage = currentChallenge.type === 'image'
                    ? 'QA-modus gebruikt geen echte AI-afbeeldingen.'
                    : undefined;
                const passed = isChallengePassed(result.score, currentChallenge, vsoProfile);

                setAiResponse({
                    ...result,
                    generatedImageError: qaImageMessage,
                    generatedIdealImageError: passed ? undefined : qaImageMessage,
                });
                setShowFeedback(true);

                if (passed && !progress.completedChallenges.includes(currentChallenge.id)) {
                    setProgress(prev => ({
                        ...prev,
                        totalScore: prev.totalScore + result.score * 10,
                        completedChallenges: [...prev.completedChallenges, currentChallenge.id],
                    }));
                }

                return;
            }

            // Use real AI analysis
            const result = await analyzePromptWithAI(
                userPrompt,
                currentChallenge,
                (step) => setThinkingStep(step),
                vsoProfile
            );

            setAiResponse(result);
            setShowFeedback(true);

            if (isChallengePassed(result.score, currentChallenge, vsoProfile) && !progress.completedChallenges.includes(currentChallenge.id)) {
                setProgress(prev => ({
                    ...prev,
                    totalScore: prev.totalScore + result.score * 10,
                    completedChallenges: [...prev.completedChallenges, currentChallenge.id],
                }));
            }
        } catch (error) {
            console.error('AI analysis error:', error);
            const message = error instanceof Error ? error.message : 'Er ging iets mis bij het analyseren. Probeer het opnieuw.';
            // Show a simple error feedback
            setAiResponse({
                output: message,
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
        idealImageRequestRef.current += 1;
        // Keep userPrompt but hide the main result screen
        setShowFeedback(false);
    };

    const handleNext = () => {
        idealImageRequestRef.current += 1;
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
            case 'beginner': return 'from-[#5F947D] to-[#5F947D]';
            case 'gevorderd': return 'from-[#D97848] to-[#D97848]';
            case 'expert': return 'from-[#0B453F] to-[#D97848]';
            default: return 'from-[#5F947D] to-[#D97848]';
        }
    };

    // INTRO SCREEN
    if (phase === 'intro') {
        return (
            <div data-qa="prompt-master-intro" className="h-dvh overflow-y-auto bg-[#FCF6EA] text-[#08283B] flex flex-col" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                {/* Header */}
                <header className="bg-[#FFFDF7] border-b border-[#E7D8BD] px-4 py-3 flex items-center justify-between md:px-6 md:py-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#445865] hover:text-[#08283B] transition-all duration-300 font-bold text-sm uppercase"
                    >
                        <ArrowLeft size={16} /> Terug
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#D7C95F]/25 text-[#08283B] rounded-xl">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black uppercase flex items-center gap-2">
                                Prompt Lab <Zap size={16} className="text-[#D97848]" />
                            </h1>
                            <p className="text-[10px] text-[#445865] uppercase font-bold">
                                Prompt Engineering
                            </p>
                        </div>
                    </div>
                    <div className="w-20" /> {/* Spacer for centering */}
                </header>

                {/* Content */}
                <div className="flex-1 flex items-start justify-center p-4 md:p-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.25rem] md:rounded-[1.5rem] flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-2xl text-[#08283B]" style={{ background: 'linear-gradient(135deg, #D7C95F, #F3E4CB)', boxShadow: '0 25px 50px -12px rgba(215, 201, 95,0.35)' }}>
                            <Sparkles size={32} />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black mb-2 md:mb-3 text-[#08283B]">
                            Leer Prompt Engineering door te <span className="text-[#0B453F] underline decoration-[#D7C95F] decoration-4 underline-offset-4">doen</span>
                        </h2>

                        <p className="text-sm md:text-base text-[#445865] mb-4 leading-relaxed max-w-2xl mx-auto">
                            Je leert hoe je een AI duidelijke opdrachten geeft. In elke ronde schrijf je zelf een prompt, bekijk je het resultaat en verbeter je je prompt tot de AI begrijpt wat jij bedoelt.
                        </p>

                        <div className="max-w-2xl mx-auto mb-4">
                            <MissionGoalBanner goal={MISSION_GOAL} compact />
                        </div>

                        <section
                            className="mb-4 overflow-hidden rounded-2xl border border-[#E7D8BD] bg-[#FFFDF7] text-left shadow-sm"
                            data-qa="prompt-master-rescue-console"
                            aria-label="Prompt rescue startkeuze"
                        >
                            <div className="grid gap-3 bg-[#08283B] p-4 text-white md:grid-cols-[1fr_auto] md:items-center">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D7C95F]">Prompt rescue</p>
                                    <h3 className="mt-1 text-xl font-black leading-tight" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                        Red eerst een vage prompt
                                    </h3>
                                    <p className="mt-2 text-sm font-semibold leading-relaxed text-white/85">
                                        De AI krijgt: "Teken een hond." Kies welke reddingsroute je als eerste test.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-white/15 bg-white/10 p-3 text-xs font-black uppercase tracking-widest text-white/80" data-qa="prompt-master-rescue-route-strip">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#D7C95F]">Kies</span>
                                        <span className="h-px w-5 bg-white/30" />
                                        <span>Schrijf</span>
                                        <span className="h-px w-5 bg-white/30" />
                                        <span>Check</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 p-4">
                                <div className="rounded-xl border border-[#D97848]/25 bg-[#D97848]/10 p-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#D97848]">Vage prompt alert</p>
                                    <p className="mt-1 text-sm font-black leading-relaxed text-[#08283B]">"Teken een hond."</p>
                                </div>

                                <div className="grid gap-3 md:grid-cols-3">
                                    {PROMPT_RESCUE_CHOICES.map((choice, index) => {
                                        const isSelected = selectedRescueChoice?.id === choice.id;

                                        return (
                                            <button
                                                key={choice.id}
                                                type="button"
                                                onClick={() => setSelectedRescueChoice(choice)}
                                                aria-pressed={isSelected}
                                                data-qa={`prompt-master-rescue-option-${choice.id}`}
                                                className={`min-h-[124px] rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#D97848] ${isSelected
                                                    ? 'border-[#0B453F] bg-[#0B453F]/10 shadow-md ring-2 ring-[#0B453F]/15'
                                                    : 'border-[#E7D8BD] bg-white hover:border-[#0B453F]/40 hover:bg-[#FCF6EA]'
                                                    }`}
                                            >
                                                <span className="mb-3 inline-flex rounded-full bg-[#08283B] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                                                    Route {index + 1}
                                                </span>
                                                <span className="flex items-start justify-between gap-3">
                                                    <span className="text-base font-black leading-tight text-[#08283B]">{choice.label}</span>
                                                    {isSelected && <span className="shrink-0 rounded-full bg-[#0B453F] px-2 py-0.5 text-[10px] font-black text-white">OK</span>}
                                                </span>
                                                <span className="mt-2 block text-xs font-semibold leading-relaxed text-[#445865]">{choice.description}</span>
                                                <span className="mt-3 inline-flex rounded-full bg-[#D7C95F]/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#08283B]">{choice.focus}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {selectedRescueChoice && (
                                    <div className="space-y-3 rounded-xl border border-[#5F947D]/30 bg-[#5F947D]/10 p-3 text-sm font-semibold leading-relaxed text-[#08283B]" data-qa="prompt-master-rescue-feedback">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-[#0B453F]">Goede keuze</p>
                                            <p className="mt-1">{selectedRescueChoice.feedback}</p>
                                        </div>
                                        <div className="rounded-lg border border-[#0B453F]/20 bg-white/80 p-3 text-xs text-[#08283B]" data-qa="prompt-master-rescue-starter-prompt">
                                            <span className="block font-black uppercase tracking-widest text-[#445865]">Startprompt</span>
                                            <span className="mt-1 block font-bold leading-relaxed">"{selectedRescueChoice.starterPrompt}"</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <button
                            data-qa="prompt-master-start"
                            onClick={handleStartLab}
                            disabled={!selectedRescueChoice}
                            className="mb-4 text-[#08283B] px-10 py-3 md:py-3.5 rounded-full font-black text-base transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                            style={{ backgroundColor: selectedRescueChoice ? '#D7C95F' : '#F3E4CB' }}
                            onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#99984D'; }}
                            onMouseLeave={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#D7C95F'; }}
                        >
                            {!selectedRescueChoice ? 'Kies eerst een reddingsroute' : hasSavedProgress ? 'Verder met je route' : 'Start het Lab'}
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-3 md:gap-4 mb-4 text-left">
                            <div className="bg-[#FFFDF7] rounded-2xl p-4 md:p-5 border border-[#E7D8BD]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Target size={18} className="text-[#5F947D]" />
                                    <h3 className="font-black text-[#08283B]">Doel van de opdracht</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-[#445865]">
                                    Aan het einde kun je een prompt schrijven die specifiek genoeg is: met onderwerp, context, gewenste vorm en extra regels. Zo krijg je minder toeval en meer controle over AI-output.
                                </p>
                            </div>
                            <div className="bg-[#FFFDF7] rounded-2xl p-4 md:p-5 border border-[#E7D8BD]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Lightbulb size={18} className="text-[#D7C95F]" />
                                    <h3 className="font-black text-[#08283B]">Zo werk je</h3>
                                </div>
                                <ol className="space-y-2 text-sm text-[#445865]">
                                    {['Lees de opdracht van de ronde.', 'Typ je eigen prompt aan de AI.', 'Bekijk feedback: wat mist er nog?', 'Verbeter je prompt en ga door.'].map((step, index) => (
                                        <li key={step} className="flex gap-2">
                                            <span className="w-5 h-5 rounded-full bg-[#5F947D] text-white text-[11px] font-black flex items-center justify-center shrink-0">{index + 1}</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        {/* Levels Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                            <div className="bg-[#FFFDF7] rounded-2xl p-3 md:p-4 border border-[#E7D8BD]">
                                <div className="text-2xl mb-1">🌱</div>
                                <h3 className="font-bold mb-1 text-[#5F947D]">Beginner</h3>
                                <p className="text-xs text-[#445865]">Specifiek zijn, context geven</p>
                            </div>
                            <div className="bg-[#FFFDF7] rounded-2xl p-3 md:p-4 border border-[#E7D8BD]">
                                <div className="text-2xl mb-1">⚡</div>
                                <h3 className="font-bold mb-1 text-[#D97848]">Gevorderd</h3>
                                <p className="text-xs text-[#445865]">Structuur, format, toon</p>
                            </div>
                            <div className="bg-[#FFFDF7] rounded-2xl p-3 md:p-4 border border-[#E7D8BD]">
                                <div className="text-2xl mb-1">🎯</div>
                                <h3 className="font-bold mb-1 text-[#0B453F]">Expert</h3>
                                <p className="text-xs text-[#445865]">Persona's, beperkingen</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // CHALLENGE SCREEN
    if (phase === 'challenge' && currentChallenge) {
        const passed = currentResponsePassed;

        return (
            <div data-qa="prompt-master-challenge" className="h-dvh overflow-y-auto bg-[#FCF6EA] text-[#08283B] flex flex-col" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                {/* Header */}
                <header className="bg-[#FFFDF7] border-b border-[#E7D8BD] px-4 py-3 md:px-6 md:py-4 sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
                        <button onClick={onBack} className="flex items-center gap-2 text-[#445865] hover:text-[#08283B] text-sm font-bold uppercase transition-all duration-300">
                            <ArrowLeft size={16} /> Stoppen
                        </button>
                        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 md:gap-3">
                            {/* Level Badge with Progress */}
                            <div className="flex min-w-0 items-center gap-2">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border inline-flex items-center`}
                                    style={{
                                        backgroundColor: progress.currentLevel === 'beginner' ? 'rgba(95, 148, 125,0.1)' : progress.currentLevel === 'gevorderd' ? 'rgba(217, 120, 72,0.1)' : 'rgba(11, 69, 63,0.1)',
                                        color: progress.currentLevel === 'beginner' ? '#5F947D' : progress.currentLevel === 'gevorderd' ? '#D97848' : '#0B453F',
                                        borderColor: progress.currentLevel === 'beginner' ? 'rgba(95, 148, 125,0.3)' : progress.currentLevel === 'gevorderd' ? 'rgba(217, 120, 72,0.3)' : 'rgba(11, 69, 63,0.3)'
                                    }}>
                                    {progress.currentLevel === 'beginner' ? '🌱 Beginner' :
                                        progress.currentLevel === 'gevorderd' ? '⚡ Gevorderd' : '🎯 Expert'}
                                </span>
                                <span className="hidden text-[10px] text-[#445865] font-bold uppercase sm:inline">
                                    Niveau {progress.currentLevel === 'beginner' ? 1 : progress.currentLevel === 'gevorderd' ? 2 : 3}/3
                                </span>
                                {vsoProfile && (
                                    <span className="text-[10px] px-2 py-1 rounded-full border font-bold uppercase" style={{ backgroundColor: 'rgba(11, 69, 63,0.1)', color: '#0B453F', borderColor: 'rgba(11, 69, 63,0.3)' }}>
                                        {vsoProfile === 'dagbesteding' ? 'Focus: Ervaren' : 'Focus: Beheersen'}
                                    </span>
                                )}
                            </div>
                            <div className="hidden h-4 w-px bg-[#E7D8BD] sm:block" />
                            <div className="hidden items-center gap-2 sm:flex">
                                <div className="flex gap-0.5">
                                    {CHALLENGES.map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                backgroundColor: progress.completedChallenges.includes(CHALLENGES[i].id)
                                                    ? '#5F947D'
                                                    : i === globalIndex
                                                        ? '#D97848'
                                                        : '#E7D8BD'
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-[#445865] font-bold">
                                    {globalIndex + 1}/{totalChallenges}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#D97848]">
                            <Star size={16} fill="currentColor" />
                            <span className="font-bold">{progress.totalScore}</span>
                        </div>
                    </div>
                </header>

                <div className={`${showFeedback ? 'max-w-7xl' : 'max-w-4xl'} mx-auto p-4 md:p-6`}>
                    {/* Goal Card */}
                    {!showFeedback && (
                    <div className="bg-[#FFFDF7] rounded-2xl p-4 md:p-5 border border-[#E7D8BD] mb-4 md:mb-5">
                        {/* Level Progress Bar */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex-1 flex items-center gap-1">
                                {['beginner', 'gevorderd', 'expert'].map((level, i) => (
                                    <div key={level} className="flex-1 flex items-center">
                                        <div className={`h-1.5 flex-1 rounded-full transition-all`}
                                            style={{
                                                background: level === progress.currentLevel
                                                    ? 'linear-gradient(to right, #D97848, #D97848)'
                                                    : (level === 'beginner' || (level === 'gevorderd' && progress.currentLevel === 'expert'))
                                                        ? '#5F947D'
                                                        : '#E7D8BD'
                                            }} />
                                        {i < 2 && <div className="w-2 h-2 rounded-full mx-1 bg-[#E7D8BD]" />}
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] text-[#445865] font-bold">
                                {progress.currentLevel === 'beginner' ? '2 niveaus te gaan' :
                                    progress.currentLevel === 'gevorderd' ? '1 niveau te gaan' : 'Laatste niveau!'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl"
                                style={{
                                    backgroundColor: progress.currentLevel === 'beginner' ? 'rgba(95, 148, 125,0.1)' : progress.currentLevel === 'gevorderd' ? 'rgba(217, 120, 72,0.1)' : 'rgba(11, 69, 63,0.1)',
                                    color: progress.currentLevel === 'beginner' ? '#5F947D' : progress.currentLevel === 'gevorderd' ? '#D97848' : '#0B453F'
                                }}>
                                {getTypeIcon(currentChallenge.type)}
                            </div>
                            <span className="font-bold text-lg text-[#08283B]">{currentChallenge.goal}</span>
                        </div>
                        <p className="text-[#445865]">{currentChallenge.scenario}</p>
                    </div>
                    )}

                    {attempts === 0 && !showFeedback && (
                        <PromptExampleComparison challenge={currentChallenge} />
                    )}

                    {/* Input Area */}
                    {!showFeedback ? (
                        <div className="mb-6 relative">
                            {/* Thinking Overlay */}
                            {isAnalyzing && (
                                <div className="absolute inset-0 z-20 bg-[#FFFDF7]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 animate-in fade-in">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#D97848]/20 blur-xl rounded-full animate-pulse"></div>
                                        <div className="relative z-10 p-4 bg-[#FFFDF7] rounded-full border-2 border-[#D97848]/50 shadow-lg">
                                            <Brain size={32} className="text-[#D97848] animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-[#08283B] animate-pulse">{thinkingStep}</p>
                                        <p className="text-sm text-[#445865] mt-1">De AI denkt na over je prompt...</p>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-[#D97848] rounded-full animate-bounce [animation-delay:0ms]"></div>
                                        <div className="w-2 h-2 bg-[#D97848] rounded-full animate-bounce [animation-delay:150ms]"></div>
                                        <div className="w-2 h-2 bg-[#D97848] rounded-full animate-bounce [animation-delay:300ms]"></div>
                                    </div>
                                </div>
                            )}

                            <label className="block text-sm font-bold text-[#445865] mb-3">
                                {attempts > 0 ? 'Verbeter je prompt:' : 'Nu jij: typ je prompt aan de AI:'}
                            </label>
                            <textarea
                                data-qa="prompt-master-input"
                                value={userPrompt}
                                onChange={e => setUserPrompt(e.target.value)}
                                placeholder="Typ hier je opdracht voor de AI..."
                                className="w-full bg-[#FFFDF7] border-2 border-[#E7D8BD] rounded-2xl p-4 text-[#08283B] placeholder-[#445865] min-h-[80px] md:min-h-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848] transition-all duration-300 resize-none"
                                disabled={isAnalyzing}
                            />
                            <button
                                data-qa="prompt-master-submit"
                                onClick={handleSubmitPrompt}
                                disabled={userPrompt.trim().length < 5 || isAnalyzing}
                                className="mt-3 w-full py-3 md:py-4 rounded-full font-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg text-[#08283B]"
                                style={{ backgroundColor: '#D7C95F' }}
                                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#99984D'; }}
                                onMouseLeave={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#D7C95F'; }}
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
                                    <h4 className="font-bold flex items-center gap-2 text-[#445865]">
                                        <Target size={18} className="text-[#D97848]" />
                                        Wat moet je nog toevoegen?
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {aiResponse.feedback.map((item, i) => (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-xl flex items-center gap-3 border transition-all duration-300`}
                                                style={{
                                                    backgroundColor: item.found ? 'rgba(95, 148, 125,0.08)' : 'rgba(217, 120, 72,0.08)',
                                                    borderColor: item.found ? 'rgba(95, 148, 125,0.25)' : 'rgba(217, 120, 72,0.25)',
                                                    opacity: item.found ? 0.5 : 1
                                                }}
                                            >
                                                {item.found ? (
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#FFFDF7]" style={{ backgroundColor: '#5F947D' }}>
                                                        ✓
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#FFFDF7] text-[10px] font-bold" style={{ backgroundColor: '#D97848' }}>
                                                        !
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-bold text-sm" style={{ color: item.found ? '#5F947D' : '#08283B' }}>
                                                        {item.label}
                                                    </span>
                                                    {!item.found && (
                                                        <p className="text-xs text-[#445865]">{item.hint}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 bg-[#D97848]/5 rounded-2xl p-5 border border-[#D97848]/20">
                                        <h4 className="font-bold mb-3 flex items-center gap-2 text-[#D97848] text-sm">
                                            <Lightbulb size={16} /> Tips voor dit niveau:
                                        </h4>
                                        <ul className="space-y-2">
                                            {currentChallenge.tips.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-2 text-[13px] text-[#445865]">
                                                    <div className="w-1 h-1 rounded-full bg-[#D97848] mt-1.5 flex-shrink-0" />
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
                        <div data-qa={passed ? 'prompt-master-success-feedback' : 'prompt-master-improve-feedback'} className="animate-in fade-in slide-in-from-bottom-4">
                            <div className={`grid gap-4 lg:items-start ${passed ? 'lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)]' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(300px,0.75fr)]'}`}>
                                <ResultFeedbackRail
                                    passed={passed}
                                    feedback={aiResponse.feedback}
                                    tips={currentChallenge.tips}
                                    className={passed ? 'order-1 lg:order-2' : 'order-1 lg:order-3'}
                                />

                                <div className="order-2 lg:order-1">
                                    <ResultVisual
                                        type={currentChallenge.type}
                                        content={aiResponse.output}
                                        isSuccess={passed}
                                        generatedImage={aiResponse.generatedImageUrl}
                                        imageError={aiResponse.generatedImageError}
                                    />
                                </div>

                                {!passed && (
                                    <div className="order-3 lg:order-2 animate-in fade-in slide-in-from-right-4 delay-150">
                                        <ResultVisual
                                            type={currentChallenge.type}
                                            content={currentChallenge.goodOutputExample}
                                            isIdeal
                                            generatedImage={aiResponse.generatedIdealImageUrl}
                                            imageError={aiResponse.generatedIdealImageError}
                                            isGeneratingImage={
                                                currentChallenge.type === 'image' &&
                                                !aiResponse.generatedIdealImageUrl &&
                                                !aiResponse.generatedIdealImageError
                                            }
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                {!passed && (
                                    <button
                                        data-qa="prompt-master-try-again"
                                        onClick={handleTryAgain}
                                        className="flex-1 bg-[#FFFDF7] border border-[#E7D8BD] text-[#445865] py-4 rounded-full font-bold hover:bg-[#F3E4CB] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                                    >
                                        <RotateCcw size={18} /> Verbeteren
                                    </button>
                                )}
                                <button
                                    data-qa="prompt-master-next"
                                    onClick={handleNext}
                                    disabled={!passed}
                                    className="flex-1 py-4 rounded-full font-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-[#08283B] transition-all duration-300 shadow-lg"
                                    style={{ background: passed ? 'linear-gradient(to right, #D7C95F, #D7C95F)' : 'linear-gradient(to right, #F3E4CB, #F3E4CB)' }}
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
        const maxScore = calculatePromptMasterMaxScore(CHALLENGES);
        const percentage = Math.round((progress.totalScore / maxScore) * 100);
        const passed = percentage >= 60;

        return (
            <div data-qa="prompt-master-result" className="h-dvh overflow-y-auto bg-[#FCF6EA] text-[#08283B] p-4 md:p-6 flex items-center justify-center" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-lg w-full text-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-[#08283B]"
                        style={{ backgroundColor: passed ? '#D7C95F' : '#F3E4CB', boxShadow: passed ? '0 25px 50px -12px rgba(215,201,95,0.35)' : '0 25px 50px -12px rgba(231,216,189,0.45)' }}>
                        <Trophy size={40} />
                    </div>

                    <h1 className="text-3xl font-black mb-3">
                        {passed ? 'Prompt Master!' : 'Goed bezig!'}
                    </h1>

                    <p className="text-lg text-[#445865] mb-4 md:mb-6">
                        {passed
                            ? 'Je beheerst nu de kunst van prompt engineering!'
                            : 'Je hebt veel geleerd over hoe je effectieve prompts schrijft.'
                        }
                    </p>

                    <div className="bg-[#FFFDF7] rounded-2xl p-5 md:p-6 mb-4 md:mb-6 border border-[#E7D8BD]">
                        <div className="text-4xl md:text-5xl font-black mb-2 text-[#0B453F]">
                            {progress.totalScore} pts
                        </div>
                        <p className="text-[#445865] font-bold mb-4">{progress.completedChallenges.length}/{CHALLENGES.length} uitdagingen voltooid</p>

                        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                            <div className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(95, 148, 125,0.05)', borderColor: 'rgba(95, 148, 125,0.2)' }}>
                                <div className="font-bold text-[#5F947D]">Beginner</div>
                                <div className="text-[#08283B]">{progress.completedChallenges.filter(id => CHALLENGES.find(c => c.id === id)?.level === 'beginner').length}/2</div>
                            </div>
                            <div className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(217, 120, 72,0.05)', borderColor: 'rgba(217, 120, 72,0.2)' }}>
                                <div className="font-bold text-[#D97848]">Gevorderd</div>
                                <div className="text-[#08283B]">{progress.completedChallenges.filter(id => CHALLENGES.find(c => c.id === id)?.level === 'gevorderd').length}/2</div>
                            </div>
                            <div className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(11, 69, 63,0.05)', borderColor: 'rgba(11, 69, 63,0.2)' }}>
                                <div className="font-bold text-[#0B453F]">Expert</div>
                                <div className="text-[#08283B]">{progress.completedChallenges.filter(id => CHALLENGES.find(c => c.id === id)?.level === 'expert').length}/2</div>
                            </div>
                        </div>
                    </div>

                    {/* Key Learnings */}
                    <div className="bg-[#FFFDF7] rounded-2xl p-4 md:p-5 mb-4 md:mb-6 text-left border border-[#E7D8BD]">
                        <h4 className="font-bold mb-3 flex items-center gap-2 text-[#08283B]">
                            <Lightbulb size={18} className="text-[#D97848]" /> Wat je geleerd hebt:
                        </h4>
                        <ul className="space-y-2 text-sm text-[#445865]">
                            <li className="flex items-start gap-2">
                                <span className="text-[#5F947D]">✓</span> Specifieke details geven betere resultaten
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#5F947D]">✓</span> Context en doel helpen de AI begrijpen
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#5F947D]">✓</span> Format en structuur vragen geeft overzicht
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#5F947D]">✓</span> Persona's en beperkingen geven controle
                            </li>
                        </ul>
                    </div>

                    <button
                        data-qa="prompt-master-complete"
                        onClick={() => { clearSave(); onComplete(passed); }}
                        className="w-full py-3 md:py-4 rounded-full font-black transition-all duration-300 text-[#08283B] shadow-lg hover:shadow-xl"
                        style={{ backgroundColor: '#D7C95F' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#99984D')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D7C95F')}
                    >
                        Terug naar Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
