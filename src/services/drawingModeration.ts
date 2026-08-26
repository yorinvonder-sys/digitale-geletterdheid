// Moderatie-detectie voor de AI-tekengame.
// Puur en dependency-vrij zodat de detectie los getest kan worden.

/** Label dat het beeldmodel teruggeeft bij een seksueel getinte, haatdragende of obscene tekening. */
export const DRAWING_MODERATION_LABEL = 'ONGEPAST';

/** Neutrale melding voor de leerling — geen schuldtoon, geen modelinhoud. */
export const DRAWING_MODERATION_NOTICE =
  'Deze tekening kan ik niet beoordelen. Kies een ander onderwerp en probeer het opnieuw.';

/** True wanneer een label het moderatievlaggetje is (hoofdletterongevoelig). */
export function isModerationLabel(label: unknown): boolean {
  return typeof label === 'string' && label.trim().toUpperCase() === DRAWING_MODERATION_LABEL;
}

/** Het resultaat dat de aanroeper krijgt bij moderatie: geen guesses, geen reasoning. */
export function createModeratedDrawingResult(): {
  guesses: { label: string; confidence: number }[];
  mainGuess: string;
  reasoning: string;
  moderated: true;
} {
  return { guesses: [], mainGuess: '', reasoning: '', moderated: true };
}

/**
 * True wanneer de serverrespons een moderatie-uitkomst is.
 * Kijkt naar het expliciete `moderated`-veld (nieuwe edge function) én naar het
 * ONGEPAST-label in mainGuess of guesses (vangnet zolang een oudere versie draait).
 */
export function isModeratedDrawingResult(payload: any): boolean {
  if (!payload || typeof payload !== 'object') return false;
  if (payload.moderated === true) return true;
  if (isModerationLabel(payload.mainGuess)) return true;
  if (!Array.isArray(payload.guesses)) return false;
  return payload.guesses.some((guess: any) => isModerationLabel(guess?.label));
}

/** Onder deze resttijd is opnieuw tekenen zinloos; dan schuift de ronde door. */
export const MODERATION_RETRY_MIN_SECONDS = 3;

/**
 * Hoeveel tekentijd een moderatie-retry teruggeeft: precies wat er bij het
 * inzenden nog over was. De klok mag nooit terug naar vol — anders kan een
 * leerling met opzettelijk geblokkeerde tekeningen één ronde eindeloos rekken
 * en is het 45-secondencontract van de missie waardeloos. Is de rest vrijwel
 * op (< MODERATION_RETRY_MIN_SECONDS), dan geeft dit 0 terug: de ronde
 * schuift dan zonder punten en zonder foutlabel door naar de volgende.
 */
export const moderationRetrySeconds = (remainingAtSubmit: number): number => {
    const remaining = Math.max(0, Math.floor(remainingAtSubmit));
    return remaining >= MODERATION_RETRY_MIN_SECONDS ? remaining : 0;
};
