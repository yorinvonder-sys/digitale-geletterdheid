
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { Rocket, BrainCircuit, ShieldCheck, Gamepad2, Stars, Info, Play, Feather, Puzzle, Database, ChevronRight, ChevronLeft, Calendar, Pencil, Map, Lightbulb, Trophy, LogOut, User, RotateCcw, Search, Scale, Lock, Settings2, Cloud, FileText, Monitor, Printer, AlertTriangle, Sparkles, MessageSquare, Send, Loader2, BookOpen, BarChart2, Eye, CheckCircle2, MonitorSmartphone } from 'lucide-react';
import { getLevelProgress, getXPToNextLevel, LEVEL_THRESHOLDS } from '../utils/xp';
import { LazyAvatarViewer } from './LazyAvatarViewer';
import { DEFAULT_AVATAR_CONFIG, UserStats, EducationLevel } from '../types';
import { StudentAIChat } from './StudentAIChat';
import { subscribeToPermissions, getGamePermissions, GamePermissions } from '../services/PermissionService';
import { submitFeedback } from '../services/feedbackService';
import { StudentLibrary } from './StudentLibrary';
import { BottomNav } from './BottomNav';
import { SLO_KERNDOELEN, getKerndoelBadgeClasses, SloKerndoelCode } from '../config/sloKerndoelen';
import { CURRICULUM, getYearConfig, getPeriodConfig } from '../config/curriculum';
import { ROLES } from '../config/agents';
import { getMissionMeta } from '../config/slo-kerndoelen-mapping';

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
        description: 'Aan het eind van deze periode kun je zelfstandig werken met Word en PowerPoint, correct printen op school en opdrachten digitaal inleveren.',
        descriptionVso: 'Aan het eind van deze periode kun je verschillende digitale apparaten bedienen en software inzetten voor wonen, werken of vrije tijd.',
        lesduur: 'Lesduur: 1 uur 45 minuten. Werk in deze volgorde: LVS (15) → OneDrive (15) → Word (35) → PowerPoint (25) → Printen + Inleveren (15).',
        succescriterium: 'je bent klaar als je 1 geprinte Word-pagina hebt en beide bestanden digitaal ingeleverd zijn.',
        succescriDagbesteding: 'je hebt samengewerkt om een document te printen en op te slaan.',
    },
    '1-2': {
        description: 'Aan het eind van deze periode kun je uitleggen wat AI is, hoe je effectieve prompts schrijft, en hoe je creatief kunt samenwerken met AI-tools.',
        descriptionVso: 'Aan het eind van deze periode herken je AI in je omgeving en kun je eenvoudige digitale producten maken met behulp van technologie.',
        lesduur: 'Lesduur: 1 uur 45 minuten. Start met de herhalingsopdrachten (15 min) → Prompt Perfectionist (15 min) → Game Programmeur (25 min) → AI Trainer (15 min) → Chatbot Trainer (15 min) → Vrije keuze (20 min).',
        succescriterium: 'je hebt minimaal 3 hoofdmissies afgerond en kunt uitleggen hoe AI leert van data.',
        succescriDagbesteding: 'je hebt geëxperimenteerd met AI-tools en een creatief product gemaakt.',
    },
    '1-3': {
        description: 'Aan het eind van deze periode kun je uitleggen hoe bedrijven data gebruiken, welke kansen dat biedt en welke online risico\u2019s daarbij horen.',
        descriptionVso: 'Aan het eind van deze periode herken je AI in je omgeving en kun je veilig omgaan met digitale media en privacy.',
        lesduur: 'Lesduur: 1 uur 45 minuten. Werk in deze volgorde: Code-Criticus review (10 min) → Data Detective (25 min) → Deepfake Detector (15 min) → AI Spiegel (20 min) → Social Safeguard (15 min) → Reflectie + 3 persoonlijke dataregels (10 min).',
        succescriterium: 'je maakt een persoonlijke "Mijn 3 Dataregels"-kaart met minimaal 2 kansen, 2 gevaren en 3 concrete online keuzes die je vanaf vandaag toepast.',
        succescriDagbesteding: 'je hebt geëxperimenteerd met AI en online veiligheidskeuzes.',
    },
    '1-4': {
        description: 'In deze periode laat je in een eindproject zien wat je het hele jaar geleerd hebt over digitale vaardigheden, AI en online veiligheid.',
        descriptionVso: 'In deze periode werk je aan een eindproject waarin je laat zien wat je hebt geleerd over technologie.',
    },
};

// Missie-specifieke metadata die niet in curriculum.ts of agents.tsx staat
const MISSION_OVERRIDES: Record<string, Partial<Mission>> = {
    'magister-master': { isExternal: true, info: 'Doen in app: open Magister en log in. Ga naar Rooster en Huiswerk. Bewijs: typ in de chat de naam van je eerste les van vandaag en 1 huiswerkopdracht die je ziet staan. Klaar als: je zelfstandig rooster, opdrachten en berichten kunt vinden. Tijd: 15 minuten.' },
    'cloud-commander': { isExternal: true, info: 'Doen in app: maak in de OneDrive app de mappen School > Periode 1 > Opdrachten. Bewijs: typ in de chat de volledige naam van het testbestand dat je hebt opgeslagen. Klaar als: je bestand op de juiste plek in OneDrive staat. Tijd: 15 minuten.' },
    'word-wizard': { isExternal: true, info: 'Doen in app: maak in Word een document met titel (Kop 1), 2 tussenkoppen, een opsomming en een afbeelding. Klaar als: je document is opgeslagen in OneDrive. Tijd: 35 minuten.' },
    'slide-specialist': { isExternal: true, info: 'Doen in app: maak een PowerPoint-presentatie van 3 slides met minimaal 1 afbeelding. Klaar als: je presentatie in OneDrive staat en 3 slides heeft. Tijd: 25 minuten.' },
    'print-pro': { isExternal: true, info: 'Doen in app: print je Word-doc via de print-app en lever je bestanden in. Klaar als: je print klopt en de opdracht op "Ingeleverd" staat. Tijd: 15 minuten.' },
    'ipad-print-instructies': { isHighlighted: true, classRestriction: 'MH1A', info: 'Een complete gids om te printen vanaf je iPad. Je leert de print-app downloaden, inloggen en je eerste document printen.' },
    'cloud-cleaner': { info: 'Mappenstructuur en bestandsorganisatie herhalen. Zorg voor een opgeruimde Cloud!' },
    'layout-doctor': { info: 'Test je Word-kennis door problemen te matchen aan oplossingen. Van sneltoetsen tot tekstomloop!' },
    'pitch-police': { info: 'Slide-design principes herhalen. Maak slides visueel aantrekkelijk en duidelijk.' },
    'prompt-master': { info: 'Hoe vraag je AI om precies te doen wat je wilt? Leer het verschil tussen vage, onduidelijke prompts en krachtige, duidelijke prompts die perfecte resultaten opleveren!' },
    'game-programmeur': { info: 'Duik in de code van een kapotte game! Je leert de basis van programmeren door bugs op te lossen en de spelregels aan te passen.' },
    'ai-trainer': { info: 'Hoe leert een computer? Jij gaat een AI-model trainen om verschillende materialen te herkennen door het goede voorbeelden te geven.' },
    'chatbot-trainer': { info: 'Hoe weet een chatbot wat hij moet antwoorden? Maak regels en test je eigen chatbot!' },
    'ai-tekengame': { info: 'Test hoe goed AI patronen herkent. Teken een object en kijk of de AI het kan raden!' },
    'game-director': { number: 'Vrije Keuze', info: 'In deze Vrije Keuze missie krijg je de volledige controle. Pas zwaartekracht, snelheid en uiterlijk aan om jouw perfecte game te maken.' },
    'verhalen-ontwerper': { info: 'Leer hoe je met Artificial Intelligence verhalen tot leven brengt. Je gaat werken met image-generation tools om scenes uit je verhaal te visualiseren.' },
    'ai-beleid-brainstorm': { info: 'Jouw mening telt! Help de school met het vormgeven van AI-beleid door ideeën te delen en te stemmen op de beste voorstellen.' },
    'review-week-2': { info: 'Controleer je kennis van de vorige periode. Heb je alles onthouden over AI en programmeren?' },
    'data-detective': { info: 'Onderzoek hoe bedrijven data verzamelen en inzetten. Je leert kansen afwegen tegen gevaren en maakt bewustere internetkeuzes.' },
    'deepfake-detector': { info: 'Kun jij AI-gegenereerde content herkennen? Leer de tekenen te spotten die verraden of iets door een mens of door AI is gemaakt!' },
    'ai-spiegel': { info: 'Onderzoek hoe likes, kijktijd en zoekgedrag worden gebruikt door platforms. Je ontdekt kansen en gevaren en maakt je eigen privacyregels.' },
    'social-safeguard': { info: 'Oefen met realistische scenario\'s zoals nepaccounts, shaming en ongewenst delen. Leer hoe je bewijs bewaart en slim meldt.' },
    'cookie-crusher': { info: 'Websites gebruiken trucs om je op "Accepteer alles" te laten klikken. Leer deze dark patterns herkennen! Speed-game met scores en badges.' },
    'data-handelaar': { info: 'Je bent undercover bij DataDeal BV! Onderzoek 3 verdachte bewijsstukken, vind de AVG-overtredingen. Escape room-stijl missie!' },
    'privacy-profiel-spiegel': { info: 'Controleer de echte privacy-instellingen van apps op je iPad. Krijg een persoonlijke Privacy Score en maak een actieplan.' },
    'filter-bubble-breaker': { info: 'Vergelijk twee social media feeds, beantwoord quizvragen en leer hoe algoritmes jouw wereld vormen.' },
    'datalekken-rampenplan': { info: 'De school is gehackt! 800 leerlinggegevens liggen op straat. Manage de crisis en maak een noodplan.' },
    'data-voor-data': { info: 'Ethische veiling: kies DEAL of NO DEAL bij steeds grotere data-verzoeken. Ontdek je persoonlijke privacy-principes.' },
    'social-media-psychologist': { isBonus: true, info: 'Bonusmissie! Ontdek waarom je blijft scrollen en hoe algoritmes je aandacht vangen.' },
    'review-week-3': { info: 'Tijd voor de balans. Wat heb je geleerd over veiligheid en ethiek? Test je kennis.' },
    'mission-blueprint': { info: 'Elk groot project begint met een plan. Gebruik je digitale skills om je eindwerk te organiseren.' },
    'mission-vision': { info: 'Verbeeld je idee. Gebruik AI en design tools om je concept tot leven te wekken in een pitch.' },
    'mission-launch': { info: 'Showtime! Presenteer je werk aan de klas en laat zien wat je hebt geleerd als Digitale Expert.' },
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
        const overrides = MISSION_OVERRIDES[missionId] || {};
        missions.push({
            id: missionId,
            title: role?.title || missionId,
            description: role?.description || '',
            icon: role?.icon ? React.cloneElement(role.icon as React.ReactElement, { size: 40 }) : <RotateCcw size={40} />,
            number: 'Review',
            status: 'available',
            info: overrides.info || role?.problemScenario,
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
        const overrides = MISSION_OVERRIDES[missionId] || {};
        missions.push({
            id: missionId,
            title: role?.title || missionId,
            description: role?.description || '',
            icon: role?.icon ? React.cloneElement(role.icon as React.ReactElement, { size: 40 }) : <Puzzle size={40} />,
            number: overrides.number || String(missionNum).padStart(2, '0'),
            status: 'available',
            info: overrides.info || (role ? `${role.problemScenario || ''} ${role.missionObjective || ''}`.trim() : undefined),
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
            info: 'Doen in app: open Magister en log in. Ga naar Rooster en Huiswerk. Bewijs: typ in de chat de naam van je eerste les van vandaag en 1 huiswerkopdracht die je ziet staan. Klaar als: je zelfstandig rooster, opdrachten en berichten kunt vinden. Tijd: 15 minuten.',
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
            info: 'Doen in app: maak in de OneDrive app de mappen School > Periode 1 > Opdrachten. Bewijs: typ in de chat de volledige naam van het testbestand dat je hebt opgeslagen (bijv. klas_voornaam_testbestand.docx). Klaar als: je bestand op de juiste plek in OneDrive staat. Tijd: 15 minuten.',
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
            info: 'Doen in app: maak in Word een document met titel (Kop 1), 2 tussenkoppen, een opsomming en een afbeelding. Bewijs: typ in de chat hoeveel koppen je in je automatische inhoudsopgave hebt staan. Klaar als: je document is opgeslagen in OneDrive. Tijd: 35 minuten. ⭐ Bonus Challenge: voeg een automatische inhoudsopgave en een kop-/voettekst toe.',
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
            info: 'Doen in app: maak een PowerPoint-presentatie van 3 slides (titel, tips, Magister/printen) met minimaal 1 afbeelding. Bewijs: typ in de chat het onderwerp van je tweede slide. Klaar als: je presentatie in OneDrive staat en 3 slides heeft. Tijd: 25 minuten. ⭐ Bonus Challenge: voeg overgangen tussen slides toe en gebruik een animatie op minstens 1 element.',
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
            info: 'Doen in app: print je Word-doc via de RICOH app en lever je Word + PowerPoint bestanden in via de Magister app. Bewijs: typ in de chat de status die bij je opdracht in Magister staat (bijv. "Ingeleverd"). Klaar als: je print klopt en Magister op "Ingeleverd" staat. Tijd: 15 minuten.',
            sloKerndoelen: ['21A']
        },
    ],
    2: [
        { id: 'ipad-print-instructies', title: 'iPad Print Instructies', description: 'Leer stap-voor-stap printen vanaf je iPad met de RICOH myPrint app.', icon: <Printer size={40} />, number: 'MH1A', status: 'available', info: 'Een complete gids om te printen vanaf je iPad. Je leert de RICOH myPrint app downloaden, inloggen en je eerste document printen.', isHighlighted: true, isReview: true, sloKerndoelen: ['21A'] },
        { id: 'cloud-cleaner', title: 'Cloud Schoonmaker', description: 'Sleep de rondslingerende bestanden naar de juiste mappen.', icon: <Cloud size={40} />, number: 'Review', status: 'available', info: 'Mappenstructuur en bestandsorganisatie herhalen. Zorg voor een opgeruimde Cloud!', isReview: true, sloKerndoelen: ['21A'] },
        { id: 'layout-doctor', title: 'Word Match', description: 'Koppel Word-problemen aan de juiste oplossing!', icon: <FileText size={40} />, number: 'Review', status: 'available', info: 'Test je Word-kennis door problemen te matchen aan oplossingen. Van sneltoetsen tot tekstomloop!', isReview: true, sloKerndoelen: ['21A'] },
        { id: 'pitch-police', title: 'Pitch Politie', description: 'Geef deze saaie slide een makeover zodat het publiek niet in slaap valt.', icon: <Monitor size={40} />, number: 'Review', status: 'available', info: 'Slide-design principes herhalen. Maak slides visueel aantrekkelijk en duidelijk.', isReview: true, sloKerndoelen: ['21A', '22B'] },

        { id: 'prompt-master', title: 'Prompt Perfectionist', description: 'Leer het verschil tussen goede en slechte prompts.', icon: <Sparkles size={40} />, number: '01', status: 'available', info: 'Hoe vraag je AI om precies te doen wat je wilt? Leer het verschil tussen vage, onduidelijke prompts en krachtige, duidelijke prompts die perfecte resultaten opleveren!', sloKerndoelen: ['21B', '22A'], sloVsoKerndoelen: ['18C', '19A', '20B'] },
        { id: 'game-programmeur', title: 'Game Programmeur', description: 'Repareer games met code. Bepaal zelf de regels van het spel.', icon: <Gamepad2 size={40} />, number: '02', status: 'available', info: 'Duik in de code van een kapotte game! Je leert de basis van programmeren door bugs op te lossen en de spelregels aan te passen.', sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
        { id: 'ai-trainer', title: 'AI Trainer', description: 'Leer een robot het verschil tussen materialen met supervised learning.', icon: <Database size={40} />, number: '04', status: 'available', info: 'Hoe leert een computer? Jij gaat een AI-model trainen om verschillende materialen te herkennen door het goede voorbeelden te geven.', sloKerndoelen: ['21D'], sloVsoKerndoelen: ['18C'] },
        { id: 'chatbot-trainer', title: 'Chatbot Trainer', description: 'Bouw je eigen chatbot en leer hoe AI gesprekken voert.', icon: <BrainCircuit size={40} />, number: '05', status: 'available', info: 'Hoe weet een chatbot wat hij moet antwoorden? Maak regels en test je eigen chatbot!', sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
        { id: 'ai-tekengame', title: 'AI Tekengame', description: 'Teken en laat de AI raden wat het is!', icon: <Pencil size={40} />, number: '06', status: 'available', info: 'Test hoe goed AI patronen herkent. Teken een object en kijk of de AI het kan raden!', sloKerndoelen: ['21B'], sloVsoKerndoelen: ['18C'] },
        { id: 'game-director', title: 'De Game Director', description: 'Word de architect. Herschrijf de natuurwetten en ontwerp je eigen game-regelset.', icon: <Settings2 size={40} />, number: 'Vrije Keuze', status: 'available', info: 'Ben jij creatief en technisch? In deze Vrije Keuze missie krijg je de volledige controle. Pas zwaartekracht, snelheid en uiterlijk aan om jouw perfecte game te maken. Geschikt voor leerlingen die graag experimenteren!', sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
        { id: 'verhalen-ontwerper', title: 'Verhalen Ontwerper', description: 'Visualiseer verhalen met AI. Leer prompts schrijven en beelden maken.', icon: <Feather size={40} />, number: '07', status: 'available', info: 'In deze missie leer je hoe je met Artificial Intelligence verhalen tot leven brengt. Je gaat werken met image-generation tools om scenes uit je verhaal te visualiseren.', sloKerndoelen: ['21B', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
        { id: 'ai-beleid-brainstorm', title: 'AI Beleid Brainstorm', description: 'Denk mee over AI-regels op school.', icon: <Scale size={40} />, number: '08', status: 'available', info: 'Jouw mening telt! Help de school met het vormgeven van AI-beleid door ideeën te delen en te stemmen op de beste voorstellen.', sloKerndoelen: ['23B', '23C'], sloVsoKerndoelen: ['20B'] },
    ],
    3: [
        { id: 'review-week-2', title: 'De Code-Criticus', description: 'Vind fouten in AI-content uit Week 2.', icon: <Search size={40} />, number: 'Review', status: 'available', info: 'Controleer je kennis van Week 2. Heb je alles onthouden over AI en programmeren?', sloKerndoelen: ['21B', '22B'], sloVsoKerndoelen: ['18C'] },
        { id: 'data-detective', title: 'Data Detective', description: 'Ontdek wat bedrijven met data doen: risico’s en kansen.', icon: <BarChart2 size={40} />, number: '01', status: 'available', info: 'Onderzoek hoe bedrijven data verzamelen en inzetten. Je leert kansen (persoonlijke aanbevelingen, veiligheid) afwegen tegen gevaren (tracking, dark patterns, data delen met derden) en maakt bewustere internetkeuzes. Duur: ca. 25 minuten. ⭐ Bonus Challenge: probeer alle 6 challenges met een perfecte score af te ronden.', sloKerndoelen: ['21B', '23C'], sloVsoKerndoelen: ['18B', '20A'] },
        { id: 'deepfake-detector', title: 'Deepfake Detector', description: 'Spot AI-gegenereerde content en nepnieuws.', icon: <Eye size={40} />, number: '02', status: 'available', info: 'Kun jij AI-gegenereerde content herkennen? Leer de tekenen te spotten die verraden of iets door een mens of door AI is gemaakt!', sloKerndoelen: ['21B', '23A', '23C'], sloVsoKerndoelen: ['18B', '18C', '20A'] },
        { id: 'ai-spiegel', title: 'De AI Spiegel', description: 'Zie hoe jouw online gedrag een advertentieprofiel vormt.', icon: <BrainCircuit size={40} />, number: '03', status: 'available', info: 'Onderzoek hoe likes, kijktijd en zoekgedrag worden gebruikt door platforms. Je ontdekt zowel kansen (relevante content) als gevaren (sturing en filterbubbels) en maakt je eigen privacyregels. ⭐ Bonus Challenge: schrijf 3 privacyregels op die je vanaf vandaag toepast en deel ze met een klasgenoot.', sloKerndoelen: ['23B', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'social-safeguard', title: 'Social Safeguard', description: 'Train veilig handelen bij online druk, pesten en datamisbruik.', icon: <ShieldCheck size={40} />, number: '04', status: 'available', info: 'Oefen met realistische scenario\'s zoals nepaccounts, shaming en ongewenst delen. Je leert hoe je bewijs bewaart, slim meldt en jezelf en anderen online beschermt.', sloKerndoelen: ['23A', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'cookie-crusher', title: 'Cookie Crusher', description: 'Herken dark patterns in cookie-popups en bescherm je privacy.', icon: <ShieldCheck size={40} />, number: '05', status: 'available', info: 'Websites gebruiken trucs om je op "Accepteer alles" te laten klikken. Leer deze dark patterns herkennen en bescherm je privacy! Speed-game met scores en badges.', sloKerndoelen: ['23C', '21B'], sloVsoKerndoelen: ['18B', '20A'] },
        { id: 'data-handelaar', title: 'De Data Handelaar', description: 'Ga undercover en ontmasker illegale datahandel.', icon: <Search size={40} />, number: '06', status: 'available', info: 'Je bent undercover bij DataDeal BV! Onderzoek 3 verdachte bewijsstukken, vind de AVG-overtredingen en stel een rapport op. Escape room-stijl missie!', sloKerndoelen: ['23C', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'privacy-profiel-spiegel', title: 'Privacy Profiel Spiegel', description: 'Check je eigen app-instellingen en ontdek wat je deelt.', icon: <Eye size={40} />, number: '07', status: 'available', info: 'Controleer de echte privacy-instellingen van apps op je iPad: locatie, camera en microfoon. Krijg een persoonlijke Privacy Score en maak een actieplan.', sloKerndoelen: ['23A', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'filter-bubble-breaker', title: 'Filter Bubble Breaker', description: 'Vergelijk twee social media feeds en ontdek filterbubbels.', icon: <BrainCircuit size={40} />, number: '08', status: 'available', info: 'Twee mensen openen dezelfde app maar zien totaal andere content. Vergelijk de feeds, beantwoord quizvragen en leer hoe algoritmes jouw wereld vormen.', sloKerndoelen: ['23B', '23C', '21B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'datalekken-rampenplan', title: 'Datalekken Rampenplan', description: 'Los een school datalek-crisis op!', icon: <AlertTriangle size={40} />, number: '09', status: 'available', info: 'De school is gehackt! 800 leerlinggegevens liggen op straat. Manage de crisis: dicht het lek, informeer de AP, communiceer met ouders en maak een noodplan.', sloKerndoelen: ['23A', '23B', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'data-voor-data', title: 'Data voor Data', description: 'Hoeveel persoonlijke data zou jij inruilen?', icon: <Scale size={40} />, number: '10', status: 'available', info: 'Ethische veiling: kies DEAL of NO DEAL bij steeds grotere data-verzoeken. Vergelijk je keuzes met het gemiddelde en ontdek je persoonlijke privacy-principes.', sloKerndoelen: ['23C', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'social-media-psychologist', title: 'Social Media Psycholoog', description: 'Begrijp de psychologie achter scrollen, likes en filterbubbels.', icon: <BrainCircuit size={40} />, number: 'Bonus', status: 'available', info: 'Bonusmissie voor snelle afmakers! Ontdek waarom je blijft scrollen, hoe algoritmes je aandacht vangen en wat dopamine met je online gedrag doet. Ontwerp je eigen "For You"-pagina en doorbreek je filterbubbel.', isBonus: true, sloKerndoelen: ['21B', '23B', '23C'], sloVsoKerndoelen: ['20B'] },
    ],
    4: [
        { id: 'review-week-3', title: 'De Ethische Raad', description: 'Adviseer over ethische dilemma\'s.', icon: <Scale size={40} />, number: 'Review', status: 'available', info: 'Tijd voor de balans. Wat heb je geleerd over veiligheid en ethiek? Test je kennis.', sloKerndoelen: ['22B', '23C'] },
        { id: 'mission-blueprint', title: 'De Blauwdruk', description: 'Organiseer je meesterwerk. Gebruik Magister, OneDrive en Word om je plan te smeden.', icon: <Map size={40} />, number: '02', status: 'available', info: 'Elk groot project begint met een plan. Gebruik je digitale skills om je eindwerk te organiseren.', sloKerndoelen: ['21A', '22A'] },
        { id: 'mission-vision', title: 'De Visie', description: 'Visualiseer je droom. Combineer AI-beelden met een strakke PowerPoint pitch.', icon: <Lightbulb size={40} />, number: '03', status: 'available', info: 'Verbeeld je idee. Gebruik AI en design tools om je concept tot leven te wekken in een pitch.', sloKerndoelen: ['21B', '22A'] },
        { id: 'mission-launch', title: 'De Lancering', description: 'Breng het naar buiten. Print je designs en communiceer als een pro.', icon: <Rocket size={40} />, number: '04', status: 'available', info: 'Showtime! Presenteer je werk aan de klas en laat zien wat je hebt geleerd als Digitale Expert.', sloKerndoelen: ['21A', '21C'] },
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
    userRole = 'student'
}) => {
    // Curriculum-aware variabelen
    const currentYearGroup = activeYearGroup ?? 1;
    const periodNaming = schoolConfig?.periodNaming || CURRICULUM.defaultPeriodNaming;
    const yearConfig = getYearConfig(currentYearGroup);
    const currentPeriodConfig = getPeriodConfig(currentYearGroup, activeWeek);
    const periodTheme = PERIOD_THEME[activeWeek] || DEFAULT_PERIOD_THEME;
    const periodLeerdoel = PERIOD_LEERDOELEN[`${currentYearGroup}-${activeWeek}`];
    const [showXPPopup, setShowXPPopup] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = React.useState(false);
    const [selectedMissionInfo, setSelectedMissionInfo] = useState<string | { info: string; kerndoelen: SloKerndoelCode[] } | null>(null);
    const [permissions, setPermissions] = useState<GamePermissions | null>(null);

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
    const isTeacher = userRole === 'teacher' || userRole === 'admin';
    const [leerdoelenOpen, setLeerdoelenOpen] = useState(isTeacher);

    const currentMissions = useMemo(() => {
        let missions = buildMissionsForPeriod(currentYearGroup, activeWeek);

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
        const availableWeeks = [1, 2, 3, 4];

        if (isLeftSwipe && activeWeek < 4) {
            // Swipe left = next week
            const nextWeek = availableWeeks.find(w => w > activeWeek);
            if (nextWeek) setActiveWeek(nextWeek);
        }
        if (isRightSwipe && activeWeek > 1) {
            // Swipe right = previous week
            const prevWeek = [...availableWeeks].reverse().find(w => w < activeWeek);
            if (prevWeek) setActiveWeek(prevWeek);
        }

        setTouchStart(null);
        setTouchEnd(null);
    };


    // Calculate progress stats for the current week
    const totalMissions = currentMissions.filter(m => !m.isReview).length;
    const completedCount = currentMissions.filter(m => !m.isReview && stats?.missionsCompleted?.includes(m.id)).length;

    // For Week 2: check review mission progress
    const reviewMissions = currentMissions.filter(m => m.isReview);
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
                {/* Student AI Chat - Floating Button */}
                {userUid && <StudentAIChat userIdentifier={userUid} context={{ week: activeWeek }} />}

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
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowGameNotification(false)}
                        />
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-emerald-200 w-full max-w-sm relative z-10 animate-in zoom-in duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-xl mb-6 transform -rotate-3 animate-bounce">
                                    <Gamepad2 size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">🎮 Games Actief!</h3>
                                <p className="text-slate-500 font-bold text-sm mb-2">
                                    De docent heeft {activatedGameName || 'een game'} geactiveerd!
                                </p>
                                <p className="text-slate-400 text-xs mb-6">
                                    Je kunt nu meedoen aan de game-sessie met je klasgenoten.
                                </p>

                                <div className="flex flex-col gap-3 w-full">
                                    <button
                                        onClick={() => {
                                            setShowGameNotification(false);
                                            if (onOpenGames) onOpenGames();
                                        }}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Play size={18} fill="currentColor" />
                                        Naar Games!
                                    </button>
                                    <button
                                        onClick={() => setShowGameNotification(false)}
                                        className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
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
                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-white transform rotate-3 overflow-hidden">
                            <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain p-1" decoding="async" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase leading-none">
                                Project 0 <span className="text-indigo-600">DG</span>
                            </h1>
                            <p className="text-[9px] text-slate-400 font-medium tracking-widest uppercase mt-1">Project DG • Mission Control</p>
                        </div>
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
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold
                                ${dailyStreak >= 7 ? 'bg-orange-500 text-white animate-pulse shadow-lg shadow-orange-500/30' :
                                  dailyStreak >= 3 ? 'bg-orange-100 text-orange-600' :
                                  'bg-slate-100 text-slate-500'}`}>
                                <span role="img" aria-label="streak">&#x1F525;</span> {dailyStreak} {dailyStreak === 1 ? 'dag' : 'dagen'}
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
                                    <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-[1px]">
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
                        {Object.keys(CURRICULUM.yearGroups).length > 1 && (
                            <select
                                value={currentYearGroup}
                                onChange={(e) => { setActiveYearGroup?.(Number(e.target.value)); setActiveWeek(1); }}
                                className="px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-900 text-white border-none min-h-[44px] cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%223%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.5rem_center]"
                            >
                                {Object.entries(CURRICULUM.yearGroups)
                                    .filter(([_, config]) => {
                                        const userLevel = (stats?.educationLevel as EducationLevel) || 'havo';
                                        return config.availableLevels.includes(userLevel);
                                    })
                                    .map(([yearStr, config]) => (
                                        <option key={yearStr} value={yearStr}>{config.title}</option>
                                    ))
                                }
                            </select>
                        )}
                        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl flex-1 md:flex-initial border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
                        {Object.keys(yearConfig?.periods || {}).map(Number).sort((a, b) => a - b).map((period) => {
                            const pConf = yearConfig?.periods[period];
                            const isLocked = !isTeacher && !permissions?.enabled_games?.includes(`week-${period}`);

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
                        <div className={`mb-4 bg-white rounded-2xl border ${periodTheme.border} shadow-sm overflow-hidden`}>
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
                                    {currentMissions.some(m => m.isReview) && (
                                        <div className="w-full" data-tutorial="student-review-missions">
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <RotateCcw size={16} /> Herhaling &amp; Basics
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {currentMissions.filter(m => m.isReview).map(mission => {
                                                    const isNormallyCompleted = stats?.missionsCompleted?.includes(mission.id);
                                                    const isAutoCompleted = mission.id === 'ipad-print-instructies' && stats?.studentClass !== 'MH1A';
                                                    const isCompleted = isNormallyCompleted || isAutoCompleted;

                                                    return (
                                                        <MissionCard
                                                            key={mission.id}
                                                            mission={mission}
                                                            onSelectModule={onSelectModule}
                                                            onInfoClick={handleInfoClick}
                                                            isCompleted={isCompleted}
                                                            isCompact={true}
                                                            customHeader={activeWeek <= 1 ? 'Herhaling Basis' : `Herhaling ${periodNaming} ${activeWeek - 1}`}
                                                            vsoProfile={stats?.vsoProfile}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Main Mission Grid */}
                                    <div id="mission-grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pb-28 sm:pb-12" data-tutorial="student-main-missions">
                                        {(currentMissions.filter(m => !m.isReview) || []).length > 0 ? (
                                            currentMissions.filter(m => !m.isReview).map((mission, index) => {
                                                const isCompleted = stats?.missionsCompleted?.includes(mission.id);

                                                return (
                                                    <div
                                                        key={mission.id}
                                                        className="w-full"
                                                        {...(index === 0 ? { 'data-tutorial': 'student-first-mission' } : {})}
                                                    >
                                                        <MissionCard
                                                            mission={mission}
                                                            onSelectModule={onSelectModule}
                                                            onInfoClick={handleInfoClick}
                                                            isCompleted={isCompleted}
                                                            customHeader={mission.id === 'prompt-master' ? "Aanbevolen" : undefined}
                                                            headerColor={mission.id === 'prompt-master' ? "green" : undefined}
                                                            vsoProfile={stats?.vsoProfile}
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

const MissionCard = React.memo(({ mission, onSelectModule, onInfoClick, isCompleted, isCompact, customHeader, headerColor = 'orange', vsoProfile }: { mission: Mission, onSelectModule: (id: string) => void, onInfoClick?: (info: string, kerndoelen?: SloKerndoelCode[]) => void, isCompleted?: boolean, isCompact?: boolean, customHeader?: string, headerColor?: 'orange' | 'green', vsoProfile?: string }) => {
    const handleClick = () => mission.status === 'available' && onSelectModule(mission.id);

    // Choose which kerndoelen to show based on profile
    const displayKerndoelen = vsoProfile && mission.sloVsoKerndoelen
        ? mission.sloVsoKerndoelen
        : mission.sloKerndoelen;

    return (
        <div
            onClick={handleClick}
            role="button"
            tabIndex={mission.status === 'locked' ? -1 : 0}
            aria-label={`${mission.title} — ${isCompleted ? 'Voltooid' : mission.status === 'locked' ? 'Vergrendeld' : 'Beschikbaar'}`}
            aria-disabled={mission.status === 'locked'}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
            className={`
            group relative bg-white rounded-3xl shadow-sm border
            transition-all duration-300 overflow-hidden flex flex-col justify-between
            ${isCompact ? 'p-4 min-h-[200px]' : 'p-6 md:p-7 min-h-[280px] md:min-h-[300px]'}
            ${mission.status === 'locked'
                    ? 'opacity-80 border-slate-100 cursor-not-allowed grayscale-[0.8] hover:grayscale-0'
                    : 'border-slate-100 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-pointer'}
        `}
        >
            {/* Custom Header Tag (e.g. Herhaling Periode 1) */}
            {customHeader && (
                <div className={`absolute top-0 left-0 right-0 py-1 text-center border-b ${headerColor === 'green' ? 'bg-emerald-500 border-emerald-600' : 'bg-orange-500 border-orange-600'}`}>
                    <span className="text-[9px] font-extrabold text-white uppercase tracking-widest leading-none block">
                        {customHeader}
                    </span>
                </div>
            )}

            {/* Highlight for Highlighted Missions (orange glow) */}
            {mission.isHighlighted && !customHeader && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400 animate-pulse" />
            )}

            {/* Highlight for Review Missions (if not highlighted and no header overlap) */}
            {mission.isReview && !mission.isHighlighted && !customHeader && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 opacity-80" />
            )}

            {/* Bonus Mission Highlight (purple gradient) */}
            {mission.isBonus && !customHeader && (
                <div className="absolute top-0 left-0 right-0 py-1 text-center border-b bg-gradient-to-r from-violet-500 to-fuchsia-500 border-violet-600">
                    <span className="text-[9px] font-extrabold text-white uppercase tracking-widest leading-none block flex items-center justify-center gap-1">
                        <Stars size={10} /> Bonus Challenge <Stars size={10} />
                    </span>
                </div>
            )}

            {/* External Mission Highlight (blue gradient) */}
            {mission.isExternal && !customHeader && !mission.isBonus && (
                <div className="absolute top-0 left-0 right-0 py-1 text-center border-b bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-600">
                    <span className="text-[9px] font-extrabold text-white uppercase tracking-widest leading-none block flex items-center justify-center gap-1">
                        <MonitorSmartphone size={10} /> Uitvoering in App <MonitorSmartphone size={10} />
                    </span>
                </div>
            )}

            {/* Completed Checkmark Overlay */}
            {isCompleted && (
                <div className={`absolute ${isCompact ? 'top-8 right-4' : 'top-6 right-6'} bg-green-500 text-white rounded-full p-1 shadow-lg z-20`}>
                    <ShieldCheck size={isCompact ? 14 : 16} />
                </div>
            )}

            {/* Background Decorative Icon */}
            <div className={`absolute -top-6 -right-6 opacity-[0.03] text-indigo-900 group-hover:scale-110 transition-transform duration-700 rotate-12 ${isCompact ? 'scale-75' : ''}`}>
                {mission.icon}
            </div>

            {/* Padding adjustment for header */}
            <div className={`relative z-10 h-full flex flex-col ${customHeader || mission.isBonus || mission.isExternal ? 'pt-4' : ''}`}>
                <div className="flex justify-between items-start">
                    <div className={`
                    rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 shadow-sm overflow-hidden
                    ${isCompact ? 'w-10 h-10' : 'w-12 h-12 mb-4'}
                    ${mission.status === 'locked'
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}
                `}>
                        {mission.status === 'locked' ? (
                            <Lock size={isCompact ? 16 : 32} />
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
                            className="p-3 min-w-[44px] min-h-[44px] text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center"
                            title="Meer informatie"
                        >
                            <Info size={20} />
                        </button>
                    )}
                </div>

                {!isCompact && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-full uppercase tracking-widest border border-slate-200">
                            Missie {mission.number}
                        </span>

                        {/* Status Tags */}
                        {mission.status === 'locked' ? (
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-full uppercase tracking-widest border border-slate-200 flex items-center gap-1">
                                <Lock size={8} /> Vergrendeld
                            </span>
                        ) : mission.status === 'available' ? (
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-full uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Beschikbaar
                            </span>
                        ) : (
                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded-full uppercase tracking-widest border border-amber-100">
                                Wordt verwacht
                            </span>
                        )}
                    </div>
                )}

                <h3 className={`
                font-black mb-2 transition-colors tracking-tight line-clamp-2 break-words
                ${isCompact ? 'text-base' : 'text-xl mb-2'}
                ${mission.status === 'locked' ? 'text-slate-400' : 'text-slate-900 group-hover:text-indigo-600'}
            `}>
                    {mission.title}
                </h3>

                {/* Show description based on size */}
                <p className={`text-slate-500 font-medium leading-relaxed ${isCompact ? 'text-xs line-clamp-2 mb-2' : 'text-sm mb-3 line-clamp-2'}`}>
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
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-400 text-[8px] font-bold">
                                +{displayKerndoelen.length - 2}
                            </span>
                        )}
                    </div>
                )}

                {/* Locked Reason */}
                {mission.status === 'locked' ? (
                    <div className={`mt-auto flex items-center gap-2 font-bold text-amber-600 bg-amber-50 rounded-xl border border-amber-100 ${isCompact ? 'text-[10px] p-2' : 'text-xs p-3'}`}>
                        <AlertTriangle size={isCompact ? 12 : 14} />
                        {!isCompact && "Voltooi eerst de review missies"}
                    </div>
                ) : (
                    <div className="mt-auto flex items-center justify-between">
                        {!isCompact && (
                            <div className="flex gap-1 opacity-20">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                ))}
                            </div>
                        )}
                        <div className={`text-indigo-600 font-extrabold uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
                            Start <Play size={isCompact ? 10 : 12} fill="currentColor" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
MissionCard.displayName = 'MissionCard';
