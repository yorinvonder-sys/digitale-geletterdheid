import React, { useId, useState } from 'react';
import { HARD_SHADOW } from './storyBrand';

export interface AccordionItem {
    q: string;
    a: string;
    /** Optioneel label, bijv. "Docenten" of "ICT & privacy". */
    role?: string;
}

/**
 * Accordeon voor de FAQ in hoofdstuk 5. Bewust native gebouwd (button +
 * aria-expanded, paneel via `hidden`) in plaats van via Radix, zodat de
 * publieke bundel geen extra dependency krijgt.
 */
export function Accordion({ items, dark = false }: { items: AccordionItem[]; dark?: boolean }) {
    const [open, setOpen] = useState<number | null>(0);
    const baseId = useId();

    return (
        <div className="space-y-3">
            {items.map((item, i) => {
                const isOpen = open === i;
                const buttonId = `${baseId}-btn-${i}`;
                const panelId = `${baseId}-panel-${i}`;

                return (
                    <div
                        key={item.q}
                        className={`overflow-hidden rounded-2xl border-[3px] transition-shadow ${
                            dark
                                ? 'border-duck-bg/20 bg-duck-ink'
                                : `border-duck-ink bg-white ${isOpen ? HARD_SHADOW : ''}`
                        }`}
                    >
                        <h3>
                            <button
                                type="button"
                                id={buttonId}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpen(isOpen ? null : i)}
                                className={`flex min-h-[44px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold transition-colors ${
                                    dark
                                        ? 'text-duck-bg hover:bg-duck-bg/5'
                                        : 'text-duck-ink hover:bg-duck-acid/20'
                                }`}
                            >
                                <span className="flex flex-wrap items-center gap-2.5">
                                    {item.role && (
                                        <span
                                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                                                dark
                                                    ? 'border-duck-acid/60 text-duck-acid'
                                                    : 'border-duck-ink/40 text-duck-ink/70'
                                            }`}
                                        >
                                            {item.role}
                                        </span>
                                    )}
                                    <span className="text-sm md:text-base">{item.q}</span>
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-lg leading-none transition-transform duration-300 ${
                                        dark ? 'border-duck-bg/40' : 'border-duck-ink'
                                    } ${
                                        isOpen
                                            ? 'rotate-45 bg-duck-acid text-duck-ink'
                                            : dark
                                                ? 'bg-transparent text-duck-bg'
                                                : 'bg-duck-bg'
                                    }`}
                                >
                                    +
                                </span>
                            </button>
                        </h3>
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            hidden={!isOpen}
                            className={`border-t-2 px-5 py-4 text-sm leading-relaxed ${
                                dark
                                    ? 'border-duck-bg/15 text-duck-bg/70'
                                    : 'border-duck-ink/10 text-duck-ink/75'
                            }`}
                        >
                            {item.a}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
