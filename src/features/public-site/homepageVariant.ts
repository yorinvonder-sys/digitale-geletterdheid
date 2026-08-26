/**
 * Variantkeuze voor de homepage (`/`).
 *
 * Zie `docs/marketing/homepage-ab-test-opzet.md` voor waaróm dit zo is opgezet.
 * Kort samengevat:
 *
 * - De keuze valt **synchroon**, vóór de eerste render. Zou hij in een effect
 *   vallen, dan ziet een B-bezoeker eerst A en daarna B — een zichtbare flits.
 * - De keuze **plakt** per bezoeker. Anders vergelijk je bezoeken in plaats van
 *   mensen, en ziet dezelfde bezoeker bij elk bezoek een andere site.
 * - `?variant=a` / `?variant=b` forceert een variant om er zelf naar te kunnen
 *   kijken. Zo'n bezoek telt **niet** mee in de meting: onze eigen bezoeken
 *   mogen de uitkomst niet vervuilen.
 */

export type HomepageVariant = 'a' | 'b';

/** Sleutel in localStorage. Bevat geen persoonsgegevens, alleen 'a' of 'b'. */
const STORAGE_KEY = 'dgskills:homepage-variant';

/**
 * Zet op `true` zodra variant B écht af is én er verkeer is om te verdelen.
 *
 * Zolang dit `false` is krijgt iedere gewone bezoeker variant A. Variant B is
 * dan alleen te zien door hem te forceren met `?variant=b`. Dat is bewust: een
 * halve variant tonen aan echte bezoekers is erger dan geen variant tonen, en
 * een verdeling over nul bezoekers levert sowieso niets op.
 */
export const VARIANT_B_READY = false;

function readForcedVariant(): HomepageVariant | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = new URLSearchParams(window.location.search).get('variant');
        const value = raw?.trim().toLowerCase();
        return value === 'a' || value === 'b' ? value : null;
    } catch {
        return null;
    }
}

function readStoredVariant(): HomepageVariant | null {
    if (typeof window === 'undefined') return null;
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        return value === 'a' || value === 'b' ? value : null;
    } catch {
        // Privémodus of geblokkeerde opslag: dan valt de keuze elk bezoek
        // opnieuw. Vervelend voor de meting, maar het mag de pagina niet breken.
        return null;
    }
}

function storeVariant(variant: HomepageVariant): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, variant);
    } catch {
        /* opslag geweigerd — negeren, zie readStoredVariant */
    }
}

/** 50/50, één trekking per bezoeker. */
function drawVariant(): HomepageVariant {
    return Math.random() < 0.5 ? 'a' : 'b';
}

export interface HomepageVariantChoice {
    variant: HomepageVariant;
    /** True wanneer de variant via `?variant=` is afgedwongen. Dan niet meten. */
    forced: boolean;
}

/**
 * Bepaalt welke homepage deze bezoeker krijgt.
 *
 * Volgorde: geforceerd via de URL → eerder toegewezen en onthouden → nieuwe
 * trekking. Zolang `VARIANT_B_READY` uit staat wordt er niet getrokken en niets
 * onthouden; iedereen krijgt A.
 */
export function resolveHomepageVariant(
    // `splitEnabled` bestaat zodat de verdeling te testen is zonder de
    // constante hierboven om te zetten. In de app wordt hij nooit meegegeven.
    { splitEnabled = VARIANT_B_READY }: { splitEnabled?: boolean } = {},
): HomepageVariantChoice {
    const forced = readForcedVariant();
    if (forced) {
        // Bewust niet opslaan: wie een variant forceert om te kijken, moet
        // daarna niet stilletjes in die variant blijven hangen.
        return { variant: forced, forced: true };
    }

    if (!splitEnabled) {
        return { variant: 'a', forced: false };
    }

    const stored = readStoredVariant();
    if (stored) {
        return { variant: stored, forced: false };
    }

    const drawn = drawVariant();
    storeVariant(drawn);
    return { variant: drawn, forced: false };
}
