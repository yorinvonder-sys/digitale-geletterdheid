export interface PromptMasterCriterion {
    keyword: string;
    label: string;
    hint: string;
}

export interface PromptMasterChallenge {
    id: string;
    feedbackCriteria: PromptMasterCriterion[];
    badOutputExample: string;
    goodOutputExample: string;
}

export type PromptMasterVsoProfile = 'dagbesteding' | 'arbeidsmarkt';

export interface PromptMasterFeedbackItem {
    label: string;
    found: boolean;
    hint: string;
    explanation?: string;
}

export interface PromptMasterPromptResult {
    output: string;
    score: number;
    feedback: PromptMasterFeedbackItem[];
}

export function scorePromptByCriteria(prompt: string, challenge: PromptMasterChallenge): Omit<PromptMasterPromptResult, 'output'> {
    const normalizedPrompt = prompt.toLowerCase();
    let score = 0;

    const feedback = challenge.feedbackCriteria.map((criterion) => {
        const regex = new RegExp(criterion.keyword, 'i');
        const found = regex.test(normalizedPrompt);

        if (found) score += 1;

        return {
            label: criterion.label,
            found,
            hint: criterion.hint,
        };
    });

    return { score, feedback };
}

export function getEffectiveMinScore(
    challenge: PromptMasterChallenge,
    vsoProfile?: PromptMasterVsoProfile,
): number {
    const criteriaCount = challenge.feedbackCriteria.length;
    if (criteriaCount === 0) return 0;

    const regularThreshold = Math.ceil(criteriaCount * 0.75);
    const adjustedThreshold = vsoProfile === 'dagbesteding'
        ? regularThreshold - 1
        : regularThreshold;

    return Math.min(criteriaCount, Math.max(2, adjustedThreshold));
}

export function isChallengePassed(
    score: number,
    challenge: PromptMasterChallenge,
    vsoProfile?: PromptMasterVsoProfile,
): boolean {
    return score >= getEffectiveMinScore(challenge, vsoProfile);
}

export function buildLocalPromptResult(
    prompt: string,
    challenge: PromptMasterChallenge,
    vsoProfile?: PromptMasterVsoProfile,
): PromptMasterPromptResult {
    const { score, feedback } = scorePromptByCriteria(prompt, challenge);
    const foundLabels = feedback.filter(item => item.found).map(item => item.label);
    const missingLabels = feedback.filter(item => !item.found).map(item => item.label);
    const passed = isChallengePassed(score, challenge, vsoProfile);

    let output: string;
    if (passed && missingLabels.length === 0) {
        output = `De AI krijgt een duidelijke opdracht met ${foundLabels.join(', ')}. Het resultaat sluit goed aan op je prompt.`;
    } else if (foundLabels.length > 0) {
        output = `De AI ziet al: ${foundLabels.join(', ')}. Je prompt mist nog ${missingLabels.join(', ')}, waardoor het resultaat nog niet precies genoeg wordt.`;
    } else {
        output = `De AI krijgt nog te weinig richting. Voeg details toe zoals ${missingLabels.slice(0, 3).join(', ')} om het resultaat specifieker te maken.`;
    }

    return { output, score, feedback };
}

export function calculatePromptMasterMaxScore(challenges: PromptMasterChallenge[]): number {
    return challenges.reduce((total, challenge) => total + challenge.feedbackCriteria.length * 10, 0);
}
