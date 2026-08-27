/**
 * Waar de uitlegballon komt te staan ten opzichte van het uitgelichte element.
 *
 * Levert de linkerbovenhoek van de ballon, niet een middelpunt met een
 * `translate(-50%)`. Dat is bewust: de ballon is een framer-motion-element, en
 * framer schrijft zelf de `transform`-eigenschap. Een `translateX(-50%)` uit een
 * inline style werd daardoor stilletjes overschreven, waardoor de begrenzing op
 * de vensterrand niet klopte en de ballon bij een knop rechtsboven half buiten
 * beeld viel.
 *
 * Vrij van DOM en React zodat `node --test` de randgevallen kan vastleggen.
 */

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface Size {
    width: number;
    height: number;
}

/** Linkerbovenhoek van de ballon, in vensterco:rdinaten. */
export interface TooltipStyle {
    top: number;
    left: number;
}

/** Afstand tussen het uitgelichte element en de ballon. */
export const TOOLTIP_GAP = 12;
/** Minimale ruimte tussen de ballon en de vensterrand. */
export const VIEWPORT_MARGIN = 12;

/**
 * Houdt de ballon binnen het venster. Past hij sowieso niet (venster smaller of
 * lager dan de ballon), dan centreren we hem; half zichtbaar is beter dan
 * volledig weggeschoven.
 */
const clampToViewport = (start: number, extent: number, available: number): number => {
    const max = available - VIEWPORT_MARGIN - extent;
    if (max < VIEWPORT_MARGIN) return Math.max(0, (available - extent) / 2);
    return Math.min(Math.max(start, VIEWPORT_MARGIN), max);
};

export const computeTooltipStyle = (
    rect: Rect,
    placement: Placement,
    viewport: Size,
    tooltip: Size,
): TooltipStyle => {
    if (placement === 'left' || placement === 'right') {
        const gewensteLinks = placement === 'left'
            ? rect.left - TOOLTIP_GAP - tooltip.width
            : rect.left + rect.width + TOOLTIP_GAP;
        return {
            left: clampToViewport(gewensteLinks, tooltip.width, viewport.width),
            top: clampToViewport(rect.top + rect.height / 2 - tooltip.height / 2, tooltip.height, viewport.height),
        };
    }

    const onder = rect.top + rect.height + TOOLTIP_GAP;
    const boven = rect.top - TOOLTIP_GAP - tooltip.height;
    const ondersteRand = viewport.height - VIEWPORT_MARGIN - tooltip.height;

    // Kantel naar de andere kant zodra de voorkeurskant niet past.
    let top = placement === 'bottom' ? onder : boven;
    if (placement === 'bottom' && onder > ondersteRand) top = boven;
    if (placement === 'top' && boven < VIEWPORT_MARGIN) top = onder;

    return {
        left: clampToViewport(rect.left + rect.width / 2 - tooltip.width / 2, tooltip.width, viewport.width),
        top: clampToViewport(top, tooltip.height, viewport.height),
    };
};
