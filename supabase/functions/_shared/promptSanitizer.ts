/**
 * Server-side Prompt Sanitizer — OWASP LLM01:2025 / Cbw Zorgplicht
 *
 * EXACT MIRROR of client-side utils/promptSanitizer.ts for defense-in-depth.
 * Any changes here MUST be synced to the client-side version and vice versa.
 */

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

    // Template/code injection
    { pattern: /\{\{.*\}\}/, label: 'template_injection' },
    { pattern: /\[\[system\]\]/i, label: 'bracket_system_injection' },
    { pattern: /<\/?script/i, label: 'xss_via_prompt' },
    { pattern: /```\s*(system|assistant)\s*\n/i, label: 'markdown_role_injection' },

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

    // Template/code injection
    { pattern: /\{\{.*\}\}/, label: 'template_injection' },
    { pattern: /\[\[system\]\]/i, label: 'bracket_system_injection' },
    { pattern: /<\/?script/i, label: 'xss_via_prompt' },
    { pattern: /```\s*(system|assistant)\s*\n/i, label: 'markdown_role_injection' },

    // Delimiter-based attacks
    { pattern: /---+\s*(system|new\s+instructions?|override)/i, label: 'delimiter_injection' },
    { pattern: /###\s*(system|new\s+instructions?|override)/i, label: 'header_injection' },

    // Base64-encoded instruction detection (40+ base64 chars)
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
    normalised = normalised.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

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
