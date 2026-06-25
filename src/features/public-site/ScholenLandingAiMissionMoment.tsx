import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/* ═══════════════════════════════════════════════════════════
   SCRIPT — verbatim, do not alter text
   ═══════════════════════════════════════════════════════════ */

const SCRIPT = [
    { from: 'student', text: 'maak een kaart voor opa' },
    { from: 'ai', text: 'Goed begin! Maar dit is nog vaag. Voor welke gelegenheid, welke stijl, welke tekst? Hoe specifieker je prompt, hoe beter de AI je begrijpt.' },
    { from: 'student', text: 'Maak een verjaardagskaart voor mijn opa van 70, met een tekening van een zeilboot en de tekst: Fijne verjaardag, kapitein!' },
    { from: 'ai', text: 'Precies! Nu weet de AI de gelegenheid, de stijl én de tekst. Dát is het verschil tussen een vage en een sterke prompt.' },
] as const;

/* ═══════════════════════════════════════════════════════════
   ICONS — inline SVG, no external deps
   ═══════════════════════════════════════════════════════════ */

function SparkleIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M8 1.5L9.3 5.7L13.5 7L9.3 8.3L8 12.5L6.7 8.3L2.5 7L6.7 5.7L8 1.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M12.5 1L13.15 2.85L15 3.5L13.15 4.15L12.5 6L11.85 4.15L10 3.5L11.85 2.85L12.5 1Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M3 8.5L6.5 12L13 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function SendIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M13 8L3 13L5.5 8L3 3L13 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════
   TYPING INDICATOR
   ═══════════════════════════════════════════════════════════ */

function TypingDots({ side }: { side: 'student' | 'ai' }) {
    const isStudent = side === 'student';
    const dotClass = isStudent ? 'bg-duck-ink/50' : 'bg-white/50';

    return (
        <div className={`flex ${isStudent ? 'justify-end' : 'items-end gap-2'}`}>
            {!isStudent && (
                <div className="size-7 flex-shrink-0 rounded-full bg-white/10 grid place-items-center">
                    <SparkleIcon className="size-3.5 text-white/70" />
                </div>
            )}
            <div className={`flex items-center gap-1 px-3.5 py-3 rounded-2xl ${isStudent ? 'bg-duck-acid rounded-br-sm' : 'bg-white/10 rounded-bl-sm'}`}>
                <span className={`size-1.5 rounded-full ${dotClass} animate-typing-bounce`} style={{ animationDelay: '0ms' }} />
                <span className={`size-1.5 rounded-full ${dotClass} animate-typing-bounce`} style={{ animationDelay: '200ms' }} />
                <span className={`size-1.5 rounded-full ${dotClass} animate-typing-bounce`} style={{ animationDelay: '400ms' }} />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   CHAT BUBBLE
   ═══════════════════════════════════════════════════════════ */

interface BubbleProps {
    from: 'student' | 'ai';
    text: string;
    visible: boolean;
}

function ChatBubble({ from, text, visible }: BubbleProps) {
    const isStudent = from === 'student';

    return (
        <li
            className={`flex ${isStudent ? 'justify-end' : 'items-end gap-2'} transition-all duration-[400ms] ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
        >
            {!isStudent && (
                <div className="size-7 flex-shrink-0 rounded-full bg-white/10 grid place-items-center">
                    <SparkleIcon className="size-3.5 text-white/70" />
                </div>
            )}
            <div
                className={`px-3.5 py-2 text-sm leading-relaxed max-w-[82%] ${
                    isStudent
                        ? 'bg-duck-acid text-duck-ink rounded-2xl rounded-br-sm'
                        : 'bg-white/10 text-white rounded-2xl rounded-bl-sm'
                }`}
            >
                {text}
            </div>
        </li>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export const ScholenLandingAiMissionMoment: React.FC = () => {
    const reduceMotion = usePrefersReducedMotion();

    // How many messages are fully visible (0..SCRIPT.length)
    const [revealed, setRevealed] = useState<number>(reduceMotion ? SCRIPT.length : 0);
    // Which side is currently typing (null = no typing indicator shown)
    const [typingSide, setTypingSide] = useState<'student' | 'ai' | null>(null);

    const cardRef = useRef<HTMLDivElement>(null);
    const hasStarted = useRef(false);
    const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        // If reduced motion, show everything statically immediately — no timers
        if (reduceMotion) {
            setRevealed(SCRIPT.length);
            setTypingSide(null);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted.current) {
                    hasStarted.current = true;
                    observer.disconnect();
                    playSequence();
                }
            },
            { threshold: 0.25 },
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            observer.disconnect();
            // Clear all pending timers on unmount — prevents setState-after-unmount
            timerIds.current.forEach(clearTimeout);
            timerIds.current = [];
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reduceMotion]);

    function playSequence() {
        // Build the timed chain without any loops — runs once, left visible at end
        let offset = 0;

        SCRIPT.forEach((entry, i) => {
            const typingDuration = entry.from === 'student' ? 700 : 1300;
            const pauseAfter = 600;

            // Show typing indicator for this message
            const t1 = setTimeout(() => {
                setTypingSide(entry.from as 'student' | 'ai');
            }, offset);
            timerIds.current.push(t1);

            offset += typingDuration;

            // Reveal message, hide typing indicator
            const t2 = setTimeout(() => {
                setTypingSide(null);
                setRevealed(i + 1);
            }, offset);
            timerIds.current.push(t2);

            offset += pauseAfter;
        });
    }

    const showCompletion = revealed === SCRIPT.length;

    return (
        <div>
            {/* Chat card */}
            <div
                ref={cardRef}
                className="rounded-[1.5rem] bg-duck-ink overflow-hidden shadow-duck-soft flex flex-col min-h-[420px]"
            >
                {/* Header bar */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                    <div className="size-9 rounded-xl bg-duck-acid grid place-items-center flex-shrink-0">
                        <SparkleIcon className="size-4 text-duck-ink" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-sm font-extrabold">Prompt Perfectionist</p>
                        <p className="text-white/55 text-xs">AI-coach in een missie</p>
                    </div>
                    {/* Live dot */}
                    <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                        <span className="size-2 rounded-full bg-duck-acid" aria-hidden="true" />
                        <span className="text-duck-acid text-[10px] font-extrabold tracking-wide">DEMO</span>
                    </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 px-5 py-5 flex flex-col justify-end">
                    <ul className="space-y-3 flex flex-col" role="list">
                        {SCRIPT.map((entry, i) => (
                            <ChatBubble
                                key={i}
                                from={entry.from}
                                text={entry.text}
                                visible={i < revealed}
                            />
                        ))}

                        {/* Typing indicator — shown while next message is being "typed" */}
                        {typingSide && <TypingDots side={typingSide} />}

                        {/* Completion chip */}
                        {showCompletion && (
                            <li className="flex justify-center pt-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-duck-acid px-3 py-1 text-[11px] font-extrabold text-duck-ink">
                                    <CheckIcon className="size-3 text-duck-ink" />
                                    Missie: Prompt Perfectionist voltooid
                                </span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Faux input bar */}
                <div className="px-5 pb-5">
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5">
                        <span className="text-white/40 text-sm flex-1">Typ je prompt…</span>
                        <div className="size-7 rounded-lg bg-duck-acid grid place-items-center flex-shrink-0" aria-hidden="true">
                            <SendIcon className="size-3.5 text-duck-ink" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Honest caption below the card */}
            <p className="mt-3 text-xs font-semibold text-duck-ink/55">
                Geanimeerd voorbeeld — zo coacht de AI een leerling binnen een missie.
            </p>
        </div>
    );
};
