import React, { useMemo, useState } from 'react';
import {
    AlertTriangle,
    ArrowRight,
    BookOpen,
    ChevronRight,
    Clock,
    Flag,
    Map,
    Plus,
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
            <div className="flex h-full w-full items-center justify-center text-duck-ink/40" aria-label={`${name} thumbnail niet beschikbaar`}>
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

const colorMap: Record<string, { icon: string; bar: string }> = {
    sage: { icon: 'bg-duck-gray/15 text-duck-ink', bar: 'bg-duck-gray' },
    terracotta: { icon: 'bg-duck-error/10 text-duck-error', bar: 'bg-duck-error' },
    amber: { icon: 'bg-duck-acid/25 text-duck-ink', bar: 'bg-duck-acid' },
    sky: { icon: 'bg-duck-ink/10 text-duck-ink', bar: 'bg-duck-ink' },
};

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

    const missionCards = useMemo(() => missions.slice(0, 6).map(mission => ({
        mission,
        image: getMissionImage(mission.id),
        progress: getMissionProgress(mission, filteredStudents),
        kerndoelen: getKerndoelenForMission(mission.id).slice(0, 2),
    })), [missions, filteredStudents]);

    const sortedMissionCards = useMemo(
        () => [...missionCards].sort((a, b) => b.progress.started - a.progress.started),
        [missionCards],
    );

    const sloGoalCount = useMemo(
        () => new Set(missions.flatMap(mission => getKerndoelenForMission(mission.id))).size,
        [missions],
    );

    const attentionStudents = useMemo(() => filteredStudents
        .map(student => {
            const daysInactive = getLastActiveMs(student) > 0 ? Math.floor((now - getLastActiveMs(student)) / DAY_MS) : 99;
            const xp = student.stats?.xp || 0;
            if (daysInactive > 7) return { student, reason: 'Lange inactiviteit' };
            if (xp < 50) return { student, reason: 'Lage voortgang' };
            return null;
        })
        .filter(Boolean)
        .slice(0, 4) as { student: StudentData; reason: string }[], [filteredStudents, now]);

    const studentGroups = useMemo(() => {
        const sorted = [...filteredStudents].sort((a, b) => (b.stats?.xp || 0) - (a.stats?.xp || 0));
        return {
            leaders: sorted.slice(0, 3),
            help: attentionStudents.map(item => item.student).slice(0, 3),
        };
    }, [filteredStudents, attentionStudents]);

    const sloStats = useMemo(() => buildSloStats(filteredStudents, missions), [filteredStudents, missions]);

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
            <div className="rounded-2xl border border-duck-ink/15 bg-duck-bgLight p-8 text-center text-sm font-medium text-duck-ink/60">
                Docentendashboard laden...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-duck-ink">Docentendashboard</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium text-duck-ink/60">
                        <span className="text-base font-bold text-duck-ink">{selectedClassLabel}</span>
                        <span className="inline-flex items-center gap-1.5"><Users size={16} /> {filteredStudents.length} leerlingen</span>
                        {activeEvents.length > 0 && (
                            <span className="rounded-full bg-duck-acid/20 px-2.5 py-1 text-xs font-bold text-duck-ink">{activeEvents.length} actief event</span>
                        )}
                    </div>
                </div>
                <button
                    onClick={onToggleFocusMode}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-6 text-sm font-bold transition ${
                        focusMode
                            ? 'border-duck-ink bg-duck-ink text-white hover:bg-duck-ink/90'
                            : 'border-duck-ink/15 bg-white text-duck-ink hover:border-duck-gray'
                    }`}
                >
                    <Zap size={17} />
                    {focusMode && focusModeRemaining > 0 ? `${Math.floor(focusModeRemaining / 60)} min focus` : 'Focusmodus'}
                </button>
            </div>

            <section className="space-y-6">
                <div className="rounded-2xl border border-duck-ink/15 bg-duck-bgLight p-5 shadow-sm lg:p-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-duck-ink">Missiekaart</h2>
                            <p className="mt-1 text-sm font-medium text-duck-ink/60">Waar je klas op dit moment aan werkt</p>
                        </div>
                        <button onClick={() => onNavigate('slo')} className="flex items-center gap-3 rounded-xl border border-duck-ink/15 bg-white px-4 py-3 text-left transition hover:border-duck-gray">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-duck-ink text-sm font-black text-white">SLO</span>
                            <span className="text-sm font-bold text-duck-ink">{sloGoalCount} doelen in beeld<br /><span className="font-medium text-duck-ink/60">Bekijk SLO-overzicht</span></span>
                            <ArrowRight size={16} className="text-duck-ink" />
                        </button>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {sortedMissionCards.map((item) => (
                            <button
                                key={item.mission.id}
                                onClick={() => onNavigate('progress')}
                                className="w-full overflow-hidden rounded-xl border border-duck-ink/15 bg-white text-left transition hover:-translate-y-0.5 hover:border-duck-gray hover:shadow-md"
                            >
                                <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 p-4">
                                    <div className="h-[88px] w-[88px] overflow-hidden rounded-xl bg-duck-bg">
                                        <MissionThumbnail image={item.image} name={item.mission.name} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex min-w-0 items-start justify-between gap-3">
                                            <p className="line-clamp-2 min-w-0 text-base font-bold leading-tight text-duck-ink">{item.mission.name}</p>
                                            <span className="shrink-0 rounded-full border border-duck-ink/15 bg-duck-bg px-2.5 py-1 text-xs font-black leading-none text-duck-ink">
                                                {item.progress.percentage}%
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm font-medium leading-tight text-duck-ink/60">{item.progress.started} gestart · {item.progress.completed} klaar</p>
                                        <div className="mt-3 flex min-w-0 flex-wrap gap-1.5">
                                            {item.kerndoelen.map(code => (
                                                <span key={code} className="rounded-md bg-duck-gray/15 px-2 py-1 text-[10px] font-bold text-duck-ink">SLO {code}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {item.progress.activeStudents.length > 0 && (
                                    <div className="flex items-center gap-1 border-t border-duck-ink/15 px-4 py-2">
                                        <div className="flex -space-x-2">
                                            {item.progress.activeStudents.slice(0, 5).map(student => (
                                                <span key={student.uid} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-duck-acid/20 text-[9px] font-black text-duck-ink">
                                                    {initials(student.displayName)}
                                                </span>
                                            ))}
                                        </div>
                                        {item.progress.activeStudents.length > 5 && <span className="ml-1 text-xs font-bold text-duck-ink/60">+{item.progress.activeStudents.length - 5}</span>}
                                    </div>
                                )}
                            </button>
                        ))}
                        <button onClick={() => onNavigate('settings')} className="flex min-h-[120px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-duck-ink/15 px-4 text-sm font-medium text-duck-ink/60 transition hover:border-duck-gray hover:text-duck-ink">
                            <Plus size={18} />
                            Missie toevoegen
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Panel title="Aandacht" action={`${attentionStudents.length || 0}`}>
                        <div className="space-y-1">
                            {attentionStudents.length > 0 ? attentionStudents.map(item => (
                                <button key={item.student.uid} onClick={() => onSelectStudent(item.student)} className="flex w-full items-center gap-3 border-b border-duck-ink/15 py-2 text-left last:border-0">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-duck-bg text-xs font-black text-duck-ink">{initials(item.student.displayName)}</span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-bold text-duck-ink">{item.student.displayName || 'Naamloos'}</span>
                                        <span className="block text-xs font-medium text-duck-error">{item.reason}</span>
                                    </span>
                                    <ChevronRight size={16} className="text-duck-ink/60" />
                                </button>
                            )) : <p className="text-sm font-medium text-duck-ink/60">Geen aandachtspunten — iedereen op koers.</p>}
                        </div>
                    </Panel>

                    <Panel title="SLO dekking" buttonLabel="Bekijk alle SLO" onButtonClick={() => onNavigate('slo')}>
                        <div className="space-y-3">
                            {sloStats.map(stat => {
                                const Icon = stat.icon;
                                const colors = colorMap[stat.color];
                                return (
                                    <div key={stat.label} className="flex items-center gap-3">
                                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors.icon}`}><Icon size={14} /></span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="truncate text-xs font-medium text-duck-ink">{stat.label}</p>
                                                <p className="text-sm font-black text-duck-ink">{stat.percentage}%</p>
                                            </div>
                                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-duck-ink/10">
                                                <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${stat.percentage}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Panel>
                </div>

                <div className="rounded-2xl border border-duck-ink/15 bg-duck-bgLight p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <Flag className="text-duck-error" size={20} />
                        <h3 className="text-lg font-bold text-duck-ink">Klasprogressie</h3>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[6px] border-duck-acid text-base font-black text-duck-ink">{missionProgressAverage}%</div>
                            <p className="text-xs font-medium text-duck-ink/60">Gemiddelde missievoortgang</p>
                        </div>
                        <MiniAvatarGroup label="Meest voortgang" students={studentGroups.leaders} />
                        <MiniAvatarGroup label="Hulp nodig" students={studentGroups.help} />
                    </div>
                </div>
            </section>

            <section>
                <Panel title="Klas-inzicht">
                    {!classInsight && !insightLoading && !insightError && (
                        <div className="space-y-3">
                            <p className="text-xs font-medium text-duck-ink/60">
                                Genereer een AI-samenvatting van waar{' '}
                                {classFilter !== 'all' ? `klas ${classFilter}` : 'de klas'}{' '}
                                vastloopt. Gebaseerd op anonieme voortgangsdata — geen namen zichtbaar voor de AI.
                            </p>
                            <button
                                onClick={handleGenerateInsight}
                                className="flex items-center gap-2 rounded-lg bg-duck-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-duck-ink/90"
                            >
                                <Sparkles size={14} />
                                Genereer samenvatting
                            </button>
                        </div>
                    )}

                    {insightLoading && (
                        <div className="flex items-center gap-2 text-sm font-medium text-duck-ink/60">
                            <Clock size={14} className="animate-spin" />
                            Samenvatting wordt gegenereerd...
                        </div>
                    )}

                    {insightError && (
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-duck-error">
                                {insightError.toLowerCase().includes('mfa') || insightError.toLowerCase().includes('verificatie')
                                    ? 'Zet MFA aan om klas-inzicht te zien. Ga naar je accountinstellingen.'
                                    : insightError}
                            </p>
                            <button
                                onClick={handleGenerateInsight}
                                className="rounded-lg border border-duck-ink/15 bg-white px-3 py-2 text-xs font-bold text-duck-ink transition hover:border-duck-gray"
                            >
                                Opnieuw proberen
                            </button>
                        </div>
                    )}

                    {classInsight && !insightLoading && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-medium text-duck-ink/60">
                                    {classInsight.classScope} &middot; {classInsight.classSize} leerling{classInsight.classSize !== 1 ? 'en' : ''}
                                </p>
                                <button
                                    onClick={handleGenerateInsight}
                                    className="text-xs font-bold text-duck-ink/60 transition hover:text-duck-ink"
                                >
                                    Vernieuwen
                                </button>
                            </div>

                            {classInsight.note && (
                                <p className="text-xs font-medium text-duck-ink/60">{classInsight.note}</p>
                            )}

                            {classInsight.points.length > 0 && (
                                <div className="space-y-3">
                                    {classInsight.points.map((point, i) => (
                                        <div
                                            key={i}
                                            className="rounded-xl border border-duck-ink/15 bg-white p-3"
                                        >
                                            <p className="text-sm font-bold text-duck-ink">{point.title}</p>
                                            <p className="mt-1 text-xs font-medium text-duck-ink/60">{point.observation}</p>
                                            <p className="mt-1 text-xs font-medium text-duck-ink">{point.suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {classInsight.points.length === 0 && !classInsight.note && (
                                <p className="text-xs font-medium text-duck-ink/60">Geen aandachtspunten gevonden.</p>
                            )}

                            <div className="flex items-center gap-1.5 rounded-lg border border-duck-acid/40 bg-duck-acid/10 px-3 py-2">
                                <AlertTriangle size={12} className="shrink-0 text-duck-ink" />
                                <p className="text-[11px] font-medium text-duck-ink">
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
        <div className="rounded-2xl border border-duck-ink/15 bg-duck-bgLight p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-duck-ink">{title}</h3>
                {action && <span className="rounded-full bg-duck-bg px-2.5 py-1 text-xs font-black text-duck-error">{action}</span>}
                {buttonLabel && <button onClick={onButtonClick} className="rounded-lg border border-duck-ink/15 bg-white px-3 py-2 text-xs font-bold text-duck-ink transition hover:border-duck-gray">{buttonLabel}</button>}
            </div>
            {children}
        </div>
    );
}

function MiniAvatarGroup({ label, students }: { label: string; students: StudentData[] }) {
    return (
        <div>
            <p className="mb-2 text-xs font-bold text-duck-ink">{label}</p>
            <div className="flex -space-x-2">
                {students.length > 0 ? students.map(student => (
                    <span key={student.uid} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-duck-acid/20 text-[10px] font-black text-duck-ink">
                        {initials(student.displayName)}
                    </span>
                )) : <span className="text-xs font-medium text-duck-ink/60">Geen data</span>}
            </div>
        </div>
    );
}
