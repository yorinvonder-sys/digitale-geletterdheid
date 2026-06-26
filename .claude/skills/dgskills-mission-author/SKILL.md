---
name: dgskills-mission-author
description: Use this skill when creating, adding, or substantially editing a DGSkills learner mission — including adding a new mission to the template registry, wiring up the agent role, mapping SLO kerndoelen, placing the mission in the curriculum (leerjaar + periode), or registering it in the learner dashboard. Trigger phrases include "voeg missie toe", "nieuwe missie", "missie maken", "mission author", "SLO-koppeling", or when files under `components/missions/`, `config/templateRegistry.ts`, `config/slo-kerndoelen-mapping.ts`, `config/curriculum.ts`, or `config/agents/year{N}.tsx` are being added/modified.
---

# DGSkills Mission Author — Playbook

Je helpt Yorin een nieuwe DGSkills-missie te ontwerpen én volledig in te bouwen, met SLO-koppeling, didactische onderbouwing en een complete dashboard-integratie. Missies zijn **curriculum-werk, geen UI-werk**. Zie ook `components/missions/CLAUDE.md`.

## Triggerprincipes

- Activeer bij elk verzoek tot **toevoegen of wijzigen van een leerling-missie**.
- Activeer NIET voor pure UI-bugfixes in bestaande missies (gebruik standaard component-edit-flow).

## Verplichte leesvolgorde (vóór je iets schrijft)

Lees in deze volgorde, anders mis je invarianten:

1. `components/missions/CLAUDE.md` — missie-invarianten en didactische regels
2. `config/curriculum.ts` — leerjaar + periode + week-structuur
3. `config/agents/year{N}.tsx` — agentrollen (ROLES), `systemInstruction` per rol
4. `config/slo-kerndoelen-mapping.ts` — mission → SLO-codes (21A…23C) + VSO-mapping (18A…20B)
5. `config/templateRegistry.ts` — templateType routing (scenario-engine, puzzle-lab, simulation-lab, review-arena, builder-canvas, data-viewer, debate-arena, tool-guide)
6. `types/slo.ts` — SLO_VSO_GOALS + basisvaardigheden-tags
7. `components/ProjectZeroDashboard.tsx` — zichtbaarheid voor de leerling
8. Minstens één vergelijkbare bestaande missie in `components/missions/templates/<templateType>/`
9. `business/nl-vo/didactische-onderbouwing.md` — didactisch kader

## Invarianten (harde eisen)

Een missie is pas compleet als **alle** onderstaande kloppen:

- [ ] **Curriculum-plaats**: missie-ID staat in `config/curriculum.ts` onder een bestaand `yearGroups[n].periods[p].missions` array.
- [ ] **Agentrol**: er is een matching ROLE in `config/agents/year{N}.tsx` met identieke `id`, een passende `title`, emoji en `systemInstruction`.
- [ ] **Template-routing**: missie-ID is geregistreerd in `config/templateRegistry.ts` met het juiste `templateType`.
- [ ] **Template-config**: er is een config-bestand onder `components/missions/templates/<templateType>/configs/<missionId>.ts`.
- [ ] **SLO-mapping**: entry in `KERNDOEL_MISSIONS` (`config/slo-kerndoelen-mapping.ts`) met minimaal één `sloKerndoelen` code én `sloVsoKerndoelen` voor VSO-profielen.
- [ ] **Dashboardzichtbaarheid**: zichtbaar in `ProjectZeroDashboard.tsx` voor de juiste leerjaar/periode.
- [ ] **Restart-safe state**: gebruikt `useMissionAutoSave` patroon als er voortgang opgeslagen wordt.

## Didactische regels (altijd actief)

- **Doelgroep default**: onderbouw VO tenzij expliciet anders (vmbo/havo/vwo leerjaar 1-3, 12-15 jaar).
- **AI is copiloot, geen antwoordenmachine.** Leerling doet het denkwerk; AI spiegelt, stelt vragen, geeft scaffolding.
- **3-stappen-methode** bewaren: erkenning → korte uitleg → challenge.
- **Feedback**: kort, concreet, veilig. Geen lange lappen tekst.
- **Cognitieve load laag**: max 3-5 stappen zichtbaar, expliciete progressie.
- **XP-farming preventie**: geen beloning voor oppervlakkige interactie (spammen, copy/paste, triviale input).
- **Welzijn**: bij gevoelige onderwerpen (pesten, zelfbeeld, AI-afhankelijkheid) doorverwijsgedrag inbouwen.

## Security-checks bij missie-creatie

- [ ] Prompt injection: user input in AI-flows gaat door `promptSanitizer` (client + server).
- [ ] XSS: dynamische content via React's escaping of DOMPurify. Nooit `dangerouslySetInnerHTML` met leerling-input.
- [ ] `systemInstruction` wordt **server-side** bepaald via `roleId` + `getSystemInstruction()`. Nooit vanaf client.
- [ ] Missie-state bevat geen gevoelige data (geen namen/klasgegevens van anderen, geen audit logs in client state).
- [ ] Als de missie chat gebruikt (`enableChat: true`), de `chatRoleId` bestaat in `ROLES` én heeft een veilige systemInstruction.

## Stappenplan voor een nieuwe missie

### Stap 1 — Scope bepalen (autonoom)

Als de gebruiker alleen een missie-idee geeft, bepaal zelf:

- **Leerjaar + periode** (default: leerjaar 1, open slot zoeken in `config/curriculum.ts`)
- **Template-type** — kies op basis van leerdoel:
  - `scenario-engine` → multiple-choice dilemma's, cyber-scenario's
  - `puzzle-lab` → cryptografie, logische puzzels
  - `simulation-lab` → ontwerp-iteratie, what-if
  - `review-arena` → feedback geven op werk van anderen
  - `builder-canvas` → iets maken (website, pitch, podcast, prototype) met AI-copiloot
  - `data-viewer` → datasets interpreteren
  - `debate-arena` → standpunten afwegen, argumenteren
  - `tool-guide` → stap-voor-stap tool leren
- **SLO-codes** — kies uit:
  - `21A` Digitale systemen · `21B` Media & Informatie · `21C` Data & Dataverwerking · `21D` AI
  - `22A` Digitale producten · `22B` Programmeren
  - `23A` Veiligheid & privacy · `23B` Digitaal welzijn · `23C` Maatschappij
- **VSO-mapping** — voeg `sloVsoKerndoelen` toe (18A-C, 19A, 20A-B) als de missie ook in VSO gebruikt kan worden.

### Stap 2 — Concrete mission-ID

Gebruik **kebab-case**, Nederlands of Engels consistent met bestaande missies in hetzelfde template. Voorbeelden: `cookie-crusher`, `prompt-master`, `verhalen-ontwerper`.

### Stap 3 — Bestanden aanmaken/bewerken (in deze volgorde)

1. `config/agents/year{N}.tsx` — voeg ROLE toe (id, title, emoji, systemInstruction, beschrijving)
2. `components/missions/templates/<templateType>/configs/<missionId>.ts` — template-specifieke config (opdrachten, scenario's, testvragen, badges)
3. `config/templateRegistry.ts` — registreer missie met `templateType`, optioneel `enableChat` + `chatRoleId`
4. `config/slo-kerndoelen-mapping.ts` — voeg entry toe aan `KERNDOEL_MISSIONS`
5. `config/curriculum.ts` — voeg missie-ID toe aan de juiste `yearGroup.periods[p].missions`
6. `components/ProjectZeroDashboard.tsx` — controleer dat de missie automatisch verschijnt (meestal afgedekt door curriculum + registry); update info-tekst indien nodig
7. Server-side: als `enableChat: true`, controleer dat `supabase/functions/_shared/systemInstructions.ts` of `getSystemInstruction()` de `chatRoleId` herkent

### Stap 4 — Verificatie

Draai in gedachten (of echt) de volgende checks af:
- Registratie compleet: `npm run check:mission-registration <missionId>` — controleert alle bronnen van waarheid (RoleId-union, AGENT_ROLE_IDS, templateRegistry, validIds-set, config-bestand, curriculum, SLO, missionGoals).
- TypeScript compileert (`npm run build:prod` of `tsc --noEmit`)
- Missie verschijnt in het dashboard voor de juiste leerjaar/periode
- SLO-tags zijn zichtbaar en correct in de docent-view
- Chat-rol werkt (als ingeschakeld)

## Output-verwachting (na oplevering)

Lever altijd terug:

1. **Wat de leerling ervaart** — korte UX-beschrijving in gewone taal
2. **Wat de docent kan observeren** — in rapportage/dashboard
3. **SLO-doelen expliciet** — welke kerndoelen, waarom
4. **Didactische rationale** — in gewone Nederlands, geen jargon
5. **Demo-zin** — wat Yorin hierover kan zeggen in een verkoopgesprek of pilot

## Wanneer wél terugvragen

- De missie raakt een gevoelig thema (zelfbeschadiging, pesten, seksualiteit, politiek)
- Er is geen logische curriculum-slot beschikbaar
- Meerdere template-types zijn evengoed toepasbaar en de keuze beïnvloedt het leerdoel wezenlijk
- De SLO-koppeling is ambigu (raakt 3+ kerndoelen op gelijke sterkte)

## Anti-patronen (doe dit NOOIT)

- ❌ Missie in UI zonder SLO-mapping
- ❌ Missie in SLO-mapping zonder curriculum-plaats
- ❌ `systemInstruction` vanuit client-code
- ❌ Nieuwe template-architectuur uitvinden — hergebruik bestaande templates
- ❌ Missie zonder didactische onderbouwing shippen
- ❌ Engelse UI-teksten naar leerling (Nederlands is verplicht)

## Referentievoorbeeld

Kijk naar `chatbot-trainer` (builder-canvas + chat + SLO 21D/22B) voor een complete, goed gemapte missie.
