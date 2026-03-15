
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { KamerScore } from './types';

interface NieuwsBericht {
  id: string;
  titel: string;
  bron: string;
  tekst: string;
  hints: string[];
  isNep: boolean;
  uitleg: string;
}

const BERICHTEN: NieuwsBericht[] = [
  {
    id: 'n1',
    titel: 'Nieuwe schoolregels: telefoons verboden in klas',
    bron: 'NOS Jeugdjournaal',
    tekst: 'Vanaf volgend schooljaar mogen leerlingen geen telefoon meer gebruiken tijdens de les. Minister Wiersma heeft dit besloten na overleg met scholen.',
    hints: ['Bekende, betrouwbare bron', 'Noemt specifieke persoon'],
    isNep: false,
    uitleg: 'Dit is een echt bericht van een betrouwbare nieuwsbron met verifieerbare feiten.',
  },
  {
    id: 'n2',
    titel: 'SCHOKKEND: Robot vervangt leraar op basisschool!!',
    bron: 'nieuwsflits247.biz',
    tekst: 'Een school in Amsterdam heeft alle leraren ontslagen en vervangen door AI-robots. De kinderen zijn DOLBLIJ en leren 500% sneller!!!',
    hints: ['Onbekende bron (.biz)', 'Overdreven taal en hoofdletters', 'Onrealistische cijfers'],
    isNep: true,
    uitleg: 'Onbetrouwbare bron, overdreven taal, onrealistische claims. Typische kenmerken van nepnieuws.',
  },
  {
    id: 'n3',
    titel: 'Onderzoek: jongeren besteden gemiddeld 3 uur per dag aan social media',
    bron: 'Universiteit Utrecht',
    tekst: 'Uit onderzoek van de Universiteit Utrecht onder 2.000 jongeren blijkt dat zij gemiddeld 3 uur per dag besteden aan social media. TikTok is het populairst.',
    hints: ['Wetenschappelijke bron', 'Specifieke aantallen en methode'],
    isNep: false,
    uitleg: 'Een betrouwbaar bericht met een wetenschappelijke bron en specifieke onderzoeksgegevens.',
  },
  {
    id: 'n4',
    titel: 'AI kan nu je gedachten lezen via je telefoon',
    bron: 'TechGerucht.net',
    tekst: 'Wetenschappers hebben ontdekt dat AI je gedachten kan lezen via de camera van je telefoon. Je hoeft niks te typen, de AI weet al wat je denkt!',
    hints: ['Onbekende website', 'Technisch onmogelijke claims', 'Geen bronvermelding'],
    isNep: true,
    uitleg: 'Dit is technisch onmogelijk. De bron is onbekend en er worden geen wetenschappelijke referenties gegeven.',
  },
  {
    id: 'n5',
    titel: 'Gemeente opent nieuw skatepark voor jongeren',
    bron: 'Lokale Omroep West',
    tekst: 'De gemeente Den Haag opent zaterdag een nieuw skatepark in het Zuiderpark. Wethouder De Vries knipt het lint door om 14:00 uur. Jongeren uit de buurt mochten meedenken over het ontwerp.',
    hints: ['Lokale nieuwsbron', 'Specifieke details (tijd, locatie, naam)'],
    isNep: false,
    uitleg: 'Betrouwbaar lokaal nieuws met specifieke, verifieerbare details.',
  },
];

interface Props {
  onComplete: (score: KamerScore) => void;
}

export const KamerNepnieuwsfabriek: React.FC<Props> = ({ onComplete }) => {
  const [huidigIndex, setHuidigIndex] = useState(0);
  const [antwoorden, setAntwoorden] = useState<Record<string, boolean>>({});
  const [toonUitleg, setToonUitleg] = useState(false);
  const [startTijd] = useState(Date.now());

  const huidigBericht = BERICHTEN[huidigIndex];
  const isLaatste = huidigIndex === BERICHTEN.length - 1;
  const heeftGeantwoord = antwoorden[huidigBericht?.id] !== undefined;

  const geefAntwoord = (isNepGezegd: boolean) => {
    if (heeftGeantwoord) return;
    setAntwoorden(prev => ({ ...prev, [huidigBericht.id]: isNepGezegd }));
    setToonUitleg(true);
  };

  const volgendBericht = () => {
    setToonUitleg(false);

    if (isLaatste) {
      // Bereken score
      let correct = 0;
      BERICHTEN.forEach(b => {
        if (antwoorden[b.id] === b.isNep) correct++;
      });

      const score = Math.round((correct / BERICHTEN.length) * 100);
      const tijdSeconds = Math.round((Date.now() - startTijd) / 1000);

      onComplete({
        score,
        timeSeconds: tijdSeconds,
        details: { antwoorden, correcteAntwoorden: BERICHTEN.reduce((acc, b) => ({ ...acc, [b.id]: b.isNep }), {}) },
      });
    } else {
      setHuidigIndex(prev => prev + 1);
    }
  };

  const isCorrect = heeftGeantwoord && antwoorden[huidigBericht.id] === huidigBericht.isNep;

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
          <Newspaper className="text-emerald-400" size={24} />
          <h2 className="text-xl md:text-2xl font-black text-emerald-400">Nepnieuwsfabriek</h2>
        </div>
        <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
          Je onderschept 5 nieuwsberichten. Welke zijn echt en welke zijn nep?
        </p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {BERICHTEN.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < huidigIndex ? 'bg-emerald-400' : i === huidigIndex ? 'bg-emerald-400 ring-2 ring-emerald-400/30' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Nieuwsbericht */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={huidigBericht.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg"
          >
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              {/* Bron */}
              <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">{huidigBericht.bron}</span>
                <span className="text-xs text-gray-600">Bericht {huidigIndex + 1}/{BERICHTEN.length}</span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-3">{huidigBericht.titel}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{huidigBericht.tekst}</p>
              </div>

              {/* Hints */}
              <div className="px-5 pb-4">
                <div className="flex flex-wrap gap-2">
                  {huidigBericht.hints.map((hint, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-400">
                      {hint}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Uitleg */}
            {toonUitleg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 p-4 rounded-xl border ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? <CheckCircle size={18} className="mt-0.5 shrink-0" /> : <XCircle size={18} className="mt-0.5 shrink-0" />}
                  <div>
                    <p className="font-bold text-sm">{isCorrect ? 'Goed gezien!' : 'Helaas, niet correct.'}</p>
                    <p className="text-sm mt-1 opacity-80">{huidigBericht.uitleg}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Knoppen */}
            <div className="mt-4 flex gap-3">
              {!heeftGeantwoord ? (
                <>
                  <button
                    onClick={() => geefAntwoord(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors active:scale-[0.98]"
                  >
                    Echt
                  </button>
                  <button
                    onClick={() => geefAntwoord(true)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors active:scale-[0.98]"
                  >
                    Nep
                  </button>
                </>
              ) : (
                <button
                  onClick={volgendBericht}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isLaatste ? 'Afronden' : 'Volgend bericht'}
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
