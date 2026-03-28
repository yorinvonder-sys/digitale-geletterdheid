import { StudentData } from '../../types';

export interface MissionSpotlight {
    yearGroup: number;
    periodLabel: string;
    missionId: string;
    title: string;
    kerndoelen: string[];
    summary: string;
    teacherSignal: string;
}

export interface ClassMissionProgress {
    className: string;
    totalStudents: number;
    startedStudents: number;
    completedStudents: number;
    inProgressStudents: number;
    startedPercentage: number;
    completedPercentage: number;
}

export interface SpotlightSignal {
    id: string;
    tone: 'warning' | 'attention' | 'success';
    title: string;
    summary: string;
    nudge: string;
    targetClasses: string[];
    studentMessage: string;
}

export interface SpotlightProgress {
    spotlight: MissionSpotlight;
    totalStudents: number;
    startedStudents: number;
    completedStudents: number;
    inProgressStudents: number;
    startedPercentage: number;
    completedPercentage: number;
    classBreakdown: ClassMissionProgress[];
    signals: SpotlightSignal[];
}

const MIN_SIGNAL_CLASS_SIZE = 3;
const LOW_START_THRESHOLD = 35;
const HIGH_COMPLETION_THRESHOLD = 60;

export const MISSION_SPOTLIGHTS: MissionSpotlight[] = [
    {
        yearGroup: 2,
        periodLabel: 'Periode 2',
        missionId: 'access-control-engineer',
        title: 'Access Control Engineer',
        kerndoelen: ['21A', '23A', '22B'],
        summary: 'Verbindt systeembegrip, privacy en programmeerlogica in een herkenbare schoolcasus rond rollen en rechten.',
        teacherSignal: 'Sterk bewijs als leerlingen onveilige regels herkennen, rechten per rol toewijzen en testscenario’s inhoudelijk kunnen uitleggen.',
    },
];

const getClassName = (student: StudentData) =>
    student.studentClass || student.stats?.studentClass || 'Geen klas';

function formatClassList(classes: ClassMissionProgress[]): string {
    if (classes.length === 0) return '';
    if (classes.length === 1) return classes[0].className;
    if (classes.length === 2) return `${classes[0].className} en ${classes[1].className}`;
    return `${classes[0].className}, ${classes[1].className} + ${classes.length - 2} meer`;
}

function getSignalPriority(tone: SpotlightSignal['tone']): number {
    switch (tone) {
        case 'warning':
            return 0;
        case 'attention':
            return 1;
        case 'success':
            return 2;
        default:
            return 3;
    }
}

export function filterSpotlightsByYear(selectedYear?: number): MissionSpotlight[] {
    if (!selectedYear) return MISSION_SPOTLIGHTS;
    return MISSION_SPOTLIGHTS.filter(spotlight => spotlight.yearGroup === selectedYear);
}

export function buildSpotlightProgress(
    spotlights: MissionSpotlight[],
    students: StudentData[]
): SpotlightProgress[] {
    const studentsByClass = students.reduce<Record<string, StudentData[]>>((grouped, student) => {
        const className = getClassName(student);
        if (!grouped[className]) grouped[className] = [];
        grouped[className].push(student);
        return grouped;
    }, {});

    return spotlights.map(spotlight => {
        const classBreakdown = Object.entries(studentsByClass)
            .sort(([classA], [classB]) => classA.localeCompare(classB))
            .map(([className, classStudents]) => {
                const completedStudents = classStudents.filter(student =>
                    student.stats?.missionsCompleted?.includes(spotlight.missionId)
                ).length;

                const startedStudents = classStudents.filter(student =>
                    student.stats?.missionsCompleted?.includes(spotlight.missionId) ||
                    Boolean(student.stats?.missionProgress?.[spotlight.missionId])
                ).length;

                const totalStudents = classStudents.length;
                const inProgressStudents = Math.max(startedStudents - completedStudents, 0);

                return {
                    className,
                    totalStudents,
                    startedStudents,
                    completedStudents,
                    inProgressStudents,
                    startedPercentage: totalStudents > 0 ? Math.round((startedStudents / totalStudents) * 100) : 0,
                    completedPercentage: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
                };
            });

        const totals = classBreakdown.reduce((acc, current) => ({
            totalStudents: acc.totalStudents + current.totalStudents,
            startedStudents: acc.startedStudents + current.startedStudents,
            completedStudents: acc.completedStudents + current.completedStudents,
            inProgressStudents: acc.inProgressStudents + current.inProgressStudents,
        }), {
            totalStudents: 0,
            startedStudents: 0,
            completedStudents: 0,
            inProgressStudents: 0,
        });

        const lowStartClasses = classBreakdown.filter(classProgress =>
            classProgress.totalStudents >= MIN_SIGNAL_CLASS_SIZE &&
            classProgress.startedPercentage < LOW_START_THRESHOLD
        );

        const stuckClasses = classBreakdown.filter(classProgress =>
            classProgress.totalStudents >= MIN_SIGNAL_CLASS_SIZE &&
            classProgress.inProgressStudents >= Math.max(2, Math.ceil(classProgress.totalStudents * 0.3)) &&
            classProgress.completedStudents < classProgress.startedStudents
        );

        const leadingClasses = classBreakdown.filter(classProgress =>
            classProgress.totalStudents >= MIN_SIGNAL_CLASS_SIZE &&
            classProgress.completedPercentage >= HIGH_COMPLETION_THRESHOLD
        );

        const signals: SpotlightSignal[] = [];

        if (lowStartClasses.length > 0) {
            signals.push({
                id: `${spotlight.missionId}-low-start`,
                tone: 'warning',
                title: 'Lage startgraad',
                summary: `${formatClassList(lowStartClasses)} is nog nauwelijks gestart met deze missie.`,
                nudge: 'Plan een korte klassikale kick-off en laat leerlingen minstens de eerste rollencheck samen doen.',
                targetClasses: lowStartClasses.map(classProgress => classProgress.className),
                studentMessage: `We starten deze week met de missie ${spotlight.title}. Open de missie in DG Skills en werk minimaal tot en met de eerste rollencheck. Let goed op wie welke rechten hoort te krijgen.`,
            });
        }

        if (stuckClasses.length > 0) {
            signals.push({
                id: `${spotlight.missionId}-stuck`,
                tone: 'attention',
                title: 'Blijft hangen in nog bezig',
                summary: `${formatClassList(stuckClasses)} heeft relatief veel leerlingen die wel gestart zijn, maar nog niet afronden.`,
                nudge: 'Gebruik een tussenstop in de les: laat leerlingen hun toegangsregels hardop testen en samen één foutscenario oplossen.',
                targetClasses: stuckClasses.map(classProgress => classProgress.className),
                studentMessage: `Jullie zijn al gestart met ${spotlight.title}. Rond deze missie deze week af en controleer nog één keer jullie rollen, rechten en testscenario's voordat je indient.`,
            });
        }

        if (leadingClasses.length > 0) {
            signals.push({
                id: `${spotlight.missionId}-leading`,
                tone: 'success',
                title: 'Voorbeeldklas beschikbaar',
                summary: `${formatClassList(leadingClasses)} laat zien dat deze missie al goed landt in de praktijk.`,
                nudge: 'Gebruik werk of uitleg uit deze klas als model voor collega’s of voor een klassikale herstart in andere groepen.',
                targetClasses: leadingClasses.map(classProgress => classProgress.className),
                studentMessage: `Sterk gewerkt aan ${spotlight.title}. Jullie aanpak kan als voorbeeld dienen voor andere klassen.`,
            });
        }

        return {
            spotlight,
            ...totals,
            startedPercentage: totals.totalStudents > 0 ? Math.round((totals.startedStudents / totals.totalStudents) * 100) : 0,
            completedPercentage: totals.totalStudents > 0 ? Math.round((totals.completedStudents / totals.totalStudents) * 100) : 0,
            classBreakdown,
            signals,
        };
    });
}

export function getTopSpotlightSignal(progressList: SpotlightProgress[]): { progress: SpotlightProgress; signal: SpotlightSignal } | null {
    const rankedSignals = progressList.flatMap(progress =>
        progress.signals.map(signal => ({
            progress,
            signal,
            priority: getSignalPriority(signal.tone),
        }))
    );

    if (rankedSignals.length === 0) return null;

    rankedSignals.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return b.progress.inProgressStudents - a.progress.inProgressStudents;
    });

    return {
        progress: rankedSignals[0].progress,
        signal: rankedSignals[0].signal,
    };
}

export function getActionableSpotlightSignals(progressList: SpotlightProgress[]): { progress: SpotlightProgress; signal: SpotlightSignal }[] {
    return progressList
        .flatMap(progress =>
            progress.signals
                .filter(signal => signal.tone !== 'success')
                .map(signal => ({
                    progress,
                    signal,
                    priority: getSignalPriority(signal.tone),
                }))
        )
        .sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return b.progress.inProgressStudents - a.progress.inProgressStudents;
        })
        .map(({ progress, signal }) => ({ progress, signal }));
}
