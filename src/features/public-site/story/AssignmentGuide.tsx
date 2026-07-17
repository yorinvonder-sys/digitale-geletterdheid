import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function AssignmentGuide({ instruction }: { instruction: string }) {
    const reduceMotion = usePrefersReducedMotion();

    return (
        <motion.aside
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            className="mb-5 grid min-w-0 overflow-hidden rounded-2xl border-2 border-duck-ink bg-white sm:min-h-48 sm:grid-cols-[minmax(9rem,0.85fr)_minmax(14rem,1.15fr)] sm:items-stretch"
            aria-label="Opdrachtinstructie"
        >
            <div className="relative h-36 min-w-0 overflow-hidden border-b-2 border-duck-ink bg-duck-bg sm:h-auto sm:min-h-48 sm:border-b-0 sm:border-r-2">
                <motion.img
                    src="/assets/story/assignment-guide-kees.webp"
                    alt="De DGSkills-gids wijst naar de eerste stap van de opdracht"
                    className="absolute inset-0 size-full object-cover object-left"
                    initial={reduceMotion ? false : { scale: 0.98, x: -5 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                    loading="lazy"
                    decoding="async"
                    width={1600}
                    height={1200}
                />
            </div>
            <div className="min-w-0 self-center p-4 sm:p-5" aria-live="polite">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-duck-error">Start hier</p>
                <p className="mt-1.5 text-sm font-extrabold leading-6 text-duck-ink">{instruction}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-duck-ink/48">Daarna speel je zelf <ArrowRight className="size-3.5" aria-hidden="true" /></p>
            </div>
        </motion.aside>
    );
}
