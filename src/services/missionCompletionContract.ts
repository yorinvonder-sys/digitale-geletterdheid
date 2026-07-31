type MissionCompletionRpcResult = {
    completed?: unknown;
    missionId?: unknown;
    missionsCompleted?: unknown;
};

export const parseMissionCompletion = (
    value: unknown,
    expectedMissionId: string,
): string[] => {
    const result = (value ?? {}) as MissionCompletionRpcResult;
    if (result.completed !== true || result.missionId !== expectedMissionId) {
        throw new Error('Mission completion RPC returned an invalid result');
    }
    if (!Array.isArray(result.missionsCompleted)) {
        throw new Error('Mission completion RPC did not return a completion list');
    }

    const missionsCompleted = result.missionsCompleted.filter(
        (missionId): missionId is string => typeof missionId === 'string',
    );
    if (!missionsCompleted.includes(expectedMissionId)) {
        throw new Error('Mission completion RPC did not persist the requested mission');
    }
    return [...new Set(missionsCompleted)];
};
