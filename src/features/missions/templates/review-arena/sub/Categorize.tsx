import React, { useState } from 'react';
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
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const CATEGORY_COLORS = [
    { bg: '#ff3c21', light: '#D97848/10', border: '#D97848/40' },
    { bg: '#202023', light: '#0B453F/10', border: '#0B453F/40' },
    { bg: '#e1ff01', light: '#D7C95F/10', border: '#D7C95F/40' },
];

export const Categorize: React.FC<CategorizeProps> = ({
    title,
    description,
    categories,
    items,
    onComplete,
    onSubmit,
    maxScore,
}) => {
    const [shuffledItems] = useState(() =>
        shuffle(items.map((item, i) => ({ ...item, id: i })))
    );
    const [placements, setPlacements] = useState<Record<number, string>>({});
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const unplacedItems = shuffledItems.filter((item) => !(item.id in placements));
    const itemsByCategory = (cat: string) =>
        shuffledItems.filter((item) => placements[item.id] === cat);

    const handleItemClick = (id: number) => {
        if (submitted) return;
        setSelectedItem(selectedItem === id ? null : id);
    };

    const handleCategoryClick = (cat: string) => {
        if (submitted || selectedItem === null) return;
        setPlacements((prev) => ({ ...prev, [selectedItem]: cat }));
        setSelectedItem(null);
    };

    const handleRemove = (id: number) => {
        if (submitted) return;
        setPlacements((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        setSelectedItem(null);
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
                    className="text-sm text-duck-ink/70"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {description}
                </p>
            </div>

            {!submitted && (
                <p className="text-xs text-duck-ink/70" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
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
                                    className="block text-xs font-black uppercase tracking-wider"
                                    style={{ color: color.bg, fontFamily: "'Outfit', system-ui, sans-serif" }}
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
                                            layout
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            disabled={submitted}
                                            aria-label={
                                                submitted
                                                    ? `${item.label}: ${isCorrect ? 'juist geplaatst' : `fout geplaatst, hoort bij ${item.correctCategory}`}`
                                                    : `${item.label} uit ${cat} halen`
                                            }
                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid
                                                ${submitted
                                                    ? isCorrect
                                                        ? 'bg-duck-ink/15 border-duck-ink text-duck-ink'
                                                        : 'bg-duck-acid/15 border-duck-acid/60 text-duck-ink'
                                                    : 'bg-white border-duck-gray text-duck-ink/70 cursor-pointer hover:border-duck-acid/40'
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
                    <p className="text-xs text-duck-ink/70 mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Te categoriseren:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {unplacedItems.map((item) => (
                            <motion.button
                                data-qa="review-category-item"
                                key={item.id}
                                type="button"
                                layout
                                aria-pressed={selectedItem === item.id}
                                aria-label={`${item.label} selecteren om in een categorie te plaatsen`}
                                onClick={() => handleItemClick(item.id)}
                                className={`min-h-[44px] px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200
                                    ${selectedItem === item.id
                                        ? 'bg-duck-acid/15 border-duck-acid text-duck-ink scale-105'
                                        : 'bg-white border-duck-gray text-duck-ink/70 hover:border-duck-acid/40'
                                    }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {item.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Result */}
            <AnimatePresence>
                {submitted && (
                    <motion.div
                        role="status"
                        aria-live="polite"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl text-sm font-medium ${
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
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]
                        ${allPlaced
                            ? 'bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-duck-ink'
                            : 'bg-duck-gray text-duck-ink/70 cursor-not-allowed'
                        }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {allPlaced ? 'Categorieën bevestigen' : `Nog ${unplacedItems.length} item${unplacedItems.length !== 1 ? 's' : ''} te plaatsen`}
                </button>
            ) : (
                <button
                    data-qa="review-continue"
                    onClick={handleContinue}
                    className="w-full py-3 bg-gradient-to-r from-duck-ink to-duck-ink hover:from-duck-ink hover:to-duck-ink text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Volgende ronde
                    <ChevronRight size={16} />
                </button>
            )}
        </div>
    );
};
