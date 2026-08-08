import { useState, useCallback, useEffect } from 'react';

interface UseStepCompletionProps {
    initialSteps?: number[];
    totalSteps?: number;
    resetKey?: string;
}

export const normalizeCompletedSteps = (steps: number[], totalSteps: number): number[] => (
    [...new Set(steps)].filter(stepIndex => (
        Number.isInteger(stepIndex) && stepIndex >= 0 && stepIndex < totalSteps
    ))
);

export const useStepCompletion = ({ initialSteps = [], totalSteps = 0, resetKey }: UseStepCompletionProps = {}) => {
    const [completedSteps, setCompletedSteps] = useState<number[]>(() => normalizeCompletedSteps(initialSteps, totalSteps));

    useEffect(() => {
        setCompletedSteps(normalizeCompletedSteps(initialSteps, totalSteps));
    }, [resetKey, totalSteps]);

    /**
     * Scans responseText for ---STEP_COMPLETE:N--- markers, updates completedSteps,
     * and returns the cleaned responseText with markers removed.
     */
    const parseAndUpdateSteps = useCallback((responseText: string): string => {
        let cleaned = responseText;
        const stepMatches = responseText.matchAll(/---STEP_COMPLETE:(\d+)---/g);
        for (const match of stepMatches) {
            const stepIndex = parseInt(match[1]) - 1; // Convert 1-based to 0-based
            const isValidStep = stepIndex >= 0 && stepIndex < totalSteps;
            setCompletedSteps(prev => {
                if (isValidStep && !prev.includes(stepIndex)) {
                    console.log('[Steps] Step', stepIndex + 1, 'completed!');
                    return [...prev, stepIndex];
                }
                return prev;
            });
            cleaned = cleaned.replace(match[0], '');
        }
        return cleaned;
    }, [totalSteps]);

    const isStepCompleted = useCallback((stepIndex: number): boolean => {
        return completedSteps.includes(stepIndex);
    }, [completedSteps]);

    const allStepsCompleted = useCallback((totalSteps: number): boolean => {
        return Array.from({ length: totalSteps }, (_, index) => index)
            .every(stepIndex => completedSteps.includes(stepIndex));
    }, [completedSteps]);

    return {
        completedSteps,
        setCompletedSteps,
        parseAndUpdateSteps,
        isStepCompleted,
        allStepsCompleted,
    };
};
