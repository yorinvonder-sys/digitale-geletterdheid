import React, { useRef, useEffect } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function Eye({ delay = '0s' }: { delay?: string }) {
    return (
        <div
            className="animate-hero-eye-blink motion-reduce:animate-none"
            style={{ animationDelay: delay, transformOrigin: 'center top' }}
        >
            <svg viewBox="0 0 66 70" className="h-11 lg:h-14" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="33" cy="35" rx="30" ry="32" fill="#ffffff" stroke="#202023" strokeWidth="6" />
                <circle
                    cx="33"
                    cy="45"
                    r="17"
                    fill="#202023"
                    style={{ transform: 'translate(var(--eye-x,0px),var(--eye-y,0px))' }}
                />
                <circle cx="26" cy="39" r="5" fill="#ffffff" />
            </svg>
        </div>
    );
}

export function HeroEyes({ className }: { className?: string }) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const reduceMotion = usePrefersReducedMotion();

    useEffect(() => {
        if (reduceMotion || typeof window === 'undefined') return;
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const el = wrapRef.current;
        if (!el) return;

        let raf = 0;
        const onMove = (e: MouseEvent) => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = e.clientX - cx;
                const dy = e.clientY - cy;
                const dist = Math.hypot(dx, dy) || 1;
                const max = 5;
                el.style.setProperty('--eye-x', `${(dx / dist) * max}px`);
                el.style.setProperty('--eye-y', `${(dy / dist) * max}px`);
            });
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', onMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [reduceMotion]);

    return (
        <div
            ref={wrapRef}
            className={`flex items-end gap-3 ${className ?? ''}`}
            aria-hidden="true"
            style={{ '--eye-x': '0px', '--eye-y': '0px' } as React.CSSProperties}
        >
            <Eye delay="0s" />
            <Eye delay="0.14s" />
        </div>
    );
}
