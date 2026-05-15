// AI validation and plan generation via Edge Functions.

import { callEdgeFunction } from './supabase';
import { sanitizePrompt } from '@/utils/promptSanitizer';
import { markAiGeneratedText } from '@/utils/aiContentMarker';
import { validateResponse } from '@/utils/responseValidator';

export interface ValidationResult {
    isValid: boolean;
    message: string;
    suggestions?: string[];
    score?: number;
}

export interface GeneratedPlan {
    title: string;
    steps: Array<{
        id: string;
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high';
    }>;
    milestones: Array<{
        title: string;
        deadline?: string;
    }>;
}


export const validateDeveloperTask = async (
    taskTitle: string,
    taskDescription: string,
    context?: string
): Promise<ValidationResult> => {
    // Cbw Zorgplicht: Sanitize all inputs before forwarding to LLM
    const safeTitle = sanitizePrompt(taskTitle);
    const safeDesc = sanitizePrompt(taskDescription);
    const safeContext = context ? sanitizePrompt(context) : { wasBlocked: false, sanitized: '', reason: undefined, wasTruncated: false };

    if (safeTitle.wasBlocked || safeDesc.wasBlocked || safeContext.wasBlocked) {
        return {
            isValid: false,
            message: `Veiligheidsfout: Onveilige input gedetecteerd (${safeTitle.reason || safeDesc.reason || safeContext.reason}).`,
            score: 0,
        };
    }

    try {
        const result = await callEdgeFunction<ValidationResult>('validateDeveloperTask', {
            title: safeTitle.sanitized,
            description: safeDesc.sanitized,
            context: safeContext.sanitized || undefined,
        });

        return result || {
            isValid: true,
            message: 'Taak lijkt correct',
        };
    } catch (error: any) {
        console.error('Error validating task:', error);

        return {
            isValid: false,
            message: 'Validatie niet beschikbaar (offline)',
            suggestions: ['Controleer of de taak specifiek genoeg is'],
        };
    }
};


export const generateDeveloperPlan = async (
    projectDescription: string | {
        currentTasks?: Array<{ title: string; status?: string; description?: string }>;
        recentLearnings?: Array<string | undefined>;
        documentContext?: unknown[];
        tweakPrompt?: string;
        globalPolicy?: string;
    },
    currentTasks?: string[]
): Promise<AIPlanProposal | null> => {
    // Cbw Zorgplicht: Sanitize project description
    const descriptionText = typeof projectDescription === 'string'
        ? projectDescription
        : JSON.stringify(projectDescription);
    const safeDesc = sanitizePrompt(descriptionText);
    if (safeDesc.wasBlocked) return null;

    try {
        const rawResult = await callEdgeFunction<unknown>('generateDeveloperPlan', {
            description: safeDesc.sanitized,
            currentTasks,
        });

        if (!rawResult) return null;

        // OWASP A08: Runtime integrity check on AI response shape
        const plan = validateResponse<GeneratedPlan | AIPlanProposal>(
            rawResult,
            ['milestones'],
            'generateDeveloperPlan'
        );

        if ('tasks' in plan) return plan;

        return {
            tasks: plan.steps.map((step) => ({
                title: step.title,
                description: step.description,
                priority: step.priority,
                status: 'pending',
            })),
            milestones: plan.milestones,
            rationale: plan.title,
        };
    } catch (error: any) {
        console.error('Error generating plan:', error);
        return null;
    }
};


export const getTaskSuggestions = async (
    taskTitle: string,
    taskDescription: string
): Promise<string[]> => {
    // Cbw Zorgplicht: Sanitize inputs
    const safeTitle = sanitizePrompt(taskTitle);
    const safeDesc = sanitizePrompt(taskDescription);
    if (safeTitle.wasBlocked || safeDesc.wasBlocked) return [];

    try {
        const result = await callEdgeFunction<{ suggestions: string[] }>('getTaskSuggestions', {
            title: safeTitle.sanitized,
            description: safeDesc.sanitized,
        });

        // AI Act Art. 50: Mark all AI-generated suggestions with provenance metadata
        return (result?.suggestions || []).map(s => markAiGeneratedText(s, 'developer-task-ai'));
    } catch (error: any) {
        console.error('Error getting suggestions:', error);
        return [];
    }
};

// Compatibility types for DeveloperTaskList

export interface AIPlanProposal {
    tasks: Array<{
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high';
        status?: 'completed' | 'todo' | 'pending' | 'in_progress' | 'done' | 'blocked' | 'waiting_external';
    }>;
    milestones: Array<{
        title: string;
        phase?: string;
        startDate?: string;
        endDate?: string;
    }>;
    rationale?: string;
}


export const validateDeveloperTasks = async (
    tasks: Array<{ id?: string; title: string; description?: string; evidence?: any }>
): Promise<Array<{ taskId: string; status: string; feedback: string }>> => {
    const results: Array<{ taskId: string; status: string; feedback: string }> = [];

    for (const task of tasks) {
        try {
            const validation = await validateDeveloperTask(
                task.title,
                task.description || '',
                task.evidence ? JSON.stringify(task.evidence) : undefined
            );
            results.push({
                taskId: task.id || '',
                status: validation.isValid ? 'validated' : 'needs_review',
                feedback: validation.message,
            });
        } catch {
            results.push({
                taskId: task.id || '',
                status: 'error',
                feedback: 'Validatie niet beschikbaar',
            });
        }
    }

    return results;
};
