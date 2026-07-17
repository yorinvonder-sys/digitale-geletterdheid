import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'
import { ChapterMarker, Reveal, BrowserFrame, Marquee } from '../components/brand'

const PROMISES = [
  {
    title: 'SLO-ready',
    body: 'Elke missie is getagd met de SLO-conceptkerndoelen. Na de les wijs je aan wat er geleerd is — geen reconstructie achteraf.',
    icon: '◎',
  },
  {
    title: 'Docentproof',
    body: 'Een dashboard voor voortgang en signalen. Je ziet wie vastzit zonder rondje langs 29 tafels.',
    icon: '◉',
  },
  {
    title: 'Samen ingericht',
    body: 'Klas en route staan klaar vóór les één. De schoolpilot richten we op maat in met je team.',
    icon: '◈',
  },
  {
    title: 'Veilig',
    body: 'AVG-bewust, Microsoft 365-login en een AI Act-roadmap. ICT en privacy kunnen alles vooraf toetsen.',
    icon: '●',
  },
]

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to])
  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  )
}

const STATS = [
  { to: 20, suffix: '+', label: 'kant-en-klare AI-missies' },
  { to: 24, suffix: '', label: 'echte bouwprojecten' },
  { to: 9, suffix: '', label: 'SLO-kerndoelen in beeld' },
  { to: 10, suffix: '', label: 'werkdagen tot je live bent' },
]

const MISSIONS = [
  { name: 'Prompt Perfectionist', tag: 'Digitale vaardigheden', done: true },
  { name: 'Deepfake Detector', tag: 'Mediawijsheid', done: true },
  { name: 'Game Programmeur', tag: 'Computational thinking', done: false },
]

export function Meet() {
  return (
    <section id="ontmoeting" className="relative bg-paper grain">
      <div className="mx-auto max-w-6xl px-6 md:px-14 py-24 md:py-36">
        <ChapterMarker
          kicker="Hoofdstuk 1 · De ontmoeting"
          number="1"
          title={
            <>
              En toen verscheen <em className="italic text-transparent bg-clip-text bg-gradient-to-r from-ink to-ink/60">DGSkills</em>.
            </>
          }
        />

        <Reveal delay={0.15} className="mt-8 max-w-2xl">
          <p className="text-lg md:text-xl text-ink/70 leading-relaxed">
            Geen cursus, geen werkbladen-fabriek. <strong className="text-ink">Kant-en-klare AI-missies</strong>{' '}
            gekoppeld aan de SLO-kerndoelen. Leerlingen werken zelfstandig in een veilige leeromgeving —{' '}
            <strong className="text-ink">jij volgt de voortgang</strong>.
          </p>
        </Reveal>

        {/* mission library mock */}
        <Reveal delay={0.2} className="mt-14">
          <BrowserFrame url="dgskills.app/missies" className="max-w-3xl mx-auto -rotate-1">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-xl font-black">De missiebibliotheek</p>
              <span className="rounded-full bg-lime border-2 border-ink px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                Start in 1 klik
              </span>
            </div>
            <div className="space-y-2.5">
              {MISSIONS.map((m) => (
                <div
                  key={m.name}
                  className={`flex items-center justify-between rounded-xl border-2 border-ink px-4 py-3 ${
                    m.done ? 'bg-lime/70' : 'bg-paper'
                  }`}
                >
                  <span className="font-bold text-sm md:text-base">{m.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="hidden sm:inline rounded-full bg-ink text-paper px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {m.tag}
                    </span>
                    <span className="text-xs font-bold text-ink/60">{m.done ? '✓ geklaard' : '→ starten'}</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-ink/50 italic">
              “De AI-coach kijkt mee: start klein. Eén goede prompt is al werk genoeg.”
            </p>
          </BrowserFrame>
        </Reveal>

        {/* promises */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROMISES.map((c, i) => (
            <Reveal key={c.title} delay={0.08 * i}>
              <div className="group h-full rounded-2xl border-[3px] border-ink bg-white p-5 shadow-[5px_5px_0_0_rgba(23,20,14,1)] transition-transform hover:-translate-y-1 hover:rotate-[-0.5deg]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-lime border-2 border-ink text-xl">
                  {c.icon}
                </span>
                <h3 className="mt-4 font-display text-xl font-black">{c.title}</h3>
                <p className="mt-2 text-sm text-ink/65 leading-relaxed">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* stats */}
        <Reveal delay={0.1} className="mt-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 rounded-3xl border-[3px] border-ink bg-ink text-paper overflow-hidden">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`p-6 md:p-8 ${i % 2 === 1 ? 'border-l-2 border-paper/15' : ''} ${i > 1 ? 'border-t-2 lg:border-t-0 border-paper/15' : ''} ${i === 3 ? 'lg:border-l-2' : ''}`}
              >
                <p className="font-display text-5xl md:text-6xl font-black text-lime">
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-paper/65">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Marquee
        items={[
          'AI-geletterdheid',
          'Mediawijsheid',
          'Computational thinking',
          'Informatievaardigheden',
          'Online veiligheid',
          'Portfolio-bewijs',
          'SLO-kerndoelen',
        ]}
      />
    </section>
  )
}
