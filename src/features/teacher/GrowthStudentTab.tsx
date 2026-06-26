import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Check, X, RefreshCw, Bot } from 'lucide-react';
import { getStudentAssessments, getCurrentSchoolYear } from '@/services/assessmentService';
import { approveRecommendation } from '@/services/growthRecommendationService';
import { extractDomeinScores, berekenGroei, getDomeinLabel, getDomeinKleur, bepaalNiveau, type DomeinKey } from '@/utils/growthCalculation';
import { supabase } from '@/services/supabase';
import type { NulmetingResult } from '@/features/assessment/escaperoom/types';

const DOMEINEN: DomeinKey[] = [
  'digitaleSystemen',
  'mediaEnAI',
  'programmeren',
  'veiligheidPrivacy',
  'welzijnMaatschappij',
];

const NIVEAU_LABEL: Record<'starter' | 'basis' | 'gevorderd', string> = {
  starter: 'Starter',
  basis: 'Basis',
  gevorderd: 'Gevorderd',
};

const NIVEAU_KLEUR: Record<'starter' | 'basis' | 'gevorderd', string> = {
  starter: 'text-white bg-duck-acid/10 border-duck-acid/30',
  basis: 'text-duck-acid bg-duck-acid/10 border-duck-acid/30',
  gevorderd: 'text-duck-ink/60 bg-duck-acid/10 border-duck-acid/30',
};

interface GrowthRecommendation {
  id: string;
  recommendation_text: string;
  teacher_approved: boolean | null;
  teacher_approved_at: string | null;
  teacher_approved_by: string | null;
}

interface GrowthStudentTabProps {
  studentId: string;
  schoolYear?: number;
}

export const GrowthStudentTab: React.FC<GrowthStudentTabProps> = ({
  studentId,
  schoolYear,
}) => {
  const year = schoolYear ?? getCurrentSchoolYear();
  const [loading, setLoading] = useState(true);
  const [nulmeting, setNulmeting] = useState<NulmetingResult | null>(null);
  const [eindmeting, setEindmeting] = useState<NulmetingResult | null>(null);
  const [recommendation, setRecommendation] = useState<GrowthRecommendation | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const [assessments, { data: recData }] = await Promise.all([
        getStudentAssessments(studentId, year),
        (supabase as any)
          .from('growth_recommendations')
          .select('id, recommendation_text, teacher_approved, teacher_approved_at, teacher_approved_by')
          .eq('user_id', studentId)
          .eq('school_year', year)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      setNulmeting(assessments.nulmeting ?? null);
      setEindmeting(assessments.eindmeting ?? null);
      setRecommendation(recData ?? null);
      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [studentId, year]);

  const handleApprove = async (approved: boolean) => {
    if (!recommendation) return;
    setApprovingId(recommendation.id);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const teacherId = user?.id ?? studentId;
      const approvedAt = new Date().toISOString();
      await approveRecommendation(recommendation.id, approved, teacherId);
      setRecommendation((prev) =>
        prev
          ? {
              ...prev,
              teacher_approved: approved,
              teacher_approved_at: approvedAt,
              teacher_approved_by: teacherId,
            }
          : prev,
      );
    } catch (error) {
      console.error('[GrowthStudentTab] Kon aanbeveling niet beoordelen:', error);
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-duck-ink/60 text-sm">Laden…</div>;
  }

  if (!nulmeting) {
    return (
      <div className="p-6 text-center text-duck-ink/60 text-sm">
        Geen assessment data beschikbaar.
      </div>
    );
  }

  if (!eindmeting) {
    return (
      <div className="p-6 text-center text-duck-ink/60 text-sm">
        Eindmeting nog niet afgenomen.
      </div>
    );
  }

  const nScores = extractDomeinScores(nulmeting);
  const eScores = extractDomeinScores(eindmeting);
  const analyse = berekenGroei(nScores, eScores);

  return (
    <div className="space-y-4 p-1">
      {/* Per-domein bars */}
      <div className="space-y-3">
        {DOMEINEN.map((domein, i) => {
          const data = analyse.perDomein[domein];
          const kleur = getDomeinKleur(domein);
          const niveauChanged = data.niveauStart !== data.niveauEind;

          return (
            <motion.div
              key={domein}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-duck-ink/50 border border-duck-ink/15 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-duck-ink/60">
                  {getDomeinLabel(domein)}
                </span>
                <div className="flex items-center gap-2">
                  {niveauChanged && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${NIVEAU_KLEUR[data.niveauStart]}`}>
                      {NIVEAU_LABEL[data.niveauStart]}
                    </span>
                  )}
                  {niveauChanged && (
                    <span className="text-duck-ink/60 text-xs">→</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${NIVEAU_KLEUR[data.niveauEind]}`}>
                    {NIVEAU_LABEL[data.niveauEind]}
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div className="relative h-2 bg-duck-ink/60 rounded-full overflow-hidden">
                {/* Nulmeting bar */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full opacity-40"
                  style={{
                    width: `${data.nulmeting}%`,
                    backgroundColor: `var(--color-${kleur}-400, #818cf8)`,
                  }}
                />
                {/* Eindmeting bar */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${data.eindmeting}%`,
                    backgroundColor: `var(--color-${kleur}-400, #818cf8)`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-duck-ink/60">
                <span>Nulmeting: <span className="text-duck-ink/60 font-medium">{data.nulmeting.toFixed(0)}</span></span>
                <span className={`font-bold flex items-center gap-1 ${data.groei >= 0 ? 'text-duck-ink/60' : 'text-duck-acid'}`}>
                  {data.groei >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {data.groei >= 0 ? '+' : ''}{data.groei.toFixed(0)}
                </span>
                <span>Eindmeting: <span className="text-duck-ink/60 font-medium">{data.eindmeting.toFixed(0)}</span></span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Recommendation */}
      {recommendation && (
        <div className="bg-duck-ink/50 border border-duck-ink/15 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-duck-ink/60">Aanbeveling</h4>
            <span className="inline-flex items-center gap-1 text-xs text-duck-ink bg-duck-acid/10 border border-duck-acid/30 px-2 py-0.5 rounded-full">
              <Bot size={11} />
              Gegenereerd door AI (Mistral AI)
            </span>
          </div>

          {recommendation.teacher_approved === null && (
            <>
              <p className="text-sm text-duck-ink/60 mb-4 leading-relaxed">
                {recommendation.recommendation_text}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-duck-ink/60 mr-1">Wacht op goedkeuring</span>
                <button
                  onClick={() => handleApprove(true)}
                  disabled={approvingId === recommendation.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-duck-acid/20 text-duck-ink border border-duck-acid/30 hover:bg-duck-acid/30 transition-colors disabled:opacity-50"
                >
                  <Check size={12} />
                  Goedkeuren
                </button>
                <button
                  onClick={() => handleApprove(false)}
                  disabled={approvingId === recommendation.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-duck-acid/20 text-duck-acid border border-duck-acid/30 hover:bg-duck-acid/30 transition-colors disabled:opacity-50"
                >
                  <X size={12} />
                  Afwijzen
                </button>
              </div>
            </>
          )}

          {recommendation.teacher_approved === true && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs text-duck-ink bg-duck-acid/10 border border-duck-acid/30 px-2 py-0.5 rounded-full font-medium">
                  <Check size={11} />
                  Goedgekeurd
                </span>
              </div>
              <p className="text-sm text-duck-ink/60 leading-relaxed">
                {recommendation.recommendation_text}
              </p>
            </>
          )}

          {recommendation.teacher_approved === false && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-duck-ink/60 italic">Afgewezen</span>
              <button
                onClick={() => handleApprove(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-duck-ink/10 text-duck-ink/60 border border-duck-ink/15 hover:bg-duck-ink/20 transition-colors"
              >
                <RefreshCw size={11} />
                Opnieuw beoordelen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
