import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  GitBranch,
  Layers3,
  Network,
  RefreshCw,
  SplitSquareHorizontal,
  TableProperties,
} from 'lucide-react';
import type { AcademyVisualConfig, AcademyVisualNode } from './types';

const ACCENT_CLASSES: Record<NonNullable<AcademyVisualNode['accent']>, string> = {
  acid: 'border-duck-ink bg-duck-acid text-duck-ink',
  ink: 'border-duck-ink bg-duck-ink text-white',
  blue: 'border-blue-200 bg-blue-50 text-blue-950',
  teal: 'border-teal-200 bg-teal-50 text-teal-950',
  orange: 'border-orange-200 bg-orange-50 text-orange-950',
  purple: 'border-purple-200 bg-purple-50 text-purple-950',
};

function nodeClass(node: AcademyVisualNode): string {
  return ACCENT_CLASSES[node.accent ?? 'acid'];
}

function VisualHeader({ config, icon }: { config: AcademyVisualConfig; icon: React.ReactNode }) {
  return (
    <div className='mb-6 flex items-start gap-3'>
      <div className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-duck-ink text-duck-acid'>
        {icon}
      </div>
      <div>
        <p className='text-[10px] font-black uppercase tracking-[0.2em] text-duck-ink/50'>Visueel model</p>
        <h3 className='mt-1 text-xl font-black text-duck-ink'>{config.title}</h3>
        <p className='mt-1 text-sm font-medium leading-relaxed text-duck-ink/60'>{config.caption}</p>
      </div>
    </div>
  );
}

function NodeCard({ node, index }: { node: AcademyVisualNode; index?: number }) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${nodeClass(node)}`}>
      {typeof index === 'number' && (
        <span className='mb-3 flex size-8 items-center justify-center rounded-full bg-white/80 text-xs font-black text-duck-ink ring-1 ring-duck-ink/10'>
          {index + 1}
        </span>
      )}
      <p className='font-black'>{node.label}</p>
      <p className='mt-2 text-sm font-semibold leading-relaxed opacity-70'>{node.detail}</p>
      {node.children && node.children.length > 0 && (
        <div className='mt-4 flex flex-wrap gap-2'>
          {node.children.map((child) => (
            <span key={child} className='rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-duck-ink ring-1 ring-duck-ink/10'>
              {child}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function FlowVisual({ config }: { config: AcademyVisualConfig }) {
  return (
    <div>
      <VisualHeader config={config} icon={<Network size={22} />} />
      <div className='grid gap-3 lg:grid-cols-[repeat(var(--node-count),minmax(0,1fr))]' style={{ '--node-count': config.nodes.length } as React.CSSProperties}>
        {config.nodes.map((node, index) => (
          <React.Fragment key={`${node.label}-${index}`}>
            <NodeCard node={node} index={index} />
            {index < config.nodes.length - 1 && (
              <div className='flex items-center justify-center text-duck-ink/35 lg:hidden'>
                <ArrowDown size={22} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {config.nodes.length > 1 && (
        <div className='mt-3 hidden items-center justify-around px-12 text-duck-ink/25 lg:flex' aria-hidden='true'>
          {config.nodes.slice(1).map((node, index) => <ArrowRight key={`${node.label}-${index}`} size={22} />)}
        </div>
      )}
    </div>
  );
}

export function TreeVisual({ config }: { config: AcademyVisualConfig }) {
  const [root, ...branches] = config.nodes;
  return (
    <div>
      <VisualHeader config={config} icon={<GitBranch size={22} />} />
      <div className='mx-auto max-w-3xl'>
        {root && <div className='mx-auto max-w-md'><NodeCard node={root} /></div>}
        {branches.length > 0 && (
          <>
            <div className='mx-auto h-7 w-px bg-duck-ink/25' />
            <div className='relative grid gap-4 md:grid-cols-2'>
              <div className='absolute left-1/4 right-1/4 top-0 hidden h-px bg-duck-ink/25 md:block' aria-hidden='true' />
              {branches.map((node, index) => (
                <div key={`${node.label}-${index}`} className='relative pt-4'>
                  <div className='absolute left-1/2 top-0 h-4 w-px bg-duck-ink/25' aria-hidden='true' />
                  <NodeCard node={node} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function LayersVisual({ config }: { config: AcademyVisualConfig }) {
  return (
    <div>
      <VisualHeader config={config} icon={<Layers3 size={22} />} />
      <div className='mx-auto max-w-3xl space-y-3'>
        {config.nodes.map((node, index) => (
          <div key={`${node.label}-${index}`} className='relative'>
            <NodeCard node={node} index={index} />
            {index < config.nodes.length - 1 && (
              <div className='flex h-8 items-center justify-center text-duck-ink/30' aria-hidden='true'>
                <ArrowDown size={20} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataVisual({ config }: { config: AcademyVisualConfig }) {
  return (
    <div>
      <VisualHeader config={config} icon={<TableProperties size={22} />} />
      <div className='overflow-hidden rounded-3xl border border-duck-ink/15 bg-white'>
        {config.nodes.map((node, index) => (
          <div key={`${node.label}-${index}`} className={`grid gap-3 p-4 md:grid-cols-[48px_1fr_1.5fr] md:items-center ${index > 0 ? 'border-t border-duck-ink/10' : ''}`}>
            <span className={`flex size-10 items-center justify-center rounded-2xl border text-xs font-black ${nodeClass(node)}`}>{index + 1}</span>
            <p className='font-black text-duck-ink'>{node.label}</p>
            <div>
              <p className='text-sm font-semibold leading-relaxed text-duck-ink/65'>{node.detail}</p>
              {node.children && (
                <div className='mt-2 flex flex-wrap gap-2'>
                  {node.children.map((child) => <span key={child} className='rounded-full bg-duck-bgLight px-3 py-1 text-xs font-bold text-duck-ink'>{child}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComparisonVisual({ config }: { config: AcademyVisualConfig }) {
  return (
    <div>
      <VisualHeader config={config} icon={<SplitSquareHorizontal size={22} />} />
      <div className={`grid gap-4 ${config.nodes.length > 2 ? 'lg:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-2'}`}>
        {config.nodes.map((node, index) => <NodeCard key={`${node.label}-${index}`} node={node} />)}
      </div>
    </div>
  );
}

export function CycleVisual({ config }: { config: AcademyVisualConfig }) {
  return (
    <div>
      <VisualHeader config={config} icon={<RefreshCw size={22} />} />
      <div className='relative grid gap-3 md:grid-cols-2 xl:grid-cols-5'>
        {config.nodes.map((node, index) => (
          <div key={`${node.label}-${index}`} className='relative'>
            <NodeCard node={node} index={index} />
            {index < config.nodes.length - 1 && (
              <div className='flex h-8 items-center justify-center text-duck-ink/30 xl:absolute xl:-right-5 xl:top-1/2 xl:h-auto xl:-translate-y-1/2' aria-hidden='true'>
                <ArrowDown className='xl:hidden' size={20} />
                <ArrowRight className='hidden xl:block' size={20} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='mt-4 flex items-center justify-center gap-2 rounded-2xl bg-duck-bgLight px-4 py-3 text-xs font-bold text-duck-ink/60'>
        <RefreshCw size={15} />
        Na de laatste stap kan nieuwe invoer de cyclus opnieuw starten.
      </div>
    </div>
  );
}

export function AcademyVisual({ config }: { config: AcademyVisualConfig }) {
  return (
    <section className='rounded-[2rem] border border-duck-ink/15 bg-gradient-to-br from-white to-duck-bgLight p-5 shadow-sm md:p-8'>
      {config.kind === 'flow' && <FlowVisual config={config} />}
      {config.kind === 'tree' && <TreeVisual config={config} />}
      {config.kind === 'layers' && <LayersVisual config={config} />}
      {config.kind === 'data' && <DataVisual config={config} />}
      {config.kind === 'comparison' && <ComparisonVisual config={config} />}
      {config.kind === 'cycle' && <CycleVisual config={config} />}
    </section>
  );
}
