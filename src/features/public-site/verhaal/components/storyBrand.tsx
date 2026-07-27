import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Merkprimitieven voor de scrollytelling-verhaalpagina.
 *
 * De vorm komt uit de scrollytelling-blueprint (dikke randen, harde offset-
 * schaduwen, licht geroteerde kaarten); de kleuren en fonts komen uit het
 * bestaande DUCK-systeem. Zie design.md voor de tokens.
 *
 * Kleurmapping t.o.v. de blueprint:
 *   paper → duck-bg · ink → duck-ink · lime → duck-acid
 * `lime-deep` bestaat niet in DUCK; op lichte vlakken gebruiken we duck-ink,
 * omdat acid (#e1ff01) op duck-bg (#f2f1ec) onleesbaar is.
 */

/** Harde offset-schaduw in duck-ink (#202023). */
export const HARD_SHADOW = 'shadow-[6px_6px_0_0_rgba(32,32,35,1)]';
export const HARD_SHADOW_LG = 'shadow-[8px_8px_0_0_rgba(32,32,35,1)]';

/**
 * Iets lichter dan duck-ink, voor kaarten die op een duck-ink vlak liggen.
 * DUCK kent geen `ink-soft`; dit is een afgeleide van #202023 en wordt alleen
 * binnen de verhaalpagina gebruikt.
 */
export const INK_SOFT = 'bg-[#2b2b30]';

/* ---------------------------------- Eyes ---------------------------------- */

/**
 * Googly eyes die de cursor volgen — het handelsmerk van de proloog.
 * Bij prefers-reduced-motion blijven de pupillen stil in het midden staan.
 */
export function Eyes({ size = 84, className = '' }: { size?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const reduceMotion = usePrefersReducedMotion();

    useEffect(() => {
        if (reduceMotion) {
            setOffset({ x: 0, y: 0 });
            return;
        }
        const onMove = (e: MouseEvent) => {
            if (!ref.current) return;
            const r = ref.current.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.hypot(dx, dy) || 1;
            const max = size * 0.11;
            const pull = Math.min(dist / 18, max);
            setOffset({ x: (dx / dist) * pull, y: (dy / dist) * pull });
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [size, reduceMotion]);

    const eye = (
        <div
            className="flex items-center justify-center rounded-full border-[3px] border-duck-ink bg-white"
            style={{ width: size, height: size }}
        >
            <div
                className="rounded-full bg-duck-ink transition-transform duration-100 ease-out"
                style={{
                    width: size * 0.38,
                    height: size * 0.38,
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                }}
            />
        </div>
    );

    return (
        <div
            ref={ref}
            className={`flex items-center ${className}`}
            style={{ gap: size * 0.08 }}
            aria-hidden="true"
        >
            {eye}
            {eye}
        </div>
    );
}

/* ---------------------------------- Duck ---------------------------------- */

/** De echte DGSkills-eend met afstudeerhoed. Bron: zie DuckMark.tsx. */
export function Duck({
    size = 120,
    className = '',
    decorative = true,
}: {
    size?: number;
    className?: string;
    decorative?: boolean;
}) {
    return (
        <img
            src="/assets/brand/dgskills-duck-logo-mark.webp"
            width={size}
            height={size}
            alt={decorative ? '' : 'De DGSkills-eend'}
            aria-hidden={decorative ? 'true' : undefined}
            className={className}
            draggable={false}
            decoding="async"
        />
    );
}

/* ------------------------------ LogoLockup --------------------------------- */

export function LogoLockup({
    height = 34,
    dark = false,
    className = '',
}: {
    height?: number;
    dark?: boolean;
    className?: string;
}) {
    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            <img
                src="/assets/brand/dgskills-duck-logo-mark.webp"
                alt=""
                aria-hidden="true"
                style={{ height, width: height }}
                draggable={false}
                decoding="async"
            />
            <span
                className={`font-display font-black ${dark ? 'text-duck-bg' : 'text-duck-ink'}`}
                style={{ fontSize: height * 0.62, letterSpacing: '-0.02em' }}
            >
                DGSkills
            </span>
        </span>
    );
}

/* --------------------------------- Marquee --------------------------------- */

/** Lintstrook tussen secties. Staat stil bij prefers-reduced-motion. */
export function Marquee({
    items,
    dark = false,
    className = '',
}: {
    items: string[];
    dark?: boolean;
    className?: string;
}) {
    const row = (
        <div className="flex shrink-0 items-center" aria-hidden="true">
            {items.map((it, i) => (
                <span key={i} className="flex items-center whitespace-nowrap">
                    <span className="px-6 text-sm font-bold uppercase tracking-[0.18em] md:text-base">
                        {it}
                    </span>
                    <span className="text-lg">✦</span>
                </span>
            ))}
        </div>
    );

    return (
        <div
            className={`overflow-hidden border-y-[3px] border-duck-ink py-3 ${
                dark ? 'bg-duck-ink text-duck-acid' : 'bg-duck-acid text-duck-ink'
            } ${className}`}
        >
            {/* Screenreaders krijgen de tekst één keer, niet de gedupliceerde lus. */}
            <span className="sr-only">{items.join(' · ')}</span>
            <div className="verhaal-marquee flex w-max">
                {row}
                {row}
            </div>
        </div>
    );
}

/* ----------------------------------- Pill ----------------------------------- */

export function Pill({
    children,
    filled = false,
    dark = false,
    className = '',
}: {
    children: React.ReactNode;
    filled?: boolean;
    dark?: boolean;
    className?: string;
}) {
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] md:text-xs ${
                filled
                    ? 'border-duck-ink bg-duck-acid text-duck-ink'
                    : dark
                        ? 'border-duck-bg/30 text-duck-bg/80'
                        : 'border-duck-ink/60 text-duck-ink/80'
            } ${className}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    filled ? 'bg-duck-ink' : dark ? 'bg-duck-acid' : 'bg-duck-ink/70'
                }`}
            />
            {children}
        </span>
    );
}

/* ------------------------------- BrowserFrame ------------------------------- */

/** Productmockup in een browservenster. Puur decoratief. */
export function BrowserFrame({
    url,
    children,
    dark = false,
    className = '',
}: {
    url: string;
    children: React.ReactNode;
    dark?: boolean;
    className?: string;
}) {
    return (
        <div
            className={`overflow-hidden rounded-2xl border-[3px] border-duck-ink ${HARD_SHADOW_LG} ${
                dark ? 'bg-duck-ink text-duck-bg' : 'bg-white text-duck-ink'
            } ${className}`}
        >
            <div
                className={`flex items-center gap-2 border-b-[3px] px-4 py-2.5 ${
                    dark ? 'border-duck-bg/15' : 'border-duck-ink/10'
                }`}
            >
                <span className="h-2.5 w-2.5 rounded-full bg-duck-ink/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-duck-ink/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-duck-acid" />
                <span
                    className={`ml-3 flex-1 truncate rounded-full px-3 py-1 text-[11px] font-medium ${
                        dark ? 'bg-duck-bg/10 text-duck-bg/70' : 'bg-duck-ink/5 text-duck-ink/60'
                    }`}
                >
                    {url}
                </span>
            </div>
            <div className="p-4 md:p-5">{children}</div>
        </div>
    );
}

/* --------------------------------- Reveal ---------------------------------- */

/**
 * Onthult content bij binnenscrollen. Bij prefers-reduced-motion is de content
 * direct zichtbaar, conform design.md.
 */
export function Reveal({
    children,
    delay = 0,
    y = 28,
    className = '',
}: {
    children: React.ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-12% 0px' });
    const reduceMotion = usePrefersReducedMotion();

    if (reduceMotion) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

/* ------------------------------ ChapterMarker ------------------------------ */

/**
 * Hoofdstukkop met groot nummer-watermerk. Het watermerk staat achter de kop en
 * is `aria-hidden`; het vangt geen klikken en overlapt geen leesbare tekst.
 */
export function ChapterMarker({
    kicker,
    number,
    title,
    dark = false,
}: {
    kicker: string;
    number: string;
    title: React.ReactNode;
    dark?: boolean;
}) {
    return (
        <div className="relative">
            <span
                className={`pointer-events-none absolute -top-24 right-0 select-none font-display text-[9rem] font-black leading-none md:-top-40 md:text-[15rem] ${
                    dark ? 'verhaal-watermark-light' : 'verhaal-watermark'
                }`}
                aria-hidden="true"
            >
                {number}
            </span>
            <Reveal>
                <Pill dark={dark}>{kicker}</Pill>
            </Reveal>
            <Reveal delay={0.08}>
                <h2
                    className={`mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl lg:text-7xl ${
                        dark ? 'text-duck-bg' : 'text-duck-ink'
                    }`}
                >
                    {title}
                </h2>
            </Reveal>
        </div>
    );
}
