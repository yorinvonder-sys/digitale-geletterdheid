import React, { useCallback, useRef, useState } from 'react';

interface Props {
    /** Wordt aangeroepen met een genormaliseerde richting; (0,0) betekent stilstaan. */
    onRichting: (x: number, z: number) => void;
    /** Verbergt de stick wanneer de besturing niet actief is. */
    zichtbaar: boolean;
}

// Afmetingen van de stick: basis en knop.
const BASIS_GROOTTE = 112;
const KNOP_GROOTTE = 52;
const MAX_AFSTAND = (BASIS_GROOTTE - KNOP_GROOTTE) / 2;

/** Bewaart het huidige middelpunt van de basis in schermcoördinaten. */
interface Middelpunt {
    x: number;
    y: number;
}

export const TouchJoystick: React.FC<Props> = ({ onRichting, zichtbaar }) => {
    const basisRef = useRef<HTMLDivElement>(null);
    const middelpuntRef = useRef<Middelpunt>({ x: 0, y: 0 });
    const actiefPointerId = useRef<number | null>(null);
    const [knopOffset, setKnopOffset] = useState({ x: 0, y: 0 });
    const [sleept, setSleept] = useState(false);

    const stopSlepen = useCallback(() => {
        actiefPointerId.current = null;
        setSleept(false);
        setKnopOffset({ x: 0, y: 0 });
        onRichting(0, 0);
    }, [onRichting]);

    const werkPositieBij = useCallback(
        (clientX: number, clientY: number) => {
            const midden = middelpuntRef.current;
            let dx = clientX - midden.x;
            let dy = clientY - midden.y;
            const afstand = Math.hypot(dx, dy);

            // Knop blijft binnen de rand van de basis.
            if (afstand > MAX_AFSTAND) {
                const schaal = MAX_AFSTAND / afstand;
                dx *= schaal;
                dy *= schaal;
            }
            setKnopOffset({ x: dx, y: dy });

            // Richting normaliseren op maximaal 1; schermbeweging omlaag → speler vooruit (z).
            const genormaliseerdX = dx / MAX_AFSTAND;
            const genormaliseerdZ = dy / MAX_AFSTAND;
            onRichting(genormaliseerdX, genormaliseerdZ);
        },
        [onRichting],
    );

    const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        const basis = basisRef.current;
        if (!basis) return;

        const rect = basis.getBoundingClientRect();
        middelpuntRef.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };
        actiefPointerId.current = event.pointerId;
        setSleept(true);
        event.currentTarget.setPointerCapture(event.pointerId);
        werkPositieBij(event.clientX, event.clientY);
    }, [werkPositieBij]);

    const handlePointerMove = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (actiefPointerId.current !== event.pointerId) return;
            werkPositieBij(event.clientX, event.clientY);
        },
        [werkPositieBij],
    );

    const handlePointerEindigt = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (actiefPointerId.current !== event.pointerId) return;
            stopSlepen();
        },
        [stopSlepen],
    );

    if (!zichtbaar) return null;

    return (
        <div
            ref={basisRef}
            aria-hidden="true"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEindigt}
            onPointerCancel={handlePointerEindigt}
            onPointerLeave={handlePointerEindigt}
            className="fixed bottom-6 left-6 z-30 flex items-center justify-center rounded-full bg-duck-bgLight/60 border border-duck-gray/70 backdrop-blur-sm select-none touch-none"
            style={{ width: BASIS_GROOTTE, height: BASIS_GROOTTE }}
        >
            <div
                className={`rounded-full bg-duck-acid shadow-lg ${sleept ? '' : 'transition-transform duration-150 ease-out'}`}
                style={{
                    width: KNOP_GROOTTE,
                    height: KNOP_GROOTTE,
                    transform: `translate(${knopOffset.x}px, ${knopOffset.y}px)`,
                }}
            />
        </div>
    );
};
