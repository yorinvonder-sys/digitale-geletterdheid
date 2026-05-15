// Kamer 3: Codekluis — code sequencing (ordered)
// v1 = nulmeting (in KamerCodekluis.tsx): alarmsysteem thema
// v2 = eindmeting: weerstation thema, zelfde structuur (START → lees sensor → conditie → acties → EINDE ALS)

export interface CodeBlok {
  id: string;
  tekst: string;
}

export const BLOKKEN_V2: CodeBlok[] = [
  { id: 'c1', tekst: 'START programma' },
  { id: 'c2', tekst: 'LEES sensor temperatuur' },
  { id: 'c3', tekst: 'ALS temperatuur > 30' },
  { id: 'c4', tekst: '  TOON "Het is warm!"' },
  { id: 'c5', tekst: '  ZET ventilator AAN' },
  { id: 'c6', tekst: 'EINDE ALS' },
];

// De juiste volgorde voor het weerstation-programma
export const JUISTE_VOLGORDE_V2 = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
