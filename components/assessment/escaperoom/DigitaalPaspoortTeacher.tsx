import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';
import { NulmetingResult } from './types';

interface KlasResultaat {
  studentName: string;
  studentId: string;
  result: NulmetingResult;
}

interface DigitaalPaspoortTeacherProps {
  klasResults: KlasResultaat[];
}

const DOMEINEN = [
  { key: 'digitaleSystemen' as const, label: 'Digitale Systemen', short: '21A' },
  { key: 'mediaEnAI' as const, label: 'Media & AI', short: '21B/21D' },
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

const RadarChartLight: React.FC<{ scores: number[]; labels: string[] }> = ({ scores, labels }) => {
  const angles = getAngles(5);

  return (
    <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className="w-full max-w-[300px] mx-auto">
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

      {/* Data polygon */}
      <motion.polygon
        initial={{ points: polygonPoints(angles, 0) }}
        animate={{ points: dataPolygonPoints(angles, scores) }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        fill="rgba(99,102,241,0.15)"
        stroke="#6366f1"
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
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            fill="#6366f1"
            stroke="#4f46e5"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Labels */}
      {angles.map((a, i) => {
        const [x, y] = polarToCartesian(a, RADIUS + 24);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-slate-500 text-[9px] font-bold"
          >
            {labels[i]}
          </text>
        );
      })}
    </svg>
  );
};

function scoreBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function niveauBadge(niveau: NulmetingResult['niveau']): { label: string; className: string } {
  switch (niveau) {
    case 'gevorderd':
      return { label: 'Gevorderd', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    case 'basis':
      return { label: 'Basis', className: 'bg-blue-100 text-blue-700 border-blue-200' };
    case 'starter':
    default:
      return { label: 'Starter', className: 'bg-purple-100 text-purple-700 border-purple-200' };
  }
}

type SortField = 'name' | 'score';
type SortDir = 'asc' | 'desc';

const DOMEIN_BLOKKEN: Record<string, string> = {
  'Digitale Systemen': 'Digitale Systemen (periode 1)',
  'Media & AI': 'Media & AI (periode 2)',
  'Programmeren': 'Programmeren (periode 2)',
  'Veiligheid': 'Veiligheid & Privacy (periode 3)',
  'Welzijn': 'Welzijn & Maatschappij (periode 3)',
};

export const DigitaalPaspoortTeacher: React.FC<DigitaalPaspoortTeacherProps> = ({ klasResults }) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const gemiddeldeScores = useMemo(() => {
    if (klasResults.length === 0) return DOMEINEN.map(() => 0);
    return DOMEINEN.map(d => {
      const sum = klasResults.reduce((acc, r) => acc + r.result.kamers[d.key].score, 0);
      return Math.round(sum / klasResults.length);
    });
  }, [klasResults]);

  const sortedResults = useMemo(() => {
    const sorted = [...klasResults];
    sorted.sort((a, b) => {
      if (sortField === 'name') {
        return a.studentName.localeCompare(b.studentName);
      }
      return a.result.overallScore - b.result.overallScore;
    });
    if (sortDir === 'desc') sorted.reverse();
    return sorted;
  }, [klasResults, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const zwaksteDomein = useMemo(() => {
    if (gemiddeldeScores.length === 0) return null;
    let minIdx = 0;
    gemiddeldeScores.forEach((s, i) => {
      if (s < gemiddeldeScores[minIdx]) minIdx = i;
    });
    return DOMEINEN[minIdx];
  }, [gemiddeldeScores]);

  if (klasResults.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
        <p className="text-slate-400 text-sm">Nog geen nulmetingsresultaten beschikbaar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gemiddeld radardiagram */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full" />
          Klasgemiddelde Nulmeting
        </h3>
        <RadarChartLight scores={gemiddeldeScores} labels={DOMEINEN.map(d => d.label)} />
        <div className="flex justify-center gap-4 mt-4">
          {DOMEINEN.map((d, i) => (
            <div key={d.key} className="text-center">
              <div className={`text-sm font-black ${gemiddeldeScores[i] >= 80 ? 'text-emerald-600' : gemiddeldeScores[i] >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                {gemiddeldeScores[i]}
              </div>
              <div className="text-[8px] font-bold text-slate-400 uppercase">{d.short}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leerlingen tabel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            Resultaten per leerling
            <span className="text-xs font-bold text-slate-400 normal-case tracking-normal ml-2">
              ({klasResults.length} leerlingen)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3">
                  <button
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Naam
                    <ArrowUpDown size={10} className={sortField === 'name' ? 'text-indigo-500' : ''} />
                  </button>
                </th>
                <th className="text-center px-2 py-3">
                  <button
                    onClick={() => toggleSort('score')}
                    className="flex items-center gap-1 mx-auto text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Niveau
                    <ArrowUpDown size={10} className={sortField === 'score' ? 'text-indigo-500' : ''} />
                  </button>
                </th>
                {DOMEINEN.map(d => (
                  <th key={d.key} className="text-center px-2 py-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{d.short}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedResults.map(({ studentName, studentId, result }) => {
                const badge = niveauBadge(result.niveau);
                return (
                  <tr key={studentId} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900">{studentName}</span>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black border ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    {DOMEINEN.map(d => {
                      const score = result.kamers[d.key].score;
                      return (
                        <td key={d.key} className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[40px]">
                              <div
                                className={`h-full rounded-full ${scoreBarColor(score)}`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 w-6 text-right">{score}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aanbeveling */}
      {zwaksteDomein && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
          <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-2">Aanbeveling</h4>
          <p className="text-sm text-indigo-800 leading-relaxed">
            Uw klas scoort het laagst op <strong>{zwaksteDomein.label}</strong> ({zwaksteDomein.short}).
            Overweeg om <strong>{DOMEIN_BLOKKEN[zwaksteDomein.label]}</strong> eerder in te plannen.
          </p>
        </div>
      )}
    </div>
  );
};
