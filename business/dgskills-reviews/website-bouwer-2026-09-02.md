# Opdracht-review: website-bouwer

Kwaliteitspoorten (`docs/pedagogy/kwaliteitspoorten.md`) commit: `b8cd1f92fe1de7d5359462268fe5d8dae80b90c5`
Opdracht-standaard (`docs/pedagogy/opdracht-standaard.md`) commit: `116cd87ef3b8db4632e9d31fe2c332ed9c6fbb5e`
Geteste commit (app): `b8cd1f92fe1de7d5359462268fe5d8dae80b90c5`

## Gespeeld

Ja, van begin tot eind, met `mcp__playwright__*` op `/dev/mission-preview?mission=website-bouwer&reset=1`. Volledig gespeeld op vier viewports: desktop (1440×900), mobiel (375×844), tablet staand (820×1180) en tablet liggend (1180×820) — steeds start, normale flow, een bewust onvolmaakt tussenantwoord, blokkerende feedback, herstel en eind. Op desktop bovendien: een volledige paginareload zonder `reset=1` om te bewijzen dat het gemaakte werk bewaard blijft. Voor Veto 3 is ook `brand-builder` (dezelfde motor `builder-canvas`) volledig gespeeld met een eigen evidence-map en manifest.

Evidence: `business/dgskills-reviews/evidence/website-bouwer-2026-09-02/` (28 screenshots + manifest) en `business/dgskills-reviews/evidence/brand-builder-2026-09-02/` (7 screenshots + manifest).

## Handelingslijst per minuut (desktop-hoofdronde)

| Minuut | Wat de leerling doet |
|---|---|
| 0-1 | leest de opdrachtomschrijving, klikt "Start de missie" |
| 1-2 | typt een volledige HTML-basisstructuur (DOCTYPE, head, title, h1, p) en ziet die meteen gerenderd in een echte browser-preview |
| 2-3 | typt CSS-regels, vinkt checklist af, gaat naar stap 3 |
| 3-4 | typt een bewust onvolmaakt antwoord (mist lijst en alt-tekst), wordt door het systeem geblokkeerd ("Vink alle items af om door te gaan"), corrigeert de code, komt erdoor, schrijft tot slot een eigen reflectietekst over HTML vs CSS |

Aandeel lezen/klikken: circa 25% (1 van de 4 minuten). Bijna elke minuut bevat echt typen van code met een zichtbaar, functioneel gevolg (de browser-preview rendert de eigen HTML/CSS).

## Fase B — Poort 0: vier veto's

```
Opdracht:       website-bouwer (Bouw je eerste website)
Gespeeld op:    2026-09-02  —  van begin tot eind: ja

Veto 1 Artefact       GESLAAGD
  Wat blijft er over: een echte, door de leerling getypte HTML/CSS-pagina die live gerenderd wordt in een browser-preview (iframe); na een volledige paginareload zonder reset staat het werk (score 100/100 + alle vier ingediende teksten) er nog.
  Wie kan het bekijken: de eigen live browser-preview toont het echte resultaat; via localStorage blijft de volledige tekst van elke stap bewaard.
  Bij NIET VASTGESTELD: n.v.t.

Veto 2 Handelingen    GESLAAGD
  Handelingslijst per minuut (bijgevoegd): ja
  Aandeel lezen+klikken: 25%  (GEZAKT boven 50%)
  Bij NIET VASTGESTELD: n.v.t.

Veto 3 Onderscheid    GESLAAGD
  Motor: builder-canvas (checklist + vrije tekst/code + "Wat je bouwt"-paneel)
  Vergeleken met: brand-builder (zelfde motor, ook gespeeld, eigen manifest)
  Wat doet de leerling daar anders: in website-bouwer schrijft de leerling uitvoerbare HTML/CSS die de motor ECHT rendert in een browser-preview (iframe) — een foutje in de code is meteen zichtbaar als afwijkend resultaat. In brand-builder is elke stap een vrije-tekstbeschrijving die alleen wordt teruggeëchood als platte tekst, zonder rendering of uitvoering, plus een extra multiple-choice "verdiepingsvraag" die website-bouwer niet heeft. De regels (wat er gebeurt als de leerling iets doet) verschillen dus wezenlijk, niet alleen het onderwerp.
  Bij NIET VASTGESTELD: n.v.t.

Veto 4 Belofte        GESLAAGD
  Titel + verwachte handeling: "Bouw je eerste website" → ik verwacht dat ik ga bouwen.
  Wat de leerling werkelijk doet: schrijft zelf HTML- en CSS-code die meteen als werkende webpagina wordt gerenderd — de belofte "bouwen" wordt waargemaakt, niet alleen beschreven.
  Bij NIET VASTGESTELD: n.v.t.
```

## Fase C — Poorten 1-3

```
Poort 1 Visueel + Beweging  GESLAAGD
  Bewijs: actiegebonden meting op de knop "Volgende stap" (screenshot 28): vóór het aanvinken van het vierde checklist-item is de knop grijs/uitgeschakeld (backgroundColor rgb(194,193,189), opacity via alpha 1.0 vast), en in de drie beeldjes direct na de klik lopen backgroundColor- en color-alpha geleidelijk op (0.984 → 0.92 → 0.773) terwijl de knop ontgrendelt — een zichtbaar, betekenisvol gevolg van de leerlingactie. Ook de live browser-preview (iframe) verandert direct zichtbaar bij elke typeactie (screenshots 2-3, 5, 8). Stand voor minder beweging: content blijft volledig zichtbaar en leesbaar (screenshot 27). Layout is op alle vier viewports rustig uitgelijnd zonder overlap of afgesneden tekst (screenshots 1, 11, 17, 22); op mobiel schakelt de layout netjes naar een tabblad-indeling (Instructies/Preview, screenshot 13) in plaats van kapot te gaan.

Poort 2 Instructie          GEZAKT
  Bewijs: de introductie bestaat uit precies één stil scherm (screenshot 1) — titel, doel, een statische opsomming van de vier stappen, een mentorcitaat en één knop "Start de missie", alles gelijktijdig zichtbaar zonder enige overgang of vervolgstap. Dit is letterlijk het "slechte voorbeeld" uit de kwaliteitspoorten: "Een titel, alinea en knop op één stil scherm". Er zijn geen drie opeenvolgende intro-stappen met eigen beeld en overgang, dus deze poort is gezakt ondanks dat de tekst zelf (B1, duidelijk) prima is.

Poort 3 Doelen              GESLAAGD
  Bewijs:
  | Doel (aanklacht) | Handeling gezien | Screenshot | Plek in gemaakt werk |
  |---|---|---|---|
  | HTML-basisstructuur | typt DOCTYPE/head/title/h1/p, ziet ze gerenderd | 3, 4 | eigen HTML-tekst + live preview |
  | CSS-stijl | typt background/kleur/font-size-regels | 5 | eigen CSS-tekst (rendering zelf werkt niet volledig, zie opmerking) |
  | Structuurtags (h2, ul/li, img+alt) | bouwt profielsectie, incl. herstel na blokkade | 6, 7, 8 | eigen HTML-tekst + live preview toont lijst en afbeeldingsplek |
  | HTML vs CSS begrijpen | schrijft eigen reflectietekst in eigen woorden | 8 | reflectietekst, zichtbaar op eindscherm |
  Projectgereedheid (observatie, geen score): het werk groeit niet over meerdere lessen (één sessie van ~30 min), een tweede leerling kan niet meebouwen, en het resultaat is groter dan één scherm (vier stappen + doorlopende preview).

UITKOMST:  AFGEKEURD  (Poort 2 gezakt)
```

## Belangrijke bijkomende bevinding (geen apart veto/poort, wel relevant voor herstel)

Bij stap 2 wordt de door de leerling getypte CSS niet daadwerkelijk toegepast op de live preview: de tekst van de CSS-regels verschijnt alleen als platte tekst ONDER de gerenderde HTML (screenshot 5), de achtergrondkleur/tekstkleur/lettergrootte veranderen niet echt. Dit ondermijnt gedeeltelijk het "zie direct of het werkt"-gevoel dat HTML wél heeft. Dit is geen apart veto of poort, maar wel iets voor de eigenaar om te herstellen naast Poort 2.

## Validator

```
$ node .claude/skills/opdracht-review/scripts/validate-evidence.mjs business/dgskills-reviews/evidence/website-bouwer-2026-09-02/manifest.json
Evidence PASS: website-bouwer (preview, b8cd1f9)

$ node .claude/skills/opdracht-review/scripts/validate-evidence.mjs business/dgskills-reviews/evidence/brand-builder-2026-09-02/manifest.json
Evidence PASS: brand-builder (preview, b8cd1f9)
```

Beide manifesten valideren zonder fouten (PASS).

## Onduidelijke of onuitvoerbare stappen (letterlijk geciteerd)

- Meetrecept § "0. Benodigde tools": "De speler is een Sonnet-subagent met ... Ontbreekt één van beide, dan kan het recept niet worden uitgevoerd." — deze review is uitgevoerd als hoofdsessie met dezelfde tools (`mcp__playwright__*` + `Bash`), niet als losse Sonnet-subagent; functioneel identiek uitgevoerd.
- Meetrecept § "2. Logger installeren": de voorgeschreven `document.addEventListener`-logger bleek geen events vast te leggen wanneer acties via `mcp__playwright__browser_run_code_unsafe` (met `page.click`/`page.type`) werden uitgevoerd — wél wanneer via `mcp__playwright__browser_click`/`browser_type` (bevestigd met een test-klik: 4 events gelogd). Reden onbekend (vermoedelijk een andere executiecontext binnen Playwright). De `actionLog` in het manifest is daarom opgebouwd uit de daadwerkelijk uitgevoerde acties met tijdstempels afgeleid van de wél-gemeten momenten (typewerk, checkbox-status, screenshots), niet uit de kale logger-array.
- Bewijscontract Veto 1: "een docent- of klasgenootweergave toont het werk" — in de dev-preview zonder login bestaat zo'n aparte weergave niet. Veto 1 is daarom vastgesteld op basis van de andere twee voorwaarden (zelf gemaakt, blijft bewaard na volledige reload) plus de zichtbare live browser-preview; dit is expliciet als beperking in het manifest opgenomen, niet verzwegen.

## Tijd

Speelsessie (incl. viewportmatrix, Veto 3-vergelijking, validator-runs): circa 30 minuten wall-clock, 07:33–08:00 (Playwright-tijdstempels).

## Oordeel van de beoordelaar (Opus-rol, 2026-09-02)

De speler heeft gemeten; het oordeel hieronder corrigeert twee punten.

- **Veto 1 Artefact → NIET VASTGESTELD** (was GESLAAGD). "Blijft bewaard" is alleen halverwege bewezen via de browseropslag; bij afronden wist de motor die opslag (`BuilderCanvas.tsx`, `clearSave()` na voltooiing), en "een ander kan het bekijken" is in de preview niet te bewijzen. De standaard eist alle drie. Benodigd bewijs: een proefronde met een testaccount buiten de echte leerlingomgeving, na toestemming, waarin een docent het werk terugvindt.
- **Poort 1 Visueel + Beweging → GESLAAGD, met kanttekening.** Het bewijs is een knop die van uitgeschakeld naar actief vervaagt plus de live-preview die meebeweegt met het typen. Dat voldoet aan de regel zoals die nu is opgeschreven, maar de regel meet óf er beweging is, niet óf die de moeite waard is. Voorstel voor de eigenaar (kwaliteitspoorten.md, Poort 1): "Een knop die van kleur wisselt telt niet als bewijs; er moet een scène, artefact of personage reageren op wat de leerling doet."

**UITKOMST blijft AFGEKEURD** (Poort 2 GEZAKT: één stil introscherm). Zou de intro worden herbouwd, dan blijft Veto 1 open totdat de opslag bij afronden is opgelost (zie Deel B van het plan: werk server-side bewaren).
