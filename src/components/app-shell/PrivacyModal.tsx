import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Shield, Download, Trash2, AlertTriangle, CheckCircle, Loader2, ExternalLink, Clock } from 'lucide-react';
import { deleteUserAccount, exportUserData, requestProcessingRestriction } from '@/services/accountService';
import { logPrivacyViewed, logDataExported, logAccountDeleted } from '@/services/auditService';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccountDeleted: () => void;
    schoolId?: string;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onAccountDeleted, schoolId }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isRequestingRestriction, setIsRequestingRestriction] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);

    // Log that privacy settings were viewed (audit trail)
    useEffect(() => {
        if (isOpen) {
            logPrivacyViewed(schoolId);
        }
    }, [isOpen, schoolId]);

    // Focus trap: move focus into modal when opened
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const firstFocusable = modalRef.current.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            firstFocusable?.focus();
        }
    }, [isOpen]);

    // Escape to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const handleExportData = async () => {
        setIsExporting(true);
        setError(null);
        try {
            const data = await exportUserData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mijn-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            setSuccess('Gegevens succesvol gedownload!');
            logDataExported(schoolId); // Audit log
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setError(null);
        try {
            await deleteUserAccount();
            logAccountDeleted(schoolId); // Audit log
            onAccountDeleted();
        } catch (err: any) {
            setError(err.message);
            setIsDeleting(false);
        }
    };

    const handleRequestRestriction = async () => {
        setIsRequestingRestriction(true);
        setError(null);
        try {
            await requestProcessingRestriction();
            setSuccess('Aanvraag voor verwerkingsbeperking is verstuurd. Je school ontvangt dit verzoek.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsRequestingRestriction(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-lab-ink/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="privacy-modal-title"
                className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-300 motion-reduce:animate-none"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-lab-line px-6 py-4 flex items-center justify-between rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-lab-coral rounded-xl flex items-center justify-center">
                            <Shield className="text-lab-coral" size={20} />
                        </div>
                        <h2 id="privacy-modal-title" className="text-xl font-black text-lab-ink">Privacy & Gegevens</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-lab-cream rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Sluiten">
                        <X size={20} className="text-lab-muted" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Privacy Info */}
                    <section>
                        <h3 className="text-sm font-bold text-lab-ink uppercase tracking-wider mb-3">Welke gegevens bewaren wij?</h3>
                        <div className="bg-lab-cream rounded-2xl p-4 space-y-2 text-sm text-lab-muted">
                            <p>• <strong>E-mailadres</strong> – Voor inloggen en accountherstel</p>
                            <p>• <strong>Weergavenaam</strong> – Om je in de app te begroeten</p>
                            <p>• <strong>Voortgang</strong> – XP, level en voltooide missies</p>
                            <p>• <strong>Avatar</strong> – Als je er een hebt geüpload</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-bold text-lab-ink uppercase tracking-wider mb-3">Hoe gebruiken wij je gegevens?</h3>
                        <div className="bg-lab-cream rounded-2xl p-4 text-sm text-lab-muted space-y-2">
                            <p>Je gegevens worden <strong>alleen</strong> gebruikt om:</p>
                            <p>• Je voortgang op te slaan zodat je verder kunt waar je was</p>
                            <p>• Docenten inzicht te geven in de voortgang van hun klas</p>
                            <p className="text-lab-coral font-medium">Wij verkopen je gegevens NOOIT aan derden.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-bold text-lab-ink uppercase tracking-wider mb-3">AI & Chat</h3>
                        <div className="bg-lab-gold border border-lab-gold rounded-2xl p-4 text-sm text-lab-gold">
                            <p className="mb-3">De AI-onderwijsassistent wordt aangedreven door <strong>Mistral AI</strong>.</p>
                            <ul className="list-disc pl-4 space-y-1 text-sm">
                                <li><strong>Geen Training:</strong> Jouw invoer wordt <u>niet</u> gebruikt om de AI-modellen te trainen.</li>
                                <li><strong>Dataminimalisatie:</strong> We sturen alleen de inhoud die nodig is voor de gevraagde AI-functie.</li>
                                <li><strong>Datalocatie:</strong> Verwerking vindt plaats in de EU (regio: België).</li>
                                <li><strong>Retentie:</strong> Google bewaart API-inputs maximaal 30 dagen voor misbruikdetectie, daarna wordt het gewist.</li>
                            </ul>
                            <p className="mt-3 text-xs text-lab-gold italic">De AI Mentor is er om je te helpen, maar kan soms fouten maken. Controleer antwoorden altijd zelf.</p>
                        </div>
                    </section>

                    {/* Actions */}
                    <section className="pt-4 border-t border-lab-line">
                        <h3 className="text-sm font-bold text-lab-ink uppercase tracking-wider mb-3">Jouw Rechten (AVG)</h3>

                        {error && (
                            <div className="mb-4 p-3 bg-lab-coral border border-lab-coral text-lab-coral text-sm rounded-xl flex items-center gap-2">
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-lab-sage border border-lab-sage text-lab-sage text-sm rounded-xl flex items-center gap-2">
                                <CheckCircle size={16} />
                                {success}
                            </div>
                        )}

                        <div className="space-y-3">
                            {/* Export Data */}
                            <button
                                onClick={handleExportData}
                                disabled={isExporting}
                                className="w-full flex items-center justify-between p-4 bg-lab-cream hover:bg-lab-creamDeep rounded-2xl transition-colors disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Download size={20} className="text-lab-muted" />
                                    <div className="text-left">
                                        <p className="font-bold text-lab-ink">Download Mijn Gegevens</p>
                                        <p className="text-xs text-lab-muted">Ontvang een kopie van al je data (JSON)</p>
                                    </div>
                                </div>
                                {isExporting && <Loader2 size={20} className="animate-spin motion-reduce:animate-none text-lab-muted" />}
                            </button>

                            {/* Delete Account */}
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full flex items-center justify-between p-4 bg-lab-coral hover:bg-lab-coral hover:text-white rounded-2xl transition-colors border border-lab-coral"
                                >
                                    <div className="flex items-center gap-3">
                                        <Trash2 size={20} className="text-lab-muted" />
                                        <div className="text-left">
                                            <p className="font-bold text-lab-coral">Verwijder Mijn Account</p>
                                            <p className="text-xs text-lab-coral">Alle gegevens worden permanent verwijderd</p>
                                        </div>
                                    </div>
                                </button>
                            ) : (
                                <div className="p-4 bg-lab-coral rounded-2xl border-2 border-lab-coral space-y-3">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle size={24} className="text-lab-coral shrink-0" />
                                        <div>
                                            <p className="font-bold text-lab-coral">Weet je het zeker?</p>
                                            <p className="text-sm text-lab-coral">Dit kan niet ongedaan worden. Al je voortgang, XP en instellingen worden verwijderd.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="flex-1 py-2 bg-white text-lab-muted font-bold rounded-xl hover:bg-lab-cream transition-colors"
                                        >
                                            Annuleren
                                        </button>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={isDeleting}
                                            className="flex-1 py-2 bg-lab-coral text-white font-bold rounded-xl hover:bg-lab-coral hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Verwijderen...
                                                </>
                                            ) : (
                                                'Ja, Verwijder Alles'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleRequestRestriction}
                                disabled={isRequestingRestriction}
                                className="w-full flex items-center justify-between p-4 bg-lab-coral hover:bg-lab-coral hover:text-white rounded-2xl transition-colors border border-lab-coral disabled:opacity-50"
                            >
                                <div className="text-left">
                                    <p className="font-bold text-lab-coral">Vraag verwerkingsbeperking aan</p>
                                    <p className="text-xs text-lab-muted">Wij markeren je account voor tijdelijke beperking (AVG art. 18)</p>
                                </div>
                                {isRequestingRestriction && <Loader2 size={20} className="animate-spin motion-reduce:animate-none text-lab-muted" />}
                            </button>
                        </div>
                    </section>

                    {/* Data Retention Info */}
                    <section className="pt-4 border-t border-lab-line">
                        <h3 className="text-sm font-bold text-lab-ink uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Clock size={14} />
                            Bewaartermijnen
                        </h3>
                        <div className="bg-lab-cream rounded-2xl p-4 text-sm text-lab-muted space-y-1">
                            <p>• <strong>Activiteitslogs:</strong> 90 dagen</p>
                            <p>• <strong>Accountgegevens:</strong> Zolang je account actief is</p>
                            <p>• <strong>Chatgesprekken:</strong> Alleen tijdens sessie (niet opgeslagen)</p>
                        </div>
                    </section>

                    {/* Formal Privacy Policy Link */}
                    <section className="pt-4 border-t border-lab-line">
                        <a
                            href="/ict/privacy/policy"
                            className="flex items-center justify-between p-4 bg-lab-coral hover:bg-lab-coral hover:text-white rounded-2xl transition-colors border border-lab-coral group"
                        >
                            <div className="flex items-center gap-3">
                                <Shield size={20} className="text-lab-coral" />
                                <div className="text-left">
                                    <p className="font-bold text-lab-coral">Volledige Privacyverklaring</p>
                                    <p className="text-xs text-lab-coral">Bekijk de officiële verklaring van DGSkills</p>
                                </div>
                            </div>
                            <ExternalLink size={16} className="text-lab-coral group-hover:text-lab-coral transition-colors" />
                        </a>
                    </section>

                    {/* Contact */}
                    <section className="pt-4 border-t border-lab-line">
                        <p className="text-xs text-lab-muted text-center">
                            Vragen over je privacy? Neem contact op met je docent of de Functionaris Gegevensbescherming (FG) van de school.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
