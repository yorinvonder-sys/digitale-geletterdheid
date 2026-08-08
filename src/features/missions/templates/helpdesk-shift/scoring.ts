import type {
    Consequence,
    HandledMail,
    HelpdeskShiftConfig,
    SchoolState,
    ShiftAction,
    ShiftMail,
} from './types';

/** Aandeel van de eindscore dat uit de handelingen zelf komt. */
const AANDEEL_BESLISSINGEN = 0.7;
/** Aandeel dat uit de eindstand van de school komt. */
const AANDEEL_SCHOOL = 0.3;
/**
 * Hoeveel een foutloos onderbouwde keuze extra waard is bovenop een goede
 * keuze zonder bewijs. Bewust klein en alleen positief: wie goed kijkt krijgt
 * iets terug, maar wie het goede antwoord om de juiste reden kiest zonder alles
 * aan te tikken wordt nergens voor gestraft.
 */
const BEWIJS_BONUS = 0.15;

/**
 * Hoe goed de leerling het bericht heeft gelezen, op een schaal van 0 tot 1.
 * Alleen terecht aangewezen onderdelen tellen; een misser kost niets, want
 * ergens naar wijzen en je vergissen is onderdeel van leren kijken.
 */
export function bewijsScore(mail: ShiftMail, bewijs: readonly string[] = []): number {
    const verdachte = (mail.vlaggen ?? []).filter((v) => v.verdacht);
    if (verdachte.length === 0) return 1;
    const gevonden = verdachte.filter((v) => bewijs.includes(v.id)).length;
    return gevonden / verdachte.length;
}

/** Wat één behandeld bericht oplevert, op een schaal van 0 tot 1. */
export function scoreMail(mail: ShiftMail, actie: ShiftAction): number {
    if (actie === mail.juisteActie) return 1;
    if (mail.acceptabeleActie && actie === mail.acceptabeleActie) return 0.5;
    return 0;
}

/**
 * De eindscore van een dienst, op de schaal van `config.maxScore`.
 *
 * Twee delen: wat de leerling met de berichten deed, en hoe de school ervoor
 * staat als de dienst erop zit. Het tweede deel maakt de gevolgen voelbaar —
 * een fout is niet alleen een gemist punt, hij laat een spoor achter.
 */
export function scoreShift(
    config: HelpdeskShiftConfig,
    behandeld: HandledMail[],
    eindstand: SchoolState
): number {
    // Er blijft niets liggen: de ochtend loopt door tot alles behandeld is,
    // dus elk bericht telt even zwaar mee.
    const perId = new Map(behandeld.map((h) => [h.mailId, h]));
    let behaald = 0;
    for (const mail of config.mails) {
        const keuze = perId.get(mail.id);
        if (!keuze) continue;
        const basis = scoreMail(mail, keuze.gekozenActie);
        // De bewijsbonus geldt alleen bovenop een goede keuze: bewijs verzamelen
        // bij een verkeerde handeling maakt die handeling niet beter.
        const bonus = basis > 0 ? BEWIJS_BONUS * bewijsScore(mail, keuze.bewijs) : 0;
        behaald += Math.min(1, basis + bonus);
    }
    const beslissingsdeel = config.mails.length > 0 ? behaald / config.mails.length : 1;

    const startAccounts = config.startStand.veiligeAccounts;
    const schooldeel = startAccounts > 0
        ? Math.max(0, Math.min(1, eindstand.veiligeAccounts / startAccounts))
        : 1;

    const totaal = (beslissingsdeel * AANDEEL_BESLISSINGEN + schooldeel * AANDEEL_SCHOOL)
        * config.maxScore;
    return Math.max(0, Math.min(config.maxScore, Math.round(totaal)));
}

/** Past een gevolg toe op de stand van de school. De stand kan nooit onder nul zakken. */
export function pasGevolgToe(stand: SchoolState, gevolg: Consequence): SchoolState {
    return {
        veiligeAccounts: Math.max(0, stand.veiligeAccounts - (gevolg.accountsKwijt ?? 0)),
        verlorenGeld: stand.verlorenGeld + Math.max(0, gevolg.geldKwijt ?? 0),
        meldingen: stand.meldingen,
    };
}

/**
 * Verwerkt één handeling: de nieuwe stand van de school, en de regel die in de
 * gebeurtenissenlijst verschijnt. Een juiste melding telt op bij de meldingen;
 * een foute handeling levert het bijbehorende gevolg op.
 */
export function verwerkHandeling(
    mail: ShiftMail,
    actie: ShiftAction,
    stand: SchoolState
): { stand: SchoolState; gebeurtenis: string | null } {
    const punten = scoreMail(mail, actie);

    if (punten > 0) {
        const nieuw = actie === 'melden'
            ? { ...stand, meldingen: stand.meldingen + 1 }
            : stand;
        return { stand: nieuw, gebeurtenis: null };
    }

    const gevolg = mail.gevolg[actie];
    if (!gevolg) return { stand, gebeurtenis: null };
    return { stand: pasGevolgToe(stand, gevolg), gebeurtenis: gevolg.melding };
}
