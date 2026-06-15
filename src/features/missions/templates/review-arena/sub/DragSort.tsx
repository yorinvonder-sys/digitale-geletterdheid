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
                className={`min-h-[44px] min-w-[32px] inline-flex items-center justify-center text-duck-ink/60 ${submitted ? '' : 'cursor-grab active:cursor-grabbing'}`}
                style={{ touchAction: 'none' }}
                aria-hidden="true"
            >
                <GripVertical size={16} />
            </div>

            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: submitted ? (isCorrect ? '#202023' : '#ff3c21') : '#ff3c21' }}>
                <span className="text-xs font-black text-white">{currentIndex + 1}</span>
            </div>

            <span
                className="flex-1 text-sm text-duck-ink/60 font-medium"
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
                        type="button"
                        onClick={() => onMove(item.id, -1)}
                        disabled={currentIndex === 0}
                        aria-label={`${item.label} omhoog verplaatsen`}
                        className="grid min-h-[36px] min-w-[36px] place-items-center rounded-lg border border-duck-gray text-duck-ink/60 transition-colors hover:border-duck-acid hover:text-duck-ink disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
                    >
                        <ArrowUp size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onMove(item.id, 1)}
                        disabled={currentIndex === totalItems - 1}
                        aria-label={`${item.label} omlaag verplaatsen`}
                        className="grid min-h-[36px] min-w-[36px] place-items-center rounded-lg border border-duck-gray text-duck-ink/60 transition-colors hover:border-duck-acid hover:text-duck-ink disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
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
    maxScore,
}) => {
    const [order, setOrder] = useState<DragSortItem[]>(() => shuffle(items));
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const handleSubmit = () => {
        const correct = order.filter((item, index) => item.correctPosition === index).length;
        const earned = Math.round((correct / items.length) * maxScore);
        setScore(earned);
        setSubmitted(true);
    };

    const handleMove = (id: string, direction: -1 | 1) => {
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
                    className="text-sm text-duck-ink/60"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {description}
                </p>
            </div>

            <div className="text-xs text-duck-ink/60 flex items-center gap-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <GripVertical size={12} />
                Sleep de kaarten in de juiste volgorde of gebruik de pijltjes
            </div>

            <Reorder.Group
                axis="y"
                values={order}
                onReorder={submitted ? () => {} : setOrder}
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
                    onClick={handleSubmit}
                    className="w-full py-3 bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Volgorde bevestigen
                </button>
            ) : (
                <button
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
