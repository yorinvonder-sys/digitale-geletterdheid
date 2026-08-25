import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { ScenarioRound } from '../types';

/**
 * Stabiele pseudo-random generator op basis van een tekst-seed.
 * Dezelfde seed geeft altijd dezelfde reeks, zodat de kaartvolgorde na herladen
 * of een autosave-herstel niet verspringt.
 */
const seededRandom = (seed: string) => {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return () => {
        h += 0x6d2b79f5;
        let t = h;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

const LEARNER_SEED_KEY = 'dgskills_shuffle_seed';

/** Fallback wanneer localStorage niet beschikbaar is: stabiel binnen deze paginasessie. */
const fallbackSeed = Math.random().toString(36).slice(2);

/**
 * Seed die per leerling/browser verschilt maar stabiel blijft binnen een poging
 * (en over een herlaad heen). Zonder dit kreeg iedereen dezelfde husselvolgorde
 * en kon één leerling zijn oplossing één-op-één doorgeven aan de klas.
 */
export const getLearnerSeed = (): string => {
    try {
        const existing = localStorage.getItem(LEARNER_SEED_KEY);
        if (existing) return existing;
        const fresh = Math.random().toString(36).slice(2);
        localStorage.setItem(LEARNER_SEED_KEY, fresh);
        return fresh;
    } catch {
        return fallbackSeed;
    }
};

/** De antwoordvolgorde: items gesorteerd op `correctPosition`. */
const answerOrderIds = <T extends { id: number; correctPosition?: number }>(items: T[]): number[] =>
    [...items]
        .sort((a, b) => (a.correctPosition ?? 0) - (b.correctPosition ?? 0))
        .map((it) => it.id);

/**
 * Husselt de kaarten met een stabiele seed.
 *
 * Zonder dit staan de kaarten in configvolgorde, en in alle configs loopt
 * `correctPosition` in diezelfde volgorde op vanaf 0 — de getoonde volgorde ís
 * dan het antwoord, en van boven naar beneden klikken levert de volle score op
 * zonder te lezen. De seed houdt de volgorde stabiel binnen een ronde; de
 * eindcontrole vergelijkt met de `correctPosition`-volgorde (niet met de
 * configvolgorde), zodat de hussel daar gegarandeerd van afwijkt — ook als een
 * config de items in een andere volgorde opsomt dan het antwoord.
 */
const shuffleForRound = <T extends { id: number; correctPosition?: number }>(
    items: T[],
    seed: string,
): T[] => {
    if (items.length < 2) return items;
    const rand = seededRandom(seed);
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    const answer = answerOrderIds(items);
    const matchesAnswer = out.every((it, i) => it.id === answer[i]);
    if (matchesAnswer) [out[0], out[1]] = [out[1], out[0]];
    return out;
};

const ScenarioIcon = ({ icon, className }: { icon: string; className: string }) => (
    icon.startsWith('/assets/') ? (
        <img src={icon} alt="" className={`shrink-0 object-contain ${className}`} width={24} height={24} loading="lazy" decoding="async" />
    ) : (
        <span className={className}>{icon}</span>
    )
);

export const OrderPriorityRound: React.FC<{
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onAdd: (id: number) => void;
    onReset: () => void;
    onSubmit: () => void;
}> = ({ round, selections, submitted, onAdd, onReset, onSubmit }) => {
    const learnerSeed = React.useMemo(() => getLearnerSeed(), []);
    const shuffledItems = React.useMemo(
        () => shuffleForRound(round.items, `${learnerSeed}:${round.id}`),
        [round.items, round.id, learnerSeed]
    );
    const remaining = shuffledItems.filter((it) => !selections.includes(it.id));
    const instruction = round.orderInstruction ?? 'Klik de items in de juiste volgorde';

    return (
        <div className="mt-4">
            {selections.length > 0 && (
                <div className="bg-duck-bg rounded-xl p-3 mb-4 border border-duck-gray">
                    <div className="flex items-center justify-between mb-2">
                        <span
                            className="text-[10px] font-black text-duck-ink/70 uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Jouw volgorde
                        </span>
                        {!submitted && (
                            <button
                                data-qa="scenario-reset-order"
                                onClick={onReset}
                                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-duck-ink/70 hover:text-duck-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
                                aria-label="Opnieuw beginnen"
                            >
                                <RotateCcw size={14} />
                            </button>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        {selections.map((id, i) => {
                            const item = round.items.find((it) => it.id === id);
                            if (!item) return null;
                            const isCorrect = submitted && item.correctPosition === i;
                            const isClose = submitted && !isCorrect && Math.abs((item.correctPosition ?? 0) - i) === 1;
                            // Op duck-error haalt wit maar 3,6:1; duck-ink haalt 4,6:1 en
                            // blijft daarmee boven de WCAG AA-eis voor deze 10-12px tekst.
                            return (
                                <div
                                    key={id}
                                    className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                                        submitted
                                            ? isCorrect ? 'bg-duck-ink/10 text-duck-ink'
                                            : isClose ? 'bg-duck-acid text-duck-ink'
                                            : 'bg-duck-error text-duck-ink'
                                            : 'bg-white text-duck-ink/70'
                                    }`}
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                            submitted
                                                ? isCorrect ? 'bg-duck-ink text-white'
                                                : isClose ? 'bg-duck-acid text-duck-ink'
                                                : 'bg-duck-error text-duck-ink'
                                                : 'bg-duck-acid/20 text-duck-ink'
                                        }`}
                                    >
                                        {i + 1}
                                    </span>
                                    <ScenarioIcon icon={item.icon} className="h-5 w-5" />
                                    <span className="flex-1">{item.title}</span>
                                    {submitted && isCorrect && <Check size={12} />}
                                    {submitted && !isCorrect && (
                                        <span className="text-[10px] opacity-70">
                                            (#{(item.correctPosition ?? 0) + 1})
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {!submitted && remaining.length > 0 && (
                <div className="space-y-2 mb-4">
                    <p
                        className="text-[10px] font-black text-duck-ink/70 uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {instruction}
                    </p>
                    {remaining.map((item) => (
                        <button
                            key={item.id}
                            data-qa="scenario-order-item"
                            data-scenario-item-id={item.id}
                            onClick={() => onAdd(item.id)}
                            className="w-full min-h-[44px] p-3 rounded-xl border-2 border-duck-gray bg-white hover:border-duck-acid hover:bg-duck-acid/5 text-left transition-all duration-200 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
                        >
                            <ScenarioIcon icon={item.icon} className="h-6 w-6 text-lg" />
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-bold text-duck-ink"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.title}
                                </p>
                                <p
                                    className="text-xs text-duck-ink/70 line-clamp-3"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {submitted && (
                <div className="space-y-2 mb-4">
                    {selections.map((id) => {
                        const item = round.items.find((it) => it.id === id);
                        if (!item) return null;
                        return (
                            <div
                                key={id}
                                className="p-3 rounded-xl bg-duck-bg border border-duck-gray text-xs text-duck-ink/70 italic"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                <span className="inline-flex items-center gap-1 font-bold not-italic">
                                    <ScenarioIcon icon={item.icon} className="h-4 w-4" />
                                    {item.title}:
                                </span>{' '}
                                {item.explanation}
                            </div>
                        );
                    })}
                </div>
            )}

            {!submitted && selections.length === round.items.length && (
                <button
                    data-qa="scenario-submit"
                    onClick={onSubmit}
                    className="w-full py-3 rounded-full font-black text-sm bg-duck-acid hover:bg-duck-acid text-duck-ink transition-all duration-300"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer volgorde
                </button>
            )}
        </div>
    );
};
