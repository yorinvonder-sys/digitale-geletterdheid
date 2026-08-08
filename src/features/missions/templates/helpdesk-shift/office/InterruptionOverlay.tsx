import React, { useEffect, useRef, useState } from 'react';
import { PhoneCall, Usb, UserRound } from 'lucide-react';
import type { Keuze, Onderbreking, OnderbrekingSoort } from './officeTypes';

interface Props {
    onderbreking: Onderbreking | null;
    onKies: (keuze: Keuze) => void;
}

/** Pictogram en kleuraccent per soort onderbreking. De vormgeving verklapt niets over veiligheid. */
const PRESENTATIE: Record<OnderbrekingSoort, { Icoon: typeof PhoneCall; accent: string; label: string }> = {
    telefoon: { Icoon: PhoneCall, accent: 'text-duck-error border-duck-error/40 bg-duck-error/10', label: 'Inkomend gesprek' },
    usb: { Icoon: Usb, accent: 'text-duck-ink border-duck-ink/40 bg-duck-ink/10', label: 'Gevonden voorwerp' },
    collega: { Icoon: UserRound, accent: 'text-duck-acid border-duck-acid/40 bg-duck-acid/10', label: 'Een collega staat naast je' },
};

export const InterruptionOverlay: React.FC<Props> = ({ onderbreking, onKies }) => {
    // Reactie op een keuze blijft zichtbaar tot het venster sluit; ook dat resetten we per onderbreking.
    const [gekozen, setGekozen] = useState<Keuze | null>(null);
    const kopRef = useRef<HTMLHeadingElement>(null);
    const venstersRef = useRef<HTMLDivElement>(null);
    // Voorkomt dat een dubbelklik dezelfde keuze twee keer laat tellen.
    const afgehandeldRef = useRef(false);

    useEffect(() => {
        if (onderbreking) {
            setGekozen(null);
            afgehandeldRef.current = false;
            // Focus naar de kop bij openen, zodat de onderbreking direct de aandacht pakt.
            kopRef.current?.focus();
        }
    }, [onderbreking]);

    // Houd de focus binnen het venster zolang het openstaat.
    useEffect(() => {
        if (!onderbreking) return;
        const venster = venstersRef.current;
        if (!venster) return;

        const opTab = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;
            const focusbaar = venster.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusbaar.length === 0) return;
            const eerste = focusbaar[0];
            const laatste = focusbaar[focusbaar.length - 1];
            if (event.shiftKey && document.activeElement === eerste) {
                event.preventDefault();
                laatste.focus();
            } else if (!event.shiftKey && document.activeElement === laatste) {
                event.preventDefault();
                eerste.focus();
            }
        };

        document.addEventListener('keydown', opTab);
        return () => document.removeEventListener('keydown', opTab);
    }, [onderbreking]);

    if (!onderbreking) return null;

    const presentatie = PRESENTATIE[onderbreking.soort];
    const { Icoon } = presentatie;

    const handleKies = (keuze: Keuze) => {
        // Eén klik telt, ook bij dubbelklikken op dezelfde of een andere knop.
        if (afgehandeldRef.current) return;
        afgehandeldRef.current = true;
        setGekozen(keuze);
        onKies(keuze);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-duck-ink/70 p-4"
            data-qa="helpdesk-onderbreking"
        >
            <div
                ref={venstersRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="onderbreking-aanhef"
                className="w-full max-w-sm rounded-2xl border border-duck-gray bg-duck-bgLight p-5 shadow-xl"
            >
                <div className={`mb-4 flex items-center gap-3 rounded-xl border px-3 py-2 ${presentatie.accent}`}>
                    <Icoon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold">{presentatie.label}</span>
                </div>

                <h2
                    ref={kopRef}
                    id="onderbreking-aanhef"
                    tabIndex={-1}
                    className="mb-2 text-lg font-bold text-duck-ink outline-none"
                >
                    {onderbreking.aanhef}
                </h2>

                <div className="mb-4 space-y-2 text-sm text-duck-ink/80">
                    {onderbreking.tekst.map((regel, index) => (
                        <p key={index}>{regel}</p>
                    ))}
                </div>

                {gekozen ? (
                    <p className="rounded-xl bg-duck-bg px-3 py-3 text-sm text-duck-ink" role="status">
                        {gekozen.reactie}
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {onderbreking.keuzes.map((keuze) => (
                            <button
                                key={keuze.id}
                                type="button"
                                onClick={() => handleKies(keuze)}
                                className="min-h-[44px] rounded-xl border border-duck-gray bg-duck-bg px-4 py-3 text-left text-sm font-medium text-duck-ink transition hover:bg-duck-gray/30 focus:outline-none focus:ring-2 focus:ring-duck-acid"
                                data-qa="helpdesk-onderbreking-keuze"
                                data-keuze-id={keuze.id}
                            >
                                {keuze.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
