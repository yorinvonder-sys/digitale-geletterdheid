import React, { useState } from 'react';
import { NulmetingResult } from './types';
import { EscaperoomNulmeting } from './EscaperoomNulmeting';
import { DigitaalPaspoort } from './DigitaalPaspoort';

interface NulmetingFlowProps {
  onComplete: (result: NulmetingResult) => void;
  onBack: () => void;
}

export const NulmetingFlow: React.FC<NulmetingFlowProps> = ({ onComplete, onBack }) => {
  const [stap, setStap] = useState<'escaperoom' | 'paspoort'>('escaperoom');
  const [resultaat, setResultaat] = useState<NulmetingResult | null>(null);

  if (stap === 'escaperoom') {
    return (
      <EscaperoomNulmeting
        onComplete={(result) => {
          setResultaat(result);
          setStap('paspoort');
        }}
        onBack={onBack}
      />
    );
  }

  if (stap === 'paspoort' && resultaat) {
    return (
      <DigitaalPaspoort
        result={resultaat}
        onContinue={() => onComplete(resultaat)}
      />
    );
  }

  return null;
};
