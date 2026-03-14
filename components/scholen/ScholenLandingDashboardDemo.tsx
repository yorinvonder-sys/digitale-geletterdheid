import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

interface Student {
    id: number;
    name: string;
    initials: string;
    avatarColor: string;
    xp: number;
    maxXp: number;
    level: number;
    missionsCompleted: number;
    totalMissions: number;
    currentMission: string;
    sloKerndoelen: string[];
    timeSpent: string;
    streak: number;
}

const STUDENTS: Student[] = [
    {
        id: 1, name: 'Samir K.', initials: 'SK', avatarColor: 'bg-indigo-500',
        xp: 850, maxXp: 1000, level: 8, missionsCompleted: 7, totalMissions: 9,
        currentMission: 'Data Detective bezig...', sloKerndoelen: ['Digitale geletterdheid', 'Computational Thinking', 'Data & informatie'],
        timeSpent: '4u 12m', streak: 5,
    },
    {
        id: 2, name: 'Lisa M.', initials: 'LM', avatarColor: 'bg-emerald-500',
        xp: 1200, maxXp: 1200, level: 12, missionsCompleted: 9, totalMissions: 9,
        currentMission: 'Alle missies afgerond!', sloKerndoelen: ['Digitale geletterdheid', 'Computational Thinking', 'Creatief ontwerpen'],
        timeSpent: '6u 45m', streak: 12,
    },
    {
        id: 3, name: 'Jayden R.', initials: 'JR', avatarColor: 'bg-amber-500',
        xp: 340, maxXp: 500, level: 4, missionsCompleted: 3, totalMissions: 9,
        currentMission: 'Game Programmeur bezig...', sloKerndoelen: ['Computational Thinking', 'Algoritmen & patronen'],
        timeSpent: '2u 08m', streak: 2,
    },
    {
        id: 4, name: 'Fatima B.', initials: 'FB', avatarColor: 'bg-rose-500',
        xp: 680, maxXp: 800, level: 7, missionsCompleted: 5, totalMissions: 9,
        currentMission: 'Deepfake Detector bezig...', sloKerndoelen: ['Digitale geletterdheid', 'Mediawijsheid', 'Ethiek & AI'],
        timeSpent: '3u 34m', streak: 4,
    },
    {
        id: 5, name: 'Noah V.', initials: 'NV', avatarColor: 'bg-cyan-500',
        xp: 520, maxXp: 700, level: 5, missionsCompleted: 4, totalMissions: 9,
        currentMission: 'AI Trainer bezig...', sloKerndoelen: ['Computational Thinking', 'Data & informatie', 'AI & machine learning'],
        timeSpent: '2u 51m', streak: 3,
    },
];

const STEP_DURATION = 8000;

type Phase = 'idle' | 'highlight' | 'action' | 'result';

const PHASE_TIMINGS: Record<Phase, number> = {
    idle: 0,
    highlight: 1000,
    action: 2500,
    result: 3500,
};

interface DemoStep {
    label: string;
    accentClass: string;
}

const DEMO_STEPS: DemoStep[] = [
    { label: 'Leerling bekijken', accentClass: 'border-blue-400 bg-blue-50 text-blue-700' },
    { label: 'Focus Mode', accentClass: 'border-orange-400 bg-orange-50 text-orange-700' },
    { label: 'Klasoverzicht', accentClass: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
];

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function AnimatedXpBar({ value, max, animate }: { value: number; max: number; animate: boolean }) {
    const pct = Math.round((value / max) * 100);
    return (
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ background: 'linear-gradient(to right, #D97757, #C46849)', width: animate ? `${pct}%` : '0%' }}
            />
        </div>
    );
}

function MissionDots({ completed, total }: { completed: number; total: number }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: total }, (_, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-colors duration-300" style={{ backgroundColor: i < completed ? '#D97757' : '#E8E6DF' }} />
            ))}
        </div>
    );
}

function StudentCard({
    student, isSelected, isHighlighted, isFocusMode, focusMission, animate,
}: {
    student: Student;
    isSelected: boolean;
    isHighlighted: boolean;
    isFocusMode: boolean;
    focusMission: string;
    animate: boolean;
}) {
    const isComplete = student.missionsCompleted === student.totalMissions;

    return (
        <div
            className={`relative w-full text-left p-3 rounded-xl border-2 transition-all duration-500 ${
                isSelected ? 'shadow-md scale-[1.02]' : 'bg-white'
            } ${isFocusMode ? 'ring-2 ring-orange-300 ring-offset-1' : ''}`}
            style={{
                borderColor: isHighlighted ? '#3b82f6' : isSelected ? '#D97757' : '#E8E6DF',
                backgroundColor: isSelected ? 'rgba(217,119,87,0.06)' : undefined,
                boxShadow: isHighlighted ? '0 0 0 3px rgba(59, 130, 246, 0.3), 0 0 16px rgba(59, 130, 246, 0.15)' : undefined,
            }}
        >
            <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-full ${student.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {student.initials}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{student.name}</p>
                    <p className="text-xs text-slate-400">Level {student.level}</p>
                </div>
                {isComplete && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    </span>
                )}
            </div>

            <div className="mb-1.5">
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>{student.xp} XP</span>
                    <span>{student.maxXp} XP</span>
                </div>
                <AnimatedXpBar value={student.xp} max={student.maxXp} animate={animate} />
            </div>

            <div className="flex items-center justify-between">
                <MissionDots completed={student.missionsCompleted} total={student.totalMissions} />
                <span className="text-[10px] text-slate-400">{student.missionsCompleted}/{student.totalMissions}</span>
            </div>

            {isFocusMode && (
                <div className="mt-2 px-2 py-1 rounded-md bg-orange-50 border border-orange-200 text-[10px] text-orange-600 font-medium truncate">
                    {focusMission}
                </div>
            )}
        </div>
    );
}

function DetailPanel({ student, visible }: { student: Student | null; visible: boolean }) {
    if (!student) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm px-4 text-center">
                Klik op een leerling om details te zien
            </div>
        );
    }

    return (
        <div className={`p-4 space-y-4 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${student.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
                    {student.initials}
                </div>
                <div>
                    <p className="text-base font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-400">Level {student.level} &middot; {student.xp} XP</p>
                </div>
            </div>

            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.15)' }}>
                <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: '#D97757' }}>Huidige missie</p>
                <p className="text-sm font-medium" style={{ color: '#1A1A19' }}>{student.currentMission}</p>
            </div>

            <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">Missie-voortgang</p>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.round((student.missionsCompleted / student.totalMissions) * 100)}%`, background: 'linear-gradient(to right, #D97757, #C46849)' }}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-1">{student.missionsCompleted} van {student.totalMissions} missies voltooid</p>
            </div>

            <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">SLO-kerndoelen</p>
                <div className="flex flex-wrap gap-1.5">
                    {student.sloKerndoelen.map((kd) => (
                        <span key={kd} className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-[10px] text-purple-600 font-medium">
                            {kd}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <p className="text-lg font-bold text-slate-800">{student.timeSpent}</p>
                    <p className="text-[10px] text-slate-400">Tijdbesteding</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <p className="text-lg font-bold text-slate-800">{student.streak} dagen</p>
                    <p className="text-[10px] text-slate-400">Streak</p>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED STAT CARD
   ═══════════════════════════════════════════════════════════ */

function AnimatedStat({ value, label, color, borderColor, animate, delay }: {
    value: string; label: string; color: string; borderColor: string; animate: boolean; delay: number;
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (animate) {
            const t = setTimeout(() => setVisible(true), delay);
            return () => clearTimeout(t);
        }
        setVisible(false);
    }, [animate, delay]);

    return (
        <div
            className="p-3 rounded-xl transition-all duration-500"
            style={{
                backgroundColor: `${color}08`,
                border: `1px solid ${borderColor}`,
                transform: visible ? 'scale(1.05)' : 'scale(1)',
                boxShadow: visible ? `0 0 0 2px ${color}30, 0 4px 12px ${color}15` : 'none',
            }}
        >
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
            <p className="text-[10px] font-medium" style={{ color: '#6B6B66' }}>{label}</p>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export const ScholenLandingDashboardDemo: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [phase, setPhase] = useState<Phase>('idle');
    const [isPaused, setIsPaused] = useState(false);
    const [barsAnimated, setBarsAnimated] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const manualRef = useRef(false);

    const clearTimers = useCallback(() => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    }, []);

    // Intersection observer for bar animation
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setBarsAnimated(true); observer.disconnect(); } },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Phase progression
    useEffect(() => {
        if (isPaused || !barsAnimated) return;
        clearTimers();

        const phases: Phase[] = ['idle', 'highlight', 'action', 'result'];
        phases.forEach(p => {
            const t = setTimeout(() => setPhase(p), PHASE_TIMINGS[p]);
            timerRef.current.push(t);
        });

        const advance = setTimeout(() => {
            manualRef.current = false;
            setActiveStep(prev => (prev + 1) % DEMO_STEPS.length);
        }, STEP_DURATION);
        timerRef.current.push(advance);

        return clearTimers;
    }, [activeStep, isPaused, barsAnimated, clearTimers]);

    useEffect(() => {
        setPhase('idle');
    }, [activeStep]);

    const goToStep = (idx: number) => {
        clearTimers();
        manualRef.current = true;
        setIsPaused(false);
        setActiveStep(idx);
        setPhase('idle');
    };

    // Derive dashboard visual state from step + phase
    const phaseIdx = ['idle', 'highlight', 'action', 'result'].indexOf(phase);

    let selectedId: number | null = null;
    let focusMode = false;
    let highlightStudentId: number | null = null;
    let highlightFocusBtn = false;
    let highlightStats = false;

    switch (activeStep) {
        case 0: // Leerling bekijken
            if (phaseIdx === 1) highlightStudentId = 4;
            if (phaseIdx >= 2) selectedId = 4;
            break;
        case 1: // Focus Mode
            selectedId = 4;
            if (phaseIdx === 1) highlightFocusBtn = true;
            if (phaseIdx >= 2) focusMode = true;
            break;
        case 2: // Klasoverzicht
            if (phaseIdx < 1) { selectedId = 4; focusMode = true; }
            if (phaseIdx >= 2) highlightStats = true;
            break;
    }

    const selectedStudent = STUDENTS.find(s => s.id === selectedId) ?? null;
    const detailVisible = selectedId !== null && phaseIdx >= 3;

    return (
        <div ref={containerRef} className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <p className="font-semibold text-sm mb-3 tracking-wide" style={{ color: '#D97757' }}>Volledige controle</p>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                    Docenten Dashboard
                </h2>
                <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: '#6B6B66' }}>
                    Volg de voortgang van elke leerling in real-time.
                    Stuur de klas aan met Focus Mode.
                </p>
            </div>

            {/* Dashboard container */}
            <div
                className="rounded-3xl overflow-hidden shadow-xl bg-white"
                style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E6DF' }}
                onMouseEnter={() => { if (!manualRef.current) setIsPaused(true); }}
                onMouseLeave={() => { if (!manualRef.current) setIsPaused(false); }}
            >
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 hidden sm:inline">Docenten Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Demo
                        </span>

                        {/* Focus Mode toggle */}
                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-500 ${
                                focusMode
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                    : 'bg-slate-100 text-slate-500'
                            }`}
                            style={{
                                boxShadow: highlightFocusBtn ? '0 0 0 3px rgba(249, 115, 22, 0.4), 0 0 16px rgba(249, 115, 22, 0.2)' : undefined,
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="2" />
                            </svg>
                            Focus Mode
                        </div>
                    </div>
                </div>

                {/* Focus Mode banner */}
                <div className={`overflow-hidden transition-all duration-500 ${focusMode ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 sm:px-6 py-2.5 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <p className="text-xs text-orange-700 font-medium">
                            Focus Mode actief — alle leerlingen werken nu aan: <span className="font-bold">Data Detective</span>
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[420px]">
                    {/* Student grid */}
                    <div className="lg:col-span-2 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leerlingen (5)</p>
                            <p className="text-xs text-slate-400">Klik voor details</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {STUDENTS.map((student) => (
                                <StudentCard
                                    key={student.id}
                                    student={student}
                                    isSelected={selectedId === student.id}
                                    isHighlighted={highlightStudentId === student.id}
                                    isFocusMode={focusMode}
                                    focusMission="Data Detective"
                                    animate={barsAnimated}
                                />
                            ))}
                        </div>

                        {/* Class stats */}
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <AnimatedStat value="3.590" label="Totaal XP klas" color="#D97757" borderColor="rgba(217,119,87,0.15)" animate={highlightStats} delay={0} />
                            <AnimatedStat value="62%" label="Gem. voortgang" color="#7c3aed" borderColor="rgba(124,58,237,0.15)" animate={highlightStats} delay={200} />
                            <AnimatedStat value="28" label="Missies voltooid" color="#059669" borderColor="rgba(5,150,105,0.15)" animate={highlightStats} delay={400} />
                            <AnimatedStat value="5.2" label="Gem. streak" color="#d97706" borderColor="rgba(217,119,6,0.15)" animate={highlightStats} delay={600} />
                        </div>
                    </div>

                    {/* Detail panel */}
                    <div className="border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50/30 min-h-[300px]">
                        <div className="px-4 py-3 border-b border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leerling details</p>
                        </div>
                        <DetailPanel student={selectedStudent} visible={detailVisible} />
                    </div>
                </div>
            </div>

            {/* Step navigation */}
            <div className="flex items-center justify-center gap-3 mt-6" role="tablist" aria-label="Demo stappen">
                {DEMO_STEPS.map((s, i) => (
                    <button
                        key={s.label}
                        role="tab"
                        aria-selected={i === activeStep}
                        aria-label={`Stap ${i + 1}: ${s.label}`}
                        onClick={() => goToStep(i)}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 ${
                            i === activeStep ? s.accentClass + ' shadow-sm' : 'bg-white'
                        }`}
                        style={i !== activeStep ? { borderColor: '#E8E6DF', color: '#6B6B66' } : undefined}
                    >
                        {i === 0 && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                        )}
                        {i === 1 && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                            </svg>
                        )}
                        {i === 2 && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 20V10M12 20V4M6 20v-6" />
                            </svg>
                        )}
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
