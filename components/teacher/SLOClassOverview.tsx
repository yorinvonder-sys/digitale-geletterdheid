import React, { useMemo, useState } from 'react';
import { Download, Users, School, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabase';

import { StudentData } from '../../types';
import { SLO_KERNDOELEN } from '../../config/sloKerndoelen';
import { calculateStudentKerndoelStats, getMissionMeta, KERNDOEL_CODES } from '../../config/slo-kerndoelen-mapping';

interface SLOClassOverviewProps {
    students: StudentData[];
    schoolId?: string;
}

function parseMissionIdFromActivityData(data: unknown): string | null {
    if (typeof data !== 'string') return null;
    const m = data.match(/Missie voltooid:\s*([a-z0-9-]+)/i);
    return m?.[1] || null;
}

export const SLOClassOverview: React.FC<SLOClassOverviewProps> = ({ students, schoolId }) => {
    const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

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

    const calculateClassStats = (classStudents: StudentData[]) => {
        const classStats: Record<string, { avgPercentage: number; students: number; hasData: boolean }> = {};

        KERNDOEL_CODES.forEach(code => {
            let totalPercentage = 0;
            let applicableStudents = 0;
            let totalApplicableMissions = 0;

            classStudents.forEach(student => {
                const st = calculateStudentKerndoelStats(student)[code];
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
            const XLSX = await import('xlsx');
            const workbook = XLSX.utils.book_new();

            // Sheet: Kerndoelen definitions
            const kerndoelenData: any[] = [
                ['Code', 'Domein', 'Label', 'Omschrijving']
            ];
            KERNDOEL_CODES.forEach(code => {
                const kd = SLO_KERNDOELEN[code];
                kerndoelenData.push([kd.code, kd.domein, kd.label, kd.omschrijving]);
            });
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(kerndoelenData), 'Kerndoelen');

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

            XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(overviewData), 'Overzicht per Klas');

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
                    const st = calculateStudentKerndoelStats(student);
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

            XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(detailData), 'Detail per Leerling');

            // Sheet 3: Activities/events for growth analysis (last 90 days)
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - 90);
            const cutoffISO = cutoff.toISOString();

            let activitiesQueryBuilder = supabase
                .from('student_activities')
                .select('*')
                .gte('timestamp', cutoffISO)
                .order('timestamp', { ascending: true });

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

            XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(activitiesData), 'Activiteiten (90d)');

            // Download
            const date = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `SLO_Kerndoelen_${date}.xlsx`);
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
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <School size={24} className="text-indigo-600" />
                        SLO Kerndoelen per Klas
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Inclusief export voor data-analyse (activiteiten: laatste 90 dagen).
                    </p>
                    {exportError && (
                        <p className="text-sm text-red-600 mt-2">{exportError}</p>
                    )}
                </div>
                <button
                    onClick={exportToExcel}
                    disabled={exporting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg ${exporting ? 'bg-emerald-400 text-white cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'}`}
                >
                    {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {exporting ? 'Exporteren...' : 'Exporteer naar Excel'}
                </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Legenda</p>
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Regulier (PO/VO)</p>
                        <div className="flex flex-wrap gap-4">
                            {KERNDOEL_CODES.filter(code => !SLO_KERNDOELEN[code].isVso).map(code => (
                                <div key={code} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    <span className="text-[11px] text-slate-600">
                                        <span className="font-bold">{code}</span> {SLO_KERNDOELEN[code].label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-wider mb-1">VSO (Functioneel)</p>
                        <div className="flex flex-wrap gap-4">
                            {KERNDOEL_CODES.filter(code => SLO_KERNDOELEN[code].isVso).map(code => (
                                <div key={code} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-[11px] text-slate-600">
                                        <span className="font-bold">{code}</span> {SLO_KERNDOELEN[code].label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {Object.entries(studentsByClass).sort().map(([className, classStudents]) => {
                    const classStats = calculateClassStats(classStudents);
                    const isExpanded = expandedClasses.has(className);

                    return (
                        <div key={className} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleClass(className)}
                                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Users size={20} className="text-indigo-600" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-900">{className}</h3>
                                        <p className="text-xs text-slate-500">{classStudents.length} leerlingen</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="hidden md:flex gap-2">
                                        {KERNDOEL_CODES.filter(code => classStats[code].hasData).map(code => (
                                            <div key={code} className="w-16" title={`${code} ${SLO_KERNDOELEN[code].label}`}>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all ${SLO_KERNDOELEN[code].isVso ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                        style={{ width: `${classStats[code].avgPercentage}%` }}
                                                    />
                                                </div>
                                                <p className="text-[9px] text-slate-400 text-center mt-0.5">
                                                    {classStats[code].avgPercentage}%
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {isExpanded
                                        ? <ChevronUp size={18} className="text-slate-400" />
                                        : <ChevronDown size={18} className="text-slate-400" />
                                    }
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="border-t border-slate-100">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="text-left px-4 py-2 text-xs font-bold text-slate-500 uppercase">Leerling</th>
                                                {KERNDOEL_CODES.filter(code => classStats[code].hasData).map(code => (
                                                    <th key={code} className={`text-center px-2 py-2 text-xs font-bold uppercase whitespace-nowrap ${SLO_KERNDOELEN[code].isVso ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                        {code}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {classStudents.map(student => {
                                                const st = calculateStudentKerndoelStats(student);
                                                return (
                                                    <tr key={student.uid} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-slate-900">{student.displayName}</p>
                                                                {student.stats?.vsoProfile && (
                                                                    <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1 rounded border border-emerald-100 font-bold uppercase">
                                                                        VSO
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-400">{student.identifier}</p>
                                                        </td>
                                                        {KERNDOEL_CODES.filter(code => classStats[code].hasData).map(code => {
                                                            const stat = st[code];
                                                            const percentage = stat.total > 0 ? stat.percentage : 0;
                                                            const isVso = SLO_KERNDOELEN[code].isVso;
                                                            return (
                                                                <td key={code} className="text-center px-2 py-3">
                                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${percentage >= 75 ? (isVso ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700') :
                                                                        percentage >= 50 ? 'bg-amber-100 text-amber-700' :
                                                                            percentage >= 25 ? 'bg-orange-100 text-orange-700' :
                                                                                'bg-slate-100 text-slate-500'
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
                <div className="text-center py-12 text-slate-400">
                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Geen leerlingen gevonden</p>
                </div>
            )}
        </div>
    );
};
