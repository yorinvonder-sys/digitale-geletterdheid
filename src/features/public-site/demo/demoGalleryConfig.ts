export type SkillCategorie = 'ai' | 'create' | 'code' | 'media' | 'safe';

export interface DemoAssignment {
    missionId: string;
    title: string;
    blurb: string;
    categorie: SkillCategorie;
    playable: boolean;
    aiPowered?: boolean;
}

export const DEMO_ASSIGNMENTS: DemoAssignment[] = [
    {
        missionId: 'game-director',
        title: 'AI Game Builder',
        blurb: 'Ontwerp je eigen game terwijl een AI live de regels aanpast. Jij beslist, de AI bouwt.',
        categorie: 'create',
        playable: true,
        aiPowered: true,
    },
    {
        missionId: 'data-detective',
        title: 'Data Detective',
        blurb: 'Wat weet de app van jou? Kies zelf welke data je deelt — en ontdek de gevolgen.',
        categorie: 'ai',
        playable: true,
    },
    {
        missionId: 'filter-bubble-breaker',
        title: 'Filter Bubble Breaker',
        blurb: 'Jij bent het algoritme. Kies wat je laat zien — en kijk wat er met de feed gebeurt.',
        categorie: 'media',
        playable: true,
    },
    {
        missionId: 'access-control-engineer',
        title: 'Access Control Engineer',
        blurb: 'Bouw de beveiligingsregels voor een schoolsysteem. Wie mag wat zien en waarom?',
        categorie: 'code',
        playable: true,
    },
    {
        missionId: 'datalekken-rampenplan',
        title: 'Datalekken Rampenplan',
        blurb: 'Een datalek! Bepaal per stap hoe jij reageert. Elke keuze heeft gevolgen.',
        categorie: 'safe',
        playable: true,
    },
    {
        missionId: 'cloud-cleaner',
        title: 'Cloud Schoonmaker',
        blurb: 'Jouw cloudopslag zit vol. Sorteren, verwijderen, bewaren — maar wat mag eigenlijk weg?',
        categorie: 'safe',
        playable: true,
    },
];

export const PLAYABLE_MISSION_IDS = new Set(
    DEMO_ASSIGNMENTS.filter((a) => a.playable).map((a) => a.missionId)
);

export const SKILL_CATEGORIES: Record<SkillCategorie, string> = {
    ai: 'AI & Data',
    create: 'Design & Create',
    code: 'Code & Bouw',
    media: 'Media & Verhaal',
    safe: 'Online veiligheid',
};

export const CATEGORY_ORDER: SkillCategorie[] = ['ai', 'create', 'code', 'media', 'safe'];
