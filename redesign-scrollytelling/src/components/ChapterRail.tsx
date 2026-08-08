import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const CHAPTERS = [
  { id: 'proloog', label: 'Proloog', num: '·' },
  { id: 'probleem', label: 'Het probleem', num: '1' },
  { id: 'ontmoeting', label: 'De ontmoeting', num: '2' },
  { id: 'mila', label: 'Mila', num: '3' },
  { id: 'docent', label: 'De docent', num: '4' },
  { id: 'bewijs', label: 'Het bewijs', num: '5' },
  { id: 'epiloog', label: 'Epiloog', num: '·' },
]

/* Fixed left rail: chapter dots that fill as the story advances. */
export function ChapterRail() {
  const [active, setActive] = useState('proloog')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Hoofdstukken"
      className="fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-1"
    >
      {CHAPTERS.map((c) => {
        const isActive = active === c.id
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="group relative flex items-center h-8"
            aria-label={c.label}
          >
            <span
              className={`block rounded-full border-2 border-ink transition-all duration-300 ${
                isActive ? 'h-8 w-3 bg-lime' : 'h-3 w-3 bg-paper group-hover:bg-lime/60'
              }`}
            />
            <span
              className={`pointer-events-none absolute left-6 whitespace-nowrap rounded-full border-2 border-ink px-3 py-1 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${
                isActive
                  ? 'bg-ink text-paper opacity-100 translate-x-0'
                  : 'bg-paper text-ink opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {c.num !== '·' && <span className="mr-1.5 text-lime-deep">{c.num}</span>}
              {c.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}

/* Thin lime progress bar across the top of the page. */
export function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setP(max > 0 ? h.scrollTop / max : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-ink/10">
      <motion.div
        className="h-full bg-lime-deep origin-left"
        style={{ scaleX: p }}
        initial={false}
      />
    </div>
  )
}
