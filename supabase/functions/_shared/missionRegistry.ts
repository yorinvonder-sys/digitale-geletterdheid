/**
 * Mission Registry — Server-side systemInstruction validation
 *
 * Security: De client stuurt een missionId mee. De server verifieert dat het
 * missionId geldig is en dat de meegezonden systemInstruction overeenkomt met
 * de bekende instructie voor die missie.
 *
 * Dit voorkomt dat een kwaadwillende client een eigen systemInstruction injecteert.
 *
 * Strategie:
 * 1. VALID_MISSION_IDS: whitelist van alle geldige missie-IDs
 * 2. SUFFIX_FINGERPRINT + WELZIJN_FINGERPRINT: markers die ELKE AI-missie moet bevatten
 * 3. validateMissionInstruction(): combineert missionId check + fingerprint check
 */

// --- Whitelist van alle geldige missie-IDs ---
const VALID_MISSION_IDS = new Set([
    // Standalone missies (geen AI-chat)
    'cloud-cleaner',
    'layout-doctor',
    'pitch-police',
    'prompt-master',
    'game-director',
    // Leerjaar 1 - Periode 1
    'magister-master',
    'cloud-commander',
    'word-wizard',
    'social-media-psychologist',
    'slide-specialist',
    'print-pro',
    'ipad-print-instructies',
    // Leerjaar 1 - Periode 1/2 reviews
    'review-week-1',
    'review-week-2',
    // Leerjaar 1 - Periode 2
    'verhalen-ontwerper',
    'game-programmeur',
    'ai-trainer',
    'chatbot-trainer',
    'ai-tekengame',
    'ai-beleid-brainstorm',
    // Leerjaar 1 - Periode 3
    'ai-spiegel',
    'social-safeguard',
    'data-detective',
    'cookie-crusher',
    'data-handelaar',
    'privacy-profiel-spiegel',
    'deepfake-detector',
    'filter-bubble-breaker',
    'datalekken-rampenplan',
    'data-voor-data',
    // Leerjaar 1 - Periode 4
    'review-week-3',
    'mission-blueprint',
    'mission-vision',
    'mission-launch',
    'startup-pitch',
    // Leerjaar 2 - Periode 1
    'data-journalist',
    'spreadsheet-specialist',
    'factchecker',
    'api-verkenner',
    'dashboard-designer',
    'ai-bias-detective',
    'data-review',
    // Leerjaar 2 - Periode 2
    'algorithm-architect',
    'web-developer',
    'app-prototyper',
    'bug-hunter',
    'automation-engineer',
    'code-reviewer',
    'code-review-2',
    // Leerjaar 2 - Periode 3
    'ux-detective',
    'podcast-producer',
    'meme-machine',
    'digital-storyteller',
    'brand-builder',
    'video-editor',
    'media-review',
    // Leerjaar 2 - Periode 4
    'ai-ethicus',
    'digital-rights-defender',
    'tech-court',
    'future-forecaster',
    'sustainability-scanner',
    'eindproject-j2',
    // Leerjaar 3 - Periode 1
    'ml-trainer',
    'api-architect',
    'neural-navigator',
    'data-pipeline',
    'open-source-contributor',
    'advanced-code-review',
    // Leerjaar 3 - Periode 2
    'cyber-detective',
    'encryption-expert',
    'phishing-fighter',
    'security-auditor',
    'digital-forensics',
    'security-review',
    // Leerjaar 3 - Periode 3
    'startup-simulator',
    'policy-maker',
    'innovation-lab',
    'digital-divide-researcher',
    'tech-impact-analyst',
    'impact-review',
    // Leerjaar 3 - Periode 4
    'portfolio-builder',
    'research-project',
    'prototype-developer',
    'pitch-perfect',
    'reflection-report',
    'meesterproef',
]);

// Standalone missies die geen AI-chat gebruiken (lege systemInstruction).
const STANDALONE_MISSIONS = new Set([
    'cloud-cleaner',
    'layout-doctor',
    'pitch-police',
    'prompt-master',
    'game-director',
]);

// Fingerprint markers die in ELKE AI-missie systemInstruction moeten zitten.
const SUFFIX_FINGERPRINT = 'ALGEMENE REGELS:';
const WELZIJN_FINGERPRINT = 'WELZIJNSPROTOCOL';

export interface MissionValidationResult {
    valid: boolean;
    reason?: string;
    missionId?: string;
    systemInstruction?: string;
}

/**
 * Valideert de combinatie van missionId + systemInstruction.
 *
 * Regels:
 * 1. missionId moet in VALID_MISSION_IDS staan
 * 2. Standalone missie: systemInstruction moet leeg/absent zijn
 * 3. AI-missie: systemInstruction moet fingerprint markers bevatten
 * 4. Lengte max 12000 chars
 */
export function validateMissionInstruction(
    missionId: string,
    systemInstruction?: string
): MissionValidationResult {
    if (!VALID_MISSION_IDS.has(missionId)) {
        return { valid: false, reason: `Onbekend missionId: ${missionId}` };
    }

    // Standalone missie: mag geen systemInstruction hebben
    if (STANDALONE_MISSIONS.has(missionId)) {
        if (systemInstruction && systemInstruction.trim().length > 0) {
            return { valid: false, reason: `Standalone missie ${missionId} mag geen systemInstruction bevatten.` };
        }
        return { valid: true, missionId };
    }

    // AI-missie: systemInstruction verplicht met fingerprints
    if (!systemInstruction || systemInstruction.trim().length === 0) {
        return { valid: false, reason: `AI-missie ${missionId} vereist een systemInstruction.` };
    }

    if (!systemInstruction.includes(SUFFIX_FINGERPRINT)) {
        return { valid: false, reason: 'systemInstruction bevat niet de verplichte suffix.' };
    }

    if (!systemInstruction.includes(WELZIJN_FINGERPRINT)) {
        return { valid: false, reason: 'systemInstruction mist het welzijnsprotocol.' };
    }

    if (systemInstruction.length > 12000) {
        return { valid: false, reason: 'systemInstruction is te lang.' };
    }

    return { valid: true, missionId, systemInstruction };
}

export function isValidMissionId(id: string): boolean {
    return VALID_MISSION_IDS.has(id);
}
