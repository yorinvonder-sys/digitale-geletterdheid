/**
 * Draaiboek voor de leerlingvideo. Zie ../beats/README.md voor de opbouw.
 *
 * Toon: gewone spreektaal voor 12 tot 15 jaar. Kort houden — na een minuut is
 * een instructievideo op deze leeftijd klaar met je.
 */

export const rol = 'student';
export const scherm = 'dashboard';
export const titel = 'DGSkills voor leerlingen';

const d = (sleutel) => `[data-tutorial="${sleutel}"]`;

export const beats = [
    {
        id: 'welkom',
        narration: 'Welkom bij Project DG. We leggen even uit hoe dit werkt: hier staan je missies, XP en trofeeën.',
        pauzeNa: 600,
    },
    {
        id: 'missies',
        narration: 'Dit zijn je opdrachten. Elke missie levert XP op en brengt je naar een nieuw level.',
        action: async (s) => { await s.wijsAan(d('student-main-missions')); },
    },
    {
        id: 'periode',
        narration: 'Hiermee ga je naar een andere periode. Handig om terug te kijken wat je al gedaan hebt.',
        action: async (s) => { await s.wijsAan(d('student-period')); },
    },
    {
        id: 'leerlijn',
        narration: 'Zit je in meerdere leerjaren? Hier kies je welke leerlijn je nu volgt.',
        action: async (s) => { await s.wijsAan(d('student-yearline')); },
    },
    {
        id: 'portfolio',
        narration: 'Hier vind je jouw profiel, je trofeeën en de winkel waar je XP kunt uitgeven.',
        action: async (s) => { await s.wijsAan(d('student-profile-btn')); },
    },
    {
        id: 'feedback',
        narration: 'Werkt er iets niet, of heb je een idee? Laat het hier weten.',
        action: async (s) => { await s.wijsAan(d('student-feedback-btn')); },
    },
    {
        id: 'eerste-missie',
        narration: 'Klaar? Klik op deze opdracht en start je eerste missie.',
        action: async (s) => { await s.wijsAan(d('student-first-mission')); },
    },
    {
        id: 'afsluiting',
        narration: 'Meer hoef je niet te weten. Kies een missie en ga van start.',
        action: async (s) => { await s.ringWeg(); await s.scrollNaar(d('student-main-missions')); },
        pauzeNa: 900,
    },
];
