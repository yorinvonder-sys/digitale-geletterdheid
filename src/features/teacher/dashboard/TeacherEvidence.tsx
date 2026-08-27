import React, { Suspense, lazy, useState } from 'react';
import { StudentData, HybridAssessmentRecord } from '@/types';
import { MissionProgressPanel } from '@/features/teacher/MissionProgressPanel';
import { HybridAssessmentPanel } from '@/features/teacher/HybridAssessmentPanel';
import { SLOClassOverview } from '@/features/teacher/SLOClassOverview';
import { GrowthOverviewPanel } from '@/features/teacher/GrowthOverviewPanel';
import { EindmetingReleaseButton } from '@/features/teacher/EindmetingReleaseButton';
import { TeacherDocumentsPanel } from '@/features/teacher/TeacherDocumentsPanel';

const LazyDigitaalPaspoortTeacher = lazy(() =>
    import('@/features/assessment/escaperoom/DigitaalPaspoortTeacher').then(m => ({ default: m.DigitaalPaspoortTeacher }))
);
const LazySamenhangMatrix = lazy(() =>
    import('@/features/teacher/SamenhangMatrix').then(m => ({ default: m.SamenhangMatrix }))
);

type EvidenceView = 'voortgang' | 'slo' | 'groei' | 'samenhang' | 'bronnen';

const VIEWS: { id: EvidenceView; label: string }[] = [
    { id: 'voortgang', label: 'Voortgang' },
    { id: 'slo', label: 'SLO-dekking' },
    { id: 'groei', label: 'Groei' },
    { id: 'samenhang', label: 'Samenhang' },
    { id: 'bronnen', label: 'Bronnen' },
];

const PanelLoader: React.FC = () => (
    <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-duck-ink" />
    </div>
);

interface TeacherEvidenceProps {
    students: StudentData[];
    classFilter: string;
    availableClasses: string[];
    yearGroup: number;
    schoolId?: string;
    hybridAssessments: HybridAssessmentRecord[];
    onSelectStudent: (student: StudentData) => void;
}

/**
 * "Bewijs" bundelt alles waarmee een docent zich verantwoordt: voortgang,
 * SLO-dekking, groei, samenhang en bronmateriaal. Dit waren vijf losse
 * top-level tabs; als subweergaven kosten ze één navigatieniveau in plaats
 * van vijf.
 *
 * Deze component verplaatst alleen waar panelen staan. De rapportagelogica
 * (SLO-percentages, exports, calculateStudentKerndoelStats) is ongewijzigd.
 */
export const TeacherEvidence: React.FC<TeacherEvidenceProps> = ({
    students,
    classFilter,
    availableClasses,
    yearGroup,
    schoolId,
    hybridAssessments,
    onSelectStudent,
}) => {
    const [view, setView] = useState<EvidenceView>('voortgang');

    const classStudents = students.filter(
        s => classFilter === 'all' || s.studentClass === classFilter || s.identifier?.startsWith(classFilter)
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-duck-ink">Bewijs</h1>
                <p className="mt-1 text-sm font-medium text-duck-ink/60">
                    Voortgang, SLO-dekking en groei — de onderbouwing die je aan school en inspectie laat zien.
                </p>
            </div>

            <div
                role="tablist"
                aria-label="Bewijsweergave"
                data-tutorial="teacher-evidence-views"
                className="flex gap-1 overflow-x-auto rounded-2xl border border-duck-ink/15 bg-duck-bgLight p-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {VIEWS.map(v => (
                    <button
                        key={v.id}
                        role="tab"
                        aria-selected={view === v.id}
                        onClick={() => setView(v.id)}
                        className={`min-h-[44px] shrink-0 rounded-xl px-4 text-sm font-bold transition ${
                            view === v.id
                                ? 'bg-duck-ink text-white'
                                : 'text-duck-ink/60 hover:bg-duck-bg hover:text-duck-ink'
                        }`}
                    >
                        {v.label}
                    </button>
                ))}
            </div>

            {view === 'voortgang' && (
                <div className="space-y-6">
                    <MissionProgressPanel
                        students={students}
                        classFilter={classFilter}
                        onSelectStudent={onSelectStudent}
                        yearGroup={yearGroup}
                    />
                    <HybridAssessmentPanel records={hybridAssessments} classFilter={classFilter} />
                </div>
            )}

            {view === 'slo' && (
                <SLOClassOverview students={students} schoolId={schoolId} selectedYear={yearGroup} />
            )}

            {view === 'groei' && (
                <div className="space-y-6">
                    <EindmetingReleaseButton
                        classFilter={classFilter}
                        schoolId={schoolId}
                        availableClasses={availableClasses}
                    />
                    <GrowthOverviewPanel studentIds={classStudents.map(s => s.uid)} />
                    <Suspense fallback={<PanelLoader />}>
                        <LazyDigitaalPaspoortTeacher
                            klasResults={classStudents
                                .filter(s => s.stats?.nulmetingResult)
                                .map(s => ({
                                    studentName: s.displayName || 'Naamloos',
                                    studentId: s.uid,
                                    result: s.stats!.nulmetingResult!,
                                }))}
                        />
                    </Suspense>
                </div>
            )}

            {view === 'samenhang' && (
                <Suspense fallback={<PanelLoader />}>
                    <LazySamenhangMatrix selectedYear={yearGroup} schoolId={schoolId} />
                </Suspense>
            )}

            {view === 'bronnen' && <TeacherDocumentsPanel />}
        </div>
    );
};
