// Privacy and AI interaction audit logging.
// Compliance: AVG Art. 30, EU AI Act Art. 12

import { supabase } from './supabase';

export type AuditEventType =
    | 'account_created'
    | 'account_deleted'
    | 'data_exported'
    | 'processing_restricted'
    | 'consent_given'
    | 'consent_withdrawn'
    | 'data_access_logged'
    | 'privacy_viewed'
    | 'ai_interaction'
    | 'ai_image_generated'
    | 'ai_drawing_analyzed';

export interface AuditLogEntry {
    event_type: AuditEventType;
    uid: string;
    school_id?: string;
    metadata?: Record<string, string | number | boolean>;
}

export const logAuditEvent = async (
    eventType: AuditEventType,
    metadata?: Record<string, string | number | boolean>,
    schoolId?: string
): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.warn('[AuditLog] Cannot log event - no authenticated user');
        return;
    }

    try {
        const { error } = await supabase.from('audit_logs').insert({
            action: eventType,
            uid: user.id,
            school_id: schoolId || null,
            data: metadata ? metadata as any : null,
        });

        if (error) throw error;

        if ((import.meta as any).env?.DEV) {
            console.log(`[AuditLog] Logged: ${eventType}`, metadata);
        }
    } catch (error) {
        // Audit logging should never break the app
        console.error('[AuditLog] Failed to log event:', error);
    }
};

export const getAuditLogsForUser = async (uid: string): Promise<AuditLogEntry[]> => {
    try {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .eq('uid', uid)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []) as unknown as AuditLogEntry[];
    } catch (error) {
        console.error('[AuditLog] Failed to get logs:', error);
        return [];
    }
};

// --- Convenience helpers ---

export const logAccountCreated = (schoolId?: string) =>
    logAuditEvent('account_created', {}, schoolId);

export const logConsentGiven = (type: string, schoolId?: string) =>
    logAuditEvent('consent_given', { consent_type: type }, schoolId);

export const logConsentWithdrawn = (type: string, schoolId?: string) =>
    logAuditEvent('consent_withdrawn', { consent_type: type }, schoolId);

export const logPrivacyViewed = (schoolId?: string) =>
    logAuditEvent('privacy_viewed', {}, schoolId);

export const logDataExported = (schoolId?: string) =>
    logAuditEvent('data_exported', {}, schoolId);

export const logAccountDeleted = (schoolId?: string) =>
    logAuditEvent('account_deleted', {}, schoolId);

/**
 * Log an AI interaction for EU AI Act Art. 12 traceability.
 * Only logs metadata — never actual message content or PII.
 */
export const logAiInteraction = (
    type: 'chat' | 'stream' | 'image' | 'drawing_analysis',
    metadata: {
        mission_id?: string;
        response_length?: number;
        model?: string;
        fallback_used?: boolean;
    }
) => {
    const eventType: AuditEventType =
        type === 'image' ? 'ai_image_generated' :
            type === 'drawing_analysis' ? 'ai_drawing_analyzed' :
                'ai_interaction';

    return logAuditEvent(eventType, {
        ai_type: type,
        ...(metadata.mission_id ? { mission_id: metadata.mission_id } : {}),
        ...(metadata.response_length !== undefined ? { response_length: metadata.response_length } : {}),
        ...(metadata.model ? { model: metadata.model } : {}),
        ...(metadata.fallback_used !== undefined ? { fallback_used: metadata.fallback_used } : {}),
    });
};
