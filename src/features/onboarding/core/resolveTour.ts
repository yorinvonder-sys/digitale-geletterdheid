/**
 * Bepaalt welke stappen deze gebruiker daadwerkelijk te zien krijgt.
 *
 * Niet elk scherm toont alles: de XP-balk staat alleen in de mobiele koptekst,
 * de leerlijnkiezer verschijnt pas bij meer dan één leerjaar, en herhalings-
 * opdrachten zijn er niet altijd. Zonder filtering krijgt de gebruiker daar een
 * uitleg over iets dat niet in beeld staat, plus een paar seconden wachten
 * voordat de rondleiding het opgeeft — en een teller die te hoog telt.
 *
 * Alleen stappen die NOOIT iets kunnen tonen worden weggelaten. Een stap die
 * eerst ergens naartoe navigeert (`beforeEnter`) blijft staan, want zijn doel
 * bestaat pas ná die navigatie; daarvoor is de wachtlus in de spotlight.
 *
 * Vrij van DOM en React zodat `node --test` dit kan draaien.
 */

export interface ResolvableStep {
    id: string;
    target: string | null;
    beforeEnter?: unknown;
}

/** `bestaat` beantwoordt: staat er nu een zichtbaar element voor deze selector? */
export const resolveTourSteps = <T extends ResolvableStep>(
    steps: readonly T[],
    bestaat: (selector: string) => boolean,
): T[] => steps.filter((step) => {
    if (step.target === null) return true;       // schermvullende stap
    if (step.beforeEnter) return true;           // doel verschijnt pas na navigatie
    return bestaat(step.target);
});
