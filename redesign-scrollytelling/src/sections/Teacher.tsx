import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChapterMarker, Reveal, BrowserFrame } from '../components/brand'

const STUDENTS = [
  { init: 'MV', pct: 82, state: 'ok' },
  { init: 'NK', pct: 64, state: 'ok' },
  { init: 'SB', pct: 47, state: 'ok' },
  { init: 'LJ', pct: 29, state: 'help' },
]

const SLO_BARS = [
  { label: 'Informatievaardigheid', pct: 68 },
  { label: 'Digitale veiligheid', pct: 51 },
  { label: 'Creatie & maken', pct: 84 },
]

const POINTS = [
  {
    title: 'Je ziet wie vastzit',
    body: 'Voortgang en leervragen in één scherm. Je helpt gericht — in plaats van 29 keer dezelfde vraag te beantwoorden.',
  },
  {
    title: 'Klas-inzicht, anoniem',
    body: 'De AI vat samen waar de klas vastloopt. Gebaseerd op anonieme voortgangsdata — geen namen zichtbaar voor de AI.',
  },
  {
    title: 'Geen zondagsvoorbereiding',
    body: 'Je start met wat er al ligt. Geen werkbladen ontwerpen, geen AI-cursus vóór de eerste les.',
  },
]

export function Teacher() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const sheetY = useTransform(scrollYProgress, [0.15, 0.85], [0, -560])
  const sheetR = useTransform(scrollYProgress, [0.15, 0.85], [-6, -28])
  const sheetO = useTransform(scrollYProgress, [0.15, 0.7], [1, 0])
  const waveO = useTransform(scrollYProgress, [0.3, 0.55, 0.8], [0, 1, 0])

  return (
    <section id="docent" ref={ref} className="relative bg-paper grain overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 md:px-14 py-24 md:py-36">
        <ChapterMarker
          kicker="Hoofdstuk 4 · De docent"
          number="4"
          title={
            <>
              Ondertussen, <em className="italic">twee meter verderop</em>: jij.
            </>
          }
        />
        <Reveal delay={0.15} className="mt-8 max-w-2xl">
          <p className="text-lg md:text-xl text-ink/70 leading-relaxed">
            Terwijl de klas werkt, kijk jij mee in je dashboard. Wie is klaar, wie heeft hulp nodig,
            welke SLO-doelen zijn geraakt — <strong className="text-ink">zonder rondje langs alle tafels</strong>.
          </p>
        </Reveal>

        <div className="relative mt-14">
          {/* the retiring spreadsheet */}
          <motion.div
            style={{ y: sheetY, rotate: sheetR, opacity: sheetO }}
            className="absolute -top-10 right-2 md:right-16 z-20 w-52 rounded-xl border-[3px] border-ink bg-[#e8f5e2] p-3 shadow-[6px_6px_0_0_rgba(23,20,14,1)]"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">voortgang_definitief_v3.xlsx</p>
            <div className="mt-2 grid grid-cols-4 gap-px bg-ink/15 rounded overflow-hidden text-[8px]">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="bg-[#f6fbf3] px-1 py-1 text-ink/40">
                  {i % 5 === 0 ? '??' : i % 3 === 0 ? '#!' : '·'}
                </span>
              ))}
            </div>
            <motion.p style={{ opacity: waveO }} className="mt-2 text-xs font-bold text-ink/70">
              ik ga met pensioen 👋
            </motion.p>
          </motion.div>

          <Reveal>
            <BrowserFrame url="dgskills.app/klas" className="max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-xl font-black">Klas 3D · Periode 1</p>
                <span className="rounded-full border-2 border-ink bg-lime px-3 py-1 text-xs font-bold">
                  2 hulpvragen
                </span>
              </div>

              {/* students */}
              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {STUDENTS.map((s, i) => (
                  <motion.div
                    key={s.init}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                    className={`rounded-xl border-2 p-3 ${
                      s.state === 'help' ? 'border-ink bg-ink text-paper' : 'border-ink/15 bg-paper-soft'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black ${
                          s.state === 'help' ? 'border-lime bg-lime text-ink' : 'border-ink bg-white'
                        }`}
                      >
                        {s.init}
                      </span>
                      <span className="font-display text-xl font-black">{s.pct}%</span>
                    </div>
                    {s.state === 'help' && (
                      <span className="mt-2 inline-block rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold text-ink">
                        Hulp gevraagd
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* SLO coverage */}
              <div className="mt-6 rounded-xl border-2 border-ink/15 bg-paper-soft p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink/50">SLO-dekking</p>
                  <span className="text-xs font-bold text-lime-deep">9 kerndoelen in beeld</span>
                </div>
                <div className="mt-3 space-y-3">
                  {SLO_BARS.map((b, i) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{b.label}</span>
                        <span className="font-bold">{b.pct}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-ink/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${b.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-lime-deep to-lime"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI insight */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-dashed border-ink/30 px-4 py-3">
                <p className="text-sm text-ink/70">
                  <strong>Klas-inzicht:</strong> AI-samenvatting van waar de klas vastloopt. Anoniem — geen namen.
                </p>
                <span className="rounded-full border-2 border-ink bg-white px-4 py-1.5 text-xs font-bold">
                  Genereer samenvatting
                </span>
              </div>
            </BrowserFrame>
          </Reveal>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {POINTS.map((pt, i) => (
            <Reveal key={pt.title} delay={0.08 * i}>
              <div className="h-full rounded-2xl border-[3px] border-ink bg-white p-5 shadow-[5px_5px_0_0_rgba(23,20,14,1)]">
                <span className="font-display text-3xl font-black text-lime-deep">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-display text-xl font-black">{pt.title}</h3>
                <p className="mt-2 text-sm text-ink/65 leading-relaxed">{pt.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
