import { useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import { Pill, BrowserFrame } from '../components/brand'

const BEATS = [
  { id: 'ontdek', kicker: 'Ontdek', title: 'Mila kiest haar route.', body: 'Geen rondleiding, geen uitlegscherm. Ze ziet direct welke missies er liggen — en welke SLO-doelen daarbij horen.' },
  { id: 'leer', kicker: 'Leer', title: 'Korte challenges, directe feedback.', body: 'Echte tools, en de AI-coach kijkt mee. Mila hoeft niet te raden of ze het goed doet.' },
  { id: 'maak', kicker: 'Maak', title: 'Dan: projectmodus.', body: 'Een platformer bouwen, een robotroute ontwerpen. Echte projecten, geen nagebootste oefeningen.' },
  { id: 'bewijs', kicker: 'Bewijs', title: 'Trofeeën en XP.', body: 'Levels en badges die ze zélf wil laten zien. Motivatie hoef je niet af te dwingen.' },
  { id: 'groei', kicker: 'Groei', title: 'Alles landt in haar portfolio.', body: 'Wat ze maakte én welke keuzes ze maakte — zichtbaar als bewijs. Niet in een excelbestand van de docent.' },
]

/* ------------------------------ beat visuals ------------------------------ */

function VisualOntdek() {
  const missions = [
    { n: 'Prompt Perfectionist', t: 'Digitale vaardigheden', state: 'starten', hot: true },
    { n: 'Deepfake Detector', t: 'Mediawijsheid', state: 'slot' },
    { n: 'Game Programmeur', t: 'Computational thinking', state: 'slot' },
  ]
  return (
    <BrowserFrame url="dgskills.app/route" className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-ink/50 font-bold">Mijn route</p>
          <p className="font-display text-xl font-black">Goedemorgen, Mila</p>
        </div>
        <span className="rounded-full border-2 border-ink bg-ink text-lime px-3 py-1 text-xs font-bold">1.840 XP</span>
      </div>
      <div className="mt-4 space-y-2">
        {missions.map((m, i) => (
          <motion.div
            key={m.n}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.15 }}
            className={`flex items-center justify-between rounded-xl border-2 border-ink px-4 py-3 ${
              m.hot ? 'bg-lime' : 'bg-paper'
            }`}
          >
            <div>
              <p className="font-bold text-sm">{m.n}</p>
              <p className="text-[11px] text-ink/60">{m.t}</p>
            </div>
            <span className="text-xs font-bold">{m.hot ? '▶ start' : '🔒'}</span>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-4 rounded-lg bg-ink text-paper text-xs px-3 py-2"
      >
        <span className="text-lime font-bold">20+ AI-missies klaar.</span> Route gekozen — dat was al het lastigste.
      </motion.p>
    </BrowserFrame>
  )
}

function VisualLeer() {
  return (
    <BrowserFrame url="dgskills.app/missie/prompt" className="w-full">
      <p className="text-[11px] font-bold uppercase tracking-widest text-ink/50">Missie 01 · Prompt Perfectionist</p>
      <p className="mt-1 font-bold text-sm md:text-base">
        Opdracht: laat de AI een verjaardagskaart ontwerpen.
      </p>
      <div className="mt-4 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-ink text-paper px-4 py-2.5 text-sm"
        >
          maak een kaart voor opa
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm border-2 border-ink bg-paper px-4 py-2.5 text-sm"
        >
          <span className="font-bold text-lime-deep">AI-coach:</span> Goed begin! Maar vaag. Voor welke gelegenheid, welke stijl, welke tekst?
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-ink text-paper px-4 py-2.5 text-sm"
        >
          Een verjaardagskaart voor mijn opa van 70, met een zeilboot en de tekst: “Fijne verjaardag, kapitein!”
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.7, type: 'spring', bounce: 0.5 }}
          className="w-fit rounded-full border-2 border-ink bg-lime px-4 py-2 text-sm font-bold"
        >
          Precies! Sterke prompt · +25 XP
        </motion.div>
      </div>
    </BrowserFrame>
  )
}

function VisualMaak() {
  return (
    <BrowserFrame url="dgskills.app/bouw/game" className="w-full" dark>
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-black">Bouw je game</p>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-full bg-lime text-ink px-3 py-1 text-xs font-bold"
        >
          Test je game ▶
        </motion.span>
      </div>
      {/* tiny platformer scene */}
      <div className="relative mt-4 h-36 rounded-xl border-2 border-paper/20 bg-ink overflow-hidden">
        <motion.div
          className="absolute bottom-6 left-6 h-6 w-6 rounded-md bg-lime border-2 border-ink"
          animate={{ x: [0, 90, 160, 220], y: [0, -34, 0, -8] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute bottom-0 left-0 h-4 w-[38%] bg-paper/25" />
        <div className="absolute bottom-0 left-[46%] h-4 w-[20%] bg-paper/25" />
        <div className="absolute bottom-0 left-[74%] h-4 w-[26%] bg-paper/25" />
        <div className="absolute bottom-10 right-8 h-3 w-14 bg-paper/15 rounded-sm" />
        <span className="absolute top-2 right-3 text-[10px] uppercase tracking-widest text-paper/40">live test</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {[
          { label: 'Snelheid', v: 65 },
          { label: 'Gat-grootte', v: 40 },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-xs text-paper/70 mb-1.5">
              <span>{s.label}</span>
              <span className="font-bold text-lime">{s.v}</span>
            </div>
            <div className="h-2 rounded-full bg-paper/15">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.v}%` }}
                transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full bg-lime"
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-paper/50">Eén van 24 bouwprojecten. Hier willen leerlingen mee thuiskomen.</p>
    </BrowserFrame>
  )
}

function VisualBewijs() {
  const badges = ['Doorzetter', 'Maker', 'Factchecker']
  return (
    <BrowserFrame url="dgskills.app/voortgang" className="w-full">
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#17140e" strokeOpacity="0.1" strokeWidth="10" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none" stroke="#b8dd00" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * 0.28 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-black">72%</span>
            <span className="text-[10px] uppercase tracking-widest text-ink/50">Periode 1</span>
          </div>
        </div>
        <div>
          <p className="font-display text-xl font-black">Mila</p>
          <p className="text-sm text-ink/60">Level 6 · Creator</p>
          <p className="mt-2 inline-block rounded-full border-2 border-ink bg-paper px-3 py-1 text-xs font-bold">
            🔥 12 dagen streak
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {badges.map((b, i) => (
          <motion.span
            key={b}
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4 + i * 0.18, type: 'spring', bounce: 0.55 }}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-lime px-3.5 py-1.5 text-xs font-bold"
          >
            ★ {b}
          </motion.span>
        ))}
      </div>
    </BrowserFrame>
  )
}

function VisualGroei() {
  const items = [
    { n: 'Mijn eigen mini-game', t: 'Code & Bouw', xp: '+120 XP' },
    { n: 'Deepfake-checklist', t: 'Mediawijsheid', xp: '+90 XP' },
  ]
  return (
    <BrowserFrame url="dgskills.app/portfolio/mila" className="w-full">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-black">Portfolio — Mila</p>
        <span className="text-xs text-ink/60">Level 6 · 1.840 XP · 4 projecten</span>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((it, i) => (
          <motion.div
            key={it.n}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.15 }}
            className="flex items-center justify-between rounded-xl border-2 border-ink bg-paper px-4 py-3"
          >
            <div>
              <p className="font-bold text-sm">{it.n}</p>
              <p className="text-[11px] text-ink/60">{it.t}</p>
            </div>
            <span className="rounded-full bg-lime border-2 border-ink px-2.5 py-0.5 text-xs font-bold">{it.xp}</span>
          </motion.div>
        ))}
      </div>
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 rounded-xl border-l-4 border-lime-deep bg-paper-soft px-4 py-3 text-sm italic text-ink/75"
      >
        “Ik heb mijn game drie keer verbeterd na feedback — de besturing is nu veel soepeler.”
      </motion.blockquote>
    </BrowserFrame>
  )
}

const VISUALS = [VisualOntdek, VisualLeer, VisualMaak, VisualBewijs, VisualGroei]

/* --------------------------------- section --------------------------------- */

export function StudentJourney() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [beat, setBeat] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(BEATS.length - 1, Math.max(0, Math.floor(v * BEATS.length)))
    if (idx !== beat) setBeat(idx)
  })

  const Active = VISUALS[beat]

  return (
    <section id="mila" ref={ref} className="relative h-[560vh] bg-paper-soft grain">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 md:px-14 pt-20 md:pt-24">
          <Pill>Hoofdstuk 2 · Mila, leerjaar 2</Pill>
          <div className="flex items-center gap-1.5">
            {BEATS.map((b, i) => (
              <span
                key={b.id}
                className={`h-2 rounded-full border border-ink transition-all duration-300 ${
                  i === beat ? 'w-8 bg-lime' : i < beat ? 'w-2 bg-ink' : 'w-2 bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 grid lg:grid-cols-[1fr_1.1fr] items-center gap-6 lg:gap-12 px-6 md:px-14 py-6 max-w-7xl w-full mx-auto">
          {/* narrative */}
          <div className="relative min-h-[180px] md:min-h-[210px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={beat}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -26 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-block rounded-full border-2 border-ink bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em]">
                  {String(beat + 1).padStart(2, '0')} / 05 · {BEATS[beat].kicker}
                </span>
                <h3 className="mt-3 md:mt-5 font-display text-2xl sm:text-3xl md:text-5xl font-black leading-[1.05]">
                  {BEATS[beat].title}
                </h3>
                <p className="mt-2 md:mt-4 max-w-md text-sm md:text-lg text-ink/70 leading-relaxed">
                  {BEATS[beat].body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* visual */}
          <div className="relative scale-[0.88] sm:scale-95 lg:scale-100 origin-top lg:origin-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={beat}
                initial={{ opacity: 0, y: 40, rotate: 1.5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -40, rotate: -1.5 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Active />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="px-6 md:px-14 pb-7 text-xs uppercase tracking-[0.25em] text-ink/40">
          Blijf scrollen — Mila doet de rest
        </p>
      </div>
    </section>
  )
}
