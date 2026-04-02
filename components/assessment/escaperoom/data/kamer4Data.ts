// Kamer 4: Datalek — gevoelige gegevens herkennen + actie kiezen
// v1 = nulmeting (in KamerDatalek.tsx): volledige naam, BSN, wachtwoord, e-mailadres, huisadres
// v2 = eindmeting: andere gegevenscategorieën, zelfde moeilijkheidsgraad (5 gevoelig / 3 niet-gevoelig)

export interface GegevensItem {
  id: string;
  label: string;
  isGevoelig: boolean;
}

export interface ActieOptie {
  id: string;
  tekst: string;
  score: number; // 0-100
  feedback: string;
}

export const GEGEVENS_V2: GegevensItem[] = [
  { id: 'g1', label: 'Telefoonnummer', isGevoelig: true },
  { id: 'g2', label: 'Geboortedatum', isGevoelig: true },
  { id: 'g3', label: 'Favoriete sport', isGevoelig: false },
  { id: 'g4', label: 'Pincode bankpas', isGevoelig: true },
  { id: 'g5', label: 'Schoolnaam en klas', isGevoelig: true },
  { id: 'g6', label: 'Lievelingseten', isGevoelig: false },
  { id: 'g7', label: 'Foto van je ID-kaart', isGevoelig: true },
  { id: 'g8', label: 'Favoriete muziekartiest', isGevoelig: false },
];

export const ACTIE_OPTIES_V2: ActieOptie[] = [
  {
    id: 'a1',
    tekst: 'Direct je wachtwoorden veranderen en je ouders informeren',
    score: 100,
    feedback: 'Uitstekend! Wachtwoorden wijzigen en je ouders inlichten zijn de belangrijkste eerste stappen bij een datalek.',
  },
  {
    id: 'a2',
    tekst: 'Een melding doen bij de website waar het lek is',
    score: 75,
    feedback: 'Goed om te melden bij de website! Vergeet niet ook je eigen wachtwoorden te wijzigen voor extra veiligheid.',
  },
  {
    id: 'a3',
    tekst: 'Afwachten tot iemand anders het oplost',
    score: 0,
    feedback: 'Bij een datalek moet je zelf actie ondernemen. Afwachten kan je gegevens verder in gevaar brengen.',
  },
  {
    id: 'a4',
    tekst: 'Alle accounts verwijderen en opnieuw beginnen',
    score: 25,
    feedback: 'Accounts verwijderen is drastisch en niet altijd nodig. Begin met wachtwoorden wijzigen en ouders informeren.',
  },
];
