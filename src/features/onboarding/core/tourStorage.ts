/**
 * Sleutelbeheer voor de rondleiding.
 *
 * Bewust vrij van React, DOM-globals en pad-aliassen, zodat `node --test` deze
 * module rechtstreeks via een relatief pad kan importeren.
 *
 * Achtergrond: de rondleiding onthield "al gezien" eerder in de gedeelde
 * localStorage-sleutel `student_tutorial_completed`, zonder gebruikers-id. Op
 * een gedeelde schoolcomputer erfde de volgende leerling die vlag en kreeg de
 * rondleiding dus nooit te zien. De serverwaarheid staat nu in
 * `users.stats.hasCompleted*Tutorial`; wat hier overblijft is uitsluitend een
 * vangnet binnen dezelfde sessie, gescheiden per gebruiker.
 */

export type TourId = 'student' | 'teacher';

/** Alles onder dit voorvoegsel wordt bij uitloggen gewist. */
export const TOUR_KEY_PREFIX = 'dgskills.tour.';

/** Zet de rondleiding uit voor screenshots en smoke tests. */
export const TOUR_DISABLED_KEY = `${TOUR_KEY_PREFIX}disabled`;

/** De deelverzameling van `Storage` die we gebruiken — maakt testen met een Map triviaal. */
export interface KeyValueStore {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}

/**
 * Sleutel per gebruiker én per rondleiding.
 *
 * Zonder het gebruikers-id erfde de volgende leerling op dezelfde computer de
 * vlag van de vorige — precies de bug die deze module oplost.
 */
export const tourSeenKey = (userId: string | null | undefined, tourId: TourId): string => {
    const owner = typeof userId === 'string' && userId.length > 0 ? userId : 'anoniem';
    return `${TOUR_KEY_PREFIX}seen.${owner}.${tourId}`;
};

/**
 * Opslag kan gooien (Safari privémodus, uitgeschakelde cookies). Een rondleiding
 * is nooit belangrijk genoeg om de app op te laten vallen, dus falen betekent
 * hier "niet gezien" en niet "crash".
 */
export const isTourSeen = (
    store: KeyValueStore | null | undefined,
    userId: string | null | undefined,
    tourId: TourId,
): boolean => {
    if (!store) return false;
    try {
        return store.getItem(tourSeenKey(userId, tourId)) === 'true';
    } catch {
        return false;
    }
};

export const markTourSeen = (
    store: KeyValueStore | null | undefined,
    userId: string | null | undefined,
    tourId: TourId,
): void => {
    if (!store) return;
    try {
        store.setItem(tourSeenKey(userId, tourId), 'true');
    } catch {
        /* opslag niet beschikbaar — de serverwaarheid in `stats` blijft leidend */
    }
};

/**
 * Uitschakelaar voor smoke tests en screenshotscripts: `?tour=off` in de URL of
 * de sleutel in localStorage. Vervangt het oude trucje waarbij scripts de
 * voltooiingsvlag zelf zetten — dat kan nu niet meer, want die staat op de server.
 */
export const isTourDisabled = (search: string, store: KeyValueStore | null | undefined): boolean => {
    if (search.includes('tour=off')) return true;
    if (!store) return false;
    try {
        return store.getItem(TOUR_DISABLED_KEY) === 'true';
    } catch {
        return false;
    }
};
