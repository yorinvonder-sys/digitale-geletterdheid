# Fix-rapport 1 — systemInstructions.ts
- Datum: 2026-04-16
- Files gewijzigd: `supabase/functions/_shared/systemInstructions.ts`

## Patroon-A fix (18 missies met STEP_COMPLETE:1 → 1-4)

| Missie | Status | Stap-titels |
|--------|--------|-------------|
| app-prototyper | OK | Gebruikersprobleem analyseren / Schermen ontwerpen / Gebruikersflow uitwerken / Testplan schrijven |
| digital-storyteller | OK | Verhaalidee en setting bepalen / Verhalenstructuur uitwerken / Eerste scènes schrijven / Digitale presentatie ontwerpen |
| video-editor | OK | Videoconcept bepalen / Storyboard schrijven / Shotlist maken / Montageplan opstellen |
| api-architect | OK | REST API-principes begrijpen / Endpoints ontwerpen / Beveiliging met authenticatie / API-documentatie schrijven |
| open-source-contributor | OK | De Git-workflow begrijpen / Bug-issue analyseren / Bugfix schrijven / Pull Request indienen |
| web-developer | OK | Paginastructuur plannen / Layout en stijl ontwerpen / Interactiviteit toevoegen / Testen en verbeteren |
| podcast-producer | OK | Onderwerp kiezen / Structuur plannen / Intro schrijven / Interviewvragen bedenken |
| brand-builder | OK | Merk en doelgroep bepalen / Kleurenpalet kiezen / Logo-concept ontwerpen / Huisstijlgids samenstellen |
| meme-machine | OK | Meme-formats analyseren / De psychologie van viraliteit / Eigen meme ontwerpen / Verantwoord content maken |
| automation-engineer | OK | Automatiseringskandidaat identificeren / Algoritme ontwerpen / Script-structuur uitwerken / Script testen en valideren |
| startup-simulator | OK | Probleem en oplossing definiëren / Businessmodel ontwerpen / Markt en concurrentie analyseren / Pitch structuur schrijven |
| innovation-lab | OK | SDG-probleem kiezen en analyseren / Technologische oplossing ontwerpen / Prototype-concept uitwerken / Impact presenteren |
| portfolio-builder | OK | Projecten selecteren en prioriteren / Reflecties schrijven / Portfolio-structuur ontwerpen / Persoonlijk profiel schrijven |
| prototype-developer | OK | Idee uitwerken en afbakenen / Prototype ontwerpen / Prototype bouwen / Testen en itereren |
| pitch-perfect | OK | Pitchstructuur opbouwen / Pitch uitschrijven / Pitch oefenen en feedback verwerken / Voorbereiden op jury-vragen |
| meesterproef | OK | Projectvoorstel schrijven / Ontwikkelproces documenteren / Eindproduct beschrijven en verantwoorden / Voorbereiding op de verdediging |
| mission-blueprint | OK | Project beschrijven / Taken opschrijven / Volgorde bepalen / Plan opslaan in de cloud |
| mission-vision | OK | Visie in woorden vangen / Moodboard maken / Presentatieslides ontwerpen / Visie pitchen in 2 minuten |

**Aanpak:** Het gedeelde STAP VOLTOOIING-blok (`Waarbij X het stapnummer is (1, 2, of 3)`) is per missie vervangen door een stap-specifieke markertabel met STEP_COMPLETE:1-4 en de bijbehorende step-titels uit de bijbehorende config-bestanden.

## website-bouwer entry toegevoegd

OK — Nieuwe entry `"website-bouwer"` toegevoegd vóór `"web-developer"`. Structuur analoog aan web-developer. Rol: Website Bouwer Coach (12-13 jaar). STEP_COMPLETE:1-4 op basis van `components/missions/templates/builder-canvas/configs/website-bouwer.ts`:
- 1: HTML-structuur opzetten
- 2: Stijl toevoegen met CSS
- 3: Persoonlijke inhoud bouwen
- 4: Uitleggen wat je hebt gebouwd

## Patroon-B cleanup (7 dode instructions)

Verificatie: geen van de 7 heeft `enableChat: true` in `config/templateRegistry.ts`. ReviewArena component ondersteunt chat wel technisch via `enableChat` prop, maar die prop is voor alle 7 niet ingesteld.

| Missie | Template | Status | Reden |
|--------|----------|--------|-------|
| data-review | review-arena | REMOVED | Geen enableChat in registry |
| code-review-2 | review-arena | REMOVED | Geen enableChat in registry |
| media-review | review-arena | REMOVED | Geen enableChat in registry |
| code-reviewer | simulation-lab | REMOVED | Geen enableChat in registry |
| security-review | review-arena | REMOVED | Geen enableChat in registry |
| advanced-code-review | review-arena | REMOVED | Geen enableChat in registry |
| impact-review | review-arena | REMOVED | Geen enableChat in registry |

## Verificatie

- TypeScript: PASS (npx tsc --noEmit levert geen output = geen errors)
- Regelcount voor/na: 121 / 115 (−6 door verwijdering 7 entries, +1 door website-bouwer)
- Tekencount voor/na: 489850 / 459366 (−30484 netto)

## Risico's

- De vervanging van `Waarbij X het stapnummer is (1, 2, of 3)` raakt alleen de 18 BuilderCanvas-missies — het generieke patroon staat ook in andere (niet-BuilderCanvas) entries maar is daar niet aangepast. Dit is bewust: de taakspec gaat alleen over de 19 BuilderCanvas-missies.
- `website-bouwer` entry is nieuw en gebaseerd op de config + web-developer-structuur. De exacte chatbegeleiding is functioneel correct maar kan later nog verfijnd worden.
