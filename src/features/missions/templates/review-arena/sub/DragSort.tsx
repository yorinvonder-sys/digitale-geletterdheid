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

const isSolved = (arr: DragSortItem[]) => arr.every((item, i) => item.correctPosition === i);

/**
 * Schudt tot de getoonde volgorde afwijkt van de juiste volgorde. Zonder deze
 * garantie staat de ronde bij drie items in 1 op de 6 gevallen al goed en levert
 * direct indienen de volle score op.
 */
function shuffleUnsolved(items: DragSortItem[]): DragSortItem[] {
    if (items.length < 2) return [...items];

    let next = shuffle(items);
    for (let attempt = 0; attempt < 20 && isSolved(next); attempt++) {
        next = shuffle(items);
    }
    if (isSolved(next)) {
        [next[0], next[1]] = [next[1], next[0]];
    }
    return next;
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
                className={`min-h-[44px] min-w-[32px] inline-flex items-center justify-center text-duck-ink/70 ${submitted ? '' : 'cursor-grab active:cursor-grabbing'}`}
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
                className="flex-1 text-sm text-duck-ink/70 font-medium"
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
                        className="grid min-h-[44px] min-w-[44px] place-items-center rounded-lg border border-duck-gray text-duck-ink/70 transition-colors hover:border-duck-acid hover:text-duck-ink disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
                    >
                        <ArrowUp size={14} />
                    </button>
                    <button
                        data-qa="review-drag-down"
                        type="button"
                        onClick={() => onMove(item.id, 1)}
                        disabled={currentIndex === totalItems - 1}
                        aria-label={`${item.label} omlaag verplaatsen`}
                        className="grid min-h-[44px] min-w-[44px] place-items-center rounded-lg border border-duck-gray text-duck-ink/70 transition-colors hover:border-duck-acid hover:text-duck-ink disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
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
    const [order, setOrder] = useState<DragSortItem[]>(() => shuffleUnsolved(items));
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [hasMoved, setHasMoved] = useState(false);

    // Bij minder dan twee items valt er niets te sorteren; dan is interactie geen eis.
    const canSubmit = hasMoved || items.length < 2;

    const handleSubmit = () => {
        if (!canSubmit) return;
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
                    className="text-sm text-duck-ink/70"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {description}
                </p>
            </div>

            <div className="text-xs text-duck-ink/70 flex items-center gap-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
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
                    role="status"
                    aria-live="polite"
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
                    disabled={!canSubmit}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]
                        ${canSubmit
                            ? 'bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-duck-ink'
                            : 'bg-duck-gray text-duck-ink/70 cursor-not-allowed'
                        }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {canSubmit ? 'Volgorde bevestigen' : 'Zet de kaarten eerst in volgorde'}
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
