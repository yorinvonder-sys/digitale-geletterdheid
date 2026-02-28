import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════
   DATA STRUCTURES
   ═══════════════════════════════════════════════════════════ */

interface GameVisualState {
    primary: string;
    secondary: string;
    effect1: boolean;
    effect2: boolean;
}

interface DemoStep {
    studentMessage: string;
    aiResponse: string;
    gameState: GameVisualState;
    label: string;
    accentClass: string;
}

interface GameDemo {
    id: string;
    mentorName: string;
    mentorIcon: React.ReactNode;
    tabIcon: React.ReactNode;
    tabLabel: string;
    activeTabClass: string;
    educationalNote: string;
    sloTag: string;
    steps: DemoStep[];
    baseState: GameVisualState;
    Illustration: React.FC<{ state: GameVisualState }>;
    stepIcons: React.ReactNode[];
}

const STEP_DURATION = 7000;

type Phase = 'student-typing' | 'student-message' | 'ai-typing' | 'ai-message' | 'game-update';

const PHASE_TIMINGS: Record<Phase, number> = {
    'student-typing': 0,
    'student-message': 900,
    'ai-typing': 2000,
    'ai-message': 3000,
    'game-update': 3600,
};

/* ═══════════════════════════════════════════════════════════
   SVG ILLUSTRATIONS
   ═══════════════════════════════════════════════════════════ */

function PlatformerIllustration({ state }: { state: GameVisualState }) {
    return (
        <svg viewBox="0 0 480 320" className="w-full h-full" aria-hidden="true">
            <defs>
                <linearGradient id="gd-plat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64b5f6" />
                    <stop offset="100%" stopColor="#e1f5fe" />
                </linearGradient>
            </defs>
            <rect width="480" height="320" fill="url(#gd-plat)" />

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

            {/* Score */}
            <rect x="370" y="20" width="90" height="28" rx="6" fill="rgba(0,0,0,0.35)" />
            <text x="415" y="39" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white" fontFamily="monospace">SCORE: 120</text>

            {/* Ground */}
            <rect x="0" y="260" width="480" height="20" fill="#66bb6a" />
            <rect x="0" y="272" width="480" height="48" fill="#8d6e63" />
            {[20, 55, 95, 130, 180, 220, 270, 310, 360, 400, 440].map(x => (
                <line key={x} x1={x} y1="260" x2={x - 3} y2="252" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" />
            ))}

            {/* Pipes */}
            <g>
                <rect x="330" y="190" width="36" height="70" rx="3" fill="#43a047" />
                <rect x="326" y="186" width="44" height="14" rx="4" fill="#388e3c" />
                <rect x="336" y="198" width="6" height="58" fill="#66bb6a" opacity="0.4" />
            </g>
            <g>
                <rect x="210" y="220" width="30" height="40" rx="3" fill="#43a047" />
                <rect x="206" y="216" width="38" height="12" rx="4" fill="#388e3c" />
                <rect x="216" y="228" width="5" height="28" fill="#66bb6a" opacity="0.4" />
            </g>

            {/* Player */}
            <g style={{
                transform: state.effect1 ? 'translateY(-55px)' : 'translateY(0px)',
                transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
                <rect x="90" y="216" width="32" height="40" rx="6" style={{ fill: state.primary, transition: 'fill 0.8s ease' }} />
                <rect x="94" y="196" width="24" height="24" rx="12" style={{ fill: state.primary, transition: 'fill 0.8s ease' }} />
                <rect x="88" y="192" width="30" height="8" rx="3" fill="#1a1a2e" />
                <rect x="96" y="185" width="16" height="10" rx="3" fill="#1a1a2e" />
                <circle cx="103" cy="206" r="2.5" fill="white" />
                <circle cx="112" cy="206" r="2.5" fill="white" />
                <circle cx="104" cy="206" r="1.2" fill="#1a1a2e" />
                <circle cx="113" cy="206" r="1.2" fill="#1a1a2e" />

                {state.effect2 && (
                    <g>
                        <circle cx="130" cy="220" r="8" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.7">
                            <animate attributeName="r" values="8;22" dur="1.2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0" dur="1.2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="130" cy="220" r="8" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5">
                            <animate attributeName="r" values="8;22" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                        </circle>
                        <path d="M128 214 l-4 3h-3v6h3l4 3z" fill="#f59e0b" />
                    </g>
                )}
            </g>
        </svg>
    );
}

function SpaceIllustration({ state }: { state: GameVisualState }) {
    return (
        <svg viewBox="0 0 480 320" className="w-full h-full" aria-hidden="true">
            <defs>
                <linearGradient id="gd-space" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
            </defs>
            <rect width="480" height="320" fill="url(#gd-space)" />

            {/* Stars */}
            {[
                [40, 30], [120, 70], [200, 25], [310, 55], [430, 40], [70, 140],
                [170, 180], [280, 120], [380, 160], [450, 100], [25, 240], [150, 280],
                [340, 260], [260, 210], [420, 230], [90, 95], [230, 290], [460, 280],
            ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="white" opacity={0.4 + (i % 4) * 0.15}>
                    <animate attributeName="opacity" values={`${0.3 + (i % 3) * 0.2};${0.7 + (i % 2) * 0.3};${0.3 + (i % 3) * 0.2}`} dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
                </circle>
            ))}

            {/* Nebula */}
            <ellipse cx="380" cy="80" rx="80" ry="50" fill="#6366f1" opacity="0.06" />
            <ellipse cx="100" cy="250" rx="60" ry="40" fill="#8b5cf6" opacity="0.05" />

            {/* HUD */}
            <rect x="370" y="16" width="96" height="28" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x="418" y="35" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#94a3b8" fontFamily="monospace">WAVE: 03</text>

            <rect x="14" y="16" width="80" height="8" rx="4" fill="rgba(255,255,255,0.08)" />
            <rect x="14" y="16" width="56" height="8" rx="4" fill="#22d3ee" opacity="0.6" />
            <text x="14" y="38" fontSize="9" fill="#64748b" fontFamily="monospace">SHIELD</text>

            {/* Asteroids */}
            <g>
                <ellipse cx="340" cy="100" rx="22" ry="18" fill="#475569" stroke="#334155" strokeWidth="1.5" />
                <ellipse cx="334" cy="94" rx="5" ry="4" fill="#334155" />
                <ellipse cx="348" cy="104" rx="3" ry="3" fill="#334155" />
            </g>
            <g>
                <ellipse cx="400" cy="200" rx="16" ry="14" fill="#475569" stroke="#334155" strokeWidth="1.5" />
                <ellipse cx="394" cy="196" rx="4" ry="3" fill="#334155" />
            </g>
            <ellipse cx="300" cy="250" rx="10" ry="8" fill="#475569" stroke="#334155" strokeWidth="1" />

            {/* Enemy ships */}
            <g>
                <g>
                    <polygon points="380,140 395,148 380,156 384,148" style={{ fill: state.effect2 ? '#ef4444' : '#f87171', transition: 'fill 0.8s ease' }} />
                    <rect x="376" y="145" width="4" height="6" rx="1" fill="#dc2626" />
                    <animateTransform attributeName="transform" type="translate" values={state.effect2 ? '0,0;-30,-8;0,0' : '0,0;-10,-3;0,0'} dur={state.effect2 ? '2s' : '4s'} repeatCount="indefinite" />
                </g>
                <g>
                    <polygon points="420,220 435,228 420,236 424,228" style={{ fill: state.effect2 ? '#ef4444' : '#f87171', transition: 'fill 0.8s ease' }} />
                    <rect x="416" y="225" width="4" height="6" rx="1" fill="#dc2626" />
                    <animateTransform attributeName="transform" type="translate" values={state.effect2 ? '0,0;-25,10;0,0' : '0,0;-8,3;0,0'} dur={state.effect2 ? '2.5s' : '5s'} repeatCount="indefinite" />
                </g>
            </g>

            {/* Spaceship */}
            <g>
                {/* Engine glow */}
                <ellipse cx="80" cy="165" rx="8" ry="4" fill="#f59e0b" opacity="0.5">
                    <animate attributeName="rx" values="6;10;6" dur="0.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="0.5s" repeatCount="indefinite" />
                </ellipse>

                {/* Ship body */}
                <polygon points="130,165 85,148 85,182" style={{ fill: state.primary, transition: 'fill 0.8s ease' }} />
                <polygon points="120,165 92,155 92,175" fill="white" opacity="0.15" />
                <ellipse cx="118" cy="165" rx="6" ry="4" fill="#38bdf8" opacity="0.7" />
                {/* Wings */}
                <polygon points="95,148 88,135 100,148" style={{ fill: state.primary, transition: 'fill 0.8s ease', opacity: 0.8 }} />
                <polygon points="95,182 88,195 100,182" style={{ fill: state.primary, transition: 'fill 0.8s ease', opacity: 0.8 }} />

                {/* Laser */}
                {state.effect1 && (
                    <g>
                        <line x1="132" y1="165" x2="480" y2="165" stroke="#22d3ee" strokeWidth="3" opacity="0.8">
                            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.3s" repeatCount="indefinite" />
                        </line>
                        <line x1="132" y1="165" x2="480" y2="165" stroke="white" strokeWidth="1" opacity="0.9">
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="0.3s" repeatCount="indefinite" />
                        </line>
                        <circle cx="318" cy="165" r="6" fill="#22d3ee" opacity="0.6">
                            <animate attributeName="r" values="4;10;4" dur="0.6s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.6s" repeatCount="indefinite" />
                        </circle>
                    </g>
                )}

                <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="3s" repeatCount="indefinite" />
            </g>

            {/* Speed lines */}
            {state.effect2 && (
                <g opacity="0.15">
                    {[60, 120, 200, 260].map((y, i) => (
                        <line key={i} x1="0" y1={y} x2="40" y2={y} stroke="white" strokeWidth="1">
                            <animate attributeName="x1" values={`${-20 + i * 5};${480}`} dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
                            <animate attributeName="x2" values={`${i * 5};${520}`} dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
                        </line>
                    ))}
                </g>
            )}
        </svg>
    );
}

function RacingIllustration({ state }: { state: GameVisualState }) {
    return (
        <svg viewBox="0 0 480 320" className="w-full h-full" aria-hidden="true">
            <defs>
                <linearGradient id="gd-grass-r" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
            </defs>

            {/* Grass */}
            <rect width="480" height="320" fill="url(#gd-grass-r)" />

            {/* Trees */}
            {[30, 80, 140, 380, 430, 460].map((x, i) => (
                <g key={`tree-${i}`} opacity="0.5">
                    <circle cx={x} cy={50 + (i * 47) % 260} r={8 + (i % 3) * 3} fill="#15803d" />
                    <circle cx={x + 5} cy={45 + (i * 47) % 260} r={6 + (i % 2) * 2} fill="#166534" />
                </g>
            ))}

            {/* Road */}
            <rect x="120" y="0" width="240" height="320" fill="#374151" />

            {/* Kerbs */}
            {[0, 40, 80, 120, 160, 200, 240, 280].map((y, i) => (
                <React.Fragment key={`kerb-${i}`}>
                    <rect x="120" y={y} width="10" height="20" fill={i % 2 === 0 ? '#ef4444' : 'white'} />
                    <rect x="350" y={y} width="10" height="20" fill={i % 2 === 0 ? '#ef4444' : 'white'} />
                </React.Fragment>
            ))}

            {/* Center dashes */}
            {[10, 50, 90, 130, 170, 210, 250, 290].map((y, i) => (
                <rect key={`dash-${i}`} x="237" y={y} width="6" height="25" rx="2" fill="white" opacity="0.4">
                    <animate attributeName="y" values={`${y};${y + 40}`} dur="0.8s" repeatCount="indefinite" />
                </rect>
            ))}

            {/* Finish line */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
                <React.Fragment key={`fin-${i}`}>
                    <rect x={130 + i * 18} y={280} width="9" height="8" fill={(i) % 2 === 0 ? 'white' : '#1f2937'} />
                    <rect x={130 + i * 18} y={288} width="9" height="8" fill={(i + 1) % 2 === 0 ? 'white' : '#1f2937'} />
                </React.Fragment>
            ))}

            {/* HUD */}
            <rect x="370" y="16" width="96" height="28" rx="6" fill="rgba(0,0,0,0.5)" />
            <text x="418" y="35" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white" fontFamily="monospace">LAP: 3/5</text>

            <rect x="14" y="16" width="80" height="28" rx="6" fill="rgba(0,0,0,0.5)" />
            <text x="54" y="35" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="monospace" style={{ fill: state.effect1 ? '#fbbf24' : '#94a3b8', transition: 'fill 0.8s ease' }}>
                {state.effect1 ? '280' : '180'} km/h
            </text>

            {/* Weather overlay */}
            {state.effect2 && (
                <g>
                    {/* Dark overcast sky */}
                    <rect width="480" height="320" fill="#1e293b" opacity="0.45" />

                    {/* Storm clouds */}
                    <ellipse cx="100" cy="30" rx="80" ry="28" fill="#334155" opacity="0.9" />
                    <ellipse cx="150" cy="20" rx="60" ry="22" fill="#475569" opacity="0.8" />
                    <ellipse cx="300" cy="35" rx="90" ry="30" fill="#334155" opacity="0.9" />
                    <ellipse cx="360" cy="22" rx="70" ry="24" fill="#475569" opacity="0.8" />
                    <ellipse cx="220" cy="28" rx="50" ry="18" fill="#3f5068" opacity="0.7" />

                    {/* Rain drops — heavy, angled */}
                    {Array.from({ length: 50 }, (_, i) => (
                        <line
                            key={`rain-${i}`}
                            x1={0}
                            y1={0}
                            x2={-6}
                            y2={14}
                            stroke="#bfdbfe"
                            strokeWidth={i % 4 === 0 ? 2 : 1.2}
                            strokeLinecap="round"
                            opacity={0.55 + (i % 3) * 0.15}
                            style={{ transform: `translate(${(i * 9.5) % 490}px, 0px)` }}
                        >
                            <animate
                                attributeName="y1"
                                values={`${-20 - (i * 6) % 60};320`}
                                dur={`${0.45 + (i % 6) * 0.07}s`}
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="y2"
                                values={`${-6 - (i * 6) % 60};334`}
                                dur={`${0.45 + (i % 6) * 0.07}s`}
                                repeatCount="indefinite"
                            />
                        </line>
                    ))}

                    {/* Puddle splashes on road */}
                    {[160, 220, 270, 310].map((x, i) => (
                        <ellipse key={`splash-${i}`} cx={x} cy={260 + (i * 17) % 50} rx="6" ry="2" fill="#93c5fd" opacity="0.3">
                            <animate attributeName="rx" values="2;8;2" dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0;0.5" dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" />
                        </ellipse>
                    ))}

                    {/* Lightning flash (occasional) */}
                    <rect width="480" height="320" fill="white" opacity="0">
                        <animate attributeName="opacity" values="0;0;0;0;0;0;0;0.15;0;0.1;0;0;0;0;0;0;0;0;0;0" dur="4s" repeatCount="indefinite" />
                    </rect>
                </g>
            )}

            {/* Car */}
            <g>
                <ellipse cx="240" cy="175" rx="18" ry="6" fill="black" opacity="0.2" />

                {/* Turbo */}
                {state.effect1 && (
                    <g>
                        <ellipse cx="232" cy="188" rx="4" ry="10" fill="#f59e0b" opacity="0.7">
                            <animate attributeName="ry" values="8;14;8" dur="0.3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.3s" repeatCount="indefinite" />
                        </ellipse>
                        <ellipse cx="248" cy="188" rx="4" ry="10" fill="#f59e0b" opacity="0.7">
                            <animate attributeName="ry" values="8;14;8" dur="0.3s" begin="0.1s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.3s" begin="0.1s" repeatCount="indefinite" />
                        </ellipse>
                        <ellipse cx="232" cy="190" rx="2" ry="6" fill="white" opacity="0.6">
                            <animate attributeName="ry" values="4;8;4" dur="0.3s" repeatCount="indefinite" />
                        </ellipse>
                        <ellipse cx="248" cy="190" rx="2" ry="6" fill="white" opacity="0.6">
                            <animate attributeName="ry" values="4;8;4" dur="0.3s" begin="0.1s" repeatCount="indefinite" />
                        </ellipse>
                    </g>
                )}

                {/* Car body */}
                <rect x="224" y="140" width="32" height="50" rx="8" style={{ fill: state.primary, transition: 'fill 0.8s ease' }} />
                <rect x="228" y="144" width="24" height="12" rx="4" fill="#1e293b" opacity="0.6" />
                <rect x="230" y="172" width="20" height="8" rx="3" fill="#1e293b" opacity="0.4" />
                {/* Wheels */}
                <rect x="220" y="148" width="6" height="14" rx="2" fill="#1f2937" />
                <rect x="254" y="148" width="6" height="14" rx="2" fill="#1f2937" />
                <rect x="220" y="168" width="6" height="14" rx="2" fill="#1f2937" />
                <rect x="254" y="168" width="6" height="14" rx="2" fill="#1f2937" />
                <text x="240" y="162" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="monospace">7</text>

                <animateTransform attributeName="transform" type="translate" values="0,0;-2,-2;0,0;2,-1;0,0" dur="2s" repeatCount="indefinite" />
            </g>

            {/* Opponent */}
            <g opacity="0.7">
                <rect x="290" y="60" width="28" height="44" rx="7" fill="#64748b" />
                <rect x="293" y="63" width="22" height="10" rx="3" fill="#1e293b" opacity="0.5" />
                <rect x="286" y="68" width="5" height="12" rx="2" fill="#475569" />
                <rect x="318" y="68" width="5" height="12" rx="2" fill="#475569" />
                <rect x="286" y="84" width="5" height="12" rx="2" fill="#475569" />
                <rect x="318" y="84" width="5" height="12" rx="2" fill="#475569" />
            </g>
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════
   GAME DEFINITIONS
   ═══════════════════════════════════════════════════════════ */

const GAMES: GameDemo[] = [
    {
        id: 'platformer',
        mentorName: 'Game Programmeur',
        mentorIcon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" />
            </svg>
        ),
        tabIcon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01" /><path d="M7 12h.01" />
            </svg>
        ),
        tabLabel: 'Platformer',
        activeTabClass: 'border-emerald-400 bg-emerald-50 text-emerald-700',
        educationalNote: 'Variabelen, functies en oorzaak-gevolg',
        sloTag: 'CT — Computational Thinking',
        baseState: { primary: '#e53935', secondary: '#64b5f6', effect1: false, effect2: false },
        Illustration: PlatformerIllustration,
        steps: [
            {
                studentMessage: 'Maak de speler groen',
                aiResponse: 'De speler is nu groen! Probeer ook eens de achtergrond aan te passen.',
                gameState: { primary: '#10B981', secondary: '#64b5f6', effect1: false, effect2: false },
                label: 'Kleur',
                accentClass: 'border-emerald-400 bg-emerald-50 text-emerald-700',
            },
            {
                studentMessage: 'Maak het springen hoger',
                aiResponse: 'De jumpForce is verhoogd! Je speler springt nu veel hoger.',
                gameState: { primary: '#10B981', secondary: '#64b5f6', effect1: true, effect2: false },
                label: 'Fysica',
                accentClass: 'border-blue-400 bg-blue-50 text-blue-700',
            },
            {
                studentMessage: 'Voeg een springgeluid toe',
                aiResponse: 'Er zit nu een geluid bij elke sprong!',
                gameState: { primary: '#10B981', secondary: '#64b5f6', effect1: true, effect2: true },
                label: 'Geluid',
                accentClass: 'border-amber-400 bg-amber-50 text-amber-700',
            },
        ],
        stepIcons: [
            <svg key="p1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
            <svg key="p2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
            <svg key="p3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>,
        ],
    },
    {
        id: 'space',
        mentorName: 'Space Developer',
        mentorIcon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            </svg>
        ),
        tabIcon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            </svg>
        ),
        tabLabel: 'Space Shooter',
        activeTabClass: 'border-cyan-400 bg-cyan-50 text-cyan-700',
        educationalNote: 'Coördinaten, loops en logica',
        sloTag: 'CT — Algoritmen & patronen',
        baseState: { primary: '#64748b', secondary: '#0f172a', effect1: false, effect2: false },
        Illustration: SpaceIllustration,
        steps: [
            {
                studentMessage: 'Maak mijn schip blauw',
                aiResponse: 'Je ruimteschip is nu blauw! De shipColor variabele is aangepast.',
                gameState: { primary: '#3b82f6', secondary: '#0f172a', effect1: false, effect2: false },
                label: 'Kleur',
                accentClass: 'border-blue-400 bg-blue-50 text-blue-700',
            },
            {
                studentMessage: 'Voeg een laser toe',
                aiResponse: 'Laser geactiveerd! Bij elke klik vuurt je schip nu een laserstraal af.',
                gameState: { primary: '#3b82f6', secondary: '#0f172a', effect1: true, effect2: false },
                label: 'Wapen',
                accentClass: 'border-cyan-400 bg-cyan-50 text-cyan-700',
            },
            {
                studentMessage: 'Maak de vijanden sneller',
                aiResponse: 'De enemySpeed is verdubbeld! Let op, ze zijn nu veel moeilijker te ontwijken.',
                gameState: { primary: '#3b82f6', secondary: '#0f172a', effect1: true, effect2: true },
                label: 'Snelheid',
                accentClass: 'border-red-400 bg-red-50 text-red-700',
            },
        ],
        stepIcons: [
            <svg key="s1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" /></svg>,
            <svg key="s2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>,
            <svg key="s3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
        ],
    },
    {
        id: 'racing',
        mentorName: 'Race Engineer',
        mentorIcon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
            </svg>
        ),
        tabIcon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
            </svg>
        ),
        tabLabel: 'Race Game',
        activeTabClass: 'border-amber-400 bg-amber-50 text-amber-700',
        educationalNote: 'Condities, variabelen en simulatie',
        sloTag: 'CT — Modelleren & simuleren',
        baseState: { primary: '#e53935', secondary: '#374151', effect1: false, effect2: false },
        Illustration: RacingIllustration,
        steps: [
            {
                studentMessage: 'Maak mijn auto oranje',
                aiResponse: 'Je raceauto is nu oranje! De carColor variabele is geüpdatet.',
                gameState: { primary: '#f97316', secondary: '#374151', effect1: false, effect2: false },
                label: 'Kleur',
                accentClass: 'border-orange-400 bg-orange-50 text-orange-700',
            },
            {
                studentMessage: 'Voeg turbo boost toe',
                aiResponse: 'Turbo geactiveerd! Druk op spatie voor een snelheidsboost met vlammen.',
                gameState: { primary: '#f97316', secondary: '#374151', effect1: true, effect2: false },
                label: 'Turbo',
                accentClass: 'border-amber-400 bg-amber-50 text-amber-700',
            },
            {
                studentMessage: 'Voeg regen toe aan het circuit',
                aiResponse: 'Het regent nu! De grip is lager — je auto glijdt meer in de bochten.',
                gameState: { primary: '#f97316', secondary: '#374151', effect1: true, effect2: true },
                label: 'Weer',
                accentClass: 'border-blue-400 bg-blue-50 text-blue-700',
            },
        ],
        stepIcons: [
            <svg key="r1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" /></svg>,
            <svg key="r2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
            <svg key="r3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M16 14v6M8 14v6M12 16v6" /></svg>,
        ],
    },
];

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

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
        <div className={`flex ${isStudent ? 'justify-end' : 'justify-start'} transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {!isStudent && (
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 8V4H8" /><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M7 15h0M17 15h0" />
                    </svg>
                </div>
            )}
            <div className={`max-w-[80%] px-3.5 py-2 text-sm leading-relaxed ${
                isStudent
                    ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
                    : 'bg-slate-800 text-slate-200 rounded-2xl rounded-bl-sm'
            }`}>
                {text}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export function ScholenLandingGameDemo() {
    const [activeGameIdx, setActiveGameIdx] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [phase, setPhase] = useState<Phase>('student-typing');
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const game = GAMES[activeGameIdx];
    const steps = game.steps;

    const clearTimers = useCallback(() => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    }, []);

    useEffect(() => {
        if (isPaused) return;
        clearTimers();

        const phases: Phase[] = ['student-typing', 'student-message', 'ai-typing', 'ai-message', 'game-update'];
        phases.forEach(p => {
            const t = setTimeout(() => setPhase(p), PHASE_TIMINGS[p]);
            timerRef.current.push(t);
        });

        const advance = setTimeout(() => {
            setActiveStep(prev => (prev + 1) % steps.length);
        }, STEP_DURATION);
        timerRef.current.push(advance);

        return clearTimers;
    }, [activeStep, isPaused, clearTimers, steps.length]);

    useEffect(() => {
        setPhase('student-typing');
    }, [activeStep]);

    const switchGame = (idx: number) => {
        if (idx === activeGameIdx) return;
        clearTimers();
        setIsPaused(false);
        setActiveGameIdx(idx);
        setActiveStep(0);
        setPhase('student-typing');
    };

    const step = steps[activeStep];
    const phaseIndex = (p: Phase) => ['student-typing', 'student-message', 'ai-typing', 'ai-message', 'game-update'].indexOf(p);
    const currentPhaseIdx = phaseIndex(phase);

    const visibleMessages: { text: string; isStudent: boolean; visible: boolean }[] = [];
    for (let i = 0; i < activeStep; i++) {
        visibleMessages.push({ text: steps[i].studentMessage, isStudent: true, visible: true });
        visibleMessages.push({ text: steps[i].aiResponse, isStudent: false, visible: true });
    }

    const goToStep = (idx: number) => {
        clearTimers();
        setIsPaused(false);
        setActiveStep(idx);
        setPhase('student-typing');
    };

    const gameState: GameVisualState = currentPhaseIdx >= phaseIndex('game-update')
        ? step.gameState
        : activeStep > 0
            ? steps[activeStep - 1].gameState
            : game.baseState;

    const GameIll = game.Illustration;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <p className="text-emerald-600 font-semibold text-sm mb-3 tracking-wide">Bekijk het in actie</p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                    Leerlingen bouwen hun eigen game
                </h2>
                <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
                    Met de AI-mentor passen leerlingen stap voor stap een echte game aan.
                    Elke chat-opdracht verandert direct het resultaat.
                </p>
            </div>

            {/* Game type selector */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6" role="tablist" aria-label="Kies een game-type">
                {GAMES.map((g, i) => (
                    <button
                        key={g.id}
                        role="tab"
                        aria-selected={i === activeGameIdx}
                        onClick={() => switchGame(i)}
                        className={`group flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold border-2 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                            i === activeGameIdx
                                ? g.activeTabClass + ' shadow-md'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:shadow-sm'
                        }`}
                    >
                        <span className={`transition-transform group-hover:scale-110 ${i === activeGameIdx ? '' : 'opacity-60'}`}>
                            {g.tabIcon}
                        </span>
                        {g.tabLabel}
                    </button>
                ))}
            </div>

            {/* Educational context */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    {game.educationalNote}
                </span>
                <span className="w-px h-3 bg-slate-200" aria-hidden="true" />
                <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                    </svg>
                    {game.sloTag}
                </span>
            </div>

            {/* Demo area */}
            <div
                className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Chat panel */}
                <div className="lg:col-span-2 bg-slate-900 flex flex-col min-h-[360px] lg:min-h-[420px] order-2 lg:order-1">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                            {game.mentorIcon}
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">{game.mentorName}</p>
                            <p className="text-slate-500 text-xs">AI-mentor</p>
                        </div>
                    </div>

                    <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden flex flex-col justify-end" role="list" aria-label="Chat berichten">
                        {visibleMessages.map((msg, i) => (
                            <div key={`${game.id}-${i}`} role="listitem">
                                <ChatBubble text={msg.text} isStudent={msg.isStudent} visible={msg.visible} />
                            </div>
                        ))}

                        {currentPhaseIdx === phaseIndex('student-typing') && (
                            <div className="flex justify-end" role="listitem">
                                <div className="bg-indigo-600/60 rounded-2xl rounded-br-sm">
                                    <TypingDots />
                                </div>
                            </div>
                        )}

                        {currentPhaseIdx >= phaseIndex('student-message') && (
                            <div role="listitem">
                                <ChatBubble text={step.studentMessage} isStudent={true} visible={currentPhaseIdx >= phaseIndex('student-message')} />
                            </div>
                        )}

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

                        {currentPhaseIdx >= phaseIndex('ai-message') && (
                            <div role="listitem">
                                <ChatBubble text={step.aiResponse} isStudent={false} visible={currentPhaseIdx >= phaseIndex('ai-message')} />
                            </div>
                        )}
                    </div>

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
                <div className="lg:col-span-3 relative order-1 lg:order-2 bg-slate-100">
                    <GameIll state={gameState} />

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
                {steps.map((s, i) => (
                    <button
                        key={`${game.id}-${s.label}`}
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
                        {game.stepIcons[i]}
                        {s.label}

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
