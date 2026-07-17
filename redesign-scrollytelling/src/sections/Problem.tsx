import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { Pill } from '../components/brand'

const NOTES = [
  { text: '19× “wachtwoord vergeten”', r: -6, x: '6%', y: '12%', t: 0.1 },
  { text: '5 leerlingen kijken YouTube', r: 4, x: '46%', y: '6%', t: 0.17 },
  { text: 'voortgang in tab 7 van 12', r: -3, x: '12%', y: '52%', t: 0.24 },
  { text: 'werkblad kwijt. weer.', r: 7, x: '52%', y: '44%', t: 0.31 },
  { text: '“juf, het doet het niet”', r: -8, x: '30%', y: '30%', t: 0.38 },
  { text: 'licentie verlopen?!', r: 5, x: '58%', y: '62%', t: 0.45 },
]

function ChaosNote({ n, p }: { n: (typeof NOTES)[number]; p: MotionValue<number> }) {
  const opacity = useTransform(p, [n.t, n.t + 0.06, 0.72, 0.82], [0, 1, 1, 0])
  const y = useTransform(p, [n.t, n.t + 0.06, 0.72, 0.86], [40, 0, 0, 220])
  const rotate = useTransform(p, [0.72, 0.86], [n.r, n.r * 3])
  return (
    <motion.div
      style={{ opacity, y, rotate, left: n.x, top: n.y }}
      className="absolute w-36 md:w-52 rounded-lg border-2 border-ink bg-[#fff8d6] p-2.5 md:p-3 shadow-[4px_4px_0_0_rgba(0,0,0,0.55)]"
    >
      <p className="text-xs md:text-sm font-bold text-ink/80">{n.text}</p>
    </motion.div>
  )
}

export function Problem() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const beatAop = useTransform(p, [0, 0.06, 0.3, 0.4], [0, 1, 1, 0])
  const beatAy = useTransform(p, [0, 0.06, 0.3, 0.4], [30, 0, 0, -40])
  const beatBop = useTransform(p, [0.34, 0.42, 0.62, 0.72], [0, 1, 1, 0])
  const beatBy = useTransform(p, [0.34, 0.42, 0.62, 0.72], [30, 0, 0, -40])
  const beatCop = useTransform(p, [0.76, 0.86], [0, 1])
  const beatCy = useTransform(p, [0.76, 0.9], [60, 0])
  const limeScale = useTransform(p, [0.9, 0.97], [0, 1])
  const [time, setTime] = useState('8:07')
  useMotionValueEvent(p, 'change', (v) => {
    const mins = Math.max(7, Math.min(58, Math.round(7 + v * 51)))
    setTime(`8:${String(mins).padStart(2, '0')}`)
  })

  return (
    <section id="probleem" ref={ref} className="relative h-[340vh] bg-ink text-paper grain">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* clock */}
        <div className="flex items-center justify-between px-6 md:px-14 pt-20 md:pt-24">
          <Pill dark>Hoofdstuk 1 · Het probleem</Pill>
          <div className="rounded-full border-2 border-paper/25 px-4 py-1.5 font-display text-lg font-bold text-paper/80 tabular-nums">
            maandag <span>{time}</span>
          </div>
        </div>

        <div className="relative flex-1 grid lg:grid-cols-2 items-center gap-8 px-6 md:px-14">
          {/* text beats */}
          <div className="relative h-[280px] md:h-[380px]">
            <motion.div style={{ opacity: beatAop, y: beatAy }} className="absolute inset-0 flex flex-col justify-center">
              <p className="font-display text-3xl md:text-5xl font-black leading-tight">
                Klas 3D druppelt binnen.
              </p>
              <p className="mt-5 max-w-md text-paper/70 text-base md:text-lg leading-relaxed">
                Jij opent de tool van vorig schooljaar. Het inlogscherm groet je als een oude vijand.
              </p>
            </motion.div>

            <motion.div style={{ opacity: beatBop, y: beatBy }} className="absolute inset-0 flex flex-col justify-center">
              <p className="font-display text-3xl md:text-5xl font-black leading-tight">
                De helft van de klas komt niet eens ingelogd.
              </p>
              <p className="mt-5 max-w-md text-paper/70 text-base md:text-lg leading-relaxed">
                De andere helft zit inmiddels op YouTube. En de voortgang? Die staat in een
                spreadsheet. Ergens. Waarschijnlijk.
              </p>
            </motion.div>

            <motion.div style={{ opacity: beatCop, y: beatCy }} className="absolute inset-0 flex flex-col justify-center">
              <p className="text-paper/50 text-sm font-bold uppercase tracking-[0.25em]">Je denkt het weer:</p>
              <p className="mt-4 font-display text-4xl md:text-6xl font-black leading-[1.05]">
                “Weer een tool voor de klas.”
              </p>
              <motion.p
                style={{ scale: limeScale, originX: 0 }}
                className="mt-6 inline-block w-fit rounded-xl bg-lime px-5 py-3 font-display text-2xl md:text-4xl font-black text-ink -rotate-1"
              >
                Deze keer werkt ’ie.
              </motion.p>
            </motion.div>
          </div>

          {/* chaos board */}
          <div className="relative h-[46vh] lg:h-[70vh]">
            {/* login card, sinks away */}
            <motion.div
              style={{ opacity: beatAop }}
              className="absolute left-[8%] top-[24%] w-64 md:w-72 rounded-2xl border-[3px] border-paper/20 bg-ink-soft p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
                <span className="ml-2 text-[11px] text-paper/50">oude-tool.nl/login</span>
              </div>
              <div className="rounded-lg bg-paper/10 px-3 py-2 text-sm text-paper/50">docent@school.nl</div>
              <div className="mt-2 rounded-lg bg-paper/10 px-3 py-2 text-sm text-paper/50">••••••••••</div>
              <div className="mt-3 rounded-lg bg-red-400/15 border border-red-400/40 px-3 py-2 text-xs font-bold text-red-300">
                Wachtwoord onjuist (poging 4)
              </div>
            </motion.div>

            {NOTES.map((n) => (
              <ChaosNote key={n.text} n={n} p={p} />
            ))}

            {/* calm resolution card */}
            <motion.div
              style={{ opacity: beatCop, y: beatCy }}
              className="absolute left-[14%] top-[30%] w-64 md:w-72 rounded-2xl border-[3px] border-lime bg-ink-soft p-5 shadow-[0_0_60px_rgba(215,247,12,0.15)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-lime" />
                <span className="text-[11px] text-paper/60">dgskills.app/klas</span>
              </div>
              <p className="text-sm text-paper/80">Klas 3D · Periode 1</p>
              <p className="mt-1 font-display text-2xl font-black text-lime">28 van 29 gestart</p>
              <p className="mt-2 text-xs text-paper/60">Zelfstandig. Zonder wachtwoorddrama.</p>
            </motion.div>
          </div>
        </div>

        <p className="px-6 md:px-14 pb-8 text-xs uppercase tracking-[0.25em] text-paper/40">
          Scroll — het wordt erger, en daarna beter
        </p>
      </div>
    </section>
  )
}
