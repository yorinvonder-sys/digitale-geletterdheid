export interface SpecialInspectorRegion {
    hotspotId: string;
    eyebrow: string;
    content: string;
    detail?: string;
    tone?: 'default' | 'muted' | 'code';
}

export interface SpecialInspectorCanvasDefinition {
    title: string;
    subtitle: string;
    regions: SpecialInspectorRegion[];
}

const J3_SPECIAL_INSPECTOR_CANVASES: Record<string, SpecialInspectorCanvasDefinition> = {
    'SPECIAL:API_RESPONSE_ERROR': {
        title: 'Patiënt-API · responsecontrole',
        subtitle: 'GET /api/patients/8472',
        regions: [
            { hotspotId: 'wrong-status', eyebrow: 'Statusregel', content: 'HTTP/1.1 200 OK', tone: 'code' },
            { hotspotId: 'correct-header', eyebrow: 'Response-header', content: 'Content-Type: application/json', tone: 'muted' },
            {
                hotspotId: 'missing-field',
                eyebrow: 'Response-body',
                content: '{ "error": "Patiënt niet gevonden" }',
                detail: 'De frontend verwacht een vaste identificatie in iedere response.',
                tone: 'code',
            },
        ],
    },
    'SPECIAL:PHISHING_EMAIL': {
        title: 'NovaTech Mail',
        subtitle: 'Binnengekomen bericht · vandaag 09:14',
        regions: [
            { hotspotId: 'logo-area', eyebrow: 'Afzenderteam', content: 'NOVATECH · Security Team', tone: 'muted' },
            { hotspotId: 'fake-sender', eyebrow: 'Van', content: 'security@n0vatech-support.ru', tone: 'code' },
            {
                hotspotId: 'urgent-language',
                eyebrow: 'Onderwerp',
                content: 'URGENT: Uw account wordt binnen 24 uur vergrendeld!',
                detail: 'Bevestig uw account onmiddellijk om toegang te houden.',
                tone: 'default',
            },
            {
                hotspotId: 'fake-link',
                eyebrow: 'Knop en linkdoel',
                content: 'Account verifiëren',
                detail: 'Weergegeven: novatech.com/verify · Doel: n0vatech-phish.xyz/steal',
                tone: 'code',
            },
        ],
    },
    'SPECIAL:WEBSITE_SECURITY_FORM': {
        title: 'NovaTech · beheerlogin',
        subtitle: 'Controleer verbinding, invoer en weergave',
        regions: [
            { hotspotId: 'no-https', eyebrow: 'Adresbalk', content: 'http://portal.novatech.example/login', tone: 'default' },
            { hotspotId: 'sql-injection', eyebrow: 'Gebruikersnaam', content: "admin' OR 1=1 --", tone: 'code' },
            { hotspotId: 'visible-password', eyebrow: 'Wachtwoord', content: 'Welkom123!', tone: 'code' },
            { hotspotId: 'submit-button', eyebrow: 'Actie', content: 'Inloggen', tone: 'default' },
        ],
    },
    'SPECIAL:SAFECITY_PITCH': {
        title: 'SafeCity · pitchslide',
        subtitle: 'AI-camera’s voor een veiligere openbare ruimte',
        regions: [
            { hotspotId: 'crime-stats', eyebrow: 'Belofte', content: 'Tot 35% snellere opsporing', detail: 'Simulatie uit de eigen pilot.', tone: 'default' },
            {
                hotspotId: 'no-consent',
                eyebrow: 'Werkwijze',
                content: 'Iedere voorbijganger wordt automatisch gescand en vergeleken.',
                detail: 'Geen aanmelding, melding of toestemming nodig.',
                tone: 'default',
            },
            { hotspotId: 'tech-specs', eyebrow: 'Techniek', content: '4K-camera · realtime AI · 99 ms verwerking', tone: 'code' },
        ],
    },
    'SPECIAL:PORTFOLIO_REVIEW': {
        title: 'Mijn digitale portfolio',
        subtitle: 'Projecten · reflectie · bronnen',
        regions: [
            { hotspotId: 'header-design', eyebrow: 'Titel', content: 'Drie jaar digitale projecten', detail: 'Een overzicht van mijn groei en keuzes.', tone: 'default' },
            {
                hotspotId: 'accessibility',
                eyebrow: 'Projectpresentatie',
                content: 'Lichtgrijze tekst op wit · afbeeldingen zonder alt-tekst',
                detail: 'Koppen zijn alleen vet gemaakt en hebben geen logische structuur.',
                tone: 'muted',
            },
            {
                hotspotId: 'missing-sources',
                eyebrow: 'Onderzoeksclaim',
                content: '“AI vervangt 40% van alle banen.”',
                detail: 'Bron: niet vermeld',
                tone: 'default',
            },
            {
                hotspotId: 'broken-links',
                eyebrow: 'Projectlinks',
                content: 'Bekijk mijn prototype · Lees mijn onderzoek',
                detail: 'Beide links geven: 404 — pagina niet gevonden',
                tone: 'code',
            },
        ],
    },
};

export function getSpecialInspectorCanvasDefinition(
    image: string,
    hotspotIds: readonly string[],
): SpecialInspectorCanvasDefinition | null {
    const definition = J3_SPECIAL_INSPECTOR_CANVASES[image];
    if (!definition) return null;

    const renderedIds = new Set(definition.regions.map(region => region.hotspotId));
    if (hotspotIds.some(id => !renderedIds.has(id))) return null;

    return definition;
}

export const J3_SPECIAL_INSPECTOR_CANVAS_IDS = Object.freeze(
    Object.keys(J3_SPECIAL_INSPECTOR_CANVASES),
);
