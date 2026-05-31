import React from 'react';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { ConfidenceRating } from '../../shared/ConfidenceRating';
import type { SimQuestion } from '../SimulationLab';

function normalizeAnswer(value: string | number | undefined): string {
    if (value === undefined) return '';
    return String(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const STOPWORDS = new Set([
    'de', 'het', 'een', 'en', 'of', 'om', 'dat', 'dit', 'die', 'dan', 'als', 'voor', 'van', 'met', 'naar',
    'jouw', 'jij', 'je', 'zijn', 'wordt', 'worden', 'heeft', 'hebben', 'door', 'bij', 'op', 'in', 'te',
    'want', 'niet', 'wel', 'meer', 'minder', 'alleen', 'altijd', 'zelfde', 'kun', 'kan', 'uit', 'aan',
]);

function meaningfulTokens(value: string | number): string[] {
    return normalizeAnswer(value)
        .split(/\s+/)
        .filter((token) => token.length >= 4 && !STOPWORDS.has(token));
}

export function isSimulationQuestionCorrect(
    question: SimQuestion,
    answer: string | number | undefined
): boolean {
    if (answer === undefined) return false;
    const normalizedAnswer = normalizeAnswer(answer);
    const normalizedCorrect = normalizeAnswer(question.correctAnswer);

    if (normalizedAnswer === normalizedCorrect) return true;

    if (question.type === 'multiple-choice' || question.type === 'prediction') {
        return false;
    }

    if (typeof answer === 'string' && answer.trim().length < (question.minAnswerLength ?? 8)) {
        return false;
    }

    if (question.requiredKeywords && question.requiredKeywords.length > 0) {
        return question.requiredKeywords.every((keyword) => normalizedAnswer.includes(normalizeAnswer(keyword)));
    }

    const tokens = Array.from(new Set(meaningfulTokens(question.correctAnswer)));
    if (tokens.length === 0) return false;
    const needed = tokens.length <= 2 ? tokens.length : 2;
    return tokens.filter((token) => normalizedAnswer.includes(token)).length >= needed;
}

export const QuestionCard: React.FC<{
    question: SimQuestion;
    answer: string | number | undefined;
    submitted: boolean;
    confidence: 1 | 2 | 3 | undefined;
    onAnswer: (val: string | number) => void;
    onSetConfidence: (level: 1 | 2 | 3) => void;
    onSubmit: () => void;
}> = ({ question, answer, submitted, confidence, onAnswer, onSetConfidence, onSubmit }) => {
    const isChoiceQuestion = question.type === 'multiple-choice' && !!question.options?.length;
    const isCorrect = submitted && isSimulationQuestionCorrect(question, answer);
    const isWrong = submitted && !isSimulationQuestionCorrect(question, answer);
    const showConfidenceWidget = !submitted && answer !== undefined && question.type === 'prediction' && question.showConfidence;
    const hasAnswer = typeof answer === 'string' ? answer.trim().length > 0 : answer !== undefined;
    const submitDisabled = !hasAnswer || (showConfidenceWidget && !confidence);

    return (
        <div
            data-qa="simulation-question-card"
            data-question-id={question.id}
            className={`rounded-2xl border p-3 transition-all duration-300 ${
                isCorrect
                    ? 'border-[#5F947D] bg-[#5F947D]/5'
                    : isWrong
                    ? 'border-[#D97848] bg-[#D97848]/5'
                    : 'border-[#E7D8BD] bg-white'
            }`}
        >
            <div className="mb-2 flex items-start gap-2">
                <Lightbulb size={14} className="text-[#D97848] mt-0.5 flex-shrink-0" />
                <p
                    className="text-xs font-bold leading-snug text-[#08283B] sm:text-sm"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {question.question}
                </p>
            </div>

            {/* Options */}
            {isChoiceQuestion && question.options && (
                <div className="mb-2 grid gap-1.5 sm:grid-cols-2">
                    {question.options.map((opt) => {
                        const isSelected = answer === opt;
                        const isThisCorrect = submitted && opt === question.correctAnswer;
                        const isThisWrong = submitted && isSelected && opt !== question.correctAnswer;
                        return (
                            <button
                                key={opt}
                                disabled={submitted}
                                onClick={() => onAnswer(opt)}
                                data-qa={`question-option-${opt}`}
                                className={`flex min-h-[42px] w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[11px] leading-tight transition-all duration-200 sm:text-xs ${
                                    isThisCorrect
                                        ? 'bg-[#5F947D]/10 border-[#5F947D] text-[#5F947D] font-bold'
                                        : isThisWrong
                                        ? 'bg-[#D97848]/10 border-[#D97848] text-[#D97848] font-bold'
                                        : isSelected
                                        ? 'bg-[#D97848]/10 border-[#D97848] text-[#D97848] font-bold'
                                        : 'bg-white border-[#E7D8BD] text-[#445865] hover:border-[#D97848]/40 disabled:opacity-70'
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

            {!isChoiceQuestion && (
                <div className="mb-2">
                    <label
                        htmlFor={`simulation-answer-${question.id}`}
                        className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Bewijsantwoord
                    </label>
                    <textarea
                        id={`simulation-answer-${question.id}`}
                        value={typeof answer === 'string' ? answer : ''}
                        disabled={submitted}
                        onChange={(event) => onAnswer(event.target.value)}
                        data-qa="question-textarea"
                        rows={2}
                        placeholder="Beschrijf wat je in de simulatie ziet..."
                        className="w-full resize-none rounded-xl border border-[#E7D8BD] bg-[#FFFDF7] px-3 py-2 text-xs font-semibold leading-relaxed text-[#08283B] outline-none transition-colors placeholder:text-[#445865]/50 focus:border-[#D97848] focus:ring-2 focus:ring-[#D97848]/15 disabled:opacity-80"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                    <p
                        className="mt-1.5 text-[11px] leading-snug text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Noem het belangrijkste effect, risico of principe dat je met de controls hebt getest.
                    </p>
                </div>
            )}

            {/* Confidence rating for prediction questions */}
            {showConfidenceWidget && (
                <div className="mb-3">
                    <ConfidenceRating onSelect={onSetConfidence} />
                </div>
            )}

            {/* Submit button */}
            {!submitted && (
                <button
                    onClick={onSubmit}
                    disabled={submitDisabled}
                    data-qa="question-submit"
                    className={`min-h-[40px] w-full rounded-lg py-2 text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                        submitDisabled
                            ? 'bg-[#E7D8BD] text-[#445865] cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#D97848] to-[#D97848] text-white'
                    }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer antwoord
                </button>
            )}

            {/* Feedback */}
            {submitted && (
                <div
                    className={`mt-2 flex items-start gap-2 rounded-lg p-2 text-[11px] leading-snug sm:text-xs ${
                        isCorrect ? 'bg-[#5F947D]/10 text-[#5F947D]' : 'bg-[#D97848]/10 text-[#D97848]'
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
