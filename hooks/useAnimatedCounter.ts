import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Animates a number from 0 to `target` when the element enters the viewport.
 * Uses requestAnimationFrame for smooth 60fps counting.
 */
export function useAnimatedCounter(target: number, duration = 1800) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    const animate = useCallback(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            setCount(target);
            return;
        }

        const start = performance.now();
        const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic for a satisfying deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { animate(); io.disconnect(); } },
            { threshold: 0.3 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [animate]);

    return { count, ref };
}
