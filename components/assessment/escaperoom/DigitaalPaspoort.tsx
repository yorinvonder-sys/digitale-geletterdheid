import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { NulmetingResult } from './types';

interface DigitaalPaspoortProps {
  result: NulmetingResult;
  onContinue: () => void;
}

const DOMEINEN = [
  { key: 'digitaleSystemen' as const, label: 'Digitale\nSystemen', short: '21A' },
  { key: 'mediaEnAI' as const, label: 'Media\n& AI', short: '21B/21D' },
  { key: 'programmeren' as const, label: 'Programmeren', short: '22A/22B' },
  { key: 'veiligheidPrivacy' as const, label: 'Veiligheid', short: '23A' },
  { key: 'welzijnMaatschappij' as const, label: 'Welzijn', short: '23B/23C' },
] as const;

const CENTER = 150;
const RADIUS = 120;
const VIEWBOX = 300;
const LEVELS = [0.25, 0.5, 0.75, 1];

function polarToCartesian(angle: number, radius: number): [number, number] {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)];
}

function getAngles(count: number): number[] {
  return Array.from({ length: count }, (_, i) => (360 / count) * i);
}

function polygonPoints(angles: number[], radius: number): string {
  return angles.map(a => polarToCartesian(a, radius).join(',')).join(' ');
}

function dataPolygonPoints(angles: number[], scores: number[]): string {
  return angles
    .map((a, i) => {
      const r = (scores[i] / 100) * RADIUS;
      return polarToCartesian(a, r).join(',');
    })
    .join(' ');
}

const RadarChart: React.FC<{ scores: number[]; labels: string[] }> = ({ scores, labels }) => {
  const angles = getAngles(5);

  return (
    <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className="w-full max-w-[320px] mx-auto">
      {/* Achtergrond pentagons */}
      {LEVELS.map(level => (
        <polygon
          key={level}
          points={polygonPoints(angles, RADIUS * level)}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={1}
        />
      ))}

      {/* Assen */}
      {angles.map((a, i) => {
        const [x, y] = polarToCartesian(a, RADIUS);
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={1}
          />
        );
      })}

      {/* Data polygon met animatie */}
      <motion.polygon
        initial={{ points: polygonPoints(angles, 0) }}
        animate={{ points: dataPolygonPoints(angles, scores) }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        fill="rgba(217,119,87,0.15)"
        stroke="#D97757"
        strokeWidth={2}
      />

      {/* Datapunten */}
      {angles.map((a, i) => {
        const r = (scores[i] / 100) * RADIUS;
        const [x, y] = polarToCartesian(a, r);
        return (
          <motion.circle
            key={i}
            initial={{ cx: CENTER, cy: CENTER, r: 0 }}
            animate={{ cx: x, cy: y, r: 4 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            fill="#D97757"
            stroke="#C46849"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Labels */}
      {angles.map((a, i) => {
        const [x, y] = polarToCartesian(a, RADIUS + 28);
        const lines = labels[i].split('\n');
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-slate-600 text-[10px] font-bold"
          >
            {lines.map((line, li) => (
              <tspan key={li} x={x} dy={li === 0 ? `-${(lines.length - 1) * 5}` : '12'}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
};

function getDomeinFeedback(score: number): { emoji: string; tekst: string } {
  if (score >= 80) return { emoji: '\uD83D\uDCAA', tekst: 'Sterk! Je weet hier al veel van.' };
  if (score >= 50) return { emoji: '\uD83D\uDC4D', tekst: 'Goede basis. Hier ga je nog meer leren.' };
  return { emoji: '\uD83D\uDE80', tekst: 'Hier ga je veel ontdekken dit jaar!' };
}

function getNiveauInfo(niveau: NulmetingResult['niveau']): { label: string; color: string; tekst: string } {
  switch (niveau) {
    case 'gevorderd':
      return {
        label: 'Gevorderd',
        color: 'from-emerald-500 to-emerald-600',
        tekst: 'Indrukwekkend! Je hebt al een sterke digitale basis. Klaar voor de uitdaging!',
      };
    case 'basis':
      return {
        label: 'Basis',
        color: 'from-indigo-500 to-indigo-600',
        tekst: 'Goed begin! Je weet al het een en ander. Dit jaar ga je nog veel bijleren.',
      };
    case 'starter':
    default:
      return {
        label: 'Starter',
        color: 'from-violet-500 to-violet-600',
        tekst: 'Welkom! Er ligt een wereld voor je open. Stap voor stap word je een digitale pro.',
      };
  }
}

export const DigitaalPaspoort: React.FC<DigitaalPaspoortProps> = ({ result, onContinue }) => {
  const scores = useMemo(
    () => DOMEINEN.map(d => result.kamers[d.key].score),
    [result]
  );
  const labels = DOMEINEN.map(d => d.label);
  const niveauInfo = getNiveauInfo(result.niveau);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black text-slate-900 tracking-tight"
          >
            Jouw Digitaal Paspoort
          </motion.h1>
          <p className="text-sm text-slate-400">Resultaat van de nulmeting escaperoom</p>
        </div>

        {/* Radardiagram */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
        >
          <RadarChart scores={scores} labels={labels} />
        </motion.div>

        {/* Domein feedback */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-2"
        >
          {DOMEINEN.map((domein, i) => {
            const feedback = getDomeinFeedback(scores[i]);
            return (
              <div
                key={domein.key}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm"
              >
                <span className="text-lg">{feedback.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-700">
                    {domein.label.replace('\n', ' ')}
                    <span className="text-slate-400 ml-1">({domein.short})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{feedback.tekst}</div>
                </div>
                <div className={`text-sm font-black ${scores[i] >= 80 ? 'text-emerald-600' : scores[i] >= 50 ? 'text-indigo-600' : 'text-violet-600'}`}>
                  {scores[i]}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Niveau badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jouw niveau</span>
          </div>
          <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${niveauInfo.color} text-white font-black text-lg tracking-wide shadow-lg`}>
            {niveauInfo.label}
          </div>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">{niveauInfo.tekst}</p>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-sm transition-all shadow-lg shadow-indigo-200 hover:brightness-110 active:scale-[0.98]"
        >
          Start je eerste missie
          <ChevronRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
};
