import React, { useState, useEffect, useCallback } from 'react';
import {
    Download, Shield, AlertTriangle, CheckCircle, Clock, Archive,
} from 'lucide-react';
import {
    downloadBackupZIP,
    getLastBackupDate,
    isBackupStale,
    BackupProgress,
} from '../../../services/accountantBackupService';

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

    useEffect(() => { loadLastBackup(); }, [loadLastBackup]);

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
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
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
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => handleDownload(year)}
                    disabled={downloading}
                    className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
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
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
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
    );
}
