// Gedragstest: technische opmaakinstructies horen niet in beeld bij de leerling.
//
// Bij Verhalen Ontwerper kreeg de leerling het interne startbericht letterlijk
// te zien. De tags werden wel gestript, de instructiezin eromheen niet, dus er
// bleef "Maak nu de titel met  tags" staan — inclusief dubbele spatie.
//
// Draaien vanuit de projectroot: node scripts/check-chat-instruction-hygiene.mjs

import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

// De pure tekstfuncties staan los van het component, zodat ze testbaar zijn.
const MOD = 'src/features/ai-chat/instructionText.ts';
const { cleanInstructionText } = await import(pathToFileURL(MOD).href);

// Het echte startbericht dat BookPreview.handleFormSubmit opbouwt.
const STARTBERICHT = `Start mijn prentenboek!
Basisgegevens voor het verhaal:
- Hoofdpersoon: Fluffy (een Beer)
- Locatie: Bos
- Het verhaal gaat over: vriendschap

Maak nu de titel met [TITLE] tags en de tekst van de eerste pagina met [PAGE] tags.`;

const zichtbaar = cleanInstructionText(STARTBERICHT);

assert.doesNotMatch(zichtbaar, /\btags?\b/i,
    'De leerling mag geen instructie over tags te zien krijgen');
assert.doesNotMatch(zichtbaar, /\[(TITLE|PAGE|IMG)/i,
    'Er mogen geen technische tags in beeld staan');
assert.doesNotMatch(zichtbaar, /  /,
    'Er mag geen dubbele spatie achterblijven waar een tag stond');

// De eigen keuzes van de leerling moeten juist WEL zichtbaar blijven.
for (const eigen of ['Fluffy', 'Beer', 'Bos', 'vriendschap', 'Start mijn prentenboek']) {
    assert.match(zichtbaar, new RegExp(eigen, 'i'),
        `De leerling moet zijn eigen keuze "${eigen}" nog zien`);
}

// Inhoud van de AI zelf mag niet sneuvelen: een pagina met tags houdt zijn tekst.
const modelBericht = '[TITLE]Fluffy in het Bos[/TITLE]\n\n[PAGE]Diep in het bos woonde een beer.[/PAGE]';
const modelZichtbaar = cleanInstructionText(modelBericht);
assert.match(modelZichtbaar, /Fluffy in het Bos/, 'De titel van de AI moet zichtbaar blijven');
assert.match(modelZichtbaar, /Diep in het bos woonde een beer/, 'De paginatekst moet zichtbaar blijven');

console.log('Chat instruction hygiene contract OK.');
