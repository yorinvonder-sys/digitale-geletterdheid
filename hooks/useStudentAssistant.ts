import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { createChatSession } from '../services/geminiService';
import { supabase } from '../services/supabase';
import { sanitizePrompt } from '../utils/promptSanitizer';

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

interface UseStudentAssistantProps {
    userIdentifier: string; // usually the student's UID
    context?: any; // Optional context to "watch along"
}

export const useStudentAssistant = ({ userIdentifier, context }: UseStudentAssistantProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [abuseCount, setAbuseCount] = useState(0);
    const chatSessionRef = useRef<any>(null);
    const [isOpen, setIsOpen] = useState(false); // Controls UI visibility

    // System instruction for the student assistant
    const systemInstruction = `
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

    // 1. Check lock status on mount/change — use Supabase Realtime
    useEffect(() => {
        if (!userIdentifier) return;

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
    }, [userIdentifier]);

    // 2. Initialize Chat
    useEffect(() => {
        if (!chatSessionRef.current) {
            chatSessionRef.current = createChatSession(systemInstruction);
            // Add welcome message
            setMessages([{
                role: 'model',
                text: "Hoi! 👋 Ik ben je AI-buddy. Voor Week 1 help ik je met de apps op je iPad (Magister, OneDrive, Word, PowerPoint). Het echte werk doe je in die apps, en ik help je bij elke stap. Vertel me: bij welke app ben je nu?",
                timestamp: new Date()
            }]);
        }
    }, []);

    const handleSend = async (messageOverride?: string) => {
        const messageText = (messageOverride ?? input).trim();
        if (!messageText || isLocked) return;

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
            console.error("AI Chat Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                text: "Sorry, ik ben even de draad kwijt. Probeer het later nog eens.",
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
        setIsOpen
    };
};
