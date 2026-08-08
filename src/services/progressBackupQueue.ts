/**
 * Wachtrij voor leerlingwerk dat de server niet haalde.
 *
 * Apart van missionService zodat de raceconditie die hierin wordt afgevangen
 * ook echt getest kan worden -- met een nagemaakte opslag, zonder netwerk.
 */

/** Indirectie zodat een test een eigen opslag kan neerzetten. */
const opslag = (): Storage => globalThis.localStorage;

// ─── Lokale reservekopie ──────────────────────────────────────────────────────
//
// De sjabloon-opdrachten bewaren hun voortgang al lokaal via useMissionAutoSave.
// De vier AI Lab-werkbanken (game-programmeur, verhalen-ontwerper,
// logica-legende, ai-trainer) doen dat niet: die slaan alleen naar de server op.
// Valt het netwerk weg, dan is het werk bij een herlaad weg.
//
// Belangrijk: dit is een WACHTRIJ, geen tweede waarheid. Er staat alleen werk in
// dat de server nooit heeft bereikt.
//
// Dat klinkt vanzelfsprekend, maar is het niet. De autosave vuurt af zonder op
// het antwoord te wachten, dus twee opslagpogingen kunnen elkaar inhalen: een
// oudere die traag is en een nieuwere die er langs schiet. Slaagt de nieuwe en
// faalt daarna pas de oude, dan zou een naïeve wachtrij het OUDE werk bewaren en
// later over het nieuwere heen zetten. Precies bij een haperende verbinding --
// waar deze reservekopie voor bedoeld is. Twee tabbladen delen bovendien
// dezelfde lokale opslag, dus dat kan ook tussen tabbladen door.
//
// Daarom hangt alles aan tijdstempels in plaats van aan volgorde:
//
//   * bij het STARTEN van een opslag onthouden we het tijdstip;
//   * na een GESLAAGDE opslag leggen we dat tijdstip vast als "tot hier staat
//     het op de server";
//   * we bewaren alleen lokaal als de poging NA dat tijdstip begon;
//   * we wissen de wachtrij alleen als wat erin staat OUDER is dan deze poging.
//
// Beide regels werken ook tussen tabbladen, omdat het merkteken in dezelfde
// lokale opslag staat en beide tabbladen dezelfde klok gebruiken.

const PENDING_PREFIX = 'dgskills:pending-progress:';
/** Net onder de servergrens van 1 MiB; een halve kopie heeft geen waarde. */
const PENDING_MAX_BYTES = 1_000_000;

const pendingKey = (userId: string, missionId: string) =>
    `${PENDING_PREFIX}${userId}:${missionId}`;

/** Tot welk moment het werk aantoonbaar op de server staat. */
const syncedKey = (userId: string, missionId: string) =>
    `${PENDING_PREFIX}synced:${userId}:${missionId}`;

const readLastSynced = (userId: string, missionId: string): number => {
    try {
        return Number(opslag().getItem(syncedKey(userId, missionId))) || 0;
    } catch {
        return 0;
    }
};

/** Loopt alleen vooruit: een trage poging die als laatste binnenkomt mag het
 *  merkteken niet terugzetten naar een ouder moment. */
const markSynced = (userId: string, missionId: string, at: number): void => {
    try {
        if (at <= readLastSynced(userId, missionId)) return;
        opslag().setItem(syncedKey(userId, missionId), String(at));
    } catch {
        // Zie stashPending.
    }
};

const readPendingEnvelope = (
    userId: string,
    missionId: string,
): { savedAt: number; data: Record<string, any> } | null => {
    try {
        const raw = opslag().getItem(pendingKey(userId, missionId));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || !parsed.data) return null;
        return { savedAt: Number(parsed.savedAt) || 0, data: parsed.data };
    } catch {
        return null;
    }
};

export const readPending = (userId: string, missionId: string): Record<string, any> | null =>
    readPendingEnvelope(userId, missionId)?.data ?? null;

/**
 * Bewaart werk dat de server niet haalde -- maar alleen als deze poging begon
 * nadat er voor het laatst iets aantoonbaar is opgeslagen. Een trage poging die
 * door een nieuwere is ingehaald, hoort niet meer in de wachtrij.
 */
export const stashPending = (
    userId: string,
    missionId: string,
    data: Record<string, any>,
    startedAt: number,
): void => {
    if (startedAt <= readLastSynced(userId, missionId)) return;

    const bestaand = readPendingEnvelope(userId, missionId);
    if (bestaand && bestaand.savedAt > startedAt) return;

    try {
        const raw = JSON.stringify({ savedAt: startedAt, data });
        if (raw.length > PENDING_MAX_BYTES) return;
        opslag().setItem(pendingKey(userId, missionId), raw);
    } catch {
        // Opslag vol of geblokkeerd (privémodus). Dan is er geen reservekopie,
        // maar de opdracht mag daar niet op omvallen.
    }
};

/**
 * Ruimt de wachtrij op na een geslaagde opslag -- maar laat werk staan dat
 * NIEUWER is dan deze poging. Anders wist een trage poging die als laatste
 * binnenkomt het werk dat een latere poging net had veiliggesteld.
 */
export const clearPending = (userId: string, missionId: string, startedAt: number): void => {
    markSynced(userId, missionId, startedAt);

    const bestaand = readPendingEnvelope(userId, missionId);
    if (bestaand && bestaand.savedAt > startedAt) return;

    try {
        opslag().removeItem(pendingKey(userId, missionId));
    } catch {
        // Zie stashPending.
    }
};

