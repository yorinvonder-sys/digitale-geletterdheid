import React from 'react';

const FONT = "'Outfit', system-ui, sans-serif";

interface Props {
    /** De handeling in de gebiedende wijs: "Sleep de mails op volgorde". */
    action: string;
    /** Optionele tweede regel: bediening, alternatief of vuistregel. */
    hint?: string;
    /** Pictogram dat de handeling ondersteunt. */
    icon: string;
}

/**
 * De opdrachtregel van een ronde, prominent in beeld.
 *
 * De speelse rondes zetten de instructie eerder in een klein, hoofdletterig
 * regeltje boven de opgave. Leerlingen lazen daar overheen en wisten niet wat
 * er van hen werd verwacht — precies het probleem dat een spelvorm juist zou
 * moeten oplossen. De handeling staat daarom nu in een eigen balk, in
 * leesbare tekstgrootte, direct boven het speelveld.
 */
export const RoundInstruction: React.FC<Props> = ({ action, hint, icon }) => (
    <div className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-duck-ink bg-duck-acid/20 px-4 py-3">
        <span aria-hidden="true" className="shrink-0 text-xl leading-none">
            {icon}
        </span>
        <div className="min-w-0">
            <p className="text-sm font-black text-duck-ink" style={{ fontFamily: FONT }}>
                {action}
            </p>
            {hint && (
                <p className="mt-0.5 text-xs text-duck-ink/70" style={{ fontFamily: FONT }}>
                    {hint}
                </p>
            )}
        </div>
    </div>
);
