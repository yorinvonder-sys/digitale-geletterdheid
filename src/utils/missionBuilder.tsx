import React from 'react';
import { RotateCcw, Puzzle } from 'lucide-react';
import { getAllMissionIds, getPeriodConfig } from '@/config/curriculum';
import { ROLES } from '@/config/agents';
import { getMissionMeta } from '@/config/slo-kerndoelen-mapping';
import type { SloKerndoelCode } from '@/config/sloKerndoelen';

export interface Mission {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    number: string;
    status: 'available' | 'coming-soon' | 'locked';
    info?: string;
    lockLabel?: string;
    isReview?: boolean;
    classRestriction?: string;
    isHighlighted?: boolean;
    isBonus?: boolean;
    isExternal?: boolean;
    sloKerndoelen?: SloKerndoelCode[];
    sloVsoKerndoelen?: SloKerndoelCode[];
}

export const MISSION_OVERRIDES: Record<string, Partial<Mission>> = {
    // Leerjaar 1 — Periode 1
    'magister-master': { isExternal: true, info: 'Ik open Magister, bekijk mijn rooster en controleer mijn huiswerk. Klaar als: ik zelfstandig rooster, opdrachten en berichten kan vinden. Tijd: 15 minuten.' },
    'cloud-commander': { isExternal: true, info: 'Ik maak in OneDrive de mapstructuur van school en sla een testbestand op. Klaar als: mijn bestand op de juiste plek in OneDrive staat. Tijd: 15 minuten.' },
    'word-wizard': { isExternal: true, info: 'Ik maak in Word een document met koppen, een opsomming en een afbeelding. Klaar als: mijn document is opgeslagen in OneDrive. Tijd: 35 minuten.' },
    'slide-specialist': { isExternal: true, info: 'Ik maak in PowerPoint een presentatie van 3 slides met minimaal 1 afbeelding. Klaar als: mijn presentatie in OneDrive staat en 3 slides heeft. Tijd: 25 minuten.' },
    'print-pro': { isExternal: true, info: 'Ik print mijn Word-bestand via de print-app en lever mijn bestanden in via Magister. Klaar als: mijn print klopt en de opdracht op "Ingeleverd" staat. Tijd: 15 minuten.' },
    'ipad-print-instructies': { isHighlighted: true, classRestriction: 'MH1A', info: 'Ik leer stap voor stap hoe ik vanaf mijn iPad print. Ik download de print-app, log in en verstuur mijn eerste printopdracht.' },
    'cloud-cleaner': { info: 'Ik herhaal hoe ik bestanden logisch orden. Ik sleep losse bestanden naar de juiste map en maak mijn cloud overzichtelijk.' },
    'layout-doctor': { info: 'Ik test mijn Word-kennis door problemen aan oplossingen te koppelen. Ik herken sneller welke functie ik nodig heb.' },
    'pitch-police': { info: 'Ik herhaal de basis van goed slide-ontwerp. Ik verbeter een saaie slide zodat die duidelijker en aantrekkelijker wordt.' },
    // Leerjaar 1 — Periode 2
    'prompt-master': { info: 'Ik ontdek hoe ik AI duidelijker aanstuur met sterke prompts. Ik leer het verschil tussen vaag vragen en precies formuleren.' },
    'game-programmeur': { info: 'Ik pas code aan in een game en zie direct wat mijn wijziging doet. Ik leer bugs oplossen en spelregels veranderen.' },
    'ai-trainer': { info: 'Ik train een AI met voorbeelden en test wat het model daarvan leert. Ik ontdek hoe trainingsdata de uitkomst beïnvloedt.' },
    'chatbot-trainer': { info: 'Ik bouw een chatbot met eigen regels en test of de antwoorden kloppen. Ik ontdek hoe een eenvoudig chatsysteem beslissingen neemt.' },
    'ai-tekengame': { info: 'Ik teken objecten en test of AI mijn patronen herkent. Ik ontdek waar een herkenningsmodel goed en minder goed in is.' },
    'game-director': { number: 'Vrije Keuze', info: 'Ik ontwerp mijn eigen game-regels met codeblokken. Ik pas beweging, zwaartekracht en gedrag aan tot mijn game werkt zoals ik wil.' },
    'verhalen-ontwerper': { info: 'Ik zet een verhaal om in beelden met AI. Ik oefen met prompts en visualiseer scènes uit mijn eigen verhaal.' },
    'ai-beleid-brainstorm': { info: 'Ik denk mee over regels voor AI op school. Ik geef ideeën, weeg keuzes af en stem op de beste voorstellen.' },
    'code-denker': { info: 'Ik los puzzels op met computational thinking. Ik oefen met opdelen, patronen herkennen en stappenplannen maken.' },
    'website-bouwer': { info: 'Ik bouw een eenvoudige webpagina met echte HTML en CSS. Ik leer hoe tekst, vormgeving en structuur samen een website maken.' },
    'schermtijd-coach': { info: 'Ik analyseer mijn schermgedrag en herken trucs die apps gebruiken om aandacht vast te houden. Ik maak een balansplan dat ik echt kan volhouden.' },
    'notificatie-ninja': { info: 'Ik onderzoek hoe notificaties mijn aandacht sturen. Ik bepaal welke meldingen helpen en welke mij vooral afleiden.' },
    'review-week-2': { info: 'Ik herhaal wat ik heb geleerd over AI en programmeren. Ik test of ik fouten en zwakke plekken in AI-output herken.' },
    // Leerjaar 1 — Periode 3
    'data-detective': { info: 'Ik onderzoek welke data bedrijven verzamelen en wat ze ermee doen. Ik weeg voordelen af tegen risico\'s en maak bewustere internetkeuzes.' },
    'data-verzamelaar': { info: 'Ik verzamel data over mijn schermtijd of appgebruik en zet die om in een overzicht. Ik leer wat cijfers zeggen over mijn digitale gewoonten.' },
    'deepfake-detector': { info: 'Ik analyseer beelden en berichten om te bepalen wat echt is en wat door AI is gemaakt. Ik leer signalen van deepfakes en nepcontent herkennen.' },
    'ai-spiegel': { info: 'Ik onderzoek hoe platforms mijn likes, kijktijd en zoekgedrag gebruiken. Ik ontdek wat dat oplevert, welke risico\'s erbij horen en welke privacyregels ik zelf kies.' },
    'social-safeguard': { info: 'Ik oefen met scenario\'s rond online druk, pesten en misbruik van data. Ik leer veilig reageren, bewijs bewaren en verstandig melden.' },
    'scroll-stopper': { info: 'Ik onderzoek hoe eindeloos scrollen mijn aandacht stuurt. Ik bespreek welke ontwerpkeuzes helpen en welke juist verslavend werken.' },
    'cookie-crusher': { info: 'Ik herken dark patterns in cookie-popups en oefen met privacyvriendelijke keuzes. Ik zie hoe websites mij proberen te sturen.' },
    'data-handelaar': { info: 'Ik onderzoek verdachte bewijsstukken en ontdek waar illegale datahandel misgaat. Ik herken AVG-overtredingen en zet mijn bevindingen op een rij.' },
    'privacy-profiel-spiegel': { info: 'Ik controleer mijn echte privacy-instellingen in apps en ontdek wat ik deel. Ik maak op basis daarvan een persoonlijk actieplan.' },
    'filter-bubble-breaker': { info: 'Ik vergelijk verschillende feeds en ontdek hoe algoritmes mijn online wereld vormen. Ik leer hoe ik mijn filterbubbel kan doorbreken.' },
    'datalekken-rampenplan': { info: 'Ik pak een datalek stap voor stap aan. Ik maak keuzes over communicatie, melding en herstel tijdens een digitale crisis.' },
    'data-voor-data': { info: 'Ik bepaal hoeveel persoonlijke data ik wil inruilen voor gemak. Ik vergelijk keuzes en ontdek mijn eigen privacygrenzen.' },
    'data-speurder': { info: 'Ik speur naar sporen van datagebruik in apps en online diensten. Ik ontdek welke gegevens worden verzameld en wat dat voor mij betekent.' },
    'digitale-balans-coach': { info: 'Ik onderzoek hoe technologie mijn rust, aandacht en welzijn beïnvloedt. Ik maak afgewogen keuzes voor een gezondere digitale balans.' },
    'social-media-psychologist': { isBonus: true, info: 'Ik verdiep me in de psychologie achter scrollen, likes en filterbubbels. Ik ontdek hoe platforms mijn aandacht sturen en welke keuzes ik zelf kan maken.' },
    // Leerjaar 1 — Periode 4
    'review-week-3': { info: 'Ik herhaal wat ik heb geleerd over veiligheid, privacy en ethiek. Ik test of ik slimme en verantwoorde digitale keuzes kan onderbouwen.' },
    'mission-blueprint': { info: 'Ik organiseer mijn eindproject en maak een duidelijk plan. Ik zet mijn ideeën, taken en bestanden overzichtelijk klaar.' },
    'mission-vision': { info: 'Ik werk mijn idee visueel uit met AI en design. Ik maak een moodboard of pitch waarmee mijn concept direct duidelijk wordt.' },
    'mission-launch': { info: 'Ik werk mijn presentatie en eindproducten af en maak ze klaar om te delen. Ik laat zien wat ik dit jaar heb geleerd.' },
    // Leerjaar 2 — Periode 1
    'data-journalist': { info: 'Ik analyseer een dataset en haal er een duidelijk verhaal uit. Ik presenteer mijn inzichten in een infographic of visuele samenvatting.' },
    'spreadsheet-specialist': { info: 'Ik gebruik formules, grafieken en overzicht om data te ordenen. Ik maak van losse cellen een spreadsheet waar ik echt iets uit kan aflezen.' },
    'factchecker': { info: 'Ik controleer of een online bewering klopt. Ik vergelijk bronnen, beoordeel betrouwbaarheid en trek een onderbouwde conclusie.' },
    'api-verkenner': { info: 'Ik ontdek hoe apps en websites data uitwisselen via API\'s. Ik lees antwoorden uit een API en begrijp wat de velden betekenen.' },
    'dashboard-designer': { info: 'Ik kies passende grafieken en ontwerp een dashboard dat belangrijke data snel zichtbaar maakt. Ik leer hoe ik informatie helder presenteer.' },
    'ai-bias-detective': { info: 'Ik onderzoek of een AI-systeem groepen oneerlijk behandelt. Ik herken bias in de output en bedenk hoe het eerlijker kan.' },
    'data-review': { info: 'Ik herhaal de belangrijkste dataconcepten uit deze periode. Ik test of ik patronen, visualisaties en bronkritiek goed kan toepassen.' },
    // Leerjaar 2 — Periode 2
    'algorithm-architect': { info: 'Ik ontwerp een algoritme dat een probleem stap voor stap oplost. Ik denk na over logica, efficiëntie en de beste aanpak.' },
    'web-developer': { info: 'Ik bouw een interactieve webpagina met HTML, CSS en JavaScript. Ik laat code, vormgeving en gedrag samenwerken.' },
    'network-navigator': { info: 'Ik volg hoe data van apparaat naar server reist. Ik begrijp beter hoe netwerken werken en waar vertraging of fouten kunnen ontstaan.' },
    'app-prototyper': { info: 'Ik ontwerp een app-prototype met schermen, navigatie en gebruikersflow. Ik laat zien hoe een idee werkt voordat het wordt gebouwd.' },
    'bug-hunter': { info: 'Ik spoor fouten in code systematisch op en los ze op. Ik test mijn aannames en verbeter stap voor stap het programma.' },
    'automation-engineer': { info: 'Ik automatiseer een terugkerende taak met code of logica. Ik ontwerp een oplossing die tijd bespaart en betrouwbaar werkt.' },
    'code-reviewer': { info: 'Ik beoordeel code kritisch en zoek naar onduidelijkheden, fouten en verbeterpunten. Ik leer hoe goede code leesbaar en onderhoudbaar blijft.' },
    'privacy-by-design': { info: 'Ik analyseer een app op privacyrisico\'s en ontwerp veiligere keuzes vanaf het begin. Ik vertaal privacyregels naar concrete ontwerpbeslissingen.' },
    'wachtwoord-warrior': { info: 'Ik test hoe sterk of zwak wachtwoorden zijn en leer waarom sommige wachtwoorden snel te kraken zijn. Ik formuleer regels voor betere beveiliging.' },
    'access-control-engineer': { info: 'Ik stel rollen en rechten zo in dat alleen de juiste mensen toegang krijgen. Ik test of gevoelige informatie goed is afgeschermd.' },
    'code-review-2': { info: 'Ik herhaal programmeerconcepten en test of ik codeproblemen kan herkennen en uitleggen. Ik laat zien dat ik kritisch naar software kan kijken.' },
    // Leerjaar 2 — Periode 3
    'ux-detective': { info: 'Ik onderzoek waarom gebruikers vastlopen in een interface. Ik herken UX-problemen en ontwerp verbeteringen die de app duidelijker maken.' },
    'podcast-producer': { info: 'Ik ontwikkel een podcastconcept en werk een aflevering uit van intro tot outro. Ik combineer inhoud, structuur en doelgroepgericht vertellen.' },
    'meme-machine': { info: 'Ik analyseer waarom memes werken en ontwerp mijn eigen deelbare content. Ik let op timing, beeldtaal en online impact.' },
    'digital-storyteller': { info: 'Ik ontwerp een digitaal verhaal met keuzes of vertakkingen. Ik bouw een ervaring waarin structuur en verhaal elkaar versterken.' },
    'brand-builder': { info: 'Ik ontwerp een visuele identiteit met kleur, vorm en stijl. Ik zorg dat merkkeuzes passen bij doelgroep en boodschap.' },
    'video-editor': { info: 'Ik plan een video met storyboard, shots en montagekeuzes. Ik zet losse beelden om in een duidelijk verhaal.' },
    'online-helden': { info: 'Ik oefen met situaties waarin ik online voor mezelf of anderen moet opkomen. Ik kies acties die veilig, behulpzaam en respectvol zijn.' },
    'media-review': { info: 'Ik herhaal de mediaconcepten uit deze periode. Ik test of ik sterke keuzes in content, ontwerp en vormgeving herken.' },
    // Leerjaar 2 — Periode 4
    'ai-ethicus': { info: 'Ik beoordeel AI-dilemma\'s vanuit privacy, eerlijkheid en verantwoordelijkheid. Ik leer mijn standpunt onderbouwen met argumenten.' },
    'digital-rights-defender': { info: 'Ik onderzoek welke digitale rechten gebruikers hebben en vertaal die naar concrete afspraken. Ik schrijf een manifest dat privacy en keuzevrijheid beschermt.' },
    'tech-court': { info: 'Ik voer een debat over een technologisch dilemma en weeg verschillende standpunten af. Ik leer argumenteren vanuit feiten en waarden.' },
    'future-forecaster': { info: 'Ik maak een onderbouwde toekomstvisie op technologie en samenleving. Ik denk na over kansen, risico\'s en gevolgen op langere termijn.' },
    'sustainability-scanner': { info: 'Ik bereken de milieu-impact van digitale keuzes en vergelijk duurzamere alternatieven. Ik ontdek wat technologie kost aan energie en uitstoot.' },
    'eindproject-j2': { info: 'Ik combineer mijn vaardigheden uit dit leerjaar in één groter eindproject. Ik onderzoek, ontwerp en presenteer een eigen digitale oplossing.' },
    // Leerjaar 3 — Periode 1
    'ml-trainer': { info: 'Ik train een eenvoudig machine-learningmodel en meet hoe goed het presteert. Ik leer waarom data, features en evaluatie het verschil maken.' },
    'api-architect': { info: 'Ik ontwerp een REST API met logische endpoints en duidelijke documentatie. Ik leer hoe frontend en backend via vaste afspraken samenwerken.' },
    'neural-navigator': { info: 'Ik onderzoek hoe neuronen, lagen en backpropagation samenwerken in een neuraal netwerk. Ik maak abstracte AI-stappen concreet en begrijpelijk.' },
    'data-pipeline': { info: 'Ik volg hoe data door een systeem stroomt: van bron tot verwerking tot dashboard. Ik leer waar fouten, vertraging en kwaliteitsproblemen kunnen ontstaan.' },
    'open-source-contributor': { info: 'Ik verbeter een bestaand softwareproject en werk samen volgens open-source werkwijzen. Ik leer hoe ik wijzigingen voorstel, documenteer en verantwoord.' },
    'advanced-code-review': { info: 'Ik herhaal geavanceerde programmeerconcepten en test of ik complexe code kan beoordelen. Ik let op kwaliteit, structuur en risico\'s.' },
    // Leerjaar 3 — Periode 2
    'cyber-detective': { info: 'Ik onderzoek digitale sporen om een cyberincident te ontrafelen. Ik combineer aanwijzingen en trek een technisch onderbouwde conclusie.' },
    'encryption-expert': { info: 'Ik los puzzels op rond versleuteling en begrijp hoe berichten veilig worden beschermd. Ik ontdek hoe sleutels, codes en encryptie samenwerken.' },
    'phishing-fighter': { info: 'Ik herken phishing-signalen in berichten, links en websites. Ik oefen hoe ik veilig reageer op digitale misleiding.' },
    'security-auditor': { info: 'Ik controleer een systeem op beveiligingsrisico\'s en herken veelvoorkomende kwetsbaarheden. Ik onderbouw welke maatregelen het meest dringend zijn.' },
    'digital-forensics': { info: 'Ik analyseer digitale sporen na een incident en reconstrueer wat er is gebeurd. Ik leer bewijs zorgvuldig lezen en interpreteren.' },
    'security-review': { info: 'Ik herhaal de belangrijkste cybersecurityconcepten en test of ik risico\'s en aanvallen correct kan beoordelen.' },
    // Leerjaar 3 — Periode 3
    'startup-simulator': { info: 'Ik ontwikkel een tech-idee van probleem tot businessconcept. Ik weeg niet alleen kansen, maar ook de impact op gebruikers en samenleving.' },
    'policy-maker': { info: 'Ik schrijf beleid voor een digitaal vraagstuk en onderbouw welke regels verstandig zijn. Ik weeg belangen, risico\'s en uitvoerbaarheid tegen elkaar af.' },
    'innovation-lab': { info: 'Ik werk een vernieuwend techconcept uit en test hoe haalbaar het is. Ik combineer creativiteit met kritische afwegingen.' },
    'digital-divide-researcher': { info: 'Ik onderzoek hoe toegang tot technologie ongelijk verdeeld is. Ik analyseer gevolgen en bedenk hoe digitale kansen eerlijker kunnen worden verdeeld.' },
    'tech-impact-analyst': { info: 'Ik analyseer hoe een technologie mensen, werk of samenleving beïnvloedt. Ik kijk naar voordelen, risico\'s en onverwachte bijwerkingen.' },
    'welzijnsonderzoeker': { info: 'Ik onderzoek data over welzijn en digitaal gedrag. Ik trek conclusies uit patronen en vertaal die naar praktische aanbevelingen.' },
    'startup-pitch': { info: 'Ik werk een pitch uit waarmee ik een tech-idee overtuigend presenteer. Ik combineer probleem, oplossing, bewijs en impact in één helder verhaal.' },
    'impact-review': { info: 'Ik herhaal wat ik heb geleerd over innovatie, maatschappelijke impact en digitale keuzes. Ik test of ik technologische gevolgen scherp kan beoordelen.' },
    // Leerjaar 3 — Periode 4
    'portfolio-builder': { info: 'Ik verzamel mijn beste werk en maak een portfolio dat mijn ontwikkeling laat zien. Ik kies bewijs, structuur en presentatie bewust.' },
    'research-project': { info: 'Ik voer een onderzoek uit rond een digitale vraag en werk mijn bevindingen helder uit. Ik verzamel, analyseer en interpreteer informatie zelfstandig.' },
    'prototype-developer': { info: 'Ik bouw een prototype dat een idee tastbaar maakt. Ik test of mijn oplossing werkt en verbeter op basis van feedback.' },
    'pitch-perfect': { info: 'Ik maak een sterke eindpitch waarin inhoud, vorm en overtuigingskracht samenkomen. Ik laat zien waarom mijn project relevant en haalbaar is.' },
    'reflection-report': { info: 'Ik kijk kritisch terug op mijn keuzes, leerproces en resultaat. Ik onderbouw wat goed werkte en wat ik een volgende keer anders doe.' },
    'meesterproef': { info: 'Ik breng al mijn digitale vaardigheden samen in één meesterproef. Ik lever een project op waarin onderzoek, ontwerp, techniek en reflectie samenkomen.' },
};

export const CURRICULUM_MISSION_IDS = new Set(getAllMissionIds());

const warnedMissingMissionInfo = new Set<string>();

export const getMissionOverride = (missionId: string): Partial<Mission> =>
    MISSION_OVERRIDES[missionId] || {};

export const getMissionTooltipInfo = (
    missionId: string,
    role?: { problemScenario?: string; missionObjective?: string },
): string | undefined => {
    const explicitInfo = getMissionOverride(missionId).info?.trim();
    if (explicitInfo) return explicitInfo;

    if (import.meta.env.DEV && CURRICULUM_MISSION_IDS.has(missionId) && !warnedMissingMissionInfo.has(missionId)) {
        warnedMissingMissionInfo.add(missionId);
        console.warn(`[ProjectZeroDashboard] Missing explicit tooltip info for mission "${missionId}"`);
    }

    const fallback = [role?.problemScenario, role?.missionObjective].filter(Boolean).join(' ').trim();
    return fallback || undefined;
};

export function buildMissionsForPeriod(yearGroup: number, period: number): Mission[] {
    const periodConfig = getPeriodConfig(yearGroup, period);
    if (!periodConfig) return [];
    const missions: Mission[] = [];

    for (const missionId of (periodConfig.reviewMissions || [])) {
        const role = ROLES.find(r => r.id === missionId);
        const meta = getMissionMeta(missionId);
        const overrides = getMissionOverride(missionId);
        missions.push({
            id: missionId,
            title: role?.title || missionId,
            description: role?.description || '',
            icon: role?.icon ? React.cloneElement(role.icon as React.ReactElement<{ size?: number }>, { size: 40 }) : <RotateCcw size={40} />,
            number: 'Review',
            status: 'available',
            info: getMissionTooltipInfo(missionId, role),
            isReview: true,
            classRestriction: overrides.classRestriction || meta?.classRestriction,
            isHighlighted: overrides.isHighlighted,
            sloKerndoelen: meta?.sloKerndoelen || periodConfig.sloFocus,
            sloVsoKerndoelen: meta?.sloVsoKerndoelen,
        });
    }

    let missionNum = 1;
    for (const missionId of periodConfig.missions) {
        const role = ROLES.find(r => r.id === missionId);
        const meta = getMissionMeta(missionId);
        const overrides = getMissionOverride(missionId);
        missions.push({
            id: missionId,
            title: role?.title || missionId,
            description: role?.description || '',
            icon: role?.icon ? React.cloneElement(role.icon as React.ReactElement<{ size?: number }>, { size: 40 }) : <Puzzle size={40} />,
            number: overrides.number || String(missionNum).padStart(2, '0'),
            status: 'available',
            info: getMissionTooltipInfo(missionId, role),
            isReview: false,
            isExternal: overrides.isExternal,
            isBonus: overrides.isBonus,
            classRestriction: overrides.classRestriction || meta?.classRestriction,
            sloKerndoelen: meta?.sloKerndoelen || periodConfig.sloFocus,
            sloVsoKerndoelen: meta?.sloVsoKerndoelen,
        });
        missionNum++;
    }
    return missions;
}
