# Missie-review: ipad-print-instructies

**Datum:** 2026-07-02
**Wave:** 20 (verse review — laatste wave)
**Levering:** DEDICATED component (geen template-config)
**Component:** `src/features/missions/PrintInstructiesMission.tsx` (interne titel: "Print Troubleshooter")

## Wat is dit? (vaststelling vooraf)

Géén statische instructiepagina — het is een **missie met scoring**: 5 multiple-choice printproblee-scenario's, max 2 pogingen per scenario (20 pt eerste poging, 10 pt tweede), verplichte reflectietekst (min. 10 tekens) vóór afronden. Beoordeeld als game-achtige missie, niet als hulppagina.

Er bestaat daarnaast een **losstaande agent-rol-entry** met dezelfde `missionId` in `src/config/agents/year1.tsx:726-765` (en identiek gespiegeld in `supabase/functions/_shared/systemInstructions.ts:24`) — dit is de dormante chat-laag (platform-breed patroon, niet opnieuw rapporteren als los issue). Wél relevant: de **inhoud** van die agent-rol wijkt fundamenteel af van de component-inhoud (zie D1).

## Registratie-check

**WEL geregistreerd** (consistent, geen dode entries):
- `RoleId`-union (`src/types.ts:25`)
- `AGENT_ROLE_IDS` (`src/config/agentRoleIds.ts:13`)
- Routing (`src/app/AuthenticatedApp.tsx:88,720-729`)
- Agent-rol/briefing (`src/config/agents/year1.tsx:726-765`) — zie D1 voor content-mismatch
- Server-side systemInstructions (`supabase/functions/_shared/systemInstructions.ts:24`) — identiek aan client-fallback, geen drift
- SLO-mapping AUTORITAIR (`src/config/slo-kerndoelen-mapping.ts:35`) — `sloKerndoelen: ['21A']`, `sloVsoKerndoelen: ['18A']`, week 2, yearGroup 1, `classRestriction: 'MH1A'`
- `missionGoals.ts:364-371` — `component-complete`
- `missionThumbnails.ts:7` — asset bestaat op schijf (`public/assets/previews/project_ipad_print_instructies.webp`)
- `missionPreviewConfig.ts:35` — kind 'print', chips `['iPad', 'RICOH', 'Print']`
- `basisvaardigheden-mapping.ts:108-113` — BEGRIJPEND_LEZEN
- `DevMissionPreview.tsx:127` — dev-preview wiring aanwezig
- `missionBuilder.tsx:34,169` — dashboard-tooltip/titel
- `ProjectZeroDashboard.tsx:133,544,617,1355` — leerling-zichtbaarheid, `isHighlighted`, `isReview`, met MH1A-uitzonderingslogica
- `review-status.json:1409` — `reviewStatus: "pending"` (dit rapport lost dat op)

**NIET geregistreerd (bewust, geen gat):**
- `curriculum.ts` — géén entry. Dit is consistent met het `classRestriction: 'MH1A'`-patroon: een klas-specifieke "review"-missie (buiten het reguliere weekrooster), net als andere MH1A-restricted items. Feitelijk vastgesteld, geen defect.

**Ontbrekende dekking:**
- Geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (0 treffers) — geen visuele referentiedata uit die audit.
- Geen `.ui-review/` of andere screenshots-map voor deze missie gevonden.

## Inhoudelijke feitencheck (verplicht — iPad-print-stappen)

Dit is de kern van deze review: **klopt de printinstructie voor courante iPadOS-versies?**

### Component-inhoud (wat de leerling daadwerkelijk speelt)

De 5 scenario's in `PrintInstructiesMission.tsx` zijn **generieke desktop-printerinstellingen-problemen**, niet iPad-specifiek:
1. WiFi-icoontje uit op de printer zelf (apparaat-onafhankelijk)
2. Kleureninstelling staat op "Grijswaarden" i.p.v. "Kleur" (generieke printerinstelling-taal)
3. Papierformaat "Letter" i.p.v. "A4" (typisch Windows/macOS-printdialoog-terminologie, geen iOS-sheet)
4. Aantal kopieën staat op 10 i.p.v. 1 (generiek)
5. Marges/schaal — "Passend op 1 pagina" i.p.v. "Fit to Page" (typisch desktop-printdialoogtaal)

Geen van de 5 scenario's noemt het **Deel-menu** (het vierkantje-met-pijltje-omhoog-icoon), **AirPrint**, **"Selecteer Printer"** in het iOS-printvenster, of enige andere iPadOS-specifieke stap. De opties/feedback-teksten gebruiken termen als "printerinstellingen" in algemene zin — er wordt nergens verwezen naar hoe je op een iPad daadwerkelijk bij die instellingen komt (Deel → Print → tik op printernaam/aantal/dubbelzijdig in de iOS-printsheet). Feitelijk is er **niets onjuist** in wat er staat (WiFi/kleur/papierformaat/kopieën/marges zijn allemaal legitieme oorzaken van printproblemen, ook op een iPad-AirPrint-flow), maar de missie behandelt het probleem op besturingssysteem-neutraal niveau, terwijl titel en briefing specifiek "iPad" beloven.

### Agent-rol-inhoud (year1.tsx / systemInstructions.ts — dormant maar wél feitelijk te toetsen)

Dit stuk is wél 100% iPad-specifiek, maar feitelijk **niet-verifieerbaar en waarschijnlijk onjuist voor de meeste scholen**:
> "Open de 'Boeken' app op je iPad, ga naar Bibliotheek en klik op het bestand 'Printen vanaf iPad naar de nieuwe Printers'."

Dit veronderstelt dat elke school een specifiek PDF/EPUB-instructiebestand met exact deze titel in de Boeken-app van elke leerling heeft staan — een lokale, school-specifieke asset die niet in deze codebase bestaat en dus niet controleerbaar is als "correct voor courante iPadOS". Het is geen algemene AirPrint-instructie (deel-menu → Print → printer kiezen → aantal/dubbelzijdig instellen → Print), maar een verwijzing naar een extern, schoolgebonden bestand. Voor de courante iPadOS-standaardflow (iOS 16-18: Deel-icoon → "Print" → "Selecteer Printer" → AirPrint-printer kiezen → kopieën/dubbelzijdig instellen → "Print" rechtsboven) bevat noch de component, noch de agent-rol een correcte, generieke beschrijving.

**Vergelijking met de eerder gefixte word-wizard-route:** die missie kreeg een concrete, courante Pages-route ("Invoegen → Documentelementen → Inhoud"). Hier ontbreekt het equivalent — geen enkele plek in deze missie beschrijft de daadwerkelijke iPadOS-AirPrint-route (Deel-menu → Print). Dat is de kernbevinding van deze review.

### Platform-inzicht (server vs. client chat-prompt)

Client-fallback (`year1.tsx:750-757`) en server-side systemInstructions (`systemInstructions.ts:24`) zijn **woordelijk identiek** — geen drift. Beide zijn dormant zolang de component geen `enableChat`/chat-UI heeft (bevestigd: geen `enableChat`, geen `useAgentLogic`-import in `PrintInstructiesMission.tsx`). Consistent met het bekende platform-brede dormante-chat-patroon — niet als los issue gerapporteerd, wél relevant omdat de dormante inhoud zelf feitelijk zwak is (zie D1).

## Rubric-scores

### Design (0-10, hoger = beter)
**7/10.** Component is visueel consistent met duck-design-tokens (`bg-duck-ink`, `bg-duck-acid`, `bg-duck-bg` voor het kleurenswatch-scenario), heldere voortgangsbalk, retry-flow, resultaatscherm met tips-recap en reflectie-gate. Printer-emoji/visuals zijn duidelijk per scenario. Puntenaftrek: geen enkel visueel element (icoon, illustratie, of het "printervisual"-component) toont ooit een iPad, Deel-icoon of AirPrint-flow — ondanks dat de missietitel en dashboard-chip expliciet "iPad" beloven (`missionPreviewConfig.ts:35` chips `['iPad', 'RICOH', 'Print']`). De visuele belofte en de visuele inhoud komen niet overeen.

### Didactiek (0-10, hoger = beter)
**5/10.** De 3-stappen-feedbackstructuur (optie kiezen → uitleg → tip) is didactisch solide en het probleemoplossend-denken-doel (SLO 21A) wordt gedekt door de troubleshoot-aanpak zelf. Maar: de primaryGoal in `missionGoals.ts:365` luidt letterlijk "Ik print vanaf een iPad door de juiste app, printer en stappen te gebruiken" en de dashboard-omschrijving zegt "Leer stap-voor-stap printen vanaf je iPad met de RICOH myPrint app" (`ProjectZeroDashboard.tsx:133`) — geen van beide beloften wordt door de daadwerkelijke 5 scenario's ingelost. Een leerling die na deze missie gevraagd wordt "print dit document vanaf je iPad" heeft niets geleerd over de concrete iPad-route (Deel-menu, AirPrint, printerkeuze in de iOS-sheet). Het geleerde (WiFi-status, kleurinstelling, papierformaat, kopieën-aantal, marges) is nuttige transferkennis, maar het missie-doel claimt een specifiek device-vaardigheid die niet wordt getoetst of aangeleerd.

### Techniek (0-10, hoger = beter)
**9/10.** Code is schoon: `useMissionAutoSave` correct toegepast, state-shape logisch, scoring-logica klopt (20/10 pt, max 100 = 5×20, percentage-berekening correct), retry-cap op 2 pogingen consistent gehandhaafd via `currentAttempts < 2`, reflectie-gate (`trim().length < 10`) werkt als disable-conditie op de knop. `IntroScreen` correct aangeroepen met `getMissionGoal('ipad-print-instructies')!` (non-null assertion is veilig want entry bestaat, geverifieerd). Geen technische bugs gevonden. Enige puntenaftrek: harde inline hex-kleuren i.p.v. duck-tokens op vrijwel alle secundaire elementen (acceptabel — legacy-patroon platform-breed, niet missie-specifiek, dus geen fix binnen scope).

## Triage-score

```
triageScore = (10-design)*0.3 + (10-didactiek)*0.4 + (10-tech)*0.3
            = (10-7)*0.3 + (10-5)*0.4 + (10-9)*0.3
            = 3*0.3 + 5*0.4 + 1*0.3
            = 0.9 + 2.0 + 0.3
            = 3.2
```

## Bevindingen

### D1 — Missie belooft "printen vanaf iPad" maar toont generieke desktop-printerscenario's; geen enkele iPad-specifieke stap in component of agent-rol (Didactiek/Design)

`missionGoals.ts:365`, `ProjectZeroDashboard.tsx:133` en `missionPreviewConfig.ts:35` beloven expliciet iPad/RICOH-specifieke printvaardigheid. De speelbare component (`PrintInstructiesMission.tsx`) bevat 5 scenario's die stuk voor stuk correct zijn als algemene printerkennis, maar geen van de vijf gaat over de iPadOS-route (Deel-icoon → Print → printer selecteren → instellingen → Print). De losstaande (dormante) agent-rol in `year1.tsx`/`systemInstructions.ts` verwijst wél naar "iPad", maar naar een niet-verifieerbaar school-lokaal Boeken-app-bestand in plaats van de generieke AirPrint-route.

**Voorstel:** Voeg één scenario toe (of herschrijf scenario 0) dat expliciet de iPadOS-AirPrint-route behandelt — bijv. "Je wilt printen maar er verschijnt geen 'Print'-knop in het menu dat opent als je op het vierkantje met het pijltje tikt (Deel-icoon)", met opties die de leerling leren dat Delen → naar beneden scrollen → "Print" de juiste route is, i.p.v. te zoeken naar een losse print-app. Dit is een inhoudelijke uitbreiding die buiten de scope van deze review valt om zelf te implementeren (raakt content-authoring, geen technisch defect) — als voorstel voor de missie-auteur:

```tsx
// src/features/missions/PrintInstructiesMission.tsx — SCENARIOS-array, nieuw scenario toevoegen
// Voorstel (niet toegepast, buiten scope van deze technische review):
{
    id: 5,
    emoji: '📱',
    title: 'Ik kan geen "Print"-knop vinden!',
    description: 'Je wilt een werkstuk printen vanaf je iPad, maar je ziet nergens een printknop in de app. Je hebt wel het vierkantje-met-pijltje-omhoog-icoon gezien.',
    visual: 'share-sheet',
    options: [
        { id: 'a', text: 'Tik op het Deel-icoon en scroll naar beneden naar "Print"', isCorrect: true, feedback: 'Precies! Op een iPad zit printen altijd achter het Deel-menu (het vierkantje met het pijltje omhoog). Scroll in dat menu naar beneden tot je "Print" ziet staan.' },
        { id: 'b', text: 'Download een aparte printer-app uit de App Store', isCorrect: false, feedback: 'Dat is meestal niet nodig — iPadOS heeft ingebouwde AirPrint-ondersteuning via het Deel-menu.' },
        { id: 'c', text: 'Stuur het bestand naar een computer om te printen', isCorrect: false, feedback: 'Onnodige omweg — je kunt rechtstreeks vanaf de iPad printen via het Deel-menu.' },
    ],
    tip: 'Printen op een iPad zit altijd achter het Deel-icoon (vierkantje met pijltje omhoog), ook als er geen losse "Print"-knop in de app zelf staat.',
},
```

### T1 — Agent-rol-instructie (dormant) verwijst naar niet-verifieerbaar school-lokaal bestand i.p.v. generieke AirPrint-route (Techniek/Didactiek, laag risico want dormant)

`year1.tsx:750-757` en `systemInstructions.ts:24` laten de AI (indien ooit geactiveerd) letterlijk zeggen: "Open de 'Boeken' app op je iPad, ga naar Bibliotheek en klik op het bestand 'Printen vanaf iPad naar de nieuwe Printers'." Dit veronderstelt een specifiek, extern PDF/EPUB-bestand met exact die titel dat niet in deze codebase bestaat en dus niet controleerbaar is. Omdat de chat dormant is (geen `enableChat` in de component) heeft dit vandaag geen leerling-impact — puur informatief gerapporteerd, geen fix binnen scope (content-only, en de chat-laag wordt sowieso platform-breed niet gebruikt).

**Voorstel (louter informatief, niet toegepast):** Mocht deze agent-rol ooit geactiveerd worden, vervang de tekst door een generieke AirPrint-instructie i.p.v. een schoolgebonden bestandsverwijzing:
```tsx
// src/config/agents/year1.tsx — regel 750-757, voorstel voor toekomstige activatie
"📱 Tik op het Deel-icoon (vierkantje met pijltje omhoog) in de app waar je in zit, scroll naar beneden en tik op 'Print'. Kies daarna je schoolprinter en druk op 'Print' rechtsboven. 🖨️"
```

## Samenvatting

Technisch is deze missie solide gebouwd (9/10) en volledig correct geregistreerd. Het kernprobleem is een **inhoudelijke belofte-mismatch**: titel, dashboard-tekst en missiedoel claimen specifiek iPad-printvaardigheid, maar zowel de speelbare component als de dormante agent-rol-tekst missen de daadwerkelijke, courante iPadOS-route (Deel-menu → Print → AirPrint). De 5 bestaande scenario's zijn feitelijk correct als algemene printerkennis, maar leveren niet wat de missie belooft. Triage-score 3.2 (lage prioriteit voor auto-fix — vereist content-authoring, geen technisch defect) maar wel het kernpunt van deze verse review.
