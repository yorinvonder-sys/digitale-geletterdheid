import React, { useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Lock } from 'lucide-react';
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
            {/* Floating Pip Button */}
            {!isVisible && (
                <button
                    onClick={handleOpen}
                    className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 group z-[70] flex items-center gap-0"
                    title="Vraag Pip om hulp"
                >
                    {/* Speech bubble — appears on hover */}
                    <span className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap mr-2" style={{ backgroundColor: '#FFFFFF', color: '#3D3D38', borderWidth: 1, borderColor: '#E8E6DF' }}>
                        Hulp nodig? Vraag het mij!
                    </span>
                    {/* Pip avatar */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#D97757' }}>
                        <img src="/mascot/pip-headset.webp" alt="Pip — je AI-hulpje" className="w-11 h-11 sm:w-12 sm:h-12 object-contain" draggable={false} loading="lazy" />
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none" style={{ borderWidth: 2, borderColor: '#D97757' }} />
                    </div>
                    {isLocked && (
                        <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white z-10" />
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isVisible && (
                <div className="fixed bottom-20 sm:bottom-6 right-2 sm:right-6 w-[94vw] sm:w-[90vw] max-w-[384px] h-[60vh] sm:h-[70vh] max-h-[500px] rounded-2xl shadow-2xl flex flex-col z-[70] overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300" style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E6DF' }}>
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between" style={{ background: isLocked ? '#FEF2F2' : 'linear-gradient(to right, #D97757, #C46849)' }}>
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white rounded-full overflow-hidden">
                                {isLocked ? <Lock size={20} className="text-red-500" /> : <img src="/mascot/pip-headset.webp" alt="Pip" className="w-8 h-8 object-contain" loading="lazy" />}
                            </div>
                            <div>
                                <h3 className={`font-bold ${isLocked ? 'text-red-600' : 'text-white'}`} style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                    {isLocked ? 'Geblokkeerd' : 'Pip'}
                                </h3>
                                {!isLocked && <p className="text-xs text-white/90">Je persoonlijke AI-hulpje</p>}
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className={`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-300 ${isLocked ? 'text-red-400 hover:text-red-600' : 'text-white'}`}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#FAF9F0' }}>
                        {/* AI Disclaimer Banner */}
                        {messages.length === 0 && (
                            <div className="rounded-xl p-3 text-xs" style={{ backgroundColor: '#D97757' + '10', borderWidth: 1, borderColor: '#D97757' + '25', color: '#C46849' }}>
                                <span className="font-bold">Pip</span> is een AI-assistent. Antwoorden zijn
                                gegenereerd en kunnen fouten bevatten. Bij twijfel, vraag je docent!
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className="max-w-[85%] p-3 rounded-2xl text-sm shadow-sm"
                                    style={msg.role === 'user'
                                        ? { backgroundColor: '#D97757', color: '#FFFFFF', borderTopRightRadius: 0 }
                                        : { backgroundColor: '#FFFFFF', color: '#3D3D38', borderWidth: 1, borderColor: '#E8E6DF', borderTopLeftRadius: 0 }
                                    }
                                >
                                    {msg.role === 'model' ? (
                                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                                            <MarkdownRenderer>{msg.text}</MarkdownRenderer>
                                            <AiDisclosureBadge compact className="mt-2" />
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                    <div className="text-[10px] mt-1" style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#6B6B66' }}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2" style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E6DF' }}>
                                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#D97757' }} />
                                    <div className="w-2 h-2 rounded-full animate-pulse delay-100" style={{ backgroundColor: '#D97757' }} />
                                    <div className="w-2 h-2 rounded-full animate-pulse delay-200" style={{ backgroundColor: '#D97757' }} />
                                </div>
                            </div>
                        )}

                        {!isLocked && messages.length <= 1 && (
                            <div className="rounded-2xl p-3" style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E6DF' }}>
                                <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#D97757' }}>
                                    {quickPromptLabel}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {quickPrompts.map((prompt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSend(prompt)}
                                            className="text-left px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300"
                                            style={{ backgroundColor: '#FAF9F0', borderWidth: 1, borderColor: '#E8E6DF', color: '#3D3D38' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D97757'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = '#D97757'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FAF9F0'; e.currentTarget.style.color = '#3D3D38'; e.currentTarget.style.borderColor = '#E8E6DF'; }}
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
                    <div className="p-3 keyboard-safe" style={{ backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E8E6DF' }}>
                        {isLocked ? (
                            <div className="text-center p-3 text-red-500 text-sm bg-red-50 rounded-2xl border border-red-100">
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
                                    className="flex-1 p-2 border-none rounded-full focus:ring-2 focus:outline-none text-sm"
                                    style={{ backgroundColor: '#FAF9F0', color: '#3D3D38' }}
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    className="p-3 min-w-[48px] min-h-[48px] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                                    style={{ backgroundColor: '#D97757' }}
                                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#C46849'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D97757'; }}
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
