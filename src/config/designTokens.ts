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

export const DGSKILLS_BRAND_ASSETS = {
    compactLogo: '/assets/brand/dgskills-beaver-laptop.webp',
    lockupLogo: '/logo-lockup.svg',
    beaverMark: '/assets/brand/dgskills-beaver-laptop.webp',
    beaverMascot: '/assets/storytelling/beaver-storyteller.webp',
    beaverFavicon: '/brand-redesign/otter/dgskills-beaver-phone-favicon-512.png',
} as const;
