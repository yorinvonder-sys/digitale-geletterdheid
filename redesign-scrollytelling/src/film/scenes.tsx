import { motion, AnimatePresence } from 'framer-motion'
import { Duck } from '../components/brand'

/* Shared easing */
const EASE = [0.22, 1, 0.36, 1] as const

/* Typed line: text appears character by character starting at `from` seconds */
function Typed({
  t,
  from,
  text,
  className = '',
  speed = 22,
}: {
  t: number
  from: number
  text: string
  className?: string
  speed?: number
}) {
  const shown = Math.max(0, Math.floor((t - from) * speed))
  return (
    <span className={className}>
      {text.slice(0, shown)}
      {t >= from && shown < text.length && <span className="animate-caret text-lime">▏</span>}
    </span>
  )
}

/* ------------------- Scene 1 · De frustratie (0–10s) ---------------------- */
/* Dark. The teacher's pain, typed out line by line. */
export function SceneFrustratie({ t }: { t: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-paper">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-10 text-xs font-bold uppercase tracking-[0.3em] text-paper/40"
      >
        Elke docent kent zo’n leerling
      </motion.p>

      <div className="w-full max-w-2xl space-y-5 md:space-y-7 text-center">
        <p className="font-display text-2xl md:text-4xl font-black leading-snug text-paper/95">
          <Typed t={t} from={0.8} text="“Jayden kan geen bestand bijvoegen in een e-mail.”" speed={38} />
        </p>
        <p className="font-display text-2xl md:text-4xl font-black leading-snug text-paper/70">
          <Typed t={t} from={2.8} text="“Herkent geen nepnieuws als het hem bijt.”" speed={38} />
        </p>
        <p className="font-display text-2xl md:text-4xl font-black leading-snug text-paper/50">
          <Typed t={t} from={4.6} text="“Vraagt hoe je een pdf opslaat.”" speed={38} />
        </p>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={t > 6.8 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-12 text-sm md:text-base font-bold uppercase tracking-[0.25em] text-lime"
      >
        Herkenbaar? Wacht maar.
      </motion.p>
    </div>
  )
}

/* --------------------- Scene 2 · Het raadsel (10–18s) --------------------- */
/* Hard cut to lime. The SAME Jayden is brilliant. */
export function SceneRaadsel({ t }: { t: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-ink">
      <motion.p
        initial={{ opacity: 0, scale: 0.85 }}
        animate={t > 0.3 ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="font-display text-3xl md:text-5xl font-black text-center leading-tight"
      >
        En díézelfde Jayden…
      </motion.p>

      {/* pixel lift rising */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={t > 1.3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-8 flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-paper px-5 py-4 shadow-[6px_6px_0_0_rgba(23,20,14,1)]"
      >
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={t > 1.5 ? { scale: 1 } : {}}
              transition={{ delay: 0.06 * i, type: 'spring', bounce: 0.6 }}
              className={`h-4 w-4 md:h-5 md:w-5 rounded-[3px] border border-ink ${
                [1, 5, 9].includes(i) ? 'bg-lime' : i % 3 === 0 ? 'bg-ink/70' : 'bg-ink/20'
              }`}
            />
          ))}
        </div>
        <p className="max-w-[220px] text-left text-sm md:text-base font-bold leading-snug">
          bouwde een werkende lift in Minecraft. Met redstone-logica.
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={t > 3.2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-5 max-w-lg text-center text-base md:text-xl font-bold text-ink/75"
      >
        Maakte een video-edit die de hele groepsapp domineerde.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
        animate={t > 5.2 ? { opacity: 1, scale: 1, rotate: -1 } : {}}
        transition={{ type: 'spring', bounce: 0.45 }}
        className="mt-9 rounded-2xl border-[3px] border-ink bg-ink px-6 py-4 font-display text-2xl md:text-4xl font-black text-lime shadow-[6px_6px_0_0_rgba(23,20,14,0.35)]"
      >
        Hoe kan dit allebei waar zijn?
      </motion.p>
    </div>
  )
}

/* -------------------- Scene 3 · Het antwoord (18–28s) --------------------- */
/* Duck bridges the two worlds: fundament AND excellence. */
export function SceneAntwoord({ t }: { t: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-paper">
      {/* two worlds + bridge */}
      <div className="flex w-full max-w-3xl items-center justify-between gap-3 md:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={t > 0.4 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-32 md:w-48 rounded-2xl border-2 border-paper/25 bg-ink-soft p-4 text-center"
        >
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-paper/50">De basis</p>
          <p className="mt-2 text-xs md:text-sm text-paper/70 leading-snug">
            E-mail. Wachtwoorden. Nepnieuws herkennen.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={t > 0.9 ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="shrink-0"
        >
          <Duck size={90} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={t > 0.4 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-32 md:w-48 rounded-2xl border-2 border-lime bg-ink-soft p-4 text-center"
        >
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-lime">De uitblinkers</p>
          <p className="mt-2 text-xs md:text-sm text-paper/80 leading-snug">
            Bouwen. Coderen. Creëren met AI.
          </p>
        </motion.div>
      </div>

      {/* bridge line grows between them */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={t > 1.6 ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
        className="mt-2 h-1 w-full max-w-3xl origin-center rounded-full bg-lime"
      />

      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={t > 2.6 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-9 max-w-2xl text-center font-display text-2xl md:text-4xl font-black leading-snug"
      >
        DGSkills dicht het gat in de basis —{' '}
        <span className="text-paper/60">zodat niemand achterblijft —</span>
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={t > 5.2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-3 max-w-2xl text-center font-display text-2xl md:text-4xl font-black leading-snug text-lime"
      >
        én laat uitblinkers écht uitblinken.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={t > 7.2 ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="mt-8 flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-paper/60"
      >
        <span>Fundament</span>
        <span className="text-lime">→</span>
        <span>Excellent</span>
      </motion.div>
    </div>
  )
}

/* --------------------- Scene 4 · Het bewijs (28–38s) ---------------------- */
/* Montage: mission done, XP rains, portfolio fills. Van basis naar bouwer. */
export function SceneBewijs({ t }: { t: number }) {
  const phase = t < 3.2 ? 0 : t < 6.4 ? 1 : 2
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 text-paper">
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="p0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-sm rounded-2xl border-[3px] border-lime bg-ink-soft p-5 text-left">
              <p className="text-[11px] font-bold uppercase tracking-widest text-paper/50">Missie · Digitale basis</p>
              <p className="mt-1 font-display text-2xl font-black">De E-mail Expert</p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 1.6, ease: 'easeInOut' }}
                className="mt-4 h-3 rounded-full bg-lime"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={t > 2.4 ? { opacity: 1 } : {}}
                className="mt-2 text-xs font-bold text-lime"
              >
                ✓ Bijlage verstuurd. Zonder hulp.
              </motion.p>
            </div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex h-64 w-full max-w-md items-center justify-center"
          >
            {['+25 XP', '+90 XP', '+120 XP'].map((xp, i) => (
              <motion.span
                key={xp}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: [0, 1, 1, 0], y: [-40 - i * 30, -100 - i * 40, -150 - i * 40, -190 - i * 40] }}
                transition={{ delay: 0.2 + i * 0.5, duration: 2.1, ease: 'easeOut' }}
                className="absolute rounded-xl border-[3px] border-ink bg-lime px-4 py-2 font-display text-2xl font-black text-ink shadow-[4px_4px_0_0_rgba(23,20,14,1)]"
                style={{ left: `${20 + i * 28}%` }}
              >
                {xp}
              </motion.span>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-0 font-display text-xl md:text-2xl font-black text-paper/90"
            >
              Jayden vliegt erdoorheen.
            </motion.p>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="p2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-sm rounded-2xl border-[3px] border-paper/25 bg-ink-soft p-5">
              <p className="font-display text-xl font-black">Portfolio — Jayden</p>
              {['Mijn eigen mini-game', 'Nepnieuws-checklist ✓'].map((n, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.45 }}
                  className="mt-2.5 flex items-center justify-between rounded-xl border-2 border-paper/25 px-4 py-2.5 text-sm"
                >
                  <span className="font-bold">{n}</span>
                  <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-black text-ink">
                    {i === 0 ? 'EXPERT' : 'BASIS'}
                  </span>
                </motion.div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6, ease: EASE }}
              className="mt-8 text-center font-display text-2xl md:text-4xl font-black leading-snug"
            >
              Van basis… <span className="text-lime">naar bouwer.</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* --------------------- Scene 5 · Epiloog (38–45s) ------------------------- */
export function SceneEpiloog({ t }: { t: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center text-ink">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={t > 0.3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Duck size={100} className="animate-bob" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={t > 0.9 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-6 font-display text-4xl md:text-6xl font-black leading-[1.05]"
      >
        Klaar voor het<br /><em className="italic">volgende hoofdstuk</em>?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={t > 1.6 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-4 max-w-md text-base md:text-lg text-ink/75"
      >
        Plan een schoolpilot. Live binnen 10 werkdagen.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={t > 2.2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <a
          href="mailto:info@dgskills.app?subject=Schoolpilot%20DGSkills"
          className="rounded-full border-[3px] border-ink bg-ink px-8 py-4 font-bold text-lime shadow-[6px_6px_0_0_rgba(23,20,14,0.3)] transition-transform hover:-translate-y-0.5"
        >
          Plan mijn pilot →
        </a>
        <a
          href="/"
          className="rounded-full border-[3px] border-ink bg-paper px-8 py-4 font-bold text-ink shadow-[6px_6px_0_0_rgba(23,20,14,1)] transition-transform hover:-translate-y-0.5"
        >
          Bekijk de uitgebreide versie
        </a>
      </motion.div>
    </div>
  )
}
