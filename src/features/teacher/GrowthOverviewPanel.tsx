import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { getKlasGroeiData, getCurrentSchoolYear } from '@/services/assessmentService';
import { extractDomeinScores, berekenGroei, getDomeinLabel, getDomeinKleur, type DomeinKey, type DomeinScores } from '@/utils/growthCalculation';
import type { NulmetingResult } from '@/features/assessment/escaperoom/types';

const DOMEINEN: DomeinKey[] = [
  'digitaleSystemen',
  'mediaEnAI',
  'programmeren',
  'veiligheidPrivacy',
  'welzijnMaatschappij',
];

interface DomeinGemiddelde {
  domein: DomeinKey;
  avgNulmeting: number;
  avgEindmeting: number;
  avgGroei: number;
}

interface GrowthOverviewPanelProps {
  studentIds: string[];
  schoolYear?: number;
}

export const GrowthOverviewPanel: React.FC<GrowthOverviewPanelProps> = ({
  studentIds,
  schoolYear,
}) => {
  const year = schoolYear ?? getCurrentSchoolYear();
  const [loading, setLoading] = useState(true);
  const [completeCount, setCompleteCount] = useState(0);
  const [avgOverallGroei, setAvgOverallGroei] = useState(0);
  const [domeinGemiddelden, setDomeinGemiddelden] = useState<DomeinGemiddelde[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const data = await getKlasGroeiData(studentIds, year);

      if (cancelled) return;

      const complete = data.filter((d) => d.nulmeting && d.eindmeting);
      setCompleteCount(complete.length);

      if (complete.length === 0) {
        setDomeinGemiddelden([]);
        setAvgOverallGroei(0);
        setLoading(false);
        return;
      }

      // Per-domein sums
      const sums: Record<DomeinKey, { nulmeting: number; eindmeting: number }> = {
        digitaleSystemen: { nulmeting: 0, eindmeting: 0 },
        mediaEnAI: { nulmeting: 0, eindmeting: 0 },
        programmeren: { nulmeting: 0, eindmeting: 0 },
        veiligheidPrivacy: { nulmeting: 0, eindmeting: 0 },
        welzijnMaatschappij: { nulmeting: 0, eindmeting: 0 },
      };

      let totalGroei = 0;

      for (const student of complete) {
        const nScores = extractDomeinScores(student.nulmeting as NulmetingResult);
        const eScores = extractDomeinScores(student.eindmeting as NulmetingResult);
        const analyse = berekenGroei(nScores, eScores);
        totalGroei += analyse.overallGroei;

        for (const domein of DOMEINEN) {
          sums[domein].nulmeting += analyse.perDomein[domein].nulmeting;
          sums[domein].eindmeting += analyse.perDomein[domein].eindmeting;
        }
      }

      const n = complete.length;
      setAvgOverallGroei(totalGroei / n);
      setDomeinGemiddelden(
        DOMEINEN.map((domein) => ({
          domein,
          avgNulmeting: sums[domein].nulmeting / n,
          avgEindmeting: sums[domein].eindmeting / n,
          avgGroei: (sums[domein].eindmeting - sums[domein].nulmeting) / n,
        })),
      );
      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [studentIds, year]);

  const kAnonymityWarning = completeCount > 0 && completeCount < 5;
  const hasData = completeCount > 0;

  return (
    <div className="bg-duck-bgLight border border-duck-ink/15 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-duck-ink/15 flex items-center justify-between">
        <h3 className="text-sm font-black text-duck-ink uppercase tracking-widest flex items-center gap-2">
          <BarChart3 size={16} className="text-duck-ink" />
          Groei-overzicht
        </h3>
        <span className="text-xs text-duck-ink/60">
          Schooljaar {year}–{year + 1}
        </span>
      </div>

      {loading ? (
        <div className="p-8 text-center text-duck-ink/60 text-sm">Laden…</div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="px-5 py-4 flex items-center gap-6 border-b border-duck-ink/15">
            <div>
              <div className="text-2xl font-black text-duck-ink">{completeCount}</div>
              <div className="text-xs text-duck-ink/60 mt-0.5">leerlingen met beide metingen</div>
            </div>
            {hasData && !kAnonymityWarning && (
              <div>
                <div className={`text-2xl font-black flex items-center gap-1 ${avgOverallGroei >= 0 ? 'text-duck-ink/60' : 'text-duck-error'}`}>
                  {avgOverallGroei >= 0
                    ? <TrendingUp size={20} />
                    : <TrendingDown size={20} />}
                  {avgOverallGroei >= 0 ? '+' : ''}{avgOverallGroei.toFixed(1)}
                </div>
                <div className="text-xs text-duck-ink/60 mt-0.5">gemiddelde totaalgroei</div>
              </div>
            )}
          </div>

          {/* k-anonymity warning */}
          {kAnonymityWarning && (
            <div className="mx-5 mt-4 flex items-start gap-3 bg-duck-acid/10 border border-duck-acid/30 rounded-xl px-4 py-3 text-sm text-duck-ink">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>Onvoldoende data voor betrouwbare gemiddelden (minder dan 5 leerlingen met nulmeting én eindmeting).</span>
            </div>
          )}

          {/* Table */}
          {hasData && !kAnonymityWarning && (
            <div className="overflow-x-auto px-5 py-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-duck-ink/60 text-xs uppercase tracking-wider">
                    <th className="text-left pb-3 font-semibold">Domein</th>
                    <th className="text-right pb-3 font-semibold">Avg Nulmeting</th>
                    <th className="text-right pb-3 font-semibold">Avg Eindmeting</th>
                    <th className="text-right pb-3 font-semibold">Avg Groei</th>
                  </tr>
                </thead>
                <tbody>
                  {domeinGemiddelden.map((row, i) => (
                    <tr
                      key={row.domein}
                      className={`border-t border-duck-ink/15 ${i % 2 === 0 ? '' : 'bg-duck-ink/10'}`}
                    >
                      <td className="py-3 pr-4 font-medium text-duck-ink/60">
                        {getDomeinLabel(row.domein)}
                      </td>
                      <td className="py-3 text-right text-duck-ink/60 tabular-nums">
                        {row.avgNulmeting.toFixed(1)}
                      </td>
                      <td className="py-3 text-right text-duck-ink/60 tabular-nums">
                        {row.avgEindmeting.toFixed(1)}
                      </td>
                      <td className={`py-3 text-right font-bold tabular-nums ${row.avgGroei >= 0 ? 'text-duck-ink/60' : 'text-duck-error'}`}>
                        {row.avgGroei >= 0 ? '+' : ''}{row.avgGroei.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!hasData && (
            <div className="p-8 text-center text-duck-ink/60 text-sm">
              Geen leerlingen met nulmeting én eindmeting gevonden.
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-3 border-t border-duck-ink/15 text-xs text-duck-ink/60">
            Gebaseerd op {completeCount} leerlingen met nulmeting én eindmeting
          </div>
        </>
      )}
    </div>
  );
};
