import { useEffect, useState } from 'react'
import { Film } from '../film/Film'
import { LogoLockup } from '../components/brand'

const SEEN_KEY = 'dgskills-film-seen'

/* Homepage opening: the Jayden film, embedded as "chapter zero".
   Only shown to first-time visitors — anyone who has already seen the
   film lands directly on the Proloog instead. */
export function FilmChapter() {
  const [seen, setSeen] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      setSeen(localStorage.getItem(SEEN_KEY) === '1')
    } catch {
      setSeen(false) // private mode → treat as new visitor
    }
  }, [])

  // Don't render anything until we know (avoids a flash of the film for
  // returning visitors, and a flash of nothing for new ones).
  if (seen === null || seen) return null

  return (
    <section id="film" className="relative bg-ink grain">
      {/* cinema header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-10 py-4">
        <LogoLockup height={28} dark />
        <span className="hidden sm:block text-xs font-bold uppercase tracking-[0.25em] text-paper/50">
          Een korte film over Jayden · 43 sec
        </span>
      </div>

      {/* the screen */}
      <div className="relative border-b-[3px] border-lime/40">
        <Film />
      </div>
    </section>
  )
}
