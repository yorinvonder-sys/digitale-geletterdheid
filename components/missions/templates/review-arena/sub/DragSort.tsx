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
                        ? 'bg-[#10B981]/10 border-[#10B981]'
                        : 'bg-[#EF4444]/10 border-[#EF4444]/60'
                    : 'bg-white border-[#E8E6DF] hover:border-[#D97757]/40 cursor-grab active:cursor-grabbing'
                }`}
        >
            <div
                onPointerDown={submitted ? undefined : (e) => controls.start(e)}
                className={`text-[#6B6B66] ${submitted ? '' : 'cursor-grab active:cursor-grabbing'}`}
                style={{ touchAction: 'none' }}
            >
                <GripVertical size={16} />
            </div>

            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: submitted ? (isCorrect ? '#10B981' : '#EF4444') : '#D97757' }}>
                <span className="text-xs font-black text-white">{currentIndex + 1}</span>
            </div>

            <span
                className="flex-1 text-sm text-[#3D3D38] font-medium"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {item.label}
            </span>

            {submitted && (
                isCorrect
                    ? <CheckCircle size={16} className="text-[#10B981] flex-shrink-0" />
                    : <XCircle size={16} className="text-[#EF4444] flex-shrink-0" />
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
                    className="text-lg font-black text-[#1A1A19] mb-1"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    {title}
                </h3>
                <p
                    className="text-sm text-[#6B6B66]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {description}
                </p>
            </div>

            <div className="text-xs text-[#6B6B66] flex items-center gap-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
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
                            ? 'bg-[#10B981]/10 text-[#10B981]'
                            : 'bg-[#D97757]/10 text-[#D97757]'
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
                    className="w-full py-3 bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Volgorde bevestigen
                </button>
            ) : (
                <button
                    onClick={handleContinue}
                    className="w-full py-3 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Volgende ronde
                    <ChevronRight size={16} />
                </button>
            )}
        </div>
    );
};
