import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/features/public-site/ScholenLanding.tsx', import.meta.url), 'utf8');
const cookieSource = readFileSync(new URL('../src/components/app-shell/CookieConsent.tsx', import.meta.url), 'utf8');

const requiredSnippets = [
  'aria-label="Maak digitale geletterdheid tastbaar, motiverend en aantoonbaar."',
  'Voor VO en VSO: AI-missies, SLO-voortgang en portfolio-bewijs in een veilige leeromgeving.',
  'Microsoft 365',
  'Pilot binnen 10 werkdagen',
  'Geen creditcard',
  'Zo werkt een DGSkills-les',
  'Waarom schoolleiders kiezen voor DGSkills',
  'SLO & curriculum proof',
  'Veilig te beoordelen door ICT',
  'Leerlingmissie',
  'Docentdashboard',
  'SLO-voortgang',
  'Portfolio-bewijs',
  'Privacy/ICT',
  'Wat krijg je in de schoolpilot?',
  'Gebouwd vanuit VO/VSO-praktijk en doorlopend getest met docenten.',
  'Veelgestelde vragen per rol',
  'Docenten',
  'Schoolleiding',
  'ICT & privacy',
];

const missing = requiredSnippets.filter((snippet) => !source.includes(snippet));

if (!cookieSource.includes('max-w-xs') || !cookieSource.includes('bottom-4')) {
  missing.push('Cookie banner should be a smaller corner card using max-w-xs and bottom-4');
}

if (missing.length) {
  console.error('Homepage buyer contract failed. Missing:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log('Homepage buyer contract passed.');
