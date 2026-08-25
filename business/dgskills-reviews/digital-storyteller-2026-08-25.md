# Missiereview: Digital Storyteller

**Datum:** 2026-08-25
**templateType:** builder-canvas
**Wave:** 21

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7/10

De vier stappen vormen een logische opbouw (idee → structuur → tekst → presentatie) en de config sluit goed aan op de builder-canvas-engine (checklist + tekstprompt + tip per stap).

Bevindingen:
- **(warning)** Presence-based scoring raakt deze config hard: alle vier stappen zijn tekst + checklist zonder verdiepingsvraag (`deepenPrompt`/bonuspunten ontbreken volledig in deze config). Een leerling die vier keer ~40-60 tekens plausibele tekst typt en alle vinkjes aanvinkt haalt 100/100, zonder dat er ooit een substantieel vertakt verhaal is geschreven. Dit is de engine-bevinding, maar deze config benut geen enkel tegenwicht (geen bonusvraag ergens in de vier stappen).
- **(warning)** Contrastrisico van de gedeelde engine (`text-duck-ink/70` voor invoertekst én placeholder) raakt alle vier stappen van deze missie, inclusief de langste vrije-tekstvelden (scène-schrijven: 80+ woorden).
- **(info)** `previewType: 'text-preview'` toont alleen ruwe tekst terug; voor een verhaal met vertakkingen en een flowchart-stap is een tekstuele preview minimaal — de leerling ziet zijn eigen flowchart-beschrijving niet visueel terug, wat het "zie je verhaal groeien"-gevoel van een bouw-missie mist.
- **(info)** Badges en takeaways zijn duidelijk en consistent met de missiedoelen.

## Didactiek — score 6.5/10

De opbouw volgt een herkenbaar schrijfproces (concept → structuur → uitwerking → publicatie) en de instructies zijn concreet met woordentellingen en voorbeelden (bv. "in medias res").

Bevindingen:
- **(warning)** De kernvaardigheid van deze missie — een écht vertakkend verhaal met betekenisvolle keuzes — wordt in stap 2 (flowchart) alleen tekstueel beschreven, nooit gecontroleerd op samenhang met stap 3 (de geschreven scènes). Een leerling kan een flowchart met 2 keuzemomenten en 3 eindes verzinnen die niets te maken heeft met de scènes die hij daarna schrijft; er is geen enkele koppeling tussen stappen.
- **(warning)** `missionGoals.ts`-evidence ("twee keuzemomenten, minstens drie eindes, openingsscène 80+ woorden tweede persoon") is uitsluitend structureel/kwantitatief toetsbaar — precies de eigenschappen die de checklist al zelfrapportage laat zijn zonder inhoudelijke controle op "is dit een echte keuze" (de eigen tip van de missie benoemt dit onderscheid wél, maar toetst het nergens).
- **(info)** De SLO-koppeling (22A, 21B / vso 19A, 18B) is passend voor een creatieve schrijf-/ontwerpopdracht met digitale componentkeuze.
- **(info)** `leerjaar 2 week 3` in de curriculum-plaatsing is consistent met de instroom van dit onderwerp.

## Tech — score 8/10

De config zelf bevat geen technische risico's; ze gebruikt de standaard `BuilderCanvasConfig`-vorm correct (checklistItems met stabiele ids, maxScore 100 consistent met vier stappen × badges).

Bevindingen:
- **(info)** Alle vier registratiebestanden (templateRegistry, slo-kerndoelen-mapping, curriculum, missionGoals) bevatten een consistente `digital-storyteller`-entry; geen dubbele of ontbrekende registratie gevonden.
- **(info)** Engine-bevindingen die deze missie raken (dubbele-klik-afronding, mijlpaal-toast-na-reload, ontbrekend `role="status"` op MilestoneToast) zijn gedeeld gedrag, niet config-specifiek — hier niet herhaald als aparte bevinding, wel meegewogen in de score omdat de leerling ze bij deze missie net zo goed tegenkomt.

---

## Voorstellen

Binnen de whitelist (alleen deze missie's entry in de config-bestanden) is er weinig mechanisch te repareren — de kernbevindingen (geen verdiepingsvraag, geen koppeling flowchart↔scènes) vereisen een inhoudelijke contentwijziging in de config zelf, geen typfout.

**Voorstel 1 — voeg een verdiepingsvraag toe aan stap "scène-schrijven" zodat niet alle score presence-based is:**

Voor (`src/features/missions/templates/builder-canvas/configs/digital-storyteller.ts`, stap `scène-schrijven`):
```ts
checklistItems: [
    { id: 'tweede-persoon', label: 'Het verhaal is geschreven in de tweede persoon (jij/je)' },
    { id: 'beginscene-tekst', label: 'De beginscène is minimaal 80 woorden' },
    { id: 'keuze-opties', label: 'De keuze-opties staan duidelijk aan het einde van elke scène' },
    { id: 'tweede-scene', label: 'Een vervolgscène is uitgewerkt (minimaal 60 woorden)' },
],
textPrompt: 'Schrijf je beginscène en één vervolgscène',
```

Na (illustratief — exacte veldnaam voor bonusvragen hangt af van `BuilderCanvasConfig`; toe te passen als de engine een `deepenPrompt`/bonusveld ondersteunt, wat verificatie in `BuilderCanvas.tsx` vereist vóór toepassing):
```ts
checklistItems: [
    { id: 'tweede-persoon', label: 'Het verhaal is geschreven in de tweede persoon (jij/je)' },
    { id: 'beginscene-tekst', label: 'De beginscène is minimaal 80 woorden' },
    { id: 'keuze-opties', label: 'De keuze-opties staan duidelijk aan het einde van elke scène' },
    { id: 'tweede-scene', label: 'Een vervolgscène is uitgewerkt (minimaal 60 woorden)' },
],
textPrompt: 'Schrijf je beginscène en één vervolgscène',
deepenPrompt: 'Leg uit waarom de keuze die je lezer krijgt een échte keuze is: wat maakt optie A net zo aantrekkelijk als optie B?',
```

Dit voorstel raakt alleen de config-bestand-whitelist, maar vereist bevestiging dat het bonusveld in de engine bestaat — daarom NIET als autoFixable gemarkeerd, wel als expliciet voorstel.

**Voorstel 2 (niet mechanisch, geen snippet):** koppel stap 2 (flowchart) inhoudelijk aan stap 3 (scènes) door in de instructietekst van stap 3 te verwijzen naar de scènenamen uit stap 2 ("Schrijf de beginscène die je in stap 2 'Scène 1' noemde"). Dit is een contentkeuze, geen mechanische fix.

---

## Samenvatting en verdict

De missie is inhoudelijk en structureel prima ontworpen voor het onderwerp, maar mist — net als de meeste builder-canvas-configs zonder verdiepingsvraag — elk inhoudelijk tegenwicht tegen de presence-based scoring van de gedeelde engine. Daarnaast is er geen koppeling tussen de flowchart-stap en de scène-stap, waardoor de kernvaardigheid van de missie (een échte, samenhangende vertakking) nooit getoetst wordt binnen de missie zelf. Geen van de bevindingen is blokkerend voor leerlinggebruik; ze zijn kwaliteitsverbeteringen.

**Verdict: ok** (met aandachtspunten, geen fix-eerst-blokkade).
