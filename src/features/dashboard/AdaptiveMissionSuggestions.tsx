import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Sparkles, ChevronRight } from 'lucide-react';
import { getAdaptiveSuggestions, type RankedMission } from '@/utils/adaptiveEngine';
import { extractDomeinScores, getDomeinLabel, getDomeinKleur, type DomeinKey } from '@/utils/growthCalculation';
import { getAssessmentResult, getCurrentSchoolYear, type AssessmentType } from '@/services/assessmentService';
import { ROLES } from '@/config/agents';
import { KERNDOEL_MISSIONS } from '@/config/slo-kerndoelen-mapping';
import { duckUi } from '@/config/duckUi';

interface AdaptiveMissionSuggestionsProps {
  userId: string;
  yearGroup: number;
  nulmetingResult?: import('@/features/assessment/escaperoom/types').NulmetingResult;
}

const DOMAIN_COLORS: Record<string, { badge: string; dot: string }> = {
  indigo:  { badge: 'bg-duck-ink/10 text-duck-ink',  dot: 'bg-duck-ink' },
  emerald: { badge: 'bg-duck-ink/10 text-duck-ink',  dot: 'bg-duck-ink' },
  violet:  { badge: 'bg-duck-ink/10 text-duck-ink',  dot: 'bg-duck-ink' },
  rose:    { badge: 'bg-duck-ink/10 text-duck-ink',  dot: 'bg-duck-ink' },
  sky:     { badge: 'bg-duck-ink/10 text-duck-ink',  dot: 'bg-duck-ink' },
};

function domainBadgeClass(key: DomeinKey): string {
  const color = getDomeinKleur(key);
  return DOMAIN_COLORS[color]?.badge ?? 'bg-duck-ink/10 text-duck-ink/65';
}

function relevanceIndicator(score: number): { label: string; className: string } {
  if (score > 0.6) return { label: 'Hoog',   className: 'bg-duck-acid' };
  if (score >= 0.3) return { label: 'Middel', className: 'bg-duck-ink/40' };
  return               { label: 'Laag',   className: 'bg-duck-ink/20' };
}

const cardVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const AdaptiveMissionSuggestions: React.FC<AdaptiveMissionSuggestionsProps> = ({ userId, yearGroup, nulmetingResult }) => {
  const [suggestions, setSuggestions] = useState<RankedMission[]>([]);
  const [assessmentLabel, setAssessmentLabel] = useState<'nulmeting' | 'eindmeting'>('nulmeting');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // Gebruik nulmetingResult prop als beschikbaar (voorkomt DB-query als tabel niet bestaat)
        let result = nulmetingResult ?? null;
        let usedType: AssessmentType = 'nulmeting';

        // Alleen naar assessment_results tabel gaan als we geen lokaal resultaat hebben
        if (!result) {
          const schoolYear = getCurrentSchoolYear();
          result = await getAssessmentResult(userId, 'eindmeting', schoolYear);
          usedType = 'eindmeting';

          if (!result) {
            result = await getAssessmentResult(userId, 'nulmeting', schoolYear);
            usedType = 'nulmeting';
          }
        }

        if (cancelled || !result) return;

        const scores = extractDomeinScores(result);

        const missions = KERNDOEL_MISSIONS
          .filter((m) => m.yearGroup === yearGroup)
          .map((m) => ({ id: m.id, title: m.title, sloKerndoelen: m.sloKerndoelen }));

        const ranked = getAdaptiveSuggestions(scores, missions, 5);

        if (!cancelled) {
          setSuggestions(ranked);
          setAssessmentLabel(usedType);
        }
      } catch (err) {
        console.error('[AdaptiveMissionSuggestions] load error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [userId, yearGroup]);

  if (loading) {
    return (
      <div className="rounded-[1.5rem] border border-duck-ink/10 bg-white p-5 shadow-duck-soft space-y-3">
        <div className="h-5 w-40 bg-duck-ink/10 rounded animate-pulse" />
        <div className="h-3 w-56 bg-duck-ink/10 rounded animate-pulse" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 bg-duck-ink/10 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      className="rounded-[1.5rem] border border-duck-ink/10 bg-white p-5 shadow-duck-soft space-y-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-duck-ink shrink-0" />
          <h3 className="font-display text-duck-ink font-semibold text-sm">Aanbevolen voor jou</h3>
        </div>
        <p className="text-duck-ink/65 text-xs pl-6">
          Op basis van je {assessmentLabel === 'eindmeting' ? 'eindmeting' : 'nulmeting'}
        </p>
      </div>

      {/* Mission list */}
      <motion.ul
        className="space-y-2"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {suggestions.map((mission) => {
          const role = ROLES.find((r) => r.id === mission.missionId);
          const title = role?.title ?? mission.title;
          const indicator = relevanceIndicator(mission.relevanceScore);

          return (
            <motion.li
              key={mission.missionId}
              variants={cardVariants}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center gap-3 bg-duck-bg hover:bg-duck-ink/10 rounded-xl px-3 py-2.5 transition-colors"
            >
              {/* Relevance dot */}
              <span
                className={`shrink-0 w-2 h-2 rounded-full ${indicator.className}`}
                title={`Relevantie: ${indicator.label}`}
              />

              {/* Title + domains */}
              <div className="flex-1 min-w-0">
                <p className="text-duck-ink text-xs font-medium truncate">{title}</p>
                {mission.matchingDomains.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mission.matchingDomains.map((domain) => (
                      <span
                        key={domain}
                        className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full ${domainBadgeClass(domain)}`}
                      >
                        {getDomeinLabel(domain)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <ChevronRight size={14} className="text-duck-ink/65 shrink-0" />
            </motion.li>
          );
        })}
      </motion.ul>

      {/* AI disclosure */}
      <p className="flex items-center gap-1.5 text-duck-ink/65 text-[10px] pt-1 border-t border-duck-ink/10">
        <Sparkles size={10} className="shrink-0" />
        Deze suggesties zijn gebaseerd op je toetsresultaten
      </p>
    </motion.div>
  );
};
