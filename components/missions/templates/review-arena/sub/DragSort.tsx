import React, { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

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
}

const ItemRow: React.FC<ItemRowProps> = ({ item, submitted, currentIndex }) => {
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
                        ? 'bg-[#5F947D]/10 border-[#5F947D]'
                        : 'bg-[#D97848]/10 border-[#D97848]/60'
                    : 'bg-white border-[#E7D8BD] hover:border-[#D97848]/40 cursor-grab active:cursor-grabbing'
                }`}
        >
            <div
                onPointerDown={submitted ? undefined : (e) => controls.start(e)}
                className={`text-[#445865] ${submitted ? '' : 'cursor-grab active:cursor-grabbing'}`}
                style={{ touchAction: 'none' }}
            >
                <GripVertical size={16} />
            </div>

            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: submitted ? (isCorrect ? '#5F947D' : '#D97848') : '#D97848' }}>
                <span className="text-xs font-black text-white">{currentIndex + 1}</span>
            </div>

            <span
                className="flex-1 text-sm text-[#445865] font-medium"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {item.label}
            </span>

            {submitted && (
                isCorrect
                    ? <CheckCircle size={16} className="text-[#5F947D] flex-shrink-0" />
                    : <XCircle size={16} className="text-[#D97848] flex-shrink-0" />
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

    const handleContinue = () => {
        onComplete(score ?? 0, maxScore);
    };

    const correctCount = submitted ? order.filter((item, i) => item.correctPosition === i).length : 0;

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

            <div className="text-xs text-[#445865] flex items-center gap-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <GripVertical size={12} />
                Sleep de kaarten in de juiste volgorde
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
                    />
                ))}
            </Reorder.Group>

            {submitted && (
                <div
                    className={`p-3 rounded-xl text-sm font-medium ${
                        correctCount === items.length
                            ? 'bg-[#5F947D]/10 text-[#5F947D]'
                            : 'bg-[#D97848]/10 text-[#D97848]'
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
                    className="w-full py-3 bg-gradient-to-r from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Volgorde bevestigen
                </button>
            ) : (
                <button
                    onClick={handleContinue}
                    className="w-full py-3 bg-gradient-to-r from-[#5F947D] to-[#5F947D] hover:from-[#5F947D] hover:to-[#047857] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Volgende ronde
                    <ChevronRight size={16} />
                </button>
            )}
        </div>
    );
};
