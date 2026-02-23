import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Bell } from 'lucide-react';
import { TeacherMessage } from '../services/teacherService';

interface TeacherMessagePopupProps {
    message: TeacherMessage | null;
    show: boolean;
    onDismiss: () => void;
    onMarkRead: (messageId: string) => void;
}

export const TeacherMessagePopup: React.FC<TeacherMessagePopupProps> = ({
    message,
    show,
    onDismiss,
    onMarkRead
}) => {
    if (!message) return null;

    const handleMarkRead = () => {
        if (message.id) {
            onMarkRead(message.id);
        }
        onDismiss();
    };

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
                        onClick={onDismiss}
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ type: 'spring', bounce: 0.3 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[101]"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Bericht van Docent</h3>
                                        <p className="text-white/70 text-xs">{message.sender_name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onDismiss}
                                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
                                            {message.text}
                                        </p>
                                        <p className="text-slate-400 text-xs mt-3">
                                            {message.created_at ? new Date(message.created_at).toLocaleString('nl-NL', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'Zojuist'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-6 flex gap-3">
                                <button
                                    onClick={onDismiss}
                                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                                >
                                    Later lezen
                                </button>
                                <button
                                    onClick={handleMarkRead}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                >
                                    Gelezen ✓
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
