
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { KamerScore } from './types';

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

// De juiste volgorde
const JUISTE_VOLGORDE = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

// Shuffle de blokken voor presentatie
const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface Props {
  onComplete: (score: KamerScore) => void;
}

export const KamerCodekluis: React.FC<Props> = ({ onComplete }) => {
  const [beschikbaar] = useState(() => shuffleArray(BESCHIKBARE_BLOKKEN));
  const [gekozen, setGekozen] = useState<CodeBlok[]>([]);
  const [resultaat, setResultaat] = useState<'success' | 'fail' | null>(null);
  const [startTijd] = useState(Date.now());

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

  const [laatsteScore, setLaatsteScore] = useState<{ score: number; tijdSeconds: number; details: Record<string, any> } | null>(null);

  const controleer = () => {
    const gekozenIds = gekozen.map(b => b.id);

    // Bereken score op basis van hoeveel blokken op de juiste positie staan
    let correctePosities = 0;
    JUISTE_VOLGORDE.forEach((id, index) => {
      if (gekozenIds[index] === id) correctePosities++;
    });

    const score = Math.round((correctePosities / JUISTE_VOLGORDE.length) * 100);
    const isPerfect = JSON.stringify(gekozenIds) === JSON.stringify(JUISTE_VOLGORDE);
    const tijdSeconds = Math.round((Date.now() - startTijd) / 1000);
    const details = { gekozenVolgorde: gekozenIds, correctePosities };

    if (isPerfect) {
      setResultaat('success');
      setTimeout(() => {
        onComplete({ score: 100, timeSeconds: tijdSeconds, details });
      }, 2000);
    } else {
      setResultaat('fail');
      setLaatsteScore({ score, tijdSeconds, details });
    }
  };

  const gaVerderMetScore = () => {
    if (laatsteScore) {
      onComplete({
        score: laatsteScore.score,
        timeSeconds: laatsteScore.tijdSeconds,
        details: laatsteScore.details,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-col h-full p-4 md:p-6"
    >
      {/* Header */}
      <div className="text-center mb-4 md:mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="text-violet-600" size={24} />
          <h2 className="text-xl md:text-2xl font-black text-violet-600">Codekluis</h2>
        </div>
        <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto">
          De deur zit op slot! Sleep de codeblokken in de juiste volgorde om de kluis te openen.
          Maak een alarmsysteem: als de deur opengaat, moet het alarm afgaan.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Gekozen volgorde */}
        <div className="md:w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Jouw code (klik om toe te voegen)</h3>
          <div className="flex-1 space-y-2">
            {gekozen.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl p-4">
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
                <div className="w-6 h-6 rounded-full bg-violet-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </div>
                <button
                  onClick={() => verwijder(index)}
                  disabled={!!resultaat}
                  className="flex-1 text-left px-4 py-3 bg-violet-50 border border-violet-200 rounded-lg font-mono text-sm text-violet-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-colors group"
                >
                  <span className="group-hover:hidden">{blok.tekst}</span>
                  <span className="hidden group-hover:inline">Verwijderen</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Beschikbare blokken */}
        <div className="md:w-1/2 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Beschikbare blokken</h3>
          <div className="flex-1 space-y-2">
            {beschikbareBlokken.map(blok => (
              <button
                key={blok.id}
                onClick={() => voegToe(blok)}
                disabled={!!resultaat}
                className="w-full text-left px-4 py-3 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-600 hover:border-violet-300 hover:bg-violet-50 transition-colors active:scale-[0.98]"
              >
                + {blok.tekst}
              </button>
            ))}
            {beschikbareBlokken.length === 0 && (
              <p className="text-slate-400 text-sm italic text-center py-4">Alle blokken zijn geplaatst!</p>
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
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
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
              onClick={() => { reset(); setResultaat(null); setLaatsteScore(null); }}
              className="px-4 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={18} /> Opnieuw
            </button>
            <button
              onClick={gaVerderMetScore}
              className="flex-1 py-3 rounded-xl font-bold text-lg transition-all bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ArrowRight size={18} /> Ga door
            </button>
          </>
        ) : (
          <>
            <button
              onClick={reset}
              disabled={gekozen.length === 0 || resultaat === 'success'}
              className="px-4 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={18} /> Reset
            </button>
            <button
              onClick={controleer}
              disabled={gekozen.length < BESCHIKBARE_BLOKKEN.length || !!resultaat}
              className="flex-1 py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ArrowRight size={18} /> Controleer code
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};
