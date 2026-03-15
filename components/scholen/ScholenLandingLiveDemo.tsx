import React, { useState, useRef, useCallback, useEffect } from 'react';
import { EDGE_FUNCTION_URL } from '../../services/supabase';

/* ═══════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════ */

interface GameState {
    sky: string;
    ground: string;
    character: string;
    characterType: 'robot' | 'astronaut' | 'kat' | 'draak' | 'ninja' | 'eenhoorn';
    obstacles: number;
    clouds: boolean;
    stars: boolean;
    speed: 'slow' | 'normal' | 'fast';
    theme: string;
}

interface ChatMessage {
    role: 'user' | 'assistant';
    text: string;
}

const DEFAULT_GAME_STATE: GameState = {
    sky: '#1a1a2e',
    ground: '#16a34a',
    character: '#f59e0b',
    characterType: 'robot',
    obstacles: 2,
    clouds: true,
    stars: false,
    speed: 'normal',
    theme: 'Standaard',
};

const MAX_MESSAGES = 5;

const SERIF = "'Newsreader', Georgia, serif";

const C = {
    accent: '#D97757',
    accentHover: '#C46849',
    text: '#1A1A19',
    textMuted: '#6B6B66',
    textLight: '#9C9C95',
    border: '#E8E6DF',
    bg: '#FAF9F0',
} as const;

/* ═══════════════════════════════════════════════════════════
   GAME STATE PARSER
   ═══════════════════════════════════════════════════════════ */

function parseGameState(text: string, current: GameState): GameState {
    const match = text.match(/<GAME_STATE>\s*([\s\S]*?)\s*<\/GAME_STATE>/);
    if (!match) return current;

    try {
        const parsed = JSON.parse(match[1]);
        return {
            sky: typeof parsed.sky === 'string' ? parsed.sky : current.sky,
            ground: typeof parsed.ground === 'string' ? parsed.ground : current.ground,
            character: typeof parsed.character === 'string' ? parsed.character : current.character,
            characterType: ['robot', 'astronaut', 'kat', 'draak', 'ninja', 'eenhoorn'].includes(parsed.characterType)
                ? parsed.characterType
                : current.characterType,
            obstacles: typeof parsed.obstacles === 'number' ? Math.min(5, Math.max(0, parsed.obstacles)) : current.obstacles,
            clouds: typeof parsed.clouds === 'boolean' ? parsed.clouds : current.clouds,
            stars: typeof parsed.stars === 'boolean' ? parsed.stars : current.stars,
            speed: ['slow', 'normal', 'fast'].includes(parsed.speed) ? parsed.speed : current.speed,
            theme: typeof parsed.theme === 'string' ? parsed.theme : current.theme,
        };
    } catch {
        return current;
    }
}

/** Strip <GAME_STATE> block from visible text */
function stripGameState(text: string): string {
    return text.replace(/<GAME_STATE>[\s\S]*?<\/GAME_STATE>/g, '').trim();
}

/* ═══════════════════════════════════════════════════════════
   SVG GAME ILLUSTRATION
   ═══════════════════════════════════════════════════════════ */

function GameIllustration({ state }: { state: GameState }) {
    const speedDur = state.speed === 'slow' ? '8s' : state.speed === 'fast' ? '2s' : '4s';

    const characterShapes: Record<string, React.ReactNode> = {
        robot: (
            <g>
                <rect x="70" y="210" width="28" height="32" rx="4" fill={state.character} />
                <rect x="74" y="216" width="8" height="6" rx="2" fill="#fff" opacity="0.9" />
                <rect x="86" y="216" width="8" height="6" rx="2" fill="#fff" opacity="0.9" />
                <circle cx="78" cy="219" r="2" fill="#1a1a2e" />
                <circle cx="90" cy="219" r="2" fill="#1a1a2e" />
                <rect x="78" y="228" width="12" height="3" rx="1" fill="#fff" opacity="0.5" />
                <rect x="73" y="206" width="22" height="6" rx="3" fill={state.character} opacity="0.7" />
                <line x1="84" y1="203" x2="84" y2="196" stroke={state.character} strokeWidth="2" />
                <circle cx="84" cy="194" r="3" fill={state.character} opacity="0.8" />
            </g>
        ),
        astronaut: (
            <g>
                <ellipse cx="84" cy="228" rx="16" ry="18" fill="white" />
                <ellipse cx="84" cy="218" rx="13" ry="12" fill={state.character} />
                <rect x="71" y="222" width="26" height="20" rx="6" fill="white" />
                <ellipse cx="84" cy="215" rx="9" ry="7" fill="#87CEEB" opacity="0.6" />
                <circle cx="80" cy="214" r="2" fill="white" opacity="0.5" />
            </g>
        ),
        kat: (
            <g>
                <ellipse cx="84" cy="232" rx="14" ry="12" fill={state.character} />
                <circle cx="84" cy="216" r="12" fill={state.character} />
                <polygon points="74,208 72,194 80,206" fill={state.character} />
                <polygon points="94,208 96,194 88,206" fill={state.character} />
                <circle cx="79" cy="214" r="3" fill="white" />
                <circle cx="89" cy="214" r="3" fill="white" />
                <circle cx="79" cy="215" r="1.5" fill="#1a1a2e" />
                <circle cx="89" cy="215" r="1.5" fill="#1a1a2e" />
                <ellipse cx="84" cy="220" rx="2" ry="1.5" fill="#f472b6" />
                <line x1="68" y1="218" x2="76" y2="216" stroke={state.character} strokeWidth="1" opacity="0.5" />
                <line x1="68" y1="222" x2="76" y2="220" stroke={state.character} strokeWidth="1" opacity="0.5" />
                <line x1="100" y1="218" x2="92" y2="216" stroke={state.character} strokeWidth="1" opacity="0.5" />
                <line x1="100" y1="222" x2="92" y2="220" stroke={state.character} strokeWidth="1" opacity="0.5" />
            </g>
        ),
        draak: (
            <g>
                <ellipse cx="84" cy="230" rx="18" ry="14" fill={state.character} />
                <circle cx="84" cy="214" r="14" fill={state.character} />
                <polygon points="72,206 68,190 78,204" fill={state.character} />
                <polygon points="84,204 84,186 90,202" fill={state.character} />
                <polygon points="96,206 100,190 90,204" fill={state.character} />
                <circle cx="78" cy="212" r="4" fill="white" />
                <circle cx="90" cy="212" r="4" fill="white" />
                <circle cx="79" cy="213" r="2" fill="#dc2626" />
                <circle cx="91" cy="213" r="2" fill="#dc2626" />
                <path d="M78,222 Q84,228 90,222" fill="none" stroke="#dc2626" strokeWidth="2" />
                <ellipse cx="64" cy="226" rx="8" ry="5" fill={state.character} opacity="0.7" />
                <ellipse cx="104" cy="226" rx="8" ry="5" fill={state.character} opacity="0.7" />
            </g>
        ),
        ninja: (
            <g>
                <rect x="72" y="212" width="24" height="30" rx="4" fill="#1a1a2e" />
                <circle cx="84" cy="210" r="12" fill="#1a1a2e" />
                <rect x="70" y="206" width="28" height="10" rx="2" fill={state.character} />
                <circle cx="79" cy="211" r="2.5" fill="white" />
                <circle cx="89" cy="211" r="2.5" fill="white" />
                <circle cx="79" cy="211" r="1.5" fill="#1a1a2e" />
                <circle cx="89" cy="211" r="1.5" fill="#1a1a2e" />
                <line x1="98" y1="210" x2="110" y2="206" stroke={state.character} strokeWidth="2" />
                <line x1="110" y1="206" x2="114" y2="210" stroke={state.character} strokeWidth="2" />
            </g>
        ),
        eenhoorn: (
            <g>
                <ellipse cx="84" cy="232" rx="16" ry="12" fill="white" />
                <circle cx="84" cy="216" r="13" fill="white" />
                <polygon points="84,196 80,208 88,208" fill={state.character} />
                <circle cx="78" cy="214" r="3" fill="#f0abfc" />
                <circle cx="90" cy="214" r="3" fill="#f0abfc" />
                <circle cx="78" cy="215" r="1.5" fill="#1a1a2e" />
                <circle cx="90" cy="215" r="1.5" fill="#1a1a2e" />
                <path d="M76,222 Q84,226 92,222" fill="none" stroke="#f472b6" strokeWidth="1.5" />
                <path d="M68,220 Q60,216 56,224 Q62,222 68,226" fill={state.character} opacity="0.6" />
                <path d="M100,220 Q108,216 112,224 Q106,222 100,226" fill="#c084fc" opacity="0.6" />
            </g>
        ),
    };

    return (
        <svg viewBox="0 0 480 320" className="w-full h-full rounded-2xl" aria-hidden="true">
            <defs>
                <linearGradient id="gd-demo-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={state.sky} />
                    <stop offset="100%" stopColor={state.sky} stopOpacity="0.7" />
                </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="480" height="320" fill="url(#gd-demo-sky)" />

            {/* Stars */}
            {state.stars && [
                [40, 30], [120, 60], [200, 25], [280, 50], [360, 35], [420, 70],
                [80, 80], [160, 40], [320, 20], [440, 55], [60, 100], [250, 85],
            ].map(([x, y], i) => (
                <circle key={`star-${i}`} cx={x} cy={y} r={1 + (i % 2)} fill="white" opacity={0.4 + (i % 3) * 0.2}>
                    <animate attributeName="opacity" values={`${0.3 + (i % 3) * 0.1};${0.7 + (i % 2) * 0.2};${0.3 + (i % 3) * 0.1}`} dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
                </circle>
            ))}

            {/* Clouds */}
            {state.clouds && (
                <g opacity="0.3">
                    <g>
                        <ellipse cx="100" cy="80" rx="40" ry="16" fill="white" />
                        <ellipse cx="80" cy="76" rx="24" ry="12" fill="white" />
                        <ellipse cx="120" cy="78" rx="20" ry="10" fill="white" />
                        <animateTransform attributeName="transform" type="translate" values="0,0;480,0" dur="30s" repeatCount="indefinite" />
                    </g>
                    <g>
                        <ellipse cx="340" cy="60" rx="35" ry="14" fill="white" />
                        <ellipse cx="320" cy="56" rx="20" ry="10" fill="white" />
                        <animateTransform attributeName="transform" type="translate" values="0,0;480,0" dur="40s" repeatCount="indefinite" />
                    </g>
                </g>
            )}

            {/* Ground */}
            <rect x="0" y="248" width="480" height="72" fill={state.ground} rx="0" />
            <rect x="0" y="245" width="480" height="8" fill={state.ground} opacity="0.6" rx="4" />

            {/* Grass details */}
            {Array.from({ length: 24 }, (_, i) => (
                <line key={`grass-${i}`} x1={i * 20 + 5} y1="248" x2={i * 20 + 10} y2="240" stroke={state.ground} strokeWidth="2" opacity="0.5" />
            ))}

            {/* Obstacles */}
            {Array.from({ length: state.obstacles }, (_, i) => {
                const x = 180 + i * 70;
                return (
                    <g key={`obs-${i}`}>
                        <rect x={x} y="218" width="20" height="30" rx="3" fill={state.ground} opacity="0.8" stroke={state.sky} strokeWidth="1" />
                        <rect x={x + 2} y="220" width="16" height="4" rx="1" fill="white" opacity="0.1" />
                        {/* Spike on top */}
                        <polygon points={`${x + 10},208 ${x + 4},218 ${x + 16},218`} fill={state.ground} opacity="0.9" />
                    </g>
                );
            })}

            {/* Platforms */}
            <rect x="150" y="200" width="60" height="8" rx="4" fill={state.ground} opacity="0.6" />
            <rect x="280" y="180" width="50" height="8" rx="4" fill={state.ground} opacity="0.5" />
            <rect x="380" y="210" width="55" height="8" rx="4" fill={state.ground} opacity="0.6" />

            {/* Coins/collectibles */}
            {[{ x: 170, y: 188 }, { x: 300, y: 168 }, { x: 400, y: 198 }].map((pos, i) => (
                <g key={`coin-${i}`}>
                    <circle cx={pos.x} cy={pos.y} r="6" fill="#fbbf24" />
                    <circle cx={pos.x} cy={pos.y} r="4" fill="#fcd34d" />
                    <text x={pos.x} y={pos.y + 3} textAnchor="middle" fontSize="7" fontWeight="bold" fill="#92400e">$</text>
                    <circle cx={pos.x} cy={pos.y} r="7" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4">
                        <animate attributeName="r" values="7;11;7" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                </g>
            ))}

            {/* Character */}
            <g>
                {characterShapes[state.characterType] || characterShapes.robot}
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur={speedDur} repeatCount="indefinite" />
            </g>

            {/* Theme badge */}
            <g>
                <rect x="360" y="12" width={state.theme.length * 8 + 24} height="26" rx="13" fill="rgba(0,0,0,0.4)" />
                <text x={372 + state.theme.length * 4} y="30" textAnchor="middle" fontSize="11" fontWeight="600" fill="white" fontFamily="system-ui">{state.theme}</text>
            </g>

            {/* Speed indicator */}
            <g>
                <rect x="12" y="12" width="56" height="26" rx="13" fill="rgba(0,0,0,0.4)" />
                <text x="40" y="30" textAnchor="middle" fontSize="10" fill="white" fontFamily="system-ui">
                    {state.speed === 'slow' ? '🐢' : state.speed === 'fast' ? '⚡' : '▶'} {state.speed}
                </text>
            </g>
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════
   CHAT COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function TypingDots() {
    return (
        <span className="inline-flex gap-1 items-center px-3 py-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
                <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400"
                    style={{ animation: `typing-bounce 1.2s ease-in-out ${delay}s infinite` }}
                />
            ))}
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export const ScholenLandingLiveDemo: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            text: 'Hoi! Ik ben Pip, jouw AI game-mentor. Samen bouwen we een mini-platformer! Welk thema wil je: ruimte, jungle, oceaan, stad, of iets anders?',
        },
    ]);
    const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [remaining, setRemaining] = useState(MAX_MESSAGES);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isLocked = remaining <= 0;

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const sendMessage = useCallback(async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading || isLocked) return;

        setInput('');
        setError(null);
        setIsLoading(true);

        const userMsg: ChatMessage = { role: 'user', text: trimmed };
        setMessages(prev => [...prev, userMsg]);

        // Build history for context (skip first hardcoded greeting)
        const history = messages.slice(1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.text }],
        }));

        try {
            const res = await fetch(`${EDGE_FUNCTION_URL}/demo-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: trimmed,
                    history,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error === 'demo_limit') {
                    setRemaining(0);
                    setError(null);
                } else {
                    setError(data.reason || data.error || 'Er ging iets mis.');
                }
                setIsLoading(false);
                return;
            }

            const aiText = data.text || '';
            const newGameState = parseGameState(aiText, gameState);
            const visibleText = stripGameState(aiText);

            setGameState(newGameState);
            setMessages(prev => [...prev, { role: 'assistant', text: visibleText }]);
            if (typeof data.remaining === 'number') {
                setRemaining(data.remaining);
            } else {
                setRemaining(prev => Math.max(0, prev - 1));
            }
        } catch {
            setError('Verbinding mislukt. Controleer je internet.');
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    }, [input, isLoading, isLocked, messages, gameState]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <p className="font-semibold text-sm mb-3 tracking-wide" style={{ color: C.accent }}>
                    Probeer het zelf
                </p>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4" style={{ fontFamily: SERIF, color: C.text }}>
                    Bouw je eigen game met AI
                </h2>
                <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: C.textMuted }}>
                    Chat met Pip en ontwerp je eigen platformer. Kies een thema, karakter en obstakels
                    — en zie je game live veranderen. Dit is hoe leren eruitziet op DGSkills.
                </p>
            </div>

            {/* Remaining messages badge */}
            <div className="flex items-center justify-center mb-6">
                <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                        backgroundColor: isLocked ? '#fef2f2' : `${C.accent}10`,
                        color: isLocked ? '#dc2626' : C.accent,
                        border: `1px solid ${isLocked ? '#fecaca' : `${C.accent}30`}`,
                    }}
                >
                    {isLocked ? (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Demo voltooid
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                            </svg>
                            {remaining} van {MAX_MESSAGES} berichten over
                        </>
                    )}
                </div>
            </div>

            {/* Demo area */}
            <div
                className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-xl"
                style={{ border: `1px solid ${C.border}` }}
            >
                {/* Chat panel */}
                <div className="lg:col-span-2 bg-slate-900 flex flex-col min-h-[400px] lg:min-h-[460px] order-2 lg:order-1">
                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.accent }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="m2 14 6-6 6 6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">Pip — Game Builder</p>
                            <p className="text-slate-500 text-xs">AI-mentor</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-emerald-400 text-xs">Online</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto" role="log" aria-label="Chat berichten" aria-live="polite">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0" style={{ backgroundColor: C.accent }}>
                                        <img src="/mascot/pip-logo.webp" alt="" className="w-5 h-5 object-contain" width={20} height={20} />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'text-white rounded-2xl rounded-br-sm'
                                            : 'bg-slate-800 text-slate-200 rounded-2xl rounded-bl-sm'
                                    }`}
                                    style={msg.role === 'user' ? { backgroundColor: C.accent } : undefined}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0" style={{ backgroundColor: C.accent }}>
                                    <img src="/mascot/pip-logo.webp" alt="" className="w-5 h-5 object-contain" width={20} height={20} />
                                </div>
                                <div className="bg-slate-800/60 rounded-2xl rounded-bl-sm">
                                    <TypingDots />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex justify-center">
                                <p className="text-xs text-red-400 bg-red-950/30 px-3 py-1.5 rounded-lg">{error}</p>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Input or lock */}
                    <div className="px-4 pb-4">
                        {isLocked ? (
                            <div className="text-center space-y-3 py-2">
                                <p className="text-slate-400 text-sm">
                                    Demo afgelopen! Maak een gratis account om verder te bouwen.
                                </p>
                                <a
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                                    style={{ backgroundColor: C.accent }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.accentHover)}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.accent)}
                                >
                                    Gratis account maken
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Beschrijf je game..."
                                    maxLength={500}
                                    disabled={isLoading}
                                    className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none disabled:opacity-50"
                                    aria-label="Chat bericht"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                                    style={{ backgroundColor: C.accent }}
                                    aria-label="Verstuur bericht"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Game preview */}
                <div className="lg:col-span-3 relative order-1 lg:order-2 bg-slate-100">
                    <GameIllustration state={gameState} />

                    {/* Locked overlay */}
                    {isLocked && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center text-white p-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-60">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <p className="font-semibold text-lg mb-1">Demo voltooid</p>
                                <p className="text-sm text-white/70">Maak een account om onbeperkt te bouwen</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Suggestion chips */}
            {!isLocked && messages.length <= 2 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    {['Ruimte-thema', 'Jungle met een draak', 'Oceaan + eenhoorn', 'Sneeuwwereld'].map(suggestion => (
                        <button
                            key={suggestion}
                            onClick={() => {
                                setInput(suggestion);
                                inputRef.current?.focus();
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-full transition-colors"
                            style={{ border: `1px solid ${C.border}`, color: C.textMuted }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = C.accent;
                                e.currentTarget.style.color = C.accent;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = C.border;
                                e.currentTarget.style.color = C.textMuted;
                            }}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {/* Educational note */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs" style={{ color: C.textMuted }}>
                <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
                    </svg>
                    Computational Thinking & Programmeren
                </span>
                <span className="w-px h-3" style={{ backgroundColor: C.border }} aria-hidden="true" />
                <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                    </svg>
                    SLO Kerndoel 21A — Computational Thinking
                </span>
            </div>
        </div>
    );
};
