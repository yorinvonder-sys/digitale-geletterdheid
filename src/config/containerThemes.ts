// Tailwind-safe volledige klassenamen — nooit dynamisch samengesteld
// zodat PurgeCSS/Tailwind JIT alle klassen behoudt.

import { ContainerTheme } from './containerTypes';

export const CONTAINER_THEME_MAP: Record<string, ContainerTheme> = {
    // De eerste 4 matchen exact de PERIOD_THEME-waarden in ProjectZeroDashboard.tsx
    'indigo':   { border: 'border-lab-coral',   bg: 'bg-lab-coral',   text: 'text-lab-coral',   iconKey: 'monitor', label: 'Digitale Basis' },
    'pink':     { border: 'border-lab-coral',     bg: 'bg-lab-coral',     text: 'text-lab-coral',     iconKey: 'brain',   label: 'AI & Creatie' },
    'cyan':     { border: 'border-lab-teal',     bg: 'bg-lab-teal',     text: 'text-lab-teal',     iconKey: 'shield',  label: 'Data & Veiligheid' },
    'violet':   { border: 'border-lab-teal',   bg: 'bg-lab-teal',   text: 'text-lab-teal',   iconKey: 'rocket',  label: 'Eindproject' },
    // Extra thema's voor scholen met meer containers
    'emerald':  { border: 'border-lab-sage',  bg: 'bg-lab-sage',  text: 'text-lab-sage',  iconKey: 'leaf',    label: '' },
    'amber':    { border: 'border-lab-gold',    bg: 'bg-lab-gold',    text: 'text-lab-gold',    iconKey: 'star',    label: '' },
    'rose':     { border: 'border-lab-coral',     bg: 'bg-lab-coral',     text: 'text-lab-coral',     iconKey: 'heart',   label: '' },
    'slate':    { border: 'border-lab-line',    bg: 'bg-lab-cream',    text: 'text-lab-muted',    iconKey: 'puzzle',  label: '' },
    'orange':   { border: 'border-lab-coral',   bg: 'bg-lab-coral',   text: 'text-lab-coral',   iconKey: 'flame',   label: '' },
    'teal':     { border: 'border-lab-teal',     bg: 'bg-lab-teal',     text: 'text-lab-teal',     iconKey: 'compass', label: '' },
    'fuchsia':  { border: 'border-lab-coral',  bg: 'bg-lab-coral',  text: 'text-lab-coral',  iconKey: 'sparkle', label: '' },
    'lime':     { border: 'border-lab-sage',     bg: 'bg-lab-sage',     text: 'text-lab-sage',     iconKey: 'bolt',    label: '' },
};

// Matcht DEFAULT_PERIOD_THEME in ProjectZeroDashboard.tsx (slate + puzzle)
export const DEFAULT_CONTAINER_THEME: ContainerTheme = {
    border: 'border-lab-line',
    bg: 'bg-lab-cream',
    text: 'text-lab-muted',
    iconKey: 'puzzle',
    label: '',
};

// Volgorde voor automatische toewijzing bij scholen met veel containers
const AUTO_THEME_ORDER: string[] = [
    'indigo', 'pink', 'cyan', 'violet',
    'emerald', 'amber', 'rose', 'orange',
    'teal', 'fuchsia', 'lime', 'slate',
];

/**
 * Geeft het thema voor een gegeven kleursleutel.
 * Valt terug op DEFAULT_CONTAINER_THEME als de sleutel onbekend is.
 */
export function getContainerTheme(colorKey?: string): ContainerTheme {
    if (!colorKey) return DEFAULT_CONTAINER_THEME;
    return CONTAINER_THEME_MAP[colorKey] ?? DEFAULT_CONTAINER_THEME;
}

/**
 * Wijst automatisch een thema toe op basis van positie-index.
 * Handig voor scholen met een onbekend aantal containers.
 */
export function getAutoTheme(index: number): ContainerTheme {
    const key = AUTO_THEME_ORDER[index % AUTO_THEME_ORDER.length];
    return CONTAINER_THEME_MAP[key] ?? DEFAULT_CONTAINER_THEME;
}

// Achterwaartse compatibiliteit met de periode-gebaseerde logica in ProjectZeroDashboard.tsx
export const DEFAULT_PERIOD_COLOR_KEYS: Record<number, string> = {
    1: 'indigo',
    2: 'pink',
    3: 'cyan',
    4: 'violet',
};

export const DEFAULT_PERIOD_ICON_KEYS: Record<number, string> = {
    1: 'monitor',
    2: 'brain',
    3: 'shield',
    4: 'rocket',
};
