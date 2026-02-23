/**
 * Prompt Sanitizer — OWASP LLM Top 10 (LLM01:2025) / Cbw Zorgplicht
 * 
 * Detects and blocks prompt injection attempts before user input
 * is forwarded to AI models via Edge Functions.
 * 
 * This is a CLIENT-SIDE first line of defense. The same patterns
 * should be replicated server-side in the Edge Function for defense-in-depth.
 */

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

    // Dutch injection patterns (platform language)
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

    // Delimiter-based attacks
    { pattern: /---+\s*(system|new\s+instructions?|override)/i, label: 'delimiter_injection' },
    { pattern: /###\s*(system|new\s+instructions?|override)/i, label: 'header_injection' },
];

// ============================================================================
// CONFIGURATION
// ============================================================================

/** Maximum prompt length allowed (characters) */
const MAX_PROMPT_LENGTH = 4000;

/** Maximum number of newlines (prevents token-stuffing attacks) */
const MAX_NEWLINES = 50;

// ============================================================================
// MAIN SANITIZER
// ============================================================================

export interface SanitizeResult {
    /** The sanitized prompt (empty if blocked) */
    sanitized: string;
    /** Whether the prompt was blocked */
    wasBlocked: boolean;
    /** Reason for blocking (if blocked) */
    reason?: string;
    /** Internal label for audit logging */
    detectionLabel?: string;
    /** Whether the prompt was truncated */
    wasTruncated: boolean;
}

/**
 * Sanitize user input before sending to AI.
 * Detects prompt injection attempts and enforces length limits.
 */
export const sanitizePrompt = (input: string): SanitizeResult => {
    // Length check
    const wasTruncated = input.length > MAX_PROMPT_LENGTH;
    let sanitized = wasTruncated ? input.slice(0, MAX_PROMPT_LENGTH) : input;

    // Newline stuffing check
    const newlineCount = (sanitized.match(/\n/g) || []).length;
    if (newlineCount > MAX_NEWLINES) {
        sanitized = sanitized.split('\n').slice(0, MAX_NEWLINES).join('\n');
    }

    // ── Unicode + URL-decode normalization (prevents homoglyph/encoding bypasses) ──
    let normalised = sanitized;
    try {
        // URL-decode any percent-encoded characters
        normalised = decodeURIComponent(normalised);
    } catch {
        // If decoding fails (invalid encoding) keep original
    }
    // NFKD decomposes lookalike characters (e.g. Cyrillic а → Latin a)
    normalised = normalised.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

    // Injection pattern check (against normalised text)
    for (const { pattern, label } of INJECTION_PATTERNS) {
        if (pattern.test(normalised)) {
            return {
                sanitized: '',
                wasBlocked: true,
                reason: 'Je bericht bevat een patroon dat niet is toegestaan. Probeer het anders te formuleren.',
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
};

/**
 * Quick check if a prompt contains suspicious patterns (non-blocking).
 * Use this for logging/monitoring without blocking the user.
 */
export const detectSuspiciousPatterns = (input: string): string[] => {
    const detected: string[] = [];
    for (const { pattern, label } of INJECTION_PATTERNS) {
        if (pattern.test(input)) {
            detected.push(label);
        }
    }
    return detected;
};
