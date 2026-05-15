import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Mail, User, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import type { ConsentStatus, ConsentType } from '@/services/consentService';
import { sendParentalConsentEmail } from '@/services/consentService';

interface ParentalConsentFormProps {
  statuses: ConsentStatus[];
  initialConsentType: ConsentType | null;
  studentName: string;
  schoolName: string;
  onSubmit: (consentTypes: ConsentType[], parentEmail: string, parentName: string) => Promise<void> | void;
  onCancel: () => void;
}

export const ParentalConsentForm: React.FC<ParentalConsentFormProps> = ({
  statuses,
  initialConsentType,
  studentName,
  schoolName,
  onSubmit,
  onCancel,
}) => {
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [relation, setRelation] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<ConsentType>>(() => {
    const initial = new Set<ConsentType>();
    if (initialConsentType) initial.add(initialConsentType);
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleType = (type: ConsentType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!parentName.trim()) newErrors.parentName = 'Vul de naam van de ouder/voogd in.';
    if (!parentEmail.trim()) {
      newErrors.parentEmail = 'Vul een e-mailadres in.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail.trim())) {
      newErrors.parentEmail = 'Vul een geldig e-mailadres in.';
    }
    if (!relation.trim()) newErrors.relation = 'Selecteer de relatie tot de leerling.';
    if (selectedTypes.size === 0) newErrors.types = 'Selecteer ten minste een toestemming.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);
    const types = Array.from(selectedTypes);
    const result = await sendParentalConsentEmail(parentEmail.trim(), parentName.trim(), studentName, schoolName, types);
    if (!result.success) {
      setSubmitError(result.error ?? 'Kon de toestemmingsmail niet versturen.');
      setSubmitting(false);
      return;
    }

    try {
      await onSubmit(types, parentEmail.trim(), parentName.trim());
    } catch (err: any) {
      setSubmitError(err?.message || 'Kon de aanvraag niet afronden.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  // Alleen niet-goedgekeurde consents tonen
  const availableStatuses = statuses.filter((s) => !s.granted);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-8 h-8 rounded-lg bg-lab-cream flex items-center justify-center hover:bg-lab-creamDeep transition-colors"
        >
          <ArrowLeft size={16} className="text-lab-muted" />
        </button>
        <div>
          <h3 className="text-base font-bold text-lab-ink">Toestemming ouder/voogd</h3>
          <p className="text-xs text-lab-muted">
            Omdat je jonger bent dan 16, vragen we je ouder of voogd om toestemming.
          </p>
        </div>
      </div>

      <div className="p-3 bg-lab-teal border border-lab-teal rounded-xl">
        <p className="text-xs text-lab-teal leading-relaxed">
          We versturen een unieke, beveiligde link naar je ouder of voogd. De toestemming wordt
          pas actief nadat die link is bevestigd.
        </p>
      </div>

      {submitError && (
        <div className="p-3 bg-lab-coral border border-lab-coral rounded-xl flex items-start gap-2">
          <AlertTriangle size={16} className="text-lab-muted mt-0.5 shrink-0" />
          <p className="text-xs text-lab-coral leading-relaxed">{submitError}</p>
        </div>
      )}

      {/* Naam ouder/voogd */}
      <div>
        <label className="block text-sm font-semibold text-lab-muted mb-1.5">
          <User size={14} className="inline mr-1.5 text-lab-muted" />
          Naam ouder/voogd
        </label>
        <input
          type="text"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          placeholder="Bijv. Jan de Vries"
          className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lab-coral ${
            errors.parentName ? 'border-lab-coral bg-lab-coral' : 'border-lab-line'
          }`}
        />
        {errors.parentName && <p className="text-xs text-lab-muted mt-1">{errors.parentName}</p>}
      </div>

      {/* E-mailadres */}
      <div>
        <label className="block text-sm font-semibold text-lab-muted mb-1.5">
          <Mail size={14} className="inline mr-1.5 text-lab-muted" />
          E-mailadres ouder/voogd
        </label>
        <input
          type="email"
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
          placeholder="ouder@voorbeeld.nl"
          className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lab-coral ${
            errors.parentEmail ? 'border-lab-coral bg-lab-coral' : 'border-lab-line'
          }`}
        />
        {errors.parentEmail && <p className="text-xs text-lab-muted mt-1">{errors.parentEmail}</p>}
      </div>

      {/* Relatie */}
      <div>
        <label className="block text-sm font-semibold text-lab-muted mb-1.5">Relatie tot leerling</label>
        <div className="flex gap-2">
          {['Ouder', 'Voogd', 'Verzorger'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setRelation(opt)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                relation === opt
                  ? 'bg-lab-coral border-lab-coral text-lab-coral'
                  : 'bg-white border-lab-line text-lab-muted hover:bg-lab-cream'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {errors.relation && <p className="text-xs text-lab-muted mt-1">{errors.relation}</p>}
      </div>

      {/* Consent checkboxes */}
      <div>
        <label className="block text-sm font-semibold text-lab-muted mb-2">
          Waarvoor geeft u toestemming?
        </label>
        {errors.types && <p className="text-xs text-lab-muted mb-2">{errors.types}</p>}
        <div className="space-y-2">
          {availableStatuses.map((status) => (
            <button
              key={status.consentType}
              type="button"
              onClick={() => toggleType(status.consentType)}
              className={`w-full text-left p-3 rounded-xl border transition-colors ${
                selectedTypes.has(status.consentType)
                  ? 'bg-lab-coral border-lab-coral'
                  : 'bg-white border-lab-line hover:bg-lab-cream'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {selectedTypes.has(status.consentType) ? (
                  <CheckSquare size={18} className="text-lab-coral mt-0.5 shrink-0" />
                ) : (
                  <Square size={18} className="text-lab-muted mt-0.5 shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-lab-ink">{status.label}</span>
                    {status.required && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-lab-coral px-1.5 py-0.5 rounded">
                        verplicht
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-lab-muted mt-0.5">{status.description}</p>
                </div>
              </div>
            </button>
          ))}
          {availableStatuses.length === 0 && (
            <p className="text-sm text-lab-muted text-center py-4">
              Alle toestemmingen zijn al gegeven.
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-lab-line text-lab-muted rounded-xl text-sm font-semibold hover:bg-lab-cream transition-colors"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={submitting || selectedTypes.size === 0}
          className="flex-1 px-4 py-2.5 bg-lab-coral text-white rounded-xl text-sm font-semibold hover:bg-lab-coral hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShieldCheck size={16} />
          {submitting ? 'Versturen...' : 'Verstuur toestemmingsmail'}
        </button>
      </div>

      <p className="text-[10px] text-lab-muted text-center leading-relaxed">
        Deze aanvraag verleent nog geen toestemming. Alleen de bevestiging via de e-mail activeert
        de geselecteerde verwerkingen.
      </p>
    </form>
  );
};
