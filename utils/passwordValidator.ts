/**
 * Password Validator — Cbw Zorgplicht / NCSC Richtlijn Wachtwoordbeveiliging
 * 
 * Enforces strong password policy for an educational platform
 * handling sensitive data of minors.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const PASSWORD_MIN_LENGTH = 12;

/** Common Dutch & English weak passwords to block */
const COMMON_PASSWORDS = new Set([
    'welkom123456',
    'wachtwoord12',
    'wachtwoord123',
    'password1234',
    'password12345',
    'qwerty123456',
    'admin1234567',
    'letmein12345',
    'welkom01welkom',
    'school123456',
    'leerling12345',
    'docent123456',
    'test12345678',
    '123456789012',
    'abcdefghijkl',
]);

// ============================================================================
// TYPES
// ============================================================================

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    strength: 'zwak' | 'gemiddeld' | 'sterk' | 'zeer sterk';
}

// ============================================================================
// VALIDATOR
// ============================================================================

/**
 * Validate a password against the security policy.
 * 
 * Requirements (NCSC Richtlijn):
 * - Minimaal 12 tekens
 * - Minimaal 1 hoofdletter
 * - Minimaal 1 kleine letter
 * - Minimaal 1 cijfer
 * - Niet in de lijst met veelvoorkomende wachtwoorden
 */
export const validatePassword = (password: string): PasswordValidationResult => {
    const errors: string[] = [];

    if (password.length < PASSWORD_MIN_LENGTH) {
        errors.push(`Minimaal ${PASSWORD_MIN_LENGTH} tekens vereist (nu: ${password.length}).`);
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Minimaal één kleine letter (a-z) vereist.');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Minimaal één hoofdletter (A-Z) vereist.');
    }

    if (!/\d/.test(password)) {
        errors.push('Minimaal één cijfer (0-9) vereist.');
    }

    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
        errors.push('Dit wachtwoord staat op de lijst met veelvoorkomende wachtwoorden. Kies een unieker wachtwoord.');
    }

    // Check for sequential characters (e.g., "abcdef", "123456")
    if (hasSequentialChars(password, 4)) {
        errors.push('Vermijd meer dan 3 opeenvolgende tekens (bijv. "abcd" of "1234").');
    }

    // Check for repeated characters (e.g., "aaaaaa")
    if (/(.)\1{3,}/.test(password)) {
        errors.push('Vermijd meer dan 3 herhaalde tekens (bijv. "aaaa").');
    }

    return {
        isValid: errors.length === 0,
        errors,
        strength: calculateStrength(password, errors.length),
    };
};

/**
 * Enforce password policy — throws on invalid password.
 * Use this as a guard in registration/change-password flows.
 */
export const enforcePasswordPolicy = (password: string): void => {
    const result = validatePassword(password);
    if (!result.isValid) {
        throw new Error(result.errors[0]);
    }
};

// ============================================================================
// HELPERS
// ============================================================================

const hasSequentialChars = (str: string, minLength: number): boolean => {
    const lower = str.toLowerCase();
    let ascending = 1;
    let descending = 1;

    for (let i = 1; i < lower.length; i++) {
        const diff = lower.charCodeAt(i) - lower.charCodeAt(i - 1);
        if (diff === 1) {
            ascending++;
            if (ascending >= minLength) return true;
        } else {
            ascending = 1;
        }
        if (diff === -1) {
            descending++;
            if (descending >= minLength) return true;
        } else {
            descending = 1;
        }
    }

    return false;
};

const calculateStrength = (
    password: string,
    errorCount: number
): 'zwak' | 'gemiddeld' | 'sterk' | 'zeer sterk' => {
    if (errorCount > 0) return 'zwak';

    let score = 0;
    if (password.length >= 16) score += 2;
    else if (password.length >= 12) score += 1;

    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 1;
    if (/[A-Z].*[A-Z]/.test(password)) score += 1; // Multiple uppercase
    if (/\d.*\d.*\d/.test(password)) score += 1; // Multiple digits

    if (score >= 4) return 'zeer sterk';
    if (score >= 2) return 'sterk';
    return 'gemiddeld';
};
