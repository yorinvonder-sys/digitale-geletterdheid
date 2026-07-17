import { useState } from 'react'
import { motion } from 'framer-motion'
import { Film } from '../film/Film'
import { LogoLockup } from '../components/brand'

/* Homepage opening: the Jayden film, embedded as "chapter zero".
   First visit → autoplays. Revisit → ends state with replay. */
export function FilmChapter() {
  const [watched, setWatched] = useState(false)

  return (
    <section id="film" className="relative bg-ink grain">
      {/* cinema header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-10 py-4">
        <LogoLockup height={28} dark />
        <span className="hidden sm:block text-xs font-bold uppercase tracking-[0.25em] text-paper/50">
          Een korte film over Jayden · 50 sec
        </span>
      </div>

      {/* the screen */}
      <div className="relative border-y-[3px] border-lime/40">
        <Film
          autoSkipSeen
          storyHref="#ontmoeting"
          onFinish={() => setWatched(true)}
        />
      </div>

      {/* bridge into the story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl px-6 py-14 md:py-20 text-center"
      >
        <p className="font-display text-2xl md:text-4xl font-black text-paper leading-snug">
          {watched ? 'Mooi he?' : 'En zo ziet dat eruit,'}
          <br />
          <span className="text-lime">hoofdstuk voor hoofdstuk ↓</span>
        </p>
        <motion.a
          href="#ontmoeting"
          className="mt-6 inline-flex flex-col items-center gap-2 text-paper/50"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.22em]">Verder scrollen</span>
          <span className="block h-10 w-[2px] bg-paper/40" />
        </motion.a>
      </motion.div>
    </section>
  )
}
