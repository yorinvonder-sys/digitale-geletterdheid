import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Pill, Reveal } from '../components/brand'

const BEATS = [
  {
    kicker: 'Maandag, 8:30',
    title: 'De helft van de klas komt niet eens ingelogd.',
    body: 'Wachtwoord kwijt. Account werkt niet. “Meneer, moet dit via Teams of via die andere app?” Tien minuten verder en de les is nog niet begonnen.',
  },
  {
    kicker: 'Maandag, 8:41',
    title: 'De andere helft zit inmiddels op YouTube.',
    body: 'En de voortgang? Die staat in een spreadsheet. Ergens. Waarschijnlijk. In elk geval niet daar waar je hem nodig hebt als de mentor ernaar vraagt.',
  },
  {
    kicker: 'Ondertussen',
    title: 'AI is allang de klas binnen — via de achterdeur.',
    body: 'Leerlingen gebruiken het dagelijks. Zonder richtlijnen, zonder lessen, zonder dat iemand het hen leert. De een wordt er slimmer van, de ander vooral afhankelijker.',
  },
  {
    kicker: 'De scheurlijn',
    title: 'De kloof groeit. Niet tussen leerjaren — binnen je klas.',
    body: 'Jayden bouwt een lift in Minecraft maar kan geen bestand bijvoegen in een e-mail. Dat is geen tegenspraak: dat is een fundament dat ontbreekt.',
  },
]

function Beat({ beat, index }: { beat: (typeof BEATS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.35'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, 0])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="flex gap-6 md:gap-10">
      <div className="flex flex-col items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-paper/40 font-display text-lg font-black text-lime">
          {index + 1}
        </span>
        {index < BEATS.length - 1 && <span className="mt-2 w-[2px] flex-1 bg-paper/20" />}
      </div>
      <div className="pb-20 md:pb-28">
        <Pill dark>{beat.kicker}</Pill>
        <h3 className="mt-5 max-w-2xl font-display text-3xl md:text-5xl font-black leading-[1.05]">
          {beat.title}
        </h3>
        <p className="mt-4 max-w-xl text-base md:text-lg text-paper/65 leading-relaxed">{beat.body}</p>
      </div>
    </motion.div>
  )
}

export function Problem() {
  return (
    <section id="probleem" className="relative bg-ink text-paper grain">
      <div className="mx-auto max-w-6xl px-6 md:px-14 py-24 md:py-36">
        <Reveal>
          <Pill dark>Hoofdstuk 1 · Het probleem</Pill>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-3xl font-display text-4xl md:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight">
            Eerst even <em className="italic text-lime">de pijn</em>. Je kent hem wel.
          </h2>
        </Reveal>

        <div className="mt-16 md:mt-24">
          {BEATS.map((b, i) => (
            <Beat key={b.kicker} beat={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
