import React from 'react';

/**
 * Variant B van de homepage — nog niet gebouwd.
 *
 * Dit is met opzet een lege huls: stap 1 uit
 * `docs/marketing/homepage-ab-test-opzet.md` levert de variantmechaniek, stap 2
 * de pagina zelf. Door de huls nu al te plaatsen is de mechaniek te
 * controleren zonder dat er een half ontwerp klaarstaat dat per ongeluk live
 * kan gaan.
 *
 * Echte bezoekers komen hier niet: zolang `VARIANT_B_READY` uit staat is deze
 * pagina alleen bereikbaar via `?variant=b`.
 */
export function VersieBPage() {
    return (
        <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-duck-bg px-6 text-center text-duck-ink">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-duck-ink/50">
                Variant B
            </p>
            <h1 className="max-w-xl font-display text-3xl font-black leading-tight md:text-4xl">
                Deze variant is nog niet gebouwd
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-duck-ink/70">
                De variantmechaniek werkt — je ziet deze pagina omdat je
                <code className="mx-1 rounded bg-duck-ink/10 px-1.5 py-0.5">?variant=b</code>
                hebt meegegeven. De inhoud volgt in stap 2 van de A/B-opzet.
            </p>
            <a
                href="/?variant=a"
                className="mt-2 inline-flex min-h-[44px] items-center rounded-full border-[3px] border-duck-ink px-6 py-3 text-sm font-bold text-duck-ink transition-transform hover:-translate-y-0.5"
            >
                Terug naar variant A
            </a>
        </div>
    );
}
