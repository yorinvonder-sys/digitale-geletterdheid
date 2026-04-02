import type { DomainPriority, DomeinKey, DomeinScores } from './growthCalculation';
import { calculateDomainPriorities } from './growthCalculation';

export interface MissionSloInfo {
  id: string;
  title: string;
  sloKerndoelen: string[];
}

export interface RankedMission {
  missionId: string;
  title: string;
  relevanceScore: number;
  matchingDomains: DomeinKey[];
}

const SLO_TO_DOMEIN: Record<string, DomeinKey> = {
  '21A': 'digitaleSystemen',
  '21B': 'mediaEnAI',
  '21D': 'mediaEnAI',
  '22A': 'programmeren',
  '22B': 'programmeren',
  '23A': 'veiligheidPrivacy',
  '23B': 'welzijnMaatschappij',
  '23C': 'welzijnMaatschappij',
};

export function sloToDomein(sloCode: string): DomeinKey | null {
  return SLO_TO_DOMEIN[sloCode] ?? null;
}

export function rankMissions(missions: MissionSloInfo[], priorities: DomainPriority[]): RankedMission[] {
  const priorityByDomein = new Map<DomeinKey, number>(
    priorities.map((p) => [p.domein, p.priority])
  );

  const maxPossibleScore = priorities.reduce((sum, p) => sum + p.priority, 0);

  const ranked = missions.map((mission) => {
    const seenDomeinen = new Set<DomeinKey>();
    let rawScore = 0;

    for (const slo of mission.sloKerndoelen) {
      const domein = sloToDomein(slo);
      if (domein && !seenDomeinen.has(domein)) {
        seenDomeinen.add(domein);
        rawScore += priorityByDomein.get(domein) ?? 0;
      }
    }

    const relevanceScore = maxPossibleScore > 0 ? rawScore / maxPossibleScore : 0;

    return {
      missionId: mission.id,
      title: mission.title,
      relevanceScore,
      matchingDomains: Array.from(seenDomeinen),
    };
  });

  return ranked.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export function getAdaptiveSuggestions(
  scores: DomeinScores,
  missions: MissionSloInfo[],
  limit = 5
): RankedMission[] {
  const priorities = calculateDomainPriorities(scores);
  return rankMissions(missions, priorities).slice(0, limit);
}
