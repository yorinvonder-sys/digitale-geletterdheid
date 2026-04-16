/**
 * TeacherFeedbackWidget — Floating action button + feedback modal voor docenten
 *
 * Renders a fixed FAB (bottom-right) that opens a modal with:
 * - NPS slider (0–10)
 * - Category dropdown
 * - Free-text textarea (max 4000 chars)
 * - Support section (mailto + compliance link)
 * - Honeypot field for bot detection
 *
 * Submit goes to the submitPilotFeedback edge function via authenticatedFetch.
 * LocalStorage hint written after successful submit.
 */
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, CheckCircle, ChevronDown } from 'lucide-react';
import { EDGE_FUNCTION_URL, authenticatedFetch } from '../../services/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface TeacherFeedbackWidgetProps {
  teacherUid: string;
  schoolId: string | null;
  role?: string;
}

type Category = 'ui' | 'content' | 'compliance' | 'performance' | 'onboarding' | 'other';

const CATEGORY_LABELS: Record<Category, string> = {
  ui: 'Interface & gebruik',
  content: 'Inhoud & missies',
  compliance: 'Privacy & compliance',
  performance: 'Snelheid & prestaties',
  onboarding: 'Onboarding',
  other: 'Overig',
};

const LS_KEY = 'dgskills_feedback_last_submitted_at';
const AUTO_CLOSE_MS = 3000;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const TeacherFeedbackWidget: React.FC<TeacherFeedbackWidgetProps> = ({
  teacherUid,
  schoolId,
  role,
}) => {
  const [open, setOpen] = useState(false);
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [category, setCategory] = useState<Category>('other');
  const [feedbackText, setFeedbackText] = useState('');
  const [honeypot, setHoneypot] = useState(''); // must stay empty
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Auto-close timer after submit
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  function handleClose(): void {
    if (submitting) return;
    setOpen(false);
    // Reset state after modal closes
    setTimeout(() => {
      setNpsScore(null);
      setCategory('other');
      setFeedbackText('');
      setHoneypot('');
      setSubmitted(false);
      setError(null);
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    const hasNps = npsScore !== null;
    const hasText = feedbackText.trim().length > 0;
    if (!hasNps && !hasText) {
      setError('Geef een NPS-score of schrijf een opmerking.');
      return;
    }

    if (feedbackText.length > 4000) {
      setError('Feedback is te lang (max 4000 tekens).');
      return;
    }

    setSubmitting(true);
    try {
      const response = await authenticatedFetch(
        `${EDGE_FUNCTION_URL}/submitPilotFeedback`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nps_score: npsScore,
            feedback_text: feedbackText.trim() || null,
            category,
            role: role || null,
            school_id: schoolId || null,
            website: honeypot, // honeypot
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError((data as { error?: string }).error || 'Er ging iets mis. Probeer het later opnieuw.');
        return;
      }

      // Client-side rate limit hint (server is authoritative)
      try {
        localStorage.setItem(LS_KEY, String(Date.now()));
      } catch {
        // ignore localStorage errors
      }

      setSubmitted(true);
      closeTimerRef.current = setTimeout(handleClose, AUTO_CLOSE_MS);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Er ging iets mis.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  // NPS color helper
  function npsColor(score: number): string {
    if (score >= 9) return 'bg-green-500';
    if (score >= 7) return 'bg-yellow-400';
    return 'bg-red-400';
  }

  return (
    <>
      {/* FAB — fixed bottom-right */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Feedback geven"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
      >
        <MessageSquare className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Overlay + modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            ref={modalRef}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2
                id="feedback-modal-title"
                className="text-base font-semibold text-gray-900"
              >
                Pilot-feedback
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Sluiten"
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Success state */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                <CheckCircle className="w-12 h-12 text-green-500" aria-hidden="true" />
                <p className="text-gray-800 font-medium">Bedankt voor je feedback!</p>
                <p className="text-sm text-gray-500">We lezen dit wekelijks en komen terug met updates.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="px-6 py-5 space-y-5">

                  {/* NPS slider */}
                  <fieldset>
                    <legend className="text-sm font-medium text-gray-700 mb-2">
                      Hoe waarschijnlijk is het dat je DGSkills aanbeveelt aan een collega?
                    </legend>
                    <div className="flex gap-1 flex-wrap">
                      {Array.from({ length: 11 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNpsScore(i)}
                          aria-pressed={npsScore === i}
                          aria-label={`Score ${i}`}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                            npsScore === i
                              ? `${npsColor(i)} text-white shadow`
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400">Onwaarschijnlijk</span>
                      <span className="text-xs text-gray-400">Zeker</span>
                    </div>
                  </fieldset>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="feedback-category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Categorie
                    </label>
                    <div className="relative">
                      <select
                        id="feedback-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(
                          ([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Feedback textarea */}
                  <div>
                    <label
                      htmlFor="feedback-text"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Toelichting <span className="text-gray-400 font-normal">(optioneel)</span>
                    </label>
                    <textarea
                      id="feedback-text"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Wat werkt goed? Wat kan beter?"
                      rows={4}
                      maxLength={4000}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <div className="text-right text-xs text-gray-400 mt-0.5">
                      {feedbackText.length}/4000
                    </div>
                  </div>

                  {/* Helper text */}
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    We lezen wekelijks alle feedback en komen terug met updates.
                  </p>

                  {/* Error */}
                  {error && (
                    <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  {/* Honeypot — hidden from real users */}
                  <div aria-hidden="true" className="hidden" tabIndex={-1}>
                    <label htmlFor="feedback-website">Website</label>
                    <input
                      id="feedback-website"
                      type="text"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      autoComplete="off"
                      tabIndex={-1}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Verzenden…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" aria-hidden="true" />
                        Verzenden
                      </>
                    )}
                  </button>
                </div>

                {/* Support section */}
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                  <p className="text-xs font-medium text-gray-700 mb-2">Hulp nodig?</p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>
                      <a
                        href={`mailto:support@dgskills.app?subject=${encodeURIComponent('Vraag van pilot-school')}`}
                        className="text-indigo-600 hover:text-indigo-800 underline focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded"
                      >
                        support@dgskills.app
                      </a>
                      {' '}— reactie binnen 2 werkdagen, pilot-scholen krijgen voorrang
                    </li>
                    <li>
                      Compliance-vragen?{' '}
                      <a
                        href="/compliance-hub"
                        className="text-indigo-600 hover:text-indigo-800 underline focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded"
                      >
                        Bekijk de Compliance Hub
                      </a>
                    </li>
                  </ul>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
