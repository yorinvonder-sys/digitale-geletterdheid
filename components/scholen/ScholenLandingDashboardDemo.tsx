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
        id: 1,
        name: 'Samir K.',
        initials: 'SK',
        avatarColor: 'bg-indigo-500',
        xp: 850,
        maxXp: 1000,
        level: 8,
        missionsCompleted: 7,
        totalMissions: 9,
        currentMission: 'Data Detective bezig...',
        sloKerndoelen: ['Digitale geletterdheid', 'Computational Thinking', 'Data & informatie'],
        timeSpent: '4u 12m',
        streak: 5,
    },
    {
        id: 2,
        name: 'Lisa M.',
        initials: 'LM',
        avatarColor: 'bg-emerald-500',
        xp: 1200,
        maxXp: 1200,
        level: 12,
        missionsCompleted: 9,
        totalMissions: 9,
        currentMission: 'Alle missies afgerond!',
        sloKerndoelen: ['Digitale geletterdheid', 'Computational Thinking', 'Creatief ontwerpen'],
        timeSpent: '6u 45m',
        streak: 12,
    },
    {
        id: 3,
        name: 'Jayden R.',
        initials: 'JR',
        avatarColor: 'bg-amber-500',
        xp: 340,
        maxXp: 500,
        level: 4,
        missionsCompleted: 3,
        totalMissions: 9,
        currentMission: 'Game Programmeur bezig...',
        sloKerndoelen: ['Computational Thinking', 'Algoritmen & patronen'],
        timeSpent: '2u 08m',
        streak: 2,
    },
    {
        id: 4,
        name: 'Fatima B.',
        initials: 'FB',
        avatarColor: 'bg-rose-500',
        xp: 680,
        maxXp: 800,
        level: 7,
        missionsCompleted: 5,
        totalMissions: 9,
        currentMission: 'Deepfake Detector bezig...',
        sloKerndoelen: ['Digitale geletterdheid', 'Mediawijsheid', 'Ethiek & AI'],
        timeSpent: '3u 34m',
        streak: 4,
    },
    {
        id: 5,
        name: 'Noah V.',
        initials: 'NV',
        avatarColor: 'bg-cyan-500',
        xp: 520,
        maxXp: 700,
        level: 5,
        missionsCompleted: 4,
        totalMissions: 9,
        currentMission: 'AI Trainer bezig...',
        sloKerndoelen: ['Computational Thinking', 'Data & informatie', 'AI & machine learning'],
        timeSpent: '2u 51m',
        streak: 3,
    },
];

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function AnimatedXpBar({ value, max, animate }: { value: number; max: number; animate: boolean }) {
    const pct = Math.round((value / max) * 100);
    return (
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                style={{ width: animate ? `${pct}%` : '0%' }}
            />
        </div>
    );
}

function MissionDots({ completed, total }: { completed: number; total: number }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: total }, (_, i) => (
                <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        i < completed ? 'bg-indigo-500' : 'bg-slate-200'
                    }`}
                />
            ))}
        </div>
    );
}

function StudentCard({
    student,
    isSelected,
    isFocusMode,
    focusMission,
    animate,
    onClick,
}: {
    student: Student;
    isSelected: boolean;
    isFocusMode: boolean;
    focusMission: string;
    animate: boolean;
    onClick: () => void;
}) {
    const isComplete = student.missionsCompleted === student.totalMissions;

    return (
        <button
            onClick={onClick}
            className={`relative w-full text-left p-3 rounded-xl border-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                isSelected
                    ? 'border-indigo-400 bg-indigo-50 shadow-md scale-[1.02]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            } ${isFocusMode ? 'ring-2 ring-orange-300 ring-offset-1' : ''}`}
        >
            {/* Avatar + name */}
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

            {/* XP bar */}
            <div className="mb-1.5">
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>{student.xp} XP</span>
                    <span>{student.maxXp} XP</span>
                </div>
                <AnimatedXpBar value={student.xp} max={student.maxXp} animate={animate} />
            </div>

            {/* Mission dots */}
            <div className="flex items-center justify-between">
                <MissionDots completed={student.missionsCompleted} total={student.totalMissions} />
                <span className="text-[10px] text-slate-400">{student.missionsCompleted}/{student.totalMissions}</span>
            </div>

            {/* Focus mode override label */}
            {isFocusMode && (
                <div className="mt-2 px-2 py-1 rounded-md bg-orange-50 border border-orange-200 text-[10px] text-orange-600 font-medium truncate">
                    {focusMission}
                </div>
            )}
        </button>
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
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${student.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
                    {student.initials}
                </div>
                <div>
                    <p className="text-base font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-400">Level {student.level} &middot; {student.xp} XP</p>
                </div>
            </div>

            {/* Current mission */}
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold mb-1">Huidige missie</p>
                <p className="text-sm text-indigo-700 font-medium">{student.currentMission}</p>
            </div>

            {/* Missions progress */}
            <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">Missie-voortgang</p>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                        style={{ width: `${Math.round((student.missionsCompleted / student.totalMissions) * 100)}%` }}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-1">{student.missionsCompleted} van {student.totalMissions} missies voltooid</p>
            </div>

            {/* SLO kerndoelen */}
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

            {/* Stats row */}
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
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export const ScholenLandingDashboardDemo: React.FC = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [focusMode, setFocusMode] = useState(false);
    const [barsAnimated, setBarsAnimated] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const [autoPlayActive, setAutoPlayActive] = useState(true);
    const autoPlayCycleRef = useRef(0);

    const selectedStudent = STUDENTS.find((s) => s.id === selectedId) ?? null;

    // Intersection observer for bar animation
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setBarsAnimated(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Show detail panel with slight delay for animation
    useEffect(() => {
        if (selectedId !== null) {
            setDetailVisible(false);
            const t = setTimeout(() => setDetailVisible(true), 50);
            return () => clearTimeout(t);
        } else {
            setDetailVisible(false);
        }
    }, [selectedId]);

    const clearAutoPlay = useCallback(() => {
        autoPlayRef.current.forEach(clearTimeout);
        autoPlayRef.current = [];
    }, []);

    // Auto-play flow
    useEffect(() => {
        if (!autoPlayActive || !barsAnimated) return;
        clearAutoPlay();

        const cycle = autoPlayCycleRef.current;
        const studentOrder = [0, 1, 2, 3, 4];
        const studentIdx = studentOrder[cycle % studentOrder.length];
        const student = STUDENTS[studentIdx];

        // After 3s: select student
        const t1 = setTimeout(() => {
            setSelectedId(student.id);
        }, 3000);
        autoPlayRef.current.push(t1);

        // After 9s: activate focus mode
        const t3 = setTimeout(() => {
            setFocusMode(true);
        }, 9000);
        autoPlayRef.current.push(t3);

        // After 12s: reset and advance
        const t4 = setTimeout(() => {
            setFocusMode(false);
            setSelectedId(null);
            autoPlayCycleRef.current = cycle + 1;
            setAutoPlayActive((prev) => prev); // trigger re-run
        }, 12000);
        autoPlayRef.current.push(t4);

        return clearAutoPlay;
    }, [autoPlayActive, barsAnimated, clearAutoPlay]);

    // Re-trigger auto-play cycle
    useEffect(() => {
        if (!autoPlayActive) return;
        // This effect re-runs whenever autoPlayCycleRef changes via state trigger
    }, [autoPlayActive]);

    const handleStudentClick = (id: number) => {
        setAutoPlayActive(false);
        clearAutoPlay();
        setFocusMode(false);
        setSelectedId(selectedId === id ? null : id);
    };

    const handleFocusToggle = () => {
        setAutoPlayActive(false);
        clearAutoPlay();
        setFocusMode(!focusMode);
    };

    return (
        <div ref={containerRef} className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <p className="text-indigo-600 font-semibold text-sm mb-3 tracking-wide">Volledige controle</p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                    Docenten Dashboard
                </h2>
                <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
                    Volg de voortgang van elke leerling in real-time.
                    Stuur de klas aan met Focus Mode.
                </p>
            </div>

            {/* Dashboard container */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
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
                        <button
                            onClick={handleFocusToggle}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                                focusMode
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="2" />
                            </svg>
                            Focus Mode
                        </button>
                    </div>
                </div>

                {/* Focus Mode banner */}
                <div
                    className={`overflow-hidden transition-all duration-500 ${
                        focusMode ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
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
                                    isFocusMode={focusMode}
                                    focusMission="Data Detective"
                                    animate={barsAnimated}
                                    onClick={() => handleStudentClick(student.id)}
                                />
                            ))}
                        </div>

                        {/* Class stats */}
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                                <p className="text-xl font-bold text-indigo-700">3.590</p>
                                <p className="text-[10px] text-indigo-400 font-medium">Totaal XP klas</p>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                                <p className="text-xl font-bold text-purple-700">62%</p>
                                <p className="text-[10px] text-purple-400 font-medium">Gem. voortgang</p>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                <p className="text-xl font-bold text-emerald-700">28</p>
                                <p className="text-[10px] text-emerald-400 font-medium">Missies voltooid</p>
                            </div>
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                <p className="text-xl font-bold text-amber-700">5.2</p>
                                <p className="text-[10px] text-amber-400 font-medium">Gem. streak</p>
                            </div>
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
        </div>
    );
};
