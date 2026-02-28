import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════
   DATA STRUCTURES
   ═══════════════════════════════════════════════════════════ */

interface PrivacyVisualState {
    meterPercent: number;
    appIcons: boolean;
    dataTags: string[];
    rules: string[];
    confetti: boolean;
}

interface DemoStep {
    studentMessage: string;
    aiResponse: string;
    visualState: PrivacyVisualState;
    label: string;
    accentClass: string;
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
   DEMO STEPS
   ═══════════════════════════════════════════════════════════ */

const STEPS: DemoStep[] = [
    {
        studentMessage: 'Instagram, TikTok en Snapchat',
        aiResponse: 'Interessant! Deze apps verzamelen je locatie, contacten en browsegeschiedenis. Laten we kijken wat dat betekent...',
        visualState: {
            meterPercent: 0,
            appIcons: true,
            dataTags: [],
            rules: [],
            confetti: false,
        },
        label: 'Apps',
        accentClass: 'border-teal-400 bg-teal-50 text-teal-700',
    },
    {
        studentMessage: 'Ehm... mijn foto\'s en berichten?',
        aiResponse: 'Dat klopt, maar er is meer! Ook je locatie, contacten, browsegeschiedenis en zelfs hoe lang je naar posts kijkt. Dat is jouw digitale profiel!',
        visualState: {
            meterPercent: 40,
            appIcons: true,
            dataTags: ['Locatie', 'Contacten', 'Browsegeschiedenis'],
            rules: [],
            confetti: false,
        },
        label: 'Data',
        accentClass: 'border-amber-400 bg-amber-50 text-amber-700',
    },
    {
        studentMessage: 'Ik wil mijn locatie uitzetten en privé-account instellen',
        aiResponse: 'Uitstekend! Met deze 2 regels bescherm je al 60% van je digitale profiel. Je bent nu een bewuste digitale burger!',
        visualState: {
            meterPercent: 85,
            appIcons: true,
            dataTags: ['Locatie', 'Contacten', 'Browsegeschiedenis'],
            rules: ['Locatie uitzetten', 'Privé-account'],
            confetti: true,
        },
        label: 'Regels',
        accentClass: 'border-emerald-400 bg-emerald-50 text-emerald-700',
    },
];

const AI_QUESTIONS = [
    'Welke apps gebruik je het meest?',
    'Weet je welke data ze verzamelen?',
    'Maak je persoonlijke dataregels',
];

const STEP_ICONS: React.ReactNode[] = [
    <svg key="s1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><path d="M12 18h.01" /></svg>,
    <svg key="s2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    <svg key="s3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
];

/* ═══════════════════════════════════════════════════════════
   SVG ILLUSTRATION — Privacy Score Meter
   ═══════════════════════════════════════════════════════════ */

function PrivacyIllustration({ state }: { state: PrivacyVisualState }) {
    const meterHeight = 160;
    const filledHeight = (state.meterPercent / 100) * meterHeight;

    // Color interpolation based on meter percentage
    const getMeterColor = (pct: number) => {
        if (pct <= 0) return '#475569';
        if (pct <= 40) return '#f59e0b';
        if (pct <= 70) return '#14b8a6';
        return '#10b981';
    };

    const getMeterGlowColor = (pct: number) => {
        if (pct <= 0) return 'rgba(71,85,105,0.3)';
        if (pct <= 40) return 'rgba(245,158,11,0.3)';
        if (pct <= 70) return 'rgba(20,184,166,0.3)';
        return 'rgba(16,185,129,0.3)';
    };

    return (
        <svg viewBox="0 0 480 320" className="w-full h-full" aria-hidden="true">
            <defs>
                <linearGradient id="gd-privacy-bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="50%" stopColor="#134e4a" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="gd-meter-fill" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="gd-meter-track" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
            </defs>

            {/* Background */}
            <rect width="480" height="320" fill="url(#gd-privacy-bg)" />

            {/* Subtle grid pattern */}
            {Array.from({ length: 12 }, (_, i) => (
                <line key={`gh-${i}`} x1="0" y1={i * 30} x2="480" y2={i * 30} stroke="#1e293b" strokeWidth="0.5" opacity="0.5" />
            ))}
            {Array.from({ length: 16 }, (_, i) => (
                <line key={`gv-${i}`} x1={i * 32} y1="0" x2={i * 32} y2="320" stroke="#1e293b" strokeWidth="0.5" opacity="0.5" />
            ))}

            {/* Floating particles */}
            {[
                [40, 50], [120, 90], [380, 60], [430, 140], [60, 260], [200, 280],
                [350, 250], [450, 40], [280, 30], [160, 200],
            ].map(([x, y], i) => (
                <circle key={`particle-${i}`} cx={x} cy={y} r={1 + (i % 3) * 0.5} fill="#14b8a6" opacity={0.15 + (i % 4) * 0.05}>
                    <animate attributeName="opacity" values={`${0.1 + (i % 3) * 0.05};${0.25 + (i % 2) * 0.1};${0.1 + (i % 3) * 0.05}`} dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />
                    <animateTransform attributeName="transform" type="translate" values={`0,0;0,${-4 + (i % 2) * 8};0,0`} dur={`${4 + i % 3}s`} repeatCount="indefinite" />
                </circle>
            ))}

            {/* ═══ PRIVACY METER ═══ */}
            <g>
                {/* Label */}
                <text x="100" y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#94a3b8" fontFamily="monospace" letterSpacing="1.5">PRIVACY SCORE</text>

                {/* Meter track */}
                <rect x="80" y="45" width="40" height={meterHeight} rx="8" fill="url(#gd-meter-track)" stroke="#334155" strokeWidth="1" />

                {/* Meter fill */}
                <rect
                    x="82"
                    y={45 + meterHeight - filledHeight}
                    width="36"
                    height={Math.max(0, filledHeight)}
                    rx="7"
                    style={{
                        fill: getMeterColor(state.meterPercent),
                        transition: 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                />

                {/* Meter glow */}
                {state.meterPercent > 0 && (
                    <rect
                        x="78"
                        y={43 + meterHeight - filledHeight}
                        width="44"
                        height={Math.max(0, filledHeight + 4)}
                        rx="10"
                        style={{
                            fill: 'none',
                            stroke: getMeterGlowColor(state.meterPercent),
                            strokeWidth: 3,
                            transition: 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                    >
                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                    </rect>
                )}

                {/* Percentage text */}
                <text
                    x="100"
                    y="230"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="bold"
                    fontFamily="monospace"
                    style={{
                        fill: getMeterColor(state.meterPercent),
                        transition: 'fill 1.2s ease',
                    }}
                >
                    {state.meterPercent}%
                </text>
                <text x="100" y="248" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="monospace">BESCHERMD</text>
            </g>

            {/* ═══ APP ICONS ═══ */}
            {state.appIcons && (
                <g style={{ transition: 'opacity 0.8s ease' }}>
                    {/* Instagram */}
                    <g style={{
                        opacity: state.appIcons ? 1 : 0,
                        transition: 'opacity 0.6s ease 0.1s',
                    }}>
                        <rect x="180" y="50" width="44" height="44" rx="10" fill="#E4405F" />
                        <rect x="192" y="62" width="20" height="20" rx="5" fill="none" stroke="white" strokeWidth="2" />
                        <circle cx="202" cy="72" r="5" fill="none" stroke="white" strokeWidth="2" />
                        <circle cx="210" cy="64" r="2" fill="white" />
                        <text x="202" y="110" textAnchor="middle" fontSize="9" fill="#94a3b8">Instagram</text>
                    </g>

                    {/* TikTok */}
                    <g style={{
                        opacity: state.appIcons ? 1 : 0,
                        transition: 'opacity 0.6s ease 0.3s',
                    }}>
                        <rect x="244" y="50" width="44" height="44" rx="10" fill="#010101" />
                        <path d="M274 64 v16 a7 7 0 0 1 -14 0 v0" fill="none" stroke="#25F4EE" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M272 62 v16 a7 7 0 0 1 -14 0 v0" fill="none" stroke="#FE2C55" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M273 63 v16 a7 7 0 0 1 -14 0 v0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <path d="M273 68 c4 0 6-2 7-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <text x="266" y="110" textAnchor="middle" fontSize="9" fill="#94a3b8">TikTok</text>
                    </g>

                    {/* Snapchat */}
                    <g style={{
                        opacity: state.appIcons ? 1 : 0,
                        transition: 'opacity 0.6s ease 0.5s',
                    }}>
                        <rect x="308" y="50" width="44" height="44" rx="10" fill="#FFFC00" />
                        <path d="M330 68 c0-6 -5-8 -5-8 s-5 2 -5 8 c-4 0 -6-2 -6-2 s0 4 6 5 c-1 3 -5 4 -5 4 s5 2 11 0 s-1-1 -1-4 c6-1 6-5 6-5 s-2 2 -6 2z" fill="white" />
                        <text x="330" y="110" textAnchor="middle" fontSize="9" fill="#94a3b8">Snapchat</text>
                    </g>
                </g>
            )}

            {/* ═══ DATA TAGS ═══ */}
            {state.dataTags.length > 0 && (
                <g>
                    {state.dataTags.map((tag, i) => {
                        const tagX = 190 + i * 90;
                        const tagY = 145;
                        const tagColors = ['#f59e0b', '#ef4444', '#8b5cf6'];
                        const tagBgs = ['rgba(245,158,11,0.15)', 'rgba(239,68,68,0.15)', 'rgba(139,92,246,0.15)'];
                        const tagIcons = [
                            // Location pin
                            <path key="loc" d="M0,-6 a6,6 0 1,1 0,12 a6,6 0 1,1 0,-12 M0,-2 a2,2 0 1,1 0,4 a2,2 0 1,1 0,-4" fill={tagColors[0]} fillRule="evenodd" />,
                            // People
                            <g key="ppl"><circle cx="-3" cy="-3" r="3" fill={tagColors[1]} /><circle cx="5" cy="-3" r="3" fill={tagColors[1]} /><path d="M-7,5 a5,5 0 0,1 10,0 M-1,5 a5,5 0 0,1 10,0" fill={tagColors[1]} /></g>,
                            // Globe
                            <g key="glb"><circle cx="0" cy="0" r="6" fill="none" stroke={tagColors[2]} strokeWidth="1.5" /><ellipse cx="0" cy="0" rx="3" ry="6" fill="none" stroke={tagColors[2]} strokeWidth="1" /><line x1="-6" y1="0" x2="6" y2="0" stroke={tagColors[2]} strokeWidth="1" /></g>,
                        ];

                        return (
                            <g key={tag} style={{
                                opacity: 1,
                                transition: `opacity 0.6s ease ${0.2 + i * 0.2}s`,
                            }}>
                                <rect
                                    x={tagX - 40}
                                    y={tagY}
                                    width="80"
                                    height="32"
                                    rx="8"
                                    fill={tagBgs[i]}
                                    stroke={tagColors[i]}
                                    strokeWidth="1"
                                    opacity="0.8"
                                />
                                <g transform={`translate(${tagX - 24}, ${tagY + 16})`}>
                                    {tagIcons[i]}
                                </g>
                                <text
                                    x={tagX + 6}
                                    y={tagY + 20}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="600"
                                    fill={tagColors[i]}
                                >
                                    {tag}
                                </text>
                            </g>
                        );
                    })}
                </g>
            )}

            {/* ═══ PRIVACY RULES (checkmarks) ═══ */}
            {state.rules.length > 0 && (
                <g>
                    {state.rules.map((rule, i) => {
                        const ruleY = 210 + i * 38;
                        return (
                            <g key={rule} style={{
                                opacity: 1,
                                transition: `opacity 0.6s ease ${0.3 + i * 0.2}s`,
                            }}>
                                {/* Checkmark circle */}
                                <circle cx="200" cy={ruleY + 2} r="11" fill="#10b981" opacity="0.15" />
                                <circle cx="200" cy={ruleY + 2} r="11" fill="none" stroke="#10b981" strokeWidth="1.5" />
                                <path
                                    d={`M195,${ruleY + 2} l3,4 l7,-7`}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Rule text */}
                                <text
                                    x="218"
                                    y={ruleY + 6}
                                    fontSize="12"
                                    fontWeight="600"
                                    fill="#d1fae5"
                                >
                                    {rule}
                                </text>

                                {/* Animated shield pulse */}
                                <circle cx="200" cy={ruleY + 2} r="11" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3">
                                    <animate attributeName="r" values="11;18;11" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                                </circle>
                            </g>
                        );
                    })}
                </g>
            )}

            {/* ═══ CONFETTI EFFECT ═══ */}
            {state.confetti && (
                <g>
                    {[
                        { x: 160, y: 180, color: '#10b981', size: 4, dur: '2.5s', delay: '0s' },
                        { x: 220, y: 190, color: '#14b8a6', size: 3, dur: '3s', delay: '0.3s' },
                        { x: 280, y: 175, color: '#f59e0b', size: 5, dur: '2.8s', delay: '0.1s' },
                        { x: 340, y: 195, color: '#8b5cf6', size: 3, dur: '3.2s', delay: '0.5s' },
                        { x: 190, y: 200, color: '#ec4899', size: 4, dur: '2.6s', delay: '0.2s' },
                        { x: 310, y: 185, color: '#3b82f6', size: 3, dur: '2.9s', delay: '0.4s' },
                        { x: 250, y: 170, color: '#10b981', size: 5, dur: '2.4s', delay: '0.15s' },
                        { x: 370, y: 190, color: '#f59e0b', size: 4, dur: '3.1s', delay: '0.35s' },
                        { x: 150, y: 210, color: '#14b8a6', size: 3, dur: '2.7s', delay: '0.6s' },
                        { x: 400, y: 175, color: '#ec4899', size: 4, dur: '2.3s', delay: '0.25s' },
                        { x: 230, y: 160, color: '#3b82f6', size: 3, dur: '3.3s', delay: '0.45s' },
                        { x: 300, y: 200, color: '#8b5cf6', size: 5, dur: '2.5s', delay: '0.55s' },
                    ].map((p, i) => (
                        <g key={`confetti-${i}`}>
                            {i % 3 === 0 ? (
                                <rect x={p.x} y={p.y} width={p.size} height={p.size} fill={p.color} opacity="0.8"
                                    transform={`rotate(${i * 30}, ${p.x + p.size / 2}, ${p.y + p.size / 2})`}>
                                    <animateTransform attributeName="transform" type="translate" values={`0,0;${-10 + i * 3},-60`} dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.8;0" dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                    <animateTransform attributeName="transform" type="rotate" values={`0;${360}`} dur={p.dur} begin={p.delay} repeatCount="indefinite" additive="sum" />
                                </rect>
                            ) : i % 3 === 1 ? (
                                <circle cx={p.x} cy={p.y} r={p.size / 2} fill={p.color} opacity="0.8">
                                    <animateTransform attributeName="transform" type="translate" values={`0,0;${-8 + i * 2},-50`} dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.8;0" dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                </circle>
                            ) : (
                                <polygon points={`${p.x},${p.y - p.size} ${p.x - p.size},${p.y + p.size} ${p.x + p.size},${p.y + p.size}`} fill={p.color} opacity="0.8">
                                    <animateTransform attributeName="transform" type="translate" values={`0,0;${-12 + i * 2},-55`} dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.8;0" dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                                </polygon>
                            )}
                        </g>
                    ))}

                    {/* Central shield celebration */}
                    <g>
                        <path d="M290,270 l0,-20 a22,22 0 0,1 44,0 l0,20 c0,12 -22,20 -22,20 s-22,-8 -22,-20z" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6">
                            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                        </path>
                        <path d="M306,268 l5,5 l10,-10" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
                            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
                        </path>
                    </g>
                </g>
            )}

            {/* Shield watermark */}
            <g opacity="0.04">
                <path d="M400,240 l0,-30 a35,35 0 0,1 70,0 l0,30 c0,20 -35,32 -35,32 s-35,-12 -35,-32z" fill="white" />
            </g>
        </svg>
    );
}

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
                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
            )}
            <div className={`max-w-[80%] px-3.5 py-2 text-sm leading-relaxed ${
                isStudent
                    ? 'bg-teal-600 text-white rounded-2xl rounded-br-sm'
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

export const ScholenLandingAIChatDemo: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [phase, setPhase] = useState<Phase>('student-typing');
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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
            setActiveStep(prev => (prev + 1) % STEPS.length);
        }, STEP_DURATION);
        timerRef.current.push(advance);

        return clearTimers;
    }, [activeStep, isPaused, clearTimers]);

    useEffect(() => {
        setPhase('student-typing');
    }, [activeStep]);

    const step = STEPS[activeStep];
    const phaseIndex = (p: Phase) => ['student-typing', 'student-message', 'ai-typing', 'ai-message', 'game-update'].indexOf(p);
    const currentPhaseIdx = phaseIndex(phase);

    const visibleMessages: { text: string; isStudent: boolean; visible: boolean }[] = [];

    // Show AI question for current step, then previous full exchanges
    for (let i = 0; i < activeStep; i++) {
        visibleMessages.push({ text: AI_QUESTIONS[i], isStudent: false, visible: true });
        visibleMessages.push({ text: STEPS[i].studentMessage, isStudent: true, visible: true });
        visibleMessages.push({ text: STEPS[i].aiResponse, isStudent: false, visible: true });
    }

    const goToStep = (idx: number) => {
        clearTimers();
        setIsPaused(false);
        setActiveStep(idx);
        setPhase('student-typing');
    };

    const visualState: PrivacyVisualState = currentPhaseIdx >= phaseIndex('game-update')
        ? step.visualState
        : activeStep > 0
            ? STEPS[activeStep - 1].visualState
            : { meterPercent: 0, appIcons: false, dataTags: [], rules: [], confetti: false };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <p className="text-teal-600 font-semibold text-sm mb-3 tracking-wide">Bekijk het in actie</p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                    Leerlingen ontdekken hun digitale voetafdruk
                </h2>
                <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
                    De AI Spiegel coach helpt leerlingen stap voor stap bewust worden van
                    hun online privacy. Elke keuze bouwt aan een sterker digitaal profiel.
                </p>
            </div>

            {/* Educational context */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Online privacy, datageletterdheid en digitaal burgerschap
                </span>
                <span className="w-px h-3 bg-slate-200" aria-hidden="true" />
                <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                    </svg>
                    DB — Digitaal Burgerschap
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
                        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">AI Spiegel</p>
                            <p className="text-slate-500 text-xs">Privacy coach</p>
                        </div>
                    </div>

                    <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden flex flex-col justify-end" role="list" aria-label="Chat berichten">
                        {visibleMessages.map((msg, i) => (
                            <div key={`privacy-${i}`} role="listitem">
                                <ChatBubble text={msg.text} isStudent={msg.isStudent} visible={msg.visible} />
                            </div>
                        ))}

                        {/* AI question for current step */}
                        {currentPhaseIdx >= phaseIndex('student-typing') && (
                            <div role="listitem">
                                <ChatBubble text={AI_QUESTIONS[activeStep]} isStudent={false} visible={true} />
                            </div>
                        )}

                        {currentPhaseIdx === phaseIndex('student-typing') && (
                            <div className="flex justify-end" role="listitem">
                                <div className="bg-teal-600/60 rounded-2xl rounded-br-sm">
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
                                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
                            <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center opacity-50">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy illustration */}
                <div className="lg:col-span-3 relative order-1 lg:order-2 bg-slate-100">
                    <PrivacyIllustration state={visualState} />

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
                        key={`privacy-${s.label}`}
                        role="tab"
                        aria-selected={i === activeStep}
                        aria-label={`Stap ${i + 1}: ${s.label}`}
                        onClick={() => goToStep(i)}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                            i === activeStep
                                ? s.accentClass
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                        }`}
                    >
                        {STEP_ICONS[i]}
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
};
