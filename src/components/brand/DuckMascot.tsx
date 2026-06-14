import React, { useRef, useEffect } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function DuckMascot({ className }: { className?: string }) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const reduceMotion = usePrefersReducedMotion();

    useEffect(() => {
        if (reduceMotion || typeof window === 'undefined') return;
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const el = wrapRef.current;
        if (!el) return;

        let raf = 0;
        const onMove = (event: MouseEvent) => {
            if (raf) return;
            raf = window.requestAnimationFrame(() => {
                raf = 0;
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = event.clientX - cx;
                const dy = event.clientY - cy;
                const dist = Math.hypot(dx, dy) || 1;
                const max = rect.width * 0.07;
                el.style.setProperty('--eye-x', `${(dx / dist) * max}px`);
                el.style.setProperty('--eye-y', `${(dy / dist) * max}px`);
            });
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', onMove);
            if (raf) window.cancelAnimationFrame(raf);
        };
    }, [reduceMotion]);

    return (
        <div ref={wrapRef} className={`relative ${className ?? ''}`} aria-hidden="true">
            <svg viewBox="0 0 64 64" className="size-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M34 4.5c-3-1.3-6.4.3-7.5 3.4" fill="none" stroke="#202023" strokeWidth="3.8" strokeLinecap="round" />
                <circle cx="32" cy="34" r="25.5" fill="#e1ff01" stroke="#202023" strokeWidth="4.5" />
                <rect x="23" y="44" width="18" height="9" rx="4.5" fill="#ffffff" stroke="#202023" strokeWidth="3.8" />
            </svg>
            <span className="absolute left-[29%] top-[34%] block h-[28%] w-[17%] animate-duck-blink motion-reduce:animate-none">
                <span className="block size-full rounded-full bg-duck-ink" style={{ transform: 'translate(var(--eye-x, 0px), var(--eye-y, 0px))' }} />
            </span>
            <span className="absolute left-[54%] top-[34%] block h-[28%] w-[17%] animate-duck-blink motion-reduce:animate-none">
                <span className="block size-full rounded-full bg-duck-ink" style={{ transform: 'translate(var(--eye-x, 0px), var(--eye-y, 0px))' }} />
            </span>
        </div>
    );
}
