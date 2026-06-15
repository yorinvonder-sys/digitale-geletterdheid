import React, { useMemo } from 'react';
import { ClipboardCheck, CheckCircle2, XCircle } from 'lucide-react';
import { HybridAssessmentRecord } from '@/types';

interface HybridAssessmentPanelProps {
    records: HybridAssessmentRecord[];
    classFilter: string;
}

export const HybridAssessmentPanel: React.FC<HybridAssessmentPanelProps> = ({ records, classFilter }) => {
    const filtered = useMemo(() => {
        if (classFilter === 'all') return records;
        return records.filter((r) => r.studentClass === classFilter);
    }, [records, classFilter]);

    const recent = filtered.slice(0, 20);

    return (
        <div className="bg-white rounded-2xl border border-duck-ink/15 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-duck-ink/15 flex items-center justify-between">
                <h3 className="text-sm font-black text-duck-ink uppercase tracking-widest flex items-center gap-2">
                    <ClipboardCheck size={16} className="text-duck-acid" />
                    Hybride Beoordelingen
                </h3>
                <span className="text-xs font-bold text-duck-ink/60">{filtered.length} records</span>
            </div>

            {recent.length === 0 ? (
                <div className="p-8 text-center text-duck-ink/60 text-sm">Nog geen hybride beoordelingen gevonden.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-duck-bg text-duck-ink/60">
                            <tr>
                                <th className="text-left px-4 py-3 font-bold">Leerling</th>
                                <th className="text-left px-4 py-3 font-bold">Missie</th>
                                <th className="text-left px-4 py-3 font-bold">AI</th>
                                <th className="text-left px-4 py-3 font-bold">Docent</th>
                                <th className="text-left px-4 py-3 font-bold">Eindscore</th>
                                <th className="text-left px-4 py-3 font-bold">Status</th>
                                <th className="text-left px-4 py-3 font-bold">Tijd</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent.map((r) => (
                                <tr key={r.id} className="border-t border-duck-ink/15">
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-duck-ink">{r.studentName}</div>
                                        <div className="text-xs text-duck-ink/60">{r.studentClass || 'Onbekende klas'}</div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-duck-ink/60">{r.missionId}</td>
                                    <td className="px-4 py-3 text-duck-ink/60">{r.autoScore}%</td>
                                    <td className="px-4 py-3 text-duck-ink/60">{r.teacherScore}%</td>
                                    <td className="px-4 py-3 font-black text-duck-acid">{r.finalScore}%</td>
                                    <td className="px-4 py-3">
                                        {r.passed ? (
                                            <span className="inline-flex items-center gap-1 text-duck-ink/60 font-bold">
                                                <CheckCircle2 size={14} /> Geslaagd
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-duck-ink/60 font-bold">
                                                <XCircle size={14} /> Niet geslaagd
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-duck-ink/60">
                                        {r.timestamp?.toDate
                                            ? r.timestamp.toDate().toLocaleString('nl-NL')
                                            : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
