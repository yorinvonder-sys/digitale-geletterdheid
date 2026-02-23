import React, { useMemo } from 'react';
import { Check, GraduationCap, Info } from 'lucide-react';
import { StudentData } from '../../types';
import { SLO_KERNDOELEN } from '../../config/sloKerndoelen';
import { calculateStudentKerndoelStats, getMissionMeta, KERNDOEL_CODES } from '../../config/slo-kerndoelen-mapping';

interface SLOProgressPanelProps {
    student: StudentData;
}

export const SLOProgressPanel: React.FC<SLOProgressPanelProps> = ({ student }) => {
    const kerndoelStats = useMemo(() => calculateStudentKerndoelStats(student), [student]);
    const studentClass = student.stats?.studentClass || student.studentClass || 'Onbekend';

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-indigo-900 font-bold flex items-center gap-2 mb-2">
                            <Info size={18} />
                            SLO Kerndoelen Digitale Geletterdheid
                        </h3>
                        <p className="text-indigo-700 text-sm">
                            Voortgang per officieel kerndoel (21A t/m 23C), gebaseerd op afgeronde missies.
                        </p>
                    </div>
                    <div className="bg-white px-3 py-2 rounded-lg border border-indigo-100 shadow-sm shrink-0">
                        <div className="flex items-center gap-2 text-indigo-600 mb-1">
                            <GraduationCap size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Klas</span>
                        </div>
                        <div className="text-lg font-black text-indigo-900 leading-none">
                            {studentClass}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {KERNDOEL_CODES.map(code => {
                    const kerndoel = SLO_KERNDOELEN[code];
                    const stat = kerndoelStats[code];
                    if (!stat || stat.total === 0) return null;

                    return (
                        <div key={code} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3 gap-3">
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-800 truncate">
                                            {code} <span className="text-slate-500 font-medium">({kerndoel.label})</span>
                                        </h4>
                                        <p className="text-xs text-slate-500 line-clamp-2">{kerndoel.omschrijving}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className={`text-2xl font-black ${stat.percentage >= 100 ? 'text-emerald-500' : 'text-slate-700'}`}>
                                            {stat.percentage}%
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Progress Bar */}
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ease-out ${stat.percentage >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${Math.min(100, stat.percentage)}%` }}
                                        />
                                    </div>

                                    {/* Stats Detail */}
                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                        <span>
                                            Behaald: <span className="font-bold">{stat.completed}</span> van <span className="font-bold">{stat.total}</span> missies
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {stat.completedMissions.length > 0 && (
                                <div className="bg-slate-50 px-4 py-3 border-t border-slate-100">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Bijdragende missies:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {stat.completedMissions.map(mId => {
                                            const meta = getMissionMeta(mId);
                                            const label = meta ? meta.title : mId;
                                            return (
                                                <span
                                                    key={mId}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600"
                                                    title={mId}
                                                >
                                                    <Check size={10} className="text-emerald-500" />
                                                    {label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {Object.values(kerndoelStats).every(s => s.total === 0) && (
                    <div className="text-center py-8 text-slate-400 italic">
                        Geen kerndoelen gevonden voor deze leerling.
                    </div>
                )}
            </div>
        </div>
    );
};

