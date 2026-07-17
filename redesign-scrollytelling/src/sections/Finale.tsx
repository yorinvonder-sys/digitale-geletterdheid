import { Reveal, Duck, Pill, Eyes } from '../components/brand'

const PILOT = [
  'Kickoff-call — wij bereiden ons voor, niet alleen jij',
  'Startgids voor de eerste les (voor de docent, niet de ICT-er)',
  '20+ missies die leerlingen direct kunnen starten',
  'Klas en route ingericht vóór les één',
  'Pilotrapport na 6 weken — met vervolgadvies',
]

export function Finale() {
  return (
    <section id="epiloog" className="relative bg-lime grain overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 md:px-14 pt-24 md:pt-36 pb-16">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <Reveal>
              <Pill>Epiloog · Jouw beurt</Pill>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-5xl md:text-7xl font-black leading-[1.0] tracking-tight text-ink">
                Klaar voor het <em className="italic">volgende hoofdstuk</em>?
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-6 max-w-xl text-lg text-ink/75 leading-relaxed">
                Plan een schoolpilot. Live binnen 10 werkdagen, geen creditcard — echt niet.
                De eend houdt de agenda alvast vrij.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="mailto:info@dgskills.app?subject=Schoolpilot%20DGSkills"
                  className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-ink px-8 py-4 font-bold text-lime shadow-[6px_6px_0_0_rgba(23,20,14,0.3)] transition-transform hover:-translate-y-0.5"
                >
                  Plan mijn pilot →
                </a>
                <a
                  href="#mila"
                  className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-paper px-8 py-4 font-bold text-ink shadow-[6px_6px_0_0_rgba(23,20,14,1)] transition-transform hover:-translate-y-0.5"
                >
                  Herlees Mila’s verhaal
                </a>
              </div>
            </Reveal>
          </div>

          <div className="relative flex flex-col items-center">
            <Reveal delay={0.15}>
              <div className="relative">
                <Duck size={200} className="animate-bob" />
                <div className="absolute -right-6 -top-4">
                  <Eyes size={44} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.25} className="mt-8 w-full max-w-sm">
              <div className="rounded-2xl border-[3px] border-ink bg-paper p-5 shadow-[6px_6px_0_0_rgba(23,20,14,1)]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/50">
                  In de schoolpilot — zonder reclametaal
                </p>
                <ul className="mt-3 space-y-2.5">
                  {PILOT.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-ink/80">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] font-black text-lime">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        {/* footer */}
        <footer className="mt-24 border-t-[3px] border-ink pt-8 pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Eyes size={34} />
              <div>
                <p className="font-display text-xl font-black text-ink">DGSkills</p>
                <p className="text-xs text-ink/60">Digitale geletterdheid voor VO &amp; VSO</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-ink/80">
              <a href="#probleem" className="hover:underline underline-offset-4">Het verhaal</a>
              <a href="#bewijs" className="hover:underline underline-offset-4">SLO-koppeling</a>
              <a href="#bewijs" className="hover:underline underline-offset-4">Privacy &amp; AI</a>
              <a href="mailto:info@dgskills.app" className="hover:underline underline-offset-4">Contact</a>
            </nav>
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-between gap-2 text-xs font-medium text-ink/70">
            <p>Yorin Vonder · KvK 81819889 · info@dgskills.app</p>
            <p>Een beter verhaal voor dgskills.app — concept in scrollytelling-vorm.</p>
          </div>
        </footer>
      </div>
    </section>
  )
}
