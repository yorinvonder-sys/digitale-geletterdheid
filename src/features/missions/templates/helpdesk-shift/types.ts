import type { BadgeConfig, MissionGoal } from '../shared/types';

export type { BadgeConfig };

/** De drie handelingen die de leerling met een binnengekomen bericht kan doen. */
export type ShiftAction = 'melden' | 'weggooien' | 'doorlaten';

/** Wat de meters van de school meten. Alles telt af vanaf een gezonde start. */
export interface SchoolState {
    /** Accounts die nog niet zijn overgenomen. */
    veiligeAccounts: number;
    /** Bedrag dat de school is kwijtgeraakt, in hele euro's. */
    verlorenGeld: number;
    /** Terechte meldingen die de leerling naar IT stuurde. */
    meldingen: number;
}

/**
 * Wat er gebeurt als de leerling een bericht verkeerd behandelt. Het gevolg is
 * zichtbaar en concreet — een naam, een bedrag — want daar zit het leereffect:
 * een fout is niet "min 5 punten" maar "meneer Smits is zijn account kwijt".
 */
export interface Consequence {
    /** Regel in de gebeurtenissenlijst, in de verleden tijd. */
    melding: string;
    /** Hoeveel accounts er verloren gaan. Weglaten = geen. */
    accountsKwijt?: number;
    /** Bedrag dat de school kwijtraakt. Weglaten = geen. */
    geldKwijt?: number;
}

/** Een onderdeel in een bericht dat de leerling kan aanwijzen als verdacht. */
export interface Vlag {
    id: string;
    /** Wat er in de mail staat, precies zoals de leerling het ziet. */
    tekst: string;
    /** Waar het in het bericht hoort te staan. */
    plek: 'afzender' | 'onderwerp' | 'tekst' | 'link' | 'bijlage';
    /** Of dit werkelijk een waarschuwingssignaal is. */
    verdacht: boolean;
    /** Wat de leerling leert van dit onderdeel, of hij het nu aanwees of niet. */
    uitleg: string;
}

export interface ShiftMail {
    id: number;
    fromName: string;
    fromAddress: string;
    subject: string;
    /** Eén regel voorbeeldtekst in de wachtrij. */
    preview: string;
    /** Alinea's van het bericht, zichtbaar zodra de leerling het opent. */
    body: string[];
    /** Optionele bijlage, zoals een echte mail die toont. */
    attachment?: { filename: string; size: string };
    /** Optionele knop of link in het bericht, met de werkelijke bestemming. */
    link?: { label: string; destination: string };
    /** De handeling die deze mail verdient. */
    juisteActie: ShiftAction;
    /**
     * Handeling die verdedigbaar is maar niet ideaal — levert een deel van de
     * punten op. Een verdachte mail weggooien is bijvoorbeeld veilig, maar dan
     * is niemand anders gewaarschuwd.
     */
    acceptabeleActie?: ShiftAction;
    /** Het signaal dat deze mail verraadt of juist echt maakt. Voor de nabespreking. */
    tell: string;
    /** Uitleg in de nabespreking, ongeacht wat de leerling koos. */
    uitleg: string;
    /** Wat er gebeurt bij een foute handeling. Per foute handeling apart. */
    gevolg: Partial<Record<ShiftAction, Consequence>>;
    /**
     * Onderdelen die de leerling in het bericht kan aanwijzen. Wie goed kijkt
     * verzamelt bewijs, en met bewijs is een melding overtuigend. Aanwijzen kan
     * nooit punten kosten — alleen opleveren.
     */
    vlaggen?: Vlag[];
}

export interface HelpdeskShiftConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    introFeatures?: string[];
    learningObjectives?: string[];
    /** Beginstand van de meters. */
    startStand: SchoolState;
    /**
     * De berichten, in de volgorde waarin ze binnenkomen. Er is bewust geen
     * klok en geen wachtrij die volloopt: het volgende bericht komt pas als de
     * leerling het vorige heeft afgehandeld. Wie langer nadenkt wordt daar
     * nergens voor gestraft — de missie gaat over goed kijken, niet over snel
     * klikken.
     */
    mails: ShiftMail[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
}

/** Wat de leerling met één bericht deed, en wat dat opleverde. */
export interface HandledMail {
    mailId: number;
    gekozenActie: ShiftAction;
    /** Punten voor dit bericht, op de schaal die scoreMail teruggeeft. */
    punten: number;
    /** Ids van de onderdelen die de leerling had aangewezen. */
    bewijs?: string[];
}

/**
 * De opgeslagen toestand van deze missie.
 *
 * Bewust ZONDER klok, wachtrij of halve dienst: een dienst is één
 * ononderbroken sessie. Wie halverwege herlaadt, begint de dienst opnieuw —
 * dat is eerlijker en veiliger dan een bevroren klok terugzetten, en het
 * voorkomt dat een leerling in een onspeelbare tussentoestand vastloopt.
 * Alleen een afgeronde dienst wordt bewaard.
 */
export interface HelpdeskShiftState {
    phase: 'intro' | 'dienst' | 'debrief';
    /** Gevuld zodra de dienst is uitgespeeld; leeg tijdens de dienst. */
    afgerondeDienst?: {
        behandeld: HandledMail[];
        eindstand: SchoolState;
        gebeurtenissen: string[];
    };
}

/** Live toestand tijdens de dienst. Leeft alleen in het geheugen, nooit in de opslag. */
export interface LiveShiftState {
    /** Het bericht dat nu op een scherm wacht, of null tijdens een onderbreking. */
    huidigeMail: number | null;
    /** Hoeveel stappen van de ochtend er al af zijn. */
    stap: number;
    /** Hoeveel stappen de ochtend telt. */
    totaalStappen: number;
    behandeld: HandledMail[];
    stand: SchoolState;
    gebeurtenissen: string[];
}
