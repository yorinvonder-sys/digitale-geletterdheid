import { useState, useCallback, useEffect } from 'react';

interface UseStepCompletionProps {
    initialSteps?: number[];
    totalSteps?: number;
}

const STEP_COMPLETE_MARKER_REGEX = /---STEP_COMPLETE:(\d+)---/g;

const normalizeCompletedSteps = (steps: number[], totalSteps: number): number[] => {
    if (!Number.isInteger(totalSteps) || totalSteps <= 0) return [];

    const seen = new Set<number>();
    for (const step of steps) {
        if (Number.isInteger(step) && step >= 0 && step < totalSteps) {
            seen.add(step);
        }
    }
    return [...seen].sort((a, b) => a - b);
};

export const useStepCompletion = ({ initialSteps = [], totalSteps = 0 }: UseStepCompletionProps = {}) => {
    const [completedSteps, setCompletedSteps] = useState<number[]>(() => normalizeCompletedSteps(initialSteps, totalSteps));
    const initialStepsKey = initialSteps.join('|');

    useEffect(() => {
        setCompletedSteps(normalizeCompletedSteps(initialSteps, totalSteps));
    }, [initialStepsKey, totalSteps]);

    /**
     * Scans responseText for ---STEP_COMPLETE:N--- markers, updates completedSteps,
     * and returns the cleaned responseText with markers removed.
     */
    const parseAndUpdateSteps = useCallback((responseText: string): string => {
        const stepMatches = [...responseText.matchAll(STEP_COMPLETE_MARKER_REGEX)];
        if (stepMatches.length === 0) return responseText;

        const cleaned = responseText.replace(STEP_COMPLETE_MARKER_REGEX, '').trim();
        if (!Number.isInteger(totalSteps) || totalSteps <= 0) return cleaned;

        const validStepIndexes = new Set<number>();
        for (const match of stepMatches) {
            const markerNumber = Number.parseInt(match[1], 10);
            if (Number.isSafeInteger(markerNumber) && markerNumber >= 1 && markerNumber <= totalSteps) {
                validStepIndexes.add(markerNumber - 1); // Convert 1-based marker to 0-based UI index.
            }
        }

        if (validStepIndexes.size > 0) {
            setCompletedSteps(prev => {
                const current = normalizeCompletedSteps(prev, totalSteps);
                const next = new Set(current);
                for (const stepIndex of validStepIndexes) {
                    if (!next.has(stepIndex)) {
                        console.log('[Steps] Step', stepIndex + 1, 'completed!');
                    }
                    next.add(stepIndex);
                }
                const normalizedNext = normalizeCompletedSteps([...next], totalSteps);
                return normalizedNext.length === current.length ? current : normalizedNext;
            });
        }

        return cleaned;
    }, [totalSteps]);

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
