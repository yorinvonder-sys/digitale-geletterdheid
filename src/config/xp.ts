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
