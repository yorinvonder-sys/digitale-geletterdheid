import { DEFAULT_AVATAR_CONFIG, StudentData, UserStats } from '@/types';

/**
 * Activiteitsmomenten voor de demoklas, relatief aan het laden van de module.
 *
 * `TeacherCommandCenter` leest `lastActive` en rekent het om naar dagen; ontbreekt
 * het veld, dan valt het terug op 99 dagen en leest ELKE leerling als "Lange
 * inactiviteit". Het docentdashboard toonde daardoor geen klas waar iemand
 * vastzit, maar een klas die niemand gebruikt.
 *
 * Relatief en niet als vaste datum, omdat deze fixture ook /leerlingdemo en de
 * landingspagina voedt; een hardgecodeerde datum zou daar zichtbaar verouderen.
 *
 * Bewust een ISO-string en geen getal: `TeacherCommandCenter` accepteert beide,
 * maar de teller achter het Overzicht-tabblad (`TeacherDashboard.attentionCount`)
 * begrijpt alleen een string of een Firestore-achtige `.toDate()`. Met een getal
 * zou het paneel twee aandachtsleerlingen tonen terwijl de badge er vijf meldt.
 * Een string is bovendien de vorm die Supabase teruggeeft voor `last_login`.
 */
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const DEMO_LOADED_AT = Date.now();
const ago = (ms: number) => new Date(DEMO_LOADED_AT - ms).toISOString();

export const DEMO_STUDENT_STATS: UserStats = {
    xp: 620,
    level: 3,
    missionsCompleted: [
        'cloud-cleaner',
        'layout-doctor',
        'pitch-police',
        'review-week-2',
        'prompt-master',
        'game-programmeur',
        'ai-trainer',
        'chatbot-trainer',
        'verhalen-ontwerper',
        'ai-tekengame',
        'ai-beleid-brainstorm',
        'code-denker',
        'website-bouwer',
        'schermtijd-coach',
        'notificatie-ninja',
        'data-detective',
        'data-verzamelaar',
        'deepfake-detector',
        'ai-spiegel',
        'social-safeguard',
        'scroll-stopper',
        'cookie-crusher',
        'mail-detective',
        'data-handelaar',
        'filter-bubble-breaker',
        'data-voor-data',
        'data-speurder',
        'digitale-balans-coach',
    ],
    inventory: ['badge_cloud', 'badge_detective'],
    avatarConfig: DEFAULT_AVATAR_CONFIG,
    hasCompletedOnboarding: true,
    hasCompletedAvatarSetup: true,
    hasCompletedStudentTutorial: true,
    // Zelfde klas als DEMO_STUDENTS, zodat de leerling- en docentweergave van
    // hetzelfde blok over dezelfde klas gaan.
    studentClass: 'MH1B',
    schoolId: 'demo-school',
    yearGroup: 1,
    educationLevel: 'mavo',
    dailyStreak: 4,
    badges: ['badge_cloud', 'badge_detective'],
    completedIntroWeeks: [1, 2, 3],
};

export const DEMO_STUDENTS: StudentData[] = [
    {
        uid: 'demo-student-1',
        displayName: 'Alex D.',
        email: null,
        photoURL: null,
        role: 'student',
        identifier: 'DEMO01',
        schoolId: 'demo-school',
        studentClass: 'MH1B',
        yearGroup: 1,
        educationLevel: 'mavo',
        lastActive: ago(DAY_MS),
        stats: {
            xp: 820,
            level: 4,
            missionsCompleted: ['magister-master', 'cloud-commander', 'word-wizard', 'prompt-master'],
            inventory: ['badge_cloud', 'badge_detective'],
            studentClass: 'MH1B',
            yearGroup: 1,
            educationLevel: 'mavo',
        },
    },
    {
        uid: 'demo-student-2',
        displayName: 'Bilal M.',
        email: null,
        photoURL: null,
        role: 'student',
        identifier: 'DEMO02',
        schoolId: 'demo-school',
        studentClass: 'MH1B',
        yearGroup: 1,
        educationLevel: 'mavo',
        // Bewust > 7 dagen: dit is de leerling die de docent moet opmerken.
        lastActive: ago(9 * DAY_MS),
        stats: {
            xp: 440,
            level: 2,
            missionsCompleted: ['magister-master', 'cloud-commander'],
            inventory: ['badge_cloud'],
            studentClass: 'MH1B',
            yearGroup: 1,
            educationLevel: 'mavo',
        },
    },
    {
        uid: 'demo-student-3',
        displayName: 'Sara J.',
        email: null,
        photoURL: null,
        role: 'student',
        identifier: 'DEMO03',
        schoolId: 'demo-school',
        studentClass: 'MH1B',
        yearGroup: 1,
        educationLevel: 'mavo',
        lastActive: ago(2 * HOUR_MS),
        stats: {
            xp: 1050,
            level: 5,
            missionsCompleted: [
                'magister-master',
                'cloud-commander',
                'word-wizard',
                'slide-specialist',
                'prompt-master',
            ],
            inventory: ['badge_cloud', 'badge_detective'],
            studentClass: 'MH1B',
            yearGroup: 1,
            educationLevel: 'mavo',
        },
    },
    {
        uid: 'demo-student-4',
        displayName: 'Noah K.',
        email: null,
        photoURL: null,
        role: 'student',
        identifier: 'DEMO04',
        schoolId: 'demo-school',
        studentClass: 'MH1B',
        yearGroup: 1,
        educationLevel: 'mavo',
        // Wél actief, maar komt niet vooruit — de tweede aandachtsreden
        // ("Lage voortgang", xp < 50). 120 xp bij nul voltooide missies was
        // sowieso intern inconsistent.
        lastActive: ago(4 * HOUR_MS),
        stats: {
            xp: 40,
            level: 1,
            missionsCompleted: [],
            inventory: [],
            studentClass: 'MH1B',
            yearGroup: 1,
            educationLevel: 'mavo',
        },
    },
    {
        uid: 'demo-student-5',
        displayName: 'Lena T.',
        email: null,
        photoURL: null,
        role: 'student',
        identifier: 'DEMO05',
        schoolId: 'demo-school',
        studentClass: 'MH1B',
        yearGroup: 1,
        educationLevel: 'mavo',
        lastActive: ago(3 * DAY_MS),
        stats: {
            xp: 670,
            level: 3,
            missionsCompleted: ['magister-master', 'word-wizard', 'prompt-master'],
            inventory: ['badge_cloud'],
            studentClass: 'MH1B',
            yearGroup: 1,
            educationLevel: 'mavo',
        },
    },
];
