import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { hasConsent, type ConsentType, CONSENT_META } from '../../services/consentService';

interface ConsentGateProps {
  consentType: ConsentType;
  studentId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onRequestConsent?: () => void;
}

export const ConsentGate: React.FC<ConsentGateProps> = ({
  consentType,
  studentId,
  children,
  fallback,
  onRequestConsent,
}) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    hasConsent(studentId, consentType).then((result) => {
      if (!cancelled) setAllowed(result);
    });
    return () => { cancelled = true; };
  }, [studentId, consentType]);

  // Laden
  if (allowed === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Consent gegeven — render children
  if (allowed) {
    return <>{children}</>;
  }

  // Geen consent — toon fallback of standaard blokkade
  if (fallback) {
    return <>{fallback}</>;
  }

  const meta = CONSENT_META[consentType];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
        <AlertTriangle size={32} className="text-amber-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">Toestemming nodig</h3>
      <p className="text-sm text-slate-600 mb-1 font-medium">{meta.label}</p>
      <p className="text-sm text-slate-500 mb-6">{meta.description}</p>
      <p className="text-xs text-slate-400 mb-4">
        Om deze functie te gebruiken heb je toestemming nodig.
        {meta.required ? ' Dit is verplicht om deze functie te gebruiken.' : ''}
      </p>
      {onRequestConsent && (
        <button
          onClick={onRequestConsent}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <ShieldCheck size={16} />
          Toestemming geven
        </button>
      )}
    </div>
  );
};
