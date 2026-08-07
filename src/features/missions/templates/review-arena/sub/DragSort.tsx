import React, { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { ArrowDown, ArrowUp, GripVertical, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface DragSortItem {
    id: string;
    label: string;
    correctPosition: number;
}

interface DragSortProps {
    title: string;
    description: string;
    items: DragSortItem[];
    onComplete: (score: number, maxScore: number) => void;
    /** Called once, immediately when the round is submitted, so the score can be persisted before the learner has a chance to reload and retry with the answers now known. */
    onSubmit?: (score: number) => void;
    maxScore: number;
    /** Optional: prompt learner to rate confidence (1-3) before submission */
    showConfidence?: boolean;
}

// Deterministic shuffle seeded by the item ids, so the order is stable across
// reloads of the same round instead of re-randomizing every mount, and never
// lands (by chance) on the fully correct order.
function seededShuffle(items: DragSortItem[]): DragSortItem[] {
    let seed = 0;
    for (const item of items) {
        for (let i = 0; i < item.id.length; i++) {
            seed = (seed * 31 + item.id.charCodeAt(i)) >>> 0;
        }
    }
    const next = () => {
        seed = (seed * 1103515245 + 12345) >>> 0;
        return seed / 4294967296;
    };
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    if (a.length > 1 && a.every((item, index) => item.correctPosition === index)) {
        [a[0], a[1]] = [a[1], a[0]];
    }
    return a;
}

interface ItemRowProps {
    item: DragSortItem;
    submitted: boolean;
    currentIndex: number;
    totalItems: number;
    onMove: (id: string, direction: -1 | 1) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, submitted, currentIndex, totalItems, onMove }) => {
    const controls = useDragControls();
    const isCorrect = submitted && item.correctPosition === currentIndex;
    const isWrong = submitted && item.correctPosition !== currentIndex;

    return (
        <Reorder.Item
            data-qa="review-drag-item"
            value={item}
            dragListener={false}
            dragControls={controls}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 select-none
                ${submitted
                    ? isCorrect
                        ? 'bg-duck-ink/10 border-duck-ink'
                        : 'bg-duck-acid/10 border-duck-acid/60'
                    : 'bg-white border-duck-gray hover:border-duck-acid/40 cursor-grab active:cursor-grabbing'
                }`}
        >
            <div
                onPointerDown={submitted ? undefined : (e) => controls.start(e)}
                className={`min-h-[44px] min-w-[32px] inline-flex items-center justify-center text-duck-ink/80 ${submitted ? '' : 'cursor-grab active:cursor-grabbing'}`}
                style={{ touchAction: 'none' }}
                aria-hidden="true"
            >
                <GripVertical size={16} />
            </div>

            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: submitted ? (isCorrect ? '#202023' : '#ff3c21') : '#ff3c21' }}>
                <span className={`text-xs font-black ${submitted && isCorrect ? 'text-white' : 'text-duck-ink'}`}>{currentIndex + 1}</span>
            </div>

            <span
                className="flex-1 text-sm text-duck-ink/80 font-medium"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {item.label}
            </span>

            {submitted && (
                isCorrect
                    ? <CheckCircle size={16} className="text-duck-ink flex-shrink-0" />
                    : <XCircle size={16} className="text-duck-ink flex-shrink-0" />
            )}
            {!submitted && (
                <div className="flex shrink-0 gap-1">
                    <button
                        data-qa="review-drag-up"
                        type="button"
                        onClick={() => onMove(item.id, -1)}
                        disabled={currentIndex === 0}
                        aria-label={`${item.label} omhoog verplaatsen`}
                        className="grid min-h-[44px] min-w-[44px] place-items-center rounded-lg border border-duck-gray text-duck-ink/80 transition-colors hover:border-duck-acid hover:text-duck-ink disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
                    >
                        <ArrowUp size={14} />
                    </button>
                    <button
                        data-qa="review-drag-down"
                        type="button"
                        onClick={() => onMove(item.id, 1)}
                        disabled={currentIndex === totalItems - 1}
                        aria-label={`${item.label} omlaag verplaatsen`}
                        className="grid min-h-[44px] min-w-[44px] place-items-center rounded-lg border border-duck-gray text-duck-ink/80 transition-colors hover:border-duck-acid hover:text-duck-ink disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
                    >
                        <ArrowDown size={14} />
                    </button>
                </div>
            )}
        </Reorder.Item>
    );
};

export const DragSort: React.FC<DragSortProps> = ({
    title,
    description,
    items,
    onComplete,
    onSubmit,
    maxScore,
}) => {
    const [order, setOrder] = useState<DragSortItem[]>(() => seededShuffle(items));
    const [hasMoved, setHasMoved] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const handleSubmit = () => {
        const correct = order.filter((item, index) => item.correctPosition === index).length;
        const earned = Math.round((correct / items.length) * maxScore);
        setScore(earned);
        setSubmitted(true);
        onSubmit?.(earned);
    };

    const handleReorder = (next: DragSortItem[]) => {
        setHasMoved(true);
        setOrder(next);
    };

    const handleMove = (id: string, direction: -1 | 1) => {
        setHasMoved(true);
        setOrder((current) => {
            const index = current.findIndex((item) => item.id === id);
            const nextIndex = index + direction;
            if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
            const next = [...current];
            [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
            return next;
        });
    };

    const handleContinue = () => {
        onComplete(score ?? 0, maxScore);
    };

    const correctCount = submitted ? order.filter((item, i) => item.correctPosition === i).length : 0;

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
                    className="text-sm text-duck-ink/80"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {description}
                </p>
            </div>

            <div className="text-xs text-duck-ink/80 flex items-center gap-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <GripVertical size={12} />
                Sleep de kaarten in de juiste volgorde of gebruik de pijltjes
            </div>

            <Reorder.Group
                axis="y"
                values={order}
                onReorder={submitted ? () => {} : handleReorder}
                className="space-y-2"
            >
                {order.map((item, index) => (
                    <ItemRow
                        key={item.id}
                        item={item}
                        submitted={submitted}
                        currentIndex={index}
                        totalItems={order.length}
                        onMove={handleMove}
                    />
                ))}
            </Reorder.Group>

            {submitted && (
                <div
                    className={`p-3 rounded-xl text-sm font-medium ${
                        correctCount === items.length
                            ? 'bg-duck-ink/10 text-duck-ink'
                            : 'bg-duck-acid/10 text-duck-ink'
                    }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {correctCount === items.length
                        ? `Perfect! Alle ${items.length} items in de juiste volgorde.`
                        : `${correctCount} van de ${items.length} posities correct.`
                    }
                    <span className="font-black ml-2">{score}/{maxScore} punten</span>
                </div>
            )}

            {!submitted ? (
                <button
                    data-qa="review-submit"
                    onClick={handleSubmit}
                    disabled={!hasMoved}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] ${
                        hasMoved
                            ? 'bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-duck-ink'
                            : 'bg-duck-gray text-duck-ink/80 cursor-not-allowed'
                    }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {hasMoved ? 'Volgorde bevestigen' : 'Versleep eerst minstens één kaart'}
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
