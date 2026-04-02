import { useState, useCallback } from 'react';

interface UseStepCompletionProps {
    initialSteps?: number[];
}

export const useStepCompletion = ({ initialSteps = [] }: UseStepCompletionProps = {}) => {
    const [completedSteps, setCompletedSteps] = useState<number[]>(initialSteps);

    /**
     * Scans responseText for ---STEP_COMPLETE:N--- markers, updates completedSteps,
     * and returns the cleaned responseText with markers removed.
     */
    const parseAndUpdateSteps = useCallback((responseText: string): string => {
        let cleaned = responseText;
        const stepMatches = responseText.matchAll(/---STEP_COMPLETE:(\d+)---/g);
        for (const match of stepMatches) {
            const stepIndex = parseInt(match[1]) - 1; // Convert 1-based to 0-based
            setCompletedSteps(prev => {
                if (!prev.includes(stepIndex)) {
                    console.log('[Steps] Step', stepIndex + 1, 'completed!');
                    return [...prev, stepIndex];
                }
                return prev;
            });
            cleaned = cleaned.replace(match[0], '');
        }
        return cleaned;
    }, []);

    const isStepCompleted = useCallback((stepIndex: number): boolean => {
        return completedSteps.includes(stepIndex);
    }, [completedSteps]);

    const allStepsCompleted = useCallback((totalSteps: number): boolean => {
        return completedSteps.length >= totalSteps;
    }, [completedSteps]);

    return {
        completedSteps,
        setCompletedSteps,
        parseAndUpdateSteps,
        isStepCompleted,
        allStepsCompleted,
    };
};
