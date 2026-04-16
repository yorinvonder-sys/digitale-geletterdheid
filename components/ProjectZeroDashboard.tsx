
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { Rocket, BrainCircuit, ShieldCheck, Gamepad2, Stars, Info, Play, Feather, Puzzle, Database, ChevronRight, ChevronLeft, Calendar, Pencil, Map, Lightbulb, Trophy, LogOut, User, RotateCcw, Search, Scale, Lock, Settings2, Cloud, FileText, Monitor, Printer, AlertTriangle, Sparkles, MessageSquare, Send, Loader2, BookOpen, BarChart2, Eye, CheckCircle2, MonitorSmartphone } from 'lucide-react';
import { getLevelProgress, getXPToNextLevel, LEVEL_THRESHOLDS } from '../utils/xp';
import { LazyAvatarViewer } from './LazyAvatarViewer';
import { DEFAULT_AVATAR_CONFIG, UserStats, EducationLevel } from '../types';
import { subscribeToPermissions, getGamePermissions, GamePermissions } from '../services/PermissionService';
import { submitFeedback } from '../services/feedbackService';
import { StudentLibrary } from './StudentLibrary';
import { BottomNav } from './BottomNav';
import { SLO_KERNDOELEN, getKerndoelBadgeClasses, SloKerndoelCode } from '../config/sloKerndoelen';
import { CURRICULUM, getAllMissionIds, getYearConfig, getPeriodConfig } from '../config/curriculum';
import { ROLES } from '../config/agents';
import { getMissionMeta } from '../config/slo-kerndoelen-mapping';
import { ContainerConfig } from '@/config/containerTypes';
import { getContainerTheme, getAutoTheme } from '@/config/containerThemes';
import { AdaptiveMissionSuggestions } from './dashboard/AdaptiveMissionSuggestions';

interface DashboardProps {
    onSelectModule: (moduleId: string, libraryItemData?: any) => void;
    onOpenProfile: (tab?: 'profile' | 'shop' | 'trophies') => void;
    onLogout?: () => void;
    onOpenGames?: () => void;
    gamesEnabled?: boolean;
    userDisplayName?: string | null;
    userUid?: string; // For AI Chat
    activeWeek: number;
    setActiveWeek: (week: number) => void;
    activeYearGroup?: number;
    setActiveYearGroup?: (year: number) => void;
    schoolConfig?: { periodNaming?: string };
    onGoHome?: () => void;
    stats?: UserStats;
    focusMode?: boolean;
    userRole?: 'student' | 'teacher' | 'admin'; // For teacher bypass of restrictions
    containers?: ContainerConfig[];
}

interface Mission {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    number: string;
    status: 'available' | 'coming-soon' | 'locked';
    info?: string;
    isReview?: boolean;
    classRestriction?: string; // Only show to students of this class (e.g. 'MH1A')
    isHighlighted?: boolean; // Show with orange glow effect
    isBonus?: boolean; // Optional bonus/extension mission for fast finishers
    isExternal?: boolean; // Execute mission in external app (Microsoft/Magister)
    sloKerndoelen?: SloKerndoelCode[]; // SLO kerndoel codes (e.g. ['21A', '22B'])
    sloVsoKerndoelen?: SloKerndoelCode[]; // NEW: SLO VSO kerndoel codes (e.g. ['18A', '20B'])
}

// Periode-kleurthema's per periode-nummer (Tailwind-safe volledige klassen)
// Iconen naast kleuren voor kleurenblind-toegankelijkheid
const PERIOD_THEME: Record<number, { border: string; bg: string; text: string; icon: React.ReactNode; label: string }> = {
    1: { border: 'border-indigo-100', bg: 'bg-indigo-50', text: 'text-indigo-600', icon: <Monitor size={14} />, label: 'Digitale Basis' },
    2: { border: 'border-pink-100', bg: 'bg-pink-50', text: 'text-pink-600', icon: <BrainCircuit size={14} />, label: 'AI & Creatie' },
    3: { border: 'border-cyan-100', bg: 'bg-cyan-50', text: 'text-cyan-600', icon: <ShieldCheck size={14} />, label: 'Data & Veiligheid' },
    4: { border: 'border-violet-100', bg: 'bg-violet-50', text: 'text-violet-600', icon: <Rocket size={14} />, label: 'Eindproject' },
};
const DEFAULT_PERIOD_THEME = { border: 'border-slate-100', bg: 'bg-slate-50', text: 'text-slate-600', icon: <Puzzle size={14} />, label: '' };

interface YearGroupTheme {
    label: string;
    Icon: React.ComponentType<any>;
    badgeBg: string;
    badgeText: string;
    accentDot: string;
    activeBorder: string;
    activeText: string;
    focusRing: string;
    gradient: string;
}

const getYearGroupTheme = (year: number): YearGroupTheme => {
    switch (year) {
        case 1:
            return {
                label: 'Digitale Basis',
                Icon: MonitorSmartphone,
                badgeBg: 'bg-indigo-100',
                badgeText: 'text-indigo-700',
                accentDot: 'bg-indigo-500',
                activeBorder: 'border-indigo-200',
                activeText: 'text-indigo-700',
                focusRing: 'ring-indigo-100',
                gradient: 'from-indigo-500 to-blue-500',
            };
        case 2:
            return {
                label: 'Digitale Verdieping',
                Icon: BrainCircuit,
                badgeBg: 'bg-pink-100',
                badgeText: 'text-pink-700',
                accentDot: 'bg-pink-500',
                activeBorder: 'border-pink-200',
                activeText: 'text-pink-700',
                focusRing: 'ring-pink-100',
                gradient: 'from-pink-500 to-rose-500',
            };
        case 3:
            return {
                label: 'Digitale Meesterschap',
                Icon: Rocket,
                badgeBg: 'bg-violet-100',
                badgeText: 'text-violet-700',
                accentDot: 'bg-violet-500',
                activeBorder: 'border-violet-200',
                activeText: 'text-violet-700',
                focusRing: 'ring-violet-100',
                gradient: 'from-violet-500 to-indigo-500',
            };
        default:
            return {
                label: 'Digitale Leerlijn',
                Icon: MonitorSmartphone,
                badgeBg: 'bg-slate-100',
                badgeText: 'text-slate-700',
                accentDot: 'bg-slate-500',
                activeBorder: 'border-slate-200',
                activeText: 'text-slate-700',
                focusRing: 'ring-slate-100',
                gradient: 'from-slate-500 to-slate-600',
            };
    }
};

// Periode-specifieke leerdoel-beschrijvingen (tekst die niet in curriculum.ts hoort)
interface PeriodLeerdoel {
    description: string;
    descriptionVso?: string;
    lesduur?: string;
    succescriterium?: string;
    succescriDagbesteding?: string;
}

const PERIOD_LEERDOELEN: Record<string, PeriodLeerdoel> = {
    '1-1': {
        description: 'Na deze periode maak je zelf een Word-document en PowerPoint, print je het op school en lever je het in via OneDrive — zonder hulp.',
        descriptionVso: 'Na deze periode kun je zelf een document typen, opslaan en printen op een tablet of computer.',
        lesduur: 'Lesduur: 1 uur 45 minuten. Werk in deze volgorde: LVS (15) → OneDrive (15) → Word (35) → PowerPoint (25) → Printen + Inleveren (15).',
        succescriterium: 'je hebt 1 pagina geprint en je Word- en PowerPoint-bestand staan in OneDrive.',
        succescriDagbesteding: 'je hebt samen een document geprint en opgeslagen.',
    },
    '1-2': {
        description: 'Na deze periode weet je hoe AI werkt, schrijf je prompts die echt goed werken en heb je zelf een game aangepast met code.',
        descriptionVso: 'Na deze periode herken je AI om je heen (denk aan Siri, filters, aanbevelingen) en heb je zelf iets gemaakt met een AI-tool.',
        lesduur: 'Lesduur: 1 uur 45 minuten. Start met de herhalingsopdrachten (15 min) → Prompt Perfectionist (15 min) → Game Programmeur (25 min) → AI Trainer (15 min) → Chatbot Trainer (15 min) → Vrije keuze (20 min).',
        succescriterium: 'je hebt minimaal 3 missies afgerond en kunt aan een klasgenoot uitleggen hoe AI leert van voorbeelden.',
        succescriDagbesteding: 'je hebt met een AI-tool gewerkt en er iets creatiefs mee gemaakt.',
    },
    '1-3': {
        description: 'Na deze periode weet je wat bedrijven met jouw data doen, herken je deepfakes en nepaccounts, en heb je 3 eigen regels voor veilig online gedrag.',
        descriptionVso: 'Na deze periode weet je hoe je veilig omgaat met je gegevens online en herken je nep-content.',
        lesduur: 'Lesduur: 1 uur 45 minuten. Werk in deze volgorde: Code-Criticus review (10 min) → Data Detective (25 min) → Deepfake Detector (15 min) → AI Spiegel (20 min) → Social Safeguard (15 min) → Reflectie + 3 persoonlijke dataregels (10 min).',
        succescriterium: 'je hebt je eigen "Mijn 3 Dataregels"-kaart gemaakt met: 2 dingen die handig zijn aan data, 2 gevaren waar je op let, en 3 keuzes voor veiliger internetten.',
        succescriDagbesteding: 'je hebt geoefend met online veiligheid en je eigen regels opgeschreven.',
    },
    '1-4': {
        description: 'Je maakt een eindproject waarin je laat zien wat je dit jaar hebt geleerd — van Word tot AI tot online veiligheid.',
        descriptionVso: 'Je maakt een eindproject waarin je laat zien wat je dit jaar hebt geleerd over technologie.',
    },
};

// Missie-specifieke metadata die niet in curriculum.ts of agents.tsx staat
const MISSION_OVERRIDES: Record<string, Partial<Mission>> = {
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

const CURRICULUM_MISSION_IDS = new Set(getAllMissionIds());
const warnedMissingMissionInfo = new Set<string>();

const getMissionOverride = (missionId: string): Partial<Mission> =>
    MISSION_OVERRIDES[missionId] || {};

const getMissionTooltipInfo = (
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

// Bouw missies dynamisch op basis van curriculum config + agent definities
function buildMissionsForPeriod(yearGroup: number, period: number): Mission[] {
    const periodConfig = getPeriodConfig(yearGroup, period);
    if (!periodConfig) return [];
    const missions: Mission[] = [];

    // Review missions eerst
    for (const missionId of (periodConfig.reviewMissions || [])) {
        const role = ROLES.find(r => r.id === missionId);
        const meta = getMissionMeta(missionId);
        const overrides = getMissionOverride(missionId);
        missions.push({
            id: missionId,
            title: role?.title || missionId,
            description: role?.description || '',
            icon: role?.icon ? React.cloneElement(role.icon as React.ReactElement, { size: 40 }) : <RotateCcw size={40} />,
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

    // Reguliere missions
    let missionNum = 1;
    for (const missionId of periodConfig.missions) {
        const role = ROLES.find(r => r.id === missionId);
        const meta = getMissionMeta(missionId);
        const overrides = getMissionOverride(missionId);
        missions.push({
            id: missionId,
            title: role?.title || missionId,
            description: role?.description || '',
            icon: role?.icon ? React.cloneElement(role.icon as React.ReactElement, { size: 40 }) : <Puzzle size={40} />,
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

// Legacy compat — niet meer gebruikt maar voorkomt crashes bij directe WEEK_MISSIONS referenties
const WEEK_MISSIONS: Record<number, Mission[]> = {
    1: [
        {
            id: 'magister-master',
            title: 'Magister Meester',
            description: 'Werk in de Magister app op je iPad.',
            icon: <ShieldCheck size={40} />,
            number: '01',
            status: 'available',
            isExternal: true,
            info: getMissionTooltipInfo('magister-master'),
            sloKerndoelen: ['21A', '21C']
        },
        {
            id: 'cloud-commander',
            title: 'Cloud Commander',
            description: 'Werk in de OneDrive app op je iPad.',
            icon: <Database size={40} />,
            number: '02',
            status: 'available',
            isExternal: true,
            info: getMissionTooltipInfo('cloud-commander'),
            sloKerndoelen: ['21A', '23A']
        },
        {
            id: 'word-wizard',
            title: 'Word Wizard',
            description: 'Werk in de Word app op je iPad.',
            icon: <Pencil size={40} />,
            number: '03',
            status: 'available',
            isExternal: true,
            info: getMissionTooltipInfo('word-wizard'),
            sloKerndoelen: ['21A', '22A']
        },
        {
            id: 'slide-specialist',
            title: 'Slide Specialist',
            description: 'Werk in de PowerPoint app op je iPad.',
            icon: <Play size={40} />,
            number: '04',
            status: 'available',
            isExternal: true,
            info: getMissionTooltipInfo('slide-specialist'),
            sloKerndoelen: ['21A', '21C', '22A']
        },
        {
            id: 'print-pro',
            title: 'Print Pro',
            description: 'Printen en inleveren via de apps op je iPad.',
            icon: <Stars size={40} />,
            number: '05',
            status: 'available',
            isExternal: true,
            info: getMissionTooltipInfo('print-pro'),
            sloKerndoelen: ['21A']
        },
    ],
    2: [
        { id: 'ipad-print-instructies', title: 'iPad Print Instructies', description: 'Leer stap-voor-stap printen vanaf je iPad met de RICOH myPrint app.', icon: <Printer size={40} />, number: 'MH1A', status: 'available', info: getMissionTooltipInfo('ipad-print-instructies'), isHighlighted: true, isReview: true, sloKerndoelen: ['21A'] },
        { id: 'cloud-cleaner', title: 'Cloud Schoonmaker', description: 'Sleep de rondslingerende bestanden naar de juiste mappen.', icon: <Cloud size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('cloud-cleaner'), isReview: true, sloKerndoelen: ['21A'] },
        { id: 'layout-doctor', title: 'Word Match', description: 'Koppel Word-problemen aan de juiste oplossing!', icon: <FileText size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('layout-doctor'), isReview: true, sloKerndoelen: ['21A'] },
        { id: 'pitch-police', title: 'Pitch Politie', description: 'Geef deze saaie slide een makeover zodat het publiek niet in slaap valt.', icon: <Monitor size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('pitch-police'), isReview: true, sloKerndoelen: ['21A', '22B'] },

        { id: 'prompt-master', title: 'Prompt Perfectionist', description: 'Leer het verschil tussen goede en slechte prompts.', icon: <Sparkles size={40} />, number: '01', status: 'available', info: getMissionTooltipInfo('prompt-master'), sloKerndoelen: ['21B', '22A'], sloVsoKerndoelen: ['18C', '19A', '20B'] },
        { id: 'game-programmeur', title: 'Game Programmeur', description: 'Repareer games met code. Bepaal zelf de regels van het spel.', icon: <Gamepad2 size={40} />, number: '02', status: 'available', info: getMissionTooltipInfo('game-programmeur'), sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
        { id: 'ai-trainer', title: 'AI Trainer', description: 'Leer een robot het verschil tussen materialen met supervised learning.', icon: <Database size={40} />, number: '04', status: 'available', info: getMissionTooltipInfo('ai-trainer'), sloKerndoelen: ['21D'], sloVsoKerndoelen: ['18C'] },
        { id: 'chatbot-trainer', title: 'Chatbot Trainer', description: 'Bouw je eigen chatbot en leer hoe AI gesprekken voert.', icon: <BrainCircuit size={40} />, number: '05', status: 'available', info: getMissionTooltipInfo('chatbot-trainer'), sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
        { id: 'ai-tekengame', title: 'AI Tekengame', description: 'Teken en laat de AI raden wat het is!', icon: <Pencil size={40} />, number: '06', status: 'available', info: getMissionTooltipInfo('ai-tekengame'), sloKerndoelen: ['21B'], sloVsoKerndoelen: ['18C'] },
        { id: 'game-director', title: 'De Game Director', description: 'Word de architect. Herschrijf de natuurwetten en ontwerp je eigen game-regelset.', icon: <Settings2 size={40} />, number: 'Vrije Keuze', status: 'available', info: getMissionTooltipInfo('game-director'), sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
        { id: 'verhalen-ontwerper', title: 'Verhalen Ontwerper', description: 'Visualiseer verhalen met AI. Leer prompts schrijven en beelden maken.', icon: <Feather size={40} />, number: '07', status: 'available', info: getMissionTooltipInfo('verhalen-ontwerper'), sloKerndoelen: ['21B', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
        { id: 'ai-beleid-brainstorm', title: 'AI Beleid Brainstorm', description: 'Denk mee over AI-regels op school.', icon: <Scale size={40} />, number: '08', status: 'available', info: getMissionTooltipInfo('ai-beleid-brainstorm'), sloKerndoelen: ['23B', '23C'], sloVsoKerndoelen: ['20B'] },
    ],
    3: [
        { id: 'review-week-2', title: 'De Code-Criticus', description: 'Vind fouten in AI-content uit Week 2.', icon: <Search size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('review-week-2'), sloKerndoelen: ['21B', '22B'], sloVsoKerndoelen: ['18C'] },
        { id: 'data-detective', title: 'Data Detective', description: 'Ontdek wat bedrijven met data doen: risico’s en kansen.', icon: <BarChart2 size={40} />, number: '01', status: 'available', info: getMissionTooltipInfo('data-detective'), sloKerndoelen: ['21B', '23C'], sloVsoKerndoelen: ['18B', '20A'] },
        { id: 'deepfake-detector', title: 'Deepfake Detector', description: 'Spot AI-gegenereerde content en nepnieuws.', icon: <Eye size={40} />, number: '02', status: 'available', info: getMissionTooltipInfo('deepfake-detector'), sloKerndoelen: ['21B', '23A', '23C'], sloVsoKerndoelen: ['18B', '18C', '20A'] },
        { id: 'ai-spiegel', title: 'De AI Spiegel', description: 'Zie hoe jouw online gedrag een advertentieprofiel vormt.', icon: <BrainCircuit size={40} />, number: '03', status: 'available', info: getMissionTooltipInfo('ai-spiegel'), sloKerndoelen: ['23B', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'social-safeguard', title: 'Social Safeguard', description: 'Train veilig handelen bij online druk, pesten en datamisbruik.', icon: <ShieldCheck size={40} />, number: '04', status: 'available', info: getMissionTooltipInfo('social-safeguard'), sloKerndoelen: ['23A', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'cookie-crusher', title: 'Cookie Crusher', description: 'Herken dark patterns in cookie-popups en bescherm je privacy.', icon: <ShieldCheck size={40} />, number: '05', status: 'available', info: getMissionTooltipInfo('cookie-crusher'), sloKerndoelen: ['23C', '21B'], sloVsoKerndoelen: ['18B', '20A'] },
        { id: 'data-handelaar', title: 'De Data Handelaar', description: 'Ga undercover en ontmasker illegale datahandel.', icon: <Search size={40} />, number: '06', status: 'available', info: getMissionTooltipInfo('data-handelaar'), sloKerndoelen: ['23C', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'privacy-profiel-spiegel', title: 'Privacy Profiel Spiegel', description: 'Check je eigen app-instellingen en ontdek wat je deelt.', icon: <Eye size={40} />, number: '07', status: 'available', info: getMissionTooltipInfo('privacy-profiel-spiegel'), sloKerndoelen: ['23A', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'filter-bubble-breaker', title: 'Filter Bubble Breaker', description: 'Vergelijk twee social media feeds en ontdek filterbubbels.', icon: <BrainCircuit size={40} />, number: '08', status: 'available', info: getMissionTooltipInfo('filter-bubble-breaker'), sloKerndoelen: ['23B', '23C', '21B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'datalekken-rampenplan', title: 'Datalekken Rampenplan', description: 'Los een school datalek-crisis op!', icon: <AlertTriangle size={40} />, number: '09', status: 'available', info: getMissionTooltipInfo('datalekken-rampenplan'), sloKerndoelen: ['23A', '23B', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'data-voor-data', title: 'Data voor Data', description: 'Hoeveel persoonlijke data zou jij inruilen?', icon: <Scale size={40} />, number: '10', status: 'available', info: getMissionTooltipInfo('data-voor-data'), sloKerndoelen: ['23C', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'social-media-psychologist', title: 'Social Media Psycholoog', description: 'Begrijp de psychologie achter scrollen, likes en filterbubbels.', icon: <BrainCircuit size={40} />, number: 'Bonus', status: 'available', info: getMissionTooltipInfo('social-media-psychologist'), isBonus: true, sloKerndoelen: ['21B', '23B', '23C'], sloVsoKerndoelen: ['20B'] },
    ],
    4: [
        { id: 'review-week-3', title: 'De Ethische Raad', description: 'Adviseer over ethische dilemma\'s.', icon: <Scale size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('review-week-3'), sloKerndoelen: ['22B', '23C'] },
        { id: 'mission-blueprint', title: 'De Blauwdruk', description: 'Organiseer je meesterwerk. Gebruik Magister, OneDrive en Word om je plan te smeden.', icon: <Map size={40} />, number: '02', status: 'available', info: getMissionTooltipInfo('mission-blueprint'), sloKerndoelen: ['21A', '22A'] },
        { id: 'mission-vision', title: 'De Visie', description: 'Visualiseer je droom. Combineer AI-beelden met een strakke PowerPoint pitch.', icon: <Lightbulb size={40} />, number: '03', status: 'available', info: getMissionTooltipInfo('mission-vision'), sloKerndoelen: ['21B', '22A'] },
        { id: 'mission-launch', title: 'De Lancering', description: 'Breng het naar buiten. Print je designs en communiceer als een pro.', icon: <Rocket size={40} />, number: '04', status: 'available', info: getMissionTooltipInfo('mission-launch'), sloKerndoelen: ['21A', '21C'] },
    ]
};

export const ProjectZeroDashboard: React.FC<DashboardProps> = ({
    onSelectModule,
    onOpenProfile,
    onLogout,
    onOpenGames,
    gamesEnabled = false,
    userDisplayName,
    userUid,
    activeWeek,
    setActiveWeek,
    activeYearGroup,
    setActiveYearGroup,
    schoolConfig,
    onGoHome,
    stats,
    focusMode = false,
    userRole = 'student',
    containers
}) => {
    // Curriculum-aware variabelen
    const currentYearGroup = activeYearGroup ?? 1;
    const periodNaming = schoolConfig?.periodNaming || CURRICULUM.defaultPeriodNaming;
    const activeContainer = containers?.find(c => c.sortOrder === activeWeek);
    const containerLabel = activeContainer?.label || `${periodNaming} ${activeWeek}`;
    const yearConfig = getYearConfig(currentYearGroup);
    const currentPeriodConfig = getPeriodConfig(currentYearGroup, activeWeek);
    const periodTheme = containers?.length
        ? getContainerTheme(containers.find(c => c.sortOrder === activeWeek)?.colorKey)
        : (PERIOD_THEME[activeWeek] || DEFAULT_PERIOD_THEME);
    const periodLeerdoel = PERIOD_LEERDOELEN[`${currentYearGroup}-${activeWeek}`];
    const [showXPPopup, setShowXPPopup] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = React.useState(false);
    const [showYearGroupMenu, setShowYearGroupMenu] = useState(false);
    const [selectedMissionInfo, setSelectedMissionInfo] = useState<string | { info: string; kerndoelen: SloKerndoelCode[] } | null>(null);
    const [permissions, setPermissions] = useState<GamePermissions | null>(null);
    const yearGroupMenuRef = React.useRef<HTMLDivElement | null>(null);

    // Feedback modal state
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);
    const [feedbackError, setFeedbackError] = useState<string | null>(null);

    // Library modal state
    const [showLibrary, setShowLibrary] = useState(false);

    const handleSubmitFeedback = async () => {
        if (!feedbackText.trim() || !userUid) return;
        setFeedbackSubmitting(true);
        setFeedbackError(null);
        try {
            await submitFeedback(
                userUid,
                userDisplayName || 'Anoniem',
                stats?.studentClass,
                feedbackText.trim()
            );
            setFeedbackSuccess(true);
            setFeedbackText('');
            // Don't auto-close - let user click the "Sluiten" button to confirm they saw it
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            setFeedbackError((error as Error)?.message || 'Feedback kon niet worden verzonden. Probeer het opnieuw.');
        } finally {
            setFeedbackSubmitting(false);
        }
    };

    // Touch swipe state for week navigation
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 80;

    // Game activation notification state
    const [showGameNotification, setShowGameNotification] = useState(false);
    const [activatedGameName, setActivatedGameName] = useState<string | null>(null);
    const prevPermissionsRef = React.useRef<GamePermissions | null>(null);

    // Subscribe to permission changes
    useEffect(() => {
        // Initial load
        getGamePermissions(stats?.schoolId).then((initialPerms) => {
            setPermissions(initialPerms);
            prevPermissionsRef.current = initialPerms;
        });

        // Real-time updates - detect when games become enabled
        const unsubscribe = subscribeToPermissions(stats?.schoolId, (newPermissions) => {
            // Check if arena-battle was just enabled
            const arenaBattleWasEnabled = prevPermissionsRef.current?.enabled_games?.includes('arena-battle');
            const arenaBattleIsNowEnabled = newPermissions.enabled_games?.includes('arena-battle');

            if (!arenaBattleWasEnabled && arenaBattleIsNowEnabled) {
                // Game was just activated! Show notification
                setActivatedGameName('Arena Battle (Bomberman)');
                setShowGameNotification(true);
            }

            prevPermissionsRef.current = newPermissions;
            setPermissions(newPermissions);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!showYearGroupMenu) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!yearGroupMenuRef.current) return;
            if (!yearGroupMenuRef.current.contains(event.target as Node)) {
                setShowYearGroupMenu(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowYearGroupMenu(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [showYearGroupMenu]);

    // Daily streak calculation
    const dailyStreak = React.useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = stats?.lastLoginDate;
        if (!lastLogin) return 1;
        if (lastLogin === today) return stats?.dailyStreak || 1;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        return lastLogin === yesterday ? (stats?.dailyStreak || 0) + 1 : 1;
    }, [stats?.lastLoginDate, stats?.dailyStreak]);

    // Import shared XP utilities
    const xp = stats?.xp || 0;
    const level = stats?.level || 1;
    const availableYearGroups = useMemo(() => {
        const userLevel = (stats?.educationLevel as EducationLevel) || 'havo';
        return Object.entries(CURRICULUM.yearGroups)
            .filter(([_, config]) => config.availableLevels.includes(userLevel))
            .map(([yearStr, config]) => ({ year: Number(yearStr), config }))
            .sort((a, b) => a.year - b.year);
    }, [stats?.educationLevel]);
    const selectedYearGroupTitle = availableYearGroups.find(({ year }) => year === currentYearGroup)?.config.title || `Leerjaar ${currentYearGroup}`;
    const activeYearTheme = useMemo(() => getYearGroupTheme(currentYearGroup), [currentYearGroup]);

    // Memoize expensive calculations
    const progressPercentage = React.useMemo(
        () => getLevelProgress(xp, level),
        [xp, level]
    );
    const xpToNext = React.useMemo(
        () => getXPToNextLevel(xp, level),
        [xp, level]
    );

    // Filter relevant missions and apply locking logic
    const isTeacher = userRole === 'teacher' || userRole === 'admin' || userRole === 'developer';
    const [leerdoelenOpen, setLeerdoelenOpen] = useState(isTeacher);

    const currentMissions = useMemo(() => {
        let missions = buildMissionsForPeriod(currentYearGroup, activeWeek);

        // TEMPORARILY: All missions available for everyone (review period)
        // TODO: Re-enable lock logic after testing
        return missions.map(mission => ({
            ...mission,
            status: 'available' as const
        }));

        /* ORIGINAL LOCK LOGIC — re-enable after review:

        // Teachers can see ALL missions without any restrictions
        if (isTeacher) {
            return missions.map(mission => ({
                ...mission,
                status: 'available' as const
            }));
        }

        // 0. Filter out class-restricted missions if user's class doesn't match
        const userClass = stats?.studentClass;
        missions = missions.filter(mission => {
            if (!mission.classRestriction) return true;
            return mission.classRestriction === userClass;
        });

        // 1. Check if the period is locked via teacher permissions
        const weekPermissionId = `week-${activeWeek}`;
        const isWeekEnabled = permissions?.enabled_games?.includes(weekPermissionId) ?? false;

        if (!isWeekEnabled) {
            return missions.map(mission => ({
                ...mission,
                status: 'locked' as const,
                info: `Deze ${periodNaming.toLowerCase()} is nog niet geopend door je docent.`
            }));
        }

        // 2. Generic review gate: if period has reviewMissions, require them first
        const pConfig = getPeriodConfig(currentYearGroup, activeWeek);
        const hasReviewGate = pConfig?.reviewMissions && pConfig.reviewMissions.length > 0;

        if (hasReviewGate) {
            const reviewIds = pConfig!.reviewMissions!;
            const completedMissions = stats?.missionsCompleted || [];
            const allReviewsDone = reviewIds.every(id => {
                if (id === 'ipad-print-instructies' && stats?.studentClass !== 'MH1A') return true;
                return completedMissions.includes(id);
            });

            return missions.map(mission => {
                if (!mission.isReview && !allReviewsDone) {
                    return {
                        ...mission,
                        status: 'locked' as const,
                        info: 'Voltooi eerst alle herhalingsopdrachten voordat je deze missie kunt starten.'
                    };
                }
                return { ...mission, status: 'available' as const };
            });
        }

        return missions;
        */
    }, [currentYearGroup, activeWeek, stats, permissions, isTeacher, periodNaming]);

    // Stable callbacks for MissionCard memoization (reduces re-renders of mission grid)
    const handleInfoClick = useCallback((info: string, kerndoelen?: SloKerndoelCode[]) => {
        setSelectedMissionInfo({ info, kerndoelen: kerndoelen || [] });
    }, []);

    // Swipe handlers for week navigation
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        // Find next available week
        const availableWeeks = containers?.length
            ? containers.map(c => c.sortOrder)
            : [1, 2, 3, 4];

        const maxWeek = containers?.length ? Math.max(...containers.map(c => c.sortOrder)) : 4;
        if (isLeftSwipe && activeWeek < maxWeek) {
            // Swipe left = next week
            const nextWeek = availableWeeks.find(w => w > activeWeek);
            if (nextWeek) setActiveWeek(nextWeek);
        }
        const minWeek = containers?.length ? Math.min(...containers.map(c => c.sortOrder)) : 1;
        if (isRightSwipe && activeWeek > minWeek) {
            // Swipe right = previous week
            const prevWeek = [...availableWeeks].reverse().find(w => w < activeWeek);
            if (prevWeek) setActiveWeek(prevWeek);
        }

        setTouchStart(null);
        setTouchEnd(null);
    };


    // Memoized mission filtering — avoid recalculating on every render
    const reviewMissions = useMemo(() => currentMissions.filter(m => m.isReview), [currentMissions]);
    const mainMissions = useMemo(() => currentMissions.filter(m => !m.isReview), [currentMissions]);

    // Calculate progress stats for the current week
    const totalMissions = mainMissions.length;
    const completedCount = mainMissions.filter(m => stats?.missionsCompleted?.includes(m.id)).length;

    // For Week 2: check review mission progress
    const completedReviewCount = reviewMissions.filter(m => stats?.missionsCompleted?.includes(m.id) || (m.id === 'ipad-print-instructies' && stats?.studentClass !== 'MH1A')).length;
    const allReviewsDone = reviewMissions.length === 0 || completedReviewCount >= reviewMissions.length;

    // Bottom nav active tab state
    const [bottomNavTab, setBottomNavTab] = useState<'dashboard' | 'library' | 'profile' | 'trophies' | 'games'>('dashboard');

    const handleBottomNav = (tab: 'dashboard' | 'library' | 'profile' | 'trophies' | 'games') => {
        setBottomNavTab(tab);
        switch (tab) {
            case 'dashboard':
                break; // Already on dashboard
            case 'library':
                setShowLibrary(true);
                break;
            case 'profile':
                onOpenProfile();
                break;
            case 'trophies':
                onOpenProfile('trophies');
                break;
            case 'games':
                if (gamesEnabled && onOpenGames) onOpenGames();
                break;
        }
    };

    return (
        <div className="flex-1 w-full flex flex-col font-sans text-slate-900 pb-safe relative">

                {/* Student Library Modal */}
                {userUid && (
                    <StudentLibrary
                        isOpen={showLibrary}
                        onClose={() => setShowLibrary(false)}
                        userId={userUid}
                        onStartMission={() => onGoHome?.()}
                        onOpenItem={(item) => {
                            // Close library and open the mission with the saved data
                            setShowLibrary(false);

                            // Navigate to the relevant mission WITH the saved library data
                            if (item.mission_id) {
                                onSelectModule(item.mission_id, item.data);
                            }
                        }}
                    />
                )}

                {/* FOCUS MODE OVERLAY */}
                {focusMode && (
                    <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6 text-center animate-in fade-in duration-500">
                        <div className="max-w-md">
                            <div className="w-24 h-24 bg-indigo-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-indigo-500/50">
                                <Lock size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Focus Modus Actief</h2>
                            <p className="text-slate-400 font-medium text-lg leading-relaxed">
                                De docent vraagt nu je aandacht. <br />
                                Kijk naar het bord en luister naar de instructies.
                            </p>
                            <div className="mt-12 flex gap-2 justify-center">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* XP POPUP OVERLAY */}
                {showXPPopup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowXPPopup(false)}
                        />
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 w-full max-w-sm relative z-10 animate-in zoom-in duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl mb-6 transform rotate-3">
                                    <Trophy size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">Level {level}</h3>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-6">Jouw Voortgang</p>

                                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-4 p-1 border border-slate-200">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>

                                <div className="flex justify-between w-full text-sm font-black text-slate-800 mb-8 lowercase">
                                    <span>{xp} xp</span>
                                    <span className="text-slate-400">nog {xpToNext} xp voor lvl {level + 1}</span>
                                </div>

                                <button
                                    onClick={() => setShowXPPopup(false)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                                >
                                    Begrepen!
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* GAME ACTIVATION NOTIFICATION */}
                {showGameNotification && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowGameNotification(false)}
                        />
                        <div className="rounded-2xl p-8 shadow-2xl w-full max-w-sm relative z-10 animate-in zoom-in duration-300" style={{ backgroundColor: '#FAF9F0', border: '1px solid #E8E6DF' }}>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg mb-5" style={{ backgroundColor: '#D97757' }}>
                                    <Gamepad2 size={40} />
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>Game geactiveerd!</h3>
                                <p className="text-sm font-medium mb-1" style={{ color: '#6B6B66' }}>
                                    De docent heeft {activatedGameName || 'een game'} geactiveerd!
                                </p>
                                <p className="text-xs mb-6" style={{ color: '#9C9C95' }}>
                                    Je kunt nu meedoen aan de game-sessie met je klasgenoten.
                                </p>

                                <div className="flex flex-col gap-2.5 w-full">
                                    <button
                                        onClick={() => {
                                            setShowGameNotification(false);
                                            if (onOpenGames) onOpenGames();
                                        }}
                                        className="w-full py-3.5 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
                                        style={{ backgroundColor: '#D97757' }}
                                    >
                                        <Play size={16} fill="currentColor" />
                                        Naar Games
                                    </button>
                                    <button
                                        onClick={() => setShowGameNotification(false)}
                                        className="w-full py-2.5 font-medium text-sm transition-colors"
                                        style={{ color: '#9C9C95' }}
                                    >
                                        Later, ik ben nog bezig
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FEEDBACK MODAL */}
                {showFeedbackModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                            onClick={() => { if (!feedbackSubmitting && !feedbackSuccess) { setShowFeedbackModal(false); setFeedbackError(null); } }}
                        />
                        <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-amber-200 w-full max-w-md relative z-10 animate-in zoom-in duration-300">
                            {feedbackSuccess ? (
                                <div className="flex flex-col items-center text-center py-8">
                                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                                        <span className="text-5xl">✅</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-3">Bedankt!</h3>
                                    <p className="text-slate-500 text-sm mb-6">Je feedback is succesvol verzonden naar de ontwikkelaar.</p>
                                    <button
                                        onClick={() => {
                                            setShowFeedbackModal(false);
                                            setFeedbackSuccess(false);
                                        }}
                                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-colors"
                                    >
                                        Sluiten
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                            <MessageSquare size={24} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900">Feedback Geven</h3>
                                            <p className="text-xs text-slate-400">Wat kan er beter aan de website?</p>
                                        </div>
                                    </div>

                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => {
                                            setFeedbackText(e.target.value);
                                            if (feedbackError) setFeedbackError(null);
                                        }}
                                        placeholder="Beschrijf hier wat je graag verbeterd zou zien, of deel een bug die je hebt gevonden..."
                                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        maxLength={500}
                                        disabled={feedbackSubmitting}
                                    />
                                    <div className="flex justify-between items-center mt-2 mb-4">
                                        <span className="text-[10px] text-slate-400">{feedbackText.length}/500 tekens</span>
                                    </div>

                                    {feedbackError && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                            <span>{feedbackError}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFeedbackModal(false)}
                                            disabled={feedbackSubmitting}
                                            className="flex-1 py-3 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            Annuleren
                                        </button>
                                        <button
                                            onClick={handleSubmitFeedback}
                                            disabled={!feedbackText.trim() || feedbackSubmitting}
                                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {feedbackSubmitting ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Send size={16} />
                                                    Versturen
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {/* HEADER */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-8 sm:py-6 flex justify-between items-center sticky top-0 z-50">
                    <button
                        onClick={onGoHome}
                        aria-label="Ga naar de startpagina"
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                    >
                        <img src="/mascot/pip-logo.webp" alt="DGSkills" className="w-9 h-9 object-contain" width={36} height={36} decoding="async" />
                        <span className="text-[15px] font-semibold tracking-tight text-slate-900 hidden sm:inline">DGSkills</span>
                    </button>

                    {/* FEEDBACK BUTTON */}
                    <button
                        onClick={() => setShowFeedbackModal(true)}
                        className="hidden sm:flex items-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl border border-amber-200 transition-all hover:scale-105 active:scale-95"
                        aria-label="Geef feedback aan de ontwikkelaar"
                        data-tutorial="student-feedback-btn"
                    >
                        <MessageSquare size={16} />
                        <span className="text-xs font-bold">Feedback</span>
                    </button>

                    <div className="flex items-center gap-4">
                        {/* DAILY STREAK BADGE */}
                        {dailyStreak > 0 && (
                            <div className={`flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold
                                ${dailyStreak >= 7 ? 'bg-orange-500 text-white animate-pulse shadow-lg shadow-orange-500/30' :
                                  dailyStreak >= 3 ? 'bg-orange-100 text-orange-600' :
                                  'bg-slate-100 text-slate-500'}`}>
                                <span role="img" aria-label="streak">&#x1F525;</span>
                                <span>{dailyStreak}</span>
                                <span className="hidden sm:inline">{dailyStreak === 1 ? 'dag' : 'dagen'}</span>
                            </div>
                        )}

                        {/* COMPACT PROGRESS BAR IN HEADER */}
                        {stats && (
                            <button
                                onClick={() => setShowXPPopup(true)}
                                aria-label={`Level ${level}, ${xp} XP - Klik voor details`}
                                className="flex flex-col items-end gap-1.5 hover:opacity-80 transition-opacity p-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Lvl {level}</span>
                                    <div className="w-20 sm:w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-[1px]">
                                        <div
                                            className="h-full bg-indigo-600 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </button>
                        )}

                        <div className="flex items-center gap-4 relative">
                            <div className="text-right hidden sm:block">
                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter leading-none text-indigo-500">Mijn Profiel</div>
                                <div className="font-black text-slate-800 text-sm tracking-tight">{userDisplayName || 'Gast'}</div>
                            </div>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                aria-label="Profiel menu openen"
                                aria-expanded={showProfileMenu}
                                aria-haspopup="true"
                                className="w-12 h-12 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm transition-all hover:scale-105 hover:bg-indigo-600 hover:text-white cursor-pointer overflow-hidden p-0"
                                data-tutorial="student-profile-btn"
                            >
                                {/* Show Avatar Headshot if available, otherwise fallback */}
                                <div className="w-full h-full">
                                    <LazyAvatarViewer
                                        config={stats?.avatarConfig || DEFAULT_AVATAR_CONFIG}
                                        interactive={false}
                                        variant="head"
                                    />
                                </div>
                            </button>

                            {/* Profile Dropdown Menu */}
                            {showProfileMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowProfileMenu(false)}
                                    />
                                    <div className="absolute right-0 sm:right-0 top-14 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden min-w-[200px] max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-3 border-b border-slate-100 bg-slate-50">
                                            <div className="font-bold text-slate-900 text-sm">{userDisplayName || 'Gast'}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">Leerling Account</div>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    onOpenProfile();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left hover:bg-indigo-50 transition-colors group"
                                                data-tutorial="student-avatar-btn"
                                            >
                                                <User size={18} className="text-indigo-500" />
                                                <span className="font-bold text-slate-700 text-sm group-hover:text-indigo-600">Avatar Aanpassen</span>
                                            </button>
                                            {/* Trofeeënhal Button */}
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    onOpenProfile('trophies');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left hover:bg-amber-50 transition-colors group"
                                            >
                                                <Trophy size={18} className="text-amber-500" />
                                                <span className="font-bold text-slate-700 text-sm group-hover:text-amber-600">Trofeeënhal</span>
                                            </button>
                                            {/* Bibliotheek Button */}
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    setShowLibrary(true);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left hover:bg-purple-50 transition-colors group"
                                            >
                                                <BookOpen size={18} className="text-purple-500" />
                                                <span className="font-bold text-slate-700 text-sm group-hover:text-purple-600">Bibliotheek</span>
                                            </button>
                                            {/* Games Button in Profile Menu */}
                                            <button
                                                onClick={() => {
                                                    if (gamesEnabled && onOpenGames) {
                                                        setShowProfileMenu(false);
                                                        onOpenGames();
                                                    }
                                                }}
                                                disabled={!gamesEnabled}
                                                className={`w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left transition-colors group ${gamesEnabled
                                                    ? 'hover:bg-emerald-50 cursor-pointer'
                                                    : 'opacity-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Gamepad2 size={18} className={gamesEnabled ? 'text-emerald-500' : 'text-slate-400'} />
                                                <div className="flex flex-col">
                                                    <span className={`font-bold text-sm ${gamesEnabled ? 'text-slate-700 group-hover:text-emerald-600' : 'text-slate-400'}`}>Games</span>
                                                    {!gamesEnabled && (
                                                        <span className="text-[9px] text-slate-400">Wacht op activatie van de docent</span>
                                                    )}
                                                </div>
                                            </button>

                                            {onLogout && (
                                                <button
                                                    onClick={() => {
                                                        setShowProfileMenu(false);
                                                        onLogout();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left hover:bg-red-50 transition-colors group"
                                                >
                                                    <LogOut size={18} className="text-red-500" />
                                                    <span className="font-bold text-slate-700 text-sm group-hover:text-red-600">Uitloggen</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* BODY */}
                <main
                    className="flex-1 max-w-7xl mx-auto w-full px-6 py-4 md:py-6"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="min-w-0">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">
                                {currentPeriodConfig?.title || `${periodNaming} ${activeWeek}`}
                            </h2>
                            {currentPeriodConfig?.subtitle && (
                                <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{currentPeriodConfig.subtitle}</p>
                            )}
                        </div>
                        {totalMissions > 0 && (
                            <div className="flex items-center gap-2.5 flex-shrink-0 px-3 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <div className="relative w-9 h-9">
                                    <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                                        <path className="text-indigo-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"
                                            strokeDasharray={`${(completedCount / totalMissions) * 100}, 100`} strokeLinecap="round" />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-slate-700">
                                        {completedCount}/{totalMissions}
                                    </span>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-xs font-bold text-slate-700 leading-tight">{completedCount}/{totalMissions}</p>
                                    <p className="text-[9px] text-slate-400 font-medium">voltooid</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* LEERJAAR + PERIODE SELECTION */}
                    <div className="flex items-center gap-2 mb-4">
                        {availableYearGroups.length > 1 && (
                            <div ref={yearGroupMenuRef} className="relative flex-shrink-0">
                                <button
                                    type="button"
                                    aria-haspopup="listbox"
                                    aria-expanded={showYearGroupMenu}
                                    aria-label="Kies digitale leerlijn"
                                    onClick={() => setShowYearGroupMenu(prev => !prev)}
                                    className={`min-h-[44px] rounded-2xl border border-slate-200 bg-slate-100 p-1.5 shadow-inner transition-all duration-200 ${showYearGroupMenu
                                        ? `ring-2 ${activeYearTheme.focusRing}`
                                        : 'hover:border-slate-300 hover:-translate-y-[1px]'
                                        }`}
                                >
                                    <span className={`min-w-0 sm:min-w-[210px] max-w-[72vw] flex items-center gap-2.5 rounded-xl border bg-white px-3 py-2 transition-all ${showYearGroupMenu ? `${activeYearTheme.activeBorder} shadow-sm` : 'border-slate-200'}`}>
                                        <span className={`w-7 h-7 rounded-lg ${activeYearTheme.badgeBg} ${activeYearTheme.badgeText} flex items-center justify-center shrink-0`}>
                                            <activeYearTheme.Icon size={13} />
                                        </span>
                                        <span className="flex flex-col items-start leading-tight min-w-0 flex-1">
                                            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">Leerlijn</span>
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-800 truncate">{selectedYearGroupTitle}</span>
                                        </span>
                                        <span className={`w-2 h-2 rounded-full ${activeYearTheme.accentDot} shrink-0`} />
                                        <ChevronRight
                                            size={14}
                                            className={`text-slate-400 shrink-0 transition-transform duration-200 ${showYearGroupMenu ? '-rotate-90' : 'rotate-90'}`}
                                        />
                                    </span>
                                </button>

                                {showYearGroupMenu && (
                                    <div
                                        role="listbox"
                                        aria-label="Digitale leerlijnen"
                                        className="absolute left-0 top-[calc(100%+0.5rem)] z-40 w-[min(92vw,320px)] rounded-2xl border border-slate-200 bg-slate-100 p-1.5 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.65)] animate-in fade-in-0 zoom-in-95 duration-150"
                                    >
                                        <div className={`h-1 rounded-full mb-2 bg-gradient-to-r ${activeYearTheme.gradient}`} />
                                        <p className="px-2.5 pt-1 pb-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                                            Kies je route
                                        </p>
                                        <div className="space-y-1">
                                            {availableYearGroups.map(({ year, config }) => {
                                                const isActive = year === currentYearGroup;
                                                const optionTheme = getYearGroupTheme(year);
                                                return (
                                                    <button
                                                        key={year}
                                                        type="button"
                                                        role="option"
                                                        aria-selected={isActive}
                                                        onClick={() => {
                                                            setActiveYearGroup?.(year);
                                                            setActiveWeek(1);
                                                            setShowYearGroupMenu(false);
                                                        }}
                                                        className={`w-full min-h-[44px] rounded-xl border px-2.5 py-2 text-left transition-all duration-150 flex items-center gap-2.5 ${isActive
                                                            ? `bg-white ${optionTheme.activeBorder} ${optionTheme.activeText} shadow-sm -translate-y-[1px]`
                                                            : 'bg-white/80 border-transparent text-slate-600 hover:bg-white hover:border-slate-200 hover:-translate-y-[1px]'
                                                            }`}
                                                    >
                                                        <span className={`w-1.5 h-8 rounded-full shrink-0 ${optionTheme.accentDot}`} />
                                                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? `${optionTheme.badgeBg} ${optionTheme.badgeText}` : 'bg-slate-100 text-slate-500'}`}>
                                                            <optionTheme.Icon size={12} />
                                                        </span>
                                                        <span className="flex-1 min-w-0">
                                                            <span className="block text-xs font-black uppercase tracking-widest truncate">{config.title}</span>
                                                            <span className="block text-[9px] font-bold tracking-wide text-slate-400 mt-0.5">Leerjaar {year} · {optionTheme.label}</span>
                                                        </span>
                                                        {isActive && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl flex-1 md:flex-initial border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
                        {Object.keys(yearConfig?.periods || {}).map(Number).sort((a, b) => a - b).map((period) => {
                            const pConf = yearConfig?.periods[period];
                            const isLocked = false; // TEMPORARILY: all periods unlocked for review

                            return (
                                <button
                                    key={period}
                                    onClick={() => !isLocked && setActiveWeek(period)}
                                    disabled={isLocked}
                                    title={isLocked ? `${periodNaming} ${period} wordt later vrijgegeven` : pConf?.title}
                                    className={`flex-shrink-0 px-4 md:px-6 py-4 min-h-[44px] rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5
                                ${activeWeek === period
                                            ? 'bg-white text-indigo-600 shadow-md border border-slate-100 translate-y-[-1px]'
                                            : isLocked
                                                ? 'bg-transparent text-slate-300 cursor-not-allowed'
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {isLocked ? <Lock size={12} /> : (PERIOD_THEME[period]?.icon || null)}
                                    <span className="hidden sm:inline">{periodNaming}</span>
                                    <span className="sm:hidden">P</span>{period}
                                </button>
                            )
                        })}
                        </div>
                    </div>

                    {/* Dynamisch leerdoelenblok — collapsible accordion */}
                    {currentPeriodConfig && (
                        <div className={`mb-6 bg-white rounded-2xl border ${periodTheme.border} shadow-sm overflow-hidden`}>
                            {/* Collapsed header — altijd zichtbaar */}
                            <button
                                onClick={() => setLeerdoelenOpen(!leerdoelenOpen)}
                                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50/50 transition-colors min-h-[44px]"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <CheckCircle2 size={14} className={periodTheme.text} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${periodTheme.text}`}>
                                        Leerdoelen {periodNaming} {activeWeek}
                                    </span>
                                    {!leerdoelenOpen && (
                                        <div className="flex items-center gap-2 opacity-60">
                                            {(stats?.vsoProfile && currentPeriodConfig.sloFocusVso
                                                ? currentPeriodConfig.sloFocusVso
                                                : currentPeriodConfig.sloFocus
                                            ).slice(0, 3).map(code => (
                                                <span key={code} className={`px-1 py-0.5 rounded text-[8px] font-bold border ${getKerndoelBadgeClasses(code)}`}>
                                                    {code}
                                                </span>
                                            ))}
                                            {currentPeriodConfig.sloFocus.length > 3 && (
                                                <span className="text-[8px] text-slate-400 font-bold">+{currentPeriodConfig.sloFocus.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <ChevronRight size={16} className={`text-slate-300 transition-transform duration-200 shrink-0 ${leerdoelenOpen ? 'rotate-90' : ''}`} />
                            </button>

                            {/* Success criteria preview — altijd zichtbaar als accordion dicht is */}
                            {!leerdoelenOpen && periodLeerdoel?.succescriterium && (
                                <div className="px-4 pb-3 flex items-start gap-2 -mt-1">
                                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <p className="text-emerald-700 text-[11px] font-medium leading-snug">
                                        <span className="font-bold">Klaar als: </span>
                                        {(stats?.vsoProfile === 'dagbesteding' && periodLeerdoel.succescriDagbesteding)
                                            ? periodLeerdoel.succescriDagbesteding
                                            : periodLeerdoel.succescriterium}
                                    </p>
                                </div>
                            )}

                            {/* Expandable content */}
                            {leerdoelenOpen && (
                                <div className="px-4 pb-4 pt-0 border-t border-slate-50 space-y-3">
                                    <p className="text-slate-500 text-xs leading-snug line-clamp-2 pt-3">
                                        {periodLeerdoel
                                            ? (stats?.vsoProfile && periodLeerdoel.descriptionVso
                                                ? periodLeerdoel.descriptionVso
                                                : periodLeerdoel.description)
                                            : currentPeriodConfig.subtitle}
                                    </p>

                                    {/* Lesflow — stappen visueel weergeven */}
                                    {periodLeerdoel?.lesduur && (() => {
                                        const raw = periodLeerdoel.lesduur!;
                                        const duurMatch = raw.match(/Lesduur:\s*([^.]+)\./);
                                        const duur = duurMatch ? duurMatch[1].trim() : null;
                                        const flowPart = raw.replace(/^[^.]+\.\s*/, '').replace(/^[^:]+:\s*/, '');
                                        const steps = flowPart.split('→').map(s => s.trim()).filter(Boolean);
                                        return (
                                            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                                                {duur && (
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                                        {duur}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {steps.map((step, i) => (
                                                        <div key={i} className="flex items-center gap-1.5">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${periodTheme.bg} ${periodTheme.text} border ${periodTheme.border}`}>
                                                                <span className={`w-4 h-4 rounded-full bg-white/80 flex items-center justify-center text-[9px] font-bold ${periodTheme.text}`}>
                                                                    {i + 1}
                                                                </span>
                                                                {step}
                                                            </span>
                                                            {i < steps.length - 1 && (
                                                                <span className="text-slate-300 text-xs">→</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* SLO badges + Succescriterium */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                        <div className="flex flex-wrap gap-1.5">
                                            {(stats?.vsoProfile && currentPeriodConfig.sloFocusVso
                                                ? currentPeriodConfig.sloFocusVso
                                                : currentPeriodConfig.sloFocus
                                            ).map(code => {
                                                const kerndoel = SLO_KERNDOELEN[code];
                                                if (!kerndoel) return null;
                                                return (
                                                    <span
                                                        key={code}
                                                        className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${getKerndoelBadgeClasses(code)}`}
                                                    >
                                                        {code}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        {periodLeerdoel?.succescriterium && (
                                            <div className="flex items-start gap-1.5 min-w-0">
                                                <CheckCircle2 size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                                                <p className="text-emerald-700 text-[10px] font-semibold leading-snug line-clamp-2">
                                                    {(stats?.vsoProfile === 'dagbesteding' && periodLeerdoel.succescriDagbesteding)
                                                        ? periodLeerdoel.succescriDagbesteding
                                                        : periodLeerdoel.succescriterium}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MISSION CONTENT */}
                    <div className="relative group">
                                <div className="flex flex-col gap-8">
                                    {/* REVIEW GATE BANNER — shown when period has review missions that aren't all done */}
                                    {reviewMissions.length > 0 && !allReviewsDone && !isTeacher && (
                                        <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
                                            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <AlertTriangle size={16} className="text-amber-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-amber-800">Eerst de herhalingsopdrachten</p>
                                                <p className="text-xs text-amber-600 font-medium">
                                                    Voltooi {completedReviewCount}/{reviewMissions.length} herhalingen om de nieuwe missies vrij te spelen.
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
                                                {reviewMissions.map(m => {
                                                    const done = stats?.missionsCompleted?.includes(m.id) || (m.id === 'ipad-print-instructies' && stats?.studentClass !== 'MH1A');
                                                    return <div key={m.id} className={`w-2.5 h-2.5 rounded-full ${done ? 'bg-emerald-500' : 'bg-amber-300'}`} />;
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* OPTIONAL: Review Missions Row (if any) */}
                                    {reviewMissions.length > 0 && (
                                        <div className="w-full" data-tutorial="student-review-missions">
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <RotateCcw size={16} /> Herhaling &amp; Basics
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-4">
                                                {(() => {
                                                    let firstOpenReviewFound = false;
                                                    return reviewMissions.map((mission, rIdx) => {
                                                        const isNormallyCompleted = stats?.missionsCompleted?.includes(mission.id);
                                                        const isAutoCompleted = mission.id === 'ipad-print-instructies' && stats?.studentClass !== 'MH1A';
                                                        const isCompleted = isNormallyCompleted || isAutoCompleted;

                                                        const isTutorialTarget = !allReviewsDone && !isCompleted && !firstOpenReviewFound;
                                                        if (isTutorialTarget) firstOpenReviewFound = true;

                                                        return (
                                                            <div key={mission.id} {...(isTutorialTarget ? { 'data-tutorial': 'student-first-mission' } : {})}>
                                                                <MissionCard
                                                                    mission={mission}
                                                                    onSelectModule={onSelectModule}
                                                                    onInfoClick={handleInfoClick}
                                                                    isCompleted={isCompleted}
                                                                    isCompact={true}
                                                                    customHeader={activeWeek <= 1 ? 'Herhaling Basis' : `Herhaling ${periodNaming} ${activeWeek - 1}`}
                                                                    vsoProfile={stats?.vsoProfile}
                                                                    cardIndex={rIdx}
                                                                />
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    <AdaptiveMissionSuggestions
                                        userId={userUid}
                                        yearGroup={currentYearGroup}
                                        nulmetingResult={stats?.nulmetingResult}
                                    />

                                    {/* Main Mission Grid */}
                                    <div id="mission-grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pb-28 sm:pb-12" data-tutorial="student-main-missions">
                                        {mainMissions.length > 0 ? (
                                            mainMissions.map((mission, index) => {
                                                const isCompleted = stats?.missionsCompleted?.includes(mission.id);

                                                return (
                                                    <div
                                                        key={mission.id}
                                                        className="w-full"
                                                        {...(index === 0 && allReviewsDone ? { 'data-tutorial': 'student-first-mission' } : {})}
                                                    >
                                                        <MissionCard
                                                            mission={mission}
                                                            onSelectModule={onSelectModule}
                                                            onInfoClick={handleInfoClick}
                                                            isCompleted={isCompleted}
                                                            customHeader={mission.id === 'prompt-master' ? "Aanbevolen" : undefined}
                                                            headerColor={mission.id === 'prompt-master' ? "green" : undefined}
                                                            vsoProfile={stats?.vsoProfile}
                                                            cardIndex={index}
                                                        />
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            currentMissions.every(m => m.isReview) && (
                                                /* Only show placeholder if NO standard missions exist (and we're not just showing reviews) */
                                                <div className="col-span-full flex flex-col items-center justify-center w-full py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                                    <Calendar className="text-slate-200 mb-4" size={48} />
                                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nieuwe missies worden voorbereid...</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                    {/* INFO MODAL */}
                    {selectedMissionInfo && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                                onClick={() => setSelectedMissionInfo(null)}
                            />
                            <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full relative z-10 shadow-2xl animate-in zoom-in duration-200">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 mb-2">Over deze Missie</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {typeof selectedMissionInfo === 'string' ? selectedMissionInfo : (selectedMissionInfo as any)?.info}
                                        </p>
                                    </div>
                                </div>
                                {/* SLO Kerndoelen in info modal */}
                                {typeof selectedMissionInfo === 'object' && (selectedMissionInfo as any)?.kerndoelen?.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">SLO Kerndoelen</p>
                                        <div className="space-y-1.5">
                                            {(selectedMissionInfo as any).kerndoelen.map((code: SloKerndoelCode) => {
                                                const kd = SLO_KERNDOELEN[code];
                                                if (!kd) return null;
                                                return (
                                                    <div key={code} className={`flex items-start gap-2 p-2 rounded-lg border ${getKerndoelBadgeClasses(code)}`}>
                                                        <span className="text-[10px] font-black mt-0.5 shrink-0">{code}</span>
                                                        <div>
                                                            <span className="text-[11px] font-bold">{kd.label}</span>
                                                            <p className="text-[10px] opacity-70 leading-tight">{kd.omschrijving}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => setSelectedMissionInfo(null)}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                                    >
                                        Begrepen
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </main >

                {/* BOTTOM NAVIGATION BAR (mobile only) */}
                <BottomNav
                    activeTab={bottomNavTab}
                    onNavigate={handleBottomNav}
                    gamesEnabled={gamesEnabled}
                />
        </div>
    );
};

// Sticky-note kleuren — rustig & warm, passend bij lab-branding
const STICKY_COLORS = [
    { bg: '#F5E6DC', border: '#E4CFC2' },  // warm zand (terracotta-licht)
    { bg: '#DCE9E7', border: '#C4D6D3' },  // zacht teal (accent-licht)
    { bg: '#E8E0ED', border: '#D3C8DA' },  // gedempd lavendel (secondary-licht)
    { bg: '#F0E4D4', border: '#DFD0BC' },  // warm crème
    { bg: '#D6E6E1', border: '#BDD4CD' },  // mintgrijs
    { bg: '#EDE0D4', border: '#DCC9B8' },  // warm beige
    { bg: '#E2DDE8', border: '#CFC8D6' },  // zacht lila
    { bg: '#DAE8E4', border: '#C4D8D2' },  // bleek zeegroen
] as const;
const STICKY_ROTATIONS = [-1.2, 0.6, -0.4, 1, -0.8, 0.3] as const;
const SERIF_FONT = "'Newsreader', Georgia, serif";

const MissionCard = React.memo(({ mission, onSelectModule, onInfoClick, isCompleted, isCompact, customHeader, headerColor = 'orange', vsoProfile, cardIndex = 0 }: { mission: Mission, onSelectModule: (id: string) => void, onInfoClick?: (info: string, kerndoelen?: SloKerndoelCode[]) => void, isCompleted?: boolean, isCompact?: boolean, customHeader?: string, headerColor?: 'orange' | 'green', vsoProfile?: string, cardIndex?: number }) => {
    const handleClick = () => mission.status === 'available' && onSelectModule(mission.id);

    // Choose which kerndoelen to show based on profile
    const displayKerndoelen = vsoProfile && mission.sloVsoKerndoelen
        ? mission.sloVsoKerndoelen
        : mission.sloKerndoelen;

    const stickyColor = STICKY_COLORS[cardIndex % STICKY_COLORS.length];
    const rotation = STICKY_ROTATIONS[cardIndex % STICKY_ROTATIONS.length];

    return (
        <div
            onClick={handleClick}
            role="button"
            tabIndex={mission.status === 'locked' ? -1 : 0}
            aria-label={`${mission.title} — ${isCompleted ? 'Voltooid' : mission.status === 'locked' ? 'Vergrendeld' : 'Beschikbaar'}`}
            aria-disabled={mission.status === 'locked'}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
            className={`
            group relative rounded-lg overflow-hidden
            transition-all duration-300 flex flex-col justify-between
            ${isCompact ? 'p-4 min-h-[200px]' : 'p-6 md:p-7 min-h-[260px] md:min-h-[280px]'}
            ${mission.status === 'locked'
                    ? 'opacity-70 cursor-not-allowed grayscale-[0.6] hover:grayscale-0'
                    : 'hover:shadow-lg hover:-translate-y-1.5 cursor-pointer'}
        `}
            style={{
                backgroundColor: stickyColor.bg,
                border: `1px solid ${stickyColor.border}`,
                transform: window.innerWidth < 640 ? 'none' : `rotate(${rotation}deg)`,
                boxShadow: '2px 3px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
                if (mission.status !== 'locked') {
                    e.currentTarget.style.transform = 'rotate(0deg) translateY(-6px)';
                    e.currentTarget.style.boxShadow = '4px 8px 20px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = window.innerWidth < 640 ? 'none' : `rotate(${rotation}deg)`;
                e.currentTarget.style.boxShadow = '2px 3px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)';
            }}
        >
            {/* Tape decoration at top — hide when a header banner is present */}
            {!isCompact && !customHeader && !mission.isBonus && !mission.isExternal && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-5 rounded-sm opacity-60 z-20"
                    style={{
                        background: 'linear-gradient(180deg, rgba(200,190,170,0.5) 0%, rgba(200,190,170,0.3) 100%)',
                        backdropFilter: 'blur(1px)',
                        border: '1px solid rgba(180,170,150,0.2)',
                    }}
                />
            )}

            {/* Custom Header Tag (e.g. Herhaling Periode 1) */}
            {customHeader && (
                <div className={`absolute top-0 left-0 right-0 py-1 text-center rounded-t-lg ${headerColor === 'green' ? 'bg-amber-700/90' : 'bg-orange-500/90'}`}>
                    <span className="text-[9px] font-extrabold text-white uppercase tracking-widest leading-none block">
                        {customHeader}
                    </span>
                </div>
            )}

            {/* Highlight for Highlighted Missions */}
            {mission.isHighlighted && !customHeader && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400 rounded-t-lg animate-pulse" />
            )}

            {/* Review Mission indicator */}
            {mission.isReview && !mission.isHighlighted && !customHeader && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-lg opacity-80" />
            )}

            {/* Bonus Mission */}
            {mission.isBonus && !customHeader && (
                <div className="absolute top-0 left-0 right-0 py-1 text-center rounded-t-lg bg-gradient-to-r from-violet-500 to-fuchsia-500">
                    <span className="text-[9px] font-extrabold text-white uppercase tracking-widest leading-none block flex items-center justify-center gap-1">
                        <Stars size={10} /> Bonus Challenge <Stars size={10} />
                    </span>
                </div>
            )}

            {/* External Mission */}
            {mission.isExternal && !customHeader && !mission.isBonus && (
                <div className="absolute top-0 left-0 right-0 py-1 text-center rounded-t-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                    <span className="text-[9px] font-extrabold text-white uppercase tracking-widest leading-none block flex items-center justify-center gap-1">
                        <MonitorSmartphone size={10} /> Uitvoering in App <MonitorSmartphone size={10} />
                    </span>
                </div>
            )}

            {/* Completed Checkmark */}
            {isCompleted && (
                <div className={`absolute ${isCompact ? 'top-8 right-4' : 'top-6 right-6'} bg-emerald-600 text-white rounded-full p-1 shadow-lg z-20`}>
                    <ShieldCheck size={isCompact ? 14 : 16} />
                </div>
            )}

            {/* Background Decorative Icon */}
            <div className={`absolute top-0 right-0 opacity-[0.04] group-hover:scale-110 transition-transform duration-700 rotate-12 ${isCompact ? 'scale-75' : ''}`} style={{ color: '#8B7355' }}>
                {mission.icon}
            </div>

            {/* Card content */}
            <div className={`relative z-10 h-full flex flex-col ${customHeader || mission.isBonus || mission.isExternal ? 'pt-4' : ''}`}>
                <div className="flex justify-between items-start">
                    <div className={`
                    rounded-xl flex items-center justify-center mb-4 transition-all duration-300 overflow-hidden
                    ${isCompact ? 'w-10 h-10' : 'w-11 h-11 mb-4'}
                    ${mission.status === 'locked'
                            ? 'bg-stone-200/60 text-stone-400'
                            : 'bg-amber-800/10 text-amber-800 group-hover:bg-amber-800 group-hover:text-white'}
                `}>
                        {mission.status === 'locked' ? (
                            <Lock size={isCompact ? 16 : 28} />
                        ) : (
                            <div className={`transform transition-transform ${isCompact ? 'scale-50' : ''}`}>
                                {mission.icon}
                            </div>
                        )}
                    </div>
                    {mission.info && onInfoClick && mission.status !== 'locked' && !isCompact && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onInfoClick(mission.info!, displayKerndoelen);
                            }}
                            className="p-3 min-w-[44px] min-h-[44px] text-stone-400 hover:text-amber-700 hover:bg-amber-800/10 rounded-lg transition-colors flex items-center justify-center"
                            title="Meer informatie"
                        >
                            <Info size={18} />
                        </button>
                    )}
                </div>

                {!isCompact && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest" style={{ backgroundColor: 'rgba(139,115,85,0.1)', color: '#8B7355', border: '1px solid rgba(139,115,85,0.15)' }}>
                            Missie {mission.number}
                        </span>

                        {/* Status Tags */}
                        {mission.status === 'locked' ? (
                            <span className="px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest flex items-center gap-1" style={{ backgroundColor: 'rgba(120,113,108,0.1)', color: '#78716C', border: '1px solid rgba(120,113,108,0.15)' }}>
                                <Lock size={8} /> Vergrendeld
                            </span>
                        ) : mission.status === 'available' ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded uppercase tracking-widest border border-emerald-200/60 flex items-center gap-1">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Beschikbaar
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold rounded uppercase tracking-widest border border-amber-200/60">
                                Wordt verwacht
                            </span>
                        )}
                    </div>
                )}

                <h3 className={`
                font-semibold mb-2 transition-colors leading-snug line-clamp-2 break-words
                ${isCompact ? 'text-base' : 'text-lg mb-2'}
                ${mission.status === 'locked' ? 'text-stone-400' : 'text-stone-800 group-hover:text-amber-800'}
            `} style={{ fontFamily: SERIF_FONT }}>
                    {mission.title}
                </h3>

                {/* Description */}
                <p className={`text-stone-500 font-medium leading-relaxed ${isCompact ? 'text-xs line-clamp-3 mb-2' : 'text-sm mb-3 line-clamp-3'}`}>
                    {mission.description}
                </p>

                {/* SLO Kerndoel Badges */}
                {displayKerndoelen && displayKerndoelen.length > 0 && mission.status !== 'locked' && (
                    <div className={`flex flex-wrap gap-1 ${isCompact ? 'mb-2' : 'mb-4'}`}>
                        {(isCompact ? displayKerndoelen.slice(0, 2) : displayKerndoelen).map((code) => {
                            const kd = SLO_KERNDOELEN[code];
                            if (!kd) return null;
                            return (
                                <span
                                    key={code}
                                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[8px] font-bold uppercase tracking-wider ${getKerndoelBadgeClasses(code)}`}
                                    title={`${kd.label}: ${kd.omschrijving}`}
                                >
                                    {code} {!isCompact && kd.label}
                                </span>
                            );
                        })}
                        {isCompact && displayKerndoelen.length > 2 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md border border-stone-200 bg-stone-50 text-stone-400 text-[8px] font-bold">
                                +{displayKerndoelen.length - 2}
                            </span>
                        )}
                    </div>
                )}

                {/* Locked Reason */}
                {mission.status === 'locked' ? (
                    <div className={`mt-auto flex items-center gap-2 font-bold text-amber-700 bg-amber-50/80 rounded-lg border border-amber-200/50 ${isCompact ? 'text-[10px] p-2' : 'text-xs p-3'}`}>
                        <AlertTriangle size={isCompact ? 12 : 14} />
                        <span className={isCompact ? 'text-[9px]' : ''}>Voltooi eerst de review missies</span>
                    </div>
                ) : (
                    <div className="mt-auto flex items-center justify-between">
                        {!isCompact && (
                            <div className="flex gap-1 opacity-20">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 bg-amber-800 rounded-full"></div>
                                ))}
                            </div>
                        )}
                        <div className={`text-amber-800 font-extrabold uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
                            Start <Play size={isCompact ? 10 : 12} fill="currentColor" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
MissionCard.displayName = 'MissionCard';
