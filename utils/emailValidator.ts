// Email validation for Dutch VO education context
// Prevents bounced emails by catching typos and invalid addresses client-side

/** Common typo corrections for popular email domains */
const DOMAIN_TYPOS: Record<string, string> = {
  // Gmail
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.nl': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmaill.com': 'gmail.com',
  // Outlook / Hotmail
  'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'outloo.com': 'outlook.com',
  'outlok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outloook.com': 'outlook.com',
  // Live
  'live.con': 'live.nl',
  'live.co': 'live.nl',
  // iCloud
  'icloud.con': 'icloud.com',
  'icoud.com': 'icloud.com',
  // Yahoo
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
};

/** Disposable/temporary email domains that will always bounce or cause issues */
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
  'yopmail.com', 'trashmail.com', 'temp-mail.org', 'fakeinbox.com',
  'sharklasers.com', 'guerrillamailblock.com', 'grr.la', 'dispostable.com',
  'maildrop.cc', 'tempail.com', 'mohmal.com', '10minutemail.com',
]);

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
  suggestion?: string; // e.g. "Bedoelde je gmail.com?"
}

/**
 * Validates an email address for the DGSkills platform.
 * Catches common student typos before they reach Supabase.
 */
export function validateEmail(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();

  // Empty check
  if (!trimmed) {
    return { valid: false, error: 'Vul een e-mailadres in.' };
  }

  // Basic format: must have exactly one @, local part, and domain part
  const atIndex = trimmed.indexOf('@');
  if (atIndex === -1) {
    return { valid: false, error: 'E-mailadres moet een @ bevatten.' };
  }

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);

  if (!localPart) {
    return { valid: false, error: 'Vul het deel vóór de @ in.' };
  }

  if (!domainPart) {
    return { valid: false, error: 'Vul het deel na de @ in (bijv. gmail.com).' };
  }

  // No spaces allowed
  if (/\s/.test(trimmed)) {
    return { valid: false, error: 'E-mailadres mag geen spaties bevatten.' };
  }

  // Multiple @ signs
  if ((trimmed.match(/@/g) || []).length > 1) {
    return { valid: false, error: 'E-mailadres mag maar één @ bevatten.' };
  }

  // Domain must have at least one dot
  if (!domainPart.includes('.')) {
    return { valid: false, error: 'Ongeldig domein. Controleer het deel na de @ (bijv. gmail.com).' };
  }

  // Domain can't end with a dot
  if (domainPart.endsWith('.')) {
    return { valid: false, error: 'E-mailadres mag niet eindigen met een punt.' };
  }

  // TLD must be at least 2 chars
  const tld = domainPart.split('.').pop() || '';
  if (tld.length < 2) {
    return { valid: false, error: 'Ongeldig domein. Controleer de extensie (bijv. .com of .nl).' };
  }

  // RFC 5321: local part max 64 chars, total max 254 chars
  if (localPart.length > 64) {
    return { valid: false, error: 'Het deel vóór de @ is te lang.' };
  }
  if (trimmed.length > 254) {
    return { valid: false, error: 'E-mailadres is te lang.' };
  }

  // Check for common invalid characters in local part
  if (/[<>()[\]\\,;:"\s]/.test(localPart)) {
    return { valid: false, error: 'E-mailadres bevat ongeldige tekens.' };
  }

  // Disposable email domains
  if (DISPOSABLE_DOMAINS.has(domainPart)) {
    return { valid: false, error: 'Wegwerp-e-mailadressen zijn niet toegestaan. Gebruik je school- of persoonlijke e-mail.' };
  }

  // Check for domain typos and suggest correction
  const suggestedDomain = DOMAIN_TYPOS[domainPart];
  if (suggestedDomain) {
    return {
      valid: false,
      error: `Ongeldig domein "${domainPart}".`,
      suggestion: `Bedoelde je ${localPart}@${suggestedDomain}?`,
    };
  }

  return { valid: true };
}
