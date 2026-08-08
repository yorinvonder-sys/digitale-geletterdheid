import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Eyes, Pill, Duck } from '../components/brand'

function FloatingProp({
  children,
  className = '',
  rotate = 0,
  depth = 1,
}: {
  children: React.ReactNode
  className?: string
  rotate?: number
  depth?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 140 * depth])
  return (
    <motion.div ref={ref} style={{ y, rotate }} className={`absolute ${className}`}>
      {children}
    </motion.div>
  )
}

export function Hero() {
  return (
    <section
      id="proloog"
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden grain bg-paper px-6"
    >
      {/* storybook ruled margin, left edge */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-24 storybook-lines border-r-2 border-ink/10" />

      {/* floating props */}
      <FloatingProp rotate={-7} depth={0.7} className="hidden lg:block left-[9%] top-[22%]">
        <div className="rounded-xl border-[3px] border-ink bg-white p-3 shadow-[6px_6px_0_0_rgba(23,20,14,1)] w-44">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50 mb-2">voortgang_2025.xlsx</p>
          {['Wie was er ook alweer klaar?', 'Tabblad 7 van 12', '#VERW!.xls'].map((t) => (
            <div key={t} className="mb-1.5 rounded bg-ink/5 px-2 py-1 text-[10px] text-ink/60 line-through decoration-ink/40">
              {t}
            </div>
          ))}
        </div>
      </FloatingProp>

      <FloatingProp rotate={6} depth={1.1} className="hidden lg:block right-[8%] top-[26%]">
        <div className="rounded-xl border-[3px] border-ink bg-lime p-3 shadow-[6px_6px_0_0_rgba(23,20,14,1)] w-40 text-center">
          <p className="font-display text-3xl font-black">+25 XP</p>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Sterke prompt</p>
        </div>
      </FloatingProp>

      <FloatingProp rotate={-4} depth={0.5} className="hidden md:block right-[14%] bottom-[16%]">
        <div className="rounded-full border-[3px] border-ink bg-paper px-4 py-2 shadow-[4px_4px_0_0_rgba(23,20,14,1)]">
          <span className="text-xs font-bold">🔥 12 dagen streak</span>
        </div>
      </FloatingProp>

      <FloatingProp rotate={5} depth={0.9} className="hidden md:block left-[13%] bottom-[13%]">
        <Duck size={86} className="animate-bob" />
      </FloatingProp>

      {/* core */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Eyes size={76} className="mb-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <Pill filled>Digitale geletterdheid voor VO &amp; VSO</Pill>
        </motion.div>

        <motion.h1
          className="mt-8 font-display text-[13vw] sm:text-6xl md:text-7xl lg:text-[5.4rem] font-black leading-[1.02] tracking-tight text-ink"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Dit is het verhaal van
          <br />
          een les die <em className="relative inline-block not-italic font-black italic">
            wél
            <motion.span
              className="absolute inset-x-[-0.12em] top-[8%] bottom-[2%] -z-10 bg-lime rounded-lg"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: 0 }}
            />
          </em> werkt.
        </motion.h1>

        <motion.p
          className="mt-7 max-w-2xl text-base md:text-lg text-ink/70 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          Met in de hoofdrol: <strong className="text-ink">Mila</strong>, leerling.{' '}
          <strong className="text-ink">Haar docent</strong>, twintig kant-en-klare AI-missies — en een
          spreadsheet die met pensioen mag.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <a
            href="#probleem"
            className="group inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-ink px-7 py-3.5 font-bold text-paper shadow-[5px_5px_0_0_rgba(23,20,14,0.25)] transition-transform hover:-translate-y-0.5"
          >
            Begin het verhaal
            <span className="transition-transform group-hover:translate-y-0.5">↓</span>
          </a>
          <a
            href="#epiloog"
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-lime px-7 py-3.5 font-bold text-ink shadow-[5px_5px_0_0_rgba(23,20,14,1)] transition-transform hover:-translate-y-0.5"
          >
            Plan schoolpilot →
          </a>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#probleem"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.22em]">Hoofdstuk 1</span>
        <span className="block h-10 w-[2px] bg-ink/40" />
      </motion.a>
    </section>
  )
}
