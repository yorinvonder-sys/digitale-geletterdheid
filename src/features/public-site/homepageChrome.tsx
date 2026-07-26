import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Gedeelde presentatie-onderdelen van de publieke landingspagina.
 *
 * Deze componenten stonden module-lokaal in `ScholenLanding.tsx`. Ze zijn hier
 * losgetrokken zodat lazy-geladen secties (zoals het game-lab) ze kunnen
 * gebruiken zonder een circulaire import terug naar `ScholenLanding.tsx`.
 */

export function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="inline-flex items-center gap-2 rounded-full border border-duck-ink bg-duck-bgLight px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-duck-ink">
            <span className="size-1.5 rounded-full bg-duck-ink" aria-hidden="true" />
            {children}
        </p>
    );
}

export function Reveal({
    children,
    className,
    delay = 0,
    y = 24,
    style,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    style?: React.CSSProperties;
}) {
    const reduceMotion = usePrefersReducedMotion();
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (reduceMotion) {
            setInView(true);
            return;
        }

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.16 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [reduceMotion]);

    if (reduceMotion) {
        return <div className={className} style={style}>{children}</div>;
    }

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                opacity: inView ? 1 : 0.92,
                transform: inView ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
                transition: `opacity 680ms cubic-bezier(.22,1,.36,1) ${delay}s, transform 680ms cubic-bezier(.22,1,.36,1) ${delay}s`,
                willChange: inView ? 'auto' : 'opacity, transform',
            }}
        >
            {children}
        </div>
    );
}
