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
    maxScore: number;
    /** Optional: prompt learner to rate confidence (1-3) before submission */
    showConfidence?: boolean;
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
    { bg: '#D97848', light: '#D97848/10', border: '#D97848/40' },
    { bg: '#0B453F', light: '#0B453F/10', border: '#0B453F/40' },
    { bg: '#D7C95F', light: '#D7C95F/10', border: '#D7C95F/40' },
];

export const Categorize: React.FC<CategorizeProps> = ({
    title,
    description,
    categories,
    items,
    onComplete,
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
    };

    const handleContinue = () => {
        onComplete(score ?? 0, maxScore);
    };

    const allPlaced = unplacedItems.length === 0;

    return (
        <div className="space-y-4">
            <div>
                <h3
                    className="text-lg font-black text-[#08283B] mb-1"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    {title}
                </h3>
                <p
                    className="text-sm text-[#445865]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {description}
                </p>
            </div>

            {!submitted && (
                <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
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
                        <motion.div
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            data-qa="review-category"
                            className={`rounded-xl border-2 p-2 min-h-[80px] transition-all duration-200
                                ${isClickable
                                    ? 'cursor-pointer scale-[1.02] shadow-md'
                                    : 'cursor-default'
                                }`}
                            style={{
                                borderColor: isClickable ? color.bg : '#E7D8BD',
                                background: isClickable ? `${color.bg}18` : '#FCF6EA',
                            }}
                        >
                            <div
                                className="text-xs font-black mb-2 uppercase tracking-wider"
                                style={{ color: color.bg, fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {cat}
                            </div>
                            {isClickable && (
                                <button
                                    type="button"
                                    data-qa="review-category-drop"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCategoryClick(cat);
                                    }}
                                    className="mb-2 w-full rounded-lg border border-dashed bg-white/80 px-2 py-2 text-xs font-bold transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848]/40"
                                    style={{ borderColor: color.bg, color: color.bg, fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Plaats hier
                                </button>
                            )}
                            <div className="flex flex-wrap gap-1">
                                {catItems.map((item) => {
                                    const isCorrect = submitted && item.correctCategory === cat;
                                    const isWrong = submitted && item.correctCategory !== cat;
                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border
                                                ${submitted
                                                    ? isCorrect
                                                        ? 'bg-[#5F947D]/15 border-[#5F947D] text-[#5F947D]'
                                                        : 'bg-[#D97848]/15 border-[#D97848]/60 text-[#D97848]'
                                                    : 'bg-white border-[#E7D8BD] text-[#445865] cursor-pointer hover:border-[#D97848]/40'
                                                }`}
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(item.id);
                                            }}
                                        >
                                            {submitted && (isCorrect
                                                ? <CheckCircle size={10} />
                                                : <XCircle size={10} />
                                            )}
                                            {item.label}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Unplaced items */}
            {unplacedItems.length > 0 && (
                <div>
                    <p className="text-xs text-[#445865] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Te categoriseren:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {unplacedItems.map((item) => (
                            <motion.button
                                key={item.id}
                                layout
                                onClick={() => handleItemClick(item.id)}
                                data-qa="review-categorize-item"
                                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200
                                    ${selectedItem === item.id
                                        ? 'bg-[#D97848]/15 border-[#D97848] text-[#D97848] scale-105'
                                        : 'bg-white border-[#E7D8BD] text-[#445865] hover:border-[#D97848]/40'
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
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl text-sm font-medium ${
                            score === maxScore
                                ? 'bg-[#5F947D]/10 text-[#5F947D]'
                                : 'bg-[#D97848]/10 text-[#D97848]'
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
                    onClick={handleSubmit}
                    disabled={!allPlaced}
                    data-qa="review-submit"
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]
                        ${allPlaced
                            ? 'bg-gradient-to-r from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] text-white'
                            : 'bg-[#E7D8BD] text-[#445865] cursor-not-allowed'
                        }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {allPlaced ? 'Categorieën bevestigen' : `Nog ${unplacedItems.length} item${unplacedItems.length !== 1 ? 's' : ''} te plaatsen`}
                </button>
            ) : (
                <button
                    onClick={handleContinue}
                    data-qa="review-next"
                    className="w-full py-3 bg-gradient-to-r from-[#5F947D] to-[#5F947D] hover:from-[#5F947D] hover:to-[#5F947D] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Volgende ronde
                    <ChevronRight size={16} />
                </button>
            )}
        </div>
    );
};
