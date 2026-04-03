import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Globe } from 'lucide-react';
import { SLO_KERNDOELEN, DomeinNummer } from '../config/sloKerndoelen';
import { KERNDOEL_MISSIONS } from '../config/slo-kerndoelen-mapping';

export interface SkillTreeProps {
  completedMissions: string[];
  yearGroup: number;
}

interface DomeinSummary {
  domeinNummer: DomeinNummer;
  naam: string;
  kleur: 'blue' | 'purple' | 'amber';
  isVso: boolean;
  completed: number;
  total: number;
  percentage: number;
}

const DOMEIN_ICONS: Record<number, React.ReactNode> = {
  18: <BookOpen size={20} />,
  19: <Cpu size={20} />,
  20: <Globe size={20} />,
  21: <BookOpen size={20} />,
  22: <Cpu size={20} />,
  23: <Globe size={20} />,
};

const DOMEIN_NAMEN: Record<number, string> = {
  18: 'Praktische kennis & vaardigheden',
  19: 'Ontwerpen & maken',
  20: 'De gedigitaliseerde wereld',
  21: 'Praktische kennis & vaardigheden',
  22: 'Ontwerpen & maken',
  23: 'De gedigitaliseerde wereld',
};

const KLEUR_STYLES: Record<'blue' | 'purple' | 'amber', {
  card: string;
  icon: string;
  bar: string;
  badge: string;
  text: string;
}> = {
  blue: {
    card: 'border-blue-100 bg-blue-50/40',
    icon: 'bg-blue-100 text-blue-600',
    bar: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    text: 'text-blue-600',
  },
  purple: {
    card: 'border-purple-100 bg-purple-50/40',
    icon: 'bg-purple-100 text-purple-600',
    bar: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-700',
    text: 'text-purple-600',
  },
  amber: {
    card: 'border-amber-100 bg-amber-50/40',
    icon: 'bg-amber-100 text-amber-600',
    bar: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700',
    text: 'text-amber-600',
  },
};

function buildDomeinSummaries(
  completedMissions: string[],
  yearGroup: number,
): DomeinSummary[] {
  const isVso = Object.values(SLO_KERNDOELEN).some(
    (k) => k.isVso && Object.keys(SLO_KERNDOELEN).includes(k.code),
  );
  // Determine which domain numbers apply for the given yearGroup context.
  // Regular VO: 21, 22, 23 — VSO: 18, 19, 20.
  // We derive this from what missions actually exist for the yearGroup.
  const relevantMissions = KERNDOEL_MISSIONS.filter(
    (m) => m.yearGroup === yearGroup,
  );

  const completedSet = new Set(completedMissions);

  // Collect all domain numbers referenced by these missions
  const domeinMap = new Map<DomeinNummer, { completed: Set<string>; total: Set<string> }>();

  for (const mission of relevantMissions) {
    const codes = mission.sloKerndoelen;
    const seen = new Set<DomeinNummer>();
    for (const code of codes) {
      const kerndoel = SLO_KERNDOELEN[code];
      if (!kerndoel) continue;
      const dn = kerndoel.domeinNummer;
      if (!seen.has(dn)) {
        seen.add(dn);
        if (!domeinMap.has(dn)) {
          domeinMap.set(dn, { completed: new Set(), total: new Set() });
        }
        const entry = domeinMap.get(dn)!;
        entry.total.add(mission.id);
        if (completedSet.has(mission.id)) {
          entry.completed.add(mission.id);
        }
      }
    }
  }

  // Build summaries, sorted by domain number
  const summaries: DomeinSummary[] = [];
  for (const [dn, counts] of [...domeinMap.entries()].sort(([a], [b]) => a - b)) {
    // Get kleur from first kerndoel in this domain
    const firstKerndoel = Object.values(SLO_KERNDOELEN).find(
      (k) => k.domeinNummer === dn,
    );
    if (!firstKerndoel) continue;
    const total = counts.total.size;
    const completed = counts.completed.size;
    summaries.push({
      domeinNummer: dn,
      naam: DOMEIN_NAMEN[dn] ?? firstKerndoel.domein,
      kleur: firstKerndoel.kleur,
      isVso: firstKerndoel.isVso ?? false,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  }

  // If no missions found for yearGroup (yearGroup out of range), fall back to all years
  if (summaries.length === 0) {
    return buildDomeinSummaries(completedMissions, 1);
  }

  return summaries;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' },
  }),
};

export const SkillTree: React.FC<SkillTreeProps> = ({ completedMissions, yearGroup }) => {
  const domeinen = useMemo(
    () => buildDomeinSummaries(completedMissions, yearGroup),
    [completedMissions, yearGroup],
  );

  return (
    <div className="space-y-4">
      {domeinen.map((domein, i) => {
        const styles = KLEUR_STYLES[domein.kleur];
        return (
          <motion.div
            key={domein.domeinNummer}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`rounded-2xl border p-5 ${styles.card}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl ${styles.icon}`}>
                {DOMEIN_ICONS[domein.domeinNummer]}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-900 text-sm leading-tight truncate">
                  {domein.naam}
                </h4>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${styles.text}`}>
                  Domein {domein.domeinNummer}
                  {domein.isVso ? ' · VSO' : ''}
                </span>
              </div>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full ${styles.badge}`}>
                {domein.completed}/{domein.total}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-white/70 rounded-full overflow-hidden border border-white/50">
              <motion.div
                className={`h-full rounded-full ${styles.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${domein.percentage}%` }}
                transition={{ delay: i * 0.07 + 0.2, duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-1.5 text-[10px] font-bold text-slate-400 text-right">
              {domein.percentage}% afgerond
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
