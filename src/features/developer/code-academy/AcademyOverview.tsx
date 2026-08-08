import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Code2,
  Database,
  Lock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ACADEMY_LESSONS, ACADEMY_TRACKS } from './academyContent';
import { AcademyArchitectureMap } from './AcademyArchitectureMap';
import type { AcademyLesson, AcademyTrackId } from './types';

interface AcademyOverviewProps {
  completed: string[];
  onSelectLesson: (lessonId: string) => void;
  onReset: () => void;
}

const TRACK_STYLES: Record<AcademyTrackId, { panel: string; badge: string; icon: React.ReactNode }> = {
  fundament: {
    panel: 'border-blue-200 bg-blue-50/70',
    badge: 'bg-blue-950 text-white',
    icon: <BookOpen size={20} />,
  },
  react: {
    panel: 'border-teal-200 bg-teal-50/70',
    badge: 'bg-teal-900 text-white',
    icon: <Code2 size={20} />,
  },
  data: {
    panel: 'border-purple-200 bg-purple-50/70',
    badge: 'bg-purple-950 text-white',
    icon: <Database size={20} />,
  },
  review: {
    panel: 'border-orange-200 bg-orange-50/70',
    badge: 'bg-orange-950 text-white',
    icon: <BrainCircuit size={20} />,
  },
};

function LessonCard({
  lesson,
  completed,
  locked,
  onSelect,
}: {
  lesson: AcademyLesson;
  completed: boolean;
  locked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type='button'
      disabled={locked}
      onClick={onSelect}
      className={`group flex min-h-[250px] flex-col rounded-[1.75rem] border p-5 text-left transition-all ${
        locked
          ? 'cursor-not-allowed border-duck-ink/10 bg-white/45 opacity-55'
          : 'border-duck-ink/15 bg-white shadow-sm hover:-translate-y-1 hover:border-duck-ink/35 hover:shadow-duck-soft'
      }`}
    >
      <div className='flex items-start justify-between gap-3'>
        <span className={`flex size-11 items-center justify-center rounded-2xl text-sm font-black ${completed ? 'bg-duck-ink text-duck-acid' : 'bg-duck-acid text-duck-ink'}`}>
          {completed ? <Check size={19} /> : lesson.number}
        </span>
        {locked ? <Lock size={18} className='text-duck-ink/40' /> : <ArrowRight size={19} className='text-duck-ink/40 transition-transform group-hover:translate-x-1' />}
      </div>
      <div className='mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-duck-ink/45'>
        <Clock3 size={13} /> {lesson.durationMinutes} minuten
      </div>
      <h4 className='mt-3 text-lg font-black leading-tight text-duck-ink'>{lesson.title}</h4>
      <p className='mt-2 text-sm font-semibold leading-relaxed text-duck-ink/60'>{lesson.subtitle}</p>
      <p className='mt-auto pt-5 text-xs font-bold leading-relaxed text-duck-ink/55'>
        {locked ? 'Rond eerst de vorige les af.' : completed ? 'Afgerond · opnieuw bekijken' : lesson.objective}
      </p>
    </button>
  );
}

export function AcademyOverview({ completed, onSelectLesson, onReset }: AcademyOverviewProps) {
  const completedSet = useMemo(() => new Set(completed), [completed]);
  const completionPercentage = Math.round((completedSet.size / ACADEMY_LESSONS.length) * 100);
  const totalMinutes = ACADEMY_LESSONS.reduce((total, lesson) => total + lesson.durationMinutes, 0);
  const completedMinutes = ACADEMY_LESSONS
    .filter((lesson) => completedSet.has(lesson.id))
    .reduce((total, lesson) => total + lesson.durationMinutes, 0);
  const remainingMinutes = Math.max(0, totalMinutes - completedMinutes);
  const recommendedLesson = ACADEMY_LESSONS.find((lesson) => !completedSet.has(lesson.id));
  const conceptCount = ACADEMY_LESSONS.reduce((total, lesson) => total + lesson.concepts.length, 0);
  const dataFlowCount = ACADEMY_LESSONS.reduce((total, lesson) => total + lesson.dataFlow.length, 0);
  const [expandedTrack, setExpandedTrack] = useState<AcademyTrackId | null>(
    () => recommendedLesson?.track ?? 'fundament'
  );

  return (
    <div className='space-y-7 animate-in fade-in duration-300'>
      <section className='overflow-hidden rounded-[2.25rem] bg-duck-ink text-white shadow-duck-soft'>
        <div className='grid gap-8 p-6 md:p-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-center'>
          <div>
            <div className='flex items-center gap-3'>
              <div className='flex size-12 items-center justify-center rounded-2xl bg-duck-acid text-duck-ink'>
                <BookOpen size={25} />
              </div>
              <div>
                <p className='text-xs font-black uppercase tracking-[0.22em] text-duck-acid'>DGskills Code Academie</p>
                <p className='text-xs font-semibold text-white/50'>Developer-only leeromgeving</p>
              </div>
            </div>
            <h2 className='mt-6 max-w-3xl text-3xl font-black tracking-tight md:text-5xl'>Begrijp jouw webapp van browser tot database</h2>
            <p className='mt-4 max-w-3xl text-sm font-medium leading-relaxed text-white/70 md:text-base'>
              Vier routes en 24 lessen. Iedere les combineert een visueel model, echte DGskills-code, datastromen, risico’s en een korte oefening.
            </p>
            {recommendedLesson && (
              <button
                type='button'
                onClick={() => onSelectLesson(recommendedLesson.id)}
                className='mt-6 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-duck-acid px-6 text-sm font-black text-duck-ink transition-transform hover:-translate-y-0.5'
              >
                <Sparkles size={18} />
                Ga verder met les {recommendedLesson.number}: {recommendedLesson.title}
              </button>
            )}
          </div>

          <div className='rounded-[2rem] bg-white/10 p-6 ring-1 ring-white/15'>
            <div className='flex items-end justify-between gap-4'>
              <div>
                <p className='text-[10px] font-black uppercase tracking-[0.18em] text-white/50'>Totale voortgang</p>
                <p className='mt-1 text-5xl font-black text-duck-acid'>{completionPercentage}%</p>
              </div>
              <p className='text-sm font-bold text-white/65'>{completedSet.size}/{ACADEMY_LESSONS.length} lessen</p>
            </div>
            <div className='mt-5 h-3 overflow-hidden rounded-full bg-white/15'>
              <div className='h-full rounded-full bg-duck-acid transition-all duration-500' style={{ width: `${completionPercentage}%` }} />
            </div>
            <div className='mt-6 grid grid-cols-2 gap-3 text-center'>
              <div className='rounded-2xl bg-white/10 p-4'>
                <p className='text-2xl font-black text-white'>{remainingMinutes}</p>
                <p className='mt-1 text-[10px] font-black uppercase tracking-widest text-white/50'>minuten over</p>
              </div>
              <div className='rounded-2xl bg-white/10 p-4'>
                <p className='text-2xl font-black text-white'>{conceptCount}</p>
                <p className='mt-1 text-[10px] font-black uppercase tracking-widest text-white/50'>begrippen</p>
              </div>
            </div>
            {completedSet.size > 0 && (
              <button type='button' onClick={onReset} className='mt-5 inline-flex min-h-[44px] items-center gap-2 text-xs font-bold text-white/60 hover:text-white'>
                <RotateCcw size={14} /> Voortgang resetten
              </button>
            )}
          </div>
        </div>
      </section>

      <section className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-[1.75rem] border border-duck-ink/15 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-3'><BookOpen className='text-duck-ink' size={21} /><p className='font-black text-duck-ink'>24 lessen</p></div>
          <p className='mt-3 text-sm font-semibold leading-relaxed text-duck-ink/60'>Kleine stappen met een vaste opbouw, zodat je niet te veel informatie tegelijk krijgt.</p>
        </div>
        <div className='rounded-[1.75rem] border border-duck-ink/15 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-3'><BarChart3 className='text-duck-ink' size={21} /><p className='font-black text-duck-ink'>{dataFlowCount} data-overgangen</p></div>
          <p className='mt-3 text-sm font-semibold leading-relaxed text-duck-ink/60'>Alleen getelde lesdata; geen verzonnen gebruiksmetingen of claims.</p>
        </div>
        <div className='rounded-[1.75rem] border border-duck-ink/15 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-3'><Clock3 className='text-duck-ink' size={21} /><p className='font-black text-duck-ink'>{totalMinutes} minuten totaal</p></div>
          <p className='mt-3 text-sm font-semibold leading-relaxed text-duck-ink/60'>De tijd is opgebouwd uit de geschatte duur van iedere afzonderlijke les.</p>
        </div>
      </section>

      <AcademyArchitectureMap />

      <section className='space-y-5'>
        <div>
          <p className='text-[10px] font-black uppercase tracking-[0.2em] text-duck-ink/50'>Leerroutes</p>
          <h3 className='mt-1 text-2xl font-black text-duck-ink'>Van basis naar kritische AI-review</h3>
          <p className='mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-duck-ink/55'>Open één route tegelijk. Zo houd je overzicht terwijl alle 24 lessen beschikbaar blijven.</p>
        </div>

        {ACADEMY_TRACKS.map((track) => {
          const trackLessons = ACADEMY_LESSONS.filter((lesson) => lesson.track === track.id);
          const completedInTrack = trackLessons.filter((lesson) => completedSet.has(lesson.id)).length;
          const trackPercentage = Math.round((completedInTrack / trackLessons.length) * 100);
          const nextTrackLesson = trackLessons.find((lesson) => !completedSet.has(lesson.id));
          const style = TRACK_STYLES[track.id];
          const isExpanded = expandedTrack === track.id;
          const lessonsId = `academy-track-${track.id}-lessons`;

          return (
            <article key={track.id} className={`rounded-[2rem] border p-5 shadow-sm md:p-7 ${style.panel}`}>
              <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex items-start gap-4'>
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${style.badge}`}>{style.icon}</div>
                  <div>
                    <p className='text-[10px] font-black uppercase tracking-[0.18em] text-duck-ink/45'>{track.subtitle}</p>
                    <h3 className='mt-1 text-xl font-black text-duck-ink'>{track.title}</h3>
                    <p className='mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-duck-ink/60'>{track.description}</p>
                    {nextTrackLesson && (
                      <p className='mt-3 text-xs font-black text-duck-ink/55'>Volgende: les {nextTrackLesson.number} · {nextTrackLesson.title}</p>
                    )}
                  </div>
                </div>

                <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                  <div className='min-w-[180px] rounded-2xl bg-white/75 p-4 ring-1 ring-duck-ink/10'>
                    <div className='flex items-center justify-between text-xs font-black text-duck-ink'>
                      <span>{completedInTrack}/{trackLessons.length}</span>
                      <span>{trackPercentage}%</span>
                    </div>
                    <div className='mt-3 h-2 overflow-hidden rounded-full bg-duck-ink/10'>
                      <div className='h-full rounded-full bg-duck-ink transition-all' style={{ width: `${trackPercentage}%` }} />
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => setExpandedTrack((current) => current === track.id ? null : track.id)}
                    aria-expanded={isExpanded}
                    aria-controls={lessonsId}
                    className='inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-duck-ink/15 bg-white px-5 text-sm font-black text-duck-ink shadow-sm hover:border-duck-ink/35'
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    {isExpanded ? 'Verberg lessen' : `Toon ${trackLessons.length} lessen`}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div id={lessonsId} className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                  {trackLessons.map((lesson) => {
                    const lessonIndex = ACADEMY_LESSONS.findIndex((item) => item.id === lesson.id);
                    const previousLesson = lessonIndex > 0 ? ACADEMY_LESSONS[lessonIndex - 1] : undefined;
                    const locked = Boolean(previousLesson && !completedSet.has(previousLesson.id));
                    return (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        completed={completedSet.has(lesson.id)}
                        locked={locked}
                        onSelect={() => onSelectLesson(lesson.id)}
                      />
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
