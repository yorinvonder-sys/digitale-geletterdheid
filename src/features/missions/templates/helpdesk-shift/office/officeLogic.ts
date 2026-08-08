import type { Desk, FocusConfig, OfficeConfig, Spot, Station } from './officeTypes';

/** Afstand tussen twee plekken op de vloer. */
export function afstand(a: Spot, b: Spot): number {
    return Math.hypot(a.x - b.x, a.z - b.z);
}

/**
 * Houdt de leerling binnen de muren. De ruimte is een rechthoek rond de
 * oorsprong; `marge` houdt hem een halve schouderbreedte van de wand.
 */
export function binnenMuren(positie: Spot, config: OfficeConfig, marge = 0.4): Spot {
    const maxX = config.afmeting.breedte - marge;
    const maxZ = config.afmeting.diepte - marge;
    return {
        x: Math.max(-maxX, Math.min(maxX, positie.x)),
        z: Math.max(-maxZ, Math.min(maxZ, positie.z)),
    };
}

/**
 * Het bureau of station waar de leerling nu bij staat, of null.
 *
 * Bij gelijke afstand wint het dichtstbijzijnde; staat hij tussen twee plekken
 * in, dan is er geen willekeur — dezelfde positie geeft altijd dezelfde
 * uitkomst, zodat het spel voorspelbaar blijft.
 */
export function dichtstbijzijnde(
    positie: Spot,
    config: OfficeConfig
): { id: string; soort: 'desk' | 'station'; afstand: number } | null {
    const kandidaten: Array<{ id: string; soort: 'desk' | 'station'; positie: Spot }> = [
        ...config.desks.map((d: Desk) => ({ id: d.id, soort: 'desk' as const, positie: d.positie })),
        ...config.stations.map((s: Station) => ({ id: s.id, soort: 'station' as const, positie: s.positie })),
    ];

    let beste: { id: string; soort: 'desk' | 'station'; afstand: number } | null = null;
    for (const k of kandidaten) {
        const d = afstand(positie, k.positie);
        if (d > config.bereik) continue;
        if (!beste || d < beste.afstand) beste = { id: k.id, soort: k.soort, afstand: d };
    }
    return beste;
}

/**
 * Verplaatst de leerling één stap. `richting` is een genormaliseerde
 * bewegingsvector; `delta` het aantal verstreken seconden.
 */
export function stap(
    positie: Spot,
    richting: { x: number; z: number },
    config: OfficeConfig,
    delta: number
): Spot {
    const lengte = Math.hypot(richting.x, richting.z);
    if (lengte === 0) return positie;
    const genormaliseerd = { x: richting.x / lengte, z: richting.z / lengte };
    const afstandStap = config.loopsnelheid * delta;
    return binnenMuren(
        {
            x: positie.x + genormaliseerd.x * afstandStap,
            z: positie.z + genormaliseerd.z * afstandStap,
        },
        config
    );
}

/** Kijkrichting die hoort bij een bewegingsvector. */
export function kijkrichting(richting: { x: number; z: number }, vorige: number): number {
    if (richting.x === 0 && richting.z === 0) return vorige;
    return Math.atan2(richting.x, richting.z);
}

/** Focus na een kop koffie. Gaat nooit boven de honderd. */
export function focusNaKoffie(focus: number, focusConfig: FocusConfig): number {
    return Math.min(100, focus + focusConfig.koffieHerstel);
}

/**
 * Of de voorbeeldregels in de wachtrij nog leesbaar zijn.
 *
 * Dit is het enige effect van weinig focus. Geen wazige of trillende tekst:
 * dat straft leerlingen met lees- of zichtproblemen dubbel voor iets wat over
 * oplettendheid gaat. Wie moe is moet naar het bureau lopen om te lezen —
 * dat kost tijd, niet leesbaarheid.
 */
export function toontVoorbeeld(focus: number, focusConfig: FocusConfig): boolean {
    return focus >= focusConfig.drempelVoorbeeld;
}
