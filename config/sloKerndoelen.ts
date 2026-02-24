// SLO Kerndoelen Digitale Geletterdheid - Definitieve conceptkerndoelen (sept. 2025)
// Inclusief Functionele Kerndoelen voor VSO (nov. 2025)
// Bron: SLO - Stichting Leerplan Ontwikkeling

export type SloKerndoelCode =
    // Regulier PO/VO
    | '21A' | '21B' | '21C' | '21D' | '22A' | '22B' | '23A' | '23B' | '23C'
    // VSO Functioneel
    | '18A' | '18B' | '18C' | '19A' | '20A' | '20B';

export type DomeinNummer = 18 | 19 | 20 | 21 | 22 | 23;

export interface SloKerndoel {
    code: SloKerndoelCode;
    domein: string;
    domeinNummer: DomeinNummer;
    label: string;
    omschrijving: string;
    kleur: 'blue' | 'purple' | 'amber';
    isVso?: boolean;
}

export const SLO_KERNDOELEN: Record<SloKerndoelCode, SloKerndoel> = {
    // --- VSO FUNCTIONELE KERNDOELEN (2025) ---
    '18A': {
        code: '18A',
        domein: 'Praktische kennis & vaardigheden',
        domeinNummer: 18,
        label: 'Digitale systemen',
        omschrijving: 'De leerling zet digitale systemen functioneel in.',
        kleur: 'blue',
        isVso: true
    },
    '18B': {
        code: '18B',
        domein: 'Praktische kennis & vaardigheden',
        domeinNummer: 18,
        label: 'Media & Informatie',
        omschrijving: 'De leerling navigeert doelgericht in het digitale medialandschap.',
        kleur: 'blue',
        isVso: true
    },
    '18C': {
        code: '18C',
        domein: 'Praktische kennis & vaardigheden',
        domeinNummer: 18,
        label: 'Verkennen AI',
        omschrijving: 'De leerling verkent AI-toepassingen in de eigen omgeving.',
        kleur: 'blue',
        isVso: true
    },
    '19A': {
        code: '19A',
        domein: 'Ontwerpen & maken',
        domeinNummer: 19,
        label: 'Creëren met tech',
        omschrijving: 'De leerling ontwerpt en maakt producten met digitale technologie.',
        kleur: 'purple',
        isVso: true
    },
    '20A': {
        code: '20A',
        domein: 'De gedigitaliseerde wereld',
        domeinNummer: 20,
        label: 'Veiligheid & Privacy',
        omschrijving: 'De leerling gaat veilig om met digitale systemen, data en privacy.',
        kleur: 'amber',
        isVso: true
    },
    '20B': {
        code: '20B',
        domein: 'De gedigitaliseerde wereld',
        domeinNummer: 20,
        label: 'Jezelf & de ander',
        omschrijving: 'De leerling maakt passende keuzes bij het gebruik van digitale media.',
        kleur: 'amber',
        isVso: true
    },

    // --- REGULIER PO/VO (Officiële SLO sept. 2025 codes) ---
    '21A': {
        code: '21A',
        domein: 'Praktische kennis & vaardigheden',
        domeinNummer: 21,
        label: 'Digitale systemen',
        omschrijving: 'De leerling zet digitale systemen functioneel in.',
        kleur: 'blue',
    },
    '21B': {
        code: '21B',
        domein: 'Praktische kennis & vaardigheden',
        domeinNummer: 21,
        label: 'Media & Informatie',
        omschrijving: 'De leerling navigeert doelgericht in het digitale media- en informatielandschap.',
        kleur: 'blue',
    },
    '21C': {
        code: '21C',
        domein: 'Praktische kennis & vaardigheden',
        domeinNummer: 21,
        label: 'Data & Dataverwerking',
        omschrijving: 'De leerling verkent het gebruik van data en dataverwerking.',
        kleur: 'blue',
    },
    '21D': {
        code: '21D',
        domein: 'Praktische kennis & vaardigheden',
        domeinNummer: 21,
        label: 'AI',
        omschrijving: 'De leerling verkent mogelijkheden en beperkingen van AI.',
        kleur: 'blue',
    },
    '22A': {
        code: '22A',
        domein: 'Ontwerpen & maken',
        domeinNummer: 22,
        label: 'Digitale producten',
        omschrijving: 'De leerling gebruikt passende werkwijzen bij het creëren van digitale producten.',
        kleur: 'purple',
    },
    '22B': {
        code: '22B',
        domein: 'Ontwerpen & maken',
        domeinNummer: 22,
        label: 'Programmeren',
        omschrijving: 'De leerling programmeert een computerprogramma met behulp van computationele denkstrategieën.',
        kleur: 'purple',
    },
    '23A': {
        code: '23A',
        domein: 'De gedigitaliseerde wereld',
        domeinNummer: 23,
        label: 'Veiligheid & privacy',
        omschrijving: 'De leerling gaat veilig om met digitale systemen, data en privacy.',
        kleur: 'amber',
    },
    '23B': {
        code: '23B',
        domein: 'De gedigitaliseerde wereld',
        domeinNummer: 23,
        label: 'Digitaal welzijn',
        omschrijving: 'De leerling maakt weloverwogen keuzes bij het gebruik van digitale technologie.',
        kleur: 'amber',
    },
    '23C': {
        code: '23C',
        domein: 'De gedigitaliseerde wereld',
        domeinNummer: 23,
        label: 'Maatschappij',
        omschrijving: 'De leerling analyseert hoe digitale technologie en de samenleving elkaar wederzijds beïnvloeden.',
        kleur: 'amber',
    },
};

// Helper: get kerndoel badge styling classes
export function getKerndoelBadgeClasses(code: SloKerndoelCode): string {
    const kerndoel = SLO_KERNDOELEN[code];
    if (!kerndoel) return '';
    switch (kerndoel.kleur) {
        case 'blue': return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'purple': return 'bg-purple-50 text-purple-600 border-purple-200';
        case 'amber': return 'bg-amber-50 text-amber-600 border-amber-200';
    }
}
