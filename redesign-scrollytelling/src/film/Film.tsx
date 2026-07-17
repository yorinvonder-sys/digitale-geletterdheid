import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SceneFrustratie,
  SceneRaadsel,
  SceneAntwoord,
  SceneBewijs,
  SceneEpiloog,
} from './scenes'
import { Leader } from './Leader'

const SCENES = [
  { id: 'leader', label: 'Leader', dur: 3.6, bg: 'bg-[#3a3a38]', Comp: Leader },
  { id: 'frustratie', label: 'De frustratie', dur: 10, bg: 'bg-ink', Comp: SceneFrustratie },
  { id: 'raadsel', label: 'Het raadsel', dur: 9, bg: 'bg-lime', Comp: SceneRaadsel },
  { id: 'antwoord', label: 'Het antwoord', dur: 10, bg: 'bg-ink', Comp: SceneAntwoord },
  { id: 'bewijs', label: 'Het bewijs', dur: 10, bg: 'bg-ink', Comp: SceneBewijs },
  { id: 'epiloog', label: 'Epiloog', dur: 7, bg: 'bg-lime', Comp: SceneEpiloog },
]
const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0)
const SEEN_KEY = 'dgskills-film-seen'

export function Film({
  onFinish,
  autoSkipSeen = false,
  storyHref = '/',
}: {
  onFinish?: () => void
  autoSkipSeen?: boolean
  storyHref?: string
}) {
  const [elapsed, setElapsed] = useState(0) // seconds
  const [done, setDone] = useState(false)
  const [paused, setPaused] = useState(false)
  const raf = useRef<number | undefined>(undefined)
  const start = useRef<number | undefined>(undefined)
  const finished = useRef(false)

  const markDone = () => {
    if (finished.current) return
    finished.current = true
    try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    setDone(true)
    onFinish?.()
  }

  useEffect(() => {
    // Returning visitor on the homepage: land directly on the finished end state.
    if (autoSkipSeen) {
      try {
        if (localStorage.getItem(SEEN_KEY) === '1') {
          jumpTo(TOTAL)
          return
        }
      } catch { /* private mode */ }
    }
    const tick = (now: number) => {
      if (start.current === undefined) start.current = now
      const t = (now - start.current) / 1000
      setElapsed(t)
      if (t >= TOTAL) {
        markDone()
        return
      }
      raf.current = requestAnimationFrame(tick)
    }
    if (!paused && !done) raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, done])

  const jumpTo = (target: number) => {
    start.current = performance.now() - target * 1000
    setElapsed(target)
    if (target >= TOTAL) markDone()
    else {
      finished.current = false
      setDone(false)
    }
  }

  // scene lookup
  let acc = 0
  let idx = 0
  for (let i = 0; i < SCENES.length; i++) {
    if (elapsed < acc + SCENES[i].dur) { idx = i; break }
    acc += SCENES[i].dur
    idx = i
  }
  const scene = SCENES[done ? SCENES.length - 1 : idx]
  const sceneStart = SCENES.slice(0, done ? SCENES.length - 1 : idx).reduce((a, s) => s.dur + a, 0)
  const localT = Math.min(scene.dur, Math.max(0, elapsed - sceneStart))

  const skip = () => jumpTo(TOTAL - SCENES[SCENES.length - 1].dur + 0.01) // start of epiloog
  const replay = () => {
    finished.current = false
    setDone(false)
    setPaused(false)
    jumpTo(0)
  }

  return (
    <div className={`relative h-[100svh] overflow-hidden transition-colors duration-700 ${scene.bg} grain`}>
      {/* top bar */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 md:px-10 py-4">
        <span className={`text-xs font-black uppercase tracking-[0.25em] ${scene.bg === 'bg-lime' ? 'text-ink/60' : 'text-paper/50'}`}>
          DGSkills · een korte film
        </span>
        {!done && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaused((v) => !v)}
              className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-colors ${
                scene.bg === 'bg-lime'
                  ? 'border-ink/40 text-ink/70 hover:bg-ink hover:text-lime'
                  : 'border-paper/30 text-paper/70 hover:bg-paper hover:text-ink'
              }`}
            >
              {paused ? '▶ Verder' : '⏸ Pauze'}
            </button>
            <button
              onClick={skip}
              className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-colors ${
                scene.bg === 'bg-lime'
                  ? 'border-ink text-ink hover:bg-ink hover:text-lime'
                  : 'border-paper/40 text-paper hover:bg-paper hover:text-ink'
              }`}
            >
              Sla over →
            </button>
          </div>
        )}
        {done && (
          <button
            onClick={replay}
            className="rounded-full border-2 border-ink px-4 py-1.5 text-xs font-bold text-ink hover:bg-ink hover:text-lime transition-colors"
          >
            ↺ Opnieuw afspelen
          </button>
        )}
      </div>

      {/* scene */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
        >
          {scene.id === 'epiloog' ? (
            <SceneEpiloog t={localT} storyHref={storyHref} />
          ) : (
            <scene.Comp t={localT} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* bottom: progress + scene dots */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-5 md:px-10 pb-5">
        <div className="flex items-center justify-center gap-2 mb-3">
          {SCENES.map((s, i) => {
            const active = !done && i === idx
            const passed = done || i < idx
            return (
              <button
                key={s.id}
                onClick={() => jumpTo(SCENES.slice(0, i).reduce((a, x) => a + x.dur, 0) + 0.01)}
                aria-label={s.label}
                className={`h-2 rounded-full transition-all duration-300 border ${
                  scene.bg === 'bg-lime' ? 'border-ink' : 'border-paper/60'
                } ${active ? 'w-10 ' + (scene.bg === 'bg-lime' ? 'bg-ink' : 'bg-lime') : passed ? 'w-2 ' + (scene.bg === 'bg-lime' ? 'bg-ink/60' : 'bg-paper/60') : 'w-2 bg-transparent'}`}
              />
            )
          })}
        </div>
        <div className={`h-1 w-full rounded-full overflow-hidden ${scene.bg === 'bg-lime' ? 'bg-ink/15' : 'bg-paper/15'}`}>
          <div
            className={`h-full ${scene.bg === 'bg-lime' ? 'bg-ink' : 'bg-lime'}`}
            style={{ width: `${Math.min(100, (elapsed / TOTAL) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
