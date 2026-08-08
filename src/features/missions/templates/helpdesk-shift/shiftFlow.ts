import type { HelpdeskShiftConfig } from './types';
import type { Onderbreking } from './office/officeTypes';

/** Eén ding dat de leerling moet afhandelen. */
export type Stap =
    | { soort: 'mail'; mailId: number }
    | { soort: 'onderbreking'; onderbrekingId: string };

/**
 * De ochtend als een rij stappen: berichten in volgorde, met de onderbrekingen
 * ertussen op de plek waar ze horen.
 *
 * Er is bewust geen klok. Het volgende ding komt pas als het vorige klaar is,
 * dus een leerling die langer nadenkt raakt niets kwijt. Dat past bij wat deze
 * missie oefent — goed kijken — en niet bij snel klikken. De druk zit in de
 * gevolgen van een verkeerde keuze, niet in een aftellende teller.
 */
export function bouwStappen(
    config: HelpdeskShiftConfig,
    onderbrekingen: readonly Onderbreking[]
): Stap[] {
    const stappen: Stap[] = [];
    config.mails.forEach((mail, index) => {
        stappen.push({ soort: 'mail', mailId: mail.id });
        const naDitBericht = index + 1;
        for (const onderbreking of onderbrekingen) {
            if (onderbreking.naBericht === naDitBericht) {
                stappen.push({ soort: 'onderbreking', onderbrekingId: onderbreking.id });
            }
        }
    });
    // Een onderbreking die na méér berichten zou komen dan er zijn, valt anders
    // stilletjes weg. Hang hem achteraan zodat hij nog gespeeld wordt.
    for (const onderbreking of onderbrekingen) {
        if (onderbreking.naBericht > config.mails.length) {
            stappen.push({ soort: 'onderbreking', onderbrekingId: onderbreking.id });
        }
    }
    return stappen;
}

/** De stap waar de leerling nu is, of null als de ochtend erop zit. */
export function huidigeStap(stappen: readonly Stap[], index: number): Stap | null {
    return index >= 0 && index < stappen.length ? stappen[index] : null;
}

/** Het bericht dat nu op een scherm staat, of null tijdens een onderbreking. */
export function huidigeMailId(stappen: readonly Stap[], index: number): number | null {
    const stap = huidigeStap(stappen, index);
    return stap?.soort === 'mail' ? stap.mailId : null;
}

/** De onderbreking die nu speelt, of null. */
export function huidigeOnderbrekingId(stappen: readonly Stap[], index: number): string | null {
    const stap = huidigeStap(stappen, index);
    return stap?.soort === 'onderbreking' ? stap.onderbrekingId : null;
}

/** Of de ochtend erop zit. */
export function isKlaar(stappen: readonly Stap[], index: number): boolean {
    return index >= stappen.length;
}
