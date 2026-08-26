/**
 * Pure afleverlogica voor de docentmelding bij een welzijnssignaal. Bewust
 * React-vrij en met injecteerbare `send` en klok, zodat contracttests het
 * concurrency- en foutgedrag uitvoerbaar kunnen bewijzen
 * (tests/wellbeing-alert-delivery-contract.test.ts). De React-hook
 * useWellbeingTeacherAlert is een dunne wrapper hieromheen.
 *
 * Gedragscontract:
 * - Per categorie loopt maximaal één verzoek tegelijk (geen dubbele meldingen
 *   door twee snelle treffers).
 * - Een bevestigde aflevering dekt nieuwe treffers van dezelfde categorie
 *   binnen het dedup-venster; andere categorieën krijgen een eigen melding.
 * - Bevestiging gebeurt uitsluitend nadat `send` aantoonbaar is geslaagd; een
 *   fout bevestigt nooit iets.
 * - Komt er tijdens een lopend verzoek een nieuwe treffer van dezelfde
 *   categorie binnen en faalt dat verzoek, dan volgt precies één seriële
 *   vervolgpoging — een reëel signaal gaat niet stilletjes verloren, maar er
 *   ontstaat ook geen onbegrensde retry-storm.
 */
export function createWellbeingAlertDelivery(options: {
    /** Verstuurt de melding; hoort te rejecten bij elke niet-bevestigde aflevering. */
    send: (category: string, timestamp: string) => Promise<void>;
    /** Wordt aangeroepen zodra een aflevering bevestigd is (voor UI-updates). */
    onConfirmed?: () => void;
    now?: () => number;
    dedupWindowMs?: number;
}): {
    deliver: (category: string, timestamp: string) => Promise<void>;
    notifiedFor: (category: string | undefined) => boolean;
} {
    const now = options.now ?? Date.now;
    const dedupWindowMs = options.dedupWindowMs ?? 60_000;
    const confirmedAt: Record<string, number> = {};
    const pending = new Set<string>();
    const queued = new Set<string>();

    const isConfirmed = (category: string): boolean =>
        confirmedAt[category] !== undefined && now() - confirmedAt[category] < dedupWindowMs;

    async function deliver(category: string, timestamp: string): Promise<void> {
        if (isConfirmed(category)) return;
        if (pending.has(category)) {
            // Onthoud de treffer: faalt het lopende verzoek, dan volgt hieronder
            // één vervolgpoging; slaagt het, dan dekt die aflevering ook deze.
            queued.add(category);
            return;
        }
        pending.add(category);
        try {
            let attempts = 0;
            while (attempts < 2) {
                attempts++;
                try {
                    await options.send(category, timestamp);
                    confirmedAt[category] = now();
                    queued.delete(category);
                    options.onConfirmed?.();
                    return;
                } catch {
                    // send logt zelf; hier alleen beslissen of een gewachte
                    // treffer nog één seriële poging verdient.
                    if (!queued.has(category)) return;
                    queued.delete(category);
                }
            }
        } finally {
            pending.delete(category);
        }
    }

    return {
        deliver,
        notifiedFor: (category) => Boolean(category && isConfirmed(category)),
    };
}
