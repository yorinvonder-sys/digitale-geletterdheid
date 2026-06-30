import React from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Pure-CSS confetti burst, extracted from AiLab.tsx.
 * Renders 30 falling pieces for ~2.5s then the parent should unmount.
 * Gate on reduced-motion: renders nothing when preference is set.
 */
const COLORS = ['#ff3c21', '#e1ff01', '#202023', '#ff3c21', '#ff3c21', '#ff3c21'];

interface ConfettiProps {
    /** Duration in ms the animation runs (used for the CSS animation duration). Default 2000. */
    durationMs?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ durationMs = 2000 }) => {
    const reduceMotion = usePrefersReducedMotion();
    if (reduceMotion) return null;

    const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        color: COLORS[i % COLORS.length],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        isCircle: Math.random() > 0.5,
    }));

    const durationSec = (durationMs / 1000).toFixed(1);

    return (
        <div className="fixed inset-0 pointer-events-none z-[200]">
            {pieces.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.left}%`,
                        top: '-10px',
                        width: '10px',
                        height: '10px',
                        backgroundColor: p.color,
                        borderRadius: p.isCircle ? '50%' : '2px',
                        animation: `ec-confetti-fall ${durationSec}s ease-in ${p.delay}s forwards`,
                        transform: `rotate(${p.rotation}deg)`,
                    }}
                />
            ))}
            <style>{`
                @keyframes ec-confetti-fall {
                    0%   { transform: translateY(0) rotate(0deg);    opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
