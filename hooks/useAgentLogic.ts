
import { useState, useRef, useEffect, useCallback } from 'react';
import { AgentRole, ChatMessage, BookData, DetectiveCase, TrainerData, CodeChange, BonusChallenge } from '../types';
import { createChatSession, sendMessageToGemini, generateImage, Chat } from '../services/geminiService';
import { enhancePrompt, shouldShowEnhancementDiff } from '../services/promptEnhancer';
import { computeCodeChanges } from '../components/CodeChangeCard';
import { saveMissionProgress, loadMissionProgress, resetMissionProgress } from '../services/missionService';
import DOMPurify from 'dompurify';

// ============================================================================
// MEMORY MANAGEMENT CONSTANTS
// These limits prevent swap/memory issues on devices with limited RAM
// ============================================================================
const MAX_UI_MESSAGES = 30;        // Max messages shown in chat UI
const MAX_CONTEXT_MESSAGES = 12;   // Messages to keep for context when refreshing session
const SESSION_REFRESH_THRESHOLD = 15; // Refresh Gemini session after this many exchanges

// ============================================================================
// STARTER TIPS - Short, actionable prompts shown when a mission starts
// These cost XP when clicked (penalty for using hints)
// ============================================================================
const getStarterTips = (roleId: string, examplePrompt?: string): string[] => {
    const tips: Record<string, string[]> = {
        'game-programmeur': [
            'Maak de speler blauw',
            'Maak het springen hoger',
            'Voeg een springgeluid toe'
        ],
        'verhalen-ontwerper': [
            'Schrijf over een draak',
            'Mijn held is een konijn',
            'Maak een spannend avontuur'
        ],
        'ai-trainer': [
            'Dit is plastic',
            'Voeg een kartonnen doos toe',
            'Train de AI met papier'
        ],
        'nepnieuws-speurder': [
            'Is dit echt?',
            'Wie maakte dit?',
            'Analyseer de bron'
        ],
        'magister-master': [
            'Hoe check ik mijn rooster?',
            'Waar vind ik mijn cijfers?',
            'Hoe zie ik het huiswerk?'
        ],
        'cloud-commander': [
            'Maak een nieuwe map',
            'Deel een bestand',
            'Zoek mijn document'
        ],
        'word-wizard': [
            'Maak een inhoudsopgave',
            'Voeg paginanummers toe',
            'Hoe maak ik bullets?'
        ],
        'slide-specialist': [
            'Voeg een animatie toe',
            'Kies een mooi thema',
            'Maak een overgang'
        ],
        'social-media-psychologist': [
            'Wat is een filterbubbel?',
            'Hoe werkt een algoritme?',
            'Wat is echo-kamer?'
        ],
        'print-pro': [
            'Hoe log ik in?',
            'Waar vind ik de app?',
            'Stuur een printopdracht'
        ]
    };

    // Return mission-specific tips, or fallback to examplePrompt
    return tips[roleId] || (examplePrompt ? [examplePrompt] : []);
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
        const newSession = createChatSession(selectedRole.systemInstruction);

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
                setMessages([{
                    role: 'model',
                    text: `Welkom bij ${selectedRole.title}! ${selectedRole.description} Waarmee kan ik je helpen?`,
                    timestamp: new Date()
                }]);
            }
            // --- INITIALIZE STARTER TIPS ---
            // Show tips immediately when mission starts (before AI responds)
            const starterTips = getStarterTips(selectedRole.id, selectedRole.examplePrompt);
            setSuggestions(starterTips);

            try {
                const session = createChatSession(selectedRole.systemInstruction);
                chatSessionRef.current = session;

                // If it's a game programmer, we provide initial code as context
                if (selectedRole.id === 'game-programmeur' && selectedRole.initialCode) {
                    // Send hidden context message
                    // Only send context if we haven't recovered a session (TODO: optimized session recovery)
                    session.sendMessage({ message: `Hier is de start-code van de game: \n\n ${selectedRole.initialCode}` });
                }


            } catch (e) {
                console.error("Failed to init chat", e);
                setError("Kon AI niet starten. Check je API key.");
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
            // createChatSession(selectedRole.systemInstruction); // Reset Gemini session too if desired

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

            // Debug logging (only in development)
            if (enhancementResult.wasEnhanced && process.env.NODE_ENV === 'development') {
                console.log('[PromptEnhancer] Original:', textInput);
                console.log('[PromptEnhancer] Enhanced:', promptForAI);
                console.log('[PromptEnhancer] Changes:', enhancementResult.enhancements);
            }

            // 2. Prepare for streaming
            let isFirstChunk = true;
            let fullTextAccumulated = "";

            // Call Streaming API
            const { sendMessageToGeminiStream } = await import('../services/geminiService');

            // Track already-processed trainer items to avoid duplicates during streaming
            const processedTrainA = new Set<string>();
            const processedTrainB = new Set<string>();

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
                const imgRegex = /\[IMG\s+target=["']?\s*([^"'>\]]+)\s*["']?\]([\s\S]*?)\[\/IMG\]/gi;
                let imgMatch;
                while ((imgMatch = imgRegex.exec(responseText)) !== null) {
                    const rawTarget = imgMatch[1];
                    const rawPrompt = imgMatch[2];

                    if (rawTarget && rawPrompt) {
                        const target = rawTarget.trim().toLowerCase();
                        const prompt = rawPrompt.trim();

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
                            generateImage(prompt).then(imgUrl => {
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
                                }
                            })
                        );
                    }
                }
                // Remove IMG tags
                responseText = responseText.replace(imgRegex, '');
            }

            // GAME MAKER -> game-programmeur

            if (selectedRole?.id === 'game-programmeur') {
                const htmlMatch = responseText.match(/<!DOCTYPE html>[\s\S]*?<\/html>/i);
                if (htmlMatch) {
                    const newCode = htmlMatch[0];

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
                        // Notify user that code update was rejected
                        console.warn('[GameCode Protection] Rejected update:', rejectionReason);
                        setMessages(prev => [...prev, {
                            role: 'model',
                            text: `⚠️ **Code-bescherming actief!**\n\nDe AI probeerde je code te vervangen met iets dat mogelijk kapot was (${rejectionReason}).\n\nJe huidige game is veilig. Probeer je vraag opnieuw te formuleren, of klik op ↩️ **Ongedaan** als je toch iets wilt herstellen.`,
                            timestamp: new Date()
                        }]);
                    } else if (!currentCode) {
                        // First time code - always accept
                        previousGameCodeRef.current = newCode;
                        setActiveGameCode(newCode);
                    }
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

            // Execute image generation in background (don't block chat)
            Promise.all(imageGenerationPromises).catch(console.error);


            // Final message update
            const sanitizedText = DOMPurify.sanitize(responseText.trim(), {
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
                ALLOWED_ATTR: []
            });

            setMessages(prev => {
                const newArr = [...prev];
                const lastIdx = newArr.length - 1;
                if (newArr[lastIdx] && newArr[lastIdx].role === 'model') {
                    newArr[lastIdx] = { ...newArr[lastIdx], text: sanitizedText };
                }
                return newArr;
            });

        } catch (error) {
            console.error("Agent logic error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Oeps, er ging iets mis bij het nadenken.", timestamp: new Date() }]);
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
