import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Trophy, Star, Target, ArrowRight } from 'lucide-react';
import type { NulmetingResult } from './types';
import {
  extractDomeinScores,
  berekenGroei,
  getDomeinLabel,
  getDomeinKleur,
  type DomeinKey,
} from '@/utils/growthCalculation';

interface GroeiPaspoortProps {
  nulmetingResult: NulmetingResult;
  eindmetingResult: NulmetingResult;
  onContinue: () => void;
}

const DOMEINEN: DomeinKey[] = [
  'digitaleSystemen',
  'mediaEnAI',
  'programmeren',
  'veiligheidPrivacy',
  'welzijnMaatschappij',
];

function getNiveauKleur(niveau: 'starter' | 'basis' | 'gevorderd'): string {
  switch (niveau) {
    case 'gevorderd': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    case 'basis':     return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    case 'starter':   return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }
}

function getNiveauLabel(niveau: 'starter' | 'basis' | 'gevorderd'): string {
  switch (niveau) {
    case 'gevorderd': return 'Gevorderd';
    case 'basis':     return 'Basis';
    case 'starter':   return 'Starter';
  }
}

// Map getDomeinKleur color name to Tailwind classes
function getDomeinBarKleur(key: DomeinKey): { bar: string; text: string; badge: string } {
  const kleur = getDomeinKleur(key);
  const map: Record<string, { bar: string; text: string; badge: string }> = {
    indigo:  { bar: 'bg-indigo-500',  text: 'text-indigo-300',  badge: 'bg-indigo-500/20 text-indigo-300' },
    emerald: { bar: 'bg-emerald-500', text: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300' },
    violet:  { bar: 'bg-violet-500',  text: 'text-violet-300',  badge: 'bg-violet-500/20 text-violet-300' },
    rose:    { bar: 'bg-rose-500',    text: 'text-rose-300',    badge: 'bg-rose-500/20 text-rose-300' },
    sky:     { bar: 'bg-sky-500',     text: 'text-sky-300',     badge: 'bg-sky-500/20 text-sky-300' },
  };
  return map[kleur] ?? { bar: 'bg-gray-500', text: 'text-gray-300', badge: 'bg-gray-500/20 text-gray-300' };
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export const GroeiPaspoort: React.FC<GroeiPaspoortProps> = ({
  nulmetingResult,
  eindmetingResult,
  onContinue,
}) => {
  const nulScores = extractDomeinScores(nulmetingResult);
  const eindScores = extractDomeinScores(eindmetingResult);
  const analyse = berekenGroei(nulScores, eindScores);

  const groeiRonded = Math.round(analyse.overallGroei);
  const groeiPositief = groeiRonded > 0;
  const groeiNeutraal = groeiRonded === 0;

  return (
    <div className="min-h-screen bg-gray-950 flex items-start justify-center p-4 py-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg space-y-6"
      >
        {/* 1. Header */}
        <motion.div variants={itemVariants} className="text-center space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tight">Je Groei-Paspoort</h1>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
              groeiPositief
                ? 'bg-emerald-500/15 text-emerald-300'
                : groeiNeutraal
                ? 'bg-gray-700/60 text-gray-400'
                : 'bg-rose-500/15 text-rose-300'
            }`}
          >
            {groeiPositief ? (
              <TrendingUp size={16} />
            ) : groeiNeutraal ? (
              <Minus size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {groeiPositief
              ? `Je bent gemiddeld ${groeiRonded} punten gegroeid!`
              : groeiNeutraal
              ? 'Je score is gelijk gebleven.'
              : `Je score daalde gemiddeld ${Math.abs(groeiRonded)} punten.`}
          </div>
        </motion.div>

        {/* 2. Niveau-transitie */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 flex items-center justify-center gap-4"
        >
          <span
            className={`px-4 py-1.5 rounded-full border text-sm font-bold ${getNiveauKleur(analyse.niveauStart)}`}
          >
            Start: {getNiveauLabel(analyse.niveauStart)}
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex items-center text-gray-500"
          >
            <ArrowRight size={20} />
          </motion.div>
          <span
            className={`px-4 py-1.5 rounded-full border text-sm font-bold ${getNiveauKleur(analyse.niveauEind)}`}
          >
            Eind: {getNiveauLabel(analyse.niveauEind)}
          </span>
        </motion.div>

        {/* 3. Domain Growth Bars */}
        <motion.div variants={itemVariants} className="space-y-3">
          {DOMEINEN.map((domein, index) => {
            const data = analyse.perDomein[domein];
            const kleuren = getDomeinBarKleur(domein);
            const groei = Math.round(data.groei);
            const groeiPositiefDomein = groei > 0;
            const groeiNeutraalDomein = groei === 0;

            return (
              <motion.div
                key={domein}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4, ease: 'easeOut' }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{getDomeinLabel(domein)}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      groeiPositiefDomein
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : groeiNeutraalDomein
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {groeiPositiefDomein ? `+${groei}` : groei}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-10 text-right shrink-0">{Math.round(data.nulmeting)}</span>
                  <div className="relative flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    {/* Nulmeting bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.nulmeting}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 bg-gray-600 rounded-full"
                    />
                    {/* Eindmeting bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.eindmeting}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.7, ease: 'easeOut' }}
                      className={`absolute inset-y-0 left-0 ${kleuren.bar} rounded-full opacity-80`}
                    />
                  </div>
                  <span className={`text-xs font-bold w-10 shrink-0 ${kleuren.text}`}>
                    {Math.round(data.eindmeting)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 4. Highlights */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Trophy size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">Meest gegroeid</span>
            </div>
            <p className="text-sm font-bold text-white leading-tight">
              {getDomeinLabel(analyse.sterksteDomein)}
            </p>
            <p className="text-xs text-emerald-400 font-bold">
              +{Math.round(analyse.perDomein[analyse.sterksteDomein].groei)} punten
            </p>
          </div>

          <div className="bg-gray-800/50 border border-amber-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Target size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">Focuspunt</span>
            </div>
            <p className="text-sm font-bold text-white leading-tight">
              {getDomeinLabel(analyse.focusDomein)}
            </p>
            <p className="text-xs text-amber-400 font-bold">
              {Math.round(analyse.perDomein[analyse.focusDomein].eindmeting)}/100
            </p>
          </div>
        </motion.div>

        {/* 5. AI Recommendation placeholder */}
        <motion.div
          variants={itemVariants}
          className="border border-dashed border-gray-600 rounded-2xl p-5 space-y-2"
        >
          <div className="flex items-center gap-2">
            <Star size={14} className="text-gray-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Persoonlijke aanbeveling
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Persoonlijke aanbeveling wordt gegenereerd...
          </p>
          <p className="text-xs text-gray-600">
            Je docent moet deze eerst goedkeuren voordat je hem kunt zien.
          </p>
          <p className="text-[10px] text-gray-700 mt-1">Gegenereerd door AI</p>
        </motion.div>

        {/* 6. Continue button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-black rounded-2xl text-sm transition-all shadow-lg shadow-indigo-900/40"
          >
            Ga verder
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
