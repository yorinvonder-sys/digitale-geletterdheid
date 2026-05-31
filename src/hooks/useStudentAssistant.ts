import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types';
import { createChatSession } from '@/services/geminiService';
import { supabase } from '@/services/supabase';
import { sanitizePrompt } from '@/utils/promptSanitizer';
import { useWellbeingMonitor, WellbeingMatch } from './useWellbeingMonitor';

const MAX_UI_MESSAGES = 30;
const ABUSE_THRESHOLD = 3;
const WEEK1_HELP_CONTEXT = {
    week: 1,
    focus: ['Magister', 'OneDrive', 'Word', 'PowerPoint', 'Printen'],
    goals: [
        'Rooster/huiswerk/berichten controleren in Magister',
        'Mappenstructuur maken en bestanden opslaan in OneDrive',
        'Word-document met titel, koppen, opsomming, afbeelding, paginanummer',
        'PowerPoint met 3 duidelijke slides',
        'Correct printen en inleveren via Magister'
    ]
};

const WEEK1_SYSTEM_INSTRUCTION = `
Je bent een behulpzame AI-assistent voor leerlingen in de 'AI Lab - Future Architect' omgeving.
Jouw doel is om leerlingen te helpen als ze vastlopen met hun opdrachten (missies).

BELANGRIJK VOOR COPERNICUSWEEK 1:
- De leerlingen werken in de ECHTE APPS op hun iPad (Magister, OneDrive, Word, PowerPoint).
- Jij coacht ze alleen; de uitvoering gebeurt buiten de website.
- Je mag pas een stap als 'voltooid' markeren (met ---STEP_COMPLETE:X---) als de leerling bewijs heeft gegeven door een vraag over de inhoud van de app te beantwoorden.

Bij Periode 1 MOET je antwoorden in de vorm:
1) Wat de leerling nu moet doen in de externe app (max 1 stap tegelijk).
2) Een verificatievraag stellen over wat ze daar zien (bijv. "Wat is de naam van de eerste les in je rooster?", "Hoeveel mappen zie je nu staan?").
3) Pas als de leerling antwoordt, bevestig je de stap en ga je door.

Geef dus geen lange uitleg in 1 keer; werk stap-voor-stap en eis bewijs.

REGELS VOOR JOU:
1. Wees vriendelijk, bemoedigend en duidelijk.
2. Geef GEEN kant-en-klare antwoorden voor toetsvragen of puzzels. Geef hints.
3. Als een leerling vraagt om de code te schrijven, geef dan een voorbeeld, maar doe niet het hele huiswerk.
3b. Voor Magister/OneDrive/Word/PowerPoint/Printen:
   - Geef concrete klikpaden voor de iPad-apps.
   - Vraag door: "Wat zie je op je scherm nadat je op ... hebt geklikt?"
   - Geef korte troubleshooting ("Als je dit niet ziet, controleer dan of ...").
4. **BELANGRIJK**: Je bent er ALLEEN voor schoolwerk. Weiger alle irrelevante vragen met [ABUSE_WARNING].
`;

const MISSION_ASSISTANT_SYSTEM_INSTRUCTION = `
Je bent een behulpzame AI-coach voor leerlingen in de DGSkills missieomgeving.
Gebruik de actuele missiecontext om korte, concrete hulp te geven bij de opdracht die de leerling nu maakt.

BELANGRIJK:
- Verwijs alleen naar de huidige missie, stap, dataset, ronde of challenge.
- Noem geen Magister, OneDrive, Word, PowerPoint, printen of iPad-apps tenzij die expliciet in de actuele missiecontext staan.
- Geef geen kant-en-klare eindantwoorden; geef hints, kleine voorbeelden en controlevragen.
- Laat de leerling eigen bewijs invullen in de opdrachtvelden.
- Stel maximaal een vervolgvraag tegelijk.
- Weiger irrelevante vragen met [ABUSE_WARNING].
`;

const hasMissionContext = (context: any): boolean => Boolean(
    context?.mission ||
    context?.currentChallenge ||
    context?.currentStep ||
    context?.currentRound ||
    context?.currentDataset ||
    context?.currentDebate
);

const contextLabel = (context: any, roleId: string): string => {
    if (typeof context?.mission?.title === 'string' && context.mission.title.trim()) {
        return context.mission.title.trim();
    }

    if (typeof context?.currentChallenge?.title === 'string' && context.currentChallenge.title.trim()) {
        return context.currentChallenge.title.trim();
    }

    if (typeof context?.currentStep?.title === 'string' && context.currentStep.title.trim()) {
        return context.currentStep.title.trim();
    }

    if (typeof context?.currentRound?.title === 'string' && context.currentRound.title.trim()) {
        return context.currentRound.title.trim();
    }

    if (typeof context?.currentDataset?.title === 'string' && context.currentDataset.title.trim()) {
        return context.currentDataset.title.trim();
    }

    return roleId === 'student-assistant'
        ? 'deze opdracht'
        : roleId.split('-').map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(' ');
};

interface UseStudentAssistantProps {
    userIdentifier: string; // usually the student's UID
    context?: any; // Optional context to "watch along"
    /** Optionele server-side roleId. Default: 'student-assistant'. */
    roleId?: string;
}

export const useStudentAssistant = ({ userIdentifier, context, roleId = 'student-assistant' }: UseStudentAssistantProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [abuseCount, setAbuseCount] = useState(0);
    const chatSessionRef = useRef<any>(null);
    const [isOpen, setIsOpen] = useState(false); // Controls UI visibility
    const shouldUseRemoteStudentControls = Boolean(userIdentifier)
        && userIdentifier !== 'anonymous'
        && !((import.meta as any).env?.DEV === true && userIdentifier.startsWith('dev-'));
    const isWeek1Assistant = roleId === 'student-assistant' && !hasMissionContext(context);

    // Welzijnsdetectie — scant berichten op zorgwekkende taal voordat ze naar AI gaan
    const handleWellbeingAlert = useCallback(async (match: WellbeingMatch) => {
        if (!shouldUseRemoteStudentControls) return;

        // Log alert naar Supabase voor docentnotificatie (zonder originele tekst — privacy)
        try {
            await supabase.rpc('log_wellbeing_alert' as any, {
                p_student_id: userIdentifier,
                p_category: match.category,
                p_detected_at: match.timestamp,
            });
        } catch (err) {
            // Tabel/RPC bestaat mogelijk nog niet — fail silently in dev, log in prod
            console.error('Wellbeing alert logging failed:', err);
        }
    }, [shouldUseRemoteStudentControls, userIdentifier]);

    const { scanText: scanWellbeing, showHulplijn, lastMatch: wellbeingMatch, dismissHulplijn } = useWellbeingMonitor({
        onAlert: handleWellbeingAlert,
        studentId: userIdentifier,
    });

    // Only used for local DEV fallback. Production chat instructions are looked up server-side by roleId.
    const systemInstruction = isWeek1Assistant
        ? WEEK1_SYSTEM_INSTRUCTION
        : MISSION_ASSISTANT_SYSTEM_INSTRUCTION;

    const assistantMissionContext = [
        `Rol: ${roleId}`,
        context?.mission?.title ? `Missie: ${context.mission.title}` : null,
        context?.mission?.goal ? `Doel: ${context.mission.goal}` : null,
        context?.currentChallenge?.title ? `Challenge: ${context.currentChallenge.title}` : null,
        context?.currentChallenge?.description ? `Situatie: ${context.currentChallenge.description}` : null,
        context?.currentStep?.title ? `Stap: ${context.currentStep.title}` : null,
        context?.currentStep?.instruction ? `Instructie: ${context.currentStep.instruction}` : null,
        context?.currentRound?.title ? `Ronde: ${context.currentRound.title}` : null,
        context?.currentDataset?.title ? `Dataset: ${context.currentDataset.title}` : null,
        isWeek1Assistant ? `Week 1 focus: ${WEEK1_HELP_CONTEXT.focus.join(', ')}` : null,
    ]
        .filter(Boolean)
        .join(' ');

    const welcomeMessage = isWeek1Assistant
        ? "Hoi! 👋 Ik ben je AI-buddy. Voor Week 1 help ik je met de apps op je iPad (Magister, OneDrive, Word, PowerPoint). Het echte werk doe je in die apps, en ik help je bij elke stap. Vertel me: bij welke app ben je nu?"
        : `Hoi! Ik ben je AI Coach voor ${contextLabel(context, roleId)}. Ik kijk mee met de opdracht en geef hints, kleine voorbeelden en controlevragen zonder het eindantwoord over te nemen. Waar loop je vast?`;

    // 1. Check lock status on mount/change — use Supabase Realtime
    useEffect(() => {
        if (!shouldUseRemoteStudentControls) return;

        // Initial fetch
        const fetchLockStatus = async () => {
            const { data } = await supabase
                .from('users')
                .select('chat_locked')
                .eq('id', userIdentifier)
                .single();

            if (data) {
                setIsLocked(!!data.chat_locked);
            }
        };

        fetchLockStatus();

        // Real-time subscription for lock status changes
        const channel = supabase
            .channel(`user-lock-${userIdentifier}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'users',
                    filter: `id=eq.${userIdentifier}`,
                },
                (payload) => {
                    const newData = payload.new as any;
                    setIsLocked(!!newData.chat_locked);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [shouldUseRemoteStudentControls, userIdentifier]);

    // 2. Initialize Chat
    useEffect(() => {
        if (!chatSessionRef.current) {
            chatSessionRef.current = createChatSession(roleId, systemInstruction, {
                localMissionContext: assistantMissionContext,
            });
            // Add welcome message
            setMessages([{
                role: 'model',
                text: welcomeMessage,
                timestamp: new Date()
            }]);
        }
    }, [assistantMissionContext, roleId, systemInstruction, welcomeMessage]);

    const handleSend = async (messageOverride?: string) => {
        const messageText = (messageOverride ?? input).trim();
        if (!messageText || isLocked) return;

        // Welzijnscheck — scan op zorgwekkende taal VOORDAT het bericht naar AI gaat
        const wellbeingResult = scanWellbeing(messageText);
        if (wellbeingResult.isBlocked) {
            // Bericht wordt NIET verstuurd. Hulplijn-overlay verschijnt automatisch via showHulplijn state.
            setInput('');
            return;
        }

        const userMsg: ChatMessage = {
            role: 'user',
            text: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev.slice(-MAX_UI_MESSAGES), userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // G-03 FIX: Sanitize user input against prompt injection (OWASP LLM01 / Cbw)
            const sanitizeResult = sanitizePrompt(messageText);
            if (sanitizeResult.wasBlocked) {
                const blockedMsg: ChatMessage = {
                    role: 'model',
                    text: sanitizeResult.reason || 'Je bericht kon niet worden verwerkt vanwege onveilige inhoud.',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, blockedMsg]);
                setIsLoading(false);
                return;
            }
            const cleanMessage = sanitizeResult.sanitized;

            // Prepare message with context if available
            let messageToSend = cleanMessage;
            if (context) {
                // G-03 FIX: Also sanitize context to prevent context injection
                const contextStr = JSON.stringify(context, null, 2);
                const safeContext = sanitizePrompt(contextStr);
                messageToSend = `${cleanMessage}\n\n[SYSTEM_CONTEXT_HIDDEN_FROM_USER]\nDe huidige staat van de opdracht is:\n${safeContext.sanitized}\n[/SYSTEM_CONTEXT]`;
            } else {
                const weekContext = JSON.stringify(WEEK1_HELP_CONTEXT, null, 2);
                messageToSend = `${cleanMessage}\n\n[SYSTEM_CONTEXT_HIDDEN_FROM_USER]\nStandaard context voor begeleiding:\n${weekContext}\n[/SYSTEM_CONTEXT]`;
            }

            const result = await chatSessionRef.current.sendMessage({ message: messageToSend });
            const responseText = result.text;

            // Check for Abuse Tag
            if (responseText.includes('[ABUSE_WARNING]')) {
                const cleanText = responseText.replace('[ABUSE_WARNING]', '').trim();

                // Increase local abuse count
                const newCount = abuseCount + 1;
                setAbuseCount(newCount);

                const warningMsg: ChatMessage = {
                    role: 'model',
                    text: cleanText,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, warningMsg]);

                // Lock if threshold reached
                if (newCount >= ABUSE_THRESHOLD) {
                    await lockStudentChat();
                }
            } else {
                // Normal response
                const modelMsg: ChatMessage = {
                    role: 'model',
                    text: responseText,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, modelMsg]);
            }

        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Sorry, ik ben even de draad kwijt. Probeer het later nog eens.";
            console.error("AI Chat Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                text: message,
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const lockStudentChat = async () => {
        setIsLocked(true);
        // Add system message
        setMessages(prev => [...prev, {
            role: 'model',
            text: "⛔ **CHAT GEBLOKKEERD**\nJe hebt te vaak niet-relevante vragen gesteld. De docent heeft een melding ontvangen. Je kunt voorlopig niet meer chatten.",
            timestamp: new Date()
        }]);

        if (!shouldUseRemoteStudentControls) return;

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    chat_locked: true,
                    chat_lock_reason: 'Misbruik van AI chat (irrelevante vragen)',
                    chat_lock_time: new Date().toISOString()
                })
                .eq('id', userIdentifier);
            if (error) console.error("Failed to lock user:", error);
        } catch (err) {
            console.error("Failed to lock user:", err);
        }
    };

    return {
        messages,
        input,
        setInput,
        handleSend,
        isLoading,
        isLocked,
        isOpen,
        setIsOpen,
        // Welzijnsdetectie
        showHulplijn,
        wellbeingMatch,
        dismissHulplijn,
    };
};
