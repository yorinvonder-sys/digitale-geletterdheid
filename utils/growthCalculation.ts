import type { NulmetingResult } from '@/components/assessment/escaperoom/types';

export type DomeinKey =
  | 'digitaleSystemen'
  | 'mediaEnAI'
  | 'programmeren'
  | 'veiligheidPrivacy'
  | 'welzijnMaatschappij';

export type DomeinScores = Record<DomeinKey, number>;

export interface DomeinGroei {
  nulmeting: number;
  eindmeting: number;
  groei: number;
  niveauStart: 'starter' | 'basis' | 'gevorderd';
  niveauEind: 'starter' | 'basis' | 'gevorderd';
}

export interface GroeiAnalyse {
  perDomein: Record<DomeinKey, DomeinGroei>;
  overallGroei: number;
  overallNulmeting: number;
  overallEindmeting: number;
  sterksteDomein: DomeinKey;
  focusDomein: DomeinKey;
  niveauStart: 'starter' | 'basis' | 'gevorderd';
  niveauEind: 'starter' | 'basis' | 'gevorderd';
}

export interface DomainPriority {
  domein: DomeinKey;
  score: number;
  priority: number;
  sloKerndoelen: string[];
}

const DOMEINEN: DomeinKey[] = [
  'digitaleSystemen',
  'mediaEnAI',
  'programmeren',
  'veiligheidPrivacy',
  'welzijnMaatschappij',
];

const SLO_MAPPING: Record<DomeinKey, string[]> = {
  digitaleSystemen: ['21A'],
  mediaEnAI: ['21B', '21D'],
  programmeren: ['22A', '22B'],
  veiligheidPrivacy: ['23A'],
  welzijnMaatschappij: ['23B', '23C'],
};

export function bepaalNiveau(score: number): 'starter' | 'basis' | 'gevorderd' {
  if (score <= 39) return 'starter';
  if (score <= 74) return 'basis';
  return 'gevorderd';
}

export function extractDomeinScores(result: NulmetingResult): DomeinScores {
  return {
    digitaleSystemen: result.kamers.digitaleSystemen.score,
    mediaEnAI: result.kamers.mediaEnAI.score,
    programmeren: result.kamers.programmeren.score,
    veiligheidPrivacy: result.kamers.veiligheidPrivacy.score,
    welzijnMaatschappij: result.kamers.welzijnMaatschappij.score,
  };
}

export function berekenGroei(nulmeting: DomeinScores, eindmeting: DomeinScores): GroeiAnalyse {
  const perDomein = {} as Record<DomeinKey, DomeinGroei>;

  for (const domein of DOMEINEN) {
    const n = nulmeting[domein];
    const e = eindmeting[domein];
    perDomein[domein] = {
      nulmeting: n,
      eindmeting: e,
      groei: e - n,
      niveauStart: bepaalNiveau(n),
      niveauEind: bepaalNiveau(e),
    };
  }

  const overallNulmeting = DOMEINEN.reduce((sum, d) => sum + nulmeting[d], 0) / DOMEINEN.length;
  const overallEindmeting = DOMEINEN.reduce((sum, d) => sum + eindmeting[d], 0) / DOMEINEN.length;

  const sterksteDomein = DOMEINEN.reduce((best, d) =>
    perDomein[d].groei > perDomein[best].groei ? d : best
  );

  const focusDomein = DOMEINEN.reduce((lowest, d) =>
    eindmeting[d] < eindmeting[lowest] ? d : lowest
  );

  return {
    perDomein,
    overallGroei: overallEindmeting - overallNulmeting,
    overallNulmeting,
    overallEindmeting,
    sterksteDomein,
    focusDomein,
    niveauStart: bepaalNiveau(overallNulmeting),
    niveauEind: bepaalNiveau(overallEindmeting),
  };
}

export function calculateDomainPriorities(scores: DomeinScores): DomainPriority[] {
  return DOMEINEN.map((domein) => ({
    domein,
    score: scores[domein],
    priority: Math.min(1, Math.max(0, (100 - scores[domein]) / 100)),
    sloKerndoelen: SLO_MAPPING[domein],
  })).sort((a, b) => b.priority - a.priority);
}

export function getDomeinLabel(key: DomeinKey): string {
  const labels: Record<DomeinKey, string> = {
    digitaleSystemen: 'Digitale Systemen',
    mediaEnAI: 'Media & AI',
    programmeren: 'Programmeren',
    veiligheidPrivacy: 'Veiligheid & Privacy',
    welzijnMaatschappij: 'Welzijn & Maatschappij',
  };
  return labels[key];
}

export function getDomeinKleur(key: DomeinKey): string {
  const kleuren: Record<DomeinKey, string> = {
    digitaleSystemen: 'indigo',
    mediaEnAI: 'emerald',
    programmeren: 'violet',
    veiligheidPrivacy: 'rose',
    welzijnMaatschappij: 'sky',
  };
  return kleuren[key];
}
