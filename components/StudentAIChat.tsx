import React, { useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Lock, Bot } from 'lucide-react';
import { useStudentAssistant } from '../hooks/useStudentAssistant';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AiDisclosureBadge } from './AiDisclosureBadge';

/** Context data passed to AI for better responses */
interface AIContextData {
    currentChallenge?: {
        title: string;
        description: string;
        hint?: string;
    } | null;
    blocks?: Array<{ type: string; inputs: Record<string, unknown> }>;
    logs?: string[];
    gameStatus?: {
        isPlaying: boolean;
        reachedGoal: boolean;
        challengeComplete: boolean;
        score: number;
    };
    [key: string]: unknown; // Allow additional context properties
}

interface StudentAIChatProps {
    userIdentifier: string;
    context?: AIContextData;
    isOpen?: boolean; // Controlled state
    onOpenChange?: (open: boolean) => void; // State handler
}

export const StudentAIChat: React.FC<StudentAIChatProps> = ({ userIdentifier, context, isOpen: controlledIsOpen, onOpenChange }) => {
    const getQuickPromptLabel = () => {
        const week = typeof context?.week === 'number' ? context.week : null;
        if (context?.currentChallenge) return 'Game Challenge Hulp';
        if (week && week >= 1 && week <= 4) return `Week ${week} Hulp`;
        return 'Opdracht Hulp';
    };

    const getQuickPrompts = () => {
        const week = typeof context?.week === 'number' ? context.week : null;

        // Mission context (e.g., Game Director): keep prompts aligned to current challenge.
        if (context?.currentChallenge) {
            return [
                'Ik snap deze challenge niet, leg de eerste stap uit.',
                'Welke block moet ik als eerste slepen?',
                'Wat betekent deze fout in mijn game?',
                'Geef 1 hint zonder het antwoord te geven.',
                'Hoe controleer ik of mijn oplossing klopt?'
            ];
        }

        if (week === 1) {
            return [
                'Ik heb de mappen in OneDrive gemaakt. Wat is de volgende stap?',
                'Mijn Word-document staat in OneDrive. Hoe controleer ik de koppen?',
                'Ik heb 3 slides in PowerPoint. Wat moet ik nu doen?',
                'Hoe lever ik mijn bestanden precies in bij Magister?',
                'Ik loop vast in de app. Geef me een hint voor de volgende stap.'
            ];
        }

        if (week === 2) {
            return [
                'Wat is een goede prompt en waarom?',
                'Ik loop vast bij de Game Programmeur missie, eerste stap?',
                'Hoe train ik de AI Trainer opdracht goed?',
                'Kun je mijn chatbot-tip verbeteren zonder antwoord te geven?',
                'Geef 1 hint voor de review-opdracht.'
            ];
        }

        if (week === 3) {
            return [
                'Hoe herken ik een deepfake stap voor stap?',
                'Welke signalen wijzen op nepnieuws?',
                'Help me met de Data Detective opdracht.',
                'Hoe check ik een bron betrouwbaar?',
                'Geef 1 hint zonder het hele antwoord.'
            ];
        }

        if (week === 4) {
            return [
                'Hoe maak ik een goede projectplanning?',
                'Help me mijn pitch duidelijk op te bouwen.',
                'Welke onderdelen moeten in mijn eindproduct?',
                'Hoe combineer ik beeld en tekst slim?',
                'Geef feedback op mijn aanpak in 3 punten.'
            ];
        }

        return [
            'Ik loop vast bij mijn opdracht, wat is mijn eerste stap?',
            'Leg uit wat ik nu moet doen in 1 korte stap.',
            'Geef een hint zonder het antwoord weg te geven.',
            'Hoe controleer ik of ik het goed heb gedaan?',
            'Help me focussen: wat is nu het belangrijkste?'
        ];
    };

    const quickPrompts = getQuickPrompts();
    const quickPromptLabel = getQuickPromptLabel();

    const {
        messages,
        input,
        setInput,
        handleSend,
        isLoading,
        isLocked,
        isOpen: internalIsOpen,
        setIsOpen: setInternalIsOpen
    } = useStudentAssistant({ userIdentifier, context });

    // Resolve controlled vs internal state
    const isVisible = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsVisible = onOpenChange || setInternalIsOpen;

    // We need to sync with the hook if using controlled state, but the hook manages its own state. 
    // To minimize refactoring the hook, we'll just rely on the prop for rendering visibility if provided.
    // However, the hook's returned 'setIsOpen' might be needed for internal close buttons.

    const handleClose = () => {
        setIsVisible(false);
        setInternalIsOpen(false); // Sync hook state
    };

    const handleOpen = () => {
        setIsVisible(true);
        setInternalIsOpen(true); // Sync hook state
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (isVisible) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isVisible]);

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!userIdentifier) return null;

    return (
        <>
            {/* Floating Action Button */}
            {!isVisible && (
                <button
                    onClick={handleOpen}
                    className="fixed bottom-6 right-6 p-4 min-w-[56px] min-h-[56px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform z-50 flex items-center justify-center gap-2"
                    title="Vraag de AI-buddy om hulp"
                >
                    <Bot size={28} />
                    <span className="font-bold text-sm hidden sm:inline">AI Hulp</span>
                    {isLocked && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isVisible && (
                <div className="fixed bottom-6 right-6 w-[90vw] max-w-[384px] h-[70vh] max-h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
                    {/* Header */}
                    <div className={`p-4 ${isLocked ? 'bg-red-50' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm text-white">
                                {isLocked ? <Lock size={20} className="text-red-500" /> : <Bot size={20} />}
                            </div>
                            <div>
                                <h3 className={`font-bold ${isLocked ? 'text-red-600' : 'text-white'}`}>
                                    {isLocked ? 'Geblokkeerd' : 'AI Buddy'}
                                </h3>
                                {!isLocked && <p className="text-xs text-white/90">Altijd klaar om te helpen!</p>}
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className={`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/20 transition-colors ${isLocked ? 'text-red-400 hover:text-red-600' : 'text-white'}`}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {/* AI Disclaimer Banner */}
                        {messages.length === 0 && (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                                <span className="font-bold">⚡ AI Buddy</span> is een AI-assistent. Antwoorden zijn
                                gegenereerd en kunnen fouten bevatten. Bij twijfel, vraag je docent!
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                                        max-w-[85%] p-3 rounded-2xl text-sm shadow-sm
                                        ${msg.role === 'user'
                                            ? 'bg-emerald-600 text-white rounded-tr-none'
                                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                                        }
                                    `}
                                >
                                    {msg.role === 'model' ? (
                                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                                            <MarkdownRenderer>{msg.text}</MarkdownRenderer>
                                            <AiDisclosureBadge compact className="mt-2" />
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                    <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-100" />
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-200" />
                                </div>
                            </div>
                        )}

                        {!isLocked && messages.length <= 1 && (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                                <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest mb-2">
                                    {quickPromptLabel}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {quickPrompts.map((prompt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSend(prompt)}
                                            className="text-left px-3 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100 keyboard-safe">
                        {isLocked ? (
                            <div className="text-center p-3 text-red-500 text-sm bg-red-50 rounded-lg border border-red-100">
                                <Lock size={20} className="mx-auto mb-2" />
                                <span className="font-bold">Chat geblokkeerd</span>
                                <p className="text-xs mt-1">Misbruik gedetecteerd. Melding verstuurd naar docent.</p>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Stel je vraag..."
                                    className="flex-1 p-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    className="p-3 min-w-[48px] min-h-[48px] bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
