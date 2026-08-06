/**
 * Draaiboek voor de docentvideo. Zie ../beats/README.md voor de opbouw.
 *
 * De selectors zijn dezelfde `data-tutorial`-sleutels als de klikrondleiding
 * gebruikt; `tests/onboarding/tour-targets.test.ts` bewaakt dat ze blijven bestaan.
 */

export const rol = 'teacher';
export const scherm = 'teacher';
export const titel = 'DGSkills voor docenten';

const d = (sleutel) => `[data-tutorial="${sleutel}"]`;

export const beats = [
    {
        id: 'welkom',
        narration: 'Welkom. In een minuut zie je waar je klas staat, hoe je bijstuurt en waar je bewijs voor school vandaan komt.',
        pauzeNa: 600,
    },
    {
        id: 'vandaag',
        narration: 'Het tabblad Vandaag is je startscherm: hier zie je wie aandacht nodig heeft en waar de klas nu aan werkt.',
        action: async (s) => { await s.wijsAan(d('teacher-nav-overview')); },
    },
    {
        id: 'klasfilter',
        narration: 'Als je hier je klas kiest, volgt alles op dit scherm: cijfers, lijsten en exports.',
        action: async (s) => { await s.wijsAan(d('teacher-class-filter')); },
    },
    {
        id: 'aandacht',
        narration: 'Leerlingen die vastlopen of achterblijven staan bovenaan, zodat je niet zelf hoeft te zoeken.',
        action: async (s) => { await s.wijsAan(d('teacher-attention')); },
    },
    {
        id: 'missiekaart',
        narration: 'Per missie zie je hoeveel leerlingen gestart en klaar zijn, met de SLO-doelen die eronder zitten.',
        action: async (s) => { await s.wijsAan(d('teacher-mission-map')); },
    },
    {
        id: 'focusmodus',
        narration: 'Met de focusmodus zet je de hele klas op dezelfde opdracht; handig aan het begin van een les.',
        action: async (s) => { await s.wijsAan(d('teacher-focus-toggle')); },
    },
    {
        id: 'importeren',
        narration: 'Zet je klassenlijst in één keer klaar met een import; daarna kun je per leerling verder.',
        action: async (s) => {
            await s.klik(d('teacher-nav-students'));
            await s.wijsAan(d('teacher-students-import'));
        },
    },
    {
        id: 'bericht',
        narration: 'Stuur een bericht naar de hele klas of naar één leerling.',
        action: async (s) => { await s.wijsAan(d('teacher-students-message')); },
    },
    {
        id: 'bewijs',
        narration: 'Hier zie je voortgang, SLO-dekking en groei; dat is je onderbouwing richting school.',
        action: async (s) => {
            await s.klik(d('teacher-nav-progress'));
            await s.wijsAan(d('teacher-evidence-views'));
        },
    },
    {
        id: 'presentatie',
        narration: 'Hiermee open je het presentatiescherm met QR-code voor op het digibord.',
        action: async (s) => {
            await s.klik(d('teacher-nav-overview'));
            await s.wijsAan(d('teacher-presentation'));
        },
    },
    {
        id: 'accountmenu',
        narration: 'In dit menu vind je de rest: instellingen, missies aan- of uitzetten, de kennisbank en deze rondleiding.',
        action: async (s) => { await s.wijsAan(d('teacher-account-menu')); },
        pauzeNa: 900,
    },
];
