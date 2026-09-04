import React, { useEffect, useMemo, useState } from 'react';
import { ACADEMY_LESSONS, getLessonById } from './code-academy/academyContent';
import { AcademyLessonView } from './code-academy/AcademyLessonView';
import { AcademyOverview } from './code-academy/AcademyOverview';
import {
  readAcademyProgress,
  resetAcademyProgress,
  writeAcademyProgress,
} from './code-academy/progress';

export function DeveloperCodeAcademy() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => readAcademyProgress());

  useEffect(() => {
    writeAcademyProgress(completed);
  }, [completed]);

  const activeLesson = useMemo(
    () => getLessonById(activeLessonId),
    [activeLessonId]
  );
  const activeIndex = activeLesson
    ? ACADEMY_LESSONS.findIndex((lesson) => lesson.id === activeLesson.id)
    : -1;
  const activeLessonCompleted = Boolean(
    activeLesson && completed.includes(activeLesson.id)
  );

  function completeActiveLesson() {
    if (!activeLesson) return;
    setCompleted((current) =>
      current.includes(activeLesson.id)
        ? current
        : [...current, activeLesson.id]
    );
  }

  function resetProgress() {
    resetAcademyProgress();
    setCompleted([]);
    setActiveLessonId(null);
  }

  if (activeLesson) {
    return (
      <AcademyLessonView
        lesson={activeLesson}
        isCompleted={activeLessonCompleted}
        onComplete={completeActiveLesson}
        onBack={() => setActiveLessonId(null)}
        onPrevious={activeIndex > 0
          ? () => setActiveLessonId(ACADEMY_LESSONS[activeIndex - 1].id)
          : undefined}
        onNext={activeLessonCompleted && activeIndex < ACADEMY_LESSONS.length - 1
          ? () => setActiveLessonId(ACADEMY_LESSONS[activeIndex + 1].id)
          : undefined}
      />
    );
  }

  return (
    <AcademyOverview
      completed={completed}
      onSelectLesson={setActiveLessonId}
      onReset={resetProgress}
    />
  );
}
