import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Zap, MessageSquare, Target, Flame, Bell } from 'lucide-react';
import { Notification } from '../hooks/useNotifications';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    loading: boolean;
}

function getRelativeTime(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Zojuist';
    if (diffMinutes < 60) return `${diffMinutes} min. geleden`;
    if (diffHours < 2) return '1 uur geleden';
    if (diffHours < 24) return `${diffHours} uur geleden`;
    if (diffDays === 1) return 'Gisteren';
    if (diffDays < 7) return `${diffDays} dagen geleden`;
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

const ICON_CONFIG: Record<Notification['icon'], { component: React.FC<{ size: number }>; bg: string; color: string }> = {
    zap: { component: Zap, bg: 'bg-amber-100', color: 'text-amber-500' },
    message: { component: MessageSquare, bg: 'bg-indigo-100', color: 'text-indigo-500' },
    target: { component: Target, bg: 'bg-emerald-100', color: 'text-emerald-500' },
    flame: { component: Flame, bg: 'bg-orange-100', color: 'text-orange-500' },
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const iconConf = ICON_CONFIG[notification.icon];
    const IconComponent = iconConf.component;

    return (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-colors ${notification.read ? 'bg-white' : 'bg-indigo-50/60 border border-indigo-100'}`}>
            <div className={`flex-shrink-0 w-9 h-9 rounded-full ${iconConf.bg} flex items-center justify-center`}>
                <IconComponent size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold leading-tight truncate ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notification.title}
                    </p>
                    {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-1" />
                    )}
                </div>
                <p className="text-xs text-slate-500 leading-snug mt-0.5 line-clamp-2">{notification.message}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">{getRelativeTime(notification.timestamp)}</p>
            </div>
        </div>
    );
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    isOpen,
    onClose,
    notifications,
    loading,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="notification-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[70] bg-slate-900/30 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Slide-in panel */}
                    <motion.aside
                        key="notification-panel"
                        role="dialog"
                        aria-label="Meldingen"
                        aria-modal="true"
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 z-[80] w-full max-w-sm bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <Bell size={16} className="text-indigo-600" />
                                </div>
                                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Meldingen</h2>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Meldingen sluiten"
                                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto py-2 px-2">
                            {loading && (
                                <div className="flex flex-col gap-2 p-2 animate-pulse">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 bg-slate-100 rounded-xl" />
                                    ))}
                                </div>
                            )}

                            {!loading && notifications.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                        <Bell size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-500">Geen meldingen</p>
                                    <p className="text-xs text-slate-400 mt-1">Je hebt nog geen recente meldingen.</p>
                                </div>
                            )}

                            {!loading && notifications.length > 0 && (
                                <div className="flex flex-col gap-1">
                                    {notifications.map(notification => (
                                        <NotificationItem key={notification.id} notification={notification} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};
