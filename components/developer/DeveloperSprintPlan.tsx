import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Circle,
    Clock,
    Flag,
    AlertTriangle,
    ChevronDown,
    ChevronRight,
    Palmtree,
    Zap,
    Target,
    CalendarDays,
} from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────────

interface SprintTask {
    id: string;
    title: string;
    time: string;
    claudeDoes: string;
    priority: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
}

interface Sprint {
    id: string;
    number: number;
    title: string;
    subtitle: string;
    dateRange: string;
    startDate: string; // ISO YYYY-MM-DD
    endDate: string;
    hours: string;
    isPause?: boolean;
    focusPriority: string;
    tasks: SprintTask[];
}

const PRIORITY_LABELS: Record<string, string> = {
    p1: 'Opdrachten',
    p2: 'UI/UX',
    p3: 'Bugs',
    p4: 'Zakelijk',
    p5: 'Homepage',
    p6: 'Dashboard',
};

const PRIORITY_COLORS: Record<string, string> = {
    p1: 'bg-rose-50 text-rose-600 border-rose-100',
    p2: 'bg-violet-50 text-violet-600 border-violet-100',
    p3: 'bg-orange-50 text-orange-600 border-orange-100',
    p4: 'bg-amber-50 text-amber-700 border-amber-100',
    p5: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    p6: 'bg-teal-50 text-teal-600 border-teal-100',
};

const SPRINTS: Sprint[] = [
    {
        id: 's1',
        number: 1,
        title: 'Opdrachten (deel 1)',
        subtitle: 'Security fix + start missie-review',
        dateRange: '1–8 mrt',
        startDate: '2026-03-01',
        endDate: '2026-03-08',
        hours: '~4–5 uur',
        focusPriority: 'p1',
        tasks: [
            { id: 's1-t1', title: 'Security fix: systemInstruction server-side valideren', time: '2u', claudeDoes: 'Code schrijven + deployen', priority: 'p1' },
            { id: 's1-t2', title: 'Missie-review starten: jaar 1, periode 1+2', time: '3u', claudeDoes: 'Review-rapport per missie', priority: 'p1' },
        ],
    },
    {
        id: 'pause',
        number: 0,
        title: 'Schoolreis',
        subtitle: 'Geen werk. Geniet van de reis.',
        dateRange: '9–14 mrt',
        startDate: '2026-03-09',
        endDate: '2026-03-14',
        hours: '',
        focusPriority: 'p1',
        isPause: true,
        tasks: [],
    },
    {
        id: 's2',
        number: 2,
        title: 'Opdrachten (deel 2)',
        subtitle: 'Missies afronden + branding starten',
        dateRange: '15–28 mrt',
        startDate: '2026-03-15',
        endDate: '2026-03-28',
        hours: '~10 uur',
        focusPriority: 'p1',
        tasks: [
            { id: 's2-t1', title: 'Missie-review afronden: jaar 1 p3+4, jaar 2+3', time: '3u', claudeDoes: 'Review-rapport', priority: 'p1' },
            { id: 's2-t2', title: 'Gap-analyse: welke SLO kerndoelen missen een missie?', time: '1u', claudeDoes: 'Analyse + aanbeveling', priority: 'p1' },
            { id: 's2-t3', title: 'Top-3 ontbrekende missies schrijven', time: '3u', claudeDoes: 'Missies schrijven', priority: 'p1' },
            { id: 's2-t4', title: 'Didactische onderbouwing schrijven (visie, leerlijnen)', time: '2u', claudeDoes: 'Concept + SLO-mapping check', priority: 'p1' },
            { id: 's2-t5', title: 'Branding document: visie, missie, tone-of-voice', time: '1u', claudeDoes: 'Concept schrijven', priority: 'p2' },
        ],
    },
    {
        id: 's3',
        number: 3,
        title: 'UI/UX + Bugs',
        subtitle: 'Professionele uitstraling + zakelijk fundament',
        dateRange: '29 mrt – 11 apr',
        startDate: '2026-03-29',
        endDate: '2026-04-11',
        hours: '~10 uur',
        focusPriority: 'p2',
        tasks: [
            { id: 's3-t1', title: 'UI consistency check: lab-* tokens, typografie, spacing', time: '2u', claudeDoes: 'Audit + fixes', priority: 'p2' },
            { id: 's3-t2', title: 'Bug hunt: volledige flow doorlopen (login → missie → afronden)', time: '3u', claudeDoes: 'Testen + fixen', priority: 'p3' },
            { id: 's3-t3', title: 'Lighthouse audit + top-5 performance issues fixen', time: '2u', claudeDoes: 'Audit + code fixes', priority: 'p3' },
            { id: 's3-t4', title: 'Responsive check: mobiel, tablet, desktop', time: '1u', claudeDoes: 'Testen + fixen', priority: 'p3' },
            { id: 's3-t5', title: 'Zakelijk: KvK, bank, BTW, verzekering, AV', time: '2u', claudeDoes: 'Checklist + advies', priority: 'p4' },
        ],
    },
    {
        id: 's4',
        number: 4,
        title: 'Homepage + Dashboard',
        subtitle: 'Etalage + docentervaring verbeteren',
        dateRange: '12–25 apr',
        startDate: '2026-04-12',
        endDate: '2026-04-25',
        hours: '~10 uur',
        focusPriority: 'p5',
        tasks: [
            { id: 's4-t1', title: 'Homepage: AI Chat Demo + Dashboard Demo secties afmaken', time: '2u', claudeDoes: 'Componenten bouwen', priority: 'p5' },
            { id: 's4-t2', title: 'Homepage: conversie-optimalisatie (CTA, social proof)', time: '2u', claudeDoes: 'Copy + design', priority: 'p5' },
            { id: 's4-t3', title: 'Homepage: SEO meta tags, alt texts, schema markup', time: '1u', claudeDoes: 'SEO audit + fixes', priority: 'p5' },
            { id: 's4-t4', title: 'Docentendashboard: UX vereenvoudigen (5-min onboarding)', time: '3u', claudeDoes: 'Redesign waar nodig', priority: 'p6' },
            { id: 's4-t5', title: 'Docentendashboard: focus mode + groepen testen', time: '1u', claudeDoes: 'Testen + fixen', priority: 'p6' },
            { id: 's4-t6', title: 'Pilotovereenkomst + pricing finaliseren', time: '2u', claudeDoes: 'Documenten schrijven', priority: 'p4' },
        ],
    },
    {
        id: 's5',
        number: 5,
        title: 'Go-to-Market',
        subtitle: 'Eerste klant(en) binnenhalen',
        dateRange: '26 apr – 9 mei',
        startDate: '2026-04-26',
        endDate: '2026-05-09',
        hours: '~8 uur',
        focusPriority: 'p5',
        tasks: [
            { id: 's5-t1', title: 'One-pager / pitch deck voor ICT-coördinatoren', time: '3u', claudeDoes: 'Content + design', priority: 'p5' },
            { id: 's5-t2', title: 'Eigen school als eerste pilot voorstellen', time: '1u', claudeDoes: 'Pitch voorbereiden', priority: 'p5' },
            { id: 's5-t3', title: '3–5 scholen in netwerk benaderen', time: '2u', claudeDoes: 'Outreach templates', priority: 'p5' },
            { id: 's5-t4', title: 'Compliance-hub pagina publiceren met alle docs', time: '1u', claudeDoes: 'Pagina updaten', priority: 'p4' },
            { id: 's5-t5', title: 'Aanmelden bij Kennisgroep ICT (Kennisnet)', time: '1u', claudeDoes: 'Aanmelding voorbereiden', priority: 'p5' },
        ],
    },
    {
        id: 's6',
        number: 6,
        title: 'Pilot Draaien',
        subtitle: 'Uitvoeren en leren',
        dateRange: 'mei – juni',
        startDate: '2026-05-10',
        endDate: '2026-06-30',
        hours: '~6–8 uur/week',
        focusPriority: 'p6',
        tasks: [
            { id: 's6-t1', title: 'Onboarding flow voor docenten bouwen/testen', time: '4u', claudeDoes: 'UX bouwen', priority: 'p6' },
            { id: 's6-t2', title: 'Wekelijks feedback verzamelen (korte survey)', time: '1u/week', claudeDoes: 'Survey opstellen', priority: 'p6' },
            { id: 's6-t3', title: 'Top-3 feedbackpunten per week verwerken', time: '3u/week', claudeDoes: 'Code fixes', priority: 'p6' },
            { id: 's6-t4', title: "KPI's bijhouden (gebruik, retentie, NPS)", time: '1u/week', claudeDoes: 'Dashboard inrichten', priority: 'p6' },
        ],
    },
];

const STORAGE_KEY = 'dgskills-sprint-plan-v1';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getSprintStatus(sprint: Sprint): 'done' | 'active' | 'upcoming' | 'pause' {
    if (sprint.isPause) return 'pause';
    const now = new Date();
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    end.setHours(23, 59, 59);
    if (now > end) return 'done';
    if (now >= start && now <= end) return 'active';
    return 'upcoming';
}

function daysUntil(dateStr: string): number {
    const target = new Date(dateStr);
    const now = new Date();
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntilDeadline(): number {
    return daysUntil('2026-05-09');
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DeveloperSprintPlan() {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    // Load from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setChecked(JSON.parse(stored));
        } catch { /* ignore */ }
    }, []);

    // Persist to localStorage
    const toggleTask = (taskId: string) => {
        setChecked(prev => {
            const next = { ...prev, [taskId]: !prev[taskId] };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
            return next;
        });
    };

    const toggleCollapse = (sprintId: string) => {
        setCollapsed(prev => ({ ...prev, [sprintId]: !prev[sprintId] }));
    };

    const totalTasks = SPRINTS.flatMap(s => s.tasks).length;
    const doneTasks = SPRINTS.flatMap(s => s.tasks).filter(t => checked[t.id]).length;
    const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const deadlineDays = daysUntilDeadline();

    return (
        <div className="space-y-8 max-w-4xl">

            {/* ── Top stats ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Voortgang</p>
                    <p className="text-3xl font-black text-slate-900">{pct}%</p>
                    <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Taken</p>
                    <p className="text-3xl font-black text-slate-900">{doneTasks}<span className="text-lg text-slate-400">/{totalTasks}</span></p>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">afgevinkt</p>
                </div>

                <div className={`p-5 rounded-2xl border shadow-sm ${deadlineDays <= 14 ? 'bg-red-50 border-red-100' : deadlineDays <= 30 ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-200'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deadline</p>
                    <p className={`text-3xl font-black ${deadlineDays <= 14 ? 'text-red-600' : deadlineDays <= 30 ? 'text-amber-600' : 'text-slate-900'}`}>{deadlineDays}d</p>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">tot 9 mei 2026</p>
                </div>

                <div className="bg-indigo-600 p-5 rounded-2xl shadow-sm shadow-indigo-200">
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Harde deadline</p>
                    <p className="text-lg font-black text-white leading-tight">Inkoopvenster scholen</p>
                    <p className="text-[10px] text-indigo-300 mt-2 font-medium">Feb–mei 2026</p>
                </div>
            </div>

            {/* ── Priority legenda ───────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                    <span key={key} className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${PRIORITY_COLORS[key]}`}>
                        {key.toUpperCase()} — {label}
                    </span>
                ))}
            </div>

            {/* ── Sprints ────────────────────────────────────────────────── */}
            <div className="space-y-4">
                {SPRINTS.map((sprint) => {
                    const status = getSprintStatus(sprint);
                    const isCollapsed = collapsed[sprint.id];
                    const sprintDone = sprint.tasks.filter(t => checked[t.id]).length;
                    const sprintTotal = sprint.tasks.length;
                    const sprintPct = sprintTotal > 0 ? Math.round((sprintDone / sprintTotal) * 100) : 0;

                    if (sprint.isPause) {
                        return (
                            <div key={sprint.id} className="flex items-center gap-4 px-6 py-4 bg-amber-50 border border-amber-100 rounded-2xl">
                                <Palmtree size={20} className="text-amber-500 shrink-0" />
                                <div>
                                    <p className="font-black text-amber-800 text-sm uppercase tracking-tight">Schoolreis — {sprint.dateRange}</p>
                                    <p className="text-[11px] text-amber-600">{sprint.subtitle}</p>
                                </div>
                            </div>
                        );
                    }

                    const statusConfig = {
                        active: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'Actief' },
                        done: { dot: 'bg-slate-300', badge: 'bg-slate-50 text-slate-400 border-slate-100', label: 'Gereed' },
                        upcoming: { dot: 'bg-slate-200', badge: 'bg-slate-50 text-slate-400 border-slate-100', label: 'Gepland' },
                        pause: { dot: 'bg-amber-300', badge: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Pauze' },
                    }[status];

                    return (
                        <div
                            key={sprint.id}
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${status === 'active' ? 'border-indigo-300 shadow-md shadow-indigo-100' : 'border-slate-200'}`}
                        >
                            {/* Sprint header */}
                            <button
                                onClick={() => toggleCollapse(sprint.id)}
                                className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                            >
                                <div className="shrink-0 flex flex-col items-center gap-1">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${status === 'active' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300' : status === 'done' ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                        {sprintPct === 100 ? <CheckCircle2 size={16} /> : sprint.number}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className={`font-black text-base truncate ${status === 'done' ? 'text-slate-400' : 'text-slate-900'}`}>
                                            Sprint {sprint.number} — {sprint.title}
                                        </h3>
                                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusConfig.badge}`}>
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium truncate">{sprint.subtitle}</p>
                                </div>

                                <div className="shrink-0 flex items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                            <CalendarDays size={12} />
                                            {sprint.dateRange}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                            <Clock size={12} />
                                            {sprint.hours}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-slate-500">{sprintDone}/{sprintTotal}</span>
                                        {isCollapsed ? <ChevronRight size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                    </div>
                                </div>
                            </button>

                            {/* Sprint tasks */}
                            {!isCollapsed && (
                                <div className="border-t border-slate-100">
                                    {/* Progress bar */}
                                    {sprintTotal > 0 && (
                                        <div className="px-6 pt-4 pb-2">
                                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${sprintPct}%` }} />
                                            </div>
                                        </div>
                                    )}

                                    <ul className="divide-y divide-slate-50">
                                        {sprint.tasks.map((task) => {
                                            const isDone = !!checked[task.id];
                                            return (
                                                <li key={task.id} className={`flex gap-4 px-6 py-4 transition-colors ${isDone ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                                                    <button
                                                        onClick={() => toggleTask(task.id)}
                                                        className={`mt-0.5 shrink-0 transition-colors ${isDone ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
                                                        aria-label={isDone ? 'Markeer als niet gedaan' : 'Markeer als gedaan'}
                                                    >
                                                        {isDone
                                                            ? <CheckCircle2 size={22} />
                                                            : <Circle size={22} />
                                                        }
                                                    </button>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <p className={`font-bold text-sm ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                                                {task.title}
                                                            </p>
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${PRIORITY_COLORS[task.priority]}`}>
                                                                {PRIORITY_LABELS[task.priority]}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4">
                                                            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                                                <Clock size={12} />
                                                                {task.time}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-[11px] text-indigo-500 font-medium">
                                                                <Zap size={12} />
                                                                Claude: {task.claudeDoes}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── AI Act deadline ────────────────────────────────────────── */}
            <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-2xl">
                <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                    <p className="font-black text-red-800 text-sm uppercase tracking-tight">EU AI Act — 2 augustus 2026</p>
                    <p className="text-[11px] text-red-600 mt-0.5">
                        Hoog-risico verplichtingen (Art. 9, 11, 49) worden afdwingbaar. Na de pilot oppakken — staat in de achtergrondtaken.
                    </p>
                </div>
                <div className="shrink-0 ml-auto text-right">
                    <p className="text-2xl font-black text-red-600">{daysUntil('2026-08-02')}d</p>
                    <p className="text-[10px] text-red-400 font-bold uppercase">resterend</p>
                </div>
            </div>

            {/* ── Prioriteiten legenda ───────────────────────────────────── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Target size={16} className="text-indigo-500" />
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Prioriteiten</h3>
                </div>
                <div className="space-y-2">
                    {[
                        { key: 'p1', why: 'Dit IS het product. Zonder goede opdrachten is de rest zinloos.' },
                        { key: 'p2', why: 'Eerste indruk telt. Alles moet professioneel aanvoelen.' },
                        { key: 'p3', why: 'Bugs bij leerlingen = vertrouwen kwijt bij docenten.' },
                        { key: 'p4', why: 'Geregeld zijn zodat je eind 2026 geen belastingstress hebt.' },
                        { key: 'p5', why: 'De etalage — overtuigt ICT-coördinatoren en docenten.' },
                        { key: 'p6', why: 'Docenten moeten het in 5 minuten snappen.' },
                    ].map(({ key, why }) => (
                        <div key={key} className="flex items-start gap-3">
                            <span className={`mt-0.5 shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${PRIORITY_COLORS[key]}`}>
                                {key.toUpperCase()}
                            </span>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{why}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
