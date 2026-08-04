// Shared XP reward mapping. Extracted from AiLab so the mission intro chips and
// the completion flow agree on one source of truth.
export const getXPReward = (difficulty: string): number => {
    switch (difficulty) {
        case 'Easy':
            return 50;
        case 'Medium':
            return 100;
        case 'Hard':
            return 150;
        default:
            return 75;
    }
};

// Production evidence for this mission confirms that the server-enforced
// per-action cap is the amount actually awarded. Keep the override mission
// scoped so other rewards can be reviewed in their own audit batch.
const MISSION_XP_OVERRIDES: Record<string, number> = {
    'magister-master': 25,
    'cloud-commander': 25,
    'word-wizard': 25,
};

export const getMissionXPReward = (missionId: string, difficulty: string): number =>
    MISSION_XP_OVERRIDES[missionId] ?? getXPReward(difficulty);
