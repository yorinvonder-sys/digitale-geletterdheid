import { useEffect, type RefObject } from 'react';

/**
 * Houdt de toetsenbordfocus binnen een element zolang het open is.
 *
 * De codebase had hier niets voor: modals zetten de focus één keer op het eerste
 * element en laten Tab daarna gewoon doorlopen naar de pagina erachter. Voor de
 * rondleiding is dat extra vervelend, want die ligt over de hele app heen — je
 * tabt dan onzichtbaar door knoppen die je niet kunt zien.
 *
 * Bewust géén `inert` of `aria-hidden` op de rest van de pagina: de rondleiding
 * heeft juist een klikbaar gat naar het uitgelichte element, en dat zou daarmee
 * onbereikbaar worden.
 */
const FOCUSBAAR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

export const useFocusTrap = (ref: RefObject<HTMLElement | null>, actief: boolean): void => {
    useEffect(() => {
        if (!actief) return;
        const container = ref.current;
        if (!container) return;

        const vorigeFocus = document.activeElement as HTMLElement | null;

        const focusbareElementen = (): HTMLElement[] =>
            Array.from(container.querySelectorAll<HTMLElement>(FOCUSBAAR))
                .filter((el) => {
                    const r = el.getBoundingClientRect();
                    return r.width > 0 && r.height > 0;
                });

        // Focus naar binnen halen, zonder de pagina te laten verspringen.
        const eerste = focusbareElementen()[0] ?? container;
        eerste.focus({ preventScroll: true });

        const opKeydown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;
            const elementen = focusbareElementen();
            if (elementen.length === 0) {
                event.preventDefault();
                return;
            }
            const eersteEl = elementen[0];
            const laatsteEl = elementen[elementen.length - 1];
            const actiefEl = document.activeElement;

            if (event.shiftKey && (actiefEl === eersteEl || !container.contains(actiefEl))) {
                event.preventDefault();
                laatsteEl.focus({ preventScroll: true });
            } else if (!event.shiftKey && (actiefEl === laatsteEl || !container.contains(actiefEl))) {
                event.preventDefault();
                eersteEl.focus({ preventScroll: true });
            }
        };

        document.addEventListener('keydown', opKeydown, true);
        return () => {
            document.removeEventListener('keydown', opKeydown, true);
            // Alleen terugzetten als die plek er nog is.
            if (vorigeFocus && document.contains(vorigeFocus)) {
                vorigeFocus.focus({ preventScroll: true });
            }
        };
    }, [ref, actief]);
};
