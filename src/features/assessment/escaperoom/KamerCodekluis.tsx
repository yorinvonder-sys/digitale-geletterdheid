
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, XCircle, RotateCcw, ArrowRight, Presentation } from 'lucide-react';
import { KamerScore } from './types';
import { BLOKKEN_V2, JUISTE_VOLGORDE_V2 } from './data/kamer3Data';

interface CodeBlok {
  id: string;
  tekst: string;
}

const BESCHIKBARE_BLOKKEN: CodeBlok[] = [
  { id: 'c1', tekst: 'START programma' },
  { id: 'c2', tekst: 'LEES sensor deur' },
  { id: 'c3', tekst: 'ALS deur == open' },
  { id: 'c4', tekst: '  ZET alarm AAN' },
  { id: 'c5', tekst: '  STUUR melding naar telefoon' },
  { id: 'c6', tekst: 'EINDE ALS' },
];

const JUISTE_VOLGORDE = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface ProductOptie {
  id: string;
  label: string;
  beschrijving: string;
  score: number;
  feedback: string;
}

const PRODUCT_OPTIES: ProductOptie[] = [
  {
    id: 'p1',
    label: 'Stuur de broncode (.py)',
    beschrijving: 'Het Python-bestand mailen naar de directeur',
    score: 0,
    feedback: 'Broncode is alleen leesbaar voor programmeurs. De directeur kan dit niet begrijpen.',
  },
  {
    id: 'p2',
    label: 'Maak een instructievideo',
    beschrijving: 'Een korte video die laat zien hoe het systeem werkt',
    score: 100,
    feedback: 'Uitstekend! Een video is visueel, duidelijk en begrijpelijk voor iedereen.',
  },
  {
    id: 'p3',
    label: 'Schrijf een stappenplan',
    beschrijving: 'Een tekstdocument met uitleg over het alarmsysteem',
    score: 75,
    feedback: 'Goed! Een schriftelijk stappenplan werkt, al is een video of presentatie nog toegankelijker.',
  },
  {
    id: 'p4',
    label: 'Stuur een screenshot',
    beschrijving: 'Een foto van je scherm via Teams opsturen',
    score: 25,
    feedback: 'Een screenshot alleen geeft te weinig uitleg voor iemand zonder codeerkennis.',
  },
];

interface Props {
  onComplete: (score: KamerScore) => void;
  variant?: 'nulmeting' | 'eindmeting';
}

export const KamerCodekluis: React.FC<Props> = ({ onComplete, variant }) => {
  const activeBlokken = variant === 'eindmeting' ? BLOKKEN_V2 : BESCHIKBARE_BLOKKEN;
  const juisteVolgorde = variant === 'eindmeting' ? JUISTE_VOLGORDE_V2 : JUISTE_VOLGORDE;
  const [beschikbaar] = useState(() => shuffleArray(activeBlokken));
  const [gekozen, setGekozen] = useState<CodeBlok[]>([]);
  const [resultaat, setResultaat] = useState<'success' | 'fail' | null>(null);
  const [startTijd] = useState(Date.now());
  const [fase, setFase] = useState<'code' | 'product'>('code');
  const [codeScore, setCodeScore] = useState(0);
  const [codeDetails, setCodeDetails] = useState<Record<string, any>>({});
  const [gekozenProduct, setGekozenProduct] = useState<string | null>(null);

  const beschikbareBlokken = beschikbaar.filter(b => !gekozen.find(g => g.id === b.id));

  const voegToe = (blok: CodeBlok) => {
    if (resultaat) return;
    setGekozen(prev => [...prev, blok]);
  };

  const verwijder = (index: number) => {
    if (resultaat) return;
    setGekozen(prev => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setGekozen([]);
    setResultaat(null);
  };

  const gaNaarProductFase = (score: number, details: Record<string, any>) => {
    setCodeScore(score);
    setCodeDetails(details);
    setFase('product');
  };

  const controleer = () => {
    const gekozenIds = gekozen.map(b => b.id);
    let correctePosities = 0;
    juisteVolgorde.forEach((id, index) => {
      if (gekozenIds[index] === id) correctePosities++;
    });
    const score = Math.round((correctePosities / juisteVolgorde.length) * 100);
    const isPerfect = JSON.stringify(gekozenIds) === JSON.stringify(juisteVolgorde);
    const tijdSeconds = Math.round((Date.now() - startTijd) / 1000);
    const details = { gekozenVolgorde: gekozenIds, correctePosities };

    if (isPerfect) {
      setResultaat('success');
      setTimeout(() => gaNaarProductFase(100, details), 1500);
    } else {
      setResultaat('fail');
      setCodeScore(score);
      setCodeDetails(details);
    }
  };

  const kiesProduct = (optieId: string) => {
    if (gekozenProduct) return;
    setGekozenProduct(optieId);
    const optie = PRODUCT_OPTIES.find(o => o.id === optieId)!;
    const tijdSeconds = Math.round((Date.now() - startTijd) / 1000);
    const combinedScore = Math.round((codeScore + optie.score) / 2);
    setTimeout(() => {
      onComplete({
        score: combinedScore,
        timeSeconds: tijdSeconds,
        details: { ...codeDetails, productKeuze: optieId, productScore: optie.score, codeScore },
      });
    }, 2000);
  };

  if (fase === 'product') {
    return (
      <motion.div
        key="product"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-full p-4 md:p-6"
      >
        <div className="text-center mb-4 md:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Presentation className="text-lab-teal" size={24} />
            <h2 className="text-xl md:text-2xl font-black text-lab-teal">Digitaal product</h2>
          </div>
          <p className="text-lab-muted text-sm md:text-base max-w-lg mx-auto">
            Goed gedaan! Je hebt het alarmsysteem geprogrammeerd. Nu wil je uitleggen hoe het werkt
            aan de schooldirecteur die geen code kent. Welk digitaal product maak je?
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 gap-3 content-start">
          {PRODUCT_OPTIES.map(optie => {
            const isGekozen = gekozenProduct === optie.id;
            const isCorrect = optie.score >= 75;
            return (
              <motion.button
                key={optie.id}
                onClick={() => kiesProduct(optie.id)}
                disabled={!!gekozenProduct}
                whileHover={!gekozenProduct ? { scale: 1.01 } : undefined}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isGekozen
                    ? isCorrect
                      ? 'bg-lab-sage/10 border-lab-sage'
                      : 'bg-lab-coral/10 border-lab-coral'
                    : 'bg-white border-lab-line hover:border-lab-teal'
                } disabled:cursor-not-allowed`}
              >
                <div className="flex items-start gap-3">
                  {isGekozen && (
                    <div className={`mt-0.5 shrink-0 ${isCorrect ? 'text-lab-sage' : 'text-lab-coral'}`}>
                      {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-lab-ink text-sm md:text-base">{optie.label}</p>
                    <p className="text-lab-muted text-xs md:text-sm mt-0.5">{optie.beschrijving}</p>
                    {isGekozen && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs md:text-sm mt-2 font-medium ${isCorrect ? 'text-lab-sage' : 'text-lab-coral'}`}
                      >
                        {optie.feedback}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="code"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-col h-full p-4 md:p-6"
    >
      {/* Header */}
      <div className="text-center mb-4 md:mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="text-lab-teal" size={24} />
          <h2 className="text-xl md:text-2xl font-black text-lab-teal">Codekluis</h2>
        </div>
        <p className="text-lab-muted text-sm md:text-base max-w-lg mx-auto">
          De deur zit op slot! Sleep de codeblokken in de juiste volgorde om de kluis te openen.
          Maak een alarmsysteem: als de deur opengaat, moet het alarm afgaan.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Gekozen volgorde */}
        <div className="md:w-1/2 bg-white rounded-xl border border-lab-line shadow-sm p-4 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-lab-muted mb-3">Jouw code (klik om toe te voegen)</h3>
          <div className="flex-1 space-y-2">
            {gekozen.length === 0 && (
              <div className="h-full flex items-center justify-center text-lab-muted text-sm border-2 border-dashed border-lab-line rounded-xl p-4">
                Klik op codeblokken om ze hier toe te voegen
              </div>
            )}
            {gekozen.map((blok, index) => (
              <motion.div
                key={`${blok.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-lab-coral text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </div>
                <button
                  onClick={() => verwijder(index)}
                  disabled={!!resultaat}
                  className="flex-1 text-left px-4 py-3 bg-lab-teal border border-lab-teal rounded-lg font-mono text-sm text-lab-teal hover:bg-lab-coral hover:border-lab-coral hover:text-lab-coral transition-colors group"
                >
                  <span className="group-hover:hidden">{blok.tekst}</span>
                  <span className="hidden group-hover:inline">Verwijderen</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Beschikbare blokken */}
        <div className="md:w-1/2 bg-lab-cream rounded-xl border border-lab-line p-4 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-lab-muted mb-3">Beschikbare blokken</h3>
          <div className="flex-1 space-y-2">
            {beschikbareBlokken.map(blok => (
              <button
                key={blok.id}
                onClick={() => voegToe(blok)}
                disabled={!!resultaat}
                className="w-full text-left px-4 py-3 bg-white border border-lab-line rounded-lg font-mono text-sm text-lab-muted hover:border-lab-teal hover:bg-lab-teal hover:text-white transition-colors active:scale-[0.98]"
              >
                + {blok.tekst}
              </button>
            ))}
            {beschikbareBlokken.length === 0 && (
              <p className="text-lab-muted text-sm italic text-center py-4">Alle blokken zijn geplaatst!</p>
            )}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {resultaat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl border text-center ${
            resultaat === 'success'
              ? 'bg-lab-sage border-lab-sage text-lab-sage'
              : 'bg-lab-coral border-lab-coral text-lab-coral'
          }`}
        >
          <div className="flex items-center justify-center gap-2 font-bold">
            {resultaat === 'success' ? (
              <><CheckCircle size={20} /> De kluis gaat open! Code correct.</>
            ) : (
              <><XCircle size={20} /> Dat klopt nog niet helemaal. Probeer opnieuw of ga door.</>
            )}
          </div>
        </motion.div>
      )}

      {/* Knoppen */}
      <div className="mt-4 flex gap-3">
        {resultaat === 'fail' ? (
          <>
            <button
              onClick={() => { reset(); }}
              className="px-4 py-3 bg-white border border-lab-line text-lab-muted rounded-xl font-bold hover:bg-lab-cream transition-colors flex items-center gap-2"
            >
              <RotateCcw size={18} /> Opnieuw
            </button>
            <button
              onClick={() => gaNaarProductFase(codeScore, codeDetails)}
              className="flex-1 py-3 rounded-xl font-bold text-lg transition-all bg-lab-teal hover:bg-lab-teal hover:text-white text-white shadow-lg shadow-lab-teal active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ArrowRight size={18} /> Ga door
            </button>
          </>
        ) : (
          <>
            <button
              onClick={reset}
              disabled={gekozen.length === 0 || resultaat === 'success'}
              className="px-4 py-3 bg-white border border-lab-line text-lab-muted rounded-xl font-bold hover:bg-lab-cream disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={18} /> Reset
            </button>
            <button
              onClick={controleer}
              disabled={gekozen.length < activeBlokken.length || !!resultaat}
              className="flex-1 py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-lab-teal hover:bg-lab-teal hover:text-white text-white shadow-lg shadow-lab-teal active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ArrowRight size={18} /> Controleer code
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};
