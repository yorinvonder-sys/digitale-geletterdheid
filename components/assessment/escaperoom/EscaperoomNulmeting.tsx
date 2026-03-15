
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, Clock, ChevronRight, Trophy, BarChart3, Star } from 'lucide-react';
import { NulmetingResult, KamerScore, EscaperoomStap, KAMER_VOLGORDE, KAMER_NAMEN } from './types';
import { KamerVergrendeldeLaptop } from './KamerVergrendeldeLaptop';
import { KamerNepnieuwsfabriek } from './KamerNepnieuwsfabriek';
import { KamerCodekluis } from './KamerCodekluis';
import { KamerDatalek } from './KamerDatalek';
import { KamerDilemma } from './KamerDilemma';

interface Props {
  onComplete: (results: NulmetingResult) => void;
  onBack: () => void;
}

// Volledig uitgeschreven Tailwind classes (dynamische classes werken niet met JIT)
const KAMER_STIJLEN: Record<string, { dot: string; dotActive: string; shadow: string }> = {
  kamer1: {
    dot: 'bg-cyan-400',
    dotActive: 'bg-cyan-400 ring-4 ring-cyan-400/20 shadow-lg shadow-cyan-400/30',
    shadow: 'shadow-cyan-400/30',
  },
  kamer2: {
    dot: 'bg-emerald-400',
    dotActive: 'bg-emerald-400 ring-4 ring-emerald-400/20 shadow-lg shadow-emerald-400/30',
    shadow: 'shadow-emerald-400/30',
  },
  kamer3: {
    dot: 'bg-purple-400',
    dotActive: 'bg-purple-400 ring-4 ring-purple-400/20 shadow-lg shadow-purple-400/30',
    shadow: 'shadow-purple-400/30',
  },
  kamer4: {
    dot: 'bg-red-400',
    dotActive: 'bg-red-400 ring-4 ring-red-400/20 shadow-lg shadow-red-400/30',
    shadow: 'shadow-red-400/30',
  },
  kamer5: {
    dot: 'bg-pink-400',
    dotActive: 'bg-pink-400 ring-4 ring-pink-400/20 shadow-lg shadow-pink-400/30',
    shadow: 'shadow-pink-400/30',
  },
};

export const EscaperoomNulmeting: React.FC<Props> = ({ onComplete, onBack }) => {
  const [stap, setStap] = useState<EscaperoomStap>('intro');
  const [scores, setScores] = useState<Partial<Record<string, KamerScore>>>({});
  const [startTijd, setStartTijd] = useState<number | null>(null);
  const [verstrekenTijd, setVerstrekenTijd] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (startTijd && stap !== 'resultaat') {
      timerRef.current = setInterval(() => {
        setVerstrekenTijd(Math.round((Date.now() - startTijd) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTijd, stap]);

  const formateerTijd = (seconden: number): string => {
    const min = Math.floor(seconden / 60);
    const sec = seconden % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const huidigeKamerIndex = KAMER_VOLGORDE.indexOf(stap);
  const aantalKamers = 5; // kamer1 t/m kamer5

  const startEscaperoom = () => {
    setStartTijd(Date.now());
    setStap('kamer1');
  };

  const handleKamerComplete = (kamerKey: string, score: KamerScore) => {
    setScores(prev => ({ ...prev, [kamerKey]: score }));

    // Ga naar volgende kamer
    const huidigeIndex = KAMER_VOLGORDE.indexOf(stap);
    const volgende = KAMER_VOLGORDE[huidigeIndex + 1];
    if (volgende) {
      setTimeout(() => setStap(volgende), 500);
    }
  };

  // Wanneer we bij 'resultaat' komen, bereken het resultaat
  useEffect(() => {
    if (stap === 'resultaat' && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [stap]);

  const berekenResultaat = (): NulmetingResult | null => {
    const k1 = scores['kamer1'];
    const k2 = scores['kamer2'];
    const k3 = scores['kamer3'];
    const k4 = scores['kamer4'];
    const k5 = scores['kamer5'];

    if (!k1 || !k2 || !k3 || !k4 || !k5) return null;

    const overall = Math.round((k1.score + k2.score + k3.score + k4.score + k5.score) / 5);
    const niveau: NulmetingResult['niveau'] =
      overall >= 75 ? 'gevorderd' : overall >= 40 ? 'basis' : 'starter';

    return {
      completedAt: new Date().toISOString(),
      totalTimeSeconds: verstrekenTijd,
      kamers: {
        digitaleSystemen: k1,
        mediaEnAI: k2,
        programmeren: k3,
        veiligheidPrivacy: k4,
        welzijnMaatschappij: k5,
      },
      overallScore: overall,
      niveau,
    };
  };

  // Render progress dots
  const renderProgress = () => {
    if (stap === 'intro' || stap === 'resultaat') return null;

    return (
      <div className="flex items-center justify-center gap-3 py-3">
        {Array.from({ length: aantalKamers }, (_, i) => {
          const kamerStap = `kamer${i + 1}` as EscaperoomStap;
          const kamerIndex = KAMER_VOLGORDE.indexOf(kamerStap);
          const isActief = stap === kamerStap;
          const isKlaar = huidigeKamerIndex > kamerIndex;
          const stijl = KAMER_STIJLEN[kamerStap];

          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full transition-all ${
                isActief
                  ? stijl?.dotActive || 'bg-gray-400'
                  : isKlaar
                    ? 'bg-emerald-400'
                    : 'bg-gray-700'
              }`} />
              {i < aantalKamers - 1 && (
                <div className={`w-6 h-0.5 ${isKlaar ? 'bg-emerald-400/50' : 'bg-gray-700'}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // === INTRO ===
  if (stap === 'intro') {
    return (
      <div className="w-full h-full bg-gray-900 text-white overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            {/* Terug knop */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors mb-6 text-sm"
            >
              <ArrowLeft size={16} /> Terug
            </button>

            <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-2xl">
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 transform rotate-3">
                <Lock size={40} className="text-white" />
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-center mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Digitale Escaperoom
              </h1>
              <p className="text-gray-400 text-center text-sm mb-6">
                Nulmeting Digitale Geletterdheid
              </p>

              <div className="bg-gray-900/50 rounded-xl p-4 mb-6 space-y-3">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Welkom, agent! Je staat voor een reeks digitale kamers.
                  In elke kamer los je een puzzel op. Zo ontdekken we wat je
                  al weet over de digitale wereld.
                </p>
                <p className="text-gray-500 text-xs">
                  Dit is geen toets — er zijn geen foute antwoorden. We willen alleen
                  weten waar je staat, zodat we je het beste kunnen helpen.
                </p>
              </div>

              {/* Kamer overzicht */}
              <div className="space-y-2 mb-6">
                {[
                  { naam: 'Vergrendelde Laptop', bg: 'bg-cyan-500/20', tekst: 'text-cyan-400', icon: '1' },
                  { naam: 'Nepnieuwsfabriek', bg: 'bg-emerald-500/20', tekst: 'text-emerald-400', icon: '2' },
                  { naam: 'Codekluis', bg: 'bg-purple-500/20', tekst: 'text-purple-400', icon: '3' },
                  { naam: 'Datalek', bg: 'bg-red-500/20', tekst: 'text-red-400', icon: '4' },
                  { naam: 'Het Dilemma', bg: 'bg-pink-500/20', tekst: 'text-pink-400', icon: '5' },
                ].map((kamer, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className={`w-7 h-7 rounded-lg ${kamer.bg} ${kamer.tekst} flex items-center justify-center font-bold text-xs`}>
                      {kamer.icon}
                    </span>
                    <span className="text-gray-400 font-medium">{kamer.naam}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mb-6">
                <span className="flex items-center gap-1"><Clock size={12} /> ~15 minuten</span>
                <span>5 kamers</span>
              </div>

              <button
                onClick={startEscaperoom}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-black text-lg shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all active:scale-[0.98]"
              >
                START DE ESCAPEROOM
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // === RESULTAAT ===
  if (stap === 'resultaat') {
    const resultaat = berekenResultaat();
    if (!resultaat) return null;

    const niveauStijl = resultaat.niveau === 'gevorderd'
      ? { border: 'border-emerald-500', bg: 'bg-emerald-500/20', tekst: 'text-emerald-400', icon: 'text-emerald-400' }
      : resultaat.niveau === 'basis'
        ? { border: 'border-amber-500', bg: 'bg-amber-500/20', tekst: 'text-amber-400', icon: 'text-amber-400' }
        : { border: 'border-cyan-500', bg: 'bg-cyan-500/20', tekst: 'text-cyan-400', icon: 'text-cyan-400' };
    const niveauLabel = resultaat.niveau === 'gevorderd' ? 'Gevorderd' : resultaat.niveau === 'basis' ? 'Basis' : 'Starter';

    const kamerResultaten = [
      { naam: 'Digitale Systemen', score: resultaat.kamers.digitaleSystemen.score },
      { naam: 'Media & AI', score: resultaat.kamers.mediaEnAI.score },
      { naam: 'Programmeren', score: resultaat.kamers.programmeren.score },
      { naam: 'Veiligheid & Privacy', score: resultaat.kamers.veiligheidPrivacy.score },
      { naam: 'Welzijn & Maatschappij', score: resultaat.kamers.welzijnMaatschappij.score },
    ];

    return (
      <div className="w-full h-full bg-gray-900 text-white overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-2xl"
          >
            {/* Badge */}
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center border-4 ${niveauStijl.border} ${niveauStijl.bg}`}>
              <Trophy size={48} className={niveauStijl.icon} />
            </div>

            <h1 className="text-2xl font-black text-center mb-1">Escaperoom Voltooid!</h1>
            <p className={`text-center font-bold ${niveauStijl.tekst} mb-6`}>
              Niveau: {niveauLabel} — Score: {resultaat.overallScore}%
            </p>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-6">
              <span className="flex items-center gap-1"><Clock size={12} /> {formateerTijd(resultaat.totalTimeSeconds)}</span>
              <span className="flex items-center gap-1"><Star size={12} /> 5/5 kamers</span>
            </div>

            {/* Scores per kamer */}
            <div className="space-y-3 mb-6">
              {kamerResultaten.map((kamer, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">{kamer.naam}</span>
                    <span className={`text-sm font-bold ${
                      kamer.score >= 75 ? 'text-emerald-400' : kamer.score >= 40 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {kamer.score}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${kamer.score}%` }}
                      transition={{ duration: 0.8, delay: i * 0.15 }}
                      className={`h-full rounded-full ${
                        kamer.score >= 75
                          ? 'bg-emerald-500'
                          : kamer.score >= 40
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Uitleg */}
            <div className="bg-gray-900/50 rounded-xl p-4 mb-6 text-sm text-gray-400 leading-relaxed">
              {resultaat.niveau === 'gevorderd' && (
                <p>Je hebt al een sterke basis in digitale geletterdheid. De missies zullen je helpen om nog verder te groeien!</p>
              )}
              {resultaat.niveau === 'basis' && (
                <p>Je bent goed op weg! Bij sommige onderwerpen kun je nog groeien. De missies zijn precies wat je nodig hebt.</p>
              )}
              {resultaat.niveau === 'starter' && (
                <p>Geen zorgen! Iedereen begint ergens. De missies helpen je stap voor stap om digitaal vaardiger te worden.</p>
              )}
            </div>

            <button
              onClick={() => onComplete(resultaat)}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-black text-lg shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
            >
              Ga naar je Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // === KAMER VIEWS ===
  const renderKamer = () => {
    switch (stap) {
      case 'kamer1':
        return <KamerVergrendeldeLaptop onComplete={(s) => handleKamerComplete('kamer1', s)} />;
      case 'kamer2':
        return <KamerNepnieuwsfabriek onComplete={(s) => handleKamerComplete('kamer2', s)} />;
      case 'kamer3':
        return <KamerCodekluis onComplete={(s) => handleKamerComplete('kamer3', s)} />;
      case 'kamer4':
        return <KamerDatalek onComplete={(s) => handleKamerComplete('kamer4', s)} />;
      case 'kamer5':
        return <KamerDilemma onComplete={(s) => handleKamerComplete('kamer5', s)} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 bg-gray-800/80 backdrop-blur border-b border-gray-700/50 px-4 py-2">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors text-sm p-2 -ml-2"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Kamer naam */}
          <div className="text-center">
            <span className="text-xs text-gray-500">Kamer {huidigeKamerIndex}/{aantalKamers}</span>
            <h3 className="text-sm font-bold text-gray-300">{KAMER_NAMEN[stap] || ''}</h3>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock size={14} />
            <span className="font-mono">{formateerTijd(verstrekenTijd)}</span>
          </div>
        </div>

        {/* Progress dots */}
        {renderProgress()}
      </div>

      {/* Kamer content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={stap}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderKamer()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
