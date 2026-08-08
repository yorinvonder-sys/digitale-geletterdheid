import type { ShiftMail } from '../types';

/** Een positie op de kantoorvloer. De vloer ligt in het xz-vlak; y is hoogte. */
export interface Spot {
    x: number;
    z: number;
}

/**
 * Een werkplek in het kantoor. Berichten komen binnen op het scherm van een
 * collega, dus de leerling moet erheen lopen om ze te lezen. Afstand is tijd:
 * dat is wat het lopen betekenis geeft in plaats van opvulling.
 */
export interface Desk {
    id: string;
    /** Naam van de collega, zoals hij ook in de berichten kan voorkomen. */
    naam: string;
    positie: Spot;
    /** Kant waar de stoel staat, in graden; bepaalt hoe het bureau gedraaid staat. */
    rotatie: number;
}

/** Vaste plekken in het kantoor die geen bureau zijn. */
export type StationSoort = 'koffie' | 'telefoon' | 'usb' | 'itkast' | 'versnipperaar';

/**
 * Waar een gedragen bericht kan worden afgeleverd, en welke handeling dat is.
 *
 * De handeling is geen knop maar een plek: melden betekent naar de serverkast
 * lopen, weggooien naar de versnipperaar, doorlaten terug naar de collega. Zo
 * is de plattegrond onderdeel van de beslissing, en kun je je onderweg nog
 * bedenken — precies zoals in het echt.
 */
export const AFLEVERPLEK: Partial<Record<StationSoort, 'melden' | 'weggooien'>> = {
    itkast: 'melden',
    versnipperaar: 'weggooien',
};

export interface Station {
    id: string;
    soort: StationSoort;
    positie: Spot;
    label: string;
}

/** De vier onderbrekingen naast de gewone berichtenstroom. */
export type OnderbrekingSoort = 'telefoon' | 'usb' | 'collega';

export interface Keuze {
    id: string;
    label: string;
    /** Of dit de veilige handeling is. */
    veilig: boolean;
    /** Wat de leerling terugkrijgt na deze keuze. */
    reactie: string;
    /** Regel voor de gebeurtenissenlijst bij een onveilige keuze. */
    gevolgMelding?: string;
    accountsKwijt?: number;
    geldKwijt?: number;
}

export interface Onderbreking {
    id: string;
    soort: OnderbrekingSoort;
    /**
     * Na hoeveel afgehandelde berichten dit gebeurt. Niet op een tijdstip:
     * de ochtend volgt het tempo van de leerling, niet van een klok.
     */
    naBericht: number;
    /** Waar het speelt: een station (telefoon, usb) of een bureau (collega). */
    plek: string;
    /** Wat de leerling hoort of leest bij aankomst. */
    aanhef: string;
    tekst: string[];
    keuzes: Keuze[];
    /** Het signaal waaraan het te herkennen was, voor de nabespreking. */
    tell: string;
    uitleg: string;
}

/**
 * Hoe scherp de leerling nog is. Loopt langzaam terug tijdens de dienst en
 * herstelt bij de koffieautomaat.
 *
 * Bewust GEEN wazige of trillende tekst bij weinig focus: dat straft leerlingen
 * met lees- of zichtproblemen dubbel voor iets wat over oplettendheid gaat. Het
 * enige effect is dat de voorbeeldregel in de wachtrij wegvalt, zodat de
 * leerling echt naar het bureau moet lopen om te kunnen lezen.
 */
export interface FocusConfig {
    /** Focus zakt met dit aantal punten per afgehandeld onderdeel. */
    daalPerStap: number;
    /** Onder deze waarde verdwijnt de voorbeeldregel bij het bureau. */
    drempelVoorbeeld: number;
    /** Hoeveel focus een kop koffie teruggeeft. */
    koffieHerstel: number;
}

export interface OfficeConfig {
    /** Halve breedte en halve diepte van de ruimte, in meters. */
    afmeting: { breedte: number; diepte: number };
    /** Waar de leerling begint. */
    startPositie: Spot;
    desks: Desk[];
    stations: Station[];
    /** Binnen welke afstand een bureau of station bedienbaar wordt, in meters. */
    bereik: number;
    /** Loopsnelheid in meters per seconde. */
    loopsnelheid: number;
    focus: FocusConfig;
    onderbrekingen: Onderbreking[];
    /** Welke mail op welk bureau binnenkomt. Mail-ids uit de missieconfig. */
    mailPerDesk: Record<number, string>;
}

/** Alles wat de 3D-laag nodig heeft om te weten wat er te doen is. */
export interface OfficeLive {
    /** Positie van de leerling op de vloer. */
    positie: Spot;
    /** Kijkrichting in radialen, voor het draaien van het figuurtje. */
    richting: number;
    /** Of de leerling op dit moment beweegt — voor de loopanimatie. */
    loopt: boolean;
    focus: number;
    /** Bureaus met een onbehandeld bericht. */
    desksMetPost: string[];
    /** Het bureau of station waar de leerling nu vlakbij staat, of null. */
    dichtbij: string | null;
    /** De onderbreking die nu speelt, of null. */
    actieveOnderbreking: Onderbreking | null;
    /** Of de leerling net koffie heeft gehaald. */
    bijKoffie: boolean;
    /** Draagt de leerling nu een bericht met zich mee? */
    draagtBericht: boolean;
    /** Plekken waar het gedragen bericht kan worden afgeleverd. */
    afleverplekken: string[];
    /** Collega's van wie het account is overgenomen — hun scherm slaat rood uit. */
    getroffenDesks: string[];
}

/** Berichten die op een bepaald bureau wachten. */
export function mailsOpDesk(
    mailPerDesk: OfficeConfig['mailPerDesk'],
    deskId: string,
    wachtrij: readonly number[]
): number[] {
    return wachtrij.filter((mailId) => mailPerDesk[mailId] === deskId);
}

export type { ShiftMail };
