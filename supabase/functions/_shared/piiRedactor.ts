/**
 * PII redaction for outbound AI-provider requests (data minimisation).
 *
 * Separate from promptSanitizer.ts on purpose: that file is an exact mirror of
 * the client-side injection sanitizer and must stay in sync. PII redaction is a
 * server-only data-minimisation step, so it lives on its own.
 *
 * Deliberately conservative: only patterns with a low false-positive rate are
 * masked (e-mail, phone/BSN-like number runs, Dutch postcode). Names are NOT
 * redacted — reliable name detection is not feasible without harming tutoring.
 *
 * This is NOT prompt-injection defence (see sanitizePrompt). It only minimises
 * personal data before free text reaches an external provider (Mistral, BFL).
 */

export interface RedactResult {
    redacted: string;
    count: number;
}

export function redactPii(input: string): RedactResult {
    if (!input) return { redacted: input, count: 0 };

    let count = 0;
    let out = input;

    // E-mail addresses
    out = out.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, () => {
        count++;
        return "[e-mail]";
    });

    // Dutch postcode (1234 AB) — 4 digits (1000-9999) + 2 letters
    out = out.replace(/\b[1-9]\d{3}\s?[A-Za-z]{2}\b/g, () => {
        count++;
        return "[postcode]";
    });

    // Phone / BSN-like number runs: only mask when the run holds >= 9 digits,
    // so short numbers in normal sentences ("12 punten", "2026") are kept.
    out = out.replace(/\+?\d[\d\s().-]{7,}\d/g, (match) => {
        const digits = (match.match(/\d/g) || []).length;
        if (digits >= 9) {
            count++;
            return "[nummer]";
        }
        return match;
    });

    return { redacted: out, count };
}
