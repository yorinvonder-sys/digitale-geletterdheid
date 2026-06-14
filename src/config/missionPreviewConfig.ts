import React from 'react';
import { STUDENT_DASHBOARD_COLORS } from './dashboardThemes';

import { MISSION_SCREENSHOTS } from './missionThumbnails';
export { MISSION_SCREENSHOTS };

export type MissionPreviewKind =
    | 'cloud'
    | 'document'
    | 'slides'
    | 'print'
    | 'ai'
    | 'game'
    | 'data'
    | 'security'
    | 'code'
    | 'media'
    | 'project';

export interface MissionPreviewConfig {
    kind: MissionPreviewKind;
    title: string;
    subtitle: string;
    chips: string[];
    accent: string;
    surface: string;
}

export const MISSION_PREVIEW_OVERRIDES: Record<string, Partial<MissionPreviewConfig>> = {
    'magister-master': { kind: 'document', title: 'Rooster & huiswerk', subtitle: 'Agenda, opdrachten en berichten vinden', chips: ['Magister', 'Agenda', 'ELO'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'cloud-commander': { kind: 'cloud', title: 'OneDrive structuur', subtitle: 'Mappen maken en bestanden opslaan', chips: ['Cloud', 'Mappen', 'Opslaan'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'word-wizard': { kind: 'document', title: 'Word document', subtitle: 'Koppen, tekst en afbeelding netjes maken', chips: ['Word', 'Koppen', 'Afbeelding'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'slide-specialist': { kind: 'slides', title: 'PowerPoint deck', subtitle: 'Drie duidelijke slides met beeld', chips: ['Slides', 'Beeld', 'Pitch'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.cream },
    'print-pro': { kind: 'print', title: 'Printopdracht', subtitle: 'Printen, ophalen en inleveren', chips: ['Printer', 'Wachtrij', 'Inleveren'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'ipad-print-instructies': { kind: 'print', title: 'iPad printen', subtitle: 'App installeren en eerste print versturen', chips: ['iPad', 'RICOH', 'Print'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.creamDeep },
    'cloud-cleaner': { kind: 'cloud', title: 'Cloud opruimen', subtitle: 'Sleep bestanden naar de juiste map', chips: ['Bestanden', 'Mappen', 'Prullenbak'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'layout-doctor': { kind: 'document', title: 'Word layout repareren', subtitle: 'Kop 1, Arial en tekstterugloop toepassen', chips: ['Word', 'Kop 1', 'Layout'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'pitch-police': { kind: 'slides', title: 'Slide verbeteren', subtitle: 'Contrast, beeld en tekst rustiger maken', chips: ['Slides', 'Contrast', 'Review'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.cream },
    'chatbot-trainer': { kind: 'ai', title: 'Chatbot trainen', subtitle: 'Intenties, vragen en antwoorden testen', chips: ['Bot', 'Intenties', 'Test'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'game-director': { kind: 'game', title: 'Game-regels bouwen', subtitle: 'Beweging, zwaartekracht en gedrag aanpassen', chips: ['Regels', 'Codeblok', 'Playtest'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.cream },
    'ai-beleid-brainstorm': { kind: 'project', title: 'AI-regels op school', subtitle: 'Ideeen afwegen en stemmen', chips: ['Regels', 'School', 'Stemmen'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'review-week-2': { kind: 'code', title: 'Code-Criticus', subtitle: 'Fouten in AI-output herkennen', chips: ['Review', 'Code', 'Fouten'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'review-week-3': { kind: 'security', title: 'Ethische Raad', subtitle: 'Privacy en digitale keuzes beoordelen', chips: ['Ethiek', 'Privacy', 'Advies'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'data-review': { kind: 'data', title: 'Data Review', subtitle: 'Patronen en bronnen kritisch checken', chips: ['Data', 'Grafiek', 'Bron'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'code-review-2': { kind: 'code', title: 'Code Review', subtitle: 'Codeproblemen herkennen en uitleggen', chips: ['Code', 'Review', 'Bug'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'media-review': { kind: 'media', title: 'Media Review', subtitle: 'Content en ontwerpkeuzes beoordelen', chips: ['Media', 'Vorm', 'Impact'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'advanced-code-review': { kind: 'code', title: 'Advanced Review', subtitle: 'Complexe code kritisch beoordelen', chips: ['Code', 'ML', 'Risico'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'security-review': { kind: 'security', title: 'Security Review', subtitle: 'Aanvallen, risico en verdediging checken', chips: ['Security', 'Risico', 'Shield'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
    'impact-review': { kind: 'project', title: 'Impact Review', subtitle: 'Gevolgen van technologie afwegen', chips: ['Impact', 'Mens', 'Keuzes'], accent: STUDENT_DASHBOARD_COLORS.ink, surface: STUDENT_DASHBOARD_COLORS.paper },
};

interface MissionLike {
    id: string;
    title: string;
    description: string;
    info?: string;
    icon: React.ReactNode;
    number: string;
    isReview?: boolean;
}

export const inferMissionPreviewConfig = (mission: MissionLike): MissionPreviewConfig => {
    const source = `${mission.id} ${mission.title} ${mission.description} ${mission.info || ''}`.toLowerCase();
    const override = MISSION_PREVIEW_OVERRIDES[mission.id];
    let kind: MissionPreviewKind = 'project';
    // DUCK-stijl: accenten zijn ink (acid mag nooit als tekst/icoon op licht, en
    // error-rood is voor échte fouten). Differentiatie zit in motief + surface.
    let accent: string = STUDENT_DASHBOARD_COLORS.ink;
    let surface: string = STUDENT_DASHBOARD_COLORS.cream;

    if (/cloud|onedrive|bestand|map/.test(source)) {
        kind = 'cloud';
        accent = STUDENT_DASHBOARD_COLORS.ink;
        surface = STUDENT_DASHBOARD_COLORS.paper;
    } else if (/word|document|rapport|verslag|tekst|reflectie/.test(source)) {
        kind = 'document';
        accent = STUDENT_DASHBOARD_COLORS.ink;
        surface = STUDENT_DASHBOARD_COLORS.paper;
    } else if (/slide|powerpoint|pitch|presentatie/.test(source)) {
        kind = 'slides';
        accent = STUDENT_DASHBOARD_COLORS.ink;
        surface = STUDENT_DASHBOARD_COLORS.cream;
    } else if (/print|printer/.test(source)) {
        kind = 'print';
        accent = STUDENT_DASHBOARD_COLORS.ink;
        surface = STUDENT_DASHBOARD_COLORS.paper;
    } else if (/game|spel/.test(source)) {
        kind = 'game';
        accent = STUDENT_DASHBOARD_COLORS.ink;
        surface = STUDENT_DASHBOARD_COLORS.paper;
    } else if (/code|program|api|bug|algorithm|automation|developer|web/.test(source)) {
        kind = 'code';
        accent = STUDENT_DASHBOARD_COLORS.ink;
        surface = STUDENT_DASHBOARD_COLORS.paper;
    } else if (/privacy|security|cyber|phishing|wachtwoord|datalek|veilig/.test(source)) {
        kind = 'security';
        accent = STUDENT_DASHBOARD_COLORS.ink;
        surface = STUDENT_DASHBOARD_COLORS.paper;
    } else if (/data|dashboard|spreadsheet|grafiek|onderzoek|bias/.test(source)) {
        kind = 'data';
        accent = STUDENT_DASHBOARD_COLORS.ink;
        surface = STUDENT_DASHBOARD_COLORS.paper;
    } else if (/ai|prompt|ml|neural|chatbot/.test(source)) {
        kind = 'ai';
        accent = STUDENT_DASHBOARD_COLORS.ink;
        surface = STUDENT_DASHBOARD_COLORS.paper;
    } else if (/media|podcast|meme|video|story|verhaal|brand|ontwerp/.test(source)) {
        kind = 'media';
        accent = STUDENT_DASHBOARD_COLORS.ink;
        surface = STUDENT_DASHBOARD_COLORS.paper;
    }

    const fallbackTitle = mission.title;
    const fallbackSubtitle = mission.description || mission.info || 'Werk aan deze opdracht en maak zichtbaar bewijs.';
    const chips = [
        mission.isReview ? 'Review' : mission.number === 'Vrije Keuze' ? 'Vrije keuze' : `Missie ${mission.number}`,
        kind === 'ai' ? 'AI' : kind === 'security' ? 'Veilig' : kind === 'data' ? 'Data' : kind === 'code' ? 'Code' : kind === 'media' ? 'Creatie' : kind === 'game' ? 'Game' : 'Skill',
        'Portfolio',
    ];

    return {
        kind,
        title: fallbackTitle,
        subtitle: fallbackSubtitle,
        chips,
        accent,
        surface,
        ...override,
    };
};

export const missionTagFor = (mission: MissionLike): { label: string; color: string } => {
    // DUCK-stijl: tag-pills zijn ink-vlakken met witte tekst (consistent met de
    // homepage). Acid blijft een vlakkleur, error-rood alleen voor échte fouten.
    if (mission.isReview) return { label: 'Review', color: STUDENT_DASHBOARD_COLORS.ink };
    if (mission.id.includes('game')) return { label: 'Game', color: STUDENT_DASHBOARD_COLORS.ink };
    if (mission.id.includes('podcast') || mission.id.includes('story') || mission.id.includes('verhalen')) return { label: 'Verhaal', color: STUDENT_DASHBOARD_COLORS.ink };
    if (mission.id.includes('privacy') || mission.id.includes('security') || mission.id.includes('data')) return { label: 'Privacy', color: STUDENT_DASHBOARD_COLORS.ink };
    if (mission.id.includes('design') || mission.id.includes('brand') || mission.id.includes('dashboard')) return { label: 'Design', color: STUDENT_DASHBOARD_COLORS.ink };
    return { label: 'AI', color: STUDENT_DASHBOARD_COLORS.ink };
};
