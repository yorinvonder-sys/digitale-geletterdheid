import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EDGE_FUNCTION_URL } from '@/services/supabase';
import { DuckMark } from '@/components/brand/DuckMark';
import { specToPromptJson, stripGameStateBlock } from '@/features/public-site/game-lab/gameSpec';
import type { GameSpec } from '@/features/public-site/game-lab/gameSpec';

/**
 * Chatpaneel van het AI Game Lab.
 *
 * Praat anoniem met de `demo-chat` edge function. De teller volgt het
 * `remaining`-veld uit de response: de server is de waarheid, de client telt
 * alleen zelf af als dat veld ontbreekt.
 */

type ErrorKind = 'blocked' | 'network' | 'server';

interface ChatMessage {
    role: 'user' | 'assistant';
    text: string;
}

export interface GameLabChatProps {
    currentSpec: GameSpec;
    onAssistantText: (rawText: string) => void;
    maxMessages?: number;
}

const OPENING_MESSAGE =
    'Hoi! Ik ben je AI game-mentor. Vertel wat je wilt veranderen — een ander thema, een ander karakter, meer obstakels of een nieuw doel — en ik bouw het meteen om.';

const SUGGESTIONS = [
    'Maak er een ruimtegame van',
    'Jungle met een draak',
    'Voeg munten toe en spring hoger',
    'Maak het moeilijker',
    'Winnen door 10 sterren te pakken',
];

export const GameLabChat: React.FC<GameLabChatProps> = ({ currentSpec, onAssistantText, maxMessages = 10 }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: OPENING_MESSAGE }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [remaining, setRemaining] = useState(maxMessages);
    const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [limitReason, setLimitReason] = useState<string | null>(null);

    const lastSentRef = useRef<string | null>(null);
    const logRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const specRef = useRef(currentSpec);

    useEffect(() => { specRef.current = currentSpec; }, [currentSpec]);

    const isLocked = remaining <= 0;

    useEffect(() => {
        const el = logRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, isLoading]);

    const send = useCallback(async (text: string, isRetry: boolean) => {
        setErrorKind(null);
        setErrorText(null);
        setIsLoading(true);
        lastSentRef.current = text;

        if (!isRetry) {
            setMessages((prev) => [...prev, { role: 'user', text }]);
        }

        // De historie draagt de gestripte tekst; het ruwe GAME_STATE-blok zou
        // het server-budget van 2000 tekens opblazen. De actuele spec gaat
        // daarom apart mee als `spec`.
        const history = messages
            .slice(1)
            .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] }));

        try {
            const response = await fetch(`${EDGE_FUNCTION_URL}/demo-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history,
                    spec: JSON.parse(specToPromptJson(specRef.current)),
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (typeof data.remaining === 'number') {
                setRemaining(Math.max(0, data.remaining));
            }

            if (!response.ok) {
                if (data.error === 'demo_limit') {
                    setRemaining(0);
                    setLimitReason(typeof data.reason === 'string' ? data.reason : null);
                } else if (data.error === 'blocked') {
                    setErrorKind('blocked');
                    setErrorText(typeof data.reason === 'string' ? data.reason : 'Dit bericht kon ik niet verwerken.');
                    // De limiter draait vóór de sanitizer, dus deze poging is
                    // echt verbruikt. Alleen zelf aftellen als de server geen
                    // teller meestuurde.
                    if (typeof data.remaining !== 'number') {
                        setRemaining((prev) => Math.max(0, prev - 1));
                    }
                } else {
                    setErrorKind('server');
                    setErrorText('De AI is even niet bereikbaar. Probeer het zo nog eens.');
                }
                return;
            }

            const raw = typeof data.text === 'string' ? data.text : '';
            // De ouder leest de spec uit het ruwe antwoord; de bezoeker ziet
            // alleen het proza, nooit het GAME_STATE-blok.
            onAssistantText(raw);
            setMessages((prev) => [...prev, { role: 'assistant', text: stripGameStateBlock(raw) }]);
            if (typeof data.remaining !== 'number') {
                setRemaining((prev) => Math.max(0, prev - 1));
            }
        } catch {
            setErrorKind('network');
            setErrorText('Verbinding mislukt. Controleer je internet.');
        } finally {
            setIsLoading(false);
        }
    }, [messages, onAssistantText]);

    const handleSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isLoading || isLocked) return;
        setInput('');
        void send(trimmed, false);
    }, [input, isLoading, isLocked, send]);

    const retry = useCallback(() => {
        const text = lastSentRef.current;
        if (!text || isLoading) return;
        void send(text, true);
    }, [isLoading, send]);

    return (
        <div className="flex min-h-[420px] flex-col overflow-hidden rounded-[1.25rem] border border-white/15 bg-white/[0.04]">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-duck-acid">
                    <DuckMark className="size-5" />
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-extrabold text-white">AI game-mentor</p>
                    <p className="text-xs font-semibold text-white/55">Draait op Mistral AI</p>
                </div>
                <span
                    className={`ml-auto shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${
                        isLocked ? 'bg-white/10 text-white/60' : 'bg-duck-acid text-duck-ink'
                    }`}
                >
                    {isLocked ? 'Demo klaar' : `${remaining} van ${maxMessages}`}
                </span>
            </div>

            <div
                ref={logRef}
                role="log"
                aria-label="Gesprek met de AI game-mentor"
                aria-live="polite"
                aria-relevant="additions"
                aria-busy={isLoading}
                className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <p
                            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm font-semibold leading-6 ${
                                message.role === 'user'
                                    ? 'rounded-br-sm bg-duck-acid text-duck-ink'
                                    : 'rounded-bl-sm bg-white/10 text-white/85'
                            }`}
                        >
                            {message.text}
                        </p>
                    </div>
                ))}

                {isLoading && (
                    <p className="text-xs font-semibold text-white/55">De mentor bouwt je game om…</p>
                )}

                {errorText && (
                    <div className="rounded-xl border border-duck-error/40 bg-duck-error/10 px-3 py-2">
                        <p className="text-xs font-semibold text-white/85">{errorText}</p>
                        {(errorKind === 'network' || errorKind === 'server') && (
                            <button
                                type="button"
                                onClick={retry}
                                className="mt-2 inline-flex min-h-[36px] items-center rounded-full border border-white/30 px-3 text-xs font-extrabold text-white transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid"
                            >
                                Probeer opnieuw
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="border-t border-white/10 px-4 py-4">
                {isLocked ? (
                    <div className="space-y-3 text-center">
                        <p className="text-sm font-semibold text-white/70">
                            {limitReason ?? `Je hebt je ${maxMessages} prompts gebruikt. Je game blijft gewoon speelbaar!`}
                        </p>
                        <a
                            href="/pilot"
                            className="inline-flex min-h-[48px] items-center rounded-full border border-duck-ink bg-duck-acid px-6 py-2.5 text-sm font-extrabold text-duck-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                        >
                            Schoolpilot aanvragen
                        </a>
                    </div>
                ) : (
                    <>
                        {messages.length <= 2 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                {SUGGESTIONS.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => {
                                            setInput(suggestion);
                                            inputRef.current?.focus();
                                        }}
                                        className="inline-flex min-h-[44px] items-center rounded-full border border-white/25 px-4 text-xs font-extrabold text-white/75 transition-colors hover:border-duck-acid hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-xl border border-white/15 bg-duck-ink px-3 py-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                placeholder="Beschrijf je game…"
                                maxLength={500}
                                disabled={isLoading}
                                aria-label="Vertel wat er aan je game moet veranderen"
                                className="min-h-[44px] flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/40 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="inline-flex size-11 items-center justify-center rounded-lg bg-duck-acid text-duck-ink transition-opacity disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                                aria-label="Verstuur prompt"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
                                </svg>
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
