import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldX, Search, CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { getOverridesForClass, overrideStudentStep, TeacherOverride } from '../../services/teacherOverrideService';

// Strip HTML tags from user-supplied text to prevent XSS
function sanitizeReason(raw: string): string {
    return raw.replace(/<[^>]*>/g, '').slice(0, 500);
}

interface StepOverridePanelProps {
    teacherId: string;
}

export const StepOverridePanel: React.FC<StepOverridePanelProps> = ({ teacherId: _teacherId }) => {
    const [overrides, setOverrides] = useState<TeacherOverride[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterMission, setFilterMission] = useState<string>('');
    const [showOverrideModal, setShowOverrideModal] = useState(false);
    const [selectedOverride, setSelectedOverride] = useState<TeacherOverride | null>(null);
    const [overrideReason, setOverrideReason] = useState('');
    const [overrideType, setOverrideType] = useState<'approve' | 'reject'>('approve');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const fetchOverrides = useCallback(async () => {
        setLoading(true);
        const data = await getOverridesForClass(filterMission.trim() || undefined);
        setOverrides(data);
        setLoading(false);
    }, [filterMission]);

    useEffect(() => {
        fetchOverrides();
    }, [fetchOverrides]);

    const handleOverride = async (studentId: string, missionId: string, stepNumber: number) => {
        setSubmitError(null);
        const sanitized = sanitizeReason(overrideReason);
        setSubmitting(true);
        const result = await overrideStudentStep(
            studentId,
            missionId,
            stepNumber,
            overrideType,
            sanitized || undefined
        );
        setSubmitting(false);
        if (result.success) {
            setShowOverrideModal(false);
            setOverrideReason('');
            fetchOverrides();
        } else {
            setSubmitError(result.error ?? 'Er ging iets mis. Probeer het opnieuw.');
        }
    };

    const openModal = (override: TeacherOverride) => {
        setSelectedOverride(override);
        setOverrideType(override.override_type === 'approve' ? 'reject' : 'approve');
        setOverrideReason('');
        setSubmitError(null);
        setShowOverrideModal(true);
    };

    // Format relative time in Dutch
    const formatTime = (dateStr: string): string => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} min geleden`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} uur geleden`;
        const days = Math.floor(hours / 24);
        return `${days} dag${days !== 1 ? 'en' : ''} geleden`;
    };

    const approvedCount = overrides.filter(o => o.override_type === 'approve').length;
    const rejectedCount = overrides.filter(o => o.override_type === 'reject').length;
    const uniqueStudents = new Set(overrides.map(o => o.student_id)).size;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h3 className="text-lg font-black text-slate-900">Stap-overrides</h3>
                    <p className="text-sm text-slate-500">
                        AI-beoordelingen inzien en handmatig corrigeren{' '}
                        <span className="font-semibold text-indigo-600">(EU AI Act Art. 14)</span>
                    </p>
                </div>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Filter op missie-ID..."
                        value={filterMission}
                        onChange={(e) => setFilterMission(e.target.value)}
                        className="pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Status summary */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <CheckCircle2 size={20} className="text-emerald-600 mb-1" />
                    <p className="text-2xl font-black text-emerald-700">{approvedCount}</p>
                    <p className="text-xs text-emerald-600 font-medium">Goedgekeurd</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                    <XCircle size={20} className="text-red-600 mb-1" />
                    <p className="text-2xl font-black text-red-700">{rejectedCount}</p>
                    <p className="text-xs text-red-600 font-medium">Afgekeurd</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                    <AlertTriangle size={20} className="text-amber-600 mb-1" />
                    <p className="text-2xl font-black text-amber-700">{uniqueStudents}</p>
                    <p className="text-xs text-amber-600 font-medium">Leerlingen</p>
                </div>
            </div>

            {/* Override list */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            ) : overrides.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <ShieldCheck size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Geen overrides gevonden</p>
                    <p className="text-sm">
                        {filterMission
                            ? `Geen overrides gevonden voor missie "${filterMission}".`
                            : 'Overrides verschijnen hier zodra je ze aanmaakt via een leerlingprofiel.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {overrides.map((override) => (
                        <div
                            key={override.id}
                            className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {override.override_type === 'approve' ? (
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck size={20} className="text-emerald-600" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                                        <ShieldX size={20} className="text-red-600" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">
                                        {override.mission_id} — Stap {override.step_number + 1}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate font-mono">
                                        {override.student_id.slice(0, 8)}…
                                    </p>
                                    {override.reason && (
                                        <p className="text-xs text-slate-500 truncate italic mt-0.5">
                                            &ldquo;{override.reason}&rdquo;
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatTime(override.created_at)}
                                </span>
                                <button
                                    onClick={() => openModal(override)}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Wijzig
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Override Modal */}
            <AnimatePresence>
                {showOverrideModal && selectedOverride && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                        onClick={() => setShowOverrideModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="override-modal-title"
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div>
                                <h3 id="override-modal-title" className="text-lg font-black text-slate-900">
                                    Override wijzigen
                                </h3>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {selectedOverride.mission_id} — Stap {selectedOverride.step_number + 1}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOverrideType('approve')}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                                        overrideType === 'approve'
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                            : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                                    }`}
                                >
                                    ✓ Goedkeuren
                                </button>
                                <button
                                    onClick={() => setOverrideType('reject')}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                                        overrideType === 'reject'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                                    }`}
                                >
                                    ✗ Afkeuren
                                </button>
                            </div>

                            <div>
                                <label htmlFor="override-reason" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                    Reden {overrideType === 'reject' ? '(aanbevolen)' : '(optioneel)'}
                                </label>
                                <textarea
                                    id="override-reason"
                                    value={overrideReason}
                                    onChange={(e) => setOverrideReason(e.target.value)}
                                    placeholder="Reden voor override (optioneel)..."
                                    maxLength={500}
                                    className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {submitError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
                                    <AlertTriangle size={14} className="shrink-0" />
                                    {submitError}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowOverrideModal(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Annuleren
                                </button>
                                <button
                                    onClick={() =>
                                        handleOverride(
                                            selectedOverride.student_id,
                                            selectedOverride.mission_id,
                                            selectedOverride.step_number
                                        )
                                    }
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    {submitting ? 'Opslaan...' : 'Opslaan'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
