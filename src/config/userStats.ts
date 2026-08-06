import type { UserStats } from '@/types';

/**
 * Basisvoortgang voor iedere gebruiker.
 *
 * De tutorialvlaggen staan hier expliciet op `false` en niet op `undefined`.
 * Dat is het verschil dat de gedeelde-computerbug oplost: zolang ze ontbraken
 * viel `TutorialProvider` terug op een localStorage-sleutel die niet per
 * gebruiker gescheiden was, waardoor de tweede leerling op dezelfde computer de
 * rondleiding nooit te zien kreeg.
 */
export const DEFAULT_STATS: UserStats = {
    xp: 0,
    level: 1,
    missionsCompleted: [],
    inventory: [],
    hasCompletedStudentTutorial: false,
    hasCompletedTeacherTutorial: false,
};

/**
 * Vult ontbrekende velden aan zonder bestaande waarden te overschrijven.
 *
 * De tutorialvlaggen worden hard naar een boolean gedwongen, zodat een oude
 * rij zonder die sleutels niet alsnog `undefined` oplevert.
 */
export const normalizeStats = (raw?: Partial<UserStats> | null): UserStats => ({
    ...DEFAULT_STATS,
    ...(raw ?? {}),
    hasCompletedStudentTutorial: raw?.hasCompletedStudentTutorial === true,
    hasCompletedTeacherTutorial: raw?.hasCompletedTeacherTutorial === true,
});
