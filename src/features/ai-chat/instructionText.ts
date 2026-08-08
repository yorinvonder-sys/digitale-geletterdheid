/**
 * Clean internal instruction text from messages before displaying to students.
 * Filters out technical tags and instruction text like:
 * - "INSTRUCTIE:" prefixed lines
 * - "[PAGE target=...]...[/PAGE]" tags
 * - "[TITLE]...[/TITLE]" tags  
 * - "[IMG target=...]...[/IMG]" tags
 * - "Antwoord alleen met de nieuwe..." instruction lines
 * - "Genereer GEEN/ALLEEN" instruction lines
 */
export const cleanInstructionText = (text: string): string => {
  if (!text) return text;

  let cleaned = text;

  // Remove INSTRUCTIE: blocks (entire lines starting with INSTRUCTIE)
  cleaned = cleaned.replace(/INSTRUCTIE:[^\n]*(?:\n|$)/gi, '');

  // Remove "Gewenste aanpassing:" lines
  cleaned = cleaned.replace(/Gewenste aanpassing:[^\n]*(?:\n|$)/gi, '');

  // Remove "Antwoord alleen met de nieuwe" instruction lines
  cleaned = cleaned.replace(/Antwoord alleen met de nieuwe[^\n]*(?:\n|$)/gi, '');

  // Remove "Genereer GEEN/ALLEEN" instruction lines
  cleaned = cleaned.replace(/Genereer (GEEN|ALLEEN)[^\n]*(?:\n|$)/gi, '');

  // Remove "Verander NIETS" instruction lines
  cleaned = cleaned.replace(/Verander NIETS[^\n]*(?:\n|$)/gi, '');

  // Remove "Beschrijving voor" instruction lines
  cleaned = cleaned.replace(/Beschrijving voor[^\n]*(?:\n|$)/gi, '');

  // Remove "Nieuwe titel aanvraag:" lines
  cleaned = cleaned.replace(/Nieuwe titel aanvraag:[^\n]*(?:\n|$)/gi, '');

  // Remove "Maak nu de titel met [TITLE] tags ..." instruction lines.
  // Deze zin komt uit het startbericht van Verhalen Ontwerper en overleefde het
  // strippen hieronder als een halve zin met dubbele spaties, waardoor hij als
  // technische instructie in beeld stond bij de leerling.
  // Bewust geankerd op de letterlijke openingszin, net als de regels hierboven:
  // een bredere "regel met een tag én het woord tags"-match at ook legitieme
  // tekst op, zoals "[TITLE]Tags in HTML[/TITLE]" of een leerling die zelf over
  // tags schrijft.
  cleaned = cleaned.replace(/^\s*Maak nu de titel met[^\n]*(?:\n|$)/gim, '');

  // Remove [PAGE target="X"]...[/PAGE] tags (keep content inside for model messages)
  cleaned = cleaned.replace(/\[PAGE target="?\d+"?\]/gi, '');
  cleaned = cleaned.replace(/\[\/PAGE\]/gi, '');

  // Remove [TITLE]...[/TITLE] tags
  cleaned = cleaned.replace(/\[TITLE\]/gi, '');
  cleaned = cleaned.replace(/\[\/TITLE\]/gi, '');

  // Remove [IMG target="X"]...[/IMG] tags
  cleaned = cleaned.replace(/\[IMG target="?[^"]*"?\][^\[]*\[\/IMG\]/gi, '');

  // Remove internal step-completion markers before rendering model output
  cleaned = cleaned.replace(/---STEP_COMPLETE:\d+---/g, '');

  // Remove "Inhoud:" prefix lines
  cleaned = cleaned.replace(/^Inhoud:[^\n]*(?:\n|$)/gim, '');

  // Clean up excessive whitespace/newlines that remain
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();

  return cleaned;
};

/**
 * Haalt interne markeringen uit een modelantwoord vóór het aan de leerling wordt
 * getoond.
 *
 * De gedeelde systeeminstructie draagt het model twee markeringen op:
 * `---STEP_COMPLETE:X---` bij een voltooide stap, en `---TIPS---` aan het eind van
 * ELK bericht, gevolgd door drie korte tips. In de oude AiLab-route worden allebei
 * verwerkt: `useAgentLogic` knipt de tips eruit en toont ze als klikbare
 * suggesties, en `parseAndUpdateSteps` haalt de stapmarkering weg. De leerlingchat
 * van de sjabloon-opdrachten rendert het antwoord rechtstreeks, dus daar stonden
 * beide markeringen letterlijk in beeld — bij `---TIPS---` zelfs bij elk bericht.
 *
 * De stapmarkering verdwijnt volledig: die zegt een leerling niets. De tips blijven
 * staan, want die zijn voor hem bedoeld; alleen de markering wordt een kop.
 *
 * Bewust smaller dan `cleanInstructionText`: die verwijdert ook `[TITLE]`- en
 * `[PAGE]`-tags, en juist de webbouw-opdrachten leren leerlingen wat zulke tags
 * zijn. Daar zou de brede opschoner lesinhoud weghalen.
 */
export const stripInternalMarkers = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/\s*---STEP_COMPLETE:\d+---\s*/g, '\n')
    .replace(/\s*---TIPS---\s*/g, '\n\n**Tips**\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/**
 * Check if a message is purely an internal instruction (should be hidden entirely)
 */
export const isInternalInstruction = (text: string): boolean => {
  if (!text) return false;

  // Check if message starts with INSTRUCTIE: and is mostly instruction content
  if (text.trim().startsWith('INSTRUCTIE:')) {
    // If after cleaning there's very little left, hide the whole message
    const cleaned = cleanInstructionText(text);
    return cleaned.length < 20;
  }

  return false;
};
