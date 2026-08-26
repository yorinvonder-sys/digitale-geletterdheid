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
// Daarom krijgt elke poging een VOLGNUMMER en hangt alles daaraan:
//
//   * bij het starten van een opslag trekt de poging een nummer;
//   * na een geslaagde opslag leggen we dat nummer vast als "tot hier staat het
//     op de server";
//   * we bewaren alleen lokaal als het nummer niet ouder is dan dat merkteken;
//   * we wissen de wachtrij alleen als wat erin staat OUDER is dan deze poging.
//
// Nadrukkelijk GEEN Date.now(). De wandklok kan achteruit springen -- een
// NTP-correctie op een schoollaptop is genoeg -- en dan krijgt een latere poging
// een lager getal dan een eerdere. Dat is precies de omkering die deze wachtrij
// moet voorkomen, en die zou langs de achterdeur terugkomen. Een teller in
// dezelfde opslag loopt altijd vooruit en wordt door alle tabbladen gedeeld.
//
// Gelijkspel valt uit in het voordeel van het BEWAREN van werk: een overbodige
// hervezending is onschadelijk, een verdwenen alinea niet.

const PENDING_PREFIX = 'dgskills:pending-progress:';
/** Net onder de servergrens van 1 MiB; een halve kopie heeft geen waarde. */
const PENDING_MAX_BYTES = 1_000_000;

const pendingKey = (userId: string, missionId: string) =>
    `${PENDING_PREFIX}${userId}:${missionId}`;

/** Tot welk volgnummer het werk aantoonbaar op de server staat. */
const syncedKey = (userId: string, missionId: string) =>
    `${PENDING_PREFIX}synced:${userId}:${missionId}`;

/** De teller waaruit pogingen hun volgnummer trekken. */
const ticketKey = (userId: string, missionId: string) =>
    `${PENDING_PREFIX}ticket:${userId}:${missionId}`;

const readLastSynced = (userId: string, missionId: string): number => {
    try {
        return Number(opslag().getItem(syncedKey(userId, missionId))) || 0;
    } catch {
        return 0;
    }
};

/** Loopt alleen vooruit: een trage poging die als laatste binnenkomt mag het
 *  merkteken niet terugzetten naar een ouder nummer. */
const markSynced = (userId: string, missionId: string, ticket: number): void => {
    try {
        if (ticket <= readLastSynced(userId, missionId)) return;
        opslag().setItem(syncedKey(userId, missionId), String(ticket));
    } catch {
        // Zie stashPending.
    }
};

const readPendingEnvelope = (
    userId: string,
    missionId: string,
): { ticket: number; data: Record<string, any> } | null => {
    try {
        const raw = opslag().getItem(pendingKey(userId, missionId));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || !parsed.data) return null;
        return { ticket: Number(parsed.ticket) || 0, data: parsed.data };
    } catch {
        return null;
    }
};

/**
 * Trekt een volgnummer voor een nieuwe opslagpoging.
 *
 * Neemt het maximum van de teller, het merkteken en wat er in de wachtrij staat,
 * zodat het nummer ook klopt als een van die sleutels is opgeruimd. Twee
 * tabbladen die tegelijk trekken kunnen hetzelfde nummer krijgen; dat is precies
 * het gelijkspel dat hierboven in het voordeel van bewaren wordt beslecht.
 */
export const volgendTicket = (userId: string, missionId: string): number => {
    try {
        const teller = Number(opslag().getItem(ticketKey(userId, missionId))) || 0;
        const wachtend = readPendingEnvelope(userId, missionId)?.ticket ?? 0;
        const volgend = Math.max(teller, readLastSynced(userId, missionId), wachtend) + 1;
        opslag().setItem(ticketKey(userId, missionId), String(volgend));
        return volgend;
    } catch {
        // Zonder opslag doet de wachtrij toch niets; elk nummer voldoet.
        return 0;
    }
};

export const readPending = (userId: string, missionId: string): Record<string, any> | null =>
    readPendingEnvelope(userId, missionId)?.data ?? null;

/**
 * Bewaart werk dat de server niet haalde -- maar alleen als deze poging niet is
 * ingehaald door een nieuwere die het wél haalde, en alleen als er geen nieuwer
 * werk klaarstaat.
 */
export const stashPending = (
    userId: string,
    missionId: string,
    data: Record<string, any>,
    ticket: number,
): void => {
    // Strikt ouder, niet 'ouder of gelijk': bij gelijkspel bewaren we liever.
    if (ticket < readLastSynced(userId, missionId)) return;

    const bestaand = readPendingEnvelope(userId, missionId);
    if (bestaand && bestaand.ticket >= ticket) return;

    try {
        const raw = JSON.stringify({ ticket, data });
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
export const clearPending = (userId: string, missionId: string, ticket: number): void => {
    markSynced(userId, missionId, ticket);

    const bestaand = readPendingEnvelope(userId, missionId);
    if (bestaand && bestaand.ticket >= ticket) return;

    try {
        opslag().removeItem(pendingKey(userId, missionId));
    } catch {
        // Zie stashPending.
    }
};
