import React, { useState, useEffect, useCallback } from 'react';
import {
    Download, Shield, AlertTriangle, CheckCircle, Clock, Archive,
    Cloud, CloudOff, RefreshCw, Link2, Unlink,
} from 'lucide-react';
import {
    downloadBackupZIP,
    getLastBackupDate,
    isBackupStale,
    BackupProgress,
} from '../../../services/accountantBackupService';
import {
    getConnectionStatus,
    initiateConnect,
    disconnect,
    triggerManualBackup,
    DriveConnectionStatus,
} from '../../../services/gdriveBackupService';

interface BackupSectionProps {
    userId: string;
    year: number;
}

export function BackupSection({ userId, year }: BackupSectionProps) {
    const [lastBackup, setLastBackup] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState<BackupProgress | null>(null);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    // Google Drive state
    const [driveStatus, setDriveStatus] = useState<DriveConnectionStatus | null>(null);
    const [driveLoading, setDriveLoading] = useState(true);
    const [driveAction, setDriveAction] = useState<'connecting' | 'backing-up' | 'disconnecting' | null>(null);
    const [driveError, setDriveError] = useState('');
    const [driveDone, setDriveDone] = useState(false);

    const loadLastBackup = useCallback(async () => {
        setLoading(true);
        try {
            const date = await getLastBackupDate(userId);
            setLastBackup(date);
        } catch {
            // Stil falen — niet kritiek
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const loadDriveStatus = useCallback(async () => {
        setDriveLoading(true);
        try {
            const status = await getConnectionStatus(userId);
            setDriveStatus(status);
        } catch {
            // Stil falen
        } finally {
            setDriveLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadLastBackup();
        loadDriveStatus();
    }, [loadLastBackup, loadDriveStatus]);

    // Check URL params for Drive connection result
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const gdriveResult = params.get('gdrive');
        if (gdriveResult === 'connected') {
            setDriveDone(true);
            loadDriveStatus();
            // Clean URL
            const url = new URL(window.location.href);
            url.searchParams.delete('gdrive');
            window.history.replaceState({}, '', url.toString());
        } else if (gdriveResult === 'error') {
            setDriveError('Google Drive koppeling mislukt. Probeer opnieuw.');
            const url = new URL(window.location.href);
            url.searchParams.delete('gdrive');
            url.searchParams.delete('reason');
            window.history.replaceState({}, '', url.toString());
        }
    }, [loadDriveStatus]);

    async function handleDownload(selectedYear?: number) {
        setDownloading(true);
        setError('');
        setDone(false);
        setProgress(null);

        try {
            await downloadBackupZIP(userId, selectedYear, (p) => {
                setProgress({ ...p });
            });
            setDone(true);
            await loadLastBackup();
        } catch (e: any) {
            setError(e.message || 'Backup downloaden mislukt.');
        } finally {
            setDownloading(false);
            setProgress(null);
        }
    }

    async function handleDriveConnect() {
        setDriveAction('connecting');
        setDriveError('');
        try {
            await initiateConnect();
            // Browser redirects to Google — this code won't continue
        } catch (e: any) {
            setDriveError(e.message || 'Koppeling starten mislukt.');
            setDriveAction(null);
        }
    }

    async function handleDriveBackup() {
        setDriveAction('backing-up');
        setDriveError('');
        setDriveDone(false);
        try {
            await triggerManualBackup();
            setDriveDone(true);
            await loadDriveStatus();
        } catch (e: any) {
            setDriveError(e.message || 'Drive backup mislukt.');
        } finally {
            setDriveAction(null);
        }
    }

    async function handleDriveDisconnect() {
        setDriveAction('disconnecting');
        setDriveError('');
        try {
            await disconnect(userId);
            setDriveStatus({
                connected: false,
                googleEmail: null,
                lastBackupAt: null,
                lastBackupStatus: null,
                lastBackupError: null,
                connectedAt: null,
            });
        } catch (e: any) {
            setDriveError(e.message || 'Ontkoppelen mislukt.');
        } finally {
            setDriveAction(null);
        }
    }

    const stale = isBackupStale(lastBackup, 30);

    function formatBackupDate(isoDate: string): string {
        return new Date(isoDate).toLocaleDateString('nl-NL', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    function daysSinceBackup(isoDate: string): number {
        return Math.floor((Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24));
    }

    // Progressbar percentage
    const progressPct = progress
        ? progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0
        : 0;

    return (
        <div className="space-y-5">
            {/* Handmatige backup card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-5 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Archive size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                            Backup & Bewaarplicht
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Belastingdienst: administratie 7 jaar bewaren
                        </p>
                    </div>
                </div>

                {/* Waarschuwing als backup oud is */}
                {!loading && stale && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-5">
                        <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-black text-amber-800">
                                {lastBackup
                                    ? `Laatste backup is ${daysSinceBackup(lastBackup)} dagen geleden`
                                    : 'Nog geen backup gemaakt'}
                            </p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                Maak regelmatig een backup van je volledige administratie.
                                Bewaar backups minimaal 7 jaar conform de fiscale bewaarplicht.
                            </p>
                        </div>
                    </div>
                )}

                {/* Succes melding */}
                {done && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 mb-5">
                        <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                        <div>
                            <p className="text-sm font-black text-emerald-800">Backup succesvol gedownload</p>
                            <p className="text-xs text-emerald-700 mt-0.5">
                                Sla het ZIP-bestand op een veilige plek op (bijv. externe schijf of cloud).
                            </p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm mb-5">
                        <AlertTriangle size={14} />
                        {error}
                    </div>
                )}

                {/* Progress bar */}
                {downloading && progress && (
                    <div className="mb-5">
                        <div className="flex justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-600">{progress.phase}</span>
                            <span className="text-xs font-black text-indigo-600 tabular-nums">{progressPct}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Acties */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
                    <button
                        onClick={() => handleDownload(year)}
                        disabled={downloading}
                        className="w-full sm:w-auto flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {downloading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Download size={16} />
                        )}
                        {downloading ? 'Bezig met backup...' : `Backup ${year} downloaden`}
                    </button>

                    <button
                        onClick={() => handleDownload()}
                        disabled={downloading}
                        className="w-full sm:w-auto flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        <Shield size={16} />
                        Volledige backup (alle jaren)
                    </button>
                </div>

                {/* Laatste backup info */}
                <div className="mt-5 pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        {loading ? (
                            <span className="text-xs text-slate-400">Laden...</span>
                        ) : lastBackup ? (
                            <span className={`text-xs font-bold ${stale ? 'text-amber-600' : 'text-slate-500'}`}>
                                Laatste backup: {formatBackupDate(lastBackup)}
                            </span>
                        ) : (
                            <span className="text-xs text-slate-400 italic">Nog geen backup gemaakt</span>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        De backup bevat alle transacties, bonnetjes (incl. afbeeldingen), abonnementen,
                        uren, facturen en instellingen als ZIP-bestand. Inclusief CSV-export van transacties
                        voor gebruik in Excel of andere software.
                    </p>
                </div>
            </div>

            {/* Google Drive Auto-Backup card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Cloud size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                            Google Drive Auto-Backup
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Automatisch elke zondag om 03:00
                        </p>
                    </div>
                </div>

                {/* Drive error */}
                {driveError && (
                    <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm mb-5">
                        <AlertTriangle size={14} />
                        {driveError}
                    </div>
                )}

                {/* Drive success */}
                {driveDone && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 mb-5">
                        <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                        <p className="text-sm font-black text-emerald-800">
                            {driveStatus?.connected && !driveStatus.lastBackupAt
                                ? 'Google Drive succesvol gekoppeld!'
                                : 'Backup succesvol naar Google Drive geüpload!'}
                        </p>
                    </div>
                )}

                {driveLoading ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                        Laden...
                    </div>
                ) : driveStatus?.connected ? (
                    /* Connected state */
                    <div className="space-y-4">
                        {/* Connection info */}
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
                            <CheckCircle size={18} className="text-blue-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-blue-800">
                                    Verbonden met {driveStatus.googleEmail}
                                </p>
                                {driveStatus.lastBackupAt && (
                                    <p className="text-xs text-blue-600 mt-0.5">
                                        Laatste backup: {formatBackupDate(driveStatus.lastBackupAt)}
                                        {driveStatus.lastBackupStatus === 'failed' && (
                                            <span className="text-red-600 ml-1">(mislukt)</span>
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Last backup error detail */}
                        {driveStatus.lastBackupStatus === 'failed' && driveStatus.lastBackupError && (
                            <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs">
                                <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                                <span>{driveStatus.lastBackupError}</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
                            <button
                                onClick={handleDriveBackup}
                                disabled={driveAction !== null}
                                className="w-full sm:w-auto flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                {driveAction === 'backing-up' ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <RefreshCw size={16} />
                                )}
                                {driveAction === 'backing-up' ? 'Bezig met uploaden...' : 'Nu backuppen naar Drive'}
                            </button>

                            <button
                                onClick={handleDriveDisconnect}
                                disabled={driveAction !== null}
                                className="w-full sm:w-auto flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 transition-colors"
                            >
                                {driveAction === 'disconnecting' ? (
                                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Unlink size={16} />
                                )}
                                Ontkoppelen
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Not connected state */
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                            <CloudOff size={18} className="text-slate-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-slate-700">
                                    Nog niet verbonden
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Koppel je Google Drive om automatisch wekelijkse backups te ontvangen.
                                    De backups worden opgeslagen in een map "DGSkills Backups" op je Drive.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleDriveConnect}
                            disabled={driveAction !== null}
                            className="w-full sm:w-auto flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {driveAction === 'connecting' ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Link2 size={16} />
                            )}
                            {driveAction === 'connecting' ? 'Verbinden...' : 'Verbind Google Drive'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
