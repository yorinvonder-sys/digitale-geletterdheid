import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Send, Award, RotateCcw, Star, Zap, Eye, StickyNote, Plus, Trash2, Edit2, Loader2, AlertCircle, Target, Clock, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { StudentData } from '../../types';
import { TeacherNote, StudentMissionScore, getStudentMissionScores } from '../../services/teacherService';
import { AVAILABLE_BADGES } from '../../config/badges';
import { AwardXPModal } from './AwardXPModal';
import { StepOverrideModal } from './StepOverrideModal';
import { addTeacherNote, getTeacherNotes, updateTeacherNote, deleteTeacherNote } from '../../services/teacherService';
import { TeacherOverride, getOverridesForStudent } from '../../services/teacherOverrideService';
import { supabase } from '../../services/supabase';
import { SLOProgressPanel } from './SLOProgressPanel';
import { GrowthStudentTab } from './GrowthStudentTab';
import { getMissionsForYear } from '../../config/missions';
import { ROLES } from '../../config/agents';

const LazyDigitaalPaspoort = lazy(() => import('../assessment/escaperoom/DigitaalPaspoort').then(m => ({ default: m.DigitaalPaspoort })));

interface StudentModalProps {
    student: StudentData | null;
    onClose: () => void;
    onMessage: () => void;
    onBadge: () => void;
    onReset: () => void;
    onHighlight: () => void;
    onAwardXP: (amount: number) => void;
    onLiveView: () => void;
    onDelete: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({ student, onClose, onMessage, onBadge, onReset, onHighlight, onAwardXP, onLiveView, onDelete }) => {
    const [showXPModal, setShowXPModal] = useState(false);
    const [notes, setNotes] = useState<TeacherNote[]>([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [editingNote, setEditingNote] = useState<TeacherNote | null>(null);
    const [noteText, setNoteText] = useState('');
    const [notePriority, setNotePriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [savingNote, setSavingNote] = useState(false);
    const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'slo' | 'paspoort' | 'overrides' | 'groei'>('overview');
    const [missionScores, setMissionScores] = useState<StudentMissionScore[]>([]);
    const [loadingScores, setLoadingScores] = useState(false);
    const [allOverrides, setAllOverrides] = useState<TeacherOverride[]>([]);
    const [loadingOverrides, setLoadingOverrides] = useState(false);
    const [overrideMission, setOverrideMission] = useState<{ id: string; title: string } | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus trap: move focus into modal when opened
    useEffect(() => {
        if (student && modalRef.current) {
            const firstFocusable = modalRef.current.querySelector<HTMLElement>('button, [tabindex]:not([tabindex="-1"])');
            firstFocusable?.focus();
        }
    }, [student]);

    // Escape to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (student) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [student, handleKeyDown]);

    // Load notes, mission scores, and overrides when student changes
    useEffect(() => {
        if (student) {
            loadNotes();
            loadMissionScores();
            loadAllOverrides();
            setActiveTab('overview');
        } else {
            setNotes([]);
            setMissionScores([]);
            setAllOverrides([]);
        }
    }, [student?.uid]);

    const loadMissionScores = async () => {
        if (!student) return;
        setLoadingScores(true);
        try {
            const scores = await getStudentMissionScores(student.uid);
            setMissionScores(scores);
        } catch (error) {
            console.error('Failed to load mission scores:', error);
        } finally {
            setLoadingScores(false);
        }
    };

    const loadAllOverrides = async () => {
        if (!student) return;
        setLoadingOverrides(true);
        try {
            const data = await getOverridesForStudent(student.uid);
            setAllOverrides(data);
        } catch {
            // Silent fail — RLS may block
        } finally {
            setLoadingOverrides(false);
        }
    };

    const loadNotes = async () => {
        if (!student) return;
        setLoadingNotes(true);
        try {
            const fetchedNotes = await getTeacherNotes(student.uid);
            setNotes(fetchedNotes);
        } catch (error) {
            console.error('Failed to load notes:', error);
        } finally {
            setLoadingNotes(false);
        }
    };

    const handleSaveNote = async () => {
        if (!student || !noteText.trim()) return;
        setSavingNote(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user;
            if (editingNote?.id) {
                // Update existing note
                await updateTeacherNote(editingNote.id, {
                    text: noteText,
                });
            } else {
                // Add new note
                await addTeacherNote({
                    student_uid: student.uid,
                    teacher_uid: currentUser?.id || 'unknown',
                    text: noteText,
                });
            }

            // Reset form and reload notes
            setNoteText('');
            setNotePriority('medium');
            setShowNoteForm(false);
            setEditingNote(null);
            await loadNotes();
        } catch (error) {
            console.error('Failed to save note:', error);
        } finally {
            setSavingNote(false);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        setDeletingNoteId(noteId);
        try {
            await deleteTeacherNote(noteId);
            await loadNotes();
        } catch (error) {
            console.error('Failed to delete note:', error);
        } finally {
            setDeletingNoteId(null);
        }
    };

    const startEditNote = (note: TeacherNote) => {
        setEditingNote(note);
        setNoteText(note.text || '');
        setNotePriority('medium');
        setShowNoteForm(true);
    };

    const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-600 border-red-200';
            case 'medium': return 'bg-lab-gold text-lab-gold border-lab-gold';
            case 'low': return 'bg-lab-sage text-lab-sage border-lab-sage';
        }
    };

    const getPriorityEmoji = (priority: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high': return '🔴';
            case 'medium': return '🟡';
            case 'low': return '🟢';
        }
    };

    if (!student) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center md:justify-center md:p-4" onClick={onClose}>
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="student-modal-title" className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-lab-muted flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-lab-muted">{student.displayName}</h2>
                            <p className="text-xs text-lab-muted">{student.identifier}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-lab-muted rounded-xl">
                        <X size={18} className="text-lab-muted" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-4 border-b border-lab-muted flex gap-4 shrink-0">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-lab-muted hover:text-lab-muted'}`}
                    >
                        Overzicht
                    </button>
                    <button
                        onClick={() => setActiveTab('missions')}
                        className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'missions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-lab-muted hover:text-lab-muted'}`}
                    >
                        Missies
                    </button>
                    <button
                        onClick={() => setActiveTab('slo')}
                        className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'slo' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-lab-muted hover:text-lab-muted'}`}
                    >
                        SLO Doelen
                    </button>
                    <button
                        onClick={() => setActiveTab('overrides')}
                        className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'overrides' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-lab-muted hover:text-lab-muted'}`}
                    >
                        <Shield size={11} />
                        Overrides
                        {allOverrides.length > 0 && (
                            <span className="bg-indigo-100 text-indigo-600 text-[9px] font-black px-1.5 py-0.5 rounded-full">{allOverrides.length}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('groei')}
                        className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'groei' ? 'border-lab-sage text-lab-sage' : 'border-transparent text-lab-muted hover:text-lab-muted'}`}
                    >
                        Groei
                    </button>
                    {student.stats?.nulmetingResult && (
                        <button
                            onClick={() => setActiveTab('paspoort')}
                            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'paspoort' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-lab-muted hover:text-lab-muted'}`}
                        >
                            Paspoort
                        </button>
                    )}
                </div>

                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    {activeTab === 'missions' ? (
                        <MissionScoresView
                            student={student}
                            missionScores={missionScores}
                            loading={loadingScores}
                            overrides={allOverrides}
                            onOverride={(missionId, missionTitle) => setOverrideMission({ id: missionId, title: missionTitle })}
                        />
                    ) : activeTab === 'overrides' ? (
                        <OverrideHistoryView
                            overrides={allOverrides}
                            loading={loadingOverrides}
                        />
                    ) : activeTab === 'slo' ? (
                        <SLOProgressPanel student={student} />
                    ) : activeTab === 'groei' ? (
                        <GrowthStudentTab studentId={student.uid} />
                    ) : activeTab === 'paspoort' && student.stats?.nulmetingResult ? (
                        <Suspense fallback={<div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" /></div>}>
                            <div className="rounded-2xl overflow-hidden [&>div]:min-h-0 [&>div]:p-4">
                                <LazyDigitaalPaspoort result={student.stats.nulmetingResult} onContinue={() => setActiveTab('overview')} />
                            </div>
                        </Suspense>
                    ) : (
                        <>
                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-lab-muted rounded-xl p-3 text-center">
                                    <div className="text-xl font-black text-lab-muted">{student.stats?.xp || 0}</div>
                                    <div className="text-[9px] text-lab-muted font-bold uppercase">XP</div>
                                </div>
                                <div className="bg-indigo-50 rounded-xl p-3 text-center">
                                    <div className="text-xl font-black text-indigo-600">{student.stats?.level || 1}</div>
                                    <div className="text-[9px] text-indigo-400 font-bold uppercase">Level</div>
                                </div>
                                <div className="bg-lab-sage rounded-xl p-3 text-center">
                                    <div className="text-xl font-black text-lab-sage">{student.stats?.missionsCompleted?.length || 0}</div>
                                    <div className="text-[9px] text-lab-sage font-bold uppercase">Missies</div>
                                </div>
                            </div>

                            {/* Badges */}
                            <div>
                                <h3 className="text-[10px] font-black text-lab-muted uppercase mb-2">Badges</h3>
                                <div className="flex flex-wrap gap-1">
                                    {(student.stats?.badges || []).length > 0 ? (
                                        (student.stats?.badges || []).map(b => {
                                            const badge = AVAILABLE_BADGES.find(ab => ab.id === b);
                                            return badge ? (
                                                <span key={b} className="text-xl" title={badge.name}>{badge.emoji}</span>
                                            ) : null;
                                        })
                                    ) : (
                                        <span className="text-lab-muted text-xs">Nog geen badges</span>
                                    )}
                                </div>
                            </div>

                            {/* Teacher Notes Section */}
                            <div className="border-t border-lab-muted pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[10px] font-black text-lab-muted uppercase flex items-center gap-2">
                                        <StickyNote size={12} />
                                        Docentnotities ({notes.length})
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setEditingNote(null);
                                            setNoteText('');
                                            setNotePriority('medium');
                                            setShowNoteForm(!showNoteForm);
                                        }}
                                        className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                    >
                                        <Plus size={12} />
                                        Nieuw
                                    </button>
                                </div>

                                {/* Note Form */}
                                <AnimatePresence>
                                    {showNoteForm && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mb-3 overflow-hidden"
                                        >
                                            <div className="bg-lab-muted rounded-xl p-3 space-y-3">
                                                <textarea
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                    placeholder="Schrijf een notitie..."
                                                    className="w-full p-3 border border-lab-muted rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                    rows={3}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-lab-muted">Prioriteit:</span>
                                                    {(['low', 'medium', 'high'] as const).map(p => (
                                                        <button
                                                            key={p}
                                                            onClick={() => setNotePriority(p)}
                                                            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${notePriority === p
                                                                ? getPriorityColor(p) + ' ring-2 ring-offset-1'
                                                                : 'bg-lab-muted text-lab-muted hover:bg-lab-muted'
                                                                }`}
                                                        >
                                                            {getPriorityEmoji(p)} {p === 'high' ? 'Hoog' : p === 'medium' ? 'Medium' : 'Laag'}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleSaveNote}
                                                        disabled={!noteText.trim() || savingNote}
                                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                                    >
                                                        {savingNote ? <Loader2 size={14} className="animate-spin" /> : null}
                                                        {editingNote ? 'Bijwerken' : 'Opslaan'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowNoteForm(false);
                                                            setEditingNote(null);
                                                            setNoteText('');
                                                        }}
                                                        className="px-3 py-2 bg-lab-muted text-lab-muted rounded-lg text-xs font-bold hover:bg-lab-muted transition-colors"
                                                    >
                                                        Annuleren
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Notes List */}
                                {loadingNotes ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 size={20} className="animate-spin text-lab-muted" />
                                    </div>
                                ) : notes.length === 0 ? (
                                    <div className="text-center py-4 text-lab-muted text-xs">
                                        Nog geen notities voor deze leerling
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {notes.map(note => (
                                            <div
                                                key={note.id}
                                                className={`p-3 rounded-xl border ${getPriorityColor((note.category as any) || 'medium')} relative group`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <p className="text-sm text-lab-muted">{note.text}</p>
                                                        <p className="text-[10px] text-lab-muted mt-1">
                                                            {note.created_at ? new Date(note.created_at).toLocaleDateString('nl-NL') : 'Recent'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => startEditNote(note)}
                                                            className="p-1.5 bg-white/50 hover:bg-white rounded-lg transition-colors"
                                                            title="Bewerken"
                                                        >
                                                            <Edit2 size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => note.id && handleDeleteNote(note.id)}
                                                            disabled={deletingNoteId === note.id}
                                                            className="p-1.5 bg-white/50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                                            title="Verwijderen"
                                                        >
                                                            {deletingNoteId === note.id ? (
                                                                <Loader2 size={12} className="animate-spin" />
                                                            ) : (
                                                                <Trash2 size={12} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions Hierarchy */}
                            <div className="border-t border-lab-muted pt-4 space-y-4">
                                {/* Interaction Actions */}
                                <div>
                                    <h3 className="text-[10px] font-black text-lab-muted uppercase tracking-widest mb-3">Directe Interactie</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={onMessage}
                                            className="flex items-center justify-center gap-2 p-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors"
                                        >
                                            <Send size={14} /> Bericht
                                        </button>
                                        <button
                                            onClick={() => setShowXPModal(true)}
                                            className="flex items-center justify-center gap-2 p-3 bg-lab-sage text-lab-sage rounded-xl font-bold text-xs hover:bg-lab-sage transition-colors"
                                        >
                                            <Zap size={14} /> + XP
                                        </button>
                                        <button
                                            onClick={onBadge}
                                            className="flex items-center justify-center gap-2 p-3 bg-lab-gold text-lab-gold rounded-xl font-bold text-xs hover:bg-lab-gold transition-colors"
                                        >
                                            <Award size={14} /> Badge
                                        </button>
                                        <button
                                            onClick={onHighlight}
                                            className="flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-600 rounded-xl font-bold text-xs hover:bg-purple-100 transition-colors"
                                        >
                                            <Star size={14} /> Uitblinker
                                        </button>
                                    </div>
                                </div>

                                {/* Monitoring Actions */}
                                <div>
                                    <h3 className="text-[10px] font-black text-lab-muted uppercase tracking-widest mb-3">Monitoring & Hulp</h3>
                                    <button
                                        onClick={onLiveView}
                                        className="w-full flex items-center justify-center gap-2 p-3 bg-sky-50 text-sky-600 rounded-xl font-bold text-xs hover:bg-sky-100 transition-colors"
                                    >
                                        <Eye size={14} /> Live Meekijken
                                    </button>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-red-50/50 rounded-2xl p-3 border border-red-100">
                                    <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">Gevaarlijke Acties</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={onReset}
                                            className="flex items-center justify-center gap-2 p-2.5 bg-white text-red-600 border border-red-100 rounded-xl font-bold text-[10px] hover:bg-red-50 transition-colors"
                                        >
                                            <RotateCcw size={12} /> Reset Voortgang
                                        </button>
                                        <button
                                            onClick={onDelete}
                                            className="flex items-center justify-center gap-2 p-2.5 bg-white text-red-600 border border-red-100 rounded-xl font-bold text-[10px] hover:bg-red-50 transition-colors"
                                        >
                                            <X size={12} /> Verwijder
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Award XP Modal */}
            <AwardXPModal
                student={showXPModal ? student : null}
                onClose={() => setShowXPModal(false)}
                onSuccess={() => {
                    // Optionally refresh parent data
                }}
            />

            {/* Step Override Modal */}
            {overrideMission && student && (() => {
                const agent = ROLES.find(r => r.id === overrideMission.id);
                const steps = (agent?.steps || []).map(s => ({
                    title: s.title,
                    description: s.description,
                }));
                const missionProgress = student.stats?.missionProgress?.[overrideMission.id];
                const completedSteps: number[] = missionProgress?.completedSteps || [];

                return (
                    <StepOverrideModal
                        studentId={student.uid}
                        studentName={student.displayName || 'Leerling'}
                        missionId={overrideMission.id}
                        missionTitle={overrideMission.title}
                        steps={steps}
                        completedSteps={completedSteps}
                        onClose={() => setOverrideMission(null)}
                        onSuccess={() => {
                            loadAllOverrides();
                        }}
                    />
                );
            })()}
        </div>
    );
};

// --- Mission Scores sub-view ---
const MissionScoresView: React.FC<{
    student: StudentData;
    missionScores: StudentMissionScore[];
    loading: boolean;
    overrides: TeacherOverride[];
    onOverride: (missionId: string, missionTitle: string) => void;
}> = ({ student, missionScores, loading, overrides, onOverride }) => {
    const yearGroup = student.stats?.yearGroup || 1;
    const allMissions = getMissionsForYear(yearGroup);
    const completedIds = student.stats?.missionsCompleted || [];

    const scoreMap = new Map<string, StudentMissionScore>();
    missionScores.forEach(s => scoreMap.set(s.mission_id, s));

    const getOverrideCount = (missionId: string): number => {
        return overrides.filter(o => o.mission_id === missionId).length;
    };

    const hasRejections = (missionId: string): boolean => {
        return overrides.some(o => o.mission_id === missionId && o.override_type === 'reject');
    };

    const getStatus = (missionId: string): 'completed' | 'in_progress' | 'not_started' => {
        if (completedIds.includes(missionId)) return 'completed';
        const scoreEntry = scoreMap.get(missionId);
        if (scoreEntry && scoreEntry.status === 'in_progress') return 'in_progress';
        return 'not_started';
    };

    const statusLabel = (s: 'completed' | 'in_progress' | 'not_started') => {
        switch (s) {
            case 'completed': return 'Afgerond';
            case 'in_progress': return 'Bezig';
            case 'not_started': return 'Niet gestart';
        }
    };

    const statusColor = (s: 'completed' | 'in_progress' | 'not_started') => {
        switch (s) {
            case 'completed': return 'bg-lab-sage text-lab-sage';
            case 'in_progress': return 'bg-lab-gold text-lab-gold';
            case 'not_started': return 'bg-lab-muted text-lab-muted';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-lab-muted" />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-lab-muted uppercase flex items-center gap-2">
                    <Target size={12} /> Missie Voortgang ({completedIds.length}/{allMissions.length})
                </h3>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-lab-muted rounded-full h-2">
                <div
                    className="bg-lab-sage h-2 rounded-full transition-all"
                    style={{ width: `${allMissions.length > 0 ? (completedIds.length / allMissions.length) * 100 : 0}%` }}
                />
            </div>

            {/* Mission cards */}
            <div className="space-y-2">
                {allMissions.map(mission => {
                    const status = getStatus(mission.id);
                    const scoreEntry = scoreMap.get(mission.id);
                    const score = scoreEntry?.score;
                    const lastActive = scoreEntry?.updated_at;
                    const overrideCount = getOverrideCount(mission.id);
                    const rejected = hasRejections(mission.id);
                    const agent = ROLES.find(r => r.id === mission.id);
                    const hasSteps = agent?.steps && agent.steps.length > 0;

                    return (
                        <div key={mission.id} className="flex items-center gap-3 p-3 bg-lab-muted rounded-xl">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${statusColor(status)}`}>
                                {status === 'completed' ? '✓' : mission.short[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-lab-muted truncate">{mission.name}</span>
                                    {overrideCount > 0 && (
                                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                            rejected ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
                                        }`}>
                                            <Shield size={8} />
                                            {overrideCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${statusColor(status)}`}>
                                        {statusLabel(status)}
                                    </span>
                                    {lastActive && (
                                        <span className="flex items-center gap-1 text-[9px] text-lab-muted">
                                            <Clock size={8} />
                                            {new Date(lastActive).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {score !== null && score !== undefined && (
                                <div className="text-right mr-1">
                                    <div className={`text-lg font-black ${score >= 70 ? 'text-lab-sage' : score >= 50 ? 'text-lab-gold' : 'text-red-500'}`}>
                                        {score}%
                                    </div>
                                    <div className="text-[8px] font-bold text-lab-muted uppercase">Score</div>
                                </div>
                            )}
                            {hasSteps && (
                                <button
                                    onClick={() => onOverride(mission.id, mission.name)}
                                    className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0"
                                    title="Stappen overriden"
                                    aria-label={`Override stappen voor ${mission.name}`}
                                >
                                    <Shield size={16} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {allMissions.length === 0 && (
                <div className="text-center py-4 text-lab-muted text-xs">
                    Geen missies gevonden voor leerjaar {yearGroup}
                </div>
            )}
        </div>
    );
};

// --- Override History sub-view ---
const OverrideHistoryView: React.FC<{
    overrides: TeacherOverride[];
    loading: boolean;
}> = ({ overrides, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin motion-reduce:animate-none text-lab-muted" />
            </div>
        );
    }

    if (overrides.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-12 h-12 bg-lab-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield size={20} className="text-lab-muted" />
                </div>
                <p className="text-sm font-bold text-lab-muted">Geen overrides</p>
                <p className="text-xs text-lab-muted mt-1">
                    Ga naar de tab &quot;Missies&quot; om AI-beoordelingen te overrulen.
                </p>
            </div>
        );
    }

    // Group overrides by mission
    const byMission = new Map<string, TeacherOverride[]>();
    for (const o of overrides) {
        const list = byMission.get(o.mission_id) || [];
        list.push(o);
        byMission.set(o.mission_id, list);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-lab-muted uppercase flex items-center gap-2">
                    <Shield size={12} /> Override Geschiedenis ({overrides.length})
                </h3>
            </div>

            <div className="bg-indigo-50 rounded-xl p-3 flex items-start gap-3">
                <AlertCircle size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-700">
                    Alle overrides worden gelogd voor verantwoording conform EU AI Act Art. 14 (menselijk toezicht).
                </p>
            </div>

            {Array.from(byMission.entries()).map(([missionId, missionOverrides]) => {
                const agent = ROLES.find(r => r.id === missionId);
                const missionTitle = agent?.title || missionId;

                return (
                    <div key={missionId} className="space-y-2">
                        <h4 className="text-xs font-black text-lab-muted">{missionTitle}</h4>
                        {missionOverrides.map(o => {
                            const stepTitle = agent?.steps?.[o.step_number]?.title || `Stap ${o.step_number + 1}`;

                            return (
                                <div key={o.id} className={`p-3 rounded-xl border ${
                                    o.override_type === 'approve'
                                        ? 'bg-lab-sage border-lab-sage'
                                        : 'bg-red-50 border-red-100'
                                }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        {o.override_type === 'approve' ? (
                                            <CheckCircle2 size={14} className="text-lab-sage" />
                                        ) : (
                                            <XCircle size={14} className="text-red-600" />
                                        )}
                                        <span className="font-bold text-sm text-lab-muted">
                                            Stap {o.step_number + 1}: {stepTitle}
                                        </span>
                                        <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                            o.override_type === 'approve'
                                                ? 'bg-lab-sage text-lab-sage'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {o.override_type === 'approve' ? 'Goedgekeurd' : 'Afgewezen'}
                                        </span>
                                    </div>
                                    {o.reason && (
                                        <p className="text-xs text-lab-muted italic mt-1">&ldquo;{o.reason}&rdquo;</p>
                                    )}
                                    <p className="text-[9px] text-lab-muted mt-1 flex items-center gap-1">
                                        <Clock size={8} />
                                        {new Date(o.created_at).toLocaleDateString('nl-NL', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
