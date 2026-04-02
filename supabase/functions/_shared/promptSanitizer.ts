/**
 * Server-side Prompt Sanitizer — OWASP LLM01:2025 / Cbw Zorgplicht
 *
 * EXACT MIRROR of client-side utils/promptSanitizer.ts for defense-in-depth.
 * Any changes here MUST be synced to the client-side version and vice versa.
 */

// ============================================================================
// HOMOGLYPH MAP — Cyrillic/Greek/Cherokee lookalikes → Latin equivalents
// Prevents bypass via visually identical non-Latin characters.
// ============================================================================
const HOMOGLYPH_MAP: Record<string, string> = {
    // Cyrillic → Latin
    '\u0410': 'A', '\u0430': 'a', '\u0412': 'B', '\u0435': 'e',
    '\u0415': 'E', '\u041A': 'K', '\u043A': 'k', '\u041C': 'M',
    '\u041D': 'H', '\u043E': 'o', '\u041E': 'O', '\u0440': 'p',
    '\u0420': 'P', '\u0441': 'c', '\u0421': 'C', '\u0422': 'T',
    '\u0443': 'y', '\u0423': 'Y', '\u0445': 'x', '\u0425': 'X',
    '\u0456': 'i', '\u0406': 'I', '\u0458': 'j', '\u0408': 'J',
    '\u0455': 's', '\u0405': 'S', '\u044A': 'b', '\u0432': 'v',
    // Greek → Latin
    '\u0391': 'A', '\u03B1': 'a', '\u0392': 'B', '\u03B2': 'b',
    '\u0395': 'E', '\u03B5': 'e', '\u0397': 'H', '\u03B7': 'n',
    '\u0399': 'I', '\u03B9': 'i', '\u039A': 'K', '\u03BA': 'k',
    '\u039C': 'M', '\u039D': 'N', '\u039F': 'O', '\u03BF': 'o',
    '\u03A1': 'P', '\u03C1': 'p', '\u03A4': 'T', '\u03C4': 't',
    '\u03A5': 'Y', '\u03C5': 'u', '\u03A7': 'X', '\u03C7': 'x',
    '\u03B6': 'z', '\u0396': 'Z',
    // Cherokee → Latin (most common)
    '\u13A0': 'D', '\u13A1': 'R', '\u13A2': 'T', '\u13A9': 'Y',
    '\u13AA': 'A', '\u13AB': 'J', '\u13AC': 'E', '\u13B3': 'W',
    '\u13B7': 'M', '\u13BB': 'H', '\u13C0': 'G', '\u13C2': 'h',
    '\u13C3': 'Z', '\u13CF': 'b', '\u13D9': 'V', '\u13DA': 'S',
    '\u13DE': 'L', '\u13DF': 'C', '\u13E6': 'P', '\u13EE': 'K',
    // Fullwidth → ASCII
    '\uFF21': 'A', '\uFF22': 'B', '\uFF23': 'C', '\uFF24': 'D',
    '\uFF25': 'E', '\uFF26': 'F', '\uFF27': 'G', '\uFF28': 'H',
    '\uFF29': 'I', '\uFF2A': 'J', '\uFF2B': 'K', '\uFF2C': 'L',
    '\uFF2D': 'M', '\uFF2E': 'N', '\uFF2F': 'O', '\uFF30': 'P',
    '\uFF31': 'Q', '\uFF32': 'R', '\uFF33': 'S', '\uFF34': 'T',
    '\uFF35': 'U', '\uFF36': 'V', '\uFF37': 'W', '\uFF38': 'X',
    '\uFF39': 'Y', '\uFF3A': 'Z',
    '\uFF41': 'a', '\uFF42': 'b', '\uFF43': 'c', '\uFF44': 'd',
    '\uFF45': 'e', '\uFF46': 'f', '\uFF47': 'g', '\uFF48': 'h',
    '\uFF49': 'i', '\uFF4A': 'j', '\uFF4B': 'k', '\uFF4C': 'l',
    '\uFF4D': 'm', '\uFF4E': 'n', '\uFF4F': 'o', '\uFF50': 'p',
    '\uFF51': 'q', '\uFF52': 'r', '\uFF53': 's', '\uFF54': 't',
    '\uFF55': 'u', '\uFF56': 'v', '\uFF57': 'w', '\uFF58': 'x',
    '\uFF59': 'y', '\uFF5A': 'z',
};

const HOMOGLYPH_REGEX = new RegExp(`[${Object.keys(HOMOGLYPH_MAP).join('')}]`, 'g');

function normaliseHomoglyphs(text: string): string {
    return text.replace(HOMOGLYPH_REGEX, (ch) => HOMOGLYPH_MAP[ch] || ch);
}

// ============================================================================
// INJECTION PATTERNS
// ============================================================================

const INJECTION_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
    // English injection patterns
    { pattern: /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?|context)/i, label: 'instruction_override_en' },
    { pattern: /you\s+are\s+now\s+(a|an)\s+/i, label: 'role_reassignment_en' },
    { pattern: /pretend\s+(you\s+are|to\s+be)\s+/i, label: 'role_pretend_en' },
    { pattern: /forget\s+(all|everything|your)\s+(previous|prior|instructions?|rules?)/i, label: 'memory_wipe_en' },
    { pattern: /system\s*prompt/i, label: 'system_prompt_probe' },
    { pattern: /reveal\s+(your|the)\s+(system|hidden|secret)\s*(prompt|instructions?|rules?)/i, label: 'system_reveal_en' },
    { pattern: /do\s+not\s+follow\s+(your|the|any)\s+(rules?|guidelines?|instructions?)/i, label: 'rule_bypass_en' },

    // Dutch injection patterns
    { pattern: /negeer\s+(alle\s+)?(vorige|eerdere|bovenstaande)\s+(instructies?|regels?|prompts?)/i, label: 'instruction_override_nl' },
    { pattern: /je\s+bent\s+nu\s+(een\s+)?/i, label: 'role_reassignment_nl' },
    { pattern: /doe\s+alsof\s+je\s+(een?\s+)?/i, label: 'role_pretend_nl' },
    { pattern: /vergeet\s+(alle|alles|je)\s+(vorige|eerdere|instructies?|regels?)/i, label: 'memory_wipe_nl' },
    { pattern: /toon\s+(je|de|het)\s+(systeem|verborgen|geheime)\s*(prompt|instructies?|regels?)/i, label: 'system_reveal_nl' },

    // French injection patterns
    { pattern: /ignor(e|ez)\s+(toutes?\s+les|les\s+pr[ée]c[ée]dentes)\s+instructions/i, label: 'instruction_override_fr' },
    { pattern: /tu\s+es\s+maintenant\s+(un|une)/i, label: 'role_reassignment_fr' },
    { pattern: /r[ée]v[èe]le(z?)\s+(ton|votre)\s+(prompt|instruction)/i, label: 'system_reveal_fr' },

    // German injection patterns
    { pattern: /ignorier(e|en)?\s+(alle\s+)?(vorherigen?\s+)?anweisungen/i, label: 'instruction_override_de' },
    { pattern: /du\s+bist\s+(jetzt|nun)\s+(ein|eine)/i, label: 'role_reassignment_de' },
    { pattern: /zeig(e?)\s+(mir\s+)?(dein|deinen|deine)\s+(system|prompt)/i, label: 'system_reveal_de' },

    // Spanish injection patterns
    { pattern: /ignora\s+(todas?\s+las\s+)?instrucciones\s+(anteriores|previas)/i, label: 'instruction_override_es' },
    { pattern: /(eres|ahora\s+eres)\s+(un|una)/i, label: 'role_reassignment_es' },
    { pattern: /revela\s+tu\s+(prompt|instrucci[oó]n)/i, label: 'system_reveal_es' },

    // Template/code injection (deduplicated)
    { pattern: /\{\{.*\}\}/, label: 'template_injection' },
    { pattern: /\[\[system\]\]/i, label: 'bracket_system_injection' },
    { pattern: /<\/?script/i, label: 'xss_via_prompt' },
    { pattern: /```\s*(system|assistant)\s*\n/i, label: 'markdown_role_injection' },

    // Delimiter-based attacks
    { pattern: /---+\s*(system|new\s+instructions?|override)/i, label: 'delimiter_injection' },
    { pattern: /###\s*(system|new\s+instructions?|override)/i, label: 'header_injection' },

    // Bidirectional text override attacks (RTL markers to disguise injection)
    { pattern: /[\u202A-\u202E\u2066-\u2069]/, label: 'bidi_override_attack' },

    // Polyglot / nested encoding attacks
    { pattern: /<[^>]*on\w+\s*=/, label: 'html_event_handler_injection' },
    { pattern: /data:\s*text\/html/i, label: 'data_uri_injection' },
    { pattern: /javascript\s*:/i, label: 'javascript_uri_injection' },

    // Base64-encoded instruction detection — only flag if decoded content contains injection keywords
    { pattern: /(?:[A-Za-z0-9+\/]{40,}={0,2})/, label: 'base64_encoded_instruction' },
];

const MAX_PROMPT_LENGTH = 4000;
const MAX_NEWLINES = 50;

export interface SanitizeResult {
    sanitized: string;
    wasBlocked: boolean;
    reason?: string;
    detectionLabel?: string;
    wasTruncated: boolean;
}

export function sanitizePrompt(input: string): SanitizeResult {
    const wasTruncated = input.length > MAX_PROMPT_LENGTH;
    let sanitized = wasTruncated ? input.slice(0, MAX_PROMPT_LENGTH) : input;

    const newlineCount = (sanitized.match(/\n/g) || []).length;
    if (newlineCount > MAX_NEWLINES) {
        sanitized = sanitized.split('\n').slice(0, MAX_NEWLINES).join('\n');
    }

    let normalised = sanitized;

    // Strip zero-width and invisible Unicode characters that can bypass pattern matching
    normalised = normalised.replace(/[\u200B-\u200F\u2028-\u202F\uFEFF\u00AD\u034F\u061C\u180E\u2060-\u2064\u2066-\u206F]/g, '');

    try {
        normalised = decodeURIComponent(normalised);
    } catch {
        // keep original
    }

    // NFKD decomposes lookalike characters, then strip combining marks
    normalised = normalised.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

    // Map known homoglyphs (Cyrillic/Greek/Cherokee/Fullwidth) to Latin equivalents
    normalised = normaliseHomoglyphs(normalised);

    for (const { pattern, label } of INJECTION_PATTERNS) {
        if (pattern.test(normalised)) {
            return {
                sanitized: '',
                wasBlocked: true,
                reason: 'Prompt injection detected',
                detectionLabel: label,
                wasTruncated,
            };
        }
    }

    return {
        sanitized: sanitized.trim(),
        wasBlocked: false,
        wasTruncated,
    };
}
