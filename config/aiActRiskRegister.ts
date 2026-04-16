/**
 * EU AI Act Art. 9 — Risk Register (data)
 * Bron: business/nl-vo/compliance/risicoregister-ai-act.md v1.0 (15 mrt 2026)
 * Alleen statische config — wijzig samen met het bronddocument.
 */

export type RiskCategory =
    | 'veiligheid'
    | 'bias'
    | 'privacy'
    | 'operationeel'
    | 'juridisch'
    | 'ai-bias'
    | 'algoritmische-discriminatie';

export type RiskLikelihood = 1 | 2 | 3 | 4 | 5;
export type RiskImpact = 1 | 2 | 3 | 4 | 5;
export type RiskStatus = 'beheerst' | 'actief' | 'onvoldoende-beheerst' | 'non-compliant';

export interface AiActRisk {
    id: string;
    title: string;
    category: RiskCategory;
    description: string;
    likelihood: RiskLikelihood;
    impact: RiskImpact;
    mitigations: string[];
    residualRisk: string;
    status: RiskStatus;
    owner: string;
    lastReview: string;
    nextReviewDue: string;
    aiActArticle?: string;
    evidenceRefs?: string[];
}

export const RISK_REGISTER_VERSION = '1.0';
export const RISK_REGISTER_LAST_UPDATED = '2026-03-15';

const OWNER = 'Yorin Vonder';
const REVIEW_LAST = '2026-03-15';
const REVIEW_NEXT = '2026-06-15';

export const AI_ACT_RISK_REGISTER: AiActRisk[] = [
    { id: 'R01', title: 'Prompt injection door leerlingen', category: 'veiligheid',
        description: 'Leerling omzeilt AI-filters en lokt ongepaste content uit.',
        likelihood: 4, impact: 4,
        mitigations: ['promptSanitizer (30+ patronen NL/EN/DE/FR/ES)', 'Gemini Safety BLOCK_LOW_AND_ABOVE', 'max 4.000 tekens / 20KB request', 'chatHistory validatie'],
        residualRisk: 'Onbekende injectietechnieken blijven mogelijk; LLMs zijn inherent kwetsbaar.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 9(2)(b)', evidenceRefs: ['supabase/functions/_shared/promptSanitizer.ts'] },
    { id: 'R02', title: 'Onjuiste AI-beoordelingen', category: 'veiligheid',
        description: 'AI keurt stap onterecht goed (XP-farming) of onterecht af (frustratie).',
        likelihood: 4, impact: 3,
        mitigations: ['Specifieke beoordelingscriteria per agent', 'XP-farming detectie', 'STEP_COMPLETE marker vereist'],
        residualRisk: 'Geen docent-override aanwezig tot Art. 14 implementatie (R15).',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 14', evidenceRefs: ['config/agents.tsx'] },
    { id: 'R03', title: 'Schadelijke content voor minderjarigen', category: 'veiligheid',
        description: 'AI genereert gewelddadige/seksueel expliciete content voor 12-18 jarigen.',
        likelihood: 2, impact: 5,
        mitigations: ['Gemini Safety BLOCK_LOW_AND_ABOVE (alle 4 categorieen)', 'Rolbegrenzing system instructions', 'promptSanitizer'],
        residualRisk: 'Edge cases waar content technisch niet wordt geblokkeerd maar contextueel ongepast is.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 9(9)' },
    { id: 'R04', title: 'Welzijnsrisico: leerling deelt signaal', category: 'veiligheid',
        description: 'Leerling deelt signaal van zelfbeschadiging, suïcidaliteit, huiselijk geweld of ernstig pesten.',
        likelihood: 3, impact: 5,
        mitigations: ['Welzijnsprotocol in elke agent', 'Verwijzing Kindertelefoon 0800-0432', '113 Zelfmoordpreventie 0800-0113'],
        residualRisk: 'Protocol is reactief; geen proactieve detectie; geen auto-notificatie naar docent.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 9(9)' },
    { id: 'R05', title: 'Data-exfiltratie via AI-output', category: 'veiligheid',
        description: 'Aanvaller probeert system prompt te lekken via de AI-output.',
        likelihood: 3, impact: 3,
        mitigations: ['systemInstruction server-side via roleId', 'isValidRoleId whitelist', 'promptSanitizer blokkeert system-prompt-probes'],
        residualRisk: 'System instructions zijn niet-geheim maar wel vertrouwelijk; reputatierisico.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 15' },
    { id: 'R06', title: 'Taalniveau-bias', category: 'bias',
        description: 'AI beoordeelt vmbo-antwoorden strenger dan havo/vwo door taalcomplexiteit.',
        likelihood: 3, impact: 4,
        mitigations: ['Agents geconfigureerd per educationLevel (mavo/havo/vwo)', 'XP-farming detectie'],
        residualRisk: 'Geen systematische biastesting uitgevoerd; Gemini overwegend Engels-getraind.',
        status: 'onvoldoende-beheerst', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 10(2)(f)' },
    { id: 'R07', title: 'Culturele bias in feedback', category: 'bias',
        description: 'AI-feedback bevat culturele aannames die niet aansluiten bij leerlingen met migratieachtergrond.',
        likelihood: 3, impact: 3,
        mitigations: ['Gemini meertalig getraind', 'Geen expliciete culturele bias-instructies'],
        residualRisk: 'Geen culturele-bias testing; risico in system instructions en basismodel.',
        status: 'onvoldoende-beheerst', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 10(2)(f)' },
    { id: 'R08', title: 'Gender/etniciteits-bias', category: 'bias',
        description: 'AI beoordeelt identieke antwoorden anders op basis van geïmpliceerde gender/etniciteit.',
        likelihood: 2, impact: 4,
        mitigations: ['Geen gender/etniciteit verzameld', 'Geen leerlingnamen naar AI', 'Geen genderspecifieke instructies'],
        residualRisk: 'Indirecte bias via taalpatronen blijft mogelijk.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 10(2)(f)' },
    { id: 'R09', title: 'Ongeautoriseerde toegang tot leerlingdata', category: 'privacy',
        description: 'Aanvaller krijgt toegang tot voortgang, chatgeschiedenis of profielgegevens.',
        likelihood: 2, impact: 5,
        mitigations: ['Supabase JWT-auth', 'RLS per tabel', 'CORS-whitelist', 'Audit logging'],
        residualRisk: 'Onbekende kwetsbaarheden in Supabase of applicatielaag.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 15(5)' },
    { id: 'R10', title: 'Chatinhoud naar derden', category: 'privacy',
        description: 'Leerlingberichten worden opgeslagen of gebruikt voor modeltraining door Google.',
        likelihood: 1, impact: 5,
        mitigations: ['Vertex AI enterprise europe-west4', 'Zero Data Retention contract', 'Service account auth', 'EU-dataresidentie'],
        residualRisk: 'Theoretisch risico op schending Google DPA.',
        status: 'beheerst', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 10(5)' },
    { id: 'R11', title: 'Schending ouderlijke toestemming <16', category: 'privacy',
        description: 'Leerlingen <16 gebruiken het platform zonder geldige ouderlijke toestemming.',
        likelihood: 3, impact: 4,
        mitigations: ['Consent-flow geïmplementeerd', 'School is verwerkingsverantwoordelijke', 'DPIA beschrijft toestemmingsvereisten'],
        residualRisk: 'DGSkills is verwerker; als school consent niet correct uitvoert, wordt data zonder grondslag verwerkt.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 9(9)' },
    { id: 'R12', title: 'AI-service uitval', category: 'operationeel',
        description: 'Vertex AI niet beschikbaar, missies kunnen niet worden gedaan.',
        likelihood: 2, impact: 3,
        mitigations: ['Error handling met 502 respons', 'Rate limit 429-melding'],
        residualRisk: 'Geen fallback-mechanisme; geen SLA met Google specifiek voor DGSkills.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 15(4)' },
    { id: 'R13', title: 'Onbegrensde kosten door token-misbruik', category: 'operationeel',
        description: 'Leerlingen of aanvallers versturen massaal berichten waardoor kosten oplopen.',
        likelihood: 3, impact: 3,
        mitigations: ['Rate limit 15 req/min/user (durable)', 'Max 4.000 tekens / 20KB', 'Max 1.024 output tokens', 'Chathistorie cap 12 berichten / 6.000 tekens'],
        residualRisk: 'Veel gelijktijdige gebruikers (hele school) kan piekkosten geven.',
        status: 'beheerst', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 15' },
    { id: 'R14', title: 'Supply chain aanval via dependencies', category: 'operationeel',
        description: 'Kwaadaardige code in npm- of Deno-dependency compromitteert het platform.',
        likelihood: 2, impact: 5,
        mitigations: ['esm.sh imports met versie-pinning', 'package-lock.json in client'],
        residualRisk: 'Geen geautomatiseerde dependency-scanning; esm.sh minder gecontroleerd dan npm.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 15(5)' },
    { id: 'R15', title: 'Docent kan AI-beslissing niet overrulen', category: 'operationeel',
        description: 'Docent ziet AI-fout maar kan STEP_COMPLETE niet corrigeren.',
        likelihood: 5, impact: 3,
        mitigations: ['ai_oversight_events migratie + SloOverrideModal (sprint 6)'],
        residualRisk: 'Tot live-deployment van de override-UI blijft dit non-compliant.',
        status: 'non-compliant', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 14',
        evidenceRefs: ['supabase/migrations/20260415100000_add_ai_oversight_events.sql', 'components/teacher/SloOverrideModal.tsx'] },
    { id: 'R16', title: 'Niet-naleving EU AI Act per 2 aug 2026', category: 'juridisch',
        description: 'DGSkills voldoet niet aan alle hoog-risico verplichtingen voor de deadline.',
        likelihood: 3, impact: 5,
        mitigations: ['Conformiteitsplan 6 fasen', 'DPIA + DPA afgerond', 'Audit logging actief', 'AI-transparantieverklaring publiek'],
        residualRisk: 'Gaps: QMS, volledige Annex IV documentatie, CE-markering, EU-databank registratie.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 6' },
    { id: 'R17', title: 'AVG-schending bij minderjarigen', category: 'juridisch',
        description: 'Onvoldoende bescherming persoonsgegevens leerlingen 12-18.',
        likelihood: 2, impact: 5,
        mitigations: ['DPIA', 'DPA Model 4.0', 'Privacyverklaring', 'Data-minimalisatie', 'Zero retention', 'EU-hosting', 'RLS', 'Audit'],
        residualRisk: 'Consent-flow afhankelijk van school; placeholders in privacy-doc zijn ingevuld (28 mrt 2026).',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'AVG Art. 6+8' },
    { id: 'R18', title: 'Geen beroepsmogelijkheid bij AI-beoordeling', category: 'juridisch',
        description: 'Leerling kan AI-beoordeling niet laten herzien door een mens.',
        likelihood: 4, impact: 3,
        mitigations: ['Docent-override (R15) lost dit deels op via ai_oversight_events'],
        residualRisk: 'Tot override live is en docent het proactief doet: schending Art. 22 AVG + Art. 14 AI Act.',
        status: 'non-compliant', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 14' },
    { id: 'R19', title: 'AI-aanbeveling (next-year) onjuist of bevooroordeeld', category: 'ai-bias',
        description: 'AI genereert een onjuiste of bias-bevattende aanbeveling voor volgend schooljaar.',
        likelihood: 3, impact: 3,
        mitigations: ['teacher_approved flow', 'Temperature 0.3', 'Evaluatieset met diverse profielen', 'AiDisclosureBadge'],
        residualRisk: 'Bij 30+ leerlingen klas: druk op docent om snel goed te keuren.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 14' },
    { id: 'R20', title: 'Adaptief systeem versterkt ongelijkheid', category: 'algoritmische-discriminatie',
        description: 'Lage nulmeting → makkelijkere leerpaden → kloof wordt groter in plaats van kleiner.',
        likelihood: 2, impact: 4,
        mitigations: ['Suggestief (niet restrictief) systeem', 'Alle missies blijven toegankelijk', 'Docent kan aanbeveling aanpassen'],
        residualRisk: 'Monitoring van feitelijk leerpad-gebruik bij pilot-cohort vereist.',
        status: 'actief', owner: OWNER, lastReview: REVIEW_LAST, nextReviewDue: REVIEW_NEXT,
        aiActArticle: 'Art. 10(2)(f)' },
];

export const calculateScore = (r: AiActRisk): number => r.likelihood * r.impact;

export type ScoreClass = 'laag' | 'midden' | 'hoog' | 'kritiek';

export const classifyScore = (score: number): ScoreClass => {
    if (score <= 4) return 'laag';
    if (score <= 9) return 'midden';
    if (score <= 15) return 'hoog';
    return 'kritiek';
};
