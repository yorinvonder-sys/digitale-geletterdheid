import { LucideIcon } from 'lucide-react';

export interface SLOSubgoal {
    id: string;
    title: string;
    description: string;
}

export interface SLOGoal {
    id: string;
    title: string;
    description: string;
    icon?: string; // emoji or icon name
    subgoals: SLOSubgoal[];
}

export interface SLODomain {
    id: string;
    title: string;
    description: string;
    color: string; // tailwind color class
    goals: SLOGoal[];
}

// Officiële SLO Kerndoelen Digitale Geletterdheid (2025)
// Bron: SLO, Kennisnet, rijksoverheid.nl
export const SLO_DOMAINS: SLODomain[] = [
    {
        id: 'practical',
        title: 'Praktische Kennis & Vaardigheden',
        description: 'Hoe leerlingen digitale technologie en digitale media functioneel inzetten',
        color: 'indigo',
        goals: [
            {
                id: 'systems',
                title: 'Digitale Systemen',
                description: 'Functioneel inzetten van digitale systemen',
                icon: '🖥️',
                subgoals: [
                    { id: 'systems-hardware', title: 'Hardware & Apparaten', description: 'De leerling begrijpt en gebruikt verschillende digitale apparaten' },
                    { id: 'systems-software', title: 'Software & Apps', description: 'De leerling selecteert en gebruikt geschikte software' },
                    { id: 'systems-network', title: 'Netwerken & Cloud', description: 'De leerling begrijpt hoe netwerken en clouddiensten werken' }
                ]
            },
            {
                id: 'media-info',
                title: 'Digitale Media & Informatie',
                description: 'Navigeren in het digitale media- en informatielandschap',
                icon: '📊',
                subgoals: [
                    { id: 'media-search', title: 'Informatie Zoeken', description: 'De leerling zoekt doelgericht en effectief naar informatie' },
                    { id: 'media-evaluate', title: 'Informatie Beoordelen', description: 'De leerling beoordeelt de betrouwbaarheid van bronnen' },
                    { id: 'media-process', title: 'Informatie Verwerken', description: 'De leerling verwerkt en organiseert gevonden informatie' }
                ]
            },
            {
                id: 'data',
                title: 'Data & Dataverwerking',
                description: 'Gebruik van data en dataverwerking verkennen',
                icon: '📈',
                subgoals: [
                    { id: 'data-collect', title: 'Data Verzamelen', description: 'De leerling verzamelt en organiseert data' },
                    { id: 'data-analyze', title: 'Data Analyseren', description: 'De leerling herkent patronen en trekt conclusies uit data' },
                    { id: 'data-visualize', title: 'Data Visualiseren', description: 'De leerling presenteert data op een begrijpelijke manier' }
                ]
            },
            {
                id: 'ai',
                title: 'Artificiële Intelligentie',
                description: 'Mogelijkheden en beperkingen van AI verkennen',
                icon: '🤖',
                subgoals: [
                    { id: 'ai-understand', title: 'AI Begrijpen', description: 'De leerling begrijpt wat AI is en hoe het werkt' },
                    { id: 'ai-use', title: 'AI Gebruiken', description: 'De leerling zet AI-tools effectief in' },
                    { id: 'ai-critical', title: 'AI Kritisch Beoordelen', description: 'De leerling herkent beperkingen en risico\'s van AI' }
                ]
            }
        ]
    },
    {
        id: 'creation',
        title: 'Ontwerpen & Maken',
        description: 'Digitale producten creëren en programmeren',
        color: 'emerald',
        goals: [
            {
                id: 'create',
                title: 'Creëren met Digitale Technologie',
                description: 'Digitale producten maken en publiceren',
                icon: '🎨',
                subgoals: [
                    { id: 'create-content', title: 'Content Maken', description: 'De leerling maakt digitale content (tekst, beeld, video)' },
                    { id: 'create-design', title: 'Digitaal Ontwerpen', description: 'De leerling ontwerpt digitale producten' },
                    { id: 'create-publish', title: 'Publiceren & Delen', description: 'De leerling publiceert en deelt digitale creaties' }
                ]
            },
            {
                id: 'programming',
                title: 'Programmeren',
                description: 'Programmeren en digitale producten creëren',
                icon: '💻',
                subgoals: [
                    { id: 'prog-logic', title: 'Computationeel Denken', description: 'De leerling denkt gestructureerd en probleemoplossend' },
                    { id: 'prog-code', title: 'Coderen', description: 'De leerling schrijft en begrijpt code' },
                    { id: 'prog-debug', title: 'Debuggen & Testen', description: 'De leerling vindt en lost fouten op in programma\'s' }
                ]
            }
        ]
    },
    {
        id: 'digital-world',
        title: 'De Gedigitaliseerde Wereld',
        description: 'Participeren in de gedigitaliseerde wereld met kritisch bewustzijn',
        color: 'amber',
        goals: [
            {
                id: 'safety',
                title: 'Veiligheid & Privacy',
                description: 'Veiligheid en privacy in de digitale wereld',
                icon: '🛡️',
                subgoals: [
                    { id: 'safety-privacy', title: 'Privacy Bescherming', description: 'De leerling beschermt eigen en andermans privacy' },
                    { id: 'safety-security', title: 'Digitale Veiligheid', description: 'De leerling herkent en voorkomt digitale risico\'s' },
                    { id: 'safety-behavior', title: 'Online Gedrag', description: 'De leerling gedraagt zich veilig en respectvol online' }
                ]
            },
            {
                id: 'self-other',
                title: 'Technologie, Jezelf & de Ander',
                description: 'Reflecteren op impact van digitale technologie op jezelf en anderen',
                icon: '👤',
                subgoals: [
                    { id: 'self-wellbeing', title: 'Digitaal Welzijn', description: 'De leerling reflecteert op eigen digitaal gedrag en welzijn' },
                    { id: 'self-identity', title: 'Digitale Identiteit', description: 'De leerling begrijpt online identiteit en zelfpresentatie' },
                    { id: 'self-communication', title: 'Digitale Communicatie', description: 'De leerling communiceert respectvol en effectief online' }
                ]
            },
            {
                id: 'society',
                title: 'Technologie & de Samenleving',
                description: 'Kritisch bewustzijn over impact van technologie op de samenleving',
                icon: '🌍',
                subgoals: [
                    { id: 'society-ethics', title: 'Digitale Ethiek', description: 'De leerling reflecteert op ethische kwesties rondom technologie' },
                    { id: 'society-impact', title: 'Maatschappelijke Impact', description: 'De leerling begrijpt de invloed van technologie op de maatschappij' },
                    { id: 'society-participate', title: 'Digitaal Burgerschap', description: 'De leerling participeert verantwoord in de digitale samenleving' }
                ]
            }
        ]
    }
];

// Backwards compatible: flatten goals for existing components
export const SLO_GOALS: SLOGoal[] = SLO_DOMAINS.flatMap(domain => domain.goals);

// Helper function to get domain by goal id
export const getDomainByGoalId = (goalId: string): SLODomain | undefined => {
    return SLO_DOMAINS.find(domain => domain.goals.some(goal => goal.id === goalId));
};

// Helper function to get goal by id
export const getGoalById = (goalId: string): SLOGoal | undefined => {
    return SLO_GOALS.find(goal => goal.id === goalId);
};
