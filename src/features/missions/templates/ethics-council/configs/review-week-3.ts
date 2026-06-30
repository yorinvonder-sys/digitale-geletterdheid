import type { EthicsCouncilConfig } from '../EthicsCouncil';

const config: EthicsCouncilConfig = {
    missionId: 'review-week-3',
    title: 'De Ethische Raad',
    introEmoji: '⚖️',
    introTitle: 'De Ethische Raad',
    introDescription:
        'Je hebt je project gemaakt en gelanceerd. Nu stelt de Ethische Raad de vraag die er écht toe doet: mag jouw project bestaan zoals het nu is? Je doorloopt drie dossiers — legaal, eerlijk, transparant — en verdedigt je eigen werk voor de raad.',
    introFeatures: [
        'Dossier 1 — Legaal: verwerk je gegevens rechtmatig?',
        'Dossier 2 — Eerlijk: werkt het voor iedereen even goed?',
        'Dossier 3 — Transparant: snappen gebruikers wat jouw project doet?',
        'Miniboss: verdedig je project tegen een scherp tegenargument',
        'Vonnis: drie zegels en het eindoordeel van de raad',
    ],
    maxScore: 100,
    // === Dossier 1: Legaal (AVG-advocaat) ===
    avgAdvocaat: {
        name: 'AVG-advocaat',
        emoji: '⚖️',
        role: 'Privacy- en wetgevingsspecialist',
        keyArgument:
            'Legaal betekent: ook als een rechter ernaar kijkt, klopt het — niet "waarschijnlijk mag het".',
        perspective:
            'Ik bekijk jouw project door de bril van de wet (de AVG — de Europese privacywet). Verwerk jij persoonsgegevens — namen, foto\'s, e-mailadressen? Dan moet je kunnen aantonen dat je toestemming hebt én dat duidelijk is wie verantwoordelijk is voor die gegevens. "Ik dacht dat het mocht" is geen verdediging als de rechter ernaar kijkt.',
    },
    // === Dossier 2: Eerlijk (Categorize-ronde) ===
    eerlijkCategories: ['Werkt voor iedereen', 'Valt buiten de boot'],
    eerlijkItems: [
        { label: 'Kleurenblinde gebruiker', correctCategory: 'Valt buiten de boot' },
        { label: 'Trage internetverbinding', correctCategory: 'Valt buiten de boot' },
        { label: 'Schermlezer (slechtziende)', correctCategory: 'Valt buiten de boot' },
        { label: 'Kleine dataset (< 50 items)', correctCategory: 'Valt buiten de boot' },
        { label: 'Desktop-browser Chrome', correctCategory: 'Werkt voor iedereen' },
        { label: 'Leerling zonder dyslexie', correctCategory: 'Werkt voor iedereen' },
    ],
    // === Dossier 3: Transparant ===
    transparantHint:
        'Leg het uit zonder code, voor een gewone gebruiker die jouw broncode nooit zal lezen.',
    // === Miniboss ===
    counterArgument:
        '"Jij bent een scholier, geen bedrijf. Ethische toetsen zijn voor echte developers, niet voor schoolprojecten. Niemand wordt vervolgd voor een schoolopdracht — dus waarom al die moeite?"',
    // === Completion ===
    badges: [
        { minScore: 80, emoji: '🏆', title: 'Debatmeester',   color: '#ff3c21' },
        { minScore: 60, emoji: '⚖️', title: 'Scherp Denker',  color: '#ff3c21' },
        { minScore: 40, emoji: '💬', title: 'Goed Bezig',     color: '#202023' },
        { minScore: 0,  emoji: '🌱', title: 'Aan de Start',   color: '#202023' },
    ],
    takeaways: [
        'Je hebt de drie ethische toetsen (legaal, eerlijk, transparant) toegepast op je eigen project.',
        'Je kunt uitleggen waarom "openbaar" niet hetzelfde is als "vrij te gebruiken".',
        'Je begrijpt het verschil tussen AI als copiloot en AI als vervanger van je eigen denken.',
        'Je kunt een ethisch oordeel onderbouwen met een claim én een reden.',
        'Je laat zien dat je een bewuste digitale burger bent — óók als maker, niet alleen als gebruiker.',
    ],
};

export default config;
