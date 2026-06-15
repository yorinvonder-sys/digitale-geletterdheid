import React from 'react';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { ConfidenceRating } from '../../shared/ConfidenceRating';
import type { SimQuestion } from '../SimulationLab';

export const QuestionCard: React.FC<{
    question: SimQuestion;
    answer: string | number | undefined;
    submitted: boolean;
    confidence: 1 | 2 | 3 | undefined;
    onAnswer: (val: string | number) => void;
    onSetConfidence: (level: 1 | 2 | 3) => void;
    onSubmit: () => void;
}> = ({ question, answer, submitted, confidence, onAnswer, onSetConfidence, onSubmit }) => {
    const isCorrect = submitted && answer === question.correctAnswer;
    const isWrong = submitted && answer !== question.correctAnswer;
    const showConfidenceWidget = !submitted && answer !== undefined && question.type === 'prediction' && question.showConfidence;
    const submitDisabled = showConfidenceWidget && !confidence;

    return (
        <div
            className={`rounded-2xl border p-4 transition-all duration-300 ${
                isCorrect
                    ? 'border-duck-ink bg-duck-ink/5'
                    : isWrong
                    ? 'border-duck-acid bg-duck-acid/5'
                    : 'border-duck-gray bg-white'
            }`}
        >
            <div className="flex items-start gap-2 mb-3">
                <Lightbulb size={14} className="text-duck-ink mt-0.5 flex-shrink-0" />
                <p
                    className="text-sm font-bold text-duck-ink"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {question.question}
                </p>
            </div>

            {/* Options */}
            {question.options && (
                <div className="space-y-1.5 mb-3">
                    {question.options.map((opt) => {
                        const isSelected = answer === opt;
                        const isThisCorrect = submitted && opt === question.correctAnswer;
                        const isThisWrong = submitted && isSelected && opt !== question.correctAnswer;
                        return (
                            <button
                                key={opt}
                                disabled={submitted}
                                onClick={() => onAnswer(opt)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 border flex items-center gap-2 ${
                                    isThisCorrect
                                        ? 'bg-duck-ink/10 border-duck-ink text-duck-ink font-bold'
                                        : isThisWrong
                                        ? 'bg-duck-acid/10 border-duck-acid text-duck-ink font-bold'
                                        : isSelected
                                        ? 'bg-duck-acid/10 border-duck-acid text-duck-ink font-bold'
                                        : 'bg-white border-duck-gray text-duck-ink/60 hover:border-duck-acid/40 disabled:opacity-70'
                                }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {isThisCorrect && <CheckCircle size={12} />}
                                {isThisWrong && <XCircle size={12} />}
                                {opt}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Confidence rating for prediction questions */}
            {showConfidenceWidget && (
                <div className="mb-3">
                    <ConfidenceRating onSelect={onSetConfidence} />
                </div>
            )}

            {/* Submit button */}
            {!submitted && answer !== undefined && (
                <button
                    onClick={onSubmit}
                    disabled={submitDisabled}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                        submitDisabled
                            ? 'bg-duck-gray text-duck-ink/60 cursor-not-allowed'
                            : 'bg-gradient-to-r from-duck-acid to-duck-acid text-white'
                    }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer antwoord
                </button>
            )}

            {/* Feedback */}
            {submitted && (
                <div
                    className={`flex items-start gap-2 mt-2 p-2 rounded-lg text-xs ${
                        isCorrect ? 'bg-duck-ink/10 text-duck-ink' : 'bg-duck-acid/10 text-duck-acid'
                    }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {isCorrect ? (
                        <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                    ) : (
                        <XCircle size={12} className="mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                        <span className="font-bold">{isCorrect ? 'Goed! ' : 'Niet helemaal. '}</span>
                        {question.explanation}
                    </div>
                </div>
            )}
        </div>
    );
};
