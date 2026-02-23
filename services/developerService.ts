import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
export interface DeveloperTask {
    id?: string;
    user_id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done' | 'blocked' | 'waiting_external' | 'pending';
    priority: 'low' | 'medium' | 'high';
    category?: string;
    created_at?: string;
    updated_at?: string;
}

export interface DeveloperMilestone {
    id?: string;
    user_id: string;
    title: string;
    deadline?: string;
    completed: boolean;
    tasks: string[];
    created_at?: string;
}

export interface DeveloperPlan {
    id?: string;
    user_id: string;
    plan_data: any;
    version: number;
    status?: 'draft' | 'approved' | 'rejected';
    created_at?: string;
}

export interface DeveloperSettings {
    theme?: string;
    auto_save?: boolean;
    show_tips?: boolean;
    preferred_language?: string;
    globalPolicy?: string;
}

// --- Tasks ---
export const getDeveloperTasks = async (userId: string): Promise<DeveloperTask[]> => {
    const { data, error } = await supabase
        .from('developer_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DeveloperTask[];
};

export const createDeveloperTask = async (task: Omit<DeveloperTask, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
    const { data, error } = await supabase
        .from('developer_tasks')
        .insert(task)
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
};

export const updateDeveloperTask = async (taskId: string, updates: Partial<DeveloperTask>): Promise<void> => {
    const { error } = await supabase
        .from('developer_tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', taskId);

    if (error) throw error;
};

export const deleteDeveloperTask = async (taskId: string): Promise<void> => {
    const { error } = await supabase
        .from('developer_tasks')
        .delete()
        .eq('id', taskId);

    if (error) throw error;
};

// --- Realtime tasks ---
export const subscribeToDeveloperTasks = (
    userId: string,
    onUpdate: (tasks: DeveloperTask[]) => void
): (() => void) => {
    getDeveloperTasks(userId).then(onUpdate).catch(console.error);

    const channel: RealtimeChannel = supabase
        .channel(`developer-tasks-${userId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'developer_tasks',
                filter: `user_id=eq.${userId}`,
            },
            () => {

                getDeveloperTasks(userId).then(onUpdate).catch(console.error);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

// --- Milestones ---
export const getDeveloperMilestones = async (userId: string): Promise<DeveloperMilestone[]> => {
    const { data, error } = await supabase
        .from('developer_milestones')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DeveloperMilestone[];
};

export const createDeveloperMilestone = async (milestone: Omit<DeveloperMilestone, 'id' | 'created_at'>): Promise<string> => {
    const { data, error } = await supabase
        .from('developer_milestones')
        .insert(milestone)
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
};

export const updateDeveloperMilestone = async (milestoneId: string, updates: Partial<DeveloperMilestone>): Promise<void> => {
    const { error } = await supabase
        .from('developer_milestones')
        .update(updates)
        .eq('id', milestoneId);

    if (error) throw error;
};

// --- Plan history ---
export const getDeveloperPlanHistory = async (userId: string): Promise<DeveloperPlan[]> => {
    const { data, error } = await supabase
        .from('developer_plans')
        .select('*')
        .eq('user_id', userId)
        .order('version', { ascending: false });

    if (error) throw error;
    return (data || []) as DeveloperPlan[];
};

export const saveDeveloperPlan = async (userId: string, planData: any): Promise<string> => {
    // Get latest version
    const { data: latestPlan } = await supabase
        .from('developer_plans')
        .select('version')
        .eq('user_id', userId)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

    const newVersion = (latestPlan?.version || 0) + 1;

    const { data, error } = await supabase
        .from('developer_plans')
        .insert({
            user_id: userId,
            plan_data: planData,
            version: newVersion,
        })
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
};

// --- Settings ---
export const getDeveloperSettings = async (userId: string): Promise<DeveloperSettings> => {
    const { data, error } = await supabase
        .from('developer_settings')
        .select('settings')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) throw error;
    return (data?.settings as DeveloperSettings) || {};
};

export const updateDeveloperSettings = async (userId: string, settings: DeveloperSettings): Promise<void> => {
    const { error } = await supabase
        .from('developer_settings')
        .upsert({
            user_id: userId,
            settings,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

    if (error) throw error;
};

// Compatibility aliases for DeveloperTaskList.tsx


export interface DevTask extends DeveloperTask {
    checked?: boolean;
    learningNote?: string;
    dueDate?: string;
    dependencies?: string[];
    evidence?: {
        url?: string;
        reflection?: string;
        aiValidationStatus?: string;
        aiFeedback?: string;
    };
}

export const subscribeToDevTasks = (
    userId: string,
    onUpdate: (tasks: DevTask[]) => void
): (() => void) => {
    return subscribeToDeveloperTasks(userId, (tasks) => {
        onUpdate(tasks as DevTask[]);
    });
};

export const addDevTask = async (userId: string, task: Partial<DevTask>): Promise<string> => {
    return createDeveloperTask({
        user_id: userId,
        title: task.title || 'Untitled',
        description: task.description,
        status: task.status === 'completed' ? 'done' : task.status === 'pending' ? 'todo' : (task.status as any) || 'todo',
        priority: task.priority || 'medium',
        category: task.category,
    });
};

export const updateDevTask = async (userId: string, taskId: string, updates: Partial<DevTask>): Promise<void> => {
    return updateDeveloperTask(taskId, updates);
};

export const deleteDevTask = async (userId: string, taskId: string): Promise<void> => {
    return deleteDeveloperTask(taskId);
};

export const addDevMilestone = async (userId: string, milestone: any): Promise<string> => {
    return createDeveloperMilestone({
        user_id: userId,
        title: milestone.title || 'Milestone',
        completed: false,
        tasks: milestone.tasks || [],
    });
};

export const addDevPlanHistory = async (userId: string, entry: any): Promise<string> => {
    return saveDeveloperPlan(userId, entry);
};


export const subscribeToDevSettings = (
    userId: string,
    onUpdate: (settings: DeveloperSettings & { globalPolicy?: string }) => void
): (() => void) => {
    // Initial fetch
    getDeveloperSettings(userId).then(onUpdate).catch(console.error);

    const channel = supabase
        .channel(`developer-settings-${userId}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'developer_settings',
            filter: `user_id=eq.${userId}`,
        }, () => {
            getDeveloperSettings(userId).then(onUpdate).catch(console.error);
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};


export const updateDevSettings = async (
    userId: string,
    settings: DeveloperSettings & { globalPolicy?: string }
): Promise<void> => {
    return updateDeveloperSettings(userId, settings);
};

// Compatibility types for DeveloperTimeline.tsx

export interface DevMilestone {
    id?: string;
    title: string;
    phase: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'in_progress' | 'completed';
    learningGoal?: string;
    updatedAt?: string;
}

export const subscribeToDevTimeline = (
    userId: string,
    onUpdate: (milestones: DevMilestone[]) => void
): (() => void) => {
    const fetchMilestones = async () => {
        const { data, error } = await supabase
            .from('developer_milestones')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('[Dev] Failed to fetch milestones:', error);
            onUpdate([]);
            return;
        }
        onUpdate((data || []) as unknown as DevMilestone[]);
    };

    fetchMilestones();

    const channel = supabase
        .channel(`developer-milestones-${userId}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'developer_milestones',
            filter: `user_id=eq.${userId}`,
        }, () => {
            fetchMilestones();
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

export const updateDevMilestone = async (
    _userId: string,
    milestoneId: string,
    updates: Partial<DevMilestone>
): Promise<void> => {
    return updateDeveloperMilestone(milestoneId, updates as any);
};

export const deleteDevMilestone = async (
    _userId: string,
    milestoneId: string
): Promise<void> => {
    const { error } = await supabase
        .from('developer_milestones')
        .delete()
        .eq('id', milestoneId);

    if (error) throw error;
};

// --- Analytics (DeveloperAnalyticsPanel) ---

export const getAnalyticsSummary = async (days: number = 7): Promise<any> => {
    try {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const { data, error } = await supabase
            .from('analytics_daily_aggregates')
            .select('*')
            .gte('date', since.toISOString().split('T')[0])
            .order('date', { ascending: true });

        if (error) throw error;


        const byDate: Record<string, any> = {};
        (data || []).forEach((row: any) => {
            byDate[row.date] = row.data || {};
        });

        return { days, data: byDate };
    } catch (error) {
        console.error('[Dev] Failed to fetch analytics:', error);
        return { days, data: {} };
    }
};


