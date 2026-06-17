import React from 'react';
import { DuckMascot } from './DuckMascot';
import type { KeesMood } from './DuckMascot';
import { duckUi } from '@/config/duckUi';

interface KeesMessageProps {
    message: React.ReactNode;
    mood?: KeesMood;
    layout?: 'row' | 'stacked';
    align?: 'start' | 'end';
    showDuck?: boolean;
    showName?: boolean;
    duckClassName?: string;
    className?: string;
}

export const KeesMessage: React.FC<KeesMessageProps> = ({
    message,
    mood = 'idle',
    layout = 'row',
    align = 'start',
    showDuck = true,
    showName = true,
    duckClassName = 'h-12 w-12',
    className = '',
}) => {
    const duck = showDuck ? (
        <div className="flex shrink-0 items-center justify-center rounded-[1.5rem] bg-duck-acid shadow-duck-soft" style={{ padding: '0.5rem' }}>
            <DuckMascot className={duckClassName} mood={mood} />
        </div>
    ) : null;

    const bubble = (
        <div className={`${duckUi.card} animate-duck-rise motion-reduce:animate-none px-4 py-3 ${layout === 'stacked' ? 'w-full text-center' : 'min-w-0 flex-1'}`}>
            {showName && (
                <div className={`mb-1.5 flex items-center gap-1.5 ${layout === 'stacked' ? 'justify-center' : ''}`}>
                    <span className="block h-1.5 w-1.5 rounded-full bg-duck-acid" aria-hidden="true" />
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-duck-ink/65">Kees</span>
                </div>
            )}
            <p className="text-sm leading-relaxed text-duck-ink">{message}</p>
        </div>
    );

    if (layout === 'stacked') {
        return (
            <div className={`flex flex-col items-center gap-3 ${className}`}>
                {duck}
                {bubble}
            </div>
        );
    }

    // row layout
    const items = align === 'end' ? [bubble, duck] : [duck, bubble];
    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            {items[0]}
            {items[1]}
        </div>
    );
};
