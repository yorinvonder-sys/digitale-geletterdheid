import { useCallback, useEffect, useRef, useState } from 'react';

/** Genormaliseerde bewegingsvector, of nul als er niets gebeurt. */
interface Richting {
    x: number;
    z: number;
}

const NUL_RICHTING: Richting = { x: 0, z: 0 };

/** Toetsen die naar een vector-as wijzen. WASD en pijltjes werken allebei. */
const TOETS_ASSEN: Record<string, { as: 'x' | 'z'; teken: 1 | -1 }> = {
    KeyW: { as: 'z', teken: -1 },
    ArrowUp: { as: 'z', teken: -1 },
    KeyS: { as: 'z', teken: 1 },
    ArrowDown: { as: 'z', teken: 1 },
    KeyA: { as: 'x', teken: -1 },
    ArrowLeft: { as: 'x', teken: -1 },
    KeyD: { as: 'x', teken: 1 },
    ArrowRight: { as: 'x', teken: 1 },
};

/** Alleen de pijltjestoetsen mogen de pagina laten scrollen blokkeren. */
const PIJLTJES = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

/** Genormaliseerde vector, of de nul-vector als de lengte nul is. */
function normaliseer(v: Richting): Richting {
    const lengte = Math.hypot(v.x, v.z);
    if (lengte === 0) return NUL_RICHTING;
    return { x: v.x / lengte, z: v.z / lengte };
}

/**
 * Combineert toetsenbord en joystick tot één bewegingsrichting.
 *
 * Toetsenbord: WASD + pijltjes, meerdere toetsen tegelijk geven diagonaal
 * lopen. Joystick komt van een los tekencomponent binnen via `zetJoystick`.
 * Wat het sterkst uitslaat wint — de twee worden niet opgeteld.
 */
export function useMovement(opts: { actief: boolean }): {
    richting: { x: number; z: number };
    zetJoystick: (x: number, z: number) => void;
} {
    const { actief } = opts;
    const ingedrukt = useRef<Set<string>>(new Set());
    const joystick = useRef<Richting>(NUL_RICHTING);
    const [richting, setRichting] = useState<Richting>(NUL_RICHTING);

    const herbereken = useCallback(() => {
        if (!actief) {
            setRichting(NUL_RICHTING);
            return;
        }
        let toetsX = 0;
        let toetsZ = 0;
        for (const code of ingedrukt.current) {
            const as = TOETS_ASSEN[code];
            if (!as) continue;
            if (as.as === 'x') toetsX += as.teken;
            else toetsZ += as.teken;
        }
        const toetsenbord = normaliseer({ x: toetsX, z: toetsZ });
        const stick = joystick.current;
        const toetsenbordSterkte = Math.hypot(toetsenbord.x, toetsenbord.z);
        const stickSterkte = Math.hypot(stick.x, stick.z);
        setRichting(stickSterkte > toetsenbordSterkte ? stick : toetsenbord);
    }, [actief]);

    const zetJoystick = useCallback(
        (x: number, z: number) => {
            joystick.current = { x, z };
            herbereken();
        },
        [herbereken]
    );

    useEffect(() => {
        if (!actief) {
            ingedrukt.current.clear();
            joystick.current = NUL_RICHTING;
            setRichting(NUL_RICHTING);
            return;
        }

        const opToetsIndrukken = (e: KeyboardEvent) => {
            if (PIJLTJES.has(e.code)) e.preventDefault();
            if (!TOETS_ASSEN[e.code]) return;
            ingedrukt.current.add(e.code);
            herbereken();
        };
        const opToetsLoslaten = (e: KeyboardEvent) => {
            if (PIJLTJES.has(e.code)) e.preventDefault();
            ingedrukt.current.delete(e.code);
            herbereken();
        };
        const opFocusVerlies = () => {
            ingedrukt.current.clear();
            joystick.current = NUL_RICHTING;
            setRichting(NUL_RICHTING);
        };

        window.addEventListener('keydown', opToetsIndrukken);
        window.addEventListener('keyup', opToetsLoslaten);
        window.addEventListener('blur', opFocusVerlies);

        return () => {
            window.removeEventListener('keydown', opToetsIndrukken);
            window.removeEventListener('keyup', opToetsLoslaten);
            window.removeEventListener('blur', opFocusVerlies);
        };
    }, [actief, herbereken]);

    return { richting, zetJoystick };
}
