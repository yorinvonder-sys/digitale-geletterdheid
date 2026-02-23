
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, GraduationCap, Target, Send, Sparkles, Trophy, AlertTriangle } from 'lucide-react';
import { StudentData, ClassroomConfig } from '../../../types';
import { AVAILABLE_BADGES } from '../../../config/badges';
import { FocusMissionSelector } from '../FocusMissionSelector';
import { TeacherPresentation } from '../../TeacherPresentation';
import { StudentModal } from '../StudentModal';
import { LiveStudentModal } from '../LiveStudentModal';

interface TeacherModalsProps {
    // Message Modal
    showMessageModal: boolean;
    setShowMessageModal: (show: boolean) => void;
    messageText: string;
    setMessageText: (text: string) => void;
    messageTarget: 'student' | 'class' | 'all';
    setMessageTarget: (target: 'student' | 'class' | 'all') => void;
    messageTargetClassId: string;
    setMessageTargetClassId: (id: string) => void;
    messageTargetStudentId: string;
    setMessageTargetStudentId: (id: string) => void;
    handleSendMessage: () => void;
    classGroups: string[];
    students: StudentData[];

    // Badge Modal
    showBadgeModal: boolean;
    setShowBadgeModal: (show: boolean) => void;
    selectedBadge: string;
    setSelectedBadge: (badge: string) => void;
    handleAwardBadge: () => void;
    selectedStudent: StudentData | null;

    // Reset Modal
    showResetConfirm: boolean;
    setShowResetConfirm: (show: boolean) => void;
    handleResetStudent: () => void;

    // Highlight Modal
    showHighlightModal: boolean;
    setShowHighlightModal: (show: boolean) => void;
    highlightTitle: string;
    setHighlightTitle: (title: string) => void;
    highlightContent: string;
    setHighlightContent: (content: string) => void;
    highlightNote: string;
    setHighlightNote: (note: string) => void;
    handleHighlightWork: () => void;

    // Event Modal
    showEventModal: boolean;
    setShowEventModal: (show: boolean) => void;
    eventName: string;
    setEventName: (name: string) => void;
    eventMultiplier: number;
    setEventMultiplier: (m: number) => void;
    eventDuration: number;
    setEventDuration: (d: number) => void;
    handleCreateEvent: () => void;

    // Delete Modal
    studentToDelete: StudentData | null;
    setStudentToDelete: (s: StudentData | null) => void;
    isDeleting: boolean;
    confirmDelete: () => void;

    // Focus Mission Modal
    showFocusMissionModal: boolean;
    setShowFocusMissionModal: (show: boolean) => void;
    handleFocusMissionSelect: (missionId: string, missionTitle: string, selectedClass?: string) => void;

    // Presentation Modal
    showPresentation: boolean;
    setShowPresentation: (show: boolean) => void;

    // Student Detail/Live Modals
    setSelectedStudent: (s: StudentData | null) => void;
    awardXP: (uid: string, amount: number) => void;
    showLiveModal: boolean;
    setShowLiveModal: (show: boolean) => void;
    handleDeleteStudent: (s: StudentData) => void;
}

export const TeacherModals: React.FC<TeacherModalsProps> = (props) => {
    const {
        showMessageModal, setShowMessageModal, messageText, setMessageText,
        messageTarget, setMessageTarget, messageTargetClassId, setMessageTargetClassId,
        messageTargetStudentId, setMessageTargetStudentId, handleSendMessage,
        classGroups, students,
        showBadgeModal, setShowBadgeModal, selectedBadge, setSelectedBadge, handleAwardBadge, selectedStudent,
        showResetConfirm, setShowResetConfirm, handleResetStudent,
        showHighlightModal, setShowHighlightModal, highlightTitle, setHighlightTitle,
        highlightContent, setHighlightContent, highlightNote, setHighlightNote, handleHighlightWork,
        showEventModal, setShowEventModal, eventName, setEventName,
        eventMultiplier, setEventMultiplier, eventDuration, setEventDuration, handleCreateEvent,
        studentToDelete, setStudentToDelete, isDeleting, confirmDelete,
        showFocusMissionModal, setShowFocusMissionModal, handleFocusMissionSelect,
        showPresentation, setShowPresentation,
        setSelectedStudent, awardXP, showLiveModal, setShowLiveModal, handleDeleteStudent
    } = props;

    return (
        <>
            {/* STUDENT MODAL */}
            <StudentModal
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
                onMessage={() => {
                    if (selectedStudent) {
                        setMessageTarget('student');
                        setMessageTargetStudentId(selectedStudent.uid);
                        const classMatch = selectedStudent.identifier?.match(/^([A-Z]{2,3}\d[A-Z])/);
                        if (classMatch) {
                            setMessageTargetClassId(classMatch[1]);
                        }
                    }
                    setShowMessageModal(true);
                }}
                onBadge={() => setShowBadgeModal(true)}
                onReset={() => setShowResetConfirm(true)}
                onHighlight={() => setShowHighlightModal(true)}
                onAwardXP={(amount) => awardXP(selectedStudent?.uid || '', amount)}
                onLiveView={() => setShowLiveModal(true)}
                onDelete={() => selectedStudent && handleDeleteStudent(selectedStudent)}
            />

            {/* LIVE VIEW MODAL */}
            {showLiveModal && (
                <LiveStudentModal
                    student={selectedStudent}
                    onClose={() => setShowLiveModal(false)}
                />
            )}

            {/* MESSAGE MODAL */}
            {showMessageModal && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowMessageModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                            <Send className="text-indigo-500" size={20} />
                            Bericht Versturen
                        </h3>
                        <div className="space-y-4">
                            {/* Target Type Selector */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Verstuur naar</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'all', label: 'Iedereen', icon: Users },
                                        { id: 'class', label: 'Klas', icon: GraduationCap },
                                        { id: 'student', label: 'Leerling', icon: Target }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setMessageTarget(opt.id as any)}
                                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${messageTarget === opt.id
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            <opt.icon size={18} />
                                            <span className="text-xs font-bold">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Class Selector */}
                            {(messageTarget === 'class' || messageTarget === 'student') && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                                        {messageTarget === 'class' ? 'Selecteer Klas' : 'Selecteer eerst een Klas'}
                                    </label>
                                    <select
                                        value={messageTargetClassId}
                                        onChange={(e) => {
                                            setMessageTargetClassId(e.target.value);
                                            setMessageTargetStudentId('');
                                        }}
                                        className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium bg-white"
                                    >
                                        <option value="">-- Kies een klas --</option>
                                        {classGroups.map(g => (
                                            <option key={g} value={g}>{g} ({students.filter(s => s.identifier?.startsWith(g)).length} leerlingen)</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Student Selector */}
                            {messageTarget === 'student' && messageTargetClassId && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Selecteer Leerling</label>
                                    <select
                                        value={messageTargetStudentId}
                                        onChange={(e) => setMessageTargetStudentId(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium bg-white"
                                    >
                                        <option value="">-- Kies een leerling --</option>
                                        {students
                                            .filter(s => s.identifier?.startsWith(messageTargetClassId))
                                            .sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''))
                                            .map(s => (
                                                <option key={s.uid} value={s.uid}>{s.displayName || 'Naamloos'} ({s.identifier})</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )}

                            {/* Message Text */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Bericht</label>
                                <textarea
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Typ je bericht..."
                                    className="w-full p-3 border border-slate-200 rounded-xl text-sm resize-none h-28 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                ></textarea>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => {
                                        setShowMessageModal(false);
                                        setMessageTarget('all');
                                        setMessageTargetClassId('');
                                        setMessageTargetStudentId('');
                                        setMessageText('');
                                    }}
                                    className="flex-1 py-3 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Annuleer
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={
                                        !messageText.trim() ||
                                        (messageTarget === 'class' && !messageTargetClassId) ||
                                        (messageTarget === 'student' && !messageTargetStudentId)
                                    }
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send size={16} />
                                    Verstuur
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BADGE MODAL */}
            {showBadgeModal && selectedStudent && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowBadgeModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-black text-slate-900 mb-4">Badge Toekennen</h3>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {AVAILABLE_BADGES.map(badge => (
                                <button
                                    key={badge.id}
                                    onClick={() => setSelectedBadge(badge.id)}
                                    className={`p-3 rounded-xl text-2xl transition-all ${selectedBadge === badge.id ? 'bg-amber-100 ring-2 ring-amber-400' : 'bg-slate-50 hover:bg-slate-100'}`}
                                    title={badge.name}
                                >
                                    {badge.emoji}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowBadgeModal(false)} className="flex-1 py-2 text-slate-500 font-bold rounded-xl hover:bg-slate-50">Annuleer</button>
                            <button onClick={handleAwardBadge} disabled={!selectedBadge} className="flex-1 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50">Toekennen</button>
                        </div>
                    </div>
                </div>
            )}

            {/* RESET CONFIRM */}
            {showResetConfirm && selectedStudent && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowResetConfirm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">⚠️</div>
                            <h3 className="text-lg font-black text-slate-900">Weet je het zeker?</h3>
                            <p className="text-sm text-slate-500 mt-2">Dit reset alle XP, level en voltooide missies van {selectedStudent.displayName}.</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2 text-slate-500 font-bold rounded-xl hover:bg-slate-50">Annuleer</button>
                            <button onClick={handleResetStudent} className="flex-1 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600">Reset</button>
                        </div>
                    </div>
                </div>
            )}

            {/* HIGHLIGHT MODAL */}
            {showHighlightModal && selectedStudent && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowHighlightModal(false)}>
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                            <Trophy size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Kroon op het Werk</h3>
                        <p className="text-slate-500 font-medium mb-6">Highlight een bijzondere prestatie van {selectedStudent.displayName} voor de hele klas.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 border border-slate-200 px-2 py-1 rounded-lg uppercase tracking-widest mb-2 inline-block">Titel van de prestatie</label>
                                <input
                                    type="text"
                                    value={highlightTitle}
                                    onChange={(e) => setHighlightTitle(e.target.value)}
                                    placeholder="Bijv. Meesterlijke Prompt..."
                                    className="w-full p-4 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-amber-400 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 border border-slate-200 px-2 py-1 rounded-lg uppercase tracking-widest mb-2 inline-block">Inhoud / Prompt</label>
                                <textarea
                                    value={highlightContent}
                                    onChange={(e) => setHighlightContent(e.target.value)}
                                    placeholder="Wat was er zo goed?"
                                    className="w-full p-4 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-amber-400 outline-none transition-all resize-none h-32"
                                ></textarea>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 border border-slate-200 px-2 py-1 rounded-lg uppercase tracking-widest mb-2 inline-block">Jouw compliment (Optioneel)</label>
                                <input
                                    type="text"
                                    value={highlightNote}
                                    onChange={(e) => setHighlightNote(e.target.value)}
                                    placeholder="Top gedaan!"
                                    className="w-full p-4 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-amber-400 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowHighlightModal(false)} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-50 transition-all">Annuleer</button>
                            <button
                                onClick={handleHighlightWork}
                                disabled={!highlightTitle || !highlightContent}
                                className="flex-1 py-4 bg-amber-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-amber-600 shadow-lg shadow-amber-200 disabled:opacity-50 transition-all"
                            >
                                In de Gallerij
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EVENT MODAL */}
            {showEventModal && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowEventModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                            <Sparkles className="text-purple-500" /> XP Boost Event
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Naam</label>
                                <input
                                    type="text"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    placeholder="Bijv. Vrijdag Bonus"
                                    className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Duur</label>
                                    <select
                                        value={eventDuration}
                                        onChange={(e) => setEventDuration(Number(e.target.value))}
                                        className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                                    >
                                        <option value={30}>30 min</option>
                                        <option value={60}>1 uur</option>
                                        <option value={120}>2 uur</option>
                                        <option value={480}>8 uur (hele dag)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Multiplier</label>
                                    <select
                                        value={eventMultiplier}
                                        onChange={(e) => setEventMultiplier(Number(e.target.value))}
                                        className="w-full p-2 border border-slate-200 rounded-xl text-sm"
                                    >
                                        <option value={1.5}>1.5x XP</option>
                                        <option value={2}>2x XP</option>
                                        <option value={3}>3x XP</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setShowEventModal(false)} className="flex-1 py-2 text-slate-500 font-bold rounded-xl hover:bg-slate-50">Annuleer</button>
                                <button onClick={handleCreateEvent} className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg">Start Event</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {studentToDelete && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setStudentToDelete(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <AlertTriangle className="text-red-600" size={24} />
                        </div>
                        <h3 className="text-lg font-black text-center text-slate-900 mb-2">
                            Leerling Verwijderen?
                        </h3>
                        <p className="text-center text-slate-500 text-sm mb-6">
                            Weet je zeker dat je <span className="font-bold text-slate-700">{studentToDelete.displayName || 'deze leerling'}</span> wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStudentToDelete(null)}
                                className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                disabled={isDeleting}
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Bezig...' : 'Verwijderen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Focus Mission Selector Modal */}
            <FocusMissionSelector
                isOpen={showFocusMissionModal}
                onClose={() => setShowFocusMissionModal(false)}
                onSelect={handleFocusMissionSelect}
                availableClasses={classGroups}
                students={students}
            />

            {showPresentation && (
                <TeacherPresentation
                    activeWeekId="week-1"
                    onClose={() => setShowPresentation(false)}
                />
            )}
        </>
    );
};
