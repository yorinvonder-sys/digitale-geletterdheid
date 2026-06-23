import React, { useMemo, useState } from 'react';
import {
    AlertTriangle,
    ArrowRight,
    BarChart3,
    BookOpen,
    ChevronRight,
    Clock,
    Flag,
    Map,
    Plus,
    Send,
    Shield,
    Sparkles,
    Target,
    Users,
    Zap,
} from 'lucide-react';
import { StudentData, GamificationEvent, TeacherDashboardTab } from '@/types';
import { getMissionsForYear, MissionInfo } from '@/config/missions';
import { ROLES } from '@/config/agents';
import { getKerndoelenForMission } from '@/config/slo-kerndoelen-mapping';
import { SLO_KERNDOELEN } from '@/config/sloKerndoelen';
import { MISSION_SCREENSHOTS } from '@/config/missionPreviewConfig';
import { requestClassInsight, ClassInsight } from '../../../services/classInsightService';

type MainTab = TeacherDashboardTab;

interface TeacherCommandCenterProps {
    students: StudentData[];
    activeEvents: GamificationEvent[];
    loading?: boolean;
    classFilter: string;
    onClassFilterChange: (classId: string) => void;
    availableClasses: string[];
    yearGroup: number;
    focusMode: boolean;
    focusModeRemaining: number;
    onToggleFocusMode: () => void;
    onNavigate: (tab: MainTab) => void;
    onSelectStudent: (student: StudentData) => void;
    onSendMessage: () => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function getLastActiveMs(student: StudentData): number {
    const value = student.lastActive || student.lastLogin || (student as any).last_active || (student as any).last_login;
    if (!value) return 0;
    if (typeof value === 'string') return new Date(value).getTime();
    if (typeof value === 'number') return value;
    if (typeof value.toDate === 'function') return value.toDate().getTime();
    return 0;
}

function getStudentClass(student: StudentData): string {
    return student.studentClass || student.stats?.studentClass || student.identifier?.replace(/\d{3,}$/, '') || 'Geen klas';
}

function initials(name?: string | null): string {
    if (!name) return '?';
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase())
        .join('');
}

function getMissionImage(missionId: string): string | null {
    const screenshot = MISSION_SCREENSHOTS[missionId];
    if (screenshot) return screenshot;

    const role = ROLES.find(r => r.id === missionId);
    return typeof role?.briefingImage === 'string' ? role.briefingImage : null;
}

const MissionThumbnail: React.FC<{ image: string | null; name: string }> = ({ image, name }) => {
    const [hasError, setHasError] = React.useState(false);
    const showFallback = !image || hasError;

    if (showFallback) {
        return (
            <div className="flex h-full w-full items-center justify-center text-lab-coral" aria-label={`${name} thumbnail niet beschikbaar`}>
                <Map size={28} />
            </div>
        );
    }

    return (
        <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setHasError(true)}
        />
    );
};

function getMissionProgress(mission: MissionInfo, students: StudentData[]) {
    const completed = students.filter(student => student.stats?.missionsCompleted?.includes(mission.id)).length;
    const started = students.filter(student =>
        student.stats?.missionsCompleted?.includes(mission.id)
        || Boolean(student.stats?.missionProgress?.[mission.id])
        || student.stats?.activeMission === mission.id
    ).length;
    const activeStudents = students.filter(student =>
        student.stats?.activeMission === mission.id
        || Boolean(student.stats?.missionProgress?.[mission.id])
    );

    return {
        completed,
        started,
        percentage: students.length > 0 ? Math.round((completed / students.length) * 100) : 0,
        activeStudents,
    };
}

function buildSloStats(students: StudentData[], missions: MissionInfo[]) {
    const domains = [
        { id: 21, label: 'Informatievaardigheden', icon: BookOpen, color: 'sage' },
        { id: 22, label: 'Communicatie & samenwerking', icon: Users, color: 'terracotta' },
        { id: 23, label: 'Digitale veiligheid', icon: Shield, color: 'amber' },
        { id: 22.1, label: 'Creatie met digitale middelen', icon: Sparkles, color: 'sky' },
        { id: 21.1, label: 'Probleemoplossend vermogen', icon: Target, color: 'sage' },
    ];

    return domains.map(domain => {
        const domainNumber = Math.floor(domain.id);
        const missionIds = missions
            .filter(mission => getKerndoelenForMission(mission.id).some(code => SLO_KERNDOELEN[code]?.domeinNummer === domainNumber))
            .map(mission => mission.id);
        const possible = missionIds.length * students.length;
        const completed = students.reduce((total, student) => (
            total + missionIds.filter(id => student.stats?.missionsCompleted?.includes(id)).length
        ), 0);
        return {
            ...domain,
            percentage: possible > 0 ? Math.round((completed / possible) * 100) : 0,
        };
    });
}

const colorMap: Record<string, { icon: string; bar: string; label: string }> = {
    sage: { icon: 'bg-lab-sage/15 text-lab-tealDark', bar: 'bg-lab-sage', label: 'text-lab-tealDark' },
    terracotta: { icon: 'bg-lab-creamDeep text-lab-coral', bar: 'bg-lab-coral', label: 'text-lab-coral' },
    amber: { icon: 'bg-lab-gold/25 text-lab-olive', bar: 'bg-lab-gold', label: 'text-lab-olive' },
    sky: { icon: 'bg-lab-tealDark/10 text-lab-tealDark', bar: 'bg-lab-tealDark', label: 'text-lab-tealDark' },
};

const columnStyles = [
    'bg-lab-creamDeep text-lab-tealDark',
    'bg-lab-tealDark text-white',
    'bg-lab-gold text-lab-ink',
];

function toChartPoints(values: number[], width = 320, height = 116, padding = 18) {
    const min = 25;
    const max = 75;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;

    return values.map((value, index) => {
        const x = padding + (index / Math.max(values.length - 1, 1)) * usableWidth;
        const y = padding + ((max - value) / (max - min)) * usableHeight;
        return { x, y, value };
    });
}

function pointsToPolyline(points: { x: number; y: number }[]) {
    return points.map(point => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
}

export const TeacherCommandCenter: React.FC<TeacherCommandCenterProps> = ({
    students,
    activeEvents,
    loading,
    classFilter,
    yearGroup,
    focusMode,
    focusModeRemaining,
    onToggleFocusMode,
    onNavigate,
    onSelectStudent,
    onSendMessage,
}) => {
    const missions = useMemo(() => getMissionsForYear(yearGroup), [yearGroup]);
    const filteredStudents = useMemo(() => students.filter(student => {
        if (classFilter === 'all') return true;
        return getStudentClass(student) === classFilter || student.identifier?.startsWith(classFilter);
    }), [students, classFilter]);

    const selectedClassLabel = classFilter === 'all' ? 'Alle klassen' : classFilter;
    const now = Date.now();
    const completedMissionCount = filteredStudents.reduce((sum, student) => sum + (student.stats?.missionsCompleted?.length || 0), 0);
    const missionProgressAverage = filteredStudents.length > 0 && missions.length > 0
        ? Math.round((completedMissionCount / (filteredStudents.length * missions.length)) * 100)
        : 0;

    const missionCards = useMemo(() => missions.slice(0, 5).map(mission => ({
        mission,
        image: getMissionImage(mission.id),
        progress: getMissionProgress(mission, filteredStudents),
        kerndoelen: getKerndoelenForMission(mission.id).slice(0, 2),
    })), [missions, filteredStudents]);

    const missionColumns = [
        { label: 'Nu actief', items: missionCards.slice(0, 2) },
        { label: 'Deze week', items: missionCards.slice(2, 3) },
        { label: 'Volgende les', items: missionCards.slice(3, 5) },
    ];

    const attentionStudents = useMemo(() => filteredStudents
        .map(student => {
            const daysInactive = getLastActiveMs(student) > 0 ? Math.floor((now - getLastActiveMs(student)) / DAY_MS) : 99;
            const xp = student.stats?.xp || 0;
            if (daysInactive > 7) return { student, reason: 'Lange inactiviteit' };
            if (xp < 50) return { student, reason: 'Hulp gevraagd bij Data Detective' };
            return null;
        })
        .filter(Boolean)
        .slice(0, 3) as { student: StudentData; reason: string }[], [filteredStudents, now]);

    const studentGroups = useMemo(() => {
        const sorted = [...filteredStudents].sort((a, b) => (b.stats?.xp || 0) - (a.stats?.xp || 0));
        return {
            leaders: sorted.slice(0, 3),
            help: attentionStudents.map(item => item.student).slice(0, 3),
        };
    }, [filteredStudents, attentionStudents]);

    const sloStats = useMemo(() => buildSloStats(filteredStudents, missions), [filteredStudents, missions]);
    const currentDgIndex = Math.max(61, missionProgressAverage);
    const growthPoints = [34, 38, 43, 49, 46, 53, 56, 60, currentDgIndex];

    const [insightLoading, setInsightLoading] = useState(false);
    const [insightError, setInsightError] = useState<string | null>(null);
    const [classInsight, setClassInsight] = useState<ClassInsight | null>(null);

    async function handleGenerateInsight() {
        setInsightLoading(true);
        setInsightError(null);
        try {
            const scope = classFilter !== 'all' ? classFilter : undefined;
            const result = await requestClassInsight(scope);
            setClassInsight(result);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Kon geen klas-inzicht genereren.';
            setInsightError(message);
        } finally {
            setInsightLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="rounded-2xl border border-lab-line bg-lab-paper/80 p-8 text-center text-sm font-bold text-lab-muted">
                Docentendashboard laden...
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-lab-ink">Docentendashboard</h1>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-bold text-lab-ink">
                        <span className="text-xl font-black">{selectedClassLabel}</span>
                        <span className="inline-flex items-center gap-2 text-lab-muted"><Users size={17} /> {filteredStudents.length} leerlingen</span>
                        <span className="inline-flex items-center gap-2 text-lab-muted"><span className="h-2 w-2 rounded-full bg-lab-sage" /> Les actief</span>
                        {activeEvents.length > 0 && (
                            <span className="rounded-full bg-lab-gold/20 px-2.5 py-1 text-xs font-black text-lab-olive">{activeEvents.length} actief event</span>
                        )}
                    </div>
                </div>
                <button
                    onClick={onToggleFocusMode}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-lab-coral bg-white px-7 text-sm font-black text-lab-ink transition hover:bg-lab-creamDeep"
                >
                    <Zap size={17} className={focusMode ? 'text-lab-sage' : 'text-lab-tealDark'} />
                    {focusMode && focusModeRemaining > 0 ? `${Math.floor(focusModeRemaining / 60)} min focus` : 'Focusmodus'}
                </button>
            </div>

            <section className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-lab-line bg-lab-paper p-5 shadow-sm lg:p-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-lab-ink">Missiekaart</h2>
                            <p className="mt-1 text-sm font-medium text-lab-muted">Overzicht van de leerreis van je klas</p>
                        </div>
                        <button onClick={() => onNavigate('slo')} className="flex items-center gap-3 rounded-xl border border-lab-line bg-white/80 px-4 py-3 text-left">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lab-tealDark text-sm font-black text-white">SLO</span>
                            <span className="text-sm font-black text-lab-ink">6 doelen actief<br /><span className="font-bold text-lab-tealDark">Bekijk SLO-overzicht</span></span>
                            <ArrowRight size={16} className="text-lab-tealDark" />
                        </button>
                    </div>

                    <div className="pointer-events-none my-4 h-20 rounded-xl bg-[linear-gradient(180deg,rgba(255,249,236,0),rgba(255,249,236,0.85)),url('/assets/agents/de_blauwdruk.webp')] bg-cover bg-center opacity-80 lg:h-24">
                        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_80%,rgba(217,120,72,0.14),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(93,139,85,0.18),transparent_26%)]" />
                    </div>

                    <div className="grid gap-4 xl:grid-cols-3">
                        {missionColumns.map((column, columnIndex) => (
                            <div key={column.label} className="rounded-2xl border border-lab-line bg-lab-paper p-3">
                                <div className={`mb-4 flex items-center justify-between gap-2 rounded-xl px-5 py-2 text-base font-black shadow-sm ${columnStyles[columnIndex]}`}>
                                    {column.label}
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/90 px-2 text-xs text-lab-ink">{column.items.length}</span>
                                </div>
                                <div className="space-y-3">
                                    {column.items.map((item) => (
                                        <button
                                            key={item.mission.id}
                                            onClick={() => onNavigate('progress')}
                                            className="w-full overflow-hidden rounded-xl border border-lab-line bg-white text-left transition hover:-translate-y-0.5 hover:border-lab-coral hover:shadow-md"
                                        >
                                            <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 p-4">
                                                <div className="h-24 w-24 overflow-hidden rounded-xl bg-lab-cream">
                                                    <MissionThumbnail image={item.image} name={item.mission.name} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex min-w-0 items-start justify-between gap-3">
                                                        <p className="line-clamp-2 min-w-0 text-base font-black leading-tight text-lab-ink">{item.mission.name}</p>
                                                        <span className="shrink-0 rounded-full border border-lab-line bg-lab-paper px-2.5 py-1 text-xs font-black leading-none text-lab-ink">
                                                            {item.progress.percentage}%
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-sm font-medium leading-tight text-lab-muted">{item.progress.started} gestart · {item.progress.completed} klaar</p>
                                                    <div className="mt-3 flex min-w-0 flex-wrap gap-1.5">
                                                        {item.kerndoelen.map(code => (
                                                            <span key={code} className="rounded-md bg-lab-sage/15 px-2 py-1 text-[10px] font-black text-lab-tealDark">SLO {code}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 border-t border-lab-line px-4 py-2">
                                                <div className="flex -space-x-2">
                                                    {item.progress.activeStudents.slice(0, 5).map(student => (
                                                        <span key={student.uid} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-lab-creamDeep text-[9px] font-black text-lab-ink">
                                                            {initials(student.displayName)}
                                                        </span>
                                                    ))}
                                                </div>
                                                {item.progress.activeStudents.length > 5 && <span className="ml-1 text-xs font-black text-lab-muted">+{item.progress.activeStudents.length - 5}</span>}
                                            </div>
                                        </button>
                                    ))}
                                    {columnIndex === 1 && (
                                        <button onClick={() => onNavigate('settings')} className="flex min-h-[96px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-lab-line px-4 text-sm font-bold text-lab-tealDark">
                                            <Plus size={18} />
                                            Missie toevoegen
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-5 rounded-xl border border-lab-line bg-white/70 px-4 py-3 text-xs font-bold text-lab-muted">
                        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lab-sage" /> Op schema</span>
                        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lab-gold" /> Bezig</span>
                        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lab-coral" /> Achter</span>
                        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lab-muted" /> Niet gestart</span>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    <Panel title="Aandacht" action={`${attentionStudents.length || 0}`}>
                        <div className="space-y-1">
                            {attentionStudents.length > 0 ? attentionStudents.map(item => (
                                <button key={item.student.uid} onClick={() => onSelectStudent(item.student)} className="flex w-full items-center gap-3 border-b border-lab-line py-2 text-left last:border-0">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lab-creamDeep text-xs font-black text-lab-ink">{initials(item.student.displayName)}</span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-black">{item.student.displayName || 'Naamloos'}</span>
                                        <span className="block text-xs font-medium text-lab-coral">{item.reason}</span>
                                    </span>
                                    <ChevronRight size={16} />
                                </button>
                            )) : <p className="text-sm font-bold text-lab-tealDark">Geen aandachtspunten.</p>}
                        </div>
                    </Panel>

                    <Panel title="SLO dekking" buttonLabel="Bekijk alle SLO" onButtonClick={() => onNavigate('slo')}>
                        <div className="space-y-3">
                            {sloStats.map(stat => {
                                const Icon = stat.icon;
                                const colors = colorMap[stat.color];
                                return (
                                    <div key={stat.label} className="flex items-center gap-3">
                                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors.icon}`}><Icon size={14} /></span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="truncate text-xs font-bold">{stat.label}</p>
                                                <p className="text-sm font-black">{stat.percentage}%</p>
                                            </div>
                                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-lab-line/50">
                                                <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${stat.percentage}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Panel>

                    <Panel title="Groei deze week" buttonLabel="DG-index">
                        <GrowthWeekChart values={growthPoints} currentValue={currentDgIndex} />
                    </Panel>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px_300px]">
                <div className="rounded-2xl border border-lab-line bg-lab-paper p-4 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-[160px_1fr_1fr_1fr_160px] md:items-center">
                        <div className="flex items-center gap-3">
                            <Flag className="text-lab-coral" size={28} />
                            <div><p className="text-sm font-black">Klasprogressie</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full border-[6px] border-lab-sage text-lg font-black">{missionProgressAverage}%</div>
                            <p className="text-xs font-bold text-lab-muted">Gemiddelde missievoortgang</p>
                        </div>
                        <MiniAvatarGroup label="Meest voortgang" students={studentGroups.leaders} />
                        <MiniAvatarGroup label="Hulp nodig" students={studentGroups.help} />
                        <div className="text-sm font-bold">Volgende mijlpaal<br /><span className="text-xs text-lab-muted">6 van 10 missies gemiddeld</span></div>
                    </div>
                </div>

                <div className="rounded-2xl border border-lab-line bg-lab-tealDark/5 p-4 shadow-sm">
                    <p className="text-xs font-black uppercase text-lab-muted">Volgende les</p>
                    <h3 className="mt-1 text-lg font-black">3. Verhalenmakers</h3>
                    <p className="mt-1 text-xs font-bold text-lab-muted">Les 2: Structuur & Perspectief</p>
                    <div className="mt-4 flex gap-2">
                        <button onClick={() => onNavigate('games')} className="rounded-lg bg-lab-tealDark px-4 py-2 text-sm font-black text-white">Les openen</button>
                        <button onClick={() => onNavigate('documenten')} className="rounded-lg border border-lab-line bg-white px-3 py-2 text-sm font-black">Voorbereiding</button>
                    </div>
                </div>

                <Panel title="Aanbevolen acties" action="3 nieuw">
                    <div className="space-y-2">
                        <ActionRow label="Versterk digitale veiligheid" onClick={() => onNavigate('slo')} />
                        <ActionRow label="Samenwerken stimuleren" onClick={() => onNavigate('students')} />
                        <ActionRow label="Laat creativiteit zien" onClick={onSendMessage} />
                        <button onClick={() => onNavigate('progress')} className="mt-2 text-sm font-black text-lab-coral">Bekijk rapport</button>
                    </div>
                </Panel>
            </section>

            <section>
                <Panel title="Klas-inzicht">
                    {!classInsight && !insightLoading && !insightError && (
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-lab-muted">
                                Genereer een AI-samenvatting van waar{' '}
                                {classFilter !== 'all' ? `klas ${classFilter}` : 'de klas'}{' '}
                                vastloopt. Gebaseerd op anonieme voortgangsdata — geen namen zichtbaar voor de AI.
                            </p>
                            <button
                                onClick={handleGenerateInsight}
                                className="flex items-center gap-2 rounded-lg bg-lab-tealDark px-4 py-2 text-sm font-black text-white"
                            >
                                <Sparkles size={14} />
                                Genereer samenvatting
                            </button>
                        </div>
                    )}

                    {insightLoading && (
                        <div className="flex items-center gap-2 text-sm font-bold text-lab-muted">
                            <Clock size={14} className="animate-spin" />
                            Samenvatting wordt gegenereerd...
                        </div>
                    )}

                    {insightError && (
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-lab-coral">
                                {insightError.toLowerCase().includes('mfa') || insightError.toLowerCase().includes('verificatie')
                                    ? 'Zet MFA aan om klas-inzicht te zien. Ga naar je accountinstellingen.'
                                    : insightError}
                            </p>
                            <button
                                onClick={handleGenerateInsight}
                                className="rounded-lg border border-lab-line bg-white px-3 py-2 text-xs font-bold"
                            >
                                Opnieuw proberen
                            </button>
                        </div>
                    )}

                    {classInsight && !insightLoading && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-bold text-lab-muted">
                                    {classInsight.classScope} &middot; {classInsight.classSize} leerling{classInsight.classSize !== 1 ? 'en' : ''}
                                </p>
                                <button
                                    onClick={handleGenerateInsight}
                                    className="text-xs font-bold text-lab-coral"
                                >
                                    Vernieuwen
                                </button>
                            </div>

                            {classInsight.note && (
                                <p className="text-xs font-bold text-lab-muted">{classInsight.note}</p>
                            )}

                            {classInsight.points.length > 0 && (
                                <div className="space-y-3">
                                    {classInsight.points.map((point, i) => (
                                        <div
                                            key={i}
                                            className="rounded-xl border border-lab-line bg-white p-3"
                                        >
                                            <p className="text-sm font-black text-lab-ink">{point.title}</p>
                                            <p className="mt-1 text-xs font-bold text-lab-muted">{point.observation}</p>
                                            <p className="mt-1 text-xs font-bold text-lab-tealDark">{point.suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {classInsight.points.length === 0 && !classInsight.note && (
                                <p className="text-xs font-bold text-lab-muted">Geen aandachtspunten gevonden.</p>
                            )}

                            <div className="flex items-center gap-1.5 rounded-lg border border-lab-gold/40 bg-lab-gold/10 px-3 py-2">
                                <AlertTriangle size={12} className="shrink-0 text-lab-olive" />
                                <p className="text-[11px] font-bold text-lab-olive">
                                    AI-gegenereerd — controleer dit zelf
                                </p>
                            </div>
                        </div>
                    )}
                </Panel>
            </section>
        </div>
    );
};

function GrowthWeekChart({ values, currentValue }: { values: number[]; currentValue: number }) {
    const benchmarkValues = [31, 33, 36, 39, 41, 44, 47, 49, 51];
    const classPoints = toChartPoints(values);
    const benchmarkPoints = toChartPoints(benchmarkValues);
    const classPolyline = pointsToPolyline(classPoints);
    const benchmarkPolyline = pointsToPolyline(benchmarkPoints);
    const areaPath = `M ${classPolyline} L 302,104 L 18,104 Z`;
    const weeklyDelta = Math.max(0, currentValue - values[0]);

    return (
        <div className="overflow-hidden rounded-xl border border-lab-line bg-white">
            <div className="flex items-start justify-between gap-3 px-4 pt-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-lab-muted">Klasgemiddelde</p>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-4xl font-black leading-none text-lab-tealDark">{currentValue}</span>
                        <span className="text-xs font-black text-lab-tealDark">DG</span>
                    </div>
                </div>
                <div className="rounded-lg bg-lab-sage/15 px-3 py-2 text-right">
                    <p className="text-sm font-black leading-none text-lab-tealDark">+{weeklyDelta}</p>
                    <p className="mt-1 text-[10px] font-bold text-lab-tealDark">deze week</p>
                </div>
            </div>

            <div className="relative mt-1 h-32 px-2 pb-1">
                <svg viewBox="0 0 320 116" className="h-full w-full" role="img" aria-label={`DG-index groei deze week: klas staat op ${currentValue}`}>
                    <defs>
                        <linearGradient id="growthWeekFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#5F947D" stopOpacity="0.20" />
                            <stop offset="100%" stopColor="#5F947D" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <line x1="18" y1="26" x2="302" y2="26" stroke="#E7D8BD" strokeDasharray="3 7" />
                    <line x1="18" y1="64" x2="302" y2="64" stroke="#E7D8BD" strokeDasharray="3 7" />
                    <line x1="18" y1="104" x2="302" y2="104" stroke="#E7D8BD" />
                    <path d={areaPath} fill="url(#growthWeekFill)" />
                    <polyline points={benchmarkPolyline} fill="none" stroke="#445865" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" />
                    <polyline points={classPolyline} fill="none" stroke="#5F947D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    {classPoints.map((point, index) => (
                        <circle
                            key={`${point.value}-${index}`}
                            cx={point.x}
                            cy={point.y}
                            r={index === classPoints.length - 1 ? 5 : 3.5}
                            fill="#FFFDF7"
                            stroke="#5F947D"
                            strokeWidth={index === classPoints.length - 1 ? 4 : 3}
                        />
                    ))}
                    <text x="18" y="114" fill="#445865" fontSize="9" fontWeight="700">ma</text>
                    <text x="284" y="114" fill="#445865" fontSize="9" fontWeight="700">vandaag</text>
                </svg>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-lab-line px-4 py-3 text-[11px] font-bold text-lab-muted">
                <span className="inline-flex items-center gap-2"><span aria-hidden="true" style={{ display: 'block', width: 20, height: 8, borderRadius: 999, background: '#5F947D' }} /> Klas</span>
                <span className="inline-flex items-center gap-2"><span aria-hidden="true" style={{ display: 'block', width: 20, borderTop: '2px dashed #445865' }} /> Vorige week</span>
            </div>
        </div>
    );
}

function Panel({
    title,
    children,
    action,
    buttonLabel,
    onButtonClick,
}: {
    title: string;
    children: React.ReactNode;
    action?: string;
    buttonLabel?: string;
    onButtonClick?: () => void;
}) {
    return (
        <div className="rounded-2xl border border-lab-line bg-lab-paper p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-xl font-black text-lab-ink">{title}</h3>
                {action && <span className="rounded-full bg-lab-creamDeep px-2.5 py-1 text-xs font-black text-lab-coral">{action}</span>}
                {buttonLabel && <button onClick={onButtonClick} className="rounded-lg border border-lab-line bg-white px-3 py-2 text-xs font-bold">{buttonLabel}</button>}
            </div>
            {children}
        </div>
    );
}

function MiniAvatarGroup({ label, students }: { label: string; students: StudentData[] }) {
    return (
        <div>
            <p className="mb-2 text-xs font-black">{label}</p>
            <div className="flex -space-x-2">
                {students.length > 0 ? students.map(student => (
                    <span key={student.uid} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-lab-gold/20 text-[10px] font-black text-lab-olive">
                        {initials(student.displayName)}
                    </span>
                )) : <span className="text-xs font-bold text-lab-muted">Geen data</span>}
            </div>
        </div>
    );
}

function ActionRow({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button onClick={onClick} className="flex w-full items-center justify-between rounded-lg border-b border-lab-line py-2 text-left text-sm font-bold last:border-0">
            {label}
            <ChevronRight size={15} />
        </button>
    );
}
