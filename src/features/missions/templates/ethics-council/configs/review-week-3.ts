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
    // Sorteer ONTWERPKEUZES (niet mensen): maakt de keuze je project eerlijk
    // voor iedereen, of sluit hij per ongeluk mensen uit?
    eerlijkCategories: ['Eerlijk ontwerp', 'Sluit mensen uit'],
    eerlijkItems: [
        { label: 'Knoppen hebben tekst, niet alleen kleur', correctCategory: 'Eerlijk ontwerp' },
        { label: "Video's hebben ondertiteling", correctCategory: 'Eerlijk ontwerp' },
        { label: 'Tekst en achtergrond hebben genoeg contrast', correctCategory: 'Eerlijk ontwerp' },
        { label: 'Werkt alleen met een muis, niet met toetsenbord', correctCategory: 'Sluit mensen uit' },
        { label: 'Uitleg staat alleen in moeilijk, formeel Nederlands', correctCategory: 'Sluit mensen uit' },
        { label: 'AI is maar met één soort gebruiker getest', correctCategory: 'Sluit mensen uit' },
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
