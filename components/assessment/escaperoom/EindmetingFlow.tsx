import React, { useState } from 'react';
import { NulmetingResult } from './types';
import { EscaperoomNulmeting } from './EscaperoomNulmeting';

interface EindmetingFlowProps {
  nulmetingResult: NulmetingResult;
  onComplete: (eindmetingResult: NulmetingResult) => void;
  onBack: () => void;
}

export const EindmetingFlow: React.FC<EindmetingFlowProps> = ({ nulmetingResult, onComplete, onBack }) => {
  const [stap, setStap] = useState<'escaperoom' | 'groei'>('escaperoom');
  const [resultaat, setResultaat] = useState<NulmetingResult | null>(null);

  if (stap === 'escaperoom') {
    return (
      <EscaperoomNulmeting
        variant="eindmeting"
        onComplete={(result) => {
          setResultaat(result);
          setStap('groei');
        }}
        onBack={onBack}
      />
    );
  }

  if (stap === 'groei' && resultaat) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200">
            <span className="text-white text-3xl font-black">+</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Groei wordt berekend...</h2>
          <p className="text-slate-400 text-sm mb-8">
            Je GroeiPaspoort is bijna klaar. Vergelijking met je nulmeting volgt binnenkort.
          </p>
          <button
            onClick={() => onComplete(resultaat)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black text-lg text-white shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            Ga naar je Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
};
