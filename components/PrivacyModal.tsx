import React, { useState, useEffect } from 'react';
import { X, Shield, Download, Trash2, AlertTriangle, CheckCircle, Loader2, ExternalLink, Clock } from 'lucide-react';
import { deleteUserAccount, exportUserData, requestProcessingRestriction } from '../services/accountService';
import { logPrivacyViewed, logDataExported, logAccountDeleted } from '../services/auditService';

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

    if (!isOpen) return null;

    // Log that privacy settings were viewed (audit trail)
    useEffect(() => {
        if (isOpen) {
            logPrivacyViewed(schoolId);
        }
    }, [isOpen, schoolId]);

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
            await requestProcessingRestriction('requested_via_privacy_modal');
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
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Shield className="text-indigo-600" size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">Privacy & Gegevens</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Privacy Info */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Welke gegevens bewaren wij?</h3>
                        <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-sm text-slate-600">
                            <p>• <strong>E-mailadres</strong> – Voor inloggen en accountherstel</p>
                            <p>• <strong>Weergavenaam</strong> – Om je in de app te begroeten</p>
                            <p>• <strong>Voortgang</strong> – XP, level en voltooide missies</p>
                            <p>• <strong>Avatar</strong> – Als je er een hebt geüpload</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Hoe gebruiken wij je gegevens?</h3>
                        <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 space-y-2">
                            <p>Je gegevens worden <strong>alleen</strong> gebruikt om:</p>
                            <p>• Je voortgang op te slaan zodat je verder kunt waar je was</p>
                            <p>• Docenten inzicht te geven in de voortgang van hun klas</p>
                            <p className="text-indigo-600 font-medium">Wij verkopen je gegevens NOOIT aan derden.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">AI & Chat</h3>
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-800">
                            <p className="mb-3">De AI-onderwijsassistent wordt aangedreven door <strong>Google Gemini</strong>.</p>
                            <ul className="list-disc pl-4 space-y-1 text-sm">
                                <li><strong>Geen Training:</strong> Jouw invoer wordt <u>niet</u> gebruikt om de AI-modellen te trainen.</li>
                                <li><strong>Dataminimalisatie:</strong> We sturen alleen de inhoud die nodig is voor de gevraagde AI-functie.</li>
                                <li><strong>Datalocatie:</strong> Verwerking vindt plaats in de EU (regio: België).</li>
                                <li><strong>Retentie:</strong> Google bewaart API-inputs maximaal 30 dagen voor misbruikdetectie, daarna wordt het gewist.</li>
                            </ul>
                            <p className="mt-3 text-xs text-amber-600 italic">De AI Mentor is er om je te helpen, maar kan soms fouten maken. Controleer antwoorden altijd zelf.</p>
                        </div>
                    </section>

                    {/* Actions */}
                    <section className="pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Jouw Rechten (AVG)</h3>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-xl flex items-center gap-2">
                                <CheckCircle size={16} />
                                {success}
                            </div>
                        )}

                        <div className="space-y-3">
                            {/* Export Data */}
                            <button
                                onClick={handleExportData}
                                disabled={isExporting}
                                className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Download size={20} className="text-slate-600" />
                                    <div className="text-left">
                                        <p className="font-bold text-slate-800">Download Mijn Gegevens</p>
                                        <p className="text-xs text-slate-500">Ontvang een kopie van al je data (JSON)</p>
                                    </div>
                                </div>
                                {isExporting && <Loader2 size={20} className="animate-spin text-slate-400" />}
                            </button>

                            {/* Delete Account */}
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors border border-red-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <Trash2 size={20} className="text-red-500" />
                                        <div className="text-left">
                                            <p className="font-bold text-red-700">Verwijder Mijn Account</p>
                                            <p className="text-xs text-red-400">Alle gegevens worden permanent verwijderd</p>
                                        </div>
                                    </div>
                                </button>
                            ) : (
                                <div className="p-4 bg-red-100 rounded-2xl border-2 border-red-300 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle size={24} className="text-red-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-red-800">Weet je het zeker?</p>
                                            <p className="text-sm text-red-600">Dit kan niet ongedaan worden. Al je voortgang, XP en instellingen worden verwijderd.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="flex-1 py-2 bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            Annuleren
                                        </button>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={isDeleting}
                                            className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                                className="w-full flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-colors border border-indigo-100 disabled:opacity-50"
                            >
                                <div className="text-left">
                                    <p className="font-bold text-indigo-700">Vraag verwerkingsbeperking aan</p>
                                    <p className="text-xs text-indigo-500">Wij markeren je account voor tijdelijke beperking (AVG art. 18)</p>
                                </div>
                                {isRequestingRestriction && <Loader2 size={20} className="animate-spin text-indigo-500" />}
                            </button>
                        </div>
                    </section>

                    {/* Data Retention Info */}
                    <section className="pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Clock size={14} />
                            Bewaartermijnen
                        </h3>
                        <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 space-y-1">
                            <p>• <strong>Activiteitslogs:</strong> 90 dagen</p>
                            <p>• <strong>Accountgegevens:</strong> Zolang je account actief is</p>
                            <p>• <strong>Chatgesprekken:</strong> Alleen tijdens sessie (niet opgeslagen)</p>
                        </div>
                    </section>

                    {/* Formal Privacy Policy Link */}
                    <section className="pt-4 border-t border-slate-100">
                        <a
                            href="/ict/privacy/policy"
                            className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-colors border border-indigo-100 group"
                        >
                            <div className="flex items-center gap-3">
                                <Shield size={20} className="text-indigo-600" />
                                <div className="text-left">
                                    <p className="font-bold text-indigo-800">Volledige Privacyverklaring</p>
                                    <p className="text-xs text-indigo-600">Bekijk de officiële verklaring van DGSkills</p>
                                </div>
                            </div>
                            <ExternalLink size={16} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                        </a>
                    </section>

                    {/* Contact */}
                    <section className="pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 text-center">
                            Vragen over je privacy? Neem contact op met je docent of de Functionaris Gegevensbescherming (FG) van de school.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
