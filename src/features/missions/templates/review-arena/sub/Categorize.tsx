import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface CategorizeItem {
    label: string;
    correctCategory: string;
}

interface CategorizeProps {
    title: string;
    description: string;
    categories: string[];
    items: CategorizeItem[];
    onComplete: (score: number, maxScore: number) => void;
    /** Called the moment the round is scored, before the correction is shown. */
    onSubmit?: (score: number) => void;
    maxScore: number;
    initialProgress?: CategorizeProgress;
    onProgress?: (progress: CategorizeProgress) => void;
}

export interface CategorizeProgress {
    itemOrderIds: number[];
    placements: Record<string, string>;
    selectedItem: number | null;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Alleen `bg` wordt gebruikt; de eerdere `light`/`border`-velden stonden in
// Tailwind-schuine-streepsyntaxis in een plain CSS-string en deden dus niets.
const CATEGORY_COLORS = [
    { bg: '#ff3c21' },
    { bg: '#202023' },
    { bg: '#e1ff01' },
];

export const Categorize: React.FC<CategorizeProps> = ({
    title,
    description,
    categories,
    items,
    onComplete,
    onSubmit,
    maxScore,
    initialProgress,
    onProgress,
}) => {
    const [shuffledItems] = useState(() => {
        const all = items.map((item, i) => ({ ...item, id: i }));
        const restored = initialProgress?.itemOrderIds
            ?.map((id) => all.find((item) => item.id === id))
            .filter((item): item is (typeof all)[number] => Boolean(item));
        return restored?.length === all.length ? restored : shuffle(all);
    });
    const [placements, setPlacements] = useState<Record<number, string>>(() =>
        Object.fromEntries(
            Object.entries(initialProgress?.placements ?? {}).map(([id, category]) => [Number(id), category])
        )
    );
    const [selectedItem, setSelectedItem] = useState<number | null>(initialProgress?.selectedItem ?? null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState('');

    // Een plaatsing laat de gefocuste knop verdwijnen (categorieknoppen gaan uit
    // zodra er niets meer geselecteerd is). Zonder overdracht valt de focus terug
    // op <body> en moet een toetsenbordgebruiker elke keer opnieuw zoeken.
    const placedRefs = useRef<Record<number, HTMLButtonElement | null>>({});
    const unplacedRefs = useRef<Record<number, HTMLButtonElement | null>>({});
    const resultRef = useRef<HTMLDivElement>(null);
    const [pendingFocus, setPendingFocus] = useState<{ id: number; where: 'placed' | 'unplaced' } | null>(null);

    const unplacedItems = shuffledItems.filter((item) => !(item.id in placements));
    const itemsByCategory = (cat: string) =>
        shuffledItems.filter((item) => placements[item.id] === cat);

    useEffect(() => {
        if (!pendingFocus) return;
        const target =
            pendingFocus.where === 'placed'
                ? placedRefs.current[pendingFocus.id]
                : unplacedRefs.current[pendingFocus.id];
        target?.focus();
        setPendingFocus(null);
    }, [pendingFocus]);

    useEffect(() => {
        if (submitted) resultRef.current?.focus();
    }, [submitted]);

    const handleItemClick = (id: number) => {
        if (submitted) return;
        const nextSelectedItem = selectedItem === id ? null : id;
        setSelectedItem(nextSelectedItem);
        onProgress?.({
            itemOrderIds: shuffledItems.map((item) => item.id),
            placements: Object.fromEntries(Object.entries(placements)),
            selectedItem: nextSelectedItem,
        });
    };

    const handleCategoryClick = (cat: string) => {
        if (submitted || selectedItem === null) return;
        const placedId = selectedItem;
        setPlacements((prev) => ({ ...prev, [placedId]: cat }));
        setSelectedItem(null);
        onProgress?.({
            itemOrderIds: shuffledItems.map((item) => item.id),
            placements: { ...Object.fromEntries(Object.entries(placements).map(([id, category]) => [id, category])), [placedId]: cat },
            selectedItem: null,
        });
        const remaining = unplacedItems.length - 1;
        setStatusMessage(
            `Geplaatst in ${cat}. Nog ${remaining} item${remaining !== 1 ? 's' : ''} te plaatsen.`
        );
        setPendingFocus({ id: placedId, where: 'placed' });
    };

    const handleRemove = (id: number) => {
        if (submitted) return;
        setPlacements((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        setSelectedItem(null);
        onProgress?.({
            itemOrderIds: shuffledItems.map((item) => item.id),
            placements: Object.fromEntries(
                Object.entries(placements).filter(([itemId]) => Number(itemId) !== id)
            ),
            selectedItem: null,
        });
        setStatusMessage('Item teruggezet bij de te categoriseren items.');
        setPendingFocus({ id, where: 'unplaced' });
    };

    const handleSubmit = () => {
        const correct = shuffledItems.filter(
            (item) => placements[item.id] === item.correctCategory
        ).length;
        const earned = Math.round((correct / items.length) * maxScore);
        setScore(earned);
        setSubmitted(true);
        onSubmit?.(earned);
    };

    const handleContinue = () => {
        onComplete(score ?? 0, maxScore);
    };

    const allPlaced = unplacedItems.length === 0;

    return (
        <div className="space-y-4">
            <div>
                <h3
                    className="text-lg font-black text-duck-ink mb-1"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    {title}
                </h3>
                <p
                    className="text-sm text-duck-ink/75"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {description}
                </p>
            </div>

            {!submitted && (
                <p className="text-xs text-duck-ink/75" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Selecteer een item, dan klik op de categorie.
                </p>
            )}

            {/* Category zones */}
            <div className={`grid gap-2 ${categories.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {categories.map((cat, ci) => {
                    const color = CATEGORY_COLORS[ci % CATEGORY_COLORS.length];
                    const catItems = itemsByCategory(cat);
                    const isClickable = !submitted && selectedItem !== null;

                    return (
                        // Wrapper is een gewone div: de categorieknop en de geplaatste
                        // items zijn losse knoppen, zodat er geen klikbaar element in
                        // een ander klikbaar element genest zit.
                        <div
                            key={cat}
                            className="rounded-xl border-2 p-2 min-h-[80px] transition-all duration-200"
                            style={{
                                borderColor: isClickable ? color.bg : '#e3e2dc',
                                background: isClickable ? `${color.bg}18` : '#f2f1ec',
                            }}
                        >
                            <motion.button
                                type="button"
                                data-qa="review-category"
                                onClick={() => handleCategoryClick(cat)}
                                disabled={!isClickable}
                                aria-label={`Plaats het gekozen item in ${cat}`}
                                className={`w-full text-left rounded-lg mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2
                                    ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                                animate={isClickable ? { scale: 1.02 } : { scale: 1 }}
                            >
                                <span
                                    data-qa="review-category-label"
                                    className="block text-xs font-black uppercase tracking-wider text-duck-ink"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {cat}
                                </span>
                            </motion.button>
                            <div className="flex flex-wrap gap-1">
                                {catItems.map((item) => {
                                    const isCorrect = submitted && item.correctCategory === cat;
                                    return (
                                        <motion.button
                                            type="button"
                                            key={item.id}
                                            ref={(el: HTMLButtonElement | null) => {
                                                placedRefs.current[item.id] = el;
                                            }}
                                            layout
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            disabled={submitted}
                                            aria-label={
                                                submitted
                                                    ? `${item.label}: ${isCorrect ? 'juist geplaatst' : `fout geplaatst, hoort bij ${item.correctCategory}`}`
                                                    : `${item.label} uit ${cat} halen`
                                            }
                                            className={`flex min-h-[44px] items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid
                                                ${submitted
                                                    ? isCorrect
                                                        ? 'bg-duck-ink/15 border-duck-ink text-duck-ink'
                                                        : 'bg-duck-acid/15 border-duck-acid/60 text-duck-ink'
                                                    : 'bg-white border-duck-gray text-duck-ink/75 cursor-pointer hover:border-duck-acid/40'
                                                }`}
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(item.id);
                                            }}
                                        >
                                            {submitted && (isCorrect
                                                ? <CheckCircle size={10} aria-hidden="true" />
                                                : <XCircle size={10} aria-hidden="true" />
                                            )}
                                            {item.label}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Unplaced items */}
            {unplacedItems.length > 0 && (
                <div>
                    <p className="text-xs text-duck-ink/75 mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Te categoriseren:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {unplacedItems.map((item) => (
                            <motion.button
                                data-qa="review-category-item"
                                key={item.id}
                                ref={(el: HTMLButtonElement | null) => {
                                    unplacedRefs.current[item.id] = el;
                                }}
                                type="button"
                                layout
                                aria-pressed={selectedItem === item.id}
                                aria-label={`${item.label} selecteren om in een categorie te plaatsen`}
                                onClick={() => handleItemClick(item.id)}
                                className={`min-h-[44px] px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200
                                    ${selectedItem === item.id
                                        ? 'bg-duck-acid/15 border-duck-acid text-duck-ink scale-105'
                                        : 'bg-white border-duck-gray text-duck-ink/75 hover:border-duck-acid/40'
                                    }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {item.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Plaatsingsmelding voor schermlezers — één keer per handeling */}
            <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {statusMessage}
            </p>

            {/* Result — krijgt de focus na bevestigen, want de bevestigknop verdwijnt */}
            <AnimatePresence>
                {submitted && (
                    <motion.div
                        ref={resultRef}
                        tabIndex={-1}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink ${
                            score === maxScore
                                ? 'bg-duck-ink/10 text-duck-ink'
                                : 'bg-duck-acid/10 text-duck-ink'
                        }`}
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {score === maxScore
                            ? 'Perfect gecategoriseerd!'
                            : 'Bijna — zie de correcties hierboven.'}
                        <span className="font-black ml-2">{score}/{maxScore} punten</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {!submitted ? (
                <button
                    data-qa="review-submit"
                    onClick={handleSubmit}
                    disabled={!allPlaced}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2
                        ${allPlaced
                            ? 'bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-duck-ink'
                            : 'bg-duck-gray text-duck-ink/75 cursor-not-allowed'
                        }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {allPlaced ? 'Categorieën bevestigen' : `Nog ${unplacedItems.length} item${unplacedItems.length !== 1 ? 's' : ''} te plaatsen`}
                </button>
            ) : (
                <button
                    data-qa="review-continue"
                    onClick={handleContinue}
                    className="w-full py-3 bg-gradient-to-r from-duck-ink to-duck-ink hover:from-duck-ink hover:to-duck-ink text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Volgende ronde
                    <ChevronRight size={16} />
                </button>
            )}
        </div>
    );
};
