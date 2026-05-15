import React from 'react';
import { Monitor, BrainCircuit, ShieldCheck, Rocket, Puzzle, MonitorSmartphone } from 'lucide-react';
import { DGSKILLS_COLORS } from './designTokens';

export const STUDENT_DASHBOARD_COLORS = DGSKILLS_COLORS;

export const PERIOD_THEME: Record<number, { border: string; bg: string; text: string; icon: React.ReactNode; label: string }> = {
    1: { border: 'border-[#E7D8BD]', bg: 'bg-[#FCF6EA]', text: 'text-[#0B453F]', icon: <Monitor size={14} />, label: 'Digitale Basis' },
    2: { border: 'border-[#E7D8BD]', bg: 'bg-[#FCF6EA]', text: 'text-[#D97848]', icon: <BrainCircuit size={14} />, label: 'AI & Creatie' },
    3: { border: 'border-[#E7D8BD]', bg: 'bg-[#FCF6EA]', text: 'text-[#5F947D]', icon: <ShieldCheck size={14} />, label: 'Data & Veiligheid' },
    4: { border: 'border-[#E7D8BD]', bg: 'bg-[#F3E4CB]', text: 'text-[#08283B]', icon: <Rocket size={14} />, label: 'Eindproject' },
};

export const DEFAULT_PERIOD_THEME = { border: 'border-[#E7D8BD]', bg: 'bg-[#FCF6EA]', text: 'text-[#445865]', icon: <Puzzle size={14} />, label: '' };

export interface YearGroupTheme {
    label: string;
    Icon: React.ComponentType<any>;
    badgeBg: string;
    badgeText: string;
    triggerBg: string;
    accentDot: string;
    activeBorder: string;
    activeText: string;
    focusRing: string;
    gradient: string;
}

export const getYearGroupTheme = (year: number): YearGroupTheme => {
    switch (year) {
        case 1:
            return {
                label: 'Digitale Basis',
                Icon: MonitorSmartphone,
                badgeBg: 'bg-[#FCF6EA]',
                badgeText: 'text-[#0B453F]',
                triggerBg: 'bg-[#FCF6EA]',
                accentDot: 'bg-[#0B453F]',
                activeBorder: 'border-[#E7D8BD]',
                activeText: 'text-[#0B453F]',
                focusRing: 'ring-[#E7D8BD]',
                gradient: 'from-[#D97848] to-[#0B453F]',
            };
        case 2:
            return {
                label: 'Digitale Verdieping',
                Icon: BrainCircuit,
                badgeBg: 'bg-[#D7C95F]/25',
                badgeText: 'text-[#0B453F]',
                triggerBg: 'bg-[#FCF6EA]',
                accentDot: 'bg-[#99984D]',
                activeBorder: 'border-[#E7D8BD]',
                activeText: 'text-[#0B453F]',
                focusRing: 'ring-[#E7D8BD]',
                gradient: 'from-[#D7C95F] to-[#0B453F]',
            };
        case 3:
            return {
                label: 'Digitale Meesterschap',
                Icon: Rocket,
                badgeBg: 'bg-[#5F947D]/15',
                badgeText: 'text-[#0B453F]',
                triggerBg: 'bg-[#FCF6EA]',
                accentDot: 'bg-[#5F947D]',
                activeBorder: 'border-[#E7D8BD]',
                activeText: 'text-[#0B453F]',
                focusRing: 'ring-[#E7D8BD]',
                gradient: 'from-[#5F947D] to-[#0B453F]',
            };
        default:
            return {
                label: 'Digitale Leerlijn',
                Icon: MonitorSmartphone,
                badgeBg: 'bg-[#F3E4CB]',
                badgeText: 'text-[#445865]',
                triggerBg: 'bg-[#FCF6EA]',
                accentDot: 'bg-[#99984D]',
                activeBorder: 'border-[#E7D8BD]',
                activeText: 'text-[#445865]',
                focusRing: 'ring-[#E7D8BD]',
                gradient: 'from-[#99984D] to-[#445865]',
            };
    }
};

export interface PeriodLeerdoel {
    description: string;
    descriptionVso?: string;
    lesduur?: string;
    succescriterium?: string;
    succescriDagbesteding?: string;
}

export const PERIOD_LEERDOELEN: Record<string, PeriodLeerdoel> = {
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
