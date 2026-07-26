import React, { useState } from 'react';
import {
  AppWindow,
  ArrowDown,
  Braces,
  ChevronDown,
  ChevronUp,
  Database,
  FolderTree,
  Monitor,
  Route,
  ShieldCheck,
} from 'lucide-react';

const ARCHITECTURE_STEPS = [
  {
    label: 'Browser',
    file: 'index.html',
    detail: 'Laadt de pagina en biedt het root-element.',
    icon: Monitor,
  },
  {
    label: 'React start',
    file: 'src/main.tsx',
    detail: 'Maakt de React-root en rendert App.',
    icon: Braces,
  },
  {
    label: 'Routekeuze',
    file: 'src/app/AppRouter.tsx',
    detail: 'Kiest openbaar, login of de ingelogde app.',
    icon: Route,
  },
  {
    label: 'App-shell',
    file: 'src/app/AuthenticatedApp.tsx',
    detail: 'Combineert gebruiker, rol en actieve module.',
    icon: AppWindow,
  },
  {
    label: 'Feature',
    file: 'src/features/...',
    detail: 'Toont dashboard, missie, profiel of beheeromgeving.',
    icon: FolderTree,
  },
  {
    label: 'Data en rechten',
    file: 'src/services/... → Supabase',
    detail: 'Leest of schrijft data binnen auth- en RLS-grenzen.',
    icon: Database,
  },
];

export function AcademyArchitectureMap() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className='overflow-hidden rounded-[2rem] border border-duck-ink/15 bg-white shadow-sm'>
      <div className='flex flex-col gap-4 border-b border-duck-ink/10 p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex items-start gap-3'>
          <div className='flex size-12 shrink-0 items-center justify-center rounded-2xl bg-duck-acid text-duck-ink'>
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-duck-ink/50'>Grote kaart</p>
            <h3 className='mt-1 text-xl font-black text-duck-ink'>Zo reist een gebruikersactie door DGskills</h3>
            <p className='mt-2 max-w-3xl text-sm font-medium leading-relaxed text-duck-ink/60'>
              Gebruik deze kaart als vaste oriëntatie. Niet iedere actie raakt alle lagen, maar de volgorde helpt bepalen waar je moet zoeken.
            </p>
          </div>
        </div>
        <button
          type='button'
          onClick={() => setExpanded((value) => !value)}
          className='inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-duck-ink/15 bg-duck-bgLight px-4 text-sm font-black text-duck-ink'
          aria-expanded={expanded}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          {expanded ? 'Minder uitleg' : 'Toon extra uitleg'}
        </button>
      </div>

      <div className='grid gap-0 p-5 md:p-8 lg:grid-cols-6'>
        {ARCHITECTURE_STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.label}>
              <div className='relative rounded-3xl border border-duck-ink/15 bg-duck-bgLight p-4 lg:min-h-[210px]'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex size-10 items-center justify-center rounded-2xl bg-duck-ink text-duck-acid'>
                    <Icon size={20} />
                  </div>
                  <span className='text-xs font-black text-duck-ink/35'>{index + 1}</span>
                </div>
                <p className='mt-4 font-black text-duck-ink'>{step.label}</p>
                <p className='mt-2 rounded-xl bg-white px-3 py-2 font-mono text-[11px] font-bold text-duck-ink'>{step.file}</p>
                {expanded && <p className='mt-3 text-sm font-semibold leading-relaxed text-duck-ink/60'>{step.detail}</p>}
              </div>
              {index < ARCHITECTURE_STEPS.length - 1 && (
                <div className='flex h-8 items-center justify-center text-duck-ink/25 lg:absolute lg:hidden' aria-hidden='true'>
                  <ArrowDown size={20} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className='border-t border-duck-ink/10 bg-duck-bgLight px-6 py-4 text-sm font-semibold leading-relaxed text-duck-ink/65 md:px-8'>
        <strong className='text-duck-ink'>Leesstrategie:</strong> begin bij wat de gebruiker ziet, zoek de featurecomponent, volg imports naar hooks en services en controleer daarna pas de database of externe API.
      </div>
    </section>
  );
}
