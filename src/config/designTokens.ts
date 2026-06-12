export const DGSKILLS_COLORS = {
    cream: '#FCF6EA',
    paper: '#FFFDF7',
    creamDeep: '#F3E4CB',
    ink: '#08283B',
    muted: '#445865',
    olive: '#99984D',
    gold: '#D7C95F',
    sage: '#5F947D',
    coral: '#D97848',
    teal: '#0B453F',
    line: '#E7D8BD',
} as const;

export type DGSkillsColorName = keyof typeof DGSKILLS_COLORS;

// DUCK-redesign kleurenpalet — dezelfde keys als DGSKILLS_COLORS zodat consumers
// eenvoudig kunnen switchen. Acid (#e1ff01) alleen als vlakkleur, nooit als tekst.
export const DUCK_COLORS = {
    cream: '#f2f1ec',       // paginaachtergrond
    paper: '#ffffff',       // card/surface
    creamDeep: '#e8e7e1',   // diepere achtergrond (bijv. creamDeep-surfaces)
    ink: '#202023',         // primaire tekst en donkere vlakken
    muted: '#6f6e69',       // secundaire tekst
    olive: '#e1ff01',       // accentvlak (was olijf; nu duck-acid als vlak)
    gold: '#e1ff01',        // accentvlak (twijfelgeval: gold werd als highlight gebruikt — duck-acid als vlak)
    sage: '#202023',        // donker accentvlak (was groen; duck-ink is het donkere vlakequivalent)
    coral: '#ff3c21',       // error/CTA/waarschuwing
    teal: '#202023',        // donker vlak (was donkergroen; duck-ink)
    line: '#e3e2dc',        // border/scheidingslijn
} as const;

export type DuckColorName = keyof typeof DUCK_COLORS;

export const DGSKILLS_BRAND_ASSETS = {
    compactLogo: '/assets/brand/dgskills-beaver-laptop.webp',
    lockupLogo: '/logo-lockup.svg',
    beaverMark: '/assets/brand/dgskills-beaver-laptop.webp',
    beaverMascot: '/assets/storytelling/beaver-storyteller.webp',
    beaverFavicon: '/brand-redesign/otter/dgskills-beaver-phone-favicon-512.png',
} as const;
