import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookCheck,
  Check,
  CheckCircle2,
  Circle,
  Clipboard,
  Clock3,
  Code2,
  Copy,
  Database,
  FileCode2,
  Lightbulb,
  Sparkles,
  Target,
} from 'lucide-react';
import { ACADEMY_TRACKS } from './academyContent';
import { AcademyVisual } from './AcademyVisual';
import type { AcademyLesson } from './types';

interface AcademyLessonViewProps {
  lesson: AcademyLesson;
  isCompleted: boolean;
  onComplete: () => void;
  onBack: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

function CodePanel({ file, code }: { file: string; code: string }) {
  const lines = code.split('\n');
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className='overflow-hidden rounded-[2rem] border border-duck-ink/15 bg-white shadow-sm'>
      <div className='flex flex-col gap-3 border-b border-duck-ink/10 p-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex size-10 items-center justify-center rounded-2xl bg-duck-ink text-duck-acid'><FileCode2 size={20} /></div>
          <div>
            <p className='text-[10px] font-black uppercase tracking-[0.18em] text-duck-ink/45'>Echte plek in DGskills</p>
            <p className='mt-1 break-all font-mono text-xs font-bold text-duck-ink'>{file}</p>
          </div>
        </div>
        <button type='button' onClick={() => void copyCode()} className='inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-duck-ink/15 bg-duck-bgLight px-4 text-xs font-black text-duck-ink'>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Gekopieerd' : 'Kopieer code'}
        </button>
      </div>
      <div className='overflow-x-auto bg-[#111827] py-5'>
        <pre className='min-w-max text-xs leading-6 text-slate-100'>
          {lines.map((line, index) => (
            <div key={`${line}-${index}`} className='grid grid-cols-[48px_1fr] px-4 hover:bg-white/5'>
              <span className='select-none pr-4 text-right text-slate-500'>{index + 1}</span>
              <code className='pr-6'>{line || ' '}</code>
            </div>
          ))}
        </pre>
      </div>
    </section>
  );
}

export function AcademyLessonView({
  lesson,
  isCompleted,
  onComplete,
  onBack,
  onPrevious,
  onNext,
}: AcademyLessonViewProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [practiceChecks, setPracticeChecks] = useState<boolean[]>(() => lesson.practice.checklist.map(() => false));
  const [promptCopied, setPromptCopied] = useState(false);
  const answerIsCorrect = selectedAnswer === lesson.quiz.correctIndex;
  const track = useMemo(() => ACADEMY_TRACKS.find((item) => item.id === lesson.track), [lesson.track]);
  const checkedPracticeCount = practiceChecks.filter(Boolean).length;

  useEffect(() => {
    setSelectedAnswer(null);
    setPracticeChecks(lesson.practice.checklist.map(() => false));
    setPromptCopied(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id, lesson.practice.checklist]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(lesson.aiPrompt);
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 1600);
    } catch {
      setPromptCopied(false);
    }
  }

  return (
    <div className='space-y-7 animate-in fade-in slide-in-from-bottom-3 duration-300'>
      <button type='button' onClick={onBack} className='inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-bold text-duck-ink/65 hover:bg-white hover:text-duck-ink'>
        <ArrowLeft size={17} /> Alle lessen
      </button>

      <section className='overflow-hidden rounded-[2.25rem] bg-duck-ink text-white shadow-duck-soft'>
        <div className='grid gap-7 p-6 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center'>
          <div>
            <div className='flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]'>
              <span className='rounded-full bg-duck-acid px-3 py-1 text-duck-ink'>Les {lesson.number}</span>
              <span className='text-white/55'>{track?.title}</span>
              <span className='inline-flex items-center gap-1 text-white/55'><Clock3 size={13} /> {lesson.durationMinutes} min</span>
            </div>
            <h2 className='mt-5 max-w-4xl text-3xl font-black tracking-tight md:text-5xl'>{lesson.title}</h2>
            <p className='mt-3 text-lg font-bold text-duck-acid'>{lesson.subtitle}</p>
            <div className='mt-6 flex max-w-3xl items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10'>
              <Target className='mt-0.5 shrink-0 text-duck-acid' size={20} />
              <div>
                <p className='text-[10px] font-black uppercase tracking-[0.18em] text-white/45'>Leerdoel</p>
                <p className='mt-1 text-sm font-semibold leading-relaxed text-white/80'>{lesson.objective}</p>
              </div>
            </div>
          </div>
          <div className='flex size-24 items-center justify-center rounded-[2rem] bg-duck-acid text-duck-ink'>
            <Code2 size={44} />
          </div>
        </div>
      </section>

      <section className='grid gap-4 lg:grid-cols-[1.4fr_0.8fr]'>
        <div className='rounded-[2rem] border border-duck-ink/15 bg-white p-6 shadow-sm md:p-8'>
          <div className='flex items-center gap-3'><BookCheck size={22} /><h3 className='text-xl font-black text-duck-ink'>Uitleg</h3></div>
          <div className='mt-5 space-y-4'>
            {lesson.explanation.map((paragraph) => <p key={paragraph} className='text-sm font-medium leading-7 text-duck-ink/70'>{paragraph}</p>)}
          </div>
        </div>
        <div className='rounded-[2rem] border border-duck-ink bg-duck-acid p-6 shadow-sm md:p-8'>
          <div className='flex items-center gap-3'><Sparkles size={22} /><h3 className='font-black text-duck-ink'>Waarom dit ertoe doet</h3></div>
          <p className='mt-4 text-sm font-bold leading-7 text-duck-ink/75'>{lesson.whyItMatters}</p>
          <div className='mt-6 rounded-2xl bg-white/70 p-4'>
            <p className='text-[10px] font-black uppercase tracking-[0.18em] text-duck-ink/45'>Onthoudzin</p>
            <p className='mt-2 text-lg font-black leading-snug text-duck-ink'>{lesson.remember}</p>
          </div>
        </div>
      </section>

      <AcademyVisual config={lesson.visual} />

      <section className='grid gap-5 xl:grid-cols-[1fr_1.2fr]'>
        <div className='rounded-[2rem] border border-duck-ink/15 bg-white p-6 shadow-sm md:p-8'>
          <div className='flex items-center gap-3'><Lightbulb size={22} /><h3 className='text-xl font-black text-duck-ink'>Begrippen</h3></div>
          <div className='mt-5 space-y-3'>
            {lesson.concepts.map((concept) => (
              <article key={concept.term} className='rounded-2xl border border-duck-ink/10 bg-duck-bgLight p-4'>
                <h4 className='font-black text-duck-ink'>{concept.term}</h4>
                <p className='mt-2 text-sm font-semibold leading-relaxed text-duck-ink/65'>{concept.meaning}</p>
                <p className='mt-3 rounded-xl bg-white px-3 py-2 font-mono text-xs font-bold text-duck-ink'>{concept.example}</p>
              </article>
            ))}
          </div>
        </div>
        <CodePanel file={lesson.file} code={lesson.code} />
      </section>

      <section className='overflow-hidden rounded-[2rem] border border-duck-ink/15 bg-white shadow-sm'>
        <div className='flex items-center gap-3 border-b border-duck-ink/10 p-6 md:px-8'>
          <Database size={22} />
          <div>
            <h3 className='text-xl font-black text-duck-ink'>Datareis</h3>
            <p className='mt-1 text-sm font-medium text-duck-ink/55'>Welke informatie gaat waarheen en waarom?</p>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-[760px] w-full text-left text-sm'>
            <thead className='bg-duck-bgLight text-[10px] font-black uppercase tracking-[0.16em] text-duck-ink/50'>
              <tr><th className='px-6 py-4'>Van</th><th className='px-6 py-4'>Naar</th><th className='px-6 py-4'>Data</th><th className='px-6 py-4'>Waarom</th></tr>
            </thead>
            <tbody>
              {lesson.dataFlow.map((row, index) => (
                <tr key={`${row.from}-${row.to}-${index}`} className='border-t border-duck-ink/10 align-top'>
                  <td className='px-6 py-4 font-black text-duck-ink'>{row.from}</td>
                  <td className='px-6 py-4 font-black text-duck-ink'>{row.to}</td>
                  <td className='px-6 py-4 font-mono text-xs font-bold text-duck-ink/70'>{row.data}</td>
                  <td className='px-6 py-4 font-medium leading-relaxed text-duck-ink/65'>{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className='grid gap-5 lg:grid-cols-2'>
        <div className='rounded-[2rem] border border-orange-200 bg-orange-50 p-6 shadow-sm md:p-8'>
          <div className='flex items-center gap-3 text-orange-950'><AlertTriangle size={22} /><h3 className='text-xl font-black'>Wat kan misgaan?</h3></div>
          <ul className='mt-5 space-y-3'>
            {lesson.pitfalls.map((pitfall) => (
              <li key={pitfall} className='flex items-start gap-3 rounded-2xl bg-white/75 p-4 text-sm font-semibold leading-relaxed text-orange-950/75'>
                <AlertTriangle className='mt-0.5 shrink-0' size={17} /> {pitfall}
              </li>
            ))}
          </ul>
        </div>

        <div className='rounded-[2rem] border border-teal-200 bg-teal-50 p-6 shadow-sm md:p-8'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-3 text-teal-950'><Clipboard size={22} /><h3 className='text-xl font-black'>Praktijkcontrole</h3></div>
            <span className='rounded-full bg-white px-3 py-1 text-xs font-black text-teal-950 ring-1 ring-teal-200'>{checkedPracticeCount}/{lesson.practice.checklist.length}</span>
          </div>
          <h4 className='mt-5 font-black text-teal-950'>{lesson.practice.title}</h4>
          <p className='mt-2 text-sm font-semibold leading-relaxed text-teal-950/70'>{lesson.practice.instruction}</p>
          <div className='mt-5 space-y-2'>
            {lesson.practice.checklist.map((item, index) => {
              const checked = practiceChecks[index];
              return (
                <button
                  type='button'
                  key={item}
                  onClick={() => setPracticeChecks((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))}
                  className={`flex min-h-[48px] w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition-colors ${checked ? 'border-teal-700 bg-teal-900 text-white' : 'border-teal-200 bg-white text-teal-950 hover:border-teal-500'}`}
                >
                  {checked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className='rounded-[2rem] border border-purple-200 bg-purple-50 p-6 shadow-sm md:p-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3 text-purple-950'><Sparkles size={22} /><h3 className='text-xl font-black'>Prompt voor AI</h3></div>
          <button type='button' onClick={() => void copyPrompt()} className='inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-purple-950 px-4 text-xs font-black text-white'>
            {promptCopied ? <Check size={15} /> : <Copy size={15} />}
            {promptCopied ? 'Gekopieerd' : 'Kopieer prompt'}
          </button>
        </div>
        <p className='mt-3 text-sm font-semibold leading-relaxed text-purple-950/65'>Gebruik deze prompt wanneer je dit onderwerp met AI in de echte repository onderzoekt.</p>
        <pre className='mt-5 whitespace-pre-wrap rounded-2xl bg-white p-5 text-sm font-semibold leading-7 text-purple-950 ring-1 ring-purple-200'>{lesson.aiPrompt}</pre>
      </section>

      <section className='rounded-[2rem] border border-duck-ink/15 bg-white p-6 shadow-sm md:p-8'>
        <div className='flex items-center gap-3'><CheckCircle2 size={23} /><h3 className='text-xl font-black text-duck-ink'>Kennischeck</h3></div>
        <p className='mt-5 font-black text-duck-ink'>{lesson.quiz.question}</p>
        <div className='mt-4 grid gap-3'>
          {lesson.quiz.options.map((option, index) => {
            const selected = selectedAnswer === index;
            const correct = selected && index === lesson.quiz.correctIndex;
            const wrong = selected && !correct;
            return (
              <button
                type='button'
                key={option}
                onClick={() => setSelectedAnswer(index)}
                className={`flex min-h-[52px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition-colors ${correct ? 'border-green-600 bg-green-50 text-green-950' : wrong ? 'border-red-500 bg-red-50 text-red-950' : selected ? 'border-duck-ink bg-duck-bgLight text-duck-ink' : 'border-duck-ink/15 text-duck-ink hover:border-duck-ink/40 hover:bg-duck-bgLight'}`}
              >
                {correct ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                {option}
              </button>
            );
          })}
        </div>
        {selectedAnswer !== null && (
          <div className={`mt-5 rounded-2xl p-4 text-sm font-semibold leading-relaxed ${answerIsCorrect ? 'bg-green-50 text-green-950' : 'bg-red-50 text-red-950'}`}>
            {answerIsCorrect ? 'Goed. ' : 'Nog niet. '}{lesson.quiz.explanation}
          </div>
        )}
        <button
          type='button'
          disabled={!answerIsCorrect}
          onClick={onComplete}
          className='mt-5 inline-flex min-h-[50px] items-center gap-2 rounded-full bg-duck-ink px-6 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-35'
        >
          {isCompleted ? <Check size={17} /> : <BookCheck size={17} />}
          {isCompleted ? 'Les afgerond' : 'Rond deze les af'}
        </button>
      </section>

      <div className='flex items-center justify-between gap-3'>
        <button type='button' disabled={!onPrevious} onClick={onPrevious} className='inline-flex min-h-[46px] items-center gap-2 rounded-full border border-duck-ink/15 bg-white px-4 text-sm font-bold text-duck-ink disabled:opacity-30'>
          <ArrowLeft size={17} /> Vorige
        </button>
        <button type='button' disabled={!onNext} onClick={onNext} className='inline-flex min-h-[46px] items-center gap-2 rounded-full bg-duck-acid px-5 text-sm font-black text-duck-ink disabled:opacity-30'>
          Volgende <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
