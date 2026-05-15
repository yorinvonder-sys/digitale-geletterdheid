/**
 * XP and Leveling Utilities
 * RuneScape-style exponential progression system
 * 
 * Early levels are quick to achieve, but later levels require
 * exponentially more XP - creating a satisfying sense of progression.
 */

// ============================================
// CONFIGURATION - Tweak these to adjust the curve
// ============================================

/** XP required to reach level 2 (the "base" amount) */
const BASE_XP = 50;

/** Growth multiplier per level (1.10 = each level is 10% harder) */
const GROWTH_RATE = 1.10;

/** Maximum achievable level */
export const MAX_LEVEL = 50;

// ============================================
// CORE XP CALCULATIONS
// ============================================

/**
 * Calculate total XP required to reach a specific level
 * Uses exponential formula: XP = BASE_XP * GROWTH_RATE^(level-2)
 * 
 * @param level - Target level (1-indexed)
 * @returns Total cumulative XP needed for that level
 */
export const getXPForLevel = (level: number): number => {
    if (level <= 1) return 0;
    if (level === 2) return BASE_XP;

    // Sum of geometric series for cumulative XP
    // This gives total XP needed, not just for that level
    let totalXP = 0;
    for (let i = 2; i <= level; i++) {
        totalXP += Math.floor(BASE_XP * Math.pow(GROWTH_RATE, i - 2));
    }
    return totalXP;
};

/**
 * Pre-computed level thresholds for fast lookup
 * LEVEL_THRESHOLDS[0] = XP for level 1 = 0
 * LEVEL_THRESHOLDS[1] = XP for level 2 = 50
 * etc.
 */
export const LEVEL_THRESHOLDS: number[] = Array.from(
    { length: MAX_LEVEL },
    (_, i) => getXPForLevel(i + 1)
);

/**
 * Calculate level from total XP
 * @param xp - Total XP
 * @returns Current level (1 to MAX_LEVEL)
 */
export const getLevelFromXP = (xp: number): number => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            return Math.min(i + 1, MAX_LEVEL);
        }
    }
    return 1;
};

/**
 * Calculate the progress percentage within the current level
 * @param xp - Current XP
 * @param level - Current level (1-indexed)
 * @returns Progress percentage (0-100)
 */
export const getLevelProgress = (xp: number, level: number): number => {
    if (level >= MAX_LEVEL) return 100; // Max level = always 100%

    const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[level] || (currentThreshold + 1000);
    const xpInLevel = xp - currentThreshold;
    const levelSpan = nextThreshold - currentThreshold;

    return Math.min(100, Math.max(0, (xpInLevel / levelSpan) * 100));
};

/**
 * Get the XP threshold for the next level
 * @param level - Current level
 * @returns XP threshold for next level
 */
export const getXPForNextLevel = (level: number): number => {
    if (level >= MAX_LEVEL) return LEVEL_THRESHOLDS[MAX_LEVEL - 1];
    return LEVEL_THRESHOLDS[level] || (LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1000);
};

/**
 * Get remaining XP needed to reach next level
 * @param xp - Current XP
 * @param level - Current level
 * @returns XP remaining to next level (0 if max level)
 */
export const getXPToNextLevel = (xp: number, level: number): number => {
    if (level >= MAX_LEVEL) return 0;
    const nextThreshold = getXPForNextLevel(level);
    return Math.max(0, nextThreshold - xp);
};

/**
 * Get XP required just for a single level (not cumulative)
 * Useful for displaying "XP needed for this level"
 * @param level - Target level
 * @returns XP required just for that level
 */
export const getXPForSingleLevel = (level: number): number => {
    if (level <= 1) return 0;
    if (level === 2) return BASE_XP;
    return Math.floor(BASE_XP * Math.pow(GROWTH_RATE, level - 2));
};

// ============================================
// DEBUG / DISPLAY UTILITIES
// ============================================

/**
 * Generate a human-readable XP table (for debugging)
 * Shows all levels with their XP requirements
 */
export const generateXPTable = (): string => {
    let table = "Level | Total XP | XP for Level\n";
    table += "------|----------|-------------\n";

    for (let level = 1; level <= Math.min(20, MAX_LEVEL); level++) {
        const totalXP = LEVEL_THRESHOLDS[level - 1];
        const xpForLevel = getXPForSingleLevel(level);
        table += `${level.toString().padStart(5)} | ${totalXP.toString().padStart(8)} | ${xpForLevel.toString().padStart(12)}\n`;
    }

    if (MAX_LEVEL > 20) {
        table += `  ... | ...      | ...\n`;
        table += `${MAX_LEVEL.toString().padStart(5)} | ${LEVEL_THRESHOLDS[MAX_LEVEL - 1].toString().padStart(8)} | ${getXPForSingleLevel(MAX_LEVEL).toString().padStart(12)}\n`;
    }

    return table;
};
