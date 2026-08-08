/**
 * Zet een missiescore om naar een percentage voor `onComplete`.
 *
 * Opdrachten hebben uiteenlopende maxima (25 tot 100 punten), dus een absolute
 * score zegt zonder dat maximum niets en valt server-side niet te begrenzen.
 * Een percentage wel. Dit is het signaal dat de docent op het dashboard ziet.
 *
 * Geeft `undefined` terug als er geen zinnig maximum is; de server laat een
 * eerder vastgelegde score dan ongemoeid in plaats van er nul van te maken.
 */
export const toScorePercent = (total: number, maxScore: number): number | undefined => {
    if (!Number.isFinite(total) || !Number.isFinite(maxScore) || maxScore <= 0) {
        return undefined;
    }
    const pct = (total / maxScore) * 100;
    return Math.round(Math.min(100, Math.max(0, pct)));
};
