// Curriculum Configuratie — DGSkills Digitale Geletterdheid
// Volledige curriculumstructuur voor leerjaar 1 t/m 3, alle niveaus
// Gebaseerd op SLO definitieve conceptkerndoelen (september 2025)

import { SloKerndoelCode } from './sloKerndoelen';

// ============================================================================
// Types
// ============================================================================

export type EducationLevel = 'mavo' | 'havo' | 'vwo';

export interface PeriodConfig {
    title: string;
    subtitle: string;
    sloFocus: SloKerndoelCode[];
    sloFocusVso?: SloKerndoelCode[];  // VSO-variant van de SLO-focus
    missions: string[];           // missie-IDs in volgorde
    reviewMissions?: string[];    // missie-IDs die als review-gate fungeren
    assessmentId?: string;        // ID van het assessment voor deze periode
}

export interface YearGroupConfig {
    title: string;
    subtitle: string;
    description: string;
    availableLevels: EducationLevel[];
    themeColor: string;           // Tailwind kleur prefix (bijv. 'indigo', 'emerald', 'violet')
    periods: Record<number, PeriodConfig>;
}

export interface CurriculumConfig {
    yearGroups: Record<number, YearGroupConfig>;
    defaultPeriodsPerYear: number;
    defaultPeriodNaming: string;
}

// ============================================================================
// Curriculum Definitie
// ============================================================================

export const CURRICULUM: CurriculumConfig = {
    defaultPeriodsPerYear: 4,
    defaultPeriodNaming: 'Periode',
    yearGroups: {
        // ====================================================================
        // LEERJAAR 1 — Digitale Basis (mavo + havo + vwo)
        // ====================================================================
        1: {
            title: 'Digitale Basis',
            subtitle: 'Kennismaken met de digitale wereld',
            description:
                'In het eerste leerjaar leg je de basis voor al je digitale vaardigheden. ' +
                'Je leert werken met de programma\'s die je elke dag nodig hebt op school, ' +
                'ontdekt wat kunstmatige intelligentie (AI) is en hoe je het slim kunt gebruiken, ' +
                'en je leert hoe je jezelf veilig houdt online. Aan het einde van het jaar ' +
                'laat je in een gaaf eindproject zien wat je allemaal hebt geleerd!',
            availableLevels: ['mavo', 'havo', 'vwo'],
            themeColor: 'indigo',
            periods: {
                1: {
                    title: 'Digitale Basisvaardigheden',
                    subtitle: 'Leren werken met digitale tools',
                    sloFocus: ['21A', '22A'],
                    sloFocusVso: ['18A', '19A', '20A'],
                    missions: [
                        'magister-master',
                        'cloud-commander',
                        'word-wizard',
                        'slide-specialist',
                        'print-pro',
                    ],
                    reviewMissions: [
                        'cloud-cleaner',
                        'layout-doctor',
                        'pitch-police',
                    ],
                    assessmentId: 'assessment-j1-p1',
                },
                2: {
                    title: 'AI & Creatie',
                    subtitle: 'Ontdek kunstmatige intelligentie',
                    sloFocus: ['21B', '21D', '22A', '22B'],
                    sloFocusVso: ['18C', '19A', '20B'],
                    missions: [
                        'prompt-master',
                        'game-programmeur',
                        'ai-trainer',
                        'chatbot-trainer',
                        'verhalen-ontwerper',
                        'game-director',
                        'ai-tekengame',
                        'ai-beleid-brainstorm',
                    ],
                    reviewMissions: [
                        'review-week-2',
                    ],
                    assessmentId: 'assessment-j1-p2',
                },
                3: {
                    title: 'Digitaal Burgerschap',
                    subtitle: 'Veilig en bewust online',
                    sloFocus: ['23A', '23B', '23C', '21B'],
                    sloFocusVso: ['18B', '18C', '20A', '20B'],
                    missions: [
                        'data-detective',
                        'deepfake-detector',
                        'ai-spiegel',
                        'social-safeguard',
                        'cookie-crusher',
                        'data-handelaar',
                        'privacy-profiel-spiegel',
                        'filter-bubble-breaker',
                        'datalekken-rampenplan',
                        'data-voor-data',
                    ],
                    assessmentId: 'assessment-j1-p3',
                },
                4: {
                    title: 'Eindproject',
                    subtitle: 'Laat zien wat je kunt',
                    sloFocus: ['21A', '21B', '21D', '22A', '23C'],
                    missions: [
                        'mission-blueprint',
                        'mission-vision',
                        'mission-launch',
                    ],
                    reviewMissions: [
                        'review-week-3',
                    ],
                    assessmentId: 'assessment-j1-p4',
                },
            },
        },

        // ====================================================================
        // LEERJAAR 2 — Digitale Verdieping (mavo + havo + vwo)
        // ====================================================================
        2: {
            title: 'Digitale Verdieping',
            subtitle: 'Verdiep je digitale vaardigheden',
            description:
                'In het tweede leerjaar ga je een stap verder. Je leert werken met data ' +
                'en ontdekt hoe je informatie kunt analyseren en presenteren. Je maakt ' +
                'kennis met programmeren en bouwt je eerste echte digitale producten. ' +
                'Daarnaast leer je nadenken over de impact van technologie op de ' +
                'maatschappij en sluit je het jaar af met een uitdagend eindproject ' +
                'waarin je al je vaardigheden combineert.',
            availableLevels: ['mavo', 'havo', 'vwo'],
            themeColor: 'emerald',
            periods: {
                1: {
                    title: 'Data & Informatie',
                    subtitle: 'Data begrijpen en toepassen',
                    sloFocus: ['21B', '21C', '21D'],
                    missions: [
                        'data-journalist',
                        'spreadsheet-specialist',
                        'factchecker',
                        'api-verkenner',
                        'dashboard-designer',
                        'ai-bias-detective',
                    ],
                    reviewMissions: [
                        'data-review',
                    ],
                    assessmentId: 'assessment-j2-p1',
                },
                2: {
                    title: 'Programmeren & Computational Thinking',
                    subtitle: 'Leer denken als een programmeur',
                    sloFocus: ['22A', '22B'],
                    missions: [
                        'algorithm-architect',
                        'web-developer',
                        'app-prototyper',
                        'bug-hunter',
                        'automation-engineer',
                        'code-reviewer',
                    ],
                    reviewMissions: [
                        'code-review-2',
                    ],
                    assessmentId: 'assessment-j2-p2',
                },
                3: {
                    title: 'Digitale Media & Creatie',
                    subtitle: 'Creeer met digitale media',
                    sloFocus: ['22A', '21B', '23B'],
                    missions: [
                        'ux-detective',
                        'podcast-producer',
                        'meme-machine',
                        'digital-storyteller',
                        'brand-builder',
                        'video-editor',
                    ],
                    reviewMissions: [
                        'media-review',
                    ],
                    assessmentId: 'assessment-j2-p3',
                },
                4: {
                    title: 'Ethiek, Maatschappij & Eindproject',
                    subtitle: 'Reflecteer op technologie en samenleving',
                    sloFocus: ['23A', '23B', '23C', '21D'],
                    missions: [
                        'ai-ethicus',
                        'digital-rights-defender',
                        'tech-court',
                        'future-forecaster',
                        'sustainability-scanner',
                        'eindproject-j2',
                    ],
                    assessmentId: 'assessment-j2-p4',
                },
            },
        },

        // ====================================================================
        // LEERJAAR 3 — Digitale Meesterschap (alleen havo + vwo)
        // ====================================================================
        3: {
            title: 'Digitale Meesterschap',
            subtitle: 'Word een digitale expert',
            description:
                'Het derde leerjaar is voor leerlingen die zich willen onderscheiden ' +
                'als digitaal vaardige denkers en makers. Je duikt dieper in ' +
                'programmeren en kunstmatige intelligentie, leert over cybersecurity ' +
                'en de ethische vraagstukken rondom technologie. Het jaar wordt ' +
                'afgesloten met de meesterproef: een ambitieus project waarin je ' +
                'laat zien dat je technologie niet alleen begrijpt, maar er ook ' +
                'kritisch en creatief mee kunt omgaan.',
            availableLevels: ['havo', 'vwo'],
            themeColor: 'violet',
            periods: {
                1: {
                    title: 'Geavanceerd Programmeren & AI',
                    subtitle: 'Bouw complexere systemen',
                    sloFocus: ['22B', '21D', '21C'],
                    missions: [
                        'ml-trainer',
                        'api-architect',
                        'neural-navigator',
                        'data-pipeline',
                        'open-source-contributor',
                    ],
                    reviewMissions: [
                        'advanced-code-review',
                    ],
                    assessmentId: 'assessment-j3-p1',
                },
                2: {
                    title: 'Cybersecurity & Privacy',
                    subtitle: 'Bescherm de digitale wereld',
                    sloFocus: ['23A', '21A'],
                    missions: [
                        'cyber-detective',
                        'encryption-expert',
                        'phishing-fighter',
                        'security-auditor',
                        'digital-forensics',
                    ],
                    reviewMissions: [
                        'security-review',
                    ],
                    assessmentId: 'assessment-j3-p2',
                },
                3: {
                    title: 'Maatschappelijke Impact & Innovatie',
                    subtitle: 'Technologie en de toekomst',
                    sloFocus: ['23B', '23C', '21D'],
                    missions: [
                        'startup-simulator',
                        'policy-maker',
                        'innovation-lab',
                        'digital-divide-researcher',
                        'tech-impact-analyst',
                    ],
                    reviewMissions: [
                        'impact-review',
                    ],
                    assessmentId: 'assessment-j3-p3',
                },
                4: {
                    title: 'Meesterproef',
                    subtitle: 'Jouw digitale meesterwerk',
                    sloFocus: ['21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C'],
                    missions: [
                        'portfolio-builder',
                        'research-project',
                        'prototype-developer',
                        'pitch-perfect',
                        'reflection-report',
                        'meesterproef',
                    ],
                    assessmentId: 'assessment-j3-p4',
                },
            },
        },
    },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Haal de configuratie op voor een specifiek leerjaar.
 */
export function getYearConfig(yearGroup: number): YearGroupConfig | undefined {
    return CURRICULUM.yearGroups[yearGroup];
}

/**
 * Haal de configuratie op voor een specifieke periode binnen een leerjaar.
 */
export function getPeriodConfig(yearGroup: number, period: number): PeriodConfig | undefined {
    const year = CURRICULUM.yearGroups[yearGroup];
    if (!year) return undefined;
    return year.periods[period];
}

/**
 * Haal alle missie-IDs op voor een specifieke periode (inclusief review-missies).
 */
export function getMissionsForPeriod(yearGroup: number, period: number): string[] {
    const periodConfig = getPeriodConfig(yearGroup, period);
    if (!periodConfig) return [];

    const allMissions = [...periodConfig.missions];
    if (periodConfig.reviewMissions) {
        allMissions.push(...periodConfig.reviewMissions);
    }
    return allMissions;
}

/**
 * Haal alle leerjaren op die beschikbaar zijn voor een bepaald onderwijsniveau.
 * Bijvoorbeeld: mavo geeft [1, 2], havo en vwo geven [1, 2, 3].
 */
export function getAvailableYearsForLevel(level: EducationLevel): number[] {
    const years: number[] = [];
    for (const [yearStr, config] of Object.entries(CURRICULUM.yearGroups)) {
        if (config.availableLevels.includes(level)) {
            years.push(Number(yearStr));
        }
    }
    return years.sort((a, b) => a - b);
}

/**
 * Haal alle unieke missie-IDs op uit het volledige curriculum.
 * Inclusief reguliere missies en review-missies.
 */
export function getAllMissionIds(): string[] {
    const missionIds = new Set<string>();

    for (const yearConfig of Object.values(CURRICULUM.yearGroups)) {
        for (const periodConfig of Object.values(yearConfig.periods)) {
            for (const missionId of periodConfig.missions) {
                missionIds.add(missionId);
            }
            if (periodConfig.reviewMissions) {
                for (const missionId of periodConfig.reviewMissions) {
                    missionIds.add(missionId);
                }
            }
        }
    }

    return Array.from(missionIds);
}

/**
 * Zoek de periode en het leerjaar op waarin een missie zich bevindt.
 * Zoekt zowel in reguliere missies als in review-missies.
 * Geeft undefined terug als de missie niet gevonden wordt.
 */
export function getPeriodForMission(missionId: string): { yearGroup: number; period: number } | undefined {
    for (const [yearStr, yearConfig] of Object.entries(CURRICULUM.yearGroups)) {
        for (const [periodStr, periodConfig] of Object.entries(yearConfig.periods)) {
            const inMissions = periodConfig.missions.includes(missionId);
            const inReview = periodConfig.reviewMissions?.includes(missionId) ?? false;

            if (inMissions || inReview) {
                return {
                    yearGroup: Number(yearStr),
                    period: Number(periodStr),
                };
            }
        }
    }
    return undefined;
}
