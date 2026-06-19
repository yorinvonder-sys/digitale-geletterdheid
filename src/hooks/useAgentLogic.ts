
import { useState, useRef, useEffect, useCallback } from 'react';
import { AgentRole, ChatMessage, BookData, DetectiveCase, TrainerData, CodeChange, BonusChallenge } from '@/types';
import { createChatSession, generateImage, Chat, type ImageAspectRatio, type ImageGenerationStyle } from '@/services/aiProviderService';
import { enhancePrompt, shouldShowEnhancementDiff } from '@/services/promptEnhancer';
import { computeCodeChanges } from '@/features/ai-lab/CodeChangeCard';
import { saveMissionProgress, loadMissionProgress, resetMissionProgress } from '@/services/missionService';
import { stripAiProvenance } from '@/utils/aiContentMarker';
import DOMPurify from 'dompurify';
import { useChatSession, MAX_UI_MESSAGES } from './useChatSession';
import { useGameCode, extractGameHtmlDocument, stripGameCodeFromResponse } from './useGameCode';
import { useStepCompletion } from './useStepCompletion';

// ============================================================================
// EERSTE BERICHT PARSER
// Extracts the "EERSTE BERICHT:" section from a systemInstruction so the
// student sees the intended first message instead of a generic welcome.
// ============================================================================
function extractEersteBericht(systemInstruction: string): string | null {
    const marker = 'EERSTE BERICHT:';
    const idx = systemInstruction.indexOf(marker);
    if (idx === -1) return null;

    let text = systemInstruction.slice(idx + marker.length).trim();

    // First, cut off the SYSTEM_INSTRUCTION_SUFFIX which always starts with
    // "ALGEMENE REGELS:" — this prevents suffix content from polluting the result.
    const suffixStart = text.indexOf('ALGEMENE REGELS:');
    if (suffixStart > 0) {
        text = text.slice(0, suffixStart).trim();
    }

    // Strip surrounding quotes if present
    if (text.startsWith('"')) {
        const closeIdx = text.lastIndexOf('"');
        if (closeIdx > 0) {
            text = text.slice(1, closeIdx).trim();
        } else {
            text = text.slice(1).trim();
        }
    }

    return text.length > 10 ? text : null;
}

const MODEL_IMAGE_TAG_REGEX = /\[IMG\s+target=["']?\s*([^"'>\]]+)\s*["']?\]([\s\S]*?)\[\/IMG\]/gi;
const MAX_AUTO_IMAGE_GENERATIONS_PER_RESPONSE = 2;
const DEFAULT_TRAINER_DATA: TrainerData = {
    classALabel: 'Plastic',
    classBLabel: 'Papier',
    classAItems: [],
    classBItems: [],
};

function buildDevPreviewReply(selectedRole: AgentRole | null, textInput: string): string {
    const title = selectedRole?.title || 'deze missie';
    const firstStep = selectedRole?.steps?.[0]?.title;
    const trimmedInput = textInput.trim();

    if (selectedRole?.id === 'game-programmeur') {
        return [
            `Ik zie je testprompt: "${trimmedInput}".`,
            '',
            'Voor deze preview zou ik de spelerkleur aanpassen en daarna vragen: zie je de verandering ook echt in de game-preview?',
            'Als je dit als leerling test: verander één ding tegelijk, speel kort, en vertel wat er beter werd.',
            '',
            '---STEP_COMPLETE:1---',
        ].join('\n');
    }

    if (selectedRole?.id === 'ai-trainer') {
        return [
            `Ik zie je testprompt: "${trimmedInput}".`,
            '',
            'Previewtip: voeg eerst voorbeelden toe aan beide groepen, test daarna met een nieuw voorbeeld, en kijk of de voorspelling logisch voelt.',
        ].join('\n');
    }

    return [
        `Previewantwoord voor **${title}**.`,
        firstStep
            ? `Start klein bij stap **${firstStep}** en controleer daarna of je weet wat goed of fout ging.`
            : 'Start klein en controleer daarna of je weet wat goed of fout ging.',
        '',
        'Deze lokale preview gebruikt geen echte AI-sessie, zodat de missie zonder leerlingaccount te testen is.',
    ].join('\n');
}

function normalizeTrainerData(data?: Partial<TrainerData> | null): TrainerData {
    return {
        classALabel: data?.classALabel && data.classALabel !== 'A' ? data.classALabel : 'Plastic',
        classBLabel: data?.classBLabel && data.classBLabel !== 'B' ? data.classBLabel : 'Papier',
        classAItems: data?.classAItems || [],
        classBItems: data?.classBItems || [],
        ...(data?.testItem ? { testItem: data.testItem } : {}),
    };
}

function getTrainerPrediction(item: string, data: TrainerData): { predictedClass: 'A' | 'B' | 'unknown'; confidence: number } {
    const tokens = item
        .toLowerCase()
        .split(/[^a-z0-9à-ÿ]+/i)
        .filter(token => token.length > 2 && !['een', 'het', 'bij', 'waar', 'hoort'].includes(token));

    const score = (examples: string[]) => examples.reduce((total, example) => {
        const lower = example.toLowerCase();
        return total + tokens.filter(token => lower.includes(token)).length;
    }, 0);

    const classAScore = score(data.classAItems);
    const classBScore = score(data.classBItems);

    if (classAScore === 0 && classBScore === 0) {
        return { predictedClass: 'unknown', confidence: 0.5 };
    }

    const totalScore = classAScore + classBScore;
    if (classAScore >= classBScore) {
        return { predictedClass: 'A', confidence: Math.max(0.6, classAScore / totalScore) };
    }

    return { predictedClass: 'B', confidence: Math.max(0.6, classBScore / totalScore) };
}

function isTrainerTestQuestion(input: string): boolean {
    return /waar\s+hoort|test|voorspel|classificeer|categorie/i.test(input);
}

function extractTrainerTestItem(input: string): string {
    const match = input.match(/waar\s+hoort\s+(?:een|de|het)?\s*(.*?)\s+bij/i);
    if (match?.[1]) return match[1].trim();

    return input
        .replace(/\?/g, '')
        .replace(/waar\s+hoort/gi, '')
        .replace(/\bbij\b/gi, '')
        .replace(/\b(test|voorspel|classificeer|categorie)\b/gi, '')
        .trim();
}

function inferTrainerPredictionFromText(
    responseText: string,
    testInput: string,
    data: TrainerData
): TrainerData['testItem'] | null {
    const normalized = responseText.toLowerCase();
    const predictsPlastic = /\b(plastic|groep\s*1|categorie\s*a)\b/.test(normalized);
    const predictsPaper = /\b(papier|groep\s*2|categorie\s*b)\b/.test(normalized);

    if (!predictsPlastic && !predictsPaper) return null;

    const predictedClass = predictsPlastic && !predictsPaper
        ? 'A'
        : predictsPaper && !predictsPlastic
            ? 'B'
            : getTrainerPrediction(extractTrainerTestItem(testInput), data).predictedClass;

    return {
        name: extractTrainerTestItem(testInput),
        predictedClass,
        confidence: predictedClass === 'unknown' ? 0.5 : 0.85,
    };
}

function getImageGenerationOptions(
    roleId: string | undefined,
    target: string
): { style: ImageGenerationStyle; aspectRatio: ImageAspectRatio; title: string } {
    if (roleId === 'verhalen-ontwerper') {
        if (target === 'cover') {
            return {
                style: 'book',
                aspectRatio: '2:3',
                title: 'Prentenboek kaft',
            };
        }
        return {
            style: 'book',
            aspectRatio: '4:3',
            title: `Prentenboek illustratie ${target}`,
        };
    }

    if (roleId === 'startup-pitch') {
        return {
            style: 'branding',
            aspectRatio: target === 'screenshot' ? '16:9' : '1:1',
            title: `Startup pitch ${target}`,
        };
    }

    return {
        style: 'general',
        aspectRatio: '1:1',
        title: `AI afbeelding ${target}`,
    };
}

// ============================================================================
// STARTER TIPS - Short, actionable prompts shown when a mission starts
// These cost XP when clicked (penalty for using hints)
// ============================================================================
const getStarterTips = (roleId: string, examplePrompt?: string): string[] => {
    const tips: Record<string, string[]> = {
        // === J1P1: Digitale Basisvaardigheden ===
        'magister-master': ['Hoe check ik mijn rooster?', 'Waar vind ik mijn cijfers?', 'Hoe zie ik het huiswerk?'],
        'cloud-commander': ['Maak een nieuwe map', 'Deel een bestand', 'Zoek mijn document'],
        'word-wizard': ['Maak een inhoudsopgave', 'Voeg paginanummers toe', 'Hoe maak ik bullets?'],
        'slide-specialist': ['Voeg een animatie toe', 'Kies een mooi thema', 'Maak een overgang'],
        'print-pro': ['Hoe log ik in?', 'Waar vind ik de app?', 'Stuur een printopdracht'],
        // === J1P2: AI & Creatie ===
        'game-programmeur': ['Maak de speler blauw', 'Maak het springen hoger', 'Voeg een springgeluid toe'],
        'verhalen-ontwerper': ['Schrijf over een draak', 'Mijn held is een konijn', 'Maak een spannend avontuur'],
        'ai-trainer': ['Dit is plastic', 'Voeg een kartonnen doos toe', 'Train de AI met papier'],
        'chatbot-trainer': ['Maak een chatbot voor een pizzeria', 'Welke sleutelwoorden horen bij bestellingen?', 'Test mijn chatbot'],
        'ai-tekengame': ['Teken een kat', 'Hoe herkent AI mijn tekening?', 'Waarom raadt de AI het fout?'],
        'ai-beleid-brainstorm': ['Mag je ChatGPT gebruiken voor huiswerk?', 'Welke AI-regels moet school hebben?', 'Wat als AI fout antwoordt?'],
        'code-denker': ['Wat is een variabele?', 'Hoe werkt een loop?', 'Los het puzzelprobleem op'],
        'website-bouwer': ['Maak een homepagina', 'Voeg een menu toe', 'Verander de kleuren'],
        'schermtijd-coach': ['Hoeveel uur zit ik op mijn telefoon?', 'Welke apps kosten de meeste tijd?', 'Maak een schermtijd-plan'],
        'game-director': ['Verander de zwaartekracht', 'Maak de wereld groter', 'Voeg een nieuw obstakel toe'],
        // === J1P3: Digitaal Burgerschap ===
        'data-detective': ['Wat weten bedrijven over mij?', 'Is dit een dark pattern?', 'Hoe bescherm ik mijn data?'],
        'data-verzamelaar': ['Welke data verzamel ik zelf?', 'Wat mag een bedrijf opslaan?', 'Hoe werkt een cookie?'],
        'deepfake-detector': ['Is dit echt of nep?', 'Hoe herken ik een deepfake?', 'Waarom zijn deepfakes gevaarlijk?'],
        'ai-spiegel': ['Wat zegt mijn profiel over mij?', 'Hoe werkt een aanbevelingsalgoritme?', 'Hoe doorbreek ik mijn bubbel?'],
        'social-safeguard': ['Wat doe ik bij online pesten?', 'Hoe bewaar ik bewijs?', 'Hoe meld ik iets onveiligs?'],
        'scroll-stopper': ['Waarom kan ik niet stoppen met scrollen?', 'Welke trucs gebruiken apps?', 'Hoe maak ik bewuste keuzes?'],
        'cookie-crusher': ['Wat is een tracking cookie?', 'Herken het dark pattern!', 'Welke cookies zijn oké?'],
        'data-handelaar': ['Bekijk bewijsstuk 1', 'Is dit legaal volgens de AVG?', 'Schrijf een rapport'],
        'filter-bubble-breaker': ['Vergelijk de twee feeds', 'Waarom ziet iedereen iets anders?', 'Hoe beïnvloedt het algoritme mij?'],
        'datalekken-rampenplan': ['Wat is er gelekt?', 'Wie moet ik waarschuwen?', 'Maak een noodplan'],
        'data-voor-data': ['Deal of no deal?', 'Hoeveel is mijn data waard?', 'Waar trek ik de grens?'],
        'data-speurder': ['Welke data staat online over mij?', 'Hoe wis ik mijn digitale spoor?', 'Wat deelt deze app stiekem?'],
        'social-media-psychologist': ['Wat is een filterbubbel?', 'Hoe werkt een algoritme?', 'Waarom blijf ik scrollen?'],
        // === J1P4: Eindproject ===
        'mission-blueprint': ['Ik wil een app ontwerpen', 'Help me een plan maken', 'Welke tools heb ik nodig?'],
        'mission-vision': ['Maak een mockup van mijn idee', 'Hoe maak ik een goede pitch?', 'Ontwerp het logo'],
        'mission-launch': ['Ik wil mijn project presenteren', 'Hoe maak ik een demo?', 'Geef feedback op mijn pitch'],
        'review-week-2': ['Test mijn kennis over AI', 'Wat was supervised learning?', 'Leg het verschil uit'],
        'review-week-3': ['Test mijn kennis over privacy', 'Wat is de AVG?', 'Hoe bescherm ik mijn data?'],
        // === J2P1: Data & Informatie ===
        'data-journalist': ['Hoe vind ik trends in data?', 'Welke grafiek past het best?', 'Maak een infographic'],
        'spreadsheet-specialist': ['Hoe maak ik een SOM-formule?', 'Maak een grafiek van de data', 'Sorteer de gegevens'],
        'factchecker': ['Is dit bericht betrouwbaar?', 'Hoe check ik de bron?', 'Wat maakt een bron onbetrouwbaar?'],
        'api-verkenner': ['Wat is een API eigenlijk?', 'Hoe haal je weerdata op?', 'Leg JSON uit in simpele taal'],
        'dashboard-designer': ['Welke data is het belangrijkst?', 'Welk type grafiek kies ik?', 'Hoe maak ik het overzichtelijk?'],
        'ai-bias-detective': ['Waarom geeft de AI dit advies?', 'Is dit eerlijk voor iedereen?', 'Hoe herken ik bias?'],
        'data-review': ['Test mijn datakennis', 'Wat is het verschil tussen data en informatie?', 'Hoe werkt een database?'],
        // === J2P2: Programmeren ===
        'algorithm-architect': ['Hoe sorteer ik deze lijst?', 'Splits het probleem in stappen', 'Maak een stroomdiagram'],
        'web-developer': ['Maak een basispagina in HTML', 'Voeg een afbeelding toe', 'Style de pagina met CSS'],
        'network-navigator': ['Hoe komt mijn bericht aan?', 'Wat is een IP-adres?', 'Hoe werkt DNS?'],
        'app-prototyper': ['Wie is mijn doelgroep?', 'Schets het hoofdscherm', 'Hoe navigeert de gebruiker?'],
        'bug-hunter': ['Reproduceer de bug', 'Waar zit het probleem?', 'Hoe test ik mijn fix?'],
        'automation-engineer': ['Welke taken herhalen zich?', 'Maak een automatiseringsplan', 'Hoe test ik mijn workflow?'],
        'code-reviewer': ['Lees de code hardop voor', 'Wat kan beter aan deze code?', 'Is deze code veilig?'],
        'privacy-by-design': ['Welke data verzamelt deze app?', 'Is dit privacy-vriendelijk?', 'Hoe kan het met minder data?'],
        'wachtwoord-warrior': ['Hoe sterk is dit wachtwoord?', 'Maak een onkraakbaar wachtwoord', 'Wat is tweestapsverificatie?'],
        'access-control-engineer': ['Wie mag wat zien?', 'Stel de rechten in per rol', 'Test of de beveiliging klopt'],
        'code-review-2': ['Test mijn programmeerkennis', 'Wat doet deze code?', 'Vind de bug in dit voorbeeld'],
        // === J2P3: Media & Creatie ===
        'ux-detective': ['Waarom krijgt deze app slechte reviews?', 'Hoe test ik gebruiksvriendelijkheid?', 'Ontwerp een betere versie'],
        'podcast-producer': ['Kies een onderwerp voor mijn podcast', 'Schrijf een intro-script', 'Hoe maak ik het boeiend?'],
        'meme-machine': ['Waarom werkt deze meme?', 'Maak een meme voor een campagne', 'Analyseer het doelpubliek'],
        'digital-storyteller': ['Ontwerp de verhaalstructuur', 'Maak een keuzemoment', 'Hoe maak ik het spannend?'],
        'brand-builder': ['Wie is mijn doelgroep?', 'Ontwerp een logo-concept', 'Kies de juiste kleuren'],
        'video-editor': ['Schrijf een verhaallijn van 60 seconden', 'Welke shots heb ik nodig?', 'Hoe maak ik een goede opening?'],
        'media-review': ['Test mijn mediakennis', 'Wat is UX design?', 'Hoe werkt een brand identity?'],
        // === J2P4: Ethiek & Maatschappij ===
        'ai-ethicus': ['Is dit AI-systeem eerlijk?', 'Wie is verantwoordelijk als AI fouten maakt?', 'Welke regels zijn nodig?'],
        'digital-rights-defender': ['Welke rechten heb ik online?', 'Mag de school dit verzamelen?', 'Schrijf een privacycheck'],
        'tech-court': ['Bereid mijn zaak voor', 'Wat zijn de argumenten voor?', 'Wat zijn de argumenten tegen?'],
        'future-forecaster': ['Hoe ziet 2040 eruit?', 'Welke technologie verandert alles?', 'Wat zijn de risicos?'],
        'sustainability-scanner': ['Hoeveel energie kost streamen?', 'Hoe verduurzaam ik mijn digitale gedrag?', 'Wat is de CO2-voetafdruk?'],
        'eindproject-j2': ['Help me een onderwerp kiezen', 'Maak een projectplan', 'Welke vaardigheden gebruik ik?'],
        // === J3P1: Geavanceerd Programmeren & AI ===
        'ml-trainer': ['Hoe herken ik spam automatisch?', 'Wat is een trainingsset?', 'Hoe test ik mijn model?'],
        'api-architect': ['Ontwerp de API-structuur', 'Welke endpoints heb ik nodig?', 'Hoe beveilig ik de API?'],
        'neural-navigator': ['Hoe werkt een neuron?', 'Wat is een hidden layer?', 'Hoe leert het netwerk?'],
        'data-pipeline': ['Hoe verzamel ik de data?', 'Hoe schoon ik de data op?', 'Maak een visualisatie'],
        'open-source-contributor': ['Hoe fork ik een repository?', 'Maak een pull request', 'Schrijf goede documentatie'],
        'advanced-code-review': ['Test mijn geavanceerde kennis', 'Analyseer dit code-voorbeeld', 'Wat is de Big O hiervan?'],
        // === J3P2: Cybersecurity ===
        'cyber-detective': ['Analyseer het incident', 'Welke sporen zijn achtergelaten?', 'Schrijf een forensisch rapport'],
        'encryption-expert': ['Kraak dit Caesarcijfer', 'Hoe werkt publieke sleutelencryptie?', 'Is deze versleuteling veilig?'],
        'phishing-fighter': ['Is deze e-mail nep?', 'Welke signalen verraden phishing?', 'Ontwerp een awareness-training'],
        'security-auditor': ['Scan deze website op kwetsbaarheden', 'Welke OWASP-risicos zie ik?', 'Schrijf een beveiligingsadvies'],
        'digital-forensics': ['Lees de logbestanden', 'Reconstrueer de tijdlijn', 'Wie is de verdachte?'],
        'security-review': ['Test mijn security-kennis', 'Wat is SQL injection?', 'Hoe voorkom ik XSS?'],
        // === J3P3: Maatschappelijke Impact ===
        'startup-simulator': ['Pitch mijn idee in 3 minuten', 'Wie is mijn klant?', 'Hoe verdien ik geld?'],
        'policy-maker': ['Analyseer het voorstel', 'Wie zijn de stakeholders?', 'Schrijf een beleidsadvies'],
        'innovation-lab': ['Welk wereldprobleem pak ik aan?', 'Ontwerp een prototype', 'Hoe meet ik de impact?'],
        'digital-divide-researcher': ['Verzamel data over digitale ongelijkheid', 'Welke groepen worden geraakt?', 'Stel oplossingen voor'],
        'tech-impact-analyst': ['Kies een technologie om te analyseren', 'Voordelen en nadelen?', 'Schrijf een impactrapport'],
        'impact-review': ['Test mijn kennis over impact', 'Wat is de digitale kloof?', 'Hoe beïnvloedt AI de samenleving?'],
        // === J3P4: Meesterproef ===
        'portfolio-builder': ['Selecteer mijn beste werk', 'Hoe presenteer ik mijn groei?', 'Ontwerp de portfolio-layout'],
        'research-project': ['Formuleer een onderzoeksvraag', 'Welke bronnen zijn betrouwbaar?', 'Hoe analyseer ik resultaten?'],
        'prototype-developer': ['Schets mijn app-idee', 'Bouw het eerste scherm', 'Test met een gebruiker'],
        'pitch-perfect': ['Bereid mijn pitch voor', 'Hoe begin ik sterk?', 'Oefen met vragen uit het publiek'],
        'reflection-report': ['Wat heb ik geleerd in 3 jaar?', 'Welke vaardigheden heb ik ontwikkeld?', 'Waar wil ik mee verder?'],
        'meesterproef': ['Schrijf mijn projectvoorstel', 'Plan de sprints', 'Bereid de verdediging voor'],
    };

    // Return mission-specific tips, or fallback to examplePrompt
    return tips[roleId] || (examplePrompt ? [examplePrompt] : []);
};

const buildMissionContext = (role: AgentRole): string => {
    const stepDetails = role.steps?.length
        ? role.steps
            .map((step, index) => `Stap ${index + 1}: ${step.title} - ${step.description}${step.example ? ` Voorbeeld: ${step.example}` : ''} Marker: ---STEP_COMPLETE:${index + 1}---`)
            .join('\n')
        : null;

    return [
        `Missie: ${role.title}`,
        role.description,
        role.problemScenario,
        `Doel: ${role.missionObjective}`,
        stepDetails ? `Stappen en voltooiingsmarkers:\n${stepDetails}` : null,
        role.id === 'game-programmeur' && role.initialCode
            ? `[HUIDIGE_GAME_CODE]\n${role.initialCode}\n[/HUIDIGE_GAME_CODE]`
            : null,
    ]
        .filter(Boolean)
        .join(' ');
};


import { MissionProgress } from '@/types';

interface UseAgentLogicProps {
    selectedRole: AgentRole | null;
    userIdentifier: string;
    schoolId?: string;
    initialProgress?: MissionProgress;
    skipLoading?: boolean;
    cloudSyncDisabled?: boolean;
}

export const useAgentLogic = ({ selectedRole, userIdentifier, schoolId, initialProgress, skipLoading = false, cloudSyncDisabled = false }: UseAgentLogicProps) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [thinkingStep, setThinkingStep] = useState<string>("Analyseren...");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    // --- Sub-hooks ---
    const {
        messages,
        setMessages,
        chatSessionRef,
        messageCountRef,
        refreshChatSession,
        refreshIfNeeded,
    } = useChatSession({ selectedRole });

    const {
        activeGameCode,
        setActiveGameCode,
        gameCodeHistory,
        pushToHistory,
        previousGameCodeRef,
        undoGameCode: undoGameCodeBase,
    } = useGameCode({ initialGameCode: initialProgress?.data?.activeGameCode || null });

    const {
        completedSteps,
        setCompletedSteps,
        parseAndUpdateSteps,
    } = useStepCompletion({ initialSteps: initialProgress?.completedSteps || [] });

    // Wrap undoGameCode to pass setMessages
    const undoGameCode = useCallback(() => {
        undoGameCodeBase(setMessages);
    }, [undoGameCodeBase, setMessages]);

    // Specific Role State - Restore from initialProgress if available
    const [activeBookData, setActiveBookData] = useState<BookData>(initialProgress?.data?.activeBookData || { title: "Nieuw Verhaal", pages: [] });
    const [activeLogicCode, setActiveLogicCode] = useState<string | null>(initialProgress?.data?.activeLogicCode || null);
    const [activeTrainerData, setActiveTrainerData] = useState<TrainerData>(normalizeTrainerData(initialProgress?.data?.activeTrainerData));
    const [activeBonusChallenges, setActiveBonusChallenges] = useState<BonusChallenge[]>(initialProgress?.data?.activeBonusChallenges || []);

    // Helper: Refresh chat session with recent context (prevents memory buildup in AI provider)
    // (provided by useChatSession, wired here for use in useEffect)

    // Initialize Chat
    useEffect(() => {
        if (selectedRole) {
            // RESTORE MESSAGES IF AVAILABLE
            if (initialProgress && initialProgress.chatHistory && initialProgress.chatHistory.length > 0) {
                const restoredMessages: ChatMessage[] = initialProgress.chatHistory.map(m => ({
                    role: m.role,
                    text: m.text,
                    timestamp: new Date()
                }));
                setMessages(restoredMessages);
            } else {
                const eersteBericht = extractEersteBericht(selectedRole.systemInstruction);
                let welcomeText: string;
                if (eersteBericht) {
                    welcomeText = eersteBericht;
                } else if (selectedRole.problemScenario && selectedRole.steps && selectedRole.steps.length > 0) {
                    const firstStep = selectedRole.steps[0];
                    welcomeText = `Hey! 👋 Welkom bij **${selectedRole.title}**!\n\n${selectedRole.problemScenario}\n\n🎯 **Jouw missie:** ${selectedRole.missionObjective}\n\n📋 **Stap 1: ${firstStep.title}**\n${firstStep.description}\n\n💡 **Voorbeeld:** ${firstStep.example}\n\n*Klik op een van de knoppen hieronder om te beginnen, of typ zelf een vraag!*`;
                } else {
                    welcomeText = `Hey! 👋 Welkom bij **${selectedRole.title}**!\n\n${selectedRole.description}\n\n*Klik op een van de knoppen hieronder om te beginnen, of typ zelf een vraag!*`;
                }
                setMessages([{
                    role: 'model',
                    text: welcomeText,
                    timestamp: new Date(),
                    isWelcome: true,
                }]);
            }
            // --- INITIALIZE STARTER TIPS ---
            const starterTips = getStarterTips(selectedRole.id, selectedRole.examplePrompt);
            setSuggestions(starterTips);

            try {
                const session = createChatSession(selectedRole.id, selectedRole.systemInstruction, {
                    localMissionContext: buildMissionContext(selectedRole),
                });
                chatSessionRef.current = session;

            } catch (e) {
                console.error("Failed to init chat", e);
                setError("Kon AI niet starten. Controleer je sessie of AI-configuratie.");
            }

            // Reset role specific data
            setActiveBookData({ title: "Nieuw Verhaal", pages: [] });
            setActiveLogicCode(null);
            setActiveTrainerData(DEFAULT_TRAINER_DATA);

            // --- LOAD SAVED PROGRESS ---
            if (!skipLoading && !cloudSyncDisabled) {
                if (selectedRole.id === 'game-programmeur' && selectedRole.initialCode) {
                    setActiveGameCode(selectedRole.initialCode);
                }
                console.log(`[CloudLoad] Loading progress for ${selectedRole.id}...`);

                const timeoutPromise = new Promise<null>((resolve) => {
                    setTimeout(() => {
                        console.info(`[CloudLoad] Timeout for ${selectedRole.id}, using fallback`);
                        resolve(null);
                    }, 5000);
                });

                Promise.race([
                    loadMissionProgress(userIdentifier, selectedRole.id),
                    timeoutPromise
                ]).then(data => {
                    if (data) {
                        console.log(`[CloudLoad] Success for ${selectedRole.id}`);
                        if (data.gameCode && selectedRole.id === 'game-programmeur') setActiveGameCode(data.gameCode);
                        if (data.bookData && selectedRole.id === 'verhalen-ontwerper') setActiveBookData(data.bookData);
                        if (data.logicCode && (selectedRole.id as string) === 'logica-legende') setActiveLogicCode(data.logicCode);
                        if (data.trainerData && ((selectedRole.id as string) === 'prompt-trainer' || selectedRole.id === 'ai-trainer')) {
                            setActiveTrainerData(normalizeTrainerData(data.trainerData));
                        }
                    } else {
                        console.log(`[CloudLoad] No data or timeout for ${selectedRole.id}, using fallback`);
                        if (selectedRole.id === 'game-programmeur' && selectedRole.initialCode) {
                            setActiveGameCode(selectedRole.initialCode);
                        }
                    }
                }).catch(err => {
                    console.error("[CloudLoad] Error:", err);
                    if (selectedRole.id === 'game-programmeur' && selectedRole.initialCode) {
                        setActiveGameCode(selectedRole.initialCode);
                    }
                });
            } else {
                if (initialProgress?.data) {
                    console.log(`[CloudLoad] Using initialProgress data for ${selectedRole.id}`);
                    if (initialProgress.data.activeGameCode && selectedRole.id === 'game-programmeur') {
                        setActiveGameCode(initialProgress.data.activeGameCode);
                    }
                    if (initialProgress.data.activeBookData && selectedRole.id === 'verhalen-ontwerper') {
                        setActiveBookData(initialProgress.data.activeBookData);
                    }
                } else if (selectedRole.id === 'game-programmeur' && selectedRole.initialCode) {
                    setActiveGameCode(selectedRole.initialCode);
                }
            }
        }
    }, [selectedRole, userIdentifier, initialProgress, skipLoading, cloudSyncDisabled, refreshChatSession, chatSessionRef, setMessages, setActiveGameCode]);
    // --- AUTO-SAVE LOGIC ---
    useEffect(() => {
        if (!cloudSyncDisabled && selectedRole?.id === 'game-programmeur' && activeGameCode) {
            const timer = setTimeout(() => {
                saveMissionProgress(userIdentifier, 'game-programmeur', { gameCode: activeGameCode, schoolId });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [activeGameCode, cloudSyncDisabled, selectedRole, userIdentifier, schoolId]);

    useEffect(() => {
        if (!cloudSyncDisabled && selectedRole?.id === 'verhalen-ontwerper' && activeBookData) {
            const timer = setTimeout(() => {
                saveMissionProgress(userIdentifier, 'verhalen-ontwerper', { bookData: activeBookData, schoolId });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [activeBookData, cloudSyncDisabled, selectedRole, userIdentifier, schoolId]);

    useEffect(() => {
        if (!cloudSyncDisabled && ((selectedRole?.id as string) === 'prompt-trainer' || selectedRole?.id === 'ai-trainer') && activeTrainerData) {
            const timer = setTimeout(() => {
                // selectedRole!: the if-condition uses selectedRole?.id, which is only truthy if selectedRole is non-null
                saveMissionProgress(userIdentifier, selectedRole!.id, { trainerData: activeTrainerData, schoolId });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [activeTrainerData, cloudSyncDisabled, selectedRole, userIdentifier, schoolId]);

    useEffect(() => {
        if (!cloudSyncDisabled && (selectedRole?.id as string) === 'logica-legende' && activeLogicCode) {
            const timer = setTimeout(() => {
                saveMissionProgress(userIdentifier, 'logica-legende', { logicCode: activeLogicCode, schoolId });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [activeLogicCode, cloudSyncDisabled, selectedRole, userIdentifier, schoolId]);



    // --- RESET LOGIC ---
    const resetCurrentMission = useCallback(async () => {
        if (!selectedRole) return;

        try {
            if (!cloudSyncDisabled) {
                await resetMissionProgress(userIdentifier, selectedRole.id);
            }

            if (selectedRole.id === 'game-programmeur') {
                setActiveGameCode(selectedRole.initialCode || '');
                setMessages(prev => [...prev, { role: 'model', text: '♻️ **Game gereset!**\nAlle code is hersteld naar het beginpunt.', timestamp: new Date() }]);
            } else if (selectedRole.id === 'verhalen-ontwerper') {
                setActiveBookData({ title: "Nieuw Verhaal", pages: [] });
                setMessages(prev => [...prev, { role: 'model', text: '♻️ **Verhaal gereset!**\nJe kunt helemaal opnieuw beginnen.', timestamp: new Date() }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: '♻️ **Missie gereset!**', timestamp: new Date() }]);
            }
        } catch (err) {
            console.error("Reset failed:", err);
            setError("Er ging iets mis bij het resetten.");
        }
    }, [selectedRole, userIdentifier, cloudSyncDisabled, setActiveGameCode, setMessages]);

    const unlockBonusChallenge = (challengeId: string) => {
        if (!selectedRole?.bonusChallenges) return;

        const challenge = selectedRole.bonusChallenges.find(c => c.id === challengeId);
        if (challenge && !activeBonusChallenges.some(c => c.id === challenge.id)) {
            setActiveBonusChallenges(prev => [...prev, challenge]);

            setMessages(prev => [...prev, {
                role: 'model',
                text: `🏆 **BONUS UITDAGING ONTGRENDELD:** ${challenge.title}\n\n${challenge.description}\n\nBeloning: **${challenge.xpReward} XP**`,
                timestamp: new Date()
            }]);
        }
    };

    const handleSend = async (textInput: string = input) => {
        if (!chatSessionRef.current) {
            setError("Kan geen verbinding maken met AI. Ververs de pagina of probeer het later opnieuw.");
            return;
        }

        const userMsg: ChatMessage = {
            role: 'user',
            text: textInput,
            timestamp: new Date()
        };

        // MEMORY MANAGEMENT: Track message count and check if session refresh needed
        refreshIfNeeded();

        // 1. Add User Message immediately (with message limit to prevent memory issues)
        setMessages(prev => {
            const newMessages = [...prev, userMsg];
            return newMessages.slice(-MAX_UI_MESSAGES);
        });
        setInput('');
        setIsLoading(true);
        setError(null);
        setSuggestions([]);

        if (cloudSyncDisabled) {
            setThinkingStep('Preview antwoord maken...');
            window.setTimeout(() => {
                const responseText = parseAndUpdateSteps(buildDevPreviewReply(selectedRole, textInput));
                setMessages(prev => [
                    ...prev,
                    { role: 'model', text: responseText, timestamp: new Date() }
                ]);
                setSuggestions(getStarterTips(selectedRole?.id || 'general', selectedRole?.examplePrompt));
                setIsLoading(false);
            }, 400);
            return;
        }

        // Thinking UI setup - different steps for story mission
        const isStoryMission = selectedRole?.id === 'verhalen-ontwerper';
        const thinkingSteps = isStoryMission
            ? ["Verhaal bedenken...", "Creativiteit verzamelen...", "🎨 Illustratie maken...", "✨ Magie toevoegen..."]
            : ["Analyseren...", "Redeneren...", "Genereren..."];
        let stepIndex = 0;
        setThinkingStep(thinkingSteps[0]);

        const interval = setInterval(() => {
            stepIndex++;
            if (stepIndex >= thinkingSteps.length) {
                clearInterval(interval);
            } else {
                setThinkingStep(thinkingSteps[stepIndex]);
            }
        }, isStoryMission ? 2000 : 1200);

        try {
            // =====================================================================
            // PROMPT ENHANCEMENT: Refine the user's prompt before sending to AI
            // =====================================================================
            const enhancementResult = enhancePrompt(textInput, {
                agentType: selectedRole?.id || 'general',
                userLevel: 'beginner'
            });

            let promptForAI = enhancementResult.enhancedPrompt;

            // GAME PROGRAMMEUR: Set current game code as context on the chat session
            if (selectedRole?.id === 'game-programmeur' && activeGameCode) {
                chatSessionRef.current.setGameContext(activeGameCode);
            }

            if (enhancementResult.wasEnhanced && import.meta.env.DEV) {
                console.log('[PromptEnhancer] Original:', textInput);
                console.log('[PromptEnhancer] Enhanced:', promptForAI);
                console.log('[PromptEnhancer] Changes:', enhancementResult.enhancements);
            }

            // 2. Prepare response handling
            let isFirstChunk = true;
            let fullTextAccumulated = "";
            const useNonStreamingResponse = selectedRole?.id === 'game-programmeur';

            const { sendMessageToAi, sendMessageToAiStream } = await import('@/services/aiProviderService');

            // Track already-processed trainer items to avoid duplicates during streaming
            const processedTrainA = new Set<string>();
            const processedTrainB = new Set<string>();
            const processedPredictions = new Set<string>();

            if (useNonStreamingResponse) {
                clearInterval(interval);
                fullTextAccumulated = await sendMessageToAi(
                    chatSessionRef.current,
                    promptForAI
                );
                setMessages(prev => [
                    ...prev,
                    { role: 'model', text: fullTextAccumulated, timestamp: new Date() }
                ]);
            } else {
                await sendMessageToAiStream(
                    chatSessionRef.current,
                    promptForAI,
                    (chunkText) => {
                        fullTextAccumulated = chunkText;

                        // REAL-TIME TRAINER DATA PARSING (ai-trainer mission)
                        if (selectedRole?.id === 'ai-trainer') {
                            const trainAMatches = [...chunkText.matchAll(/\[TRAIN_A\](.*?)\[\/TRAIN_A\]/g)];
                            for (const match of trainAMatches) {
                                const item = match[1].trim();
                                if (!processedTrainA.has(item)) {
                                    processedTrainA.add(item);
                                    setActiveTrainerData(prev => ({ ...prev, classAItems: [...prev.classAItems, item] }));
                                }
                            }

                            const trainBMatches = [...chunkText.matchAll(/\[TRAIN_B\](.*?)\[\/TRAIN_B\]/g)];
                            for (const match of trainBMatches) {
                                const item = match[1].trim();
                                if (!processedTrainB.has(item)) {
                                    processedTrainB.add(item);
                                    setActiveTrainerData(prev => ({ ...prev, classBItems: [...prev.classBItems, item] }));
                                }
                            }

                            const predictMatches = [...chunkText.matchAll(/\[PREDICT\]([\s\S]*?)\[\/PREDICT\]/g)];
                            for (const match of predictMatches) {
                                const item = match[1].trim();
                                if (!processedPredictions.has(item)) {
                                    processedPredictions.add(item);
                                    setActiveTrainerData(prev => ({
                                        ...prev,
                                        testItem: {
                                            name: item,
                                            ...getTrainerPrediction(item, prev),
                                        },
                                    }));
                                }
                            }
                        }

                        // On first chunk: clear thinking, add model message placeholder
                        if (isFirstChunk) {
                            clearInterval(interval);
                            setMessages(prev => [
                                ...prev,
                                { role: 'model', text: chunkText, timestamp: new Date() }
                            ]);
                            isFirstChunk = false;
                        } else {
                            setMessages(prev => {
                                const newArr = [...prev];
                                const lastIdx = newArr.length - 1;
                                if (newArr[lastIdx] && newArr[lastIdx].role === 'model') {
                                    newArr[lastIdx] = { ...newArr[lastIdx], text: chunkText };
                                }
                                return newArr;
                            });
                        }
                    }
                );
            }

            // 3. Post-Processing (Logic Parsing) on the FULL text
            let responseText = fullTextAccumulated;
            const hasTrainerPredictionTag = /\[PREDICT\][\s\S]*?\[\/PREDICT\]/i.test(responseText);

            // --- PARSE TIPS ---
            const tipsMatch = responseText.match(/---TIPS---([\s\S]*?)$/);
            if (tipsMatch) {
                const tipsString = tipsMatch[1].trim();
                const extractedTips = tipsString
                    .split(/\n|;|\d+\.\s/)
                    .map(t => t.trim())
                    .filter(t => t.length > 0 && t.length < 100);
                setSuggestions(extractedTips.slice(0, 3));
                responseText = responseText.replace(tipsMatch[0], '');
            }

            // --- PARSE STEP COMPLETION ---
            responseText = parseAndUpdateSteps(responseText);

            // --- PARSE ROLE SPECIFIC DATA ---
            const imageGenerationPromises: Promise<void>[] = [];
            let generatedChatImage: string | undefined;
            let imageGenerationError: string | null = null;
            let automaticImageGenerationCount = 0;

            // CREATOR (Book) -> verhalen-ontwerper
            if (selectedRole?.id === 'verhalen-ontwerper') {
                console.log('[DEBUG] Parsing Book Response:', responseText);

                const titleMatch = responseText.match(/\[TITLE\](.*?)\[\/TITLE\]/i);
                if (titleMatch) {
                    setActiveBookData(prev => ({ ...prev, title: titleMatch[1] }));
                    responseText = responseText.replace(titleMatch[0], '');
                }

                const pageRegex = /\[PAGE(?:\s+target=["']?(\d+)["']?)?\]([\s\S]*?)\[\/PAGE\]/gi;

                let pageMatch;
                while ((pageMatch = pageRegex.exec(responseText)) !== null) {
                    const targetPage = pageMatch[1] ? parseInt(pageMatch[1]) : null;
                    const pageText = pageMatch[2].trim();

                    setActiveBookData(prev => {
                        const newPages = [...prev.pages];

                        if (targetPage !== null) {
                            while (newPages.length < targetPage) {
                                newPages.push({ text: '' });
                            }
                            const actualIndex = targetPage - 1;
                            newPages[actualIndex] = { ...newPages[actualIndex], text: pageText };
                        } else {
                            newPages.push({ text: pageText });
                        }
                        return { ...prev, pages: newPages };
                    });
                }
                responseText = responseText.replace(pageRegex, '');

                let imgMatch;
                while ((imgMatch = MODEL_IMAGE_TAG_REGEX.exec(responseText)) !== null) {
                    const rawTarget = imgMatch[1];
                    const rawPrompt = imgMatch[2];

                    if (rawTarget && rawPrompt) {
                        if (automaticImageGenerationCount >= MAX_AUTO_IMAGE_GENERATIONS_PER_RESPONSE) {
                            console.warn('Automatic image generation cap reached for this response.');
                            continue;
                        }
                        automaticImageGenerationCount += 1;

                        const target = rawTarget.trim().toLowerCase();
                        const prompt = rawPrompt.trim();
                        const imageOptions = getImageGenerationOptions(selectedRole.id, target);

                        setActiveBookData(prev => {
                            const newData = { ...prev };
                            if (target === 'cover') {
                                newData.coverImage = 'loading';
                            } else {
                                const pageIdx = parseInt(target) - 1;
                                const newPages = [...newData.pages];
                                while (newPages.length <= pageIdx) newPages.push({ text: '' });
                                newPages[pageIdx] = { ...newPages[pageIdx], image: 'loading' };
                                newData.pages = newPages;
                            }
                            return newData;
                        });

                        imageGenerationPromises.push(
                            generateImage(prompt, imageOptions).then(imgUrl => {
                                setActiveBookData(prev => {
                                    const newData = { ...prev };
                                    const startValue = imgUrl || "error:Generatie Mislukt";
                                    if (target === 'cover') {
                                        newData.coverImage = startValue;
                                    } else {
                                        const pageIdx = parseInt(target) - 1;
                                        if (newData.pages[pageIdx]) {
                                            const newPages = [...newData.pages];
                                            newPages[pageIdx] = { ...newPages[pageIdx], image: startValue };
                                            newData.pages = newPages;
                                        }
                                    }
                                    return newData;
                                });

                                if (!imgUrl) {
                                    console.warn("Image generation failed silently for", target);
                                } else if (imgUrl.startsWith('error:') && !imageGenerationError) {
                                    imageGenerationError = imgUrl.slice('error:'.length);
                                }
                            })
                        );
                    }
                }
                responseText = responseText.replace(MODEL_IMAGE_TAG_REGEX, '');
            }

            if (selectedRole?.id !== 'verhalen-ontwerper') {
                let imageMatch;
                while ((imageMatch = MODEL_IMAGE_TAG_REGEX.exec(responseText)) !== null) {
                    const target = imageMatch[1]?.trim().toLowerCase();
                    const prompt = imageMatch[2]?.trim();

                    if (!target || !prompt) continue;
                    if (automaticImageGenerationCount >= MAX_AUTO_IMAGE_GENERATIONS_PER_RESPONSE) {
                        console.warn('Automatic image generation cap reached for this response.');
                        continue;
                    }
                    automaticImageGenerationCount += 1;

                    const imageOptions = getImageGenerationOptions(selectedRole?.id, target);
                    imageGenerationPromises.push(
                        generateImage(prompt, imageOptions).then(imgUrl => {
                            if (!imgUrl) return;
                            if (imgUrl.startsWith('error:')) {
                                if (!imageGenerationError) {
                                    imageGenerationError = imgUrl.slice('error:'.length);
                                }
                                return;
                            }
                            if (!generatedChatImage) {
                                generatedChatImage = imgUrl;
                            }
                        })
                    );
                }

                responseText = responseText.replace(MODEL_IMAGE_TAG_REGEX, '');
            }

            // GAME MAKER -> game-programmeur
            if (selectedRole?.id === 'game-programmeur') {
                const newCode = extractGameHtmlDocument(responseText);
                if (newCode) {

                    // =====================================================================
                    // CODE VALIDATION - Protect student work from broken AI responses
                    // =====================================================================
                    const currentCode = previousGameCodeRef.current;
                    let shouldUpdate = true;
                    let rejectionReason = '';

                    if (currentCode && currentCode.length > 500) {
                        const lengthRatio = newCode.length / currentCode.length;
                        if (lengthRatio < 0.5) {
                            shouldUpdate = false;
                            rejectionReason = `Code te kort (${Math.round(lengthRatio * 100)}% van origineel)`;
                        }

                        const hasCanvas = newCode.includes('<canvas') || newCode.includes('getContext');
                        const hasScript = newCode.includes('<script') && newCode.includes('</script>');
                        const hasGameLoop = newCode.includes('requestAnimationFrame') || newCode.includes('setInterval');

                        if (!hasCanvas || !hasScript || !hasGameLoop) {
                            shouldUpdate = false;
                            rejectionReason = 'Essentiële game elementen ontbreken (canvas/script/loop)';
                        }

                        const openCount = (newCode.match(/<script/gi) || []).length;
                        const closeCount = (newCode.match(/<\/script>/gi) || []).length;
                        if (openCount !== closeCount) {
                            shouldUpdate = false;
                            rejectionReason = 'Onvolledige code (script tags niet gesloten)';
                        }
                    }

                    let codeChanges: CodeChange[] = [];

                    if (shouldUpdate && currentCode && currentCode !== newCode) {
                        pushToHistory(currentCode);

                        codeChanges = computeCodeChanges(currentCode, newCode);
                        if (codeChanges.length > 0) {
                            setMessages(prev => {
                                const newArr = [...prev];
                                const lastIdx = newArr.length - 1;
                                if (newArr[lastIdx] && newArr[lastIdx].role === 'model') {
                                    newArr[lastIdx] = { ...newArr[lastIdx], codeChanges };
                                }
                                return newArr;
                            });
                        }
                        previousGameCodeRef.current = newCode;
                        setActiveGameCode(newCode);
                    } else if (!shouldUpdate && rejectionReason) {
                        console.warn('[GameCode Protection] Rejected update:', rejectionReason);
                        responseText = `⚠️ **Code-bescherming actief!**\n\nDe AI probeerde je code te vervangen met iets dat mogelijk kapot was (${rejectionReason}).\n\nJe huidige game is veilig. Probeer je vraag opnieuw te formuleren, of klik op ↩️ **Ongedaan** als je toch iets wilt herstellen.`;
                    } else if (!currentCode) {
                        previousGameCodeRef.current = newCode;
                        setActiveGameCode(newCode);
                    }

                    const cleanedExplanation = stripGameCodeFromResponse(responseText);
                    responseText = cleanedExplanation || '✅ Ik heb je game bijgewerkt. Bekijk de preview en test meteen of alles werkt.';
                }
            }

            // TRAINER -> ai-trainer
            if (selectedRole?.id === 'ai-trainer') {
                if (!hasTrainerPredictionTag && isTrainerTestQuestion(textInput)) {
                    setActiveTrainerData(prev => {
                        const inferredPrediction = inferTrainerPredictionFromText(responseText, textInput, prev);
                        return inferredPrediction ? { ...prev, testItem: inferredPrediction } : prev;
                    });
                }
                responseText = responseText.replace(/\[TRAIN_A\](.*?)\[\/TRAIN_A\]/g, '');
                responseText = responseText.replace(/\[TRAIN_B\](.*?)\[\/TRAIN_B\]/g, '');
            }


            // =====================================================================
            // CLEANUP: Final sweep to ensure no tags leak
            // =====================================================================
            responseText = responseText.replace(/\[TITLE\][\s\S]*?\[\/TITLE\]/gi, '');
            responseText = responseText.replace(/\[PAGE\][\s\S]*?\[\/PAGE\]/gi, '');
            responseText = responseText.replace(/\[IMG\s+[^\]]*\][\s\S]*?\[\/IMG\]/gi, '');
            responseText = responseText.replace(/\[TRAIN_A\][\s\S]*?\[\/TRAIN_A\]/gi, '');
            responseText = responseText.replace(/\[TRAIN_B\][\s\S]*?\[\/TRAIN_B\]/gi, '');
            responseText = responseText.replace(/\[PREDICT\][\s\S]*?\[\/PREDICT\]/gi, '');
            responseText = responseText.replace(/\[PROFILE\][\s\S]*?\[\/PROFILE\]/gi, '');
            responseText = responseText.replace(/\[SIMULATION\][\s\S]*?\[\/SIMULATION\]/gi, '');

            if (imageGenerationPromises.length > 0) {
                await Promise.all(imageGenerationPromises);
            }

            if (imageGenerationError && selectedRole?.id !== 'verhalen-ontwerper') {
                responseText = `${responseText.trim()}\n\n⚠️ De afbeelding kon niet worden gegenereerd: ${imageGenerationError}`.trim();
            }


            // Final message update
            const sanitizedText = DOMPurify.sanitize(responseText.trim(), {
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
                ALLOWED_ATTR: []
            });

            setMessages(prev => {
                const newArr = [...prev];
                const lastIdx = newArr.length - 1;
                if (newArr[lastIdx] && newArr[lastIdx].role === 'model') {
                    newArr[lastIdx] = { ...newArr[lastIdx], text: sanitizedText, ...(generatedChatImage ? { image: generatedChatImage } : {}) };
                }
                return newArr;
            });

        } catch (error) {
            const rawMessage = error instanceof Error
                ? error.message
                : "Oeps, er ging iets mis bij het nadenken.";
            const message = selectedRole?.id === 'game-programmeur' && /timeout|duurde te lang|timed out/i.test(rawMessage)
                ? "⏱️ De AI had te lang nodig om je gamecode aan te passen. Je huidige game is veilig bewaard. Probeer dezelfde opdracht nog één keer, of maak je vraag iets korter."
                : rawMessage;
            console.error("Agent logic error:", error);
            setError(message);
            setMessages(prev => [...prev, { role: 'model', text: message, timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
            setThinkingStep("");
            clearInterval(interval);
        }
    };

    // Reset game to default initialCode
    const resetGameToDefault = useCallback(() => {
        if (selectedRole?.id === 'game-programmeur' && selectedRole.initialCode) {
            setActiveGameCode(selectedRole.initialCode);
            previousGameCodeRef.current = selectedRole.initialCode;
            setMessages(prev => [...prev, {
                role: 'model',
                text: '🔄 **Game gereset!** De originele game is hersteld. Je kunt opnieuw beginnen met aanpassen.',
                timestamp: new Date()
            }]);
        }
    }, [selectedRole, setActiveGameCode, setMessages]);

    return {
        messages,
        input,
        setInput,
        isLoading,
        error,
        thinkingStep,
        suggestions,
        handleSend,
        // Role Data
        activeGameCode,
        activeBookData,
        activeLogicCode,
        activeTrainerData,

        // Setters if needed for manual updates
        setActiveTrainerData,
        setActiveBookData,
        // Bonus Challenges
        activeBonusChallenges,
        unlockBonusChallenge,
        resetCurrentMission,
        // Step tracking for mission completion
        completedSteps,
        setCompletedSteps,
        // Undo feature for game-programmeur
        undoGameCode,
        canUndoGameCode: gameCodeHistory.length > 0,
        // Reset game to default
        resetGameToDefault,
    };
};
