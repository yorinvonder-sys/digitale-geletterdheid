export type AcademyTrackId = 'fundament' | 'react' | 'data' | 'review';

export type AcademyVisualKind = 'flow' | 'tree' | 'layers' | 'data' | 'comparison' | 'cycle';

export interface AcademyVisualNode {
  label: string;
  detail: string;
  accent?: 'acid' | 'ink' | 'blue' | 'teal' | 'orange' | 'purple';
  children?: string[];
}

export interface AcademyVisualConfig {
  kind: AcademyVisualKind;
  title: string;
  caption: string;
  nodes: AcademyVisualNode[];
}

export interface AcademyConcept {
  term: string;
  meaning: string;
  example: string;
}

export interface AcademyDataFlowRow {
  from: string;
  to: string;
  data: string;
  reason: string;
}

export interface AcademyQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AcademyPractice {
  title: string;
  instruction: string;
  checklist: string[];
}

export interface AcademyLesson {
  id: string;
  number: number;
  track: AcademyTrackId;
  title: string;
  subtitle: string;
  objective: string;
  durationMinutes: number;
  whyItMatters: string;
  remember: string;
  file: string;
  code: string;
  explanation: string[];
  concepts: AcademyConcept[];
  dataFlow: AcademyDataFlowRow[];
  pitfalls: string[];
  practice: AcademyPractice;
  aiPrompt: string;
  quiz: AcademyQuiz;
  visual: AcademyVisualConfig;
}

export interface AcademyTrack {
  id: AcademyTrackId;
  title: string;
  subtitle: string;
  description: string;
  lessonIds: string[];
}
