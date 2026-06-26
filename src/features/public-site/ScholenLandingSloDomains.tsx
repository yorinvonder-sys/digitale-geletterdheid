import React, { useEffect, useRef, useState } from 'react';

const DOMAINS = [
  {
    code: '21',
    label: 'Domein 21',
    name: 'Digitale systemen, media, data en AI',
    kerndoelen: [
      ['21A', 'Digitale systemen'],
      ['21B', 'Media & informatie'],
      ['21C', 'Data & dataverwerking'],
      ['21D', 'Kunstmatige intelligentie'],
    ] as [string, string][],
  },
  {
    code: '22',
    label: 'Domein 22',
    name: 'Digitale producten en programmeren',
    kerndoelen: [
      ['22A', 'Digitale producten'],
      ['22B', 'Programmeren'],
    ] as [string, string][],
  },
  {
    code: '23',
    label: 'Domein 23',
    name: 'Veiligheid, welzijn en maatschappij',
    kerndoelen: [
      ['23A', 'Veiligheid & privacy'],
      ['23B', 'Digitaal welzijn'],
      ['23C', 'Maatschappij'],
    ] as [string, string][],
  },
];

export const ScholenLandingSloDomains: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-duck-ink/45">
        Officiële SLO-koppeling
      </p>
      <h3 className="mt-3 font-display text-2xl leading-[1.08] md:text-3xl text-duck-ink">
        Gekoppeld aan de SLO-leerlijn Digitale Geletterdheid
      </h3>
      <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-duck-ink/65">
        Elke missie is getagd met de SLO-conceptkerndoelen die aan bod komen, verdeeld over de drie domeinen. Zo zie je per domein wat er geoefend wordt.
      </p>

      <div
        ref={gridRef}
        className={[
          'mt-6 grid gap-4 md:grid-cols-3 transition-all duration-700',
          'motion-reduce:opacity-100 motion-reduce:translate-y-0',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        ].join(' ')}
      >
        {DOMAINS.map((domain, index) => {
          const cardBg =
            index === 1 ? 'bg-duck-bgLight' : 'bg-white';

          return (
            <div
              key={domain.code}
              className={`rounded-[1.5rem] ${cardBg} p-6 shadow-duck-soft`}
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-duck-ink/45">
                {domain.label}
              </p>
              <p className="mt-2 font-display text-lg leading-tight text-duck-ink">
                {domain.name}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {domain.kerndoelen.map(([code, label]) => (
                  <span
                    key={code}
                    className="rounded-lg bg-duck-ink/5 px-2 py-1 text-[11px] font-bold text-duck-ink/70"
                  >
                    {code} · {label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs font-semibold text-duck-ink/45">
        Gebaseerd op de SLO-conceptkerndoelen (september 2025). Definitieve vaststelling volgt via een AMvB.
      </p>
    </div>
  );
};
