import React from 'react';

export type KeesMood = 'idle' | 'wave' | 'cheer' | 'think';

interface DuckMascotProps {
    className?: string;
    mood?: KeesMood;
}

/**
 * DuckMascot — renders KEES, the DGSkills duck mascot.
 *
 * Source of truth: /assets/brand/ui-icons/dgskills-duck-*.webp (the real duck
 * illustration with grad cap). Mood maps to an expression variant.
 */
const MOOD_IMAGE: Record<KeesMood, string> = {
    idle: '/assets/brand/ui-icons/dgskills-duck-default.webp',
    wave: '/assets/brand/ui-icons/dgskills-duck-happy.webp',
    cheer: '/assets/brand/ui-icons/dgskills-duck-happy.webp',
    think: '/assets/brand/ui-icons/dgskills-duck-neutral.webp',
};

export function DuckMascot({ className, mood = 'idle' }: DuckMascotProps) {
    return (
        <img
            src={MOOD_IMAGE[mood]}
            alt=""
            aria-hidden="true"
            decoding="async"
            className={`object-contain animate-kees-bob motion-reduce:animate-none ${className ?? ''}`}
        />
    );
}
