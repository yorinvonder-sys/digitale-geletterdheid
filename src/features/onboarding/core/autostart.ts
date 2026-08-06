/**
 * Beslist of de rondleiding vanzelf mag starten.
 *
 * Bewust een losse pure functie: het startmoment is de plek waar deze feature
 * eerder stukging (docenten kregen hem nooit, de marketingsite kreeg hem juist
 * wel), en dat wil je in een test kunnen vastleggen zonder browser.
 */

export interface AutoStartInput {
    /** Wil de host überhaupt automatisch starten? */
    enabled: boolean;
    /** Serverwaarheid uit `users.stats` — al eens afgerond? */
    completed: boolean;
    /** Vangnet binnen dezelfde sessie, voor als de opslag naar de server faalde. */
    seenThisSession: boolean;
    /** Uitschakelaar voor smoke tests en screenshots. */
    disabled: boolean;
    /** Zijn alle blokkerende schermen (wachtwoord, MFA, wizard, missie, modal) voorbij? */
    ready: boolean;
    /** Publieke demo of marketingpreview — daar hoort nooit een rondleiding te starten. */
    isDemo: boolean;
}

export const shouldAutoStart = (input: AutoStartInput): boolean =>
    input.enabled
    && input.ready
    && !input.completed
    && !input.seenThisSession
    && !input.disabled
    && !input.isDemo;
