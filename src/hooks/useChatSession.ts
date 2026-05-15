import { useState, useRef, useCallback } from 'react';
import { AgentRole, ChatMessage } from '@/types';
import { createChatSession, Chat } from '@/services/geminiService';

// ============================================================================
// MEMORY MANAGEMENT CONSTANTS
// These limits prevent swap/memory issues on devices with limited RAM
// ============================================================================
export const MAX_UI_MESSAGES = 30;        // Max messages shown in chat UI
export const MAX_CONTEXT_MESSAGES = 12;   // Messages to keep for context when refreshing session
export const SESSION_REFRESH_THRESHOLD = 15; // Refresh Gemini session after this many exchanges

function buildMissionContext(role: AgentRole): string {
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
}

interface UseChatSessionProps {
    selectedRole: AgentRole | null;
}

export const useChatSession = ({ selectedRole }: UseChatSessionProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const chatSessionRef = useRef<Chat | null>(null);
    const messageCountRef = useRef<number>(0);

    const refreshChatSession = useCallback((recentMessages: ChatMessage[]) => {
        if (!selectedRole) return;

        console.log('[Memory] Refreshing chat session to prevent memory buildup');

        const newSession = createChatSession(selectedRole.id, selectedRole.systemInstruction, {
            localMissionContext: buildMissionContext(selectedRole),
        });

        const contextMessages = recentMessages.slice(-MAX_CONTEXT_MESSAGES);
        const contextSummary = contextMessages
            .map(m => `${m.role === 'user' ? 'Gebruiker' : 'AI'}: ${m.text.substring(0, 200)}...`)
            .join('\n');

        newSession.sendMessage({
            message: `[CONTEXT SAMENVATTING - Vorige berichten]\n${contextSummary}\n[Ga verder met het gesprek]`
        }).catch(console.error);

        chatSessionRef.current = newSession;
        messageCountRef.current = 0;
    }, [selectedRole]);

    const resetSession = useCallback(() => {
        chatSessionRef.current = null;
        messageCountRef.current = 0;
        setMessages([]);
    }, []);

    const addMessage = useCallback((message: ChatMessage) => {
        setMessages(prev => {
            const newMessages = [...prev, message];
            return newMessages.slice(-MAX_UI_MESSAGES);
        });
    }, []);

    const refreshIfNeeded = useCallback(() => {
        messageCountRef.current++;
        if (messageCountRef.current >= SESSION_REFRESH_THRESHOLD) {
            setMessages(prev => {
                refreshChatSession(prev);
                return prev;
            });
        }
    }, [refreshChatSession]);

    return {
        messages,
        setMessages,
        addMessage,
        chatSessionRef,
        messageCountRef,
        refreshChatSession,
        refreshIfNeeded,
        resetSession,
    };
};
