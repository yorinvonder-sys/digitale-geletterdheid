import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Data ─── */

interface GameVisualState {
    playerColor: string;
    skyFrom: string;
    skyTo: string;
    playerJump: boolean;
    showSound: boolean;
}

interface DemoStep {
    studentMessage: string;
    aiResponse: string;
    gameState: GameVisualState;
    label: string;
    accentClass: string;
}

const BASE_GAME: GameVisualState = {
    playerColor: '#e53935',
    skyFrom: '#64b5f6',
    skyTo: '#e1f5fe',
    playerJump: false,
    showSound: false,
};

const STEPS: DemoStep[] = [
    {
        studentMessage: 'Maak de speler groen',
        aiResponse: 'De speler is nu groen! Probeer ook eens de achtergrond aan te passen.',
        gameState: { ...BASE_GAME, playerColor: '#10B981' },
        label: 'Kleur',
        accentClass: 'border-emerald-400 bg-emerald-50 text-emerald-700',
    },
    {
        studentMessage: 'Maak het springen hoger',
        aiResponse: 'De jumpForce is verhoogd! Je speler springt nu veel hoger.',
        gameState: { ...BASE_GAME, playerColor: '#10B981', playerJump: true },
        label: 'Fysica',
        accentClass: 'border-blue-400 bg-blue-50 text-blue-700',
    },
    {
        studentMessage: 'Voeg een springgeluid toe',
        aiResponse: 'Er zit nu een geluid bij elke sprong!',
        gameState: { ...BASE_GAME, playerColor: '#10B981', playerJump: true, showSound: true },
        label: 'Geluid',
        accentClass: 'border-amber-400 bg-amber-50 text-amber-700',
    },
];

const STEP_DURATION = 7000;

type Phase = 'student-typing' | 'student-message' | 'ai-typing' | 'ai-message' | 'game-update';

const PHASE_TIMINGS: Record<Phase, number> = {
    'student-typing': 0,
    'student-message': 900,
    'ai-typing': 2000,
    'ai-message': 3000,
    'game-update': 3600,
};

/* ─── Sub-components ─── */

function TypingDots() {
    return (
        <span className="inline-flex gap-1 items-center px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-typing-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-typing-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-typing-bounce [animation-delay:0.4s]" />
        </span>
    );
}

function ChatBubble({ text, isStudent, visible }: { text: string; isStudent: boolean; visible: boolean }) {
    return (
        <div
            className={`flex ${isStudent ? 'justify-end' : 'justify-start'} transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        >
            {!isStudent && (
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 8V4H8" /><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M7 15h0M17 15h0" />
                    </svg>
                </div>
            )}
            <div
                className={`max-w-[80%] px-3.5 py-2 text-sm leading-relaxed ${
                    isStudent
                        ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
                        : 'bg-slate-800 text-slate-200 rounded-2xl rounded-bl-sm'
                }`}
            >
                {text}
            </div>
        </div>
    );
}

function GameIllustration({ state }: { state: GameVisualState }) {
    return (
        <svg
            viewBox="0 0 480 320"
            className="w-full h-full rounded-2xl overflow-hidden"
            aria-hidden="true"
            style={{ background: `linear-gradient(to bottom, ${state.skyFrom}, ${state.skyTo})` }}
        >
            <defs>
                <linearGradient id="gd-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: state.skyFrom, transition: 'stop-color 0.8s ease' }} />
                    <stop offset="100%" style={{ stopColor: state.skyTo, transition: 'stop-color 0.8s ease' }} />
                </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="480" height="320" fill="url(#gd-sky)" />

            {/* Clouds */}
            <g opacity="0.6">
                <ellipse cx="80" cy="60" rx="40" ry="14" fill="white">
                    <animateTransform attributeName="transform" type="translate" values="0,0;8,0;0,0" dur="8s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="100" cy="54" rx="28" ry="10" fill="white">
                    <animateTransform attributeName="transform" type="translate" values="0,0;8,0;0,0" dur="8s" repeatCount="indefinite" />
                </ellipse>
            </g>
            <g opacity="0.4">
                <ellipse cx="350" cy="45" rx="35" ry="12" fill="white">
                    <animateTransform attributeName="transform" type="translate" values="0,0;-6,0;0,0" dur="10s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="370" cy="40" rx="24" ry="8" fill="white">
                    <animateTransform attributeName="transform" type="translate" values="0,0;-6,0;0,0" dur="10s" repeatCount="indefinite" />
                </ellipse>
            </g>

            {/* Score badge */}
            <rect x="370" y="20" width="90" height="28" rx="6" fill="rgba(0,0,0,0.35)" />
            <text x="415" y="39" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white" fontFamily="monospace">SCORE: 120</text>

            {/* Ground — grass + dirt */}
            <rect x="0" y="260" width="480" height="20" fill="#66bb6a" />
            <rect x="0" y="272" width="480" height="48" fill="#8d6e63" />
            {/* Grass blades */}
            {[20, 55, 95, 130, 180, 220, 270, 310, 360, 400, 440].map(x => (
                <line key={x} x1={x} y1="260" x2={x - 3} y2="252" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" />
            ))}

            {/* Obstacle — pipe */}
            <g>
                <rect x="330" y="190" width="36" height="70" rx="3" fill="#43a047" />
                <rect x="326" y="186" width="44" height="14" rx="4" fill="#388e3c" />
                <rect x="336" y="198" width="6" height="58" fill="#66bb6a" opacity="0.4" />
            </g>

            {/* Player */}
            <g style={{
                transform: state.playerJump ? 'translateY(-55px)' : 'translateY(0px)',
                transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
                {/* Body */}
                <rect x="90" y="216" width="32" height="40" rx="6" style={{ fill: state.playerColor, transition: 'fill 0.8s ease' }} />
                {/* Head */}
                <rect x="94" y="196" width="24" height="24" rx="12" style={{ fill: state.playerColor, transition: 'fill 0.8s ease' }} />
                {/* Hat */}
                <rect x="88" y="192" width="30" height="8" rx="3" fill="#1a1a2e" />
                <rect x="96" y="185" width="16" height="10" rx="3" fill="#1a1a2e" />
                {/* Eyes */}
                <circle cx="103" cy="206" r="2.5" fill="white" />
                <circle cx="112" cy="206" r="2.5" fill="white" />
                <circle cx="104" cy="206" r="1.2" fill="#1a1a2e" />
                <circle cx="113" cy="206" r="1.2" fill="#1a1a2e" />

                {/* Sound waves */}
                {state.showSound && (
                    <g>
                        <circle cx="130" cy="220" r="8" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.7">
                            <animate attributeName="r" values="8;22" dur="1.2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0" dur="1.2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="130" cy="220" r="8" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5">
                            <animate attributeName="r" values="8;22" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                        </circle>
                        {/* Speaker icon */}
                        <path d="M128 214 l-4 3h-3v6h3l4 3z" fill="#f59e0b" />
                    </g>
                )}
            </g>

            {/* Second obstacle */}
            <g>
                <rect x="210" y="220" width="30" height="40" rx="3" fill="#43a047" />
                <rect x="206" y="216" width="38" height="12" rx="4" fill="#388e3c" />
                <rect x="216" y="228" width="5" height="28" fill="#66bb6a" opacity="0.4" />
            </g>
        </svg>
    );
}

/* ─── Step navigation icons (inline SVG) ─── */

const StepIcons = [
    // Palette icon
    <svg key="palette" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="13.5" cy="6.5" r="2.5"/><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><circle cx="19.5" cy="17.5" r="2.5"/><path d="M15.59 20.41 19.5 17.5"/>
    </svg>,
    // Rocket icon
    <svg key="rocket" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>,
    // Volume icon
    <svg key="volume" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>,
];

/* ─── Main component ─── */

export function ScholenLandingGameDemo() {
    const [activeStep, setActiveStep] = useState(0);
    const [phase, setPhase] = useState<Phase>('student-typing');
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const clearTimers = useCallback(() => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    }, []);

    // Kick off phase timeline for current step
    useEffect(() => {
        if (isPaused) return;
        clearTimers();

        const phases: Phase[] = ['student-typing', 'student-message', 'ai-typing', 'ai-message', 'game-update'];
        phases.forEach(p => {
            const t = setTimeout(() => setPhase(p), PHASE_TIMINGS[p]);
            timerRef.current.push(t);
        });

        // Advance to next step
        const advance = setTimeout(() => {
            setActiveStep(prev => (prev + 1) % STEPS.length);
        }, STEP_DURATION);
        timerRef.current.push(advance);

        return clearTimers;
    }, [activeStep, isPaused, clearTimers]);

    // Reset phase when step changes
    useEffect(() => {
        setPhase('student-typing');
    }, [activeStep]);

    const step = STEPS[activeStep];
    const phaseIndex = (p: Phase) => ['student-typing', 'student-message', 'ai-typing', 'ai-message', 'game-update'].indexOf(p);
    const currentPhaseIdx = phaseIndex(phase);

    // Build visible messages: all previous steps + current step messages (based on phase)
    const visibleMessages: { text: string; isStudent: boolean; visible: boolean }[] = [];
    for (let i = 0; i < activeStep; i++) {
        visibleMessages.push({ text: STEPS[i].studentMessage, isStudent: true, visible: true });
        visibleMessages.push({ text: STEPS[i].aiResponse, isStudent: false, visible: true });
    }

    const goToStep = (idx: number) => {
        clearTimers();
        setActiveStep(idx);
        setPhase('student-typing');
    };

    // Determine game state: accumulate all completed steps + current if game-update reached
    const gameState: GameVisualState = currentPhaseIdx >= phaseIndex('game-update')
        ? step.gameState
        : activeStep > 0
            ? STEPS[activeStep - 1].gameState
            : BASE_GAME;

    return (
        <div className="max-w-6xl mx-auto" ref={containerRef}>
            {/* Header */}
            <div className="text-center mb-12">
                <p className="text-emerald-600 font-semibold text-sm mb-3 tracking-wide">Bekijk het in actie</p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                    Leerlingen bouwen hun eigen game
                </h2>
                <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
                    Met de AI-mentor passen leerlingen stap voor stap een echte game aan.
                    Elke chat-opdracht verandert direct het resultaat.
                </p>
            </div>

            {/* Demo area */}
            <div
                className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Chat panel */}
                <div className="lg:col-span-2 bg-slate-900 flex flex-col min-h-[360px] lg:min-h-[420px] order-2 lg:order-1">
                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">Game Programmeur</p>
                            <p className="text-slate-500 text-xs">AI-mentor</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden flex flex-col justify-end" role="list" aria-label="Chat berichten">
                        {visibleMessages.map((msg, i) => (
                            <div key={i} role="listitem">
                                <ChatBubble text={msg.text} isStudent={msg.isStudent} visible={msg.visible} />
                            </div>
                        ))}

                        {/* Current step: student typing */}
                        {currentPhaseIdx === phaseIndex('student-typing') && (
                            <div className="flex justify-end" role="listitem">
                                <div className="bg-indigo-600/60 rounded-2xl rounded-br-sm">
                                    <TypingDots />
                                </div>
                            </div>
                        )}

                        {/* Current step: student message */}
                        {currentPhaseIdx >= phaseIndex('student-message') && (
                            <div role="listitem">
                                <ChatBubble
                                    text={step.studentMessage}
                                    isStudent={true}
                                    visible={currentPhaseIdx >= phaseIndex('student-message')}
                                />
                            </div>
                        )}

                        {/* Current step: AI typing */}
                        {currentPhaseIdx === phaseIndex('ai-typing') && (
                            <div className="flex justify-start" role="listitem">
                                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M12 8V4H8" /><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M7 15h0M17 15h0" />
                                    </svg>
                                </div>
                                <div className="bg-slate-800/60 rounded-2xl rounded-bl-sm">
                                    <TypingDots />
                                </div>
                            </div>
                        )}

                        {/* Current step: AI message */}
                        {currentPhaseIdx >= phaseIndex('ai-message') && (
                            <div role="listitem">
                                <ChatBubble
                                    text={step.aiResponse}
                                    isStudent={false}
                                    visible={currentPhaseIdx >= phaseIndex('ai-message')}
                                />
                            </div>
                        )}
                    </div>

                    {/* Fake input bar */}
                    <div className="px-4 pb-4">
                        <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2.5">
                            <span className="text-slate-500 text-sm flex-1 truncate">Typ een bericht...</span>
                            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center opacity-50">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Game illustration */}
                <div className="lg:col-span-3 relative order-1 lg:order-2">
                    <GameIllustration state={gameState} />

                    {/* Pause/play overlay */}
                    {isPaused && (
                        <button
                            onClick={() => setIsPaused(false)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                            aria-label="Animatie hervatten"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Step navigation */}
            <div className="flex items-center justify-center gap-3 mt-6" role="tablist" aria-label="Demo stappen">
                {STEPS.map((s, i) => (
                    <button
                        key={s.label}
                        role="tab"
                        aria-selected={i === activeStep}
                        aria-label={`Stap ${i + 1}: ${s.label}`}
                        onClick={() => goToStep(i)}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                            i === activeStep
                                ? s.accentClass
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                        }`}
                    >
                        {StepIcons[i]}
                        {s.label}

                        {/* Progress bar on active step */}
                        {i === activeStep && !isPaused && (
                            <span
                                className="absolute bottom-0 left-0 h-0.5 bg-current rounded-full animate-carousel-progress"
                                style={{ animationDuration: `${STEP_DURATION}ms` }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
