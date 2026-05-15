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
      <div className="w-full h-full bg-lab-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 md:p-8 border border-lab-line shadow-sm text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-lab-sage to-lab-sage shadow-lg shadow-lab-sage">
            <span className="text-white text-3xl font-black">+</span>
          </div>
          <h2 className="text-2xl font-black text-lab-ink mb-2">Groei wordt berekend...</h2>
          <p className="text-lab-muted text-sm mb-8">
            Je GroeiPaspoort is bijna klaar. Vergelijking met je nulmeting volgt binnenkort.
          </p>
          <button
            onClick={() => onComplete(resultaat)}
            className="w-full py-4 bg-lab-sage hover:bg-lab-sage hover:text-white rounded-xl font-black text-lg text-white shadow-lg shadow-lab-sage hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            Ga naar je Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
};
