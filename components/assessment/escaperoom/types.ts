
export interface NulmetingResult {
  completedAt: string;
  totalTimeSeconds: number;
  kamers: {
    digitaleSystemen: KamerScore;    // 21A
    mediaEnAI: KamerScore;           // 21B/21D
    programmeren: KamerScore;        // 22A/22B
    veiligheidPrivacy: KamerScore;   // 23A
    welzijnMaatschappij: KamerScore; // 23B/23C
  };
  overallScore: number; // gemiddelde 0-100
  niveau: 'starter' | 'basis' | 'gevorderd'; // overall classificatie
}

export interface KamerScore {
  score: number;        // 0-100
  timeSeconds: number;
  details: Record<string, any>; // kamer-specifieke data
}

export type KamerStatus = 'locked' | 'active' | 'completed';

export type EscaperoomStap =
  | 'intro'
  | 'kamer1'
  | 'kamer2'
  | 'kamer3'
  | 'kamer4'
  | 'kamer5'
  | 'resultaat';

export const KAMER_VOLGORDE: EscaperoomStap[] = [
  'intro',
  'kamer1',
  'kamer2',
  'kamer3',
  'kamer4',
  'kamer5',
  'resultaat',
];

export const KAMER_NAMEN: Record<string, string> = {
  kamer1: 'Vergrendelde Laptop',
  kamer2: 'Nepnieuwsfabriek',
  kamer3: 'Codekluis',
  kamer4: 'Datalek',
  kamer5: 'Dilemma',
};
