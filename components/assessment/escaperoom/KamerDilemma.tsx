
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { KamerScore } from './types';

interface DilemmaOptie {
  id: string;
  tekst: string;
  score: number;
  feedback: string;
}

const OPTIES: DilemmaOptie[] = [
  {
    id: 'd1',
    tekst: 'De screenshot delen, want iedereen moet het weten',
    score: 0,
    feedback: 'Door het te delen maak je het juist erger. Je verspreidt het pestgedrag verder.',
  },
  {
    id: 'd2',
    tekst: 'Negeren en doen alsof je niks hebt gezien',
    score: 25,
    feedback: 'Negeren helpt niet. Je vriend heeft juist iemand nodig die er voor hem/haar is.',
  },
  {
    id: 'd3',
    tekst: 'Melden bij een leraar of vertrouwenspersoon',
    score: 75,
    feedback: 'Goed! Een volwassene kan helpen de situatie op te lossen. Dit is een sterke keuze.',
  },
  {
    id: 'd4',
    tekst: 'Eerst met je vriend praten en samen bespreken wat te doen',
    score: 100,
    feedback: 'Uitstekend! Je toont empathie door eerst met je vriend te praten. Samen kunnen jullie beslissen om het te melden.',
  },
];

interface Props {
  onComplete: (score: KamerScore) => void;
}

export const KamerDilemma: React.FC<Props> = ({ onComplete }) => {
  const [fase, setFase] = useState<'keuze' | 'reflectie' | 'klaar'>('keuze');
  const [gekozenOptie, setGekozenOptie] = useState<string | null>(null);
  const [reflectie, setReflectie] = useState('');
  const [startTijd] = useState(Date.now());

  const kiesOptie = (optieId: string) => {
    if (gekozenOptie) return;
    setGekozenOptie(optieId);
    setFase('reflectie');
  };

  const verzendReflectie = () => {
    const optie = OPTIES.find(o => o.id === gekozenOptie);
    const score = optie?.score ?? 0;
    const tijdSeconds = Math.round((Date.now() - startTijd) / 1000);

    setFase('klaar');

    setTimeout(() => {
      onComplete({
        score,
        timeSeconds: tijdSeconds,
        details: {
          gekozenOptie: gekozenOptie,
          reflectieTekst: reflectie,
          optieScore: score,
        },
      });
    }, 2500);
  };

  const optie = gekozenOptie ? OPTIES.find(o => o.id === gekozenOptie) : null;

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
          <Heart className="text-pink-400" size={24} />
          <h2 className="text-xl md:text-2xl font-black text-pink-400">Het Dilemma</h2>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {/* Scenario */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                <MessageCircle size={18} className="text-pink-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-pink-400 mb-1">Situatie</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Je vriend wordt online gepest. Iemand stuurt je een screenshot van gemene
                  berichten over je vriend en vraagt: "Stuur dit even door, iedereen moet dit zien!"
                </p>
                <p className="text-gray-400 text-sm mt-2 italic">
                  Wat doe je?
                </p>
              </div>
            </div>
          </div>

          {/* Fase 1: Keuze */}
          {fase === 'keuze' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {OPTIES.map(optie => (
                <button
                  key={optie.id}
                  onClick={() => kiesOptie(optie.id)}
                  className="w-full text-left px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-pink-500/50 hover:bg-pink-500/10 transition-colors active:scale-[0.98]"
                >
                  {optie.tekst}
                </button>
              ))}
            </motion.div>
          )}

          {/* Fase 2: Reflectie */}
          {fase === 'reflectie' && optie && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`p-4 rounded-xl border mb-4 ${
                optie.score >= 75
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : optie.score >= 25
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <p className="text-sm font-bold mb-1">Jouw keuze: {optie.tekst}</p>
                <p className="text-sm opacity-80">{optie.feedback}</p>
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Leg kort uit waarom je deze keuze maakte (2-3 zinnen)
                </label>
                <textarea
                  value={reflectie}
                  onChange={e => setReflectie(e.target.value)}
                  placeholder="Ik koos dit omdat..."
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                />
              </div>

              <button
                onClick={verzendReflectie}
                className="mt-4 w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-400 hover:to-pink-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send size={18} /> Verzend antwoord
              </button>
              <p className="text-center text-gray-600 text-xs mt-2">
                Je reflectie wordt bewaard zodat je docent het kan lezen.
              </p>
            </motion.div>
          )}

          {/* Fase 3: Klaar */}
          {fase === 'klaar' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-pink-400" />
              </div>
              <p className="text-pink-400 font-bold text-lg mb-2">Antwoord opgeslagen!</p>
              <p className="text-gray-500 text-sm">Je gaat door naar de resultaten...</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
