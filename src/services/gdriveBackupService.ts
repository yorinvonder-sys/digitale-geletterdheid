/**
 * Google Drive Backup Service — Client-side
 *
 * Manages Google Drive connection and backup operations
 * by calling the gdrive-* Edge Functions.
 */

import { supabase } from './supabase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DriveConnectionStatus {
    connected: boolean;
    googleEmail: string | null;
    lastBackupAt: string | null;
    lastBackupStatus: 'success' | 'failed' | null;
    lastBackupError: string | null;
    connectedAt: string | null;
}

// ---------------------------------------------------------------------------
// Connection status
// ---------------------------------------------------------------------------

/**
 * Check if the current user has an active Google Drive connection.
 */
export async function getConnectionStatus(userId: string): Promise<DriveConnectionStatus> {
    const { data, error } = await db
        .from('google_drive_connections')
        .select('google_email, last_backup_at, last_backup_status, last_backup_error, connected_at')
        .eq('user_id', userId)
        .maybeSingle();

    if (error || !data) {
        return {
            connected: false,
            googleEmail: null,
            lastBackupAt: null,
            lastBackupStatus: null,
            lastBackupError: null,
            connectedAt: null,
        };
    }

    return {
        connected: true,
        googleEmail: data.google_email,
        lastBackupAt: data.last_backup_at,
        lastBackupStatus: data.last_backup_status,
        lastBackupError: data.last_backup_error,
        connectedAt: data.connected_at,
    };
}

// ---------------------------------------------------------------------------
// Connect / Disconnect
// ---------------------------------------------------------------------------

/**
 * Initiate Google Drive OAuth2 connection.
 * Calls the gdrive-auth Edge Function to get the authorization URL,
 * then redirects the browser to Google.
 */
export async function initiateConnect(): Promise<void> {
    const { data, error } = await supabase.functions.invoke('gdrive-auth', {
        method: 'POST',
    });

    if (error) {
        throw new Error(error.message || 'Kon Google Drive koppeling niet starten.');
    }

    if (!data?.url) {
        throw new Error('Geen autorisatie-URL ontvangen.');
    }

    // Redirect to Google OAuth consent screen
    window.location.href = data.url;
}

/**
 * Disconnect Google Drive (remove stored tokens).
 */
export async function disconnect(userId: string): Promise<void> {
    const { error } = await db
        .from('google_drive_connections')
        .delete()
        .eq('user_id', userId);

    if (error) {
        throw new Error('Kon Drive-koppeling niet verwijderen.');
    }
}

// ---------------------------------------------------------------------------
// Manual backup trigger
// ---------------------------------------------------------------------------

/**
 * Trigger a manual backup to Google Drive via the Edge Function.
 */
export async function triggerManualBackup(): Promise<{
    fileId: string;
    fileName?: string;
}> {
    const { data, error } = await supabase.functions.invoke('gdrive-backup', {
        method: 'POST',
    });

    if (error) {
        throw new Error(error.message || 'Backup naar Google Drive mislukt.');
    }

    // The function returns { results: [{ userId, status, fileId?, error? }] }
    const result = data?.results?.[0];
    if (!result || result.status !== 'success') {
        throw new Error(result?.error || 'Backup mislukt.');
    }

    return { fileId: result.fileId };
}

// ---------------------------------------------------------------------------
// Backup history
// ---------------------------------------------------------------------------

/**
 * Get recent Drive backup log entries.
 */
export async function getDriveBackupHistory(
    userId: string,
    limit = 5,
): Promise<Array<{
    backup_date: string;
    backup_type: string;
    file_name: string | null;
    file_size_bytes: number | null;
}>> {
    const { data, error } = await db
        .from('accountant_backup_log')
        .select('backup_date, backup_type, file_name, file_size_bytes')
        .eq('user_id', userId)
        .in('backup_type', ['auto_gdrive', 'manual_gdrive'])
        .order('backup_date', { ascending: false })
        .limit(limit);

    if (error || !data) return [];
    return data;
}
