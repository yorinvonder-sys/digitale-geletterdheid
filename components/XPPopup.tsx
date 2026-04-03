// XP Popup — toont floating "+{n} XP" notificaties en level-up viering.
// Gebruikt Framer Motion AnimatePresence voor vloeiende animaties.
// Respecteert de reducedMotion instelling uit AccessibilityContext.

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useXPNotifications } from '@/contexts/XPNotificationContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';

// CSS confetti animatie — geen canvas-confetti bibliotheek nodig
const CONFETTI_STYLE = `
@keyframes xp-confetti-fall {
    0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(80px) rotate(720deg); opacity: 0; }
}
.xp-confetti-piece {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    animation: xp-confetti-fall 1.2s ease-in forwards;
}
`;

// Confetti kleuren passend bij de DGSkills brandingstijl
const CONFETTI_COLORS = [
    '#6366f1', // indigo-500
    '#8b5cf6', // violet-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
    '#f43f5e', // rose-500
    '#3b82f6', // blue-500
    '#fbbf24', // yellow-400
];

const CONFETTI_COUNT = 16;

interface ConfettiProps {
    visible: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ visible }) => {
    if (!visible) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {Array.from({ length: CONFETTI_COUNT }, (_, i) => {
                const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
                const left = `${5 + (i * 6) % 90}%`;
                const delay = `${(i * 0.07).toFixed(2)}s`;
                const size = i % 3 === 0 ? 10 : i % 3 === 1 ? 6 : 8;

                return (
                    <span
                        key={i}
                        className="xp-confetti-piece"
                        style={{
                            backgroundColor: color,
                            left,
                            top: '-8px',
                            width: size,
                            height: size,
                            animationDelay: delay,
                        }}
                    />
                );
            })}
        </div>
    );
};

export const XPPopup: React.FC = () => {
    const { notifications, removeNotification } = useXPNotifications();
    const { settings } = useAccessibility();
    const { reducedMotion } = settings;
    const styleInjectedRef = useRef(false);

    // Injecteer CSS confetti animatie eenmalig
    useEffect(() => {
        if (styleInjectedRef.current) return;
        styleInjectedRef.current = true;
        const style = document.createElement('style');
        style.textContent = CONFETTI_STYLE;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
            styleInjectedRef.current = false;
        };
    }, []);

    // Auto-verwijder notificaties na 2.5 seconden (of 1.5s bij reduced motion)
    useEffect(() => {
        if (notifications.length === 0) return;

        const latest = notifications[notifications.length - 1];
        const delay = reducedMotion ? 1500 : 2500;

        const timer = setTimeout(() => {
            removeNotification(latest.id);
        }, delay);

        return () => clearTimeout(timer);
    }, [notifications, removeNotification, reducedMotion]);

    if (notifications.length === 0) return null;

    // Animatie varianten voor normale modus
    const normalVariants = {
        initial: { opacity: 0, y: 20, scale: 0.8 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.3 } },
    };

    // Animatie varianten voor reduced motion — alleen fade, geen beweging
    const reducedVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const variants = reducedMotion ? reducedVariants : normalVariants;

    return (
        <div
            className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-none"
            aria-live="polite"
            aria-label="XP notificaties"
        >
            <AnimatePresence mode="sync">
                {notifications.map((notification, index) => {
                    const isLevelUp = notification.isLevelUp;
                    const offsetY = index * 60;

                    if (isLevelUp) {
                        // Level-up viering — groter, kleurrijker, met confetti
                        return (
                            <motion.div
                                key={notification.id}
                                variants={variants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 400, damping: 25 }}
                                className="relative flex flex-col items-center gap-1 px-6 py-4 rounded-2xl shadow-2xl min-w-[180px] text-center select-none overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    marginBottom: offsetY > 0 ? `${offsetY}px` : undefined,
                                }}
                                role="status"
                                aria-label={`Level ${notification.newLevel} bereikt!`}
                            >
                                <Confetti visible={!reducedMotion} />
                                <span className="text-2xl" aria-hidden="true">🎉</span>
                                <span className="text-white font-black text-xl tracking-tight leading-none">
                                    Level {notification.newLevel}!
                                </span>
                                <span className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">
                                    Nieuw level bereikt
                                </span>
                                {notification.amount > 0 && (
                                    <span className="text-indigo-100 text-sm font-bold mt-0.5">
                                        +{notification.amount} XP
                                    </span>
                                )}
                            </motion.div>
                        );
                    }

                    // Normale XP popup
                    return (
                        <motion.div
                            key={notification.id}
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 500, damping: 30 }}
                            style={{ marginBottom: offsetY > 0 ? `${offsetY}px` : undefined }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg bg-slate-900 text-white select-none"
                            role="status"
                            aria-label={`${notification.amount} XP verdiend`}
                        >
                            <span className="text-base" aria-hidden="true">⭐</span>
                            <span className="font-black text-lg text-amber-400 leading-none">
                                +{notification.amount}
                            </span>
                            <span className="text-slate-300 text-sm font-semibold uppercase tracking-widest">
                                XP
                            </span>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
