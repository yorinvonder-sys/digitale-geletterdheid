/**
 * De scèneduren in seconden — de enige bron. `Film.tsx` bouwt zijn SCENES
 * hiermee op, zodat de render-sleutels hieronder niet uit de pas kunnen lopen
 * met de werkelijke scènegrenzen. Stonden deze getallen op twee plekken, dan
 * zou één aanpassing de getypte tekst op het verkeerde moment laten beginnen
 * zonder dat er iets zichtbaar breekt.
 */
export const LEADER_DURATION = 1;
export const FRUSTRATION_DURATION = 10;
export const PUZZLE_DURATION = 9;
export const ANSWER_DURATION = 10;
export const PROOF_DURATION = 10;
export const REWARD_DURATION = 9;

const LEADER_FPS = 24;

export const FRUSTRATION_LINES = [
    {
        from: 0.8,
        text: '“Jayden kan geen bestand bijvoegen in een e-mail.”',
        speed: 38,
    },
    {
        from: 2.8,
        text: '“Herkent geen nepnieuws als het hem bijt.”',
        speed: 38,
    },
    {
        from: 4.6,
        text: '“Vraagt hoe je een pdf opslaat.”',
        speed: 38,
    },
] as const;

function typedCharactersAt(t: number, from: number, speed: number, length: number) {
    return Math.min(length, Math.max(0, Math.floor((t - from) * speed)));
}

function crossedThresholds(t: number, thresholds: readonly number[]) {
    let crossed = 0;
    while (crossed < thresholds.length && t > thresholds[crossed]) crossed += 1;
    return crossed;
}

/**
 * Geeft alleen een nieuwe sleutel wanneer React werkelijk andere scène-inhoud
 * moet tekenen. De rAF-klok en voortgangsbalk mogen veel vaker bijwerken.
 */
export function getFilmRenderKey(elapsed: number): string {
    let localT = Math.max(0, elapsed);

    if (localT < LEADER_DURATION) {
        return `leader:${Math.floor(localT * LEADER_FPS)}`;
    }

    localT -= LEADER_DURATION;
    if (localT < FRUSTRATION_DURATION) {
        const typed = FRUSTRATION_LINES.map(({ from, speed, text }) =>
            typedCharactersAt(localT, from, speed, text.length),
        );
        return `frustratie:${typed.join(':')}:${localT > 6.8 ? 1 : 0}`;
    }

    localT -= FRUSTRATION_DURATION;
    if (localT < PUZZLE_DURATION) {
        return `raadsel:${crossedThresholds(localT, [0.3, 1.3, 1.6, 3.2, 5.8])}`;
    }

    localT -= PUZZLE_DURATION;
    if (localT < ANSWER_DURATION) {
        return `antwoord:${crossedThresholds(localT, [0.4, 0.9, 1.6, 2.6, 5.2, 7.2])}`;
    }

    localT -= ANSWER_DURATION;
    if (localT < PROOF_DURATION) {
        return `bewijs:${crossedThresholds(localT, [2.4, 3.2, 6.4])}`;
    }

    localT -= PROOF_DURATION;
    if (localT < REWARD_DURATION) {
        return `beloning:${crossedThresholds(localT, [2.8, 3.6, 5.4, 6.2])}`;
    }

    return 'done';
}
