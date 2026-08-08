import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoLockup, Marquee } from './components/brand'
import { ChapterRail, ScrollProgress } from './components/ChapterRail'
import { Hero } from './sections/Hero'
import { Problem } from './sections/Problem'
import { Meet } from './sections/Meet'
import { StudentJourney } from './sections/StudentJourney'
import { Teacher } from './sections/Teacher'
import { Proof } from './sections/Proof'
import { Finale } from './sections/Finale'

function Nav() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.header
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          exit={{ y: -80 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 inset-x-0 z-40 border-b-[3px] border-ink bg-paper/90 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-10 py-3">
            <a href="#proloog" className="flex items-center gap-2.5">
              <LogoLockup height={30} />
            </a>
            <div className="flex items-center gap-3">
              <a
                href="#bewijs"
                className="hidden md:inline-block text-sm font-bold text-ink/70 hover:text-ink"
              >
                SLO-koppeling
              </a>
              <a
                href="#epiloog"
                className="rounded-full border-[3px] border-ink bg-lime px-5 py-2 text-sm font-bold text-ink shadow-[3px_3px_0_0_rgba(23,20,14,1)] transition-transform hover:-translate-y-0.5"
              >
                Plan schoolpilot →
              </a>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <div className="relative bg-paper text-ink antialiased">
      <ScrollProgress />
      <Nav />
      <ChapterRail />
      <main>
        <Hero />
        <Problem />
        <Meet />
        <StudentJourney />
        <Marquee
          dark
          items={[
            'De klas werkt zelfstandig',
            'Jij ziet wie vastzit',
            'De spreadsheet gaat met pensioen',
            'Bewijs, geen rapport',
          ]}
        />
        <Teacher />
        <Proof />
        <Finale />
      </main>
    </div>
  )
}
