import React, { useMemo, useState } from 'react';
import { Download, Users, School, ChevronDown, ChevronUp, Loader2, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import { supabase } from '@/services/supabase';

import { StudentData } from '@/types';
import { SLO_KERNDOELEN } from '@/config/sloKerndoelen';
import { calculateStudentKerndoelStats, getMissionMeta, KERNDOEL_CODES } from '@/config/slo-kerndoelen-mapping';
import { MISSION_SPOTLIGHTS, buildSpotlightProgress, filterSpotlightsByYear } from './spotlightSignals';
import { StudentSloReport } from './StudentSloReport';

interface SLOClassOverviewProps {
    students: StudentData[];
    schoolId?: string;
    selectedYear?: number;
}

function parseMissionIdFromActivityData(data: unknown): string | null {
    if (typeof data !== 'string') return null;
    const m = data.match(/Missie voltooid:\s*([a-z0-9-]+)/i);
    return m?.[1] || null;
}

export const SLOClassOverview: React.FC<SLOClassOverviewProps> = ({ students, schoolId, selectedYear }) => {
    const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [reportStudent, setReportStudent] = useState<StudentData | null>(null);
    const yearScopeLabel = selectedYear != null ? `leerjaar ${selectedYear}` : 'alle leerjaren';

    const studentsByClass = useMemo(() => {
        const grouped: Record<string, StudentData[]> = {};
        students.forEach(student => {
            const className = student.studentClass || student.stats?.studentClass || 'Geen klas';
            if (!grouped[className]) grouped[className] = [];
            grouped[className].push(student);
        });
        return grouped;
    }, [students]);

    const studentsByUid = useMemo(() => {
        const map = new Map<string, StudentData>();
        students.forEach(s => map.set(s.uid, s));
        return map;
    }, [students]);

    const activeSpotlights = useMemo(() => filterSpotlightsByYear(selectedYear), [selectedYear]);

    const spotlightProgress = useMemo(
        () => buildSpotlightProgress(activeSpotlights, students),
        [activeSpotlights, students]
    );

    const calculateClassStats = (classStudents: StudentData[]) => {
        const classStats: Record<string, { avgPercentage: number; students: number; hasData: boolean }> = {};

        KERNDOEL_CODES.forEach(code => {
            let totalPercentage = 0;
            let applicableStudents = 0;
            let totalApplicableMissions = 0;

            classStudents.forEach(student => {
                const st = calculateStudentKerndoelStats(student, selectedYear)[code];
                if (st && st.total > 0) {
                    totalPercentage += st.percentage;
                    applicableStudents++;
                    totalApplicableMissions += st.total;
                }
            });

            classStats[code] = {
                avgPercentage: applicableStudents > 0 ? Math.round(totalPercentage / applicableStudents) : 0,
                students: classStudents.length,
                hasData: totalApplicableMissions > 0
            };
        });

        return classStats;
    };

    const exportToExcel = async () => {
        setExportError(null);
        setExporting(true);

        try {
            const ExcelJS = await import('exceljs');
            const workbook = new ExcelJS.Workbook();

            // Helper: add rows from array-of-arrays to a worksheet
            const addAoaSheet = (name: string, rows: any[][]) => {
                const ws = workbook.addWorksheet(name);
                rows.forEach(row => ws.addRow(row));
                return ws;
            };

            // Sheet: Kerndoelen definitions
            const kerndoelenData: any[] = [
                ['Code', 'Domein', 'Label', 'Omschrijving']
            ];
            KERNDOEL_CODES.forEach(code => {
                const kd = SLO_KERNDOELEN[code];
                kerndoelenData.push([kd.code, kd.domein, kd.label, kd.omschrijving]);
            });
            addAoaSheet('Kerndoelen', kerndoelenData);

            // Sheet: Curriculum spotlights for school-facing evidence conversations
            const spotlightRows: any[] = [
                ['Leerjaar', 'Periode', 'Missie ID', 'Missie', 'Kerndoelen', 'Waarom belangrijk', 'Docentobservatie']
            ];
            MISSION_SPOTLIGHTS.forEach(spotlight => {
                spotlightRows.push([
                    `J${spotlight.yearGroup}`,
                    spotlight.periodLabel,
                    spotlight.missionId,
                    spotlight.title,
                    spotlight.kerndoelen.join(', '),
                    spotlight.summary,
                    spotlight.teacherSignal,
                ]);
            });
            addAoaSheet('Missie Spotlights', spotlightRows);

            const spotlightProgressRows: any[] = [
                ['Leerjaar', 'Periode', 'Missie ID', 'Klas', 'Leerlingen', 'Gestart', 'Nog Bezig', 'Afgerond', '% Gestart', '% Afgerond']
            ];
            spotlightProgress.forEach(({ spotlight, classBreakdown }) => {
                classBreakdown.forEach(classProgress => {
                    spotlightProgressRows.push([
                        `J${spotlight.yearGroup}`,
                        spotlight.periodLabel,
                        spotlight.missionId,
                        classProgress.className,
                        classProgress.totalStudents,
                        classProgress.startedStudents,
                        classProgress.inProgressStudents,
                        classProgress.completedStudents,
                        classProgress.startedPercentage,
                        classProgress.completedPercentage,
                    ]);
                });
            });
            addAoaSheet('Spotlight Voortgang', spotlightProgressRows);

            // Sheet 1: Overview per class
            const overviewHeader = ['Klas', 'Aantal Leerlingen', ...KERNDOEL_CODES.map(code => `${code} ${SLO_KERNDOELEN[code].label}`)];
            const overviewData: any[] = [overviewHeader];

            Object.entries(studentsByClass).forEach(([className, classStudents]) => {
                const classStats = calculateClassStats(classStudents);
                overviewData.push([
                    className,
                    classStudents.length,
                    ...KERNDOEL_CODES.map(code => classStats[code].avgPercentage)
                ]);
            });

            addAoaSheet('Overzicht per Klas', overviewData);

            // Sheet 2: Detail per student
            const detailHeader = [
                'Klas',
                'Leerling',
                'Leerlingnummer',
                'VSO Profiel', // NEW
                ...KERNDOEL_CODES.map(code => code),
                'Totaal missies voltooid'
            ];
            const detailData: any[] = [detailHeader];

            Object.entries(studentsByClass).forEach(([className, classStudents]) => {
                classStudents.forEach(student => {
                    const st = calculateStudentKerndoelStats(student, selectedYear);
                    detailData.push([
                        className,
                        student.displayName || '',
                        student.identifier || '',
                        student.stats?.vsoProfile || 'Regulier', // NEW
                        ...KERNDOEL_CODES.map(code => {
                            const stat = st[code];
                            return stat.total > 0 ? stat.percentage : null;
                        }),
                        (student.stats?.missionsCompleted || []).length
                    ]);
                });
            });

            addAoaSheet('Detail per Leerling', detailData);

            // Sheet 3: Activities/events for growth analysis (last 90 days)
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - 90);
            const cutoffISO = cutoff.toISOString();

            let activitiesQueryBuilder = supabase
                .from('student_activities')
                .select('*')
                .gte('timestamp', cutoffISO)
                .order('timestamp', { ascending: true })
                .limit(5000);

            if (schoolId) {
                activitiesQueryBuilder = activitiesQueryBuilder.eq('school_id', schoolId);
            }

            const { data: activitiesRows, error: activitiesError } = await activitiesQueryBuilder;
            if (activitiesError) throw activitiesError;

            const activitiesHeader: any[] = [
                'Timestamp',
                'Datum',
                'Klas',
                'Leerling',
                'Leerlingnummer',
                'UID',
                'Missie ID',
                'Missie',
                'Week',
                'Kerndoelen',
                ...KERNDOEL_CODES.map(code => `+${code}`),
                ...KERNDOEL_CODES.map(code => `CUM_${code}`),
                ...KERNDOEL_CODES.map(code => `TOTAL_${code}`)
            ];
            const activitiesData: any[] = [activitiesHeader];

            // Precompute totals per student for denominators in Excel.
            const totalsByUid = new Map<string, Record<string, number>>();
            const getTotalsForUid = (uid: string): Record<string, number> => {
                const existing = totalsByUid.get(uid);
                if (existing) return existing;

                const student = studentsByUid.get(uid);
                if (!student) {
                    const zero = Object.fromEntries(KERNDOEL_CODES.map(code => [code, 0]));
                    totalsByUid.set(uid, zero);
                    return zero;
                }

                const st = calculateStudentKerndoelStats(student);
                const totals = Object.fromEntries(KERNDOEL_CODES.map(code => [code, st[code].total]));
                totalsByUid.set(uid, totals);
                return totals;
            };

            // Per-student cumulative counters (within the 90-day retention window).
            const cumByUid = new Map<string, Record<string, number>>();
            const seenMissionsByUid = new Map<string, Set<string>>();

            const getCum = (uid: string): Record<string, number> => {
                const existing = cumByUid.get(uid);
                if (existing) return existing;
                const init = Object.fromEntries(KERNDOEL_CODES.map(code => [code, 0]));
                cumByUid.set(uid, init);
                return init;
            };

            const getSeen = (uid: string): Set<string> => {
                const existing = seenMissionsByUid.get(uid);
                if (existing) return existing;
                const init = new Set<string>();
                seenMissionsByUid.set(uid, init);
                return init;
            };

            (activitiesRows || []).forEach((a: any) => {
                if (a?.type !== 'mission_complete') return;

                const uid = String(a?.uid || '');
                if (!uid) return;

                const student = studentsByUid.get(uid);
                if (!student) return;

                const className = student.studentClass || student.stats?.studentClass || 'Geen klas';
                const identifier = student.identifier || '';
                const studentName = student.displayName || a?.student_name || '';

                const missionId =
                    (typeof a?.mission_id === 'string' && a.mission_id.trim().length > 0) ? a.mission_id.trim() : parseMissionIdFromActivityData(a?.data);
                if (!missionId) return;

                const missionMeta = getMissionMeta(missionId);
                const missionTitle = missionMeta?.title || '';
                const week = missionMeta?.week || null;
                const kerndoelen = missionMeta?.sloKerndoelen || [];

                const tsDate = a?.timestamp ? new Date(a.timestamp) : null;
                const iso = tsDate ? tsDate.toISOString() : '';
                const dateOnly = tsDate ? iso.slice(0, 10) : '';

                const seen = getSeen(uid);
                const cum = getCum(uid);
                const totals = getTotalsForUid(uid);

                // De-duplicate: only count the first completion of a mission within the retention window.
                const effectiveKerndoelen = seen.has(missionId) ? [] : kerndoelen;
                seen.add(missionId);

                KERNDOEL_CODES.forEach(code => {
                    if (effectiveKerndoelen.includes(code)) cum[code] += 1;
                });

                const deltaCols = KERNDOEL_CODES.map(code => effectiveKerndoelen.includes(code) ? 1 : 0);
                const cumCols = KERNDOEL_CODES.map(code => cum[code]);
                const totalCols = KERNDOEL_CODES.map(code => totals[code]);

                activitiesData.push([
                    iso,
                    dateOnly,
                    className,
                    studentName,
                    identifier,
                    uid,
                    missionId,
                    missionTitle,
                    week,
                    kerndoelen.join('|'),
                    ...deltaCols,
                    ...cumCols,
                    ...totalCols
                ]);
            });

            addAoaSheet('Activiteiten (90d)', activitiesData);

            // Download
            const date = new Date().toISOString().split('T')[0];
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `SLO_Kerndoelen_${date}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e: any) {
            console.error('[SLO Export] Failed:', e);
            setExportError('Export mislukt. Controleer je verbinding en probeer opnieuw.');
        } finally {
            setExporting(false);
        }
    };

    const toggleClass = (className: string) => {
        setExpandedClasses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(className)) newSet.delete(className);
            else newSet.add(className);
            return newSet;
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-xl font-black text-duck-ink flex items-center gap-2">
                        <School size={24} className="text-duck-acid" />
                        SLO Kerndoelen per Klas
                    </h2>
                    <p className="text-sm text-duck-ink/60 mt-1">
                        Klik op een leerling om het individuele SLO-rapport te openen — printbaar en als CSV te exporteren. Deze weergave toont dekking op basis van afgeronde missies voor {yearScopeLabel}.
                    </p>
                    {exportError && (
                        <p className="text-sm text-duck-error mt-2">{exportError}</p>
                    )}
                </div>
                <button
                    onClick={exportToExcel}
                    disabled={exporting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-duck-soft ${exporting ? 'bg-duck-ink text-white cursor-not-allowed' : 'bg-duck-ink text-white hover:bg-duck-ink hover:text-white'}`}
                >
                    {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {exporting ? 'Exporteren...' : 'Exporteer naar Excel'}
                </button>
            </div>

            <div className="bg-duck-bg rounded-xl p-4 border border-duck-ink/15">
                <p className="text-xs font-bold text-duck-ink/60 uppercase mb-2">Legenda</p>
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-black text-duck-ink/60 uppercase tracking-wider mb-1">Regulier (PO/VO)</p>
                        <div className="flex flex-wrap gap-4">
                            {KERNDOEL_CODES.filter(code => !SLO_KERNDOELEN[code].isVso).map(code => (
                                <div key={code} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-duck-acid"></div>
                                    <span className="text-[11px] text-duck-ink/60">
                                        <span className="font-bold">{code}</span> {SLO_KERNDOELEN[code].label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-duck-ink/60 uppercase tracking-wider mb-1">VSO (Functioneel)</p>
                        <div className="flex flex-wrap gap-4">
                            {KERNDOEL_CODES.filter(code => SLO_KERNDOELEN[code].isVso).map(code => (
                                <div key={code} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-duck-acid"></div>
                                    <span className="text-[11px] text-duck-ink/60">
                                        <span className="font-bold">{code}</span> {SLO_KERNDOELEN[code].label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {spotlightProgress.length > 0 && (
                <div className="bg-white rounded-xl border border-lab-coral shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-lab-coral bg-lab-coral/70">
                        <p className="text-[10px] font-black text-lab-coral uppercase tracking-widest">Curriculum Spotlight</p>
                        <h3 className="text-sm font-bold text-lab-ink mt-1">
                            Missie die extra sterk bewijs geeft in het SLO-verhaal
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {spotlightProgress.map(({ spotlight, totalStudents, startedStudents, completedStudents, inProgressStudents, startedPercentage, completedPercentage, classBreakdown, signals }) => (
                            <div key={spotlight.missionId} className="rounded-xl border border-lab-line bg-lab-cream p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-lab-muted uppercase tracking-wider">
                                            J{spotlight.yearGroup} • {spotlight.periodLabel}
                                        </p>
                                        <h4 className="text-base font-bold text-lab-ink mt-1">{spotlight.title}</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {spotlight.kerndoelen.map(code => (
                                            <span key={code} className="inline-flex px-2 py-1 rounded-full bg-lab-coral text-white text-[11px] font-bold">
                                                {code}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-lab-muted mt-3">{spotlight.summary}</p>
                                <div className="mt-3 grid gap-3 md:grid-cols-4">
                                    <div className="rounded-lg bg-white border border-lab-line px-3 py-2">
                                        <p className="text-[11px] font-bold text-lab-muted uppercase tracking-wider">Leerlingen</p>
                                        <p className="text-xl font-black text-lab-ink mt-1">{totalStudents}</p>
                                    </div>
                                    <div className="rounded-lg bg-white border border-lab-coral px-3 py-2">
                                        <p className="text-[11px] font-bold text-lab-coral uppercase tracking-wider">Gestart</p>
                                        <p className="text-xl font-black text-lab-coral mt-1">{startedStudents}</p>
                                        <p className="text-xs text-lab-muted mt-1">{startedPercentage}% van leerjaarfilter</p>
                                    </div>
                                    <div className="rounded-lg bg-white border border-lab-gold px-3 py-2">
                                        <p className="text-[11px] font-bold text-lab-gold uppercase tracking-wider">Nog Bezig</p>
                                        <p className="text-xl font-black text-lab-gold mt-1">{inProgressStudents}</p>
                                        <p className="text-xs text-lab-muted mt-1">Wel gestart, nog niet afgerond</p>
                                    </div>
                                    <div className="rounded-lg bg-white border border-lab-sage px-3 py-2">
                                        <p className="text-[11px] font-bold text-lab-sage uppercase tracking-wider">Afgerond</p>
                                        <p className="text-xl font-black text-lab-sage mt-1">{completedStudents}</p>
                                        <p className="text-xs text-lab-muted mt-1">{completedPercentage}% van leerjaarfilter</p>
                                    </div>
                                </div>
                                <div className="mt-3 grid gap-2">
                                    <div>
                                        <div className="flex items-center justify-between text-[11px] font-bold text-lab-muted uppercase tracking-wider">
                                            <span>Gestart</span>
                                            <span>{startedPercentage}%</span>
                                        </div>
                                        <div className="mt-1 h-2 rounded-full bg-lab-creamDeep overflow-hidden">
                                            <div className="h-full rounded-full bg-lab-coral transition-all" style={{ width: `${startedPercentage}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-[11px] font-bold text-lab-muted uppercase tracking-wider">
                                            <span>Afgerond</span>
                                            <span>{completedPercentage}%</span>
                                        </div>
                                        <div className="mt-1 h-2 rounded-full bg-lab-creamDeep overflow-hidden">
                                            <div className="h-full rounded-full bg-lab-coral transition-all" style={{ width: `${completedPercentage}%` }} />
                                        </div>
                                    </div>
                                </div>
                                {signals.length > 0 && (
                                    <div className="mt-3 rounded-lg bg-white border border-lab-line px-3 py-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-[11px] font-bold text-lab-muted uppercase tracking-wider">Docentsignalen</p>
                                            <p className="text-[11px] text-lab-muted">Automatische nudges op basis van start- en afronddata</p>
                                        </div>
                                        <div className="mt-3 grid gap-3 xl:grid-cols-3">
                                            {signals.map(signal => {
                                                const toneStyles = signal.tone === 'success'
                                                    ? {
                                                        wrapper: 'border-lab-sage bg-lab-sage',
                                                        icon: 'bg-lab-sage text-white',
                                                        title: 'text-lab-sage',
                                                        nudge: 'bg-white/80 border-lab-sage text-lab-sage',
                                                    }
                                                    : signal.tone === 'attention'
                                                        ? {
                                                            wrapper: 'border-lab-gold bg-lab-gold',
                                                            icon: 'bg-lab-gold text-lab-ink',
                                                            title: 'text-lab-gold',
                                                            nudge: 'bg-white/80 border-lab-gold text-lab-gold',
                                                        }
                                                        : {
                                                            wrapper: 'border-lab-coral bg-lab-coral',
                                                            icon: 'bg-lab-coral text-white',
                                                            title: 'text-lab-coral',
                                                            nudge: 'bg-white/80 border-lab-coral text-lab-coral',
                                                        };
                                                const Icon = signal.tone === 'success'
                                                    ? TrendingUp
                                                    : signal.tone === 'attention'
                                                        ? Lightbulb
                                                        : AlertTriangle;

                                                return (
                                                    <div key={signal.id} className={`rounded-xl border px-3 py-3 ${toneStyles.wrapper}`}>
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${toneStyles.icon}`}>
                                                                <Icon size={18} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className={`text-sm font-bold ${toneStyles.title}`}>{signal.title}</p>
                                                                <p className="text-sm text-lab-muted mt-1">{signal.summary}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`mt-3 rounded-lg border px-3 py-2 ${toneStyles.nudge}`}>
                                                            <p className="text-[11px] font-bold uppercase tracking-wider">Docentnudge</p>
                                                            <p className="text-sm mt-1">{signal.nudge}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className="mt-3 rounded-lg bg-white border border-lab-line px-3 py-2">
                                    <p className="text-[11px] font-bold text-lab-muted uppercase tracking-wider">Docent kan observeren</p>
                                    <p className="text-sm text-lab-muted mt-1">{spotlight.teacherSignal}</p>
                                </div>
                                <div className="mt-3 rounded-lg bg-white border border-lab-line px-3 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-[11px] font-bold text-lab-muted uppercase tracking-wider">Per klas</p>
                                        <p className="text-[11px] text-lab-muted">Gestart telt ook afgeronde leerlingen mee</p>
                                    </div>
                                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                                        {classBreakdown.map(classProgress => (
                                            <div key={`${spotlight.missionId}-${classProgress.className}`} className="rounded-lg border border-lab-line bg-lab-cream px-3 py-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-lab-ink">{classProgress.className}</p>
                                                        <p className="text-xs text-lab-muted mt-1">
                                                            {classProgress.completedStudents} van {classProgress.totalStudents} leerlingen afgerond
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex px-2 py-1 rounded-full bg-lab-sage text-white text-[11px] font-bold">
                                                        {classProgress.completedPercentage}%
                                                    </span>
                                                </div>
                                                <div className="mt-3 grid grid-cols-3 gap-2">
                                                    <div className="rounded-lg bg-white border border-lab-line px-2 py-2 text-center">
                                                        <p className="text-[10px] font-bold text-lab-muted uppercase tracking-wider">Gestart</p>
                                                        <p className="text-lg font-black text-lab-coral mt-1">{classProgress.startedStudents}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-white border border-lab-line px-2 py-2 text-center">
                                                        <p className="text-[10px] font-bold text-lab-muted uppercase tracking-wider">Bezig</p>
                                                        <p className="text-lg font-black text-lab-gold mt-1">{classProgress.inProgressStudents}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-white border border-lab-line px-2 py-2 text-center">
                                                        <p className="text-[10px] font-bold text-lab-muted uppercase tracking-wider">Afgerond</p>
                                                        <p className="text-lg font-black text-lab-sage mt-1">{classProgress.completedStudents}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {Object.entries(studentsByClass).sort().map(([className, classStudents]) => {
                    const classStats = calculateClassStats(classStudents);
                    const isExpanded = expandedClasses.has(className);

                    return (
                        <div key={className} className="bg-white rounded-xl border border-lab-line shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleClass(className)}
                                className="w-full p-4 flex items-center justify-between hover:bg-lab-cream transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-lab-coral rounded-lg flex items-center justify-center">
                                        <Users size={20} className="text-lab-coral" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-lab-ink">{className}</h3>
                                        <p className="text-xs text-lab-muted">{classStudents.length} leerlingen</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="hidden md:flex gap-2">
                                        {KERNDOEL_CODES.filter(code => classStats[code].hasData).map(code => (
                                            <div key={code} className="w-16" title={`${code} ${SLO_KERNDOELEN[code].label}`}>
                                                <div className="h-2 bg-lab-cream rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all ${SLO_KERNDOELEN[code].isVso ? 'bg-lab-coral' : 'bg-lab-coral'}`}
                                                        style={{ width: `${classStats[code].avgPercentage}%` }}
                                                    />
                                                </div>
                                                <p className="text-[9px] text-lab-muted text-center mt-0.5">
                                                    {classStats[code].avgPercentage}%
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {isExpanded
                                        ? <ChevronUp size={18} className="text-lab-muted" />
                                        : <ChevronDown size={18} className="text-lab-muted" />
                                    }
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="border-t border-lab-line">
                                    <table className="w-full text-sm">
                                        <thead className="bg-lab-cream">
                                            <tr>
                                                <th className="text-left px-4 py-2 text-xs font-bold text-lab-muted uppercase">Leerling</th>
                                                {KERNDOEL_CODES.filter(code => classStats[code].hasData).map(code => (
                                                    <th key={code} className={`text-center px-2 py-2 text-xs font-bold uppercase whitespace-nowrap ${SLO_KERNDOELEN[code].isVso ? 'text-lab-sage' : 'text-lab-muted'}`}>
                                                        {code}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {classStudents.map(student => {
                                                const st = calculateStudentKerndoelStats(student, selectedYear);
                                                return (
                                                    <tr
                                                        key={student.uid}
                                                        className="hover:bg-lab-coral/60 cursor-pointer transition-colors"
                                                        onClick={() => setReportStudent(student)}
                                                        role="button"
                                                        tabIndex={0}
                                                        aria-label={`Open SLO-rapport voor ${student.displayName || 'leerling'}`}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                setReportStudent(student);
                                                            }
                                                        }}
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-lab-ink underline decoration-lab-muted underline-offset-2">
                                                                    {student.displayName}
                                                                </p>
                                                                {student.stats?.vsoProfile && (
                                                                    <span className="text-[8px] bg-lab-sage text-white px-1 rounded border border-lab-sage font-bold uppercase">
                                                                        VSO
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-lab-muted">{student.identifier}</p>
                                                        </td>
                                                        {KERNDOEL_CODES.filter(code => classStats[code].hasData).map(code => {
                                                            const stat = st[code];
                                                            const percentage = stat.total > 0 ? stat.percentage : 0;
                                                            const isVso = SLO_KERNDOELEN[code].isVso;
                                                            return (
                                                                <td key={code} className="text-center px-2 py-3">
                                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${percentage >= 75 ? (isVso ? 'bg-lab-sage text-white' : 'bg-lab-coral text-white') :
                                                                        percentage >= 50 ? 'bg-lab-gold text-lab-ink' :
                                                                            percentage >= 25 ? 'bg-lab-coral text-white' :
                                                                                'bg-lab-cream text-lab-muted'
                                                                        }`}>
                                                                        {percentage}%
                                                                    </span>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {Object.keys(studentsByClass).length === 0 && (
                <div className="text-center py-12 text-lab-muted">
                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Geen leerlingen gevonden</p>
                </div>
            )}

            {reportStudent && (
                <StudentSloReport
                    student={reportStudent}
                    yearGroup={selectedYear}
                    onClose={() => setReportStudent(null)}
                />
            )}
        </div>
    );
};
