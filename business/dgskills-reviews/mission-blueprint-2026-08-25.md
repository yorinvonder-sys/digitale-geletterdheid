# Missiereview: De Blauwdruk (mission-blueprint)

**Datum:** 2026-08-25
**TemplateType:** builder-canvas
**Curriculumplaats:** Leerjaar 1, Periode 4 ("Eindproject")
**SLO:** 22A (VSO: 19A)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7/10

De config zelf introduceert geen eigen UI; de gedeelde builder-canvas-engine bepaalt vormgeving en tokens, dus deze sectie beoordeelt vooral wat de missie-config *aan* de engine doorgeeft en de tekst zelf.

**Bevindingen:**
- **(warning)** Geërfd van de engine: invoertekst en placeholder delen dezelfde `/70`-opacity in `StepInstructionPanel.tsx` — deze missie heeft geen eigen 40-tekens-drempel-config die dat compenseert (`minTextLength` is alleen op stap 4 gezet, op 30). Bij stap 1-3 is dit dus des te merkbaarder omdat leerlingen langere teksten typen zonder duidelijk contrast met de placeholder.
- **(warning)** Geërfd van de engine: mijlpaal-toast kan na snel herladen blijven hangen (showMilestone-persistentie). Deze missie heeft 4 stappen, dus het venster waarin dit zichtbaar is, is klein maar niet nul.
- **(info)** `introFeatures` bevat 4 losse bullets naast `introDescription` — consistent met andere builder-canvas-missies, geen afwijking.
- **(info)** Geen eigen kleur- of tokenkeuzes in de config (`badges` gebruiken de standaard duck-tokens `#e1ff01`/`#202023`/`#ff3c21`) — consistent met het palet.

## Didactiek — score 8/10

**Bevindingen:**
- **(pass)** Heldere leerdoel-opbouw: project beschrijven → taken opsplitsen → volgorde/afhankelijkheden → cloudopslag. Elke stap bouwt logisch op de vorige.
- **(pass)** Reflectievragen zijn functioneel en sluiten aan bij de stof (definitie van Done, AI-als-copiloot, afhankelijkheden, deellinks) — geen losstaande trivia.
- **(pass)** Koppeling met eerdere periode-stof is expliciet gemaakt: checklist-item "dg-link" (P1/P2/P3-vaardigheid) en stap 4 herhaalt Cloud Commander-vaardigheden (OneDrive-map, bestandsnaamconventie, deellink) — sterke verticale samenhang in het curriculum.
- **(warning)** Zoals de engine-bevinding aangeeft: scoring is presence-based. Voor déze missie is dat een reëel risico, want stap 2 vraagt "minimaal 8 concrete taken" en stap 3 vraagt "minimaal 3 afhankelijkheden" — beide zijn telbare eisen die de checklist zelf niet kan verifiëren (een leerling kan het vinkje aanzetten zonder daadwerkelijk 8 taken te hebben genoteerd). De tekstcheck (`isMeaningfulAnswer`, ≥40 tekens) filtert alleen evident geramte tekst, niet onvolledigheid.
- **(info)** `missionGoals.ts`-entry (`steps-complete`, min 4) sluit aan bij de 4 stappen van de config — geen mismatch.
- **(info)** `minTextLength: 30` op stap 4 (OneDrive-link) is logisch: een gedeelde link is vaak korter dan een vrije-tekstantwoord van 40 tekens; een te hoge drempel zou een geldig antwoord kunnen blokkeren. Geen bevinding, ter documentatie.

## Tech — score 8/10

**Bevindingen:**
- **(blocking, geërfd)** Dubbelklik-risico op de afrondknop (`CompletionScreen.tsx`/`BuilderCanvas.handleComplete`) geldt onverkort voor deze missie — geen missie-specifieke mitigatie aanwezig of nodig, want de config bevat geen eigen afrondlogica.
- **(pass)** `maxScore: 100` en de badge-drempels (0/25/50/70/90) zijn intern consistent en dekken het hele bereik zonder gaten.
- **(pass)** Alle 4 reflectievragen hebben `bonusPoints: 5` en `correctIndex` binnen de opties-array — geen out-of-range index gevonden.
- **(pass)** `templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts` en `missionGoals.ts` zijn onderling consistent: `missionId: 'mission-blueprint'` matcht overal, `enableChat: true` + `chatRoleId: 'mission-blueprint'` staat zowel in de config als in de registry-entry.
- **(info)** `chatRoleId: 'mission-blueprint'` verwijst naar een agent-rol-entry (`src/config/agents/year1.tsx:3000`) — aanwezig, geen dode referentie.

---

## Voorstellen

Geen mechanische auto-fixes binnen de whitelist geïdentificeerd voor deze missie: de config bevat geen tokens, timers of index-fouten die zonder engine-wijziging op te lossen zijn. De drie substantiële bevindingen (dubbelklik-afronding, presence-based scoring, mijlpaal-toast-persistentie) zitten in de gedeelde `BuilderCanvas.tsx`-engine en `CompletionScreen.tsx`, niet in `mission-blueprint.ts` — een fix daar raakt alle 19 builder-canvas-missies tegelijk en hoort dus in de engine-fixronde, niet in een missie-specifieke patch.

Enige optionele, niet-blokkerende suggestie binnen de missie-config zelf (géén whitelist-fix, want tekstueel):

```diff
- checklistItems: [
-     { id: 'acht-taken', label: 'Ik heb minimaal 8 concrete taken opgeschreven' },
+ checklistItems: [
+     { id: 'acht-taken', label: 'Ik heb minimaal 8 concrete taken opgeschreven (tel ze na!)' },
```
Kleine tekstuele nadruk die de zelfrapportage-zwakte van de checklist (zie Didactiek, warning) iets tegengaat — verandert geen logica, is optioneel en niet vereist voor ship.

---

## Samenvatting

**mission-blueprint** is een didactisch sterk opgebouwde missie met goede verticale samenhang naar eerdere periodes (Cloud Commander-vaardigheden expliciet herhaald in stap 4). De belangrijkste risico's zijn allemaal geërfd van de gedeelde builder-canvas-engine (dubbelklik bij afronden, presence-based scoring, mijlpaal-toast-persistentie) en zijn al vastgesteld op engineniveau — deze missie zelf voegt geen nieuwe risico's toe en heeft geen eigen configuratiefouten. De enige missie-specifieke kanttekening is dat de telbare eisen in stap 2 en 3 (8 taken, 3 afhankelijkheden) extra gevoelig zijn voor de presence-based-scoring-zwakte, omdat de checklist die aantallen niet kan verifiëren.

**Verdict: ok** — geen missie-specifieke blockers; de blocking bevinding (dubbelklik-afronding) is een engine-brede kwestie die in de gezamenlijke engine-fixronde hoort, niet als losse missie-patch.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
