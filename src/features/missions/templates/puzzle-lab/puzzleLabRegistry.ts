import type { PuzzleLabConfig } from './puzzleLabTypes';
import { encryptionExpertConfig } from './configs/encryption-expert';
import cyberDetectiveConfig from './configs/cyber-detective';
import wachtwoordWarriorConfig from './configs/wachtwoord-warrior';
import dataHandelaarConfig from './configs/data-handelaar';
import securityAuditorConfig from './configs/security-auditor';

/**
 * Registry of all PuzzleLab mission configs.
 * Add new configs here to register them.
 */
export const PUZZLE_LAB_CONFIGS: Record<string, PuzzleLabConfig> = {
    'encryption-expert': encryptionExpertConfig,
    'cyber-detective': cyberDetectiveConfig,
    'wachtwoord-warrior': wachtwoordWarriorConfig,
    'data-handelaar': dataHandelaarConfig,
    'security-auditor': securityAuditorConfig,
};
