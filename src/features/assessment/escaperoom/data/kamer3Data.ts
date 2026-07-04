// Kamer 3: Codekluis — code sequencing (ordered)
// v1 = nulmeting (in KamerCodekluis.tsx): alarmsysteem thema
// v2 = eindmeting: weerstation thema, zelfde structuur (START → lees sensor → conditie → acties → EINDE ALS)

export interface CodeBlok {
  id: string;
  tekst: string;
}

export const BLOKKEN_V2: CodeBlok[] = [
  { id: 'c1', tekst: 'START het programma' },
  { id: 'c2', tekst: 'LEES de temperatuursensor' },
  { id: 'c3', tekst: 'ALS het warmer is dan 30 graden:' },
  { id: 'c4', tekst: '  TOON het bericht "Het is warm!"' },
  { id: 'c5', tekst: '  ZET de ventilator aan' },
  { id: 'c6', tekst: 'EINDE van de controle' },
];

// De juiste volgorde voor het weerstation-programma
export const JUISTE_VOLGORDE_V2 = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
