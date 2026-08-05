/**
 * Kiest welk element de spotlight moet uitlichten wanneer één sleutel meerdere
 * keren in de DOM staat.
 *
 * Het dashboard rendert dezelfde knop twee keer: één keer in de mobiele header
 * (`lg:hidden`) en één keer in de desktopheader. `document.querySelector` pakt
 * altijd de eerste treffer in de DOM — op desktop dus de verborgen mobiele
 * versie. Die meet 0×0, waardoor de spotlight een leeg gaatje in de linkerbovenhoek
 * werd. Door op afmeting te kiezen werkt één sleutel op elk schermformaat, en is
 * een apart `data-tutorial-mobile`-attribuut niet meer nodig.
 *
 * Bewust vrij van DOM-typen zodat `node --test` deze module direct kan draaien.
 */

export interface TargetRect {
    width: number;
    height: number;
}

/** Index van het eerste element met oppervlak; -1 als er geen zichtbaar element is. */
export const pickVisibleIndex = (rects: readonly TargetRect[]): number => {
    for (let index = 0; index < rects.length; index += 1) {
        const rect = rects[index];
        if (rect && rect.width > 0 && rect.height > 0) return index;
    }
    return -1;
};
