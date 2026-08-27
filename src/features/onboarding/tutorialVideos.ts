import manifest from './tutorialVideos.json';

/**
 * Welke instructievideo's er zijn en of ze getoond mogen worden.
 *
 * `tutorialVideos.json` wordt geschreven door `scripts/tutorial-video`. Deze
 * module staat los van de componenten zodat de app-shell kan opvragen óf er een
 * video is zonder de speler mee te laden — die blijft lui geladen.
 */

export interface TutorialVideo {
    titel: string;
    bestand: string;
    poster: string;
    ondertitels: string;
    durationSeconden: number;
    /** Poort: een stille proefversie wordt nooit aan een gebruiker aangeboden. */
    heeftStem: boolean;
}

export type TutorialVideoRol = 'student' | 'teacher';

export const videoVoorRol = (rol: TutorialVideoRol): TutorialVideo | null => {
    const kandidaat = (manifest as Record<string, TutorialVideo | undefined>)[rol];
    return kandidaat?.heeftStem ? kandidaat : null;
};
