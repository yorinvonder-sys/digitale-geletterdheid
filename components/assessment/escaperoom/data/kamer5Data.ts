// Kamer 5: Dilemma — ethisch dilemma + reflectie
// v1 = nulmeting (in KamerDilemma.tsx): vriend wordt gepest, screenshot wordt doorgestuurd
// v2 = eindmeting: nep-account van een leraar — ander scenario, zelfde ethische laag (meelopen vs. ingrijpen)

export interface DilemmaOptie {
  id: string;
  tekst: string;
  score: number; // 0-100
  feedback: string;
}

export const DILEMMA_V2 = {
  titel: 'Het Nep-Account',
  scenario:
    'Een klasgenoot heeft een nep social media-account aangemaakt dat eruitziet alsof het van een leraar is. Er worden grappige maar gemene berichten geplaatst. Andere leerlingen lachen erom, maar je ziet dat de leraar er verdrietig door is. Je klasgenoot vraagt of jij het account wilt volgen.',
};

export const OPTIES_V2: DilemmaOptie[] = [
  {
    id: 'd1',
    tekst: 'Het account volgen en meelachen, het is maar een grapje',
    score: 0,
    feedback:
      'Een nep-account is geen grapje — het is identiteitsfraude en kan als cyberpesten worden gezien. Dit kan serieuze gevolgen hebben voor zowel de maker als de volgers.',
  },
  {
    id: 'd2',
    tekst: 'Niks zeggen maar het account ook niet volgen',
    score: 25,
    feedback:
      'Het is goed dat je niet meedoet, maar door niks te zeggen blijft het probleem bestaan. Soms is niet meedoen niet genoeg.',
  },
  {
    id: 'd3',
    tekst: 'Het account anoniem melden bij het social media platform',
    score: 75,
    feedback:
      'Goed! Melden bij het platform zorgt ervoor dat het account kan worden verwijderd. Nog beter is om dit te combineren met een gesprek.',
  },
  {
    id: 'd4',
    tekst: 'Tegen je klasgenoot zeggen dat dit niet oké is en voorstellen het te verwijderen',
    score: 100,
    feedback:
      'Uitstekend! Je spreekt je klasgenoot direct aan. Dit vraagt moed, maar is de beste manier om het probleem bij de bron aan te pakken.',
  },
];
