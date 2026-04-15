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
                    ? 'border-[#10B981] bg-[#10B981]/5'
                    : isWrong
                    ? 'border-[#D97757] bg-[#D97757]/5'
                    : 'border-[#E8E6DF] bg-white'
            }`}
        >
            <div className="flex items-start gap-2 mb-3">
                <Lightbulb size={14} className="text-[#D97757] mt-0.5 flex-shrink-0" />
                <p
                    className="text-sm font-bold text-[#1A1A19]"
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
                                        ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981] font-bold'
                                        : isThisWrong
                                        ? 'bg-[#D97757]/10 border-[#D97757] text-[#D97757] font-bold'
                                        : isSelected
                                        ? 'bg-[#D97757]/10 border-[#D97757] text-[#D97757] font-bold'
                                        : 'bg-white border-[#E8E6DF] text-[#3D3D38] hover:border-[#D97757]/40 disabled:opacity-70'
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
                            ? 'bg-[#E8E6DF] text-[#6B6B66] cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#D97757] to-[#C46849] text-white'
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
                        isCorrect ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#D97757]/10 text-[#D97757]'
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
