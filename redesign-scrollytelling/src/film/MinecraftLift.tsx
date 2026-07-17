import { motion } from 'framer-motion'

/* A tiny Minecraft-style redstone lift, built from blocky divs.
   The cabin rides up and down the piston — it actually looks like a lift. */
export function MinecraftLift({ t, active = true }: { t: number; active?: boolean }) {
  const blocks = [
    // ground row
    { c: '#6b4a2f', x: 0, y: 3 }, { c: '#6b4a2f', x: 1, y: 3 }, { c: '#6b4a2f', x: 2, y: 3 },
    { c: '#6b4a2f', x: 3, y: 3 }, { c: '#6b4a2f', x: 4, y: 3 },
    // grass on top of ground edges
    { c: '#5da032', x: 0, y: 2 }, { c: '#5da032', x: 4, y: 2 },
    // piston column (grey blocks)
    { c: '#8a8a8a', x: 1, y: 2 }, { c: '#8a8a8a', x: 1, y: 1 }, { c: '#8a8a8a', x: 1, y: 0 },
    // redstone dust (lime/red squares on ground)
    { c: '#d43a2a', x: 2, y: 2 }, { c: '#d43a2a', x: 3, y: 2 },
  ]
  return (
    <div className="relative h-[72px] w-[90px] shrink-0" aria-label="Minecraft redstone-lift">
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-4">
        {blocks.map((b, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={t > 1.2 ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.08 * i, type: 'spring', bounce: 0.5 }}
            className="rounded-[2px] border border-ink/60"
            style={{
              gridColumn: b.x + 1,
              gridRow: b.y + 1,
              backgroundColor: b.c,
              boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.28), inset 2px 2px 0 rgba(255,255,255,0.14)',
            }}
          />
        ))}
      </div>
      {/* lift cabin riding the piston */}
      <motion.span
        className="absolute rounded-[3px] border border-ink"
        style={{
          width: 18, height: 18, left: 18 + 9, top: 0,
          backgroundColor: '#c8c8c8',
          boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.2)',
        }}
        initial={{ y: 36, opacity: 0 }}
        animate={
          t > 1.6
            ? active
              ? { y: [36, 0, 36], opacity: 1 }
              : { y: 0, opacity: 1 }
            : {}
        }
        transition={
          active
            ? { y: { delay: 0.6, duration: 2.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }, opacity: { delay: 0.1 } }
            : { delay: 0.3, duration: 0.8 }
        }
      />
      {/* redstone pulse */}
      <motion.span
        className="absolute rounded-full bg-red-500"
        style={{ width: 6, height: 6, left: 40, top: 42 }}
        animate={active && t > 1.6 ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.8 }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </div>
  )
}

/* Mini video-edit card: play button + waveform, matching "video-edit" text. */
export function VideoEditIcon() {
  const bars = [10, 22, 34, 26, 40, 30, 18, 28, 14]
  return (
    <div className="relative flex h-[72px] w-[90px] shrink-0 flex-col items-center justify-center rounded-lg border-2 border-ink bg-ink" aria-label="Video-edit">
      <motion.span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-lime border-2 border-ink"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        <span className="ml-0.5 text-ink text-xs">▶</span>
      </motion.span>
      <div className="mt-2 flex items-end gap-[3px]">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="w-[4px] rounded-sm bg-lime/80"
            animate={{ height: [h * 0.3, h, h * 0.45, h * 0.85] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.09 }}
            style={{ height: h }}
          />
        ))}
      </div>
    </div>
  )
}
