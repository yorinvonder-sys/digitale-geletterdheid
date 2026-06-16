import { useEffect, useRef, useState } from 'react';

/**
 * AnimatedCounter — telt van 0 naar `value` wanneer het in beeld komt.
 * Past naadloos in DUCK English ontwerp met duck-ink/opacity hiërarchie.
 *
 * Gebruik:
 *   <AnimatedCounter value={95} suffix="+" label="AI-missies" />
 */
export function AnimatedCounter({
    value,
    suffix = '',
    label,
    duration = 2000,
}: {
    value: number;
    suffix?: string;
    label: string;
    duration?: number;
}) {
    const [display, setDisplay] = useState(0);
    const [animated, setAnimated] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || animated) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setAnimated(true);
                io.disconnect();

                const start = performance.now();
                const step = (now: number) => {
                    const progress = Math.min((now - start) / duration, 1);
                    // Ease-out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setDisplay(Math.round(eased * value));
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            },
            { threshold: 0.3 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [value, animated, duration]);

    return (
        <div ref={ref} className="text-center" aria-label={`${value}${suffix} ${label}`}>
            <span className="font-display font-black text-4xl leading-none text-duck-ink tabular-nums motion-reduce:animate-none">
                {display}{suffix}
            </span>
            <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-duck-ink/60">
                {label}
            </p>
        </div>
    );
}
