import { motion } from 'framer-motion'
import { Eyes, Pill } from '../components/brand'

/* Floating side props — the spreadsheet that retires and the XP that replaces it. */
function FloatingProps() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -8 }}
        transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[4%] top-[30%] hidden lg:block w-48 rounded-xl border-[3px] border-ink bg-white p-3 shadow-[6px_6px_0_0_rgba(23,20,14,1)]"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">voortgang_2025.xlsx</p>
        <div className="mt-2 space-y-1.5">
          {['Wie was er ook alweer klaar?', 'Tabblad 7 van 12', '#VERW!.xls'].map((r) => (
            <p key={r} className="rounded bg-ink/5 px-2 py-1 text-[10px] text-ink/50">
              {r}
            </p>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20, rotate: 6 }}
        animate={{ opacity: 1, y: 0, rotate: 6 }}
        transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[5%] top-[24%] hidden lg:block rounded-xl border-[3px] border-ink bg-lime px-4 py-3 shadow-[6px_6px_0_0_rgba(23,20,14,1)]"
      >
        <p className="font-display text-2xl font-black">+25 XP</p>
        <p className="text-[10px] font-bold uppercase tracking-widest">Sterke prompt</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ delay: 1.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[8%] bottom-[18%] hidden lg:block rounded-full border-[3px] border-ink bg-white px-4 py-2 shadow-[5px_5px_0_0_rgba(23,20,14,1)]"
      >
        <p className="text-xs font-bold">🔥 12 dagen streak</p>
      </motion.div>
    </>
  )
}

export function Hero() {
  return (
    <section id="proloog" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-paper grain px-6 text-center">
      <FloatingProps />

      {/* ghost eyes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <Eyes size={64} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Pill filled>Digitale geletterdheid voor VO &amp; VSO</Pill>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 max-w-4xl font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.98] tracking-tight"
      >
        Dit is het verhaal van een les die{' '}
        <span className="relative inline-block">
          <span className="relative z-10">wél</span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-1 z-0 h-4 md:h-6 origin-left bg-lime"
          />
        </span>{' '}
        werkt.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 max-w-xl text-lg md:text-xl text-ink/70 leading-relaxed"
      >
        Met in de hoofdrol: <strong className="text-ink">Mila</strong>, leerling.{' '}
        <strong className="text-ink">Haar docent</strong>, twintig kant-en-klare AI-missies — en een
        spreadsheet die met pensioen mag.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <a
          href="#probleem"
          className="rounded-full border-[3px] border-ink bg-ink px-8 py-4 font-bold text-lime shadow-[6px_6px_0_0_rgba(23,20,14,0.3)] transition-transform hover:-translate-y-0.5"
        >
          Begin het verhaal ↓
        </a>
        <a
          href="#epiloog"
          className="rounded-full border-[3px] border-ink bg-lime px-8 py-4 font-bold text-ink shadow-[6px_6px_0_0_rgba(23,20,14,1)] transition-transform hover:-translate-y-0.5"
        >
          Plan schoolpilot →
        </a>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2 text-ink/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.22em]">Hoofdstuk 1</span>
        <span className="block h-10 w-[2px] bg-ink/30" />
      </motion.div>
    </section>
  )
}
