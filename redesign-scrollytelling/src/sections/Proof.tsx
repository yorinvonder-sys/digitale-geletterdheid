import { ChapterMarker, Reveal, Pill } from '../components/brand'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const DOMAINS = [
  {
    id: 'Domein 21',
    title: 'Digitale systemen, media, data en AI',
    items: [
      ['21A', 'Digitale systemen'],
      ['21B', 'Media & informatie'],
      ['21C', 'Data & dataverwerking'],
      ['21D', 'Kunstmatige intelligentie'],
    ],
  },
  {
    id: 'Domein 22',
    title: 'Digitale producten en programmeren',
    items: [
      ['22A', 'Digitale producten'],
      ['22B', 'Programmeren'],
    ],
  },
  {
    id: 'Domein 23',
    title: 'Veiligheid, welzijn en maatschappij',
    items: [
      ['23A', 'Veiligheid & privacy'],
      ['23B', 'Digitaal welzijn'],
      ['23C', 'Maatschappij'],
    ],
  },
]

const LEADERSHIP = [
  ['SLO zit erin, niet ernaast', 'Kerndoelen zijn standaard onderdeel van elke missie. Na de les kun je aanwijzen wat er geleerd is.'],
  ['Geen zondagsvoorbereiding', 'Docenten starten met wat er al ligt. Geen werkbladen ontwerpen, geen AI-cursus vóór les één.'],
  ['Rapport na zes weken', 'Deelname, voortgang en SLO-koppeling op papier — iets om een schoolbesluit op te baseren.'],
  ['Past bijna overal', 'Mentorles, projectweek, keuzeuur of gewone les. Als het maar niet de 47e Teams-vergadering is.'],
]

const ICT = [
  ['Microsoft 365-login', 'Inloggen via de schoolomgeving die je al hebt. ICT richt niets nieuws in.'],
  ['Verwerkersovereenkomst', 'Het privacyteam wil eerst de afspraken zien? Goed plan. Dat kan.'],
  ['DPIA-support', 'DGSkills levert wat je nodig hebt voor de DPIA-check. Scholen beoordelen zelf — zo hoort het.'],
  ['AI-transparantie', 'Hoe de AI werkt is uitlegbaar voor leerlingen, docenten en schoolbeleid. Geen zwarte doos.'],
  ['Eén aanspreekpunt', 'Geen ticketnummer, geen wachtrij van drie dagen.'],
]

const FAQ = [
  ['Moet ik zelf AI-lessen ontwerpen?', 'Nee. Je start met kant-en-klare missies en routes. Wil je later aanpassen, dan kan dat — maar het hoeft echt niet.', 'Docenten'],
  ['Wat levert een pilot op?', 'Deelname, voortgang en SLO-koppeling op papier. Plus advies over wat nodig is als je verder wil. Niet alleen: “de leerlingen waren enthousiast”.', 'Schoolleiding'],
  ['Kunnen we privacy en AI vooraf beoordelen?', 'Ja — en dat is precies de bedoeling. Verwerkersafspraken, DPIA-ondersteuning en AI-transparantie zitten standaard in de pilot. Neem de tijd die je nodig hebt.', 'ICT & privacy'],
  ['Hoe snel kan een school starten?', 'Binnen 10 werkdagen na de eerste afstemming. Geen projectplan van tien pagina’s, geen maanden aanlooptijd.', 'Pilot'],
]

export function Proof() {
  return (
    <section id="bewijs" className="relative bg-ink text-paper grain">
      <div className="mx-auto max-w-6xl px-6 md:px-14 py-24 md:py-36">
        <ChapterMarker
          dark
          kicker="Hoofdstuk 5 · Het bewijs"
          number="5"
          title={
            <>
              Elk goed verhaal <em className="italic text-lime">laat iets achter</em>.
            </>
          }
        />
        <Reveal delay={0.15} className="mt-8 max-w-2xl">
          <p className="text-lg md:text-xl text-paper/70 leading-relaxed">
            Geen PowerPoint vol beloften, maar deelname, voortgang en SLO-koppeling op papier.
            Iets om een schoolbesluit op te baseren.
          </p>
        </Reveal>

        {/* SLO domains */}
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {DOMAINS.map((d, i) => (
            <Reveal key={d.id} delay={0.08 * i}>
              <div className="h-full rounded-2xl border-2 border-paper/20 bg-ink-soft p-5">
                <span className="inline-block rounded-full bg-lime px-3 py-1 text-[11px] font-black uppercase tracking-widest text-ink">
                  {d.id}
                </span>
                <h3 className="mt-3 font-display text-xl font-black leading-snug">{d.title}</h3>
                <ul className="mt-4 space-y-2">
                  {d.items.map(([code, label]) => (
                    <li key={code} className="flex items-center gap-2.5 text-sm text-paper/75">
                      <span className="rounded-md border border-lime/50 px-1.5 py-0.5 text-[10px] font-black text-lime">{code}</span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-4 text-xs text-paper/45 italic">
            Gebaseerd op de SLO-conceptkerndoelen (september 2025). Definitieve vaststelling volgt via een AMvB.
          </p>
        </Reveal>

        {/* leadership + ICT */}
        <div className="mt-16 grid lg:grid-cols-2 gap-10">
          <div>
            <Reveal>
              <Pill dark>Voor schoolleiding</Pill>
            </Reveal>
            <div className="mt-6 space-y-0 divide-y divide-paper/15 border-y border-paper/15">
              {LEADERSHIP.map(([t, b], i) => (
                <Reveal key={t} delay={0.06 * i}>
                  <div className="flex gap-5 py-5">
                    <span className="font-display text-2xl font-black text-lime">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h4 className="font-display text-lg font-black">{t}</h4>
                      <p className="mt-1 text-sm text-paper/65 leading-relaxed">{b}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <Reveal>
              <Pill dark>Voor ICT &amp; privacy</Pill>
            </Reveal>
            <div className="mt-6 space-y-3">
              {ICT.map(([t, b], i) => (
                <Reveal key={t} delay={0.06 * i}>
                  <div className="flex gap-4 rounded-xl border-2 border-paper/20 bg-ink-soft p-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-xs font-black text-ink">✓</span>
                    <div>
                      <h4 className="font-bold text-sm">{t}</h4>
                      <p className="mt-0.5 text-sm text-paper/60">{b}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <Reveal>
            <Pill dark>De vragen die in elk schoolteam op tafel komen</Pill>
          </Reveal>
          <Reveal delay={0.1} className="mt-6">
            <Accordion type="single" collapsible className="rounded-2xl border-2 border-paper/20 bg-ink-soft px-5">
              {FAQ.map(([q, a, role], i) => (
                <AccordionItem key={q} value={`faq-${i}`} className="border-paper/15">
                  <AccordionTrigger className="text-left font-display text-lg font-black hover:no-underline hover:text-lime">
                    <span className="flex items-center gap-3">
                      <span className="rounded-full border border-lime/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-lime">{role}</span>
                      {q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-paper/70 text-sm md:text-base leading-relaxed pb-5">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
