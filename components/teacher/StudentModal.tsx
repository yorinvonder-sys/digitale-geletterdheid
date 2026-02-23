import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Send, Award, RotateCcw, Star, Zap, Eye, StickyNote, Plus, Trash2, Edit2, Loader2, AlertCircle } from 'lucide-react';
import { StudentData } from '../../types';
import { TeacherNote } from '../../services/teacherService';
import { AVAILABLE_BADGES } from '../../config/badges';
import { AwardXPModal } from './AwardXPModal';
import { addTeacherNote, getTeacherNotes, updateTeacherNote, deleteTeacherNote } from '../../services/teacherService';
import { supabase } from '../../services/supabase';
import { SLOProgressPanel } from './SLOProgressPanel';

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

    const [activeTab, setActiveTab] = useState<'overview' | 'slo'>('overview');

    // Load notes when student changes
    useEffect(() => {
        if (student) {
            loadNotes();
            setActiveTab('overview');
        } else {
            setNotes([]);
        }
    }, [student?.uid]);

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
            case 'medium': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'low': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">{student.displayName}</h2>
                            <p className="text-xs text-slate-400">{student.identifier}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-4 border-b border-slate-100 flex gap-4 shrink-0">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Overzicht
                    </button>
                    <button
                        onClick={() => setActiveTab('slo')}
                        className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'slo' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        SLO Doelen
                    </button>
                </div>

                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    {activeTab === 'slo' ? (
                        <SLOProgressPanel student={student} />
                    ) : (
                        <>
                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-slate-50 rounded-xl p-3 text-center">
                                    <div className="text-xl font-black text-slate-900">{student.stats?.xp || 0}</div>
                                    <div className="text-[9px] text-slate-400 font-bold uppercase">XP</div>
                                </div>
                                <div className="bg-indigo-50 rounded-xl p-3 text-center">
                                    <div className="text-xl font-black text-indigo-600">{student.stats?.level || 1}</div>
                                    <div className="text-[9px] text-indigo-400 font-bold uppercase">Level</div>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                    <div className="text-xl font-black text-emerald-600">{student.stats?.missionsCompleted?.length || 0}</div>
                                    <div className="text-[9px] text-emerald-400 font-bold uppercase">Missies</div>
                                </div>
                            </div>

                            {/* Badges */}
                            <div>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase mb-2">Badges</h3>
                                <div className="flex flex-wrap gap-1">
                                    {(student.stats?.badges || []).length > 0 ? (
                                        (student.stats?.badges || []).map(b => {
                                            const badge = AVAILABLE_BADGES.find(ab => ab.id === b);
                                            return badge ? (
                                                <span key={b} className="text-xl" title={badge.name}>{badge.emoji}</span>
                                            ) : null;
                                        })
                                    ) : (
                                        <span className="text-slate-400 text-xs">Nog geen badges</span>
                                    )}
                                </div>
                            </div>

                            {/* Teacher Notes Section */}
                            <div className="border-t border-slate-100 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
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
                                            <div className="bg-slate-50 rounded-xl p-3 space-y-3">
                                                <textarea
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                    placeholder="Schrijf een notitie..."
                                                    className="w-full p-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                    rows={3}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-500">Prioriteit:</span>
                                                    {(['low', 'medium', 'high'] as const).map(p => (
                                                        <button
                                                            key={p}
                                                            onClick={() => setNotePriority(p)}
                                                            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${notePriority === p
                                                                ? getPriorityColor(p) + ' ring-2 ring-offset-1'
                                                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
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
                                                        className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors"
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
                                        <Loader2 size={20} className="animate-spin text-slate-400" />
                                    </div>
                                ) : notes.length === 0 ? (
                                    <div className="text-center py-4 text-slate-400 text-xs">
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
                                                        <p className="text-sm text-slate-700">{note.text}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">
                                                            {note.created_at ? new Date(note.created_at).toLocaleDateString('nl-NL') : 'Recent'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                            <div className="border-t border-slate-100 pt-4 space-y-4">
                                {/* Interaction Actions */}
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Directe Interactie</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={onMessage}
                                            className="flex items-center justify-center gap-2 p-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors"
                                        >
                                            <Send size={14} /> Bericht
                                        </button>
                                        <button
                                            onClick={() => setShowXPModal(true)}
                                            className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors"
                                        >
                                            <Zap size={14} /> + XP
                                        </button>
                                        <button
                                            onClick={onBadge}
                                            className="flex items-center justify-center gap-2 p-3 bg-amber-50 text-amber-600 rounded-xl font-bold text-xs hover:bg-amber-100 transition-colors"
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
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Monitoring & Hulp</h3>
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
        </div>
    );
};
