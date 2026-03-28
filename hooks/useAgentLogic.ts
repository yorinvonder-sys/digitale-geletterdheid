
import { useState, useRef, useEffect, useCallback } from 'react';
import { AgentRole, ChatMessage, BookData, DetectiveCase, TrainerData, CodeChange, BonusChallenge } from '../types';
import { createChatSession, generateImage, Chat, type ImageAspectRatio, type ImageGenerationStyle } from '../services/geminiService';
import { enhancePrompt, shouldShowEnhancementDiff } from '../services/promptEnhancer';
import { computeCodeChanges } from '../components/CodeChangeCard';
import { saveMissionProgress, loadMissionProgress, resetMissionProgress } from '../services/missionService';
import { stripAiProvenance } from '../utils/aiContentMarker';
import DOMPurify from 'dompurify';

// ============================================================================
// MEMORY MANAGEMENT CONSTANTS
// These limits prevent swap/memory issues on devices with limited RAM
// ============================================================================
const MAX_UI_MESSAGES = 30;        // Max messages shown in chat UI
const MAX_CONTEXT_MESSAGES = 12;   // Messages to keep for context when refreshing session
const SESSION_REFRESH_THRESHOLD = 15; // Refresh Gemini session after this many exchanges

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

const GAME_HTML_DOCUMENT_REGEX = /<!doctype html(?:\s[^>]*)?>[\s\S]*?<\/html>/i;
const GAME_HTML_ROOT_REGEX = /<html[\s\S]*?<\/html>/i;
const GAME_HTML_FENCE_REGEX = /```(?:html)?\s*([\s\S]*?)```/i;
const MODEL_IMAGE_TAG_REGEX = /\[IMG\s+target=["']?\s*([^"'>\]]+)\s*["']?\]([\s\S]*?)\[\/IMG\]/gi;

function extractGameHtmlDocument(rawResponse: string): string | null {
    const cleaned = stripAiProvenance(rawResponse).trim();
    if (!cleaned) return null;

    const fullDocumentMatch = cleaned.match(GAME_HTML_DOCUMENT_REGEX);
    if (fullDocumentMatch) {
        return fullDocumentMatch[0].trim();
    }

    const htmlRootMatch = cleaned.match(GAME_HTML_ROOT_REGEX);
    if (htmlRootMatch) {
        return `<!DOCTYPE html>\n${htmlRootMatch[0].trim()}`;
    }

    const fencedCodeMatch = cleaned.match(GAME_HTML_FENCE_REGEX);
    if (fencedCodeMatch) {
        return extractGameHtmlDocument(fencedCodeMatch[1]);
    }

    const looksLikeGameFragment =
        /<canvas\b/i.test(cleaned) &&
        /<script\b/i.test(cleaned) &&
        /<\/script>/i.test(cleaned);

    if (looksLikeGameFragment) {
        return [
            '<!DOCTYPE html>',
            '<html lang="nl">',
            '<head>',
            '  <meta charset="UTF-8" />',
            '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
            '  <title>Game Preview</title>',
            '</head>',
            '<body>',
            cleaned,
            '</body>',
            '</html>',
        ].join('\n');
    }

    return null;
}

function stripGameCodeFromResponse(rawResponse: string): string {
    return stripAiProvenance(rawResponse)
        .replace(GAME_HTML_DOCUMENT_REGEX, '')
        .replace(GAME_HTML_ROOT_REGEX, '')
        .replace(GAME_HTML_FENCE_REGEX, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
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
    return [
        `Missie: ${role.title}`,
        role.description,
        role.problemScenario,
        `Doel: ${role.missionObjective}`,
        role.steps?.length ? `Stappen: ${role.steps.map(step => step.title).join(', ')}` : null,
    ]
        .filter(Boolean)
        .join(' ');
};


import { MissionProgress } from '../types';

interface UseAgentLogicProps {
    selectedRole: AgentRole | null;
    userIdentifier: string;
    schoolId?: string;
    initialProgress?: MissionProgress;
    skipLoading?: boolean;
}

export const useAgentLogic = ({ selectedRole, userIdentifier, schoolId, initialProgress, skipLoading = false }: UseAgentLogicProps) => {
    // Initialize state with stored progress if available
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [thinkingStep, setThinkingStep] = useState<string>("Analyseren...");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    // Specific Role State - Restore from initialProgress if available
    const [activeGameCode, setActiveGameCode] = useState<string | null>(initialProgress?.data?.activeGameCode || null);
    const [gameCodeHistory, setGameCodeHistory] = useState<string[]>([]); // Undo history for game code
    const [activeBookData, setActiveBookData] = useState<BookData>(initialProgress?.data?.activeBookData || { title: "Nieuw Verhaal", pages: [] });
    const [activeLogicCode, setActiveLogicCode] = useState<string | null>(initialProgress?.data?.activeLogicCode || null);
    const [activeTrainerData, setActiveTrainerData] = useState<TrainerData>(initialProgress?.data?.activeTrainerData || { classALabel: 'A', classBLabel: 'B', classAItems: [], classBItems: [] });
    const [activeBonusChallenges, setActiveBonusChallenges] = useState<BonusChallenge[]>(initialProgress?.data?.activeBonusChallenges || []);

    // Step-based mission completion tracking - Restore steps
    const [completedSteps, setCompletedSteps] = useState<number[]>(initialProgress?.completedSteps || []);

    const chatSessionRef = useRef<Chat | null>(null);
    const previousGameCodeRef = useRef<string | null>(null); // Track previous code for diff
    const messageCountRef = useRef<number>(0); // Track exchanges for session refresh

    // Helper: Refresh chat session with recent context (prevents memory buildup in Gemini SDK)
    const refreshChatSession = useCallback((recentMessages: ChatMessage[]) => {
        if (!selectedRole) return;

        console.log('[Memory] Refreshing chat session to prevent memory buildup');

        // Create fresh session
        const newSession = createChatSession(selectedRole.id, selectedRole.systemInstruction, {
            localMissionContext: buildMissionContext(selectedRole),
        });

        // Re-inject essential context (last N messages)
        const contextMessages = recentMessages.slice(-MAX_CONTEXT_MESSAGES);
        const contextSummary = contextMessages
            .map(m => `${m.role === 'user' ? 'Gebruiker' : 'AI'}: ${m.text.substring(0, 200)}...`)
            .join('\n');

        // Send summary as context
        newSession.sendMessage({
            message: `[CONTEXT SAMENVATTING - Vorige berichten]\n${contextSummary}\n[Ga verder met het gesprek]`
        }).catch(console.error);

        chatSessionRef.current = newSession;
        messageCountRef.current = 0;
    }, [selectedRole]);

    // Initialize Chat
    useEffect(() => {
        if (selectedRole) {
            // RESTORE MESSAGES IF AVAILABLE
            // We need to convert summary back to full messages if possible, or just use them as context
            // ideally we would store full messages but let's start fresh with context if only summaries

            // For now, let's keep the welcome message but maybe skip if we have history?
            // Actually, let's always show welcome message if history is empty, otherwise nothing (UI handles history)

            if (initialProgress && initialProgress.chatHistory && initialProgress.chatHistory.length > 0) {
                // Restore history (mapping summary to message structure)
                // Note: We don't have timestamps in summary, so we generate new Date
                const restoredMessages: ChatMessage[] = initialProgress.chatHistory.map(m => ({
                    role: m.role,
                    text: m.text,
                    timestamp: new Date() // Best approximation
                }));
                setMessages(restoredMessages);
            } else {
                // Use the EERSTE BERICHT from systemInstruction if available.
                // If missing, build an actionable welcome from the mission's
                // problemScenario and first step so the student knows what to do.
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
            // Show tips immediately when mission starts (before AI responds)
            const starterTips = getStarterTips(selectedRole.id, selectedRole.examplePrompt);
            setSuggestions(starterTips);

            try {
                const session = createChatSession(selectedRole.id, selectedRole.systemInstruction, {
                    localMissionContext: buildMissionContext(selectedRole),
                });
                chatSessionRef.current = session;

                // If it's a game programmer, we provide initial code as context
                if (selectedRole.id === 'game-programmeur' && selectedRole.initialCode) {
                    // Send hidden context message
                    // Only send context if we haven't recovered a session (TODO: optimized session recovery)
                    session.sendMessage({ message: `Hier is de start-code van de game: \n\n ${selectedRole.initialCode}` });
                }


            } catch (e) {
                console.error("Failed to init chat", e);
                setError("Kon AI niet starten. Controleer je sessie of AI-configuratie.");
            }

            // Reset role specific data
            setActiveBookData({ title: "Nieuw Verhaal", pages: [] });
            setActiveLogicCode(null);
            // setActiveDetectiveCase(null);
            setActiveTrainerData({ classALabel: 'A', classBLabel: 'B', classAItems: [], classBItems: [] });

            // --- LOAD SAVED PROGRESS ---
            if (!skipLoading) {
                console.log(`[CloudLoad] Loading progress for ${selectedRole.id}...`);

                // Timeout promise to prevent infinite loading
                const timeoutPromise = new Promise<null>((resolve) => {
                    setTimeout(() => {
                        console.warn(`[CloudLoad] Timeout for ${selectedRole.id}, using fallback`);
                        resolve(null);
                    }, 5000); // 5 second timeout
                });

                // Race between load and timeout
                Promise.race([
                    loadMissionProgress(userIdentifier, selectedRole.id),
                    timeoutPromise
                ]).then(data => {
                    if (data) {
                        console.log(`[CloudLoad] Success for ${selectedRole.id}`);
                        if (data.gameCode && selectedRole.id === 'game-programmeur') setActiveGameCode(data.gameCode);
                        if (data.bookData && selectedRole.id === 'verhalen-ontwerper') setActiveBookData(data.bookData);
                        if (data.logicCode && (selectedRole.id as string) === 'logica-legende') setActiveLogicCode(data.logicCode);
                        // Fix: Support both legacy prompt-trainer and new ai-trainer
                        if (data.trainerData && ((selectedRole.id as string) === 'prompt-trainer' || selectedRole.id === 'ai-trainer')) {
                            setActiveTrainerData(data.trainerData);
                        }
                    } else {
                        // No save found OR timeout - use initial code
                        console.log(`[CloudLoad] No data or timeout for ${selectedRole.id}, using fallback`);
                        if (selectedRole.id === 'game-programmeur' && selectedRole.initialCode) {
                            setActiveGameCode(selectedRole.initialCode);
                        }
                    }
                }).catch(err => {
                    console.error("[CloudLoad] Error:", err);
                    // Fallback to init code
                    if (selectedRole.id === 'game-programmeur' && selectedRole.initialCode) {
                        setActiveGameCode(selectedRole.initialCode);
                    }
                });
            } else {
                // skipLoading is true - use initialProgress data if available (from library or shared link)
                if (initialProgress?.data) {
                    console.log(`[CloudLoad] Using initialProgress data for ${selectedRole.id}`);
                    if (initialProgress.data.activeGameCode && selectedRole.id === 'game-programmeur') {
                        setActiveGameCode(initialProgress.data.activeGameCode);
                    }
                    if (initialProgress.data.activeBookData && selectedRole.id === 'verhalen-ontwerper') {
                        setActiveBookData(initialProgress.data.activeBookData);
                    }
                } else if (selectedRole.id === 'game-programmeur' && selectedRole.initialCode) {
                    // No initialProgress, fall back to initial code
                    setActiveGameCode(selectedRole.initialCode);
                }
            }
        }
    }, [selectedRole, userIdentifier, initialProgress, skipLoading, refreshChatSession]);
    // --- AUTO-SAVE LOGIC ---
    // Save GAME CODE changes
    useEffect(() => {
        if (selectedRole?.id === 'game-programmeur' && activeGameCode) {
            const timer = setTimeout(() => {
                saveMissionProgress(userIdentifier, 'game-programmeur', { gameCode: activeGameCode, schoolId });
            }, 1000); // Debounce 1s
            return () => clearTimeout(timer);
        }
    }, [activeGameCode, selectedRole, userIdentifier, schoolId]);

    // Save BOOK DATA changes
    useEffect(() => {
        if (selectedRole?.id === 'verhalen-ontwerper' && activeBookData) {
            const timer = setTimeout(() => {
                // Save even if pages are empty (e.g. title setup)
                saveMissionProgress(userIdentifier, 'verhalen-ontwerper', { bookData: activeBookData, schoolId });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [activeBookData, selectedRole, userIdentifier, schoolId]);

    // Save TRAINER DATA changes
    useEffect(() => {
        if (((selectedRole?.id as string) === 'prompt-trainer' || selectedRole?.id === 'ai-trainer') && activeTrainerData) {
            const timer = setTimeout(() => {
                saveMissionProgress(userIdentifier, selectedRole.id, { trainerData: activeTrainerData, schoolId });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [activeTrainerData, selectedRole, userIdentifier, schoolId]);

    // Save LOGIC CODE changes
    useEffect(() => {
        if ((selectedRole?.id as string) === 'logica-legende' && activeLogicCode) {
            const timer = setTimeout(() => {
                saveMissionProgress(userIdentifier, 'logica-legende', { logicCode: activeLogicCode, schoolId });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [activeLogicCode, selectedRole, userIdentifier, schoolId]);



    // --- RESET LOGIC ---
    const resetCurrentMission = useCallback(async () => {
        if (!selectedRole) return;

        try {
            // 1. Wipe Cloud Data
            await resetMissionProgress(userIdentifier, selectedRole.id);

            // 2. Reset Local State based on Role
            if (selectedRole.id === 'game-programmeur') {
                setActiveGameCode(selectedRole.initialCode || '');
                setMessages(prev => [...prev, { role: 'model', text: '♻️ **Game gereset!**\nAlle code is hersteld naar het beginpunt.', timestamp: new Date() }]);
            } else if (selectedRole.id === 'verhalen-ontwerper') {
                setActiveBookData({ title: "Nieuw Verhaal", pages: [] });
                setMessages(prev => [...prev, { role: 'model', text: '♻️ **Verhaal gereset!**\nJe kunt helemaal opnieuw beginnen.', timestamp: new Date() }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: '♻️ **Missie gereset!**', timestamp: new Date() }]);
            }

            // 3. Clear Chat Context (Optional, but often desired on hard reset)
            // createChatSession(selectedRole.id, selectedRole.systemInstruction); // Reset Gemini session too if desired

        } catch (err) {
            console.error("Reset failed:", err);
            setError("Er ging iets mis bij het resetten.");
        }
    }, [selectedRole, userIdentifier]);

    const unlockBonusChallenge = (challengeId: string) => {
        if (!selectedRole?.bonusChallenges) return;

        const challenge = selectedRole.bonusChallenges.find(c => c.id === challengeId);
        if (challenge && !activeBonusChallenges.some(c => c.id === challenge.id)) {
            setActiveBonusChallenges(prev => [...prev, challenge]);

            // Notify user via chat
            setMessages(prev => [...prev, {
                role: 'model',
                text: `🏆 **BONUS UITDAGING ONTGRENDELD:** ${challenge.title}\n\n${challenge.description}\n\nBeloning: **${challenge.xpReward} XP**`,
                timestamp: new Date()
            }]);
        }
    };

    // --- UNDO GAME CODE ---
    // Allows students to revert to the previous version of their game code
    const undoGameCode = useCallback(() => {
        if (gameCodeHistory.length === 0) return;

        const previousCode = gameCodeHistory[gameCodeHistory.length - 1];
        setGameCodeHistory(prev => prev.slice(0, -1));
        setActiveGameCode(previousCode);
        previousGameCodeRef.current = previousCode;

        setMessages(prev => [...prev, {
            role: 'model',
            text: '↩️ **Vorige versie hersteld!**\nDe game is teruggezet naar de vorige werkende versie.',
            timestamp: new Date()
        }]);
    }, [gameCodeHistory]);



    const handleSend = async (textInput: string = input) => {
        if (!chatSessionRef.current) {
            setError("Kan geen verbinding maken met AI. Ververs de pagina of check je API key.");
            return;
        }

        const userMsg: ChatMessage = {
            role: 'user',
            text: textInput,
            timestamp: new Date()
        };

        // MEMORY MANAGEMENT: Track message count and check if session refresh needed
        messageCountRef.current++;

        // Check if we need to refresh the session to prevent memory buildup
        if (messageCountRef.current >= SESSION_REFRESH_THRESHOLD) {
            // Get current messages before refresh
            setMessages(prev => {
                refreshChatSession(prev);
                return prev;
            });
        }

        // 1. Add User Message immediately (with message limit to prevent memory issues)
        setMessages(prev => {
            const newMessages = [...prev, userMsg];
            // Trim to max UI messages to prevent memory buildup
            return newMessages.slice(-MAX_UI_MESSAGES);
        });
        setInput('');
        setIsLoading(true);
        setError(null);
        setSuggestions([]);

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
        }, isStoryMission ? 2000 : 1200); // Longer steps for story mission (image generation takes time)

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
            // This is sent separately from the message so it bypasses the prompt sanitizer
            // (it's our own code, not user input)
            if (selectedRole?.id === 'game-programmeur' && activeGameCode) {
                chatSessionRef.current.setGameContext(activeGameCode);
            }

            // Debug logging (only in development)
            if (enhancementResult.wasEnhanced && process.env.NODE_ENV === 'development') {
                console.log('[PromptEnhancer] Original:', textInput);
                console.log('[PromptEnhancer] Enhanced:', promptForAI);
                console.log('[PromptEnhancer] Changes:', enhancementResult.enhancements);
            }

            // 2. Prepare response handling
            let isFirstChunk = true;
            let fullTextAccumulated = "";
            const useNonStreamingResponse = selectedRole?.id === 'game-programmeur';

            const { sendMessageToGemini, sendMessageToGeminiStream } = await import('../services/geminiService');

            // Track already-processed trainer items to avoid duplicates during streaming
            const processedTrainA = new Set<string>();
            const processedTrainB = new Set<string>();

            if (useNonStreamingResponse) {
                clearInterval(interval);
                fullTextAccumulated = await sendMessageToGemini(
                    chatSessionRef.current,
                    promptForAI
                );
                setMessages(prev => [
                    ...prev,
                    { role: 'model', text: fullTextAccumulated, timestamp: new Date() }
                ]);
            } else {
                await sendMessageToGeminiStream(
                    chatSessionRef.current,
                    promptForAI,  // Send ENHANCED prompt to AI
                    (chunkText) => {
                        fullTextAccumulated = chunkText;

                        // REAL-TIME TRAINER DATA PARSING (ai-trainer mission)
                        // Parse and add items IMMEDIATELY as they stream in for instant visual feedback
                        if (selectedRole?.id === 'ai-trainer') {
                            // Parse TRAIN_A tags (plastic/categorie A) in real-time
                            const trainAMatches = [...chunkText.matchAll(/\[TRAIN_A\](.*?)\[\/TRAIN_A\]/g)];
                            for (const match of trainAMatches) {
                                const item = match[1];
                                if (!processedTrainA.has(item)) {
                                    processedTrainA.add(item);
                                    setActiveTrainerData(prev => ({ ...prev, classAItems: [...prev.classAItems, item] }));
                                }
                            }

                            // Parse TRAIN_B tags (papier/categorie B) in real-time
                            const trainBMatches = [...chunkText.matchAll(/\[TRAIN_B\](.*?)\[\/TRAIN_B\]/g)];
                            for (const match of trainBMatches) {
                                const item = match[1];
                                if (!processedTrainB.has(item)) {
                                    processedTrainB.add(item);
                                    setActiveTrainerData(prev => ({ ...prev, classBItems: [...prev.classBItems, item] }));
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
                            // Update the LAST message (which is the model's streaming message)
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
            const stepMatches = responseText.matchAll(/---STEP_COMPLETE:(\d+)---/g);
            for (const match of stepMatches) {
                const stepIndex = parseInt(match[1]) - 1; // Convert 1-based to 0-based
                setCompletedSteps(prev => {
                    if (!prev.includes(stepIndex)) {
                        console.log('[Steps] Step', stepIndex + 1, 'completed!');
                        return [...prev, stepIndex];
                    }
                    return prev;
                });
                responseText = responseText.replace(match[0], '');
            }

            // --- PARSE ROLE SPECIFIC DATA ---
            const imageGenerationPromises: Promise<void>[] = [];
            let generatedChatImage: string | undefined;
            let imageGenerationError: string | null = null;

            // CREATOR (Book) -> verhalen-ontwerper
            if (selectedRole?.id === 'verhalen-ontwerper') {
                console.log('[DEBUG] Parsing Book Response:', responseText);

                // Cleanup tags from text IMMEDIATELY as we find them
                // This ensures the chat UI never shows the raw tags, even if image gen takes time

                // TITLE
                const titleMatch = responseText.match(/\[TITLE\](.*?)\[\/TITLE\]/i);
                if (titleMatch) {
                    setActiveBookData(prev => ({ ...prev, title: titleMatch[1] }));
                    responseText = responseText.replace(titleMatch[0], '');
                }

                // PAGES
                // Improved Regex: Handles optional target with loose spacing and varied quotes
                const pageRegex = /\[PAGE(?:\s+target=["']?(\d+)["']?)?\]([\s\S]*?)\[\/PAGE\]/gi;

                // We execute a loop to catch ALL page updates in one response
                let pageMatch;
                while ((pageMatch = pageRegex.exec(responseText)) !== null) {
                    const targetPage = pageMatch[1] ? parseInt(pageMatch[1]) : null;
                    const pageText = pageMatch[2].trim();

                    setActiveBookData(prev => {
                        const newPages = [...prev.pages];

                        // If specific target page is requested (and valid)
                        if (targetPage !== null) {
                            // Ensure array is large enough (fill gaps)
                            while (newPages.length < targetPage) {
                                newPages.push({ text: '' });
                            }

                            // Update existing page (targetPage is 1-based index)
                            const actualIndex = targetPage - 1;
                            newPages[actualIndex] = { ...newPages[actualIndex], text: pageText };

                        } else {
                            // No target specified? Just append a new page
                            newPages.push({ text: pageText });
                        }
                        return { ...prev, pages: newPages };
                    });
                }
                responseText = responseText.replace(pageRegex, '');

                // IMAGES
                // Improved Regex: Handles target="cover" OR target="1", loose spacing
                let imgMatch;
                while ((imgMatch = MODEL_IMAGE_TAG_REGEX.exec(responseText)) !== null) {
                    const rawTarget = imgMatch[1];
                    const rawPrompt = imgMatch[2];

                    if (rawTarget && rawPrompt) {
                        const target = rawTarget.trim().toLowerCase();
                        const prompt = rawPrompt.trim();
                        const imageOptions = getImageGenerationOptions(selectedRole.id, target);

                        // Prepare state for loading
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

                        // Add to promises (Background execution)
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
                                    // Optional: notify chat about specific failure, or just let the book show 'Error'
                                    console.warn("Image generation failed silently for", target);
                                } else if (imgUrl.startsWith('error:') && !imageGenerationError) {
                                    imageGenerationError = imgUrl.slice('error:'.length);
                                }
                            })
                        );
                    }
                }
                // Remove IMG tags
                responseText = responseText.replace(MODEL_IMAGE_TAG_REGEX, '');
            }

            if (selectedRole?.id !== 'verhalen-ontwerper') {
                let imageMatch;
                while ((imageMatch = MODEL_IMAGE_TAG_REGEX.exec(responseText)) !== null) {
                    const target = imageMatch[1]?.trim().toLowerCase();
                    const prompt = imageMatch[2]?.trim();

                    if (!target || !prompt) continue;

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
                        // Check 1: Reject if new code is drastically shorter (50%+ reduction)
                        const lengthRatio = newCode.length / currentCode.length;
                        if (lengthRatio < 0.5) {
                            shouldUpdate = false;
                            rejectionReason = `Code te kort (${Math.round(lengthRatio * 100)}% van origineel)`;
                        }

                        // Check 2: Reject if new code is missing essential game elements
                        const hasCanvas = newCode.includes('<canvas') || newCode.includes('getContext');
                        const hasScript = newCode.includes('<script') && newCode.includes('</script>');
                        const hasGameLoop = newCode.includes('requestAnimationFrame') || newCode.includes('setInterval');

                        if (!hasCanvas || !hasScript || !hasGameLoop) {
                            shouldUpdate = false;
                            rejectionReason = 'Essentiële game elementen ontbreken (canvas/script/loop)';
                        }

                        // Check 3: Reject incomplete HTML (unclosed tags)
                        const openCount = (newCode.match(/<script/gi) || []).length;
                        const closeCount = (newCode.match(/<\/script>/gi) || []).length;
                        if (openCount !== closeCount) {
                            shouldUpdate = false;
                            rejectionReason = 'Onvolledige code (script tags niet gesloten)';
                        }
                    }

                    let codeChanges: CodeChange[] = [];

                    if (shouldUpdate && currentCode && currentCode !== newCode) {
                        // Save previous code to history before updating (max 10 versions for extra safety)
                        setGameCodeHistory(prev => [...prev.slice(-9), currentCode]);

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
                        // First time code - always accept
                        previousGameCodeRef.current = newCode;
                        setActiveGameCode(newCode);
                    }

                    const cleanedExplanation = stripGameCodeFromResponse(responseText);
                    responseText = cleanedExplanation || '✅ Ik heb je game bijgewerkt. Bekijk de preview en test meteen of alles werkt.';
                }
            }

            // TRAINER -> ai-trainer
            // NOTE: Items are now added in real-time during streaming (see above)
            // We only need to clean up the tags from the response text here
            if (selectedRole?.id === 'ai-trainer') {
                responseText = responseText.replace(/\[TRAIN_A\](.*?)\[\/TRAIN_A\]/g, '');
                responseText = responseText.replace(/\[TRAIN_B\](.*?)\[\/TRAIN_B\]/g, '');
            }


            // =====================================================================
            // CLEANUP: Final sweep to ensure no tags leak
            // =====================================================================
            // Redundant check in case regexes missed something
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
            const message = error instanceof Error
                ? error.message
                : "Oeps, er ging iets mis bij het nadenken.";
            console.error("Agent logic error:", error);
            setMessages(prev => [...prev, { role: 'model', text: message, timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
            setThinkingStep("");
            clearInterval(interval);
        }
    };

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
        canUndoGameCode: gameCodeHistory.length > 0
    };
};
