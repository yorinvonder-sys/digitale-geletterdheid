import { SLO_GOALS, SLO_DOMAINS, getDomainByGoalId } from './slo-goals';
import { StudentData } from '../types';

export type SLOLevel = 'mavo' | 'havo' | 'vwo' | 'gymnasium' | 'unknown';

export interface SLOMissionCriteria {
    goalId: string;
    weight?: number; // 1.0 = standaard
    minYear?: number; // 1, 2, of 3
    levels?: SLOLevel[]; // Als leeg/undefined: alle niveaus
}

// Map mission/game IDs to SLO Criteria
export const MISSION_SLO_MAPPING: Record<string, SLOMissionCriteria[]> = {
    // ============================================
    // WEEK 1: INTRODUCTIE (Klas 1 Basis)
    // ============================================
    'intro-helper': [
        { goalId: 'ai', minYear: 1 },
        { goalId: 'systems', minYear: 1 }
    ],
    'profile-setup': [
        { goalId: 'safety', minYear: 1 },
        { goalId: 'self-other', minYear: 1 }
    ],

    // ============================================
    // WEEK 2: BASISVAARDIGHEDEN (Klas 1)
    // ============================================
    'ipad-print-instructies': [
        { goalId: 'systems', minYear: 1 }
    ],
    'cloud-cleaner': [
        { goalId: 'systems', minYear: 1 },
        { goalId: 'data', minYear: 1 }
    ],
    'layout-doctor': [
        { goalId: 'create', minYear: 1 }
    ],
    'pitch-police': [
        { goalId: 'create', minYear: 1 }, // Presenteren
        { goalId: 'self-other', minYear: 1 }, // Feedback
        { goalId: 'society', minYear: 2 } // Ethiek aspect (zwaarder)
    ],
    'prompt-master': [
        { goalId: 'ai', minYear: 1 },
        { goalId: 'media-info', minYear: 1 }
    ],

    // ============================================
    // WEEK 3: GAMES (Klas 1/2)
    // ============================================
    'password-protector': [
        { goalId: 'safety', minYear: 1 }
    ],
    'data-detective': [
        { goalId: 'media-info', minYear: 1 },
        { goalId: 'data', minYear: 2 } // Analyse = jaar 2
    ],
    'media-maker': [
        { goalId: 'create', minYear: 1 }
    ],
    'firewall-frenzy': [
        { goalId: 'safety', minYear: 2 }, // Netwerk concepten = jaar 2
        { goalId: 'systems', minYear: 2 }
    ],

    // ============================================
    // WEEK 4: EINDPROJECTEN (Klas 2/3)
    // ============================================
    'game-director': [
        { goalId: 'programming', minYear: 2, levels: ['havo', 'vwo'] }, // Complex
        { goalId: 'programming', minYear: 2, levels: ['mavo'], weight: 0.5 }, // Mavo telt minder zwaar?
        { goalId: 'create', minYear: 2 }
    ],
    'robot-racer': [
        { goalId: 'programming', minYear: 2 },
        { goalId: 'ai', minYear: 2 }
    ],
    'website-wizard': [
        { goalId: 'create', minYear: 2 },
        { goalId: 'systems', minYear: 2 }
    ],

    // ============================================
    // EXTRA GAMES
    // ============================================
    'drawing-duel': [{ goalId: 'create', minYear: 1 }],
    'bomberman': [{ goalId: 'programming', minYear: 1 }],
    'word-match': [{ goalId: 'media-info', minYear: 1 }],

    // ============================================
    // AI GERELATEERDE MISSIES (Klas 2/3 Verdieping)
    // ============================================
    'ai-art-studio': [
        { goalId: 'ai', minYear: 1 },
        { goalId: 'create', minYear: 1 }
    ],
    'ai-ethics-debate': [
        { goalId: 'ai', minYear: 3 }, // Ethiek = bovenbouw/eind onderbouw
        { goalId: 'society', minYear: 3 }
    ],
    'ai-detector': [
        { goalId: 'ai', minYear: 2 },
        { goalId: 'media-info', minYear: 2 }
    ],

    // ============================================
    // DATA & INFORMATIE MISSIES
    // ============================================
    'fake-news-hunter': [
        { goalId: 'media-info', minYear: 2 },
        { goalId: 'society', minYear: 2 }
    ],
    'source-checker': [
        { goalId: 'media-info', minYear: 2 }
    ],
    'data-viz-creator': [
        { goalId: 'data', minYear: 3 }, // Data viz is complex
        { goalId: 'create', minYear: 3 }
    ],

    // ============================================
    // PROGRAMMEREN MISSIES
    // ============================================
    'code-breaker': [{ goalId: 'programming', minYear: 1 }],
    'algorithm-artist': [
        { goalId: 'programming', minYear: 2 },
        { goalId: 'create', minYear: 2 }
    ],
    'bug-hunter': [{ goalId: 'programming', minYear: 2 }],

    // ============================================
    // DIGITAAL BURGERSCHAP
    // ============================================
    'digital-footprint': [
        { goalId: 'self-other', minYear: 1 },
        { goalId: 'safety', minYear: 1 }
    ],
    'cyberbully-stopper': [
        { goalId: 'self-other', minYear: 1 },
        { goalId: 'safety', minYear: 1 }
    ],
    'screen-time-tracker': [{ goalId: 'self-other', minYear: 1 }],
    'online-identity': [{ goalId: 'self-other', minYear: 2 }],
    'netiquette-ninja': [{ goalId: 'self-other', minYear: 1 }],

    // ============================================
    // SAMENLEVING & ETHIEK (Klas 3)
    // ============================================
    'tech-impact-explorer': [
        { goalId: 'society', minYear: 3 }
    ],
    'digital-rights': [
        { goalId: 'society', minYear: 3 },
        { goalId: 'safety', minYear: 3 }
    ],
    'eco-tech': [
        { goalId: 'society', minYear: 2 }
    ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Parsed de klasnaam (bijv. "MH1A", "V2B", "H3C") naar niveau en leerjaar.
 */
export const classifyStudent = (studentClass?: string): { level: SLOLevel, year: number } => {
    if (!studentClass) return { level: 'unknown', year: 1 };

    const upperClass = studentClass.toUpperCase();

    // Extract jaar: zoek naar 1, 2, of 3
    let year = 1;
    if (upperClass.includes('1')) year = 1;
    else if (upperClass.includes('2')) year = 2;
    else if (upperClass.includes('3')) year = 3;
    else if (upperClass.includes('4')) year = 4; // Bovenbouw?

    // Extract niveau
    let level: SLOLevel = 'unknown';

    // Specifieke volgorde: check langere strings eerst
    if (upperClass.startsWith('G') || upperClass.includes('GYM')) level = 'gymnasium';
    else if (upperClass.startsWith('V') || upperClass.includes('VWO')) level = 'vwo';
    else if (upperClass.startsWith('H') || upperClass.includes('HAVO')) level = 'havo';
    else if (upperClass.startsWith('M') || upperClass.includes('MAVO')) level = 'mavo';
    else if (upperClass.startsWith('MH')) level = 'havo'; // MH is mavo/havo, we zetten 'm op havo of mavo? Havo is veiliger als target? Of mavo?
    else if (upperClass.startsWith('HV')) level = 'vwo'; // Havo/Vwo -> vwo doelstellingen?
    else if (upperClass.startsWith('BK')) level = 'mavo'; // Beroepsgericht?

    // Fallback voor MH/HV als ze niet gematched zijn door startswith
    if (level === 'unknown') {
        if (upperClass.includes('MH')) level = 'havo';
        if (upperClass.includes('HV')) level = 'vwo';
    }

    // Default fallback
    if (level === 'unknown') level = 'mavo';

    return { level, year };
};

export interface SLOGoalProgress {
    completedWeight: number;    // Behaalde punten
    totalWeight: number;        // Totaal te behalen punten voor dit niveau/jaar
    percentage: number;         // Score
    completedMissions: string[]; // Welke missies hebben bijgedragen
}

/**
 * Berekent de voortgang voor een specifieke student gebaseerd op hun niveau en jaar.
 * Dit maakt de voortgang "eerlijk" en meetbaar per niveau.
 */
export const calculateStudentSLOStats = (student: StudentData): Record<string, SLOGoalProgress> => {
    const { level, year } = classifyStudent(student.stats?.studentClass || student.studentClass);
    const completedMissions = student.stats?.missionsCompleted || [];

    const stats: Record<string, SLOGoalProgress> = {};

    // Initialiseer stats voor alle doelen
    SLO_GOALS.forEach(goal => {
        stats[goal.id] = { completedWeight: 0, totalWeight: 0, percentage: 0, completedMissions: [] };
    });

    // Loop door alle missies in de mapping
    Object.entries(MISSION_SLO_MAPPING).forEach(([missionId, criteriaList]) => {
        criteriaList.forEach(criteria => {
            // Check 1: Is deze missie relevant voor dit leerjaar?
            // Een missie telt mee als hij bedoeld is voor het huidige jaar OF een lager jaar.
            // Voorbeeld: Zit je in jaar 3, dan tellen jaar 1 en 2 missies ook mee voor je 'basis'.
            if (criteria.minYear && criteria.minYear > year) return;

            // Check 2: Is deze missie relevant voor dit niveau?
            if (criteria.levels && !criteria.levels.includes(level) &&
                !(level === 'gymnasium' && criteria.levels.includes('vwo'))) { // Gymnasium valt vaak onder VWO targets
                return;
            }

            const weight = criteria.weight || 1.0;
            const goalStat = stats[criteria.goalId];

            if (goalStat) {
                // Voeg toe aan Totaal (de 'lat' waar we overheen moeten springen)
                goalStat.totalWeight += weight;

                // Als voltooid, voeg toe aan Score
                if (completedMissions.includes(missionId)) {
                    goalStat.completedWeight += weight;
                    if (!goalStat.completedMissions.includes(missionId)) {
                        goalStat.completedMissions.push(missionId);
                    }
                }
            }
        });
    });

    // Bereken percentages
    Object.keys(stats).forEach(key => {
        const s = stats[key];
        if (s.totalWeight > 0) {
            s.percentage = Math.round((s.completedWeight / s.totalWeight) * 100);
        } else {
            // Als er geen doelen zijn voor dit jaar/niveau in dit domein -> 100% of 0%?
            // Laten we 0 houden, "Nog niet van toepassing"
            s.percentage = 0;
        }
    });

    return stats;
};

// Legacy Helpers (voor backwards compatibility waar nodig, maar liever niet gebruiken)
export const getSLOGoalsForMission = (missionId: string) => {
    const criteria = MISSION_SLO_MAPPING[missionId] || [];
    const goalIds = criteria.map(c => c.goalId); // Simpele mapping zonder weight/level
    return SLO_GOALS.filter(goal => goalIds.includes(goal.id));
};

export const getSLODomainsForMission = (missionId: string) => {
    const criteria = MISSION_SLO_MAPPING[missionId] || [];
    const domains = new Set<string>();
    criteria.forEach(c => {
        const domain = getDomainByGoalId(c.goalId);
        if (domain) domains.add(domain.id);
    });
    return SLO_DOMAINS.filter(domain => domains.has(domain.id));
};

export const getMissionsForGoal = (goalId: string): string[] => {
    return Object.entries(MISSION_SLO_MAPPING) // Object.entries zorgt hier voor keys en values
        .filter(([_, criteriaList]) => criteriaList.some(c => c.goalId === goalId))
        .map(([missionId]) => missionId);
};

export const getMissionsForDomain = (domainId: string): string[] => {
    const domain = SLO_DOMAINS.find(d => d.id === domainId);
    if (!domain) return [];

    const goalIds = domain.goals.map(g => g.id);
    return Object.entries(MISSION_SLO_MAPPING)
        .filter(([_, criteriaList]) => criteriaList.some(c => goalIds.includes(c.goalId)))
        .map(([missionId]) => missionId);
};
