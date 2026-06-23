import React, { useState, useCallback, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Loader2, Download, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    parseRosterCsv,
    importRoster,
    credentialsToCsv,
    type RosterStudent,
    type RosterImportResult,
} from '@/services/rosterImportService';

interface RosterImportModalProps {
    open: boolean;
    onClose: () => void;
}

export const RosterImportModal: React.FC<RosterImportModalProps> = ({ open, onClose }) => {
    const [rows, setRows] = useState<RosterStudent[]>([]);
    const [parseErrors, setParseErrors] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<RosterImportResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const reset = useCallback(() => {
        setRows([]); setParseErrors([]); setFileName(''); setResult(null); setError(null); setImporting(false);
    }, []);

    useEffect(() => { if (open) reset(); }, [open, reset]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }, [onClose]);
    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [open, handleKeyDown]);

    if (!open) return null;

    const handleFile = async (file: File | undefined) => {
        if (!file) return;
        setError(null); setResult(null);
        setFileName(file.name);
        try {
            const text = await file.text();
            const parsed = parseRosterCsv(text);
            setRows(parsed.rows);
            setParseErrors(parsed.parseErrors);
        } catch {
            setError('Kon het bestand niet lezen. Lever een CSV-bestand aan.');
            setRows([]); setParseErrors([]);
        }
    };

    const handleImport = async () => {
        if (rows.length === 0) return;
        setImporting(true); setError(null);
        try {
            const res = await importRoster(rows);
            setResult(res);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Importeren mislukt.');
        } finally {
            setImporting(false);
        }
    };

    const downloadCredentials = () => {
        if (!result?.credentials.length) return;
        const blob = new Blob([credentialsToCsv(result.credentials)], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dgskills-inloggegevens.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    role="dialog" aria-modal="true" aria-labelledby="roster-import-title"
                    className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-lab-tealDark to-lab-teal px-6 py-5 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Users size={20} /></div>
                                <div>
                                    <h2 id="roster-import-title" className="text-lg font-black">Leerlingen importeren</h2>
                                    <p className="text-white/70 text-xs font-medium">Uit een Magister-export (CSV)</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Sluiten"><X size={18} /></button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4 overflow-y-auto">
                        {!result ? (
                            <>
                                <p className="text-xs text-lab-muted">
                                    Exporteer uit Magister een CSV met de kolommen <strong>email, voornaam, achternaam, geboortedatum</strong> (optioneel: klas, leerjaar, niveau, leerlingnummer). De geboortedatum bepaalt de leeftijd; AI-functies blijven voor leerlingen onder de 13 jaar geblokkeerd.
                                </p>

                                <label className="block">
                                    <span className="text-xs font-bold text-lab-muted uppercase tracking-wider block mb-2">CSV-bestand</span>
                                    <div className="border-2 border-dashed border-lab-line rounded-xl p-5 text-center hover:border-lab-teal transition-colors cursor-pointer">
                                        <Upload size={22} className="mx-auto text-lab-muted mb-2" />
                                        <span className="text-sm font-medium text-lab-muted">{fileName || 'Kies een CSV-bestand'}</span>
                                        <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                                    </div>
                                </label>

                                {rows.length > 0 && (
                                    <div className="bg-lab-sage/20 border border-lab-sage rounded-xl p-3 text-sm text-lab-ink flex items-center gap-2">
                                        <Check size={16} className="text-lab-tealDark shrink-0" />
                                        <span><strong>{rows.length}</strong> geldige leerling(en) klaar om te importeren.</span>
                                    </div>
                                )}

                                {parseErrors.length > 0 && (
                                    <div className="bg-lab-gold/20 border border-lab-gold rounded-xl p-3 max-h-32 overflow-y-auto">
                                        <p className="text-xs font-bold text-lab-ink mb-1">{parseErrors.length} regel(s) overgeslagen:</p>
                                        <ul className="text-[11px] text-lab-muted list-disc list-inside space-y-0.5">
                                            {parseErrors.slice(0, 20).map((er, i) => <li key={i}>{er}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-lab-coral/15 border border-lab-coral rounded-xl p-3 text-sm text-lab-coral flex items-start gap-2">
                                        <AlertCircle size={16} className="shrink-0 mt-0.5" /><span>{error}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="bg-lab-sage/20 border border-lab-sage rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2"><Check size={18} className="text-lab-tealDark" /><p className="font-bold text-sm text-lab-ink">Import voltooid</p></div>
                                    <ul className="text-xs text-lab-muted space-y-0.5">
                                        <li><strong>{result.created}</strong> nieuwe accounts aangemaakt</li>
                                        <li><strong>{result.updated}</strong> bestaande accounts bijgewerkt</li>
                                        <li><strong>{result.skipped}</strong> overgeslagen</li>
                                    </ul>
                                </div>

                                {result.errors.length > 0 && (
                                    <div className="bg-lab-gold/20 border border-lab-gold rounded-xl p-3 max-h-32 overflow-y-auto">
                                        <p className="text-xs font-bold text-lab-ink mb-1">{result.errors.length} fout(en):</p>
                                        <ul className="text-[11px] text-lab-muted list-disc list-inside space-y-0.5">
                                            {result.errors.slice(0, 20).map((er, i) => <li key={i}>Regel {er.row + 1}: {er.reason}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {result.credentials.length > 0 && (
                                    <div className="bg-lab-coral/10 border border-lab-coral rounded-xl p-4 space-y-2">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle size={16} className="text-lab-coral shrink-0 mt-0.5" />
                                            <p className="text-xs text-lab-ink"><strong>{result.credentials.length} tijdelijke wachtwoorden</strong> aangemaakt. Download ze nu en deel ze veilig — ze worden <strong>niet opnieuw getoond</strong>. Leerlingen wijzigen hun wachtwoord bij de eerste login.</p>
                                        </div>
                                        <button onClick={downloadCredentials} className="w-full px-4 py-2.5 bg-lab-coral text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2">
                                            <Download size={16} /> Download inloggegevens (CSV)
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-lab-cream border-t border-lab-line flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2.5 text-lab-muted font-bold text-sm rounded-xl hover:bg-lab-line/40 transition-colors">
                            {result ? 'Sluiten' : 'Annuleren'}
                        </button>
                        {!result && (
                            <button
                                onClick={handleImport}
                                disabled={importing || rows.length === 0}
                                className="px-5 py-2.5 bg-lab-tealDark text-white font-bold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {importing ? <><Loader2 size={16} className="animate-spin motion-reduce:animate-none" /> Bezig...</> : <><Upload size={16} /> Importeer {rows.length > 0 ? `${rows.length} leerling(en)` : ''}</>}
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
