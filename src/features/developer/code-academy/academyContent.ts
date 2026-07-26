import { DATA_LESSONS } from './content/data';
import { FUNDAMENT_LESSONS } from './content/fundament';
import { REACT_LESSONS } from './content/react';
import { REVIEW_LESSONS } from './content/review';
import type { AcademyLesson, AcademyTrack } from './types';

export const ACADEMY_TRACKS: AcademyTrack[] = [
  {
    id: 'fundament',
    title: '1. Fundament',
    subtitle: 'De kaart van de applicatie',
    description: 'Leer waar DGskills start, hoe routes worden gekozen en hoe bestanden en componenten samenhangen.',
    lessonIds: FUNDAMENT_LESSONS.map((lesson) => lesson.id),
  },
  {
    id: 'react',
    title: '2. React begrijpen',
    subtitle: 'Interface en interactie',
    description: 'Lees componenten, props, state, effecten, events en conditionele interface zonder dat je alles zelf hoeft te kunnen schrijven.',
    lessonIds: REACT_LESSONS.map((lesson) => lesson.id),
  },
  {
    id: 'data',
    title: '3. Data & Supabase',
    subtitle: 'Van type tot database',
    description: 'Volg data door types, services, reads, writes, authenticatie en fouttoestanden.',
    lessonIds: DATA_LESSONS.map((lesson) => lesson.id),
  },
  {
    id: 'review',
    title: '4. DGskills & AI-review',
    subtitle: 'De eigenaar als kritische reviewer',
    description: 'Begrijp de missieketen, rechten en quality gates en leer AI-pull-requests met bewijs beoordelen.',
    lessonIds: REVIEW_LESSONS.map((lesson) => lesson.id),
  },
];

export const ACADEMY_LESSONS: AcademyLesson[] = [
  ...FUNDAMENT_LESSONS,
  ...REACT_LESSONS,
  ...DATA_LESSONS,
  ...REVIEW_LESSONS,
];

export const ACADEMY_LESSON_IDS = new Set(ACADEMY_LESSONS.map((lesson) => lesson.id));

export function getLessonById(id: string | null): AcademyLesson | undefined {
  if (!id) return undefined;
  return ACADEMY_LESSONS.find((lesson) => lesson.id === id);
}
