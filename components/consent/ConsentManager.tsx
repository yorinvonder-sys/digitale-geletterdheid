import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, ShieldOff, AlertTriangle, Check, Info, RefreshCw } from 'lucide-react';
import {
  getConsentStatus,
  grantConsent,
  revokeConsent,
  needsParentalConsent,
  type ConsentStatus,
  type ConsentType,
} from '../../services/consentService';
import { ParentalConsentForm } from './ParentalConsentForm';

interface ConsentManagerProps {
  studentId: string;
  schoolId: string;
  studentAge: number;
  studentName?: string;
  schoolName?: string;
}

export const ConsentManager: React.FC<ConsentManagerProps> = ({
  studentId,
  schoolId,
  studentAge,
  studentName = '',
  schoolName = '',
}) => {
  const [statuses, setStatuses] = useState<ConsentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<ConsentType | null>(null);
  const [showParentalForm, setShowParentalForm] = useState(false);
  const [pendingConsentType, setPendingConsentType] = useState<ConsentType | null>(null);
  const requiresParent = needsParentalConsent(studentAge);

  const loadStatuses = useCallback(async () => {
    setLoading(true);
    const data = await getConsentStatus(studentId);
    setStatuses(data);
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  const handleToggle = async (status: ConsentStatus) => {
    if (toggling) return;

    // Als consent nu aan staat: intrekken
    if (status.granted) {
      // Verplichte consents: waarschuwing
      if (status.required) {
        const confirmed = window.confirm(
          `"${status.label}" is verplicht om het platform te gebruiken. Als je dit uitzet, kun je bepaalde functies niet meer gebruiken. Weet je het zeker?`
        );
        if (!confirmed) return;
      }

      setToggling(status.consentType);
      await revokeConsent(status.consentType);
      await loadStatuses();
      setToggling(null);
      return;
    }

    // Als consent nu uit staat: aanzetten
    if (requiresParent) {
      // <16 jaar: ouderlijk formulier tonen
      setPendingConsentType(status.consentType);
      setShowParentalForm(true);
    } else {
      // >=16 jaar: direct consent geven
      setToggling(status.consentType);
      await grantConsent(status.consentType, 'student', schoolId);
      await loadStatuses();
      setToggling(null);
    }
  };

  const handleParentalConsentGranted = async (
    consentTypes: ConsentType[],
    parentEmail: string,
    parentName: string,
  ) => {
    setShowParentalForm(false);
    setToggling(pendingConsentType);
    for (const type of consentTypes) {
      await grantConsent(type, 'parent', schoolId, parentEmail, parentName);
    }
    await loadStatuses();
    setToggling(null);
    setPendingConsentType(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (showParentalForm) {
    return (
      <ParentalConsentForm
        statuses={statuses}
        initialConsentType={pendingConsentType}
        studentName={studentName}
        schoolName={schoolName}
        onSubmit={handleParentalConsentGranted}
        onCancel={() => {
          setShowParentalForm(false);
          setPendingConsentType(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <ShieldCheck size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Privacy & Toestemming</h3>
          <p className="text-xs text-slate-500">
            Beheer hier welke gegevens het platform mag gebruiken.
          </p>
        </div>
      </div>

      {requiresParent && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800">
            Omdat je jonger bent dan 16, moet een ouder of voogd toestemming geven.
            Klik op een schakelaar om het formulier te openen.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {statuses.map((status) => (
          <ConsentToggleRow
            key={status.consentType}
            status={status}
            toggling={toggling === status.consentType}
            onToggle={() => handleToggle(status)}
          />
        ))}
      </div>

      <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
        Je kunt je toestemming altijd intrekken. Verplichte toestemmingen zijn nodig om het platform te
        kunnen gebruiken. Meer informatie vind je in ons{' '}
        <a href="/privacy" className="underline hover:text-indigo-500">privacybeleid</a>.
      </p>
    </div>
  );
};

// ── Toggle row per consent type ──

interface ConsentToggleRowProps {
  status: ConsentStatus;
  toggling: boolean;
  onToggle: () => void;
}

const ConsentToggleRow: React.FC<ConsentToggleRowProps> = ({ status, toggling, onToggle }) => {
  return (
    <div className={`p-3 rounded-xl border transition-colors ${
      status.granted
        ? 'bg-green-50 border-green-200'
        : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-slate-800">{status.label}</span>
            {status.required && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                verplicht
              </span>
            )}
            {status.needsRenewal && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <RefreshCw size={8} />
                vernieuwen
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{status.description}</p>
          {status.granted && status.grantedAt && (
            <p className="text-[10px] text-slate-400 mt-1">
              Gegeven door {status.grantedBy === 'parent' ? 'ouder/voogd' : status.grantedBy === 'school' ? 'school' : 'jijzelf'} op{' '}
              {new Date(status.grantedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
        <button
          onClick={onToggle}
          disabled={toggling}
          className={`relative w-12 h-7 rounded-full transition-colors shrink-0 mt-0.5 ${
            toggling ? 'opacity-50 cursor-wait' : 'cursor-pointer'
          } ${status.granted ? 'bg-green-500' : 'bg-slate-300'}`}
          aria-label={`${status.label} ${status.granted ? 'uitzetten' : 'aanzetten'}`}
        >
          <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
            status.granted ? 'translate-x-5.5 left-auto right-0.5' : 'left-0.5'
          }`}>
            {toggling ? (
              <div className="w-3 h-3 border border-slate-300 border-t-slate-500 rounded-full animate-spin" />
            ) : status.granted ? (
              <Check size={12} className="text-green-600" />
            ) : (
              <ShieldOff size={10} className="text-slate-400" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
