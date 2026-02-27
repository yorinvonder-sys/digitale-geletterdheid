
import { EducationLevel } from '../types';

// ============================================================================
// DIFFERENTIATIE-SYSTEEM — Niveau-specifieke AI-instructies
// AVG-conform: geen stereotyperingen, geen persoonsgegevens-opslag
// AI Act: gedocumenteerde differentiatie-logica (Art. 13 transparantie)
// ============================================================================

/**
 * Niveau-specifieke instructieprefixes voor de AI-tutor.
 * Didactisch onderbouwd, niet-stereotyperend.
 */
export const LEVEL_PREFIXES: Record<EducationLevel, string> = {
  mavo: `NIVEAU-INSTRUCTIES (MAVO):
- Gebruik korte, concrete zinnen (max 2 per uitleg-onderdeel)
- Geef directe, stapsgewijze instructies
- Bied visuele voorbeelden waar mogelijk
- Gebruik alledaagse vergelijkingen en herkenbare situaties
- Maximaal 1 nieuw begrip per beurt introduceren
- Bij twijfel: geef het antwoord en leg uit waarom het zo werkt`,

  havo: `NIVEAU-INSTRUCTIES (HAVO):
- Balanceer tussen concreet en abstract denken
- Stel open vragen naast gesloten vragen
- Moedig zelfstandig redeneren aan
- Introduceer vakjargon met uitleg erbij
- Geef hints in plaats van volledige antwoorden
- Verwacht dat de leerling zelf verbanden legt`,

  vwo: `NIVEAU-INSTRUCTIES (VWO):
- Stimuleer abstract en kritisch denken
- Stel Socratische vragen die tot nadenken aanzetten
- Verwacht onderbouwde antwoorden met argumentatie
- Introduceer verdiepende concepten en dwarsverbanden
- Geef minder hints, meer onderzoeksvragen
- Daag de leerling uit om verder te denken dan het voor de hand liggende`,
};

/**
 * Leerjaar-specifieke context voor de AI-tutor.
 */
export const YEAR_CONTEXT: Record<number, string> = {
  1: 'LEERJAAR-CONTEXT: 12-13 jaar, eerste kennismaking met digitale vaardigheden.',
  2: 'LEERJAAR-CONTEXT: 13-14 jaar, verdieping en zelfstandiger werken.',
  3: 'LEERJAAR-CONTEXT: 14-16 jaar, specialisatie en kritisch denken (alleen havo/vwo).',
};

/**
 * Tempo-instructies op basis van in-memory berekend tempo.
 * Tempo-data wordt NIET opgeslagen (AVG data-minimalisatie).
 */
export const PACE_INSTRUCTIONS: Record<'fast' | 'normal' | 'slow', string> = {
  fast: 'TEMPO-AANPASSING: De leerling werkt snel. Bied verdiepende bonusvragen aan en skip basisuitleg die al begrepen lijkt.',
  normal: '',
  slow: 'TEMPO-AANPASSING: De leerling heeft meer tijd nodig. Geef meer structuur, kortere stappen en extra voorbeelden.',
};

/**
 * VSO-profielen voor dagbesteding en arbeidsmarktgerichte leerlingen.
 */
export const VSO_PREFIXES: Record<string, string> = {
  dagbesteding: `VSO-PROFIEL (DAGBESTEDING):
Focus op verkennen en ervaren. Gebruik eenvoudige taal, korte opdrachten, veel visuele ondersteuning. Samenwerken staat centraal.`,

  arbeidsmarkt: `VSO-PROFIEL (ARBEIDSMARKT):
Focus op beheersing en toepassing. Nadruk op betrouwbaarheid, structuur en werkplaats-relevante vaardigheden.`,
};

/**
 * Combineert base-instructie met niveau-, leerjaar-, tempo- en VSO-context.
 *
 * @param baseInstruction - De originele systemInstruction van de missie
 * @param educationLevel - mavo | havo | vwo
 * @param yearGroup - 1, 2, of 3
 * @param pace - 'fast' | 'normal' | 'slow' (optioneel, default 'normal')
 * @param vsoProfile - 'dagbesteding' | 'arbeidsmarkt' (optioneel)
 * @returns Gecombineerde systemInstruction string
 */
export const buildDifferentiatedInstruction = (
  baseInstruction: string,
  educationLevel: EducationLevel,
  yearGroup: number,
  pace: 'fast' | 'normal' | 'slow' = 'normal',
  vsoProfile?: string,
): string => {
  const parts: string[] = [];

  // 1. VSO-profiel heeft voorrang (overschrijft niveau-prefix)
  if (vsoProfile && VSO_PREFIXES[vsoProfile]) {
    parts.push(VSO_PREFIXES[vsoProfile]);
  } else if (LEVEL_PREFIXES[educationLevel]) {
    parts.push(LEVEL_PREFIXES[educationLevel]);
  }

  // 2. Leerjaar-context
  const yearCtx = YEAR_CONTEXT[yearGroup];
  if (yearCtx) {
    parts.push(yearCtx);
  }

  // 3. Tempo-aanpassing (alleen als niet 'normal')
  const paceInstr = PACE_INSTRUCTIONS[pace];
  if (paceInstr) {
    parts.push(paceInstr);
  }

  // 4. Base instruction van de missie
  parts.push(baseInstruction);

  return parts.join('\n\n');
};
