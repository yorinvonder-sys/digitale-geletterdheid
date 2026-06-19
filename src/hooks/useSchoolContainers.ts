import { useState, useEffect, useCallback } from 'react';
import { ContainerConfig, SchedulingModel } from '@/config/containerTypes';
import { getContainersForSchool } from '@/services/containerService';

export function useSchoolContainers(schoolId: string | undefined, yearGroup: number) {
    const [containers, setContainers] = useState<ContainerConfig[]>([]);
    const [model, setModel] = useState<SchedulingModel>('default');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!schoolId) {
            setContainers([]);
            setModel('default');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await getContainersForSchool(schoolId, yearGroup);
            setContainers(result.containers);
            setModel(result.model);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Fout bij laden containers');
        } finally {
            setLoading(false);
        }
    }, [schoolId, yearGroup]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { containers, model, loading, error, refresh };
}
