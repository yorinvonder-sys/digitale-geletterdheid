import React, { useState, useEffect, useCallback } from 'react';
import { X, Shield, Check, XCircle, Loader2, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherOverride, overrideStudentStep, getOverridesForStudent } from '../../services/teacherOverrideService';

interface StepInfo {
    title: string;
    description: string;
}

interface StepOverrideModalProps {
    studentId: string;
    studentName: string;
    missionId: string;
    missionTitle: string;
    steps: StepInfo[];
    completedSteps: number[];
    onClose: () => void;
    onSuccess: () => void;
}

export const StepOverrideModal: React.FC<StepOverrideModalProps> = ({
    studentId,
    studentName,
    missionId,
    missionTitle,
    steps,
    completedSteps,
    onClose,
    onSuccess,
}) => {
    const [overrides, setOverrides] = useState<TeacherOverride[]>([]);
    const [loadingOverrides, setLoadingOverrides] = useState(true);
    const [selectedStep, setSelectedStep] = useState<number | null>(null);
    const [overrideType, setOverrideType] = useState<'approve' | 'reject'>('approve');
    const [reason, setReason] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load existing overrides
    useEffect(() => {
        loadOverrides();
    }, [studentId, missionId]);

    const loadOverrides = async () => {
        setLoadingOverrides(true);
        try {
            const data = await getOverridesForStudent(studentId, missionId);
            setOverrides(data);
        } catch {
            // RLS may block — empty list is fine
        } finally {
            setLoadingOverrides(false);
        }
    };

    // Escape to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const getStepStatus = (stepIndex: number): 'ai_completed' | 'teacher_approved' | 'teacher_rejected' | 'not_completed' => {
        const override = overrides.find(o => o.step_number === stepIndex);
        if (override) {
            return override.override_type === 'approve' ? 'teacher_approved' : 'teacher_rejected';
        }
        if (completedSteps.includes(stepIndex)) return 'ai_completed';
        return 'not_completed';
    };

    const getStatusBadge = (status: ReturnType<typeof getStepStatus>) => {
        switch (status) {
            case 'ai_completed':
                return { label: 'AI voltooid', className: 'bg-lab-sage text-lab-sage', icon: <CheckCircle2 size={10} /> };
            case 'teacher_approved':
                return { label: 'Docent goedgekeurd', className: 'bg-indigo-100 text-indigo-700', icon: <Shield size={10} /> };
            case 'teacher_rejected':
                return { label: 'Docent afgewezen', className: 'bg-red-100 text-red-700', icon: <XCircle size={10} /> };
            case 'not_completed':
                return { label: 'Niet voltooid', className: 'bg-lab-muted text-lab-muted', icon: null };
        }
    };

    const handleSave = async () => {
        if (selectedStep === null) return;
        if (overrideType === 'reject' && !reason.trim()) {
            setError('Geef een reden op bij het afwijzen van een stap.');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const result = await overrideStudentStep(
                studentId,
                missionId,
                selectedStep,
                overrideType,
                reason.trim() || undefined
            );

            if (!result.success) {
                setError(result.error || 'Er ging iets mis. Probeer het opnieuw.');
                return;
            }

            setSuccess(true);
            onSuccess();

            // Auto-close after success
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch {
            setError('Verbindingsfout. Controleer je internetverbinding.');
        } finally {
            setSaving(false);
        }
    };

    const selectStep = (stepIndex: number) => {
        setSelectedStep(stepIndex);
        setError(null);
        setReason('');

        // Pre-select override type based on current status
        const status = getStepStatus(stepIndex);
        if (status === 'ai_completed' || status === 'teacher_approved') {
            setOverrideType('reject');
        } else {
            setOverrideType('approve');
        }

        // Pre-fill reason from existing override
        const existing = overrides.find(o => o.step_number === stepIndex);
        if (existing?.reason) {
            setReason(existing.reason);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="step-override-modal-title"
                    className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-5 text-white relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <Shield size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 id="step-override-modal-title" className="text-lg font-black">Docent Override</h2>
                                    <p className="text-white/80 text-xs font-medium">{studentName} — {missionTitle}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label="Sluiten"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        {success ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="py-8 text-center"
                            >
                                <div className="w-16 h-16 bg-lab-sage rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-lab-sage" />
                                </div>
                                <h3 className="text-xl font-black text-lab-muted mb-2">Override Opgeslagen!</h3>
                                <p className="text-lab-muted text-sm">
                                    Stap {selectedStep !== null ? selectedStep + 1 : ''} is {overrideType === 'approve' ? 'goedgekeurd' : 'afgewezen'}.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Info banner */}
                                <div className="bg-indigo-50 rounded-xl p-3 flex items-start gap-3">
                                    <AlertTriangle size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-indigo-700">
                                        Als docent kun je AI-beoordelingen overrulen. Kies een stap en geef aan of je deze goedkeurt of afwijst. Dit wordt gelogd voor verantwoording (EU AI Act Art. 14).
                                    </p>
                                </div>

                                {/* Steps list */}
                                <div>
                                    <h3 className="text-[10px] font-black text-lab-muted uppercase tracking-wider mb-3">
                                        Stappen ({steps.length})
                                    </h3>
                                    {loadingOverrides ? (
                                        <div className="flex items-center justify-center py-4">
                                            <Loader2 size={20} className="animate-spin motion-reduce:animate-none text-lab-muted" />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {steps.map((step, index) => {
                                                const status = getStepStatus(index);
                                                const badge = getStatusBadge(status);
                                                const isSelected = selectedStep === index;
                                                const existingOverride = overrides.find(o => o.step_number === index);

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => selectStep(index)}
                                                        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                                                            isSelected
                                                                ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                                                                : 'border-lab-muted bg-lab-muted hover:border-lab-muted hover:bg-lab-muted'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${badge.className}`}>
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-bold text-sm text-lab-muted truncate">{step.title}</div>
                                                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${badge.className}`}>
                                                                        {badge.icon} {badge.label}
                                                                    </span>
                                                                    {existingOverride && (
                                                                        <span className="flex items-center gap-1 text-[9px] text-lab-muted">
                                                                            <Clock size={8} />
                                                                            {new Date(existingOverride.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {existingOverride?.reason && (
                                                                    <p className="text-[10px] text-lab-muted mt-1 italic truncate">
                                                                        &ldquo;{existingOverride.reason}&rdquo;
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Override form — shown when step selected */}
                                <AnimatePresence>
                                    {selectedStep !== null && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-lab-muted rounded-xl p-4 space-y-4 border border-lab-muted">
                                                <h4 className="text-xs font-black text-lab-muted uppercase tracking-wider">
                                                    Override voor: Stap {selectedStep + 1} — {steps[selectedStep]?.title}
                                                </h4>

                                                {/* Override type toggle */}
                                                <div>
                                                    <label className="text-[10px] font-bold text-lab-muted uppercase tracking-wider block mb-2">
                                                        Beoordeling
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => { setOverrideType('approve'); setError(null); }}
                                                            className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm transition-all ${
                                                                overrideType === 'approve'
                                                                    ? 'bg-lab-sage text-white shadow-lg shadow-emerald-200 ring-2 ring-emerald-500/30'
                                                                    : 'bg-white text-lab-muted border border-lab-muted hover:bg-lab-sage hover:text-lab-sage'
                                                            }`}
                                                        >
                                                            <CheckCircle2 size={16} />
                                                            Goedkeuren
                                                        </button>
                                                        <button
                                                            onClick={() => { setOverrideType('reject'); setError(null); }}
                                                            className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm transition-all ${
                                                                overrideType === 'reject'
                                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-200 ring-2 ring-red-500/30'
                                                                    : 'bg-white text-lab-muted border border-lab-muted hover:bg-red-50 hover:text-red-600'
                                                            }`}
                                                        >
                                                            <XCircle size={16} />
                                                            Afwijzen
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Reason */}
                                                <div>
                                                    <label className="text-[10px] font-bold text-lab-muted uppercase tracking-wider block mb-2">
                                                        Reden {overrideType === 'reject' ? '(verplicht)' : '(optioneel)'}
                                                    </label>
                                                    <textarea
                                                        value={reason}
                                                        onChange={(e) => { setReason(e.target.value); setError(null); }}
                                                        placeholder={overrideType === 'reject'
                                                            ? 'Waarom wijst u deze stap af? Bijv. "Leerling heeft niet aangetoond het concept te begrijpen."'
                                                            : 'Optionele toelichting, bijv. "Leerling heeft dit mondeling aangetoond."'
                                                        }
                                                        className="w-full p-3 border border-lab-muted rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        rows={3}
                                                    />
                                                </div>

                                                {/* Error */}
                                                {error && (
                                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
                                                        <AlertTriangle size={14} className="shrink-0" />
                                                        {error}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {!success && selectedStep !== null && (
                        <div className="px-6 py-4 bg-lab-muted border-t border-lab-muted flex justify-end gap-3 shrink-0">
                            <button
                                onClick={onClose}
                                className="px-4 py-2.5 text-lab-muted font-bold text-sm rounded-xl hover:bg-lab-muted transition-colors"
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg ${
                                    overrideType === 'approve'
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 shadow-emerald-200'
                                        : 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-red-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin motion-reduce:animate-none" />
                                        Opslaan...
                                    </>
                                ) : (
                                    <>
                                        <Shield size={16} />
                                        {overrideType === 'approve' ? 'Goedkeuren' : 'Afwijzen'}
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
