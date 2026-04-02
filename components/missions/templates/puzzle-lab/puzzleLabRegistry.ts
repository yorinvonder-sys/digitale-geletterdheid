import type { PuzzleLabConfig } from './puzzleLabTypes';
import { encryptionExpertConfig } from './configs/encryption-expert';

/**
 * Registry of all PuzzleLab mission configs.
 * Add new configs here to register them.
 */
export const PUZZLE_LAB_CONFIGS: Record<string, PuzzleLabConfig> = {
    'encryption-expert': encryptionExpertConfig,
};
