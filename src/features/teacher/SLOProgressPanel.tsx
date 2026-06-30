import React, { useMemo } from 'react';
import { Check, GraduationCap, Info } from 'lucide-react';
import { StudentData } from '@/types';
import { SLO_KERNDOELEN } from '@/config/sloKerndoelen';
import { calculateStudentKerndoelStats, getMissionMeta, KERNDOEL_CODES } from '@/config/slo-kerndoelen-mapping';

interface SLOProgressPanelProps {
    student: StudentData;
}

export const SLOProgressPanel: React.FC<SLOProgressPanelProps> = ({ student }) => {
    const kerndoelStats = useMemo(() => calculateStudentKerndoelStats(student), [student]);
    const studentClass = student.stats?.studentClass || student.studentClass || 'Onbekend';

    return (
        <div className="space-y-6">
            <div className="bg-duck-ink border border-duck-ink rounded-xl p-4 mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                            <Info size={18} />
                            SLO Kerndoelen Digitale Geletterdheid
                        </h3>
                        <p className="text-white/80 text-sm">
                            Voortgang per officieel kerndoel (21A t/m 23C), gebaseerd op afgeronde missies.
                        </p>
                    </div>
                    <div className="bg-white px-3 py-2 rounded-lg border border-duck-ink/20 shadow-sm shrink-0">
                        <div className="flex items-center gap-2 text-duck-ink mb-1">
                            <GraduationCap size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Klas</span>
                        </div>
                        <div className="text-lg font-black text-duck-ink leading-none">
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
                        <div key={code} className="bg-white rounded-xl border border-duck-ink/15 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3 gap-3">
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-duck-ink truncate">
                                            {code} <span className="text-duck-ink/60 font-medium">({kerndoel.label})</span>
                                        </h4>
                                        <p className="text-xs text-duck-ink/60 line-clamp-2">{kerndoel.omschrijving}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className={`text-2xl font-black ${stat.percentage >= 100 ? 'text-duck-ink' : 'text-duck-ink'}`}>
                                            {stat.percentage}%
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Progress Bar */}
                                    <div className="h-2 w-full bg-duck-ink/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ease-out ${stat.percentage >= 100 ? 'bg-duck-acid' : 'bg-duck-acid'}`}
                                            style={{ width: `${Math.min(100, stat.percentage)}%` }}
                                        />
                                    </div>

                                    {/* Stats Detail */}
                                    <div className="flex justify-between items-center text-xs text-duck-ink/60">
                                        <span>
                                            Dekking via missies: <span className="font-bold">{stat.completed}</span> afgerond van <span className="font-bold">{stat.total}</span> toepasbare missies
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {stat.completedMissions.length > 0 && (
                                <div className="bg-duck-bgLight px-4 py-3 border-t border-duck-ink/15">
                                    <p className="text-[10px] uppercase font-bold text-duck-ink/60 mb-2">Bijdragende missies:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {stat.completedMissions.map(mId => {
                                            const meta = getMissionMeta(mId);
                                            const label = meta ? meta.title : mId;
                                            return (
                                                <span
                                                    key={mId}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-duck-ink/15 rounded text-xs text-duck-ink/60"
                                                    title={mId}
                                                >
                                                    <Check size={10} className="text-duck-ink/60" />
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
                    <div className="text-center py-8 text-duck-ink/60 italic">
                        Geen kerndoelen gevonden voor deze leerling.
                    </div>
                )}
            </div>
        </div>
    );
};
