
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, ChevronRight } from 'lucide-react';
import { KamerScore } from './types';

interface GegevensItem {
  id: string;
  label: string;
  isGevoelig: boolean;
}

const GEGEVENS: GegevensItem[] = [
  { id: 'g1', label: 'Volledige naam', isGevoelig: true },
  { id: 'g2', label: 'BSN (burgerservicenummer)', isGevoelig: true },
  { id: 'g3', label: 'Favoriete kleur', isGevoelig: false },
  { id: 'g4', label: 'Wachtwoord', isGevoelig: true },
  { id: 'g5', label: 'E-mailadres', isGevoelig: true },
  { id: 'g6', label: 'Hobby: voetbal', isGevoelig: false },
  { id: 'g7', label: 'Huisadres', isGevoelig: true },
  { id: 'g8', label: 'Favoriete film', isGevoelig: false },
];

interface ActieOptie {
  id: string;
  tekst: string;
  score: number; // 0-100
  feedback: string;
}

const ACTIE_OPTIES: ActieOptie[] = [
  { id: 'a1', tekst: 'Wachtwoord meteen wijzigen en melding doen', score: 100, feedback: 'Uitstekend! Dit is precies de juiste eerste actie bij een datalek.' },
  { id: 'a2', tekst: 'Melden bij de schoolbeheerder', score: 75, feedback: 'Goed idee om te melden! Maar je wachtwoord wijzigen is ook belangrijk.' },
  { id: 'a3', tekst: 'Niks doen, het komt wel goed', score: 0, feedback: 'Bij een datalek moet je altijd actie ondernemen om je gegevens te beschermen.' },
  { id: 'a4', tekst: 'Op social media posten dat er een datalek is', score: 10, feedback: 'Dit kan de situatie juist erger maken en paniek veroorzaken.' },
];

interface Props {
  onComplete: (score: KamerScore) => void;
}

export const KamerDatalek: React.FC<Props> = ({ onComplete }) => {
  const [fase, setFase] = useState<'selectie' | 'actie' | 'klaar'>('selectie');
  const [geselecteerd, setGeselecteerd] = useState<Set<string>>(new Set());
  const [gekozenActie, setGekozenActie] = useState<string | null>(null);
  const [startTijd] = useState(Date.now());

  const toggleSelectie = (id: string) => {
    setGeselecteerd(prev => {
      const nieuw = new Set(prev);
      if (nieuw.has(id)) {
        nieuw.delete(id);
      } else {
        nieuw.add(id);
      }
      return nieuw;
    });
  };

  const gaVerder = () => {
    setFase('actie');
  };

  const kiesActie = (actieId: string) => {
    if (gekozenActie) return;
    setGekozenActie(actieId);
    setFase('klaar');

    // Bereken score
    const correcteSelecties = GEGEVENS.filter(g => g.isGevoelig).map(g => g.id);
    const juistGeselecteerd = correcteSelecties.filter(id => geselecteerd.has(id)).length;
    const fouteSelecties = [...geselecteerd].filter(id => !correcteSelecties.includes(id)).length;
    const selectieScore = Math.max(0, Math.round(((juistGeselecteerd - fouteSelecties) / correcteSelecties.length) * 100));

    const actie = ACTIE_OPTIES.find(a => a.id === actieId);
    const actieScore = actie?.score ?? 0;

    // Gewogen gemiddelde: 60% selectie, 40% actie
    const totaalScore = Math.round(selectieScore * 0.6 + actieScore * 0.4);
    const tijdSeconds = Math.round((Date.now() - startTijd) / 1000);

    setTimeout(() => {
      onComplete({
        score: totaalScore,
        timeSeconds: tijdSeconds,
        details: {
          geselecteerdeGegevens: [...geselecteerd],
          correcteGegevens: correcteSelecties,
          selectieScore,
          gekozenActie: actieId,
          actieScore,
        },
      });
    }, 3000);
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
          <ShieldAlert className="text-rose-600" size={24} />
          <h2 className="text-xl md:text-2xl font-black text-rose-600">Datalek!</h2>
        </div>
        <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto">
          {fase === 'selectie'
            ? 'Er is een datalek ontdekt! Welke gegevens zijn gevoelig en moeten als eerste beveiligd worden?'
            : fase === 'actie'
              ? 'Goed, je hebt de gevoelige gegevens geidentificeerd. Wat is je eerste actie?'
              : 'Resultaat bekijken...'}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {/* Fase 1: Gegevens selecteren */}
          {fase === 'selectie' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Selecteer de gevoelige gegevens
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GEGEVENS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleSelectie(item.id)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-all border ${
                        geselecteerd.has(item.id)
                          ? 'bg-rose-50 border-rose-300 text-rose-700'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          geselecteerd.has(item.id) ? 'border-rose-500 bg-rose-500' : 'border-slate-300'
                        }`}>
                          {geselecteerd.has(item.id) && <CheckCircle size={10} className="text-white" />}
                        </span>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={gaVerder}
                disabled={geselecteerd.size === 0}
                className="w-full py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
              >
                Bevestig selectie <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* Fase 2: Actie kiezen */}
          {fase === 'actie' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Wat is je eerste actie?
                </h3>
                <div className="space-y-2">
                  {ACTIE_OPTIES.map(optie => (
                    <button
                      key={optie.id}
                      onClick={() => kiesActie(optie.id)}
                      className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-rose-300 hover:bg-rose-50 transition-colors active:scale-[0.98]"
                    >
                      {optie.tekst}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Fase 3: Klaar */}
          {fase === 'klaar' && gekozenActie && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {(() => {
                const actie = ACTIE_OPTIES.find(a => a.id === gekozenActie);
                return (
                  <div className={`p-5 rounded-xl border ${
                    (actie?.score ?? 0) >= 75
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className={`mt-0.5 shrink-0 ${
                        (actie?.score ?? 0) >= 75 ? 'text-emerald-600' : 'text-amber-600'
                      }`} />
                      <div>
                        <p className={`font-bold text-sm ${
                          (actie?.score ?? 0) >= 75 ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {actie?.tekst}
                        </p>
                        <p className="text-slate-500 text-sm mt-2">{actie?.feedback}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
