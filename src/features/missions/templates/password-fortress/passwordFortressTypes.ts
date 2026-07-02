import type { BadgeConfig, MissionGoal } from '../shared/types';

/** De vier gesimuleerde aanvalstypen (deterministisch, geen echte kraaktools). */
export type AttackId = 'brute-force' | 'dictionary' | 'leet' | 'breached';

export interface FortressRound {
    id: string;
    title: string;
    /** Korte verhalende briefing voor deze ronde. */
    story: string;
    /** Aanvallen die in deze ronde actief zijn (cumulatief per ronde). */
    attacks: AttackId[];
    /** Het fort houdt stand als élke actieve aanval minstens zo lang nodig heeft. */
    targetSeconds: number;
    /** Leesbaar sterktedoel, bv. "minstens 1 dag". */
    targetLabel: string;
    /** Hints die de leerling kan kopen (kosten punten). */
    hints: string[];
    /** Kernles die verschijnt zodra de ronde is gehaald. */
    clearedLesson: string;
}

export interface PasswordFortressConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    introFeatures?: string[];
    maxScore: number;
    pointsPerRound: number;
    hintCost: number;
    /** Na zoveel mislukte testen mag de leerling de ronde overslaan (0 punten). */
    skipAfterAttempts: number;
    rounds: FortressRound[];
    badges: BadgeConfig[];
    takeaways: string[];
}
