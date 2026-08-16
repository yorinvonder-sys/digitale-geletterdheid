import type { InspectorHotspot, InspectorTask } from './types';

export interface InspectorHotspotProgress {
    foundCorrectIds: string[];
    requiredCorrect: number;
    correctCount: number;
    isComplete: boolean;
    duplicate: boolean;
}

export function getRequiredCorrectCount(task: Pick<InspectorTask, 'hotspots' | 'requiredCorrect'>): number {
    const totalCorrect = task.hotspots.filter(hotspot => hotspot.correct).length;
    if (task.requiredCorrect === undefined) return totalCorrect;
    return Math.max(0, Math.min(totalCorrect, Math.floor(task.requiredCorrect)));
}

export function registerInspectorHotspot(
    task: Pick<InspectorTask, 'hotspots' | 'requiredCorrect'>,
    foundCorrectIds: readonly string[],
    hotspot: Pick<InspectorHotspot, 'id' | 'correct'>,
): InspectorHotspotProgress {
    const correctIds = new Set(task.hotspots.filter(item => item.correct).map(item => item.id));
    const found = new Set(foundCorrectIds.filter(id => correctIds.has(id)));
    const duplicate = hotspot.correct && found.has(hotspot.id);
    if (hotspot.correct) found.add(hotspot.id);
    const requiredCorrect = getRequiredCorrectCount(task);
    const correctCount = found.size;

    return {
        foundCorrectIds: [...found],
        requiredCorrect,
        correctCount,
        isComplete: correctCount >= requiredCorrect,
        duplicate,
    };
}
