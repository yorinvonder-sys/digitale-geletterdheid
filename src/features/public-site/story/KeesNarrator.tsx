import { motion } from 'framer-motion';
import { DuckMark } from '@/components/brand/DuckMark';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type NarratorTone = 'paper' | 'acid' | 'ink';

const toneClasses: Record<NarratorTone, string> = {
    paper: 'border-duck-ink/15 bg-white text-duck-ink',
    acid: 'border-duck-ink bg-duck-acid text-duck-ink',
    ink: 'border-white/15 bg-duck-ink text-white',
};

export function KeesNarrator({
    message,
    eyebrow = 'Kees vertelt',
    tone = 'paper',
    className = '',
}: {
    message: string;
    eyebrow?: string;
    tone?: NarratorTone;
    className?: string;
}) {
    const reduceMotion = usePrefersReducedMotion();

    return (
        <aside
            className={`grid min-w-0 max-w-full gap-3 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:items-center ${className}`}
            aria-label="Uitleg van Kees"
        >
            <motion.div
                key={`duck-${message}`}
                initial={reduceMotion ? false : { opacity: 0, y: 8, rotate: -4, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="grid size-[4.5rem] place-items-center rounded-[1.35rem] border-2 border-duck-ink bg-white shadow-[4px_5px_0_#202023]"
                aria-hidden="true"
            >
                <DuckMark className="size-14 object-contain" />
            </motion.div>

            <motion.div
                key={message}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.32 }}
                className={`relative min-w-0 max-w-full rounded-[1.35rem] border px-4 py-3.5 sm:px-5 ${toneClasses[tone]}`}
            >
                <span
                    className="absolute -left-2 top-7 hidden size-4 rotate-45 border-b border-l border-inherit bg-inherit sm:block"
                    aria-hidden="true"
                />
                <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${tone === 'ink' ? 'text-duck-acid/70' : 'text-duck-error'}`}>
                    {eyebrow}
                </p>
                <p className={`mt-1.5 break-words text-sm font-extrabold leading-5 ${tone === 'ink' ? 'text-white/82' : 'text-duck-ink/75'}`}>
                    {message}
                </p>
            </motion.div>
        </aside>
    );
}
