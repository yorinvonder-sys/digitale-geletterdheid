/**
 * AI Output Safety Filter — Post-processing voor minderjarigen
 *
 * Lichte server-side controle op AI-responses VOOR verzending naar de client.
 * Provider-neutrale output filtering blokkeert veel, maar edge cases kunnen
 * soms passeren. Deze filter is een extra vangnet.
 *
 * Detecteert alleen patronen die NIET in een educatieve context thuishoren.
 * False positives zijn aanvaardbaar — beter safe dan sorry bij minderjarigen.
 */

const CONCERNING_PATTERNS: Array<{ pattern: RegExp; category: string }> = [
    // Zelfbeschadiging / suïcide instructies
    { pattern: /\b(snij|snijd)\s+(jezelf|je\s+polsen?|in\s+je)/i, category: 'zelfbeschadiging' },
    { pattern: /\b(hang|verhang|verdring|verdrink)\s+(jezelf|je)/i, category: 'suicidaal' },
    { pattern: /\b(hoe|methode|manier)\s+(om\s+)?(jezelf\s+)?(te\s+)?(doden|vermoorden|ombrengen)/i, category: 'suicidaal' },
    { pattern: /\b(pills?|tabletten|overdosis)\s+(slikken|nemen|innemen)\s+(om\s+)?(te\s+)?(sterven|dood)/i, category: 'suicidaal' },

    // Grooming patterns
    { pattern: /\b(stuur|deel)\s+(je\s+)?(naaktfoto|naaktbeeld|naakt\s+foto)/i, category: 'grooming' },
    { pattern: /\bhoud\s+(het|dit)\s+geheim\s+(van|voor)\s+(je\s+)?(ouders|leraar|docent)/i, category: 'grooming' },
    { pattern: /\bwat\s+heb\s+je\s+aan\b/i, category: 'grooming' },

    // Wapen- en explosieven instructies
    { pattern: /\b(maak|bouw)\s+(een\s+)?(bom|explosief|wapen|molotov)/i, category: 'gevaarlijk' },
    { pattern: /\b(recept|instructie|handleiding)\s+(voor|om)\s+(een\s+)?(bom|explosief|wapen)/i, category: 'gevaarlijk' },

    // Drugs instructies
    { pattern: /\b(maak|bereid|kook)\s+(zelf\s+)?(meth|crystal|crack|heroïne|heroine|ghb|mdma)/i, category: 'drugs' },
];

export interface OutputFilterResult {
    safe: boolean;
    category?: string;
    filtered?: string;
}

/**
 * Controleer of AI-output veilig is voor weergave aan minderjarigen.
 * Retourneert het origineel als het veilig is, anders een fallback.
 */
export function filterAiOutput(text: string): OutputFilterResult {
    const lower = text.toLowerCase();

    for (const { pattern, category } of CONCERNING_PATTERNS) {
        if (pattern.test(lower)) {
            console.warn(`[outputFilter] Blocked AI output — category: ${category}`);
            return {
                safe: false,
                category,
                filtered: 'Sorry, ik kan deze vraag niet beantwoorden. Als je ergens mee zit, praat dan met een vertrouwenspersoon op school of bel de Kindertelefoon (0800-0432).',
            };
        }
    }

    return { safe: true };
}

/**
 * Filter voor streaming chunks — controleert accumulatieve tekst.
 * Gebruik door de buffer van ontvangen chunks te checken.
 */
export function filterStreamChunk(accumulatedText: string): OutputFilterResult {
    return filterAiOutput(accumulatedText);
}
