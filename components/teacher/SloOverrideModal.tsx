/**
 * SloOverrideModal — EU AI Act Art. 14 Human Oversight
 *
 * Stelt een docent in staat om een door AI berekend SLO-percentage te
 * corrigeren. De override + verplichte reden worden gelogd via
 * `logOversightEvent({ eventType: 'teacher_override', ... })`.
 *
 * Toegankelijkheid:
 *  - role="dialog", aria-modal="true", aria-labelledby
 *  - Basis focus-trap: bij mount focust het eerste interactieve element
 *  - Escape sluit de modal
 *
 * Veiligheid:
 *  - reasoning gevalideerd (min 10, max 2000 tekens) vóór insert
 *  - override percentage gevalideerd (0-100, geheel getal)
 *  - Geen PII gegenereerd buiten de door de docent ingevulde reasoning
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { StudentData } from '../../types';
import { SloKerndoelCode, SLO_KERNDOELEN } from '../../config/sloKerndoelen';
import { logOversightEvent } from '../../services/aiOversightService';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface SloOverrideModalProps {
  open: boolean;
  onClose: () => void;
  student: StudentData;
  schoolId: string | null;
  sloCode: SloKerndoelCode;
  currentAiPercentage: number;
  onOverrideSaved?: (overrideValue: number, reasoning: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const SloOverrideModal: React.FC<SloOverrideModalProps> = ({
  open,
  onClose,
  student,
  schoolId,
  sloCode,
  currentAiPercentage,
  onOverrideSaved,
}) => {
  const [overrideInput, setOverrideInput] = useState<string>(String(currentAiPercentage));
  const [reasoning, setReasoning] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  const firstFocusRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const kd = SLO_KERNDOELEN[sloCode];
  const displayName = student.displayName || 'Onbekende leerling';

  // Reset state bij openen
  useEffect(() => {
    if (open) {
      setOverrideInput(String(currentAiPercentage));
      setReasoning('');
      setFieldError(null);
      setSavedOk(false);
      setSaving(false);
      // Focus eerste veld zodra modal zichtbaar is
      setTimeout(() => firstFocusRef.current?.focus(), 50);
    }
  }, [open, currentAiPercentage]);

  // Escape sluit de modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const validate = useCallback((): string | null => {
    const pct = parseInt(overrideInput, 10);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      return 'Voer een geldig percentage in (0–100).';
    }
    const trimmedReasoning = reasoning.trim();
    if (trimmedReasoning.length < 10) {
      return 'Reden is verplicht (minimaal 10 tekens).';
    }
    if (trimmedReasoning.length > 2000) {
      return 'Reden mag maximaal 2000 tekens bevatten.';
    }
    return null;
  }, [overrideInput, reasoning]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    const validationError = validate();
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    const overridePercentage = parseInt(overrideInput, 10);
    const trimmedReasoning = reasoning.trim();

    setSaving(true);
    const result = await logOversightEvent({
      eventType: 'teacher_override',
      schoolId,
      studentUid: student.uid,
      sloCode,
      aiValue: { percentage: currentAiPercentage },
      overrideValue: { percentage: overridePercentage },
      reasoning: trimmedReasoning,
    });
    setSaving(false);

    if (!result.ok) {
      setFieldError(result.error ?? 'Opslaan mislukt. Probeer opnieuw.');
      return;
    }

    setSavedOk(true);
    onOverrideSaved?.(overridePercentage, trimmedReasoning);

    // Sluit na korte bevestigingstijd
    setTimeout(() => onClose(), 1400);
  }, [validate, overrideInput, reasoning, schoolId, student.uid, sloCode, currentAiPercentage, onOverrideSaved, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="slo-override-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
          <div className="min-w-0">
            <h2
              id="slo-override-modal-title"
              className="text-base font-bold text-slate-900 truncate"
            >
              SLO-percentage corrigeren — {displayName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              <span className="font-semibold">{sloCode}</span> {kd.label}
              {' · '}EU AI Act Art. 14 Human Oversight
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Sluit"
          >
            <X size={18} />
          </button>
        </div>

        {/* Inhoud */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Vergelijking AI vs override */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                AI-berekend
              </p>
              <p className="text-2xl font-bold text-slate-500">{currentAiPercentage}%</p>
              <p className="text-[11px] text-slate-400 mt-1">automatisch bepaald</p>
            </div>
            <div className="rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-3">
              <label
                htmlFor="override-percentage"
                className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1 block"
              >
                Jouw correctie (%)
              </label>
              <input
                ref={firstFocusRef}
                id="override-percentage"
                type="number"
                min={0}
                max={100}
                step={1}
                value={overrideInput}
                onChange={(e) => setOverrideInput(e.target.value)}
                className="w-full bg-transparent text-2xl font-bold text-indigo-700 focus:outline-none focus:ring-0 border-none p-0"
                aria-label="Gecorrigeerd percentage (0 tot 100)"
                disabled={saving || savedOk}
                required
              />
            </div>
          </div>

          {/* Verplichte reden */}
          <div>
            <label
              htmlFor="override-reasoning"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Reden voor correctie
              <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
              <span className="sr-only">(verplicht)</span>
            </label>
            <textarea
              id="override-reasoning"
              rows={4}
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Beschrijf waarom dit percentage gecorrigeerd wordt (bijv. leerling heeft aantoonbaar beheersing getoond buiten de missies, of een missie is onterecht niet meegeteld)."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none transition-colors"
              maxLength={2000}
              disabled={saving || savedOk}
              aria-describedby="override-reasoning-hint"
              required
            />
            <p
              id="override-reasoning-hint"
              className="text-[11px] text-slate-400 mt-1 flex items-center justify-between"
            >
              <span>Minimaal 10 tekens. Wordt opgeslagen als EU AI Act Art. 14 audit-log.</span>
              <span className={reasoning.length > 1800 ? 'text-amber-600 font-semibold' : ''}>
                {reasoning.length}/2000
              </span>
            </p>
          </div>

          {/* Foutmelding */}
          {fieldError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{fieldError}</span>
            </div>
          )}

          {/* Succesmelding */}
          {savedOk && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-semibold"
            >
              <CheckCircle size={16} className="flex-shrink-0" />
              Correctie opgeslagen en gelogd.
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saving || savedOk}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                saving || savedOk
                  ? 'bg-indigo-400 text-white cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saving ? 'Opslaan...' : savedOk ? 'Opgeslagen' : 'Correctie opslaan'}
            </button>
          </div>
        </form>

        {/* Compliance footer */}
        <div className="px-6 pb-4 text-[10px] text-slate-400">
          Deze correctie wordt vastgelegd als EU AI Act Art. 14 human oversight log.
          De originele AI-berekening blijft zichtbaar in het audit trail.
        </div>
      </div>
    </div>,
    document.body,
  );
};
