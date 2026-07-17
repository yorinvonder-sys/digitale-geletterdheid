import { Film } from '../film/Film'
import { LogoLockup } from '../components/brand'

/* Homepage opening: the Jayden film, embedded as "chapter zero".
   First visit → autoplays. Revisit → ends state with replay. */
export function FilmChapter() {
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
        <Film autoSkipSeen />
      </div>
    </section>
  )
}
