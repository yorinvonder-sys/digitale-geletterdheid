import React, { useState } from 'react';
import { NulmetingResult } from './types';
import { EscaperoomNulmeting } from './EscaperoomNulmeting';
import { GroeiPaspoort } from './GroeiPaspoort';

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
      <GroeiPaspoort
        nulmetingResult={nulmetingResult}
        eindmetingResult={resultaat}
        onContinue={() => onComplete(resultaat)}
      />
    );
  }

  return null;
};
